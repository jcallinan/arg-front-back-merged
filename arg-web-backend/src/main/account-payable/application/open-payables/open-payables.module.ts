import { Module } from "@nestjs/common";
import { PurchaseJournalAppModule } from "../../domain/services/purchase-journal/purchase-journal.module";
import { OpenPayablesController } from "./controllers/open-payables.controller";
import { SpooledMetaDataReportsRepository } from "../../data/repositories/spooled-meta-data-reports.repository";
import { OpenPayablesUsecase } from "./usecases/open-payable/open-payable.usecase";
import { SpooledMetadataReportModel } from "../../data/models/spooled-metadata-report.model";
import { OpenPayablesReportGeneratorUseCase } from "./usecases/open-payable-report-generator/open-payable-report-generator.usecase";
import { ReportRepository } from "../../data/repositories/report.repository";
import { ProcessTypeModel } from "../../data/models/process-type.model";


@Module({
    imports: [PurchaseJournalAppModule],
    controllers: [OpenPayablesController],
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
        OpenPayablesUsecase,
        OpenPayablesReportGeneratorUseCase
    ],
})
export class OpenPayablesModule { }
