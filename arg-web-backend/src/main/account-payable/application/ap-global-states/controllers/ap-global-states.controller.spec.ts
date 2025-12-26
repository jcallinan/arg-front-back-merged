import { Test, TestingModule } from "@nestjs/testing";
import { APGlobalStatesController } from "./ap-global-states";
import { ReportListUsecase } from "../usecases/report-list/report-list.usecase";
import { Report_Type } from "@src/shared/constants/constant";
import { DropdownType } from "../../../../../types/types";
import { SimpleResponse } from "@src/shared/utils/response-formatter";

describe("APGlobalStatesController", () => {
  let controller: APGlobalStatesController;
  let reportListUsecase: jest.Mocked<ReportListUsecase>;

  beforeEach(async () => {
    const mockReportListUsecase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [APGlobalStatesController],
      providers: [
        {
          provide: ReportListUsecase,
          useValue: mockReportListUsecase,
        },
      ],
    }).compile();

    controller = module.get<APGlobalStatesController>(APGlobalStatesController);
    reportListUsecase = module.get(ReportListUsecase);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getPurchaseJournalReportList", () => {
    it("should return dropdown data for OPEN_PAYABLES report type", async () => {
      const reportType = Report_Type.OPEN_PAYABLES;
      const mockDropdownData: DropdownType[] = [
        {
          id: "1",
          value: "open-payables-by-due-date",
          label: "Open Payables By Due Date",
        },
        {
          id: "2",
          value: "open-payables-in-hold-status",
          label: "Open Payables In Hold Status",
        },
      ];

      reportListUsecase.execute.mockResolvedValue(mockDropdownData);

      const result = await controller.getPurchaseJournalReportList(reportType);

      expect(result).toEqual({
        items: mockDropdownData,
      } as SimpleResponse<DropdownType[]>);
      expect(reportListUsecase.execute).toHaveBeenCalledWith(reportType);
    });

    it("should return dropdown data for VOUCHER_POSTING report type", async () => {
      const reportType = Report_Type.VOUCHER_POSTING;
      const mockDropdownData: DropdownType[] = [
        {
          id: "3",
          value: "voucher-posting-summary",
          label: "Voucher Posting Summary",
        },
      ];

      reportListUsecase.execute.mockResolvedValue(mockDropdownData);

      const result = await controller.getPurchaseJournalReportList(reportType);

      expect(result).toEqual({
        items: mockDropdownData,
      } as SimpleResponse<DropdownType[]>);
      expect(reportListUsecase.execute).toHaveBeenCalledWith(reportType);
    });

    it("should return dropdown data for VENDOR_REPORTS report type", async () => {
      const reportType = Report_Type.VENDOR_REPORTS;
      const mockDropdownData: DropdownType[] = [
        {
          id: "4",
          value: "vendor-year-end-process",
          label: "Vendor Year End Process",
        },
        {
          id: "5",
          value: "vendor-1099-report",
          label: "Vendor 1099 Report",
        },
      ];

      reportListUsecase.execute.mockResolvedValue(mockDropdownData);

      const result = await controller.getPurchaseJournalReportList(reportType);

      expect(result).toEqual({
        items: mockDropdownData,
      } as SimpleResponse<DropdownType[]>);
      expect(reportListUsecase.execute).toHaveBeenCalledWith(reportType);
    });

    it("should return empty dropdown data when no reports available", async () => {
      const reportType = Report_Type.AP_MONTH_END;
      const mockDropdownData: DropdownType[] = [];

      reportListUsecase.execute.mockResolvedValue(mockDropdownData);

      const result = await controller.getPurchaseJournalReportList(reportType);

      expect(result).toEqual({
        items: [],
      } as SimpleResponse<DropdownType[]>);
      expect(reportListUsecase.execute).toHaveBeenCalledWith(reportType);
    });

    it("should return dropdown data for AP_PAYMENT_CYCLE report type", async () => {
      const reportType = Report_Type.AP_PAYMENT_CYCLE;
      const mockDropdownData: DropdownType[] = [
        {
          id: "6",
          value: "payment-cycle-summary",
          label: "Payment Cycle Summary",
        },
        {
          id: "7",
          value: "payment-cycle-details",
          label: "Payment Cycle Details",
        },
      ];

      reportListUsecase.execute.mockResolvedValue(mockDropdownData);

      const result = await controller.getPurchaseJournalReportList(reportType);

      expect(result).toEqual({
        items: mockDropdownData,
      } as SimpleResponse<DropdownType[]>);
      expect(reportListUsecase.execute).toHaveBeenCalledWith(reportType);
    });

    it("should return dropdown data for CHECK_REGISTER report type", async () => {
      const reportType = Report_Type.CHECK_REGISTER;
      const mockDropdownData: DropdownType[] = [
        {
          id: "8",
          value: "check-register-summary",
          label: "Check Register Summary",
        },
      ];

      reportListUsecase.execute.mockResolvedValue(mockDropdownData);

      const result = await controller.getPurchaseJournalReportList(reportType);

      expect(result).toEqual({
        items: mockDropdownData,
      } as SimpleResponse<DropdownType[]>);
      expect(reportListUsecase.execute).toHaveBeenCalledWith(reportType);
    });

    it("should return dropdown data for EMPLOYEE_EXPENSE report type", async () => {
      const reportType = Report_Type.EMPLOYEE_EXPENSE;
      const mockDropdownData: DropdownType[] = [
        {
          id: "9",
          value: "employee-expense-summary",
          label: "Employee Expense Summary",
        },
        {
          id: "10",
          value: "employee-expense-details",
          label: "Employee Expense Details",
        },
      ];

      reportListUsecase.execute.mockResolvedValue(mockDropdownData);

      const result = await controller.getPurchaseJournalReportList(reportType);

      expect(result).toEqual({
        items: mockDropdownData,
      } as SimpleResponse<DropdownType[]>);
      expect(reportListUsecase.execute).toHaveBeenCalledWith(reportType);
    });

    it("should handle large dropdown data sets", async () => {
      const reportType = Report_Type.OPEN_PAYABLES;
      const mockDropdownData: DropdownType[] = Array.from(
        { length: 100 },
        (_, i) => ({
          id: (i + 1).toString(),
          value: `report-${i + 1}`,
          label: `Report ${i + 1}`,
        })
      );

      reportListUsecase.execute.mockResolvedValue(mockDropdownData);

      const result = await controller.getPurchaseJournalReportList(reportType);

      expect(result.items).toHaveLength(100);
      expect(result.items[0]).toEqual({
        id: "1",
        value: "report-1",
        label: "Report 1",
      });
      expect(result.items[99]).toEqual({
        id: "100",
        value: "report-100",
        label: "Report 100",
      });
      expect(reportListUsecase.execute).toHaveBeenCalledWith(reportType);
    });

    it("should handle errors from usecase gracefully", async () => {
      const reportType = Report_Type.OPEN_PAYABLES;
      const errorMessage = "Failed to fetch report list";

      reportListUsecase.execute.mockRejectedValue(new Error(errorMessage));

      await expect(
        controller.getPurchaseJournalReportList(reportType)
      ).rejects.toThrow(errorMessage);

      expect(reportListUsecase.execute).toHaveBeenCalledWith(reportType);
    });

    it("should handle null response from usecase", async () => {
      const reportType = Report_Type.OPEN_PAYABLES;

      reportListUsecase.execute.mockResolvedValue(
        null as unknown as DropdownType[]
      );

      const result = await controller.getPurchaseJournalReportList(reportType);

      expect(result).toEqual({
        items: null,
      } as unknown as SimpleResponse<DropdownType[]>);
      expect(reportListUsecase.execute).toHaveBeenCalledWith(reportType);
    });

    it("should handle undefined response from usecase", async () => {
      const reportType = Report_Type.OPEN_PAYABLES;

      reportListUsecase.execute.mockResolvedValue(
        undefined as unknown as DropdownType[]
      );

      const result = await controller.getPurchaseJournalReportList(reportType);

      expect(result).toEqual({
        items: undefined,
      } as unknown as SimpleResponse<DropdownType[]>);
      expect(reportListUsecase.execute).toHaveBeenCalledWith(reportType);
    });

    it("should validate that the controller method returns SimpleResponse type", async () => {
      const reportType = Report_Type.OPEN_PAYABLES;
      const mockDropdownData: DropdownType[] = [
        {
          id: "1",
          value: "test-report",
          label: "Test Report",
        },
      ];

      reportListUsecase.execute.mockResolvedValue(mockDropdownData);

      const result = await controller.getPurchaseJournalReportList(reportType);

      // Verify the result has the correct structure
      expect(result).toHaveProperty("items");
      expect(Array.isArray(result.items)).toBe(true);
      expect(result.items).toEqual(mockDropdownData);

      // Verify the result is properly typed as SimpleResponse
      const typedResult: SimpleResponse<DropdownType[]> = result;
      expect(typedResult.items).toBeDefined();
    });
  });
});
