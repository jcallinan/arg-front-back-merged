// report-list.usecase.spec.ts

import { ReportListUsecase } from "./report-list.usecase";
import { ReportService } from "@src/main/account-payable/domain/services/report/report.service";
import { Report_Type } from "@src/shared/constants/constant";
import { reportTypeFormatter } from "@src/shared/formatters/dropdown.formatter";
import { DropdownType } from "../../../../../../types/types";
import { ReportEntity } from "@src/main/account-payable/domain/entities/report.entity";

// Mock the formatter
jest.mock("@src/shared/formatters/dropdown.formatter", () => ({
  reportTypeFormatter: jest.fn(),
}));

describe("ReportListUsecase", () => {
  let useCase: ReportListUsecase;
  let reportService: jest.Mocked<ReportService>;

  beforeEach(() => {
    reportService = {
      getListByReportType: jest.fn(),
      submitReportMenu: jest.fn(),
    } as unknown as jest.Mocked<ReportService>;

    useCase = new ReportListUsecase(reportService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it("should get report list successfully", async () => {
    const reportType = Report_Type.OPEN_PAYABLES;

    const mockReportList: ReportEntity[] = [
      ReportEntity.create({
        reportName: "Report 1",
        sharedReport: "Y",
        definitionName: "DEF1",
        reportGroup: "AP",
        friendlyName: "Report 1",
        path: "/path1",
      }),
      ReportEntity.create({
        reportName: "Report 2",
        sharedReport: "Y",
        definitionName: "DEF2",
        reportGroup: "AP",
        friendlyName: "Report 2",
        path: "/path2",
      }),
    ];

    const mockFormattedList: DropdownType[] = [
      { id: "1", value: "1", label: "Report 1" },
      { id: "2", value: "2", label: "Report 2" },
    ];

    reportService.getListByReportType.mockResolvedValue(mockReportList);
    (reportTypeFormatter as jest.Mock).mockReturnValue(mockFormattedList);

    const result = await useCase.execute(reportType);

    expect(reportService.getListByReportType).toHaveBeenCalledWith(reportType);
    expect(reportTypeFormatter).toHaveBeenCalledWith(mockReportList);
    expect(result).toEqual(mockFormattedList);
  });

  it("should handle empty report list", async () => {
    const reportType = Report_Type.VOUCHER_POSTING;

    const mockReportList: ReportEntity[] = [];

    const mockFormattedList: DropdownType[] = [];

    reportService.getListByReportType.mockResolvedValue(mockReportList);
    (reportTypeFormatter as jest.Mock).mockReturnValue(mockFormattedList);

    const result = await useCase.execute(reportType);

    expect(reportService.getListByReportType).toHaveBeenCalledWith(reportType);
    expect(reportTypeFormatter).toHaveBeenCalledWith(mockReportList);
    expect(result).toEqual(mockFormattedList);
  });

  it("should handle different report types", async () => {
    const reportType = Report_Type.VENDOR_REPORTS;

    const mockReportList: ReportEntity[] = [
      ReportEntity.create({
        reportName: "Vendor Report",
        sharedReport: "Y",
        definitionName: "DEF3",
        reportGroup: "Vendor",
        friendlyName: "Vendor Report",
        path: "/path3",
      }),
    ];

    const mockFormattedList: DropdownType[] = [
      { id: "3", value: "3", label: "Vendor Report" },
    ];

    reportService.getListByReportType.mockResolvedValue(mockReportList);
    (reportTypeFormatter as jest.Mock).mockReturnValue(mockFormattedList);

    const result = await useCase.execute(reportType);

    expect(reportService.getListByReportType).toHaveBeenCalledWith(reportType);
    expect(reportTypeFormatter).toHaveBeenCalledWith(mockReportList);
    expect(result).toEqual(mockFormattedList);
  });

  it("should handle errors from service", async () => {
    const reportType = Report_Type.OPEN_PAYABLES;

    reportService.getListByReportType.mockRejectedValue(
      new Error("Service unavailable")
    );

    await expect(useCase.execute(reportType)).rejects.toThrow(
      "Service unavailable"
    );
  });

  it("should log the correct message", async () => {
    const reportType = Report_Type.OPEN_PAYABLES;

    const mockReportList: ReportEntity[] = [
      ReportEntity.create({
        reportName: "Report 1",
        sharedReport: "Y",
        definitionName: "DEF1",
        reportGroup: "AP",
        friendlyName: "Report 1",
        path: "/path1",
      }),
    ];

    const mockFormattedList: DropdownType[] = [
      { id: "1", value: "1", label: "Report 1" },
    ];

    reportService.getListByReportType.mockResolvedValue(mockReportList);
    (reportTypeFormatter as jest.Mock).mockReturnValue(mockFormattedList);

    const logSpy = jest.spyOn(useCase["logger"], "log");

    await useCase.execute(reportType);

    expect(logSpy).toHaveBeenCalledWith("Get the Report list");
  });

  it("should handle single report in list", async () => {
    const reportType = Report_Type.OPEN_PAYABLES;

    const mockReportList: ReportEntity[] = [
      ReportEntity.create({
        reportName: "Single Report",
        sharedReport: "Y",
        definitionName: "DEF1",
        reportGroup: "AP",
        friendlyName: "Single Report",
        path: "/path1",
      }),
    ];

    const mockFormattedList: DropdownType[] = [
      { id: "1", value: "1", label: "Single Report" },
    ];

    reportService.getListByReportType.mockResolvedValue(mockReportList);
    (reportTypeFormatter as jest.Mock).mockReturnValue(mockFormattedList);

    const result = await useCase.execute(reportType);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ id: "1", value: "1", label: "Single Report" });
  });

  it("should handle large report list", async () => {
    const reportType = Report_Type.OPEN_PAYABLES;

    const mockReportList: ReportEntity[] = Array.from({ length: 100 }, (_, i) =>
      ReportEntity.create({
        reportName: `Report ${i + 1}`,
        sharedReport: "Y",
        definitionName: `DEF${i + 1}`,
        reportGroup: "AP",
        friendlyName: `Report ${i + 1}`,
        path: `/path${i + 1}`,
      })
    );

    const mockFormattedList: DropdownType[] = Array.from(
      { length: 100 },
      (_, i) => ({
        id: `${i + 1}`,
        value: `${i + 1}`,
        label: `Report ${i + 1}`,
      })
    );

    reportService.getListByReportType.mockResolvedValue(mockReportList);
    (reportTypeFormatter as jest.Mock).mockReturnValue(mockFormattedList);

    const result = await useCase.execute(reportType);

    expect(result).toHaveLength(100);
    expect(result[0]).toEqual({ id: "1", value: "1", label: "Report 1" });
    expect(result[99]).toEqual({
      id: "100",
      value: "100",
      label: "Report 100",
    });
  });
});
