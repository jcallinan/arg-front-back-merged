import { ApiOperationOptions, ApiResponseOptions } from "@nestjs/swagger";

export const getEmployeeExpenseReports = {
  path: "/employee-expense/reports",
  method: "GET",
  operation: {
    summary: "Get Employee Expense Reports",
    operationId: "getEmployeeExpenseReports",
    tags: ["Employee Expense"],
    metaData: {
      accessRights: ["employee-expense::reports::read"],
    },
  } as ApiOperationOptions,
  response: {
    status: 200,
    description: "Paginated list of Employee Expense Reports",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              reportType: {
                type: "string",
                example: "Employee-Expense",
              },
              pdfFileName: { type: "string", example: "my-report.pdf" },
              reportDateTime: {
                type: "string",
                format: "date-time",
              },
              filePath: { type: "string", example: "/files/my-report.pdf" },
              formType: { type: "string", example: "PDF" }
            },
            required: ["fileName", "reportDateTime", "filePath", "formType"],
          },
        },
        pagination: {
          type: "object",
          properties: {
            total_items: { type: "number", example: 100 },
            current_page: { type: "number", example: 1 },
            items_per_page: { type: "number", example: 10 },
            total_pages: { type: "number", example: 10 },
          },
          required: [
            "total_items",
            "current_page",
            "items_per_page",
            "total_pages",
          ],
        },
      },
      required: ["items", "pagination"],
    },
  } as ApiResponseOptions,
};


export const generateReportEmployeeExpense = {
  path: "/employee-expense/generate",
  method: "POST",
  operation: {
    summary: "Generate Employee Expense Reports",
    operationId: "generateReportEmployeeExpense",
    tags: ["Employee Expense"],
    metaData: {
      accessRights: ["employee-expense::generate::create", "employee-expense::generate::update"],
    },
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              companyNo: {
                type: "number",
                example: 10,
                description: "Company Number",
              },
              batch: {
                type: "number",
                example: 99,
                description: "Batch Number",
              },
              bankGlNo: {
                type: "number",
                example: 12110099,
                description: "Bank GL Number",
              },
              dateToPay: {
                type: "number",
                example: 20250801,
                description: "Date to Pay (YYYYMMDD)",
              },
            },
            required: ["companyNo", "voucherToPay", "batch", "bankGlNo", "dateToPay"],
          },
        },
      },
    },
  } as ApiOperationOptions,
  response: {
    status: 200,
    description: "Generate Employee Expense Reports",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Detailed and Summary Report Generated Successfully",
            },
          },
        },
      },
      required: ["items"],
    },
  } as ApiResponseOptions,
};

