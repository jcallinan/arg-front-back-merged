import { Test, TestingModule } from "@nestjs/testing";
import { VoucherBatchProcessor } from "./voucher-batch-processor";
import { VoucherSharedService } from "./voucher.shared.service";
import { VoucherDetailValidationService } from "./voucher-detail.shared.service";
import { VoucherAppService } from "@src/main/account-payable/domain/services/voucher/voucher.service";
import { WebsocketService } from "@src/shared/websocket/websocket.service";
import { VendorSharedService } from "./vendor.shared.service";
import { Job } from "bullmq";
import { PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";

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

describe("VoucherBatchProcessor", () => {
  let processor: VoucherBatchProcessor;
  let mockVoucherSharedService: jest.Mocked<VoucherSharedService>;
  let mockVoucherDetailSharedService: jest.Mocked<VoucherDetailValidationService>;
  let mockVoucherAppService: jest.Mocked<VoucherAppService>;
  let mockWebsocketService: jest.Mocked<WebsocketService>;
  let mockVendorService: jest.Mocked<VendorSharedService>;
  let mockRedis: any;
  let mockJob: jest.Mocked<Job>;

  // Mock interfaces
  let mockSalesAnalysisDetailInterface: any;
  let mockSalesAnalysisMiscInterface: any;
  let mockProdMoveDetailLogicalInterface: any;
  let mockProdMoveMiscLogicalInterface: any;
  let mockBillingControlFileInterface: any;
  let mockContainerUomConversionInterface: any;
  let mockFreightInvoiceHeaderInterface: any;
  let mockGeneralSystemInterface: any;

  beforeEach(async () => {
    // Create mock interfaces
    mockSalesAnalysisDetailInterface = {
      findOne: jest.fn(),
      findAll: jest.fn().mockResolvedValue([
        {
          netGallons: 100,
          product: "Test Product",
          containerCd: "TEST",
          tank: "T1",
        },
      ]),
      create: jest.fn(),
      update: jest.fn(),
    };
    mockSalesAnalysisMiscInterface = {
      findOne: jest.fn(),
      findAll: jest
        .fn()
        .mockResolvedValue([{ lineAmount: 100, lineDesc: "Misc 1" }]),
      create: jest.fn(),
      update: jest.fn(),
    };
    mockProdMoveDetailLogicalInterface = {
      findOne: jest.fn(),
      findAll: jest.fn().mockResolvedValue([
        {
          netGallons: 100,
          product: "Test Product",
          containerCd: "TEST",
          tank: "T1",
        },
      ]),
      create: jest.fn(),
      update: jest.fn(),
    };
    mockProdMoveMiscLogicalInterface = {
      findOne: jest.fn(),
      findAll: jest
        .fn()
        .mockResolvedValue([{ lineAmount: 100, lineDesc: "Misc 1" }]),
      create: jest.fn(),
      update: jest.fn(),
    };
    mockBillingControlFileInterface = {
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    mockContainerUomConversionInterface = {
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    mockFreightInvoiceHeaderInterface = {
      findOne: jest.fn(),
      updateInvoiceStatus: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    mockGeneralSystemInterface = {
      findOne: jest.fn(),
      findTableTypeAndCode: jest.fn().mockResolvedValue({ glNo: 5000 }),
      create: jest.fn(),
      update: jest.fn(),
    };

    const mockVoucherSharedServiceObj = {
      headerValidation: jest.fn(),
      buildVoucherHeaderData: jest.fn().mockReturnValue({}),
    };
    const mockVoucherDetailSharedServiceObj = {
      validateDetail: jest.fn(),
      buildVoucherDetailData: jest.fn().mockReturnValue({}),
    };
    const mockVoucherAppServiceObj = {
      createOrUpdateVoucherHeader: jest.fn(),
      createVoucherDetail: jest.fn(),
    };
    const mockWebsocketServiceObj = {
      emitBatchSummaryToWebSocket: jest.fn(),
    };
    const mockVendorServiceObj = {
      getVendorNoByCompanyAndCarrierId: jest.fn(),
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
        VoucherBatchProcessor,
        {
          provide: "SalesAnalysisDetailInterface",
          useValue: mockSalesAnalysisDetailInterface,
        },
        {
          provide: "SalesAnalysisMiscInterface",
          useValue: mockSalesAnalysisMiscInterface,
        },
        {
          provide: "ProdMoveDetailLogicalInterface",
          useValue: mockProdMoveDetailLogicalInterface,
        },
        {
          provide: "ProdMoveMiscLogicalInterface",
          useValue: mockProdMoveMiscLogicalInterface,
        },
        {
          provide: "BillingControlFileInterface",
          useValue: mockBillingControlFileInterface,
        },
        {
          provide: "ContainerUomConversionInterface",
          useValue: mockContainerUomConversionInterface,
        },
        {
          provide: "FreightInvoiceHeaderInterface",
          useValue: mockFreightInvoiceHeaderInterface,
        },
        {
          provide: "GeneralSystemInterface",
          useValue: mockGeneralSystemInterface,
        },
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
          provide: VendorSharedService,
          useValue: mockVendorServiceObj,
        },
        {
          provide: "IORedis",
          useValue: mockRedisObj,
        },
      ],
    }).compile();

    processor = module.get<VoucherBatchProcessor>(VoucherBatchProcessor);
    mockVoucherSharedService = module.get(VoucherSharedService);
    mockVoucherDetailSharedService = module.get(VoucherDetailValidationService);
    mockVoucherAppService = module.get(VoucherAppService);
    mockWebsocketService = module.get(WebsocketService);
    mockVendorService = module.get(VendorSharedService);
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
        invoiceRecords: [
          {
            carrierId: "CAR001",
            carrierInvoiceNo: "INV001",
            ordShipDate: "01/01/24",
            invoiceType: "FREIGHT",
            ourOrderNo: 12345,
            shippingReferenceNo: 67890,
            invoiceAmount: 1000.0,
            companyNo: 1,
            entryNo: 1001,
            apGlNo: 5000,
            bankGl: 1000,
            retentionGl: 100,
            vendorNo: 1001,
            orderNo: 12345,
          } as any,
        ],
        batchId: "batch-001",
        batchIndex: 0,
        totalBatches: 1,
        invoiceType: "PAPER",
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
        "Queue paper/lms job test-job is now active"
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
        "Queue paper/lms job test-job completed successfully"
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
    it("should process invoices successfully", async () => {
      mockVoucherSharedService.headerValidation.mockResolvedValue({
        errors: [],
        data: { newDueDate: 0, newDiscountDueDate: 0, foundVendor: null },
      });
      mockVoucherDetailSharedService.validateDetail.mockResolvedValue({
        error: false,
        data: [{ id: "detail-1" }],
      });
      mockVoucherAppService.createOrUpdateVoucherHeader.mockResolvedValue({
        id: "header-1",
      } as any);
      mockVoucherAppService.createVoucherDetail.mockResolvedValue([
        { id: "detail-1" },
      ] as any);

      const result = await processor.handle(mockJob);

      expect(result).toEqual({
        batchId: "batch-001",
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
        data: { newDueDate: 0, newDiscountDueDate: 0, foundVendor: null },
      });

      const result = await processor.handle(mockJob);

      expect(result.summary).toBeDefined();
    });

    it("should handle detail validation errors", async () => {
      mockVoucherSharedService.headerValidation.mockResolvedValue({
        errors: [],
        data: { newDueDate: 0, newDiscountDueDate: 0, foundVendor: null },
      });
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

      const result = await processor.handle(mockJob);

      expect(result.summary).toBeDefined();
    });

    it("should handle database save errors", async () => {
      mockVoucherSharedService.headerValidation.mockResolvedValue({
        errors: [],
        data: { newDueDate: 0, newDiscountDueDate: 0, foundVendor: null },
      });
      mockVoucherDetailSharedService.validateDetail.mockResolvedValue({
        error: false,
        data: [{ id: "detail-1" }],
      });
      mockVoucherAppService.createOrUpdateVoucherHeader.mockRejectedValue(
        new Error("DB Error")
      );

      const result = await processor.handle(mockJob);

      expect(result.summary).toBeDefined();
    });
  });

  describe("processinvoice", () => {
    it("should process a single invoice successfully", async () => {
      const invoice = mockJob.data.invoiceRecords[0];
      mockVoucherSharedService.headerValidation.mockResolvedValue({
        errors: [],
        data: { newDueDate: 0, newDiscountDueDate: 0, foundVendor: null },
      });
      mockVoucherDetailSharedService.validateDetail.mockResolvedValue({
        error: false,
        data: [{ id: "detail-1" }],
      });
      mockVoucherAppService.createOrUpdateVoucherHeader.mockResolvedValue({
        id: "header-1",
      } as any);
      mockVoucherAppService.createVoucherDetail.mockResolvedValue([
        { id: "detail-1" },
      ] as any);

      const result = await processor["processinvoice"](
        invoice,
        PROCESS_TYPE_ENUM.PAPER
      );

      expect(result).toBeDefined();
    });
  });

  describe("validateHeader", () => {
    it("should validate header successfully", async () => {
      const header = { companyNo: 1, carrierId: "CAR001" } as any;
      mockVoucherSharedService.headerValidation.mockResolvedValue({
        errors: [],
        data: { newDueDate: 0, newDiscountDueDate: 0, foundVendor: null },
      });

      const result = await processor["validateHeader"](header);

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
        data: { newDueDate: 0, newDiscountDueDate: 0, foundVendor: null },
      });

      const header = { companyNo: 1, carrierId: "CAR001" } as any;

      const result = await processor["validateHeader"](header);

      expect(result.errors).toHaveLength(1);
    });
  });

  describe("validateDetails", () => {
    it("should validate details successfully", async () => {
      const details = [{ lineNo: 1, amount: 1000 } as any];
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

      const details = [{ lineNo: 1, amount: 1000 } as any];

      const result = await processor["validateDetails"](details, {});

      expect(result).toBeDefined();
    });
  });

  describe("saveVoucherData", () => {
    it("should save voucher data successfully", async () => {
      const header = { companyNo: 1, carrierId: "CAR001" } as any;
      const details = [{ lineNo: 1, amount: 1000 } as any];
      mockVoucherAppService.createOrUpdateVoucherHeader.mockResolvedValue({
        id: "header-1",
      } as any);
      mockVoucherAppService.createVoucherDetail.mockResolvedValue([
        { id: "detail-1" },
      ] as any);

      const result = await processor["saveVoucherData"](
        header,
        details,
        "INV001",
        "S"
      );

      expect(result).toBeUndefined();
    });
  });

  describe("storeBatchSummaryInRedis", () => {
    it("should store batch summary in Redis", async () => {
      const uploadId = "batch-001";
      const batchIndex = 0;
      const summary = { processed: 5, failed: 0 };

      await processor["storeBatchSummaryInRedis"](uploadId, batchIndex, [
        summary,
      ]);

      expect(mockRedis.hset).toHaveBeenCalledWith(
        `batch:${uploadId}:summaries`,
        batchIndex.toString(),
        JSON.stringify([summary])
      );
    });
  });

  describe("checkAndEmitFinalSummary", () => {
    it("should emit final summary when all batches are complete", async () => {
      const uploadId = "batch-001";
      const totalBatches = 1;
      mockRedis.hlen.mockResolvedValue(1);
      mockRedis.hgetall.mockResolvedValue({ "0": "[]" });

      await processor["checkAndEmitFinalSummary"](
        uploadId,
        totalBatches,
        PROCESS_TYPE_ENUM.PAPER
      );

      expect(
        mockWebsocketService.emitBatchSummaryToWebSocket
      ).toHaveBeenCalled();
    });
  });

  describe("fetchCarrierVendor", () => {
    it("should fetch vendor by company and carrier ID", async () => {
      const companyNo = 1;
      const carrierId = "CAR001";
      const mockVendor = { vendorNo: 1001, vendorName: "Test Vendor" } as any;
      mockVendorService.getVendorNoByCompanyAndCarrierId.mockResolvedValue(
        mockVendor
      );

      const invoice = { companyNo, carrierId } as any;
      await processor["fetchCarrierVendor"](invoice);

      expect(
        mockVendorService.getVendorNoByCompanyAndCarrierId
      ).toHaveBeenCalledWith(companyNo, carrierId);
      expect(invoice.vendorNo).toBe(1001);
    });
  });

  describe("processAmountandGlNo", () => {
    it("should process amount and GL number correctly", async () => {
      const params = {
        companyNo: 1,
        ourOrderNo: 12345,
        shippingReferenceNo: 67890,
        ordShipDate: "01/01/24",
        invoiceAmount: 1000.0,
      };

      const result = await processor["processAmountandGlNo"](params, "FIMO");

      expect(result).toBeDefined();
    });
  });

  describe("processMiscFiles", () => {
    it("should process miscellaneous files correctly", async () => {
      const miscData = {
        type: "MISC",
        amount: 100,
        companyNo: 1,
        ourOrderNo: 12345,
        ordShipDate: "01/01/24",
        invoiceAmount: 100,
        shippingReferenceNo: 67890,
        apGlNo: 5000,
        orderNo: 12345,
      } as any;

      // Mock the SalesAnalysisMisc method to return data with tank property
      jest.spyOn(processor as any, "SalesAnalysisMisc").mockResolvedValue([
        {
          miscAmount: 50,
          miscQuantity: 1,
          product: "TEST",
          containerCd: "TEST",
          unitOfMeasure: "GAL",
          tank: "T1", // Add the required tank property
        },
      ]);

      const result = await processor["processMiscFiles"](miscData, "FIMO");

      expect(result).toBeDefined();
    });
  });

  describe("processAP1012", () => {
    it("should process AP1012 correctly", async () => {
      const ap1012Data = { type: "AP1012", amount: 200 } as any;

      const result = await processor["processAP1012"](ap1012Data);

      expect(result).toBeDefined();
    });
  });

  describe("findGeneralSystemGLNo", () => {
    it("should find general system GL number", async () => {
      const companyNo = 1;
      const glType = "AP";

      const result = await processor["findGeneralSystemGLNo"](
        glType,
        companyNo.toString()
      );

      expect(result).toBeDefined();
    });
  });
});
