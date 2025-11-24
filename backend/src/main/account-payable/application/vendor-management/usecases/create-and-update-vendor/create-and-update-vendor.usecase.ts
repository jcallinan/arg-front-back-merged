import { Inject, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { vendorandVendorContactDetailsInputDto } from "../../dto/vendor-management.dto";
import { VendorInterface } from "@src/main/account-payable/domain/interface/vendor.interface";


@Injectable()
export class CreateUpdateVendorUsecase {
    private readonly logger = new AppLogger(CreateUpdateVendorUsecase.name);

    constructor(

        @Inject("VendorInterface")
        private readonly vendorInterface: VendorInterface
    ) { }

    // PaginatedResponse<SpooledMetaDataReportEntity>
    async execute(data: vendorandVendorContactDetailsInputDto): Promise<{ message: string }> {

        this.logger.log(`Create and Update Vendor`);

        // Service Call
        return await this.vendorInterface.createOrUpdateVendor(data);
    }
}
