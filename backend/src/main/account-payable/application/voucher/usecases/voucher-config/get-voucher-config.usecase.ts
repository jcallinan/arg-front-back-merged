import { Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { CompanyService } from "@src/main/account-payable/domain/services/company/companies.service";
import { VendorAppService } from "@src/main/account-payable/domain/services/vendor/vendor.service";
import { VoucherSharedService } from "@src/main/account-payable/application/voucher/shared-services/voucher.shared.service";
import { VoucherConfigResponseDto } from '../../dto/voucher.dto';
import { GeneralSystemService } from "@src/main/account-payable/domain/services/general-system/general-system.service";


@Injectable()
export class GetVoucherConfigUseCase {
  private readonly logger = new AppLogger(GetVoucherConfigUseCase.name);

  constructor(
    private readonly companyService: CompanyService,
    private readonly vendorAppService: VendorAppService,
    private readonly voucherSharedService: VoucherSharedService,
    private readonly generalSystemService: GeneralSystemService,
  ) {}

  async execute(
    companyNo: number,
    vendorNo: number
  ): Promise<VoucherConfigResponseDto> {
    this.logger.log(`Fetching company ${companyNo} for voucher config`);
    let company = await this.companyService.findOne(companyNo);
    this.logger.log(`Fetching vendor ${vendorNo} for voucher config`);
    let vendor = await this.vendorAppService.findVendorByNo(
      vendorNo,
      companyNo
    );

    // Calculate and update nextEntryNo if needed
    let generalSystemRecord = await this.generalSystemService.getGeneralSystemRecord("APTERM", vendor.vendorApTermsCode.toString());
    console.log("generalSystemRecord", generalSystemRecord);
    const nextEntryNo = await this.voucherSharedService.getAndIncrementNextEntryNo(company);

    const { companyDiscountsGlDesc, companyApGlDesc, companyBankGlDesc } = await this.voucherSharedService.getCompanyGlDescriptions(company);

    const response = new VoucherConfigResponseDto();
    response.company = {
      ...company,
      companyNextEntryNo: nextEntryNo,
      companyDiscountsGlDesc,
      companyApGlDesc,
      companyBankGlDesc,
    };
    response.vendor = vendor;
    response.lineDiscountPercentage = generalSystemRecord?.discount? (generalSystemRecord?.discount * 100).toString() : "0";
    return response;
  }
}
