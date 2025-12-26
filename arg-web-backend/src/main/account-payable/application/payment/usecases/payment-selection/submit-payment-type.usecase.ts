import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { errorResponse } from "@src/shared/utils/response-formatter";
import { SubmitPaymentSelectionTypeDto } from "../../dto/payment.dto";
import {
  PAYMENT_OPERATION_MODE,
  PAYMENT_VOUCHER_TYPES,
  KEY_HOLD_CODES,
} from "@src/shared/constants/payment-constant";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constant";
import { PaymentSharedService } from "../../shared-services/payment.shared.service";
import { PAYMENT_STORE_PROCEDURE } from "@src/shared/constants/payment-constant";
import { callSP } from "@src/shared/config/store-procedure-config";
import { padString } from "@src/shared/utils/flatfiles-slicers.utils";
import { currentUserInitials } from "@src/shared/utils/user-context";

@Injectable()
export class SubmitPaymentTypeUseCase {
  private readonly logger = new AppLogger(SubmitPaymentTypeUseCase.name);

  constructor(private readonly paymentSharedService: PaymentSharedService) {}

  async execute(dto: SubmitPaymentSelectionTypeDto) {
    this.logger.log(
      `Submitting Payment Selection Type: ${JSON.stringify(dto)}`
    );

    // Step 1: Validate input (business rules)
    const paymentTypeValidationStartTime = Date.now();
    this.logger.sharedTiming(
      "Starting header validation",
      paymentTypeValidationStartTime
    );

    const paymentTypeValidationResult =
      await this.paymentSharedService.paymentTypeValidation(dto);

    this.logger.sharedTiming(
      `Payment type validation completed (${Date.now() - paymentTypeValidationStartTime}ms)`,
      paymentTypeValidationStartTime
    );

    if (
      Array.isArray(paymentTypeValidationResult) &&
      paymentTypeValidationResult.length > 0
    ) {
      this.logger.sharedTiming(
        `Payment type validation failed with ${paymentTypeValidationResult.length} errors`,
        paymentTypeValidationStartTime,
        "end"
      );
      throw new HttpException(
        errorResponse(
          ERROR_CONSTANTS.VALIDATION_ERROR,
          paymentTypeValidationResult
        ),
        HttpStatus.BAD_REQUEST
      );
    }

    // Step 2: Run SP logic based on voucher payment type
    const results = await this.callStoredProcedure(dto);

    return {
      message: "Payment type selection submitted successfully",
      results,
    };
  }

  private async callStoredProcedure(
    dto: SubmitPaymentSelectionTypeDto
  ): Promise<any[]> {
    const {
      companyNo,
      bankAccountGl,
      startingCheckNo,
      checkDate,
      dateToPayBy,
      forcedDiscount,
      voucherToPay,
      mode,
    } = dto;

    const results: any[] = [];
    const keyHold = KEY_HOLD_CODES[voucherToPay];
    const userId = currentUserInitials();
    this.logger.debug(`userId: ${userId}`);
    
    const userParams = {
      userId,
      companyNo,
      bankAccountGl,
      startingCheckNo,
      checkDate,
      dateToPayBy,
      forcedDiscount,
      keyHold,
    };

    const formattedUserParams = this.formatSPParams(userParams);

    this.logger.debug(`userParams: ${JSON.stringify(formattedUserParams)}`);
    this.logger.debug(`Calling SP for type: ${voucherToPay}`);

    // Only run SPs on supported voucher types
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

    // Only run SPs for SAVE / EDIT
    if (
      mode === PAYMENT_OPERATION_MODE.SAVE ||
      mode === PAYMENT_OPERATION_MODE.EDIT
    ) {
      this.logger.debug(`[${voucherToPay}] Running SP for AP150ACLPRC`);
      const resultAP150ACLPRC = await callSP(
        PAYMENT_STORE_PROCEDURE.AP150ACLPRC
      ).execute({ userId });

      results.push({
        mode,
        spName: PAYMENT_STORE_PROCEDURE.AP150ACLPRC,
        output: resultAP150ACLPRC,
      });

      this.logger.debug(`[${voucherToPay}] Running SP for APPYTRHCLPRC`);
      const resultAPPYTRHCLPRC = await callSP(
        PAYMENT_STORE_PROCEDURE.APPYTRHCLPRC
      ).execute(formattedUserParams);

      results.push({
        mode,
        spName: PAYMENT_STORE_PROCEDURE.APPYTRHCLPRC,
        output: resultAPPYTRHCLPRC,
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

      dateToPayBy: userParams.dateToPayBy
        ? padString(userParams.dateToPayBy, 6) // assume already in MMDDYY format
        : "000000",
    };
  }
}
