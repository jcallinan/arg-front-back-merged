// src/main/account-payable/application/voucher-maintenance/usecases/get-voucher-summary/get-voucher-summary.usecase.ts
import { Injectable, Inject } from "@nestjs/common";
import { VoucherMaintenanceInterface } from "@src/main/account-payable/domain/interface/voucher-maintenance.interface";
import { GetVoucherSummaryDto, VoucherSummaryResponseDto } from "../../dto/voucher-maintenance.dto";
import { AppLogger } from "@src/shared/logger/logger.service";

@Injectable()
export class GetVoucherSummaryMaintenanceUseCase {
  private readonly logger = new AppLogger(GetVoucherSummaryMaintenanceUseCase.name);

  constructor(
    @Inject("VoucherMaintenanceInterface")
    private readonly voucherMaintenanceRepository: VoucherMaintenanceInterface
  ) {}

  async execute(dto: GetVoucherSummaryDto): Promise<VoucherSummaryResponseDto[]> {
    this.logger.log(`Fetching voucher summary with options: ${JSON.stringify(dto)}`);
    const voucherSummary = await this.voucherMaintenanceRepository.findVoucherSummary(
      dto.companyNo,
      dto.vendorNo,
      dto.voucherType
    );
    
    return voucherSummary.map((summary) => ({
      ...summary,
      openPayablesDate: summary.openPayablesDate || undefined,
    }));
  }
}