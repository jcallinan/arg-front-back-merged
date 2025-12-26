import { ApiOperationOptions, ApiResponseOptions } from "@nestjs/swagger";

export const openPayableReports = {
  path: "/open-payables",
  method: "GET",
  operation: {
    summary: "Get Open Payables Report by Type",
    operationId: "getOpenPayablesReport",
    tags: ["OpenPayables"],
    metaData: {
      accessRights: ["open-payables::read"],
    },
  } as ApiOperationOptions,
  queries: [
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
        example: "Open-Payables-By-Due-Date",
      },
    },
    {
      name: "startDate",
      in: "query",
      required: false,
      description: "Start date of report period (MMDDYY)",
      schema: {
        type: "string",
        format: "date",
        example: "062725",
      },
    },
    {
      name: "endDate",
      in: "query",
      required: false,
      description: "End date of report period (MMDDYY)",
      schema: {
        type: "string",
        format: "date",
        example: "062725",
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
    description: "Paginated list of Open Payable Reports",
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
                example: "AccountPayable_PURCHASE REGISTER",
              },
              pdfFileName: { type: "string", example: "my-report.pdf" },
              reportDateTime: {
                type: "string",
                format: "date-time",
              },
              filePath: { type: "string", example: "/files/my-report.pdf" },
            },
            required: ["fileName", "reportDateTime", "filePath"],
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

export const openPayableGenerateReport = {
  path: "/open-payables",
  method: "POST",
  operation: {
    summary: "Generate Report for Openpayables",
    operationId: "openPayableGenerateReport",
    tags: ["OpenPayables"],
    metaData: {
      accessRights: ["open-payables::create", "open-payables::update"],
    },
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              companyNo: {
                type: "Number",
                example: 10,
                description: 10,
              },
              openPayables: {
                type: "string",
                example: "Open-Payables-By-Due-Date",
                description: "Open-Payables-By-Due-Date",
              },
              holdVoucher: {
                type: "string",
                example: "Y",
                description: "Hold Voucher (optional)",
              },
              dateOne: {
                type: "string",
                format: "date",
                example: "072525",
                description: "MMDDYY",
              },
              dateTwo: {
                type: "string",
                format: "date-time",
                example: "072525",
                description: "MMDDYY",
              },
              dateThree: {
                type: "string",
                format: "date-time",
                example: "072525",
                description: "MMDDYY",
              },
              dateFour: {
                type: "string",
                format: "date-time",
                example: "072525",
                description: "MMDDYY",
              },
              populateSpreadsheet: {
                type: "string",
                example: "Y",
                description: "Value for spreadsheet",
              },
            },
            required: ["openPayables", "companyNo"],
          },
        },
      },
    },
  },
  response: {
    status: 200,
    description: "Open Payable report generated",
  } as ApiResponseOptions,
};


