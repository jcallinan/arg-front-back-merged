import { Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { ReportService } from "@src/main/account-payable/domain/services/report/report.service";
import { DropdownType } from "../../../../../../types/types";
import { Report_Type } from "@src/shared/constants/constant";
import { reportTypeFormatter } from "@src/shared/formatters/dropdown.formatter";

@Injectable()
export class ReportListUsecase {
  private readonly logger = new AppLogger(ReportListUsecase.name);

  constructor(private readonly reportService: ReportService) {}

  async execute(reportType: Report_Type): Promise<DropdownType[]> {
    this.logger.log(`Get the Report list`);

    const reportList = await this.reportService.getListByReportType(reportType);

    return reportTypeFormatter(reportList);
  }
}
