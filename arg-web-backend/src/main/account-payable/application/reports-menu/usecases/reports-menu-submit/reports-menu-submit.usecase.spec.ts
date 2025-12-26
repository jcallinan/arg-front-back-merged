// reports-menu-submit.usecase.spec.ts

import { ReportsMenuSubmitUseCase } from "./reports-menu-submit.usecase";
import { ReportService } from "@src/main/account-payable/domain/services/report/report.service";
import { SubmitReportsMenuDto } from "../../dto/reports-menu.dto";
import { REPORTS_MENU_TYPES } from "@src/shared/constants/constant";

describe("ReportsMenuSubmitUseCase", () => {
  let useCase: ReportsMenuSubmitUseCase;
  let reportService: jest.Mocked<ReportService>;

  beforeEach(() => {
    reportService = {
      submitReportMenu: jest.fn(),
    } as jest.Mocked<ReportService>;

    useCase = new ReportsMenuSubmitUseCase(reportService);
  });

  it("should submit AP Monthly Audit Report successfully", async () => {
    const dto: SubmitReportsMenuDto = {
      reportType: REPORTS_MENU_TYPES.AP_Month_End_Vendor_Totals,
      companyNo: 10,
      reportDate: "070725",
    };

    const mockResult = {
      message: "AP Monthly Audit Report submitted successfully",
      reportId: "report-123",
      status: "processing",
    };

    reportService.submitReportMenu.mockResolvedValue(mockResult);

    const result = await useCase.execute(dto);

    expect(reportService.submitReportMenu).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockResult);
  });

  it("should submit Outstanding Check Register successfully", async () => {
    const dto: SubmitReportsMenuDto = {
      reportType: REPORTS_MENU_TYPES.Outstanding_Check_Register,
      companyNo: 20,
      outstandingCheckDate: "080815",
    };

    const mockResult = {
      message: "Outstanding Check Register submitted successfully",
      reportId: "report-456",
      status: "processing",
    };

    reportService.submitReportMenu.mockResolvedValue(mockResult);

    const result = await useCase.execute(dto);

    expect(reportService.submitReportMenu).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockResult);
  });

  it("should submit custom report type successfully", async () => {
    const dto: SubmitReportsMenuDto = {
      reportType: "Custom-Report-Type",
      companyNo: 30,
    };

    const mockResult = {
      message: "Custom report submitted successfully",
      reportId: "report-789",
      status: "processing",
    };

    reportService.submitReportMenu.mockResolvedValue(mockResult);

    const result = await useCase.execute(dto);

    expect(reportService.submitReportMenu).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockResult);
  });

  it("should handle errors from service", async () => {
    const dto: SubmitReportsMenuDto = {
      reportType: REPORTS_MENU_TYPES.AP_Month_End_Vendor_Totals,
      companyNo: 10,
      reportDate: "070725",
    };

    reportService.submitReportMenu.mockRejectedValue(
      new Error("Report service unavailable")
    );

    await expect(useCase.execute(dto)).rejects.toThrow(
      "Report service unavailable"
    );
  });

  it("should log the correct message", async () => {
    const dto: SubmitReportsMenuDto = {
      reportType: REPORTS_MENU_TYPES.AP_Month_End_Vendor_Totals,
      companyNo: 10,
      reportDate: "070725",
    };

    const mockResult = {
      message: "Report submitted successfully",
      reportId: "report-123",
      status: "processing",
    };

    reportService.submitReportMenu.mockResolvedValue(mockResult);

    const logSpy = jest.spyOn(useCase["logger"], "log");

    await useCase.execute(dto);

    expect(logSpy).toHaveBeenCalledWith(`Submitting Reports Menu ${dto}`);
  });

  it("should handle different company numbers", async () => {
    const dto: SubmitReportsMenuDto = {
      reportType: REPORTS_MENU_TYPES.Outstanding_Check_Register,
      companyNo: 99,
      outstandingCheckDate: "121231",
    };

    const mockResult = {
      message: "Report submitted successfully",
      reportId: "report-999",
      status: "processing",
    };

    reportService.submitReportMenu.mockResolvedValue(mockResult);

    const result = await useCase.execute(dto);

    expect(reportService.submitReportMenu).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockResult);
  });

  it("should handle report with all optional fields", async () => {
    const dto: SubmitReportsMenuDto = {
      reportType: REPORTS_MENU_TYPES.AP_Month_End_Vendor_Totals,
      companyNo: 10,
      reportDate: "070725",
    };

    const mockResult = {
      message: "Report submitted successfully",
      reportId: "report-123",
      status: "processing",
      additionalInfo: "Some additional information",
    };

    reportService.submitReportMenu.mockResolvedValue(mockResult);

    const result = await useCase.execute(dto);

    expect(reportService.submitReportMenu).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockResult);
  });

  it("should handle empty result from service", async () => {
    const dto: SubmitReportsMenuDto = {
      reportType: REPORTS_MENU_TYPES.AP_Month_End_Vendor_Totals,
      companyNo: 10,
      reportDate: "070725",
    };

    const mockResult = null;

    reportService.submitReportMenu.mockResolvedValue(mockResult);

    const result = await useCase.execute(dto);

    expect(reportService.submitReportMenu).toHaveBeenCalledWith(dto);
    expect(result).toBeNull();
  });
});
