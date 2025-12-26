import { Module } from "@nestjs/common";
import { APMaintenanceController } from "./controllers/ap-maintenance.controller";
import { GetCompanyMaintenanceUseCase } from "./usecases/get-company-maintenance/get-company-maintenance.usecase";
import { UpdateCompanyMaintenanceUseCase } from "./usecases/update-company-maintenance/update-company-maintenance.usecase";
import { CompanyRepository } from "@src/main/account-payable/data/repositories/company.repository";
import { CompanyModel } from "@src/main/account-payable/data/models/company.model";
import { CacheModule } from "@src/shared/cache/cache.module";
import { GlMasterModule } from "@src/main/account-payable/domain/services/gl-master/gl-master.module";

@Module({
  imports: [CacheModule, GlMasterModule],
  controllers: [APMaintenanceController],
  providers: [
    {
      provide: "CompanyModel",
      useValue: CompanyModel,
    },
    {
      provide: "CompanyInterface",
      useClass: CompanyRepository,
    },
    CompanyRepository,
    GetCompanyMaintenanceUseCase,
    UpdateCompanyMaintenanceUseCase,
  ],
  exports: [GetCompanyMaintenanceUseCase, UpdateCompanyMaintenanceUseCase],
})
export class APMaintenanceModule {}
