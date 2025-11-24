import { Test, TestingModule } from "@nestjs/testing";
import { OpenPayablesUsecase } from "./open-payable.usecase";
import { PurchaseJournalService } from "@src/main/account-payable/domain/services/purchase-journal/purchase-journal.service";
import { purchaseJournalReportDto } from "../../../purchase-journal/dto/purchase-journal.dto";
import { SpooledMetaDataReportEntity } from "@src/main/account-payable/domain/entities/spooled-meta-data-report.entity";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import { OPEN_PAYABLES_TYPES } from "@src/shared/constants/constant";

describe("OpenPayablesUsecase", () => {
  let usecase: OpenPayablesUsecase;
  let mockPurchaseJournalService: jest.Mocked<PurchaseJournalService>;

  const mockSpooledMetaDataReport: SpooledMetaDataReportEntity = {
    pdfFileName: "test-report.pdf",
    spoolFileName: "test-report.spool",
    reportType: "Open-Payables-By-Due-Date",
    jobName: "AP700PRC",
    jobNumber: 12345,
    jobUser: "SYSTEM",
    jobSystemName: "AS400",
    filePath: "/path/to/file",
    outputQueueName: "OUTQ",
    outputQueueLibrary: "LIB",
    reportDateTime: new Date(),
    formType: "PDF",
    error: "",
  };

  const mockPaginatedResponse: PaginatedResponse<SpooledMetaDataReportEntity> =
    {
      items: [mockSpooledMetaDataReport],
      pagination: {
        total_items: 1,
        current_page: 1,
        items_per_page: 10,
        total_pages: 1,
      },
    };

  beforeEach(async () => {
    const mockPurchaseJournalServiceProvider = {
      provide: PurchaseJournalService,
      useValue: {
        SpooledMetadataReports: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenPayablesUsecase, mockPurchaseJournalServiceProvider],
    }).compile();

    usecase = module.get<OpenPayablesUsecase>(OpenPayablesUsecase);
    mockPurchaseJournalService = module.get(PurchaseJournalService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("should execute with default report types when no reportType provided", async () => {
      // Arrange
      const inputDto: purchaseJournalReportDto = {
        current_page: 1,
        items_per_page: 10,
      };
      const expectedReportTypes = [
        OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_DUE_DATE,
        OPEN_PAYABLES_TYPES.OPEN_PAYABLES_IN_HOLD_STATUS,
        OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_VENDOR_DISCOUNTS,
        OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_VENDOR_AGED,
      ];

      mockPurchaseJournalService.SpooledMetadataReports.mockResolvedValue(
        mockPaginatedResponse
      );

      // Act
      const result = await usecase.execute(inputDto);

      // Assert
      expect(inputDto.reportType).toEqual(expectedReportTypes);
      expect(
        mockPurchaseJournalService.SpooledMetadataReports
      ).toHaveBeenCalledWith(inputDto);
      expect(result).toEqual(mockPaginatedResponse);
    });

    it("should execute with provided report types", async () => {
      // Arrange
      const inputDto: purchaseJournalReportDto = {
        reportType: ["Open-Payables-By-Due-Date"],
        current_page: 1,
        items_per_page: 10,
      };

      mockPurchaseJournalService.SpooledMetadataReports.mockResolvedValue(
        mockPaginatedResponse
      );

      // Act
      const result = await usecase.execute(inputDto);

      // Assert
      expect(inputDto.reportType).toEqual(["Open-Payables-By-Due-Date"]);
      expect(
        mockPurchaseJournalService.SpooledMetadataReports
      ).toHaveBeenCalledWith(inputDto);
      expect(result).toEqual(mockPaginatedResponse);
    });

    it("should execute with multiple provided report types", async () => {
      // Arrange
      const inputDto: purchaseJournalReportDto = {
        reportType: [
          "Open-Payables-By-Due-Date",
          "Open-Payables-in-Hold-Status",
        ],
        current_page: 1,
        items_per_page: 10,
      };

      mockPurchaseJournalService.SpooledMetadataReports.mockResolvedValue(
        mockPaginatedResponse
      );

      // Act
      const result = await usecase.execute(inputDto);

      // Assert
      expect(inputDto.reportType).toEqual([
        "Open-Payables-By-Due-Date",
        "Open-Payables-in-Hold-Status",
      ]);
      expect(
        mockPurchaseJournalService.SpooledMetadataReports
      ).toHaveBeenCalledWith(inputDto);
      expect(result).toEqual(mockPaginatedResponse);
    });

    it("should execute with all query parameters", async () => {
      // Arrange
      const inputDto: purchaseJournalReportDto = {
        reportType: ["Open-Payables-By-Due-Date"],
        fileName: "test-report",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        current_page: 2,
        items_per_page: 20,
      };

      mockPurchaseJournalService.SpooledMetadataReports.mockResolvedValue(
        mockPaginatedResponse
      );

      // Act
      const result = await usecase.execute(inputDto);

      // Assert
      expect(
        mockPurchaseJournalService.SpooledMetadataReports
      ).toHaveBeenCalledWith(inputDto);
      expect(result).toEqual(mockPaginatedResponse);
    });

    it("should handle service errors gracefully", async () => {
      // Arrange
      const inputDto: purchaseJournalReportDto = {
        reportType: ["Open-Payables-By-Due-Date"],
      };
      const error = new Error("Service error");
      mockPurchaseJournalService.SpooledMetadataReports.mockRejectedValue(
        error
      );

      // Act & Assert
      await expect(usecase.execute(inputDto)).rejects.toThrow("Service error");
      expect(
        mockPurchaseJournalService.SpooledMetadataReports
      ).toHaveBeenCalledWith(inputDto);
    });

    it("should handle empty input dto", async () => {
      // Arrange
      const inputDto: purchaseJournalReportDto = {};
      const expectedReportTypes = [
        OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_DUE_DATE,
        OPEN_PAYABLES_TYPES.OPEN_PAYABLES_IN_HOLD_STATUS,
        OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_VENDOR_DISCOUNTS,
        OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_VENDOR_AGED,
      ];

      mockPurchaseJournalService.SpooledMetadataReports.mockResolvedValue(
        mockPaginatedResponse
      );

      // Act
      const result = await usecase.execute(inputDto);

      // Assert
      expect(inputDto.reportType).toEqual(expectedReportTypes);
      expect(
        mockPurchaseJournalService.SpooledMetadataReports
      ).toHaveBeenCalledWith(inputDto);
      expect(result).toEqual(mockPaginatedResponse);
    });

    it("should preserve existing report types when provided", async () => {
      // Arrange
      const inputDto: purchaseJournalReportDto = {
        reportType: ["Custom-Report-Type"],
        current_page: 1,
        items_per_page: 10,
      };

      mockPurchaseJournalService.SpooledMetadataReports.mockResolvedValue(
        mockPaginatedResponse
      );

      // Act
      const result = await usecase.execute(inputDto);

      // Assert
      expect(inputDto.reportType).toEqual(["Custom-Report-Type"]);
      expect(
        mockPurchaseJournalService.SpooledMetadataReports
      ).toHaveBeenCalledWith(inputDto);
      expect(result).toEqual(mockPaginatedResponse);
    });
  });

  describe("usecase initialization", () => {
    it("should be defined", () => {
      expect(usecase).toBeDefined();
    });

    it("should have required dependencies injected", () => {
      expect(usecase["purchaseJournalService"]).toBeDefined();
    });

    it("should have logger initialized", () => {
      expect(usecase["logger"]).toBeDefined();
    });
  });
});
