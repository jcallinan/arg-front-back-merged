import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ValidationPipe,
  UsePipes,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiEndpoint } from "@src/api-schema/swagger.decorator";
import {
  GetCompanyMaintenanceDto,
  CompanyMaintenanceResponseDto,
  UpdateCompanyMaintenanceDto,
} from "../dto/ap-maintenance.dto";
import { GetCompanyMaintenanceUseCase } from "../usecases/get-company-maintenance/get-company-maintenance.usecase";
import { UpdateCompanyMaintenanceUseCase } from "../usecases/update-company-maintenance/update-company-maintenance.usecase";
import {
  simpleResponse,
  SimpleResponse,
} from "@src/shared/utils/response-formatter";
import * as APMaintenanceSwagger from "@src/api-schema/ap-maintenance.swagger";

@ApiTags("AP Maintenance")
@Controller("ap-maintenance")
@UsePipes(new ValidationPipe({ transform: true }))
export class APMaintenanceController {
  constructor(
    private readonly getCompanyMaintenanceUseCase: GetCompanyMaintenanceUseCase,
    private readonly updateCompanyMaintenanceUseCase: UpdateCompanyMaintenanceUseCase
  ) {}

  @Get("company")
  @ApiEndpoint(APMaintenanceSwagger.companyMaintenance)
  async getCompanyData(
    @Query() query: GetCompanyMaintenanceDto
  ): Promise<SimpleResponse<CompanyMaintenanceResponseDto>> {
    const result = await this.getCompanyMaintenanceUseCase.execute(query);
    return simpleResponse(result);
  }

  @Post("company")
  @ApiEndpoint(APMaintenanceSwagger.updateCompanyMaintenance)
  async updateCompanyData(
    @Body() body: UpdateCompanyMaintenanceDto
  ): Promise<SimpleResponse<CompanyMaintenanceResponseDto>> {
    const result = await this.updateCompanyMaintenanceUseCase.execute(body);
    return simpleResponse(result);
  }
}
