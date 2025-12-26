import { Module } from "@nestjs/common";
import { ReportsModule } from "./application/reports/reports.module";
import { CompanyModule } from "./application/company/company.module";

@Module({
  imports: [
    ReportsModule,
    CompanyModule,
  ],
  exports: [
    ReportsModule,
    CompanyModule,
  ],
})
export class GlobalStatesModule { } 