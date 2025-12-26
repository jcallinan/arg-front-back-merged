import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { errorResponse, paginatedResponse, PaginatedResponse } from "@src/shared/utils/response-formatter";
import { Vendor } from "@src/main/account-payable/domain/entities/vendor.entity";
import { VendorInterface } from "@src/main/account-payable/domain/interface/vendor.interface";
import { GetVendorsByYearDto } from "../../dto/ap-period-end.dto";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";

@Injectable()
export class GetVendorsByYearUseCase {
    private readonly logger = new AppLogger(GetVendorsByYearUseCase.name);


    constructor(

        @Inject("VendorInterface")
        private readonly vendorInterface: VendorInterface
    ) { }

    async execute(data: GetVendorsByYearDto): Promise<PaginatedResponse<Vendor>> {

    this.logger.log(`Initiating Vendor data search`);

      const { rows, count, limit, page } = await this.vendorInterface.getVendorMasterListByYear(data);

        if (!rows) {
            this.logger.warn("Vendor data not found");  

            throw new HttpException(
                errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
                    {
                        field: "vendors",
                        code: ERROR_CONSTANTS.NOT_FOUND.code,
                        message: "Vendor data not found",
                    },
                ]),
                HttpStatus.NOT_FOUND  
            );
        }

        return paginatedResponse(rows, count, page, limit);
    }
}
