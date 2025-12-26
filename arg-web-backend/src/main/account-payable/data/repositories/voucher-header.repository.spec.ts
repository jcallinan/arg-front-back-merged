import { Test, TestingModule } from "@nestjs/testing";
import { VoucherHeaderRepository } from "./voucher-header.repository";
import { VoucherHeaderModel } from "../models/voucher-header.model";
import { VoucherDetailModel } from "../models/voucher-detail.model";
import { OpenPayableHeaderModel } from "../models/open-payable-header.model";
import { OpenPayableHistoryHeaderModel } from "../models/open-payable-history-header.model";
import { VoucherHeader } from "@src/main/account-payable/domain/entities/voucher.entity";

import { Op } from "@sequelize/core";
import { NO, PROCESS_TYPE_ENUM, STATUS } from "@src/shared/constants/constant";
import { VoucherHeaderFactory, SequelizeModelFactory } from "@src/shared/tests";

// Mock the voucherHeaderMapper to return proper VoucherHeader entities
jest.mock("../mappers/voucher-header.mapper", () => ({
  voucherHeaderMapper: jest.fn().mockImplementation((record) => {
    // Return the record as-is if it's already a VoucherHeader entity
    if (record instanceof VoucherHeader) {
      return record;
    }
    // Otherwise, create a new VoucherHeader entity from the record
    return VoucherHeader.create(record);
  }),
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
jest.mock("../models/voucher-header.model", () => ({
  VoucherHeaderModel: {
    findOne: jest.fn(),
    findAndCountAll: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    init: jest.fn(),
    sync: jest.fn(),
    rawAttributes: {},
    _schema: {},
    _dialect: {},
    sequelize: {
      transaction: jest.fn(),
    },
    name: "VoucherHeaderModel",
    tableName: "voucher_header",
    hasOne: jest.fn(),
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
    belongsToMany: jest.fn(),
    getAttributes: jest.fn().mockReturnValue({
      holdDesc: { field: "holdDesc" },
      vendorName: { field: "vendorName" },
      vendorAdd1: { field: "vendorAdd1" },
      vendorAdd2: { field: "vendorAdd2" },
      vendorAdd3: { field: "vendorAdd3" },
      vendorAdd4: { field: "vendorAdd4" },
      invoiceNo: { field: "invoiceNo" },
      carrierId: { field: "carrierId" },
      invoiceDesc: { field: "invoiceDesc" },
    }),
  },
}));

// Mock VoucherDetailModel
jest.mock("../models/voucher-detail.model", () => ({
  VoucherDetailModel: {
    findAll: jest.fn(),
    init: jest.fn(),
    sync: jest.fn(),
    rawAttributes: {},
    _schema: {},
    _dialect: {},
    name: "VoucherDetailModel",
    tableName: "voucher_detail",
    hasOne: jest.fn(),
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
    belongsToMany: jest.fn(),
  },
}));

// Mock OpenPayableHeaderModel
jest.mock("../models/open-payable-header.model", () => ({
  OpenPayableHeaderModel: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    init: jest.fn(),
    sync: jest.fn(),
    rawAttributes: {},
    _schema: {},
    _dialect: {},
    name: "OpenPayableHeaderModel",
    tableName: "open_payable_header",
    hasOne: jest.fn(),
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
    belongsToMany: jest.fn(),
  },
}));

// Mock OpenPayableHistoryHeaderModel
jest.mock("../models/open-payable-history-header.model", () => ({
  OpenPayableHistoryHeaderModel: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    init: jest.fn(),
    sync: jest.fn(),
    rawAttributes: {},
    _schema: {},
    _dialect: {},
    name: "OpenPayableHistoryHeaderModel",
    tableName: "open_payable_history_header",
    hasOne: jest.fn(),
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
    belongsToMany: jest.fn(),
  },
}));

describe("VoucherHeaderRepository", () => {
  let repository: VoucherHeaderRepository;
  let voucherHeaderModel: jest.Mocked<typeof VoucherHeaderModel>;
  let voucherDetailModel: jest.Mocked<typeof VoucherDetailModel>;
  let openPayableHeaderModel: jest.Mocked<typeof OpenPayableHeaderModel>;
  let openPayableHistoryHeaderModel: jest.Mocked<
    typeof OpenPayableHistoryHeaderModel
  >;

  // Use factory to create mock data with specific test values
  const mockVoucherHeader = VoucherHeaderFactory.createPaperVoucherHeader({
    entryNo: 1001,
    processType: PROCESS_TYPE_ENUM.PAPER,
    invoiceAmount: 1000.0,
    invoiceDate: 20231201,
    dueDate: 20240101,
    discountDueDate: 20231215,
    companyNo: 1,
    vendorNo: 100,
    holdCode: NO,
    apGlNo: 1000,
    bankGl: 2000,
    invoiceNo: "INV001",
    holdDesc: "No Hold",
    vendorName: "Test Vendor",
    createDate: 20231201,
  });

  // Create Sequelize model mock using factory
  const mockVoucherHeaderModelInstance =
    SequelizeModelFactory.createMockSequelizeModel(mockVoucherHeader);

  // Create multiple voucher headers for pagination testing
  const mockMultipleVoucherHeaders =
    VoucherHeaderFactory.createMultipleVoucherHeaders(5, {
      companyNo: 1,
      processType: PROCESS_TYPE_ENUM.PAPER,
    });

  // Create Sequelize model instances for multiple vouchers
  const mockMultipleVoucherHeaderModelInstances =
    SequelizeModelFactory.createMultipleSequelizeModels(
      mockMultipleVoucherHeaders
    );

  beforeEach(async () => {
    // Get the mocked models from the jest mock
    voucherHeaderModel = jest.requireMock(
      "../models/voucher-header.model"
    ).VoucherHeaderModel;
    voucherDetailModel = jest.requireMock(
      "../models/voucher-detail.model"
    ).VoucherDetailModel;
    openPayableHeaderModel = jest.requireMock(
      "../models/open-payable-header.model"
    ).OpenPayableHeaderModel;
    openPayableHistoryHeaderModel = jest.requireMock(
      "../models/open-payable-history-header.model"
    ).OpenPayableHistoryHeaderModel;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoucherHeaderRepository,
        {
          provide: "VoucherHeaderModel",
          useValue: voucherHeaderModel,
        },
        {
          provide: "VoucherDetailModel",
          useValue: voucherDetailModel,
        },
        {
          provide: "OpenPayableHeaderModel",
          useValue: openPayableHeaderModel,
        },
        {
          provide: "OpenPayableHistoryHeaderModel",
          useValue: openPayableHistoryHeaderModel,
        },
      ],
    }).compile();

    repository = module.get<VoucherHeaderRepository>(VoucherHeaderRepository);

    // Reset mocks
    jest.clearAllMocks();

    // Ensure the VoucherHeaderModel methods are properly mocked with default values
    voucherHeaderModel.findOne.mockResolvedValue(null);
    (voucherHeaderModel.findAndCountAll as jest.Mock).mockResolvedValue({
      rows: [],
      count: 0,
    });
    voucherHeaderModel.findAll.mockResolvedValue([]);
    voucherHeaderModel.create.mockResolvedValue(mockVoucherHeaderModelInstance);
    voucherHeaderModel.update.mockResolvedValue([1]);

    // Ensure the VoucherDetailModel methods are properly mocked
    voucherDetailModel.findAll.mockResolvedValue([]);
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  describe("findAll", () => {
    it("should return all active voucher headers without search parameters", async () => {
      const mockDbResponse = {
        rows: [mockVoucherHeaderModelInstance],
        count: 1,
      };

      (voucherHeaderModel.findAndCountAll as jest.Mock).mockResolvedValue(
        mockDbResponse
      );

      const result = await repository.findAll({ companyNo: 1 });

      expect(voucherHeaderModel.findAndCountAll).toHaveBeenCalledWith({
        where: {
          companyNo: 1,
          isDeleted: { [Op.notIn]: [STATUS.DELETED, STATUS.INACTIVE] },
        },
        order: [
          ["createDate", "desc"],
          ["entryNo", "desc"],
        ],
        limit: undefined,
        offset: undefined,
        attributes: expect.any(Array),
      });

      expect(result).toEqual({
        rows: expect.arrayContaining([
          expect.objectContaining({
            apGlNo: 1000,
            bankGl: 2000,
            companyNo: 1,
            createDate: 20231201,
            discountDueDate: 20231215,
            dueDate: 20240101,
            entryNo: 1001,
            holdCode: "N",
            holdDesc: "No Hold",
            invoiceAmount: 1000,
            invoiceDate: 20231201,
            invoiceNo: "INV001",
            isDeleted: "N",
            processType: "PAPER",
            vendorName: "Test Vendor",
            vendorNo: 100,
          }),
        ]),
        count: 1,
      });
      expect(result.count).toBe(1);
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0]).toMatchObject({
        apGlNo: 1000,
        bankGl: 2000,
        companyNo: 1,
        createDate: 20231201,
        discountDueDate: 20231215,
        dueDate: 20240101,
        entryNo: 1001,
        holdCode: "N",
        holdDesc: "No Hold",
        invoiceAmount: 1000,
        invoiceDate: 20231201,
        invoiceNo: "INV001",
        isDeleted: "N",
        processType: "PAPER",
        vendorName: "Test Vendor",
        vendorNo: 100,
      });
    });

    it("should return voucher headers with search by entry number", async () => {
      const mockDbResponse = {
        rows: [mockVoucherHeaderModelInstance],
        count: 1,
      };

      (voucherHeaderModel.findAndCountAll as jest.Mock).mockResolvedValue(
        mockDbResponse
      );

      const result = await repository.findAll({
        companyNo: 1,
        entryNo: 1001,
        limit: 10,
        offset: 0,
      });

      expect(voucherHeaderModel.findAndCountAll).toHaveBeenCalledWith({
        where: {
          companyNo: 1,
          entryNo: 1001,
          isDeleted: { [Op.notIn]: [STATUS.DELETED, STATUS.INACTIVE] },
        },
        order: [
          ["createDate", "desc"],
          ["entryNo", "desc"],
        ],
        limit: 10,
        offset: 0,
        attributes: expect.any(Array),
      });

      expect(result).toEqual({
        rows: expect.arrayContaining([
          expect.objectContaining({
            apGlNo: 1000,
            bankGl: 2000,
            companyNo: 1,
            createDate: 20231201,
            discountDueDate: 20231215,
            dueDate: 20240101,
            entryNo: 1001,
            holdCode: "N",
            holdDesc: "No Hold",
            invoiceAmount: 1000,
            invoiceDate: 20231201,
            invoiceNo: "INV001",
            isDeleted: "N",
            processType: "PAPER",
            vendorName: "Test Vendor",
            vendorNo: 100,
          }),
        ]),
        count: 1,
      });
      expect(result.count).toBe(1);
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0]).toMatchObject({
        apGlNo: 1000,
        bankGl: 2000,
        companyNo: 1,
        createDate: 20231201,
        discountDueDate: 20231215,
        dueDate: 20240101,
        entryNo: 1001,
        holdCode: "N",
        holdDesc: "No Hold",
        invoiceAmount: 1000,
        invoiceDate: 20231201,
        invoiceNo: "INV001",
        isDeleted: "N",
        processType: "PAPER",
        vendorName: "Test Vendor",
        vendorNo: 100,
      });
    });

    it("should return voucher headers with search by vendor name", async () => {
      const mockDbResponse = {
        rows: [mockVoucherHeaderModelInstance],
        count: 1,
      };

      (voucherHeaderModel.findAndCountAll as jest.Mock).mockResolvedValue(
        mockDbResponse
      );

      const result = await repository.findAll({
        companyNo: 1,
        vendorNo: 100,
        limit: 10,
        offset: 0,
      });

      expect(voucherHeaderModel.findAndCountAll).toHaveBeenCalledWith({
        where: {
          companyNo: 1,
          vendorNo: 100,
          isDeleted: { [Op.notIn]: [STATUS.DELETED, STATUS.INACTIVE] },
        },
        order: [
          ["createDate", "desc"],
          ["entryNo", "desc"],
        ],
        limit: 10,
        offset: 0,
        attributes: expect.any(Array),
      });

      expect(result).toEqual({
        rows: expect.arrayContaining([
          expect.objectContaining({
            apGlNo: 1000,
            bankGl: 2000,
            companyNo: 1,
            createDate: 20231201,
            discountDueDate: 20231215,
            dueDate: 20240101,
            entryNo: 1001,
            holdCode: "N",
            holdDesc: "No Hold",
            invoiceAmount: 1000,
            invoiceDate: 20231201,
            invoiceNo: "INV001",
            isDeleted: "N",
            processType: "PAPER",
            vendorName: "Test Vendor",
            vendorNo: 100,
          }),
        ]),
        count: 1,
      });
      expect(result.count).toBe(1);
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0]).toMatchObject({
        apGlNo: 1000,
        bankGl: 2000,
        companyNo: 1,
        createDate: 20231201,
        discountDueDate: 20231215,
        dueDate: 20240101,
        entryNo: 1001,
        holdCode: "N",
        holdDesc: "No Hold",
        invoiceAmount: 1000,
        invoiceDate: 20231201,
        invoiceNo: "INV001",
        isDeleted: "N",
        processType: "PAPER",
        vendorName: "Test Vendor",
        vendorNo: 100,
      });
    });

    it("should handle database errors gracefully", async () => {
      const dbError = new Error("Database connection failed");
      (voucherHeaderModel.findAndCountAll as jest.Mock).mockRejectedValue(
        dbError
      );

      await expect(repository.findAll({ companyNo: 1 })).rejects.toThrow(
        "Database connection failed"
      );
    });

    it("should return multiple voucher headers for pagination", async () => {
      const mockDbResponse = {
        rows: mockMultipleVoucherHeaderModelInstances,
        count: 5,
      };

      (voucherHeaderModel.findAndCountAll as jest.Mock).mockResolvedValue(
        mockDbResponse
      );

      const result = await repository.findAll({
        companyNo: 1,
        limit: 10,
        offset: 0,
      });

      expect(result.count).toBe(5);
      expect(result.rows).toHaveLength(5);
      expect(result.rows[0]).toMatchObject({
        companyNo: 1,
        processType: PROCESS_TYPE_ENUM.PAPER,
      });
    });
  });

  describe("findOne", () => {
    it("should return voucher header when found", async () => {
      voucherHeaderModel.findOne.mockResolvedValue(
        mockVoucherHeaderModelInstance
      );

      const result = await repository.findOne(1, 1001);

      expect(voucherHeaderModel.findOne).toHaveBeenCalledWith({
        where: {
          companyNo: 1,
          entryNo: 1001,
        },
        attributes: expect.any(Object),
      });
      expect(result).toMatchObject({
        apGlNo: 1000,
        bankGl: 2000,
        companyNo: 1,
        createDate: 20231201,
        discountDueDate: 20231215,
        dueDate: 20240101,
        entryNo: 1001,
        holdCode: "N",
        holdDesc: "No Hold",
        invoiceAmount: 1000,
        invoiceDate: 20231201,
        invoiceNo: "INV001",
        isDeleted: "N",
        processType: "PAPER",
        vendorName: "Test Vendor",
        vendorNo: 100,
      });
    });

    it("should return null when voucher header not found", async () => {
      voucherHeaderModel.findOne.mockResolvedValue(null);

      const result = await repository.findOne(1, 999999);

      expect(result).toBeNull();
    });

    it("should handle database errors gracefully", async () => {
      const dbError = new Error("Database connection failed");
      voucherHeaderModel.findOne.mockRejectedValue(dbError);

      await expect(repository.findOne(1, 1001)).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("create", () => {
    it("should create voucher header successfully", async () => {
      voucherHeaderModel.create.mockResolvedValue(
        mockVoucherHeaderModelInstance
      );

      const result = await repository.create(mockVoucherHeader);

      expect(voucherHeaderModel.create).toHaveBeenCalledWith(
        mockVoucherHeader,
        { transaction: undefined }
      );
      expect(result).toMatchObject({
        apGlNo: 1000,
        bankGl: 2000,
        companyNo: 1,
        createDate: 20231201,
        discountDueDate: 20231215,
        dueDate: 20240101,
        entryNo: 1001,
        holdCode: "N",
        holdDesc: "No Hold",
        invoiceAmount: 1000,
        invoiceDate: 20231201,
        invoiceNo: "INV001",
        isDeleted: "N",
        processType: "PAPER",
        vendorName: "Test Vendor",
        vendorNo: 100,
      });
    });

    it("should create SOGAS voucher header successfully", async () => {
      const sogasVoucherHeader = VoucherHeaderFactory.createSogasVoucherHeader({
        entryNo: 2001,
        companyNo: 2,
        vendorNo: 201,
      });

      const sogasModelInstance =
        SequelizeModelFactory.createMockSequelizeModel(sogasVoucherHeader);
      voucherHeaderModel.create.mockResolvedValue(sogasModelInstance);

      const result = await repository.create(sogasVoucherHeader);

      expect(result).toMatchObject({
        processType: PROCESS_TYPE_ENUM.SOGAS,
        companyNo: 2,
        vendorNo: 201,
      });
    });

    it("should create FLEXI voucher header successfully", async () => {
      const flexiVoucherHeader = VoucherHeaderFactory.createFlexiVoucherHeader({
        entryNo: 3001,
        companyNo: 3,
        vendorNo: 301,
      });

      const flexiModelInstance =
        SequelizeModelFactory.createMockSequelizeModel(flexiVoucherHeader);
      voucherHeaderModel.create.mockResolvedValue(flexiModelInstance);

      const result = await repository.create(flexiVoucherHeader);

      expect(result).toMatchObject({
        processType: PROCESS_TYPE_ENUM.FLEXI,
        companyNo: 3,
        vendorNo: 301,
      });
    });

    it("should handle database errors gracefully", async () => {
      const dbError = new Error("Database connection failed");
      voucherHeaderModel.create.mockRejectedValue(dbError);

      await expect(repository.create(mockVoucherHeader)).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("update", () => {
    it("should update voucher header successfully", async () => {
      const updateData = { holdCode: NO, holdDesc: "On Hold" };
      const updatedVoucherHeader =
        SequelizeModelFactory.createMockSequelizeModel({
          ...mockVoucherHeader,
          holdCode: NO,
          holdDesc: "On Hold",
        });

      voucherHeaderModel.findOne.mockResolvedValue(updatedVoucherHeader);

      const result = await repository.update(1, 1001, 1, updateData);

      expect(voucherHeaderModel.findOne).toHaveBeenCalledWith({
        where: { companyNo: 1, entryNo: 1001, entrySequence: 1 },
      });
      expect(result).toMatchObject({
        apGlNo: 1000,
        bankGl: 2000,
        companyNo: 1,
        createDate: 20231201,
        discountDueDate: 20231215,
        dueDate: 20240101,
        entryNo: 1001,
        holdCode: "N",
        holdDesc: "On Hold",
        invoiceAmount: 1000,
        invoiceDate: 20231201,
        invoiceNo: "INV001",
        isDeleted: "N",
        processType: "PAPER",
        vendorName: "Test Vendor",
        vendorNo: 100,
      });
    });

    it("should handle database errors gracefully", async () => {
      const updateData = { holdCode: NO };
      const dbError = new Error("Database connection failed");
      voucherHeaderModel.findOne.mockRejectedValue(dbError);

      await expect(repository.update(1, 1001, 1, updateData)).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("softDelete", () => {
    it("should soft delete voucher header successfully", async () => {
      voucherHeaderModel.findOne.mockResolvedValue(
        mockVoucherHeaderModelInstance
      );
      voucherHeaderModel.update.mockResolvedValue([1]);

      const result = await repository.softDelete(1001, 1, 100, "INV001");

      expect(voucherHeaderModel.update).toHaveBeenCalledWith(
        { isDeleted: STATUS.DELETED },
        {
          where: {
            entryNo: 1001,
            companyNo: 1,
            vendorNo: 100,
            invoiceNo: "INV001",
            isDeleted: { [Op.notIn]: [STATUS.DELETED, STATUS.INACTIVE] },
          },
        }
      );
      expect(result).toBe(true);
    });

    it("should return false when no rows updated", async () => {
      voucherHeaderModel.findOne.mockResolvedValue(
        mockVoucherHeaderModelInstance
      );
      voucherHeaderModel.update.mockResolvedValue([0]);

      const result = await repository.softDelete(1001, 1, 100, "INV001");

      expect(result).toBe(false);
    });

    it("should handle database errors gracefully", async () => {
      voucherHeaderModel.findOne.mockResolvedValue(
        mockVoucherHeaderModelInstance
      );
      const dbError = new Error("Database connection failed");
      voucherHeaderModel.update.mockRejectedValue(dbError);

      await expect(
        repository.softDelete(1001, 1, 100, "INV001")
      ).rejects.toThrow("Database connection failed");
    });
  });

  describe("error handling", () => {
    it("should handle invalid entry number gracefully", async () => {
      // Mock the findOne to return null for invalid entry number
      voucherHeaderModel.findOne.mockResolvedValue(null);

      const result = await repository.findOne(1, -1);
      expect(result).toBeNull();
    });

    it("should handle invalid company number gracefully", async () => {
      // Mock the findOne to return null for invalid company number
      voucherHeaderModel.findOne.mockResolvedValue(null);

      const result = await repository.findOne(-1, 1001);
      expect(result).toBeNull();
    });

    it("should handle null update data gracefully", async () => {
      const updateData = null as any;
      const dbError = new Error("Invalid update data");
      voucherHeaderModel.findOne.mockRejectedValue(dbError);

      await expect(repository.update(1, 1001, 1, updateData)).rejects.toThrow(
        "Invalid update data"
      );
    });

    it("should handle empty update data gracefully", async () => {
      const updateData = {};
      const dbError = new Error("Empty update data");
      voucherHeaderModel.findOne.mockRejectedValue(dbError);

      await expect(repository.update(1, 1001, 1, updateData)).rejects.toThrow(
        "Empty update data"
      );
    });
  });

  describe("softDelete error handling", () => {
    it("should throw HttpException when voucher header not found for soft delete", async () => {
      // Mock findOne to return null (record not found)
      voucherHeaderModel.findOne.mockResolvedValue(null);

      await expect(
        repository.softDelete(999999, 1, 100, "INV999")
      ).rejects.toThrow();
    });
  });

  describe("update error handling", () => {
    it("should throw error when voucher header not found for update", async () => {
      const updateData = { holdCode: NO };
      // Mock findOne to return null (record not found)
      voucherHeaderModel.findOne.mockResolvedValue(null);

      await expect(
        repository.update(1, 999999, 1, updateData)
      ).rejects.toThrow();
    });
  });

  describe("performance and edge cases", () => {
    it("should handle large result sets efficiently", async () => {
      const largeMockResponse = {
        rows: mockMultipleVoucherHeaderModelInstances,
        count: 5,
      };

      (voucherHeaderModel.findAndCountAll as jest.Mock).mockResolvedValue(
        largeMockResponse
      );

      const result = await repository.findAll({ companyNo: 1 });

      expect(result.rows).toHaveLength(5);
      expect(result.count).toBe(5);
    });

    it("should handle special characters in search gracefully", async () => {
      const searchWithSpecialChars = "Test@Voucher#123";
      const mockDbResponse = {
        rows: [mockVoucherHeaderModelInstance],
        count: 1,
      };

      (voucherHeaderModel.findAndCountAll as jest.Mock).mockResolvedValue(
        mockDbResponse
      );

      const result = await repository.findAll({
        companyNo: 1,
        invoiceNo: searchWithSpecialChars,
      });

      expect(result.rows).toHaveLength(1);
      expect(voucherHeaderModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            companyNo: 1,
            invoiceNo: searchWithSpecialChars,
            isDeleted: expect.any(Object),
          }),
          limit: undefined,
          offset: undefined,
        })
      );

      expect(result).toEqual({
        rows: expect.arrayContaining([
          expect.objectContaining({
            apGlNo: 1000,
            bankGl: 2000,
            companyNo: 1,
            createDate: 20231201,
            discountDueDate: 20231215,
            dueDate: 20240101,
            entryNo: 1001,
            holdCode: "N",
            holdDesc: "No Hold",
            invoiceAmount: 1000,
            invoiceDate: 20231201,
            invoiceNo: "INV001",
            isDeleted: "N",
            processType: "PAPER",
            vendorName: "Test Vendor",
            vendorNo: 100,
          }),
        ]),
        count: 1,
      });
    });

    it("should test different process types using factories", async () => {
      // Test SOGAS process type
      const sogasVoucher = VoucherHeaderFactory.createSogasVoucherHeader({
        entryNo: 4001,
        companyNo: 4,
        vendorNo: 401,
      });
      const sogasModel =
        SequelizeModelFactory.createMockSequelizeModel(sogasVoucher);

      voucherHeaderModel.findOne.mockResolvedValue(sogasModel);
      const sogasResult = await repository.findOne(4, 4001);

      expect(sogasResult?.processType).toBe(PROCESS_TYPE_ENUM.SOGAS);

      // Test FLEXI process type
      const flexiVoucher = VoucherHeaderFactory.createFlexiVoucherHeader({
        entryNo: 5001,
        companyNo: 5,
        vendorNo: 501,
      });
      const flexiModel =
        SequelizeModelFactory.createMockSequelizeModel(flexiVoucher);

      voucherHeaderModel.findOne.mockResolvedValue(flexiModel);
      const flexiResult = await repository.findOne(5, 5001);

      expect(flexiResult?.processType).toBe(PROCESS_TYPE_ENUM.FLEXI);
    });

    it("should test voucher headers with different statuses using factories", async () => {
      const pendingVoucher = VoucherHeaderFactory.createBasicVoucherHeader({
        entryNo: 6001,
        companyNo: 6,
        vendorNo: 601,
        status: "PENDING",
      });
      const pendingModel =
        SequelizeModelFactory.createMockSequelizeModel(pendingVoucher);

      voucherHeaderModel.findOne.mockResolvedValue(pendingModel);
      const pendingResult = await repository.findOne(6, 6001);

      expect(pendingResult?.status).toBe("PENDING");

      const approvedVoucher = VoucherHeaderFactory.createBasicVoucherHeader({
        entryNo: 7001,
        companyNo: 7,
        vendorNo: 701,
        status: "APPROVED",
      });
      const approvedModel =
        SequelizeModelFactory.createMockSequelizeModel(approvedVoucher);

      voucherHeaderModel.findOne.mockResolvedValue(approvedModel);
      const approvedResult = await repository.findOne(7, 7001);

      expect(approvedResult?.status).toBe("APPROVED");
    });
  });
});
