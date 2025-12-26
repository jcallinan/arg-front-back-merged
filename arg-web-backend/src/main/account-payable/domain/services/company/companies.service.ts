import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { CompanyInterface } from "../../interface/company.interface";
import { Company } from "../../entities/company.entity";
import { AppLogger } from "@src/shared/logger/logger.service";
import { GetAllCompaniesDto } from "../../../application/voucher/dto/company.dto";
import { normalizeSearchQuery } from "@src/shared/utils/query.utils";
import {
  errorResponse,
  PaginatedResponse,
  paginatedResponse,
} from "@src/shared/utils/response-formatter";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";

@Injectable()
export class CompanyService {
  private readonly logger = new AppLogger(CompanyService.name);

  constructor(
    @Inject("CompanyInterface")
    private readonly companyRepository: CompanyInterface
  ) {}

  async getAllCompanies(
    dto: GetAllCompaniesDto
  ): Promise<PaginatedResponse<Company>> {
    this.logger.log("Fetching all companies");
    const { search, limit, offset, page } = normalizeSearchQuery(dto);
    const { rows, count } = await this.companyRepository.findAll(
      search,
      limit,
      offset
    );
    this.logger.debug(`Found ${rows.length} active companies`);

    return paginatedResponse(rows, count, page, limit);
  }

  async findOne(companyNo: number): Promise<Company> {
    this.logger.log(`Fetching company with number ${companyNo}`);
    const company = await this.companyRepository.findOne(companyNo);

    if (!company) {
      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
          {
            field: "companyNo",
            code: ERROR_CONSTANTS.NOT_FOUND.code,
            message: `Company not found with number ${companyNo}`,
          },
        ]),
        HttpStatus.NOT_FOUND
      );
    }

    return company;
  }

  async updateNextEntryNo(
    companyNo: number,
    nextEntryNo: number
  ): Promise<Company> {
    return await this.companyRepository.updateNextEntryNo(
      companyNo,
      nextEntryNo
    );
  }

  /**
   * Cache all companies - useful for warming up cache
   */
  async cacheAllCompanies(): Promise<{
    totalCompanies: number;
    cachedCompanies: number;
    duration: number;
  }> {
    this.logger.log(`Initiating bulk company cache`);
    return await this.companyRepository.cacheAllCompanies();
  }
}
