import { Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { VendorSharedService } from "../../shared-services/vendor.shared.service";


@Injectable()
export class VendorTypesUsecase {
    private readonly logger = new AppLogger(VendorTypesUsecase.name);

    constructor(
        private readonly vendorSharedService: VendorSharedService
    ) { }

    async execute(): Promise<any> {

        this.logger.log(`Get the Vendor Types`);

        return await this.vendorSharedService.getVendorTypes();
    }


}
