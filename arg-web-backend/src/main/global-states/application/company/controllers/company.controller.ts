import {
  Controller,
  Get,
  Param,
  Query,
  Post
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiEndpoint } from "@src/api-schema/swagger.decorator";
import * as SwaggerConfig from "@src/api-schema/global-states.swagger";
import {
  SimpleResponse,
  simpleResponse,
} from "@src/shared/utils/response-formatter";
import { GeneralSystemAuthDto, GeneralSystemCompanyResponseDto, GetGeneralSystemCompanyParamsDto } from "../dto/get-general-system-company.dto";
import { GetGeneralSystemCompanyUsecase } from "../usecases/get-general-system-company/get-general-system-company.usecase";
import { AuthCodeCheckerForCompanyUsecase } from "../usecases/auth-code-checker/auth-code-checker.usecase";
import { GenerateAuthCodeForCompanyUsecase } from "../usecases/generate-auth-code-for-company/generate-auth-code-for-company.usecase";


@ApiTags("GlobalStates")
@Controller("global-states")
export class CompanyController {
  constructor(
    private readonly getGeneralSystemCompanyUsecase: GetGeneralSystemCompanyUsecase,
    private readonly authCodeCheckerForCompanyUsecase: AuthCodeCheckerForCompanyUsecase,
    private readonly generateAuthCodeForCompanyUsecase: GenerateAuthCodeForCompanyUsecase


  ) { }

  @Get("general-system-company/:companyNo")
  @ApiEndpoint(SwaggerConfig.GetGeneralSystemCompany)
  async getGeneralSystemCompany(
    @Param() params: GetGeneralSystemCompanyParamsDto
  ): Promise<SimpleResponse<Record<string, any>>> {
    const result = await this.getGeneralSystemCompanyUsecase.execute(params);
    return simpleResponse(result);
  }


  @Get("general-system-company/:companyNo/auth-code")
  @ApiEndpoint(SwaggerConfig.getAuthCodeChecker)
  async getAuthCodeChecker(
    @Param() params: GetGeneralSystemCompanyParamsDto,
    @Query() dto: GeneralSystemAuthDto
  ): Promise<SimpleResponse<GeneralSystemCompanyResponseDto>> {
    const result = await this.authCodeCheckerForCompanyUsecase.execute(params, dto);
    return simpleResponse(result);
  }


  @Post("general-system-company/:companyNo")
  @ApiEndpoint(SwaggerConfig.generateAuthCode)
  async generateAuthCode(
    @Param() params: GetGeneralSystemCompanyParamsDto,
  ): Promise<SimpleResponse<GeneralSystemCompanyResponseDto>> {
    const result = await this.generateAuthCodeForCompanyUsecase.execute(params);
    return simpleResponse(result);
  }
}
