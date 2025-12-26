import { Test, TestingModule } from "@nestjs/testing";
import { VoucherHeaderHistoryRepository } from "./voucher-header-history.repository";
import { VoucherHeaderHistoryModel } from "../models/voucher-header-history.model";
import { VoucherHistoryHeader } from "../../domain/entities/voucher-history.entity";
import { voucherHeaderHistoryMapper } from "../mappers/voucher-header-history.mapper";

// Mock the mapper
jest.mock("../mappers/voucher-header-history.mapper", () => ({
  voucherHeaderHistoryMapper: jest.fn().mockImplementation((data) => ({
    id: data.id || 1,
    companyNo: data.companyNo || 1,
    entryNo: data.entryNo || 1001,
    vendorNo: data.vendorNo || 1001,
    entrySequence: data.entrySequence || 0,
    status: data.status || "P",
    invoiceNo: data.invoiceNo || "INV001",
  })),
}));

// Mock the logger
jest.mock("@nestjs/common", () => ({
  ...jest.requireActual("@nestjs/common"),
}));

describe("VoucherHeaderHistoryRepository", () => {
  let repository: VoucherHeaderHistoryRepository;
  let mockVoucherHeaderHistoryModel: jest.Mocked<
    typeof VoucherHeaderHistoryModel
  >;
  let mockTransaction: any;

  const mockVoucherHeaderData: Partial<VoucherHistoryHeader> = {
    companyNo: 1,
    entryNo: 1001,
    vendorNo: 1001,
    entrySequence: 0,
    status: "P",
    invoiceNo: "INV001",
  };

  beforeEach(async () => {
    mockTransaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoucherHeaderHistoryRepository,
        {
          provide: "VoucherHeaderHistoryModel",
          useValue: {
            create: jest.fn(),
            sequelize: {
              transaction: jest.fn().mockImplementation(async (callback) => {
                return callback(mockTransaction);
              }),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<VoucherHeaderHistoryRepository>(
      VoucherHeaderHistoryRepository
    );
    mockVoucherHeaderHistoryModel = module.get("VoucherHeaderHistoryModel");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create voucher header history successfully", async () => {
      const mockCreatedRecord = {
        id: 1,
        ...mockVoucherHeaderData,
      };

      mockVoucherHeaderHistoryModel.create.mockResolvedValue(
        mockCreatedRecord as any
      );

      const result = await repository.create(mockVoucherHeaderData);

      expect(mockVoucherHeaderHistoryModel.create).toHaveBeenCalledWith(
        mockVoucherHeaderData,
        { transaction: undefined }
      );
      expect(voucherHeaderHistoryMapper).toHaveBeenCalledWith(
        mockCreatedRecord
      );
      expect(result).toEqual({
        id: 1,
        companyNo: 1,
        entryNo: 1001,
        vendorNo: 1001,
        entrySequence: 0,
        status: "P",
        invoiceNo: "INV001",
      });
    });

    it("should create voucher header history with transaction", async () => {
      const mockCreatedRecord = {
        id: 1,
        ...mockVoucherHeaderData,
      };

      mockVoucherHeaderHistoryModel.create.mockResolvedValue(
        mockCreatedRecord as any
      );

      const result = await repository.create(
        mockVoucherHeaderData,
        mockTransaction
      );

      expect(mockVoucherHeaderHistoryModel.create).toHaveBeenCalledWith(
        mockVoucherHeaderData,
        { transaction: mockTransaction }
      );
      expect(voucherHeaderHistoryMapper).toHaveBeenCalledWith(
        mockCreatedRecord
      );
      expect(result).toBeDefined();
    });

    it("should handle errors during creation", async () => {
      const error = new Error("Database insert failed");
      mockVoucherHeaderHistoryModel.create.mockRejectedValue(error);

      await expect(repository.create(mockVoucherHeaderData)).rejects.toThrow(
        "Database insert failed"
      );
    });
  });

  describe("getTransaction", () => {
    it("should return a transaction successfully", async () => {
      const result = await repository.getTransaction();

      expect(
        mockVoucherHeaderHistoryModel.sequelize.transaction
      ).toHaveBeenCalled();
      expect(result).toBe(mockTransaction);
    });
  });

  describe("startTransaction", () => {
    it("should start a transaction successfully", async () => {
      const result = await repository.startTransaction();

      expect(
        mockVoucherHeaderHistoryModel.sequelize.transaction
      ).toHaveBeenCalled();
      expect(result).toBe(mockTransaction);
    });
  });
});
