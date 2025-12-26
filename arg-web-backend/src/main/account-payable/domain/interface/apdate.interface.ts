import { Apdate } from "../entities/apdate.entity";

export interface ApdateInterface {
  findOne(calculatedDate: number, companyNo: number): Promise<Apdate | null>;

  /**
   * Bulk method to find multiple APDATE records in one query
   */
  findMultiple(
    calculatedDates: number[],
    companyNo: number,
  ): Promise<Map<number, Apdate>>;

  /**
   * Cache all APDATE records for a company - useful for CSV upload scenarios
   * @param companyNo Company number to cache APDATE records for
   * @returns Promise with cache statistics
   */
  cacheAllApdateForCompany(companyNo: number): Promise<{
    totalApdates: number;
    cachedApdates: number;
    duration: number;
  }>;

  getNewDate(companyNo: number, calculatedDate: number): Promise<string>
}
