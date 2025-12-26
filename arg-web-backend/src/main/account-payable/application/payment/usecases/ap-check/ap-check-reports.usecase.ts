import { Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { GetApCheckReportDto } from "../../dto/payment.dto";
import { PurchaseJournalService } from "@src/main/account-payable/domain/services/purchase-journal/purchase-journal.service";
import { SpooledMetaDataReportEntity } from "@src/main/account-payable/domain/entities/spooled-meta-data-report.entity";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import { PAYMENT_REPORT_TYPES } from "@src/shared/constants/constant";

@Injectable()
export class ApCheckReportsUsecase {
  private readonly logger = new AppLogger(ApCheckReportsUsecase.name);

  constructor(
    private readonly purchaseJournalService: PurchaseJournalService
  ) {}

  async execute(
    data: GetApCheckReportDto
  ): Promise<PaginatedResponse<SpooledMetaDataReportEntity>> {
    const { voucherToPay, reportType } = data;

    this.logger.log(
      `Get the Cash Requirement Report for ${voucherToPay} and ${reportType}`
    );

    //Always include Check Printing
    data.reportType = [
      PAYMENT_REPORT_TYPES.AP_Check_Printing,
      PAYMENT_REPORT_TYPES.AP_Check_Copies_Creation,
    ];

    this.logger.log(`Get the Report list for ${data.reportType}`);
    return await this.purchaseJournalService.SpooledMetadataReports(data);
  }
}
