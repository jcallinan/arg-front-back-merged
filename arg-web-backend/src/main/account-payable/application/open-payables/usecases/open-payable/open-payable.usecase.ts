import { Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { purchaseJournalReportDto } from "../../../purchase-journal/dto/purchase-journal.dto";
import { PurchaseJournalService } from "@src/main/account-payable/domain/services/purchase-journal/purchase-journal.service";
import { SpooledMetaDataReportEntity } from "@src/main/account-payable/domain/entities/spooled-meta-data-report.entity";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import { OPEN_PAYABLES_TYPES } from "@src/shared/constants/constant";


@Injectable()
export class OpenPayablesUsecase {
    private readonly logger = new AppLogger(OpenPayablesUsecase.name);

    constructor(
        private readonly purchaseJournalService: PurchaseJournalService
    ) { }

    async execute(data: purchaseJournalReportDto): Promise<PaginatedResponse<SpooledMetaDataReportEntity>> {

        const { reportType } = data

        if (!reportType) {
            data.reportType = [OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_DUE_DATE, OPEN_PAYABLES_TYPES.OPEN_PAYABLES_IN_HOLD_STATUS, OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_VENDOR_DISCOUNTS, OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_VENDOR_AGED]
        }
        
        this.logger.log(`Get the Report list for Open Payables`);
        return await this.purchaseJournalService.SpooledMetadataReports(data);
    }
}
