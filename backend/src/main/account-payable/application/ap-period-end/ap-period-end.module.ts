import { Module } from "@nestjs/common";
import { APPeriodEndController } from "./controllers/ap-period-end.controller";
import { VendorYearEndProcessUseCase } from "./usecases/year-end-process/year-end-process.usecase";
import { GetVendorsByYearUseCase } from "./usecases/get-vendors-by-year/get-vendors-by-year.usecase";
import { GetCompanyDetailsUseCase } from "./usecases/get-company-details/get-company-details.usecase";
import { GetReviewFilesUsecase } from "./usecases/get-review-files/get-review-files.usecase";
import { CacheModule } from "@src/shared/cache/cache.module";
import { VendorRepository } from "../../data/repositories/vendor.repository";
import { VendorModel } from "../../data/models/vendor.model";
import { VendorContactDetailModel } from "../../data/models/vendor-contact-detail.model";
import { CompanyRepository } from "../../data/repositories/company.repository";
import { CompanyModel } from "../../data/models/company.model";
import { SpooledMetaDataReportsRepository } from "../../data/repositories/spooled-meta-data-reports.repository";
import { SpooledMetadataReportModel } from "../../data/models/spooled-metadata-report.model";
import { PurchaseJournalAppModule } from "../../domain/services/purchase-journal/purchase-journal.module";
import { DynamicTableOperations } from "@src/shared/infrastructure/dynamicTableOperations/dynamicTableOperation";
import { DynamicModelInitializationRepository } from "@src/shared/infrastructure/data/repository/dynamic-model-initialization.repository";
import { GetApPeriodEndUsecase } from "./usecases/get-ap-period-end/get-ap-period-end.usecase";
import { PostApPeriodEndUsecase } from "./usecases/post-ap-period-end/post-ap-period-end.usecase";
import { ApPeriodEndModel } from "../../data/models/ap-period-end.model";
import { ApPeriodEndRepository } from "../../data/repositories/ap-period-end.repository";
import { AllApPeriodEndUsecase } from "./usecases/get-all-ap-period-end/get-all-ap-period-end.usecase";
import { SoftDeleteRecordUsecase } from "./usecases/soft-delete-record/soft-delete-record.usecase";
import { GetVendorDetailsByYearUsecase } from "./usecases/get-vendor-details-by-year/get-vendor-details-by-year.usecase";

import { updateVendorByYearUsecase } from "./usecases/update-vendor-by-year/update-vendor.usecase";
import { GeneralSystemRepository } from "../../data/repositories/general-system.repository";
import { GeneralSystemModel } from "../../data/models/general-system.model";

@Module({
  imports: [CacheModule, PurchaseJournalAppModule],
  controllers: [APPeriodEndController],
  providers: [
    {
      provide: "VendorInterface",
      useClass: VendorRepository,
    },
    {
      provide: "ApPeriodEndInterface",
      useClass: ApPeriodEndRepository,
    },
    {
      provide: "GeneralSystemInterface",
      useClass: GeneralSystemRepository,
    },
    {
      provide: "VendorModel",
      useValue: VendorModel,
    },
    {
      provide: "ApPeriodEndModel",
      useValue: ApPeriodEndModel,
    },
    {
      provide: "VendorContactDetailModel",
      useValue: VendorContactDetailModel,
    },
    {
      provide: "CompanyInterface",
      useClass: CompanyRepository,
    },
    {
      provide: "CompanyModel",
      useValue: CompanyModel,
    },
    {
      provide: "GeneralSystemModel",
      useValue: GeneralSystemModel,
    },
    GetCompanyDetailsUseCase,
    DynamicTableOperations,
    {
      provide: "SpooledMetaDataReportsInterface",
      useClass: SpooledMetaDataReportsRepository,
    },
    {
      provide: "SpooledMetadataReportModel",
      useValue: SpooledMetadataReportModel,
    },
    DynamicTableOperations,
    GetVendorsByYearUseCase,
    VendorYearEndProcessUseCase,
    GetApPeriodEndUsecase,
    PostApPeriodEndUsecase,
    GetReviewFilesUsecase,
    DynamicModelInitializationRepository,
    AllApPeriodEndUsecase,
    SoftDeleteRecordUsecase,
    GetVendorDetailsByYearUsecase,
    updateVendorByYearUsecase
  ],
})
export class APPeriodEndModule { }
