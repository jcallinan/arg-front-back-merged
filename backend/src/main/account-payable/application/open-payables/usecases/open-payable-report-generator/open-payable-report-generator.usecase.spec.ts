import { Test, TestingModule } from "@nestjs/testing";
import { OpenPayablesReportGeneratorUseCase } from "./open-payable-report-generator.usecase";
import { ReportRepository } from "@src/main/account-payable/data/repositories/report.repository";
import { ReportEntity } from "@src/main/account-payable/domain/entities/report.entity";
import { generateReportDto } from "../../dto/open-payables.dto";
import { OPEN_PAYABLES_TYPES } from "@src/shared/constants/constant";

// Mock the stored procedure functions
jest.mock(
  "@src/main/account-payable/data/stored-procedure/open-payables-report-generator-procedure",
  () => ({
    openPayableVendorAgedAndHold: jest.fn(),
    openPayablesReportGenerateByVendor: jest.fn(),
  })
);

import {
  openPayableVendorAgedAndHold,
  openPayablesReportGenerateByVendor,
} from "@src/main/account-payable/data/stored-procedure/open-payables-report-generator-procedure";

describe("OpenPayablesReportGeneratorUseCase", () => {
  let usecase: OpenPayablesReportGeneratorUseCase;
  let mockReportRepository: jest.Mocked<ReportRepository>;

  const mockReport: ReportEntity = {
    reportName: "AP700PRC",
    sharedReport: "Y",
    definitionName: "Open Payables Report",
    reportGroup: "AP",
    friendlyName: "Open Payables Report",
    path: "/reports/open-payables",
  };

  const mockSpResult = {
    success: true,
    reportId: "12345",
    message: "Report generated successfully",
  };

  beforeEach(async () => {
    const mockReportRepositoryProvider = {
      provide: "ReportInterface",
      useValue: {
        findOne: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenPayablesReportGeneratorUseCase,
        mockReportRepositoryProvider,
      ],
    }).compile();

    usecase = module.get<OpenPayablesReportGeneratorUseCase>(
      OpenPayablesReportGeneratorUseCase
    );
    mockReportRepository = module.get("ReportInterface");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("should generate report using openPayableVendorAgedAndHold for due date type", async () => {
      // Arrange
      const inputDto: generateReportDto = {
        companyNo: 10,
        openPayables: OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_DUE_DATE,
        holdVoucher: "N",
        dateOne: new Date("2024-01-01"),
        dateTwo: "2024-01-31",
      };

      mockReportRepository.findOne.mockResolvedValue(mockReport);
      (openPayableVendorAgedAndHold as jest.Mock).mockResolvedValue(
        mockSpResult
      );

      // Act
      const result = await usecase.execute(inputDto);

      // Assert
      expect(mockReportRepository.findOne).toHaveBeenCalledWith(
        OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_DUE_DATE
      );
      expect(openPayableVendorAgedAndHold).toHaveBeenCalledWith(
        mockReport.reportName.trim(),
        mockReport.path.trim(),
        inputDto
      );
      expect(openPayablesReportGenerateByVendor).not.toHaveBeenCalled();
      expect(result).toEqual({
        message: "OpenPayable report generated successfully",
        spresult: mockSpResult,
      });
    });

    it("should generate report using openPayableVendorAgedAndHold for hold status type", async () => {
      // Arrange
      const inputDto: generateReportDto = {
        companyNo: 10,
        openPayables: OPEN_PAYABLES_TYPES.OPEN_PAYABLES_IN_HOLD_STATUS,
        holdVoucher: "Y",
      };

      mockReportRepository.findOne.mockResolvedValue(mockReport);
      (openPayableVendorAgedAndHold as jest.Mock).mockResolvedValue(
        mockSpResult
      );

      // Act
      const result = await usecase.execute(inputDto);

      // Assert
      expect(mockReportRepository.findOne).toHaveBeenCalledWith(
        OPEN_PAYABLES_TYPES.OPEN_PAYABLES_IN_HOLD_STATUS
      );
      expect(openPayableVendorAgedAndHold).toHaveBeenCalledWith(
        mockReport.reportName.trim(),
        mockReport.path.trim(),
        inputDto
      );
      expect(openPayablesReportGenerateByVendor).not.toHaveBeenCalled();
      expect(result).toEqual({
        message: "OpenPayable report generated successfully",
        spresult: mockSpResult,
      });
    });

    it("should generate report using openPayablesReportGenerateByVendor for vendor discounts type", async () => {
      // Arrange
      const inputDto: generateReportDto = {
        companyNo: 10,
        openPayables: OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_VENDOR_DISCOUNTS,
        dateOne: new Date("2024-01-01"),
        dateTwo: "2024-01-31",
        dateThree: "2024-02-01",
        dateFour: "2024-02-28",
      };

      mockReportRepository.findOne.mockResolvedValue(mockReport);
      (openPayablesReportGenerateByVendor as jest.Mock).mockResolvedValue(
        mockSpResult
      );

      // Act
      const result = await usecase.execute(inputDto);

      // Assert
      expect(mockReportRepository.findOne).toHaveBeenCalledWith(
        OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_VENDOR_DISCOUNTS
      );
      expect(openPayablesReportGenerateByVendor).toHaveBeenCalledWith(
        mockReport.reportName.trim(),
        mockReport.path.trim(),
        inputDto
      );
      expect(openPayableVendorAgedAndHold).not.toHaveBeenCalled();
      expect(result).toEqual({
        message: "OpenPayable report generated successfully",
        spresult: mockSpResult,
      });
    });

    it("should generate report using openPayablesReportGenerateByVendor for vendor aged type", async () => {
      // Arrange
      const inputDto: generateReportDto = {
        companyNo: 10,
        openPayables: OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_VENDOR_AGED,
        dateOne: new Date("2024-01-01"),
        dateTwo: "2024-01-31",
        dateThree: "2024-02-01",
        dateFour: "2024-02-28",
      };

      mockReportRepository.findOne.mockResolvedValue(mockReport);
      (openPayablesReportGenerateByVendor as jest.Mock).mockResolvedValue(
        mockSpResult
      );

      // Act
      const result = await usecase.execute(inputDto);

      // Assert
      expect(mockReportRepository.findOne).toHaveBeenCalledWith(
        OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_VENDOR_AGED
      );
      expect(openPayablesReportGenerateByVendor).toHaveBeenCalledWith(
        mockReport.reportName.trim(),
        mockReport.path.trim(),
        inputDto
      );
      expect(openPayableVendorAgedAndHold).not.toHaveBeenCalled();
      expect(result).toEqual({
        message: "OpenPayable report generated successfully",
        spresult: mockSpResult,
      });
    });

    it("should handle report with whitespace in reportName and path", async () => {
      // Arrange
      const reportWithWhitespace: ReportEntity = {
        ...mockReport,
        reportName: " AP700PRC ",
        path: " /reports/open-payables ",
      };

      const inputDto: generateReportDto = {
        companyNo: 10,
        openPayables: OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_DUE_DATE,
      };

      mockReportRepository.findOne.mockResolvedValue(reportWithWhitespace);
      (openPayableVendorAgedAndHold as jest.Mock).mockResolvedValue(
        mockSpResult
      );

      // Act
      const result = await usecase.execute(inputDto);

      // Assert
      expect(openPayableVendorAgedAndHold).toHaveBeenCalledWith(
        "AP700PRC",
        "/reports/open-payables",
        inputDto
      );
      expect(result).toEqual({
        message: "OpenPayable report generated successfully",
        spresult: mockSpResult,
      });
    });

    it("should handle all optional parameters in input dto", async () => {
      // Arrange
      const inputDto: generateReportDto = {
        companyNo: 15,
        openPayables: OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_DUE_DATE,
        holdVoucher: "Y",
        dateOne: new Date("2024-03-01"),
        dateTwo: "2024-03-31",
        dateThree: "2024-04-01",
        dateFour: "2024-04-30",
        populateSpreadsheet: "Y",
      };

      mockReportRepository.findOne.mockResolvedValue(mockReport);
      (openPayableVendorAgedAndHold as jest.Mock).mockResolvedValue(
        mockSpResult
      );

      // Act
      const result = await usecase.execute(inputDto);

      // Assert
      expect(mockReportRepository.findOne).toHaveBeenCalledWith(
        OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_DUE_DATE
      );
      expect(openPayableVendorAgedAndHold).toHaveBeenCalledWith(
        mockReport.reportName.trim(),
        mockReport.path.trim(),
        inputDto
      );
      expect(result).toEqual({
        message: "OpenPayable report generated successfully",
        spresult: mockSpResult,
      });
    });

    it("should handle repository errors gracefully", async () => {
      // Arrange
      const inputDto: generateReportDto = {
        companyNo: 10,
        openPayables: OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_DUE_DATE,
      };

      const error = new Error("Repository error");
      mockReportRepository.findOne.mockRejectedValue(error);

      // Act & Assert
      await expect(usecase.execute(inputDto)).rejects.toThrow(
        "Repository error"
      );
      expect(mockReportRepository.findOne).toHaveBeenCalledWith(
        OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_DUE_DATE
      );
    });

    it("should handle stored procedure errors gracefully", async () => {
      // Arrange
      const inputDto: generateReportDto = {
        companyNo: 10,
        openPayables: OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_DUE_DATE,
      };

      mockReportRepository.findOne.mockResolvedValue(mockReport);
      const error = new Error("Stored procedure error");
      (openPayableVendorAgedAndHold as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(usecase.execute(inputDto)).rejects.toThrow(
        "Stored procedure error"
      );
      expect(mockReportRepository.findOne).toHaveBeenCalledWith(
        OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_DUE_DATE
      );
      expect(openPayableVendorAgedAndHold).toHaveBeenCalledWith(
        mockReport.reportName.trim(),
        mockReport.path.trim(),
        inputDto
      );
    });

    it("should handle different company numbers", async () => {
      // Arrange
      const companyNumbers = [1, 10, 15, 20];

      for (const companyNo of companyNumbers) {
        const inputDto: generateReportDto = {
          companyNo,
          openPayables: OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_DUE_DATE,
        };

        mockReportRepository.findOne.mockResolvedValue(mockReport);
        (openPayableVendorAgedAndHold as jest.Mock).mockResolvedValue(
          mockSpResult
        );

        // Act
        const result = await usecase.execute(inputDto);

        // Assert
        expect(result).toEqual({
          message: "OpenPayable report generated successfully",
          spresult: mockSpResult,
        });
      }
    });
  });

  describe("usecase initialization", () => {
    it("should be defined", () => {
      expect(usecase).toBeDefined();
    });

    it("should have required dependencies injected", () => {
      expect(usecase["reportRepository"]).toBeDefined();
    });

    it("should have logger initialized", () => {
      expect(usecase["logger"]).toBeDefined();
    });
  });
});
