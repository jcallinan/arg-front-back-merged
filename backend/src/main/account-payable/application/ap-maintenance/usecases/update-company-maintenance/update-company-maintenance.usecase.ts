import { Injectable, Inject } from "@nestjs/common";
import { CompanyInterface } from "@src/main/account-payable/domain/interface/company.interface";
import { AppLogger } from "@src/shared/logger/logger.service";
import { UpdateCompanyMaintenanceDto } from "../../dto/ap-maintenance.dto";
import { Company } from "@src/main/account-payable/domain/entities/company.entity";

@Injectable()
export class UpdateCompanyMaintenanceUseCase {
  private readonly logger = new AppLogger(UpdateCompanyMaintenanceUseCase.name);

  constructor(
    @Inject("CompanyInterface")
    private readonly companyRepository: CompanyInterface
  ) {}

  async execute(dto: UpdateCompanyMaintenanceDto): Promise<Company> {
    this.logger.log(
      `Updating company data for company number: ${dto.companyNo}`
    );

    try {
      // Remove companyNo from the update data since it's the identifier
      const { companyNo, ...updateData } = dto;

      const updatedCompany = await this.companyRepository.update(
        companyNo,
        updateData
      );

      this.logger.log(
        `Successfully updated company data for company: ${updatedCompany.companyName}`
      );
      return updatedCompany;
    } catch (error) {
      this.logger.error(
        `Error updating company data for company ${dto.companyNo}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      throw error;
    }
  }
}
