import { Test, TestingModule } from "@nestjs/testing";
import { PaperBatchCreateUseCase } from "./paper-batch-create.usecase";
import { QueueSelector } from "@src/shared/config/queue-selector";
import { CompanyService } from "@src/main/account-payable/domain/services/company/companies.service";
import { VoucherSharedService } from "@src/main/account-payable/application/voucher/shared-services/voucher.shared.service";
import { InvoiceBatchProcessSharedService } from "@src/main/account-payable/application/voucher/shared-services/invoice-batch-process.shared.service";
import { CreateBatchRequestDto } from "../../dto/voucher.dto";

import { ProcessType } from "@src/shared/constants/strategy-type.enum";
import { PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";
import { BatchFactory } from "@src/shared/tests";

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

describe("PaperBatchCreateUseCase", () => {
  let useCase: PaperBatchCreateUseCase;

  let mockInvoiceBatchProcessSharedService: jest.Mocked<InvoiceBatchProcessSharedService>;

  const mockGetProcessTypeConfig = jest.requireMock(
    "@src/shared/config/process-config"
  ).getProcessTypeConfig;

  // Use factory methods for mock data
  const mockDto = BatchFactory.createPaperBatchCreateDto();
  const mockConfig = {
    expectedHeaders: ["header1", "header2", "header3"],
    batchSize: 100,
    // Add other config properties as needed
  };

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
        PaperBatchCreateUseCase,
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

    useCase = module.get<PaperBatchCreateUseCase>(PaperBatchCreateUseCase);

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
    it("should create paper batch successfully", async () => {
      // Arrange
      const userId = "user123";
      const mockOrchestratorResult = {
        batchId: "P-12345-uuid",
        totalBatches: 3,
        totalGroups: 2,
        parentJobId: "JOB001",
        childJobIds: ["CHILD001", "CHILD002"],
        groups: [
          {
            carrierId: "CAR001",
            carrierInvoiceNo: "INV001",
            ordShipDate: "2024-01-01",
            invoiceType: PROCESS_TYPE_ENUM.PAPER,
            ourOrderNo: 1001,
            shippingReferenceNo: 1,
            companyNo: 10,
          } as any,
          {
            carrierId: "CAR002",
            carrierInvoiceNo: "INV002",
            ordShipDate: "2024-01-02",
            invoiceType: PROCESS_TYPE_ENUM.PAPER,
            ourOrderNo: 1002,
            shippingReferenceNo: 2,
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
        message: `Paper batch create accepted, split into ${mockOrchestratorResult.totalBatches} batches`,
      });
      expect(mockGetProcessTypeConfig).toHaveBeenCalledWith(ProcessType.PAPER);
      expect(InvoiceBatchProcessSharedService).toHaveBeenCalled();
      expect(mockInvoiceBatchProcessSharedService.process).toHaveBeenCalled();
    });

    it("should create paper batch with single invoice", async () => {
      // Arrange
      const userId = "user456";
      const singleInvoiceDto: CreateBatchRequestDto = {
        ...mockDto,
        invoices: [
          {
            carrierId: "CAR001",
            carrierInvoiceNo: "INV001",
            ordShipDate: "2024-01-01",
            invoiceType: PROCESS_TYPE_ENUM.PAPER,
            ourOrderNo: 1001,
            shippingReferenceNo: 1,
            companyNo: 10,
          } as any,
        ],
      };
      const mockOrchestratorResult = {
        batchId: "P-12346-uuid",
        totalBatches: 1,
        totalGroups: 1,
        parentJobId: "JOB002",
        childJobIds: ["CHILD003"],
        groups: [
          {
            carrierId: "CAR001",
            carrierInvoiceNo: "INV001",
            ordShipDate: "2024-01-01",
            invoiceType: PROCESS_TYPE_ENUM.PAPER,
            ourOrderNo: 1001,
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
        message: `Paper batch create accepted, split into ${mockOrchestratorResult.totalBatches} batches`,
      });
      expect(mockGetProcessTypeConfig).toHaveBeenCalledWith(ProcessType.PAPER);
    });

    it("should create paper batch with large number of invoices", async () => {
      // Arrange
      const userId = "user789";
      const largeInvoiceDto: CreateBatchRequestDto = {
        ...mockDto,
        invoices: Array.from(
          { length: 50 },
          (_, i) =>
            ({
              carrierId: `CAR${String(i + 1).padStart(3, "0")}`,
              carrierInvoiceNo: `INV${String(i + 1).padStart(3, "0")}`,
              ordShipDate: "2024-01-01",
              invoiceType: PROCESS_TYPE_ENUM.PAPER,
              ourOrderNo: 1001 + i,
              shippingReferenceNo: i + 1,
              companyNo: 10,
            }) as any
        ),
      };
      const mockOrchestratorResult = {
        batchId: "P-12347-uuid",
        totalBatches: 10,
        totalGroups: 5,
        parentJobId: "JOB003",
        childJobIds: Array.from({ length: 10 }, (_, i) => `CHILD${i + 4}`),
        groups: Array.from(
          { length: 5 },
          (_, i) =>
            ({
              carrierId: `CAR${String(i + 1).padStart(3, "0")}`,
              carrierInvoiceNo: `INV${i + 1}`,
              ordShipDate: "2024-01-01",
              invoiceType: PROCESS_TYPE_ENUM.PAPER,
              ourOrderNo: 1001 + i,
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
        message: `Paper batch create accepted, split into ${mockOrchestratorResult.totalBatches} batches`,
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
      const orchestratorError = new Error("Orchestrator processing failed");

      mockGetProcessTypeConfig.mockReturnValue(mockConfig);
      mockInvoiceBatchProcessSharedService.process.mockRejectedValue(
        orchestratorError
      );

      // Act & Assert
      await expect(useCase.execute(userId, mockDto)).rejects.toThrow(
        "Orchestrator processing failed"
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
        batchId: "P-12348-uuid",
        totalBatches: 3,
        totalGroups: 2,
        parentJobId: "JOB004",
        childJobIds: ["CHILD014", "CHILD015"],
        groups: [
          {
            carrierId: "CAR001",
            carrierInvoiceNo: "INV001",
            ordShipDate: "2024-01-01",
            invoiceType: PROCESS_TYPE_ENUM.PAPER,
            ourOrderNo: 1001,
            shippingReferenceNo: 1,
            companyNo: 10,
          } as any,
          {
            carrierId: "CAR002",
            carrierInvoiceNo: "INV002",
            ordShipDate: "2024-01-02",
            invoiceType: PROCESS_TYPE_ENUM.PAPER,
            ourOrderNo: 1002,
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
        message: `Paper batch create accepted, split into ${mockOrchestratorResult.totalBatches} batches`,
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
        batchId: "P-12349-uuid",
        totalBatches: 2,
        totalGroups: 1,
        parentJobId: "JOB005",
        childJobIds: ["CHILD016"],
        groups: [
          {
            carrierId: "CAR001",
            carrierInvoiceNo: "INV001",
            ordShipDate: "2024-01-01",
            invoiceType: PROCESS_TYPE_ENUM.PAPER,
            ourOrderNo: 1001,
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
        message: `Paper batch create accepted, split into ${mockOrchestratorResult.totalBatches} batches`,
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
        batchId: "P-12350-uuid",
        totalBatches: 0,
        totalGroups: 0,
        parentJobId: "JOB006",
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
        message: `Paper batch create accepted, split into ${mockOrchestratorResult.totalBatches} batches`,
      });
      expect(mockGetProcessTypeConfig).toHaveBeenCalledWith(ProcessType.PAPER);
    });
  });
});
