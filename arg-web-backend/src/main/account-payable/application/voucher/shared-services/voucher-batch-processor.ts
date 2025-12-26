import {
  Processor,
  Process,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
} from "@nestjs/bull";
import { Inject } from "@nestjs/common";
import pLimit from "p-limit";
import { Job } from "bullmq";
import { redis_connection } from "@src/shared/queue/bullmq-connection";
import { WebsocketService } from "@src/shared/websocket/websocket.service";
import {
  HeaderDto,
  DetailDto,
  SalesDto,
  containerUomConversionDto,
} from "../dto/voucher.dto";
import { VoucherSharedService } from "./voucher.shared.service";
import { VoucherDetailValidationService } from "./voucher-detail.shared.service";
import { VoucherAppService } from "@src/main/account-payable/domain/services/voucher/voucher.service";
import {
  QUEUE_NAMES,
  PROCESS_TYPE_ENUM,
  INVOICE_DESCRIPTION,
  PROCESS_TYPE_EVENT,
} from "@src/shared/constants/constant";
import { VOUCHER_STATUS_CODES } from "@src/shared/constants/status-map";
import { AppLogger } from "@src/shared/logger/logger.service";
import { MAX_PARALLEL_GROUP_PROCESSING } from "@src/shared/constants/upload-file-constant";
import { logBatchTotalTimeAndCleanup } from "@src/shared/utils/process-duration-tracker";
import IORedis from "ioredis";
import { SalesAnalysisDetailInterface } from "@src/main/account-payable/domain/interface/sales-analysis-detail.interface";
import { SalesAnalysisMiscInterface } from "@src/main/account-payable/domain/interface/sales-analysis-misc.interface";
import { ProdMoveDetailLogicalInterface } from "@src/main/account-payable/domain/interface/prod-move-detail-logic.interface";
import { ProdMoveMiscLogicalInterface } from "@src/main/account-payable/domain/interface/prod-move-misc-logical.interface";
import { BillingControlFileInterface } from "@src/main/account-payable/domain/interface/billing-control-file.interface";
import { ContainerUomConversionInterface } from "@src/main/account-payable/domain/interface/container-uom-conversion.interface";
import { FreightInvoiceHeaderInterface } from "@src/main/account-payable/domain/interface/freight-invoice-header.interface";
import { GeneralSystemInterface } from "@src/main/account-payable/domain/interface/general-system.interface";

import { convertMMDDYYtoYYYYMMDD } from "@src/shared/utils/format-date";
import { VendorSharedService } from "./vendor.shared.service";
import {
  FIMO_CODES,
  DM_CODES,
  OPEN_CLOSED_STATUS,
  DESCRIPTIONS,
  TABLE_CODES,
  SHIPPING_REFERENCE_FORMAT,
} from "@src/shared/constants/paper-lms-constant";
import { UserContext } from "@src/shared/utils/user-context";
import { AuthUser } from "@src/auth/domain/entities/auth-user.entity";

type InvoiceData = {
  carrierId: string;
  carrierInvoiceNo: string;
  ordShipDate: string;
  invoiceType: string;
  ourOrderNo: number;
  shippingReferenceNo: number;
  invoiceAmount: number;
  companyNo: number;
  entryNo?: number;
  apGlNo?: number;
  bankGl?: number;
  retentionGl?: number;
  vendorNo?: number;
  orderNo?: number;
  invoiceDate?: string;
};
@Processor(QUEUE_NAMES.PAPER)
export class VoucherBatchProcessor {
  private readonly logger = new AppLogger(VoucherBatchProcessor.name);
  private readonly redis = new IORedis(redis_connection);
  constructor(
    @Inject("SalesAnalysisDetailInterface")
    private readonly salesAnalysisDetailInterface: SalesAnalysisDetailInterface,

    @Inject("SalesAnalysisMiscInterface")
    private readonly salesAnalysisMiscInterface: SalesAnalysisMiscInterface,

    @Inject("ProdMoveDetailLogicalInterface")
    private readonly prodMoveDetailLogicalInterface: ProdMoveDetailLogicalInterface,

    @Inject("ProdMoveMiscLogicalInterface")
    private readonly prodMoveMiscLogicalInterface: ProdMoveMiscLogicalInterface,

    @Inject("BillingControlFileInterface")
    private readonly billingControlFileInterface: BillingControlFileInterface,

    @Inject("ContainerUomConversionInterface")
    private readonly containerUomConversionInterface: ContainerUomConversionInterface,

    @Inject("FreightInvoiceHeaderInterface")
    private readonly freightInvoiceHeaderInterface: FreightInvoiceHeaderInterface,

    @Inject("GeneralSystemInterface")
    private readonly generalSystemInterface: GeneralSystemInterface,

    private readonly voucherSharedService: VoucherSharedService,
    private readonly voucherDetailSharedService: VoucherDetailValidationService,
    private readonly voucherAppService: VoucherAppService,
    private readonly websocketService: WebsocketService,
    private readonly vendorService: VendorSharedService
  ) {
    this.logger.log(
      `VoucherBatchProcessor initialized, waiting on queue: ${QUEUE_NAMES.PAPER}`
    );
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(`Queue paper/lms job ${job.id} is now active`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job, _result: any) {
    this.logger.log(`Queue paper/lms job ${job.id} completed successfully`);
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
      invoiceRecords: batch,
      batchId,
      batchIndex,
      userId,
      totalBatches,
      invoiceType: processType,
    } = job.data;

    this.logger.log(
      `Processing batch for batchId: ${batchId} with ${batch.length} invoices`
    );
    this.logger.log(`Invoice data: ${JSON.stringify(batch)}`);
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
        batch.map((invoice: InvoiceData) =>
          limit(() => this.processinvoice(invoice, processType))
        )
      );

