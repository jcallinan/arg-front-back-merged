import {
    Injectable,
    Inject
  } from "@nestjs/common";
import { Vendor } from "@src/main/account-payable/domain/entities/vendor.entity";
  import { VendorInterface } from "@src/main/account-payable/domain/interface/vendor.interface";
  import { AppLogger } from "@src/shared/logger/logger.service";
  
  @Injectable()
 export class VendorSharedService {
    private readonly logger = new AppLogger(VendorSharedService.name);
  
    constructor(
      @Inject("VendorInterface")
      private readonly vendorInterface: VendorInterface,
    ) { }
  
    /**
     * Fetch vendor number based on company number and a single carrier ID.
     * Returns an object or null if not found.
     */
    async getVendorNoByCompanyAndCarrierId(
      companyNo: number,
      carrierId: string
    ): Promise<Vendor | null> {
      this.logger.log(
        `Fetching vendor numbers for companyNo: ${companyNo} and carrierId: ${carrierId}`
      );
      const result = await this.vendorInterface.getVendorNoByCompanyAndCarrierId(companyNo, carrierId);
      this.logger.debug(`Found vendor number for companyNo: ${companyNo}${result}`);
      
      return result;
    }
  
  }
  