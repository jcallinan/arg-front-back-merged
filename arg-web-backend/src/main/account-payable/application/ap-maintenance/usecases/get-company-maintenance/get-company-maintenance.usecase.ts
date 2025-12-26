import { Injectable, Inject } from "@nestjs/common";
import { CompanyInterface } from "@src/main/account-payable/domain/interface/company.interface";
import { AppLogger } from "@src/shared/logger/logger.service";
import { GetCompanyMaintenanceDto } from "../../dto/ap-maintenance.dto";
import { Company } from "@src/main/account-payable/domain/entities/company.entity";

@Injectable()
export class GetCompanyMaintenanceUseCase {
  private readonly logger = new AppLogger(GetCompanyMaintenanceUseCase.name);

  constructor(
    @Inject("CompanyInterface")
    private readonly companyRepository: CompanyInterface
  ) {}

  async execute(dto: GetCompanyMaintenanceDto): Promise<Company> {
    this.logger.log(
      `Fetching APCONT data for company number: ${dto.companyNo}`
    );

    try {
      const company = await this.companyRepository.findOne(dto.companyNo);

      this.logger.log(
        `Successfully retrieved APCONT data for company: ${company.companyName}`
      );
      return company;
    } catch (error) {
      this.logger.error(
        `Error fetching APCONT data for company ${dto.companyNo}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      throw error;
    }
  }
}
