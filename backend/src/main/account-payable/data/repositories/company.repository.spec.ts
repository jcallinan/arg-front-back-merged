import { Test, TestingModule } from "@nestjs/testing";
import { CompanyRepository } from "./company.repository";
import { CompanyModel } from "../models/company.model";
import { CacheService } from "@src/shared/cache/cache.service";
import { CACHE_KEYS, cacheConfig } from "@src/shared/cache/cache.config";
import { HttpException, HttpStatus } from "@nestjs/common";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";
import { errorResponse } from "@src/shared/utils/response-formatter";
import { CompanyFactory, SequelizeModelFactory } from "@src/shared/tests";

// Mock the companyMapper to avoid Sequelize model initialization issues
jest.mock("../mappers/company.mappers", () => ({
  companyMapper: jest.fn(),
}));

// Mock the logger to avoid initialization issues
jest.mock("@src/shared/logger/logger.service", () => ({
  AppLogger: jest.fn().mockImplementation(() => ({
    debug: jest.fn(),
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  })),
}));

// Mock Sequelize model initialization
jest.mock("../models/company.model", () => ({
  CompanyModel: {
    findAndCountAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    init: jest.fn(),
    sync: jest.fn(),
    rawAttributes: {},
    _schema: {},
    _dialect: {},
    bulkCreate: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOrCreate: jest.fn(),
    findOrBuild: jest.fn(),
    max: jest.fn(),
    min: jest.fn(),
    sum: jest.fn(),
    count: jest.fn(),
    name: "CompanyModel",
    tableName: "company",
    hasOne: jest.fn(),
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
    belongsToMany: jest.fn(),
    getAttributes: jest.fn().mockReturnValue({
      companyName: { field: "companyName" },
      companyPreEdChks: { field: "companyPreEdChks" },
      companyPreEdChksDate: { field: "companyPreEdChksDate" },
      companyPreEdChksTime: { field: "companyPreEdChksTime" },
      companyPreEdChksUser: { field: "companyPreEdChksUser" },
      companyPreEdChksStatus: { field: "companyPreEdChksStatus" },
      companyPreEdChksNotes: { field: "companyPreEdChksNotes" },
      companyPreEdChksAmount: { field: "companyPreEdChksAmount" },
      companyPreEdChksCurrency: { field: "companyPreEdChksCurrency" },
      companyPreEdChksExchangeRate: { field: "companyPreEdChksExchangeRate" },
      companyPreEdChksBaseAmount: { field: "companyPreEdChksBaseAmount" },
      companyPreEdChksBaseCurrency: { field: "companyPreEdChksBaseCurrency" },
      companyPreEdChksBaseExchangeRate: {
        field: "companyPreEdChksBaseExchangeRate",
      },
      companyPreEdChksBaseAmount2: { field: "companyPreEdChksBaseAmount2" },
      companyPreEdChksBaseCurrency2: { field: "companyPreEdChksBaseCurrency2" },
      companyPreEdChksBaseExchangeRate2: {
        field: "companyPreEdChksBaseExchangeRate2",
      },
      companyPreEdChksBaseAmount3: { field: "companyPreEdChksBaseAmount3" },
      companyPreEdChksBaseCurrency3: { field: "companyPreEdChksBaseCurrency3" },
      companyPreEdChksBaseExchangeRate3: {
        field: "companyPreEdChksBaseExchangeRate3",
      },
      companyPreEdChksBaseAmount4: { field: "companyPreEdChksBaseAmount4" },
      companyPreEdChksBaseCurrency4: { field: "companyPreEdChksBaseCurrency4" },
      companyPreEdChksBaseExchangeRate4: {
        field: "companyPreEdChksBaseExchangeRate4",
      },
      companyPreEdChksBaseAmount5: { field: "companyPreEdChksBaseAmount5" },
      companyPreEdChksBaseCurrency5: { field: "companyPreEdChksBaseCurrency5" },
      companyPreEdChksBaseExchangeRate5: {
        field: "companyPreEdChksBaseExchangeRate5",
      },
      companyPreEdChksBaseAmount6: { field: "companyPreEdChksBaseAmount6" },
      companyPreEdChksBaseCurrency6: { field: "companyPreEdChksBaseCurrency6" },
      companyPreEdChksBaseExchangeRate6: {
        field: "companyPreEdChksBaseExchangeRate6",
      },
      companyPreEdChksBaseAmount7: { field: "companyPreEdChksBaseAmount7" },
      companyPreEdChksBaseCurrency7: { field: "companyPreEdChksBaseCurrency7" },
      companyPreEdChksBaseExchangeRate7: {
        field: "companyPreEdChksBaseExchangeRate7",
      },
      companyPreEdChksBaseAmount8: { field: "companyPreEdChksBaseAmount8" },
      companyPreEdChksBaseCurrency8: { field: "companyPreEdChksBaseCurrency8" },
      companyPreEdChksBaseExchangeRate8: {
        field: "companyPreEdChksBaseExchangeRate8",
      },
      companyPreEdChksBaseAmount9: { field: "companyPreEdChksBaseAmount9" },
      companyPreEdChksBaseCurrency9: { field: "companyPreEdChksBaseCurrency9" },
      companyPreEdChksBaseExchangeRate9: {
        field: "companyPreEdChksBaseExchangeRate9",
      },
      companyPreEdChksBaseAmount10: { field: "companyPreEdChksBaseAmount10" },
      companyPreEdChksBaseCurrency10: {
        field: "companyPreEdChksBaseCurrency10",
      },
      companyPreEdChksBaseExchangeRate10: {
        field: "companyPreEdChksBaseExchangeRate10",
      },
      companyJobCostAct: { field: "companyJobCostAct" },
      companyJobCostActDate: { field: "companyJobCostActDate" },
      companyJobCostActTime: { field: "companyJobCostActTime" },
      companyJobCostActUser: { field: "companyJobCostActUser" },
      companyJobCostActStatus: { field: "companyJobCostActStatus" },
      companyJobCostActNotes: { field: "companyJobCostActNotes" },
      companyJobCostActAmount: { field: "companyJobCostActAmount" },
      companyJobCostActCurrency: { field: "companyJobCostActCurrency" },
      companyJobCostActExchangeRate: { field: "companyJobCostActExchangeRate" },
      companyJobCostActBaseAmount: { field: "companyJobCostActBaseAmount" },
      companyJobCostActBaseCurrency: { field: "companyJobCostActBaseCurrency" },
      companyJobCostActBaseExchangeRate: {
        field: "companyJobCostActBaseExchangeRate",
      },
      companyJobCostActBaseAmount2: { field: "companyJobCostActBaseAmount2" },
      companyJobCostActBaseCurrency2: {
        field: "companyJobCostActBaseCurrency2",
      },
      companyJobCostActBaseExchangeRate2: {
        field: "companyJobCostActBaseExchangeRate2",
      },
      companyJobCostActBaseAmount3: { field: "companyJobCostActBaseAmount3" },
      companyJobCostActBaseCurrency3: {
        field: "companyJobCostActBaseCurrency3",
      },
      companyJobCostActBaseExchangeRate3: {
        field: "companyJobCostActBaseExchangeRate3",
      },
      companyJobCostActBaseAmount4: { field: "companyJobCostActBaseAmount4" },
      companyJobCostActBaseCurrency4: {
        field: "companyJobCostActBaseCurrency4",
      },
      companyJobCostActBaseExchangeRate4: {
        field: "companyJobCostActBaseExchangeRate4",
      },
      companyJobCostActBaseAmount5: { field: "companyJobCostActBaseAmount5" },
      companyJobCostActBaseCurrency5: {
        field: "companyJobCostActBaseCurrency5",
      },
      companyJobCostActBaseExchangeRate5: {
        field: "companyJobCostActBaseExchangeRate5",
      },
      companyJobCostActBaseAmount6: { field: "companyJobCostActBaseAmount6" },
      companyJobCostActBaseCurrency6: {
        field: "companyJobCostActBaseCurrency6",
      },
      companyJobCostActBaseExchangeRate6: {
        field: "companyJobCostActBaseExchangeRate6",
      },
      companyJobCostActBaseAmount7: { field: "companyJobCostActBaseAmount7" },
      companyJobCostActBaseCurrency7: {
        field: "companyJobCostActBaseCurrency7",
      },
      companyJobCostActBaseExchangeRate7: {
        field: "companyJobCostActBaseExchangeRate7",
      },
      companyJobCostActBaseAmount8: { field: "companyJobCostActBaseAmount8" },
      companyJobCostActBaseCurrency8: {
        field: "companyJobCostActBaseCurrency8",
      },
      companyJobCostActBaseExchangeRate8: {
        field: "companyJobCostActBaseExchangeRate8",
      },
      companyJobCostActBaseAmount9: { field: "companyJobCostActBaseAmount9" },
      companyJobCostActBaseCurrency9: {
        field: "companyJobCostActBaseCurrency9",
      },
      companyJobCostActBaseExchangeRate9: {
        field: "companyJobCostActBaseExchangeRate9",
      },
      companyJobCostActBaseAmount10: { field: "companyJobCostActBaseAmount10" },
      companyJobCostActBaseCurrency10: {
        field: "companyJobCostActBaseCurrency10",
      },
      companyJobCostActBaseExchangeRate10: {
        field: "companyJobCostActBaseExchangeRate10",
      },
      companyPoActive: { field: "companyPoActive" },
      companyPoActiveDate: { field: "companyPoActiveDate" },
      companyPoActiveTime: { field: "companyPoActiveTime" },
      companyPoActiveUser: { field: "companyPoActiveUser" },
      companyPoActiveStatus: { field: "companyPoActiveStatus" },
      companyPoActiveNotes: { field: "companyPoActiveNotes" },
      companyPoActiveAmount: { field: "companyPoActiveAmount" },
      companyPoActiveCurrency: { field: "companyPoActiveCurrency" },
      companyPoActiveExchangeRate: { field: "companyPoActiveExchangeRate" },
      companyPoActiveBaseAmount: { field: "companyPoActiveBaseAmount" },
      companyPoActiveBaseCurrency: { field: "companyPoActiveBaseCurrency" },
      companyPoActiveBaseExchangeRate: {
        field: "companyPoActiveBaseExchangeRate",
      },
      company99Name: { field: "company99Name" },
      company99Address1: { field: "company99Address1" },
      company99Address2: { field: "company99Address2" },
      company99Address3: { field: "company99Address3" },
      company99Address4: { field: "company99Address4" },
      company99City: { field: "company99City" },
      company99State: { field: "company99State" },
      company99Zip: { field: "company99Zip" },
      company99Country: { field: "company99Country" },
      company99Phone: { field: "company99Phone" },
      company99Fax: { field: "company99Fax" },
      company99Email: { field: "company99Email" },
      company99Contact: { field: "company99Contact" },
      company99TaxId: { field: "company99TaxId" },
      company99Duns: { field: "company99Duns" },
      company99Cage: { field: "company99Cage" },
      company99Naics: { field: "company99Naics" },
      company99Sic: { field: "company99Sic" },
      company99Website: { field: "company99Website" },
      company99Notes: { field: "company99Notes" },
      company99StateZip: { field: "company99StateZip" },
      company99EmployeeName: { field: "company99EmployeeName" },
      companyFiller: { field: "companyFiller" },
    }),
  },
}));

