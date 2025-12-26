import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { VoucherMaintenanceInterface } from "@src/main/account-payable/domain/interface/voucher-maintenance.interface";
import {
  UpdateVoucherStatusDto,
  UpdateVoucherStatusResponseDto,
} from "../../dto/voucher-maintenance.dto";
import { errorResponse } from "@src/shared/utils/response-formatter";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";

@Injectable()
export class UpdateVoucherMaintenanceStatusUseCase {
  private readonly logger = new AppLogger(UpdateVoucherMaintenanceStatusUseCase.name);

  constructor(
    @Inject("VoucherMaintenanceInterface")
    private readonly voucherMaintenanceRepository: VoucherMaintenanceInterface
  ) {}

  /**
   * Updates voucher status in APOPNH table
   * @param dto - Request data including company number, vendor number, voucher number, status code, and status description
   * @returns Updated voucher status information
   */
  async execute(
    dto: UpdateVoucherStatusDto
  ): Promise<UpdateVoucherStatusResponseDto> {
    this.logger.log(
      `Updating voucher status with parameters: ${JSON.stringify(dto)}`
    );

    const { companyNo, vendorNo, voucherNo, statusCode, statusDescription } =
      dto;

    // Update voucher status in repository
    const result = await this.voucherMaintenanceRepository.updateVoucherStatus(
      companyNo,
      vendorNo,
      voucherNo,
      statusCode,
      statusDescription
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
      message: "Voucher status updated successfully",
      voucher: {
        companyNo: result.companyNo,
        vendorNo: result.vendorNo,
        voucherNo: result.voucherNo,
        statusCode: result.statusCode,
        statusDescription: result.statusDescription,
        updatedAt: result.updatedAt,
      },
    };
  }
}
