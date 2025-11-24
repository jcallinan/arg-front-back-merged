import { Injectable, BadRequestException } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { FlowProducer } from "bullmq";
import { redis_connection } from "@src/shared/queue/bullmq-connection";
import { AppLogger } from "@src/shared/logger/logger.service";
import { setUploadStartTime } from "@src/shared/utils/process-duration-tracker";
import {
  parseXlsxWithRowHeaders,
  filterAndNormalizeRows,
  validateExcelHasDataRecords,
  validateXlsxHeaderOrder,
} from "@src/shared/utils/xlsx.utils";
import { ProcessType } from "@src/shared/constants/strategy-type.enum";
import { getProcessTypeConfig } from "@src/shared/config/process-config";
import { QueueSelector } from "@src/shared/config/queue-selector";
import { cleanupEntireUploadsFolder } from "@src/shared/utils/upload-cleanup.utils";

@Injectable()
export class ClearChecksUploadUseCase {
  private readonly logger = new AppLogger(ClearChecksUploadUseCase.name);

  constructor(
    private readonly queueSelector: QueueSelector
  ) {}

  async execute(userId: any, uploadType: ProcessType, file: any) {
    const uploadId = `CC-${Date.now()}-${uuidv4()}`;
    this.logger.log(`[INFO] Uploading ClearChecks for ${uploadType}`);

    const config = getProcessTypeConfig(uploadType);
    if (!config) {
      throw new BadRequestException(`Unsupported upload type: ${uploadType}`);
    }

    try {
      // Validate the xlsx header with new format
      validateXlsxHeaderOrder(file.path, config.expectedHeaders);

      // Parse the Excel file
      const rows = parseXlsxWithRowHeaders(file.path);

      // Validate that the file contains actual data records after the headers
      validateExcelHasDataRecords(file.path, 1);

      // Normalize and filter rows
      const cleaned = filterAndNormalizeRows(rows, uploadType);

      // Batch raw rows directly
      const batches = this.chunkArray(cleaned, config.batchSize);

      const queueName = this.queueSelector.getQueueName(uploadType as any);

      const flowProducer = new FlowProducer({ connection: redis_connection });
      const redis = new (require("ioredis"))(redis_connection);
      await setUploadStartTime(redis, uploadId);

      const flow = await flowProducer.add({
        name: `${uploadType}-parent-job`,
        queueName,
        data: { uploadId, userId },
        children: batches.map((batch, index) => ({
          name: `${uploadType}-batch-${index}`,
          data: {
            uploadType,
            records: batch,
            uploadId,
            userId,
            batchIndex: index,
            totalBatches: batches.length,
          },
          queueName,
        })),
      });

      const parentJobId: string = flow.job?.id ?? "";
      const childJobIds: string[] =
        (flow.children?.map((c) => c.job?.id).filter(Boolean) as string[]) ?? [];

      // Clean up the entire uploads folder after successful processing
      await cleanupEntireUploadsFolder(uploadId);

      return {
        message: `ClearChecks accepted, split into batches`,
        uploadId,
        totalGroups: cleaned.length,
        totalBatches: batches.length,
        parentJobId,
        childJobIds,
      };
    } catch (error) {
      // Clean up the entire uploads folder even if there's an error (empty file, validation error, etc.)
      await cleanupEntireUploadsFolder(uploadId);
      throw error; // Re-throw the error after cleanup
    }
  }

  private chunkArray<T>(arr: T[], size: number): T[][] {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  }
}
