// encryption.service.ts
import { Injectable } from '@nestjs/common';
import { AppLogger } from '@src/shared/logger/logger.service';
import * as crypto from 'crypto';

@Injectable()
export class CryptoSharedService {
  private readonly logger = new AppLogger(CryptoSharedService.name);
  private readonly algorithm = 'aes-256-cbc';
  private readonly ivLength = 16;

  // Always generate a valid 32-byte key (AES-256 requirement)
  private readonly secretKey = crypto
    .createHash('sha256')
    .update('V9$k@1mZ&pT8!sR4&yN2^wQ7*eF0+LbC')
    .digest(); // exactly 32 bytes

  encrypt(data: any) {
    try {
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv);

      let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
      encrypted += cipher.final('base64');

      const result = {
        iv: iv.toString('base64'),
        payload: encrypted,
      };

      this.logger.log(`Encrypted Data: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`Encryption Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  decrypt(encrypted: { iv: string; payload: string }) {
    try {
      const iv = Buffer.from(encrypted.iv, 'base64');
      const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, iv);

      let decrypted = decipher.update(encrypted.payload, 'base64', 'utf8');
      decrypted += decipher.final('utf8');

      return JSON.parse(decrypted);
    } catch (error) {
      this.logger.error(`Decryption Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
}