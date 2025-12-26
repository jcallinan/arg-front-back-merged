import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { GlMasterEntity } from "@src/main/account-payable/domain/entities/gl-master.entity";
import { GlMasterModel } from "@src/main/account-payable/data/models/gl-master.model";
import { GlMasterMapper } from "@src/main/account-payable/data/mappers/gl-master.mapper";
import {
  GlMasterInterface,
  GlNumberValidationData,
  GlNumberValidationErrors,
} from "@src/main/account-payable/domain/interface/gl-master.interface";
import { Op, WhereOptions } from "@sequelize/core";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";
import { errorResponse } from "@src/shared/utils/response-formatter";
import { CacheService } from "@src/shared/cache/cache.service";
import { CACHE_KEYS, cacheConfig } from "@src/shared/cache/cache.config";
import { AppLogger } from "@src/shared/logger/logger.service";
import { ERROR_MESSAGES } from "@src/shared/constants/errorConstants";
import { IsDeletedStatus } from "@src/shared/constants/constant";

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

  /**
   * Validate GL numbers against GLMAST table (private helper method)
   * Validates all GL numbers and returns all errors at once
   * @param data Array of GL number validation data
   * @returns Validation errors for all invalid GL numbers
   */
  private async validateAllGlNumbers(
    data: GlNumberValidationData[]
  ): Promise<GlNumberValidationErrors> {
    const errors: Array<{
      field: string;
      code: string;
      message: string;
    }> = [];

    // Validate all GL numbers in parallel for better performance
    const validationPromises = data.map(async (validationData) => {
      const { glNo, companyNo, fieldName, errorMessage } = validationData;

      try {
        // Parse GL number: first 6 digits = accountNo, last 2 digits = subAccountNo
        // Query: GLCO=companyNo AND GLACCT=accountNo AND GLSUB=subAccountNo AND GLTYPE='C' AND GLDEL NOT IN ('D','I')
        const glNoStr = glNo.toString().padStart(8, "0");
        const accountNo = parseInt(glNoStr.substring(0, 6));
        const subAccountNo = parseInt(glNoStr.substring(6));
        const accountType = "C"; // GLTYPE='C'
        
        // Prepare subAccountNos array (handle padding for subAccountNo < 10)
        const subAccountNos = [subAccountNo];
        if (subAccountNo < 10) {
          subAccountNos.push(Number(`0${subAccountNo}`));
        }

        // Try cache first for each subAccountNo
        for (const subAccNo of subAccountNos) {
          const cacheKey = CACHE_KEYS.GLMASTER.BY_ACCOUNT(
            companyNo,
            accountNo,
            subAccNo,
            accountType
          );

          try {
            const cachedRecord =
              await this.cacheService.get<GlMasterEntity>(cacheKey);
            if (cachedRecord) {
              // Check if record is deleted or inactive
              if (cachedRecord.isDeleted === IsDeletedStatus.DELETED || cachedRecord.isDeleted === IsDeletedStatus.INACTIVE) {
                return {
                  isValid: false,
                  field: fieldName,
                  message: errorMessage,
                };
              }
              return { isValid: true };
            }
          } catch (error) {
            this.logger.debug(
              `Cache miss for GL validation: ${accountNo}:${subAccNo}@${companyNo}`
            );
          }
        }

        // If not in cache, query database
        const where: WhereOptions<GlMasterModel> = {
          companyNo,
          accountNo,
          subAccountNo: {
            [Op.in]: subAccountNos,
          },
          accountType,
        };

        const model = await this.glMasterModel.findOne({
          where,
        });

        // If record not found, return invalid
        if (!model) {
          return {
            isValid: false,
            field: fieldName,
            message: errorMessage,
          };
        }

        // Check if record is deleted or inactive
        if (model.isDeleted === IsDeletedStatus.DELETED || model.isDeleted === IsDeletedStatus.INACTIVE) {
          return {
            isValid: false,
            field: fieldName,
            message: errorMessage,
          };
        }

        // Cache the found record for future lookups
        const entity = GlMasterMapper.toEntity(model);
        const cacheKey = CACHE_KEYS.GLMASTER.BY_ACCOUNT(
          companyNo,
          accountNo,
          model.subAccountNo,
          accountType
        );
        try {
          await this.cacheService.set(cacheKey, entity, cacheConfig.ttl.glmaster);
          this.logger.debug(
            ` Cached GL Master ${accountNo}:${model.subAccountNo}@${companyNo}`
          );
        } catch (error) {
          this.logger.warn(
            `Failed to cache GL Master ${accountNo}:${model.subAccountNo}@${companyNo}: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }

        return { isValid: true };
      } catch (error) {
        // If GL record lookup fails, return invalid
        this.logger.warn(
          `GL validation failed for ${fieldName}: ${glNo} - ${error instanceof Error ? error.message : "Unknown error"}`
        );
        return {
          isValid: false,
          field: fieldName,
          message: errorMessage,
        };
      }
    });

    const results = await Promise.all(validationPromises);

    // Collect all errors
    results.forEach((result) => {
      if (!result.isValid) {
        errors.push({
          field: result.field!,
          code: ERROR_CONSTANTS.VALIDATION_ERROR.code,
          message: result.message!,
        });
      }
    });

    return { errors };
  }

  /**
   * Validate company maintenance GL numbers
   * Validates required GL numbers and optional ones (if != 0)
   * @param companyNo Company number
   * @param apGlNo AP GL Number
   * @param bankGlNo Bank GL Number
   * @param discountsGlNo Discounts GL Number
   * @param intercoGlNo Inter-company GL Number (optional, validated if != 0)
   * @param retentionGlNo Retention GL Number (optional, validated if != 0)
   * @param employeeExpenseGlNo Employee Expense GL Number (optional, validated if != 0)
   * @returns Validation errors for all invalid GL numbers
   */
  async validateCompanyMaintenanceGlNumbers(
    companyNo: number,
    apGlNo: number,
    bankGlNo: number,
    discountsGlNo: number,
    intercoGlNo: number,
    retentionGlNo: number,
    employeeExpenseGlNo: number
  ): Promise<GlNumberValidationErrors> {
    // Prepare validation data for all GL numbers
    // Note: Retention GL, Inter-company GL, and Employee Expense GL are optional (only validate if != 0)
    const validationData: GlNumberValidationData[] = [
      {
        glNo: apGlNo,
        companyNo,
        fieldName: "companyApGlNo",
        errorMessage: ERROR_MESSAGES.INVALID_AP_GL_NUMBER,
      },
      {
        glNo: bankGlNo,
        companyNo,
        fieldName: "companyBankGlNo",
        errorMessage: ERROR_MESSAGES.INVALID_BANK_GL_NUMBER,
      },
      {
        glNo: discountsGlNo,
        companyNo,
        fieldName: "companyDiscountsGlNo",
        errorMessage: ERROR_MESSAGES.INVALID_DISCOUNT_GL_NUMBER,
      },
    ];

    // Optional fields: only validate if != 0
    if (intercoGlNo !== 0) {
      validationData.push({
        glNo: intercoGlNo,
        companyNo,
        fieldName: "companyIntercoGlNo",
        errorMessage: ERROR_MESSAGES.INVALID_INTER_CO_GL_NUMBER,
      });
    }

    if (retentionGlNo !== 0) {
      validationData.push({
        glNo: retentionGlNo,
        companyNo,
        fieldName: "companyRetentionGlNo",
        errorMessage: ERROR_MESSAGES.INVALID_RETENTION_GL_NUMBER,
      });
    }

    if (employeeExpenseGlNo !== 0) {
      validationData.push({
        glNo: employeeExpenseGlNo,
        companyNo,
        fieldName: "companyEmployeeExpenseGlNo",
        errorMessage: ERROR_MESSAGES.INVALID_EMPLOYEE_EXPENSE_GL_NUMBER,
      });
    }

    // Validate all GL numbers
    return await this.validateAllGlNumbers(validationData);
  }
}
