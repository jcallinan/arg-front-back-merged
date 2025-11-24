import { Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { SoftDeleteVoucherDto } from "../../dto/voucher.dto";
import { VoucherAppService } from "@src/main/account-payable/domain/services/voucher/voucher.service";

@Injectable()
export class SoftDeleteVoucherUseCase {
  private readonly logger = new AppLogger(SoftDeleteVoucherUseCase.name);

  constructor(private readonly voucherService: VoucherAppService) {}

  async execute(dto: SoftDeleteVoucherDto): Promise<{ success: boolean; message: string }> {
    this.logger.log("Soft deleting voucher");
    const { entryNo, companyNo, vendorNo, invoiceNo } = dto;
    const result = await this.voucherService.softDeleteVoucher(
      entryNo,
      companyNo,
      vendorNo,
      invoiceNo
    );
    this.logger.debug(`Voucher deleted successfully`);
    return result;
  }
} 