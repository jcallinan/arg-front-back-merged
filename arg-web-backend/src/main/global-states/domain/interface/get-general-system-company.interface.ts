import { GeneralSystemCompany } from "../entities/general-system-company.entity";

export interface GetGeneralSystemCompanyParams {
  companyNo: number;
}

export interface GetGeneralSystemCompanyInterface {
  findOne(params: GetGeneralSystemCompanyParams): Promise<GeneralSystemCompany>;

  authCodeCheckerCompanyNo(companyNo: number, authCode: number): Promise<GeneralSystemCompany>;

  updateAuthCodeForCompanyNo(companyNo: number): Promise<GeneralSystemCompany>

}