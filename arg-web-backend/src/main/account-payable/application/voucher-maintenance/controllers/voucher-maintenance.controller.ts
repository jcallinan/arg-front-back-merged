import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  ValidationPipe,
  UsePipes,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiEndpoint } from "@src/api-schema/swagger.decorator";
import {
  paginatedResponse,
  PaginatedResponse,
  simpleResponse,
  SimpleResponse,
} from "@src/shared/utils/response-formatter";
import {
  GetVouchersDto,
  GetVoucherSummaryDto,
  GetVoucherViewByIdDto,
  GetVoucherViewQueryDto,
  UpdateVoucherStatusDto,
  UpdateVoucherStatusResponseDto,
  VoucherSummaryResponseDto,
  VoucherResponseDto,
  VoucherViewResponseDto,
  UpdateDiscountDto,
  UpdateDiscountResponseDto,
  TransferVoucherDto,
  TransferVoucherResponseDto,
} from "../dto/voucher-maintenance.dto";
import * as VoucherMaintenanceSwagger from "@src/api-schema/voucher-maintenance.swagger";
import { GetVoucherMaintenanceUseCase } from "../usecases/get-voucher-maintenance/get-voucher-maintenance.usecase";
import { GetVoucherSummaryMaintenanceUseCase } from "../usecases/get-voucher-summary/get-voucher-summary.usecase";
import { getVoucherMaintenanceViewUseCase } from "../usecases/get-voucher-view/get-voucher-view.usecase";
import { UpdateVoucherMaintenanceStatusUseCase } from "../usecases/update-voucher-status/update-voucher-status.usecase";
import { UpdateDiscountUseCase } from "../usecases/update-discount/update-discount.usecase";
import { TransferVoucherUseCase } from "../usecases/transfer-voucher/transfer-voucher.usecase";

@ApiTags("Voucher Maintenance")
@Controller("voucher-maintenance")
@UsePipes(new ValidationPipe({ transform: true }))
export class VoucherMaintenanceController {
  constructor(
    private readonly getVoucherMaintenanceUseCase: GetVoucherMaintenanceUseCase,
    private readonly getVoucherSummaryUseCase: GetVoucherSummaryMaintenanceUseCase,
    private readonly getVoucherMaintenanceViewUseCase: getVoucherMaintenanceViewUseCase,
    private readonly updateVoucherMaintenanceStatusUseCase: UpdateVoucherMaintenanceStatusUseCase,
    private readonly updateDiscountUseCase: UpdateDiscountUseCase,
    private readonly transferVoucherUseCase: TransferVoucherUseCase
  ) {}

  @Get()
  @ApiEndpoint(VoucherMaintenanceSwagger.voucherMaintenance)
  async getVouchers(
    @Query() query: GetVouchersDto
  ): Promise<PaginatedResponse<VoucherResponseDto>> {
    const { rows, count } =
      await this.getVoucherMaintenanceUseCase.execute(query);
    return paginatedResponse(rows, count, query.page || 1, query.limit || 500);
  }

  @Get("summary")
  @ApiEndpoint(VoucherMaintenanceSwagger.getVoucherMaintenanceSummary)
  async getVoucherSummary(
    @Query() query: GetVoucherSummaryDto
  ): Promise<SimpleResponse<VoucherSummaryResponseDto[]>> {
    const result = await this.getVoucherSummaryUseCase.execute(query);
    return simpleResponse(result);
  }

  @Get(":voucherNo")
  @ApiEndpoint(VoucherMaintenanceSwagger.getVoucherMaintenanceById)
  async getVoucherView(
    @Param() params: GetVoucherViewByIdDto,
    @Query() query: GetVoucherViewQueryDto
  ): Promise<SimpleResponse<VoucherViewResponseDto>> {
    const result = await this.getVoucherMaintenanceViewUseCase.execute({
      ...query,
      voucherNo: params.voucherNo,
    });
    return simpleResponse(result);
  }

  @Post("status")
  @ApiEndpoint(VoucherMaintenanceSwagger.updateVoucherMaintenanceStatus)
  async updateVoucherStatus(
    @Body() body: UpdateVoucherStatusDto
  ): Promise<SimpleResponse<UpdateVoucherStatusResponseDto>> {
    const result =
      await this.updateVoucherMaintenanceStatusUseCase.execute(body);
    return simpleResponse(result);
  }

  @Post("discount")
  @ApiEndpoint(VoucherMaintenanceSwagger.updateVoucherMaintenanceDiscount)
  async updateDiscount(
    @Body() body: UpdateDiscountDto
  ): Promise<SimpleResponse<UpdateDiscountResponseDto>> {
    const result = await this.updateDiscountUseCase.execute(body);
    return simpleResponse(result);
  }

  @Post("transfer")
  @ApiEndpoint(VoucherMaintenanceSwagger.transferVoucher)
  async transferVoucher(
    @Body() body: TransferVoucherDto
  ): Promise<SimpleResponse<TransferVoucherResponseDto>> {
    const result = await this.transferVoucherUseCase.execute(body);
    return simpleResponse(result);
  }
}
