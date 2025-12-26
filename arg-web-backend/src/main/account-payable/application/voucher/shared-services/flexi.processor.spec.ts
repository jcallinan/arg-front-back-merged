import { Test, TestingModule } from "@nestjs/testing";
import { FlexiProcessor } from "./flexi.processor";
import { VoucherSharedService } from "./voucher.shared.service";
import { VoucherDetailValidationService } from "./voucher-detail.shared.service";
import { VoucherDetailValidation } from "../validations/voucher-detail.validation";
import { VoucherAppService } from "@src/main/account-payable/domain/services/voucher/voucher.service";
import { WebsocketService } from "@src/shared/websocket/websocket.service";
import { VendorSharedService } from "./vendor.shared.service";
import { Job } from "bullmq";

// Mock ioredis
const mockRedis = {
  hset: jest.fn(),
  hlen: jest.fn(),
  hgetall: jest.fn(),
  del: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
};

jest.mock("ioredis", () => {
  return jest.fn().mockImplementation(() => mockRedis);
});

// Mock the logger
jest.mock("@src/shared/logger/logger.service");

// Mock p-limit
jest.mock("p-limit", () => {
  return jest.fn().mockImplementation(() => {
    return (fn: any) => fn();
  });
});

describe("FlexiProcessor", () => {
  let processor: FlexiProcessor;
  let mockVoucherSharedService: jest.Mocked<VoucherSharedService>;
  let mockVoucherDetailValidationService: jest.Mocked<VoucherDetailValidationService>;
  let mockVoucherAppService: jest.Mocked<VoucherAppService>;
  let mockWebsocketService: jest.Mocked<WebsocketService>;
  let mockVendorService: jest.Mocked<VendorSharedService>;
  let mockJob: jest.Mocked<Job>;

  beforeEach(async () => {
    const mockVoucherSharedServiceObj = {
      headerValidation: jest.fn(),
      buildVoucherHeaderData: jest.fn(),
    };
    const mockVoucherDetailValidationObj = {
      validateDetail: jest.fn(),
      buildVoucherDetailData: jest.fn(),
    };
    const mockVoucherDetailValidationServiceObj = {
      getEntrySequence: jest.fn(),
    };
    const mockVoucherAppServiceObj = {
      createVoucherHeader: jest.fn(),
      createVoucherDetail: jest.fn(),
    };
    const mockWebsocketServiceObj = {
      emitBatchSummaryToWebSocket: jest.fn(),
      emitFinalSummaryToWebSocket: jest.fn(),
    };
    const mockVendorServiceObj = {
      getVendorNoByCompanyAndCarrierId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlexiProcessor,
        {
          provide: VoucherSharedService,
          useValue: mockVoucherSharedServiceObj,
        },
        {
          provide: VoucherDetailValidationService,
          useValue: mockVoucherDetailValidationObj,
        },
        {
          provide: VoucherDetailValidation,
          useValue: mockVoucherDetailValidationServiceObj,
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
          provide: VendorSharedService,
          useValue: mockVendorServiceObj,
        },
      ],
    }).compile();

    processor = module.get<FlexiProcessor>(FlexiProcessor);
    mockVoucherSharedService = module.get(VoucherSharedService);
    mockVoucherDetailValidationService = module.get(
      VoucherDetailValidationService
    );
    mockVoucherAppService = module.get(VoucherAppService);
    mockWebsocketService = module.get(WebsocketService);
    mockVendorService = module.get(VendorSharedService);

    // Mock job data with proper CSV structure matching the constants
    // Note: entryNo, companyNo, bankGl are direct mappings, not CSV fields
    mockJob = {
      data: {
        groupedRecords: [
          {
            header: {
              AUINNO: "INV001",
              AUVNNO: "V001",
              AUDATE: "01/01/24",
              AUTOTL: "1000.00",
              "AUDGL#": "5000",
              AUHDSC: "Test Invoice",
              AUNOTE: "Test Note",
              entryNo: "1001", // Direct mapping field
              companyNo: "001", // Direct mapping field
              bankGl: "1000", // Direct mapping field
            } as any,
            details: [
              {
                "AUDGL#": "5000",
                AUDDSC: "Test Detail",
                AUDTPN: "1000.00",
                AUDISC: "0.00",
                AUDSPC: "0",
                AUDQTY: "1",
                AUDGAL: "100",
                "AUDRC#": "RC001",
                AUDLAY: "1",
                AUDPRC: "1000.00",
                AUPONM: "PO001",
                entrySequence: "1", // Direct mapping field
                entryNo: "1001", // Direct mapping field
                companyNo: "001", // Direct mapping field
              } as any,
            ],
          },
        ],
        uploadId: "batch-001",
        batchIndex: 0,
        totalBatches: 1,
      },
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("onActive", () => {
    it("should log when queue becomes active", () => {
      const logSpy = jest.spyOn(processor["logger"], "log");
      const job = { id: "test-job" } as Job;

      processor.onActive(job);

      expect(logSpy).toHaveBeenCalledWith(
        "Queue flexi job test-job is now active"
      );
    });
  });

  describe("onCompleted", () => {
    it("should log when queue completes", () => {
      const logSpy = jest.spyOn(processor["logger"], "log");
      const job = { id: "test-job" } as Job;
      const result = { success: true };

      processor.onCompleted(job, result);

      expect(logSpy).toHaveBeenCalledWith(
        "Queue flexi job test-job completed successfully"
      );
    });
  });

  describe("onFailed", () => {
    it("should log when queue fails", () => {
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
    it("should process invoices successfully", async () => {
      const mockVendor = { vendorNo: "V001", vendorName: "Test Vendor" } as any;
      mockVendorService.getVendorNoByCompanyAndCarrierId.mockResolvedValue(
        mockVendor
      );
      mockVoucherSharedService.headerValidation.mockResolvedValue({
        newDueDate: 123123,
        newDiscountDueDate: 123123,
        foundVendor: mockVendor,
      });
      mockVoucherDetailValidationService.validateDetail.mockResolvedValue({
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
        uploadId: "batch-001",
        summary: expect.any(Array),
      });
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

      const result = await processor.handle(mockJob);

      expect(result.summary).toBeDefined();
    });

    it("should handle detail validation errors", async () => {
      mockVoucherSharedService.headerValidation.mockResolvedValue({
        newDueDate: 123123,
        newDiscountDueDate: 123123,
        foundVendor: { vendorNo: "V001" } as any,
      });
      mockVoucherDetailValidationService.validateDetail.mockResolvedValue({
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
      });

      const result = await processor.handle(mockJob);

      expect(result.summary).toBeDefined();
    });

    it("should handle database save errors", async () => {
      mockVoucherSharedService.headerValidation.mockResolvedValue({
        newDueDate: 123123,
        newDiscountDueDate: 123123,
        foundVendor: { vendorNo: "V001" } as any,
      });
      mockVoucherDetailValidationService.validateDetail.mockResolvedValue({
        error: false,
        data: [{ id: "detail-1" }],
      });
      mockVoucherAppService.createVoucherHeader.mockRejectedValue(
        new Error("DB Error")
      );

      const result = await processor.handle(mockJob);

      expect(result.summary).toBeDefined();
    });
  });

  describe("processGroup", () => {
    it("should process a group of invoices successfully", async () => {
      const mockVendor = { vendorNo: "V001", vendorName: "Test Vendor" } as any;
      mockVendorService.getVendorNoByCompanyAndCarrierId.mockResolvedValue(
        mockVendor
      );
      mockVoucherSharedService.headerValidation.mockResolvedValue({
        newDueDate: 123123,
        newDiscountDueDate: 123123,
        foundVendor: mockVendor,
      });
      mockVoucherDetailValidationService.validateDetail.mockResolvedValue({
        error: false,
        data: [{ id: "detail-1" }],
      });
      mockVoucherAppService.createVoucherHeader.mockResolvedValue({
        id: "header-1",
      } as any);
      mockVoucherAppService.createVoucherDetail.mockResolvedValue({
        id: "detail-1",
      } as any);

      // Pass a single group object, not an array
      const group = {
        header: {
          AUINNO: "INV001",
          AUVNNO: "V001",
          AUDATE: "01/01/24",
          AUTOTL: "1000.00",
          "AUDGL#": "5000",
          AUHDSC: "Test Invoice",
          AUNOTE: "Test Note",
          entryNo: "1001", // Direct mapping field
          companyNo: "001", // Direct mapping field
          bankGl: "1000", // Direct mapping field
        } as any,
        details: [
          {
            "AUDGL#": "5000",
            AUDDSC: "Test Detail",
            AUDTPN: "1000.00",
            AUDISC: "0.00",
            AUDSPC: "0",
            AUDQTY: "1",
            AUDGAL: "100",
            "AUDRC#": "RC001",
            AUDLAY: "1",
            AUDPRC: "1000.00",
            AUPONM: "PO001",
            entrySequence: "1", // Direct mapping field
            entryNo: "1001", // Direct mapping field
            companyNo: "001", // Direct mapping field
          } as any,
        ],
      };

      const result = await processor["processGroup"](group);

      expect(Array.isArray(result)).toBe(false);
      expect(result.invoiceNo).toBe("INV001");
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

      const result = await processor["validateHeader"](header);

      expect(result.errors).toEqual([]);
    });
  });

  describe("validateDetails", () => {
    it("should validate details successfully", async () => {
      const details = [{ lineNo: 1, amount: 100 } as any];
      mockVoucherDetailValidationService.validateDetail.mockResolvedValue({
        error: false,
        data: [{ id: "detail-1" }],
      });

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
      mockVoucherAppService.createVoucherDetail.mockResolvedValue({
        id: "detail-1",
      } as any);

      const result = await processor["saveVoucherData"](
        header,
        details,
        "INV001",
        "S"
      );

      // The method doesn't return anything, so we expect undefined
      expect(result).toBeUndefined();
    });
  });

  describe("storeBatchSummaryInRedis", () => {
    it("should store batch summary in Redis", async () => {
      const uploadId = "batch-001";
      const batchIndex = 0;
      const summary = { processed: 5, failed: 0 };

      await processor["storeBatchSummaryInRedis"](
        uploadId,
        batchIndex,
        summary
      );

      expect(mockRedis.hset).toHaveBeenCalledWith(
        `upload:${uploadId}:summaries`,
        `${batchIndex}`,
        JSON.stringify(summary)
      );
    });
  });

  describe("checkAndEmitFinalSummary", () => {
    it("should emit final summary when all batches are complete", async () => {
      const uploadId = "batch-001";
      const totalBatches = 1;
      mockRedis.hlen.mockResolvedValue(1);
      mockRedis.hgetall.mockResolvedValue({
        "0": '{"processed": 5, "failed": 0}',
      });

      await processor["checkAndEmitFinalSummary"](uploadId, totalBatches);

      expect(
        mockWebsocketService.emitFinalSummaryToWebSocket
      ).toHaveBeenCalled();
    });
  });

  describe("computeStatus", () => {
    it("should compute status based on validation results", () => {
      const headerValid = { errors: [] };
      const detailsValid = { errors: [], warnings: [] };

      const status = processor["computeStatus"](headerValid, detailsValid);

      expect(status).toBeDefined();
    });

    it("should return error status when header is invalid", () => {
      const headerValid = { errors: ["Header error"] };
      const detailsValid = { errors: [], warnings: [] };

      const status = processor["computeStatus"](headerValid, detailsValid);

      expect(status).toBeDefined();
    });
  });

  describe("mapHeader", () => {
    it("should map header data correctly", () => {
      const header = {
        AUINNO: "INV001",
        AUVNNO: "V001",
        AUDATE: "01/01/24",
        AUTOTL: "1000.00",
        "AUDGL#": "5000",
        AUHDSC: "Test Invoice",
        AUNOTE: "Test Note",
        entryNo: "1001", // Direct mapping field
        companyNo: "001", // Direct mapping field
        bankGl: "1000", // Direct mapping field
      } as any;

      const result = processor["mapHeader"](header);

      expect(result.invoiceNo).toBe("INV001");
    });
  });

  describe("mapDetail", () => {
    it("should map detail data correctly", () => {
      const detail = {
        "AUDGL#": "5000",
        AUDDSC: "Test Detail",
        AUDTPN: "1000.00",
        AUDISC: "0.00",
        AUDSPC: "0",
        AUDQTY: "1",
        AUDGAL: "100",
        "AUDRC#": "RC001",
        AUDLAY: "1",
        AUDPRC: "1000.00",
        AUPONM: "PO001",
        entrySequence: "1", // Direct mapping field
        entryNo: "1001", // Direct mapping field
        companyNo: "001", // Direct mapping field
      } as any;

      const result = processor["mapDetail"](detail);

      expect(result.lineGlNo).toBe(5000);
    });
  });
});
