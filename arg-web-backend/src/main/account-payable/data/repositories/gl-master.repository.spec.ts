import { Test, TestingModule } from "@nestjs/testing";
import { GlMasterRepository } from "./gl-master.repository";
import { GlMasterModel } from "../models/gl-master.model";
import { CacheService } from "@src/shared/cache/cache.service";

import { CACHE_KEYS, cacheConfig } from "@src/shared/cache/cache.config";
import { HttpException, HttpStatus } from "@nestjs/common";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";
import { errorResponse } from "@src/shared/utils/response-formatter";
import { Op } from "@sequelize/core";
import { STATUS } from "@src/shared/constants/constant";
import { SequelizeModelFactory, GlMasterFactory } from "@src/shared/tests";

// Mock the GlMasterMapper
jest.mock("../mappers/gl-master.mapper", () => ({
  GlMasterMapper: {
    toEntity: jest.fn(),
  },
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
jest.mock("../models/gl-master.model", () => ({
  GlMasterModel: {
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
    name: "GlMasterModel",
    tableName: "gl_master",
    hasOne: jest.fn(),
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
    belongsToMany: jest.fn(),
    getAttributes: jest.fn().mockReturnValue({
      description: { field: "description" },
      accountNo: { field: "accountNo" },
    }),
  },
}));

describe("GlMasterRepository", () => {
  let repository: GlMasterRepository;
  let glMasterModel: jest.Mocked<typeof GlMasterModel>;
  let cacheService: jest.Mocked<CacheService>;
  let mockGlMasterMapper: jest.MockedFunction<(data: any) => any>;

  // Use factory to create clean mock data
  const mockGlMasterModel = GlMasterFactory.createMockGlMasterModel();
  const mockGlMasterEntity = GlMasterFactory.createBasicGlMaster();
  const mockGlMasterModelInstance =
    SequelizeModelFactory.createMockSequelizeModel(mockGlMasterModel);

  beforeEach(async () => {
    // Get the mocked GlMasterMapper function
    const { GlMasterMapper } = jest.requireMock("../mappers/gl-master.mapper");
    mockGlMasterMapper = GlMasterMapper.toEntity;

    // Get the mocked GlMasterModel from the jest mock
    glMasterModel = jest.requireMock("../models/gl-master.model").GlMasterModel;

    const mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
      setMultiple: jest.fn(),
      exists: jest.fn(),
      delete: jest.fn(),
      deletePattern: jest.fn(),
      getConnectionStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GlMasterRepository,
        {
          provide: "GlMasterModel",
          useValue: glMasterModel,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    repository = module.get<GlMasterRepository>(GlMasterRepository);
    cacheService = module.get(CacheService);

    // Reset mocks
    jest.clearAllMocks();

    // Re-setup the mocks after clearing
    mockGlMasterMapper.mockReturnValue(mockGlMasterEntity);

    // Ensure the GlMasterModel methods are properly mocked with default values
    glMasterModel.findOne.mockResolvedValue(null);
    glMasterModel.findAll.mockResolvedValue([]);

    // Ensure cache service methods are properly mocked
    cacheService.get.mockResolvedValue(null);
    cacheService.set.mockResolvedValue(true);
    cacheService.setMultiple.mockResolvedValue(true);
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  describe("findOne", () => {
    it("should return GL Master from cache if available", async () => {
      cacheService.get.mockResolvedValue(mockGlMasterEntity);

      const result = await repository.findOne(1, 100000, [1], "C");

      expect(cacheService.get).toHaveBeenCalledWith(
        CACHE_KEYS.GLMASTER.BY_ACCOUNT(1, 100000, 1, "C")
      );
      expect(glMasterModel.findOne).not.toHaveBeenCalled();
      expect(result).toEqual(mockGlMasterEntity);
    });

    it("should fetch GL Master from database and cache it when cache miss", async () => {
      cacheService.get.mockResolvedValue(null);
      glMasterModel.findOne.mockResolvedValue(mockGlMasterModelInstance);
      cacheService.set.mockResolvedValue(true);

      const result = await repository.findOne(1, 100000, [1], "C");

      expect(cacheService.get).toHaveBeenCalledWith(
        CACHE_KEYS.GLMASTER.BY_ACCOUNT(1, 100000, 1, "C")
      );
      expect(glMasterModel.findOne).toHaveBeenCalledWith({
        where: {
          companyNo: 1,
          accountNo: 100000,
          subAccountNo: { [Op.in]: [1] },
          accountType: "C",
        },
      });
      expect(cacheService.set).toHaveBeenCalledWith(
        CACHE_KEYS.GLMASTER.BY_ACCOUNT(1, 100000, 1, "C"),
        mockGlMasterEntity,
        cacheConfig.ttl.glmaster
      );
      expect(result).toEqual(mockGlMasterEntity);
    });

    it("should handle multiple subAccountNos with mixed cache hits and misses", async () => {
      const subAccountNos = [1, 2];
      cacheService.get
        .mockResolvedValueOnce(null) // First subAccountNo cache miss
        .mockResolvedValueOnce(mockGlMasterEntity); // Second subAccountNo cache hit

      glMasterModel.findOne.mockResolvedValue(mockGlMasterModelInstance);
      cacheService.set.mockResolvedValue(true);

      const result = await repository.findOne(1, 100000, subAccountNos, "C");

      expect(cacheService.get).toHaveBeenCalledTimes(2);
      expect(glMasterModel.findOne).not.toHaveBeenCalled(); // Cache hit short-circuits DB call
      expect(result).toEqual(mockGlMasterEntity);
    });

    it("should throw error when GL Master not found", async () => {
      cacheService.get.mockResolvedValue(null);
      glMasterModel.findOne.mockResolvedValue(null);

      await expect(repository.findOne(1, 999999, [1], "C")).rejects.toThrow(
        HttpException
      );
      await expect(
        repository.findOne(1, 999999, [1], "C")
      ).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
        response: errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
          {
            field: "apGLNo",
            code: ERROR_CONSTANTS.NOT_FOUND.code,
            message: "INVALID DETAIL LINE G/L NUMBER ENTERED",
          },
        ]),
      });
    });

    it("should handle cache errors gracefully", async () => {
      cacheService.get.mockRejectedValue(new Error("Cache error"));
      glMasterModel.findOne.mockResolvedValue(mockGlMasterModelInstance);
      cacheService.set.mockResolvedValue(true);

      const result = await repository.findOne(1, 100000, [1], "C");

      expect(glMasterModel.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockGlMasterEntity);
    });

    it("should return error when GL Master not found", async () => {
      cacheService.get.mockResolvedValue(null);
      glMasterModel.findOne.mockResolvedValue(null);

      await expect(
        repository.findOne(1, 100000, [1], "C", false)
      ).rejects.toThrow(HttpException);
    });
  });

  describe("findMultiple", () => {
    it("should return GL Masters from cache when available", async () => {
      const accountDetails = [
        { accountNo: 100000, subAccountNo: 1, accountType: "C" },
        { accountNo: 200000, subAccountNo: 1, accountType: "C" },
      ];
      cacheService.get
        .mockResolvedValueOnce(mockGlMasterEntity) // First record cache hit
        .mockResolvedValueOnce(null); // Second record cache miss

      const result = await repository.findMultiple(1, accountDetails);

      expect(cacheService.get).toHaveBeenCalledTimes(2);
      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(1); // Only one cache hit
      expect(result.get("100000:1:C")).toEqual(mockGlMasterEntity);
    });

    it("should handle large number of account numbers with batching", async () => {
      const accountDetails = Array.from({ length: 1500 }, (_, i) => ({
        accountNo: 100000 + i,
        subAccountNo: 1,
        accountType: "C",
      }));

      cacheService.get.mockResolvedValue(null);

      const result = await repository.findMultiple(1, accountDetails);

      expect(cacheService.get).toHaveBeenCalledTimes(1500);
      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(0); // No cache hits
    });

    it("should handle empty account numbers array", async () => {
      const result = await repository.findMultiple(1, []);

      expect(cacheService.get).not.toHaveBeenCalled();
      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(0);
    });
  });

  describe("cacheAllGlMasterForCompany", () => {
    it("should cache GL Master records in batches", async () => {
      const mockRecords = Array.from({ length: 1500 }, (_, i) =>
        GlMasterFactory.createMockGlMasterModel({
          accountNo: 100000 + i,
          subAccountNo: (i % 100) + 1,
        })
      );

      glMasterModel.findAll
        .mockResolvedValueOnce(
          mockRecords
            .slice(0, 1000)
            .map((record) =>
              SequelizeModelFactory.createMockSequelizeModel(record)
            )
        ) // First batch
        .mockResolvedValueOnce(
          mockRecords
            .slice(1000, 1500)
            .map((record) =>
              SequelizeModelFactory.createMockSequelizeModel(record)
            )
        ); // Second batch

      cacheService.set.mockResolvedValue(true);

      await repository.cacheAllGlMasterForCompany(1);

      expect(glMasterModel.findAll).toHaveBeenCalledTimes(2);
      expect(cacheService.set).toHaveBeenCalledTimes(1500 + 1); // +1 for bulk status
    });

    it("should handle empty results", async () => {
      glMasterModel.findAll.mockResolvedValue([]);
      cacheService.set.mockResolvedValue(true);

      await repository.cacheAllGlMasterForCompany(1);

      expect(glMasterModel.findAll).toHaveBeenCalledWith({
        where: {
          companyNo: 1,
          isDeleted: { [Op.notIn]: [STATUS.INACTIVE, STATUS.DELETED] },
        },
        limit: 1000,
        offset: 0,
        order: [
          ["accountNo", "ASC"],
          ["subAccountNo", "ASC"],
          ["accountType", "ASC"],
        ],
      });
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database connection failed");
      glMasterModel.findAll.mockRejectedValue(dbError);

      await expect(repository.cacheAllGlMasterForCompany(1)).rejects.toThrow(
        dbError
      );
    });
  });

  describe("error handling", () => {
    it("should handle invalid parameters gracefully", async () => {
      await expect(repository.findOne(0, 100000, [1], "C")).rejects.toThrow(
        HttpException
      );
      await expect(repository.findOne(1, 0, [1], "C")).rejects.toThrow(
        HttpException
      );
      await expect(repository.findOne(1, 100000, [], "C")).rejects.toThrow(
        HttpException
      );
    });
  });

  describe("performance and edge cases", () => {
    it("should handle large result sets efficiently", async () => {
      const largeMockResponse = Array.from({ length: 1000 }, (_, i) =>
        SequelizeModelFactory.createMockSequelizeModel(
          GlMasterFactory.createMockGlMasterModel({
            accountNo: 100000 + i,
            description: `GL Account ${i + 1}`,
          })
        )
      );

      glMasterModel.findAll
        .mockResolvedValueOnce(largeMockResponse)
        .mockResolvedValueOnce([]);

      await repository.cacheAllGlMasterForCompany(1);

      expect(glMasterModel.findAll).toHaveBeenCalledWith({
        where: {
          companyNo: 1,
          isDeleted: { [Op.notIn]: [STATUS.INACTIVE, STATUS.DELETED] },
        },
        limit: 1000,
        offset: 0,
        order: [
          ["accountNo", "ASC"],
          ["subAccountNo", "ASC"],
          ["accountType", "ASC"],
        ],
      });
    });
  });
});
