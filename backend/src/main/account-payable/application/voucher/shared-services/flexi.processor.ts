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
import { VoucherDetailValidation } from "../validations/voucher-detail.validation";
import { VoucherAppService } from "@src/main/account-payable/domain/services/voucher/voucher.service";
import { QUEUE_NAMES, PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";
import { VOUCHER_STATUS_CODES } from "@src/shared/constants/status-map";
import { AppLogger } from "@src/shared/logger/logger.service";
import {
  csvFlexiHeaderMapping,
  MAX_PARALLEL_GROUP_PROCESSING,
  csvFlexiDetailMapping,
} from "@src/shared/constants/upload-file-constant";
import { logUploadTotalTimeAndCleanup } from "@src/shared/utils/process-duration-tracker";
import IORedis from "ioredis";
import { convertMMDDYYYYtoMMDDYY } from "@src/shared/utils/format-date";
import {
  FlexiUnprocessedItem,
  UPLOAD_ERROR_CODES,
  UPLOAD_FIELD_NAMES,
  createFlexiUnprocessedItem,
} from "@src/shared/utils/upload-types";
import { UserContext } from "@src/shared/utils/user-context";
import { AuthUser } from "@src/auth/domain/entities/auth-user.entity";
import { safeTruncate } from "@src/shared/utils/xlsx.utils";

@Processor(QUEUE_NAMES.FLEXI)
export class FlexiProcessor {
  private readonly logger = new AppLogger(FlexiProcessor.name);
  private readonly redis = new IORedis(redis_connection);

  constructor(
    private readonly voucherSharedService: VoucherSharedService,
    private readonly voucherDetailSharedService: VoucherDetailValidationService,
    private readonly voucherDetailValidation: VoucherDetailValidation,
    private readonly voucherAppService: VoucherAppService,
    private readonly websocketService: WebsocketService
  ) {
    this.logger.log(
      `FlexiProcessor initialized, waiting on queue: ${QUEUE_NAMES.FLEXI}`
    );
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(`Queue flexi job ${job.id} is now active`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job, _result: any) {
    this.logger.log(`Queue flexi job ${job.id} completed successfully`);
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
        batch.map((group) => limit(() => this.processGroup(group)))
      );

      await this.storeBatchSummaryInRedis(uploadId, batchIndex, batchSummary);
      await this.checkAndEmitFinalSummary(uploadId, totalBatches);

      return { uploadId, summary: batchSummary };
    });
  }

  private async processGroup(group: any) {
    const headerDTO = this.mapHeader(group.header);
    const detailDTOs = group.details.map((detail) => this.mapDetail(detail));
    this.logger.log(
      `Invoice ${headerDTO.invoiceNo}: Starting validation & save`
    );

    // Validate header + details
    const headerResult = await this.validateHeader(headerDTO);
    const detailResult = await this.validateDetails(
      detailDTOs,
      headerResult.voucherHeaderData
    );

    // Compute status
    let status = this.computeStatus(headerResult, detailResult);
    let finalStatus = VOUCHER_STATUS_CODES[status];
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
      // Override status to 'E' for database errors (higher priority than warnings)
      finalStatus = VOUCHER_STATUS_CODES.E;
      dbError = error.message;
      this.logger.error(
        `DB save failed for invoice ${headerDTO.invoiceNo}: ${error.message}`
      );

      // Handle database error: update records and add to unprocessed items
      await this.handleDatabaseError(
        dbError,
        finalStatus,
        headerResult,
        detailResult,
        headerDTO
      );
    }

    return {
      invoiceNo: headerDTO.invoiceNo,
      invoiceAmount: headerDTO.invoiceAmount,
      status: finalStatus,
      headerValidation: {
        errors: headerResult.errors,
        warnings: headerResult.warnings,
      },
      detailValidation: {
        errors: detailResult.errors,
        warnings: detailResult.warnings,
      },
      dbError,
      // Store unprocessedItems separately for WebSocket service to collect
      _unprocessedItems: headerResult._unprocessedItems || [],
    };
  }

  // ---------------- VALIDATION METHODS ----------------

  private async validateHeader(headerDTO: HeaderDto) {
    // Start with a result object that will be built upon
    const result: {
      newDueDate: number;
      newDiscountDueDate: number;
      foundVendor: any;
      errors: string[];
      warnings: string[];
      unprocessedItems: FlexiUnprocessedItem[];
    } = {
      newDueDate: 0,
      newDiscountDueDate: 0,
      foundVendor: null,
      errors: [],
      warnings: [],
      unprocessedItems: [],
    };

    try {
      // Perform validation steps that might fail...
      const output =
        await this.voucherSharedService.headerValidation(headerDTO);

      if ("errors" in output && "data" in output) {
        // ProcessorErrors case (for FLEXI)
        result.errors = output.errors.map((e) => e.message);
        result.newDueDate = output.data.newDueDate;
        result.newDiscountDueDate = output.data.newDiscountDueDate;
        result.foundVendor = output.data.foundVendor;

        // Handle warnings if they exist
        if ("warnings" in output && Array.isArray(output.warnings)) {
          result.warnings = output.warnings.map(
            (w: any) => `${w.field}: ${w.message}`
          );
        }

        // Note: Vendor validation will be handled at the end to avoid duplicates
      } else if (
        "newDueDate" in output &&
        "newDiscountDueDate" in output &&
        "foundVendor" in output
      ) {
        // FLEXI success case
        result.newDueDate = output.newDueDate;
        result.newDiscountDueDate = output.newDiscountDueDate;
        result.foundVendor = output.foundVendor;

        // Handle warnings if they exist
        if ("warnings" in output && Array.isArray(output.warnings)) {
          result.warnings = output.warnings.map(
            (w: any) => `${w.field}: ${w.message}`
          );
        }
      }

      // Note: Vendor validation will be handled at the end to avoid duplicates

      if (result.foundVendor) {
        headerDTO.holdCode = result.foundVendor.vendorHoldPaymentsVend;
      }

      this.logger.log(
        `Header validation for ${headerDTO.invoiceNo}: ${JSON.stringify(output)}`
      );
    } catch (err) {
      const error = err as Error;
      // Add the error instead of replacing the result object
      result.errors.push(error.message);

      // Note: Vendor validation will be handled at the end to avoid duplicates

      this.logger.error(
        `Header validation failed for ${headerDTO.invoiceNo}: ${error.message}`
      );
    }

    // Vendor validation
    if (!result.foundVendor) {
      result.errors.push(
        `Vendor ${headerDTO.vendorNo} not found for company ${headerDTO.companyNo}`
      );
      result.unprocessedItems.push(
        createFlexiUnprocessedItem(
          headerDTO.vendorNo,
          headerDTO.invoiceNo,
          UPLOAD_ERROR_CODES.VENDOR_NOT_FOUND,
          `WE DIDN'T FIND ANY VENDOR WITH ${headerDTO.vendorNo} AND INVOICE NO ${headerDTO.invoiceNo}`,
          UPLOAD_FIELD_NAMES.VENDOR_NO
        )
      );
    }

    return {
      errors: result.errors,
      warnings: result.warnings,
      _unprocessedItems: result.unprocessedItems,
      voucherHeaderData: this.voucherSharedService.buildVoucherHeaderData({
        ...headerDTO,
        dueDate: result.newDueDate,
        discountDueDate: result.newDiscountDueDate,
        foundVendor: result.foundVendor, // Always pass the vendor
      }),
    };
  }

  private async validateDetails(
    detailDTOs: DetailDto[],
    voucherHeaderData: any
  ) {
    const result: {
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
        if ("data" in output) {
          result.data = ((output as any).data ?? result.data) as any[];
        }
        if (
          (output as any).warnings &&
          Array.isArray((output as any).warnings)
        ) {
          result.warnings = (output as any).warnings.flatMap((wObj: any) =>
            wObj.warnings.map((w: any) => `${w.field}: ${w.message}`)
          );
        }
      } else if ("data" in output) {
        result.data = ((output as any).data ?? result.data) as any[];
        if (
          (output as any).warnings &&
          Array.isArray((output as any).warnings)
        ) {
          result.warnings = (output as any).warnings.flatMap((wObj: any) =>
            wObj.warnings.map((w: any) => `${w.field}: ${w.message}`)
          );
        }
      }

      this.logger.log(`Detail validation output: ${JSON.stringify(output)}`);
    } catch (err) {
      const error = err as Error;
      result.errors.push(error.message);
      this.logger.error(`Detail validation failed: ${error.message}`);

      // Always build detail data manually when validation fails
      this.logger.warn(
        `Building detail data manually due to validation failure`
      );
      result.data = detailDTOs.map((detail, index) => {
        // Calculate entry sequence
        const newEntrySequence = this.voucherDetailValidation.getEntrySequence(
          detail.entrySequence
            ? parseInt(String(detail.entrySequence))
            : index + 1
        );

        return this.voucherDetailSharedService.buildVoucherDetailData(
          detail,
          voucherHeaderData,
          newEntrySequence
        );
      });
    }

    this.logger.log(
      `Final detail validation result: ${JSON.stringify(result)}`
    );
    return result;
  }

  // ---------------- DB SAVE METHOD ----------------
  private async saveVoucherData(
    voucherHeaderData: any,
    details: any,
    invoiceNo: string,
    finalStatus: string
  ) {
    // Save header first
    try {
      const headerRecord =
        await this.voucherAppService.createOrUpdateVoucherHeader({
          ...voucherHeaderData,
          status: finalStatus,
        });
      this.logger.log(
        `Saved header for invoice ${invoiceNo}: ${JSON.stringify(headerRecord)}`
      );
    } catch (error) {
      const err = error as Error;
      throw new Error(`HEADER_SAVE_ERROR: ${err.message}`);
    }

    // Update detail status and save details
    try {
      details.forEach((d) => {
        d.status = finalStatus;
      });

      const detailRecords =
        await this.voucherAppService.createOrUpdateVoucherDetail(details);
      this.logger.log(
        `Saved ${detailRecords.length} details for invoice ${invoiceNo}`
      );
    } catch (error) {
      const err = error as Error;
      throw new Error(`DETAIL_SAVE_ERROR: ${err.message}`);
    }
  }

  // ---------------- DATABASE ERROR HANDLING ----------------
  private async handleDatabaseError(
    dbError: string,
    finalStatus: string,
    headerResult: any,
    detailResult: any,
    headerDTO: HeaderDto
  ) {
    // Step 1: update records with finalStatus
    await this.updateVoucherStatus(
      headerResult.voucherHeaderData,
      detailResult.data,
      headerDTO.invoiceNo,
      finalStatus
    );

    // Step 2: Classify error
    const { errorMessage, fieldName } = this.classifyDatabaseError(dbError);

    // Step 3: Create unprocessed item
    const dbUnprocessedItem = this.buildDbUnprocessedItem(
      headerDTO,
      errorMessage,
      fieldName
    );

    // Step 4: Merge into headerResult
    this.mergeUnprocessedItems(headerResult, dbUnprocessedItem);
  }

  /**
   * Try to update DB record with given status
   */
  private async updateVoucherStatus(
    voucherHeaderData: any,
    detailData: any,
    invoiceNo: string,
    status: string
  ): Promise<void> {
    try {
      await this.saveVoucherData(
        voucherHeaderData,
        detailData,
        invoiceNo,
        status
      );
      this.logger.log(
        `Updated records to ${status} status for invoice ${invoiceNo}`
      );
    } catch (err) {
      this.logger.error(
        `Failed to update records to ${status} status for invoice ${invoiceNo}: ${
          (err as Error).message
        }`
      );
    }
  }

  /**
   * Classify DB error type and return structured result
   */
  private classifyDatabaseError(errorMsg: string): {
    errorMessage: string;
    fieldName: string;
  } {
    if (errorMsg.startsWith("HEADER_SAVE_ERROR:")) {
      const originalError = errorMsg.replace("HEADER_SAVE_ERROR: ", "");
      return {
        errorMessage: `Header save failed: ${originalError}`,
        fieldName: UPLOAD_FIELD_NAMES.VOUCHER_HEADER,
      };
    }

    if (errorMsg.startsWith("DETAIL_SAVE_ERROR:")) {
      const originalError = errorMsg.replace("DETAIL_SAVE_ERROR: ", "");
      return {
        errorMessage: `Detail save failed: ${originalError}`,
        fieldName: UPLOAD_FIELD_NAMES.VOUCHER_DETAIL,
      };
    }

    return {
      errorMessage: `Database save failed: ${errorMsg}`,
      fieldName: UPLOAD_FIELD_NAMES.VALIDATION,
    };
  }

  /**
   * Build unprocessed item for DB error
   */
  private buildDbUnprocessedItem(
    headerDTO: HeaderDto,
    errorMessage: string,
    fieldName: string
  ) {
    return createFlexiUnprocessedItem(
      headerDTO.vendorNo,
      headerDTO.invoiceNo,
      UPLOAD_ERROR_CODES.DATABASE_ERROR,
      errorMessage,
      fieldName as any
    );
  }

  /**
   * Merge new unprocessed item into headerResult
   */
  private mergeUnprocessedItems(headerResult: any, newItem: any) {
    headerResult._unprocessedItems = [
      ...(headerResult._unprocessedItems || []),
      newItem,
    ];
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
    header: { errors: string[]; warnings: string[] },
    detail: { errors: string[]; warnings: string[] }
  ): string {
    // Priority: Errors > Warnings > Success
    // Note: Database errors will override this status in the catch block
    if (header.errors.length || detail.errors.length)
      return VOUCHER_STATUS_CODES.E;
    if (header.warnings.length || detail.warnings.length)
      return VOUCHER_STATUS_CODES.W;
    return VOUCHER_STATUS_CODES.S;
  }

  private mapHeader(headerRow: Record<string, any>): HeaderDto {
    return {
      entryNo: headerRow[csvFlexiHeaderMapping.entryNo],
      companyNo: headerRow[csvFlexiHeaderMapping.companyNo],

      invoiceNo: safeTruncate(
        String(headerRow[csvFlexiHeaderMapping.invoiceNo] || ""),
        20
      ),
      invoiceDate: convertMMDDYYYYtoMMDDYY(
        headerRow[csvFlexiHeaderMapping.invoiceDate]
      ),
      invoiceAmount: Number(headerRow[csvFlexiHeaderMapping.invoiceAmount]),
      apGlNo: Number(headerRow[csvFlexiHeaderMapping.apGlNo]),
      bankGl: headerRow[csvFlexiHeaderMapping.bankGl],

      invoiceDesc: safeTruncate(
        headerRow[csvFlexiHeaderMapping.invoiceDesc] || "",
        25
      ),
      holdCode: "",
      holdDesc: safeTruncate(
        headerRow[csvFlexiHeaderMapping.holdDesc] || "",
        25
      ),

      vendorNo: Number(headerRow[csvFlexiHeaderMapping.vendorNo]),
      processType: PROCESS_TYPE_ENUM.FLEXI,
    };
  }

  private mapDetail(detailRow: Record<string, any>): DetailDto {
    return {
      lineGlNo: Number(detailRow[csvFlexiDetailMapping.lineGlNo]),
      lineDesc: safeTruncate(
        detailRow[csvFlexiDetailMapping.lineDesc] || "",
        25
      ), // example CHAR(20)
      lineAmount: Number(detailRow[csvFlexiDetailMapping.lineAmount]),
      discountAmount: Number(detailRow[csvFlexiDetailMapping.discountAmount]),
      discountPercentage: Number(
        detailRow[csvFlexiDetailMapping.discountPercentage]
      ),
      quantity: Math.trunc(Number(detailRow[csvFlexiDetailMapping.quantity])), //Quantity as integer using truncation
      gallons: Number(detailRow[csvFlexiDetailMapping.gallons]),
      receiptNo: Number(detailRow[csvFlexiDetailMapping.receiptNo]),
      poLineNo: Number(detailRow[csvFlexiDetailMapping.poLineNo]),
      productAmount: Number(detailRow[csvFlexiDetailMapping.lineAmount]), //productAmount is also same as lineAmount from CSV
      poNo: safeTruncate(detailRow[csvFlexiDetailMapping.poNo] || "", 30), // example CHAR(15)

      entryNo: detailRow[csvFlexiDetailMapping.entryNo],
      companyNo: detailRow[csvFlexiDetailMapping.companyNo],
      entrySequence: detailRow[csvFlexiDetailMapping.entrySequence],
    };
  }
}
