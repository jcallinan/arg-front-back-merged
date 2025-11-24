import { Report_Type } from "@src/shared/constants/constant";
import { ReportEntity } from "../entities/report.entity";

export interface ReportInterface {
  findByReportType(
    reportType: Report_Type
  ): Promise<ReportEntity[]>;

  findOne(
    reportName: string
  ): Promise<ReportEntity>;

  findAll(
    reportName: string[]
  ): Promise<ReportEntity[]>;
}
