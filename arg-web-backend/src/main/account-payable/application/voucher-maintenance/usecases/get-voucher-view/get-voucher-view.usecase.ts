import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { VoucherMaintenanceInterface } from "@src/main/account-payable/domain/interface/voucher-maintenance.interface";
import {
  GetVoucherViewDto,
  VoucherViewResponseDto,
} from "../../dto/voucher-maintenance.dto";
import { errorResponse } from "@src/shared/utils/response-formatter";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";

@Injectable()
export class getVoucherMaintenanceViewUseCase {
  private readonly logger = new AppLogger(
    getVoucherMaintenanceViewUseCase.name
  );

  constructor(
    @Inject("VoucherMaintenanceInterface")
    private readonly voucherMaintenanceRepository: VoucherMaintenanceInterface
  ) {}

  /**
   * Retrieves voucher view data based on voucher type, company number, vendor number, and voucher number
   * @param dto - Query parameters including voucher type, company number, vendor number, and voucher number
   * @returns Voucher view data from appropriate tables based on voucher type
   */
  async execute(dto: GetVoucherViewDto): Promise<VoucherViewResponseDto> {
    this.logger.log(
      `Fetching voucher view data with parameters: ${JSON.stringify(dto)}`
    );

    const { voucherType, companyNo, vendorNo, voucherNo } = dto;

    // Get data from repository based on voucher type
    const result = await this.voucherMaintenanceRepository.findVoucherView(
      voucherType,
      companyNo,
      vendorNo,
      voucherNo
    );

    if (!result) {
      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
          {
            field: "voucher",
            code: ERROR_CONSTANTS.NOT_FOUND.code,
            message: `Voucher not found with voucherType: ${voucherType}, companyNo: ${companyNo}, vendorNo: ${vendorNo}, voucherNo: ${voucherNo}`,
          },
        ]),
        HttpStatus.NOT_FOUND
      );
    }

    return result;
  }
}
