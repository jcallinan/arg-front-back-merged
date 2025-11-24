import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { GeneralSystemCompanyModel } from "../models/general-system-company.model";
import { GetGeneralSystemCompanyInterface, GetGeneralSystemCompanyParams } from "../../domain/interface/get-general-system-company.interface";
import { mapGeneralSystemCompanyModelToEntity } from "../mappers/general-system-company.mapper";
import { GeneralSystemCompany } from "../../domain/entities/general-system-company.entity";
import { errorResponse } from "@src/shared/utils/response-formatter";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";
import { literal } from "@sequelize/core";
import { getRandomNumber } from "@src/shared/utils/random-number-generator";

@Injectable()
export class GetGeneralSystemCompanyRepository implements GetGeneralSystemCompanyInterface {
  constructor(
    @Inject("GeneralSystemCompanyModel")
    private readonly generalSystemCompanyModel: typeof GeneralSystemCompanyModel
  ) { }

  async findOne(params: GetGeneralSystemCompanyParams): Promise<GeneralSystemCompany> {
    const generalSystemCompany = await this.generalSystemCompanyModel.findOne({ where: { companyNo: params.companyNo } });
    return mapGeneralSystemCompanyModelToEntity(generalSystemCompany || new GeneralSystemCompanyModel());
  }

  async updateAuthCodeForCompanyNo(companyNo: number): Promise<GeneralSystemCompany> {

    const randomNumber = getRandomNumber()

    await this.generalSystemCompanyModel.update(
      {
        apPostOverrideCode: literal(
          `MOD(${(this.generalSystemCompanyModel as any).getAttributes().apPostOverrideCode.field} + ${randomNumber}, 1000000)`
        ),
      },
      {
        where: { companyNo },
      }
    );

    return await this.findOne({ companyNo })
  }


  async authCodeCheckerCompanyNo(companyNo: number, authCode: number): Promise<GeneralSystemCompany> {

    const generalSystemCompany = await this.generalSystemCompanyModel.findOne({ where: { companyNo, apPostOverrideCode: authCode } });

    if (!generalSystemCompany) {
      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.UNAUTHORIZED, [
          {
            field: "general-system",
            code: ERROR_CONSTANTS.UNAUTHORIZED.code,
            message: `Auth Code not found for companyNo: ${companyNo}`,
          },
        ]),
        HttpStatus.UNAUTHORIZED
      );

    }

    await this.updateAuthCodeForCompanyNo(companyNo)

    return mapGeneralSystemCompanyModelToEntity(generalSystemCompany);
  }
}