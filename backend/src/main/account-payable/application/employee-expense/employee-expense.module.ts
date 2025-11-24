import { Module } from "@nestjs/common";
import { EmployeeExpenseController } from "./controllers/employee-expense.controller";
import { EmployeeExpenseReportUsecase } from "./usecases/employee-expense-reports/employee-expense-reports.usecase";
import { GenerateReportEmployeeExpenseUsecase } from "./usecases/generate-report/generate-report.usecase";
import { SpooledMetadataReportModel } from "../../data/models/spooled-metadata-report.model";
import { SpooledMetaDataReportsRepository } from "../../data/repositories/spooled-meta-data-reports.repository";
import { VendorModel } from "../../data/models/vendor.model";
import { OpenPayableHeaderModel } from "../../data/models/open-payable-header.model";
import { OpenPayableDetailsModel } from "../../data/models/open-payable-details.model";
import { EmployeeExpenseRepository } from "../../data/repositories/employee-expense.repository";


@Module({
    imports: [],
    controllers: [EmployeeExpenseController],
    providers: [

        // Models
        {
            provide: "SpooledMetadataReportModel",
            useValue: SpooledMetadataReportModel,
        },
        {
            provide: "VendorModel",
            useValue: VendorModel,
        },
        {
            provide: "OpenPayableHeaderModel",
            useValue: OpenPayableHeaderModel,
        },
        {
            provide: "OpenPayableDetailsModel",
            useValue: OpenPayableDetailsModel,
        },


        //Repository
        {
            provide: "SpooledMetaDataReportInterface",
            useClass: SpooledMetaDataReportsRepository,
        },
        {
            provide: "EmployeeExpenseInterface",
            useClass: EmployeeExpenseRepository,
        },


        // UseCases
        EmployeeExpenseReportUsecase,
        GenerateReportEmployeeExpenseUsecase
    ],
})
export class EmployeeExpenseModule { }
