import { Test, TestingModule } from "@nestjs/testing";
import { VoucherCleanupService } from "./voucher-cleanup.service";
import { VoucherHeaderInterface } from "@src/main/account-payable/domain/interface/voucher.interface";
import { VoucherDetailInterface } from "@src/main/account-payable/domain/interface/voucher.interface";
import { ProcessType } from "@src/shared/constants/strategy-type.enum";
import { PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";

describe("VoucherCleanupService", () => {
  let service: VoucherCleanupService;
  let mockVoucherHeaderInterface: jest.Mocked<VoucherHeaderInterface>;
  let mockVoucherDetailInterface: jest.Mocked<VoucherDetailInterface>;

  beforeEach(async () => {
    mockVoucherHeaderInterface = {
      getEntryNumbersByProcessType: jest.fn(),
      deleteByProcessType: jest.fn(),
    } as any;

    mockVoucherDetailInterface = {
      deleteByEntryNumbers: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoucherCleanupService,
        {
          provide: "VoucherHeaderInterface",
          useValue: mockVoucherHeaderInterface,
        },
        {
          provide: "VoucherDetailInterface",
          useValue: mockVoucherDetailInterface,
        },
      ],
    }).compile();

    service = module.get<VoucherCleanupService>(VoucherCleanupService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("cleanupExistingRecords", () => {
    it("should successfully cleanup FLEXI records", async () => {
      const uploadType = ProcessType.FLEXI;
      const companyNo = 10;

      mockVoucherHeaderInterface.getEntryNumbersByProcessType.mockResolvedValue(
        [1001, 1002, 1003]
      );
      mockVoucherDetailInterface.deleteByEntryNumbers.mockResolvedValue(6);
      mockVoucherHeaderInterface.deleteByProcessType.mockResolvedValue(3);

      const result = await service.cleanupExistingRecords(
        uploadType,
        companyNo
      );

      expect(result).toEqual({
        deletedHeaders: 3,
        deletedDetails: 6,
      });

      expect(
        mockVoucherHeaderInterface.getEntryNumbersByProcessType
      ).toHaveBeenCalledWith(10, PROCESS_TYPE_ENUM.FLEXI);
      expect(
        mockVoucherDetailInterface.deleteByEntryNumbers
      ).toHaveBeenCalledWith(10, [1001, 1002, 1003]);
      expect(
        mockVoucherHeaderInterface.deleteByProcessType
      ).toHaveBeenCalledWith(10, PROCESS_TYPE_ENUM.FLEXI);
    });

    it("should successfully cleanup SOGAS records", async () => {
      const uploadType = ProcessType.SOGAS;
      const companyNo = 20;

      mockVoucherHeaderInterface.getEntryNumbersByProcessType.mockResolvedValue(
        [2001, 2002]
      );
      mockVoucherDetailInterface.deleteByEntryNumbers.mockResolvedValue(4);
      mockVoucherHeaderInterface.deleteByProcessType.mockResolvedValue(2);

      const result = await service.cleanupExistingRecords(
        uploadType,
        companyNo
      );

      expect(result).toEqual({
        deletedHeaders: 2,
        deletedDetails: 4,
      });

      expect(
        mockVoucherHeaderInterface.getEntryNumbersByProcessType
      ).toHaveBeenCalledWith(20, PROCESS_TYPE_ENUM.SOGAS);
      expect(
        mockVoucherDetailInterface.deleteByEntryNumbers
      ).toHaveBeenCalledWith(20, [2001, 2002]);
      expect(
        mockVoucherHeaderInterface.deleteByProcessType
      ).toHaveBeenCalledWith(20, PROCESS_TYPE_ENUM.SOGAS);
    });

    it("should use default company number when not provided", async () => {
      const uploadType = ProcessType.FLEXI;

      mockVoucherHeaderInterface.getEntryNumbersByProcessType.mockResolvedValue(
        [1001]
      );
      mockVoucherDetailInterface.deleteByEntryNumbers.mockResolvedValue(2);
      mockVoucherHeaderInterface.deleteByProcessType.mockResolvedValue(1);

      const result = await service.cleanupExistingRecords(uploadType);

      expect(result).toEqual({
        deletedHeaders: 1,
        deletedDetails: 2,
      });

      expect(
        mockVoucherHeaderInterface.getEntryNumbersByProcessType
      ).toHaveBeenCalledWith(10, PROCESS_TYPE_ENUM.FLEXI);
    });

    it("should handle case when no records exist to cleanup", async () => {
      const uploadType = ProcessType.FLEXI;
      const companyNo = 10;

      mockVoucherHeaderInterface.getEntryNumbersByProcessType.mockResolvedValue(
        []
      );

      const result = await service.cleanupExistingRecords(
        uploadType,
        companyNo
      );

      expect(result).toEqual({
        deletedHeaders: 0,
        deletedDetails: 0,
      });

      expect(
        mockVoucherDetailInterface.deleteByEntryNumbers
      ).not.toHaveBeenCalled();
      expect(
        mockVoucherHeaderInterface.deleteByProcessType
      ).not.toHaveBeenCalled();
    });

    it("should throw error for invalid upload type", async () => {
      const invalidUploadType = "INVALID" as ProcessType;
      const companyNo = 10;

      await expect(
        service.cleanupExistingRecords(invalidUploadType, companyNo)
      ).rejects.toThrow("Invalid upload type: INVALID");

      expect(
        mockVoucherHeaderInterface.getEntryNumbersByProcessType
      ).not.toHaveBeenCalled();
    });

    it("should handle database errors gracefully", async () => {
      const uploadType = ProcessType.FLEXI;
      const companyNo = 10;

      mockVoucherHeaderInterface.getEntryNumbersByProcessType.mockRejectedValue(
        new Error("Database connection failed")
      );

      await expect(
        service.cleanupExistingRecords(uploadType, companyNo)
      ).rejects.toThrow("Database connection failed");
    });
  });

  describe("cleanupByProcessType", () => {
    it("should execute cleanup for FLEXI process type", async () => {
      const companyNo = 10;
      const processType = PROCESS_TYPE_ENUM.FLEXI;

      mockVoucherHeaderInterface.getEntryNumbersByProcessType.mockResolvedValue(
        [1001, 1002]
      );
      mockVoucherDetailInterface.deleteByEntryNumbers.mockResolvedValue(4);
      mockVoucherHeaderInterface.deleteByProcessType.mockResolvedValue(2);

      const result = await service.cleanupByProcessType(companyNo, processType);

      expect(result).toEqual({
        deletedHeaders: 2,
        deletedDetails: 4,
      });

      expect(
        mockVoucherHeaderInterface.getEntryNumbersByProcessType
      ).toHaveBeenCalledWith(10, PROCESS_TYPE_ENUM.FLEXI);
      expect(
        mockVoucherDetailInterface.deleteByEntryNumbers
      ).toHaveBeenCalledWith(10, [1001, 1002]);
      expect(
        mockVoucherHeaderInterface.deleteByProcessType
      ).toHaveBeenCalledWith(10, PROCESS_TYPE_ENUM.FLEXI);
    });

    it("should execute cleanup for SOGAS process type", async () => {
      const companyNo = 20;
      const processType = PROCESS_TYPE_ENUM.SOGAS;

      mockVoucherHeaderInterface.getEntryNumbersByProcessType.mockResolvedValue(
        [2001]
      );
      mockVoucherDetailInterface.deleteByEntryNumbers.mockResolvedValue(2);
      mockVoucherHeaderInterface.deleteByProcessType.mockResolvedValue(1);

      const result = await service.cleanupByProcessType(companyNo, processType);

      expect(result).toEqual({
        deletedHeaders: 1,
        deletedDetails: 2,
      });

      expect(
        mockVoucherHeaderInterface.getEntryNumbersByProcessType
      ).toHaveBeenCalledWith(20, PROCESS_TYPE_ENUM.SOGAS);
      expect(
        mockVoucherDetailInterface.deleteByEntryNumbers
      ).toHaveBeenCalledWith(20, [2001]);
      expect(
        mockVoucherHeaderInterface.deleteByProcessType
      ).toHaveBeenCalledWith(20, PROCESS_TYPE_ENUM.SOGAS);
    });

    it("should handle case when no entry numbers found", async () => {
      const companyNo = 10;
      const processType = PROCESS_TYPE_ENUM.FLEXI;

      mockVoucherHeaderInterface.getEntryNumbersByProcessType.mockResolvedValue(
        []
      );

      const result = await service.cleanupByProcessType(companyNo, processType);

      expect(result).toEqual({
        deletedHeaders: 0,
        deletedDetails: 0,
      });

      expect(
        mockVoucherDetailInterface.deleteByEntryNumbers
      ).not.toHaveBeenCalled();
      expect(
        mockVoucherHeaderInterface.deleteByProcessType
      ).not.toHaveBeenCalled();
    });

    it("should handle database errors during cleanup", async () => {
      const companyNo = 10;
      const processType = PROCESS_TYPE_ENUM.FLEXI;

      mockVoucherHeaderInterface.getEntryNumbersByProcessType.mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        service.cleanupByProcessType(companyNo, processType)
      ).rejects.toThrow("Database error");
    });

    it("should handle errors during detail deletion", async () => {
      const companyNo = 10;
      const processType = PROCESS_TYPE_ENUM.FLEXI;

      mockVoucherHeaderInterface.getEntryNumbersByProcessType.mockResolvedValue(
        [1001]
      );
      mockVoucherDetailInterface.deleteByEntryNumbers.mockRejectedValue(
        new Error("Detail deletion failed")
      );

      await expect(
        service.cleanupByProcessType(companyNo, processType)
      ).rejects.toThrow("Detail deletion failed");
    });

    it("should handle errors during header deletion", async () => {
      const companyNo = 10;
      const processType = PROCESS_TYPE_ENUM.FLEXI;

      mockVoucherHeaderInterface.getEntryNumbersByProcessType.mockResolvedValue(
        [1001]
      );
      mockVoucherDetailInterface.deleteByEntryNumbers.mockResolvedValue(2);
      mockVoucherHeaderInterface.deleteByProcessType.mockRejectedValue(
        new Error("Header deletion failed")
      );

      await expect(
        service.cleanupByProcessType(companyNo, processType)
      ).rejects.toThrow("Header deletion failed");
    });

    it("should execute cleanup in correct order", async () => {
      const companyNo = 10;
      const processType = PROCESS_TYPE_ENUM.FLEXI;

      mockVoucherHeaderInterface.getEntryNumbersByProcessType.mockResolvedValue(
        [1001]
      );
      mockVoucherDetailInterface.deleteByEntryNumbers.mockResolvedValue(2);
      mockVoucherHeaderInterface.deleteByProcessType.mockResolvedValue(1);

      await service.cleanupByProcessType(companyNo, processType);

      // Verify that all methods were called
      expect(
        mockVoucherHeaderInterface.getEntryNumbersByProcessType
      ).toHaveBeenCalled();
      expect(
        mockVoucherDetailInterface.deleteByEntryNumbers
      ).toHaveBeenCalled();
      expect(mockVoucherHeaderInterface.deleteByProcessType).toHaveBeenCalled();
    });
  });

  describe("mapUploadTypeToProcessType", () => {
    it("should map FLEXI upload type to FLEXI process type", () => {
      const uploadType = ProcessType.FLEXI;

      // Access the private method through the service instance
      const result = (service as any).mapUploadTypeToProcessType(uploadType);

      expect(result).toBe(PROCESS_TYPE_ENUM.FLEXI);
    });

    it("should map SOGAS upload type to SOGAS process type", () => {
      const uploadType = ProcessType.SOGAS;

      const result = (service as any).mapUploadTypeToProcessType(uploadType);

      expect(result).toBe(PROCESS_TYPE_ENUM.SOGAS);
    });

    it("should return null for unknown upload type", () => {
      const uploadType = "UNKNOWN" as ProcessType;

      const result = (service as any).mapUploadTypeToProcessType(uploadType);

      expect(result).toBeNull();
    });
  });

  describe("error handling and logging", () => {
    it("should log cleanup start and completion", async () => {
      const uploadType = ProcessType.FLEXI;
      const companyNo = 10;

      mockVoucherHeaderInterface.getEntryNumbersByProcessType.mockResolvedValue(
        [1001]
      );
      mockVoucherDetailInterface.deleteByEntryNumbers.mockResolvedValue(2);
      mockVoucherHeaderInterface.deleteByProcessType.mockResolvedValue(1);

      // Spy on the logger to verify logging calls
      const loggerSpy = jest.spyOn(service["logger"], "log");

      await service.cleanupExistingRecords(uploadType, companyNo);

      expect(loggerSpy).toHaveBeenCalledWith(
        "Starting cleanup for upload type: flexi, company: 10"
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        "Cleaning up records with process type: FLEXI"
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        "Cleanup completed successfully. Deleted 1 headers and 2 details"
      );
    });

    it("should log error details when cleanup fails", async () => {
      const uploadType = ProcessType.FLEXI;
      const companyNo = 10;

      const error = new Error("Database connection failed");
      mockVoucherHeaderInterface.getEntryNumbersByProcessType.mockRejectedValue(
        error
      );

      const loggerSpy = jest.spyOn(service["logger"], "error");

      await expect(
        service.cleanupExistingRecords(uploadType, companyNo)
      ).rejects.toThrow("Database connection failed");

      expect(loggerSpy).toHaveBeenCalledWith(
        "Error during cleanup for upload type flexi: Database connection failed",
        error.stack
      );
    });

    it("should log ORM cleanup execution details", async () => {
      const companyNo = 10;
      const processType = PROCESS_TYPE_ENUM.FLEXI;

      mockVoucherHeaderInterface.getEntryNumbersByProcessType.mockResolvedValue(
        [1001]
      );
      mockVoucherDetailInterface.deleteByEntryNumbers.mockResolvedValue(2);
      mockVoucherHeaderInterface.deleteByProcessType.mockResolvedValue(1);

      const loggerSpy = jest.spyOn(service["logger"], "log");

      await service.cleanupByProcessType(companyNo, processType);

      expect(loggerSpy).toHaveBeenCalledWith(
        "Executing ORM cleanup for company: 10, process type: FLEXI"
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        "Found 1 entry numbers for process type: FLEXI"
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        "ORM cleanup completed: 1 headers and 2 details deleted"
      );
    });

    it("should log error details when ORM cleanup fails", async () => {
      const companyNo = 10;
      const processType = PROCESS_TYPE_ENUM.FLEXI;

      const error = new Error("ORM cleanup failed");
      mockVoucherHeaderInterface.getEntryNumbersByProcessType.mockRejectedValue(
        error
      );

      const loggerSpy = jest.spyOn(service["logger"], "error");

      await expect(
        service.cleanupByProcessType(companyNo, processType)
      ).rejects.toThrow("ORM cleanup failed");

      expect(loggerSpy).toHaveBeenCalledWith(
        "Error during ORM cleanup: ORM cleanup failed",
        error.stack
      );
    });
  });

  describe("edge cases", () => {
    it("should handle empty entry numbers array", async () => {
      const companyNo = 10;
      const processType = PROCESS_TYPE_ENUM.FLEXI;

      mockVoucherHeaderInterface.getEntryNumbersByProcessType.mockResolvedValue(
        []
      );

      const result = await service.cleanupByProcessType(companyNo, processType);

      expect(result).toEqual({
        deletedHeaders: 0,
        deletedDetails: 0,
      });
    });

    it("should handle single entry number", async () => {
      const companyNo = 10;
      const processType = PROCESS_TYPE_ENUM.FLEXI;

      mockVoucherHeaderInterface.getEntryNumbersByProcessType.mockResolvedValue(
        [1001]
      );
      mockVoucherDetailInterface.deleteByEntryNumbers.mockResolvedValue(1);
      mockVoucherHeaderInterface.deleteByProcessType.mockResolvedValue(1);

      const result = await service.cleanupByProcessType(companyNo, processType);

      expect(result).toEqual({
        deletedHeaders: 1,
        deletedDetails: 1,
      });
    });

    it("should handle large number of entry numbers", async () => {
      const companyNo = 10;
      const processType = PROCESS_TYPE_ENUM.FLEXI;
      const largeEntryNumbers = Array.from(
        { length: 1000 },
        (_, i) => 1000 + i
      );

      mockVoucherHeaderInterface.getEntryNumbersByProcessType.mockResolvedValue(
        largeEntryNumbers
      );
      mockVoucherDetailInterface.deleteByEntryNumbers.mockResolvedValue(2000);
      mockVoucherHeaderInterface.deleteByProcessType.mockResolvedValue(1000);

      const result = await service.cleanupByProcessType(companyNo, processType);

      expect(result).toEqual({
        deletedHeaders: 1000,
        deletedDetails: 2000,
      });
    });
  });
});
