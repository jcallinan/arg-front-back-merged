import { Test, TestingModule } from "@nestjs/testing";
import { VoucherCsvUploadUseCase } from "./upload-csv.usecase";
import { QueueSelector } from "@src/shared/config/queue-selector";
import { CompanyService } from "@src/main/account-payable/domain/services/company/companies.service";
import { VoucherSharedService } from "@src/main/account-payable/application/voucher/shared-services/voucher.shared.service";
import { VoucherCleanupService } from "@src/main/account-payable/application/voucher/shared-services/voucher-cleanup.service";
import { UploadOrchestrator } from "../orchestrator/upload.orchestrator";
import { ProcessType } from "@src/shared/constants/strategy-type.enum";
import { UploadFactory } from "@src/shared/tests";

// Mock external dependencies
jest.mock("@src/shared/utils/xlsx.utils", () => ({
  validateXlsxHeaderOrder: jest.fn(),
}));

jest.mock("@src/shared/config/process-config", () => ({
  getProcessTypeConfig: jest.fn(),
}));

jest.mock("../orchestrator/upload.orchestrator", () => ({
  UploadOrchestrator: jest.fn(),
}));

jest.mock("@src/shared/queue/bullmq-connection", () => ({
  redis_connection: { host: "localhost", port: 6379 },
}));

