import { Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import {
  GetYearEndProcessMenuReviewFilesDto,
  ReviewFileResponseDto,
} from "../../dto/ap-period-end.dto";
import { PurchaseJournalService } from "@src/main/account-payable/domain/services/purchase-journal/purchase-journal.service";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import { AP_REPORT_TYPES } from "@src/shared/constants/constant";

@Injectable()
export class GetReviewFilesUsecase {
  private readonly logger = new AppLogger(GetReviewFilesUsecase.name);

  constructor(
    private readonly purchaseJournalService: PurchaseJournalService
  ) {}

  async execute(
    data: GetYearEndProcessMenuReviewFilesDto
  ): Promise<PaginatedResponse<ReviewFileResponseDto>> {
    const { reportType } = data;

    //Always include below reports
    data.reportType = [
      AP_REPORT_TYPES.AP_Vendor_1099_Register, 
      AP_REPORT_TYPES.Print_1099_File_Edit,
      AP_REPORT_TYPES.Printing_1099_File
    ];

    this.logger.log(`Get the Review Files for ${reportType}`);
    //As AS400 Team have not decided the report type, we are using the report type from the request
    this.logger.log(`Get the Report list for ${data.reportType}`);
    return await this.purchaseJournalService.SpooledMetadataReports(data);
  }
}
