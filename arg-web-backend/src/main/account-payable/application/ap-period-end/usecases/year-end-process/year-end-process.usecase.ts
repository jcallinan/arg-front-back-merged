import { Inject, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { vendorYearEndProcessDto } from "../../dto/ap-period-end.dto";
import { YearEndProcessResponse } from "../../../../domain/entities/year-end-process.entity";
import { VendorInterface } from "@src/main/account-payable/domain/interface/vendor.interface";

@Injectable()
export class VendorYearEndProcessUseCase {
    private readonly logger = new AppLogger(VendorYearEndProcessUseCase.name);

    constructor(
        @Inject("VendorInterface")
        private readonly vendorRepository: VendorInterface
    ) {}

    async execute(data: vendorYearEndProcessDto): Promise<YearEndProcessResponse> {
        this.logger.log(`Initiating vendor year-end process for company ${data.companyNo}, year ${data.year}, clearYTD: ${data.clearYTD}`);

        try {
            const result = await this.vendorRepository.processVendorYearEnd(data.companyNo, data.year, data.clearYTD ?? false);
            
            this.logger.log(`Year-end process completed successfully for company ${data.companyNo}, year ${data.year}`);
            return result;

        } catch (error) {
            this.logger.error(`Year-end process failed for company ${data.companyNo}, year ${data.year}:`, error as string);
            const errorMessage = error instanceof Error ? error.message : String(error);
            
            return YearEndProcessResponse.create({
                message: `Year-end process failed: ${errorMessage}`,
                tableName: undefined,
                dataCopied: 0
            });
        }
    }
}
