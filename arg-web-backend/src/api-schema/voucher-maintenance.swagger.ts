import {
  ApiOperationOptions,
  ApiResponseOptions,
  ApiQueryOptions,
} from "@nestjs/swagger";

export const voucherMaintenance = {
  path: "/voucher-maintenance",
  method: "GET",
  operation: {
    summary: "Get vouchers with pagination and filtering",
    description:
        "Retrieve vouchers from APOPNH table with vendor information from APOPNV table. Supports filtering by voucher type (PAID, UNPAID, ALL)",
    operationId: "voucherMaintenance",
    tags: ["Voucher Maintenance"],
    metaData: {
      accessRights: ["voucher-maintenance::read"],
    },
  } as ApiOperationOptions,
  queries: [
    {
      name: "page",
      required: false,
      type: Number,
      description: "Page number (default: 1)",
      example: 1,
    },
    {
      name: "limit",
      required: false,
      type: Number,
      description: "Items per page (default: 500, max: 500)",
      example: 500,
    },
    {
      name: "companyNo",
      required: false,
      type: Number,
      description: "Filter by company number",
      example: 1,
    },
    {
      name: "vendorNo",
      required: false,
      type: Number,
      description: "Filter by vendor number",
      example: 12345,
    },
    {
      name: "voucherType",
      required: false,
      enum: ["UNPAID", "PAID", "ALL"],
      description: "Filter by voucher type",
      example: "UNPAID",
    },
    {
      name: "invoiceDate",
      required: false,
      type: String,
      description: "Filter by invoice date (MMDDYY format)",
      example: "012524",
    },
    {
      name: "invoiceNo",
      required: false,
      type: String,
      description: "Filter by invoice number",
      example: "INV-2024-001",
    },
    {
      name: "sortBy",
      required: false,
      enum: ["invoiceDate"],
      description: "Sort by field",
      example: "invoiceDate",
    },
    {
      name: "sortOrder",
      required: false,
      enum: ["ASC", "DESC"],
      description: "Sort order",
      example: "DESC",
    },
  ] as ApiQueryOptions[],
  response: {
    status: 200,
    description: "Successfully retrieved vouchers",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              vendorName: {
                type: "string",
                example: "ABC Supply Company",
                description: "Vendor name from APOPNV table",
              },
              companyNo: {
                type: "number",
                example: 1,
                description: "Company number",
              },
              vendorNo: {
                type: "number",
                example: 12345,
                description: "Vendor number",
              },
              voucherNo: {
                type: "number",
                example: 67890,
                description: "Voucher number",
              },
              openPayables: {
                type: "number",
                example: 1500.75,
                description: "Open payables amount (calculated from APOPNH)",
              },
              lastPaidAmount: {
                type: "number",
                example: 500.0,
                nullable: true,
                description: "Last paid amount from APOPNH.OPLPAM",
              },
              lastPaidDate: {
                type: "string",
                example: "20240115",
                nullable: true,
                description:
                  "Last paid date from APOPNH.OPLPD8 (YYYYMMDD format)",
              },
              invoiceNumber: {
                type: "string",
                example: "INV-2024-001",
                description: "Invoice number from APOPNH.OPINVN",
              },
              invoiceDate: {
                type: "string",
                example: "012524",
                description:
                  "Invoice date from APOPNH.OPINVD (MMDDYY format for unpaid) or APHSTH.OHINVD (MMDDYY format for paid)",
              },
              dueDate: {
                type: "string",
                example: "20240131",
                description: "Due date from APOPNH.OPDUE8 (YYYYMMDD format)",
              },
              grossAmount: {
                type: "number",
                example: 1500.75,
                description: "Gross amount from APOPNH.OPGRAM",
              },
              discountAmount: {
                type: "number",
                example: 50.0,
                description: "Discount amount from APOPNH.OPDISC",
              },
              partialPaidToDate: {
                type: "number",
                example: 0.0,
                description: "Partial paid to date from APOPNH.OPPPTD",
              },
              invoiceDescription: {
                type: "string",
                example: "Office supplies purchase",
                description: "Invoice description from APOPNH.OPINDS",
              },
              holdPaymentFlag: {
                type: "string",
                example: "N",
                description: "Hold payment flag from APOPNH.OPHALT",
              },
              holdDescription: {
                type: "string",
                example: "Voucher placed on hold",
                nullable: true,
                description: "Hold description from APOPNH.OPHDES (UNPAID) or APHSTH.OHHDES (PAID)",
              },
              prepaidFlag: {
                type: "string",
                example: "N",
                description: "Prepaid voucher flag from APOPNH.OPPAID",
              },
              vendorAddress1: {
                type: "string",
                example: "123 Main Street",
                nullable: true,
                description: "Vendor address line 1 from APOPNV.OPVAD1",
              },
              vendorAddress2: {
                type: "string",
                example: "Suite 100",
                nullable: true,
                description: "Vendor address line 2 from APOPNV.OPVAD2",
              },
              vendorAddress3: {
                type: "string",
                example: "Business District",
                nullable: true,
                description: "Vendor address line 3 from APOPNV.OPVAD3",
              },
              vendorAddress4: {
                type: "string",
                example: "New York, NY 10001",
                nullable: true,
                description: "Vendor address line 4 from APOPNV.OPVAD4",
              },
              cancelledVoucher: {
                type: "string",
                example: "C",
                nullable: true,
                description: "Cancelled voucher flag from APHSTH.OHKCNL (for PAID vouchers)",
              },
              voucherStatus: {
                type: "string",
                example: "UNPAID",
                enum: ["UNPAID", "PAID", "ALL", "CANCELLED"],
                description: "Voucher status (derived from payment status or cancellation status)",
              },
            },
            required: [
              "vendorName",
              "companyNo",
              "vendorNo",
              "voucherNo",
              "openPayables",
              "invoiceNumber",
              "invoiceDate",
              "dueDate",
              "grossAmount",
              "discountAmount",
              "partialPaidToDate",
              "invoiceDescription",
              "holdPaymentFlag",
              "prepaidFlag",
              "voucherStatus",
            ],
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
  errorResponses: [
    {
      status: 400,
      description: "Bad request - Invalid query parameters",
      schema: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              code: { type: "string", example: "VALIDATION_ERROR" },
              message: { type: "string", example: "Invalid query parameters" },
              details: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    field: { type: "string", example: "invoiceDate" },
                    code: { type: "string", example: "INVALID_FORMAT" },
                    message: {
                      type: "string",
                      example: "Invoice date must be in YYYYMMDD format",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      status: 500,
      description: "Internal server error",
      schema: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              code: { type: "string", example: "INTERNAL_ERROR" },
              message: {
                type: "string",
                example: "An unexpected error occurred",
              },
            },
          },
        },
      },
    },
  ] as ApiResponseOptions[],
};

