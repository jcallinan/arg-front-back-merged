import { Injectable, Inject } from "@nestjs/common";
import { FreightInvoiceHeaderEntity } from "@src/main/account-payable/domain/entities/freight-invoice-header.entity";
import { FreightInvoiceHeaderModel } from "@src/main/account-payable/data/models/freight-invoice-header.model";
import { FreightInvoiceHeaderMapper } from "@src/main/account-payable/data/mappers/freight-invoice-header.mapper";
import { FreightInvoiceHeaderInterface } from "@src/main/account-payable/domain/interface/freight-invoice-header.interface";
import { CarrierInvoiceResponseDto } from "@src/main/account-payable/application/voucher/dto/voucher.dto";
import { FreightOutBalancingInvoiceModel } from "@src/main/account-payable/data/models/freight-out-balancing-header.model";
import { GetCarrierInvoicesDto } from "@src/main/account-payable/application/voucher/dto/voucher.dto";
import { toCarrierInvoiceResponseDto } from "@src/main/account-payable/data/mappers/carrier-invoice.mapper";
import { CarrierInvoiceHeaderModel } from "@src/main/account-payable/data/models/carrier-invoice-header.model";
import { paginatedResponse, PaginatedResponse } from "@src/shared/utils/response-formatter";
import { Op, col, literal } from "@sequelize/core";
import {
  APPROVAL_STATUS,
} from "@src/shared/constants/constant";
import { normalizeSearchQuery } from "@src/shared/utils/query.utils";
import { formatToMMDDYY } from "@src/shared/utils/format-date";
import { CacheService } from "@src/shared/cache/cache.service";
import { CACHE_KEYS, cacheConfig } from "@src/shared/cache/cache.config";
import { AppLogger } from "@src/shared/logger/logger.service";
import {
  INVOICE_TYPE,
} from "@src/shared/constants/paper-lms-constant";
@Injectable()
export class FreightInvoiceHeaderRepository
  implements FreightInvoiceHeaderInterface {
  private readonly logger = new AppLogger(FreightInvoiceHeaderRepository.name);

  constructor(
    @Inject("FreightInvoiceHeaderModel")
    private readonly freightInvoiceHeaderModel: typeof FreightInvoiceHeaderModel,
    @Inject("FreightOutBalancingInvoiceModel")
    private readonly freightOutBalancingInvoiceModel: typeof FreightOutBalancingInvoiceModel,
    @Inject("CarrierInvoiceHeaderModel")
    private readonly carrierInvoiceHeaderModel: typeof CarrierInvoiceHeaderModel,
    private readonly cacheService: CacheService,
  ) { }

  async findByCompanyNo(
    companyNo: number,
  ): Promise<FreightInvoiceHeaderEntity[]> {
    const records = await this.freightInvoiceHeaderModel.findAll({
      where: {
        companyNo,
      },
    });
    return records.map(FreightInvoiceHeaderMapper.toEntity);
  }

  /**
   * Fetch paginated freight invoice headers matching specific conditions.
   * Equivalent to:
   * SELECT * FROM FRCINH WHERE FRINTY='P' and FRAPST=' ' and FRINAM-FRFBOA > 0 and FRALST='Y'
   * @param {number} limit - Max records to return
   * @param {number} offset - Records to skip
   */


  async findCarrierInvoices(dto: GetCarrierInvoicesDto): Promise<PaginatedResponse<CarrierInvoiceResponseDto>> {
    const startTime = Date.now();
    this.logger.sharedTiming("Starting fetchGstablRecord", startTime, 'start');
    const { limit, offset, page } = normalizeSearchQuery(dto);

    // Fetch Freight Invoice Header records
    this.logger.sharedTiming("Starting freightCarrierInvoiceModel Record", startTime);
    const { count, rows } = await this.freightInvoiceHeaderModel.findAndCountAll({
      where: {
        companyNo: dto.companyNo,
        invoiceType: dto.invoiceType,
        apInvoiceStatus: '',
        approvalStatus: APPROVAL_STATUS.Y,
        [Op.and]: [
          literal(`"FreightInvoiceHeaderModel"."${(this.freightInvoiceHeaderModel as any).getAttributes().invoiceAmount.field}" - "FreightInvoiceHeaderModel"."${(this.freightInvoiceHeaderModel as any).getAttributes().freightBalanceOverrideTotal.field}" > 0`)
        ]
      },
      attributes: [
        "carrierId",
        "carrierInvoiceNo",
        "invoiceType",
        "ourOrderNo",
        "shippingReferenceNo",
        "invoiceAmount",
        "invoiceDate"
      ],

      include: [
        {
          model: this.carrierInvoiceHeaderModel,
          as: 'carrierInvoices',
          required: false,
          where: {
            companyNo: dto.companyNo,
            invoiceType: dto.invoiceType,
            apInvoiceStatus: '',
            approvalStatus: APPROVAL_STATUS.Y,
            [Op.and]: [
              literal(`"carrierInvoices"."${(this.carrierInvoiceHeaderModel as any).getAttributes().invoiceAmount.field}" - "carrierInvoices"."${(this.carrierInvoiceHeaderModel as any).getAttributes().orderOverrideTotal.field}" > 0`)
            ]
          },
          attributes: [
            [col(`carrierInvoices.${(this.carrierInvoiceHeaderModel as any).getAttributes().invoiceAmount.field}`), "carrierInvoiceAmount"],
          ],
        },
      ],
      order: [
        [col(`FreightInvoiceHeaderModel.${(this.freightInvoiceHeaderModel as any).getAttributes().companyNo.field}`), 'ASC']
      ],
      limit,
      offset,
      logging: console.log
    });
    this.logger.sharedTiming("End freightCarrierInvoiceModel Record", startTime);

    // Deduplicate order pairs
    const seen = new Set<string>();
    const orderPairs = rows
      .map(r => ({
        ourOrderNo: r.ourOrderNo,
        shippingReferenceNumber: r.shippingReferenceNo,
      }))
      .filter(({ ourOrderNo, shippingReferenceNumber }) => {
        const key = `${ourOrderNo}-${shippingReferenceNumber}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

    this.logger.sharedTiming("start frightOutBalancingRecords", startTime);

    // Fetch matching Freight Out Balancing records
    const frightOutBalancingRecords = await this.freightOutBalancingInvoiceModel.findAll({
      where: {
        companyNo: dto.companyNo,
        [Op.or]: orderPairs,
      },
      attributes: ['ourOrderNo', 'shippingReferenceNumber', 'shipDateCymd'],
    });
    this.logger.sharedTiming("end frightOutBalancingRecords", startTime);

    // Map order pairs to ship dates
    const orderPairToShipDate = new Map(
      frightOutBalancingRecords.map(r => [
        `${r.ourOrderNo}-${r.shippingReferenceNumber}`,
        r.shipDateCymd ? String(r.shipDateCymd) : ''
      ])
    );

    this.logger.sharedTiming("end orderPairToShipDate", startTime);

    // Map FRCINH rows to response DTOs
    const items = rows.map(row => {
     
      const r = (row && typeof row.get === 'function') ? row.dataValues : row;
      const key = `${r.ourOrderNo}-${r.shippingReferenceNo}`;
      const shipDateRaw = orderPairToShipDate.get(key);
      const shipDate = (typeof shipDateRaw === 'string' || typeof shipDateRaw === 'number')
        ? formatToMMDDYY(shipDateRaw)
        : '';
    
      const mappedRow = {
        ...r,
        invoiceType: INVOICE_TYPE[r.invoiceType] ?? r.invoiceType,
        invoiceDate: row.invoiceDate ? formatToMMDDYY(row.invoiceDate) : "",
        carrierInvoiceNo: r.carrierInvoiceNo
      };
      return toCarrierInvoiceResponseDto(mappedRow as any, shipDate);
    });
    this.logger.sharedTiming("end mapping", startTime);
    return paginatedResponse(items, count, page, limit);
  }
  async findByCompanyAndCarrier(
    companyNo: number,
    carrierId?: string,
    carrierInvoiceNo?: string,
  ): Promise<FreightInvoiceHeaderEntity | null> {
    const startTime = Date.now();

    // Return null if mandatory parameter is missing
    if (!companyNo) {
      this.logger.warn(`FreightInvoiceHeader query skipped - missing mandatory param: companyNo=${companyNo}`);
      return null;
    }

    // Check if bulk cache exists for this company
    const bulkStatusKey = CACHE_KEYS.FREIGHTINVOICE.BULK_CACHE_STATUS(companyNo);

    const bulkCacheStatus = await this.cacheService.get<string>(bulkStatusKey);

    if (bulkCacheStatus) {
      // Bulk cache exists, use pure cache-only approach
      const cacheKey = CACHE_KEYS.FREIGHTINVOICE.BY_COMPANY_CARRIER_INVOICE(
        companyNo,
        carrierId,
        carrierInvoiceNo
      );


      const cachedRecord = await this.cacheService.get<FreightInvoiceHeaderEntity>(cacheKey);
      const duration = Date.now() - startTime;

      if (cachedRecord) {
        this.logger.debug(`🎯 FreightInvoice cache HIT: ${companyNo}:${carrierId || 'EMPTY'}:${carrierInvoiceNo || 'EMPTY'} (${duration}ms)`);
        return cachedRecord;
      } else {
        this.logger.debug(`🎯 FreightInvoice cache MISS (doesn't exist): ${companyNo}:${carrierId || 'EMPTY'}:${carrierInvoiceNo || 'EMPTY'} (${duration}ms)`);
        return null;
      }
    } else {
      // Build WHERE clause with only valid parameters
      const whereClause: any = {
        companyNo,
      };

      if (carrierId && carrierId.trim() !== '') {
        whereClause.carrierId = carrierId;
      }

      if (carrierInvoiceNo && carrierInvoiceNo.trim() !== '') {
        whereClause.carrierInvoiceNo = carrierInvoiceNo;
      }

      const record = await this.freightInvoiceHeaderModel.findOne({
        where: whereClause,
      });
      return record ? FreightInvoiceHeaderMapper.toEntity(record) : null;
    }

  }

  async findMultiple(
    requests: Array<{ companyNo: number; carrierId?: string; carrierInvoiceNo?: string }>,
  ): Promise<Map<string, FreightInvoiceHeaderEntity>> {
    const startTime = Date.now();
    const result = new Map<string, FreightInvoiceHeaderEntity>();
    let foundAnyCachedData = false;

    // Check cache for each FreightInvoice record
    for (const request of requests) {
      const { companyNo, carrierId, carrierInvoiceNo } = request;
      const cacheKey = CACHE_KEYS.FREIGHTINVOICE.BY_COMPANY_CARRIER_INVOICE(companyNo, carrierId, carrierInvoiceNo);
      const lookupKey = `${companyNo}:${carrierId || 'EMPTY'}:${carrierInvoiceNo || 'EMPTY'}`;

      try {
        const cachedRecord = await this.cacheService.get<FreightInvoiceHeaderEntity>(cacheKey);
        if (cachedRecord !== undefined) {
          foundAnyCachedData = true;
          if (cachedRecord) {
            result.set(lookupKey, cachedRecord);
            this.logger.debug(`🎯 FreightInvoice bulk cache HIT: ${lookupKey}`);
          } else {
            this.logger.debug(`🎯 FreightInvoice bulk cache HIT (null): ${lookupKey}`);
          }
        } else {
          this.logger.debug(`❌ FreightInvoice bulk cache MISS: ${lookupKey}`);
        }
      } catch (error) {
        this.logger.error(`Cache error for FreightInvoice ${lookupKey}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // If we have any cached data, return it (pure cache-only approach)
    if (foundAnyCachedData) {
      const duration = Date.now() - startTime;
      this.logger.debug(`✅ Found cached data for ${result.size}/${requests.length} FreightInvoice records, skipping DB call (${duration}ms)`);
      return result;
    }

    // No cached data found, return empty Map
    const duration = Date.now() - startTime;
    this.logger.debug(`❌ No cached FreightInvoice data found, returning empty results (${duration}ms)`);
    return result;
  }

  async cacheAllFreightInvoiceHeaderForCompany(companyNo: number): Promise<void> {
    const startTime = Date.now();
    this.logger.log(`🔄 Starting FreightInvoice bulk cache for company ${companyNo}`);

    try {
      const batchSize = 1000;
      let offset = 0;
      let cachedCount = 0;
      let batchNumber = 1;

      while (true) {
        this.logger.debug(`📦 Processing FreightInvoice batch ${batchNumber} (offset: ${offset}, size: ${batchSize})`);

        const records = await this.freightInvoiceHeaderModel.findAll({
          where: { companyNo },
          limit: batchSize,
          offset,
          order: [['companyNo', 'ASC'], ['carrierId', 'ASC'], ['carrierInvoiceNo', 'ASC']],
        });

        if (records.length === 0) {
          this.logger.debug(`✅ FreightInvoice batch processing complete - no more records found`);
          break;
        }

        // Process batch
        const cachePromises = records.map(async (record) => {
          const entity = FreightInvoiceHeaderMapper.toEntity(record);
          const cacheKey = CACHE_KEYS.FREIGHTINVOICE.BY_COMPANY_CARRIER_INVOICE(
            record.companyNo,
            record.carrierId,
            record.carrierInvoiceNo
          );

          try {
            await this.cacheService.set(cacheKey, entity, cacheConfig.ttl.freightinvoice);
            return true;
          } catch (error) {
            this.logger.warn(`Failed to cache FreightInvoice ${record.companyNo}:${record.carrierId || 'EMPTY'}:${record.carrierInvoiceNo || 'EMPTY'}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return false;
          }
        });

        const results = await Promise.all(cachePromises);
        const batchCachedCount = results.filter(Boolean).length;
        cachedCount += batchCachedCount;

        this.logger.debug(`📦 FreightInvoice batch ${batchNumber} completed: ${batchCachedCount}/${records.length} cached successfully`);

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
      const bulkStatusKey = CACHE_KEYS.FREIGHTINVOICE.BULK_CACHE_STATUS(companyNo);
      await this.cacheService.set(bulkStatusKey, { completed: true, count: cachedCount }, cacheConfig.ttl.freightinvoice);

      const duration = Date.now() - startTime;
      this.logger.log(`✅ FreightInvoice bulk cache completed for company ${companyNo}: ${cachedCount} records cached in ${duration}ms`);

    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(`❌ FreightInvoice bulk cache failed for company ${companyNo} after ${duration}ms: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  // Update Invoice Status to processed (Y)
  async updateInvoiceStatus(orderNo: number, companyNo: number, carrierId: string, carrierInvoiceNumber: string) {
    // find the record in FreightInvoiceHeaderModel
    this.logger.log(`Updating Invoice Status to processed (Y) for orderNo: ${orderNo}`);
    const freightInvoiceRecord = await this.freightInvoiceHeaderModel.findOne({
      where: {
        ourOrderNo: orderNo,
        companyNo,
        carrierId,
        carrierInvoiceNo: carrierInvoiceNumber
      }
    });
    this.logger.log(`FreightInvoiceHeaderModel record found: ${freightInvoiceRecord ? 'Yes' : 'No'}`);
    let result;
    if (freightInvoiceRecord) {
      // If found, update in FreightInvoiceHeaderModel
      this.logger.log(`Updating FreightInvoiceHeaderModel record for orderNo: ${orderNo}`);
      result = await this.freightInvoiceHeaderModel.update(
        { apInvoiceStatus: 'Y' },
        {
          where: {
            ourOrderNo: orderNo,
            companyNo,
            carrierId,
            carrierInvoiceNo: carrierInvoiceNumber
          }
        }
      );
    } else {
      // Else, update in CarrierInvoiceHeaderModel
      this.logger.log(`Updating CarrierInvoiceHeaderModel record for orderNo: ${orderNo}`);
      result = await this.carrierInvoiceHeaderModel.update(
        { apInvoiceStatus: 'Y' },
        {
          where: {
            orderNumber: orderNo,
            companyNo,
            carrierId,
            carrierInvoiceNumber
          }
        }
      );
    }
    this.logger.log(`Invoice Status updated for orderNo: ${orderNo}`);
    return result
  }
}