describe("CompanyRepository", () => {
  let repository: CompanyRepository;
  let companyModel: jest.Mocked<typeof CompanyModel>;
  let cacheService: jest.Mocked<CacheService>;
  let mockCompanyMapper: jest.MockedFunction<any>;

  // Use factory to create mock data
  const mockCompany = CompanyFactory.createBasicCompany();
  const mockCompanyEntity = mockCompany;

  // Create Sequelize model mock using factory
  const mockCompanyModel =
    SequelizeModelFactory.createMockSequelizeModel(mockCompany);

  beforeEach(async () => {
    // Get the mocked companyMapper function
    const { companyMapper } = jest.requireMock("../mappers/company.mappers");
    mockCompanyMapper = companyMapper;

    // Get the mocked CompanyModel from the jest mock
    companyModel = jest.requireMock("../models/company.model").CompanyModel;

    const mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
      setMultiple: jest.fn(),
      setCompany: jest.fn(),
      exists: jest.fn(),
      delete: jest.fn(),
      deletePattern: jest.fn(),
      getConnectionStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyRepository,
        {
          provide: "CompanyModel",
          useValue: companyModel,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    repository = module.get<CompanyRepository>(CompanyRepository);
    cacheService = module.get(CacheService);

    // Reset mocks
    jest.clearAllMocks();

    // Re-setup the mocks after clearing
    mockCompanyMapper.mockReturnValue(mockCompanyEntity);

    // Ensure the CompanyModel methods are properly mocked with default values
    companyModel.findAndCountAll.mockResolvedValue({ rows: [], count: [] });
    companyModel.findOne.mockResolvedValue(null);
    companyModel.update.mockResolvedValue([0]);

    // Ensure cache service methods are properly mocked
    cacheService.get.mockResolvedValue(null);
    cacheService.set.mockResolvedValue(true);
    cacheService.setMultiple.mockResolvedValue(true);
    cacheService.setCompany.mockResolvedValue(undefined);
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  describe("findAll", () => {
    it("should return all active companies without search parameters", async () => {
      const mockDbResponse = {
        rows: [mockCompanyModel],
        count: [{ count: 1 }],
      };

      companyModel.findAndCountAll.mockResolvedValue(mockDbResponse);

      const result = await repository.findAll();

      expect(companyModel.findAndCountAll).toHaveBeenCalledWith({
        where: { companyIsDeleted: "A" },
        limit: undefined,
        offset: undefined,
      });

      // The repository calls the mocked companyMapper function, so we verify the result structure
      expect(result).toEqual({
        rows: [mockCompanyEntity],
        count: [{ count: 1 }],
      });
      expect(result.count).toEqual([{ count: 1 }]);
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0]).toEqual(mockCompanyEntity);
    });

    it("should return companies with search by company number", async () => {
      const search = "1";
      const limit = 10;
      const offset = 0;

      const mockDbResponse = {
        rows: [mockCompanyModel],
        count: [{ count: 1 }],
      };

      // Explicitly set up the mock for this test and ensure it's a proper Jest mock
      const mockFindAndCountAll = jest.fn().mockResolvedValue(mockDbResponse);
      companyModel.findAndCountAll = mockFindAndCountAll;

      // Ensure companyMapper is properly mocked for this test
      mockCompanyMapper.mockReturnValue(mockCompanyEntity);

      const result = await repository.findAll(search, limit, offset);

      // Verify the method was called with the expected structure
      expect(mockFindAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            companyIsDeleted: "A",
          }),
          limit,
          offset,
        })
      );

      // Verify the result structure
      expect(result).toEqual({
        rows: [mockCompanyEntity],
        count: [{ count: 1 }],
      });
      expect(result.count).toEqual([{ count: 1 }]);
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0]).toEqual(mockCompanyEntity);
    });

    it("should return companies with search by company name", async () => {
      const search = "test";
      const limit = 10;
      const offset = 0;

      const mockDbResponse = {
        rows: [mockCompanyModel],
        count: [{ count: 1 }],
      };

      // Explicitly set up the mock for this test and ensure it's a proper Jest mock
      const mockFindAndCountAll = jest.fn().mockResolvedValue(mockDbResponse);
      companyModel.findAndCountAll = mockFindAndCountAll;

      // Ensure companyMapper is properly mocked for this test
      mockCompanyMapper.mockReturnValue(mockCompanyEntity);

      const result = await repository.findAll(search, limit, offset);

      // Verify the method was called with the expected structure
      expect(mockFindAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            companyIsDeleted: "A",
          }),
          limit,
          offset,
        })
      );

      // Verify the result structure
      expect(result).toEqual({
        rows: [mockCompanyEntity],
        count: [{ count: 1 }],
      });
      expect(result.count).toEqual([{ count: 1 }]);
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0]).toEqual(mockCompanyEntity);
    });

    it("should return companies with pagination", async () => {
      const limit = 5;
      const offset = 10;

      const mockDbResponse = {
        rows: [mockCompanyModel],
        count: [{ count: 1 }],
      };

      companyModel.findAndCountAll.mockResolvedValue(mockDbResponse);

      const result = await repository.findAll(undefined, limit, offset);

      expect(companyModel.findAndCountAll).toHaveBeenCalledWith({
        where: { companyIsDeleted: "A" },
        limit,
        offset,
      });

      // The repository calls the mocked companyMapper function, so we verify the result structure
      expect(result).toEqual({
        rows: [mockCompanyEntity],
        count: [{ count: 1 }],
      });
      expect(result.count).toEqual([{ count: 1 }]);
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0]).toEqual(mockCompanyEntity);
    });

    it("should handle empty search string", async () => {
      const search = "";
      const mockDbResponse = {
        rows: [mockCompanyModel],
        count: [{ count: 1 }],
      };

      companyModel.findAndCountAll.mockResolvedValue(mockDbResponse);

      const result = await repository.findAll(search);

      expect(companyModel.findAndCountAll).toHaveBeenCalledWith({
        where: { companyIsDeleted: "A" },
        limit: undefined,
        offset: undefined,
      });
      // The repository calls the mocked companyMapper function, so we verify the result structure
      expect(result).toEqual({
        rows: [mockCompanyEntity],
        count: [{ count: 1 }],
      });
      expect(result.count).toEqual([{ count: 1 }]);
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0]).toEqual(mockCompanyEntity);
    });

    it("should handle null search parameter", async () => {
      const search = null as any;
      const mockDbResponse = {
        rows: [mockCompanyModel],
        count: [{ count: 1 }],
      };

      companyModel.findAndCountAll.mockResolvedValue(mockDbResponse);

      const result = await repository.findAll(search);

      expect(companyModel.findAndCountAll).toHaveBeenCalledWith({
        where: { companyIsDeleted: "A" },
        limit: undefined,
        offset: undefined,
      });
      // The repository calls the mocked companyMapper function, so we verify the result structure
      expect(result).toEqual({
        rows: [mockCompanyEntity],
        count: [{ count: 1 }],
      });
      expect(result.count).toEqual([{ count: 1 }]);
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0]).toEqual(mockCompanyEntity);
    });

    it("should handle database errors gracefully", async () => {
      const dbError = new Error("Database connection failed");
      companyModel.findAndCountAll.mockRejectedValue(dbError);

      await expect(repository.findAll()).rejects.toThrow(dbError);
    });
  });

  describe("cacheAllCompanies", () => {
    it("should cache all companies successfully", async () => {
      const mockDbResponse = {
        rows: [mockCompanyModel],
        count: [{ count: 1 }],
      };

      companyModel.findAndCountAll.mockResolvedValue(mockDbResponse);
      cacheService.get.mockResolvedValue(null); // No recent bulk cache
      cacheService.setMultiple.mockResolvedValue(true);
      cacheService.set.mockResolvedValue(true);

      const result = await repository.cacheAllCompanies();

      expect(cacheService.get).toHaveBeenCalledWith(
        CACHE_KEYS.COMPANY.BULK_CACHE_STATUS()
      );
      expect(companyModel.findAndCountAll).toHaveBeenCalledWith({
        where: { companyIsDeleted: "A" },
        limit: 500,
        offset: 0,
      });
      expect(cacheService.setMultiple).toHaveBeenCalledWith([
        {
          key: CACHE_KEYS.COMPANY.BY_ID(mockCompany.companyNo),
          value: mockCompanyEntity,
          ttl: cacheConfig.ttl.company,
        },
      ]);
      expect(cacheService.set).toHaveBeenCalledWith(
        CACHE_KEYS.COMPANY.BULK_CACHE_STATUS(),
        { timestamp: expect.any(Number), count: 1 },
        7200
      );
      expect(result).toEqual({
        totalCompanies: 1,
        cachedCompanies: 1,
        duration: expect.any(Number),
      });
    });

    it("should skip caching if recent bulk cache exists", async () => {
      const recentBulkCache = {
        timestamp: Date.now() - 3600000, // 1 hour ago (within 2 hours)
        count: 5,
      };

      cacheService.get.mockResolvedValue(recentBulkCache);

      const result = await repository.cacheAllCompanies();

      expect(cacheService.get).toHaveBeenCalledWith(
        CACHE_KEYS.COMPANY.BULK_CACHE_STATUS()
      );
      expect(companyModel.findAndCountAll).not.toHaveBeenCalled();
      expect(cacheService.setMultiple).not.toHaveBeenCalled();
      expect(result).toEqual({
        totalCompanies: 5,
        cachedCompanies: 5,
        duration: expect.any(Number),
      });
    });

    it("should handle multiple batches when companies exceed limit", async () => {
      const mockCompanies = Array.from({ length: 600 }, (_, i) =>
        SequelizeModelFactory.createMockSequelizeModel({
          ...mockCompany,
          companyNo: i + 1,
          companyName: `Company ${i + 1}`,
        })
      );

      // First batch
      companyModel.findAndCountAll
        .mockResolvedValueOnce({
          rows: mockCompanies.slice(0, 500),
          count: [{ count: 600 }],
        })
        // Second batch
        .mockResolvedValueOnce({
          rows: mockCompanies.slice(500, 600),
          count: [{ count: 600 }],
        });

      cacheService.get.mockResolvedValue(null);
      cacheService.setMultiple.mockResolvedValue(true);
      cacheService.set.mockResolvedValue(true);

      const result = await repository.cacheAllCompanies();

      expect(companyModel.findAndCountAll).toHaveBeenCalledTimes(2);
      expect(cacheService.setMultiple).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        totalCompanies: 600,
        cachedCompanies: 600,
        duration: expect.any(Number),
      });
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database connection failed");
      companyModel.findAndCountAll.mockRejectedValue(dbError);
      cacheService.get.mockResolvedValue(null);

      await expect(repository.cacheAllCompanies()).rejects.toThrow(dbError);
    });

    it("should handle empty company results", async () => {
      const mockDbResponse = {
        rows: [],
        count: [{ count: 0 }],
      };

      companyModel.findAndCountAll.mockResolvedValue(mockDbResponse);
      cacheService.get.mockResolvedValue(null);
      cacheService.set.mockResolvedValue(true);

      const result = await repository.cacheAllCompanies();

      expect(result).toEqual({
        totalCompanies: 0,
        cachedCompanies: 0,
        duration: expect.any(Number),
      });
      expect(cacheService.setMultiple).not.toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should return company from cache if available", async () => {
      cacheService.get.mockResolvedValue(mockCompanyEntity);

      const result = await repository.findOne(1);

      expect(cacheService.get).toHaveBeenCalledWith(
        CACHE_KEYS.COMPANY.BY_ID(1)
      );
      expect(companyModel.findOne).not.toHaveBeenCalled();
      expect(result).toEqual(mockCompanyEntity);
    });

    it("should fetch company from database and cache it when cache miss", async () => {
      cacheService.get.mockResolvedValue(null);
      companyModel.findOne.mockResolvedValue(mockCompanyModel);
      cacheService.set.mockResolvedValue(true);

      const result = await repository.findOne(1);

      expect(cacheService.get).toHaveBeenCalledWith(
        CACHE_KEYS.COMPANY.BY_ID(1)
      );
      expect(companyModel.findOne).toHaveBeenCalledWith({
        where: {
          companyNo: 1,
          companyIsDeleted: "A",
        },
        attributes: expect.arrayContaining([
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
          expect.arrayContaining([expect.any(Object), "companyName"]),
          expect.arrayContaining([expect.any(Object), "companyPreEdChks"]),
          expect.arrayContaining([expect.any(Object), "companyJobCostAct"]),
          expect.arrayContaining([expect.any(Object), "companyPoActive"]),
          expect.arrayContaining([expect.any(Object), "company99Name"]),
          expect.arrayContaining([expect.any(Object), "company99Address1"]),
          expect.arrayContaining([expect.any(Object), "company99Address2"]),
          expect.arrayContaining([expect.any(Object), "company99StateZip"]),
          expect.arrayContaining([expect.any(Object), "company99EmployeeName"]),
          expect.arrayContaining([expect.any(Object), "companyFiller"]),
        ]),
      });
      expect(cacheService.set).toHaveBeenCalledWith(
        CACHE_KEYS.COMPANY.BY_ID(1),
        mockCompanyEntity,
        cacheConfig.ttl.company
      );
      expect(result).toEqual(mockCompanyEntity);
    });

    it("should throw error when company not found", async () => {
      cacheService.get.mockResolvedValue(null);
      companyModel.findOne.mockResolvedValue(null);

      await expect(repository.findOne(999)).rejects.toThrow(HttpException);
      await expect(repository.findOne(999)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
        response: errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
          {
            field: "companyNo",
            code: ERROR_CONSTANTS.NOT_FOUND.code,
            message: "Company not found with number 999",
          },
        ]),
      });
    });

    it("should handle database errors gracefully", async () => {
      const dbError = new Error("Database connection failed");
      cacheService.get.mockResolvedValue(null);
      companyModel.findOne.mockRejectedValue(dbError);

      await expect(repository.findOne(1)).rejects.toThrow(dbError);
    });
  });

  describe("updateNextEntryNo", () => {
    it("should update companyNextEntryNo successfully", async () => {
      const updatedCompany = SequelizeModelFactory.createMockSequelizeModel({
        ...mockCompany,
        companyNextEntryNo: 100,
      });
      companyModel.update.mockResolvedValue([1]);
      companyModel.findOne.mockResolvedValue(updatedCompany);
      cacheService.setCompany.mockResolvedValue(undefined);

      const result = await repository.updateNextEntryNo(1, 100);

      expect(companyModel.update).toHaveBeenCalledWith(
        { companyNextEntryNo: 100 },
        { where: { companyNo: 1 } }
      );
      expect(companyModel.findOne).toHaveBeenCalledWith({
        where: { companyNo: 1 },
      });
      expect(cacheService.setCompany).toHaveBeenCalledWith(mockCompanyEntity);
      expect(result).toEqual(mockCompanyEntity);
    });

    it("should update companyVendorNextEntryNo successfully", async () => {
      const updatedCompany = SequelizeModelFactory.createMockSequelizeModel({
        ...mockCompany,
        companyVendorNextEntryNo: 200,
      });
      companyModel.update.mockResolvedValue([1]);
      companyModel.findOne.mockResolvedValue(updatedCompany);
      cacheService.setCompany.mockResolvedValue(undefined);

      const result = await repository.updateNextEntryNo(1, undefined, 200);

      expect(companyModel.update).toHaveBeenCalledWith(
        { companyVendorNextEntryNo: 200 },
        { where: { companyNo: 1 } }
      );
      expect(result).toEqual(mockCompanyEntity);
    });

    it("should throw error when company not found after update", async () => {
      companyModel.update.mockResolvedValue([1]);
      companyModel.findOne.mockResolvedValue(null);

      await expect(repository.updateNextEntryNo(1, 100)).rejects.toThrow(
        "Company with companyNo 1 not found after update"
      );
    });

    it("should handle update failures gracefully", async () => {
      companyModel.update.mockResolvedValue([0]);

      await expect(repository.updateNextEntryNo(1, 100)).rejects.toThrow(
        "Company with companyNo 1 not found after update"
      );
    });

    it("should handle database errors gracefully", async () => {
      const dbError = new Error("Database connection failed");
      companyModel.update.mockRejectedValue(dbError);

      await expect(repository.updateNextEntryNo(1, 100)).rejects.toThrow(
        dbError
      );
    });
  });

  describe("update", () => {
    it("should update company successfully", async () => {
      const updateData = { companyName: "Updated Company" };
      const updatedCompany = SequelizeModelFactory.createMockSequelizeModel({
        ...mockCompany,
        companyName: "Updated Company",
      });

      companyModel.update.mockResolvedValue([1]);
      companyModel.findOne.mockResolvedValue(updatedCompany);
      cacheService.set.mockResolvedValue(true);

      const result = await repository.update(1, updateData);

      expect(companyModel.update).toHaveBeenCalledWith(updateData, {
        where: { companyNo: 1 },
      });
      expect(companyModel.findOne).toHaveBeenCalledWith({
        where: { companyNo: 1 },
      });
      expect(cacheService.set).toHaveBeenCalledWith(
        CACHE_KEYS.COMPANY.BY_ID(1),
        mockCompanyEntity,
        cacheConfig.ttl.company
      );
      expect(result).toEqual(mockCompanyEntity);
    });

    it("should throw error when company not found for update", async () => {
      const updateData = { companyName: "Updated Company" };
      companyModel.update.mockResolvedValue([0]);

      await expect(repository.update(999, updateData)).rejects.toThrow(
        HttpException
      );
      await expect(repository.update(999, updateData)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
        response: errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
          {
            field: "companyNo",
            code: ERROR_CONSTANTS.NOT_FOUND.code,
            message: "Company not found with number 999",
          },
        ]),
      });
    });

    it("should throw error when company not found after update", async () => {
      const updateData = { companyName: "Updated Company" };
      companyModel.update.mockResolvedValue([1]);
      companyModel.findOne.mockResolvedValue(null);

      await expect(repository.update(1, updateData)).rejects.toThrow(
        "Company with companyNo 1 not found after update"
      );
    });

    it("should handle database errors gracefully", async () => {
      const updateData = { companyName: "Updated Company" };
      const dbError = new Error("Database connection failed");
      companyModel.update.mockRejectedValue(dbError);

      await expect(repository.update(1, updateData)).rejects.toThrow(dbError);
    });
  });

  describe("error handling", () => {
    it("should handle invalid company number gracefully", async () => {
      await expect(repository.findOne(-1)).rejects.toThrow(HttpException);
    });

    it("should handle null update data gracefully", async () => {
      await expect(repository.update(1, null as any)).rejects.toThrow();
    });

    it("should handle empty update data gracefully", async () => {
      await expect(repository.update(1, {})).rejects.toThrow();
    });
  });

  describe("performance and edge cases", () => {
    it("should handle large result sets efficiently", async () => {
      const largeMockResponse = {
        rows: Array.from({ length: 1000 }, (_, i) =>
          SequelizeModelFactory.createMockSequelizeModel({
            ...mockCompany,
            companyNo: i + 1,
            companyName: `Company ${i + 1}`,
          })
        ),
        count: [{ count: 1000 }],
      };

      companyModel.findAndCountAll.mockResolvedValue(largeMockResponse);

      const result = await repository.findAll();

      expect(result.rows).toHaveLength(1000);
      expect(result.count).toEqual([{ count: 1000 }]);
    });

    it("should handle special characters in search gracefully", async () => {
      const searchWithSpecialChars = "Test@Company#123";
      const mockDbResponse = {
        rows: [mockCompanyModel],
        count: [{ count: 1 }],
      };

      // Explicitly set up the mock for this test and ensure it's a proper Jest mock
      const mockFindAndCountAll = jest.fn().mockResolvedValue(mockDbResponse);
      companyModel.findAndCountAll = mockFindAndCountAll;

      // Ensure companyMapper is properly mocked for this test
      mockCompanyMapper.mockReturnValue(mockCompanyEntity);

      const result = await repository.findAll(searchWithSpecialChars);

      expect(result.rows).toHaveLength(1);
      // Verify the method was called with the expected structure
      expect(mockFindAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            companyIsDeleted: "A",
          }),
          limit: undefined,
          offset: undefined,
        })
      );

      // Verify the result structure
      expect(result).toEqual({
        rows: [mockCompanyEntity],
        count: [{ count: 1 }],
      });
    });
  });
});
