import { Test, TestingModule } from "@nestjs/testing";
import { SogasProcessor } from "./sogas.processor";
import { VoucherSharedService } from "./voucher.shared.service";
import { VoucherDetailValidationService } from "./voucher-detail.shared.service";
import { VoucherAppService } from "@src/main/account-payable/domain/services/voucher/voucher.service";
import { WebsocketService } from "@src/shared/websocket/websocket.service";
import { OwnerVendorReferenceRepository } from "@src/main/account-payable/data/repositories/owner-vendor-reference.repository";
import { VendorRepository } from "@src/main/account-payable/data/repositories/vendor.repository";
import { Job } from "bullmq";

// Mock IORedis
jest.mock("ioredis");

// Mock the logger
jest.mock("@src/shared/logger/logger.service");

// Mock p-limit
jest.mock("p-limit", () => {
  return jest.fn().mockImplementation(() => {
    return (fn: any) => fn();
  });
});

describe("SogasProcessor", () => {
  let processor: SogasProcessor;
  let mockVoucherSharedService: jest.Mocked<VoucherSharedService>;
  let mockVoucherDetailSharedService: jest.Mocked<VoucherDetailValidationService>;
  let mockVoucherAppService: jest.Mocked<VoucherAppService>;
  let mockWebsocketService: jest.Mocked<WebsocketService>;
  let mockOwnerVendorReferenceRepository: jest.Mocked<OwnerVendorReferenceRepository>;
  let mockVendorRepository: jest.Mocked<VendorRepository>;
  let mockRedis: any;
  let mockJob: jest.Mocked<Job>;

  beforeEach(async () => {
    const mockVoucherSharedServiceObj = {
      headerValidation: jest.fn(),
      buildVoucherHeaderData: jest.fn().mockReturnValue({
        id: "header-data-1",
        companyNo: "001",
        entryNo: "123",
        vendorNo: "V001",
        invoiceNo: "INV001",
        invoiceDate: "01/01/24",
        invoiceAmount: "100.00",
        dueDate: "01/31/24",
        discountDueDate: "01/15/24",
        apGlNo: "5000",
        bankGl: "1000",
        invoiceDesc: "Test Invoice",
        holdDesc: "Test Hold",
        status: "P",
      } as any),
    };
    const mockVoucherDetailSharedServiceObj = {
      validateDetail: jest.fn(),
      buildVoucherDetailData: jest.fn(),
    };
    const mockVoucherAppServiceObj = {
      createVoucherHeader: jest.fn(),
      createVoucherDetail: jest.fn(),
    };
    const mockWebsocketServiceObj = {
      emitBatchSummaryToWebSocket: jest.fn(),
      emitFinalSummaryToWebSocket: jest.fn(),
    };
    const mockOwnerVendorReferenceRepositoryObj = {
      findActiveByOwnerNo: jest.fn(),
    };
    const mockVendorRepositoryObj = {
      findOne: jest.fn(),
    };
    const mockRedisObj = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      hset: jest.fn(),
      hlen: jest.fn(),
      hgetall: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SogasProcessor,
        {
          provide: VoucherSharedService,
          useValue: mockVoucherSharedServiceObj,
        },
        {
          provide: VoucherDetailValidationService,
          useValue: mockVoucherDetailSharedServiceObj,
        },
        {
          provide: VoucherAppService,
          useValue: mockVoucherAppServiceObj,
        },
        {
          provide: WebsocketService,
          useValue: mockWebsocketServiceObj,
        },
        {
          provide: OwnerVendorReferenceRepository,
          useValue: mockOwnerVendorReferenceRepositoryObj,
        },
        {
          provide: VendorRepository,
          useValue: mockVendorRepositoryObj,
        },
        {
          provide: "IORedis",
          useValue: mockRedisObj,
        },
      ],
    }).compile();

    processor = module.get<SogasProcessor>(SogasProcessor);
    mockVoucherSharedService = module.get(VoucherSharedService);
    mockVoucherDetailSharedService = module.get(VoucherDetailValidationService);
    mockVoucherAppService = module.get(VoucherAppService);
    mockWebsocketService = module.get(WebsocketService);
    mockOwnerVendorReferenceRepository = module.get(
      OwnerVendorReferenceRepository
    );
    mockVendorRepository = module.get(VendorRepository);
    mockRedis = mockRedisObj;

    // Mock the Redis instance used by the processor
    jest
      .spyOn(processor["redis"], "hset")
      .mockImplementation(mockRedisObj.hset);
    jest
      .spyOn(processor["redis"], "hlen")
      .mockImplementation(mockRedisObj.hlen);
    jest
      .spyOn(processor["redis"], "hgetall")
      .mockImplementation(mockRedisObj.hgetall);
    jest.spyOn(processor["redis"], "del").mockImplementation(mockRedisObj.del);

    // Mock job data
    mockJob = {
      data: {
        groupedRecords: [
          {
            header: {
              ATOWNR: "1001",
              ATCKNM: "INV001",
              ATDUDT: "12/25/2023",
              ATCKAM: "100.00",
              apGlNo: "5000",
              entryNo: "123",
              companyNo: "10",
              bankGl: "1000",
              dueDate: "01/25/2024",
            } as any,
            details: [
              {
                lineGlno: "5000",
                ATCKNM: "Test Line Description",
                ATCKAM: "100.00",
                productAmount: "100.00",
                entrySequence: "1",
                entryNo: "123",
                companyNo: "10",
              } as any,
            ],
          },
        ],
        uploadId: "test-upload-id",
        batchIndex: 0,
        totalBatches: 1,
        subType: "REGULAR",
      },
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("onActive", () => {
    it("should log when job becomes active", () => {
      const logSpy = jest.spyOn(processor["logger"], "log");
      const job = { id: "test-job" } as Job;

      processor.onActive(job);

      expect(logSpy).toHaveBeenCalledWith(
        "Queue sogas job test-job is now active"
      );
    });
  });

  describe("onCompleted", () => {
    it("should log when job completes successfully", () => {
      const logSpy = jest.spyOn(processor["logger"], "log");
      const job = { id: "test-job" } as Job;
      const result = { success: true };

      processor.onCompleted(job, result);

      expect(logSpy).toHaveBeenCalledWith(
        "Queue sogas job test-job completed successfully"
      );
    });
  });

  describe("onFailed", () => {
    it("should log when job fails", () => {
      const logSpy = jest.spyOn(processor["logger"], "error");
      const job = { id: "test-job" } as Job;
      const error = new Error("Test error");

      processor.onFailed(job, error);

      expect(logSpy).toHaveBeenCalledWith(
        "Job test-job failed with error: Test error",
        error.stack
      );
    });
  });

  describe("handle", () => {
    it("should process batch successfully", async () => {
      const mockVendor = { vendorNo: "V001", vendorName: "Test Vendor" } as any;
      mockOwnerVendorReferenceRepository.findActiveByOwnerNo.mockResolvedValue({
        vendorNo: 1001,
      } as any);
      mockVendorRepository.findOne.mockResolvedValue(mockVendor);
      mockVoucherSharedService.headerValidation.mockResolvedValue({
        newDueDate: 123123,
        newDiscountDueDate: 123123,
        foundVendor: mockVendor,
      });
      mockVoucherDetailSharedService.validateDetail.mockResolvedValue({
        error: false,
        data: [{ id: "detail-1" }],
      });
      mockVoucherAppService.createVoucherHeader.mockResolvedValue({
        id: "header-1",
      } as any);
      mockVoucherAppService.createVoucherDetail.mockResolvedValue({
        id: "detail-1",
      } as any);

      const result = await processor.handle(mockJob);

      expect(result).toEqual({
        uploadId: "test-upload-id",
        summary: expect.any(Array),
      });
    });

    it("should handle validation errors", async () => {
      mockOwnerVendorReferenceRepository.findActiveByOwnerNo.mockResolvedValue({
        vendorNo: 1001,
      } as any);
      mockVendorRepository.findOne.mockResolvedValue({
        vendorNo: "V001",
        vendorHoldPaymentsVend: "N",
      } as any);
      mockVoucherSharedService.headerValidation.mockResolvedValue({
        errors: [
          {
            field: "companyNo",
            message: "Invalid company number",
            code: "INVALID_COMPANY",
          },
        ],
        data: {
          newDueDate: 0,
          newDiscountDueDate: 0,
          foundVendor: null,
        },
      });

      const result = await processor.handle(mockJob);

      expect(result.summary).toBeDefined();
    });

    it("should handle database save errors", async () => {
      mockOwnerVendorReferenceRepository.findActiveByOwnerNo.mockResolvedValue({
        vendorNo: 1001,
      } as any);
      mockVendorRepository.findOne.mockResolvedValue({
        vendorNo: "V001",
        vendorHoldPaymentsVend: "N",
      } as any);
      mockVoucherSharedService.headerValidation.mockResolvedValue({
        newDueDate: 123123,
        newDiscountDueDate: 123123,
        foundVendor: { vendorNo: "V001" } as any,
      });
      mockVoucherDetailSharedService.validateDetail.mockResolvedValue({
        error: false,
        data: [{ id: "detail-1" }],
      });
      mockVoucherAppService.createVoucherHeader.mockRejectedValue(
        new Error("DB Error")
      );

      const result = await processor.handle(mockJob);

      expect(result.summary).toBeDefined();
    });

    it("should handle negative invoice amount for REGULAR subtype", async () => {
      mockJob.data.subType = "REGULAR";
      mockJob.data.groupedRecords[0].header.ATCKAM = "-100.00";

      const result = await processor.handle(mockJob);

      expect(result.summary).toBeDefined();
    });
  });

  describe("processGroup", () => {
    it("should process a single group successfully", async () => {
      const mockVendor = { vendorNo: "V001", vendorName: "Test Vendor" } as any;
      mockOwnerVendorReferenceRepository.findActiveByOwnerNo.mockResolvedValue({
        vendorNo: 1001,
      } as any);
      mockVendorRepository.findOne.mockResolvedValue(mockVendor);
      mockVoucherSharedService.headerValidation.mockResolvedValue({
        newDueDate: 123123,
        newDiscountDueDate: 123123,
        foundVendor: mockVendor,
      });
      mockVoucherDetailSharedService.validateDetail.mockResolvedValue({
        error: false,
        data: [{ id: "detail-1" }],
      });
      mockVoucherAppService.createVoucherHeader.mockResolvedValue({
        id: "header-1",
      } as any);
      mockVoucherAppService.createVoucherDetail.mockResolvedValue({
        id: "detail-1",
      } as any);

      const group = mockJob.data.groupedRecords[0];

      const result = await processor["processGroup"](group, "REGULAR");

      expect(result).toBeDefined();
    });

    it("should handle owner not found in APSGACH", async () => {
      mockOwnerVendorReferenceRepository.findActiveByOwnerNo.mockResolvedValue(
        null
      );

      const group = mockJob.data.groupedRecords[0];

      const result = await processor["processGroup"](group, "REGULAR");

      expect(result).toBeDefined();
    });

    it("should handle vendor not found in Vendor table", async () => {
      mockOwnerVendorReferenceRepository.findActiveByOwnerNo.mockResolvedValue({
        vendorNo: 1001,
      } as any);
      mockVendorRepository.findOne.mockResolvedValue(null);

      const group = mockJob.data.groupedRecords[0];

      const result = await processor["processGroup"](group, "REGULAR");

      expect(result).toBeDefined();
    });

    it("should use header as details when details array is empty", async () => {
      const group = {
        ...mockJob.data.groupedRecords[0],
        details: [],
      };

      const result = await processor["processGroup"](group, "REGULAR");

      expect(result).toBeDefined();
    });
  });

  describe("validateHeader", () => {
    it("should validate header successfully", async () => {
      const header = { companyNo: "001", carrierId: "CAR001" } as any;
      mockVoucherSharedService.headerValidation.mockResolvedValue({
        newDueDate: 123123,
        newDiscountDueDate: 123123,
        foundVendor: { vendorNo: "V001" } as any,
      });

      const result = await processor["validateHeader"](header, "test");

      expect(result.errors).toEqual([]);
    });

    it("should handle header validation errors", async () => {
      mockVoucherSharedService.headerValidation.mockResolvedValue({
        errors: [
          {
            field: "companyNo",
            message: "Invalid company number",
            code: "INVALID_COMPANY",
          },
        ],
        data: {
          newDueDate: 0,
          newDiscountDueDate: 0,
          foundVendor: null,
        },
      });

      const header = { companyNo: "001", carrierId: "CAR001" } as any;

      const result = await processor["validateHeader"](header, "test");

      expect(result.errors).toHaveLength(2);
    });

    it("should handle header validation exceptions", async () => {
      mockVoucherSharedService.headerValidation.mockRejectedValue(
        new Error("Validation error")
      );

      const header = { companyNo: "001", carrierId: "CAR001" } as any;

      const result = await processor["validateHeader"](header, "test");

      expect(result.errors).toBeDefined();
    });
  });

  describe("validateDetails", () => {
    it("should validate details successfully", async () => {
      const details = [{ lineNo: 1, amount: 100 } as any];
      mockVoucherDetailSharedService.validateDetail.mockResolvedValue({
        error: false,
        data: [{ id: "detail-1" }],
      });

      const result = await processor["validateDetails"](details, {});

      expect(result).toBeDefined();
    });

    it("should handle detail validation errors", async () => {
      mockVoucherDetailSharedService.validateDetail.mockResolvedValue({
        error: true,
        errors: [
          {
            index: 0,
            errors: [
              {
                field: "amount",
                message: "Invalid amount",
                code: "INVALID_AMOUNT",
              },
            ],
          },
        ],
        warnings: [],
        data: [],
      });

      const details = [{ lineNo: 1, amount: 100 } as any];

      const result = await processor["validateDetails"](details, {});

      expect(result).toBeDefined();
    });

    it("should handle detail validation exceptions", async () => {
      mockVoucherDetailSharedService.validateDetail.mockRejectedValue(
        new Error("Validation error")
      );

      const details = [{ lineNo: 1, amount: 100 } as any];

      const result = await processor["validateDetails"](details, {});

      expect(result).toBeDefined();
    });
  });

  describe("saveVoucherData", () => {
    it("should save voucher data successfully", async () => {
      const header = { companyNo: "001", carrierId: "CAR001" } as any;
      const details = [{ lineNo: 1, amount: 100 } as any];
      mockVoucherAppService.createVoucherHeader.mockResolvedValue({
        id: "header-1",
      } as any);
      mockVoucherAppService.createVoucherDetail.mockResolvedValue([
        { id: "detail-1" },
      ] as any);

      await processor["saveVoucherData"](header, details, "INV001", "S");

      expect(mockVoucherAppService.createVoucherHeader).toHaveBeenCalled();
      expect(mockVoucherAppService.createVoucherDetail).toHaveBeenCalled();
    });
  });

  describe("storeBatchSummaryInRedis", () => {
    it("should store batch summary in Redis when processing job", async () => {
      // Mock the validation methods to return success
      mockVoucherSharedService.headerValidation.mockResolvedValue({
        newDueDate: 0,
        newDiscountDueDate: 0,
        foundVendor: { vendorNo: "V001", vendorName: "Test Vendor" } as any,
      });
      mockVoucherDetailSharedService.validateDetail.mockResolvedValue({
        error: false,
        warnings: [],
        data: [{ id: "detail-1" }],
      });
      mockVoucherAppService.createVoucherHeader.mockResolvedValue({
        id: "header-1",
      } as any);
      mockVoucherAppService.createVoucherDetail.mockResolvedValue([
        { id: "detail-1" },
      ] as any);
      mockOwnerVendorReferenceRepository.findActiveByOwnerNo.mockResolvedValue(
        null
      );
      mockVendorRepository.findOne.mockResolvedValue(null);

      // Process the job which will call storeBatchSummaryInRedis
      await processor.handle(mockJob);

      expect(mockRedis.hset).toHaveBeenCalled();
    });
  });

  describe("checkAndEmitFinalSummary", () => {
    it("should emit final summary when all batches complete", async () => {
      // Mock the validation methods to return success
      mockVoucherSharedService.headerValidation.mockResolvedValue({
        newDueDate: 0,
        newDiscountDueDate: 0,
        foundVendor: { vendorNo: "V001", vendorName: "Test Vendor" } as any,
      });
      mockVoucherDetailSharedService.validateDetail.mockResolvedValue({
        error: false,
        warnings: [],
        data: [{ id: "detail-1" }],
      });
      mockVoucherAppService.createVoucherHeader.mockResolvedValue({
        id: "header-1",
      } as any);
      mockVoucherAppService.createVoucherDetail.mockResolvedValue([
        { id: "detail-1" },
      ] as any);
      mockOwnerVendorReferenceRepository.findActiveByOwnerNo.mockResolvedValue(
        null
      );
      mockVendorRepository.findOne.mockResolvedValue(null);
      mockRedis.hlen.mockResolvedValue(1);
      mockRedis.hgetall.mockResolvedValue({ "0": "[]" });

      // Process the job which will call checkAndEmitFinalSummary
      await processor.handle(mockJob);

      expect(
        mockWebsocketService.emitFinalSummaryToWebSocket
      ).toHaveBeenCalled();
    });

    it("should not emit final summary when batches are incomplete", async () => {
      // Mock the validation methods to return success
      mockVoucherSharedService.headerValidation.mockResolvedValue({
        newDueDate: 0,
        newDiscountDueDate: 0,
        foundVendor: { vendorNo: "V001", vendorName: "Test Vendor" } as any,
      });
      mockVoucherDetailSharedService.validateDetail.mockResolvedValue({
        error: false,
        warnings: [],
        data: [{ id: "detail-1" }],
      });
      mockVoucherAppService.createVoucherHeader.mockResolvedValue({
        id: "header-1",
      } as any);
      mockVoucherAppService.createVoucherDetail.mockResolvedValue([
        { id: "detail-1" },
      ] as any);
      mockOwnerVendorReferenceRepository.findActiveByOwnerNo.mockResolvedValue(
        null
      );
      mockVendorRepository.findOne.mockResolvedValue(null);
      mockRedis.hlen.mockResolvedValue(1);

      // Temporarily modify the mock job data to simulate incomplete batches
      const originalTotalBatches = mockJob.data.totalBatches;
      mockJob.data.totalBatches = 2; // Set to 2 so completedCount (1) < totalBatches (2)

      // Process the job which will call checkAndEmitFinalSummary
      await processor.handle(mockJob);

      // Restore the original value
      mockJob.data.totalBatches = originalTotalBatches;

      expect(
        mockWebsocketService.emitFinalSummaryToWebSocket
      ).not.toHaveBeenCalled();
    });
  });

  describe("computeStatus", () => {
    it("should return error status when header has errors", () => {
      const headerValid = { errors: ["Header error"] };
      const detailsValid = { errors: [], warnings: [] };

      const status = processor["computeStatus"](headerValid, detailsValid);

      expect(status).toBe("E");
    });

    it("should return error status when detail has errors", () => {
      const headerValid = { errors: [] };
      const detailsValid = { errors: ["Detail error"], warnings: [] };

      const status = processor["computeStatus"](headerValid, detailsValid);

      expect(status).toBe("E");
    });

    it("should return warning status when detail has warnings", () => {
      const headerValid = { errors: [] };
      const detailsValid = { errors: [], warnings: ["Detail warning"] };

      const status = processor["computeStatus"](headerValid, detailsValid);

      expect(status).toBe("W");
    });

    it("should return success status when no errors or warnings", () => {
      const headerValid = { errors: [] };
      const detailsValid = { errors: [], warnings: [] };

      const status = processor["computeStatus"](headerValid, detailsValid);

      expect(status).toBe("S");
    });
  });

  describe("mapHeader", () => {
    it("should map header row correctly", () => {
      const headerRow = {
        ATOWNR: "1001",
        ATCKNM: "INV001",
        ATDUDT: "12/25/2023",
        ATCKAM: "100.00",
        apGlNo: "5000",
        entryNo: "123",
        companyNo: "10",
        bankGl: "1000",
        dueDate: "01/25/2024",
      } as any;

      const result = processor["mapHeader"](headerRow);

      expect(result.invoiceNo).toBe("INV001");
    });
  });

  describe("mapDetail", () => {
    it("should map detail for REGULAR subtype", () => {
      const detailRow = {
        lineGlno: "5000",
        ATCKNM: "Test Line Description",
        ATCKAM: "100.00",
        productAmount: "100.00",
        entrySequence: "1",
        entryNo: "123",
        companyNo: "10",
      } as any;

      const result = processor["mapDetail"](detailRow, "REGULAR");

      expect(result.lineGlNo).toBe(12010008);
    });

    it("should map detail for non-REGULAR subtype", () => {
      const detailRow = {
        lineGlno: "5000",
        ATCKNM: "Test Line Description",
        ATCKAM: "100.00",
        productAmount: "100.00",
        entrySequence: "1",
        entryNo: "123",
        companyNo: "10",
      } as any;

      const result = processor["mapDetail"](detailRow, "SPECIAL");

      expect(result.lineGlNo).toBe(12010009);
    });

    it("should handle case-insensitive subtype comparison", () => {
      const detailRow = {
        lineGlno: "5000",
        ATCKNM: "Test Line Description",
        ATCKAM: "100.00",
        productAmount: "100.00",
        entrySequence: "1",
        entryNo: "123",
        companyNo: "10",
      } as any;

      const result = processor["mapDetail"](detailRow, "regular");

      expect(result.lineGlNo).toBe(12010008);
    });
  });
});
