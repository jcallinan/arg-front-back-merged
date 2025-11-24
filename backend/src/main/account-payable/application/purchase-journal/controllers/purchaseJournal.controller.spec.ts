import { Test, TestingModule } from "@nestjs/testing";
import { PurchaseJournalController } from "./purchaseJournal.controller";
import { PuchaseJournalReportsUseCase } from "../usecases/purchase-journal-report/purchase-journal-report.usecase";
import { PurchaseJournalSubmitUseCase } from "../usecases/purchase-journal-submit/purchase-journal-submit.usecase";
import {
  purchaseJournalReportDto,
  SubmitPurchaseJournalDto,
} from "../dto/purchase-journal.dto";
import { SpooledMetaDataReportEntity } from "@src/main/account-payable/domain/entities/spooled-meta-data-report.entity";
import { PURCHASE_JOURNAL } from "@src/shared/constants/constant";

describe("PurchaseJournalController", () => {
  let controller: PurchaseJournalController;

  const mockGetPurchaseJournalReportsUseCase = { execute: jest.fn() };
  const mockSubmitPurchaseJournalUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseJournalController],
      providers: [
        {
          provide: PuchaseJournalReportsUseCase,
          useValue: mockGetPurchaseJournalReportsUseCase,
        },
        {
          provide: PurchaseJournalSubmitUseCase,
          useValue: mockSubmitPurchaseJournalUseCase,
        },
      ],
    }).compile();

    controller = module.get<PurchaseJournalController>(
      PurchaseJournalController
    );
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getPurchaseJournalReports", () => {
    it("should return paginated response from use case", async () => {
      const query: purchaseJournalReportDto = {
        reportType: PURCHASE_JOURNAL.AP_Purchase_Journal,
        fileName: "test.pdf",
        startDate: "062725",
        endDate: "123125",
        current_page: 1,
        items_per_page: 10,
      };

      const mockResponse = {
        items: [
          new SpooledMetaDataReportEntity(
            "test.pdf",
            "test.spool",
            PURCHASE_JOURNAL.AP_Purchase_Journal,
            "test-job",
            1,
            "test-user",
            "test-system",
            "/files/test.pdf",
            "test-queue",
            "test-lib",
            new Date(),
            "test-form",
            ""
          ),
        ],
        pagination: {
          total_items: 1,
          current_page: 1,
          items_per_page: 10,
        },
      };

      mockGetPurchaseJournalReportsUseCase.execute.mockResolvedValue(
        mockResponse
      );

      const result = await controller.getPurchaseJournalReports(query);

      expect(result).toEqual({
        items: mockResponse.items,
        pagination: {
          total_items: mockResponse.pagination.total_items,
          current_page: mockResponse.pagination.current_page,
          items_per_page: mockResponse.pagination.items_per_page,
          total_pages: 1, // Calculated by paginatedResponse function
        },
      });
      expect(mockGetPurchaseJournalReportsUseCase.execute).toHaveBeenCalledWith(
        query
      );
    });

    it("should handle empty query parameters", async () => {
      const query: purchaseJournalReportDto = {
        current_page: 1,
        items_per_page: 10,
      };

      const mockResponse = {
        items: [],
        pagination: {
          total_items: 0,
          current_page: 1,
          items_per_page: 10,
        },
      };

      mockGetPurchaseJournalReportsUseCase.execute.mockResolvedValue(
        mockResponse
      );

      const result = await controller.getPurchaseJournalReports(query);

      expect(result).toEqual({
        items: [],
        pagination: {
          total_items: 0,
          current_page: 1,
          items_per_page: 10,
          total_pages: 0, // Calculated by paginatedResponse function
        },
      });
      expect(mockGetPurchaseJournalReportsUseCase.execute).toHaveBeenCalledWith(
        query
      );
    });

    it("should handle use case errors", async () => {
      const query: purchaseJournalReportDto = {
        current_page: 1,
        items_per_page: 10,
      };

      const error = new Error("Database connection failed");
      mockGetPurchaseJournalReportsUseCase.execute.mockRejectedValue(error);

      await expect(controller.getPurchaseJournalReports(query)).rejects.toThrow(
        "Database connection failed"
      );
      expect(mockGetPurchaseJournalReportsUseCase.execute).toHaveBeenCalledWith(
        query
      );
    });
  });

  describe("submitPurchaseJournal", () => {
    it("should return simple response from submit use case", async () => {
      const dto: SubmitPurchaseJournalDto = {
        entries: [
          {
            invoiceNo: "22420",
            companyNo: 10,
            vendorNo: 1001,
            entryNo: 19042,
          },
        ],
        companyNo: 10,
        purchaseJD: "070725",
        keyCashDJD: "000000",
      };

      const mockResult = {
        message: "Purchase journal submitted successfully",
        spResult: { jrnVar: "PJ01", errVar: null },
        processedEntries: [],
      };

      mockSubmitPurchaseJournalUseCase.execute.mockResolvedValue(mockResult);

      const result = await controller.submitPurchaseJournal(dto);

      expect(result).toEqual({ items: mockResult });
      expect(mockSubmitPurchaseJournalUseCase.execute).toHaveBeenCalledWith(
        dto
      );
    });

    it("should handle multiple entries submission", async () => {
      const dto: SubmitPurchaseJournalDto = {
        entries: [
          {
            invoiceNo: "22420",
            companyNo: 10,
            vendorNo: 1001,
            entryNo: 19042,
          },
          {
            invoiceNo: "789012",
            companyNo: 10,
            vendorNo: 1002,
            entryNo: 19043,
          },
        ],
        companyNo: 10,
        purchaseJD: "070725",
        keyCashDJD: "000000",
      };

      const mockResult = {
        message: "Purchase journal submitted successfully",
        spResult: { jrnVar: "PJ02", errVar: null },
        processedEntries: [],
      };

      mockSubmitPurchaseJournalUseCase.execute.mockResolvedValue(mockResult);

      const result = await controller.submitPurchaseJournal(dto);

      expect(result).toEqual({ items: mockResult });
      expect(mockSubmitPurchaseJournalUseCase.execute).toHaveBeenCalledWith(
        dto
      );
    });

    it("should handle use case errors", async () => {
      const dto: SubmitPurchaseJournalDto = {
        entries: [
          {
            invoiceNo: "22420",
            companyNo: 10,
            vendorNo: 1001,
            entryNo: 19042,
          },
        ],
        companyNo: 10,
        purchaseJD: "070725",
        keyCashDJD: "000000",
      };

      const error = new Error("Invalid vendor number");
      mockSubmitPurchaseJournalUseCase.execute.mockRejectedValue(error);

      await expect(controller.submitPurchaseJournal(dto)).rejects.toThrow(
        "Invalid vendor number"
      );
      expect(mockSubmitPurchaseJournalUseCase.execute).toHaveBeenCalledWith(
        dto
      );
    });
  });
});
