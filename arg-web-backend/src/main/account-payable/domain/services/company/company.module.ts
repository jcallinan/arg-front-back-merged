import { Module } from "@nestjs/common";
import { CompanyService } from "./companies.service";
import { CompanyRepository } from "@src/main/account-payable/data/repositories/company.repository";
import { CompanyModel } from "@src/main/account-payable/data/models/company.model";

@Module({
  imports: [],
  providers: [
    CompanyService,
    {
      provide: "CompanyModel",
      useValue: CompanyModel,
    },
    {
      provide: "CompanyInterface",
      useClass: CompanyRepository,
    },
  ],
  exports: [CompanyService],
})
export class CompanyModule {}
