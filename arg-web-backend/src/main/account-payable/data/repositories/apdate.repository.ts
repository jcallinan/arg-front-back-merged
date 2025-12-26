import { Injectable, Inject } from "@nestjs/common";
import { Apdate } from "@src/main/account-payable/domain/entities/apdate.entity";
import { ApdateModel } from "@src/main/account-payable/data/models/apdate.model";
import { ApdateInterface } from "@src/main/account-payable/domain/interface/apdate.interface";
import { ApdateMapper } from "../mappers/apdate.mapper";
import { Op } from "@sequelize/core";
import { CacheService } from "@src/shared/cache/cache.service";
import { CACHE_KEYS, cacheConfig } from "@src/shared/cache/cache.config";
import { AppLogger } from "@src/shared/logger/logger.service";
import { convertYYYYMMDDtoMMDDYY } from "@src/shared/utils/format-date";

@Injectable()
export class ApdateRepository implements ApdateInterface {
  private readonly logger = new AppLogger(ApdateRepository.name);

  constructor(
    @Inject("ApdateModel")
    private readonly apdateModel: typeof ApdateModel,
    private readonly cacheService: CacheService,
  ) { }

  async findOne(
    calculatedDate: number,
    companyNo: number,
  ): Promise<Apdate | null> {
    const startTime = Date.now();
    const cacheKey = CACHE_KEYS.APDATE.BY_DATE(calculatedDate, companyNo);

    try {
      // Try cache first (Cache-Aside Pattern)
      const cachedApdate = await this.cacheService.get<Apdate>(cacheKey);
      if (cachedApdate) {
        const duration = Date.now() - startTime;
        this.logger.debug(`🎯 APDATE cache HIT: ${calculatedDate}@${companyNo} (${duration}ms)`);
        return cachedApdate;
      }

      // Cache miss - fetch from database
      this.logger.debug(`❌ APDATE cache MISS: ${calculatedDate}@${companyNo} - fetching from DB`);

    } catch (error) {
      this.logger.warn(`⚠️ Cache error for APDATE ${calculatedDate}@${companyNo}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Continue to database if cache fails
    }

    const apdate = await this.apdateModel.findOne({
      where: {
        calculatedDate,
        companyNo,
        isDeleted: { [Op.notIn]: ["D", "I"] },
      },
    });

    const mappedApdate = apdate ? ApdateMapper.toEntity(apdate) : null;
    const duration = Date.now() - startTime;

    // Cache the result for future requests (if APDATE found)
    if (mappedApdate) {
      try {
        await this.cacheService.set(cacheKey, mappedApdate, cacheConfig.ttl.apdate);
        this.logger.debug(`💾 APDATE cached: ${calculatedDate}@${companyNo} (${duration}ms)`);
      } catch (error) {
        this.logger.warn(`⚠️ Failed to cache APDATE ${calculatedDate}@${companyNo}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      this.logger.debug(`🔍 APDATE not found: ${calculatedDate}@${companyNo} (${duration}ms)`);
    }

    return mappedApdate;
  }

  /**
   * Bulk method to find multiple APDATE records with cache-first approach
   * This reduces database calls from N to 1 for multiple dates while leveraging cache
   */
  async findMultiple(
    calculatedDates: number[],
    companyNo: number,
  ): Promise<Map<number, Apdate>> {
    const startTime = Date.now();
    const resultMap = new Map<number, Apdate>();
    const uncachedDates: number[] = [];
    let foundAnyCachedData = false;

    // First, check cache for each date
    for (const calculatedDate of calculatedDates) {
      const cacheKey = CACHE_KEYS.APDATE.BY_DATE(calculatedDate, companyNo);

      try {
        const cachedApdate = await this.cacheService.get<Apdate | null>(cacheKey);
        if (cachedApdate !== undefined) {
          // Cache hit (either with data or null)
          foundAnyCachedData = true;
          if (cachedApdate) {
            resultMap.set(calculatedDate, cachedApdate);
            this.logger.debug(`🎯 APDATE bulk cache HIT: ${calculatedDate}@${companyNo}`);
          } else {
            // Cached as null (doesn't exist in DB)
            this.logger.debug(`🎯 APDATE bulk cache HIT (null): ${calculatedDate}@${companyNo}`);
          }
        } else {
          // Cache miss (key doesn't exist in cache)
          uncachedDates.push(calculatedDate);
          this.logger.debug(`❌ APDATE bulk cache MISS: ${calculatedDate}@${companyNo}`);
        }
      } catch (error) {
        this.logger.warn(`⚠️ Cache error for APDATE ${calculatedDate}@${companyNo}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        uncachedDates.push(calculatedDate);
      }
    }

    // If we have ANY cached data, don't make database call
    // This means we've already done the lookup before, uncached dates don't exist in DB
    if (foundAnyCachedData) {
      const duration = Date.now() - startTime;
      this.logger.debug(`✅ Found cached data for ${calculatedDates.length - uncachedDates.length}/${calculatedDates.length} APDATE records, skipping DB call (${duration}ms)`);
      return resultMap;
    } else {
      return resultMap; // Return empty Map
    }
  }

  /**
   * Cache all APDATE records for a company - useful for CSV upload scenarios
   * Uses efficient bulk fetching instead of individual calls
   */
  async cacheAllApdateForCompany(companyNo: number): Promise<{
    totalApdates: number;
    cachedApdates: number;
    duration: number;
  }> {
    const startTime = Date.now();
    this.logger.log(`🔥 Starting efficient bulk cache for company ${companyNo} APDATE records...`);

    try {
      // Check if bulk cache is already recent (within 6 hours)
      const bulkCacheKey = CACHE_KEYS.APDATE.BULK_CACHE_STATUS(companyNo);
      const recentBulkCache = await this.cacheService.get<{ timestamp: number; count: number }>(bulkCacheKey);

      if (recentBulkCache && (Date.now() - recentBulkCache.timestamp < 21600000)) { // 6 hours
        this.logger.log(`⏭️ Bulk cache for company ${companyNo} APDATE is recent (${recentBulkCache.count} records), skipping...`);
        return {
          totalApdates: recentBulkCache.count,
          cachedApdates: recentBulkCache.count,
          duration: Date.now() - startTime
        };
      }

      // Fetch ALL APDATE records for the company in efficient batches
      const limit = 2000; // APDATE records are smaller, can handle larger batches
      let offset = 0;
      let totalApdates = 0;
      let cachedApdates = 0;
      let hasMore = true;

      while (hasMore) {
        this.logger.debug(`📊 Fetching APDATE batch: offset ${offset}, limit ${limit}`);

        const apdates = await this.apdateModel.findAll({
          where: {
            companyNo,
            isDeleted: { [Op.notIn]: ["D", "I"] },
          },
          limit,
          offset,
        });

        if (!apdates || apdates.length === 0) {
          hasMore = false;
          break;
        }

        // Prepare batch cache entries
        const cacheEntries = apdates.map(apdate => ({
          key: CACHE_KEYS.APDATE.BY_DATE(apdate.calculatedDate, apdate.companyNo),
          value: ApdateMapper.toEntity(apdate),
          ttl: cacheConfig.ttl.apdate,
        }));

        // 🚀 BULK CACHE INSERT - all APDATE records in one Redis call
        const batchSuccess = await this.cacheService.setMultiple(cacheEntries);

        if (batchSuccess) {
          cachedApdates += cacheEntries.length;
          this.logger.debug(`💾 Cached ${cacheEntries.length} APDATE records in batch`);
        } else {
          this.logger.warn(`⚠️ Failed to cache batch of ${cacheEntries.length} APDATE records`);
        }

        totalApdates += apdates.length;
        offset += limit;

        // Check if we've processed all APDATE records
        if (apdates.length < limit) {
          hasMore = false;
        }

        this.logger.debug(`📊 Progress: ${totalApdates} APDATE records processed, ${cachedApdates} cached`);
      }

      // Mark bulk cache as completed
      await this.cacheService.set(
        bulkCacheKey,
        { timestamp: Date.now(), count: totalApdates },
        21600 // 6 hours
      );

      const duration = Date.now() - startTime;
      this.logger.log(`✅ Efficient bulk cache completed! ${cachedApdates}/${totalApdates} APDATE records cached for company ${companyNo} in ${duration}ms`);

      return {
        totalApdates,
        cachedApdates,
        duration
      };

    } catch (error) {
      this.logger.error(`💥 Bulk cache failed for company ${companyNo} APDATE: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  async getNewDate(companyNo: number, calculatedDate: number): Promise<string> {
    try {

      const findDate = await this.apdateModel.findOne({
        where: {
          companyNo,
          calculatedDate
        },
        raw: true
      })

      if (findDate) {
        return convertYYYYMMDDtoMMDDYY(findDate?.newDate)
      }

      return convertYYYYMMDDtoMMDDYY(calculatedDate)


    } catch (error) {
      this.logger.error(`Failed to fetch the New Date: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error
    }
  }
}
