import { Inject, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import {
  SingleCheckValidationDto,
  SingleCheckValidationResponseDto,
} from "../../dto/clear-checks.dto";
import { CheckInquiryInterface } from "@src/main/account-payable/domain/interface/check-inquiry.interface";
import { CheckInquiryHistoryValidationData } from "@src/main/account-payable/domain/interface/check-inquiry.interface";

@Injectable()
export class ValidateSingleCheckUseCase {
  private readonly logger = new AppLogger(ValidateSingleCheckUseCase.name);

  constructor(
    @Inject("CheckInquiryInterface")
    private readonly checkInquiryInterface: CheckInquiryInterface
  ) {}

  async execute(
    validationData: SingleCheckValidationDto
  ): Promise<SingleCheckValidationResponseDto> {
    this.logger.log(`Validating single check: ${validationData.checkNo}`);

    try {
      // Prepare validation data for domain service
      const domainValidationData: CheckInquiryHistoryValidationData = {
        checkNo: validationData.checkNo,
        checkAmount: validationData.checkAmount,
        clearDateMmddyy: validationData.checkDate,
      };

      // Delegate validation to domain service
      const validationResult =
        await this.checkInquiryInterface.validateCheckInquiryHistory(
          domainValidationData
        );

      // Transform domain result to response DTO
      const response: SingleCheckValidationResponseDto = {
        checkNo: validationData.checkNo,
        checkAmount: validationData.checkAmount,
        checkDate: validationData.checkDate,
        isValid: validationResult.isValid,
        errors: validationResult.errors,
        warnings: [],
      };

      this.logger.log(
        `Check validation completed for ${validationData.checkNo}: ${validationResult.isValid ? "Valid" : "Invalid"}`
      );

      return response;
    } catch (error: any) {
      this.logger.error(
        `Error validating check ${validationData.checkNo}: ${error.message}`,
        error.stack
      );
      throw new Error(`Validation failed: ${error.message}`);
    }
  }
}
