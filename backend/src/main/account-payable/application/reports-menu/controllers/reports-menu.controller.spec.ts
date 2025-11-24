import { Test, TestingModule } from "@nestjs/testing";
import { ReportsMenuController } from "./reports-menu.controller";
import { ReportsMenuUsecase } from "../usecases/reports-menu/reports-menu.usecase";
import { ReportsMenuSubmitUseCase } from "../usecases/reports-menu-submit/reports-menu-submit.usecase";
import { ReportsMenuDto, SubmitReportsMenuDto } from "../dto/reports-menu.dto";
import { SpooledMetaDataReportEntity } from "@src/main/account-payable/domain/entities/spooled-meta-data-report.entity";
import { reportsFormatter } from "@src/shared/formatters/dropdown.formatter";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import { REPORTS_MENU_TYPES } from "@src/shared/constants/constant";
import { PurchaseJournalService } from "@src/main/account-payable/domain/services/purchase-journal/purchase-journal.service";

describe("ReportsMenuController", () => {
  let controller: ReportsMenuController;
  let getReportsMenuUsecase: ReportsMenuUsecase;
  let submitReportsMenuUseCase: ReportsMenuSubmitUseCase;
  const mockExecute = jest.fn();
  const mockSubmit = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsMenuController],
      providers: [
        {
          provide: ReportsMenuUsecase,
          useValue: { execute: mockExecute },
        },
        {
          provide: ReportsMenuSubmitUseCase,
          useValue: { execute: mockSubmit },
        },
      ],
    }).compile();

    controller = module.get<ReportsMenuController>(ReportsMenuController);
    getReportsMenuUsecase = module.get<ReportsMenuUsecase>(ReportsMenuUsecase);
    submitReportsMenuUseCase = module.get<ReportsMenuSubmitUseCase>(
      ReportsMenuSubmitUseCase
    );
    jest.clearAllMocks();
  });

  describe("getReportsMenu", () => {
    it("should be defined", () => {
      expect(controller).toBeDefined();
      expect(getReportsMenuUsecase).toBeDefined();
    });

    it("should return result for AP-Month-End-Vendor-Totals when usecase is called with matching dto", async () => {
      const dto: ReportsMenuDto = {
        reportType: [REPORTS_MENU_TYPES.AP_Month_End_Vendor_Totals],
        fileName: "test.pdf",
        startDate: "2025-07-01",
        endDate: "2025-07-25",
      };

      const rawItems = [
        {
          reportType: REPORTS_MENU_TYPES.AP_Month_End_Vendor_Totals,
          pdfFileName: "file.PDF",
          reportDateTime: new Date("2025-07-25T12:00:00Z"),
          filePath: "http://172.16.30.10:5001/G-Drive/file.PDF",
          formType: "PDF",
        },
      ] as SpooledMetaDataReportEntity[];

      const mockResult: PaginatedResponse<SpooledMetaDataReportEntity> = {
        items: reportsFormatter(rawItems),
        pagination: {
          total_items: 1,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      mockExecute.mockResolvedValueOnce(mockResult);

      const result = await controller.getReportsMenu(dto);
      expect(result).toEqual(mockResult);
      expect(result.items).toBeDefined();
      expect(result.items.length).toBeGreaterThan(0);
      const item = result.items[0]!;
      expect(item.reportType).toBe(REPORTS_MENU_TYPES.AP_Month_End_Vendor_Totals);
      expect(item.pdfFileName).toBe("file.PDF");
      expect(item.formType).toBe("PDF");
      expect(item.filePath).toBe("http://172.16.30.10:5001/G-Drive/file.PDF");
      expect(item.reportDateTime).toEqual("07/25/25, 17:30");

      expect(getReportsMenuUsecase.execute).toHaveBeenCalledWith(dto);
    });

    it("should return result for Outstanding-Check-Register when usecase is called with matching dto", async () => {
      const dto: ReportsMenuDto = {
        reportType: [REPORTS_MENU_TYPES.Outstanding_Check_Register],
        fileName: "file.PDF",
        startDate: "2025-07-15",
        endDate: "2025-07-20",
      };

      const rawItems = [
        {
          reportType: REPORTS_MENU_TYPES.Outstanding_Check_Register,
          pdfFileName: "file.PDF",
          reportDateTime: new Date("2025-07-25T12:00:00Z"),
          filePath: "http://172.16.30.10:5001/G-Drive/file.PDF",
          formType: "PDF",
        },
      ] as SpooledMetaDataReportEntity[];

      const mockResult: PaginatedResponse<SpooledMetaDataReportEntity> = {
        items: reportsFormatter(rawItems),
        pagination: {
          total_items: 1,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      mockExecute.mockResolvedValueOnce(mockResult);

      const result = await controller.getReportsMenu(dto);
      expect(result).toEqual(mockResult);
      expect(result.items).toBeDefined();
      expect(result.items.length).toBeGreaterThan(0);
      const item = result.items[0]!;
      expect(item.reportType).toBe(
        REPORTS_MENU_TYPES.Outstanding_Check_Register
      );
      expect(item.pdfFileName).toBe("file.PDF");
      expect(item.formType).toBe("PDF");
      expect(item.filePath).toBe("http://172.16.30.10:5001/G-Drive/file.PDF");
      expect(item.reportDateTime).toEqual("07/25/25, 17:30");

      expect(getReportsMenuUsecase.execute).toHaveBeenCalledWith(dto);
    });

    it("should return empty result when no reports found", async () => {
      const dto: ReportsMenuDto = {
        reportType: [REPORTS_MENU_TYPES.AP_Month_End_Vendor_Totals],
        fileName: "no-match.pdf",
        startDate: "2025-01-01",
        endDate: "2025-01-02",
      };

      const mockResult: PaginatedResponse<SpooledMetaDataReportEntity> = {
        items: [],
        pagination: {
          total_items: 0,
          current_page: 1,
          items_per_page: 10,
          total_pages: 0,
        },
      };

      mockExecute.mockResolvedValueOnce(mockResult);

      const result = await controller.getReportsMenu(dto);
      expect(result.items).toEqual([]);
      expect(result.pagination.total_items).toBe(0);
      expect(mockExecute).toHaveBeenCalledWith(dto);
    });

    it("should return multiple report items", async () => {
      const dto: ReportsMenuDto = {
        reportType: [REPORTS_MENU_TYPES.AP_Month_End_Vendor_Totals],
        fileName: "multi.pdf",
        startDate: "2025-07-01",
        endDate: "2025-07-31",
      };

      const rawItems = [
        {
          reportType: REPORTS_MENU_TYPES.AP_Month_End_Vendor_Totals,
          pdfFileName: "file.PDF",
          reportDateTime: new Date("2025-07-25T12:00:00Z"),
          filePath: "http://172.16.30.10:5001/G-Drive/file.PDF",
          formType: "PDF",
        },
        {
          reportType: REPORTS_MENU_TYPES.AP_Month_End_Vendor_Totals,
          pdfFileName: "file.PDF",
          reportDateTime: new Date("2025-07-25T12:00:00Z"),
          filePath: "http://172.16.30.10:5001/G-Drive/file.PDF",
          formType: "PDF",
        },
      ] as SpooledMetaDataReportEntity[];

      const mockResult: PaginatedResponse<SpooledMetaDataReportEntity> = {
        items: reportsFormatter(rawItems),
        pagination: {
          total_items: 2,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      mockExecute.mockResolvedValueOnce(mockResult);

      const result = await controller.getReportsMenu(dto);
      expect(result.items.length).toBe(2);
      const item1 = result.items[0]!;
      const item2 = result.items[1]!;
      expect(item1.pdfFileName).toBe("file.PDF");
      expect(item2.pdfFileName).toBe("file.PDF");
      expect(mockExecute).toHaveBeenCalledWith(dto);
    });

    it("should handle pagination parameters correctly", async () => {
      const dto: ReportsMenuDto = {
        reportType: [REPORTS_MENU_TYPES.AP_Month_End_Vendor_Totals],
        fileName: "paginated.pdf",
        startDate: "2025-07-01",
        endDate: "2025-07-31",
        items_per_page: 5,
        current_page: 3,
      };

      const mockResult: PaginatedResponse<SpooledMetaDataReportEntity> = {
        items: [],
        pagination: {
          total_items: 25,
          current_page: 3,
          items_per_page: 5,
          total_pages: 5,
        },
      };

      mockExecute.mockResolvedValueOnce(mockResult);

      const result = await controller.getReportsMenu(dto);
      expect(result.pagination.current_page).toBe(3);
      expect(result.pagination.items_per_page).toBe(5);
      expect(result.pagination.total_pages).toBe(5);
      expect(mockExecute).toHaveBeenCalledWith(dto);
    });

    it("should fallback to all report types and return both report types in result", async () => {
      const dto: ReportsMenuDto = {
        fileName: "report.pdf",
        startDate: "2025-07-01",
        endDate: "2025-07-10",
        reportType: undefined, // simulate missing input
      };

      const rawItems = [
        {
          reportType: REPORTS_MENU_TYPES.AP_Month_End_Vendor_Totals,
          pdfFileName: "file.PDF",
          reportDateTime: new Date("2025-07-25T12:00:00Z"),
          filePath: "http://172.16.30.10:5001/G-Drive/file.PDF",
          formType: "PDF",
        },
        {
          reportType: REPORTS_MENU_TYPES.Outstanding_Check_Register,
          pdfFileName: "file.PDF",
          reportDateTime: new Date("2025-07-25T12:00:00Z"),
          filePath: "http://172.16.30.10:5001/G-Drive/file.PDF",
          formType: "PDF",
        },
      ] as SpooledMetaDataReportEntity[];

      const mockResult: PaginatedResponse<SpooledMetaDataReportEntity> = {
        items: reportsFormatter(rawItems),
        pagination: {
          total_items: 2,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      const mockPurchaseJournalService = {
        SpooledMetadataReports: jest.fn().mockResolvedValue(mockResult),
      };

      const usecase = new ReportsMenuUsecase(
        mockPurchaseJournalService as unknown as PurchaseJournalService
      );

      const result = await usecase.execute(dto);

      expect(
        mockPurchaseJournalService.SpooledMetadataReports
      ).toHaveBeenCalledWith({
        ...dto,
        reportType: [
          REPORTS_MENU_TYPES.AP_Month_End_Vendor_Totals,
          REPORTS_MENU_TYPES.Outstanding_Check_Register,
        ],
      });

      expect(result.items.length).toBe(2);
      const item1 = result.items[0]!;
      const item2 = result.items[1]!;
      expect(item1.reportType).toBe(REPORTS_MENU_TYPES.AP_Month_End_Vendor_Totals);
      expect(item2.reportType).toBe(
        REPORTS_MENU_TYPES.Outstanding_Check_Register
      );
    });

    it("should throw if usecase.execute fails", async () => {
      const dto: ReportsMenuDto = {
        reportType: [REPORTS_MENU_TYPES.AP_Month_End_Vendor_Totals],
        fileName: "test.pdf",
        startDate: "2025-07-01",
        endDate: "2025-07-25",
      };

      mockExecute.mockRejectedValueOnce(new Error("DB connection error"));

      await expect(controller.getReportsMenu(dto)).rejects.toThrow(
        "DB connection error"
      );
      expect(getReportsMenuUsecase.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe("submitReportsMenu", () => {
    it("should be defined", () => {
      expect(controller).toBeDefined();
      expect(submitReportsMenuUseCase).toBeDefined();
    });

    it("should return success for valid AP-Month-End-Vendor-Totals request", async () => {
      const dto: SubmitReportsMenuDto = {
        reportType: REPORTS_MENU_TYPES.AP_Month_End_Vendor_Totals,
        companyNo: 10,
        reportDate: "070725",
      };

      const mockResponse = {
        message: "AP-Month-End-Vendor-Totals submitted successfully",
        spresult: { errVar: "PGM AP360CL executed successfully" },
      };

      mockSubmit.mockResolvedValueOnce(mockResponse);

      const result = await controller.submitReportsMenu(dto);
      expect(result).toEqual({ items: mockResponse });
      expect(submitReportsMenuUseCase.execute).toHaveBeenCalledWith(dto);
    });

    it("should return success for valid Outstanding-Check-Register request", async () => {
      const dto: SubmitReportsMenuDto = {
        reportType: REPORTS_MENU_TYPES.Outstanding_Check_Register,
        companyNo: 10,
        outstandingCheckDate: "070725",
      };

      const mockResponse = {
        message: "Outstanding-Check-Register submitted successfully",
        spresult: { errVar: "Outstanding Report Generated Successfully" },
      };

      mockSubmit.mockResolvedValueOnce(mockResponse);

      const result = await controller.submitReportsMenu(dto);
      expect(result).toEqual({ items: mockResponse });
      expect(submitReportsMenuUseCase.execute).toHaveBeenCalledWith(dto);
    });

    it("should throw error if submitReportsMenuUseCase fails", async () => {
      const dto: SubmitReportsMenuDto = {
        reportType: REPORTS_MENU_TYPES.AP_Month_End_Vendor_Totals,
        companyNo: 10,
        reportDate: "070725",
      };

      mockSubmit.mockRejectedValueOnce(new Error("SP failure"));

      await expect(controller.submitReportsMenu(dto)).rejects.toThrow(
        "SP failure"
      );
      expect(submitReportsMenuUseCase.execute).toHaveBeenCalledWith(dto);
    });

    it("should throw error if reportDate is missing for AP-Month-End-Vendor-Totals", async () => {
      const dto = {
        reportType: REPORTS_MENU_TYPES.AP_Month_End_Vendor_Totals,
        companyNo: 10,
      };

      mockSubmit.mockRejectedValueOnce(new Error("reportDate is required"));

      await expect(
        controller.submitReportsMenu(dto as SubmitReportsMenuDto)
      ).rejects.toThrow("reportDate is required");
    });

    it("should throw error for unsupported report type", async () => {
      const dto = {
        reportType: "UNKNOWN-REPORT-TYPE",
        companyNo: 10,
        reportDate: "070725",
      };

      mockSubmit.mockRejectedValueOnce(
        new Error("Unsupported reportType: UNKNOWN-REPORT-TYPE")
      );

      await expect(
        controller.submitReportsMenu(dto as SubmitReportsMenuDto)
      ).rejects.toThrow("Unsupported reportType");
    });

    it("should throw error if reportDate format is invalid", async () => {
      const dto = {
        reportType: REPORTS_MENU_TYPES.AP_Month_End_Vendor_Totals,
        companyNo: 10,
        reportDate: "20250707", // invalid
      };

      mockSubmit.mockRejectedValueOnce(
        new Error("Invalid date format for reportDate")
      );

      await expect(
        controller.submitReportsMenu(dto as SubmitReportsMenuDto)
      ).rejects.toThrow("Invalid date format for reportDate");
    });

    it("should throw error if outstandingCheckDate format is invalid", async () => {
      const dto = {
        reportType: REPORTS_MENU_TYPES.Outstanding_Check_Register,
        companyNo: 10,
        outstandingCheckDate: "20250707", // invalid
      };

      mockSubmit.mockRejectedValueOnce(
        new Error("Invalid date format for outstandingCheckDate")
      );

      await expect(
        controller.submitReportsMenu(dto as SubmitReportsMenuDto)
      ).rejects.toThrow("Invalid date format for outstandingCheckDate");
    });
  });
});
