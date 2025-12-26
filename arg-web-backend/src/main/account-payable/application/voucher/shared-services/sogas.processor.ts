import {
  Processor,
  Process,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
} from "@nestjs/bull";
import pLimit from "p-limit";
import { Job } from "bullmq";
import { redis_connection } from "@src/shared/queue/bullmq-connection";
import { WebsocketService } from "@src/shared/websocket/websocket.service";
import { HeaderDto, DetailDto } from "../dto/voucher.dto";
import { VoucherSharedService } from "./voucher.shared.service";
import { VoucherDetailValidationService } from "./voucher-detail.shared.service";
import { VoucherAppService } from "@src/main/account-payable/domain/services/voucher/voucher.service";
import { QUEUE_NAMES } from "@src/shared/constants/constant";
import { VOUCHER_STATUS_CODES } from "@src/shared/constants/status-map";
import { AppLogger } from "@src/shared/logger/logger.service";
import {
  csvSogasHeaderMapping,
  MAX_PARALLEL_GROUP_PROCESSING,
  csvSogasDetailMapping,
} from "@src/shared/constants/upload-file-constant";
import { logUploadTotalTimeAndCleanup } from "@src/shared/utils/process-duration-tracker";
import IORedis from "ioredis";
import { OwnerVendorReferenceRepository } from "@src/main/account-payable/data/repositories/owner-vendor-reference.repository";
import { VendorRepository } from "@src/main/account-payable/data/repositories/vendor.repository";
import { convertMMDDYYYYtoMMDDYY } from "@src/shared/utils/format-date";
import { SogasSubType } from "@src/shared/constants/strategy-type.enum";
import {
  SogasUnprocessedItem,
  UPLOAD_ERROR_CODES,
  UPLOAD_FIELD_NAMES,
  createSogasUnprocessedItem,
} from "@src/shared/utils/upload-types";
import { UserContext } from "@src/shared/utils/user-context";
import { AuthUser } from "@src/auth/domain/entities/auth-user.entity";
import { safeTruncate, parseCommaSeparatedNumber } from "@src/shared/utils/xlsx.utils";

@Processor(QUEUE_NAMES.SOGAS)
export class SogasProcessor {
  private readonly logger = new AppLogger(SogasProcessor.name);
  private readonly redis = new IORedis(redis_connection);

