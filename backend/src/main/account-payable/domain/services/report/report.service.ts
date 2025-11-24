import {
  Injectable,
  Logger,
  Inject,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ReportInterface } from "../../interface/report.interface";
import { ReportEntity } from "../../entities/report.entity";
import {
  Report_Type,
  REPORTS_MENU_TYPES,
  REPORT_MENU_STORE_PROCEDURE,
} from "@src/shared/constants/constant";
import { SubmitReportsMenuDto } from "@src/main/account-payable/application/reports-menu/dto/reports-menu.dto";
import { errorResponse } from "@src/shared/utils/response-formatter";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";
import { callSP } from "@src/shared/config/store-procedure-config";

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  constructor(
    @Inject("ReportInterface")
    private readonly reportRepository: ReportInterface
  ) {}

  async getListByReportType(reportType: Report_Type): Promise<ReportEntity[]> {
    this.logger.log(`Get list for Report List`);

    const reportList = await this.reportRepository.findByReportType(reportType);

    return reportList;
  }

  async submitReportMenu(dto: SubmitReportsMenuDto) {
    this.logger.log(`Submitting Post to Reports Menu ${JSON.stringify(dto)}`);
    const { reportType, companyNo, reportDate, outstandingCheckDate } = dto;

    // Get Report Name and Path
    const report: ReportEntity =
      await this.reportRepository.findOne(reportType);

    const reportName = report.reportName.trim();
    const reportPath = report.path.trim();

    const spresult = await (async () => {
      switch (reportType) {
        case REPORTS_MENU_TYPES.AP_Month_End_Vendor_Totals:
          if (!reportDate) {
            throw new HttpException(
              errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
                {
                  field: "reportDate",
                  code: ERROR_CONSTANTS.NOT_FOUND.code,
                  message: `reportDate is required for AP-Month-End-Vendor-Totals`,
                },
              ]),
              HttpStatus.NOT_FOUND
            );
          }
          return await callSP(
            REPORT_MENU_STORE_PROCEDURE.AP_Month_End_Vendor_Totals
          ).execute({
            companyNo,
            reportDate,
            reportName,
            reportPath,
          });
        case REPORTS_MENU_TYPES.Outstanding_Check_Register:
          if (!outstandingCheckDate) {
            throw new HttpException(
              errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
                {
                  field: "outstandingCheckDate",
                  code: ERROR_CONSTANTS.NOT_FOUND.code,
                  message: `outstandingCheckDate is required for Outstanding-Check-Register`,
                },
              ]),
              HttpStatus.NOT_FOUND
            );
          }
          return await callSP(
            REPORT_MENU_STORE_PROCEDURE.Outstanding_Check_Register
          ).execute({
            companyNo,
            outstandingCheckDate,
            reportName,
            reportPath,
          });
        case REPORTS_MENU_TYPES.AP_Month_End_Vendor_Subtotals:
          if (!reportDate) {
            throw new HttpException(
              errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
                {
                  field: "reportDate",
                  code: ERROR_CONSTANTS.NOT_FOUND.code,
                  message: `reportDate is required for AP-Month-End-Vendor-Subtotals`,
                },
              ]),
              HttpStatus.NOT_FOUND
            );
          }
          return await callSP(
            REPORT_MENU_STORE_PROCEDURE.AP_Month_End_Vendor_Subtotals
          ).execute({
            companyNo,
            reportDate,
            reportName,
            reportPath,
          });
        case REPORTS_MENU_TYPES.AP_Month_End_Vendor_Details:
          if (!reportDate) {
            throw new HttpException(
              errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
                {
                  field: "reportDate",
                  code: ERROR_CONSTANTS.NOT_FOUND.code,
                  message: `reportDate is required for AP-Month-End-Vendor-Details`,
                },
              ]),
              HttpStatus.NOT_FOUND
            );
          }
          return await callSP(
            REPORT_MENU_STORE_PROCEDURE.AP_Month_End_Vendor_Details
          ).execute({
            companyNo,
            reportDate,
            reportName,
            reportPath,
          });
        default:
          throw new HttpException(
            errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
              {
                field: "reportType",
                code: ERROR_CONSTANTS.NOT_FOUND.code,
                message: `Unsupported reportType: ${reportType}`,
              },
            ]),
            HttpStatus.NOT_FOUND
          );
      }
    })();
    this.logger.debug(`${reportType} submitted: ${JSON.stringify(spresult)}`);

    return {
      message: `${reportType} submitted successfully`,
      spresult,
    };
  }
}
