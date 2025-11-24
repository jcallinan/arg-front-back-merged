import { Module } from "@nestjs/common";
import { ReportService } from "./report.service";
import { ReportRepository } from "@src/main/account-payable/data/repositories/report.repository";
import { ProcessTypeModel } from "@src/main/account-payable/data/models/process-type.model";

@Module({
  providers: [
    ReportService,
    {
      provide: "ProcessTypeModel",
      useValue: ProcessTypeModel,
    },
    {
      provide: "ReportInterface",
      useClass: ReportRepository,
    },
  ],
  exports: [ReportService, "ReportInterface"],
})
export class ReportModule { }