describe("VoucherCsvUploadUseCase", () => {
  let useCase: VoucherCsvUploadUseCase;

  let mockVoucherCleanupService: jest.Mocked<VoucherCleanupService>;
  let mockUploadOrchestrator: jest.Mocked<UploadOrchestrator>;

  const mockValidateXlsxHeaderOrder = jest.requireMock(
    "@src/shared/utils/xlsx.utils"
  ).validateXlsxHeaderOrder;
  const mockGetProcessTypeConfig = jest.requireMock(
    "@src/shared/config/process-config"
  ).getProcessTypeConfig;

  // Use factory methods for mock data
  const mockFile = UploadFactory.createFlexiUploadFile();
  const mockConfig = UploadFactory.createUploadConfig();
  const mockOrchestratorResult = UploadFactory.createUploadOrchestratorResult();
  const mockCleanupResult = UploadFactory.createUploadCleanupResult();

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

    const mockVoucherCleanupServiceInstance = {
      cleanupExistingRecords: jest.fn(),
    };

    const mockUploadOrchestratorInstance = {
      process: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoucherCsvUploadUseCase,
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
        {
          provide: VoucherCleanupService,
          useValue: mockVoucherCleanupServiceInstance,
        },
      ],
    }).compile();

    useCase = module.get<VoucherCsvUploadUseCase>(VoucherCsvUploadUseCase);
    mockVoucherCleanupService = module.get(VoucherCleanupService);

    // Mock the UploadOrchestrator constructor
    (
      UploadOrchestrator as jest.MockedClass<typeof UploadOrchestrator>
    ).mockImplementation(() => mockUploadOrchestratorInstance as any);
    mockUploadOrchestrator = mockUploadOrchestratorInstance as any;

    // Clear all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("should process FLEXI CSV upload successfully", async () => {
      // Arrange
      const userId = "user123";
      const uploadType = ProcessType.FLEXI;

      mockGetProcessTypeConfig.mockReturnValue(mockConfig);
      mockValidateXlsxHeaderOrder.mockImplementation(() => {});
      mockVoucherCleanupService.cleanupExistingRecords.mockResolvedValue({
        deletedHeaders: mockCleanupResult.deletedHeaders!,
        deletedDetails: mockCleanupResult.deletedDetails!,
      });
      mockUploadOrchestrator.process.mockResolvedValue({
        uploadId: mockOrchestratorResult.uploadId!,
        totalBatches: mockOrchestratorResult.totalBatches!,
        totalGroups: mockOrchestratorResult.totalGroups!,
        parentJobId: mockOrchestratorResult.parentJobId!,
        childJobIds: mockOrchestratorResult.childJobIds!,
        groups: mockOrchestratorResult.groups!,
      });

      // Act
      const result = await useCase.execute(userId, uploadType, mockFile);

      // Assert
      expect(result).toEqual({
        uploadId: mockOrchestratorResult.uploadId!,
        totalBatches: mockOrchestratorResult.totalBatches!,
        totalGroups: mockOrchestratorResult.totalGroups!,
        parentJobId: mockOrchestratorResult.parentJobId!,
        childJobIds: mockOrchestratorResult.childJobIds!,
        groups: mockOrchestratorResult.groups!,
        message: "flexi CSV accepted, split into batches",
      });
      expect(mockGetProcessTypeConfig).toHaveBeenCalledWith(
        uploadType,
        undefined
      );
      expect(mockValidateXlsxHeaderOrder).toHaveBeenCalledWith(
        mockFile.path,
        mockConfig.expectedHeaders
      );
      expect(
        mockVoucherCleanupService.cleanupExistingRecords
      ).toHaveBeenCalledWith(uploadType, 10);
      expect(UploadOrchestrator).toHaveBeenCalled();
      expect(mockUploadOrchestrator.process).toHaveBeenCalled();
    });

    it("should process SOGAS CSV upload with subtype successfully", async () => {
      // Arrange
      const userId = "user456";
      const uploadType = ProcessType.SOGAS;
      const subType = "subtype1";
      const sogasOrchestratorResult =
        UploadFactory.createUploadOrchestratorResult({
          uploadId: "U-12346-uuid",
          totalBatches: 3,
          totalGroups: 2,
          parentJobId: "JOB002",
          childJobIds: ["CHILD003", "CHILD004"],
        });

      mockGetProcessTypeConfig.mockReturnValue(mockConfig);
      mockValidateXlsxHeaderOrder.mockImplementation(() => {});
      mockVoucherCleanupService.cleanupExistingRecords.mockResolvedValue({
        deletedHeaders: mockCleanupResult.deletedHeaders!,
        deletedDetails: mockCleanupResult.deletedDetails!,
      });
      mockUploadOrchestrator.process.mockResolvedValue({
        uploadId: sogasOrchestratorResult.uploadId!,
        totalBatches: sogasOrchestratorResult.totalBatches!,
        totalGroups: sogasOrchestratorResult.totalGroups!,
        parentJobId: sogasOrchestratorResult.parentJobId!,
        childJobIds: sogasOrchestratorResult.childJobIds!,
        groups: sogasOrchestratorResult.groups!,
      });

      // Act
      const result = await useCase.execute(
        userId,
        uploadType,
        mockFile,
        subType
      );

      // Assert
      expect(result).toEqual({
        uploadId: sogasOrchestratorResult.uploadId!,
        totalBatches: sogasOrchestratorResult.totalBatches!,
        totalGroups: sogasOrchestratorResult.totalGroups!,
        parentJobId: sogasOrchestratorResult.parentJobId!,
        childJobIds: sogasOrchestratorResult.childJobIds!,
        groups: sogasOrchestratorResult.groups!,
        message: "sogas (subtype1) CSV accepted, split into batches",
      });
      expect(mockGetProcessTypeConfig).toHaveBeenCalledWith(
        uploadType,
        subType
      );
      expect(mockValidateXlsxHeaderOrder).toHaveBeenCalledWith(
        mockFile.path,
        mockConfig.expectedHeaders
      );
      expect(
        mockVoucherCleanupService.cleanupExistingRecords
      ).toHaveBeenCalledWith(uploadType, 10);
      expect(UploadOrchestrator).toHaveBeenCalled();
      expect(mockUploadOrchestrator.process).toHaveBeenCalled();
    });

    it("should throw error for unsupported upload type", async () => {
      // Arrange
      const userId = "user789";
      const uploadType = "unsupported";
      const mockFile = UploadFactory.createFlexiUploadFile();

      mockGetProcessTypeConfig.mockReturnValue(null);

      // Act & Assert
      await expect(
        useCase.execute(userId, uploadType, mockFile)
      ).rejects.toThrow("Unsupported upload type or subtype: unsupported");
      expect(mockGetProcessTypeConfig).toHaveBeenCalledWith(
        uploadType,
        undefined
      );
    });

    it("should throw error for unsupported upload type with subtype", async () => {
      // Arrange
      const userId = "user999";
      const uploadType = "invalid";
      const subType = "invalid-subtype";
      const mockFile = UploadFactory.createFlexiUploadFile();

      mockGetProcessTypeConfig.mockReturnValue(null);

      // Act & Assert
      await expect(
        useCase.execute(userId, uploadType, mockFile, subType)
      ).rejects.toThrow(
        "Unsupported upload type or subtype: invalid / invalid-subtype"
      );
      expect(mockGetProcessTypeConfig).toHaveBeenCalledWith(
        uploadType,
        subType
      );
    });

    it("should handle cleanup service errors gracefully", async () => {
      // Arrange
      const userId = "user111";
      const uploadType = ProcessType.FLEXI;
      const cleanupError = new Error("Cleanup failed");

      mockGetProcessTypeConfig.mockReturnValue(mockConfig);
      mockValidateXlsxHeaderOrder.mockImplementation(() => {});
      mockVoucherCleanupService.cleanupExistingRecords.mockRejectedValue(
        cleanupError
      );

      // Act & Assert
      await expect(
        useCase.execute(userId, uploadType, mockFile)
      ).rejects.toThrow("Cleanup failed");
      expect(
        mockVoucherCleanupService.cleanupExistingRecords
      ).toHaveBeenCalledWith(uploadType, 10);
    });

    it("should handle orchestrator processing errors", async () => {
      // Arrange
      const userId = "user222";
      const uploadType = ProcessType.FLEXI;
      const orchestratorError = new Error("Orchestrator processing failed");

      mockGetProcessTypeConfig.mockReturnValue(mockConfig);
      mockValidateXlsxHeaderOrder.mockImplementation(() => {});
      mockVoucherCleanupService.cleanupExistingRecords.mockResolvedValue({
        deletedHeaders: mockCleanupResult.deletedHeaders!,
        deletedDetails: mockCleanupResult.deletedDetails!,
      });
      mockUploadOrchestrator.process.mockRejectedValue(orchestratorError);

      // Act & Assert
      await expect(
        useCase.execute(userId, uploadType, mockFile)
      ).rejects.toThrow("Orchestrator processing failed");
      expect(mockUploadOrchestrator.process).toHaveBeenCalled();
    });

    it("should handle header validation errors", async () => {
      // Arrange
      const userId = "user333";
      const uploadType = ProcessType.FLEXI;
      const validationError = new Error("Invalid header format");

      mockGetProcessTypeConfig.mockReturnValue(mockConfig);
      mockValidateXlsxHeaderOrder.mockImplementation(() => {
        throw validationError;
      });

      // Act & Assert
      await expect(
        useCase.execute(userId, uploadType, mockFile)
      ).rejects.toThrow("Invalid header format");
      expect(mockValidateXlsxHeaderOrder).toHaveBeenCalledWith(
        mockFile.path,
        mockConfig.expectedHeaders
      );
    });
  });
});
