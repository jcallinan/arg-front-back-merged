import { FlowProducer } from "bullmq";
import { Injectable, BadRequestException } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { validateXlsxHeaderOrder } from "@src/shared/utils/xlsx.utils";
import { getProcessTypeConfig } from "@src/shared/config/process-config";
import { AppLogger } from "@src/shared/logger/logger.service";
import { redis_connection } from "@src/shared/queue/bullmq-connection";
import { CompanyService } from "@src/main/account-payable/domain/services/company/companies.service";
import { VoucherSharedService } from "@src/main/account-payable/application/voucher/shared-services/voucher.shared.service";
import { QueueSelector } from "@src/shared/config/queue-selector";
import { VoucherCleanupService } from "@src/main/account-payable/application/voucher/shared-services/voucher-cleanup.service";
import { UploadOrchestrator } from "../orchestrator/upload.orchestrator";
import { cleanupEntireUploadsFolder } from "@src/shared/utils/upload-cleanup.utils";

@Injectable()
export class VoucherCsvUploadUseCase {
  private readonly logger = new AppLogger(VoucherCsvUploadUseCase.name);

  constructor(
    private readonly queueSelector: QueueSelector,
    private readonly companyService: CompanyService,
    private readonly voucherSharedService: VoucherSharedService,
    private readonly voucherCleanupService: VoucherCleanupService
  ) {}

  async execute(userId: any, uploadType: any, file: any, subType?: string) {
    // Use values as-is (should be lowercase, per enums and config)
    this.logger.log(
      `[INFO] Uploading Voucher CSV for ${uploadType}${subType ? " (" + subType + ")" : ""}`
    );
    const uploadId = `U-${Date.now()}-${uuidv4()}`;
    const config = getProcessTypeConfig(uploadType, subType);
    if (!config) {
      throw new BadRequestException(
        `Unsupported upload type or subtype: ${uploadType}${subType ? " / " + subType : ""}`
      );
    }

    try {
      // Validate the xlsx header
      validateXlsxHeaderOrder(file.path, config.expectedHeaders);

      // Step 1: Clean up existing records before processing new upload
      this.logger.log(`Starting cleanup of existing ${uploadType} records...`);
      await this.voucherCleanupService.cleanupExistingRecords(
        uploadType,
        10 // Default company number
      );
      this.logger.log(`Cleanup completed for ${uploadType} records`);

      // Use orchestrator + FlowProducer to create multi-batch jobs
      const orchestrator = new UploadOrchestrator(
        config,
        file.path,
        new FlowProducer({
          connection: redis_connection,
        }),
        uploadType,
        uploadId,
        userId,
        this.queueSelector,
        this.companyService,
        this.voucherSharedService,
        subType // Pass subType to orchestrator
      );

      const result = await orchestrator.process();

      // Clean up the entire uploads folder after successful processing
      await cleanupEntireUploadsFolder(uploadId);

      return {
        message: `${uploadType}${subType ? " (" + subType + ")" : ""} CSV accepted, split into batches`,
        ...result,
      };
    } catch (error) {
      // Clean up the entire uploads folder even if there's an error (empty file, validation error, etc.)
      await cleanupEntireUploadsFolder(uploadId);
      throw error; // Re-throw the error after cleanup
    }
  }
}
