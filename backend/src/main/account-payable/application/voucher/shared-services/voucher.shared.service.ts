import { Injectable, Inject } from "@nestjs/common";
import { VoucherHeaderInterface } from "@src/main/account-payable/domain/interface/voucher.interface";
import { VoucherHeader } from "@src/main/account-payable/domain/entities/voucher.entity";
import { AppLogger } from "@src/shared/logger/logger.service";
import {
  GetHeadersDto,
  HeaderDto,
} from "@src/main/account-payable/application/voucher/dto/voucher.dto";
import {
  paginatedResponse,
  PaginatedResponse,
} from "@src/shared/utils/response-formatter";
import { normalizeSearchQuery } from "@src/shared/utils/query.utils";
import { Company } from "@src/main/account-payable/domain/entities/company.entity";
import { GeneralSystemEntity } from "@src/main/account-payable/domain/entities/general-system.entity";
import {
  ERROR_MESSAGES,
  ERROR_CONSTANTS,
} from "@src/shared/constants/error-constant";
import {
  HEADER,
  PROCESS_TYPE_ENUM,
  DEFAULT_DISCOUNT_DUE_DATE,
} from "@src/shared/constants/constant";
import { CompanyService } from "@src/main/account-payable/domain/services/company/companies.service";
import { VoucherHeaderValidationService } from "../validations/voucher-header.validation.service";
import { VendorAppService } from "@src/main/account-payable/domain/services/vendor/vendor.service";
import { GlMasterService } from "@src/main/account-payable/domain/services/gl-master/gl-master.service";
import { CarrierInvoiceHeaderService } from "@src/main/account-payable/domain/services/carrier-invoice-header/carrier-invoice-header.service";
import { FreightInvoiceHeaderService } from "@src/main/account-payable/domain/services/freight-invoice-header/freight-invoice-header.service";
import {
  convertMMDDYYtoYYYYMMDD,
  validateMMDDYY,
} from "@src/shared/utils/format-date";
import { Vendor } from "@src/main/account-payable/domain/entities/vendor.entity";
import { CarrierInvoiceHeaderEntity } from "../../../domain/entities/carrier-invoice-header.entity";
import { FreightInvoiceHeaderEntity } from "../../../domain/entities/freight-invoice-header.entity";
import { VoucherDetailValidationService } from "./voucher-detail.shared.service";
import { VoucherDetail } from "@src/main/account-payable/domain/entities/voucher.entity";
import { VOUCHER_STATUS_CODES } from "@src/shared/constants/status-map";
import { ApdateInterface } from "@src/main/account-payable/domain/interface/apdate.interface";

@Injectable()
export class VoucherSharedService {
  private readonly logger = new AppLogger(VoucherSharedService.name);

  constructor(
    @Inject("ApdateInterface")
    private readonly apdateInterface: ApdateInterface,

    @Inject("VoucherHeaderInterface")
    private readonly voucherHeaderInterface: VoucherHeaderInterface,
    private readonly voucherHeaderValidationService: VoucherHeaderValidationService,
    private readonly vendorAppService: VendorAppService,
    private readonly companyService: CompanyService,
    private readonly glMasterService: GlMasterService,
    private readonly carrierInvoiceHeaderService: CarrierInvoiceHeaderService,
    private readonly freightInvoiceHeaderService: FreightInvoiceHeaderService,
    private readonly voucherDetailValidationService: VoucherDetailValidationService
  ) {}

