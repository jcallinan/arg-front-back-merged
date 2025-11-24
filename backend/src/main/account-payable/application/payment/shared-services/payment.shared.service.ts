import { Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { HEADER } from "@src/shared/constants/constant";

import {
  SubmitPaymentSelectionTypeDto,
  SubmitVendorPaymentsDto,
} from "@src/main/account-payable/application/payment/dto/payment.dto";
import { ERROR_MESSAGES } from "@src/shared/constants/error-constant";
import {
  KEY_HOLD_CODES,
  PaymentVoucherType,
} from "@src/shared/constants/payment-constant";
import { PaymentValidationService } from "../validations/payment.validation.service";
import { VoucherHeaderValidationService } from "../../voucher/validations/voucher-header.validation.service";
import { PAYMENT_OPERATION_MODE } from "@src/shared/constants/payment-constant";

@Injectable()
export class PaymentSharedService {
  private readonly logger = new AppLogger(PaymentSharedService.name);

  constructor(
    private readonly paymentValidationService: PaymentValidationService,
    private readonly voucherHeaderValidationService: VoucherHeaderValidationService
  ) {}

  async paymentTypeValidation(dto: SubmitPaymentSelectionTypeDto): Promise<
    | { field: string; code: string; message: string }[]
    | {
        message: string;
      }
  > {
    const startTime = Date.now();
    this.logger.sharedTiming(
      "Starting payment type validation",
      startTime,
      "start"
    );

    this.logger.log(`Validating payment type fields ${JSON.stringify(dto)}`);

    const errors: {
      field: string;
      code: string;
      message: string;
    }[] = [];

    const {
      companyNo,
      checkDate,
      dateToPayBy,
      bankAccountGl,
      startingCheckNo,
    } = dto;

    this.logger.sharedTiming("DTO destructuring completed", startTime);

    this.paymentValidationService.validateCheckDate(checkDate, errors);
    this.paymentValidationService.validateDateToPayBy(dateToPayBy, errors);
    this.paymentValidationService.validateStartingCheckNo(
      startingCheckNo,
      errors
    );
    await this.voucherHeaderValidationService.validateGlNumber(
      Number(companyNo),
      Number(bankAccountGl),
      HEADER.BANK_GL,
      ERROR_MESSAGES.INVALID_BANK_GL,
      errors
    );

    this.logger.log(
      `Payment type validation errors: ${JSON.stringify(errors)}`
    );

    // If any validation errors are found, return them with vendor and date data
    if (errors.length > 0) {
      this.logger.sharedTiming(
        "Validation completed with errors",
        startTime,
        "end"
      );

      // For other types, just return the errors array
      return errors;
    } else {
      this.logger.sharedTiming(
        "Validation completed successfully",
        startTime,
        "end"
      );
      return {
        message: "Payment type validation completed successfully",
      };
    }
  }

  async vendorPaymentValidation(
    dto: SubmitVendorPaymentsDto,
    userId: string
  ): Promise<
    | { field: string; code: string; message: string }[]
    | {
        message: string;
      }
  > {
    const startTime = Date.now();
    this.logger.sharedTiming(
      "Starting vendor payment validation",
      startTime,
      "start"
    );

    this.logger.log(`Validating vendor payment fields ${JSON.stringify(dto)}`);

    const errors: {
      field: string;
      code: string;
      message: string;
    }[] = [];

    const {
      voucherToPay,
      companyNo,
      checkDate,
      dateToPayBy,
      bankAccountGl,
      startingCheckNo,
      item: {
        entrySequence,
        vendorNo,
        voucherNo,
        partialPayAmount,
        discountAmount,
        payOrHold,
        singleCheck,
        makePrepaid,
        prepaidCheckNo,
        prepaidDate,
        mode,
      },
    } = dto;
    const kyholdCode = KEY_HOLD_CODES[voucherToPay as PaymentVoucherType] ?? "";

    this.logger.sharedTiming("DTO destructuring completed", startTime);

    this.paymentValidationService.validateCheckDate(checkDate, errors);
    this.paymentValidationService.validateDateToPayBy(dateToPayBy, errors);
    this.paymentValidationService.validateStartingCheckNo(
      startingCheckNo,
      errors
    );
    await this.voucherHeaderValidationService.validateGlNumber(
      Number(companyNo),
      Number(bankAccountGl),
      HEADER.BANK_GL,
      ERROR_MESSAGES.INVALID_BANK_GL,
      errors
    );

    this.paymentValidationService.validateEntrySequenceFormat(
      entrySequence,
      errors
    );
    await this.paymentValidationService.validateVendor(
      vendorNo,
      companyNo,
      errors
    );

    if (
      mode === PAYMENT_OPERATION_MODE.EDIT ||
      mode === PAYMENT_OPERATION_MODE.DELETE
    ) {
      this.logger.log(`Validating entry sequence in DB for mode: ${mode}`);
      await this.paymentValidationService.validateEntrySequenceInDB(
        entrySequence,
        userId,
        errors
      );
    } else {
      this.logger.log(
        `Skipping entry sequence validation in DB for mode: ${mode}`
      );
    }
    let voucherHeaderRecord: any;
    if (voucherNo) {
      voucherHeaderRecord = await this.paymentValidationService.validateVoucher(
        voucherNo,
        companyNo,
        vendorNo,
        errors
      );
    } else {
      this.logger.log(
        `Skipping voucher validation for voucherNo its optional: ${voucherNo}`
      );
    }

    this.logger.log(
      `Voucher view data: ${JSON.stringify(voucherHeaderRecord)}`
    );

    if (partialPayAmount && voucherHeaderRecord) {
      this.paymentValidationService.validatePartialPay(
        partialPayAmount,
        voucherHeaderRecord,
        errors
      );
    } else {
      this.logger.log(
        `Skipping partial pay validation for partialPayAmount its optional: ${partialPayAmount}`
      );
    }

    if (discountAmount && voucherHeaderRecord) {
      this.paymentValidationService.validateDiscount(
        discountAmount,
        voucherNo,
        voucherHeaderRecord,
        errors
      );
    } else {
      this.logger.log(
        `Skipping discount validation for discountAmount its optional: ${discountAmount}`
      );
    }

    this.paymentValidationService.validatePayOrHold(payOrHold, errors);

    this.paymentValidationService.validateSingleCheck(singleCheck, errors);

    this.paymentValidationService.validateMakePrepaid(
      kyholdCode,
      makePrepaid,
      errors
    );

    this.paymentValidationService.validatePrepaidCheckNo(
      makePrepaid,
      prepaidCheckNo,
      prepaidDate,
      errors
    );

    if (voucherHeaderRecord) {
      this.paymentValidationService.validateBankGlWithExpectedValue(
        voucherNo,
        bankAccountGl,
        voucherHeaderRecord,
        errors
      );
    }

    this.paymentValidationService.validateVendorAndVoucher(
      vendorNo,
      voucherNo,
      errors
    );

    this.paymentValidationService.validateVoucherToPay(kyholdCode, errors);

    this.paymentValidationService.validateMakePrepaidBasedOnVoucherToPay(
      kyholdCode,
      makePrepaid,
      errors
    );

    if (voucherHeaderRecord) {
      this.paymentValidationService.validateVoucherHoldPaymentFlag(
        voucherNo,
        kyholdCode,
        voucherHeaderRecord,
        errors
      );
    }

    this.logger.sharedTiming("Vendor payment validation completed", startTime);

    this.logger.log(
      `Vendor payment validation errors: ${JSON.stringify(errors)}`
    );

    // If any validation errors are found, return them with vendor and date data
    if (errors.length > 0) {
      this.logger.sharedTiming(
        "Validation completed with errors",
        startTime,
        "end"
      );

      // For other types, just return the errors array
      return errors;
    } else {
      this.logger.sharedTiming(
        "Validation completed successfully",
        startTime,
        "end"
      );
      return {
        message: "Vendor payment validation completed successfully",
      };
    }
  }
}
