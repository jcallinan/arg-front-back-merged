import { Inject, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { VendorInterface } from "@src/main/account-payable/domain/interface/vendor.interface";
import { vendorDetailsDto } from "../../../vendor-management/dto/vendor-management.dto";


@Injectable()
export class updateVendorByYearUsecase {
    private readonly logger = new AppLogger(updateVendorByYearUsecase.name);

    constructor(

        @Inject("VendorInterface")
        private readonly vendorInterface: VendorInterface
    ) { }

    async execute(data: vendorDetailsDto, year: string, vendorNo: string): Promise<{ message: string }> {

        this.logger.log(`Update Vendor`);

        return await this.vendorInterface.updateVendorByYear(data, year, vendorNo);
    }
}
