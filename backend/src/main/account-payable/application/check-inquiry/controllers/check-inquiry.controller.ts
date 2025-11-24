import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiEndpoint } from "@src/api-schema/swagger.decorator";
import * as SwaggerConfig from "@src/api-schema/check-inquiry.swagger";
import { CheckInquiryUseCase } from "../usecases/check-inquiry/check-inquiry.usecase";
import { CheckInquiryResponseDto, checkInquiryVoucherDetailDto, checkPaymentHistoryDto, voucherDetailsResponseDto } from "../dto/check-inquiry.dto";
import { CheckInquiryLastPaymentInfoUseCase } from "../usecases/check-inquiry-last-payment-info/check-inquiry-last-payment-info.usecase";
import { lastPaymentInfo } from "@src/types/check-inquiry-types";
import { CheckInquiryVoucherDetailUseCase } from "../usecases/check-inquiry-voucher-detail/check-inquiry-voucher-detail.usecase";
import { PaginatedResponse, SimpleResponse, simpleResponse } from "@src/shared/utils/response-formatter";

@ApiTags("CheckInquiry")
@Controller("check-inquiry")
export class CheckInquiryController {
  constructor(
    private readonly getCheckInquiry: CheckInquiryUseCase,
    private readonly checkInquiryLastPaymentInfoUseCase: CheckInquiryLastPaymentInfoUseCase,
    private readonly checkInquiryVoucherDetailUseCase: CheckInquiryVoucherDetailUseCase,

  ) { }

  @Get("payment-history")
  @ApiEndpoint(SwaggerConfig.paymentHistory)
  async getPyamentHistory(@Query() query: checkPaymentHistoryDto): Promise<PaginatedResponse<Partial<CheckInquiryResponseDto>>> {
    const result = await this.getCheckInquiry.execute(query);
    return result
  }


  @Get("last-payment-info")
  @ApiEndpoint(SwaggerConfig.lastPaymentInfo)
  async getLastPaymentInfo(@Query() query: checkPaymentHistoryDto): Promise<lastPaymentInfo> {
    const result = await this.checkInquiryLastPaymentInfoUseCase.execute(query);
    return result
  }

  @Get("voucher-detail")
  @ApiEndpoint(SwaggerConfig.getVoucherDetails)
  async getVoucherDetail(@Query() query: checkInquiryVoucherDetailDto): Promise<SimpleResponse<voucherDetailsResponseDto>> {

    const result = await this.checkInquiryVoucherDetailUseCase.execute(query);
    return simpleResponse(result)
  }
}
