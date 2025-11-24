import { Inject, Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { CompanyInterface } from "@src/main/account-payable/domain/interface/company.interface";
import { Company } from "@src/main/account-payable/domain/entities/company.entity";
import { CompanyModel } from "../models/company.model";
import { companyMapper } from "../mappers/company.mappers";
import { where, fn, Op, col, WhereOptions } from "@sequelize/core";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";
import { errorResponse } from "@src/shared/utils/response-formatter";
import { CacheService } from "@src/shared/cache/cache.service";
import { CACHE_KEYS, cacheConfig } from "@src/shared/cache/cache.config";
import { AppLogger } from "@src/shared/logger/logger.service";

/**
 * Repository implementation for company data access
 * @class CompanyRepository
 * @implements {CompanyInterface}
 * @description Handles all database operations for companies
 */
@Injectable()
export class CompanyRepository implements CompanyInterface {
  private readonly logger = new AppLogger(CompanyRepository.name);

  /**
   * Creates an instance of CompanyRepository with caching capability
   * @param {typeof CompanyModel} companyModel - The Sequelize model for companies
   * @param {CacheService} cacheService - Redis cache service
   */
  constructor(
    @Inject("CompanyModel") private readonly companyModel: typeof CompanyModel,
    private readonly cacheService: CacheService
  ) {}

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
  async findAll(
    search?: string,
    limit?: number,
    offset?: number
  ): Promise<{ rows: Company[]; count: number }> {
    this.logger.debug("Fetching all companies");

    const whereCondition: WhereOptions<CompanyModel> = {
      companyIsDeleted: "A",
    };

    if (search !== undefined && search !== null && search !== "") {
      const isNumber = !isNaN(Number(search));
      const upperKeyword = String(search).toUpperCase();

      whereCondition[Op.or] = [
        ...(isNumber ? [{ companyNo: Number(search) }] : []),
        where(
          fn(
            "UPPER",
            col((CompanyModel as any).getAttributes().companyName.field)
          ),
          {
            // this needs to be manage
            [Op.like]: `%${upperKeyword}%`,
          }
        ),
      ];
    }

    const { rows, count } = await this.companyModel.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
    });

    return {
      rows: rows.map(companyMapper),
      count,
    };
  }

  /**
   * Find a company by its number
   * @param {number} companyNo - The company number to find
   * @returns {Promise<Company>} The found company
   * @throws {Error} If there's an error fetching the company
   * @example
   * const company = await companyRepository.findByCompanyNo(1);
   */
  async findOne(companyNo: number): Promise<Company> {
    const startTime = Date.now();
    const cacheKey = CACHE_KEYS.COMPANY.BY_ID(companyNo);

    try {
      // Try cache first (Cache-Aside Pattern)
      const cachedCompany = await this.cacheService.get<Company>(cacheKey);
      if (cachedCompany) {
        const duration = Date.now() - startTime;
        this.logger.debug(`🎯 Company cache HIT: ${companyNo} (${duration}ms)`);
        return cachedCompany;
      }

      // Cache miss - fetch from database
      this.logger.debug(
        `❌ Company cache MISS: ${companyNo} - fetching from DB`
      );
    } catch (error) {
      this.logger.warn(
        `⚠️ Cache error for company ${companyNo}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      // Continue to database if cache fails
    }

    this.logger.debug(`Fetching company with number ${companyNo}`);

    const company = await this.companyModel.findOne({
      where: {
        companyNo,
        companyIsDeleted: "A",
      },
      attributes: [
        "companyNo",
        "companyApGlNo",
        "companyBankGlNo",
        "companyDiscountsGlNo",
        "companyIntercoGlNo",
        "companyNextPjJrnlNo",
        "companyNextCdJrnlNo",
        "companyNextCheckNo",
        "companyNextEntryNo",
        "companyNextVoucherNo",
        "companyRetentionGlNo",
        "companyEmployeeExpenseGlNo",
        "companyNextEeJrnlNo",
        "companyVendorNextEntryNo",
        "company99EinNumber",
        "company99Phone",
        "companyIsDeleted",
        [
          fn("TRIM", col((CompanyModel as any).getAttributes().companyName.field)),
          "companyName",
        ],
        [
          fn("TRIM", col((CompanyModel as any).getAttributes().companyPreEdChks.field)),
          "companyPreEdChks",
        ],
        [
          fn("TRIM", col((CompanyModel as any).getAttributes().companyJobCostAct.field)),
          "companyJobCostAct",
        ],
        [
          fn("TRIM", col((CompanyModel as any).getAttributes().companyPoActive.field)),
          "companyPoActive",
        ],
        [
          fn("TRIM", col((CompanyModel as any).getAttributes().company99Name.field)),
          "company99Name",
        ],
        [
          fn("TRIM", col((CompanyModel as any).getAttributes().company99Address1.field)),
          "company99Address1",
        ],
        [
          fn("TRIM", col((CompanyModel as any).getAttributes().company99Address2.field)),
          "company99Address2",
        ],
        [
          fn("TRIM", col((CompanyModel as any).getAttributes().company99StateZip.field)),
          "company99StateZip",
        ],
        [
          fn("TRIM", col((CompanyModel as any).getAttributes().company99EmployeeName.field)),
          "company99EmployeeName",
        ],
        [
          fn("TRIM", col((CompanyModel as any).getAttributes().companyFiller.field)),
          "companyFiller",
        ],
      ]
    });

    if (!company) {
      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
          {
            field: "companyNo",
            code: ERROR_CONSTANTS.NOT_FOUND.code,
            message: `Company not found with number ${companyNo}`,
          },
        ]),
        HttpStatus.NOT_FOUND
      );
    }

    const mappedCompany = companyMapper(company);
    const duration = Date.now() - startTime;

    // Cache the result for future requests
    try {
      await this.cacheService.set(
        cacheKey,
        mappedCompany,
        cacheConfig.ttl.company
      );
      this.logger.debug(`💾 Company cached: ${companyNo} (${duration}ms)`);
    } catch (error) {
      this.logger.warn(
        `⚠️ Failed to cache company ${companyNo}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }

    return mappedCompany;
  }

  /**
   * Update the companyNextEntryNo for a company
   * @param {number} companyNo - The company number to update
   * @param {number} nextEntryNo - The new next entry number
   * @returns {Promise<Company>} The updated company object
   */
  async updateNextEntryNo(
    companyNo: number,
    nextEntryNo?: number,
    companyVendorNextEntryNo?: number
  ): Promise<Company> {
    if (nextEntryNo) {
      this.logger.debug(
        `Updating companyNextEntryNo for companyNo ${companyNo} to ${nextEntryNo}`
      );
      await this.companyModel.update(
        { companyNextEntryNo: nextEntryNo },
        { where: { companyNo } }
      );
    }

    if (companyVendorNextEntryNo) {
      this.logger.debug(
        `Updating companyVendorNextEntryNo for companyNo Vendor ${companyNo} to ${nextEntryNo}`
      );

      await this.companyModel.update(
        { companyVendorNextEntryNo },
        { where: { companyNo } }
      );
    }

    // Fetch the updated company from DB
    const updatedCompany = await this.companyModel.findOne({
      where: { companyNo },
    });
    if (!updatedCompany) {
      throw new Error(
        `Company with companyNo ${companyNo} not found after update`
      );
    }
    const mappedCompany = companyMapper(updatedCompany);
    // Set the updated company in cache using the new method
    await this.cacheService.setCompany(mappedCompany);
    return mappedCompany;
  }

  /**
   * Update company data
   * @param {number} companyNo - The company number to update
   * @param {Partial<Company>} updateData - The data to update
   * @returns {Promise<Company>} The updated company object
   */
  async update(
    companyNo: number,
    updateData: Partial<Company>
  ): Promise<Company> {
    this.logger.debug(
      `Updating company ${companyNo} with data: ${JSON.stringify(updateData)}`
    );

    // Remove companyNo from updateData to prevent updating the primary key
    const { companyNo: _, ...updateFields } = updateData;

    // Update the company in the database
    const [affectedRows] = await this.companyModel.update(updateFields, {
      where: { companyNo },
    });

    if (affectedRows === 0) {
      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
          {
            field: "companyNo",
            code: ERROR_CONSTANTS.NOT_FOUND.code,
            message: `Company not found with number ${companyNo}`,
          },
        ]),
        HttpStatus.NOT_FOUND
      );
    }

    // Fetch the updated company from DB
    const updatedCompany = await this.companyModel.findOne({
      where: { companyNo },
    });

    if (!updatedCompany) {
      throw new Error(
        `Company with companyNo ${companyNo} not found after update`
      );
    }

    const mappedCompany = companyMapper(updatedCompany);

    // Update cache
    try {
      await this.cacheService.set(
        CACHE_KEYS.COMPANY.BY_ID(companyNo),
        mappedCompany,
        cacheConfig.ttl.company
      );
      this.logger.debug(`💾 Updated company cache: ${companyNo}`);
    } catch (error) {
      this.logger.warn(
        `⚠️ Failed to update company cache ${companyNo}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }

    return mappedCompany;
  }

  /**
   * Cache all companies - useful for warming up cache
   * Uses efficient bulk fetching instead of individual calls
   */
  async cacheAllCompanies(): Promise<{
    totalCompanies: number;
    cachedCompanies: number;
    duration: number;
  }> {
    const startTime = Date.now();
    this.logger.log(`🔥 Starting efficient bulk cache for all companies...`);

    try {
      // Check if bulk cache is already recent (within 2 hours since companies change rarely)
      const bulkCacheKey = CACHE_KEYS.COMPANY.BULK_CACHE_STATUS();
      const recentBulkCache = await this.cacheService.get<{
        timestamp: number;
        count: number;
      }>(bulkCacheKey);

      if (recentBulkCache && Date.now() - recentBulkCache.timestamp < 7200000) {
        // 2 hours
        this.logger.log(
          `⏭️ Bulk cache for companies is recent (${recentBulkCache.count} companies), skipping...`
        );
        return {
          totalCompanies: recentBulkCache.count,
          cachedCompanies: recentBulkCache.count,
          duration: Date.now() - startTime,
        };
      }

      // Fetch ALL companies with full details in efficient batches
      const limit = 500; // Companies are fewer in number, smaller batches
      let offset = 0;
      let totalCompanies = 0;
      let cachedCompanies = 0;
      let hasMore = true;

      while (hasMore) {
        this.logger.debug(
          `📊 Fetching company batch: offset ${offset}, limit ${limit}`
        );

        // 🚀 ONE BULK CALL with full details instead of individual calls
        const companies = await this.findAll(undefined, limit, offset);

        if (!companies.rows || companies.rows.length === 0) {
          hasMore = false;
          break;
        }

        // Prepare batch cache entries
        const cacheEntries = companies.rows.map((company) => ({
          key: CACHE_KEYS.COMPANY.BY_ID(company.companyNo),
          value: company,
          ttl: cacheConfig.ttl.company,
        }));

        // 🚀 BULK CACHE INSERT - all companies in one Redis call
        const batchSuccess = await this.cacheService.setMultiple(cacheEntries);

        if (batchSuccess) {
          cachedCompanies += cacheEntries.length;
          this.logger.debug(
            `💾 Cached ${cacheEntries.length} companies in batch`
          );
        } else {
          this.logger.warn(
            `⚠️ Failed to cache batch of ${cacheEntries.length} companies`
          );
        }

        totalCompanies += companies.rows.length;
        offset += limit;

        // Check if we've processed all companies
        if (companies.rows.length < limit) {
          hasMore = false;
        }

        this.logger.debug(
          `📊 Progress: ${totalCompanies} companies processed, ${cachedCompanies} cached`
        );
      }

      // Mark bulk cache as completed
      await this.cacheService.set(
        bulkCacheKey,
        { timestamp: Date.now(), count: totalCompanies },
        7200 // 2 hours
      );

      const duration = Date.now() - startTime;
      this.logger.log(
        `✅ Efficient bulk cache completed! ${cachedCompanies}/${totalCompanies} companies cached in ${duration}ms`
      );

      return {
        totalCompanies,
        cachedCompanies,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `💥 Bulk cache failed after ${duration}ms: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      throw error;
    }
  }

  /**
   * Get company names for dropdown
   * @param search - Optional search term
   * @param limit - Optional limit
   * @param offset - Optional offset
   * @param companyNo - Optional company number filter
   * @returns Array of company names for dropdown
   */
  async getCompanyNamesForDropdown(
    search?: string,
    limit?: number,
    offset?: number,
    companyNo?: number
  ): Promise<{ rows: any[]; count: number }> {
    try {
      const whereCondition: WhereOptions<CompanyModel> = {
        companyIsDeleted: "A",
      };

      if (companyNo) {
        whereCondition.companyNo = companyNo;
      }

      if (search && search.trim()) {
        whereCondition.companyName = { [Op.like]: `%${search.trim()}%` };
      }

      const { rows, count } = await this.companyModel.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        order: [["companyName", "ASC"]],
      });

      return {
        rows: rows.map(companyMapper),
        count,
      };
    } catch (error) {
      this.logger.error(
        `Error getting company names for dropdown: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      throw error;
    }
  }
}
