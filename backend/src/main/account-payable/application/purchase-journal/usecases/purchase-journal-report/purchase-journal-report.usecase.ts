import { Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { PurchaseJournalService } from "@src/main/account-payable/domain/services/purchase-journal/purchase-journal.service";
import { SpooledMetaDataReportEntity } from "@src/main/account-payable/domain/entities/spooled-meta-data-report.entity";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import { purchaseJournalReportDto } from "../../dto/purchase-journal.dto";
import { PURCHASE_JOURNAL } from "@src/shared/constants/constant";

@Injectable()
export class PuchaseJournalReportsUseCase {
  private readonly logger = new AppLogger(PuchaseJournalReportsUseCase.name);

  constructor(
    private readonly purchaseJournalService: PurchaseJournalService
  ) { }

  async execute(
    dto: purchaseJournalReportDto
  ): Promise<PaginatedResponse<SpooledMetaDataReportEntity>> {
    this.logger.log(`Fetching Purchase Journal Reports`);

    if (!dto.reportType) {
      dto.reportType = [PURCHASE_JOURNAL.AP_Purchase_Journal, PURCHASE_JOURNAL.AP_Purchase_Register, PURCHASE_JOURNAL.Inventory_Receipts_Posting]
    }

    const reportList =
      await this.purchaseJournalService.SpooledMetadataReports(dto);

    return reportList;
  }
}
