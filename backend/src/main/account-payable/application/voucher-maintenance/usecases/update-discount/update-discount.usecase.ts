import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { VoucherMaintenanceInterface } from "@src/main/account-payable/domain/interface/voucher-maintenance.interface";
import {
  UpdateDiscountDto,
  UpdateDiscountResponseDto,
} from "../../dto/voucher-maintenance.dto";
import { errorResponse } from "@src/shared/utils/response-formatter";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";

@Injectable()
export class UpdateDiscountUseCase {
  private readonly logger = new AppLogger(UpdateDiscountUseCase.name);

  constructor(
    @Inject("VoucherMaintenanceInterface")
    private readonly voucherMaintenanceRepository: VoucherMaintenanceInterface
  ) {}

  /**
   * Updates discount due date and discount amount in APOPNH table
   * @param dto - Request data including company number, vendor number, voucher number, discount due date, and discount amount
   * @returns Updated voucher discount information
   */
  async execute(dto: UpdateDiscountDto): Promise<UpdateDiscountResponseDto> {
    this.logger.log(
      `Updating discount with parameters: ${JSON.stringify(dto)}`
    );

    const { companyNo, vendorNo, voucherNo, discountDueDate, discount } = dto;

    // Update discount information in repository
    const result = await this.voucherMaintenanceRepository.updateDiscount(
      companyNo,
      vendorNo,
      voucherNo,
      discountDueDate,
      discount
    );

    if (!result) {
      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
          {
            field: "voucher",
            code: ERROR_CONSTANTS.NOT_FOUND.code,
            message: `Voucher not found with companyNo: ${companyNo}, vendorNo: ${vendorNo}, voucherNo: ${voucherNo}`,
          },
        ]),
        HttpStatus.NOT_FOUND
      );
    }

    return {
      message: "Discount information updated successfully",
      voucher: {
        companyNo: result.companyNo,
        vendorNo: result.vendorNo,
        voucherNo: result.voucherNo,
        discountDueDate: result.discountDueDate,
        discount: result.discount,
        updatedAt: result.updatedAt,
      },
    };
  }
}
