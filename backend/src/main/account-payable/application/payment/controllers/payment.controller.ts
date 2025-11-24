import { Controller, Get, Post, Body, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiEndpoint } from "@src/api-schema/swagger.decorator";
import * as SwaggerConfig from "@src/api-schema/payment.swagger";
import { PaymentTypesUseCase } from "../usecases/payment-types/payment-types.usecase";
import { SubmitPaymentTypeUseCase } from "../usecases/payment-selection/submit-payment-type.usecase";
import { SubmitPaymentVendorUseCase } from "../usecases/payment-vendor/submit-payment-vendor.usecase";
import {
  PaginatedResponse,
  simpleResponse,
  DropdownOption,
  SimpleResponse,
} from "@src/shared/utils/response-formatter";
import {
  SubmitPaymentSelectionTypeDto,
  SubmitPaymentSelectionTypeResponseWrapperDto,
  SubmitVendorPaymentResponseWrapperDto,
  SubmitVendorPaymentsDto,
  GetCashRequirementReportDto,
  GetApCheckReportDto,
} from "../dto/payment.dto"; 
import { ApCheckReportsUsecase } from "../usecases/ap-check/ap-check-reports.usecase";
 
import { CashRequirementReportsUsecase } from "../usecases/cash-requirement/cash-requirement-reports.usecase";
import { SpooledMetaDataReportEntity } from "@src/main/account-payable/domain/entities/spooled-meta-data-report.entity";

@ApiTags("Payment")
@Controller("payment")
export class PaymentController {
  constructor(
    private readonly paymentTypesUseCase: PaymentTypesUseCase,
    private readonly submitPaymentTypeUseCase: SubmitPaymentTypeUseCase,
    private readonly submitPaymentVendorUseCase: SubmitPaymentVendorUseCase,
    private readonly cashRequirementReportsUsecase: CashRequirementReportsUsecase,
    private readonly apCheckReportsUsecase: ApCheckReportsUsecase 
  ) {}

  // Get all voucher payment types
  @Get("types")
  @ApiEndpoint(SwaggerConfig.getAllVoucherPaymentTypes)
  async getAllVoucherPaymentTypes(): Promise<SimpleResponse<DropdownOption[]>> {
    const items = await this.paymentTypesUseCase.execute();
    return simpleResponse(items);
  }

  @Post("/selection/type")
  @ApiEndpoint(SwaggerConfig.submitPaymentSelectionType)
  async submitPaymentSelection(
    @Body() dto: SubmitPaymentSelectionTypeDto
  ): Promise<SimpleResponse<SubmitPaymentSelectionTypeResponseWrapperDto>> {
    const result = await this.submitPaymentTypeUseCase.execute(dto);
    return simpleResponse(result);
  }

  @Post("/selection/payment-vendor")
  @ApiEndpoint(SwaggerConfig.submitVendorPayment)
  async submitVendorPayment(
    @Body() dto: SubmitVendorPaymentsDto
  ): Promise<SimpleResponse<SubmitVendorPaymentResponseWrapperDto>> {
    const result = await this.submitPaymentVendorUseCase.execute(dto);
    return simpleResponse(result);
  }

  @Get("/cash-requirement/reports")
  @ApiEndpoint(SwaggerConfig.getCashRequirementReports)
  async getCashRequirementReports(
    @Query() dto: GetCashRequirementReportDto
  ): Promise<PaginatedResponse<SpooledMetaDataReportEntity>> {
    return await this.cashRequirementReportsUsecase.execute(dto);
  }

  @Get("/ap-check/reports")
  @ApiEndpoint(SwaggerConfig.getApCheckReports)
  async getApCheckReports(
    @Query() dto: GetApCheckReportDto
  ): Promise<PaginatedResponse<SpooledMetaDataReportEntity>> {
    return await this.apCheckReportsUsecase.execute(dto);
  }
}
