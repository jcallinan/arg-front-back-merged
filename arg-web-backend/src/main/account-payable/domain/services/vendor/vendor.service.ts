import {
  Injectable,
  Inject,
  BadRequestException,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { VendorInterface } from "@src/main/account-payable/domain/interface/vendor.interface";
import { Vendor } from "../../entities/vendor.entity";
import { AppLogger } from "@src/shared/logger/logger.service";
import { GetAllVendorsDto } from "@src/main/account-payable/application/voucher/dto/voucher.dto";
import { normalizeSearchQuery } from "@src/shared/utils/query.utils";
import {
  errorResponse,
  PaginatedResponse,
  paginatedResponse,
} from "@src/shared/utils/response-formatter";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";


@Injectable()
export class VendorAppService {
  private readonly logger = new AppLogger(VendorAppService.name);

  constructor(
    @Inject("VendorInterface")
    private readonly vendorRepository: VendorInterface,
  ) { }

  async getAllVendors(
    dto: GetAllVendorsDto,
  ): Promise<PaginatedResponse<Vendor>> {

    this.logger.log("Fetching all vendors");

    const companyNo = dto.companyNo;

    if (!companyNo) {
      this.logger.warn("Company No. is required.");
      throw new BadRequestException("Company No. is required.");
    }

    const { search, limit, offset, page } = normalizeSearchQuery(dto);

    const { rows, count } = await this.vendorRepository.findAll(
      companyNo,
      search || undefined,
      limit,
      offset,
    );

    this.logger.debug(`Found ${rows.length} active vendors`);

    return paginatedResponse(rows, count, page, limit);
  }

  async findVendorByNo(vendorNo: number, companyNo: number): Promise<Vendor> {
    this.logger.log(
      `Fetching vendor data for vendorNo: ${vendorNo}, companyNo: ${companyNo}`,
    );

    const vendor = await this.vendorRepository.findOne(vendorNo, companyNo);
    if (!vendor) {
      this.logger.warn(
        `Vendor with vendorNo: ${vendorNo} and companyNo: ${companyNo} not found.`,
      );
      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
          {
            field: "vendorNo",
            code: ERROR_CONSTANTS.NOT_FOUND.code,
            message: `Vendor with vendorNo: ${vendorNo} and companyNo: ${companyNo} not found.`,
          },
        ]),
        HttpStatus.NOT_FOUND
      );
    }

    this.logger.debug(`Found vendor: ${JSON.stringify(vendor)}`);
    return vendor;
  }

  /**
   * Cache all vendors for a company - useful for CSV upload scenarios
   * This ensures all vendors are available in cache before bulk processing
   */
  async cacheAllVendorsForCompany(companyNo: number): Promise<{
    totalVendors: number;
    cachedVendors: number;
    duration: number;
  }> {
    this.logger.log(`Initiating bulk vendor cache for company: ${companyNo}`);

    const result = await this.vendorRepository.cacheAllVendorsForCompany(companyNo);

    this.logger.log(
      `Bulk cache completed for company ${companyNo}: ${result.cachedVendors}/${result.totalVendors} vendors cached in ${result.duration}ms`
    );

    return result;
  }


}
