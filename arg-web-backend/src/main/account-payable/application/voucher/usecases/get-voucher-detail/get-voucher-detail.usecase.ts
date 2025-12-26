import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { VoucherDetail } from "@src/main/account-payable/domain/entities/voucher.entity";
import { VoucherDetailInterface } from "@src/main/account-payable/domain/interface/voucher.interface";

@Injectable()
export class GetVoucherDetailUseCase {
  private readonly logger = new AppLogger(GetVoucherDetailUseCase.name);

  constructor(
    @Inject("VoucherDetailInterface")
    private readonly voucherDetailRepo: VoucherDetailInterface,
  ) {}

  /**
   * Retrieves voucher detail entries based on entry number and filtering criteria.
   *
   * @param {number} companyNo - The company number of the voucher
   * @param {number} entryNo - The entry number of the voucher
   * @param {number} [vendorNo] - The vendor number of the voucher (optional)
   * @returns {Promise<{ voucherDetails?: VoucherDetail[] }>} Object containing voucher  details
   * @throws {error} When required parameters are missing or data is not found
   */
  async execute(companyNo: number | undefined, entryNo?: number, vendorNo?: number): Promise<VoucherDetail[]> {
    if (!companyNo) throw new BadRequestException("Company No is required");
    if (entryNo === undefined || entryNo === null) throw new BadRequestException("Entry No is required");
    this.logger.log(`Fetching voucher details for companyNo=${companyNo}, entryNo=${entryNo}, vendorNo=${vendorNo}`);
    return await this.voucherDetailRepo.findByEntry(companyNo, entryNo, vendorNo);
  }
}
