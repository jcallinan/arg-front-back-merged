import { Inject, Injectable } from "@nestjs/common";
import { GeneralSystemCompanyResponseDto, GetGeneralSystemCompanyParamsDto } from "@src/main/global-states/application/company/dto/get-general-system-company.dto";
import { AppLogger } from "@src/shared/logger/logger.service";
import { GetGeneralSystemCompanyInterface } from "../../../../domain/interface/get-general-system-company.interface";

@Injectable()
export class GenerateAuthCodeForCompanyUsecase {
    private readonly logger = new AppLogger(GenerateAuthCodeForCompanyUsecase.name);

    constructor(
        @Inject("GetGeneralSystemCompanyInterface")
        private readonly getGeneralSystemCompanyInterface: GetGeneralSystemCompanyInterface
    ) { }

    /**
     * Execute the dynamic SP use case
     * @param kebabName - The kebab case name of the report
     * @param parameters - Parameters to pass to the stored procedure
     * @returns Execution result with SP info and output
     */
    async execute(
        data: GetGeneralSystemCompanyParamsDto,
    ): Promise<GeneralSystemCompanyResponseDto> {
        this.logger.log(`Generate Auth Code for company no: ${data.companyNo}`);
        return await this.getGeneralSystemCompanyInterface.updateAuthCodeForCompanyNo(data.companyNo);
    }
} 