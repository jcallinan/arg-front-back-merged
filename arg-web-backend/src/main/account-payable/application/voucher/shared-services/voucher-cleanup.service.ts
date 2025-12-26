import { Injectable, Inject } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { VoucherHeaderInterface } from "@src/main/account-payable/domain/interface/voucher.interface";
import { VoucherDetailInterface } from "@src/main/account-payable/domain/interface/voucher.interface";
import { ProcessType } from "@src/shared/constants/strategy-type.enum";
import { PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";

@Injectable()
export class VoucherCleanupService {
  private readonly logger = new AppLogger(VoucherCleanupService.name);

  constructor(
    @Inject("VoucherHeaderInterface")
    private readonly voucherHeaderInterface: VoucherHeaderInterface,
    @Inject("VoucherDetailInterface")
    private readonly voucherDetailInterface: VoucherDetailInterface
  ) {}

  /**
   * Cleans up existing voucher records for the specified upload type
   * Uses ORM methods to delete records from APTRANH and APTRAND tables
   *
   * @param uploadType - The upload type (FLEXI or SOGAS)
   * @param companyNo - The company number (default: 10)
   * @returns Promise<{deletedHeaders: number, deletedDetails: number}>
   */
  async cleanupExistingRecords(
    uploadType: ProcessType,
    companyNo: number = 10
  ): Promise<{ deletedHeaders: number; deletedDetails: number }> {
    this.logger.log(
      `Starting cleanup for upload type: ${uploadType}, company: ${companyNo}`
    );

    try {
      // Map upload type to process type
      const processType = this.mapUploadTypeToProcessType(uploadType);

      if (!processType) {
        throw new Error(`Invalid upload type: ${uploadType}`);
      }

      this.logger.log(`Cleaning up records with process type: ${processType}`);

      // Execute cleanup using ORM methods
      const result = await this.cleanupByProcessType(companyNo, processType);

      this.logger.log(
        `Cleanup completed successfully. Deleted ${result.deletedHeaders} headers and ${result.deletedDetails} details`
      );

      return result;
    } catch (error: any) {
      this.logger.error(
        `Error during cleanup for upload type ${uploadType}: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * Executes ORM cleanup for a specific process type
   *
   * @param companyNo - The company number
   * @param processType - The process type to clean up (FLEXI or SOGAS)
   * @returns Promise<{deletedHeaders: number, deletedDetails: number}>
   */
  async cleanupByProcessType(
    companyNo: number,
    processType: string
  ): Promise<{ deletedHeaders: number; deletedDetails: number }> {
    this.logger.log(
      `Executing ORM cleanup for company: ${companyNo}, process type: ${processType}`
    );

    try {
      // Step 1: Get entry numbers from APTRANH where ATPTYP matches the process type
      const entryNumbers =
        await this.voucherHeaderInterface.getEntryNumbersByProcessType(
          companyNo,
          processType
        );

      this.logger.log(
        `Found ${entryNumbers.length} entry numbers for process type: ${processType}`
      );

      let deletedDetails = 0;
      let deletedHeaders = 0;

      if (entryNumbers.length > 0) {
        // Step 2: Delete records from APTRAND using those entry numbers
        deletedDetails = await this.voucherDetailInterface.deleteByEntryNumbers(
          companyNo,
          entryNumbers
        );

        // Step 3: Delete records from APTRANH where ATPTYP matches
        deletedHeaders = await this.voucherHeaderInterface.deleteByProcessType(
          companyNo,
          processType
        );
      }

      this.logger.log(
        `ORM cleanup completed: ${deletedHeaders} headers and ${deletedDetails} details deleted`
      );

      return {
        deletedHeaders,
        deletedDetails,
      };
    } catch (error: any) {
      this.logger.error(
        `Error during ORM cleanup: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * Maps upload type to process type
   */
  private mapUploadTypeToProcessType(uploadType: ProcessType): string | null {
    switch (uploadType) {
      case ProcessType.FLEXI:
        return PROCESS_TYPE_ENUM.FLEXI;
      case ProcessType.SOGAS:
        return PROCESS_TYPE_ENUM.SOGAS;
      default:
        return null;
    }
  }
}
