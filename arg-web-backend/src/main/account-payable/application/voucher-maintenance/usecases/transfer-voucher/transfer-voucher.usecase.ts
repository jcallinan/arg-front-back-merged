import { Injectable, Logger, Inject } from "@nestjs/common";
import { VoucherMaintenanceInterface } from "@src/main/account-payable/domain/interface/voucher-maintenance.interface";
import {
  TransferVoucherDto,
  TransferVoucherResponseDto,
} from "../../dto/voucher-maintenance.dto";

@Injectable()
export class TransferVoucherUseCase {
  private readonly logger = new Logger(TransferVoucherUseCase.name);

  constructor(
    @Inject("VoucherMaintenanceInterface")
    private readonly voucherMaintenanceRepository: VoucherMaintenanceInterface
  ) {}

  async execute(dto: TransferVoucherDto): Promise<TransferVoucherResponseDto> {
    this.logger.log(
      `Starting voucher transfer: voucherType=${dto.voucherType}, companyNo=${dto.companyNo}, vendorNo=${dto.vendorNo}, voucherNo=${dto.voucherNo}`
    );

    try {
      const result = await this.voucherMaintenanceRepository.transferVoucher(
        dto.voucherType,
        dto.companyNo,
        dto.vendorNo,
        dto.voucherNo
      );

      if (!result) {
        throw new Error(
          `Voucher not found or transfer failed: companyNo=${dto.companyNo}, vendorNo=${dto.vendorNo}, voucherNo=${dto.voucherNo}`
        );
      }

      this.logger.log(
        `Successfully transferred voucher: companyNo=${dto.companyNo}, vendorNo=${dto.vendorNo}, voucherNo=${dto.voucherNo}`
      );

      return {
        message: "Voucher transferred successfully to APTRANH/APTRAND",
        voucher: {
          companyNo: result.companyNo,
          vendorNo: result.vendorNo,
          voucherNo: result.voucherNo,
          voucherType: dto.voucherType,
          sourceTable: result.sourceTable,
          targetTable: result.targetTable,
          transferredAt: result.transferredAt,
          headerRecordId: result.headerRecordId,
          detailRecordIds: result.detailRecordIds,
        },
      };
    } catch (error: any) {
      this.logger.error(
        `Error transferring voucher: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }
}
