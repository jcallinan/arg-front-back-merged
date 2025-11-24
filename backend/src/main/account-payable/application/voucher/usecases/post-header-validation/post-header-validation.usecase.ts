import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { HeaderDto } from "../../dto/voucher.dto";
import {
  errorResponse,
  simpleResponse,
} from "@src/shared/utils/response-formatter";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constant";
import { VoucherSharedService } from "../../shared-services/voucher.shared.service";

@Injectable()
export class VoucherHeaderValidationUseCase {
  private readonly logger = new AppLogger(VoucherHeaderValidationUseCase.name);

  constructor(private readonly voucherSharedService: VoucherSharedService) {}

  async execute(dto: HeaderDto) {
    const startTime = Date.now();
    this.logger.timing(
      "Starting Voucher Header Validation",
      startTime,
      "start"
    );

    this.logger.log("Validating Voucher Grid Entry Header Data");

    const preValidationTime = Date.now();
    this.logger.timing("Pre-validation setup completed", startTime);

    const validationResult =
      await this.voucherSharedService.headerValidation(dto);

    const postValidationTime = Date.now();
    this.logger.timing("Header validation completed", startTime);
    this.logger.timing(
      `Validation took ${postValidationTime - preValidationTime}ms`,
      startTime
    );

    // If validation fails with array of errors
    if (Array.isArray(validationResult)) {
      this.logger.timing("Error processing started", startTime);
      this.logger.timing("Total execution time (with error)", startTime, "end");
      
      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.VALIDATION_ERROR, validationResult),
        HttpStatus.BAD_REQUEST
      );
    }
    
    // If validation fails with processor errors (FLEXI/SOGAS)
    if (validationResult && 'errors' in validationResult) {
      this.logger.timing("Processor error processing started", startTime);
      this.logger.timing("Total execution time (with error)", startTime, "end");
      
      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.VALIDATION_ERROR, validationResult.errors),
        HttpStatus.BAD_REQUEST
      );
    }
    
    // Success case - return validation result
    this.logger.timing("Success processing started", startTime);
    const response = simpleResponse(validationResult);
    
    this.logger.timing("Success processing completed", startTime);
    this.logger.timing("Total execution time (success)", startTime, "end");
    return response;
  }
}
