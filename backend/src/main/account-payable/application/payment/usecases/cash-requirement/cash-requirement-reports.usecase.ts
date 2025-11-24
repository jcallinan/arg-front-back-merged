import { Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { GetCashRequirementReportDto } from "../../dto/payment.dto";
import { PurchaseJournalService } from "@src/main/account-payable/domain/services/purchase-journal/purchase-journal.service";
import { SpooledMetaDataReportEntity } from "@src/main/account-payable/domain/entities/spooled-meta-data-report.entity";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import { PAYMENT_REPORT_TYPES } from "@src/shared/constants/constant";
import { PAYMENT_VOUCHER_TYPES } from "@src/shared/constants/payment-constant";


@Injectable()
export class CashRequirementReportsUsecase {
    private readonly logger = new AppLogger(CashRequirementReportsUsecase.name);

    constructor(
        private readonly purchaseJournalService: PurchaseJournalService
    ) { }

    async execute(data: GetCashRequirementReportDto): Promise<PaginatedResponse<SpooledMetaDataReportEntity>> {
        const { voucherToPay, reportType } = data

        this.logger.log(`Get the Cash Requirement Report for ${voucherToPay} and ${reportType}`);
        
        //Always include Cash Requirement
        data.reportType = [PAYMENT_REPORT_TYPES.AP_Cash_Requirement]
        

        //For ACH, include Nacha ACH Creation
        if(voucherToPay === PAYMENT_VOUCHER_TYPES.ACH) { 
            data.reportType.push(PAYMENT_REPORT_TYPES.AP_Nacha_ACH_Creation);
        }
 
        this.logger.log(`Get the Report list for ${data.reportType}`);
        return await this.purchaseJournalService.SpooledMetadataReports(data);
    }
}
