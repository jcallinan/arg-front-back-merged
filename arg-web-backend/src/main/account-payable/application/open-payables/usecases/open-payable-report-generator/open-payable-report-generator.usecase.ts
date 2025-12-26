import { Injectable, Inject } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { generateReportDto } from "../../dto/open-payables.dto";
import { ReportRepository } from "@src/main/account-payable/data/repositories/report.repository";
import { ReportEntity } from "@src/main/account-payable/domain/entities/report.entity";
import { openPayableVendorAgedAndHold, openPayablesReportGenerateByVendor } from "@src/main/account-payable/data/stored-procedure/open-payables-report-generator-procedure";
import { OPEN_PAYABLES_TYPES } from "@src/shared/constants/constant";


@Injectable()
export class OpenPayablesReportGeneratorUseCase {
    private readonly logger = new AppLogger(OpenPayablesReportGeneratorUseCase.name);

    constructor(
        @Inject("ReportInterface")
        private readonly reportRepository: ReportRepository
    ) { }

    async execute(data: generateReportDto) {

        this.logger.log(`Generate Report for open Payables`);

        const { openPayables } = data

        // Get Report Name and Path
        const report: ReportEntity = await this.reportRepository.findOne(openPayables)

        // Call Store Procedure
        let spresult;
        if (openPayables === OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_DUE_DATE || openPayables ===  OPEN_PAYABLES_TYPES.OPEN_PAYABLES_IN_HOLD_STATUS) {
            spresult = await openPayableVendorAgedAndHold(report.reportName.trim(), report.path.trim(), data)
        } else {
            spresult = await openPayablesReportGenerateByVendor(report.reportName.trim(), report.path.trim(), data)
        }


        return {
            message: "OpenPayable report generated successfully",
            spresult,
        };
    }
}
