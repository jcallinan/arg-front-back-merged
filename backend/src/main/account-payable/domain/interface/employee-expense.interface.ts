import { generateReportType } from "@src/types/employee-expense-types";

export interface EmployeeExpenseInterface {


  generateReport(data: generateReportType): Promise<any>;

}
