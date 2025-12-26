import { Controller, Get, Query, Post, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiEndpoint } from "@src/api-schema/swagger.decorator";
import * as SwaggerConfig from "@src/api-schema/purchase-journal.swagger";
import {
  PaginatedResponse,
  paginatedResponse,
  simpleResponse,
} from "@src/shared/utils/response-formatter";
import { PuchaseJournalReportsUseCase } from "../usecases/purchase-journal-report/purchase-journal-report.usecase";
import { PurchaseJournalSubmitUseCase } from "../usecases/purchase-journal-submit/purchase-journal-submit.usecase";
import { purchaseJournalReportDto, SubmitPurchaseJournalDto } from "../dto/purchase-journal.dto";
import { SpooledMetaDataReportEntity } from "@src/main/account-payable/domain/entities/spooled-meta-data-report.entity";

@ApiTags("PurchaseJournal")
@Controller("purchase-journal")
export class PurchaseJournalController {
  constructor(
    private readonly getPurchaseJournalReportsUseCase: PuchaseJournalReportsUseCase,
    private readonly submitPurchaseJournalUseCase: PurchaseJournalSubmitUseCase,
  ) { }

  @Get()
  @ApiEndpoint(SwaggerConfig.purchaseJournalReports)
  async getPurchaseJournalReports(
    @Query() query: purchaseJournalReportDto
  ): Promise<PaginatedResponse<SpooledMetaDataReportEntity>> {
    const {
      items,
      pagination: { total_items, current_page, items_per_page },
    } = await this.getPurchaseJournalReportsUseCase.execute(query);
    return paginatedResponse(items, total_items, current_page, items_per_page);
  }

  @Post("submit")
  @ApiEndpoint(SwaggerConfig.submitPurchaseJournal)
  async submitPurchaseJournal(@Body() dto: SubmitPurchaseJournalDto) {
    const result = await this.submitPurchaseJournalUseCase.execute(dto);
    return simpleResponse(result);
  }

}
