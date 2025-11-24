import { Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { GetAllVendorsDto } from "../../dto/voucher.dto";
import { VendorAppService } from "@src/main/account-payable/domain/services/vendor/vendor.service";
import { Vendor } from "@src/main/account-payable/domain/entities/vendor.entity";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";
@Injectable()
export class GetVendorUseCase {
  private readonly logger = new AppLogger(GetVendorUseCase.name);

  constructor(private readonly vendorService: VendorAppService) {}

  async execute(dto: GetAllVendorsDto): Promise<PaginatedResponse<Vendor>> {
    this.logger.log("Fetching all vendor");

      const response = await this.vendorService.getAllVendors(dto);
      this.logger.debug(`Found ${response.items.length} active vendors`);

      return response;
  }
}
