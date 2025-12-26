import { Controller, Get, Param, ParseEnumPipe } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiEndpoint } from "@src/api-schema/swagger.decorator";
import * as SwaggerConfig from "@src/api-schema/ap-global-states.swagger";
import {
  SimpleResponse,
  simpleResponse,
} from "@src/shared/utils/response-formatter";
import { DropdownType } from "../../../../../types/types";
import { ReportListUsecase } from "../usecases/report-list/report-list.usecase";
import { Report_Type } from "@src/shared/constants/constant";

@ApiTags("ApGlobalStates")
@Controller("ap-global-states")
export class APGlobalStatesController {
  constructor(private readonly getReportListUsecase: ReportListUsecase) { }
  @Get("reportTypes/:type")
  @ApiEndpoint(SwaggerConfig.ReportList)
  async getPurchaseJournalReportList(
    @Param("type", new ParseEnumPipe(Report_Type)) type: Report_Type
  ): Promise<SimpleResponse<DropdownType[]>> {
    const result = await this.getReportListUsecase.execute(type);
    return simpleResponse(result);
  }
}
