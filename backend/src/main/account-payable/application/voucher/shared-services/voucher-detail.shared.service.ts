import { Injectable, Inject } from "@nestjs/common";
import { ValidationError } from "@src/shared/utils/error-handler";
import { VendorInterface } from "@src/main/account-payable/domain/interface/vendor.interface";
import { CompanyInterface } from "@src/main/account-payable/domain/interface/company.interface";
import { VoucherDetailInterface } from "@src/main/account-payable/domain/interface/voucher.interface";
import { VoucherDetailValidation } from "../validations/voucher-detail.validation";
import { AppLogger } from "@src/shared/logger/logger.service";
import { PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";

type ValidateDetailResponse =
  | {
      error: true;
      errors: { index: number; errors: ValidationError[] }[];
      warnings?: { index: number; warnings: ValidationError[] }[];
      data?: any[];
    }
  | {
      error: false;
      data: any[];
      warnings?: { index: number; warnings: ValidationError[] }[];
    };

@Injectable()
export class VoucherDetailValidationService {
  private readonly logger = new AppLogger(VoucherDetailValidationService.name);

  constructor(
    @Inject("CompanyInterface")
    private readonly companyInterface: CompanyInterface,
    @Inject("VendorInterface")
    private readonly vendorInterface: VendorInterface,
    @Inject("VoucherDetailInterface")
    private readonly voucherDetailInterface: VoucherDetailInterface,
    private readonly voucherDetailValidation: VoucherDetailValidation
  ) {}

  public buildVoucherDetailData(details, headers, newEntrySequence) {
    const startTime = Date.now();
    this.logger.sharedTiming(
      "Starting buildVoucherDetailData",
      startTime,
      "start"
    );

    // Import the mapping constants

    const result = {
      isDeleted: details?.isDeleted || "",
      companyNo: Number(headers?.companyNo) || 0,
      entryNo: Number(headers?.entryNo) || 0,
      entrySequence: Number(newEntrySequence) || 0,
      vendorNo: Number(headers?.vendorNo) || 0,
      lineCompanyNo: Number(headers?.companyNo) || 0,
      lineGlNo: Number(details?.lineGlNo) || 0,
      lineDesc: details?.lineDesc || "",
      discountAmount: Number(details?.discountAmount) || 0,
      discountPercentage: Number(details?.discountPercentage) || 0,
      inventoryItem: " ",
      quantity: Number(details?.quantity) || 0,
      jobNo: " ",
      jobCostCode: " ",
      jobCostType: " ",
      jobCostQuantity: 0,
      gallons: Number(details?.gallons) || 0,
      receiptNo: Number(details?.receiptNo) || 0,
      openClosed: details?.openClosed || "C",
      poLineNo: Number(details?.poLineNo) || 0,
      productAmount: details?.productAmount != null ? Number(details.productAmount) : 0,
      freightAmount: details?.freightAmount != null ? Number(details.freightAmount) : 0,
      
      // NEW: Apply formula ATAMT = ATPRAM + ATFRAM  
      lineAmount: (details?.productAmount != null ? Number(details.productAmount) : 0) + (details?.freightAmount != null ? Number(details.freightAmount) : 0),
      
      poNo: details?.poNo || "",
      status: headers.status,
    };

    this.logger.sharedTiming(
      "buildVoucherDetailData completed",
      startTime,
      "end"
    );
    return result;
  }

  async validateDetail(
    details: any[],
    headers: any,
    foundVendor?: any
  ): Promise<ValidateDetailResponse> {
    const startTime = Date.now();
    this.logger.sharedTiming("Starting detail validation", startTime, "start");

    this.logger.log(
      `Validating ${details.length} voucher detail(s) ${JSON.stringify(headers)}`
    );

    const finalErrors: { index: number; errors: ValidationError[] }[] = [];
    const finalWarnings: { index: number; warnings: ValidationError[] }[] = [];

    const processorErrors: {
      error: true;
      errors: { index: number; errors: ValidationError[] }[];
      data: any[];
    } = {
      error: true,
      errors: [],
      data: [],
    };

    const { companyNo, entryNo, vendorNo, salesOrderNo } = headers;

    this.logger.sharedTiming("DTO destructuring completed", startTime);

    // Fetch common data for all details
    const commonDataStartTime = Date.now();

    // Only fetch vendor if not already provided from header validation
    if (foundVendor) {
      this.logger.debug(
        `🔄 Reusing vendor data from header validation: ${foundVendor.vendorNo}@${companyNo}`
      );
    }

    const [foundCompany, vendorData] = await Promise.all([
      this.companyInterface.findOne(companyNo),
      foundVendor
        ? Promise.resolve(foundVendor)
        : this.vendorInterface.findOne(parseInt(vendorNo), parseInt(companyNo)),
    ]);

    this.logger.sharedTiming(
      `Common data lookup completed (${Date.now() - commonDataStartTime}ms)`,
      startTime
    );

    // ⚡ OPTIMIZATION: Move voucher detail lookup outside the loop (same query for all details)
    const voucherDetailLookupStartTime = Date.now();
    const foundVoucherDetails = await this.voucherDetailInterface.findByEntry(
      companyNo,
      entryNo,
      vendorNo
    );

    this.logger.sharedTiming(
      `Voucher detail lookup completed ONCE for all details (${Date.now() - voucherDetailLookupStartTime}ms)`,
      startTime
    );

    const detailDataArray: any[] = [];

    for (let i = 0; i < details.length; i++) {
      const detailStartTime = Date.now();
      this.logger.sharedTiming(
        `Starting validation for detail ${i + 1}/${details.length}`,
        startTime
      );

      const detail = details[i];
      const errors: ValidationError[] = [];
      const warnings: ValidationError[] = [];

      // Calculate entry sequence
      const newEntrySequence = this.voucherDetailValidation.getEntrySequence(
        detail.entrySequence
          ? parseInt(detail.entrySequence)
          : (foundVoucherDetails?.length ?? 0) + 1
      );

      // Get valid line GL number
      const newLineGlNo = this.voucherDetailValidation.getValidLineGlNo(
        detail.lineGlNo,
        vendorData?.vendorExpenseGLSub
      );

      this.logger.sharedTiming(
        `Entry sequence and GL number calculation completed for detail ${i + 1}`,
        startTime
      );

      // Start validations
      const validationStartTime = Date.now();

      // Validate discounts
      this.voucherDetailValidation.validateDiscounts(
        errors,
        detail.discountAmount,
        detail.discountPercentage,
        foundCompany.companyDiscountsGlNo
      );

      // Validate quantity
      this.voucherDetailValidation.validateQuantity(
        errors,
        detail.quantity
      );

      this.logger.sharedTiming(
        `Discount validation completed for detail ${i + 1}`,
        startTime
      );

      // Validate GL master record
      const glMastValidationStartTime = Date.now();
      const glMastData =
        await this.voucherDetailValidation.validateGlmastRecord(
          newLineGlNo,
          companyNo,
          errors
        );

      this.logger.sharedTiming(
        `GL master validation completed for detail ${i + 1} (${Date.now() - glMastValidationStartTime}ms)`,
        startTime
      );

      // Validate sales order (receipt-related warnings go to warnings array)
      this.voucherDetailValidation.validateSalesOrder(
        salesOrderNo,
        detail.receiptNo,
        detail.gallons,
        errors,
        warnings
      );

      this.logger.sharedTiming(
        `Sales order validation completed for detail ${i + 1}`,
        startTime
      );

      // Validate vendor requirements (receipt-related warnings go to warnings array)
      this.voucherDetailValidation.validateVendorRequirements(
        vendorData,
        {
          gallons: parseFloat(detail.gallons),
          receiptNo: parseInt(detail.receiptNo),
        },
        errors,
        warnings
      );

      this.logger.sharedTiming(
        `Vendor requirements validation completed for detail ${i + 1}`,
        startTime
      );

      // Validate gallon and vendor
      this.voucherDetailValidation.validateGallonAndVendor(
        glMastData,
        vendorData,
        errors
      );

      // Validate PO requirement
      this.voucherDetailValidation.validatePoRequirement(
        glMastData,
        detail.poNo,
        errors
      );

      // Validate gallon amount
      this.voucherDetailValidation.validateGallonAmount(
        glMastData,
        detail.gallons,
        detail.productAmount,
        errors
      );

      // Validate gallon rules
      this.voucherDetailValidation.validateGallonRules(
        detail.gallons,
        salesOrderNo,
        glMastData,
        errors
      );

      this.logger.sharedTiming(
        `Business rules validation completed for detail ${i + 1}`,
        startTime
      );

      // Validate receipt if needed
      if (parseInt(detail.receiptNo) > 0) {
        const receiptValidationStartTime = Date.now();
        await this.voucherDetailValidation.validateReceipt(
          companyNo,
          detail.receiptNo,
          detail.gallons,
          errors,
          warnings
        );

        this.logger.sharedTiming(
          `Receipt validation completed for detail ${i + 1} (${Date.now() - receiptValidationStartTime}ms)`,
          startTime
        );
      }

      // Validate receipt and delete codes (always errors; warnings restricted to receipt validations only)
      this.voucherDetailValidation.validateReceiptCode(
        errors,
        detail.openClosed
      );
      this.voucherDetailValidation.validateDeleteCode(errors, detail.isDeleted);

      // NEW: Add freight amount formula validation for each detail
      this.voucherDetailValidation.validateFreightAmountFormulas([detail], errors);

      // NEW: Add total freight formula validation for each detail
      this.voucherDetailValidation.validateTotalFreightFormula(headers, details, errors);

      // NEW: Add invoice total formula validation for each detail
      this.voucherDetailValidation.validateInvoiceTotalFormula(headers, details, errors);

      this.logger.sharedTiming(
        `Code validation completed for detail ${i + 1} (${Date.now() - validationStartTime}ms total validation time)`,
        startTime
      );

      // Collect errors/warnings if any
      if (errors.length) {
        finalErrors.push({ index: i + 1, errors });
        this.logger.sharedTiming(
          `Found ${errors.length} validation errors for detail ${i + 1}`,
          startTime
        );
      }
      if (warnings.length) {
        finalWarnings.push({ index: i + 1, warnings });
      }

      // Build detail data
      const detailData = this.buildVoucherDetailData(
        detail,
        headers,
        newEntrySequence
      );
      detailDataArray.push(detailData);

      this.logger.sharedTiming(
        `Detail ${i + 1} validation completed (${Date.now() - detailStartTime}ms)`,
        startTime
      );
    }

    this.logger.log(
      `Voucher detail validation summary: ${finalErrors.length} details with errors, ${finalWarnings.length} details with warnings out of ${details.length} total details`
    );

    // Always return the processed data, even when there are validation errors
    // This ensures details are saved to database with status "E" when there are errors
    if (finalErrors.length > 0) {
      this.logger.sharedTiming(
        "Detail validation completed with errors",
        startTime,
        "end"
      );
      // Return processor errors only for FLEXI and SOGAS types
      if (
        headers.processType === PROCESS_TYPE_ENUM.FLEXI ||
        headers.processType === PROCESS_TYPE_ENUM.SOGAS
      ) {
        processorErrors.errors = finalErrors;
        processorErrors.data = detailDataArray;
        return { ...processorErrors, warnings: finalWarnings };
      }
      // For other types, just return the errors array
      return {
        error: true,
        errors: finalErrors,
        warnings: finalWarnings,
      };
    } else {
      this.logger.sharedTiming(
        "Detail validation completed successfully",
        startTime,
        "end"
      );
      return {
        error: false,
        data: detailDataArray,
        warnings: finalWarnings,
      };
    }
  }
}
