import { Test, TestingModule } from "@nestjs/testing";
import { VoucherDetailRepository } from "./voucher-detail.repository";
import { SequelizeModelFactory } from "@src/shared/tests";
import { VoucherDetail } from "@src/main/account-payable/domain/entities/voucher.entity";
import { STATUS } from "@src/shared/constants/constant";
import { Op } from "@sequelize/core";

// Mock the voucherDetailMapper
jest.mock("../mappers/voucher-detail.mapper", () => ({
  voucherDetailMapper: jest.fn(),
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
jest.mock("../models/voucher-detail.model", () => ({
  VoucherDetailModel: {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    init: jest.fn(),
    sync: jest.fn(),
    rawAttributes: {},
    _schema: {},
    _dialect: {},
    bulkCreate: jest.fn(),
    destroy: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOrCreate: jest.fn(),
    findOrBuild: jest.fn(),
    max: jest.fn(),
    min: jest.fn(),
    sum: jest.fn(),
    count: jest.fn(),
    name: "VoucherDetailModel",
    tableName: "voucher_detail",
    hasOne: jest.fn(),
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
    belongsToMany: jest.fn(),
  },
}));

describe("VoucherDetailRepository", () => {
  let repository: VoucherDetailRepository;
  let mockVoucherDetailModel: any;
  let mockVoucherDetail: any;
  let voucherDetailMapper: any;

  beforeEach(async () => {
    mockVoucherDetail = {
      companyNo: 1,
      entryNo: 1001,
      entrySequence: 1,
      vendorNo: 100,
      lineCompanyNo: 1,
      lineGlNo: 1000,
      lineDesc: "Test Product",
      lineAmount: 1000.0,
      lineTaxAmount: 100.0,
      lineDiscountAmount: 50.0,
      lineNetAmount: 1050.0,
      lineQuantity: 1,
      lineUnitPrice: 1000.0,
      lineTaxCode: "TAX001",
      lineDiscountCode: "DISC001",
      lineGlDescription: "Test GL Account",
      isDeleted: "A",
      createDate: 20231201,
      updateDate: 20231201,
      createUser: "testuser",
      updateUser: "testuser",
    };

    mockVoucherDetailModel = {
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
    };

    // Get the mocked voucherDetailMapper function
    const { voucherDetailMapper: mockedMapper } = jest.requireMock(
      "../mappers/voucher-detail.mapper"
    );
    voucherDetailMapper = mockedMapper;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoucherDetailRepository,
        {
          provide: "VoucherDetailModel",
          useValue: mockVoucherDetailModel,
        },
      ],
    }).compile();

    repository = module.get<VoucherDetailRepository>(VoucherDetailRepository);

    // Clear all mocks before each test
    jest.clearAllMocks();

    // Re-setup the mocks after clearing
    voucherDetailMapper.mockReturnValue(mockVoucherDetail);

    // Ensure the VoucherDetailModel methods are properly mocked with default values
    mockVoucherDetailModel.findOne.mockResolvedValue(null);
    mockVoucherDetailModel.create.mockResolvedValue(mockVoucherDetailModel);
    mockVoucherDetailModel.update.mockResolvedValue([1]);
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  describe("createOrUpdate", () => {
    it("should create new voucher details when they don't exist", async () => {
      const voucherDetails = [mockVoucherDetail] as Partial<VoucherDetail[]>;

      mockVoucherDetailModel.findOne.mockResolvedValue(null);
      mockVoucherDetailModel.create.mockResolvedValue(mockVoucherDetailModel);

      const result = await repository.createOrUpdate(voucherDetails);

      expect(mockVoucherDetailModel.findOne).toHaveBeenCalledWith({
        where: {
          companyNo: 1,
          entryNo: 1001,
          entrySequence: 1,
        },
      });
      expect(mockVoucherDetailModel.create).toHaveBeenCalledWith(
        mockVoucherDetail
      );
      expect(voucherDetailMapper).toHaveBeenCalledWith(mockVoucherDetailModel);
      expect(result).toEqual([mockVoucherDetail]);
    });

    it("should update existing voucher details when they exist", async () => {
      const voucherDetails = [mockVoucherDetail] as Partial<VoucherDetail[]>;

      mockVoucherDetailModel.findOne.mockResolvedValue(mockVoucherDetailModel);
      mockVoucherDetailModel.update.mockResolvedValue(mockVoucherDetailModel);

      const result = await repository.createOrUpdate(voucherDetails);

      expect(mockVoucherDetailModel.findOne).toHaveBeenCalledWith({
        where: {
          companyNo: 1,
          entryNo: 1001,
          entrySequence: 1,
        },
      });
      expect(mockVoucherDetailModel.update).toHaveBeenCalledWith(
        mockVoucherDetail
      );
      expect(voucherDetailMapper).toHaveBeenCalledWith(mockVoucherDetailModel);
      expect(result).toEqual([mockVoucherDetail]);
    });

    it("should handle multiple voucher details", async () => {
      const voucherDetails = [
        mockVoucherDetail,
        { ...mockVoucherDetail, entrySequence: 2, inventoryItem: "PROD002" },
      ] as Partial<VoucherDetail[]>;

      mockVoucherDetailModel.findOne
        .mockResolvedValueOnce(null) // First detail doesn't exist
        .mockResolvedValueOnce(mockVoucherDetailModel); // Second detail exists

      mockVoucherDetailModel.create.mockResolvedValue(mockVoucherDetailModel);
      mockVoucherDetailModel.update.mockResolvedValue(mockVoucherDetailModel);

      const result = await repository.createOrUpdate(voucherDetails);

      expect(mockVoucherDetailModel.findOne).toHaveBeenCalledTimes(2);
      expect(mockVoucherDetailModel.create).toHaveBeenCalledTimes(1);
      expect(mockVoucherDetailModel.update).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
    });

    it("should handle empty voucher details array", async () => {
      const result = await repository.createOrUpdate([]);

      expect(mockVoucherDetailModel.findOne).not.toHaveBeenCalled();
      expect(mockVoucherDetailModel.create).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it("should handle database errors gracefully", async () => {
      const voucherDetails = [mockVoucherDetail] as Partial<VoucherDetail[]>;
      const dbError = new Error("Database connection failed");
      mockVoucherDetailModel.findOne.mockRejectedValue(dbError);

      await expect(repository.createOrUpdate(voucherDetails)).rejects.toThrow(
        dbError
      );
    });
  });

  describe("findByEntry", () => {
    it("should return voucher details for a specific entry", async () => {
      const mockDetails = [
        SequelizeModelFactory.createMockSequelizeModel(mockVoucherDetail),
        SequelizeModelFactory.createMockSequelizeModel({
          ...mockVoucherDetail,
          entrySequence: 2,
          inventoryItem: "PROD002",
        }),
      ];

      mockVoucherDetailModel.findAll.mockResolvedValue(mockDetails);

      const result = await repository.findByEntry(1, 1001);

      expect(mockVoucherDetailModel.findAll).toHaveBeenCalledWith({
        where: {
          companyNo: 1,
          entryNo: 1001,
          isDeleted: {
            [Op.notIn]: [STATUS.DELETED, STATUS.INACTIVE],
          },
        },
        raw: true,
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockVoucherDetail);
      expect(result[1]).toEqual(mockVoucherDetail);
    });

    it("should return empty array when no details found", async () => {
      mockVoucherDetailModel.findAll.mockResolvedValue([]);

      const result = await repository.findByEntry(1, 1001);

      expect(result).toEqual([]);
    });

    it("should handle database errors gracefully", async () => {
      const dbError = new Error("Database connection failed");
      mockVoucherDetailModel.findAll.mockRejectedValue(dbError);

      await expect(repository.findByEntry(1, 1001)).rejects.toThrow(dbError);
    });
  });

  describe("softDeleteByEntry", () => {
    it("should soft delete voucher details for a specific entry", async () => {
      mockVoucherDetailModel.update.mockResolvedValue([2]);

      const result = await repository.softDeleteByEntry(1001, 1, 100);

      expect(mockVoucherDetailModel.update).toHaveBeenCalledWith(
        { isDeleted: STATUS.DELETED },
        {
          where: {
            entryNo: 1001,
            companyNo: 1,
            vendorNo: 100,
            isDeleted: {
              [Op.notIn]: [STATUS.DELETED, STATUS.INACTIVE],
            },
          },
        }
      );
      expect(result).toBe(2);
    });

    it("should return 0 when no details to delete", async () => {
      mockVoucherDetailModel.update.mockResolvedValue([0]);

      const result = await repository.softDeleteByEntry(1001, 1, 100);

      expect(result).toBe(0);
    });

    it("should handle database errors gracefully", async () => {
      const dbError = new Error("Database connection failed");
      mockVoucherDetailModel.update.mockRejectedValue(dbError);

      await expect(repository.softDeleteByEntry(1001, 1, 100)).rejects.toThrow(
        dbError
      );
    });
  });

  describe("error handling", () => {
    it("should handle invalid company number gracefully", async () => {
      const result = await repository.findByEntry(-1, 1001);
      expect(result).toEqual([]);
    });

    it("should handle invalid entry number gracefully", async () => {
      const result = await repository.findByEntry(1, -1);
      expect(result).toEqual([]);
    });
  });

  describe("performance and edge cases", () => {
    it("should handle large number of voucher details efficiently", async () => {
      const largeVoucherDetails = Array.from({ length: 1000 }, (_, i) => ({
        ...mockVoucherDetail,
        entrySequence: i + 1,
        inventoryItem: `PROD${String(i + 1).padStart(3, "0")}`,
      })) as Partial<VoucherDetail[]>;

      mockVoucherDetailModel.findOne.mockResolvedValue(null);
      mockVoucherDetailModel.create.mockResolvedValue(mockVoucherDetailModel);

      const result = await repository.createOrUpdate(largeVoucherDetails);

      expect(mockVoucherDetailModel.findOne).toHaveBeenCalledTimes(1000);
      expect(mockVoucherDetailModel.create).toHaveBeenCalledTimes(1000);
      expect(result).toHaveLength(1000);
    });

    it("should handle special characters in product codes gracefully", async () => {
      const voucherDetailWithSpecialChars = {
        ...mockVoucherDetail,
        inventoryItem: "Test@Product#123",
        lineDesc: "Product with special chars: @#$%^&*()",
      };

      mockVoucherDetailModel.findOne.mockResolvedValue(null);
      mockVoucherDetailModel.create.mockResolvedValue(mockVoucherDetailModel);

      const result = await repository.createOrUpdate([
        voucherDetailWithSpecialChars,
      ] as Partial<VoucherDetail[]>);

      expect(result).toHaveLength(1);
      expect(mockVoucherDetailModel.create).toHaveBeenCalledWith(
        voucherDetailWithSpecialChars
      );
    });
  });
});