export const getVoucherMaintenanceSummary = {
  path: "/voucher-maintenance/summary",
  method: "GET",
  operation: {
    summary: "Get voucher summary",
    description:
        "Retrieves a summary of vouchers filtered by type, company, and vendor",
    operationId: "getVoucherMaintenanceSummary",
    tags: ["Voucher Maintenance"],
    metaData: {
      accessRights: ["voucher-maintenance::summary::read"],
    },
  } as ApiOperationOptions,
  response: {
    status: 200,
    description: "Successfully retrieved voucher summary",
    schema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              vendorName: { type: "string", example: "ABC Supply Company" },
              companyNo: { type: "number", example: 1 },
              vendorNo: { type: "number", example: 12345 },
              lastPaidAmount: {
                type: "number",
                example: 1000.5,
                nullable: true,
              },
              lastPaidDate: {
                type: "string",
                example: "2023-01-01",
                nullable: true,
              },
              openPayables: { type: "number", example: 500.25, nullable: true },
              openPayablesDate: {
                type: "string",
                example: "2023-12-31",
                nullable: true,
              },
              type: {
                type: "string",
                enum: ["PAID", "UNPAID", "ALL"],
                example: "UNPAID",
              },
            },
          },
        },
      },
      status: { type: "string", example: "success" },
      message: {
        type: "string",
        example: "Successfully retrieved voucher summary",
      },
    },
  } as ApiResponseOptions,
};

