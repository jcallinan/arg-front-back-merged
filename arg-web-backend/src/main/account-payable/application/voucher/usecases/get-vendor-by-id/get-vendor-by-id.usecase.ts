import { Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { GetVendorByNoDto } from "../../dto/voucher.dto";
import { VendorAppService } from "@src/main/account-payable/domain/services/vendor/vendor.service";
import { Vendor } from "@src/main/account-payable/domain/entities/vendor.entity";

@Injectable()
export class GetVendorByIdUseCase {
  private readonly logger = new AppLogger(GetVendorByIdUseCase.name);

  constructor(private readonly vendorService: VendorAppService) { }

  async execute(dto: GetVendorByNoDto): Promise<Vendor> {
    this.logger.log("Fetching vendor by no");
    const { vendorNo, companyNo } = dto;
    const vendor = await this.vendorService.findVendorByNo(
      vendorNo,
      companyNo,
    );
    this.logger.debug(`Found vendor by no`);
    return vendor;
  }

  /**
   * Cache all vendors for a company - useful for CSV upload scenarios
   */
  async cacheAllVendorsForCompany(companyNo: number): Promise<{
    totalVendors: number;
    cachedVendors: number;
    duration: number;
  }> {
    this.logger.log(`Initiating bulk vendor cache for company: ${companyNo}`);
    return await this.vendorService.cacheAllVendorsForCompany(companyNo);
  }
}
