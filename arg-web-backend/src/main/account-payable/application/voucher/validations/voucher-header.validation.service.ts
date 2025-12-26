import { Inject, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { GeneralSystemEntity } from "@src/main/account-payable/domain/entities/general-system.entity";
import {
  DEFAULT_DISCOUNT_DUE_DATE,
  STATUS,
} from "@src/shared/constants/constant";
import {
  addDaysToMMDDYY,
  convertMMDDYYtoYYYYMMDD,
  convertYYYYMMDDtoMMDDYY,
  validateMMDDYY,
} from "@src/shared/utils/format-date";
import { ValidationError } from "@src/shared/utils/error-handler";
import {
  HEADER,
  HOLD_CODE,
  INVOICE_TYPE,
  PREPAID,
  PROCESS_TYPE_ENUM,
} from "@src/shared/constants/constant";
import { ERROR_MESSAGES } from "@src/shared/constants/error-constant";
import { GlMasterService } from "@src/main/account-payable/domain/services/gl-master/gl-master.service";
import { ApdateAppService } from "@src/main/account-payable/domain/services/apdate/apdate.service";
import { GeneralSystemService } from "@src/main/account-payable/domain/services/general-system/general-system.service";
import { Vendor } from "@src/main/account-payable/domain/entities/vendor.entity";
import { C } from "@src/shared/constants/constant";
import { VoucherHeaderInterface } from "@src/main/account-payable/domain/interface/voucher.interface";

@Injectable()
export class VoucherHeaderValidationService {
  private readonly logger = new AppLogger(VoucherHeaderValidationService.name);

  constructor(
    private readonly generalSystemService: GeneralSystemService,
    private readonly apdateAppService: ApdateAppService,
    private readonly glMasterService: GlMasterService,
    @Inject("VoucherHeaderInterface")
    private readonly voucherHeaderInterface: VoucherHeaderInterface
  ) {}

  // Fetches ZGSTABL record based on vendor object (no duplicate vendor lookup)
  public async fetchGstablRecord(vendor: Vendor | null) {
    const startTime = Date.now();
    this.logger.sharedTiming("Starting fetchGstablRecord", startTime, "start");

    // Skip vendor lookup since it's already provided
    this.logger.sharedTiming(
      "Vendor lookup skipped (already provided)",
      startTime
    );

    // If vendor AP terms code exists, fetch corresponding ZGSTABL record
    const result = vendor?.vendorApTermsCode
      ? await this.generalSystemService.getGeneralSystemRecord(
          "APTERM",
          vendor.vendorApTermsCode.toString().padStart(2, "0")
        )
      : null; // Return null if no AP terms code is available

    this.logger.sharedTiming("fetchGstablRecord completed", startTime, "end");
    return result;
  }

  // Calculates the due date based on invoice date and payment terms
  public calculateDueDate(
    invoiceDate: string, // Invoice issue date
    vendorApTermsCode: number, // AP terms code of the vendor
    generalSystemRecord: GeneralSystemEntity | null, // ZGSTABL record containing payment terms
    dueDate?: string // Provided due date (if available)
  ): string {
    const startTime = Date.now();
    this.logger.sharedTiming("Starting calculateDueDate", startTime, "start");

    // Return provided due date if it exists
    if (dueDate) {
      this.logger.sharedTiming(
        "calculateDueDate completed (using provided date)",
        startTime,
        "end"
      );

      return dueDate;
    }

    if (!generalSystemRecord) {
      this.logger.sharedTiming(
        "calculateDueDate completed (no general system record)",
        startTime,
        "end"
      );
      return invoiceDate;
    }

    // If vendor AP terms are valid and record is not marked as deleted
    if (
      vendorApTermsCode &&
      generalSystemRecord?.isDeleted !== STATUS.DELETED
    ) {
      // If net days are specified, calculate due date by adding net days to invoice date
      if (generalSystemRecord?.netDays > 0) {
        const result = addDaysToMMDDYY(
          invoiceDate,
          generalSystemRecord.netDays
        );
        this.logger.sharedTiming(
          "calculateDueDate completed (using net days)",
          startTime,
          "end"
        );

        return result;

        // If prox days are specified, calculate due date using discount days
      } else if (generalSystemRecord?.proxDays > 0) {
        const result = addDaysToMMDDYY(
          invoiceDate,
          generalSystemRecord.discountDays
        );
        this.logger.sharedTiming(
          "calculateDueDate completed (using prox days)",
          startTime,
          "end"
        );

        return result;
      }
    }

    // Default: Add 30 days to the invoice date if no other condition applies
    const result = addDaysToMMDDYY(invoiceDate, 30);
    this.logger.sharedTiming(
      "calculateDueDate completed (using default 30 days)",
      startTime,
      "end"
    );
    return result;
  }

  // Calculates the discount due date based on invoice date and payment terms
  public calculateDiscountDueDate(
    invoiceDate: string, // Invoice issue date
    vendorApTermsCode: number, // AP terms code of the vendor
    generalSystemRecord: GeneralSystemEntity | null, // ZGSTABL record containing payment terms
    discountDueDate?: string // Provided discount due date (if available)
  ): string {
    const startTime = Date.now();
    this.logger.sharedTiming(
      "Starting calculateDiscountDueDate",
      startTime,
      "start"
    );

    // Return provided discount due date if it exists
    if (discountDueDate) {
      this.logger.sharedTiming(
        "calculateDiscountDueDate completed (using provided date)",
        startTime,
        "end"
      );
      return discountDueDate;
    }

    if (!generalSystemRecord) {
      this.logger.sharedTiming(
        "calculateDiscountDueDate completed (no general system record)",
        startTime,
        "end"
      );
      return invoiceDate;
    }

    // If vendor AP terms are valid, record is not deleted, and discount is available
    if (
      vendorApTermsCode > 0 &&
      generalSystemRecord?.isDeleted !== "D" &&
      generalSystemRecord?.discountDays > 0
    ) {
      // Calculate discount due date by adding discount days to invoice date
      const result = addDaysToMMDDYY(
        invoiceDate,
        generalSystemRecord.discountDays
      );
      this.logger.sharedTiming(
        "calculateDiscountDueDate completed (using discount days)",
        startTime,
        "end"
      );
      return result;
    } else {
      this.logger.sharedTiming(
        "calculateDiscountDueDate completed (using invoice date)",
        startTime,
        "end"
      );
      return DEFAULT_DISCOUNT_DUE_DATE;
    }
  }

  // Extends a given date if a new date is available in the APDATE record
  public async extendDate(date: string): Promise<string> {
    const startTime = Date.now();
    this.logger.sharedTiming("Starting extendDate", startTime, "start");

    // Extends a given date if a new date is available in the APDATE record
    try {
      // Fetch corresponding APDATE record for the given date
      const apdateRecord = await this.apdateAppService.getApdateRecord(
        convertMMDDYYtoYYYYMMDD(date)
      );

      this.logger.sharedTiming("APDATE record lookup completed", startTime);

      // If a new date is available, use it; otherwise, keep the original date
      const result = apdateRecord
        ? convertYYYYMMDDtoMMDDYY(apdateRecord.newDate)
        : date;

      this.logger.sharedTiming("extendDate completed", startTime, "end");
      return result;
    } catch (error: any) {
      this.logger.error(`Error extending date: ${error.message}`);
      this.logger.sharedTiming(
        "extendDate completed with error",
        startTime,
        "end"
      );
      return date; // Return original date if there's an error
    }
  }

  /**
   * Bulk extend multiple dates in one database call
   * This significantly improves performance when multiple dates need to be extended
   */
  public async extendMultipleDates(dates: string[]): Promise<string[]> {
    const startTime = Date.now();
    this.logger.sharedTiming(
      "Starting extendMultipleDates",
      startTime,
      "start"
    );

    try {
      // Convert all MMDDYY dates to YYYYMMDD format
      const calculatedDates = dates.map((date) =>
        convertMMDDYYtoYYYYMMDD(date)
      );

      // Get all APDATE records in one database call
      const apdateRecords =
        await this.apdateAppService.getBulkApdateRecords(calculatedDates);

      this.logger.sharedTiming(
        "Bulk APDATE record lookup completed",
        startTime
      );

      // Extend each date based on the fetched records
      const extendedDates = dates.map((date) => {
        const calculatedDate = convertMMDDYYtoYYYYMMDD(date);
        const apdateRecord = apdateRecords.get(calculatedDate);

        return apdateRecord
          ? convertYYYYMMDDtoMMDDYY(apdateRecord.newDate)
          : date;
      });

      this.logger.sharedTiming(
        "extendMultipleDates completed",
        startTime,
        "end"
      );
      return extendedDates;
    } catch (error: any) {
      this.logger.error(`Error extending multiple dates: ${error.message}`);
      this.logger.sharedTiming(
        "extendMultipleDates completed with error",
        startTime,
        "end"
      );
      return dates; // Return original dates if there's an error
    }
  }

  public validateMissedDiscount(
    discountDueDate: string,
    warnings: ValidationError[]
  ): void {
    const startTime = Date.now();
    this.logger.sharedTiming(
      "Starting validateMissedDiscount",
      startTime,
      "start"
    );

    if (!validateMMDDYY(discountDueDate)) return;

    const today = new Date();
    const entryDateYYYYMMDD = Number(
      today.toISOString().slice(0, 10).replace(/-/g, "")
    );
    const discountYYYYMMDD = Number(convertMMDDYYtoYYYYMMDD(discountDueDate));

    this.logger.debug(
      `Comparing entryDate=${entryDateYYYYMMDD} with discountDueDate=${discountYYYYMMDD}`
    );
    // If entry date is on or after discount due date → missed discount
    if (entryDateYYYYMMDD >= discountYYYYMMDD) {
      warnings.push({
        field: HEADER.DISCOUNT_DUE_DATE,
        code: "MISSED_DISCOUNT",
        message:
          "Missed Discount: Voucher entered on or after discount due date",
      });
    }

    this.logger.sharedTiming(
      "validateMissedDiscount completed (using discount due date)",
      startTime,
      "end"
    );
  }

  public addNewError(
    errors: ValidationError[],
    field: string,
    errorMsg: string
  ) {
    if (!errors?.find((error) => error?.field === field)) {
      errors.push({ field, message: errorMsg, code: field });
    }
  }

  // Validates a given date and pushes an error if the date is invalid
  public validateDate(
    date: string,
    field: string,
    errors: ValidationError[]
  ): void {
    // If the date is not in valid MMDDYY format, record an error
    if (!validateMMDDYY(date)) {
      // errors.push({ field, error: `INVALID ${field.toUpperCase()} ENTERED` });
      this.addNewError(errors, field, `INVALID ${field.toUpperCase()} ENTERED`);
    }
  }

  // Validates the CarrierInvoiceHeader record based on the process type and adds errors if conditions are not met.
  public validateCarrierInvoiceHeaderRecord(record, processType, errors, vendorCarrierId?: string) {
    const startTime = Date.now();
    this.logger.sharedTiming(
      "Starting validateCarrierInvoiceHeaderRecord",
      startTime,
      "start"
    );

    // Validation for NORMAL process type
    if (processType === PROCESS_TYPE_ENUM.NORMAL) {
      // Check if the AP invoice status is missing
      if (!record.apInvoiceStatus) {
        this.addNewError(
          errors,
          HEADER.INVOICE_NO,
          ERROR_MESSAGES.INVALID_FREIGHT_INVOICE
        );
      }

      if (record.invoiceType) {
        record.invoiceType = record.invoiceType?.toString()?.toUpperCase();
      }
      
      // Trim carrierId values for comparison (handle whitespace differences)
      const recordCarrierIdTrimmed = record.carrierId?.toString().trim();
      const vendorCarrierIdTrimmed = vendorCarrierId?.toString().trim();
      
      // Check if invoice type is 'O' or 'S', which requires the ARGLMS process type
      // Only show error if carrierId from record matches the vendor's carrierId
      if ([INVOICE_TYPE.O, INVOICE_TYPE.S].includes(record.invoiceType) 
          && record.companyNo 
          && recordCarrierIdTrimmed 
          && recordCarrierIdTrimmed === vendorCarrierIdTrimmed) {
        this.addNewError(
          errors,
          HEADER.INVOICE_NO,
          ERROR_MESSAGES.PROCESS_TYPE_ARGLMS_REQUIRED
        );
      }

      // Check if invoice type is 'P', which requires the PAPER process type
      // Only show error if carrierId from record matches the vendor's carrierId
      if (record.invoiceType === INVOICE_TYPE.P 
          && record.companyNo 
          && recordCarrierIdTrimmed 
          && recordCarrierIdTrimmed === vendorCarrierIdTrimmed) {
        this.addNewError(
          errors,
          HEADER.INVOICE_NO,
          ERROR_MESSAGES.PROCESS_TYPE_PAPER_REQUIRED
        );
      }
    }

    // Validation for PAPER process type: Invoice type must be 'P'
    if (
      processType === PROCESS_TYPE_ENUM.PAPER &&
      record.invoiceType !== INVOICE_TYPE.P
    ) {
      this.addNewError(
        errors,
        HEADER.INVOICE_NO,
        ERROR_MESSAGES.FREIGHT_INVOICE_USE_ARGLMS
      );
    }

    // Validation for ARGLMS process type: Invoice type must be 'O' or 'S'
    if (
      processType === PROCESS_TYPE_ENUM.ARGLMS &&
      ![INVOICE_TYPE.O, INVOICE_TYPE.S].includes(record.invoiceType)
    ) {
      this.addNewError(
        errors,
        HEADER.INVOICE_NO,
        ERROR_MESSAGES.FREIGHT_INVOICE_USE_PAPER
      );
    }

    this.logger.sharedTiming(
      "validateCarrierInvoiceHeaderRecord completed",
      startTime,
      "end"
    );
  }

  // Determines if the validation should be skipped based on hold code, prepaid information, and invoice amount.
  public shouldSkipValidation(
    invoiceAmount: number,
    prepaidCheckNo?: number,
    prepaidCheckdate?: number,
    holdCode?: string,
    prepaidCode?: string
  ): boolean {
    const startTime = Date.now();
    this.logger.sharedTiming(
      "Starting shouldSkipValidation",
      startTime,
      "start"
    );

    // Skip validation if the hold code is 'W'
    if (holdCode === HOLD_CODE.W) {
      this.logger.sharedTiming(
        "shouldSkipValidation completed (hold code W)",
        startTime,
        "end"
      );
      return true;
    }

    // Skip validation if prepaid conditions are met
    if (
      prepaidCode === PREPAID.P &&
      invoiceAmount < 0 &&
      prepaidCheckNo &&
      prepaidCheckdate
    ) {
      this.logger.sharedTiming(
        "shouldSkipValidation completed (prepaid conditions met)",
        startTime,
        "end"
      );
      return true;
    }

    this.logger.sharedTiming(
      "shouldSkipValidation completed (no skip)",
      startTime,
      "end"
    );
    return false;
  }

  // Validates the voucher headers to ensure no duplicate invoice numbers exist.
  public async validateVoucherHeaders(
    companyNo: number,
    vendorNo: number,
    invoiceNo: string,
    entryNo: number | undefined,
    errors: ValidationError[]
  ) {
    const startTime = Date.now();
    this.logger.sharedTiming(
      "Starting validateVoucherHeaders",
      startTime,
      "start"
    );

    // Get both duplicate status and table information in one call
    const duplicateResult =
      await this.voucherHeaderInterface.checkDuplicateInvoiceWithTable(
        companyNo,
        vendorNo,
        invoiceNo,
        entryNo
      );

    this.logger.sharedTiming("Voucher headers lookup completed", startTime);

    this.logger.log(
      `Duplicate invoice check result: ${duplicateResult.isDuplicate ? `Found in ${duplicateResult.tableName}` : "No duplicate found"}`
    );

    // If duplicate found, add specific error based on table
    if (duplicateResult.isDuplicate && duplicateResult.tableName) {
      let errorMessage: string;

      switch (duplicateResult.tableName) {
        case "APTRANH":
          errorMessage = ERROR_MESSAGES.DUPLICATE_INVOICE_NUMBER_APTRANH;
          break;
        case "APOPNH":
          errorMessage = ERROR_MESSAGES.DUPLICATE_INVOICE_NUMBER_APOPNH;
          break;
        case "APHSTH":
          errorMessage = ERROR_MESSAGES.DUPLICATE_INVOICE_NUMBER_APHSTH;
          break;
        default:
          errorMessage = ERROR_MESSAGES.DUPLICATE_INVOICE_NUMBER;
      }

      this.addNewError(errors, HEADER.INVOICE_NO, errorMessage);
    }

    this.logger.sharedTiming(
      "validateVoucherHeaders completed",
      startTime,
      "end"
    );
  }

  public validateHoldCode(
    vendor: Vendor,
    errors: ValidationError[],
    holdCode?: string
  ) {
    const startTime = Date.now();
    this.logger.sharedTiming("Starting validateHoldCode", startTime, "start");

    // Validate if the hold code is 'A' (ACH payment) and if the vendor is not set for ACH payments
    if (
      holdCode === HOLD_CODE.A &&
      vendor?.vendorHoldPaymentsVend !== HOLD_CODE.A
    ) {
      this.addNewError(
        errors,
        HEADER.HOLD_CODE,
        ERROR_MESSAGES.VENDOR_NOT_ACH_PAYMENT
      );
      // Log a warning for invalid hold code
      this.logger.warn("Invalid hold code for vendor.");
    }

    this.logger.sharedTiming("validateHoldCode completed", startTime, "end");
  }

  public async validateGlNumber(
    companyNo: number,
    glNo: number,
    field: string,
    errorMessage: string,
    errors: ValidationError[]
  ) {
    const startTime = Date.now();
    this.logger.sharedTiming(
      `Starting validateGlNumber for ${field}`,
      startTime,
      "start"
    );

    // If GL number is not provided, skip validation
    if (!glNo) {
      this.logger.sharedTiming(
        `validateGlNumber skipped for ${field} (no GL number)`,
        startTime,
        "end"
      );
      return;
    }

    // Divide GL number into main (first 6 digits) and sub (next 2 digits)
    const glNoStr = glNo?.toString().padStart(8, "0");
    const mainGl = parseInt(glNoStr.slice(0, 6), 10);
    const subGl = parseInt(glNoStr.slice(6, 8), 10);

    this.logger.sharedTiming(
      `GL number parsing completed for ${field}`,
      startTime
    );

    // Extract main and sub GL numbers

    // Check if the GL number exists in the ZGLMAST records with try-catch
    try {
      const foundRecord = await this.glMasterService.getGlMasterRecord(
        companyNo,
        mainGl,
        subGl,
        C
      );

      this.logger.sharedTiming(
        `GL master lookup completed for ${field}`,
        startTime
      );

      // If no matching record is found, log the error and add it to the errors array
      if (!foundRecord) {
        this.addNewError(errors, field, errorMessage);
        this.logger.warn(`${errorMessage} : ${field}`);
      }
    } catch (error: any) {
      this.logger.warn(
        `GL Master validation failed for ${field}: ${error.message}`
      );
      // Add GL validation error to errors array instead of throwing exception
      this.addNewError(errors, field, errorMessage);
    }

    this.logger.sharedTiming(
      `validateGlNumber completed for ${field}`,
      startTime,
      "end"
    );
  }
}
