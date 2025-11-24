import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { VendorModel } from "../models/vendor.model";
import { VendorInterface } from "@src/main/account-payable/domain/interface/vendor.interface";
import { Vendor } from "../../domain/entities/vendor.entity";
import { vendorMapper } from "../mappers/vendor.mappers";
import {
  where,
  fn,
  Op,
  col,
  WhereOptions,
  FindAttributeOptions,
  Transaction,
} from "@sequelize/core";
import { CacheService } from "@src/shared/cache/cache.service";
import { CACHE_KEYS, cacheConfig } from "@src/shared/cache/cache.config";
import { AppLogger } from "@src/shared/logger/logger.service";
import {
  VendorContactDetailDto,
  vendorandVendorContactDetailsInputDto,
  vendorMasterListDto,
} from "../../application/vendor-management/dto/vendor-management.dto";
import { normalizeSearchQuery } from "@src/shared/utils/query.utils";
import { IsDeletedStatus, STATUS, VENDOR_STATUS, VendorType } from "@src/shared/constants/constant";
import { VendorContactDetailModel } from "../models/vendor-contact-detail.model";
import { vendorWithContactDetailsMapper } from "../mappers/vendor-and-contact.mapper";
import { VendorContactDetailEntity } from "../../domain/entities/vendor-contact-detail.entity";
import { DynamicModelInitializationRepository } from "@src/shared/infrastructure/data/repository/dynamic-model-initialization.repository";
import { GetVendorsByYearDto, UpdateVendorByYearDto } from "../../application/ap-period-end/dto/ap-period-end.dto";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";
import { errorResponse } from "@src/shared/utils/response-formatter";
import { VENDOR_FILE_NAMES } from "@src/shared/constants/constant";
import { DynamicTableOperations } from "@src/shared/infrastructure/dynamicTableOperations/dynamicTableOperation";
import { yearEndProcessResponseMapper } from "../mappers/year-end-process.mapper";
import { YearEndProcessResponse } from "../../domain/entities/year-end-process.entity";
import { getDynamicTableAndSchemaInfo } from "@src/shared/config/env-library-config";
import { buildTableName } from "@src/shared/utils/db.utils";

@Injectable()
export class VendorRepository implements VendorInterface {
  private readonly logger = new AppLogger(VendorRepository.name);

  /**
   * Creates an instance of VendorRepository with caching capability
   * @param {typeof VendorModel} vendorModel - The Sequelize model for Vendor
   * @param {CacheService} cacheService - Redis cache service
   */

  constructor(
    @Inject("VendorModel")
    private readonly vendorModel: typeof VendorModel,

    @Inject("VendorContactDetailModel")
    private readonly vendorContactDetailModel: typeof VendorContactDetailModel,

    private readonly cacheService: CacheService,
    private readonly dynamicModelInitializationRepository: DynamicModelInitializationRepository,
    private readonly dynamicTableOperations: DynamicTableOperations
  ) { }

  startTransaction(): Promise<Transaction> {
    return this.vendorModel.sequelize!.startUnmanagedTransaction();
  }

