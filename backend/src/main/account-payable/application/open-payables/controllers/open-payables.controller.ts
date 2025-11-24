import { Controller, Get, Query, Post, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiEndpoint } from "@src/api-schema/swagger.decorator";
import * as SwaggerConfig from "@src/api-schema/open-payable.swagger";
import { OpenPayablesUsecase } from "../usecases/open-payable/open-payable.usecase";
import { purchaseJournalReportDto } from "../../purchase-journal/dto/purchase-journal.dto";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import { SpooledMetaDataReportEntity } from "@src/main/account-payable/domain/entities/spooled-meta-data-report.entity";
import { generateReportDto } from "../dto/open-payables.dto";
import { OpenPayablesReportGeneratorUseCase } from "../usecases/open-payable-report-generator/open-payable-report-generator.usecase";

@ApiTags("OpenPayables")
@Controller("open-payables")
export class OpenPayablesController {
    constructor(
        private readonly getOpenPayablesUsecase: OpenPayablesUsecase,
        private readonly openPayablesReportGeneratorUseCase: OpenPayablesReportGeneratorUseCase,
    ) { }

    @Get()
    @ApiEndpoint(SwaggerConfig.openPayableReports)
    async openPayableReport(
        @Query() dto: purchaseJournalReportDto
    ): Promise<PaginatedResponse<SpooledMetaDataReportEntity>> {
        return await this.getOpenPayablesUsecase.execute(dto);
    }

    @Post()
    @ApiEndpoint(SwaggerConfig.openPayableGenerateReport)
    async submitPurchaseJournal(@Body() dto: generateReportDto) {
        const result = await this.openPayablesReportGeneratorUseCase.execute(dto);
        return result;
    }
}