  async headerValidation(dto: HeaderDto): Promise<
    | { field: string; code: string; message: string }[]
    | {
        newDueDate: number;
        newDiscountDueDate: number;
        foundVendor: Vendor | null;
        warnings?: { field: string; code: string; message: string }[];
      }
    | {
        errors: { field: string; code: string; message: string }[];
        warnings?: { field: string; code: string; message: string }[];
        data: {
          newDueDate: number;
          newDiscountDueDate: number;
          foundVendor: Vendor | null;
        };
      }
  > {
    const startTime = Date.now();
    this.logger.sharedTiming("Starting header validation", startTime, "start");

    this.logger.log(
      `Validating voucher entry header fields ${JSON.stringify(dto)}`
    );

    const errors: {
      field: string;
      code: string;
      message: string;
    }[] = [];

    const warnings: {
      field: string;
      code: string;
      message: string;
    }[] = [];

    const processorErrors: {
      errors: typeof errors;
      warnings?: typeof warnings;
      data: {
        newDueDate: number;
        newDiscountDueDate: number;
        foundVendor: Vendor | null;
      };
    } = {
      errors: [],
      warnings: [],
      data: {
        newDueDate: 0,
        newDiscountDueDate: 0,
        foundVendor: null,
      },
    };

    const {
      companyNo,
      invoiceNo,
      invoiceAmount,
      invoiceDate,
      dueDate,
      discountDueDate,
      // totalFreight,
      salesOrderNo,
      vendorNo,
      processType,
      holdCode,
      apGlNo,
      bankGl,
      // srn,
      entryNo,
      prepaidCode,
      prepaidCheckNo,
      prepaidCheckdate,
    } = dto;

    this.logger.sharedTiming("DTO destructuring completed", startTime);

    const { extendedDueDate, extendedDiscountDueDate, foundVendor } =
      await this.computeDueDatesWithVendorAndGstabl(
        companyNo,
        vendorNo,
        invoiceDate,
        dueDate,
        discountDueDate,
        errors,
        warnings,
        startTime
      );

    // Fetch corresponding records based on whether a sales order number is present.
    const invoiceHeaderLookupStartTime = Date.now();

    // Debug: Log the vendor carrier ID and parameters
    this.logger.sharedTiming(
      `Starting invoice header lookup - salesOrderNo: ${salesOrderNo}, vendorCarrierId: ${foundVendor?.vendorCarrierId}, invoiceNo: ${invoiceNo}`,
      startTime
    );

    let foundCarrierInvoiceHeaderRecord:
      | CarrierInvoiceHeaderEntity
      | FreightInvoiceHeaderEntity
      | null = null;
    try {
      foundCarrierInvoiceHeaderRecord = salesOrderNo
        ? await this.carrierInvoiceHeaderService.getCarrierInvoiceHeaderRecord(
            companyNo,
            foundVendor?.vendorCarrierId,
            invoiceNo ? invoiceNo : "",
            salesOrderNo
          )
        : await this.freightInvoiceHeaderService.getFreightInvoiceHeaderRecord(
            companyNo,
            foundVendor?.vendorCarrierId,
            invoiceNo ? invoiceNo : ""
          );
    } catch (error: unknown) {
      this.logger.error(
        `Error in invoice header lookup: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      // Continue with null record
    }

    this.logger.sharedTiming(
      `Invoice header record lookup completed (${Date.now() - invoiceHeaderLookupStartTime}ms)`,
      startTime
    );

    // Validate fetched record if it exists.
    if (foundCarrierInvoiceHeaderRecord) {
      this.voucherHeaderValidationService.validateCarrierInvoiceHeaderRecord(
        foundCarrierInvoiceHeaderRecord,
        processType,
        errors
      );
    }

    this.logger.sharedTiming(
      "Carrier invoice header validation completed",
      startTime
    );

    // Validate total freight if both sales order number and SRN are provided.
    // if (salesOrderNo && srn && !totalFreight) {
    //   this.voucherHeaderValidationService.addNewError(
    //     errors,
    //     HEADER.TOTAL_FREIGHT,
    //     ERROR_MESSAGES.FREIGHT_REQUIRED,
    //   );
    // }

    // Determine if voucher header validation should be skipped.
    const skipFlag2 = this.voucherHeaderValidationService.shouldSkipValidation(
      invoiceAmount,
      prepaidCheckNo,
      Number(prepaidCheckdate),
      holdCode,
      prepaidCode
    );

    this.logger.sharedTiming("Skip flag determination completed", startTime);

    // Validate voucher headers unless the skip flag is true.
    const voucherHeaderValidationStartTime = Date.now();
    // Only run voucher header invoice no validation if processType is NOT PAPER or LMS
    if (
      !skipFlag2 &&
      ![PROCESS_TYPE_ENUM.PAPER, PROCESS_TYPE_ENUM.ARGLMS].includes(
        processType as PROCESS_TYPE_ENUM
      )
    ) {
      await this.voucherHeaderValidationService.validateVoucherHeaders(
        Number(companyNo),
        Number(vendorNo),
        invoiceNo,
        entryNo !== undefined ? Number(entryNo) : undefined,
        errors
      );
    }

    this.logger.sharedTiming(
      `Voucher header validation completed (${Date.now() - voucherHeaderValidationStartTime}ms)`,
      startTime
    );

    // Validate hold code against the vendor number.
    if (foundVendor) {
      this.voucherHeaderValidationService.validateHoldCode(
        foundVendor,
        errors,
        holdCode
      );
    }

    this.logger.sharedTiming("Hold code validation completed", startTime);

    // Validate AP GL and Bank GL numbers concurrently.
    const glValidationStartTime = Date.now();
    await Promise.all([
      this.voucherHeaderValidationService.validateGlNumber(
        Number(companyNo),
        Number(apGlNo),
        HEADER.AP_GL,
        ERROR_MESSAGES.INVALID_AP_GL,
        errors
      ),
      this.voucherHeaderValidationService.validateGlNumber(
        Number(companyNo),
        Number(bankGl),
        HEADER.BANK_GL,
        ERROR_MESSAGES.INVALID_BANK_GL,
        errors
      ),
    ]);

    this.logger.sharedTiming(
      `GL number validation completed (${Date.now() - glValidationStartTime}ms)`,
      startTime
    );

    this.logger.log(`Voucher entry header: ${JSON.stringify(errors)}`);

    // If any validation errors are found, return them with vendor and date data
    if (errors.length > 0) {
      this.logger.sharedTiming(
        "Validation completed with errors",
        startTime,
        "end"
      );

      // Return processor errors only for FLEXI and SOGAS types
      if (
        processType === PROCESS_TYPE_ENUM.FLEXI ||
        processType === PROCESS_TYPE_ENUM.SOGAS
      ) {
        processorErrors.errors = errors;
        processorErrors.warnings = warnings;
        processorErrors.data = {
          newDueDate: Number(extendedDueDate),
          newDiscountDueDate: Number(extendedDiscountDueDate),
          foundVendor,
        };
        return processorErrors;
      }
      // For other types, just return the errors array
      return errors;
    } else {
      this.logger.sharedTiming(
        "Validation completed successfully",
        startTime,
        "end"
      );
      return {
        newDueDate: Number(extendedDueDate),
        newDiscountDueDate: Number(extendedDiscountDueDate),
        foundVendor,
        warnings: warnings,
      };
    }
  }

  async getVoucherHeaders(
    dto: GetHeadersDto
  ): Promise<PaginatedResponse<VoucherHeader>> {
    this.logger.log(`Fetching voucher entry`);

    const { companyNo, vendorNo, entryNo } = dto;
    const { limit, offset, page, sortBy, sortOrder } =
      normalizeSearchQuery(dto);
    const data = {
      companyNo,
      vendorNo,
      entryNo,
      limit,
      offset,
      sortBy,
      sortOrder,
    };
    const { rows, count } = await this.voucherHeaderInterface.findAll(data);

    this.logger.log(`Found ${rows.length} active voucher entry`);

    return paginatedResponse(rows, count, page, limit);
  }

  public buildVoucherHeaderData(body) {
    const {
      companyNo,
      entryNo,
      vendorNo,
      apGlNo,
      invoiceDesc,
      invoiceDate,
      singleCheck,
      holdCode,
      holdDesc,
      prepaidCode,
      prepaidCheckNo,
      prepaidCheckdate,
      bankGl,
      invoiceAmount,
      totalFreight,
      details,  // NEW: Add details parameter
      salesOrderNo,
      srn,
      processType,
      invoiceNo,
      dueDate,
      discountDueDate,
      foundVendor,
      status,
      retentionGl,
      carrierId,
      entrySequence,
      fillerOne,
      fillerTwo,
    } = body;

    //  NEW: Calculate total freight from details if not provided
    let calculatedTotalFreight = totalFreight || 0;
    if (details && details.length > 0) {
      calculatedTotalFreight = details.reduce(
        (sum, detail) => sum + (detail.freightAmount ?? 0),
        0
      );
    }

    const data = {
      isDeleted: "A",
      companyNo: Number(companyNo),
      entryNo: Number(entryNo),
      entrySequence: Number(entrySequence) || 0,
      vendorNo: Number(vendorNo),
      canceledVoucher: 0,
      apGlNo: Number(apGlNo || 0),
      invoiceDesc: invoiceDesc || "",
      invoiceDate: Number(invoiceDate),
      dueDate: Number(dueDate || 0),

      singleCheck: singleCheck || "",
      holdCode: holdCode || "",
      holdDesc: holdDesc || "",

      prepaidCode: prepaidCode || "",
      prepaidCheckNo: Number(prepaidCheckNo || 0),

      vendorName: foundVendor?.vendorName || "",
      vendorAdd1: foundVendor?.vendorAdd1 || "",
      vendorAdd2: foundVendor?.vendorAdd2 || "",
      vendorAdd3: foundVendor?.vendorAdd3 || "",
      vendorAdd4: foundVendor?.vendorAdd4 || "",

      bankGl: Number(bankGl || 0),
      invoiceAmount: Number(invoiceAmount || 0),
      retentionGl: retentionGl || 0,
      retentionPct: 0,
      prepaidCheckdate: Number(prepaidCheckdate || 0),
      totalFreight: Number(calculatedTotalFreight),  //  Use calculated total
      salesOrderNo: Number(salesOrderNo || 0),
      srn: Number(srn || 0),
      carrierId: carrierId || "0",

      vendorPaymentTerms: foundVendor?.vendorApTermsCode || 0,
      processType: processType || "",

      discountDueDate: Number(discountDueDate || 0),
      extendedDiscountDueDate:
        discountDueDate === 0
          ? 0
          : convertMMDDYYtoYYYYMMDD(
              discountDueDate.toString().padStart(6, "0")
            ),
      invoiceNo,
      extendedInvoiceDate: convertMMDDYYtoYYYYMMDD(
        invoiceDate.toString().padStart(6, "0")
      ),
      extendedDueDate: convertMMDDYYtoYYYYMMDD(
        dueDate.toString().padStart(6, "0")
      ),
      status:
        processType !== PROCESS_TYPE_ENUM.NORMAL
          ? status || VOUCHER_STATUS_CODES.S
          : VOUCHER_STATUS_CODES.S,

      fillerOne: fillerOne || "",
      fillerTwo: fillerTwo || "",
    };

    // override vendor-related fields if PAPER or ARGLMS
    if (
      [PROCESS_TYPE_ENUM.PAPER, PROCESS_TYPE_ENUM.ARGLMS].includes(processType)
    ) {
      data.singleCheck = foundVendor?.vendorSingleCheck || "";
      data.holdCode = foundVendor?.vendorHoldPaymentsVend || "";
      data.holdDesc = this.getHoldDescFromVendorHoldCode(
        foundVendor?.vendorHoldPaymentsVend || ""
      );
      data.vendorPaymentTerms = foundVendor?.vendorApTermsCode || 0;
    }

    return data;
  }

  public async getAndIncrementNextEntryNo(
    company: Company,
    reserveCount = 1
  ): Promise<number> {
    this.logger.log(`Fetching nextEntryNo for company ${company.companyNo}`);

    // Fetch fresh company data from database to ensure we have the latest entry number
    // This prevents using stale cached data that might have outdated companyNextEntryNo
    const freshCompany = await this.companyService.findOne(company.companyNo);

    let nextEntryNo = freshCompany.companyNextEntryNo;
    let newNextEntryNo = nextEntryNo + reserveCount;

    if (nextEntryNo === 99999) {
      newNextEntryNo = 1;
    }

    await this.companyService.updateNextEntryNo(
      company.companyNo,
      newNextEntryNo
    );

    this.logger.log(
      `Updated nextEntryNo to ${nextEntryNo} for company ${company.companyNo}`
    );

    return nextEntryNo;
  }

  async getCompanyGlDescriptions(company: Company): Promise<{
    companyDiscountsGlDesc: string;
    companyApGlDesc: string;
    companyBankGlDesc: string;
  }> {
    const [companyDiscountsGlDesc, companyApGlDesc, companyBankGlDesc] =
      await Promise.all([
        this.glMasterService.getGlDescription(
          company.companyNo,
          company.companyDiscountsGlNo,
          "C",
          true
        ),
        this.glMasterService.getGlDescription(
          company.companyNo,
          company.companyApGlNo,
          "C",
          true
        ),
        this.glMasterService.getGlDescription(
          company.companyNo,
          company.companyBankGlNo,
          "C",
          true
        ),
      ]);

    return { companyDiscountsGlDesc, companyApGlDesc, companyBankGlDesc };
  }

  /**
   * Performs comprehensive validation for voucher header and details
   * Always returns validation messages
   */
  async getValidationMessages(
    headerItem: VoucherHeader,
    detailItems?: VoucherDetail[]
  ): Promise<{
    validationMessages: { field: string; code: string; message: string }[];
    errors?: {
      code: string;
      message: string;
      details: { field: string; code: string; message: string; id: string }[];
    };
    warnings?: {
      code: string;
      message: string;
      details: { field: string; code: string; message: string; id: string }[];
    };
  }> {
    this.logger.log(`Starting validation for voucher ${headerItem.entryNo}`);

    // Always attempt header validation to get any existing errors
    const validationResult = await this.headerValidation(headerItem as any);

    // Initialize result object
    const result: {
      validationMessages: { field: string; code: string; message: string }[];
      errors?: {
        code: string;
        message: string;
        details: { field: string; code: string; message: string; id: string }[];
      };
      warnings?: {
        code: string;
        message: string;
        details: { field: string; code: string; message: string; id: string }[];
      };
    } = {
      validationMessages: [],
    };

    // Handle header validation results
    let headerErrors: { field: string; code: string; message: string }[] = [];
    let headerWarnings: { field: string; code: string; message: string }[] = [];

    if (Array.isArray(validationResult)) {
      // If array is returned, it contains validation errors
      headerErrors = validationResult;
    } else if (validationResult && "errors" in validationResult) {
      // If object with errors property exists, it contains validation errors
      headerErrors = validationResult.errors;
      // Check for warnings in the same object
      if (
        "warnings" in validationResult &&
        Array.isArray(validationResult.warnings)
      ) {
        headerWarnings = validationResult.warnings;
      }
    } else if (
      validationResult &&
      "warnings" in validationResult &&
      Array.isArray(validationResult.warnings)
    ) {
      // If object with warnings property exists (success case with warnings)
      headerWarnings = validationResult.warnings;
    }

    // Add header errors to validation messages
    if (headerErrors.length > 0) {
      result.validationMessages = [...headerErrors];
    }

    // Add header warnings to the result
    if (headerWarnings.length > 0) {
      result.warnings = {
        code: ERROR_CONSTANTS.VALIDATION_ERROR.code,
        message: ERROR_CONSTANTS.VALIDATION_ERROR.message,
        details: headerWarnings.map((w) => ({
          field: w.field,
          message: w.message,
          code: "Validation error",
          id: "header", // Use "header" as id for header warnings
        })),
      };
    }

    // Always check details regardless of header validation status
    if (detailItems && detailItems.length > 0) {
      try {
        const detailValidationResult =
          await this.voucherDetailValidationService.validateDetail(
            detailItems as any,
            headerItem as any
          );

        // If there are detail errors, collect them
        if (
          detailValidationResult &&
          (detailValidationResult as any).error &&
          Array.isArray((detailValidationResult as any).errors)
        ) {
          const warningsArray = (detailValidationResult as any).warnings as
            | {
                index: number;
                warnings: { field: string; message: string }[];
              }[]
            | undefined;
          const flatWarnings =
            warningsArray?.flatMap((wObj) =>
              (wObj.warnings || []).map((w) => ({
                field: w.field,
                message: w.message,
                code: "Validation error",
                id: String(wObj.index),
              }))
            ) ?? [];

          const flatErrors = (detailValidationResult as any).errors.flatMap(
            (errObj: {
              index: number;
              errors: { field: string; code: string; message: string }[];
            }) =>
              errObj.errors.map((e) => ({
                field: e.field,
                message: e.message,
                code: "Validation error",
                id: String(errObj.index),
              }))
          );

          // Add detail errors to the result
          if (flatErrors.length > 0) {
            result.errors = {
              code: ERROR_CONSTANTS.VALIDATION_ERROR.code,
              message: ERROR_CONSTANTS.VALIDATION_ERROR.message,
              details: flatErrors,
            };
          }

          // Add detail warnings to the result
          if (flatWarnings.length > 0) {
            result.warnings = {
              code: ERROR_CONSTANTS.VALIDATION_ERROR.code,
              message: ERROR_CONSTANTS.VALIDATION_ERROR.message,
              details: flatWarnings,
            };
          }
        }

        // If only warnings exist, collect them
        if (
          detailValidationResult &&
          Array.isArray((detailValidationResult as any).warnings) &&
          ((detailValidationResult as any).warnings as any[]).length > 0 &&
          !result.warnings // Only add if we don't already have warnings from errors
        ) {
          const warningsArray = (detailValidationResult as any).warnings as {
            index: number;
            warnings: { field: string; message: string }[];
          }[];
          const flatWarnings = warningsArray.flatMap((wObj) =>
            (wObj.warnings || []).map((w) => ({
              field: w.field,
              message: w.message,
              code: "Validation error",
              id: String(wObj.index),
            }))
          );

          result.warnings = {
            code: ERROR_CONSTANTS.VALIDATION_ERROR.code,
            message: ERROR_CONSTANTS.VALIDATION_ERROR.message,
            details: flatWarnings,
          };
        }
      } catch (error) {
        this.logger.error(
          `Detail validation failed for voucher ${headerItem.entryNo}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
        // Continue with header validation results even if detail validation fails
      }
    }

    return result;
  }

