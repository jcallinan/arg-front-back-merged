import { Test, TestingModule } from "@nestjs/testing";
import { TransferVoucherUseCase } from "./transfer-voucher.usecase";
import { VoucherMaintenanceInterface } from "@src/main/account-payable/domain/interface/voucher-maintenance.interface";
import {
  TransferVoucherDto,
  TransferVoucherResponseDto,
} from "../../dto/voucher-maintenance.dto";

describe("TransferVoucherUseCase", () => {
  let useCase: TransferVoucherUseCase;
  let mockVoucherMaintenanceRepository: jest.Mocked<VoucherMaintenanceInterface>;

  beforeEach(async () => {
    mockVoucherMaintenanceRepository = {
      transferVoucher: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransferVoucherUseCase,
        {
          provide: "VoucherMaintenanceInterface",
          useValue: mockVoucherMaintenanceRepository,
        },
      ],
    }).compile();

    useCase = module.get<TransferVoucherUseCase>(TransferVoucherUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    const mockInput: TransferVoucherDto = {
      voucherType: "APTRANH" as any,
      companyNo: 10,
      vendorNo: 1100,
      voucherNo: 12345,
    };

    const mockTransferResult = {
      companyNo: 10,
      vendorNo: 1100,
      voucherNo: 12345,
      sourceTable: "APTRANH",
      targetTable: "APTRAND",
      transferredAt: "2024-01-15T10:00:00Z",
      headerRecordId: 1,
      detailRecordIds: [1, 2, 3],
    };

    const expectedResponse: TransferVoucherResponseDto = {
      message: "Voucher transferred successfully to APTRANH/APTRAND",
      voucher: {
        companyNo: 10,
        vendorNo: 1100,
        voucherNo: 12345,
        voucherType: "APTRANH" as any,
        sourceTable: "APTRANH",
        targetTable: "APTRAND",
        transferredAt: "2024-01-15T10:00:00Z",
        headerRecordId: 1,
        detailRecordIds: [1, 2, 3],
      },
    };

    it("should execute successfully and transfer voucher", async () => {
      mockVoucherMaintenanceRepository.transferVoucher.mockResolvedValue(
        mockTransferResult
      );

      const result = await useCase.execute(mockInput);

      expect(
        mockVoucherMaintenanceRepository.transferVoucher
      ).toHaveBeenCalledWith("APTRANH", 10, 1100, 12345);
      expect(result).toEqual(expectedResponse);
    });

    it("should execute successfully with different voucher type", async () => {
      const differentInput: TransferVoucherDto = {
        voucherType: "APTRAND" as any,
        companyNo: 20,
        vendorNo: 2200,
        voucherNo: 67890,
      };

      const differentTransferResult = {
        companyNo: 20,
        vendorNo: 2200,
        voucherNo: 67890,
        sourceTable: "APTRAND",
        targetTable: "APTRANH",
        transferredAt: "2024-01-16T11:00:00Z",
        headerRecordId: 2,
        detailRecordIds: [4, 5, 6],
      };

      const expectedDifferentResponse: TransferVoucherResponseDto = {
        message: "Voucher transferred successfully to APTRANH/APTRAND",
        voucher: {
          companyNo: 20,
          vendorNo: 2200,
          voucherNo: 67890,
          voucherType: "APTRAND" as any,
          sourceTable: "APTRAND",
          targetTable: "APTRANH",
          transferredAt: "2024-01-16T11:00:00Z",
          headerRecordId: 2,
          detailRecordIds: [4, 5, 6],
        },
      };

      mockVoucherMaintenanceRepository.transferVoucher.mockResolvedValue(
        differentTransferResult
      );

      const result = await useCase.execute(differentInput);

      expect(
        mockVoucherMaintenanceRepository.transferVoucher
      ).toHaveBeenCalledWith("APTRAND", 20, 2200, 67890);
      expect(result).toEqual(expectedDifferentResponse);
    });

    it("should throw error when transfer result is null", async () => {
      mockVoucherMaintenanceRepository.transferVoucher.mockResolvedValue(null);

      await expect(useCase.execute(mockInput)).rejects.toThrow(
        "Voucher not found or transfer failed: companyNo=10, vendorNo=1100, voucherNo=12345"
      );

      expect(
        mockVoucherMaintenanceRepository.transferVoucher
      ).toHaveBeenCalledWith("APTRANH", 10, 1100, 12345);
    });

    it("should throw error when transfer result is undefined", async () => {
      mockVoucherMaintenanceRepository.transferVoucher.mockResolvedValue(
        undefined as any
      );

      await expect(useCase.execute(mockInput)).rejects.toThrow(
        "Voucher not found or transfer failed: companyNo=10, vendorNo=1100, voucherNo=12345"
      );

      expect(
        mockVoucherMaintenanceRepository.transferVoucher
      ).toHaveBeenCalledWith("APTRANH", 10, 1100, 12345);
    });

    it("should handle error from repository", async () => {
      const error = new Error("Database connection failed");
      mockVoucherMaintenanceRepository.transferVoucher.mockRejectedValue(error);

      await expect(useCase.execute(mockInput)).rejects.toThrow(error);
      expect(
        mockVoucherMaintenanceRepository.transferVoucher
      ).toHaveBeenCalledWith("APTRANH", 10, 1100, 12345);
    });

    it("should handle repository error with custom message", async () => {
      const customError = new Error("Voucher already transferred");
      mockVoucherMaintenanceRepository.transferVoucher.mockRejectedValue(
        customError
      );

      await expect(useCase.execute(mockInput)).rejects.toThrow(customError);
      expect(
        mockVoucherMaintenanceRepository.transferVoucher
      ).toHaveBeenCalledWith("APTRANH", 10, 1100, 12345);
    });

    it("should execute successfully with minimal voucher data", async () => {
      const minimalInput: TransferVoucherDto = {
        voucherType: "APTRANH" as any,
        companyNo: 1,
        vendorNo: 100,
        voucherNo: 1,
      };

      const minimalTransferResult = {
        companyNo: 1,
        vendorNo: 100,
        voucherNo: 1,
        sourceTable: "APTRANH",
        targetTable: "APTRAND",
        transferredAt: "2024-01-01T00:00:00Z",
        headerRecordId: 1,
        detailRecordIds: [],
      };

      const expectedMinimalResponse: TransferVoucherResponseDto = {
        message: "Voucher transferred successfully to APTRANH/APTRAND",
        voucher: {
          companyNo: 1,
          vendorNo: 100,
          voucherNo: 1,
          voucherType: "APTRANH" as any,
          sourceTable: "APTRANH",
          targetTable: "APTRAND",
          transferredAt: "2024-01-01T00:00:00Z",
          headerRecordId: 1,
          detailRecordIds: [],
        },
      };

      mockVoucherMaintenanceRepository.transferVoucher.mockResolvedValue(
        minimalTransferResult
      );

      const result = await useCase.execute(minimalInput);

      expect(
        mockVoucherMaintenanceRepository.transferVoucher
      ).toHaveBeenCalledWith("APTRANH", 1, 100, 1);
      expect(result).toEqual(expectedMinimalResponse);
    });

    it("should execute successfully with large voucher numbers", async () => {
      const largeInput: TransferVoucherDto = {
        voucherType: "APTRAND" as any,
        companyNo: 999,
        vendorNo: 99999,
        voucherNo: 999999,
      };

      const largeTransferResult = {
        companyNo: 999,
        vendorNo: 99999,
        voucherNo: 999999,
        sourceTable: "APTRAND",
        targetTable: "APTRANH",
        transferredAt: "2024-12-31T23:59:59Z",
        headerRecordId: 999999,
        detailRecordIds: [999998, 999999, 1000000],
      };

      const expectedLargeResponse: TransferVoucherResponseDto = {
        message: "Voucher transferred successfully to APTRANH/APTRAND",
        voucher: {
          companyNo: 999,
          vendorNo: 99999,
          voucherNo: 999999,
          voucherType: "APTRAND" as any,
          sourceTable: "APTRAND",
          targetTable: "APTRANH",
          transferredAt: "2024-12-31T23:59:59Z",
          headerRecordId: 999999,
          detailRecordIds: [999998, 999999, 1000000],
        },
      };

      mockVoucherMaintenanceRepository.transferVoucher.mockResolvedValue(
        largeTransferResult
      );

      const result = await useCase.execute(largeInput);

      expect(
        mockVoucherMaintenanceRepository.transferVoucher
      ).toHaveBeenCalledWith("APTRAND", 999, 99999, 999999);
      expect(result).toEqual(expectedLargeResponse);
    });
  });
});