export const updateVoucherMaintenanceStatus = {
  path: "/voucher-maintenance/status",
  method: "POST",
  operation: {
    summary: "Update voucher status",
    description:
      "Updates the status of a voucher in APOPNH table. Updates OPHALT column with status code and OPHDES column with status description.",
    operationId: "updateVoucherMaintenanceStatus",
    tags: ["Voucher Maintenance"],
    metaData: {
      accessRights: ["voucher-maintenance::status::create", "voucher-maintenance::status::update"],
    },
  } as ApiOperationOptions,
  response: {
    status: 200,
    description: "Successfully updated voucher status",
    schema: {
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Voucher status updated successfully",
              description: "Success message",
            },
            voucher: {
              type: "object",
              properties: {
                companyNo: {
                  type: "number",
                  example: 10,
                  description: "Company number",
                },
                vendorNo: {
                  type: "number",
                  example: 12345,
                  description: "Vendor number",
                },
                voucherNo: {
                  type: "number",
                  example: 67890,
                  description: "Voucher number",
                },
                statusCode: {
                  type: "string",
                  enum: [" ", "H", "A", "W", "E", "U"],
                  example: "H",
                  description: "Updated status code",
                },
                statusDescription: {
                  type: "string",
                  example: "Voucher placed on hold for review",
                  description: "Updated status description",
                },
                updatedAt: {
                  type: "string",
                  example: "2024-01-15T10:30:00.000Z",
                  description: "Update timestamp",
                },
              },
            },
          },
        },
      },
    },
  } as ApiResponseOptions,
};

