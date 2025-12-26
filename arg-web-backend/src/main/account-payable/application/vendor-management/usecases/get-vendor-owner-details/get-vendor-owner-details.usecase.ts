import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { vendorOwnerDetailsDto } from "../../dto/vendor-management.dto";
import { OwnerVendorInterface } from "@src/main/account-payable/domain/interface/owner-vendor.interface";
import { OwnerVendorEntity } from "@src/main/account-payable/domain/entities/owner-vendor.entity";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";
import { errorResponse } from "@src/shared/utils/response-formatter";


@Injectable()
export class VendorOwnerDetailsUsecase {
    private readonly logger = new AppLogger(VendorOwnerDetailsUsecase.name);

    constructor(
        @Inject("OwnerVendorInterface")
        private readonly ownerVendorInterface: OwnerVendorInterface,
    ) { }

    async execute(data: vendorOwnerDetailsDto): Promise<OwnerVendorEntity | null> {

        this.logger.log(`Create and Update Vendor Owner Mapping`);

        const { ownerNo, vendorNo } = data

        // Interface Call
        const ownerDetails = await this.ownerVendorInterface.findOne(vendorNo, ownerNo);

        if (!ownerDetails) {
            this.logger.warn("Vendor Owner Details not found");

            throw new HttpException(
                errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
                    {
                        field: "vendorOwner",
                        code: ERROR_CONSTANTS.NOT_FOUND.code,
                        message: "Vendor Owner Details not found",
                    },
                ]),
                HttpStatus.NOT_FOUND
            );
        }
        
        return ownerDetails
    }
}
