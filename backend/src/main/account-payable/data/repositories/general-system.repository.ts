import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { GeneralSystemEntity } from "@src/main/account-payable/domain/entities/general-system.entity";
import { GeneralSystemModel } from "@src/main/account-payable/data/models/general-system.model";
import { GeneralSystemMapper } from "@src/main/account-payable/data/mappers/general-system.mappers";
import { GeneralSystemInterface } from "@src/main/account-payable/domain/interface/general-system.interface";
import { where, fn, Op, col } from "@sequelize/core";
import { CacheService } from "@src/shared/cache/cache.service";
import { CACHE_KEYS, cacheConfig } from "@src/shared/cache/cache.config";
import { AppLogger } from "@src/shared/logger/logger.service";
import { errorResponse } from "@src/shared/utils/response-formatter";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";

@Injectable()
export class GeneralSystemRepository implements GeneralSystemInterface {
  private readonly logger = new AppLogger(GeneralSystemRepository.name);

  constructor(
    @Inject("GeneralSystemModel")
    private generalSystemModel: typeof GeneralSystemModel,
    private readonly cacheService: CacheService,
  ) { }

  async findOne(
    tableType: string,
    tableCode?: string,
  ): Promise<GeneralSystemEntity | null> {
    const startTime = Date.now();

    // If tableCode is provided, try cache first
    if (tableCode) {
      const cacheKey = CACHE_KEYS.GSTABLE.BY_TYPE_CODE(tableType, tableCode);

      try {
        const cachedRecord = await this.cacheService.get<GeneralSystemEntity>(cacheKey);
        if (cachedRecord) {
          const duration = Date.now() - startTime;
          this.logger.debug(`🎯 GSTable cache HIT: ${tableType}:${tableCode} (${duration}ms)`);
          return cachedRecord;
        }

        this.logger.debug(`❌ GSTable cache MISS: ${tableType}:${tableCode} - fetching from DB`);
      } catch (error) {
        this.logger.warn(`⚠️ Cache error for GSTable ${tableType}:${tableCode}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    const whereCondition: any = {
      tableType,
      [Op.and]: [
        where(
          fn(
            "TRIM",
            col((GeneralSystemModel as any).getAttributes().tableCode.field),
          ),
          tableCode,
        ),
      ],
    };

    const generalSystem = await this.generalSystemModel.findOne({
      where: whereCondition,
    });

    const mappedResult = generalSystem ? GeneralSystemMapper.toEntity(generalSystem) : null;
    const duration = Date.now() - startTime;

    // Cache the result if tableCode is provided and record found
    if (tableCode && mappedResult) {
      const cacheKey = CACHE_KEYS.GSTABLE.BY_TYPE_CODE(tableType, tableCode);
      try {
        await this.cacheService.set(cacheKey, mappedResult, cacheConfig.ttl.gstable);
        this.logger.debug(`💾 GSTable cached: ${tableType}:${tableCode} (${duration}ms)`);
      } catch (error) {
        this.logger.warn(`⚠️ Failed to cache GSTable ${tableType}:${tableCode}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      this.logger.debug(`🔍 GSTable lookup: ${tableType}:${tableCode} (${duration}ms) - no caching (missing tableCode or null result)`);
    }

    return mappedResult;
  }

  async findMultiple(
    requests: Array<{ tableType: string; tableCode: string }>,
  ): Promise<Map<string, GeneralSystemEntity>> {
    const startTime = Date.now();
    const result = new Map<string, GeneralSystemEntity>();
    let foundAnyCachedData = false;

    // Check cache for each GSTable record
    for (const request of requests) {
      const { tableType, tableCode } = request;
      const cacheKey = CACHE_KEYS.GSTABLE.BY_TYPE_CODE(tableType, tableCode);
      const lookupKey = `${tableType}:${tableCode}`;

      try {
        const cachedRecord = await this.cacheService.get<GeneralSystemEntity>(cacheKey);
        if (cachedRecord !== undefined) {
          foundAnyCachedData = true;
          if (cachedRecord) {
            result.set(lookupKey, cachedRecord);
            this.logger.debug(`🎯 GSTable bulk cache HIT: ${lookupKey}`);
          } else {
            this.logger.debug(`🎯 GSTable bulk cache HIT (null): ${lookupKey}`);
          }
        } else {
          this.logger.debug(`❌ GSTable bulk cache MISS: ${lookupKey}`);
        }
      } catch (error) {
        this.logger.error(`Cache error for GSTable ${lookupKey}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // If we have any cached data, return it (pure cache-only approach)
    if (foundAnyCachedData) {
      const duration = Date.now() - startTime;
      this.logger.debug(`✅ Found cached data for ${result.size}/${requests.length} GSTable records, skipping DB call (${duration}ms)`);
      return result;
    }

    // No cached data found, return empty Map
    const duration = Date.now() - startTime;
    this.logger.debug(`❌ No cached GSTable data found, returning empty results (${duration}ms)`);
    return result;
  }

  async cacheAllGeneralSystem(): Promise<void> {
    const startTime = Date.now();
    this.logger.log(`🔄 Starting GSTable bulk cache`);

    try {
      const batchSize = 1000;
      let offset = 0;
      let cachedCount = 0;
      let batchNumber = 1;

      while (true) {
        this.logger.debug(`📦 Processing GSTable batch ${batchNumber} (offset: ${offset}, size: ${batchSize})`);

        const records = await this.generalSystemModel.findAll({
          limit: batchSize,
          offset,
          order: [['tableType', 'ASC'], ['tableCode', 'ASC']],
        });

        if (records.length === 0) {
          this.logger.debug(`✅ GSTable batch processing complete - no more records found`);
          break;
        }

        // Process batch
        const cachePromises = records.map(async (record) => {
          const entity = GeneralSystemMapper.toEntity(record);
          const tableCode = record.tableCode?.trim() || '';
          const cacheKey = CACHE_KEYS.GSTABLE.BY_TYPE_CODE(record.tableType, tableCode);

          try {
            await this.cacheService.set(cacheKey, entity, cacheConfig.ttl.gstable);
            return true;
          } catch (error) {
            this.logger.warn(`Failed to cache GSTable ${record.tableType}:${tableCode}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return false;
          }
        });

        const results = await Promise.all(cachePromises);
        const batchCachedCount = results.filter(Boolean).length;
        cachedCount += batchCachedCount;

        this.logger.debug(`📦 GSTable batch ${batchNumber} completed: ${batchCachedCount}/${records.length} cached successfully`);

        // Break if we processed fewer records than batch size (last batch)
        if (records.length < batchSize) {
          break;
        }

        offset += batchSize;
        batchNumber++;

        // Rate limiting - small delay between batches
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Mark bulk cache as complete
      const bulkStatusKey = CACHE_KEYS.GSTABLE.BULK_CACHE_STATUS();
      await this.cacheService.set(bulkStatusKey, { completed: true, count: cachedCount }, cacheConfig.ttl.gstable);

      const duration = Date.now() - startTime;
      this.logger.log(`✅ GSTable bulk cache completed: ${cachedCount} records cached in ${duration}ms`);

    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(`❌ GSTable bulk cache failed after ${duration}ms: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  async findTableTypeAndCode(
    tableType: string,
    tableCode: string
  ): Promise<GeneralSystemEntity | null> {

    try {

      const whereCondition: any = {
        tableType,
        tableCode: '     ' + tableCode,
        isDeleted: {
          [Op.notIn]: ['I', 'D']
        },
        [Op.and]: [
          where(
            fn(
              "TRIM",
              col(`GeneralSystemModel.${(this.generalSystemModel as any).getAttributes().tableCode.field}`),
            ),
            tableCode,
          ),
        ]
      };

      const generalSystem = await this.generalSystemModel.findOne({
        where: whereCondition,
      });

      return generalSystem ? GeneralSystemMapper.toEntity(generalSystem) : null


    } catch (error) {
      this.logger.warn(`⚠️ Something went wrong: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error
    }
  }

  async getDropdownlist(tableType: string, limit: number, offset: number): Promise<{ rows: any[]; count: number }> {
    try {
      const { rows, count } = await this.generalSystemModel.findAndCountAll({
        where: {
          tableType,
          isDeleted: {
            [Op.notIn]: ['I', 'A']   // exclude I and A
          },
        },
        attributes: ["tableCode", "tableDesc"],
        limit,
        offset
      })

      if (!rows) {
        this.logger.warn(`Get Dropdown List for tableType: ${tableType}`);
        throw new HttpException(
          errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
            {
              field: "Dropdown list",
              code: ERROR_CONSTANTS.NOT_FOUND.code,
              message: `Request Dropdown list not found`,
            },
          ]),
          HttpStatus.NOT_FOUND
        );
      }

      return {
        rows: rows.map((data) => GeneralSystemMapper.toEntity(data)),
        count: count,
      };
    } catch (error) {
      throw error
    }
  }
}
