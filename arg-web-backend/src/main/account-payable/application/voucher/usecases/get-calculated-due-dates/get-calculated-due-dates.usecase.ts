import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { GetCalculatedDueDatesDto } from "../../dto/voucher.dto";
import { VoucherSharedService } from "../../shared-services/voucher.shared.service";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";
import { errorResponse } from "@src/shared/utils/response-formatter";

@Injectable()
export class GetCalculatedDueDatesUseCase {
  private readonly logger = new AppLogger(GetCalculatedDueDatesUseCase.name);

  constructor(private readonly voucherSharedService: VoucherSharedService) {}

  async execute(dto: GetCalculatedDueDatesDto): Promise<any> {
    this.logger.log(
      `Calculating due dates for company ${dto.companyNo} and invoice date ${dto.invoiceDate}`
    );

    const companyNo = dto.companyNo;
    const vendorNo = dto.vendorNo;
    const invoiceDate = dto.invoiceDate;

    const errors: { field: string; code: string; message: string }[] = [];
    const warnings: { field: string; code: string; message: string }[] = [];

    const startTime = Date.now();

    const { extendedDueDate, extendedDiscountDueDate, foundVendor } =
      await this.voucherSharedService.computeDueDatesWithVendorAndGstabl(
        companyNo,
        vendorNo,
        invoiceDate,
        "",
        "",
        errors,
        warnings,
        startTime
      );

    this.logger.log(
      `Calculated extendedDueDate: ${extendedDueDate} and extendedDiscountDueDate: ${extendedDiscountDueDate}`
    );
    this.logger.log(`errors: ${JSON.stringify(errors)}`);

    if (errors.length > 0) {
      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.VALIDATION_ERROR, errors),
        HttpStatus.BAD_REQUEST
      );
    }

    return {
      companyNo,
      vendorNo,
      invoiceDate,
      dueDate: extendedDueDate,
      discountDueDate: extendedDiscountDueDate,
      foundVendor,
    };
  }
}
