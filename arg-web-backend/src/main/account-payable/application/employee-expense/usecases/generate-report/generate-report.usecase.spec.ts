import { Test, TestingModule } from "@nestjs/testing";
import { GenerateReportEmployeeExpenseUsecase } from "./generate-report.usecase";
import { AppLogger } from "@src/shared/logger/logger.service";
import { employeeExpenseGenerateReportDto } from "../../dto/employee-expense.dto";
import { HttpException } from "@nestjs/common";

jest.mock("@src/shared/utils/xlsx.utils", () => ({
  generateExcelFile: jest.fn(() => Buffer.from("excel-data")),
}));

jest.mock("@src/shared/utils/upload-file-shared-drive", () => ({
  saveFileToSharedDrive: jest.fn((_, name) =>
    Promise.resolve({ fileName: name, fullPath: `/shared/${name}` })
  ),
}));

jest.mock("@src/shared/utils/format-date", () => ({
  getTimestamp: jest.fn(() => "2025-08-19T12-00-00"),
  TIMESTAMP_FORMATS: {
    COMPACT: "yyyyMMddHHmmssSSS",
    READABLE_DATETIME: "yyyy-MM-dd HH:mm:ss.SSS",
    ISO_DATE: "yyyy-MM-dd'T'HH:mm:ss.SSSX",
  },
}));

describe("GenerateReportEmployeeExpenseUsecase", () => {
  let useCase: GenerateReportEmployeeExpenseUsecase;

  const errorSpy = jest
    .spyOn(AppLogger.prototype, "error")
    .mockImplementation(jest.fn());

  const mockEmployeeExpenseInterface = {
    generateReport: jest.fn(),
  };

  const mockSpooledMetaDataReportInterface = {
    createReports: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateReportEmployeeExpenseUsecase,
        {
          provide: "EmployeeExpenseInterface",
          useValue: mockEmployeeExpenseInterface,
        },
        {
          provide: "SpooledMetaDataReportInterface",
          useValue: mockSpooledMetaDataReportInterface,
        },
      ],
    }).compile();

    useCase = module.get(GenerateReportEmployeeExpenseUsecase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockDto: employeeExpenseGenerateReportDto = {
    companyNo: 10,
    bankGlNo: 990003,
    dateToPay: "20251125",
  };

  it("should generate detailed and summary reports successfully", async () => {
    mockEmployeeExpenseInterface.generateReport = jest.fn().mockResolvedValue({
      detailedReport: [{ name: "John" }],
      summaryReport: [{ total: 100 }],
    });

    mockSpooledMetaDataReportInterface.createReports = jest
      .fn()
      .mockResolvedValue(undefined);

    const result = await useCase.execute(mockDto);

    expect(mockEmployeeExpenseInterface.generateReport).toHaveBeenCalledWith({
      companyNo: 10,
      bankGlNo: 990003,
      dateToPay: "20251125",
    });

    expect(
      mockSpooledMetaDataReportInterface.createReports
    ).toHaveBeenCalledTimes(2);

    expect(result).toEqual({
      message: "Detailed and Summary Report Generated Successfully",
    });
  });

  it("should return message when no report data is found", async () => {
    mockEmployeeExpenseInterface.generateReport = jest.fn().mockResolvedValue({
      detailedReport: [],
      summaryReport: [],
    });

    await expect(useCase.execute(mockDto)).rejects.toThrow(HttpException);
  });

  it("should throw an error when report generation fails", async () => {
    mockEmployeeExpenseInterface.generateReport = jest
      .fn()
      .mockRejectedValue(new Error("Something went wrong"));

    await expect(useCase.execute(mockDto)).rejects.toThrow(
      "Something went wrong"
    );

    expect(errorSpy).toHaveBeenCalledWith(
      "Failed to generate report: Something went wrong"
    );
  });
});
