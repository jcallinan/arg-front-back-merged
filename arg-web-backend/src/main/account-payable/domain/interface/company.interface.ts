import { Company } from "../entities/company.entity";

/**
 * Interface for company repository operations
 * @interface CompanyInterface
 * @description Defines the contract for company data access operations
 */
export interface CompanyInterface {
  /**
   * Find all companies with optional search and pagination
   * @param {string} [search] - Optional search term to filter companies by name or number
   * @param {number} [limit] - Optional maximum number of records to return
   * @param {number} [offset] - Optional number of records to skip
   * @returns {Promise<{ rows: Company[]; count: number }>} Paginated response containing rows of companies and total count
   * @throws {Error} If there's an error fetching companies
   * @example
   * // Get first 10 companies
   * const result = await companyRepository.findAll(undefined, 10, 0);
   *
   * // Search companies with pagination
   * const result = await companyRepository.findAll("test", 20, 40);
   */
  findAll(
    search?: string,
    limit?: number,
    offset?: number
  ): Promise<{ rows: Company[]; count: number }>;

  /**
   * Find a company by its number
   * @param {number} companyNo - The company number to find
   * @returns {Promise<Company>} The found company
   * @throws {Error} If there's an error fetching the company
   * @example
   * const company = await companyRepository.findByCompanyNo(1);
   */
  findOne(companyNo: number): Promise<Company>;

  /**
   * Update the companyNextEntryNo for a company
   * @param {number} companyNo - The company number to update
   * @param {number} nextEntryNo - The new next entry number
   * @returns {Promise<Company>} The updated company object
   */
  updateNextEntryNo(companyNo: number, nextEntryNo?: number, companyVendorNextEntryNo?: number): Promise<Company>;

  /**
   * Update company data
   * @param {number} companyNo - The company number to update
   * @param {Partial<Company>} updateData - The data to update
   * @returns {Promise<Company>} The updated company object
   */
  update(companyNo: number, updateData: Partial<Company>): Promise<Company>;

  /**
   * Cache all companies - useful for warming up cache
   * @returns {Promise<{totalCompanies: number, cachedCompanies: number, duration: number}>} Cache statistics
   */
  cacheAllCompanies(): Promise<{
    totalCompanies: number;
    cachedCompanies: number;
    duration: number;
  }>;
}
