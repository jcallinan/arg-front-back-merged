import { Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { ReportService } from "@src/main/account-payable/domain/services/report/report.service";
import { SubmitReportsMenuDto } from "../../dto/reports-menu.dto";

@Injectable()
export class ReportsMenuSubmitUseCase {
  private readonly logger = new AppLogger(ReportsMenuSubmitUseCase.name);

  constructor(
    private readonly reportService: ReportService
  ) {}

  async execute(dto: SubmitReportsMenuDto) {
    this.logger.log(`Submitting Reports Menu ${dto}`);
    const result =
    await this.reportService.submitReportMenu(dto);
    return result;
  }
}
