import { Injectable, Inject } from "@nestjs/common";
import { CompanyInterface } from "@src/main/account-payable/domain/interface/company.interface";
import { AppLogger } from "@src/shared/logger/logger.service";
import { Company } from "@src/main/account-payable/domain/entities/company.entity";
import { GetCompanyDetailsDto } from "../../../voucher/dto/company.dto";

@Injectable()
export class GetCompanyDetailsUseCase {
  private readonly logger = new AppLogger(GetCompanyDetailsUseCase.name);

  constructor(
    @Inject("CompanyInterface")
    private readonly companyRepository: CompanyInterface
  ) {}

  async execute(dto: GetCompanyDetailsDto): Promise<Company> {
    this.logger.log(
      `Fetching company details for company number: ${dto.companyNo}`
    );
      const company = await this.companyRepository.findOne(dto.companyNo);

      this.logger.log(
        `Successfully retrieved company details for company: ${company.companyName}`
      );
      return company;

  }
}
