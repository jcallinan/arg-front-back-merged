import { Test, TestingModule } from "@nestjs/testing";
import { VoucherDetailHistoryRepository } from "./voucher-detail-history.repository";
import { VoucherDetailHistoryModel } from "../models/voucher-detail-history.model";
import { VoucherHistoryDetail } from "../../domain/entities/voucher-history.entity";
import { voucherDetailHistoryMapper } from "../mappers/voucher-detail-history.mapper";

// Mock the mapper
jest.mock("../mappers/voucher-detail-history.mapper", () => ({
  voucherDetailHistoryMapper: jest.fn().mockImplementation((data) => ({
    id: data.id || 1,
    companyNo: data.companyNo || 1,
    entryNo: data.entryNo || 1001,
    vendorNo: data.vendorNo || 1001,
    entrySequence: data.entrySequence || 0,
    status: data.status || "P",
    lineDesc: data.lineDesc || "Test Line",
    lineAmount: data.lineAmount || 100.0,
  })),
}));

// Mock the logger
jest.mock("@nestjs/common", () => ({
  ...jest.requireActual("@nestjs/common"),
}));

describe("VoucherDetailHistoryRepository", () => {
  let repository: VoucherDetailHistoryRepository;
  let mockVoucherDetailHistoryModel: jest.Mocked<
    typeof VoucherDetailHistoryModel
  >;

  const mockVoucherDetailData: (VoucherHistoryDetail | undefined)[] = [
    {
      isDeleted: "N",
      companyNo: 1,
      entryNo: 1001,
      vendorNo: 1001,
      entrySequence: 1,
      status: "P",
      lineDesc: "Test Line 1",
      lineAmount: 100.0,
    } as VoucherHistoryDetail,
    {
      isDeleted: "N",
      companyNo: 1,
      entryNo: 1001,
      vendorNo: 1001,
      entrySequence: 2,
      status: "P",
      lineDesc: "Test Line 2",
      lineAmount: 200.0,
    } as VoucherHistoryDetail,
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoucherDetailHistoryRepository,
        {
          provide: "VoucherDetailHistoryModel",
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<VoucherDetailHistoryRepository>(
      VoucherDetailHistoryRepository
    );
    mockVoucherDetailHistoryModel = module.get("VoucherDetailHistoryModel");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create voucher detail history records successfully", async () => {
      const mockCreatedRecords = mockVoucherDetailData.map((data, index) => ({
        id: index + 1,
        ...data,
      }));

      mockVoucherDetailHistoryModel.create
        .mockResolvedValueOnce(mockCreatedRecords[0] as any)
        .mockResolvedValueOnce(mockCreatedRecords[1] as any);

      const result = await repository.create(mockVoucherDetailData);

      expect(mockVoucherDetailHistoryModel.create).toHaveBeenCalledTimes(2);
      expect(mockVoucherDetailHistoryModel.create).toHaveBeenNthCalledWith(
        1,
        mockVoucherDetailData[0]
      );
      expect(mockVoucherDetailHistoryModel.create).toHaveBeenNthCalledWith(
        2,
        mockVoucherDetailData[1]
      );
      expect(voucherDetailHistoryMapper).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 1,
        companyNo: 1,
        entryNo: 1001,
        vendorNo: 1001,
        entrySequence: 1,
        status: "P",
        lineDesc: "Test Line 1",
        lineAmount: 100.0,
      });
      expect(result[1]).toEqual({
        id: 2,
        companyNo: 1,
        entryNo: 1001,
        vendorNo: 1001,
        entrySequence: 2,
        status: "P",
        lineDesc: "Test Line 2",
        lineAmount: 200.0,
      });
    });

    it("should create single voucher detail history record successfully", async () => {
      const singleDetailData = [mockVoucherDetailData[0]];
      const mockCreatedRecord = {
        id: 1,
        ...singleDetailData[0],
      };

      mockVoucherDetailHistoryModel.create.mockResolvedValue(
        mockCreatedRecord as any
      );

      const result = await repository.create(singleDetailData);

      expect(mockVoucherDetailHistoryModel.create).toHaveBeenCalledTimes(1);
      expect(mockVoucherDetailHistoryModel.create).toHaveBeenCalledWith(
        singleDetailData[0]
      );
      expect(voucherDetailHistoryMapper).toHaveBeenCalledWith(
        mockCreatedRecord
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 1,
        companyNo: 1,
        entryNo: 1001,
        vendorNo: 1001,
        entrySequence: 1,
        status: "P",
        lineDesc: "Test Line 1",
        lineAmount: 100.0,
      });
    });

    it("should throw error when companyNo is missing", async () => {
      const invalidData = [
        {
          entryNo: 1001,
          vendorNo: 1001,
          entrySequence: 1,
          status: "P",
        },
      ];

      await expect(repository.create(invalidData as any)).rejects.toThrow(
        "Missing required fields: companyNo, entryNo, or entrySequence"
      );
    });

    it("should throw error when entryNo is missing", async () => {
      const invalidData = [
        {
          companyNo: 1,
          vendorNo: 1001,
          entrySequence: 1,
          status: "P",
        },
      ];

      await expect(repository.create(invalidData as any)).rejects.toThrow(
        "Missing required fields: companyNo, entryNo, or entrySequence"
      );
    });

    it("should throw error when entrySequence is missing", async () => {
      const invalidData = [
        {
          companyNo: 1,
          entryNo: 1001,
          vendorNo: 1001,
          status: "P",
        },
      ];

      await expect(repository.create(invalidData as any)).rejects.toThrow(
        "Missing required fields: companyNo, entryNo, or entrySequence"
      );
    });

    it("should handle empty array input", async () => {
      const result = await repository.create([]);

      expect(mockVoucherDetailHistoryModel.create).not.toHaveBeenCalled();
      expect(voucherDetailHistoryMapper).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it("should handle database creation errors", async () => {
      const error = new Error("Database insert failed");
      mockVoucherDetailHistoryModel.create.mockRejectedValue(error);

      await expect(repository.create(mockVoucherDetailData)).rejects.toThrow(
        "Database insert failed"
      );
    });

    it("should handle partial failures gracefully", async () => {
      const mockCreatedRecord = {
        id: 1,
        ...mockVoucherDetailData[0],
      };

      // Mock the first call to succeed and second to fail
      mockVoucherDetailHistoryModel.create
        .mockResolvedValueOnce(mockCreatedRecord as any)
        .mockRejectedValueOnce(new Error("Second record failed"));

      // The repository should throw an error when the second record fails
      await expect(repository.create(mockVoucherDetailData)).rejects.toThrow(
        "Second record failed"
      );

      expect(mockVoucherDetailHistoryModel.create).toHaveBeenCalledTimes(2);
    });
  });
});