  async findAll(
    companyNo: number,
    search?: string,
    limit?: number,
    offset?: number,
    fullDetails: boolean = false,
    includeIsDeleted: boolean = false
  ): Promise<{ rows: Vendor[]; count: number }> {
    const whereCondition: WhereOptions<VendorModel> = {
      vendorCompanyNumber: companyNo,
      vendorIsDeleted: { [Op.notIn]: ["D", "I"] },
    };

    if (includeIsDeleted) {
      delete whereCondition.vendorIsDeleted;
    }

    if (search) {
      whereCondition[Op.or] = [
        where(
          fn(
            "UPPER",
            col((VendorModel as any).getAttributes().vendorName.field)
          ),
          {
            [Op.like]: `%${search.toUpperCase()}%`,
          }
        ),
        where(
          fn("UPPER", col((VendorModel as any).getAttributes().vendorNo.field)),
          {
            [Op.like]: `%${search.toUpperCase()}%`,
          }
        ),
      ];
    }

    // Define attributes based on whether full details are requested
    const attributes: FindAttributeOptions<VendorModel> = fullDetails
      ? [
        "vendorCompanyNumber",
        "vendorNo",
        "vendorZipCode",
        "vendorApTermsCode",
        "vendorHoldPaymentsVend",
        "vendorGalRcptsRequired",
        "vendorExpenseGLSub",
        [
          fn(
            "TRIM",
            col((VendorModel as any).getAttributes().vendorCarrierId.field)
          ),
          "vendorCarrierId",
        ],
        [
          fn(
            "TRIM",
            col((VendorModel as any).getAttributes().vendorName.field)
          ),
          "vendorName",
        ],
        [
          fn(
            "TRIM",
            col((VendorModel as any).getAttributes().vendorAdd1.field)
          ),
          "vendorAdd1",
        ],
        [
          fn(
            "TRIM",
            col((VendorModel as any).getAttributes().vendorAdd2.field)
          ),
          "vendorAdd2",
        ],
        [
          fn(
            "TRIM",
            col((VendorModel as any).getAttributes().vendorAdd3.field)
          ),
          "vendorAdd3",
        ],
        [
          fn(
            "TRIM",
            col((VendorModel as any).getAttributes().vendorAdd4.field)
          ),
          "vendorAdd4",
        ],
      ]
      : [
        "vendorNo",
        [
          fn(
            "TRIM",
            col((VendorModel as any).getAttributes().vendorName.field)
          ),
          "vendorName",
        ],
      ];

    this.logger.log(`${JSON.stringify(whereCondition)}: WhereCondition`);

    const { rows, count } = await this.vendorModel.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      attributes,
    });

    return {
      rows: rows.map(vendorMapper),
      count,
    };
  }

  async findOne(vendorNo: number, companyNo: number): Promise<Vendor | null> {
    const startTime = Date.now();
    const cacheKey = CACHE_KEYS.VENDOR.BY_ID(vendorNo, companyNo);

    try {
      // Try cache first (Cache-Aside Pattern)
      const cachedVendor = await this.cacheService.get<Vendor>(cacheKey);
      if (cachedVendor) {
        const duration = Date.now() - startTime;
        this.logger.debug(
          `🎯 Vendor cache HIT: ${vendorNo}@${companyNo} (${duration}ms)`
        );
        return cachedVendor;
      }

      // Cache miss - fetch from database
      this.logger.debug(
        `❌ Vendor cache MISS: ${vendorNo}@${companyNo} - fetching from DB`
      );
    } catch (error) {
      this.logger.warn(
        `⚠️ Cache error for vendor ${vendorNo}@${companyNo}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      // Continue to database if cache fails
    }

    // Fetch from database
    const vendor = await this.vendorModel.findOne({
      where: {
        vendorNo,
        vendorCompanyNumber: companyNo,
        vendorIsDeleted: { [Op.notIn]: ["D", "I"] },
      },
      attributes: [
        "vendorCompanyNumber",
        "vendorNo",
        "vendorZipCode",
        "vendorApTermsCode",
        "vendorHoldPaymentsVend",
        "vendorGalRcptsRequired",
        "vendorExpenseGLSub",
        "vendorSingleCheck",
        [
          fn(
            "TRIM",
            col((VendorModel as any).getAttributes().vendorCarrierId.field)
          ),
          "vendorCarrierId",
        ],
        [
          fn(
            "TRIM",
            col((VendorModel as any).getAttributes().vendorName.field)
          ),
          "vendorName",
        ],
        [
          fn(
            "TRIM",
            col((VendorModel as any).getAttributes().vendorAdd1.field)
          ),
          "vendorAdd1",
        ],
        [
          fn(
            "TRIM",
            col((VendorModel as any).getAttributes().vendorAdd2.field)
          ),
          "vendorAdd2",
        ],
        [
          fn(
            "TRIM",
            col((VendorModel as any).getAttributes().vendorAdd3.field)
          ),
          "vendorAdd3",
        ],
        [
          fn(
            "TRIM",
            col((VendorModel as any).getAttributes().vendorAdd4.field)
          ),
          "vendorAdd4",
        ],
      ],
    });

    const mappedVendor = vendor ? vendorMapper(vendor) : null;
    const duration = Date.now() - startTime;

    // Cache the result for future requests (if vendor found)
    if (mappedVendor) {
      try {
        await this.cacheService.set(
          cacheKey,
          mappedVendor,
          cacheConfig.ttl.vendor
        );
        this.logger.debug(
          `💾 Vendor cached: ${vendorNo}@${companyNo} (${duration}ms)`
        );
      } catch (error) {
        this.logger.warn(
          `⚠️ Failed to cache vendor ${vendorNo}@${companyNo}:${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    } else {
      this.logger.debug(
        `🔍 Vendor not found: ${vendorNo}@${companyNo} (${duration}ms)`
      );
    }

    return mappedVendor;
  }

  /**
   * Cache all vendors for a company - useful for CSV upload scenarios
   * Uses efficient bulk fetching instead of individual calls
   */
  async cacheAllVendorsForCompany(companyNo: number): Promise<{
    totalVendors: number;
    cachedVendors: number;
    duration: number;
  }> {
    const startTime = Date.now();
    this.logger.log(
      `🔥 Starting efficient bulk cache for company ${companyNo} vendors...`
    );

    try {
      // Check if bulk cache is already recent (within 1 hour)
      const bulkCacheKey = CACHE_KEYS.VENDOR.BULK_CACHE_STATUS(companyNo);
      const recentBulkCache = await this.cacheService.get<{
        timestamp: number;
        count: number;
      }>(bulkCacheKey);

      if (recentBulkCache && Date.now() - recentBulkCache.timestamp < 3600000) {
        // 1 hour
        this.logger.log(
          `⏭️ Bulk cache for company ${companyNo} is recent (${recentBulkCache.count} vendors), skipping...`
        );
        return {
          totalVendors: recentBulkCache.count,
          cachedVendors: recentBulkCache.count,
          duration: Date.now() - startTime,
        };
      }

      // Fetch ALL vendors with full details in efficient batches
      const limit = 1000; // Process in batches to avoid memory issues
      let offset = 0;
      let totalVendors = 0;
      let cachedVendors = 0;
      let hasMore = true;

      while (hasMore) {
        this.logger.debug(
          `📊 Fetching vendor batch: offset ${offset}, limit ${limit}`
        );

        // 🚀 ONE BULK CALL with full details instead of individual calls
        const vendors = await this.findAll(
          companyNo,
          undefined,
          limit,
          offset,
          true
        );

        if (!vendors.rows || vendors.rows.length === 0) {
          hasMore = false;
          break;
        }

        // Prepare batch cache entries
        const cacheEntries = vendors.rows.map((vendor) => ({
          key: CACHE_KEYS.VENDOR.BY_ID(
            vendor.vendorNo,
            vendor.vendorCompanyNumber
          ),
          value: vendor,
          ttl: cacheConfig.ttl.vendor,
        }));

        // 🚀 BULK CACHE INSERT - all vendors in one Redis call
        const batchSuccess = await this.cacheService.setMultiple(cacheEntries);

        if (batchSuccess) {
          cachedVendors += cacheEntries.length;
          this.logger.debug(
            `💾 Cached ${cacheEntries.length} vendors in batch`
          );
        } else {
          this.logger.warn(
            `⚠️ Failed to cache batch of ${cacheEntries.length} vendors`
          );
        }

        totalVendors += vendors.rows.length;
        offset += limit;

        // Check if we've processed all vendors
        if (vendors.rows.length < limit) {
          hasMore = false;
        }

        this.logger.debug(
          `📊 Progress: ${totalVendors} vendors processed, ${cachedVendors} cached`
        );
      }

      // Mark bulk cache as completed
      await this.cacheService.set(
        bulkCacheKey,
        { timestamp: Date.now(), count: totalVendors },
        3600 // 1 hour
      );

      const duration = Date.now() - startTime;
      this.logger.log(
        `✅ Efficient bulk cache completed! ${cachedVendors}/${totalVendors} vendors cached for company ${companyNo} in ${duration}ms`
      );

      return {
        totalVendors,
        cachedVendors,
        duration,
      };
    } catch (error) {
      this.logger.error(
        `💥 Bulk cache failed for company ${companyNo}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      throw error;
    }
  }

  /**
   * Fetch vendor number based on company number and a single carrier ID.
   * Returns an object or null if not found.
   */
  async getVendorNoByCompanyAndCarrierId(
    companyNo: number,
    carrierId: string
  ): Promise<Vendor | null> {
    this.logger.debug(
      `🔍 Fetching vendor number for companyNo: ${companyNo} and carrierId: ${carrierId}`
    );
    const vendor = await this.vendorModel.findOne({
      attributes: ["vendorNo"],
      where: {
        vendorCompanyNumber: companyNo,
        vendorCarrierId: carrierId,
        vendorIsDeleted: { [Op.notIn]: ["D", "I"] },
      },
      raw: true,
    });
    this.logger.debug(
      `🔍 Vendor found: ${vendor?.vendorNo}@${companyNo} (${carrierId})`
    );
    return vendor ? vendorMapper(vendor) : null;
  }

  async getVendorTypes(): Promise<any> {
    const columnName = (this.vendorModel as any).getAttributes()
      .vendorHoldPaymentsVend.field;
    try {
      return await this.vendorModel.findAll({
        attributes: [
          [fn("DISTINCT", col(columnName)), "vendorHoldPaymentsVend"],
        ],
        raw: true,
      });
    } catch (error) {
      this.logger.error(
        `💥 Unable to Fetch the vendor Types Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      throw error;
    }
  }

  async getVendorMasterList(
    data: vendorMasterListDto
  ): Promise<{ rows: Vendor[]; count: number; page: number; limit: number }> {
    const { companyNo, vendorNo, type, status } = data;

    const { limit, offset, page } = normalizeSearchQuery(data);

    const whereCondition: WhereOptions<VendorModel> = {
      vendorCompanyNumber: companyNo,
    };

    if (vendorNo) {
      whereCondition.vendorNo = vendorNo;
    }

    if (type) {
      whereCondition.vendorHoldPaymentsVend = type;
    }

    if (status) {
      whereCondition.vendorIsDeleted = status;
    }

    try {
      const { rows, count } = await this.vendorModel.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
      });

      this.logger.debug(`Fetch the Vendor Master List`);

      return {
        rows: rows.map((row) => {
          const vendor = vendorMapper(row);
          vendor.vendorHoldPaymentsVend =
            VendorType[vendor.vendorHoldPaymentsVend] ?? "";
          vendor.vendorIsDeleted = VENDOR_STATUS[vendor.vendorIsDeleted] ?? "";
          return vendor;
        }),
        count,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(
        `💥 Error Fetching the Vendor Master List : ${error instanceof Error ? error.message : "Unknown error"}`
      );
      throw error;
    }
  }

  async createOrUpdateVendorContact(
    contactDetails?: VendorContactDetailDto[] | undefined,
    companyNo?: number,
    vendorNo?: number,
  ) {
    this.logger.debug(`Save or Update Vendor COntact Details`);

    if (!companyNo || !vendorNo) {
      throw new Error("Missing companyNo or vendorNo");
    }

    let responsecontactDetails: VendorContactDetailModel[] = [];
    if (contactDetails && contactDetails.length > 0) {
      for (let index = 0; index < contactDetails.length; index++) {
        const element = contactDetails[index];
        if (element) {
          const { sequenceNumber } = element;

          if (sequenceNumber) {
            this.logger.debug(`Update the Vendor Contact Details`);

            let record = await this.vendorContactDetailModel.findOne({
              where: { sequenceNumber, companyNo, vendorNo },
            });

            if (record) {
              await this.vendorContactDetailModel.update({ ...element }, { where: { sequenceNumber, companyNo, vendorNo } });
              responsecontactDetails.push(record);
            }
          } else {
            const maxSequence: number =
              (await this.vendorContactDetailModel.max("sequenceNumber")) ?? 0;

            this.logger.debug(
              `Saving the Vendor contact Details MaxSequence: ${maxSequence}`
            );

            const created = await this.vendorContactDetailModel.create(
              {
                ...element,
                companyNo,
                vendorNo,
                sequenceNumber: maxSequence + 1,
                deleteCode: 'A',
              }
            );
            responsecontactDetails.push(created);
          }
        }
      }
    }

    return responsecontactDetails;
  }

  async createOrUpdateVendor(
    data: vendorandVendorContactDetailsInputDto,
  ): Promise<{ message: string }> {
    const { contactDetails, ...vendorData } = data;
    const { vendorNo, vendorCompanyNumber, vendorCarrierId } = vendorData;

    this.logger.debug(`Finding the Vendor`);

    try {

      if (vendorCarrierId && vendorCarrierId.trim() !== '') {
        let checkCarriedId = await this.vendorModel.findOne({
          where: { vendorCarrierId },
        });

        if (checkCarriedId) {
          throw new HttpException(
            errorResponse(ERROR_CONSTANTS.VALIDATION_ERROR, [
              {
                field: "Carrier Id",
                code: ERROR_CONSTANTS.VALIDATION_ERROR.code,
                message: `Required Unique Carried Id`,
              },
            ]),
            HttpStatus.BAD_REQUEST
          );
        }
      }

      let vendorDetails = await this.vendorModel.findOne({
        where: { vendorCompanyNumber, vendorNo },
      });

      if (vendorDetails) {
        this.logger.debug(`Updating Vendor`);
        vendorDetails = await vendorDetails.update(vendorData);
        const cacheKey = CACHE_KEYS.VENDOR.BY_ID(vendorNo, vendorCompanyNumber);
        await this.cacheService.delete(cacheKey);
        this.logger.debug(`Cache invalidated for vendor ${vendorNo}@${vendorCompanyNumber}`);
      } else {
        this.logger.debug(`Creating Vendor`);
        vendorDetails = await this.vendorModel.create(
          { ...vendorData }
        );
        this.logger.debug(`New vendor created: ${vendorNo}@${vendorCompanyNumber}`);
      }

      // Contact details with same transaction
      await this.createOrUpdateVendorContact(
        contactDetails,
        vendorCompanyNumber,
        vendorNo,
      );

      return { message: `Vendor Details ${vendorDetails ? "saved" : "updated"} successfully` };

    } catch (error) {
      this.logger.error(
        `💥 Error Saving or Updating Vendor : ${error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw error;
    }
  }

  async getVendorAndContactDetails(
    vendorCompanyNumber: number,
    vendorNo: number
  ): Promise<{
    vendor: Vendor;
    vendorContactDetails: VendorContactDetailEntity[];
  } | null> {
    try {
      // Step 1: Get vendor details (no includes, no joins)
      const vendor = await this.vendorModel.findOne({
        where: {
          vendorCompanyNumber,
          vendorNo,
        },
        logging: (sql) => this.logger.debug(`Vendor query: ${sql}`)
      });

      if (!vendor) {
        return null;
      }

      // Step 2: Get contact details separately (completely independent query)
      const contactDetails = await this.vendorContactDetailModel.findAll({
        where: {
          deleteCode: { [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE] },
          companyNo: vendorCompanyNumber,
          vendorNo,
        },
        logging: (sql) => this.logger.debug(`Contact details query: ${sql}`)
      });

      // Step 3: Combine the results manually
      const vendorWithContacts = {
        ...vendor.toJSON(),
        vendorContactDetails: contactDetails,
      };

      this.logger.log(`VendorDetails: ${JSON.stringify(vendorWithContacts)}`);
      this.logger.log(`Contact details: ${JSON.stringify(contactDetails)}`);

      const mappedResult = vendorWithContactDetailsMapper(vendorWithContacts);

      return mappedResult;
    } catch (error) {
      this.logger.error(
        `💥 Error to find Vendor Details CompanyNo :${vendorCompanyNumber}, vendorNo :${vendorNo} : ${error instanceof Error ? error.message : "Unknown error"}`
      );
      throw error;
    }
  }

  /**
   * Get vendor categories for dropdown
   * @param companyNo - Company number
   * @param search - Optional search term
   * @param limit - Optional limit
   * @param offset - Optional offset
   * @returns Array of vendor categories for dropdown
   */
  async getVendorCategoriesForDropdown(
    companyNo: number,
    search?: string,
    limit?: number,
    offset?: number
  ): Promise<{ rows: any[]; count: number }> {
    try {
      const whereCondition: WhereOptions<VendorModel> = {
        vendorCompanyNumber: companyNo,
        vendorIsDeleted: { [Op.notIn]: ["D", "I"] },
      };

      if (search) {
        whereCondition[Op.or] = [
          where(
            fn(
              "UPPER",
              col((VendorModel as any).getAttributes().vendorName.field)
            ),
            {
              [Op.like]: `%${search.toUpperCase()}%`,
            }
          ),
          where(
            fn(
              "UPPER",
              col((VendorModel as any).getAttributes().vendorNo.field)
            ),
            {
              [Op.like]: `%${search.toUpperCase()}%`,
            }
          ),
        ];
      }

      const attributes: FindAttributeOptions<VendorModel> = [
        "vendorNo",
        [
          fn(
            "TRIM",
            col((VendorModel as any).getAttributes().vendorName.field)
          ),
          "vendorName",
        ],
      ];

      const { rows, count } = await this.vendorModel.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        attributes,
        order: [["vendorName", "ASC"]],
      });

      return {
        rows: rows.map(vendorMapper),
        count,
      };
    } catch (error) {
      this.logger.error(
        `Error getting vendor categories for dropdown: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      throw error;
    }
  }

  async getVendorMasterListByYear(data: GetVendorsByYearDto): Promise<{ rows: Vendor[]; count: number, page: number, limit: number }> {

    const { companyNo, year } = data

    const { limit: _limit, offset: _offset, page } = normalizeSearchQuery(data);

    const whereCondition: WhereOptions<VendorModel> = {
      vendorCompanyNumber: companyNo,
    };


    try {
      const Model =
        this.dynamicModelInitializationRepository.initDynamicTable('VendorYear', { suffix: year.toString() }); // loads Vendor1, Vendor2 etc.

      if (!Model) {
        throw new HttpException(
          errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
            {
              field: "vendor",
              code: ERROR_CONSTANTS.NOT_FOUND.code,
              message: `Vendor data not found for companyNo: ${companyNo}, year: ${year}`,
            },
          ]),
          HttpStatus.NOT_FOUND
        );
      }

      const { rows, count } = await Model.findAndCountAll({
        where: whereCondition,
      });

      this.logger.debug(`Fetch the Vendor Master List`);

      if (!rows) {
        throw new HttpException(
          errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
            {
              field: "vendor",
              code: ERROR_CONSTANTS.NOT_FOUND.code,
              message: `Vendor data not found for companyNo: ${companyNo}, year: ${year}`,
            },
          ]),
          HttpStatus.NOT_FOUND
        );
      }
      return {
        rows: rows.map((row) => {
          const vendor = vendorMapper(row as any);
          vendor.vendorHoldPaymentsVend = VendorType[vendor.vendorHoldPaymentsVend] ?? '';
          vendor.vendorIsDeleted = VENDOR_STATUS[vendor.vendorIsDeleted] ?? '';
          return vendor;
        }),
        count,
        page,
        limit: count,
      };

    } catch (error) {
      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
          {
            field: "vendor",
            code: ERROR_CONSTANTS.NOT_FOUND.code,
            message: `Vendor data not found for companyNo: ${companyNo}, year: ${year}`,
          },
        ]),
        HttpStatus.NOT_FOUND
      );
    }

  }

  async processVendorYearEnd(companyNo: number, year: string, clearYTD: boolean): Promise<YearEndProcessResponse> {
    this.logger.log(`Processing vendor year-end for company ${companyNo}, year ${year}, clearYTD: ${clearYTD}`);

    try {
      const { newTableName, sourceTableName, dataSchema } = await this.getTableAndSchemaInfo('VendorYear', year);
      const whereClause = `${(this.vendorModel as any).getAttributes().vendorIsDeleted.field} <> '${STATUS.DELETED}'`;
      const tableResult = await this.dynamicTableOperations.createTable(newTableName, sourceTableName, dataSchema, whereClause);

      this.logger.log('Saving vendor file for IRS backup');
      const irsBackupResult = await this.saveVendorFileForIRS(dataSchema, sourceTableName);

      if (!irsBackupResult.success) {
        this.logger.warn(`IRS backup failed: ${irsBackupResult.message}`);
      } else {
        this.logger.log(`IRS backup completed: ${irsBackupResult.message}`);
      }

      await this.clearVendorTotals(clearYTD);
      const message = `Vendor year-end process completed successfully for company ${companyNo}, year ${year}`;
      this.logger.log(`Year-end process completed successfully for company ${companyNo}, year ${year}`);

      return yearEndProcessResponseMapper({
        message,
        tableName: tableResult.tableName,
        dataCopied: tableResult.dataCopied
      });

    } catch (error) {
      this.logger.error(`Year-end process failed for company ${companyNo}, year ${year}:`, error as string);

      const errorMessage = error instanceof Error ? error.message : String(error);

      return yearEndProcessResponseMapper({
        message: `Year-end process failed: ${errorMessage}`,
        tableName: undefined,
        dataCopied: 0
      });
    }
  }

  /**
   * Helper method to get dynamic table and schema info for year-end process.
   * Uses getDynamicTableAndSchemaInfo and buildTableName to return newTableName, sourceTableName, and dataSchema.
   */
  async getTableAndSchemaInfo(
    modelName: string,
    year: string
  ): Promise<{ newTableName: string; sourceTableName: string; dataSchema: string }> {

    const tableInfo = getDynamicTableAndSchemaInfo(modelName);

    const newTableName = buildTableName({ suffix: year }, tableInfo);

    return {
      newTableName,
      sourceTableName: tableInfo.metadata.sourceTable!,
      dataSchema: tableInfo.schemaName
    };
  }

  //  method to clear and update vendor total at year end process
  async clearVendorTotals(clearYTD: boolean): Promise<void> {
    this.logger.log(`Starting vendor totals clear operation. ClearYTD: ${clearYTD}`);

    const updateFields: any = {
      vendorMtdDiscounts: 0,
      vendorPreviousBalance: this.vendorModel.sequelize.col("VNCBAL"),
      vendorMtdPurchases: 0,
      vendorMtdPayments: 0,
    };

    // Extra fields if Year-to-Date reset required
    if (clearYTD) {
      updateFields.vendorLastYearPurchases = this.vendorModel.sequelize.col("VNPYTD");
      updateFields.vendorYtdPurchases = 0;
      updateFields.vendorYtdDiscounts = 0;
      updateFields.vendorLastYrYtdPaid = this.vendorModel.sequelize.col("VNTYDP");
      updateFields.vendorThisYrYtdPaid = 0;
    }

    // Perform single bulk update for all vendors
    await this.vendorModel.update(updateFields, {
      where: { vendorIsDeleted: { [Op.notIn]: ['D', 'I'] } },
    });
  }

  // method to save vendor files for IRS backup at year end process
  async saveVendorFileForIRS(dataSchema: string, sourceTableName: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      this.logger.log('Starting vendor file rotation for IRS backup');

      const oldestFile = VENDOR_FILE_NAMES.BACKUP_FILES[VENDOR_FILE_NAMES.BACKUP_FILES.length - 1] as string;
      this.logger.log(`Deleting oldest vendor file: ${oldestFile}`);
      await this.dynamicTableOperations.dropTable(oldestFile, dataSchema);

      for (let i = VENDOR_FILE_NAMES.BACKUP_FILES.length - 2; i >= 0; i--) {
        const fromFile = VENDOR_FILE_NAMES.BACKUP_FILES[i]!;
        const toFile = VENDOR_FILE_NAMES.BACKUP_FILES[i + 1]!;

        const sourceExists = await this.dynamicTableOperations.tableExists(fromFile, dataSchema);
        if (sourceExists) {
          this.logger.log(`Renaming ${fromFile} to ${toFile}`);
          await this.dynamicTableOperations.renameTable(fromFile, toFile, dataSchema);
        } else {
          this.logger.warn(`Source table ${fromFile} does not exist, skipping rename to ${toFile}`);
        }
      }

      const newestBackupFile = VENDOR_FILE_NAMES.BACKUP_FILES[0];
      this.logger.log(`Copying current ${sourceTableName} to ${newestBackupFile}`);
      await this.dynamicTableOperations.createTableWithData(sourceTableName, newestBackupFile, dataSchema);

      return {
        success: true,
        message: `Vendor files rolling back up completed successfully.`,
      };

    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to save vendor file for IRS: ${errMsg}`, errMsg);

      return {
        success: false,
        message: `Failed to save vendor file for IRS: ${errMsg}`,
      };
    }
  }




  async getVendorDetailsByYear(
    vendorCompanyNumber: number,
    vendorNo: number,
    year: string
  ): Promise<Vendor | null> {
    try {

      const VendorYearModel = this.dynamicModelInitializationRepository.initDynamicTable('VendorYear', { suffix: year.toString() }); // loads Vendor1, Vendor2 etc.

      if (!VendorYearModel) {
        throw new HttpException(
          errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
            {
              field: "vendor",
              code: ERROR_CONSTANTS.NOT_FOUND.code,
              message: `Vendor data not found for companyNo: ${vendorCompanyNumber}, year: ${year}`,
            },
          ]),
          HttpStatus.NOT_FOUND
        );
      }

      const vendorDetails = await VendorYearModel.findOne({
        where: {
          vendorCompanyNumber,
          vendorNo,
        },

      });

      this.logger.error(`VendorDetails: ${JSON.stringify(vendorDetails)}`);

      if (!vendorDetails) {
        return null;
      }

      return vendorMapper(vendorDetails as VendorModel);

    } catch (error) {
      this.logger.error(
        `💥 Error to find Vendor Details CompanyNo :${vendorCompanyNumber}, vendorNo :${vendorNo} : ${error instanceof Error ? error.message : "Unknown error"}`
      );
      throw error;
    }
  }
  async updateVendorByYear(
    data: UpdateVendorByYearDto,
    year: string,
    vendorNo: string
  ): Promise<{ message: string }> {

    this.logger.debug(`Finding the Vendor`);

    const Model =
      this.dynamicModelInitializationRepository.initDynamicTable('VendorYear', { suffix: year.toString() }); // loads Vendor1, Vendor2 etc.

    // Remove fields with value 0 to avoid updating them (database doesn't allow NULL)
 
    await Model!.update(data as any, {
      where: {
        vendorCompanyNumber: data.vendorCompanyNumber,
        vendorNo,
      },
    });

    return {
      message: `Vendor Details updated successfully`,
    };
  }
}


