import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { CompanyInterface } from "@src/main/account-payable/domain/interface/company.interface";
import { GlMasterInterface } from "@src/main/account-payable/domain/interface/gl-master.interface";
import { AppLogger } from "@src/shared/logger/logger.service";
import { UpdateCompanyMaintenanceDto } from "../../dto/ap-maintenance.dto";
import { Company } from "@src/main/account-payable/domain/entities/company.entity";
import { errorResponse } from "@src/shared/utils/response-formatter";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";

@Injectable()
export class UpdateCompanyMaintenanceUseCase {
  private readonly logger = new AppLogger(UpdateCompanyMaintenanceUseCase.name);

  constructor(
    @Inject("CompanyInterface")
    private readonly companyRepository: CompanyInterface,
    @Inject("GlMasterInterface")
    private readonly glMasterRepository: GlMasterInterface
  ) {}


  async execute(dto: UpdateCompanyMaintenanceDto): Promise<Company> {
    this.logger.log(
      `Updating company data for company number: ${dto.companyNo}`
    );

    try {
      // Apply defaults: NXTE and NXVO must be ≥ 1, force to 1 if ≤ 0
      if (dto.companyNextEntryNo <= 0) {
        this.logger.debug(
          `Company Next Entry Number (NXTE) is ${dto.companyNextEntryNo}, forcing to 1`
        );
        dto.companyNextEntryNo = 1;
      }

      if (dto.companyNextVoucherNo <= 0) {
        this.logger.debug(
          `Company Next Voucher Number (NXVO) is ${dto.companyNextVoucherNo}, forcing to 1`
        );
        dto.companyNextVoucherNo = 1;
      }

      // Validate all GL numbers before updating (repository handles all validation logic)
      const validationResult = await this.glMasterRepository.validateCompanyMaintenanceGlNumbers(
        dto.companyNo,
        dto.companyApGlNo,
        dto.companyBankGlNo,
        dto.companyDiscountsGlNo,
        dto.companyIntercoGlNo,
        dto.companyRetentionGlNo,
        dto.companyEmployeeExpenseGlNo
      );

      // If there are any errors, throw an exception
      if (validationResult.errors.length > 0) {
        throw new HttpException(
          errorResponse(ERROR_CONSTANTS.VALIDATION_ERROR, validationResult.errors),
          HttpStatus.BAD_REQUEST
        );
      }

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
