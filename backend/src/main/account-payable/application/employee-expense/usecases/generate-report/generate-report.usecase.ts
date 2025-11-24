import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { EmployeeExpenseInterface } from "@src/main/account-payable/domain/interface/employee-expense.interface";
import { generateExcelFile } from "@src/shared/utils/xlsx.utils";
import { saveFileToSharedDrive } from "@src/shared/utils/upload-file-shared-drive";
import { Employee_Expense, Report_Type } from "@src/shared/constants/constant";
import { getTimestamp, TIMESTAMP_FORMATS } from "@src/shared/utils/format-date";
import { SpooledMetaDataReportInterface } from "@src/main/account-payable/domain/interface/spooled-meta-data-report.interface";
import { spoolMetaDataReportData } from "@src/shared/constants/employee-expense-constant";
import { employeeExpenseGenerateReportDto } from "../../dto/employee-expense.dto";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";
import { errorResponse } from "@src/shared/utils/response-formatter";


@Injectable()
export class GenerateReportEmployeeExpenseUsecase {
  private readonly logger = new AppLogger(GenerateReportEmployeeExpenseUsecase.name);

  constructor(
    @Inject("EmployeeExpenseInterface")
    private readonly employeeExpenseInterface: EmployeeExpenseInterface,

    @Inject("SpooledMetaDataReportInterface")
    private readonly spooledMetaDataReportInterface: SpooledMetaDataReportInterface
  ) { }

  private async generateAndSaveReport(
    reportData: any,
    reportType: string,
  ): Promise<{ fileName: string; fullPath: string }> {


    const excelFile = generateExcelFile(reportData);
    // If saveFileToSharedDrive is async, add await
    const savedFile = await saveFileToSharedDrive(excelFile, `${reportType}-${getTimestamp(TIMESTAMP_FORMATS.COMPACT)}.XLSX`);
    return savedFile;
  }

  private async createSpooledReportMetadata(
    savedFile: { fileName: string; fullPath: string },
    reportType: string,
  ) {
    const reportMetaData = {
      ...spoolMetaDataReportData,
      pdfFileName: savedFile.fileName,
      filePath: savedFile.fullPath,
      reportDateTime: getTimestamp(TIMESTAMP_FORMATS.READABLE_DATETIME),
      reportType,
    };

    await this.spooledMetaDataReportInterface.createReports(reportMetaData);
  }

  async execute(data: employeeExpenseGenerateReportDto): Promise<{ message: string }> {
    this.logger.log(`Generate Report for Employee Expense: ${JSON.stringify(data)}`);

    const { companyNo, bankGlNo, dateToPay } = data;

    try {
      // Fetch the Data
      const reportDetails = await this.employeeExpenseInterface.generateReport({
        companyNo,
        bankGlNo,
        dateToPay,
      });

      if (reportDetails.detailedReport.length === 0 && reportDetails.summaryReport.length === 0) {
        throw new HttpException(
          errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
            {
              field: "employee-expense",
              code: ERROR_CONSTANTS.NOT_FOUND.code,
              message: `Data not found for bankGLNo: ${bankGlNo} and companyNo: ${companyNo} to generate reports`,
            },
          ]),
          HttpStatus.NOT_FOUND
        );
      }

      if (!reportDetails) {
        this.logger.warn("No report data found for given parameters");
        return { message: "No report data found" };
      }

      this.logger.log(
        `Detailed Report: ${JSON.stringify(reportDetails.detailedReport)}, Summary Report: ${JSON.stringify(
          reportDetails.summaryReport,
        )}`,
      );

      // Generate and save detailed report
      const detailedPath = await this.generateAndSaveReport(
        reportDetails.detailedReport,
        Employee_Expense.DETAILED,
      );

      // Generate and save summary report
      const summaryPath = await this.generateAndSaveReport(
        reportDetails.summaryReport,
        Employee_Expense.SUMMARY,
      );

      // Save metadata for both reports
      await this.createSpooledReportMetadata(detailedPath, Report_Type.EMPLOYEE_EXPENSE);
      await this.createSpooledReportMetadata(summaryPath, Report_Type.EMPLOYEE_EXPENSE);

      return { message: "Detailed and Summary Report Generated Successfully" };

    } catch (error) {
      this.logger.error(`Failed to generate report: ${error instanceof Error ? error.message : ''}`);
      throw error;
    }
  }
}
