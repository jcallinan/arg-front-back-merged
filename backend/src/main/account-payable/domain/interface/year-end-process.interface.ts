import { YearEndProcessResponse } from "../entities/year-end-process.entity";

/**
 * Interface for year-end process repository operations
 */
export interface YearEndProcessInterface {
  /**
   * Process vendor year-end for a specific company and year
   * @param data Year-end process data containing company, year, and clearYTD flag
   * @returns Promise<YearEndProcessResponse> Result of the year-end process
   */
  processVendorYearEnd(companyNo: number, year: string, clearYTD: boolean): Promise<YearEndProcessResponse>;
}
