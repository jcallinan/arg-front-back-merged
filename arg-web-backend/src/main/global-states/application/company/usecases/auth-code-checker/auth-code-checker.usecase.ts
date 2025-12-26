import { Inject, Injectable } from "@nestjs/common";
import { GeneralSystemAuthDto, GeneralSystemCompanyResponseDto, GetGeneralSystemCompanyParamsDto } from "@src/main/global-states/application/company/dto/get-general-system-company.dto";
import { AppLogger } from "@src/shared/logger/logger.service";
import { GetGeneralSystemCompanyInterface } from "../../../../domain/interface/get-general-system-company.interface";

@Injectable()
export class AuthCodeCheckerForCompanyUsecase {
    private readonly logger = new AppLogger(AuthCodeCheckerForCompanyUsecase.name);

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
        dto: GeneralSystemAuthDto
    ): Promise<GeneralSystemCompanyResponseDto> {
        this.logger.log(`Checking Auth Code for company no: ${data.companyNo}`);
        return await this.getGeneralSystemCompanyInterface.authCodeCheckerCompanyNo(data.companyNo, dto.authCode);
    }
} 