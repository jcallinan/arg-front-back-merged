import { Test, TestingModule } from "@nestjs/testing";
import { OpenPayablesController } from "./open-payables.controller";
import { OpenPayablesUsecase } from "../usecases/open-payable/open-payable.usecase";
import { OpenPayablesReportGeneratorUseCase } from "../usecases/open-payable-report-generator/open-payable-report-generator.usecase";
import { purchaseJournalReportDto } from "../../purchase-journal/dto/purchase-journal.dto";
import { generateReportDto } from "../dto/open-payables.dto";
import { SpooledMetaDataReportEntity } from "@src/main/account-payable/domain/entities/spooled-meta-data-report.entity";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import { OPEN_PAYABLES_TYPES } from "@src/shared/constants/constant";

describe("OpenPayablesController", () => {
  let controller: OpenPayablesController;
  let mockOpenPayablesUsecase: jest.Mocked<OpenPayablesUsecase>;
  let mockOpenPayablesReportGeneratorUseCase: jest.Mocked<OpenPayablesReportGeneratorUseCase>;

  const mockSpooledMetaDataReport: SpooledMetaDataReportEntity = {
    pdfFileName: "test-report.pdf",
    spoolFileName: "test-report.spool",
    reportType: OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_DUE_DATE,
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

  const mockGenerateReportResponse = {
    message: "OpenPayable report generated successfully",
    spresult: { success: true, reportId: "123" },
  };

  beforeEach(async () => {
    const mockOpenPayablesUsecaseProvider = {
      provide: OpenPayablesUsecase,
      useValue: {
        execute: jest.fn(),
      },
    };

    const mockOpenPayablesReportGeneratorUseCaseProvider = {
      provide: OpenPayablesReportGeneratorUseCase,
      useValue: {
        execute: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpenPayablesController],
      providers: [
        mockOpenPayablesUsecaseProvider,
        mockOpenPayablesReportGeneratorUseCaseProvider,
      ],
    }).compile();

    controller = module.get<OpenPayablesController>(OpenPayablesController);
    mockOpenPayablesUsecase = module.get(OpenPayablesUsecase);
    mockOpenPayablesReportGeneratorUseCase = module.get(
      OpenPayablesReportGeneratorUseCase
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("openPayableReport", () => {
    it("should return paginated open payables report", async () => {
      // Arrange
      const queryDto: purchaseJournalReportDto = {
        reportType: [OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_DUE_DATE],
        current_page: 1,
        items_per_page: 10,
      };
      mockOpenPayablesUsecase.execute.mockResolvedValue(mockPaginatedResponse);

      // Act
      const result = await controller.openPayableReport(queryDto);

      // Assert
      expect(mockOpenPayablesUsecase.execute).toHaveBeenCalledWith(queryDto);
      expect(result).toEqual(mockPaginatedResponse);
      expect(result.items).toHaveLength(1);
      expect(result.pagination.total_items).toBe(1);
    });

    it("should handle empty query parameters", async () => {
      // Arrange
      const queryDto: purchaseJournalReportDto = {};
      mockOpenPayablesUsecase.execute.mockResolvedValue(mockPaginatedResponse);

      // Act
      const result = await controller.openPayableReport(queryDto);

      // Assert
      expect(mockOpenPayablesUsecase.execute).toHaveBeenCalledWith(queryDto);
      expect(result).toEqual(mockPaginatedResponse);
    });

    it("should handle query with all parameters", async () => {
      // Arrange
      const queryDto: purchaseJournalReportDto = {
        reportType: [
          OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_DUE_DATE,
          OPEN_PAYABLES_TYPES.OPEN_PAYABLES_IN_HOLD_STATUS,
        ],
        fileName: "test-report",
        startDate: "010124", // MMDDYY format - January 1, 2024
        endDate: "123124", // MMDDYY format - December 31, 2024
        current_page: 2,
        items_per_page: 20,
      };
      mockOpenPayablesUsecase.execute.mockResolvedValue(mockPaginatedResponse);

      // Act
      const result = await controller.openPayableReport(queryDto);

      // Assert
      expect(mockOpenPayablesUsecase.execute).toHaveBeenCalledWith(queryDto);
      expect(result).toEqual(mockPaginatedResponse);
    });

    it("should handle usecase errors gracefully", async () => {
      // Arrange
      const queryDto: purchaseJournalReportDto = {
        reportType: ["Open-Payables-By-Due-Date"],
      };
      const error = new Error("Database connection failed");
      mockOpenPayablesUsecase.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.openPayableReport(queryDto)).rejects.toThrow(
        "Database connection failed"
      );
      expect(mockOpenPayablesUsecase.execute).toHaveBeenCalledWith(queryDto);
    });
  });

  describe("submitPurchaseJournal", () => {
    it("should generate open payables report successfully", async () => {
      // Arrange
      const bodyDto: generateReportDto = {
        companyNo: 10,
        openPayables: OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_DUE_DATE,
        holdVoucher: "N",
        dateOne: new Date("2024-01-01"), // Keep as Date object for internal processing
        dateTwo: "013124", // MMDDYY format - January 31, 2024
        dateThree: "020124", // MMDDYY format - February 1, 2024
        dateFour: "022824", // MMDDYY format - February 28, 2024
        populateSpreadsheet: "Y",
      };
      mockOpenPayablesReportGeneratorUseCase.execute.mockResolvedValue(
        mockGenerateReportResponse
      );

      // Act
      const result = await controller.submitPurchaseJournal(bodyDto);

      // Assert
      expect(
        mockOpenPayablesReportGeneratorUseCase.execute
      ).toHaveBeenCalledWith(bodyDto);
      expect(result).toEqual(mockGenerateReportResponse);
      expect(result.message).toBe("OpenPayable report generated successfully");
      expect(result.spresult).toBeDefined();
    });

    it("should handle minimal required parameters", async () => {
      // Arrange
      const bodyDto: generateReportDto = {
        companyNo: 10,
        openPayables: OPEN_PAYABLES_TYPES.OPEN_PAYABLES_IN_HOLD_STATUS,
      };
      mockOpenPayablesReportGeneratorUseCase.execute.mockResolvedValue(
        mockGenerateReportResponse
      );

      // Act
      const result = await controller.submitPurchaseJournal(bodyDto);

      // Assert
      expect(
        mockOpenPayablesReportGeneratorUseCase.execute
      ).toHaveBeenCalledWith(bodyDto);
      expect(result).toEqual(mockGenerateReportResponse);
    });

    it("should handle all optional parameters", async () => {
      // Arrange
      const bodyDto: generateReportDto = {
        companyNo: 15,
        openPayables: OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_VENDOR_DISCOUNTS,
        holdVoucher: "Y",
        dateOne: new Date("2024-03-01"),
        dateTwo: "2024-03-31",
        dateThree: "2024-04-01",
        dateFour: "2024-04-30",
        populateSpreadsheet: "N",
      };
      mockOpenPayablesReportGeneratorUseCase.execute.mockResolvedValue(
        mockGenerateReportResponse
      );

      // Act
      const result = await controller.submitPurchaseJournal(bodyDto);

      // Assert
      expect(
        mockOpenPayablesReportGeneratorUseCase.execute
      ).toHaveBeenCalledWith(bodyDto);
      expect(result).toEqual(mockGenerateReportResponse);
    });

    it("should handle usecase errors gracefully", async () => {
      // Arrange
      const bodyDto: generateReportDto = {
        companyNo: 10,
        openPayables: OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_DUE_DATE,
      };
      const error = new Error("Report generation failed");
      mockOpenPayablesReportGeneratorUseCase.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.submitPurchaseJournal(bodyDto)).rejects.toThrow(
        "Report generation failed"
      );
      expect(
        mockOpenPayablesReportGeneratorUseCase.execute
      ).toHaveBeenCalledWith(bodyDto);
    });

    it("should handle different open payables types", async () => {
      // Arrange
      const openPayablesTypes = [
        OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_DUE_DATE,
        OPEN_PAYABLES_TYPES.OPEN_PAYABLES_IN_HOLD_STATUS,
        OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_VENDOR_DISCOUNTS,
        OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_VENDOR_AGED,
      ];

      for (const openPayablesType of openPayablesTypes) {
        const bodyDto: generateReportDto = {
          companyNo: 10,
          openPayables: openPayablesType,
        };
        mockOpenPayablesReportGeneratorUseCase.execute.mockResolvedValue(
          mockGenerateReportResponse
        );

        // Act
        const result = await controller.submitPurchaseJournal(bodyDto);

        // Assert
        expect(
          mockOpenPayablesReportGeneratorUseCase.execute
        ).toHaveBeenCalledWith(bodyDto);
        expect(result).toEqual(mockGenerateReportResponse);
      }
    });
  });

  describe("controller initialization", () => {
    it("should be defined", () => {
      expect(controller).toBeDefined();
    });

    it("should have required dependencies injected", () => {
      expect(controller["getOpenPayablesUsecase"]).toBeDefined();
      expect(controller["openPayablesReportGeneratorUseCase"]).toBeDefined();
    });
  });
});
