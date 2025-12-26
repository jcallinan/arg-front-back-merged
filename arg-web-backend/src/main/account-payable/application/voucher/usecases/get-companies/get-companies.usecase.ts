import { Injectable } from "@nestjs/common";
import { Company } from "@src/main/account-payable/domain/entities/company.entity";
import { AppLogger } from "@src/shared/logger/logger.service";
import { GetAllCompaniesDto } from "../../dto/company.dto";
import { CompanyService } from "@src/main/account-payable/domain/services/company/companies.service";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";

@Injectable()
export class GetCompaniesUseCase {
  private readonly logger = new AppLogger(GetCompaniesUseCase.name);

  constructor(private readonly companyService: CompanyService) { }

  async execute(dto: GetAllCompaniesDto): Promise<PaginatedResponse<Company>> {
    this.logger.log("Fetching all companies");
    const response = await this.companyService.getAllCompanies(dto);
    this.logger.debug(`Found ${response.items.length} active companies`);
    return response;
  }

  /**
   * Cache all companies - useful for warming up cache
   */
  async cacheAllCompanies(): Promise<{
    totalCompanies: number;
    cachedCompanies: number;
    duration: number;
  }> {
    this.logger.log("Initiating bulk company cache");
    return await this.companyService.cacheAllCompanies();
  }
}
