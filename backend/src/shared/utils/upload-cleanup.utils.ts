import * as fs from "fs";
import { AppLogger } from "../logger/logger.service";

/**
 * Utility function to clean up the entire uploads folder
 * @param uploadId - Upload ID for logging
 */
export async function cleanupEntireUploadsFolder(uploadId: string): Promise<void> {
  const logger = new AppLogger("FileCleanupUtil");
  
  try {
    const uploadsPath = "uploads";
    if (fs.existsSync(uploadsPath)) {
      fs.rmSync(uploadsPath, { recursive: true, force: true });
      logger.log(`Cleaned up entire uploads folder for upload ${uploadId}`);
    } else {
      logger.log(`Uploads folder not found for upload ${uploadId}`);
    }
  } catch (error: any) {
    logger.error(`Failed to cleanup uploads folder for upload ${uploadId}: ${error.message}`);
    throw error;
  }
}
