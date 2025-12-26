import { Module } from "@nestjs/common";
import { ReportModule } from "../../domain/services/report/report.module";
import { APGlobalStatesController } from "./controllers/ap-global-states";
import { ReportRepository } from "../../data/repositories/report.repository";
import { ProcessTypeModel } from "../../data/models/process-type.model";
import { ReportListUsecase } from "./usecases/report-list/report-list.usecase";


@Module({
    imports: [ReportModule],
    controllers: [APGlobalStatesController],
    providers: [
        {
            provide: "ReportInterface",
            useClass: ReportRepository,
        },
        {
            provide: "ProcessTypeModel",
            useValue: ProcessTypeModel,
        },
        ReportListUsecase
    ],
})
export class APGlobalStatesModule { }
