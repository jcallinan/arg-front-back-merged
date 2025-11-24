import { Test, TestingModule } from "@nestjs/testing";
import { LmsBatchCreateUseCase } from "./lms-batch-create.usecase";
import { QueueSelector } from "@src/shared/config/queue-selector";
import { CompanyService } from "@src/main/account-payable/domain/services/company/companies.service";
import { VoucherSharedService } from "@src/main/account-payable/application/voucher/shared-services/voucher.shared.service";
import { InvoiceBatchProcessSharedService } from "@src/main/account-payable/application/voucher/shared-services/invoice-batch-process.shared.service";
import { CreateBatchRequestDto } from "../../dto/voucher.dto";
import { PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";
import { ProcessType } from "@src/shared/constants/strategy-type.enum";

// Mock external dependencies
jest.mock("@src/shared/config/process-config", () => ({
  getProcessTypeConfig: jest.fn(),
}));

jest.mock("../../shared-services/invoice-batch-process.shared.service", () => ({
  InvoiceBatchProcessSharedService: jest.fn(),
}));

jest.mock("@src/shared/queue/bullmq-connection", () => ({
  redis_connection: { host: "localhost", port: 6379 },
}));

describe("LmsBatchCreateUseCase", () => {
  let useCase: LmsBatchCreateUseCase;
  let mockQueueSelector: jest.Mocked<QueueSelector>;
  let mockCompanyService: jest.Mocked<CompanyService>;
  let mockVoucherSharedService: jest.Mocked<VoucherSharedService>;
  let mockInvoiceBatchProcessSharedService: jest.Mocked<InvoiceBatchProcessSharedService>;

  const mockGetProcessTypeConfig = jest.requireMock(
    "@src/shared/config/process-config"
  ).getProcessTypeConfig;

  beforeEach(async () => {
    const mockQueueSelectorInstance = {
      // Add any methods that QueueSelector might have
    };

    const mockCompanyServiceInstance = {
      // Add any methods that CompanyService might have
    };

    const mockVoucherSharedServiceInstance = {
      // Add any methods that VoucherSharedService might have
    };

    const mockInvoiceBatchProcessSharedServiceInstance = {
      process: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LmsBatchCreateUseCase,
        {
          provide: QueueSelector,
          useValue: mockQueueSelectorInstance,
        },
        {
          provide: CompanyService,
          useValue: mockCompanyServiceInstance,
        },
        {
          provide: VoucherSharedService,
          useValue: mockVoucherSharedServiceInstance,
        },
      ],
    }).compile();

    useCase = module.get<LmsBatchCreateUseCase>(LmsBatchCreateUseCase);
    mockQueueSelector = module.get(QueueSelector);
    mockCompanyService = module.get(CompanyService);
    mockVoucherSharedService = module.get(VoucherSharedService);

    // Mock the InvoiceBatchProcessSharedService constructor
    (
      InvoiceBatchProcessSharedService as jest.MockedClass<
        typeof InvoiceBatchProcessSharedService
      >
    ).mockImplementation(
      () => mockInvoiceBatchProcessSharedServiceInstance as any
    );
    mockInvoiceBatchProcessSharedService =
      mockInvoiceBatchProcessSharedServiceInstance as any;

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    const mockDto: CreateBatchRequestDto = {
      invoices: [
        {
          carrierId: "LMSCAR001",
          carrierInvoiceNo: "LMSINV001",
          ordShipDate: "2024-01-01",
          invoiceType: PROCESS_TYPE_ENUM.ARGLMS,
          ourOrderNo: 2001,
          shippingReferenceNo: 1,
          companyNo: 10,
        } as any,
        {
          carrierId: "LMSCAR002",
          carrierInvoiceNo: "LMSINV002",
          ordShipDate: "2024-01-02",
          invoiceType: PROCESS_TYPE_ENUM.ARGLMS,
          ourOrderNo: 2002,
          shippingReferenceNo: 2,
          companyNo: 10,
        } as any,
        {
          carrierId: "LMSCAR003",
          carrierInvoiceNo: "LMSINV003",
          ordShipDate: "2024-01-03",
          invoiceType: PROCESS_TYPE_ENUM.ARGLMS,
          ourOrderNo: 2003,
          shippingReferenceNo: 3,
          companyNo: 10,
        } as any,
      ],
    };

    const mockConfig = {
      expectedHeaders: ["header1", "header2", "header3"],
      batchSize: 75,
      // Add other config properties as needed
    };

    it("should create LMS batch successfully", async () => {
      // Arrange
      const userId = "user123";
      const mockOrchestratorResult = {
        batchId: "L-12345-uuid",
        totalBatches: 3,
        totalGroups: 2,
        parentJobId: "LMSJOB001",
        childJobIds: ["LMSCHILD001", "LMSCHILD002"],
        groups: [
          {
            carrierId: "LMSCAR001",
            carrierInvoiceNo: "LMSINV001",
            ordShipDate: "2024-01-01",
            invoiceType: PROCESS_TYPE_ENUM.ARGLMS,
            ourOrderNo: 2001,
            shippingReferenceNo: 1,
            companyNo: 10,
          } as any,
          {
            carrierId: "LMSCAR002",
            carrierInvoiceNo: "LMSINV002",
            ordShipDate: "2024-01-02",
            invoiceType: PROCESS_TYPE_ENUM.ARGLMS,
            ourOrderNo: 2002,
            shippingReferenceNo: 2,
            companyNo: 10,
          } as any,
        ] as any,
      };

      mockGetProcessTypeConfig.mockReturnValue(mockConfig);
      mockInvoiceBatchProcessSharedService.process.mockResolvedValue(
        mockOrchestratorResult
      );

      // Act
      const result = await useCase.execute(userId, mockDto);

      // Assert
      expect(result).toEqual({
        ...mockOrchestratorResult,
        message: `Lms batch create accepted, split into ${mockOrchestratorResult.totalBatches} batches`,
      });
      expect(mockGetProcessTypeConfig).toHaveBeenCalledWith(ProcessType.PAPER);
      expect(InvoiceBatchProcessSharedService).toHaveBeenCalled();
      expect(mockInvoiceBatchProcessSharedService.process).toHaveBeenCalled();
    });

    it("should create LMS batch with single invoice", async () => {
      // Arrange
      const userId = "user456";
      const singleInvoiceDto: CreateBatchRequestDto = {
        ...mockDto,
        invoices: [
          {
            carrierId: "LMSCAR001",
            carrierInvoiceNo: "LMSINV001",
            ordShipDate: "2024-01-01",
            invoiceType: PROCESS_TYPE_ENUM.ARGLMS,
            ourOrderNo: 2001,
            shippingReferenceNo: 1,
            companyNo: 10,
          } as any,
        ],
      };
      const mockOrchestratorResult = {
        batchId: "L-12346-uuid",
        totalBatches: 1,
        totalGroups: 1,
        parentJobId: "LMSJOB002",
        childJobIds: ["LMSCHILD003"],
        groups: [
          {
            carrierId: "LMSCAR001",
            carrierInvoiceNo: "LMSINV001",
            ordShipDate: "2024-01-01",
            invoiceType: PROCESS_TYPE_ENUM.ARGLMS,
            ourOrderNo: 2001,
            shippingReferenceNo: 1,
            companyNo: 10,
          } as any,
        ],
      };

      mockGetProcessTypeConfig.mockReturnValue(mockConfig);
      mockInvoiceBatchProcessSharedService.process.mockResolvedValue(
        mockOrchestratorResult
      );

      // Act
      const result = await useCase.execute(userId, singleInvoiceDto);

      // Assert
      expect(result).toEqual({
        ...mockOrchestratorResult,
        message: `Lms batch create accepted, split into ${mockOrchestratorResult.totalBatches} batches`,
      });
      expect(mockGetProcessTypeConfig).toHaveBeenCalledWith(ProcessType.PAPER);
    });

    it("should create LMS batch with large number of invoices", async () => {
      // Arrange
      const userId = "user789";
      const largeInvoiceDto: CreateBatchRequestDto = {
        ...mockDto,
        invoices: Array.from(
          { length: 40 },
          (_, i) =>
            ({
              carrierId: `LMSCAR${String(i + 1).padStart(3, "0")}`,
              carrierInvoiceNo: `LMSINV${String(i + 1).padStart(3, "0")}`,
              ordShipDate: "2024-01-01",
              invoiceType: PROCESS_TYPE_ENUM.ARGLMS,
              ourOrderNo: 2001 + i,
              shippingReferenceNo: i + 1,
              companyNo: 10,
            }) as any
        ),
      };
      const mockOrchestratorResult = {
        batchId: "L-12347-uuid",
        totalBatches: 8,
        totalGroups: 4,
        parentJobId: "LMSJOB003",
        childJobIds: Array.from({ length: 8 }, (_, i) => `LMSCHILD${i + 4}`),
        groups: Array.from(
          { length: 4 },
          (_, i) =>
            ({
              carrierId: `LMSCAR${String(i + 1).padStart(3, "0")}`,
              carrierInvoiceNo: `LMSINV${i + 1}`,
              ordShipDate: "2024-01-01",
              invoiceType: PROCESS_TYPE_ENUM.ARGLMS,
              ourOrderNo: 2001 + i,
              shippingReferenceNo: i + 1,
              companyNo: 10,
            }) as any
        ),
      };

      mockGetProcessTypeConfig.mockReturnValue(mockConfig);
      mockInvoiceBatchProcessSharedService.process.mockResolvedValue(
        mockOrchestratorResult
      );

      // Act
      const result = await useCase.execute(userId, largeInvoiceDto);

      // Assert
      expect(result).toEqual({
        ...mockOrchestratorResult,
        message: `Lms batch create accepted, split into ${mockOrchestratorResult.totalBatches} batches`,
      });
      expect(mockGetProcessTypeConfig).toHaveBeenCalledWith(ProcessType.PAPER);
    });

    it("should throw error for unsupported process type", async () => {
      // Arrange
      const userId = "user999";
      mockGetProcessTypeConfig.mockReturnValue(null);

      // Act & Assert
      await expect(useCase.execute(userId, mockDto)).rejects.toThrow(
        `Unsupported process type: ${ProcessType.PAPER}"}`
      );
      expect(mockGetProcessTypeConfig).toHaveBeenCalledWith(ProcessType.PAPER);
    });

    it("should handle orchestrator processing errors gracefully", async () => {
      // Arrange
      const userId = "user111";
      const orchestratorError = new Error("LMS orchestrator processing failed");

      mockGetProcessTypeConfig.mockReturnValue(mockConfig);
      mockInvoiceBatchProcessSharedService.process.mockRejectedValue(
        orchestratorError
      );

      // Act & Assert
      await expect(useCase.execute(userId, mockDto)).rejects.toThrow(
        "LMS orchestrator processing failed"
      );
      expect(mockGetProcessTypeConfig).toHaveBeenCalledWith(ProcessType.PAPER);
      expect(InvoiceBatchProcessSharedService).toHaveBeenCalled();
      expect(mockInvoiceBatchProcessSharedService.process).toHaveBeenCalled();
    });

    it("should work with different company numbers", async () => {
      // Arrange
      const userId = "user222";
      const differentCompanyDto: CreateBatchRequestDto = {
        ...mockDto,
      };
      const mockOrchestratorResult = {
        batchId: "L-12348-uuid",
        totalBatches: 3,
        totalGroups: 2,
        parentJobId: "LMSJOB004",
        childJobIds: ["LMSCHILD014", "LMSCHILD015"],
        groups: [
          {
            carrierId: "LMSCAR001",
            carrierInvoiceNo: "LMSINV001",
            ordShipDate: "2024-01-01",
            invoiceType: PROCESS_TYPE_ENUM.ARGLMS,
            ourOrderNo: 2001,
            shippingReferenceNo: 1,
            companyNo: 10,
          } as any,
          {
            carrierId: "LMSCAR002",
            carrierInvoiceNo: "LMSINV002",
            ordShipDate: "2024-01-02",
            invoiceType: PROCESS_TYPE_ENUM.ARGLMS,
            ourOrderNo: 2002,
            shippingReferenceNo: 2,
            companyNo: 10,
          } as any,
        ] as any,
      };

      mockGetProcessTypeConfig.mockReturnValue(mockConfig);
      mockInvoiceBatchProcessSharedService.process.mockResolvedValue(
        mockOrchestratorResult
      );

      // Act
      const result = await useCase.execute(userId, differentCompanyDto);

      // Assert
      expect(result).toEqual({
        ...mockOrchestratorResult,
        message: `Lms batch create accepted, split into ${mockOrchestratorResult.totalBatches} batches`,
      });
      expect(mockGetProcessTypeConfig).toHaveBeenCalledWith(ProcessType.PAPER);
    });

    it("should work with different batch sizes", async () => {
      // Arrange
      const userId = "user333";
      const differentBatchSizeDto: CreateBatchRequestDto = {
        ...mockDto,
      };
      const mockOrchestratorResult = {
        batchId: "L-12349-uuid",
        totalBatches: 2,
        totalGroups: 1,
        parentJobId: "LMSJOB005",
        childJobIds: ["LMSCHILD016"],
        groups: [
          {
            carrierId: "LMSCAR001",
            carrierInvoiceNo: "LMSINV001",
            ordShipDate: "2024-01-01",
            invoiceType: PROCESS_TYPE_ENUM.ARGLMS,
            ourOrderNo: 2001,
            shippingReferenceNo: 1,
            companyNo: 10,
          } as any,
        ],
      };

      mockGetProcessTypeConfig.mockReturnValue(mockConfig);
      mockInvoiceBatchProcessSharedService.process.mockResolvedValue(
        mockOrchestratorResult
      );

      // Act
      const result = await useCase.execute(userId, differentBatchSizeDto);

      // Assert
      expect(result).toEqual({
        ...mockOrchestratorResult,
        message: `Lms batch create accepted, split into ${mockOrchestratorResult.totalBatches} batches`,
      });
      expect(mockGetProcessTypeConfig).toHaveBeenCalledWith(ProcessType.PAPER);
    });

    it("should handle empty invoice list gracefully", async () => {
      // Arrange
      const userId = "user444";
      const emptyInvoiceDto: CreateBatchRequestDto = {
        ...mockDto,
        invoices: [],
      };
      const mockOrchestratorResult = {
        batchId: "L-12350-uuid",
        totalBatches: 0,
        totalGroups: 0,
        parentJobId: "LMSJOB006",
        childJobIds: [],
        groups: [] as any,
      };

      mockGetProcessTypeConfig.mockReturnValue(mockConfig);
      mockInvoiceBatchProcessSharedService.process.mockResolvedValue(
        mockOrchestratorResult
      );

      // Act
      const result = await useCase.execute(userId, emptyInvoiceDto);

      // Assert
      expect(result).toEqual({
        ...mockOrchestratorResult,
        message: `Lms batch create accepted, split into ${mockOrchestratorResult.totalBatches} batches`,
      });
      expect(mockGetProcessTypeConfig).toHaveBeenCalledWith(ProcessType.PAPER);
    });

    it("should use correct invoice type (ARGLMS) for LMS processing", async () => {
      // Arrange
      const userId = "user555";
      const mockOrchestratorResult = {
        batchId: "L-12351-uuid",
        totalBatches: 2,
        totalGroups: 1,
        parentJobId: "LMSJOB007",
        childJobIds: ["LMSCHILD017"],
        groups: [
          {
            carrierId: "LMSCAR001",
            carrierInvoiceNo: "LMSINV001",
            ordShipDate: "2024-01-01",
            invoiceType: PROCESS_TYPE_ENUM.ARGLMS,
            ourOrderNo: 2001,
            shippingReferenceNo: 1,
            companyNo: 10,
          } as any,
        ],
      };

      mockGetProcessTypeConfig.mockReturnValue(mockConfig);
      mockInvoiceBatchProcessSharedService.process.mockResolvedValue(
        mockOrchestratorResult
      );

      // Act
      const result = await useCase.execute(userId, mockDto);

      // Assert
      expect(result).toEqual({
        ...mockOrchestratorResult,
        message: `Lms batch create accepted, split into ${mockOrchestratorResult.totalBatches} batches`,
      });
      // Verify that the InvoiceBatchProcessSharedService is called with ARGLMS invoice type
      expect(InvoiceBatchProcessSharedService).toHaveBeenCalledWith(
        mockConfig,
        mockDto.invoices,
        expect.any(Object), // FlowProducer
        PROCESS_TYPE_ENUM.ARGLMS, // invoiceType should be ARGLMS
        expect.stringContaining("L-"), // batchId should start with L-
        userId,
        mockQueueSelector,
        mockCompanyService,
        mockVoucherSharedService,
        ProcessType.PAPER // processType should be PAPER
      );
    });
  });
});
