import { Module } from "@nestjs/common";
import { ReportModule } from "../../domain/services/report/report.module";
import { PurchaseJournalAppModule } from "../../domain/services/purchase-journal/purchase-journal.module";
import { ReportsMenuController } from "./controllers/reports-menu.controller";
import { SpooledMetaDataReportsRepository } from "../../data/repositories/spooled-meta-data-reports.repository";
import { ReportsMenuUsecase } from "./usecases/reports-menu/reports-menu.usecase";
import { ReportsMenuSubmitUseCase } from "./usecases/reports-menu-submit/reports-menu-submit.usecase";
import { SpooledMetadataReportModel } from "../../data/models/spooled-metadata-report.model";
import { ReportRepository } from "../../data/repositories/report.repository";
import { ProcessTypeModel } from "../../data/models/process-type.model";

@Module({
  imports: [PurchaseJournalAppModule, ReportModule],
  controllers: [ReportsMenuController],
  providers: [
    {
      provide: "SpooledMetaDataReportsInterface",
      useClass: SpooledMetaDataReportsRepository,
    },
    {
      provide: "SpooledMetadataReportModel",
      useValue: SpooledMetadataReportModel,
    },
    {
      provide: "ReportInterface",
      useClass: ReportRepository,
    },
    {
      provide: "ProcessTypeModel",
      useValue: ProcessTypeModel,
    },
    ReportsMenuUsecase,
    ReportsMenuSubmitUseCase,
  ],
})
export class ReportsMenuModule {}
