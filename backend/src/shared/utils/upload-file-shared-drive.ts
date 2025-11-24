import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { environments } from '../constants/constant';

/**
 * Saves a buffer to a file in the specified shared drive path.
 * @param buffer - File buffer (Excel or any other)
 * @param fileName - File name to save as (e.g., report.xlsx)
 * @param directoryPath - Target directory (e.g., /srv/samba/share/G-Drive)
 * @returns Full file path
 */
export async function saveFileToSharedDrive(
  buffer: Buffer,
  fileName: string,
  directoryPath: string = process.env.FILE_ROOTH_PATH ?? '/srv/samba/share/G-Drive',
): Promise<{ fullPath: string, fileName: string }> {
  const fullPath = path.join(directoryPath, fileName);

  // Check if we should use SSH upload (when FILE_UPLOAD=local)
  if (process.env.HOST === environments.localhost) {
    return await manageFileForDev(buffer, fileName, directoryPath);
  }

  // Ensure the directory exists
  fs.mkdirSync(directoryPath, { recursive: true });

  // Write the buffer to the file
  fs.writeFileSync(fullPath, buffer);

  return { fullPath, fileName };
}

/**
 * Saves a buffer to a file on the remote Linux server via SSH
 * Only used when FILE_UPLOAD=local environment variable is set
 */
async function manageFileForDev(
  buffer: Buffer,
  fileName: string,
  directoryPath: string,
): Promise<{ fullPath: string, fileName: string }> {
  const execAsync = promisify(exec);
  
  const fullPath = path.join(directoryPath, fileName);
  
  // Configuration for SSH connection
  // Note: SSH credentials are read directly from system environment variables (terminal)
  // These are NOT stored in Azure Key Vault and NOT loaded from .env files
  // Set these as environment variables in your terminal: SSHHOST, SSHUSER, SSHPASSWORD
  const SSH_CONFIG = {
    host: process.env.SSH_HOST || '',
    username: process.env.SSH_USER || '',
    password: process.env.SSH_PASSWORD || '',
    remotePath: directoryPath,
  };

  // Validate required SSH configuration
  if (!SSH_CONFIG.host || !SSH_CONFIG.username || !SSH_CONFIG.password) {
    throw new Error('SSH configuration missing. Please set SSHHOST, SSHUSER, and SSHPASSWORD environment variables in your terminal.');
  }

  try {
    // Create a temporary local file
    const tempDir = '/tmp';
    const tempFilePath = path.join(tempDir, fileName);
    
    // Write buffer to temporary file
    fs.writeFileSync(tempFilePath, buffer);
    
    // Upload file to remote server via SSH
    // Using -o StrictHostKeyChecking=no to skip host key verification
    const sshCommand = `sshpass -p '${SSH_CONFIG.password}' scp -o StrictHostKeyChecking=no "${tempFilePath}" ${SSH_CONFIG.username}@${SSH_CONFIG.host}:${SSH_CONFIG.remotePath}/`;
    
    console.log(`[SSH Upload] Uploading ${fileName} to ${SSH_CONFIG.username}@${SSH_CONFIG.host}:${SSH_CONFIG.remotePath}/`);
    
    const { stderr } = await execAsync(sshCommand);
    
    if (stderr && !stderr.includes('Warning')) {
      console.error(`[SSH Upload Error] ${stderr}`);
      throw new Error(`SSH upload failed: ${stderr}`);
    }
    
    // Clean up temporary file
    fs.unlinkSync(tempFilePath);
    
    console.log(`[SSH Upload] Successfully uploaded ${fileName} to remote server`);
    
    return { fullPath, fileName };
    
  } catch (error) {
    console.error(`[SSH Upload Error] Failed to upload ${fileName} Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}