      await this.storeBatchSummaryInRedis(batchId, batchIndex, batchSummary);
      await this.checkAndEmitFinalSummary(batchId, totalBatches, processType);

      return { batchId, summary: batchSummary };
    });
  }

  private async processinvoice(
    invoice: InvoiceData,
    processType: PROCESS_TYPE_ENUM
  ) {
    // map invoice to vendor based on carrier id and company no
    let status: string = "";
    let dbError: string | null = null;
    let headerResult: any = null;
    let detailResult: any = null;
    try {
      // map vendor with invoice
      await this.fetchCarrierVendor(invoice);
      const headerData = this.mapHeader(invoice, processType);
      // process detail data
      const detailData = await this.processAP1012(invoice);
      this.logger.log(
        `Invoice ${headerData.invoiceNo}: Starting validation & save`
      );

      // Validate header + details
      headerResult = await this.validateHeader(headerData);
      detailResult = await this.validateDetails(
        detailData,
        headerResult.voucherHeaderData
      );
      // Compute status
      status = this.computeStatus(headerResult, detailResult);
      const finalStatus = VOUCHER_STATUS_CODES[status];

      await this.saveVoucherData(
        headerResult.voucherHeaderData,
        detailResult.data,
        headerData.invoiceNo,
        finalStatus
      );
      await this.updateFreightInvoiceStatus(invoice);
    } catch (err) {
      const error = err as Error;
      status = VOUCHER_STATUS_CODES.E;
      dbError = error.message;
      this.logger.error(
        `DB save failed for invoice ${invoice.carrierInvoiceNo}: ${error.message}`
      );
    }
    return {
      invoiceNo: invoice.carrierInvoiceNo,
      invoiceAmount: invoice.invoiceAmount,
      status,
      headerValidation: { errors: headerResult.errors },
      detailValidation: {
        errors: detailResult.errors,
        warnings: detailResult.warnings,
      },
      dbError,
    };
  }

  // ---------------- VALIDATION METHODS ----------------

  private async validateHeader(headerDTO: HeaderDto) {
    // Start with a result object that will be built upon
    let result: {
      newDueDate: number;
      newDiscountDueDate: number;
      foundVendor: any;
      errors: string[];
    } = {
      newDueDate: 0,
      newDiscountDueDate: 0,
      foundVendor: null,
      errors: [],
    };

    try {
      const output =
        await this.voucherSharedService.headerValidation(headerDTO);

      if ("errors" in output && "data" in output) {
        result.errors = output.errors.map((e) => e.message);
        result.newDueDate = output.data.newDueDate;
        result.newDiscountDueDate = output.data.newDiscountDueDate;
        result.foundVendor = output.data.foundVendor;
      } else if (
        "newDueDate" in output &&
        "newDiscountDueDate" in output &&
        "foundVendor" in output
      ) {
        result.newDueDate = output.newDueDate;
        result.newDiscountDueDate = output.newDiscountDueDate;
        result.foundVendor = output.foundVendor;
      }

      this.logger.log(
        `Header validation for ${headerDTO.invoiceNo}: ${JSON.stringify(output)}`
      );
    } catch (err) {
      const error = err as Error;
      result.errors.push(error.message);
      this.logger.error(
        `Header validation failed for ${headerDTO.invoiceNo}: ${error.message}`
      );
    }

    return {
      errors: result.errors,
      voucherHeaderData: this.voucherSharedService.buildVoucherHeaderData({
        ...headerDTO,
        dueDate: result.newDueDate,
        discountDueDate: result.newDiscountDueDate,
        foundVendor: result.foundVendor,
      }),
    };
  }

  // validate detail records
  private async validateDetails(
    detailData: DetailDto[],
    voucherHeaderData: any
  ) {
    const result = {
      errors: [] as string[],
      warnings: [] as string[],
      data: detailData,
    };
    try {
      const output = await this.voucherDetailSharedService.validateDetail(
        detailData,
        voucherHeaderData
      );
      if (output.error) {
        result.errors = (output.errors ?? []).flatMap((errObj) =>
          errObj.errors.map((e) => `${e.field}: ${e.message}`)
        );
        if ("warnings" in output && Array.isArray(output.warnings)) {
          result.warnings = output.warnings.flatMap((wObj) =>
            wObj.warnings.map((w) => `${w.field}: ${w.message}`)
          );
        }
      } else {
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

  private computeStatus(
    header: { errors: string[] },
    detail: { errors: string[]; warnings: string[] }
  ): string {
    if (header.errors.length || detail.errors.length)
      return VOUCHER_STATUS_CODES.E;
    if (detail.warnings.length) return VOUCHER_STATUS_CODES.W;
    return VOUCHER_STATUS_CODES.S;
  }

  // ---------------- DB SAVE METHOD ----------------

  private async saveVoucherData(
    voucherHeaderData: any,
    details: any,
    invoiceNo: string,
    finalStatus: string
  ) {
    const headerRecord =
      await this.voucherAppService.createOrUpdateVoucherHeader({
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

  // ---------------- REDIS & WEBSOCKET METHODS ----------------

  private async storeBatchSummaryInRedis(
    batchId: string,
    batchIndex: number,
    batchSummary: any[]
  ) {
    const redisKey = `batch:${batchId}:summaries`;
    await this.redis.hset(
      redisKey,
      batchIndex.toString(),
      JSON.stringify(batchSummary)
    );
    this.logger.log(`Stored batch ${batchIndex} summary in Redis`);
  }

  private async checkAndEmitFinalSummary(
    batchId: string,
    totalBatches: number,
    processType: PROCESS_TYPE_ENUM
  ) {
    const redisKey = `batch:${batchId}:summaries`;
    const completedCount = await this.redis.hlen(redisKey);
    this.logger.log(
      `Completed batches for ${batchId}: ${completedCount}/${totalBatches}`
    );

    if (completedCount >= totalBatches) {
      await logBatchTotalTimeAndCleanup(this.redis, batchId, this.logger);

      const summariesObj = await this.redis.hgetall(redisKey);
      await this.websocketService.emitBatchSummaryToWebSocket(
        batchId,
        summariesObj,
        processType === PROCESS_TYPE_ENUM.PAPER
          ? PROCESS_TYPE_EVENT.PAPER
          : PROCESS_TYPE_EVENT.LMS
      );
      await this.redis.del(redisKey);
      this.logger.log(`Cleaned up Redis key ${redisKey}`);
    }
  }

  // fetch vendor no based on carrier id and company no
  private async fetchCarrierVendor(invoice: InvoiceData) {
    const vendorData =
      await this.vendorService.getVendorNoByCompanyAndCarrierId(
        invoice.companyNo,
        invoice.carrierId
      );
    invoice.vendorNo = vendorData?.vendorNo ?? 0;
  }

  // ---------------- MAPPING METHODS ----------------
  private mapHeader(
    invoice: Record<string, any>,
    processType: PROCESS_TYPE_ENUM
  ): HeaderDto {
    return {
      companyNo: invoice.companyNo,
      entryNo: invoice.entryNo,
      vendorNo: Number(invoice.vendorNo),
      apGlNo: Number(invoice.apGlNo),
      invoiceDesc:
        processType === PROCESS_TYPE_ENUM.PAPER
          ? INVOICE_DESCRIPTION.PAPER
          : INVOICE_DESCRIPTION.LMS,
      invoiceDate: invoice.invoiceDate,
      bankGl: invoice.bankGl,
      invoiceAmount: Number(invoice.invoiceAmount),
      retentionGl: invoice.retentionGl,
      salesOrderNo: invoice.ourOrderNo,
      srn: invoice.shippingReferenceNo,
      carrierId: invoice.carrierId,
      processType:
        processType === PROCESS_TYPE_ENUM.PAPER
          ? PROCESS_TYPE_ENUM.PAPER
          : PROCESS_TYPE_ENUM.ARGLMS,
      invoiceNo: invoice.carrierInvoiceNo.trim(),
      totalFreight: Number(invoice.invoiceAmount),
    };
  }

  private mapDetail(detailRow: Record<string, any>, invoice) {
    return {
      companyNo: invoice.companyNo,
      entrySequence: detailRow.entrySequence,
      lineGlNo: detailRow.lineGlNo,
      lineDesc: detailRow.lineDesc.trim(),
      lineAmount: detailRow.lineAmount,
      openClosed: OPEN_CLOSED_STATUS.CLOSED,
      freightAmount: detailRow.lineAmount,
      productAmount: detailRow.productAmount,
      discountPercentage: detailRow.discountPercentage,
    };
  }

  /**
   * Helper to get S_FIMO and S_DM codes for a given invoice.
   * Returns an object: { S_FIMO, S_DM }
   *
   * @param {Object} params - Must include companyNo, ourOrderNo, shippingReferenceNo, ordShipDate
   * @returns {Promise<{S_FIMO: string, S_DM: string}>}
   */
  private async getFimoAndDmCodes(params) {
    const { companyNo, ourOrderNo, shippingReferenceNo, ordShipDate } = params;

    let S_FIMO: string = FIMO_CODES.DEFAULT;
    let S_DM: string = DM_CODES.DEFAULT;
    if (ourOrderNo !== 0 && shippingReferenceNo !== 0) {
      const salesAnalysisDetailRecords = await this.SalesAnalysisDetail({
        companyNo,
        orderNo: ourOrderNo,
        shippingReferenceNo,
        invoiceDate: convertMMDDYYtoYYYYMMDD(ordShipDate).toString(),
      });
      if (salesAnalysisDetailRecords && salesAnalysisDetailRecords.length > 0) {
        S_FIMO = FIMO_CODES.FREIGHT;
        S_DM = DM_CODES.DETAIL;
        return { S_FIMO, S_DM };
      } else {
        const prodMoveDetailLogicalRecords = await this.ProdMoveDetailLogical({
          companyNo,
          orderNo: ourOrderNo,
          shippingReferenceNo,
          invoiceDate: convertMMDDYYtoYYYYMMDD(ordShipDate).toString(),
        });
        if (
          prodMoveDetailLogicalRecords &&
          prodMoveDetailLogicalRecords.length > 0
        ) {
          S_FIMO = FIMO_CODES.MOVE;
          S_DM = DM_CODES.DETAIL;
          return { S_FIMO, S_DM };
        } else {
          const salesAnalysisMiscRecords = await this.SalesAnalysisMisc({
            companyNo,
            orderNo: ourOrderNo,
            shippingReferenceNo,
            invoiceDate: convertMMDDYYtoYYYYMMDD(ordShipDate).toString(),
          });
          if (salesAnalysisMiscRecords && salesAnalysisMiscRecords.length > 0) {
            S_FIMO = FIMO_CODES.FREIGHT;
            S_DM = DM_CODES.MISC;
            return { S_FIMO, S_DM };
          } else {
            const prodMoveMiscLogicalRecords = await this.ProdMoveMiscLogical({
              companyNo,
              orderNo: ourOrderNo,
              shippingReferenceNo,
              invoiceDate: convertMMDDYYtoYYYYMMDD(ordShipDate).toString(),
            });
            if (
              prodMoveMiscLogicalRecords &&
              prodMoveMiscLogicalRecords.length > 0
            ) {
              S_FIMO = FIMO_CODES.MOVE;
              S_DM = DM_CODES.MISC;
              return { S_FIMO, S_DM };
            }
          }
        }
      }
    }
    // If nothing matched, return defaults
    return { S_FIMO, S_DM };
  }

  /**
   *  Calculate line amount , entry sequence and GL no for each order detail entries
   */
  async processAmountandGlNo(params, S_FIMO) {
    const { companyNo, ourOrderNo, shippingReferenceNo, ordShipDate } = params;
    let totalQuantity = 0;
    // Get all matching records
    let records;
    if (S_FIMO !== FIMO_CODES.MOVE) {
      // Use SalesAnalysisDetail for detail tables

      records = await this.SalesAnalysisDetail({
        companyNo,
        orderNo: ourOrderNo,
        shippingReferenceNo,
        invoiceDate: convertMMDDYYtoYYYYMMDD(ordShipDate).toString(),
      });
    } else {
      records = await this.ProdMoveDetailLogical({
        companyNo,
        orderNo: ourOrderNo,
        shippingReferenceNo,
        invoiceDate: convertMMDDYYtoYYYYMMDD(ordShipDate).toString(),
      });
    }
    records.forEach((record) => {
      totalQuantity += record.netGallons || 0;
    });
    if (totalQuantity === 0 && records.length === 0) {
      // Skip to misc file processing
      return await this.processMiscFiles(params, S_FIMO);
    }
    const detailAmountArray = await Promise.all(
      records.map(async (record, idx) => {
        const percentHold =
          totalQuantity !== 0 ? record.netGallons / totalQuantity : 0;
        //  PAPER/LMS: Product amount is always 0, entire invoice amount is freight
        const productAmount = 0;
        
        //  PAPER/LMS: Freight amount = proportional share of invoice amount
        const freightAmount = Math.round(percentHold * (params.invoiceAmount || 0) * 100) / 100;
        
        //  PAPER/LMS: Line amount = freight amount (since product amount = 0)
        const lineAmount = productAmount + freightAmount;
        let formattedShippingReferenceNo = String(
          
          params.shippingReferenceNo || ""
        );
        if (
          formattedShippingReferenceNo.length <
          SHIPPING_REFERENCE_FORMAT.MIN_LENGTH
        ) {
          formattedShippingReferenceNo = formattedShippingReferenceNo.padStart(
            SHIPPING_REFERENCE_FORMAT.MIN_LENGTH,
            SHIPPING_REFERENCE_FORMAT.PAD_CHAR
          );
        }
        return {
          lineAmount: lineAmount,           //  PAPER/LMS: Always equals freight amount
          productAmount: productAmount,     //  PAPER/LMS: Always 0
          freightAmount: freightAmount,     //  PAPER/LMS: Proportional share of invoice amount
          entrySequence: idx + 1,
          lineGlNo: await this.getFreightGL(record, params),
          lineDesc:
            `${params.ourOrderNo}${formattedShippingReferenceNo} ${record.product} ${record.containerCd} ${DESCRIPTIONS.SALE_TABLE_DESCRIPTION}`.trim(),
          discountPercentage: await this.findDiscountPercentage(
            record.tank.charAt(0),
            TABLE_CODES.CONTAINER_PRODUCT_FREIGHT
          ),
        };
      })
    );

    //  PAPER/LMS: Calculate total freight (ATFRTL = sum of ATFRAM)
    // In PAPER/LMS: total freight should equal invoice amount
    const totalFreightCalculated = detailAmountArray.reduce(
      (sum, item) => sum + item.freightAmount,
      0
    );
    
    // Log the calculated total freight for debugging
    this.logger.debug(`PAPER/LMS - Total freight calculated: ${totalFreightCalculated}, Invoice amount: ${params.invoiceAmount}`);

    //  PAPER/LMS: Validate invoice total (ATIAMT = sum of ATAMT)
    // In PAPER/LMS: invoice amount should equal sum of line amounts (which are all freight)
    const totalLineAmount = detailAmountArray.reduce(
      (sum, item) => sum + item.lineAmount,
      0
    );

    if (detailAmountArray.length > 0) {
      const diff =
        Math.round((params.invoiceAmount - totalLineAmount) * 100) / 100;
      if (diff !== 0) {
        detailAmountArray[detailAmountArray.length - 1].lineAmount =
          Math.round(
            (detailAmountArray[detailAmountArray.length - 1].lineAmount +
              diff) *
              100
          ) / 100;
      }
    }
    return detailAmountArray;
  }

  /**
   * Process misc files for freight calculations
   */
  async processMiscFiles(params: InvoiceData, S_FIMO: string) {
    const {
      companyNo,
      ourOrderNo,
      ordShipDate,
      invoiceAmount,
      shippingReferenceNo,
    } = params;
    let miscRecords;

    if (S_FIMO !== FIMO_CODES.MOVE) {
      // Use SalesAnalysisMisc for detail tables
      miscRecords = await this.SalesAnalysisMisc({
        companyNo,
        orderNo: ourOrderNo,
        shippingReferenceNo,
        invoiceDate: convertMMDDYYtoYYYYMMDD(ordShipDate).toString(),
      });
    } else {
      miscRecords = await this.ProdMoveMiscLogical({
        companyNo,
        orderNo: ourOrderNo,
        shippingReferenceNo,
        invoiceDate: convertMMDDYYtoYYYYMMDD(ordShipDate).toString(),
      });
    }
    // if no misc records, return empty array though this case is not possible
    if (miscRecords.length === 0)
      return [
        {
          lineAmount: 0,           //  Follows formula: 0 + 0 = 0
          productAmount: 0,        //  Add product amount
          freightAmount: 0,        //  Add freight amount
          entrySequence: 1,
          lineGlNo: params.apGlNo,
          lineDesc: DESCRIPTIONS.MISC_CHARGE,
          discountPercentage: 0,
        },
      ];

    // Calculate total misc freight
    const totalFreight = miscRecords.reduce(
      (sum, record) => sum + (record.miscAmount || 0),
      0
    );

    let calculatedTotal = 0;

    const result: any[] = [];
    for (let i = 0; i < miscRecords.length; i++) {
      const record = miscRecords[i];
      const isLastRecord = i === miscRecords.length - 1;

      let freightAmount: number = 0;

      if (!isLastRecord) {
        const calculatedAmount =
          Math.round(record.miscAmount * record.miscQuantity * 100) / 100;
        const percentHold =
          totalFreight !== 0 ? calculatedAmount / totalFreight : 0;
        freightAmount = Math.round(invoiceAmount * percentHold * 100) / 100;
        calculatedTotal += freightAmount;
      } else {
        freightAmount =
          Math.round((invoiceAmount - calculatedTotal) * 100) / 100;
      }
      let formattedShippingReferenceNo = String(
        params.shippingReferenceNo || ""
      );
      if (
        formattedShippingReferenceNo.length <
        SHIPPING_REFERENCE_FORMAT.MIN_LENGTH
      ) {
        formattedShippingReferenceNo = formattedShippingReferenceNo.padStart(
          SHIPPING_REFERENCE_FORMAT.MIN_LENGTH,
          SHIPPING_REFERENCE_FORMAT.PAD_CHAR
        );
      }
      //  For misc files, product amount is 0, freight amount is the calculated amount
      const productAmount = 0;
      const lineAmount = productAmount + freightAmount; // Apply formula ATAMT = ATPRAM + ATFRAM

      result.push({
        lineAmount: lineAmount,           //  Now follows formula
        productAmount: productAmount,     //  Add product amount (0 for misc)
        freightAmount: freightAmount,     //  Add freight amount
        entrySequence: i + 1,
        lineGlNo: await this.getFreightGL(record, params),
        lineDesc:
          `${params.orderNo}${formattedShippingReferenceNo} MISC CHARGE`.trim(),
        discountPercentage: await this.findDiscountPercentage(
          record.tank.charAt(0),
          TABLE_CODES.CONTAINER_PRODUCT_FREIGHT
        ),
      });
    }
    return result;
  }
  /**
   * Get freight G/L number from various sources
   */
  async getFreightGL(record, params) {
    let freightGl = 0;

    // Check if product codes contain letters
    const hasLetters = this.checkProductCodesForLetters(record);

    if (hasLetters) {
      
      const containerUomConversionRecord = await this.ContainerUomConversion({
        companyNo: params.companyNo,
        ProductCode: record.product,
        containerCode: record.containerCd,
        UnitOfMeasure: record.unitOfMeasure,
      });
      if (containerUomConversionRecord) {
        freightGl = containerUomConversionRecord.freightExpenseGl || 0;
      }
    } else if (freightGl == 0) {
      // if fegl is 0 then check general system table for gl no
      //Parameters were reversed - tableType should be CNTRPF, tableCode should be first char of tank
      const gstablRecord = await this.findGeneralSystemGLNo(
        TABLE_CODES.CONTAINER_PRODUCT_FREIGHT,
        record.tank.charAt(0)
      );
      if (gstablRecord) {
        //  Use first 4 digits of salesGlNo and concatenate with product code
        const salesGlBase = String(gstablRecord.salesGlNo).substring(0, 4);
        freightGl = Number(salesGlBase + record.product);
      } else {
        // if no record found in general system table then check billing control file for gl no
        const billingControlRecord = await this.billingControlFile(
          params.companyNo
        );
        if (billingControlRecord) {
          freightGl = billingControlRecord.freightGl;
        }
      }
    }
    return freightGl;
  }

  /**
   * Check if product codes contain letters A-Z
   */
  checkProductCodesForLetters(record) {
   
    if (record.product) {
      record.PRD1 = record.product.charAt(0);
      record.PRD2 = record.product.charAt(1);
      record.PRD3 = record.product.charAt(2);
      record.PRD4 = record.product.charAt(3);
    }
    const productCodes = [record.PRD1, record.PRD2, record.PRD3, record.PRD4];
    return productCodes.some(
      (code) => code && /[A-Z]/.test(code.toString().toUpperCase())
    );
  }

  /**
   * AP1012 Implementation for detail record generation
   */
  private async processAP1012(params: any) {
    try {
      // Determine Source Table ---
      const { S_FIMO } = await this.getFimoAndDmCodes(params);

      // Calculate Line Amount , entry sequence and GL no ---
      const detailResult = await this.processAmountandGlNo(params, S_FIMO);
      //  Map detail entries as per Voucher Detail Schema

      const mappedDetails =
        detailResult?.map((detail) => this.mapDetail(detail, params)) ?? [];
      return mappedDetails;
    } catch (error) {
      this.logger.error("AP1012 processing error:", error as string);
      throw error;
    }
  }
  private async SalesAnalysisDetail(data: SalesDto) {
    const { companyNo, orderNo, shippingReferenceNo, invoiceDate } = data;

    const SalesAnalysisRecord = await this.salesAnalysisDetailInterface.findAll(
      companyNo,
      orderNo,
      shippingReferenceNo,
      invoiceDate
    );

    return SalesAnalysisRecord;
  }

  private async SalesAnalysisMisc(data: SalesDto) {
    const { companyNo, orderNo, shippingReferenceNo, invoiceDate } = data;

    const SalesAnalysisRecord = await this.salesAnalysisMiscInterface.findAll(
      companyNo,
      orderNo,
      shippingReferenceNo,
      invoiceDate
    );

    return SalesAnalysisRecord;
  }

  private async ProdMoveDetailLogical(data: SalesDto) {
    const { companyNo, orderNo, shippingReferenceNo, invoiceDate } = data;

    const SalesAnalysisRecord =
      await this.prodMoveDetailLogicalInterface.findAll(
        companyNo,
        orderNo,
        shippingReferenceNo,
        invoiceDate
      );

    return SalesAnalysisRecord;
  }

  private async ProdMoveMiscLogical(data: SalesDto) {
    const { companyNo, orderNo, shippingReferenceNo, invoiceDate } = data;

    const SalesAnalysisRecord = await this.prodMoveMiscLogicalInterface.findAll(
      companyNo,
      orderNo,
      shippingReferenceNo,
      invoiceDate
    );

    return SalesAnalysisRecord;
  }

  async billingControlFile(companyNo: number) {
    const billingControlRecord =
      await this.billingControlFileInterface.findOne(companyNo);

    return billingControlRecord;
  }

  async ContainerUomConversion(data: containerUomConversionDto) {
    const { companyNo, ProductCode, containerCode, UnitOfMeasure } = data;

    const containerRecord = await this.containerUomConversionInterface.findOne(
      companyNo,
      ProductCode,
      containerCode,
      UnitOfMeasure
    );

    return containerRecord;
  }

  async updateFreightInvoiceStatus(invoice: InvoiceData): Promise<any> {
    const updateRecord =
      await this.freightInvoiceHeaderInterface.updateInvoiceStatus(
        invoice.ourOrderNo,
        invoice.companyNo,
        invoice.carrierId,
        invoice.carrierInvoiceNo
      );

    return updateRecord;
  }

  async findGeneralSystemGLNo(
    tableType: string,
    tableCode: string
  ): Promise<any> {
    const findRecord = await this.generalSystemInterface.findTableTypeAndCode(
      tableType,
      tableCode
    );

    return findRecord;
  }

  async findDiscountPercentage(
    tableType: string,
    tableCode: string
  ): Promise<any> {
    const findRecord = await this.findGeneralSystemGLNo(tableType, tableCode);
    return findRecord?.discount ?? 0;
  }
}
