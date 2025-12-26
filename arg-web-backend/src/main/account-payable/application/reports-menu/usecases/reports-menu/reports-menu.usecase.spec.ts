// reports-menu.usecase.spec.ts

import { ReportsMenuUsecase } from "./reports-menu.usecase";
import { PurchaseJournalService } from "@src/main/account-payable/domain/services/purchase-journal/purchase-journal.service";
import { ReportsMenuDto } from "../../dto/reports-menu.dto";
import { SpooledMetaDataReportEntity } from "@src/main/account-payable/domain/entities/spooled-meta-data-report.entity";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import { REPORTS_MENU_TYPES } from "@src/shared/constants/constant";

describe("ReportsMenuUsecase", () => {
  let useCase: ReportsMenuUsecase;
  let purchaseJournalService: jest.Mocked<PurchaseJournalService>;

  beforeEach(() => {
    purchaseJournalService = {
      SpooledMetadataReports: jest.fn(),
      submitPurchaseJournal: jest.fn(),
    } as unknown as jest.Mocked<PurchaseJournalService>;

    useCase = new ReportsMenuUsecase(purchaseJournalService);
  });

  it("should get reports menu with default report types when none provided", async () => {
    const dto: ReportsMenuDto = {
      current_page: 1,
      items_per_page: 10,
    };

    const mockResponse: PaginatedResponse<SpooledMetaDataReportEntity> = {
      items: [],
      pagination: {
        current_page: 1,
        items_per_page: 10,
        total_items: 0,
        total_pages: 0,
      },
    };

    purchaseJournalService.SpooledMetadataReports.mockResolvedValue(
      mockResponse
    );

    const result = await useCase.execute(dto);

    expect(dto.reportType).toEqual([
      REPORTS_MENU_TYPES.AP_Month_End_Vendor_Totals,
      REPORTS_MENU_TYPES.Outstanding_Check_Register,
    ]);
    expect(purchaseJournalService.SpooledMetadataReports).toHaveBeenCalledWith(
      dto
    );
    expect(result).toEqual(mockResponse);
  });

  it("should get reports menu with custom report types when provided", async () => {
    const dto: ReportsMenuDto = {
      reportType: ["Custom-Report-1", "Custom-Report-2"],
      current_page: 1,
      items_per_page: 10,
    };

    const mockResponse: PaginatedResponse<SpooledMetaDataReportEntity> = {
      items: [
        {
          reportType: "Custom-Report-1",
          fileName: "custom-report-1.pdf",
          reportDateTime: new Date(),
          filePath: "/path/to/custom-report-1.pdf",
          formType: "PDF",
        } as unknown as SpooledMetaDataReportEntity,
        {
          reportType: "Custom-Report-2",
          fileName: "custom-report-2.pdf",
          reportDateTime: new Date(),
          filePath: "/path/to/custom-report-2.pdf",
          formType: "PDF",
        } as unknown as SpooledMetaDataReportEntity,
      ],
      pagination: {
        current_page: 1,
        items_per_page: 10,
        total_items: 2,
        total_pages: 1,
      },
    };

    purchaseJournalService.SpooledMetadataReports.mockResolvedValue(
      mockResponse
    );

    const result = await useCase.execute(dto);

    expect(dto.reportType).toEqual(["Custom-Report-1", "Custom-Report-2"]);
    expect(purchaseJournalService.SpooledMetadataReports).toHaveBeenCalledWith(
      dto
    );
    expect(result).toEqual(mockResponse);
  });

  it("should get reports menu with single report type when provided as string", async () => {
    const dto: ReportsMenuDto = {
      reportType: ["Single-Report"],
      current_page: 1,
      items_per_page: 10,
    };

    const mockResponse: PaginatedResponse<SpooledMetaDataReportEntity> = {
      items: [
        {
          reportType: "Single-Report",
          fileName: "single-report.pdf",
          reportDateTime: new Date(),
          filePath: "/path/to/single-report.pdf",
          formType: "PDF",
        } as unknown as SpooledMetaDataReportEntity,
      ],
      pagination: {
        current_page: 1,
        items_per_page: 10,
        total_items: 1,
        total_pages: 1,
      },
    };

    purchaseJournalService.SpooledMetadataReports.mockResolvedValue(
      mockResponse
    );

    const result = await useCase.execute(dto);

    expect(dto.reportType).toEqual(["Single-Report"]);
    expect(purchaseJournalService.SpooledMetadataReports).toHaveBeenCalledWith(
      dto
    );
    expect(result).toEqual(mockResponse);
  });

  it("should handle empty report type array", async () => {
    const dto: ReportsMenuDto = {
      reportType: [],
      current_page: 1,
      items_per_page: 10,
    };

    const mockResponse: PaginatedResponse<SpooledMetaDataReportEntity> = {
      items: [],
      pagination: {
        current_page: 1,
        items_per_page: 10,
        total_items: 0,
        total_pages: 0,
      },
    };

    purchaseJournalService.SpooledMetadataReports.mockResolvedValue(
      mockResponse
    );

    const result = await useCase.execute(dto);

    expect(dto.reportType).toEqual([
      REPORTS_MENU_TYPES.AP_Month_End_Vendor_Totals,
      REPORTS_MENU_TYPES.Outstanding_Check_Register,
    ]);
    expect(purchaseJournalService.SpooledMetadataReports).toHaveBeenCalledWith(
      dto
    );
    expect(result).toEqual(mockResponse);
  });

  it("should handle errors from service", async () => {
    const dto: ReportsMenuDto = {
      current_page: 1,
      items_per_page: 10,
    };

    purchaseJournalService.SpooledMetadataReports.mockRejectedValue(
      new Error("Service unavailable")
    );

    await expect(useCase.execute(dto)).rejects.toThrow("Service unavailable");
  });

  it("should log the correct message", async () => {
    const dto: ReportsMenuDto = {
      reportType: ["Test-Report"],
      current_page: 1,
      items_per_page: 10,
    };

    const mockResponse: PaginatedResponse<SpooledMetaDataReportEntity> = {
      items: [],
      pagination: {
        current_page: 1,
        items_per_page: 10,
        total_items: 0,
        total_pages: 0,
      },
    };

    purchaseJournalService.SpooledMetadataReports.mockResolvedValue(
      mockResponse
    );

    const logSpy = jest.spyOn(useCase["logger"], "log");

    await useCase.execute(dto);

    expect(logSpy).toHaveBeenCalledWith("Get the Report list for Test-Report");
  });

  it("should preserve other DTO properties", async () => {
    const dto: ReportsMenuDto = {
      reportType: ["Test-Report"],
      fileName: "test-file.pdf",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      current_page: 2,
      items_per_page: 20,
    };

    const mockResponse: PaginatedResponse<SpooledMetaDataReportEntity> = {
      items: [],
      pagination: {
        current_page: 2,
        items_per_page: 20,
        total_items: 0,
        total_pages: 0,
      },
    };

    purchaseJournalService.SpooledMetadataReports.mockResolvedValue(
      mockResponse
    );

    await useCase.execute(dto);

    expect(purchaseJournalService.SpooledMetadataReports).toHaveBeenCalledWith({
      ...dto,
      reportType: ["Test-Report"],
    });
  });
});
