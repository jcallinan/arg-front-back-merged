import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { checkInquiryVoucherDetailDto, voucherDetailsResponseDto } from "../../dto/check-inquiry.dto";
import { CheckInquiryInterface } from "@src/main/account-payable/domain/interface/check-inquiry.interface";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";
import { errorResponse } from "@src/shared/utils/response-formatter";


@Injectable()
export class CheckInquiryVoucherDetailUseCase {
  private readonly logger = new AppLogger(CheckInquiryVoucherDetailUseCase.name);

  constructor(
    @Inject("CheckInquiryInterface")
    private readonly checkInquiryInterface: CheckInquiryInterface
  ) { }

  async execute(data: checkInquiryVoucherDetailDto): Promise<voucherDetailsResponseDto> {
    this.logger.log(`Fetching Check Inquiry Voucher Details`);

    const voucherDetails = await this.checkInquiryInterface.getVoucherDetails(data);

    if (!voucherDetails) {
      this.logger.warn("Voucher Details or Vendor Detail not found");

      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
          {
            field: "check-inquiry",
            code: ERROR_CONSTANTS.NOT_FOUND.code,
            message: "Voucher Details not found",
          },
        ]),
        HttpStatus.NOT_FOUND
      );
    }

    return voucherDetails;

  }
}
