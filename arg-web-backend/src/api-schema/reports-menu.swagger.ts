import { ApiOperationOptions, ApiResponseOptions, ApiBodyOptions } from "@nestjs/swagger";

export const reportsMenuReports = {
  path: "/reports-menu",
  method: "GET",
  operation: {
    summary: "Get Report Menu by Type",
    operationId: "getReportsMenu",
    tags: ["ReportsMenu"],
    metaData: {
      accessRights: ["reports-menu::read"],
    },
  } as ApiOperationOptions,
  parameters: [
    {
      name: "fileName",
      in: "query",
      required: false,
      description: "Name of the report file",
      schema: {
        type: "string",
        example: "report.pdf",
      },
    },
    {
      name: "reportType",
      in: "query",
      required: false,
      description: "Type of report",
      schema: {
        type: "string",
        example: "AP-Month-End-Vendor-Totals",
      },
    },
    {
      name: "startDate",
      in: "query",
      required: false,
      description: "Start date of report period (YYYY-MM-DD)",
      schema: {
        type: "string",
        format: "date",
        example: "2025-07-01",
      },
    },
    {
      name: "endDate",
      in: "query",
      required: false,
      description: "End date of report period (YYYY-MM-DD)",
      schema: {
        type: "string",
        format: "date",
        example: "2025-07-10",
      },
    },
    {
      name: "limit",
      in: "query",
      required: false,
      description: "Number of items per page",
      schema: {
        type: "integer",
        example: 10,
      },
    },
    {
      name: "offset",
      in: "query",
      required: false,
      description: "Offset for pagination",
      schema: {
        type: "integer",
        example: 0,
      },
    },
  ],
  response: {
    status: 200,
    description: "Paginated list of Reports Menu",
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
                example: "AP-Month-End-Vendor-Totals",
              },
              fileName: { type: "string", example: "my-report.pdf" },
              reportDateTime: {
                type: "string",
                format: "date-time",
              },
              filePath: { type: "string", example: "/files/my-report.pdf" },
              formType: { type: "string", example: "PDF" },
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

export const submitReportsMenu = {
  path: "/reports-menu/submit",
  method: "POST",
  operation: {
    summary: "Insert Reports Menu Data",
    description: "Creates a new reports menu data",
    operationId: "submitReportsMenu",
    tags: ["ReportsMenu"],
    metaData: {
      accessRights: ["reports-menu::submit::create", "reports-menu::submit::update"],
    },
  } as ApiOperationOptions,
  body: {
    schema: {
      oneOf: [
        {
          type: "object",
          required: ["reportType", "companyNo", "reportDate"],
          properties: {
            reportType: { type: "string", example: "AP-Month-End-Vendor-Totals" },
            companyNo: { type: "number", example: 10 },
            reportDate: { type: "string", example: "070725" },
          },
        },
        {
          type: "object",
          required: ["reportType", "companyNo", "outstandingCheckDate"],
          properties: {
            reportType: { type: "string", example: "Outstanding-Check-Register" },
            companyNo: { type: "number", example: 10 },
            outstandingCheckDate: { type: "string", example: "070725" },
          },
        },
      ],
    },
    examples: {
      MonthlyAuditExample: {
        summary: "AP Monthly Audit Report Input",
        value: {
          reportType: "AP-Month-End-Vendor-Totals",
          companyNo: 10,
          reportDate: "070725",
        },
      },
      OutstandingCheckExample: {
        summary: "Outstanding Check Register Input",
        value: {
          reportType: "Outstanding-Check-Register",
          companyNo: 10,
          outstandingCheckDate: "070725",
        },
      },
      MonthEndAuditExample: {
        summary: "AP Month End Audit Report Input",
        value: {
          reportType: "AP-Month-End-Vendor-Subtotals",
          companyNo: 10,
          reportDate: "070725",
        },
      },
      MonthEndDetailWithoutVendorSummaryExample: {
        summary: "AP Month End Detail Without Vendor Summary Input",
        value: {
          reportType: "AP-Month-End-Vendor-Details",
          companyNo: 10,
          reportDate: "070725",
        },
      },
    },
  } as ApiBodyOptions,
  response: {
    status: 200,
    description: "Reports Menu submitted successfully",
  } as ApiResponseOptions,
};
