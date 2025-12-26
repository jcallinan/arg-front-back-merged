import { Inject, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { VendorSharedService } from "../../shared-services/vendor.shared.service";
import { CompanyInterface } from "@src/main/account-payable/domain/interface/company.interface";


@Injectable()
export class GetVendorNumberConfigUsecase {
  private readonly logger = new AppLogger(GetVendorNumberConfigUsecase.name);

  constructor(

    @Inject("CompanyInterface")
    private readonly companyInterface: CompanyInterface,

    private readonly vendorSharedService: VendorSharedService,
  ) { }

  async execute(
    companyNo: number,
  ): Promise<number> {

    this.logger.log(`Fetching company ${companyNo} for voucher config`);

    let company = await this.companyInterface.findOne(companyNo);

    const nextEntryNo = await this.vendorSharedService.getAndIncrementNextEntryNo(company);

    return nextEntryNo;
  }
}
