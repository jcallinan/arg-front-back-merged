import { Inject, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { CheckInquiryResponseDto, checkPaymentHistoryDto } from "../../dto/check-inquiry.dto";
import { CheckInquiryInterface } from "@src/main/account-payable/domain/interface/check-inquiry.interface";
import { normalizeSearchQuery } from "@src/shared/utils/query.utils";
import { PaginatedResponse, paginatedResponse } from "@src/shared/utils/response-formatter";


@Injectable()
export class CheckInquiryUseCase {
  private readonly logger = new AppLogger(CheckInquiryUseCase.name);

  constructor(

    @Inject("CheckInquiryInterface")
    private readonly checkInquiryInterface: CheckInquiryInterface
  ) { }

  async execute(data: checkPaymentHistoryDto): Promise<PaginatedResponse<Partial<CheckInquiryResponseDto>>> {
    this.logger.log(`Fetching Check Inquiry Payment History`);

    const { vendorNo, companyNo, startDate, invoiceNo, checkNo } = data

    const { page, limit, offset } = normalizeSearchQuery(data)

    const { rows, count } = await this.checkInquiryInterface.getPaymentHistory({ companyNo, vendorNo, limit, offset, page, startDate, invoiceNo, checkNo });

    return paginatedResponse(rows, count, page, limit)
  }
}
