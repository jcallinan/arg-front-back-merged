import { Module } from "@nestjs/common";
import { GetGeneralSystemCompanyRepository } from "../../data/repositories/get-general-system-company.repository";
import { GetGeneralSystemCompanyUsecase } from "./usecases/get-general-system-company/get-general-system-company.usecase";
import { CompanyController } from "./controllers/company.controller";
import { GeneralSystemCompanyModel } from "../../data/models/general-system-company.model";
import { AuthCodeCheckerForCompanyUsecase } from "./usecases/auth-code-checker/auth-code-checker.usecase";
import { GenerateAuthCodeForCompanyUsecase } from "./usecases/generate-auth-code-for-company/generate-auth-code-for-company.usecase";

@Module({
  providers: [
    //Usecases
    AuthCodeCheckerForCompanyUsecase,
    GenerateAuthCodeForCompanyUsecase,
    GetGeneralSystemCompanyUsecase, 
    
    GetGeneralSystemCompanyRepository,

    //Models
    {
      provide: "GeneralSystemCompanyModel",
      useValue: GeneralSystemCompanyModel,
    },
    {
      provide: "GetGeneralSystemCompanyInterface",
      useClass: GetGeneralSystemCompanyRepository,
    },
  ],
  exports: [GetGeneralSystemCompanyUsecase],
  controllers: [CompanyController],
})
export class CompanyModule { }  