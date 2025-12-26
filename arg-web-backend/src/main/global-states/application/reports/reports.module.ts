import { Module } from "@nestjs/common";
import { ReportsController } from "./controllers/reports.controller";
import { GetReportDetailsUsecase } from "./usecases/get-report-details/get-report-details.usecase";
import { GenerateReportUsecase } from "./usecases/generate-report/generate-report.usecase";
import { GetReportNamesUsecase } from "./usecases/get-report-names/get-report-names.usecase";
import { GetDropdownDataUsecase } from "./usecases/get-dropdown-data/get-filters-list.usecase";
import { SpInfoRepository } from "../../data/repositories/spinfo.repository";
import { FiltersListRepository } from "../../data/repositories/filters-list.repository";
import { DynamicSpExecutor } from "../../data/stored-procedure/dynamic-sp-executor";
import { SpInfoModel } from "../../data/models/spinfo.model";
import { ProcessTypeModel } from "@src/main/account-payable/data/models/process-type.model";
import { VendorModel } from "@src/main/account-payable/data/models/vendor.model";
import { VendorContactDetailModel } from "@src/main/account-payable/data/models/vendor-contact-detail.model";
import { CompanyModel } from "@src/main/account-payable/data/models/company.model";
import { GlMasterModel } from "@src/main/account-payable/data/models/gl-master.model";
import { VendorRepository } from "@src/main/account-payable/data/repositories/vendor.repository";
import { CompanyRepository } from "@src/main/account-payable/data/repositories/company.repository";
import { GlMasterRepository } from "@src/main/account-payable/data/repositories/gl-master.repository";
import { ReportRepository } from "@src/main/account-payable/data/repositories/report.repository";
import { CacheService } from "@src/shared/cache/cache.service";
import { CacheModule } from "@src/shared/cache/cache.module";
import { DynamicModelInitializationRepository } from "@src/shared/infrastructure/data/repository/dynamic-model-initialization.repository";
import { GeneralSystemRepository } from "@src/main/account-payable/data/repositories/general-system.repository";
import { CarrierRepository } from "@src/main/account-payable/data/repositories/carrier.repository";
import { CarrierModel } from "@src/main/account-payable/data/models/carrier-model";
import { GeneralSystemModel } from "@src/main/account-payable/data/models/general-system.model";
import { DynamicTableOperations } from "@src/shared/infrastructure/dynamicTableOperations/dynamicTableOperation";
import { GenerateReportFilesUsecase } from "./usecases/generate-report-files/generate-report-files.usecase";
import { GenerateReportRepository } from "../../data/repositories/generate-report.repository";
import { SpooledMetaDataReportsRepository } from "@src/main/account-payable/data/repositories/spooled-meta-data-reports.repository";
import { SpooledMetadataReportModel } from "@src/main/account-payable/data/models/spooled-metadata-report.model";

@Module({
  imports: [CacheModule],
  controllers: [ReportsController],
  providers: [
    GetReportDetailsUsecase,
    GenerateReportUsecase,
    GetReportNamesUsecase,
    GetDropdownDataUsecase,
    GenerateReportFilesUsecase,
    DynamicSpExecutor,
    {
      provide: "SpInfoModel",
      useFactory: () => {
        return SpInfoModel;
      },
    },
    {
      provide: "SpInfoInterface",
      useClass: SpInfoRepository,
    },
    {
      provide: "SpExecutionInterface",
      useClass: DynamicSpExecutor,
    },
    {
      provide: "ProcessTypeModel",
      useValue: ProcessTypeModel,
    },
    {
      provide: "ReportInterface",
      useClass: ReportRepository,
    },
    // Add required models for repositories
    {
      provide: "VendorModel",
      useValue: VendorModel,
    },
    {
      provide: "VendorContactDetailModel",
      useValue: VendorContactDetailModel,
    },
    {
      provide: "CompanyModel",
      useValue: CompanyModel,
    },
    {
      provide: "GlMasterModel",
      useValue: GlMasterModel,
    },
    {
      provide: "CarrierModel",
      useValue: CarrierModel,
    },
    {
      provide: "GeneralSystemModel",
      useValue: GeneralSystemModel,
    },
    {
      provide: "SpooledMetadataReportModel",
      useValue: SpooledMetadataReportModel,
    },
    // Add dropdown repository
    {
      provide: "DropdownInterface",
      useClass: FiltersListRepository,
    },
    // Add required repositories for dropdown repository
    {
      provide: "VendorRepository",
      useClass: VendorRepository,
    },
    {
      provide: "CompanyRepository",
      useClass: CompanyRepository,
    },
    {
      provide: "GlMasterRepository",
      useClass: GlMasterRepository,
    },
    {
      provide: "GeneralSystemRepository",
      useClass: GeneralSystemRepository,
    },
    {
      provide: "CarrierRepository",
      useClass: CarrierRepository,
    },
    {
      provide: "GenerateReportInterface",
      useClass: GenerateReportRepository,
    },
    {
      provide: "SpooledMetaDataReportInterface",
      useClass: SpooledMetaDataReportsRepository,
    },
    CacheService,
    SpInfoRepository,
    FiltersListRepository,
    DynamicModelInitializationRepository,
    DynamicTableOperations,
  ],
})
export class ReportsModule { }
