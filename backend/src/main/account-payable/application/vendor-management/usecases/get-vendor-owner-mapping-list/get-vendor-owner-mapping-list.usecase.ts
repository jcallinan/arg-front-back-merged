import { Inject, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import { OwnerVendorInterface } from "@src/main/account-payable/domain/interface/owner-vendor.interface";
import { vendorOwnerList } from "../../dto/vendor-management.dto";
import { normalizeSearchQuery } from "@src/shared/utils/query.utils";
import { OwnerVendorEntity } from "@src/main/account-payable/domain/entities/owner-vendor.entity";


@Injectable()
export class GetVendorOwnerMappingList {
    private readonly logger = new AppLogger(GetVendorOwnerMappingList.name);

    constructor(
        @Inject("OwnerVendorInterface")
        private readonly ownerVendorInterface: OwnerVendorInterface,
    ) { }

    async execute(data: vendorOwnerList): Promise<PaginatedResponse<{
        items: OwnerVendorEntity[];
        total_items: number;
        current_page: number;
        items_per_page: number;
        total_pages: number,
    }>> {

        this.logger.log(`Get the Vendor Owner Mapping List`);

        const { vendorCompanyNumber, vendorNo, status, ownerNo } = data

        const { offset, limit, page } = normalizeSearchQuery(data)

        return await this.ownerVendorInterface.findAndCountAll({ vendorCompanyNumber, vendorNo, ownerNo, status, limit, page, offset });
    }


}