  constructor(
    private readonly voucherSharedService: VoucherSharedService,
    private readonly voucherDetailSharedService: VoucherDetailValidationService,
    private readonly voucherAppService: VoucherAppService,
    private readonly websocketService: WebsocketService,
    private readonly ownerVendorReferenceRepository: OwnerVendorReferenceRepository,
    private readonly vendorRepository: VendorRepository
  ) {
    this.logger.log(
      `SogasProcessor initialized, waiting on queue: ${QUEUE_NAMES.SOGAS}`
    );
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(`Queue sogas job ${job.id} is now active`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job, _result: any) {
    this.logger.log(`Queue sogas job ${job.id} completed successfully`);
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.error(
      `Job ${job.id} failed with error: ${error.message}`,
      error.stack
    );
  }

  @Process("*")
  async handle(job: Job) {
    const {
      groupedRecords: batch,
      uploadId,
      batchIndex,
      userId,
      totalBatches,
      subType,
    } = job.data;

    this.logger.log(
      `Processing batch for uploadId: ${uploadId} with ${batch.length} invoices`
    );

    this.logger.log(`Starting processing batchIndex ${batchIndex}...`);

    // Create an AuthUser object to bind in context
    const authUser: AuthUser = new AuthUser(
      "", // email - not available in job context
      "", // userId - not available in job context
      "", // userName - not available in job context
      "", // userDisplayName - not available in job context
      userId // userInitails
    );


    // Run the entire batch inside UserContext
    return UserContext.run(authUser, async () => {
      // Use p-limit for controlled concurrency inside the batch
      const limit = pLimit(MAX_PARALLEL_GROUP_PROCESSING);
      const batchSummary = await Promise.all(
        batch.map((group) => limit(() => this.processGroup(group, subType)))
      );

      await this.storeBatchSummaryInRedis(uploadId, batchIndex, batchSummary);
      await this.checkAndEmitFinalSummary(uploadId, totalBatches);

      return { uploadId, summary: batchSummary };
    });
  }

  private async processGroup(group: any, subType: string) {
    const headerRow = group.header;
    // Ensure ownerNo is set for lookup, regardless of mapping

    headerRow.ownerNo = headerRow.OWNER_NUMBER;
    let vendorNo: number | undefined;
    let vendorData: any = null;
    const warnings: string[] = [];

    // Use only for lookup, do not save to DB
    const ownerNo = headerRow.ownerNo;
    console.log(ownerNo, "ownwer no ale ");
    if (ownerNo) {
      const ownerRef =
        await this.ownerVendorReferenceRepository.findActiveByOwnerNo(
          Number(ownerNo)
        );
      if (ownerRef) {
        vendorNo = ownerRef.vendorNo;
        // Fetch the vendor record from the VendorRepository
        vendorData = await this.vendorRepository.findOne(
          vendorNo,
          headerRow.companyNo
        );
        console.log(vendorData, "data here ");
        if (!vendorData) {
          warnings.push(
            `VendorNo ${vendorNo} not found in Vendor table for company ${headerRow.companyNo}`
          );
        }
      } else {
        warnings.push(
          `OwnerNo ${ownerNo} not found in APSGACH (OwnerVendorReference)`
        );
      }
    }

    // Map header and details using vendorData
    // Vendor fields are populated here after lookup, not from the CSV mapping
    let holdCode: string | undefined = undefined;
    let holdDesc: string | undefined = undefined;
    let vendorPaymentTerms: string | number | undefined = undefined;
    if (vendorData) {
      holdCode = vendorData.vendorHoldPaymentsVend;
      if (holdCode === "A") holdDesc = "ON HOLD FOR ACH";
      else if (holdCode === "H") holdDesc = "VENDOR ON HOLD";
      vendorPaymentTerms = vendorData.vendorApTermsCode;
    }
    // Do NOT include ownerNo in headerDTO (for DB save)
    const headerDTO = {
      ...this.mapHeader(headerRow),
      vendorNo,
      vendorName: (vendorData?.vendorName || "").trim().substring(0, 30),
      vendorAdd1: (vendorData?.vendorAdd1 || "").trim().substring(0, 30),
      vendorAdd2: (vendorData?.vendorAdd2 || "").trim().substring(0, 30),
      vendorAdd3: (vendorData?.vendorAdd3 || "").trim().substring(0, 30),
      vendorAdd4: (vendorData?.vendorAdd4 || "").trim().substring(0, 30),
      holdCode,
      holdDesc: (holdDesc || "").trim().substring(0, 25),
      vendorPaymentTerms,
      // Add more vendor fields as needed
    };
    delete headerDTO.ownerNo; // ensure not saved
    // For SOGAS, if group.details is empty, use [group.header] as details
    const details =
      group.details && group.details.length > 0
        ? group.details
        : [group.header];
    const detailDTOs = details.map(() => ({
      ...this.mapDetail(headerRow, subType),
      vendorNo,
      vendorName: (vendorData?.vendorName || "").trim().substring(0, 30),
      vendorAdd1: (vendorData?.vendorAdd1 || "").trim().substring(0, 30),
      vendorAdd2: (vendorData?.vendorAdd2 || "").trim().substring(0, 30),
      vendorAdd3: (vendorData?.vendorAdd3 || "").trim().substring(0, 30),
      vendorAdd4: (vendorData?.vendorAdd4 || "").trim().substring(0, 30),
      // Add more vendor fields as needed
    }));

    this.logger.log(
      `Invoice ${headerDTO.invoiceNo}: Starting validation & save`
    );

    // Validate header + details
    const headerResult = (await this.validateHeader(headerDTO, ownerNo)) as {
      errors: string[];
      warnings?: string[];
      voucherHeaderData: any | null;
      unprocessedItems?: SogasUnprocessedItem[];
    };
    const detailResult = await this.validateDetails(
      detailDTOs,
      headerResult.voucherHeaderData
    );

    // Merge warnings into headerValidation
    if (warnings.length) {
      if (!headerResult.warnings) headerResult.warnings = [];
      headerResult.warnings.push(...warnings);
    }

    // SOGAS subtype validation for ATCKNM (invoiceAmount)
    const invoiceAmount = Number(headerDTO.invoiceAmount);
    if (subType === "REGULAR" && invoiceAmount < 0) {
      headerResult.errors.push(
        "Invoice amount (ATCKNM) must be positive for REGULAR SOGAS."
      );
    }

    // Compute status
    let status = this.computeStatus(headerResult, detailResult);
    const finalStatus = VOUCHER_STATUS_CODES[status];
    let dbError: string | null = null;

    try {
      await this.saveVoucherData(
        headerResult.voucherHeaderData,
        detailResult.data,
        headerDTO.invoiceNo,
        finalStatus
      );
    } catch (err) {
      const error = err as Error;
      status = VOUCHER_STATUS_CODES.E;
      dbError = error.message;
      this.logger.error(
        `DB save failed for invoice ${headerDTO.invoiceNo}: ${error.message}`
      );
    }

    return {
      invoiceNo: headerDTO.invoiceNo,
      invoiceAmount: headerDTO.invoiceAmount,
      status,
      headerValidation: {
        errors: headerResult.errors,
      },
      detailValidation: {
        errors: detailResult.errors,
        warnings: detailResult.warnings,
      },
      dbError,
      // Store unprocessedItems separately for WebSocket service to collect
      _unprocessedItems: headerResult.unprocessedItems,
    };
  }

  // ---------------- VALIDATION METHODS ----------------
  private async validateHeader(
    headerDTO: HeaderDto,
    ownerNo: string
  ): Promise<{
    errors: string[];
    warnings?: string[];
    voucherHeaderData: any | null;
    unprocessedItems?: SogasUnprocessedItem[];
  }> {
    let result: {
      newDueDate: number;
      newDiscountDueDate: number;
      foundVendor: any;
      errors: string[];
      unprocessedItems: SogasUnprocessedItem[];
    } = {
      newDueDate: 0,
      newDiscountDueDate: 0,
      foundVendor: null,
      errors: [],
      unprocessedItems: [],
    };

    try {
      const output =
        await this.voucherSharedService.headerValidation(headerDTO);
      if ("errors" in output && "data" in output) {
        // ProcessorErrors case (for FLEXI/SOGAS)
        result.errors = output.errors.map((e) => e.message);
        result.newDueDate = output.data.newDueDate;
        result.newDiscountDueDate = output.data.newDiscountDueDate;
        result.foundVendor = output.data.foundVendor;

        // Check if vendor was not found
        if (!output.data.foundVendor) {
          result.unprocessedItems.push(
            createSogasUnprocessedItem(
              ownerNo,
              headerDTO.invoiceNo,
              UPLOAD_ERROR_CODES.VENDOR_NOT_FOUND,
              undefined,
              UPLOAD_FIELD_NAMES.OWNER_NO
            )
          );
        }
      } else if (
        "newDueDate" in output &&
        "newDiscountDueDate" in output &&
        "foundVendor" in output
      ) {
        // FLEXI/SOGAS success case
        result.newDueDate = output.newDueDate;
        result.newDiscountDueDate = output.newDiscountDueDate;
        result.foundVendor = output.foundVendor;
      }

      // Additional validation: Check if vendor exists
      if (!result.foundVendor) {
        result.errors.push(
          `Vendor not found for ownerNo ${ownerNo} and company ${headerDTO.companyNo}`
        );
        result.unprocessedItems.push(
          createSogasUnprocessedItem(
            ownerNo,
            headerDTO.invoiceNo,
            UPLOAD_ERROR_CODES.VENDOR_NOT_FOUND,
            undefined,
            UPLOAD_FIELD_NAMES.OWNER_NO
          )
        );
      }

      this.logger.log(
        `Header validation for ${headerDTO.invoiceNo}: ${JSON.stringify(
          output
        )}`
      );
    } catch (err) {
      const error = err as Error;
      result.errors.push(error.message);

      // Add to unprocessed items if vendor/invoice validation failed
      if (
        error.message.includes("vendor") ||
        error.message.includes("Vendor")
      ) {
        result.unprocessedItems.push(
          createSogasUnprocessedItem(
            ownerNo,
            headerDTO.invoiceNo,
            UPLOAD_ERROR_CODES.VENDOR_NOT_FOUND,
            undefined,
            UPLOAD_FIELD_NAMES.OWNER_NO
          )
        );
      }

      this.logger.error(
        `Header validation failed for ${headerDTO.invoiceNo}: ${error.message}`
      );
    }

    return {
      errors: result.errors,
      warnings: [],
      unprocessedItems: result.unprocessedItems,
      voucherHeaderData: this.voucherSharedService.buildVoucherHeaderData({
        ...headerDTO,
        dueDate: result.newDueDate,
        discountDueDate: result.newDiscountDueDate,
        foundVendor: result.foundVendor,
      }),
    };
  }

  private async validateDetails(
    detailDTOs: DetailDto[],
    voucherHeaderData: any
  ) {
    let result: {
      data: any[];
      errors: string[];
      warnings: string[];
    } = {
      data: detailDTOs,
      errors: [],
      warnings: [],
    };
    try {
      const output = await this.voucherDetailSharedService.validateDetail(
        detailDTOs,
        voucherHeaderData
      );
      if ("error" in output && "errors" in output) {
        result.errors = (output.errors ?? []).flatMap((errObj) =>
          errObj.errors.map((e) => `${e.field}: ${e.message}`)
        );
        if ("data" in output && output.data) {
          result.data = output.data;
        }
        if ("warnings" in output && Array.isArray(output.warnings)) {
          result.warnings = output.warnings.flatMap((wObj) =>
            wObj.warnings.map((w) => `${w.field}: ${w.message}`)
          );
        }
      } else if ("data" in output) {
        result.data = output.data;
        if ("warnings" in output && Array.isArray(output.warnings)) {
          result.warnings = output.warnings.flatMap((wObj) =>
            wObj.warnings.map((w) => `${w.field}: ${w.message}`)
          );
        }
      }
      this.logger.log(`Detail validation output: ${JSON.stringify(output)}`);
    } catch (err) {
      const error = err as Error;
      result.errors.push(error.message);
      this.logger.error(`Detail validation failed: ${error.message}`);
    }
    return result;
  }

  // ---------------- DB SAVE METHOD ----------------
  private async saveVoucherData(
    voucherHeaderData: any,
    details: any,
    invoiceNo: string,
    finalStatus: string
  ) {
    const headerRecord = await this.voucherAppService.createVoucherHeader({
      ...voucherHeaderData,
      status: finalStatus,
    });
    this.logger.log(
      `Saved header for invoice ${invoiceNo}: ${JSON.stringify(headerRecord)}`
    );
    details.forEach((d) => {
      d.status = finalStatus;
    });

    const detailRecords =
      await this.voucherAppService.createVoucherDetail(details);
    this.logger.log(
      `Saved ${detailRecords.length} details for invoice ${invoiceNo}`
    );
  }

  // ---------------- REDIS & FINAL SUMMARY ----------------
  private async storeBatchSummaryInRedis(
    uploadId: string,
    batchIndex: number,
    summary: any
  ) {
    const redisKey = `upload:${uploadId}:summaries`;
    await this.redis.hset(redisKey, `${batchIndex}`, JSON.stringify(summary));
    this.logger.log(`Stored summary for batch ${batchIndex} under ${redisKey}`);
  }

  private async checkAndEmitFinalSummary(
    uploadId: string,
    totalBatches: number
  ) {
    const redisKey = `upload:${uploadId}:summaries`;
    const completedCount = await this.redis.hlen(redisKey);
    this.logger.log(
      `Completed batches for ${uploadId}: ${completedCount}/${totalBatches}`
    );

    if (completedCount >= totalBatches) {
      await logUploadTotalTimeAndCleanup(this.redis, uploadId, this.logger);
      const summariesObj = await this.redis.hgetall(redisKey);
      await this.websocketService.emitFinalSummaryToWebSocket(
        uploadId,
        summariesObj
      );
      await this.redis.del(redisKey);
      this.logger.log(`Cleaned up Redis key ${redisKey}`);
    }
  }

  // ---------------- STATUS & MAPPERS ----------------
  private computeStatus(
    header: { errors: string[]; warnings?: string[] },
    detail: { errors: string[]; warnings: string[] }
  ): string {
    if (header.errors.length || detail.errors.length)
      return VOUCHER_STATUS_CODES.E;
    if (detail.warnings.length) return VOUCHER_STATUS_CODES.W;
    return VOUCHER_STATUS_CODES.S;
  }

  private mapHeader(headerRow: Record<string, any>): any {
    const checkNumber = String(headerRow[csvSogasHeaderMapping.invoiceNo] || "").trim();
    
    return {
      ownerNo: headerRow[csvSogasHeaderMapping.ownerNo], // for lookup only
      invoiceNo: safeTruncate(checkNumber, 20),
      invoiceDate: convertMMDDYYYYtoMMDDYY(
        headerRow[csvSogasHeaderMapping.invoiceDate]
      ),
      invoiceAmount: parseCommaSeparatedNumber(headerRow[csvSogasHeaderMapping.invoiceAmount]),
      apGlNo: headerRow[csvSogasHeaderMapping.apGlNo],
      entryNo: headerRow[csvSogasHeaderMapping.entryNo],
      companyNo: headerRow[csvSogasHeaderMapping.companyNo],
      invoiceDesc: safeTruncate(headerRow[csvSogasHeaderMapping.invoiceNo], 25),
      bankGl: headerRow[csvSogasHeaderMapping.bankGl],
      dueDate: convertMMDDYYYYtoMMDDYY(
        headerRow[csvSogasHeaderMapping.dueDate]
      ),
      processType: csvSogasHeaderMapping.processType,
      fillerTwo: safeTruncate(checkNumber, 10), // Set ATFIL2 to check number explicitly (max 10 chars)
    };
  }

 

  private mapDetail(headerRow: Record<string, any>, subType: string): any {
    // Normalize subType to lowercase and use enum for comparison
    const normalizedSubType = subType?.toLowerCase();

    return {
      lineGlNo:
        normalizedSubType === SogasSubType.REGULAR ? 12010008 : 12010009,
      lineDesc: safeTruncate(headerRow[csvSogasDetailMapping.lineDesc], 25),
      lineAmount: parseCommaSeparatedNumber(headerRow[csvSogasDetailMapping.lineAmount]),
      productAmount: parseCommaSeparatedNumber(headerRow[csvSogasDetailMapping.productAmount]),
      freightAmount: 0, // SOGAS: Freight amount is always 0 (entire amount is product)
      entrySequence: headerRow[csvSogasDetailMapping.entrySequence],
      entryNo: headerRow[csvSogasDetailMapping.entryNo],
      companyNo: headerRow[csvSogasDetailMapping.companyNo],
      openClosed: "C", // Set ATCLCD to 'C' for all SOGAS details
      // vendorNo and vendor fields are set after lookup, not from mapping
    };
  }
}
