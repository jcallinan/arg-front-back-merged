import { Injectable, Inject } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { ValidationError } from "@src/shared/utils/error-handler";
import { FIELD_NAMES, HEADER } from "@src/shared/constants/constant";
import { ERROR_MESSAGES } from "@src/shared/constants/errorConstants";
import { Vendor } from "@src/main/account-payable/domain/entities/vendor.entity";
import { InventoryFutureTransInterface } from "@src/main/account-payable/domain/interface/inventory-future-trans.interface";
import { InventoryHistoryInterface } from "@src/main/account-payable/domain/interface/inventory-history.interface";
import { GlMasterEntity } from "@src/main/account-payable/domain/entities/gl-master.entity";
import { GlMasterInterface } from "@src/main/account-payable/domain/interface/gl-master.interface";

@Injectable()
export class VoucherDetailValidation {
  private readonly logger = new AppLogger(VoucherDetailValidation.name);

  constructor(
    @Inject("GlMasterInterface")
    private readonly glMasterInterface: GlMasterInterface,
    @Inject("InventoryHistoryInterface")
    private readonly inventoryHistoryInterface: InventoryHistoryInterface,
    @Inject("InventoryFutureTransInterface")
    private readonly inventoryFutureTransInterface: InventoryFutureTransInterface
  ) { }

  public addNewError(
    errors: ValidationError[],
    field: string,
    errorMsg: string
  ) {
    if (!errors?.find((error) => error?.field === field)) {
      errors.push({ field, message: errorMsg, code: field });
    }
  }

  public addNewWarning(
    warnings: ValidationError[],
    field: string,
    warningMsg: string
  ) {
    if (!warnings?.find((warn) => warn?.field === field)) {
      warnings.push({ field, message: warningMsg, code: field });
    }
  }

  public getEntrySequence = (length: number): string => {
    // Convert to a string and pad it to length 3
    return length.toString().padStart(3, "0");
  };
  // Utility method to get a valid line GL number
  public getValidLineGlNo(lineGlNo?: number, fallback?: number): number {
    // If lineGlNo is provided, return it; otherwise, return fallback or 0
    return lineGlNo || fallback || 0;
  }

  // Method to validate discount-related conditions
  public validateDiscounts(
    errors: ValidationError[],
    discountAmount?: number,
    discountPercentage?: number,
    companyDiscountsGlNo?: number
  ): void {
    const startTime = Date.now();
    this.logger.sharedTiming("Starting validateDiscounts", startTime, "start");

    // If both discount amount and discount percentage are present, add conflict errors
    if (discountAmount && discountPercentage) {
      this.addNewError(
        errors,
        FIELD_NAMES.DETAIL.DISCOUNT_AMOUNT,
        ERROR_MESSAGES.LINE_DISCOUNT_CONFLICT
      );
      this.addNewError(
        errors,
        FIELD_NAMES.DETAIL.DISCOUNT_PERCENTAGE,
        ERROR_MESSAGES.LINE_DISCOUNT_CONFLICT
      );
    }

    // If either discount amount or percentage is present without a valid company GL number, add error
    if ((discountAmount || discountPercentage) && !companyDiscountsGlNo) {
      this.addNewError(
        errors,
        discountAmount
          ? FIELD_NAMES.DETAIL.DISCOUNT_AMOUNT
          : FIELD_NAMES.DETAIL.DISCOUNT_PERCENTAGE,
        ERROR_MESSAGES.INVALID_DISCOUNT_GL
      );
    }

    this.logger.sharedTiming("validateDiscounts completed", startTime, "end");
  }

  public validateQuantity(
    errors: ValidationError[],
    quantity?: number
  ): void {
    if (quantity && quantity !== Math.floor(quantity)) {
      this.addNewError(errors, FIELD_NAMES.DETAIL.QUANTITY, ERROR_MESSAGES.INVALID_QUANTITY);
  }
  }

