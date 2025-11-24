import IORedis from "ioredis";
import { formatDurationMs } from "@src/shared/utils/format-date";

/**
 * Sets the start time for an upload in Redis.
 */
export async function setUploadStartTime(redis: IORedis, uploadId: string) {
  const startKey = `upload:${uploadId}:startTime`;
  await redis.set(startKey, Date.now().toString());
}

/**
 * Calculates total time for upload using start time in Redis,
 * logs via provided logger, then cleans up.
 */
export async function logUploadTotalTimeAndCleanup(
  redis: IORedis,
  uploadId: string,
  logger: { log: (msg: string) => void }
) {
  const startKey = `upload:${uploadId}:startTime`;
  const startTimeStr = await redis.get(startKey);

  if (startTimeStr) {
    const startTime = parseInt(startTimeStr, 10);
    const durationMs = Date.now() - startTime;

    logger.log(
      `Upload ${uploadId} completed all batches in ${formatDurationMs(durationMs)}`
    );

    await redis.del(startKey);
  } else {
    logger.log(`No start time found in Redis for upload ${uploadId}`);
  }
}

/**
 * Sets the start time for an batch in Redis.
 */
export async function setBatchStartTime(redis: IORedis, batchId: string) {
  const startKey = `batch:${batchId}:startTime`;
  await redis.set(startKey, Date.now().toString());
}
/**
 * Calculates total time for upload using start time in Redis,
 * logs via provided logger, then cleans up.
 */
export async function logBatchTotalTimeAndCleanup(
  redis: IORedis,
  batchId: string,
  logger: { log: (msg: string) => void }
) {
  const startKey = `batch:${batchId}:startTime`;
  const startTimeStr = await redis.get(startKey);

  if (startTimeStr) {
    const startTime = parseInt(startTimeStr, 10);
    const durationMs = Date.now() - startTime;

    logger.log(
      `Batch ${batchId} completed all invoices in ${formatDurationMs(durationMs)}`
    );

    await redis.del(startKey);
  } else {
    logger.log(`No start time found in Redis for batch ${batchId}`);
  }
}
