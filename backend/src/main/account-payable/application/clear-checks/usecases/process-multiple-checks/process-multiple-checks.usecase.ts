import { Inject, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import {
  ProcessMultipleChecksDto,
  ProcessMultipleChecksResponseDto,
} from "../../dto/clear-checks.dto";
import { CheckInquiryInterface } from "@src/main/account-payable/domain/interface/check-inquiry.interface";
import { ProcessMultipleChecksData } from "@src/main/account-payable/domain/interface/check-inquiry.interface";

@Injectable()
export class ProcessMultipleChecksUseCase {
  private readonly logger = new AppLogger(ProcessMultipleChecksUseCase.name);

  constructor(
    @Inject("CheckInquiryInterface")
    private readonly checkInquiryInterface: CheckInquiryInterface
  ) {}

  async execute(
    processData: ProcessMultipleChecksDto
  ): Promise<ProcessMultipleChecksResponseDto> {
    this.logger.log(`Processing ${processData.checks.length} checks`);

    try {
      // Transform DTO to domain format
      const domainData: ProcessMultipleChecksData[] = processData.checks.map(
        (check) => ({
          checkNo: check.checkNo,
          checkAmount: check.checkAmount,
          checkDate: check.checkDate,
        })
      );

      // Process all checks
      const results =
        await this.checkInquiryInterface.processMultipleChecks(domainData);

      // Calculate summary statistics
      const successful = results.filter(
        (r) => !r.errors || r.errors.length === 0
      ).length;
      const failed = results.filter(
        (r) => r.errors && r.errors.length > 0
      ).length;

      const response: ProcessMultipleChecksResponseDto = {
        message: `Processed ${processData.checks.length} checks. ${successful} successful, ${failed} failed.`,
        totalProcessed: processData.checks.length,
        successful,
        failed,
        results: results.map((result) => ({
          checkNo: result.checkNo,
          checkAmount: result.checkAmount,
          checkDate: result.checkDate,
          message: result.message,
          errors: result.errors,
        })),
      };

      this.logger.log(
        `Multiple checks processing completed: ${successful} successful, ${failed} failed`
      );

      return response;
    } catch (error) {
      this.logger.error(
        `Error processing multiple checks: ${error instanceof Error ? error.message : "Unknown error"}`,
        error instanceof Error ? error.stack : undefined
      );
      throw new Error(
        `Processing failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
}
