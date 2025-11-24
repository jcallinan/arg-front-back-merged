import { Controller, Body, Post, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiEndpoint } from "@src/api-schema/swagger.decorator";
import * as SwaggerConfig from "@src/api-schema/employee-expense.swagger";
import { GenerateReportEmployeeExpenseUsecase } from "../usecases/generate-report/generate-report.usecase";
import { employeeExpenseGenerateReportDto, ReportResponseDto } from "../dto/employee-expense.dto";
import { EmployeeExpenseReportUsecase } from "../usecases/employee-expense-reports/employee-expense-reports.usecase";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";


@ApiTags("Employee Expense")
@Controller("employee-expense")

export class EmployeeExpenseController {

  constructor(

    private readonly generateReportUsecase: GenerateReportEmployeeExpenseUsecase,
    private readonly employeeExpenseReportUsecase: EmployeeExpenseReportUsecase,

  ) { }


  @Post("/generate")
  @ApiEndpoint(SwaggerConfig.generateReportEmployeeExpense)
  async generateReportEmployeeExpense(@Body() data: employeeExpenseGenerateReportDto): Promise<{ message: string }> {
    return await this.generateReportUsecase.execute(data);
  }


  @Get("/reports")
  @ApiEndpoint(SwaggerConfig.getEmployeeExpenseReports)
  async getEmployeeExpenseReports(): Promise<PaginatedResponse<ReportResponseDto>> {
    return await this.employeeExpenseReportUsecase.execute();
  }
}
