import { Test, TestingModule } from "@nestjs/testing";
import { PuchaseJournalReportsUseCase } from "./purchase-journal-report.usecase";
import { PurchaseJournalService } from "@src/main/account-payable/domain/services/purchase-journal/purchase-journal.service";
import { SpooledMetaDataReportEntity } from "@src/main/account-payable/domain/entities/spooled-meta-data-report.entity";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import { purchaseJournalReportDto } from "../../dto/purchase-journal.dto";
import { PURCHASE_JOURNAL } from "@src/shared/constants/constant";

describe("PuchaseJournalReportsUseCase", () => {
  let useCase: PuchaseJournalReportsUseCase;
  let mockPurchaseJournalService: {
    SpooledMetadataReports: jest.Mock;
  };

  beforeEach(async () => {
    mockPurchaseJournalService = {
      SpooledMetadataReports: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PuchaseJournalReportsUseCase,
        {
          provide: PurchaseJournalService,
          useValue: mockPurchaseJournalService,
        },
      ],
    }).compile();

    useCase = module.get<PuchaseJournalReportsUseCase>(
      PuchaseJournalReportsUseCase
    );
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  describe("execute", () => {
    it("should fetch purchase journal reports successfully", async () => {
      const dto: purchaseJournalReportDto = {
        reportType: PURCHASE_JOURNAL.AP_Purchase_Journal,
        fileName: "test.pdf",
        startDate: "062725",
        endDate: "123125",
        current_page: 1,
        items_per_page: 10,
      };

      const mockResponse: PaginatedResponse<SpooledMetaDataReportEntity> = {
        items: [
          {
            pdfFileName: "test.pdf",
            spoolFileName: "test.spool",
            reportType: PURCHASE_JOURNAL.AP_Purchase_Journal,
            jobName: "test-job",
            jobNumber: 1,
            jobUser: "test-user",
            jobSystemName: "test-system",
            filePath: "/files/test.pdf",
            outputQueueName: "test-queue",
            outputQueueLibrary: "test-lib",
            reportDateTime: new Date(),
            formType: "test-form",
            error: "",
          } as SpooledMetaDataReportEntity,
        ],
        pagination: {
          total_items: 1,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      mockPurchaseJournalService.SpooledMetadataReports.mockResolvedValue(
        mockResponse
      );

      const result = await useCase.execute(dto);

      expect(result).toEqual(mockResponse);
      expect(
        mockPurchaseJournalService.SpooledMetadataReports
      ).toHaveBeenCalledWith(dto);
    });

    it("should handle empty report list", async () => {
      const dto: purchaseJournalReportDto = {
        current_page: 1,
        items_per_page: 10,
      };

      const mockResponse: PaginatedResponse<SpooledMetaDataReportEntity> = {
        items: [],
        pagination: {
          total_items: 0,
          current_page: 1,
          items_per_page: 10,
          total_pages: 0,
        },
      };

      mockPurchaseJournalService.SpooledMetadataReports.mockResolvedValue(
        mockResponse
      );

      const result = await useCase.execute(dto);

      expect(result).toEqual(mockResponse);
      expect(
        mockPurchaseJournalService.SpooledMetadataReports
      ).toHaveBeenCalledWith(dto);
    });

    it("should handle service errors", async () => {
      const dto: purchaseJournalReportDto = {
        current_page: 1,
        items_per_page: 10,
      };

      const error = new Error("Database connection failed");
      mockPurchaseJournalService.SpooledMetadataReports.mockRejectedValue(
        error
      );

      await expect(useCase.execute(dto)).rejects.toThrow(
        "Database connection failed"
      );
      expect(
        mockPurchaseJournalService.SpooledMetadataReports
      ).toHaveBeenCalledWith(dto);
    });

    it("should handle partial query parameters", async () => {
      const dto: purchaseJournalReportDto = {
        reportType: PURCHASE_JOURNAL.AP_Purchase_Journal,
        current_page: 1,
        items_per_page: 10,
      };

      const mockResponse: PaginatedResponse<SpooledMetaDataReportEntity> = {
        items: [
          {
            pdfFileName: "report.pdf",
            spoolFileName: "report.spool",
            reportType: PURCHASE_JOURNAL.AP_Purchase_Journal,
            jobName: "report-job",
            jobNumber: 2,
            jobUser: "report-user",
            jobSystemName: "report-system",
            filePath: "/files/report.pdf",
            outputQueueName: "report-queue",
            outputQueueLibrary: "report-lib",
            reportDateTime: new Date(),
            formType: "report-form",
            error: "",
          } as SpooledMetaDataReportEntity,
        ],
        pagination: {
          total_items: 1,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      mockPurchaseJournalService.SpooledMetadataReports.mockResolvedValue(
        mockResponse
      );

      const result = await useCase.execute(dto);

      expect(result).toEqual(mockResponse);
      expect(
        mockPurchaseJournalService.SpooledMetadataReports
      ).toHaveBeenCalledWith(dto);
    });

    it("should handle multiple report types", async () => {
      const dto: purchaseJournalReportDto = {
        reportType: [PURCHASE_JOURNAL.AP_Purchase_Journal, "VENDOR_REPORT"],
        current_page: 1,
        items_per_page: 10,
      };

      const mockResponse: PaginatedResponse<SpooledMetaDataReportEntity> = {
        items: [
          {
            pdfFileName: "purchase_journal.pdf",
            spoolFileName: "purchase_journal.spool",
            reportType: PURCHASE_JOURNAL.AP_Purchase_Journal,
            jobName: "pj-job",
            jobNumber: 3,
            jobUser: "pj-user",
            jobSystemName: "pj-system",
            filePath: "/files/purchase_journal.pdf",
            outputQueueName: "pj-queue",
            outputQueueLibrary: "pj-lib",
            reportDateTime: new Date(),
            formType: "pj-form",
            error: "",
          } as SpooledMetaDataReportEntity,
          {
            pdfFileName: "vendor_report.pdf",
            spoolFileName: "vendor_report.spool",
            reportType: PURCHASE_JOURNAL.AP_Purchase_Register,
            jobName: "vr-job",
            jobNumber: 4,
            jobUser: "vr-user",
            jobSystemName: "vr-system",
            filePath: "/files/vendor_report.pdf",
            outputQueueName: "vr-queue",
            outputQueueLibrary: "vr-lib",
            reportDateTime: new Date(),
            formType: "vr-form",
            error: "",
          } as SpooledMetaDataReportEntity,
        ],
        pagination: {
          total_items: 2,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      mockPurchaseJournalService.SpooledMetadataReports.mockResolvedValue(
        mockResponse
      );

      const result = await useCase.execute(dto);

      expect(result).toEqual(mockResponse);
      expect(
        mockPurchaseJournalService.SpooledMetadataReports
      ).toHaveBeenCalledWith(dto);
    });
  });
});
