import { Inject, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { Vendor } from "@src/main/account-payable/domain/entities/vendor.entity";
import { paginatedResponse, PaginatedResponse } from "@src/shared/utils/response-formatter";
import { VendorInterface } from "@src/main/account-payable/domain/interface/vendor.interface";
import { GetAllVendorsDto } from "../../../voucher/dto/voucher.dto";
import { normalizeSearchQuery } from "@src/shared/utils/query.utils";


@Injectable()
export class GetAllVendorUseCase {
  private readonly logger = new AppLogger(GetAllVendorUseCase.name);

  constructor(

    @Inject("VendorInterface")
    private readonly vendorInterface: VendorInterface) { }

  async execute(dto: GetAllVendorsDto): Promise<PaginatedResponse<Vendor>> {
    this.logger.log("Fetching all vendor");

    const { companyNo } = dto

    const { search, limit, offset, page } = normalizeSearchQuery(dto);

    const { rows, count } = await this.vendorInterface.findAll(
      companyNo,
      search || undefined,
      limit,
      offset,
      false,
      true,
    );

    this.logger.debug(`Found ${rows.length} active vendors`);

    return paginatedResponse(rows, count, page, limit);

  }
}