  public getHoldDescFromVendorHoldCode(vendorHoldPaymentsVend: string) {
    switch (vendorHoldPaymentsVend) {
      case "H":
        return "VENDOR ON HOLD";
      case "A":
        return "ON HOLD FOR ACH";
      case "W":
        return "ON HOLD FOR WIRE TRANSFER";
      case "U":
        return "ON HOLD FOR UTILITY AUTO";
      default:
        return "";
    }
  }

  /**
   * Reusable method for calculating newDueDate and newDiscountDueDate
   * Used in headerValidation() and external APIs.
   */
  public async computeDueDatesWithVendorAndGstabl(
    companyNo: number,
    vendorNo: number,
    invoiceDate: string,
    dueDate: string | undefined,
    discountDueDate: string | undefined,
    errors: { field: string; code: string; message: string }[],
    warnings: { field: string; code: string; message: string }[],
    startTime: number
  ): Promise<{
    extendedDueDate: number;
    extendedDiscountDueDate: number;
    foundVendor: Vendor | null;
  }> {
    if (invoiceDate && !validateMMDDYY(invoiceDate)) {
      this.voucherHeaderValidationService.addNewError(
        errors,
        HEADER.INVOICE_DATE,
        ERROR_MESSAGES.INVALID_INVOICE_DATE
      );
    }

    this.logger.sharedTiming("Date validation completed", startTime);

    const vendorLookupStartTime = Date.now();
    // First fetch vendor (single call instead of duplicate)
    let foundVendor: Vendor | null = null;
    try {
      foundVendor = await this.vendorAppService.findVendorByNo(
        vendorNo,
        companyNo
      );
    } catch (error: any) {
      this.logger.warn(
        `Vendor with vendorNo: ${vendorNo} and companyNo: ${companyNo} not found.`
      );
      // Add vendor validation error to errors array instead of throwing exception
      this.voucherHeaderValidationService.addNewError(
        errors,
        "vendorNo",
        `Vendor with vendorNo: ${vendorNo} and companyNo: ${companyNo} not found.`
      );
      // Set foundVendor to null to continue processing
      foundVendor = null;
    }

    // Then fetch GSTable record using the vendor object (no duplicate vendor lookup)
    const foundGstablRecord = foundVendor
      ? await this.voucherHeaderValidationService.fetchGstablRecord(foundVendor)
      : null;

    this.logger.sharedTiming(
      `Vendor and GSTable lookup completed (${Date.now() - vendorLookupStartTime}ms)`,
      startTime
    );

    // Calculate new due dates and discount due dates.
    const dueDateCalculationStartTime = Date.now();

    // Ensure vendor AP terms code is available (default to 0 if not found)
    const vendorApTermsCode = foundVendor?.vendorApTermsCode ?? 0;

    const calculatedDueDate =
      this.voucherHeaderValidationService.calculateDueDate(
        invoiceDate,
        vendorApTermsCode,
        foundGstablRecord
          ? (foundGstablRecord as unknown as GeneralSystemEntity)
          : null,
        dueDate
      );

    const newDueDate = await this.apdateInterface.getNewDate(
      companyNo,
      convertMMDDYYtoYYYYMMDD(calculatedDueDate)
    );

    const calculatedDiscountDueDate =
      this.voucherHeaderValidationService.calculateDiscountDueDate(
        invoiceDate,
        vendorApTermsCode,
        foundGstablRecord
          ? (foundGstablRecord as unknown as GeneralSystemEntity)
          : null,
        discountDueDate
      );

    const newDiscountDueDate =
      Number(calculatedDiscountDueDate) !== 0
        ? await this.apdateInterface.getNewDate(
            companyNo,
            convertMMDDYYtoYYYYMMDD(calculatedDiscountDueDate)
          )
        : calculatedDiscountDueDate;

    this.logger.log(
      `calculatedDueDate: ${calculatedDueDate}, calculatedDiscountDueDate: ${calculatedDiscountDueDate}`
    );

    this.logger.log(
      `NewDueDate: ${newDueDate}, newDiscountDueDate: ${newDiscountDueDate}`
    );

    this.logger.sharedTiming(
      `Due date calculations completed (${Date.now() - dueDateCalculationStartTime}ms)`,
      startTime
    );

    // Extend due dates using the provided logic - BULK METHOD for performance
    const extendDateStartTime = Date.now();
    const extendedDates =
      await this.voucherHeaderValidationService.extendMultipleDates([
        newDueDate,
        newDiscountDueDate,
      ]);

    // Safely extract the extended dates with fallback to original dates
    const extendedDueDate = extendedDates[0] ?? newDueDate;
    const extendedDiscountDueDate = extendedDates[1] ?? newDiscountDueDate;
    this.logger.sharedTiming(
      `Date extension completed (${Date.now() - extendDateStartTime}ms)`,
      startTime
    );

    // Validate the extended due dates and collect errors if any.
    this.voucherHeaderValidationService.validateDate(
      extendedDueDate,
      HEADER.DUE_DATE,
      errors
    );

    // check if the extended discount due date is not 0
    if (extendedDiscountDueDate !== DEFAULT_DISCOUNT_DUE_DATE) {
      this.voucherHeaderValidationService.validateDate(
        extendedDiscountDueDate,
        HEADER.DISCOUNT_DUE_DATE,
        errors
      );
      // check if the extended discount due date is missed
      this.voucherHeaderValidationService.validateMissedDiscount(
        extendedDiscountDueDate,
        warnings
      );
    }

    this.logger.sharedTiming(
      "Extended due date validation completed",
      startTime
    );

    return {
      extendedDueDate: Number(extendedDueDate),
      extendedDiscountDueDate: Number(extendedDiscountDueDate),
      foundVendor,
    };
  }
}
