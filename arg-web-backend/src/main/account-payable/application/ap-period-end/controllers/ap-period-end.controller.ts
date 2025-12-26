import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ValidationPipe,
  UsePipes,
  Delete,
  Param,
  ParseIntPipe
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiEndpoint } from "@src/api-schema/swagger.decorator";
import {
  GetVendorsByYearDto,
  ApPeriodEndRecordFormatA1099ResponseDto,
  ApPeriodEndRecordFormatB1009IResponseDto,
  ApPeriodEndRecordFormatTIResponseDto,
  YearEndProcessResponseDto,
  apPeriodEndBodyDto,
  apPeriodEndDto,
  vendorYearEndProcessDto,
  GetYearEndProcessMenuReviewFilesDto,
  ReviewFileResponseDto,
  allReponseDto,
  allApPeriodDto,
} from "../dto/ap-period-end.dto";
import { VendorYearEndProcessUseCase } from "../usecases/year-end-process/year-end-process.usecase";
import { GetVendorsByYearUseCase } from "../usecases/get-vendors-by-year/get-vendors-by-year.usecase";
import { GetCompanyDetailsUseCase } from "../usecases/get-company-details/get-company-details.usecase";
import { GetReviewFilesUsecase } from "../usecases/get-review-files/get-review-files.usecase";
import {
  PaginatedResponse,
  simpleResponse,
  SimpleResponse,
} from "@src/shared/utils/response-formatter";
import * as APPeriodEndSwagger from "@src/api-schema/ap-period-end.swagger";
import { Vendor } from "@src/main/account-payable/domain/entities/vendor.entity";
import { GetApPeriodEndUsecase } from "../usecases/get-ap-period-end/get-ap-period-end.usecase";
import { PostApPeriodEndUsecase } from "../usecases/post-ap-period-end/post-ap-period-end.usecase";

import { GetCompanyDetailsDto, CompanyDetailsResponseDto } from "../../voucher/dto/company.dto";
import { AllApPeriodEndUsecase } from "../usecases/get-all-ap-period-end/get-all-ap-period-end.usecase";
import { SoftDeleteRecordUsecase } from "../usecases/soft-delete-record/soft-delete-record.usecase";
import { vendorDetailsDto, VendorDto } from "../../vendor-management/dto/vendor-management.dto";
import { GetVendorDetailsByYearUsecase } from "../usecases/get-vendor-details-by-year/get-vendor-details-by-year.usecase";
import { updateVendorByYearUsecase } from "../usecases/update-vendor-by-year/update-vendor.usecase";


@ApiTags("APPeriodEnd")
@Controller("ap-period-end")
@UsePipes(new ValidationPipe({ transform: true }))
export class APPeriodEndController {
  constructor(
    private readonly getVendorsByYearUseCase: GetVendorsByYearUseCase,
    private readonly getCompanyDetailsUseCase: GetCompanyDetailsUseCase,
    private readonly vendorYearEndProcessUseCase: VendorYearEndProcessUseCase,
    private readonly getReviewFilesUseCase: GetReviewFilesUsecase,
    private readonly getApPeriodEndUsecase: GetApPeriodEndUsecase,
    private readonly postApPeriodEndUsecase: PostApPeriodEndUsecase,
    private readonly allApPeriodEndUsecase: AllApPeriodEndUsecase,
    private readonly softDeleteRecordUsecase: SoftDeleteRecordUsecase,
    private readonly getVendorDetailsByYearUsecase: GetVendorDetailsByYearUsecase,
    private readonly updateVendorByYearUsecase: updateVendorByYearUsecase,

  ) { }

  @Get("vendors")
  @ApiEndpoint(APPeriodEndSwagger.getVendorsByYear)
  async getVendorsByYear(
    @Query() query: GetVendorsByYearDto
  ): Promise<PaginatedResponse<Vendor>> {
    const result = await this.getVendorsByYearUseCase.execute(query);
    return result;
  }

  @Get("company")
  @ApiEndpoint(APPeriodEndSwagger.getCompanyDetails)
  async getCompanyDetails(
    @Query() query: GetCompanyDetailsDto
  ): Promise<SimpleResponse<CompanyDetailsResponseDto>> {
    const result = await this.getCompanyDetailsUseCase.execute(query);
    return simpleResponse(result);
  }

  @Post("vendor-year-end-process")
  @ApiEndpoint(APPeriodEndSwagger.vendorYearEndProcess)
  async vendorYearEndProcess(
    @Body() body: vendorYearEndProcessDto
  ): Promise<SimpleResponse<YearEndProcessResponseDto>> {
    const result = await this.vendorYearEndProcessUseCase.execute(body);
    return simpleResponse(result);
  }


  @Get("record")
  @ApiEndpoint(APPeriodEndSwagger.getApPeriodEndReports)
  async getApPeriodEndReports(@Query() data: apPeriodEndDto): Promise<Partial<ApPeriodEndRecordFormatTIResponseDto | ApPeriodEndRecordFormatA1099ResponseDto | ApPeriodEndRecordFormatB1009IResponseDto>> {
    return await this.getApPeriodEndUsecase.execute(data);
  }

  @Get()
  @ApiEndpoint(APPeriodEndSwagger.getAllApPeriodEndReports)
  async getAllApPeriodEndReports(@Query() dto: allApPeriodDto): Promise<PaginatedResponse<allReponseDto>> {
    return await this.allApPeriodEndUsecase.execute(dto);
  }


  @Post()
  @ApiEndpoint(APPeriodEndSwagger.postApPeriodEndReports)
  async postApPeriodEndReports(@Body() data: apPeriodEndBodyDto): Promise<{ message: string }> {
    return await this.postApPeriodEndUsecase.execute(data);
  }

  @Get("/year-end-process-menu/review-files")
  @ApiEndpoint(APPeriodEndSwagger.getYearEndProcessMenuReviewFiles)
  async getReviewFiles(
    @Query() dto: GetYearEndProcessMenuReviewFilesDto
  ): Promise<PaginatedResponse<ReviewFileResponseDto>> {
    return await this.getReviewFilesUseCase.execute(dto);
  }

  @Delete("record")
  @ApiEndpoint(APPeriodEndSwagger.softDeleteRecord)
  async softDeleteRecord(@Body() data: apPeriodEndDto): Promise<{ message: string }> {
    return await this.softDeleteRecordUsecase.execute(data);
  }


  @Get(":year/vendors/:vendorNo")
  @ApiEndpoint(APPeriodEndSwagger.getVendorDetailsByYear)
  async getVendorDetailsByYear(
    @Param("year", ParseIntPipe) year: string,
    @Param("vendorNo", ParseIntPipe) vendorNo: string,
    @Query("vendorCompanyNumber", ParseIntPipe) vendorCompanyNumber: number
  ): Promise<SimpleResponse<VendorDto | null>> {
    const result = await this.getVendorDetailsByYearUsecase.execute({vendorCompanyNumber, vendorNo, year});
    return simpleResponse(result)
  }
  @Post(":year/vendors/:vendorNo")
  @ApiEndpoint(APPeriodEndSwagger.updateVendorByYear)
  async updateVendorByYear(
    @Param('year') year: string,
    @Param('vendorNo') vendorNo: string,
    @Body() dto: vendorDetailsDto
  ): Promise<{ message: string }> {
    const result = await this.updateVendorByYearUsecase.execute(dto, year, vendorNo);
    return result;
  }
}
