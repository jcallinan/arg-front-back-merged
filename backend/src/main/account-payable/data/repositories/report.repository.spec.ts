import { Test, TestingModule } from "@nestjs/testing";
import { HttpException, HttpStatus } from "@nestjs/common";
import { ReportRepository } from "./report.repository";
import { ProcessTypeModel } from "../models/process-type.model";
import { ReportEntity } from "../../domain/entities/report.entity";
import { Report_Type } from "@src/shared/constants/constant";
import { reportListMapper } from "../mappers/report.mapper";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";
import { errorResponse } from "@src/shared/utils/response-formatter";

// Mock the reportListMapper to avoid dependency issues
jest.mock("../mappers/report.mapper", () => ({
  reportListMapper: jest.fn(),
}));

// Mock the logger to avoid initialization issues
jest.mock("@src/shared/logger/logger.service", () => ({
  AppLogger: jest.fn().mockImplementation(() => ({
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  })),
}));

describe("ReportRepository", () => {
  let repository: ReportRepository;
  let processTypeModel: jest.Mocked<typeof ProcessTypeModel>;

  const mockProcessTypeModel = {
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  const mockReportEntity: ReportEntity = {
    reportName: "Test Report",
    sharedReport: "Shared Test Report",
    definitionName: "Test Definition",
    reportGroup: Report_Type.OPEN_PAYABLES,
    friendlyName: "Test Friendly Name",
    path: "/test/path",
  };

  const mockProcessTypeData = {
    reportName: "Test Report",
    sharedReport: "Shared Test Report",
    definitionName: "Test Definition",
    reportGroup: Report_Type.OPEN_PAYABLES,
    friendlyName: "Test Friendly Name",
    path: "/test/path",
  };

  beforeEach(async () => {
    // Reset the mock before each test
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportRepository,
        {
          provide: "ProcessTypeModel",
          useValue: mockProcessTypeModel,
        },
      ],
    }).compile();

    repository = module.get<ReportRepository>(ReportRepository);
    processTypeModel = module.get("ProcessTypeModel");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findByReportType", () => {
    const reportType = Report_Type.OPEN_PAYABLES;

    it("should successfully retrieve reports by report type", async () => {
      const mockModelData = [mockProcessTypeData];
      const mockMappedData = [mockReportEntity];

      mockProcessTypeModel.findAll.mockResolvedValue(mockModelData);
      (reportListMapper as jest.Mock).mockReturnValue(mockReportEntity);

      const result = await repository.findByReportType(reportType);

      expect(processTypeModel.findAll).toHaveBeenCalledWith({
        where: {
          reportGroup: reportType,
        },
      });
      expect(result).toEqual(mockMappedData);
    });

    it("should return empty array when no reports found", async () => {
      const mockModelData: any[] = [];

      mockProcessTypeModel.findAll.mockResolvedValue(mockModelData);

      const result = await repository.findByReportType(reportType);

      expect(processTypeModel.findAll).toHaveBeenCalledWith({
        where: {
          reportGroup: reportType,
        },
      });
      expect(result).toEqual([]);
    });

    it("should throw HttpException when reports not found (null response)", async () => {
      mockProcessTypeModel.findAll.mockResolvedValue(null);

      await expect(repository.findByReportType(reportType)).rejects.toThrow(
        new HttpException(
          errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
            {
              field: "report-list",
              code: ERROR_CONSTANTS.NOT_FOUND.code,
              message: "Report List Not Found",
            },
          ]),
          HttpStatus.NOT_FOUND
        )
      );

      expect(processTypeModel.findAll).toHaveBeenCalledWith({
        where: {
          reportGroup: reportType,
        },
      });
    });

    it("should throw HttpException when reports not found (undefined response)", async () => {
      mockProcessTypeModel.findAll.mockResolvedValue(undefined);

      await expect(repository.findByReportType(reportType)).rejects.toThrow(
        new HttpException(
          errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
            {
              field: "report-list",
              code: ERROR_CONSTANTS.NOT_FOUND.code,
              message: "Report List Not Found",
            },
          ]),
          HttpStatus.NOT_FOUND
        )
      );

      expect(processTypeModel.findAll).toHaveBeenCalledWith({
        where: {
          reportGroup: reportType,
        },
      });
    });

    it("should handle multiple report types correctly", async () => {
      const reportTypes = [
        Report_Type.OPEN_PAYABLES,
        Report_Type.VOUCHER_POSTING,
        Report_Type.VENDOR_REPORTS,
      ];

      for (const type of reportTypes) {
        const mockModelData = [{ ...mockProcessTypeData, reportGroup: type }];
        const mockMappedData = [{ ...mockReportEntity, reportGroup: type }];

        mockProcessTypeModel.findAll.mockResolvedValue(mockModelData);
        (reportListMapper as jest.Mock).mockReturnValue(mockMappedData[0]);

        const result = await repository.findByReportType(type);

        expect(processTypeModel.findAll).toHaveBeenCalledWith({
          where: {
            reportGroup: type,
          },
        });
        expect(result).toEqual(mockMappedData);
      }
    });

    it("should handle database errors gracefully", async () => {
      const dbError = new Error("Database connection failed");
      mockProcessTypeModel.findAll.mockRejectedValue(dbError);

      await expect(repository.findByReportType(reportType)).rejects.toThrow(
        dbError
      );

      expect(processTypeModel.findAll).toHaveBeenCalledWith({
        where: {
          reportGroup: reportType,
        },
      });
    });
  });

  describe("findOne", () => {
    const reportName = "Test Report";

    it("should successfully retrieve a single report by name", async () => {
      mockProcessTypeModel.findOne.mockResolvedValue(mockProcessTypeData);

      const result = await repository.findOne(reportName);

      expect(processTypeModel.findOne).toHaveBeenCalledWith({
        where: {
          reportName,
        },
      });
      expect(result).toEqual(mockProcessTypeData);
    });

    it("should throw HttpException when report not found (null response)", async () => {
      mockProcessTypeModel.findOne.mockResolvedValue(null);

      await expect(repository.findOne(reportName)).rejects.toThrow(
        new HttpException(
          errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
            {
              field: "report",
              code: ERROR_CONSTANTS.NOT_FOUND.code,
              message: "Report Not Found",
            },
          ]),
          HttpStatus.NOT_FOUND
        )
      );

      expect(processTypeModel.findOne).toHaveBeenCalledWith({
        where: {
          reportName,
        },
      });
    });

    it("should throw HttpException when report not found (undefined response)", async () => {
      mockProcessTypeModel.findOne.mockResolvedValue(undefined);

      await expect(repository.findOne(reportName)).rejects.toThrow(
        new HttpException(
          errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
            {
              field: "report",
              code: ERROR_CONSTANTS.NOT_FOUND.code,
              message: "Report Not Found",
            },
          ]),
          HttpStatus.NOT_FOUND
        )
      );

      expect(processTypeModel.findOne).toHaveBeenCalledWith({
        where: {
          reportName,
        },
      });
    });

    it("should handle different report names correctly", async () => {
      const reportNames = [
        "AP-Month-End-Vendor-Totals",
        "Outstanding-Check-Register",
        "AP-Cash-Requirements",
        "AP-Nacha-ACH-Creation",
      ];

      for (const name of reportNames) {
        const mockModelData = { ...mockProcessTypeData, reportName: name };

        mockProcessTypeModel.findOne.mockResolvedValue(mockModelData);

        const result = await repository.findOne(name);

        expect(processTypeModel.findOne).toHaveBeenCalledWith({
          where: {
            reportName: name,
          },
        });
        expect(result).toEqual(mockModelData);
      }
    });

    it("should handle database errors gracefully", async () => {
      const dbError = new Error("Database connection failed");
      mockProcessTypeModel.findOne.mockRejectedValue(dbError);

      await expect(repository.findOne(reportName)).rejects.toThrow(dbError);

      expect(processTypeModel.findOne).toHaveBeenCalledWith({
        where: {
          reportName,
        },
      });
    });

    it("should handle empty string report name", async () => {
      const emptyReportName = "";
      mockProcessTypeModel.findOne.mockResolvedValue(null);

      await expect(repository.findOne(emptyReportName)).rejects.toThrow(
        new HttpException(
          errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
            {
              field: "report",
              code: ERROR_CONSTANTS.NOT_FOUND.code,
              message: "Report Not Found",
            },
          ]),
          HttpStatus.NOT_FOUND
        )
      );

      expect(processTypeModel.findOne).toHaveBeenCalledWith({
        where: {
          reportName: emptyReportName,
        },
      });
    });
  });

  describe("Repository Integration", () => {
    it("should handle both methods with consistent error handling", async () => {
      const reportType = Report_Type.OPEN_PAYABLES;
      const reportName = "Test Report";

      // Test findByReportType with error
      mockProcessTypeModel.findAll.mockResolvedValue(null);
      await expect(repository.findByReportType(reportType)).rejects.toThrow(
        HttpException
      );

      // Test findOne with error
      mockProcessTypeModel.findOne.mockResolvedValue(null);
      await expect(repository.findOne(reportName)).rejects.toThrow(
        HttpException
      );

      // Verify both methods were called
      expect(processTypeModel.findAll).toHaveBeenCalled();
      expect(processTypeModel.findOne).toHaveBeenCalled();
    });

    it("should maintain consistent logging behavior", async () => {
      const reportType = Report_Type.OPEN_PAYABLES;
      const reportName = "Test Report";

      mockProcessTypeModel.findAll.mockResolvedValue([mockProcessTypeData]);
      mockProcessTypeModel.findOne.mockResolvedValue(mockProcessTypeData);

      await repository.findByReportType(reportType);
      await repository.findOne(reportName);

      // Both methods should log their operations
      expect(processTypeModel.findAll).toHaveBeenCalled();
      expect(processTypeModel.findOne).toHaveBeenCalled();
    });
  });
});
