import { Inject, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { paginatedResponse, PaginatedResponse } from "@src/shared/utils/response-formatter";
import { SpooledMetaDataReportInterface } from "@src/main/account-payable/domain/interface/spooled-meta-data-report.interface";
import { Report_Type } from "@src/shared/constants/constant";
import { ReportResponseDto } from "../../dto/employee-expense.dto";


@Injectable()
export class EmployeeExpenseReportUsecase {
    private readonly logger = new AppLogger(EmployeeExpenseReportUsecase.name);

    constructor(
        @Inject("SpooledMetaDataReportInterface")
        private readonly spooledMetaDataReportInterface: SpooledMetaDataReportInterface,
        
    ) { }

    async execute(): Promise<PaginatedResponse<ReportResponseDto>> {

        this.logger.log(`Get the Employee Expense Reports`);

        const data = {
            reportType: [Report_Type.EMPLOYEE_EXPENSE]
        }

        const { reports, count, limit, page } = await this.spooledMetaDataReportInterface.SpooledMetadataReports(data);

        return paginatedResponse(reports, count, page, limit);

    }
}