  // Method to validate and fetch Glmast record
  public async validateGlmastRecord(
    lineGlNo: number | undefined,
    companyNo: number,
    errors: ValidationError[]
  ): Promise<GlMasterEntity | null> {
    const startTime = Date.now();
    this.logger.sharedTiming(
      "Starting validateGlmastRecord",
      startTime,
      "start"
    );

    if (!lineGlNo) {
      this.logger.sharedTiming(
        "validateGlmastRecord completed (missing lineGlNo)",
        startTime,
        "end"
      );
      return null;
    }

    this.logger.log(
      `Validating GLMast record with companyNo: ${companyNo}, lineGlNo: ${lineGlNo}`
    );

    this.logger.sharedTiming("LineGlNo validation completed", startTime);

    const accountNo = parseInt(lineGlNo.toString().slice(0, 6));
    const subAccountNos = [parseInt(lineGlNo.toString().slice(6))];

    // Fetch Glmast record using both padded and unpadded sub-account numbers, and include all records for validation
    const glLookupStartTime = Date.now();
    let glmastRecord: GlMasterEntity | null = null;

    try {
      glmastRecord = await this.glMasterInterface.findOne(
        companyNo,
        accountNo,
        subAccountNos,
        FIELD_NAMES.C,
        false // activeOnly: false to get all records for validation
      );
    } catch (error) {
      // If GL master lookup fails (e.g., record not found), add error instead of throwing exception
      // This preserves the detail line context for proper error reporting
      this.logger.warn(
        `GL master lookup failed for lineGlNo: ${lineGlNo}, error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      this.addNewError(
        errors,
        FIELD_NAMES.DETAIL.LINE_GL_NO,
        ERROR_MESSAGES.INVALID_DETAIL_GL
      );
      // Continue validation with null record
    }

    this.logger.sharedTiming(
      `GL master lookup completed (${Date.now() - glLookupStartTime}ms)`,
      startTime
    );

    // Check if the found record is deleted or inactive, and add error if so
    if (
      glmastRecord &&
      (glmastRecord?.isDeleted === FIELD_NAMES.STATUS.DELETED ||
        glmastRecord?.isDeleted === FIELD_NAMES.STATUS.INACTIVE)
    ) {
      this.addNewError(
        errors,
        FIELD_NAMES.DETAIL.LINE_GL_NO,
        ERROR_MESSAGES.INVALID_DETAIL_GL
      );
    }

    if (glmastRecord) {
      this.logger.debug(
        `GL master record found: ${JSON.stringify({
          accountNo: glmastRecord.accountNo,
          subAccountNo: glmastRecord.subAccountNo,
          description: glmastRecord.description,
        })}`
      );
    } else {
      this.logger.warn(`GL master record not found for lineGlNo: ${lineGlNo}`);
    }

    this.logger.sharedTiming(
      "validateGlmastRecord completed",
      startTime,
      "end"
    );

    // Return the found record or null
    return glmastRecord ? (glmastRecord as unknown as GlMasterEntity) : null;
  }

  // Method to validate sales order conditions
  public validateSalesOrder(
    salesOrderNo: string,
    receiptNo: string,
    gallons: string,
    errors: ValidationError[],
    warnings?: ValidationError[]
  ): void {
    const startTime = Date.now();
    this.logger.sharedTiming("Starting validateSalesOrder", startTime, "start");

    this.logger.log(
      `Validating sales order: salesOrderNo=${salesOrderNo}, receiptNo=${receiptNo}, gallons=${gallons}`
    );

    // If sales order number is provided and either receipt number or gallons exist, add error
    // Handle each field (receiptNo and gallons) individually for validation
    if (parseInt(salesOrderNo)) {
      if (receiptNo) {
        // Treat receipt presence under SO as a warning (receipt-related)
        if (warnings) {
          this.addNewWarning(
            warnings,
            FIELD_NAMES.DETAIL.RECEIPT_NO,
            ERROR_MESSAGES.NO_RECEIPT_ALLOWED
          );
        } else {
          this.addNewError(
            errors,
            FIELD_NAMES.DETAIL.RECEIPT_NO,
            ERROR_MESSAGES.NO_RECEIPT_ALLOWED
          );
        }
      }
      if (parseInt(gallons)) {
        this.addNewError(
          errors,
          FIELD_NAMES.DETAIL.GALLONS,
          ERROR_MESSAGES.NO_GAL_ALLOWED
        );
      }
    }

    this.logger.sharedTiming("validateSalesOrder completed", startTime, "end");
  }

  // Validate vendor-specific requirements for gallons and receipt number
  public validateVendorRequirements(
    vendor: Vendor | null,
    { gallons, receiptNo }: { gallons: number; receiptNo: number },
    errors: ValidationError[],
    warnings?: ValidationError[]
  ): void {
    const startTime = Date.now();
    this.logger.sharedTiming(
      "Starting validateVendorRequirements",
      startTime,
      "start"
    );

    // If no vendor is provided, exit the function
    if (!vendor) {
      this.logger.sharedTiming(
        "validateVendorRequirements completed (no vendor)",
        startTime,
        "end"
      );
      return;
    }

    this.logger.log(
      `Validating vendor requirements for vendor ${vendor.vendorNo}: galRcptsRequired=${vendor.vendorGalRcptsRequired}, gallons=${gallons}, receiptNo=${receiptNo}`
    );

    // Extract the vendor's requirement flag for gallons and receipts
    const { vendorGalRcptsRequired } = vendor;

    this.logger.sharedTiming("Vendor data extraction completed", startTime);

    // Define validation rules based on vendor requirements
    const validations = [
      {
        // If vendor requires gallons but it's missing, add an error
        condition: vendorGalRcptsRequired === FIELD_NAMES.YES && !gallons,
        field: FIELD_NAMES.DETAIL.GALLONS,
        error: ERROR_MESSAGES.GALLONS_REQUIRED,
      },
      {
        // If vendor requires receipt number but it's missing, treat as warning (receipt-related)
        condition: vendorGalRcptsRequired === FIELD_NAMES.YES && !receiptNo,
        field: FIELD_NAMES.DETAIL.RECEIPT_NO,
        error: ERROR_MESSAGES.RECEIPT_REQUIRED,
      },
      {
        // If vendor does not allow gallons but gallons are provided, add an error
        condition: vendorGalRcptsRequired === FIELD_NAMES.NO && gallons,
        field: FIELD_NAMES.DETAIL.GALLONS,
        error: ERROR_MESSAGES.GALLONS_NOT_ALLOWED,
      },
      {
        // If vendor does not allow receipt number but it's provided, treat as warning (receipt-related)
        condition: vendorGalRcptsRequired === FIELD_NAMES.NO && receiptNo,
        field: FIELD_NAMES.DETAIL.RECEIPT_NO,
        error: ERROR_MESSAGES.RECEIPT_NOT_ALLOWED,
      },
    ];

    // Iterate through validation rules and push errors if conditions are met
    const rulesStartTime = Date.now();
    validations.forEach(({ condition, field, error }) => {
      if (!condition) return;
      if (field === FIELD_NAMES.DETAIL.RECEIPT_NO && warnings) {
        this.addNewWarning(warnings, field, error);
      } else {
        this.addNewError(errors, field, error);
      }
    });

    this.logger.sharedTiming(
      `Validation rules processing completed (${Date.now() - rulesStartTime}ms)`,
      startTime
    );

    const errorCount = validations.filter((rule) => rule.condition).length;
    if (errorCount > 0) {
      this.logger.debug(
        `Found ${errorCount} vendor requirement validation errors`
      );
    }

    this.logger.sharedTiming(
      "validateVendorRequirements completed",
      startTime,
      "end"
    );
  }

  // Validate the compatibility between Glmast record and vendor for gallon requirements
  public validateGallonAndVendor(
    glMastData: any,
    foundVendor: Vendor | null,
    errors: ValidationError[]
  ) {
    const validationRules = [
      {
        // If GL requires gallons but the vendor does not allow them, add an error
        condition:
          glMastData?.keyApGal === FIELD_NAMES.YES &&
          foundVendor?.vendorGalRcptsRequired === FIELD_NAMES.NO,
        field: FIELD_NAMES.DETAIL.GALLONS,
        error: ERROR_MESSAGES.GL_REQUIRES_GALLONS_BUT_VENDOR_DOES_NOT,
      },
      {
        // If GL does not require gallons but the vendor does, add an error
        condition:
          glMastData?.keyApGal !== FIELD_NAMES.YES &&
          foundVendor?.vendorGalRcptsRequired === FIELD_NAMES.YES,
        field: FIELD_NAMES.DETAIL.GALLONS,
        error: ERROR_MESSAGES.VENDOR_REQUIRES_GALLONS_WRONG_GL,
      },
    ];

    // Iterate through validation rules and push errors if conditions are met
    validationRules.forEach(({ condition, field, error }) => {
      if (condition) {
        this.addNewError(errors, field, error);
      }
    });
  }

  // Validate the purchase order (PO) requirement based on the Glmast record
  public validatePoRequirement(
    glMastData: GlMasterEntity | null,
    poNo: string,
    errors: ValidationError[]
  ) {
    // If the GL record requires a PO number and it's missing, add an error
    if (glMastData?.poRequired === FIELD_NAMES.YES && !poNo) {
      this.addNewError(
        errors,
        FIELD_NAMES.DETAIL.PO_NO,
        ERROR_MESSAGES.PO_NUMBER_REQUIRED
      );
    }
  }

  // Validate gallon and line amount consistency based on the Glmast record
  public validateGallonAmount(
    glMastData: GlMasterEntity | null,
    vendorData: Vendor | null,
    gallons: number,
    lineAmount: number,
    errors: ValidationError[]
  ) {
    const validationRules = [
      {
        // If GL requires gallons, they must be provided if the line amount is positive
        condition:
          glMastData?.keyApGal === FIELD_NAMES.YES &&
          !gallons &&
          lineAmount > 0,
        field: FIELD_NAMES.DETAIL.GALLONS,
        error: ERROR_MESSAGES.ENTER_GALLONS_FOR_GALLONS_GL,
      },
      {
        // If GL requires gallons and they are provided, the line amount must be negative
        condition:
          glMastData?.keyApGal === FIELD_NAMES.YES &&
          gallons > 0 &&
          lineAmount < 0,
        field: FIELD_NAMES.DETAIL.GALLONS,
        error: ERROR_MESSAGES.GALLONS_MUST_BE_NEGATIVE,
      },
      {
        // If GL does not require gallons, add an error
        condition:
          glMastData?.keyApGal === FIELD_NAMES.NO &&
          vendorData?.vendorGalRcptsRequired === FIELD_NAMES.M && gallons > 0,
        field: FIELD_NAMES.DETAIL.GALLONS,
        error: ERROR_MESSAGES.GL_DOES_NOT_ALLOW_GALLONS,
      },
    ];

    // Iterate through validation rules and push errors if conditions are met
    validationRules.forEach(({ condition, field, error }) => {
      if (condition) {
        // errors.push({ field, error });
        this.addNewError(errors, field, error);
      }
    });
  }

  // Validates gallon rules based on provided gallons, sales order number, and Glmast record
  public validateGallonRules(
    gallons: string,
    salesOrderNo: string,
    glmastRecord: GlMasterEntity | null,
    errors: ValidationError[]
  ) {
    // If gallons exist, sales order number is missing, and the GL does not require gallons, add an error
    if (
      parseInt(gallons) &&
      !parseInt(salesOrderNo) &&
      glmastRecord?.keyApGal !== FIELD_NAMES.YES
    ) {
      this.addNewError(
        errors,
        FIELD_NAMES.DETAIL.GALLONS,
        ERROR_MESSAGES.GL_REQUIRES_GALLONS
      );
    }
  }

  // Validates the receipt number by checking its existence and verifying gallon values
  public async validateReceipt(
    companyNo: string,
    receiptNo: number,
    gallons: number,
    _errors: ValidationError[],
    warnings: ValidationError[]
  ) {
    const startTime = Date.now();
    this.logger.sharedTiming("Starting validateReceipt", startTime, "start");

    this.logger.log(
      `Validating receipt for companyNo: ${companyNo}, receiptNo: ${receiptNo}, gallons: ${gallons}`
    );

    // Fetch receipt records from two services concurrently
    const inventoryLookupStartTime = Date.now();
    const [foundInventoryFutureTransRecords, foundInventoryHistoryRecord] =
      await Promise.all([
        this.inventoryFutureTransInterface.findByReceiptNo(
          parseInt(companyNo),
          receiptNo
        ),
        this.inventoryHistoryInterface.findByCompanyNoAndReceiptNo(
          parseInt(companyNo),
          receiptNo
        ),
      ]);

    this.logger.sharedTiming(
      `Inventory lookups completed (${Date.now() - inventoryLookupStartTime}ms)`,
      startTime
    );

    // If no receipt record is found, add a warning and exit
    if (!foundInventoryFutureTransRecords && !foundInventoryHistoryRecord) {
      this.addNewWarning(
        warnings,
        FIELD_NAMES.DETAIL.RECEIPT_NO,
        ERROR_MESSAGES.RECEIPT_NOT_FOUND
      );
      this.logger.sharedTiming(
        "validateReceipt completed (no records found)",
        startTime,
        "end"
      );
      return;
    }

    this.logger.sharedTiming("Valid records check completed", startTime);

    // Calculate receipt validation variables
    const calculationStartTime = Date.now();
    const {
      netUnaccountedQuantity,
      totalAccountedQuantity,
      lastJournalOrExpense,
    } = this.calculateReceiptValues(
      foundInventoryHistoryRecord || foundInventoryFutureTransRecords
    );

    this.logger.sharedTiming(
      `Receipt values calculation completed (${Date.now() - calculationStartTime}ms)`,
      startTime
    );

    this.logger.log(
      `Receipt validation variables', ${netUnaccountedQuantity} ${totalAccountedQuantity}, ${lastJournalOrExpense}`
    );

    // Validate gallons against the expected value (netUnaccountedQuantity) → warning
    if (gallons > netUnaccountedQuantity) {
      this.addNewWarning(
        warnings,
        FIELD_NAMES.DETAIL.GALLONS,
        `GALLONS ARE NOT EQUAL ${netUnaccountedQuantity > 0 ? netUnaccountedQuantity : -netUnaccountedQuantity}`
      );
    }

    // Check if the receipt has been used before (totalAccountedQuantity) → warning
    if (totalAccountedQuantity) {
      this.addNewWarning(
        warnings,
        FIELD_NAMES.DETAIL.RECEIPT_NO,
        `RECEIPT # PREVIOUSLY USED ON JRNL: PJXX ${totalAccountedQuantity}`
      );
    }

    this.logger.debug(
      `Receipt validation completed for receiptNo: ${receiptNo}`
    );
    this.logger.sharedTiming("validateReceipt completed", startTime, "end");
  }

  // Computes key receipt-related variables based on the provided record.
  public calculateReceiptValues(record: any) {
    const startTime = Date.now();
    this.logger.sharedTiming(
      "Starting calculateReceiptValues",
      startTime,
      "start"
    );

    if (!record) {
      this.logger.sharedTiming(
        "calculateReceiptValues completed (no record)",
        startTime,
        "end"
      );
      return {
        netUnaccountedQuantity: 0,
        totalAccountedQuantity: 0,
        lastJournalOrExpense: 0,
      };
    }

    this.logger.log(
      `Calculating receipt values for record type: ${record.constructor.name}`
    );

    // Extract quantities or use 0 if not available
    const netQuantity = record?.netQuantity || 0;
    const netQtyFraction = record?.netQtyFraction || 0;
    const apTotalQuantity = record?.apTotalQuantity || 0;
    const apTotalQtyFraction = record?.apTotalQtyFraction || 0;

    // Calculate the net difference between received and accounted quantities
    const netUnaccountedQuantity =
      netQuantity + netQtyFraction - apTotalQuantity - apTotalQtyFraction;

    // Calculate the total accounted quantity (AP - Accounts Payable)
    const totalAccountedQuantity = apTotalQuantity + apTotalQtyFraction;

    // Determine the last purchase journal or last expense GL (fallback to 0 if not found)
    const lastJournalOrExpense =
      record?.apLastPurchaseJrnl || record?.apLastExpenseGL || 0;

    this.logger.debug(
      `Calculated values: netQuantity=${netQuantity}, netUnaccountedQuantity=${netUnaccountedQuantity}, totalAccountedQuantity=${totalAccountedQuantity}`
    );

    this.logger.sharedTiming(
      "calculateReceiptValues completed",
      startTime,
      "end"
    );

    // Return the calculated variables
    return {
      netUnaccountedQuantity,
      totalAccountedQuantity,
      lastJournalOrExpense,
    };
  }
  // Method to validate receipt code
  public validateReceiptCode(
    errors: ValidationError[],
    openClosed?: string,
    warnings?: ValidationError[],
    treatAsWarning: boolean = false
  ): void {
    const startTime = Date.now();
    this.logger.sharedTiming(
      "Starting validateReceiptCode",
      startTime,
      "start"
    );

    const code = (openClosed ?? "").trim().toUpperCase();

    if (code === "") {
      this.logger.sharedTiming(
        "validateReceiptCode completed (empty code)",
        startTime,
        "end"
      );
      return;
    }

    if (!["O", "C"].includes(code)) {
      if (treatAsWarning && warnings) {
        this.addNewWarning(
          warnings,
          FIELD_NAMES.DETAIL.OPEN_CLOSED,
          ERROR_MESSAGES.INVALID_RECEIPT_CODE
        );
      } else {
        this.addNewError(
          errors,
          FIELD_NAMES.DETAIL.OPEN_CLOSED,
          ERROR_MESSAGES.INVALID_RECEIPT_CODE
        );
      }
    }

    this.logger.sharedTiming("validateReceiptCode completed", startTime, "end");
  }

  // Method to validate delete code
  public validateDeleteCode(
    errors: ValidationError[],
    deleteCode?: string,
    warnings?: ValidationError[],
    treatAsWarning: boolean = false
  ): void {
    const startTime = Date.now();
    this.logger.sharedTiming("Starting validateDeleteCode", startTime, "start");

    const code = (deleteCode ?? "").trim().toUpperCase();

    if (code === "") {
      this.logger.sharedTiming(
        "validateDeleteCode completed (empty code)",
        startTime,
        "end"
      );
      return;
    }

    if (![" ", "A", "D"].includes(code)) {
      if (treatAsWarning && warnings) {
        this.addNewWarning(
          warnings,
          FIELD_NAMES.DETAIL.IS_DELETED,
          ERROR_MESSAGES.INVALID_DELETE_CODE
        );
      } else {
        this.addNewError(
          errors,
          FIELD_NAMES.DETAIL.IS_DELETED,
          ERROR_MESSAGES.INVALID_DELETE_CODE
        );
      }
    }

    this.logger.sharedTiming("validateDeleteCode completed", startTime, "end");
  }

  // ✅ NEW: Add validation method for freight amount formulas
  public validateFreightAmountFormulas(
    details: any[],
    errors: ValidationError[]
  ): void {
    const startTime = Date.now();
    this.logger.sharedTiming(
      "Starting validateFreightAmountFormulas",
      startTime,
      "start"
    );

    if (!details || details.length === 0) {
      this.logger.sharedTiming(
        "validateFreightAmountFormulas completed (no details)",
        startTime,
        "end"
      );
      return;
    }

    // Validate Formula 1: ATAMT = ATPRAM + ATFRAM
    details.forEach((detail, index) => {
      // Convert to numbers, handling strings, null, undefined, and NaN
      const lineAmount =
        detail.lineAmount != null ? Number(detail.lineAmount) : 0;
      const productAmount =
        detail.productAmount != null ? Number(detail.productAmount) : 0;
      const freightAmount =
        detail.freightAmount != null ? Number(detail.freightAmount) : 0;
      const calculatedLineAmount = productAmount + freightAmount;

      const diff = Math.abs(lineAmount - calculatedLineAmount);
      if (diff > 0.01) {
        // Allow for small rounding differences
        this.logger.debug(
          `Formula 1 validation failed for detail ${index + 1}: ` +
          `lineAmount=${lineAmount}, productAmount=${productAmount}, ` +
          `freightAmount=${freightAmount}, calculated=${calculatedLineAmount}, diff=${diff}`
        );
        this.addNewError(
          errors,
          `DETAIL_LINE_${index + 1}`,
          `Line amount (${lineAmount}) does not equal product amount (${productAmount}) + freight amount (${freightAmount})`
        );
      }
    });

    this.logger.sharedTiming(
      "validateFreightAmountFormulas completed",
      startTime,
      "end"
    );
  }

  //  NEW: Add validation method for total freight formula
  public validateTotalFreightFormula(
    header: any,
    details: any[],
    errors: ValidationError[]
  ): void {
    const startTime = Date.now();
    this.logger.sharedTiming(
      "Starting validateTotalFreightFormula",
      startTime,
      "start"
    );

    if (!details || details.length === 0) {
      this.logger.sharedTiming(
        "validateTotalFreightFormula completed (no details)",
        startTime,
        "end"
      );
      return;
    }

    const headerTotalFreight = header.totalFreight || 0;
    const calculatedTotalFreight = details.reduce(
      (sum, detail) => sum + (detail.freightAmount ?? 0),
      0
    );

    const diff = Math.abs(headerTotalFreight - calculatedTotalFreight);
    if (diff > 0.01) {
      this.addNewError(
        errors,
        HEADER.TOTAL_FREIGHT,
        `Header total freight (${headerTotalFreight}) does not equal sum of line freight amounts (${calculatedTotalFreight})`
      );
    }

    this.logger.sharedTiming(
      "validateTotalFreightFormula completed",
      startTime,
      "end"
    );
  }

  //  NEW: Add validation method for invoice total formula (Formula 2)
  public validateInvoiceTotalFormula(
    header: any,
    details: any[],
    errors: ValidationError[]
  ): void {
    const startTime = Date.now();
    this.logger.sharedTiming(
      "Starting validateInvoiceTotalFormula",
      startTime,
      "start"
    );

    if (!details || details.length === 0) {
      this.logger.sharedTiming(
        "validateInvoiceTotalFormula completed (no details)",
        startTime,
        "end"
      );
      return;
    }

    const headerInvoiceAmount = header.invoiceAmount || 0;
    const calculatedInvoiceAmount = details.reduce(
      (sum, detail) => sum + (detail.lineAmount ?? 0),
      0
    );

    const diff = Math.abs(headerInvoiceAmount - calculatedInvoiceAmount);
    if (diff > 0.01) {
      this.addNewError(
        errors,
        "invoiceAmount",
        `Invoice amount (${headerInvoiceAmount}) does not equal sum of line amounts (${calculatedInvoiceAmount})`
      );
    }

    this.logger.sharedTiming(
      "validateInvoiceTotalFormula completed",
      startTime,
      "end"
    );
  }
}