export const getVoucherMaintenanceById = {
  path: "/voucher-maintenance/:voucherNo",
  method: "GET",
  operation: {
    summary: "Get voucher details by ID",
    description:
      "Retrieves detailed voucher information based on voucher type, company number, vendor number, and voucher number. For PAID vouchers, data comes from APHSTH/APHSTD tables. For UNPAID vouchers, data comes from APOPNH/APOPND tables.",
    operationId: "getVoucherMaintenanceById",
    tags: ["Voucher Maintenance"],
    metaData: {
      accessRights: ["voucher-maintenance::voucherNo::read"],
    },
  } as ApiOperationOptions,
  parameters: [
    {
      name: "voucherNo",
      in: "path",
      required: true,
      type: Number,
      description: "Voucher number",
      example: 67890,
    },
  ],
  queries: [
    {
      name: "voucherType",
      required: true,
      enum: ["PAID", "UNPAID"],
      description: "Type of voucher to retrieve",
      example: "PAID",
    },
    {
      name: "companyNo",
      required: true,
      type: Number,
      description: "Company number",
      example: 10,
    },
    {
      name: "vendorNo",
      required: true,
      type: Number,
      description: "Vendor number",
      example: 12345,
    },
  ] as ApiQueryOptions[],
  response: {
    status: 200,
    description: "Successfully retrieved voucher view details",
    schema: {
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            headerItems: {
              type: "object",
              properties: {
                vendorName: {
                  type: "string",
                  example: "ABC Supply Company",
                  description: "Vendor name",
                },
                companyNo: {
                  type: "number",
                  example: 10,
                  description: "Company number",
                },
                vendorNo: {
                  type: "number",
                  example: 12345,
                  description: "Vendor number",
                },
                voucherNo: {
                  type: "number",
                  example: 67890,
                  description: "Voucher number",
                },
                invoiceNumber: {
                  type: "string",
                  example: "INV-2024-001",
                  description: "Invoice number",
                },
                invoiceDate: {
                  type: "string",
                  example: "20240101",
                  description: "Invoice date (YYYYMMDD format)",
                },
                dueDate: {
                  type: "string",
                  example: "20240131",
                  description: "Due date (YYYYMMDD format)",
                },
                grossAmount: {
                  type: "number",
                  example: 1500.75,
                  description: "Gross amount",
                },
                discountAmount: {
                  type: "number",
                  example: 50.0,
                  description: "Discount amount",
                },
                partialPaidToDate: {
                  type: "number",
                  example: 0.0,
                  description: "Partial paid to date",
                },
                invoiceDescription: {
                  type: "string",
                  example: "Office supplies purchase",
                  description: "Invoice description",
                },
                voucherType: {
                  type: "string",
                  enum: ["PAID", "UNPAID"],
                  example: "PAID",
                  description: "Voucher type",
                },
                checkNo: {
                  type: "number",
                  example: 123456,
                  nullable: true,
                  description: "Check number (for PAID vouchers)",
                },
                paidDate: {
                  type: "string",
                  example: "20240115",
                  nullable: true,
                  description: "Paid date (YYYYMMDD format, for PAID vouchers)",
                },
                cancelledVoucher: {
                  type: "string",
                  example: "C",
                  nullable: true,
                  description: "Cancelled voucher flag from APHSTH.OHKCNL (for PAID vouchers)",
                },
                lastPaidAmount: {
                  type: "number",
                  example: 500.0,
                  nullable: true,
                  description: "Last paid amount",
                },
                lastPaidDate: {
                  type: "string",
                  example: "20240115",
                  nullable: true,
                  description: "Last paid date (YYYYMMDD format)",
                },
                discountDueDate: {
                  type: "string",
                  example: "20240115",
                  nullable: true,
                  description: "Discount due date (YYYYMMDD format)",
                },
                holdPaymentFlag: {
                  type: "string",
                  example: "N",
                  description: "Hold payment flag",
                },
                holdDescription: {
                  type: "string",
                  example: "Voucher placed on hold",
                  nullable: true,
                  description: "Hold description from APOPNH.OPHDES (UNPAID) or APHSTH.OHHDES (PAID)",
                },
                prepaidFlag: {
                  type: "string",
                  example: "N",
                  description: "Prepaid voucher flag",
                },
                vendorAddress1: {
                  type: "string",
                  example: "123 Main Street",
                  nullable: true,
                  description: "Vendor address line 1",
                },
                vendorAddress2: {
                  type: "string",
                  example: "Suite 100",
                  nullable: true,
                  description: "Vendor address line 2",
                },
                vendorAddress3: {
                  type: "string",
                  example: "Business District",
                  nullable: true,
                  description: "Vendor address line 3",
                },
                vendorAddress4: {
                  type: "string",
                  example: "New York, NY 10001",
                  nullable: true,
                  description: "Vendor address line 4",
                },
                netAmount: {
                  type: "number",
                  example: 1450.75,
                  description: "Net amount (gross amount - discount amount)",
                },
              },
              required: [
                "vendorName",
                "companyNo",
                "vendorNo",
                "voucherNo",
                "invoiceNumber",
                "invoiceDate",
                "dueDate",
                "grossAmount",
                "discountAmount",
                "partialPaidToDate",
                "invoiceDescription",
                "voucherType",
                "holdPaymentFlag",
                "prepaidFlag",
                "netAmount",
              ],
            },
            detailItems: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  sequenceNo: { type: "number", example: 1 },
                  detailType: { type: "number", example: 1 },
                  detail: { type: "number", example: 1 },
                  lineDescription: { type: "string", example: "Fuel purchase" },
                  grossAmount: { type: "number", example: 150.0 },
                  discountAmount: { type: "number", example: 0.0 },
                  netAmount: { type: "number", example: 150.0 },
                  partialPaidToDate: { type: "number", example: 150.0 },
                  expenseGlAccount: { type: "number", example: 5000 },
                  expenseCompanyNo: { type: "number", example: 10 },
                  lastPaidDate: {
                    type: "string",
                    example: "20240115",
                    nullable: true,
                  },
                  purchaseJournalNo: { type: "string", example: "PJ001" },
                  inventoryItemNo: { type: "string", example: "FUEL001" },
                  quantity: { type: "number", example: 50.0 },
                  jobNo: { type: "string", example: "JOB001" },
                  jobExtraField: { type: "string", example: "EXTRA" },
                  costCode: { type: "string", example: "FUEL" },
                  costType: { type: "string", example: "DIRECT" },
                  jobCostQuantity: { type: "number", example: 50.0 },
                  purchaseOrderNo: { type: "string", example: "PO001" },
                  receiptNumber: { type: "number", example: 12345 },
                  poStatus: { type: "string", example: "OPEN" },
                  poLineSequenceNo: { type: "number", example: 1 },
                  productAmount: { type: "number", example: 150.0 },
                  freightAmount: { type: "number", example: 0.0 },
                  poNumber: { type: "string", example: "PO001" },
                },
              },
            },
          },
          required: ["headerItems", "detailItems"],
        },
        status: { type: "string", example: "success" },
        message: {
          type: "string",
          example: "Successfully retrieved voucher view details",
        },
      },
      required: ["data", "status", "message"],
    },
  } as ApiResponseOptions,
  errorResponses: [
    {
      status: 400,
      description: "Bad request - Invalid query parameters",
      schema: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              code: { type: "string", example: "VALIDATION_ERROR" },
              message: { type: "string", example: "Invalid query parameters" },
              details: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    field: { type: "string", example: "voucherType" },
                    code: { type: "string", example: "INVALID_ENUM" },
                    message: {
                      type: "string",
                      example: "Voucher type must be either PAID or UNPAID",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      status: 404,
      description: "Voucher not found",
      schema: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              code: { type: "string", example: "NOT_FOUND" },
              message: {
                type: "string",
                example:
                  "Voucher not found with voucherType: PAID, companyNo: 10, vendorNo: 1376, voucherNo: 17573",
              },
              details: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    field: { type: "string", example: "voucher" },
                    code: { type: "string", example: "NOT_FOUND" },
                    message: {
                      type: "string",
                      example:
                        "Voucher not found with voucherType: PAID, companyNo: 10, vendorNo: 1376, voucherNo: 17573",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      status: 500,
      description: "Internal server error",
      schema: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              code: { type: "string", example: "INTERNAL_ERROR" },
              message: {
                type: "string",
                example: "An unexpected error occurred",
              },
            },
          },
        },
      },
    },
  ] as ApiResponseOptions[],
};

