import { Inject, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { vendorTypesFormatter } from "@src/shared/formatters/dropdown.formatter";
import { VendorInterface } from "@src/main/account-payable/domain/interface/vendor.interface";
import { Company } from "@src/main/account-payable/domain/entities/company.entity";
import { CompanyInterface } from "@src/main/account-payable/domain/interface/company.interface";


@Injectable()
export class VendorSharedService {
    private readonly logger = new AppLogger(VendorSharedService.name);

    constructor(

        @Inject("VendorInterface")
        private readonly vendorInterface: VendorInterface,

        @Inject("CompanyInterface")
        private readonly companyInterface: CompanyInterface
    ) { }

    async getVendorTypes(): Promise<any> {
        this.logger.log(`Get the Vendor Types`);

        const result = await this.vendorInterface.getVendorTypes()

        return vendorTypesFormatter(result)
    }

    public async getAndIncrementNextEntryNo(
        company: Company,
        reserveCount = 1
    ): Promise<number> {
        this.logger.log(`Fetching nextEntryNo for company Vendor ${company.companyNo}`);

        let nextEntryNo = company.companyVendorNextEntryNo;
        let newNextEntryNo = nextEntryNo + reserveCount;

        if (nextEntryNo === 99999) {
            newNextEntryNo = 1;
        }

        await this.companyInterface.updateNextEntryNo(
            company.companyNo,
            undefined,
            newNextEntryNo
        );

        this.logger.log(
            `Updated nextEntryNo to ${nextEntryNo} for company Vendor ${company.companyNo}`
        );

        return nextEntryNo;
    }


}
