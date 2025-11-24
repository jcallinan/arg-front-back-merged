import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { GlMasterEntity } from "@src/main/account-payable/domain/entities/gl-master.entity";
import { GlMasterModel } from "@src/main/account-payable/data/models/gl-master.model";
import { GlMasterMapper } from "@src/main/account-payable/data/mappers/gl-master.mapper";
import { GlMasterInterface } from "@src/main/account-payable/domain/interface/gl-master.interface";
import { Op, WhereOptions } from "@sequelize/core";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";
import { errorResponse } from "@src/shared/utils/response-formatter";
import { CacheService } from "@src/shared/cache/cache.service";
import { CACHE_KEYS, cacheConfig } from "@src/shared/cache/cache.config";
import { AppLogger } from "@src/shared/logger/logger.service";

@Injectable()
export class GlMasterRepository implements GlMasterInterface {
  private readonly logger = new AppLogger(GlMasterRepository.name);

  constructor(
    @Inject("GlMasterModel")
    private readonly glMasterModel: typeof GlMasterModel,
    private readonly cacheService: CacheService
  ) {}

  async findOne(
    companyNo: number,
    accountNo: number,
    subAccountNos: number[],
    accountType: string,
    activeOnly?: boolean
  ): Promise<GlMasterEntity | null> {
    if (!companyNo || !accountNo || subAccountNos.length === 0) {
      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.VALIDATION_ERROR, [
          {
            field: "apGLNo",
            code: ERROR_CONSTANTS.VALIDATION_ERROR.code,
            message: "Valid companyNo, accountNo are required.",
          },
        ]),
        HttpStatus.BAD_REQUEST
      );
    }

    // Try cache first for each subAccountNo - GL accounts are highly cacheable
    for (const subAccountNo of subAccountNos) {
      const cacheKey = CACHE_KEYS.GLMASTER.BY_ACCOUNT(
        companyNo,
        accountNo,
        subAccountNo,
        accountType
      );

      try {
        const cachedRecord =
          await this.cacheService.get<GlMasterEntity>(cacheKey);
        if (cachedRecord) {
          this.logger.debug(
            `🎯 GL Master cache HIT: ${accountNo}:${subAccountNo}@${companyNo}`
          );
          return cachedRecord;
        }
      } catch (error) {
        this.logger.error(
          `Cache error for GL Master ${accountNo}:${subAccountNo}@${companyNo}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }

    this.logger.debug(
      `❌ GL Master cache MISS for ${accountNo}@${companyNo}, querying database`
    );

    const where: WhereOptions<GlMasterModel> = {
      companyNo,
      accountNo,
      subAccountNo: {
        [Op.in]: subAccountNos,
      },
      accountType,
    };

    if (activeOnly) {
      where.isDeleted = { [Op.notIn]: ["I", "D"] };
    }

    const model = await this.glMasterModel.findOne({
      where,
    });

    if (!model) {
      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
          {
            field: "apGLNo",
            code: ERROR_CONSTANTS.NOT_FOUND.code,
            message: "INVALID DETAIL LINE G/L NUMBER ENTERED",
          },
        ]),
        HttpStatus.NOT_FOUND
      );
    }

    const entity = GlMasterMapper.toEntity(model);

    // Cache the found record for future lookups
    const cacheKey = CACHE_KEYS.GLMASTER.BY_ACCOUNT(
      companyNo,
      accountNo,
      model.subAccountNo,
      accountType
    );
    try {
      await this.cacheService.set(cacheKey, entity, cacheConfig.ttl.glmaster);
      this.logger.debug(
        `💾 Cached GL Master ${accountNo}:${model.subAccountNo}@${companyNo}`
      );
    } catch (error) {
      this.logger.error(
        `Failed to cache GL Master ${accountNo}:${model.subAccountNo}@${companyNo}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }

    return entity;
  }

  async findMultiple(
    companyNo: number,
    accountDetails: Array<{
      accountNo: number;
      subAccountNo: number;
      accountType: string;
    }>
  ): Promise<Map<string, GlMasterEntity>> {
    const result = new Map<string, GlMasterEntity>();

    // Check cache for each GL Master record
    for (const detail of accountDetails) {
      const cacheKey = CACHE_KEYS.GLMASTER.BY_ACCOUNT(
        companyNo,
        detail.accountNo,
        detail.subAccountNo,
        detail.accountType
      );
      const lookupKey = `${detail.accountNo}:${detail.subAccountNo}:${detail.accountType}`;

      try {
        const cachedRecord =
          await this.cacheService.get<GlMasterEntity>(cacheKey);
        if (cachedRecord) {
          result.set(lookupKey, cachedRecord);
          this.logger.debug(
            `🎯 GL Master bulk cache HIT: ${lookupKey}@${companyNo}`
          );
        } else {
          this.logger.debug(
            `🎯 GL Master bulk cache MISS: ${lookupKey}@${companyNo}`
          );
        }
      } catch (error) {
        this.logger.error(
          `Cache error for GL Master ${lookupKey}@${companyNo}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }

    // If we have any cached data, return it (pure cache-only approach like APDATE)
    if (result.size > 0) {
      this.logger.debug(
        `✅ Found cached data for ${result.size}/${accountDetails.length} GL Master records, skipping DB call`
      );
      return result;
    }

    // No cached data found, return empty Map (assume GL accounts don't exist if not cached)
    this.logger.debug(
      `❌ No cached GL Master data found for company ${companyNo}, returning empty results`
    );
    return result;
  }

  async cacheAllGlMasterForCompany(companyNo: number): Promise<void> {
    this.logger.log(
      `🔄 Starting bulk cache for GL Master records - Company: ${companyNo}`
    );

    try {
      const BATCH_SIZE = 1000; // Process 1000 records at a time to avoid memory issues
      let offset = 0;
      let totalCached = 0;
      let hasMoreRecords = true;

      while (hasMoreRecords) {
        // Fetch records in batches to handle large datasets (20K+ records)
        const records = await this.glMasterModel.findAll({
          where: {
            companyNo,
            isDeleted: { [Op.notIn]: ["I", "D"] }, // Only active records
          },
          limit: BATCH_SIZE,
          offset: offset,
          order: [
            ["accountNo", "ASC"],
            ["subAccountNo", "ASC"],
            ["accountType", "ASC"],
          ],
        });

        if (records.length === 0) {
          hasMoreRecords = false;
          break;
        }

        this.logger.log(
          `📦 Processing batch ${Math.floor(offset / BATCH_SIZE) + 1}: ${records.length} GL Master records (offset: ${offset})`
        );

        // Cache each record in the current batch
        const cachePromises = records.map(async (record) => {
          const entity = GlMasterMapper.toEntity(record);
          const cacheKey = CACHE_KEYS.GLMASTER.BY_ACCOUNT(
            companyNo,
            record.accountNo,
            record.subAccountNo,
            record.accountType
          );

          try {
            await this.cacheService.set(
              cacheKey,
              entity,
              cacheConfig.ttl.glmaster
            );
          } catch (error) {
            this.logger.error(
              `Failed to cache GL Master ${record.accountNo}:${record.subAccountNo}@${companyNo}: ${error instanceof Error ? error.message : "Unknown error"}`
            );
          }
        });

        await Promise.all(cachePromises);

        totalCached += records.length;
        offset += BATCH_SIZE;

        // Check if we have more records to process
        if (records.length < BATCH_SIZE) {
          hasMoreRecords = false;
        }

        // Small delay between batches to avoid overwhelming Redis
        if (hasMoreRecords) {
          await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms delay
        }
      }

      // Set bulk cache status flag
      const bulkStatusKey = CACHE_KEYS.GLMASTER.BULK_CACHE_STATUS(companyNo);
      await this.cacheService.set(
        bulkStatusKey,
        "cached",
        cacheConfig.ttl.glmaster
      );

      this.logger.log(
        `✅ Successfully cached ${totalCached} GL Master records for company ${companyNo} using batched processing`
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed to bulk cache GL Master records for company ${companyNo}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      throw error;
    }
  }

  async findExpenseGLAccounts(
    companyNo: number,
    search?: string,
    limit?: number,
    offset?: number
  ): Promise<{ rows: GlMasterEntity[]; count: number }> {
    this.logger.debug(`Fetching expense GL accounts for company ${companyNo}`);

    const whereCondition: WhereOptions<GlMasterModel> = {
      companyNo,
      isDeleted: { [Op.notIn]: ["I", "D"] }, // GLDEL <> 'I' and GLDEL <> 'D'
      glType: "C", // gltype = 'C'
      specialAccount: { [Op.ne]: "S" }, // glspec <> 'S'
    };

    // Add search filter if provided
    if (search) {
      whereCondition[Op.or] = [
        { accountNo: { [Op.like]: `%${search}%` } },
        { subAccountNo: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search.toUpperCase()}%` } },
      ];
    }

    const { rows, count } = await this.glMasterModel.findAndCountAll({
      where: whereCondition,
      attributes: ["accountNo", "subAccountNo", "description", "glType"],
      order: [
        ["accountNo", "ASC"],
        ["subAccountNo", "ASC"],
      ],
      limit,
      offset,
    });

    return {
      rows: rows.map(GlMasterMapper.toEntity),
      count,
    };
  }

  /**
   * Get expense GL accounts for dropdown
   * @param companyNo - Company number
   * @param search - Optional search term
   * @param limit - Optional limit
   * @param offset - Optional offset
   * @returns Array of expense GL accounts for dropdown
   */
  async getExpenseGLAccountsForDropdown(
    companyNo: number,
    search?: string,
    limit?: number,
    offset?: number
  ): Promise<{ rows: any[]; count: number }> {
    try {
      this.logger.debug(
        `Fetching expense GL accounts for dropdown, company ${companyNo}`
      );

      const whereCondition: WhereOptions<GlMasterModel> = {
        companyNo,
        isDeleted: { [Op.notIn]: ["I", "D"] }, // GLDEL <> 'I' and GLDEL <> 'D'
        glType: "C", // gltype = 'C'
        specialAccount: { [Op.ne]: "S" }, // glspec <> 'S'
      };

      // Add search filter if provided
      if (search) {
        whereCondition[Op.or] = [
          { accountNo: { [Op.like]: `%${search}%` } },
          { subAccountNo: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search.toUpperCase()}%` } },
        ];
      }

      // Get all records without pagination to handle deduplication properly
      const allRecords = await this.glMasterModel.findAll({
        where: whereCondition,
        attributes: ["accountNo", "description", "glType"],
        order: [["accountNo", "ASC"]],
      });

      this.logger.debug(`Database query returned ${allRecords.length} records`);

      // Remove duplicates by accountNo in application layer
      // Use a Map to ensure we keep the first occurrence of each accountNo
      const uniqueRecordsMap = new Map();
      allRecords.forEach((record) => {
        if (!uniqueRecordsMap.has(record.accountNo)) {
          uniqueRecordsMap.set(record.accountNo, record);
        }
      });

      // Convert Map back to array and sort by accountNo
      const uniqueRecords = Array.from(uniqueRecordsMap.values()).sort(
        (a, b) => a.accountNo - b.accountNo
      );

      this.logger.debug(
        `Deduplication: ${allRecords.length} total records -> ${uniqueRecords.length} unique records`
      );

      const totalCount = uniqueRecords.length;

      // Apply pagination to the deduplicated results
      const startIndex = offset || 0;
      const endIndex = startIndex + (limit || 10);

      this.logger.debug(
        `Pagination: offset=${offset}, limit=${limit}, startIndex=${startIndex}, endIndex=${endIndex}, totalRecords=${uniqueRecords.length}`
      );

      // Log the first few unique records to see the order
      this.logger.debug(
        `First 5 unique records: ${uniqueRecords
          .slice(0, 5)
          .map((r) => r.accountNo)
          .join(", ")}`
      );

      const paginatedRows = uniqueRecords.slice(startIndex, endIndex);

      this.logger.debug(
        `Paginated results: ${paginatedRows.length} items (${startIndex} to ${endIndex})`
      );

      // Log what we're actually returning
      this.logger.debug(
        `Returning account numbers: ${paginatedRows.map((r) => r.accountNo).join(", ")}`
      );

      return {
        rows: paginatedRows.map(GlMasterMapper.toEntity),
        count: totalCount,
      };
    } catch (error) {
      this.logger.error(
        `Error getting expense GL accounts for dropdown: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      throw error;
    }
  }
}
