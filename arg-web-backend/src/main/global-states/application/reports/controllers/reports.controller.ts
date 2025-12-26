import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  ValidationPipe,
  UsePipes,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiEndpoint } from "@src/api-schema/swagger.decorator";
import * as SwaggerConfig from "@src/api-schema/global-states.swagger";
import {
  SimpleResponse,
  simpleResponse,
  PaginatedResponse,
} from "@src/shared/utils/response-formatter";
import { GetReportDetailsUsecase } from "../usecases/get-report-details/get-report-details.usecase";
import { GenerateReportUsecase } from "../usecases/generate-report/generate-report.usecase";
import { GetReportNamesUsecase } from "../usecases/get-report-names/get-report-names.usecase";
import { GetDropdownDataUsecase } from "../usecases/get-dropdown-data/get-filters-list.usecase";
import { GenerateReportFileDto, GenerateReportFileResponseDto, GetSpInfoByReportNameDto } from "../dto/reports.dto";
import { ExecuteSpDto } from "../dto/reports.dto";
import { DropdownRequestDto } from "../dto/filters-list.dto";
import { DropdownType } from "@src/types/types";
import { GenerateReportFilesUsecase } from "../usecases/generate-report-files/generate-report-files.usecase";

@ApiTags("GlobalStates")
@Controller("global-states")
export class ReportsController {
  constructor(
    private readonly getReportDetailsUsecase: GetReportDetailsUsecase,
    private readonly generateReportUsecase: GenerateReportUsecase,
    private readonly getReportNamesUsecase: GetReportNamesUsecase,
    private readonly getDropdownDataUsecase: GetDropdownDataUsecase,
    private readonly generateReportFilesUsecase: GenerateReportFilesUsecase
  ) {}

  @Get("reports/:name")
  @ApiEndpoint(SwaggerConfig.GetReportDetails)
  async getReportDetails(
    @Param() params: GetSpInfoByReportNameDto
  ): Promise<SimpleResponse<Record<string, any>>> {
    const result = await this.getReportDetailsUsecase.execute(params);
    return simpleResponse(result);
  }

  @Post("reports")
  @ApiEndpoint(SwaggerConfig.GenerateReport)
  async generateReport(
    @Body() executeSpDto: ExecuteSpDto
  ): Promise<SimpleResponse<Record<string, any>>> {
    const result = await this.generateReportUsecase.execute(executeSpDto);
    return simpleResponse({ message: result });
  }

  @Get("reports")
  @ApiEndpoint(SwaggerConfig.GetAllReportNames)
  async getAllReportNames(): Promise<SimpleResponse<string[]>> {
    const result = await this.getReportNamesUsecase.execute();
    return simpleResponse(result);
  }

  @Get("list-options")
  @ApiEndpoint(SwaggerConfig.GetDropdownData)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getDropdownData(
    @Query() query: DropdownRequestDto
  ): Promise<PaginatedResponse<DropdownType>> {
    return await this.getDropdownDataUsecase.execute(query);
  }

  @Post("reports/generate")
  @ApiEndpoint(SwaggerConfig.generateReportFiles)
  async generateReportFile(
    @Body() dto: GenerateReportFileDto
  ): Promise<SimpleResponse<GenerateReportFileResponseDto>> {
    const result = await this.generateReportFilesUsecase.execute(dto);
    return simpleResponse(result);
  }
}
