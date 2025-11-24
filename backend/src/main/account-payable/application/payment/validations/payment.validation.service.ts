import { Inject, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { ValidationError } from "@src/shared/utils/error-handler";
import { ERROR_MESSAGES } from "@src/shared/constants/error-constant";
import { validateMMDDYY } from "@src/shared/utils/format-date";
import {
  PAYMENT_TYPE_VALIDATION_FIELDS,
  PAY_OR_HOLD_CODES,
  SingleCheckFlag,
  MakePrepaidFlag,
  ALLOWED_VOUCHER_TO_PAY_VALUES,
  KYHOLD_TO_MAKE_PREPAID,
  RESTRICTED_HOLD_CODES,
  KEY_HOLD_CODES,
  PAYMENT_VOUCHER_TYPES,
} from "@src/shared/constants/payment-constant";
import { HEADER } from "@src/shared/constants/constant";
import { VoucherHeaderValidationService } from "../../voucher/validations/voucher-header.validation.service";
import { VendorAppService } from "@src/main/account-payable/domain/services/vendor/vendor.service";
import { VoucherMaintenanceInterface } from "@src/main/account-payable/domain/interface/voucher-maintenance.interface";
import { VoucherType } from "@src/shared/constants/voucher-type.enum";
import { GapptUserInterface } from "@src/main/account-payable/domain/interface/gappt-user.interface";

@Injectable()
export class PaymentValidationService {
  private readonly logger = new AppLogger(PaymentValidationService.name);
  constructor(
    private readonly voucherHeaderValidationService: VoucherHeaderValidationService,
    private readonly vendorAppService: VendorAppService,
    @Inject("VoucherMaintenanceInterface")
    private readonly voucherMaintenanceRepository: VoucherMaintenanceInterface,
    @Inject("GapptUserInterface")
    private readonly gapptUserRepository: GapptUserInterface
  ) {}

  /**
   * Add error only if not already present
   */
  public addNewError(
    errors: ValidationError[],
    field: string,
    errorMsg: string
  ) {
    if (!errors?.find((error) => error?.field === field)) {
      errors.push({ field, message: errorMsg, code: field });
    }
  }

  /**
   * Validate Check Date (MMDDYY format)
   */
  public validateCheckDate(checkDate: string, errors: ValidationError[]) {
    if (checkDate && !validateMMDDYY(checkDate)) {
      this.addNewError(
        errors,
        PAYMENT_TYPE_VALIDATION_FIELDS.CHECK_DATE,
        ERROR_MESSAGES.INVALID_CHECK_DATE
      );
    }
  }

  /**
   * Validate Date to Pay By (MMDDYY format)
   */
  public validateDateToPayBy(dateToPayBy: string, errors: ValidationError[]) {
    if (dateToPayBy && !validateMMDDYY(dateToPayBy)) {
      this.addNewError(
        errors,
        PAYMENT_TYPE_VALIDATION_FIELDS.DATE_TO_PAY_BY,
        ERROR_MESSAGES.INVALID_DATE_TO_PAY_BY
      );
    }
  }

  /**
   * Validate Starting Check Number
   */
  public validateStartingCheckNo(
    startingCheckNo: number,
    errors: ValidationError[]
  ) {
    if (startingCheckNo === 0) {
      this.addNewError(
        errors,
        PAYMENT_TYPE_VALIDATION_FIELDS.STARTING_CHECK_NO,
        ERROR_MESSAGES.CHECK_NO_CANNOT_BE_ZERO
      );
    } else if (startingCheckNo.toString().length !== 6) {
      this.addNewError(
        errors,
        PAYMENT_TYPE_VALIDATION_FIELDS.STARTING_CHECK_NO,
        ERROR_MESSAGES.CHECK_NO_MUST_BE_6_DIGITS
      );
    }
  }

  /**
   * Validate Bank GL Number
   */
  public async validateBankGl(
    companyNo: number,
    bankAccountGl: number,
    errors: ValidationError[]
  ) {
    await this.voucherHeaderValidationService.validateGlNumber(
      Number(companyNo),
      Number(bankAccountGl),
      HEADER.BANK_GL,
      ERROR_MESSAGES.INVALID_BANK_GL,
      errors
    );
  }

  public validateEntrySequenceFormat(
    entrySequence: string,
    errors: ValidationError[]
  ) {
    if (!entrySequence) {
      this.addNewError(
        errors,
        "entrySequence",
        ERROR_MESSAGES.ENTRY_SEQUENCE_IS_REQUIRED
      );
      return;
    }

    const seqStr = String(entrySequence).trim();
    if (Number(seqStr) === 0) {
      this.addNewError(
        errors,
        "entrySequence",
        ERROR_MESSAGES.ENTRY_SEQUENCE_CANNOT_BE_ZERO
      );
    }
    if (seqStr.length !== 5) {
      this.addNewError(
        errors,
        "entrySequence",
        ERROR_MESSAGES.ENTRY_SEQUENCE_MUST_BE_5_CHARACTERS
      );
    }
  }

  public async validateEntrySequenceInDB(
    entrySequence: string,
    userId: string,
    errors: ValidationError[]
  ) {
    // If format already invalid, skip DB check
    if (errors.length > 0) {
      return;
    }

    try {
      const gapptUserRecord = await this.gapptUserRepository.findByEntrySequence(
        entrySequence.trim(),
        userId
      );

      if (!gapptUserRecord) {
        this.addNewError(
          errors,
          "entrySequence",
          ERROR_MESSAGES.ENTRY_SEQUENCE_NOT_FOUND
        );
      } else if (gapptUserRecord.status > "D") {
        this.addNewError(
          errors,
          "entrySequence",
          ERROR_MESSAGES.ENTRY_SEQUENCE_MARKED_DELETED
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to validate entry sequence ${entrySequence} for user ${userId}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      this.addNewError(
        errors,
        "entrySequence",
        ERROR_MESSAGES.ENTRY_SEQUENCE_VALIDATION_FAILED
      );
    }
  }

  async validateVendor(
    vendorNo: number,
    companyNo: number,
    errors: ValidationError[]
  ) {
    if (vendorNo == null) {
      this.addNewError(errors, "vendorNo", ERROR_MESSAGES.VENDOR_IS_REQUIRED);
    } else if (Number(vendorNo) === 0) {
      this.addNewError(
        errors,
        "vendorNo",
        ERROR_MESSAGES.VENDOR_CANNOT_BE_ZERO
      );
    } else {
      // APVEND existence check using companyNo + vendorNo
      const foundVendor = await this.vendorAppService.findVendorByNo(
        vendorNo,
        companyNo
      );
      this.logger.log(`Found vendor: ${JSON.stringify(foundVendor)}`);
      if (!foundVendor) {
        this.addNewError(errors, "vendorNo", ERROR_MESSAGES.INVALID_VENDOR_NO);
      }
    }
  }

  async validateVoucher(
    voucherNo: number,
    companyNo: number,
    vendorNo: number,
    errors: ValidationError[]
  ) {
    if (voucherNo === 0) {
      this.addNewError(
        errors,
        "voucherNo",
        ERROR_MESSAGES.VOUCHER_NO_CANNOT_BE_ZERO
      );
    }

    const voucherHeaderRecord =
      await this.voucherMaintenanceRepository.findVoucherView(
        VoucherType.UNPAID,
        companyNo,
        vendorNo,
        voucherNo
      );

    if (!voucherHeaderRecord?.headerItems) {
      this.addNewError(errors, "voucherNo", ERROR_MESSAGES.VOUCHER_IS_NOT_OPEN);
    } else {
      // Validate Vendor has Open Vouchers
      const opcovn = `${voucherHeaderRecord.headerItems?.companyNo}${voucherHeaderRecord.headerItems?.vendorNo}`;
      const vnkey = `${companyNo}${vendorNo}`;

      if (opcovn !== vnkey) {
        this.addNewError(
          errors,
          "voucherNo",
          ERROR_MESSAGES.VENDOR_HAS_NO_OPEN_VOUCHERS
        );
      }
    }

    return voucherHeaderRecord?.headerItems;
  }

  public validatePartialPay(
    partialPayAmount: number,
    voucherHeaderRecord: any,
    errors: ValidationError[]
  ) {
    if (!partialPayAmount || partialPayAmount === 0) {
      this.addNewError(
        errors,
        "partialPayAmount",
        ERROR_MESSAGES.PARTIAL_PAY_AMOUNT_CANNOT_BE_ZERO
      );
    } else if (voucherHeaderRecord) {
      const grossAmount = Number(voucherHeaderRecord.grossAmount) || 0;
      const paidToDate = Number(voucherHeaderRecord.partialPaidToDate) || 0;
      const remainingAmount = grossAmount - paidToDate;
      if (partialPayAmount > remainingAmount) {
        this.addNewError(
          errors,
          "partialPayAmount",
          `${ERROR_MESSAGES.CANNOT_PAY_MORE_THAN_REMAINING} ${remainingAmount}`
        );
      }
    }
  }

  public validateDiscount(
    discountAmount: number,
    voucherNo: number,
    voucherHeaderRecord: any,
    errors: ValidationError[]
  ) {
    if (discountAmount === 0) {
      this.addNewError(
        errors,
        "discountAmount",
        ERROR_MESSAGES.DISCOUNT_AMOUNT_REQUIRED
      );
    } else if (discountAmount && discountAmount !== 0 && voucherNo) {
      if (!voucherHeaderRecord) {
        this.addNewError(
          errors,
          "discAmount",
          ERROR_MESSAGES.VOUCHER_IS_NOT_OPEN
        );
      } else {
        const grossAmount = Number(voucherHeaderRecord.grossAmount) || 0;
        const paidToDate = Number(voucherHeaderRecord.partialPaidToDate) || 0;
        const netAmount = grossAmount - paidToDate;
        if (discountAmount > netAmount) {
          this.addNewError(
            errors,
            "discAmount",
            ERROR_MESSAGES.INVALID_DISCOUNT_AMOUNT
          );
        }
      }
    }
  }

  public validatePayOrHold(payOrHold: string, errors: ValidationError[]) {
    if (
      payOrHold &&
      payOrHold !== PAY_OR_HOLD_CODES.PAY &&
      payOrHold !== PAY_OR_HOLD_CODES.HOLD
    ) {
      this.addNewError(errors, "payOrHold", ERROR_MESSAGES.INVALID_PAY_OR_HOLD);
    }
  }

  public validateSingleCheck(singleCheck: string, errors: ValidationError[]) {
    if (singleCheck && singleCheck !== SingleCheckFlag.SINGLE) {
      this.addNewError(
        errors,
        "singleCheck",
        ERROR_MESSAGES.SINGLE_CHECK_MUST_BE_S
      );
    }
  }

  public validateMakePrepaid(
    kyholdCode: string,
    makePrepaid: string,
    errors: ValidationError[]
  ) {
    if (
      kyholdCode === "" &&
      makePrepaid &&
      makePrepaid !== MakePrepaidFlag.PREPAID
    ) {
      this.addNewError(
        errors,
        "makePrepaid",
        ERROR_MESSAGES.MAKE_PREPAID_MUST_BE_P
      );
    }
  }

  public validatePrepaidCheckNo(
    makePrepaid: string,
    prepaidCheckNo: string,
    prepaidDate: string,
    errors: ValidationError[]
  ) {
    // 1) User must provide a prepaid check number
    if (
      makePrepaid?.trim() !== "" &&
      (!prepaidCheckNo || prepaidCheckNo.trim() === "")
    ) {
      this.addNewError(
        errors,
        "prepaidCheckNo",
        ERROR_MESSAGES.PREPAID_CHECK_NO_MISSING
      );
    }

    // 2) User must enter a valid prepaid check date
    if (makePrepaid?.trim() !== "" && !validateMMDDYY(prepaidDate)) {
      this.addNewError(
        errors,
        "prepaidCheckDate",
        ERROR_MESSAGES.INVALID_PPD_CHECK_DATE
      );
    }

    // 3) Prepaid check number must not be provided when Make Prepaid is blank
    if (
      makePrepaid?.trim() === "" &&
      prepaidCheckNo &&
      prepaidCheckNo.trim() === ""
    ) {
      this.addNewError(
        errors,
        "prepaidCheckNo",
        ERROR_MESSAGES.PREPAID_CHECK_NO_MUST_BE_ZERO
      );
    }

    // 4) Prepaid check date must not be provided when Make Prepaid is blank
    if (
      makePrepaid?.trim() === "" &&
      prepaidDate &&
      prepaidDate.trim() !== ""
    ) {
      this.addNewError(
        errors,
        "prepaidCheckDate",
        ERROR_MESSAGES.PPD_CHECK_DATE_MUST_BE_ZERO
      );
    }
  }

  public validateBankGlWithExpectedValue(
    voucherNo: number,
    bankAccountGl: number,
    voucherHeaderRecord: any,
    errors: ValidationError[]
  ) {
    if (voucherNo && bankAccountGl !== voucherHeaderRecord?.bankGlNo) {
      this.addNewError(
        errors,
        "bankAccountGl",
        `${ERROR_MESSAGES.VOUCHER_BANK_GL_MISMATCH} ${voucherHeaderRecord?.bankGlNo}`
      );
    }
  }

  public validateVendorAndVoucher(
    vendorNo: number,
    voucherNo: number,
    errors: ValidationError[]
  ) {
    if (vendorNo === 0 && voucherNo === 0) {
      this.addNewError(
        errors,
        "voucherNo",
        ERROR_MESSAGES.A_VOUCHER_MUST_BE_KEYED
      );
      this.addNewError(
        errors,
        "vendorNo",
        ERROR_MESSAGES.TO_SELECT_A_ONE_TIME_VENDOR
      );
    }
  }

  public validateVoucherToPay(kyholdCode: any, errors: ValidationError[]) {
    if (!ALLOWED_VOUCHER_TO_PAY_VALUES.includes(kyholdCode)) {
      this.addNewError(
        errors,
        "voucherToPay",
        ERROR_MESSAGES.VOUCHER_TO_PAY_MUST_BE_A_W_E_U
      );
    }
  }

  public validateMakePrepaidBasedOnVoucherToPay(
    kyholdCode: any,
    makePrepaid: string,
    errors: ValidationError[]
  ) {
    const requiredPrepaid = KYHOLD_TO_MAKE_PREPAID[kyholdCode] ?? "";

    if (makePrepaid && makePrepaid !== requiredPrepaid) {
      this.addNewError(
        errors,
        "makePrepaid",
        `${ERROR_MESSAGES.MAKE_PREPAID_MUST_BE} '${requiredPrepaid}'`
      );
    }
  }

  public validateVoucherHoldPaymentFlag(
    voucherNo: number,
    kyholdCode: any,
    voucherHeaderRecord: any,
    errors: ValidationError[]
  ) {
    if (voucherNo && voucherNo !== 0) {
      // Case 1: KYHOLD is blank but OPHALT is a restricted code
      if (
        kyholdCode === KEY_HOLD_CODES[PAYMENT_VOUCHER_TYPES.CHECK] && // ''
        RESTRICTED_HOLD_CODES.includes(voucherHeaderRecord?.holdPaymentFlag)
      ) {
        this.addNewError(
          errors,
          "voucherToPay",
          ERROR_MESSAGES.CANNOT_PAY_THIS_VOUCHER_NOW
        );
      }

      // Case 2: KYHOLD is not blank and must match OPHALT exactly
      if (
        kyholdCode !== KEY_HOLD_CODES[PAYMENT_VOUCHER_TYPES.CHECK] && // not ''
        voucherHeaderRecord?.holdPaymentFlag !== kyholdCode
      ) {
        this.addNewError(
          errors,
          "voucherToPay",
          ERROR_MESSAGES.CANNOT_PAY_THIS_VOUCHER_NOW
        );
      }
    }
  }
}
