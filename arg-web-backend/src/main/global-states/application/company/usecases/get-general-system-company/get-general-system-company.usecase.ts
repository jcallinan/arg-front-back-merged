import { Inject, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { GetGeneralSystemCompanyInterface } from "../../../../domain/interface/get-general-system-company.interface";
import { GetGeneralSystemCompanyParamsDto } from "@src/main/global-states/application/company/dto/get-general-system-company.dto";
import { GeneralSystemCompany } from "../../../../domain/entities/general-system-company.entity";

@Injectable()
export class GetGeneralSystemCompanyUsecase {
  private readonly logger = new AppLogger(GetGeneralSystemCompanyUsecase.name);

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
    data: GetGeneralSystemCompanyParamsDto
  ): Promise<GeneralSystemCompany> {
    this.logger.log(`Executing get general system company use case for company no: ${data.companyNo}`);
    return await this.getGeneralSystemCompanyInterface.findOne(data);
  }
} 