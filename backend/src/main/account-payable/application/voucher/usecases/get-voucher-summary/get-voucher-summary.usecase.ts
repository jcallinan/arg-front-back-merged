import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { VoucherHeaderInterface } from '@src/main/account-payable/domain/interface/voucher.interface';
import { PROCESS_TYPE_ENUM } from '@src/shared/constants/constant';
import { CompanyService } from '@src/main/account-payable/domain/services/company/companies.service';
import { errorResponse } from '@src/shared/utils/response-formatter';
import { ERROR_CONSTANTS } from '@src/shared/constants/error-constants';

@Injectable()
export class GetVoucherSummaryUseCase {
  constructor(
    @Inject('VoucherHeaderInterface')
    private readonly voucherHeaderRepository: VoucherHeaderInterface,
    private readonly companyService: CompanyService,
  ) {}

  async execute(query: { companyNo: number; processType: PROCESS_TYPE_ENUM }) {
    const { companyNo, processType } = query;
    // Check if company exists
    const company = await this.companyService.findOne(companyNo);
    if (!company) {
      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
          {
            field: 'companyNo',
            code: ERROR_CONSTANTS.NOT_FOUND.code,
            message: `Company not found with number ${companyNo}`,
          },
        ]),
        HttpStatus.NOT_FOUND
      );
    }
    return this.voucherHeaderRepository.getVoucherSummary(companyNo, processType);
  }
} 