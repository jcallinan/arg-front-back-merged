import { Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { ReportsMenuDto } from "../../dto/reports-menu.dto";
import { PurchaseJournalService } from "@src/main/account-payable/domain/services/purchase-journal/purchase-journal.service";
import { SpooledMetaDataReportEntity } from "@src/main/account-payable/domain/entities/spooled-meta-data-report.entity";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import { REPORTS_MENU_TYPES } from "@src/shared/constants/constant";

@Injectable()
export class ReportsMenuUsecase {
  private readonly logger = new AppLogger(ReportsMenuUsecase.name);

  constructor(
    private readonly purchaseJournalService: PurchaseJournalService
  ) {}

  async execute(
    data: ReportsMenuDto
  ): Promise<PaginatedResponse<SpooledMetaDataReportEntity>> {
    const { reportType } = data;

    if (!reportType?.length) {
      data.reportType = [
        REPORTS_MENU_TYPES.AP_Month_End_Vendor_Totals,
        REPORTS_MENU_TYPES.Outstanding_Check_Register,
        REPORTS_MENU_TYPES.AP_Month_End_Vendor_Subtotals,
        REPORTS_MENU_TYPES.AP_Month_End_Vendor_Details,
      ];
    }
    this.logger.log(`Get the Report list for ${data.reportType}`);
    return await this.purchaseJournalService.SpooledMetadataReports(data);
  }
}
