import { Inject, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { vendorOwnerDto } from "../../dto/vendor-management.dto";
import { OwnerVendorInterface } from "@src/main/account-payable/domain/interface/owner-vendor.interface";


@Injectable()
export class CreateUpdateVendorOwnerUsecase {
    private readonly logger = new AppLogger(CreateUpdateVendorOwnerUsecase.name);

    constructor(
        @Inject("OwnerVendorInterface")
        private readonly ownerVendorInterface: OwnerVendorInterface,
    ) { }

    // PaginatedResponse<SpooledMetaDataReportEntity>
    async execute(data: vendorOwnerDto): Promise<{ message: string }> {

        this.logger.log(`Create and Update Vendor Owner Mapping`);

        const { ownerNo, vendorNo, isDeleted } = data

        // Service Call
        return await this.ownerVendorInterface.createOrUpdateOwner(ownerNo, vendorNo, isDeleted);
    }
}