export const updateVoucherMaintenanceDiscount = {
  path: "/voucher-maintenance/discount",
  method: "POST",
  operation: {
    summary: "Update voucher discount information",
    description:
      "Updates the discount due date (OPDSDT) and discount amount (OPDISC) in APOPNH table for a specific voucher.",
    operationId: "updateVoucherDiscount",
    tags: ["Voucher Maintenance"],
    metaData: {
      accessRights: ["voucher-maintenance::discount::create", "voucher-maintenance::discount::update"],
    },
  } as ApiOperationOptions,
  response: {
    status: 200,
    description: "Successfully updated voucher discount information",
    schema: {
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Discount information updated successfully",
              description: "Success message",
            },
            voucher: {
              type: "object",
              properties: {
                companyNo: {
                  type: "number",
                  example: 10,
                  description: "Company number",
                },
                vendorNo: {
                  type: "number",
                  example: 12345,
                  description: "Vendor number",
                },
                voucherNo: {
                  type: "number",
                  example: 67890,
                  description: "Voucher number",
                },
                discountDueDate: {
                  type: "string",
                  example: "011524",
                  description: "Updated discount due date (MMDDYY format)",
                },
                discount: {
                  type: "number",
                  example: 50.0,
                  description: "Updated discount amount",
                },
                updatedAt: {
                  type: "string",
                  example: "2024-01-15T10:30:00.000Z",
                  description: "Update timestamp",
                },
              },
            },
          },
        },
      },
    },
  } as ApiResponseOptions,
  errorResponses: [
    {
      status: 400,
      description: "Bad request - Invalid request body",
      schema: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              code: { type: "string", example: "VALIDATION_ERROR" },
              message: { type: "string", example: "Invalid request body" },
              details: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    field: { type: "string", example: "discountDueDate" },
                    code: { type: "string", example: "INVALID_FORMAT" },
                    message: {
                      type: "string",
                      example:
                        "Discount due date must be in MMDDYY format (6 digits)",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      status: 404,
      description: "Voucher not found",
      schema: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              code: { type: "string", example: "NOT_FOUND" },
              message: {
                type: "string",
                example:
                  "Voucher not found with companyNo: 10, vendorNo: 12345, voucherNo: 67890",
              },
              details: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    field: { type: "string", example: "voucher" },
                    code: { type: "string", example: "NOT_FOUND" },
                    message: {
                      type: "string",
                      example:
                        "Voucher not found with companyNo: 10, vendorNo: 12345, voucherNo: 67890",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      status: 500,
      description: "Internal server error",
      schema: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              code: { type: "string", example: "INTERNAL_ERROR" },
              message: {
                type: "string",
                example: "An unexpected error occurred",
              },
            },
          },
        },
      },
    },
  ] as ApiResponseOptions[],
};

