import { Test, TestingModule } from "@nestjs/testing";
import { SpooledMetaDataReportsRepository } from "./spooled-meta-data-reports.repository";
import { SpooledMetadataReportModel } from "../models/spooled-metadata-report.model";
import { purchaseJournalReportDto } from "../../application/purchase-journal/dto/purchase-journal.dto";
import { Op } from "@sequelize/core";

// Mock the utility functions
jest.mock("@src/shared/utils/query.utils", () => ({
  normalizeSearchQuery: jest.fn().mockReturnValue({
    limit: 10,
    offset: 0,
    page: 1,
  }),
}));

jest.mock("@src/shared/formatters/dropdown.formatter", () => ({
  reportsFormatter: jest.fn().mockImplementation((data) => data),
}));

// Mock the logger
jest.mock("@src/shared/logger/logger.service", () => ({
  AppLogger: jest.fn().mockImplementation(() => ({
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  })),
}));

describe("SpooledMetaDataReportsRepository", () => {
  let repository: SpooledMetaDataReportsRepository;
  let mockSpooledMetadataReportModel: jest.Mocked<
    typeof SpooledMetadataReportModel
  >;

  const mockDto: purchaseJournalReportDto = {
    reportType: ["VOUCHER_POSTING"],
    fileName: "test-report",
    startDate: "010124",
    endDate: "123124",
    current_page: 1,
    items_per_page: 10,
  };

  const mockReportData = [
    {
      reportType: "VOUCHER_POSTING",
      pdfFileName: "test-report.pdf",
      reportDateTime: new Date("2024-01-01"),
      filePath: "/path/to/file",
      formType: "PDF",
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpooledMetaDataReportsRepository,
        {
          provide: "SpooledMetadataReportModel",
          useValue: {
            findAndCountAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<SpooledMetaDataReportsRepository>(
      SpooledMetaDataReportsRepository
    );
    mockSpooledMetadataReportModel = module.get("SpooledMetadataReportModel");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("SpooledMetadataReports", () => {
    it("should return reports with string reportType", async () => {
      const mockDtoWithStringType = {
        ...mockDto,
        reportType: "VOUCHER_POSTING" as any,
      };

      mockSpooledMetadataReportModel.findAndCountAll.mockResolvedValue({
        rows: mockReportData as any,
        count: [{ count: 1 }] as any,
      });

      const result = await repository.SpooledMetadataReports(
        mockDtoWithStringType
      );

      expect(
        mockSpooledMetadataReportModel.findAndCountAll
      ).toHaveBeenCalledWith({
        attributes: [
          "reportType",
          "pdfFileName",
          "reportDateTime",
          "filePath",
          "formType",
        ],
        where: {
          reportType: "VOUCHER_POSTING",
          pdfFileName: {
            [Op.like]: "%test-report%",
          },
          reportDateTime: {
            [Op.between]: ["2024-01-01", "2024-12-31"],
          },
        },
        offset: 0,
        limit: 10,
        raw: true,
        order: [["reportDateTime", "DESC"]],
      });

      expect(result).toEqual({
        reports: mockReportData,
        count: [{ count: 1 }],
        limit: 10,
        page: 1,
      });
    });

    it("should return reports with array reportType", async () => {
      mockSpooledMetadataReportModel.findAndCountAll.mockResolvedValue({
        rows: mockReportData as any,
        count: [{ count: 1 }] as any,
      });

      const result = await repository.SpooledMetadataReports(mockDto);

      expect(
        mockSpooledMetadataReportModel.findAndCountAll
      ).toHaveBeenCalledWith({
        attributes: [
          "reportType",
          "pdfFileName",
          "reportDateTime",
          "filePath",
          "formType",
        ],
        where: {
          reportType: {
            [Op.in]: ["VOUCHER_POSTING"],
          },
          pdfFileName: {
            [Op.like]: "%test-report%",
          },
          reportDateTime: {
            [Op.between]: ["2024-01-01", "2024-12-31"],
          },
        },
        offset: 0,
        limit: 10,
        raw: true,
        order: [["reportDateTime", "DESC"]],
      });

      expect(result).toEqual({
        reports: mockReportData,
        count: [{ count: 1 }],
        limit: 10,
        page: 1,
      });
    });

    it("should filter by fileName when provided", async () => {
      const mockDtoWithFileName = {
        ...mockDto,
        fileName: "test",
      };

      mockSpooledMetadataReportModel.findAndCountAll.mockResolvedValue({
        rows: mockReportData as any,
        count: [{ count: 1 }] as any,
      });

      await repository.SpooledMetadataReports(mockDtoWithFileName);

      expect(
        mockSpooledMetadataReportModel.findAndCountAll
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            reportType: {
              [Op.in]: ["VOUCHER_POSTING"],
            },
            pdfFileName: {
              [Op.like]: "%test%",
            },
            reportDateTime: {
              [Op.between]: ["2024-01-01", "2024-12-31"],
            },
          }),
        })
      );
    });

    it("should filter by date range when both startDate and endDate are provided", async () => {
      mockSpooledMetadataReportModel.findAndCountAll.mockResolvedValue({
        rows: mockReportData as any,
        count: [{ count: 1 }] as any,
      });

      await repository.SpooledMetadataReports(mockDto);

      expect(
        mockSpooledMetadataReportModel.findAndCountAll
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            reportType: {
              [Op.in]: ["VOUCHER_POSTING"],
            },
            pdfFileName: {
              [Op.like]: "%test-report%",
            },
            reportDateTime: {
              [Op.between]: ["2024-01-01", "2024-12-31"],
            },
          }),
        })
      );
    });

    it("should filter by startDate only when only startDate is provided", async () => {
      const mockDtoWithStartDateOnly = {
        ...mockDto,
        endDate: undefined,
      };

      mockSpooledMetadataReportModel.findAndCountAll.mockResolvedValue({
        rows: mockReportData as any,
        count: [{ count: 1 }] as any,
      });

      await repository.SpooledMetadataReports(mockDtoWithStartDateOnly);

      expect(
        mockSpooledMetadataReportModel.findAndCountAll
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            reportType: {
              [Op.in]: ["VOUCHER_POSTING"],
            },
            pdfFileName: {
              [Op.like]: "%test-report%",
            },
            reportDateTime: {
              [Op.gte]: "2024-01-01",
            },
          }),
        })
      );
    });

    it("should filter by endDate only when only endDate is provided", async () => {
      const mockDtoWithEndDateOnly = {
        ...mockDto,
        startDate: undefined,
      };

      mockSpooledMetadataReportModel.findAndCountAll.mockResolvedValue({
        rows: mockReportData as any,
        count: [{ count: 1 }] as any,
      });

      await repository.SpooledMetadataReports(mockDtoWithEndDateOnly);

      expect(
        mockSpooledMetadataReportModel.findAndCountAll
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            reportType: {
              [Op.in]: ["VOUCHER_POSTING"],
            },
            pdfFileName: {
              [Op.like]: "%test-report%",
            },
            reportDateTime: {
              [Op.lte]: "2024-12-31",
            },
          }),
        })
      );
    });

    it("should handle empty results", async () => {
      mockSpooledMetadataReportModel.findAndCountAll.mockResolvedValue({
        rows: [],
        count: [{ count: 0 }] as any,
      });

      const result = await repository.SpooledMetadataReports(mockDto);

      expect(result).toEqual({
        reports: [],
        count: [{ count: 0 }],
        limit: 10,
        page: 1,
      });
    });

    it("should handle errors during query", async () => {
      const error = new Error("Database connection failed");
      mockSpooledMetadataReportModel.findAndCountAll.mockRejectedValue(error);

      await expect(repository.SpooledMetadataReports(mockDto)).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("createReports", () => {
    it("should create a new report successfully", async () => {
      const mockReportData = {
        reportType: "VOUCHER_POSTING",
        pdfFileName: "test-report.pdf",
        filePath: "/path/to/file",
        reportDateTime: new Date("2024-01-01 10:00:00"),
        formType: "PDF",
      };

      const mockCreatedReport = {
        id: 1,
        ...mockReportData,
      };

      mockSpooledMetadataReportModel.create.mockResolvedValue(
        mockCreatedReport as any
      );

      const result = await repository.createReports(mockReportData);

      expect(mockSpooledMetadataReportModel.create).toHaveBeenCalledWith(
        mockReportData
      );
      expect(result).toEqual(mockCreatedReport);
    });

    it("should handle errors during report creation", async () => {
      const mockReportData = {
        reportType: "VOUCHER_POSTING",
        pdfFileName: "test-report.pdf",
      };

      const error = new Error("Database insert failed");
      mockSpooledMetadataReportModel.create.mockRejectedValue(error);

      await expect(repository.createReports(mockReportData)).rejects.toThrow(
        "Database insert failed"
      );
    });
  });
});
