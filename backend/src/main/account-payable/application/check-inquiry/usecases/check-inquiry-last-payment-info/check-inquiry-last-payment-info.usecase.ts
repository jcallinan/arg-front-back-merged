import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { checkPaymentHistoryDto } from "../../dto/check-inquiry.dto";
import { lastPaymentInfo } from "@src/types/check-inquiry-types";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";
import { errorResponse } from "@src/shared/utils/response-formatter";
import { CheckInquiryInterface } from "@src/main/account-payable/domain/interface/check-inquiry.interface";


@Injectable()
export class CheckInquiryLastPaymentInfoUseCase {
  private readonly logger = new AppLogger(CheckInquiryLastPaymentInfoUseCase.name);

  constructor(
    @Inject("CheckInquiryInterface")
    private readonly checkInquiryInterface: CheckInquiryInterface
  ) { }

  async execute(data: checkPaymentHistoryDto): Promise<lastPaymentInfo> {
    this.logger.log(`Fetching Check Inquiry Last Payment Info`);

    const { companyNo, vendorNo, startDate, invoiceNo, checkNo } = data

    const lastPaymentInfo = await this.checkInquiryInterface.getLastPaymentInfo({ companyNo, vendorNo, startDate, invoiceNo, checkNo });

    if (!lastPaymentInfo) {
      this.logger.warn("Last Payment Info not found");

      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
          {
            field: "check-inquiry",
            code: ERROR_CONSTANTS.NOT_FOUND.code,
            message: "Payment Info not Found",
          },
        ]),
        HttpStatus.NOT_FOUND
      );
    }
    return lastPaymentInfo;
  }
}
