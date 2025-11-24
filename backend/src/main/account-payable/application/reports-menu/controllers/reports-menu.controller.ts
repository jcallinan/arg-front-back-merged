import { Controller, Get, Query, Post, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiEndpoint } from "@src/api-schema/swagger.decorator";
import * as SwaggerConfig from "@src/api-schema/reports-menu.swagger";
import { ReportsMenuUsecase } from "../usecases/reports-menu/reports-menu.usecase";
import { ReportsMenuSubmitUseCase } from "../usecases/reports-menu-submit/reports-menu-submit.usecase";
import {
  PaginatedResponse,
  simpleResponse,
} from "@src/shared/utils/response-formatter";
import { SpooledMetaDataReportEntity } from "@src/main/account-payable/domain/entities/spooled-meta-data-report.entity";
import { ReportsMenuDto, SubmitReportsMenuDto } from "../dto/reports-menu.dto";

@ApiTags("Reports Menu")
@Controller("reports-menu")
export class ReportsMenuController {
  constructor(
    private readonly getReportsMenuUsecase: ReportsMenuUsecase,
    private readonly submitReportsMenuUseCase: ReportsMenuSubmitUseCase
  ) {}

  @Get()
  @ApiEndpoint(SwaggerConfig.reportsMenuReports)
  async getReportsMenu(
    @Query() dto: ReportsMenuDto
  ): Promise<PaginatedResponse<SpooledMetaDataReportEntity>> {
    return await this.getReportsMenuUsecase.execute(dto);
  }

  @Post("submit")
  @ApiEndpoint(SwaggerConfig.submitReportsMenu)
  async submitReportsMenu(@Body() dto: SubmitReportsMenuDto) {
    const result = await this.submitReportsMenuUseCase.execute(dto);
    return simpleResponse(result);
  }
}