export const transferVoucher = {
  path: "/voucher-maintenance/transfer",
  method: "POST",
  operation: {
    summary: "Transfer voucher to APTRANH/APTRAND",
    description:
      "Transfers a voucher from source tables (APOPNH/APOPND for UNPAID or APHSTH/APHSTD for PAID) to APTRANH/APTRAND tables. Creates new entry records in the target tables.",
    operationId: "transferVoucher",
    tags: ["Voucher Maintenance"],
    metaData: {
      accessRights: ["voucher-maintenance::transfer::create", "voucher-maintenance::transfer::update"],
    },
  } as ApiOperationOptions,
  response: {
    status: 200,
    description: "Successfully transferred voucher to APTRANH/APTRAND",
    schema: {
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Voucher transferred successfully to APTRANH/APTRAND",
              description: "Success message",
            },
            voucher: {
              type: "object",
              properties: {
                companyNo: {
                  type: "number",
                  example: 10,
                  description: "Company number",
                },
                vendorNo: {
                  type: "number",
                  example: 12345,
                  description: "Vendor number",
                },
                voucherNo: {
                  type: "number",
                  example: 67890,
                  description: "Voucher number",
                },
                voucherType: {
                  type: "string",
                  enum: ["PAID", "UNPAID"],
                  example: "UNPAID",
                  description: "Type of voucher transferred",
                },
                sourceTable: {
                  type: "string",
                  example: "APOPNH/APOPND",
                  description:
                    "Source table(s) where voucher was transferred from",
                },
                targetTable: {
                  type: "string",
                  example: "APTRANH/APTRAND",
                  description:
                    "Target table(s) where voucher was transferred to",
                },
                transferredAt: {
                  type: "string",
                  example: "2024-01-15T10:30:00.000Z",
                  description: "Transfer timestamp",
                },
                headerRecordId: {
                  type: "number",
                  example: 12345,
                  description: "New entry number created in APTRANH",
                },
                detailRecordIds: {
                  type: "array",
                  items: { type: "number" },
                  example: [12345, 12346],
                  description: "New entry numbers created in APTRAND",
                },
              },
            },
          },
        },
      },
    },
  } as ApiResponseOptions,
  errorResponses: [
    {
      status: 400,
      description: "Bad request - Invalid request body",
      schema: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              code: { type: "string", example: "VALIDATION_ERROR" },
              message: { type: "string", example: "Invalid request body" },
              details: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    field: { type: "string", example: "voucherType" },
                    code: { type: "string", example: "INVALID_ENUM" },
                    message: {
                      type: "string",
                      example: "Voucher type must be either PAID or UNPAID",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      status: 404,
      description: "Voucher not found",
      schema: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              code: { type: "string", example: "NOT_FOUND" },
              message: {
                type: "string",
                example:
                  "UNPAID voucher not found in APOPNH: companyNo=10, vendorNo=12345, voucherNo=67890",
              },
              details: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    field: { type: "string", example: "voucher" },
                    code: { type: "string", example: "NOT_FOUND" },
                    message: {
                      type: "string",
                      example:
                        "UNPAID voucher not found in APOPNH: companyNo=10, vendorNo=12345, voucherNo=67890",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      status: 500,
      description: "Internal server error",
      schema: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              code: { type: "string", example: "INTERNAL_ERROR" },
              message: {
                type: "string",
                example: "An unexpected error occurred during voucher transfer",
              },
            },
          },
        },
      },
    },
  ] as ApiResponseOptions[],
};
