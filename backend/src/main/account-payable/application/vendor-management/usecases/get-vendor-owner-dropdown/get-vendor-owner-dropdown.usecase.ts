import { Inject, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { OwnerVendorInterface } from "@src/main/account-payable/domain/interface/owner-vendor.interface";
import { DropdownType } from "@src/types/types";
import { OwnerNoFormatter } from "@src/shared/formatters/dropdown.formatter";
import { normalizeSearchQuery } from "@src/shared/utils/query.utils";
import { vendorOwnerList } from "../../dto/vendor-management.dto";

@Injectable()
export class GetVendorOwnerDropdown {
    private readonly logger = new AppLogger(GetVendorOwnerDropdown.name);

    constructor(
        @Inject("OwnerVendorInterface")
        private readonly ownerVendorInterface: OwnerVendorInterface,
    ) { }

    async execute(data: vendorOwnerList): Promise<DropdownType[]> {

        this.logger.log(`Get the Vendor Owner Mapping List`);

        const { vendorCompanyNumber, vendorNo, status, ownerNo, } = data

        const { offset, limit, page } = normalizeSearchQuery(data)

        const result =  await this.ownerVendorInterface.findAndCountAll({ vendorCompanyNumber, vendorNo, ownerNo, status, limit, page, offset });

        return OwnerNoFormatter(result.items)
    }


}
