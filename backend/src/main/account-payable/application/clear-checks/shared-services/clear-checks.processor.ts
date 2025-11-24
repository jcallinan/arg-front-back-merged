import {
  Processor,
  Process,
  OnQueueCompleted,
  OnQueueFailed,
  OnQueueActive,
} from "@nestjs/bull";
import { Job } from "bullmq";
import { QUEUE_NAMES } from "@src/shared/constants/constant";
import { AppLogger } from "@src/shared/logger/logger.service";
import IORedis from "ioredis";
import { redis_connection } from "@src/shared/queue/bullmq-connection";
import { WebsocketService } from "@src/shared/websocket/websocket.service";
import { logUploadTotalTimeAndCleanup } from "@src/shared/utils/process-duration-tracker";
import { csvClearChecksMapping } from "@src/shared/constants/upload-file-constant";
import { ClearChecksValidationService } from "../validation/clear-checks.validation.service";
import { AuthUser } from "@src/auth/domain/entities/auth-user.entity";
import { UserContext } from "@src/shared/utils/user-context";

@Processor(QUEUE_NAMES.CLEAR_CHECKS)
export class ClearChecksProcessor {
  private readonly logger = new AppLogger(ClearChecksProcessor.name);
  private readonly redis = new IORedis(redis_connection);

  constructor(
    private readonly websocketService: WebsocketService,
    private readonly validationService: ClearChecksValidationService
  ) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(`Queue clear-checks job ${job.id} is now active`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job, _result: any) {
    this.logger.log(`Queue clear-checks job ${job.id} completed successfully`);
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.error(
      `Job ${job.id} failed with error: ${error.message}`,
      error.stack
    );
  }

  @Process("*")
  async handle(job: Job) {
    const { userId, uploadId, batchIndex, totalBatches, records } =
      job.data as any;
    this.logger.log(
      `Processing clear-checks batch ${batchIndex} with ${records.length} records`
    );

    // Create an AuthUser object to bind in context
    const authUser: AuthUser = new AuthUser(
      "", // email - not available in job context
      "", // userId - not available in job context
      "", // userName - not available in job context
      "", // userDisplayName - not available in job context
      userId // userInitails
    );

    // Run the entire batch inside UserContext
    return UserContext.run(authUser, async () => {
      const batchSummary = await Promise.all(
        records.map((row: any, idx: number) =>
          this.processCheckRow(row, batchIndex, idx)
        )
      );

      await this.storeBatchSummaryInRedis(uploadId, batchIndex, batchSummary);
      await this.checkAndEmitFinalSummary(uploadId, totalBatches);

      return { uploadId, summary: batchSummary };
    });
  }

  private async processCheckRow(
    row: any,
    batchIndex: number,
    recordIndex: number
  ) {
    // Calculate sequential row number starting at 1 across batches
    // batchIndex * batchSize + recordIndex + 1
    const batchSize = 5; // Must match process-config totalBatchSize
    const excelRowNumber = batchIndex * batchSize + recordIndex + 1;

    // Use new header format only
    const checkNo = row[csvClearChecksMapping.checkNo];
    const checkAmount = row[csvClearChecksMapping.checkAmount];

    // Date parts from new header format
    const year = row[csvClearChecksMapping.year]?.toString();
    const month = row[csvClearChecksMapping.month]?.toString();
    const day = row[csvClearChecksMapping.date]?.toString();

    let mmddyy = "";
    if (year && month && day) {
      mmddyy = this.formatToMmddyy(year, month, day);
    }

    const dbValidation = await this.validationService.validateAgainstDb({
      checkNo,
      checkAmount: Number(checkAmount),
      clearDateMmddyy: mmddyy,
      rowIndex: excelRowNumber,
    });

    if (dbValidation.isValid) {
      this.logger.log(
        `Check ${checkNo} validated successfully: Amount ${checkAmount}, Clear Date: ${mmddyy}`
      );
      return {
        checkNo,
        checkAmount: parseFloat(checkAmount),
        date: mmddyy,
        status: "S",
        errors: [],
        warnings: [],
      };
    } else {
      // Format errors with the required structure including row number
      const formattedErrors = dbValidation.errors.map((error: any) => ({
        field: error.field,
        message: error.message,
        code: "Validation error",
        id: String(error.rowIndex || excelRowNumber),
      }));

      return {
        checkNo,
        checkAmount: parseFloat(checkAmount) || 0,
        date: mmddyy,
        status: "E",
        errors: formattedErrors,
        warnings: [],
      };
    }
  }

  private formatToMmddyy(year: any, month: any, day: any): string {
    const y = String(year).trim();
    const m = String(month).trim().padStart(2, "0");
    const d = String(day).trim().padStart(2, "0");

    if (!/^\d{4}$/.test(y) || !/^\d{2}$/.test(m) || !/^\d{2}$/.test(d)) {
      return "";
    }
    const yy = y.slice(-2);
    return `${m}${d}${yy}`;
  }

  private async storeBatchSummaryInRedis(
    uploadId: string,
    batchIndex: number,
    summary: any
  ) {
    const redisKey = `upload:${uploadId}:summaries`;
    await this.redis.hset(redisKey, `${batchIndex}`, JSON.stringify(summary));
    this.logger.log(`Stored summary for batch ${batchIndex} under ${redisKey}`);
  }

  private async checkAndEmitFinalSummary(
    uploadId: string,
    totalBatches: number
  ) {
    const redisKey = `upload:${uploadId}:summaries`;
    const completedCount = await this.redis.hlen(redisKey);
    this.logger.log(
      `Completed batches for ${uploadId}: ${completedCount}/${totalBatches}`
    );
    if (completedCount >= totalBatches) {
      await logUploadTotalTimeAndCleanup(this.redis, uploadId, this.logger);
      const summariesObj = await this.redis.hgetall(redisKey);

      await this.websocketService.emitFinalSummaryToWebSocket(
        uploadId,
        summariesObj
      );
      await this.redis.del(redisKey);
      this.logger.log(`Cleaned up Redis key ${redisKey}`);
    }
  }
}
