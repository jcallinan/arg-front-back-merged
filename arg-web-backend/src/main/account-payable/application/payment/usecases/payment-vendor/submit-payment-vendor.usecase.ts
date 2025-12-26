import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { errorResponse } from "@src/shared/utils/response-formatter";
import { SubmitVendorPaymentsDto } from "../../dto/payment.dto";
import {
  PAYMENT_OPERATION_MODE,
  PAYMENT_VOUCHER_TYPES,
} from "@src/shared/constants/payment-constant";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constant";
import { PaymentSharedService } from "../../shared-services/payment.shared.service";
import { PAYMENT_STORE_PROCEDURE } from "@src/shared/constants/payment-constant";
import { callSP } from "@src/shared/config/store-procedure-config";
import {
  padInteger,
  padString,
} from "@src/shared/utils/flatfiles-slicers.utils";
import { currentUserInitials } from "@src/shared/utils/user-context";

@Injectable()
export class SubmitPaymentVendorUseCase {
  private readonly logger = new AppLogger(SubmitPaymentVendorUseCase.name);

  constructor(private readonly paymentSharedService: PaymentSharedService) {}

  async execute(dto: SubmitVendorPaymentsDto) {
 
    const userId = currentUserInitials();
    this.logger.debug(`userId: ${userId}`);

    this.logger.log(`Submitting Vendor Payment: ${JSON.stringify(dto)}`);

    // Step 1: Validate input (business rules)
    const vendorPaymentValidationStartTime = Date.now();
    this.logger.sharedTiming(
      "Starting vendor payment validation",
      vendorPaymentValidationStartTime
    );

    const vendorPaymentValidationResult =
      await this.paymentSharedService.vendorPaymentValidation(dto, userId);

    this.logger.sharedTiming(
      `Vendor payment validation completed (${Date.now() - vendorPaymentValidationStartTime}ms)`,
      vendorPaymentValidationStartTime
    );

    if (
      Array.isArray(vendorPaymentValidationResult) &&
      vendorPaymentValidationResult.length > 0
    ) {
      this.logger.sharedTiming(
        `Vendor payment validation failed with ${vendorPaymentValidationResult.length} errors`,
        vendorPaymentValidationStartTime,
        "end"
      );
      throw new HttpException(
        errorResponse(
          ERROR_CONSTANTS.VALIDATION_ERROR,
          vendorPaymentValidationResult
        ),
        HttpStatus.BAD_REQUEST
      );
    }

    // Step 2: Run SP logic based on voucher payment type
    const results = await this.callStoredProcedure(dto, userId);

    return {
      message: "Vendor payment submitted successfully",
      results: results,
    };
  }

  private async callStoredProcedure(
    dto: SubmitVendorPaymentsDto,
    userId: string
  ): Promise<any[]> {
    const {
      companyNo,
      bankAccountGl,
      startingCheckNo,
      checkDate,
      dateToPayBy,
      voucherToPay,
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
        forcedDiscount,
        mode,
      },
    } = dto;

    const userParams = {
      userId,
      companyNo,
      entrySequence,
      bankAccountGl,
      startingCheckNo,
      checkDate,
      dateToPayBy,
      forcedDiscount,
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
    };

    const formattedUserParams = this.formatSPParams(userParams);

    this.logger.debug(`userParams: ${JSON.stringify(formattedUserParams)}`);
    this.logger.debug(`Calling SP for voucher type: ${voucherToPay}`);

    const results: any[] = [];

    // Validate voucher type
    if (
      ![
        PAYMENT_VOUCHER_TYPES.CHECK,
        PAYMENT_VOUCHER_TYPES.ACH,
        PAYMENT_VOUCHER_TYPES.WIRE,
        PAYMENT_VOUCHER_TYPES.EMPLOYEE_EXPENSE,
        PAYMENT_VOUCHER_TYPES.UTILITY,
      ].includes(voucherToPay as any)
    ) {
      this.logger.error(`Unsupported voucher type: ${voucherToPay}`);
      throw new Error(`Unsupported voucher type: ${voucherToPay}`);
    }

    // Execute SP only for SAVE, EDIT, DELETE
    if (
      [
        PAYMENT_OPERATION_MODE.SAVE,
        PAYMENT_OPERATION_MODE.EDIT,
        PAYMENT_OPERATION_MODE.DELETE,
      ].includes(mode)
    ) {
      this.logger.debug(`[${voucherToPay}] Running SP for APPYTRDCLPRC`);

      const resultAPPYTRDCLPRC = await callSP(
        PAYMENT_STORE_PROCEDURE.APPYTRDCLPRC
      ).execute(formattedUserParams);

      results.push({
        mode,
        spName: PAYMENT_STORE_PROCEDURE.APPYTRDCLPRC,
        output: resultAPPYTRDCLPRC,
      });
    }

    return results;
  }

  private formatSPParams(userParams: any) {
    return {
      ...userParams,
      companyNo: String(userParams.companyNo),
      bankAccountGl: String(userParams.bankAccountGl),
      startingCheckNo: String(userParams.startingCheckNo),
      checkDate: String(userParams.checkDate),
      mode: String(userParams.mode),

      vendorNo: padInteger(userParams.vendorNo, 5), // 1875 → "01875"
      dateToPayBy: userParams.dateToPayBy
        ? padString(userParams.dateToPayBy, 6) // assume already in MMDDYY format
        : "000000",
      voucherNo: userParams.voucherNo
        ? padInteger(userParams.voucherNo, 5)
        : "00000",
      partialPayAmount:
        userParams.partialPayAmount && userParams.partialPayAmount !== 0
          ? padInteger(Math.round(userParams.partialPayAmount * 100), 6)
          : "000000",
      discountAmount:
        userParams.discountAmount && userParams.discountAmount !== 0
          ? padInteger(Math.round(userParams.discountAmount * 100), 5)
          : "00000",

      prepaidCheckNo: userParams.prepaidCheckNo
        ? padString(userParams.prepaidCheckNo, 6) 
        : "000000",
      prepaidDate: userParams.prepaidDate
        ? padString(userParams.prepaidDate, 6) // assume already MMDDYY
        : "000000",
    };
  }
}
