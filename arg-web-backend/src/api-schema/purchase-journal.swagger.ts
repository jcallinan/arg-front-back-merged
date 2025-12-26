import { ApiOperationOptions, ApiResponseOptions, ApiBodyOptions } from "@nestjs/swagger";

export const purchaseJournalReports = {
  path: "/purchase-journal",
  method: "GET",
  operation: {
    summary: "Get All Purchase Journal Reports",
    operationId: "purchaseJournalReports",
    tags: ["PurchaseJournal"],
    metaData: {
      accessRights: ["purchase-journal::reports::read"],
    },
  } as ApiOperationOptions,
  queries: [
    {
      name: "reportType",
      type: String,
      required: false,
      description: "Type of the report",
    },
    {
      name: "fileName",
      type: String,
      required: false,
      description: "Name of the report file",
    },
    {
      name: "startDate",
      type: String,
      required: false,
      description: "Start date of report period (MMDDYY)",
      example: "062725",
    },
    {
      name: "endDate",
      type: String,
      required: false,
      description: "End date of report period (MMDDYY)",
      example: "062725",
    },
    {
      name: "limit",
      type: Number,
      required: false,
      description: "Number of items per page",
      example: 10,
    },
    {
      name: "offset",
      type: Number,
      required: false,
      description: "Offset for pagination",
      example: 0,
    },
  ],
  response: {
    status: 200,
    description: "Get Report of Purchase Journal with pagination",
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
              reportDateTime: { type: "string", format: "date-time" },
              filePath: { type: "string", example: "/files/my-report.pdf" },
            },
            required: ["reportType", "fileName", "reportDateTime", "filePath"],
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

export const submitPurchaseJournal = {
  path: "/purchase-journal/submit",
  method: "POST",
  operation: {
    summary: "Insert a Purchase Journal Data",
    description: "Creates a new purchase journal data",
    operationId: "submitPurchaseJournal",
    tags: ["PurchaseJournal"],
    metaData: {
      accessRights: ["purchase-journal::submit::create", "purchase-journal::submit::update"],
    },
  } as ApiOperationOptions,
  body: {
    schema: {
      type: "object",
      required: ["entries", "purchaseJD", "keyCashDJD", "companyNo"],
      properties: {
        entries: {
          type: "array",
          items: {
            type: "object",
            required: ["invoiceNo", "companyNo", "entryNo", "vendorNo"],
            properties: {
              invoiceNo: { type: "string", example: "22420" },
              companyNo: { type: "number", example: 10 },
              entryNo: { type: "number", example: 19042 },
              vendorNo: { type: "number", example: 1001 },
              prepaidCode: { type: "string", example: "P", description: "Prepaid code" },
              prepaidCheckNo: { type: "string", example: "12345", description: "Prepaid check number" },
              bankGl: { type: "number", example: 10000001, description: "Bank GL number" },
              invoiceAmount: { type: "number", example: 1000.50, description: "Invoice amount" },
            },
          },
        },
        purchaseJD: { type: "string", example: "070725" },
        keyCashDJD: { type: "string", example: "000000" },
        companyNo: { type: "number", example: 10 },
      },
    },
  } as ApiBodyOptions,
  response: {
    status: 200,
    description: "Purchase Journal submitted successfully",
  } as ApiResponseOptions,
};