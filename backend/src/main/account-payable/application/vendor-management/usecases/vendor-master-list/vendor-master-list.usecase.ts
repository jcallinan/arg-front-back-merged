import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { errorResponse, paginatedResponse, PaginatedResponse } from "@src/shared/utils/response-formatter";
import { Vendor } from "@src/main/account-payable/domain/entities/vendor.entity";
import { VendorInterface } from "@src/main/account-payable/domain/interface/vendor.interface";
import { vendorMasterListDto } from "../../dto/vendor-management.dto";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";

@Injectable()
export class VendorMasterListUsecase {
    private readonly logger = new AppLogger(VendorMasterListUsecase.name);

    constructor(

        @Inject("VendorInterface")
        private readonly vendorInterface: VendorInterface
    ) { }

    async execute(data: vendorMasterListDto): Promise<PaginatedResponse<Vendor>> {

        this.logger.log(`Initiating Vendor Master list search`);

        const { rows, count, limit, page } = await this.vendorInterface.getVendorMasterList(data);

        if (!rows) {
            this.logger.warn("Vendor list not found");

            throw new HttpException(
                errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
                    {
                        field: "vendorList",
                        code: ERROR_CONSTANTS.NOT_FOUND.code,
                        message: "Vendor list not found",
                    },
                ]),
                HttpStatus.NOT_FOUND
            );
        }

        return paginatedResponse(rows, count, page, limit);
    }
}
