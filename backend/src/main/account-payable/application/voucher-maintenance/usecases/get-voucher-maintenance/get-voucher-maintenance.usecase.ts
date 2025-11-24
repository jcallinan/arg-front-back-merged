import { Injectable, Inject } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { VoucherMaintenanceInterface } from "@src/main/account-payable/domain/interface/voucher-maintenance.interface";
import { GetVouchersDto } from "../../dto/voucher-maintenance.dto";

@Injectable()
export class GetVoucherMaintenanceUseCase {
  private readonly logger = new AppLogger(GetVoucherMaintenanceUseCase.name);

  constructor(
    @Inject("VoucherMaintenanceInterface")
    private readonly voucherMaintenanceRepository: VoucherMaintenanceInterface
  ) {}

  /**
   * Retrieves paginated voucher maintenance records based on filter criteria
   * @param dto - Query options including filters, pagination, and sorting
   * @returns Paginated response of voucher maintenance records
   */
  async execute(dto: GetVouchersDto): Promise<{ rows: any[]; count: number }> {
    this.logger.log(
      `Fetching voucher maintenance records with options: ${JSON.stringify(dto)}`
    );

    // Calculate pagination
    const limit = dto.limit || 500;
    const offset = ((dto.page || 1) - 1) * limit;

    // Get data from repository
    const {
      companyNo,
      vendorNo,
      voucherType,
      invoiceDate,
      invoiceNo,
      sortBy,
      sortOrder,
    } = dto;
   const result = await this.voucherMaintenanceRepository.findVouchers(
      companyNo,
      vendorNo,
      voucherType,
      invoiceDate,
      invoiceNo,
      limit,
      offset,
      sortBy,
      sortOrder
    );

    return result;
  }
}
