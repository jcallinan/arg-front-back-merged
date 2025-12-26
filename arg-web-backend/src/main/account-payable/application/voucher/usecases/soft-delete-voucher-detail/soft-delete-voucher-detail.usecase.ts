import { Injectable } from '@nestjs/common';
import { VoucherAppService } from '@src/main/account-payable/domain/services/voucher/voucher.service';
import { SoftDeleteVoucherDetailDto } from '../../dto/voucher.dto';

@Injectable()
export class SoftDeleteVoucherDetailUseCase {
  constructor(private readonly voucherService: VoucherAppService) {}

  async execute(dto: SoftDeleteVoucherDetailDto) {
    return this.voucherService.softDeleteVoucherDetail(
      dto.companyNo,
      dto.vendorNo,
      dto.entryNo,
      dto.entrySequenceNo
    );
  }
}