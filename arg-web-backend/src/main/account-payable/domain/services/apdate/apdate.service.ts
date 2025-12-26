import { Injectable, Inject } from "@nestjs/common";
import { ApdateInterface } from "@src/main/account-payable/domain/interface/apdate.interface";
import { Apdate } from "@src/main/account-payable/domain/entities/apdate.entity";

@Injectable()
export class ApdateAppService {

  constructor(
    @Inject("ApdateRepository")
    private readonly apdateRepository: ApdateInterface,
  ) { }

  async getApdateRecord(calculatedDate: number): Promise<Apdate | null> {
    return await this.apdateRepository.findOne(calculatedDate, 10); // Assuming companyNo 10 for now
  }

  /**
   * Bulk method to get multiple APDATE records in one database call
   * This significantly improves performance when multiple dates need to be extended
   */
  async getBulkApdateRecords(calculatedDates: number[]): Promise<Map<number, Apdate>> {
    return await this.apdateRepository.findMultiple(calculatedDates, 10); // Assuming companyNo 10 for now
  }

  /**
   * Cache all APDATE records for a company - useful for CSV upload scenarios
   * This ensures all APDATE records are available in cache before bulk processing
   */
  async cacheAllApdateForCompany(companyNo: number): Promise<{
    totalApdates: number;
    cachedApdates: number;
    duration: number;
  }> {
    return await this.apdateRepository.cacheAllApdateForCompany(companyNo);
  }
}
