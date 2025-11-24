import {
  ApiOperationOptions,
  ApiResponseOptions,
  ApiQueryOptions,
  ApiBodyOptions,
} from "@nestjs/swagger";
import { PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";

export const getAllCompanies = {
  path: "/account-payable/voucher/companies",
  method: "GET",
  operation: {
    summary: "Get all companies",
    operationId: "getCompanies",
    tags: ["Voucher"],
    metaData: {
      accessRights: ["account-payable::voucher::companies::read"],
    },
  } as ApiOperationOptions,
  response: {
    status: 200,
    description: "Success",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", example: "123" },
              label: { type: "string", example: "Company Name" },
              value: { type: "string", example: "Company Name" },
            },
            required: ["id", "label", "value"],
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

export const getAllProcessTypes = {
  path: "/account-payable/voucher/process-types",
  method: "GET",
  operation: {
    summary: "Get all process types",
    operationId: "getProcessTypes",
    tags: ["Voucher"],
    metaData: {
      accessRights: ["account-payable::voucher::process-types::read"],
    },
  } as ApiOperationOptions,
  response: {
    status: 200,
    description: "Success",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", example: "1" },
              label: { type: "string", example: "Normal" },
              value: { type: "string", example: "Normal" },
            },
            required: ["id", "label", "value"],
          },
        },
      },
      required: ["items"],
    },
  } as ApiResponseOptions,
};

export const getAllVendors = {
  path: "/account-payable/voucher/vendors",
  method: "GET",
  operation: {
    summary: "Get all vendors",
    operationId: "getAllVendors",
    tags: ["Voucher"],
    metaData: {
      accessRights: ["account-payable::voucher::vendors::read"],
    },
  } as ApiOperationOptions,
    queries: [
    {
      name: "companyNo",
      type: Number,
      required: true,
      description: "Company Number",
    } as ApiQueryOptions
  ],
  response: {
    status: 200,
    description: "Success",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", example: "11" },
              label: { type: "string", example: "Vendor Name" },
              value: { type: "string", example: "Vendor Name" },
            },
            required: ["id", "label", "value"],
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

export const getVendorById = {
  path: "/account-payable/voucher/get-vendor-by-id",
  method: "GET",
  operation: {
    summary: "Get Vendor by Id",
    operationId: "getVendorById",
    tags: ["Voucher"],
    metaData: {
      accessRights: ["account-payable::voucher::get-vendor-by-id::read"],
    },
  } as ApiOperationOptions,
  queries: [
    {
      name: "companyNo",
      type: Number,
      required: true,
      description: "Company Number",
    } as ApiQueryOptions,
    {
      name: "vendorNo",
      type: Number,
      required: true,
      description: "Vendor Number",
    } as ApiQueryOptions,
  ],
  response: {
    status: 200,
    description: "Vendor fetched successfully",
    schema: {
      type: "object",
      properties: {
        items: {
          vendorCompanyNumber: { type: "number", example: 10 },
          vendorNo: { type: "number", example: 2339 },
          vendorName: { type: "string", example: "APPALACHIAN TRANSPORT INC" },
          vendorAdd1: { type: "string", example: "PO BOX 1473" },
          vendorAdd2: { type: "string", example: "SMETHPORT, PA 16749" },
          vendorAdd3: { type: "string", example: "" },
          vendorAdd4: { type: "string", example: "" },
          vendorZipCode: { type: "number", example: 16749 },
        },
      },
      required: ["items"],
    },
  } as ApiResponseOptions,
};

export const getVoucherEntry = {
  path: "/account-payable/voucher/get-voucher-entry",
  method: "GET",
  operation: {
    summary: "Get Voucher Entry Grid Data",
    operationId: "getVoucherEntry",
    tags: ["Voucher"],
    metaData: {
      accessRights: ["account-payable::voucher::get-voucher-entry::read"],
    },
  } as ApiOperationOptions,
  queries: [
    {
      name: "companyNo",
      type: Number,
      required: true,
      description: "Company Number",
    } as ApiQueryOptions,
    {
      name: "vendorNo",
      type: Number,
      required: false,
      description: "Vendor Number",
    } as ApiQueryOptions,
    {
      name: "entryNo",
      type: Number,
      required: false,
      description: "Entry Number",
    } as ApiQueryOptions,
    {
      name: "current_page",
      type: Number,
      required: false,
      description: "Page Number",
    } as ApiQueryOptions,
    {
      name: "items_per_page",
      type: Number,
      required: false,
      description: "Limit per Page",
    } as ApiQueryOptions,
    {
      name: "sortBy",
      type: String,
      required: false,
      description: "Sort By",
    } as ApiQueryOptions,
    {
      name: "sortOrder",
      type: String,
      required: false,
      description: "Sort Order asc or desc",
    } as ApiQueryOptions,
  ],
  response: {
    status: 200,
    description: "Voucher data found successfully",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              processType: { type: "string", example: "NORMAL" },
              entryNo: { type: "number", example: 41741 },
              invoiceNo: { type: "string", example: "ABC123" },
              invoiceAmount: { type: "number", example: 2443500 },
              invoiceDate: { type: "string", example: "02/22/04" },
              dueDate: { type: "string", example: "02/22/04" },
              discountDueDate: { type: "string", example: "02/22/04" },
              holdDesc: { type: "string", example: "123" },
              companyNo: { type: "number", example: 22204 },
              vendorNo: { type: "number", example: 22204 },
              vendorName: { type: "string", example: "ABSG CONSULTING" },
            },
            required: [
              "processType",
              "entryNo",
              "invoiceNo",
              "companyNo",
              "vendorNo",
              "vendorName",
              "invoiceAmount",
              "invoiceDate",
              "dueDate",
              "discountDueDate",
              "holdDesc",
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
};

export const getDataByEntryNo = {
  path: "/account-payable/voucher/entry/:entryNo",
  method: "GET",
  operation: {
    summary: "Get Voucher Headers and Details",
    operationId: "getDataByEntryNo",
    tags: ["Voucher"],
    metaData: {
      accessRights: ["account-payable::voucher::entry::entryNo::read"],
    },
  } as ApiOperationOptions,
  queries: [
    {
      name: "companyNo",
      type: Number,
      required: true,
      description: "Company Number",
    } as ApiQueryOptions,
    {
      name: "vendorNo",
      type: Number,
      required: false,
      description: "Vendor Number",
    } as ApiQueryOptions,
  ],
  response: {
    status: 200,
    description: "Voucher data found successfully",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "object",
          properties: {
            headerItem: {
              type: "object",
              properties: {
                isDeleted: { type: "string", example: "N" },
                companyNo: { type: "number", example: 10 },
                entryNo: { type: "number", example: 19042 },
                entrySequence: { type: "number", example: 1 },
                vendorNo: { type: "number", example: 1001 },
                canceledVoucher: { type: "number", example: 0 },
                apGlNo: { type: "number", example: 11230024 },
                invoiceDesc: { type: "string", example: "Office Supplies" },
                invoiceDate: { type: "string", example: "112325" },
                dueDate: { type: "string", example: "112325" },
                singleCheck: { type: "string", example: "Y" },
                holdCode: { type: "string", example: "N" },
                holdDesc: { type: "string", example: "No Hold" },
                prepaidCode: { type: "string", example: "N" },
                prepaidCheckNo: { type: "number", example: 0 },
                vendorName: { type: "string", example: "Vendor Name" },
                vendorAdd1: { type: "string", example: "Address 1" },
                vendorAdd2: { type: "string", example: "Address 2" },
                vendorAdd3: { type: "string", example: "" },
                vendorAdd4: { type: "string", example: "" },
                bankGl: { type: "number", example: 11230024 },
                invoiceAmount: { type: "number", example: 100000 },
                retentionGl: { type: "number", example: 11230024 },
                retentionPct: { type: "number", example: 10 },
                prepaidCheckdate: { type: "string", example: "112325" },
                totalFreight: { type: "number", example: 0 },
                salesOrderNo: { type: "number", example: 12059 },
                srn: { type: "number", example: 1 },
                carrierId: { type: "string", example: "000000" },
                vendorPaymentTerms: { type: "number", example: 0 },
                processType: { type: "string", example: "NORMAL" },
                discountDueDate: { type: "string", example: "112325" },
                extendedDiscountDueDate: { type: "string", example: "112325" },
                invoiceNo: { type: "string", example: "1001" },
              },
            },
            detailItems: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  isDeleted: { type: "string", example: "N" },
                  companyNo: { type: "number", example: 10 },
                  entryNo: { type: "number", example: 19042 },
                  entrySequence: { type: "number", example: 1 },
                  vendorNo: { type: "number", example: 1001 },
                  lineCompanyNo: { type: "number", example: 10 },
                  lineGlNo: { type: "number", example: 11230024 },
                  lineDesc: { type: "string", example: "Office Supplies" },
                  lineAmount: { type: "number", example: 100000 },
                  discountAmount: { type: "number", example: 0 },
                  discountPercentage: { type: "number", example: 0 },
                  inventoryItem: { type: "string", example: "SUP001" },
                  quantity: { type: "number", example: 1 },
                  jobNo: { type: "string", example: "JOB001" },
                  jobCostCode: { type: "string", example: "COST001" },
                  jobCostType: { type: "string", example: "L" },
                  jobCostQuantity: { type: "number", example: 1 },
                  gallons: { type: "number", example: 0 },
                  receiptNo: { type: "number", example: 0 },
                  openClosed: { type: "string", example: "O" },
                  poLineNo: { type: "number", example: 1 },
                  productAmount: { type: "number", example: 100000 },
                  freightAmount: { type: "number", example: 0 },
                  poNo: { type: "string", example: "PO001" },
                },
              },
            },
          },
        },
      },
    },
  } as ApiResponseOptions,
};

export const submitVoucher = {
  path: "/account-payable/voucher/entry/submit",
  method: "POST",
  operation: {
    summary: "Upsert a voucher with header and details",
    description:
      "Creates a new voucher or updates an existing one with header and associated details using upsert logic. If entryNo is provided, updates the existing voucher; otherwise creates a new one. Uses Sequelize upsert method for efficient database operations.",
    operationId: "submitVoucher",
    tags: ["Voucher"],
    metaData: {
      accessRights: ["account-payable::voucher::entry::submit::create", "account-payable::voucher::entry::submit::update"],
    },
  } as ApiOperationOptions,
  body: {
    schema: {
      type: "object",
      required: ["header", "details"],
      properties: {
        header: {
          type: "object",
          required: [
            "invoiceNo",
            "invoiceDate",
            "invoiceAmount",
            "apGlNo",
            "bankGl",
            "companyNo",
            "entryNo",
            "vendorNo",
            "processType",
          ],
          properties: {
            isDeleted: { type: "string", example: "N" },
            companyNo: { type: "number", example: 10 },
            entryNo: { type: "number", example: 19042 },
            entrySequence: { type: "number", example: 1 },
            vendorNo: { type: "number", example: 1001 },
            canceledVoucher: { type: "number", example: 0 },
            apGlNo: { type: "number", example: 11230024 },
            invoiceDesc: { type: "string", example: "Office Supplies" },
            invoiceDate: { type: "string", example: "112325" },
            dueDate: { type: "string", example: "112325" },
            singleCheck: { type: "string", example: "Y" },
            holdCode: { type: "string", example: "N" },
            holdDesc: { type: "string", example: "No Hold" },
            prepaidCode: { type: "string", example: "N" },
            prepaidCheckNo: { type: "number", example: 0 },
            vendorName: { type: "string", example: "Vendor Name" },
            vendorAdd1: { type: "string", example: "Address 1" },
            vendorAdd2: { type: "string", example: "Address 2" },
            vendorAdd3: { type: "string", example: "" },
            vendorAdd4: { type: "string", example: "" },
            bankGl: { type: "number", example: 11230024 },
            invoiceAmount: { type: "number", example: 100000 },
            retentionGl: { type: "number", example: 11230024 },
            retentionPct: { type: "number", example: 10 },
            prepaidCheckdate: { type: "string", example: "112325" },
            totalFreight: { type: "number", example: 0 },
            salesOrderNo: { type: "number", example: 12059 },
            srn: { type: "number", example: 1 },
            carrierId: { type: "string", example: "000000" },
            vendorPaymentTerms: { type: "number", example: 0 },
            processType: { type: "string", example: "NORMAL" },
            discountDueDate: { type: "string", example: "20240415" },
            extendedDiscountDueDate: { type: "string", example: "20240416" },
            invoiceNo: { type: "string", example: "1001" },
          },
        },
        details: {
          type: "array",
          items: {
            type: "object",
            required: ["companyNo", "lineGlNo", "productAmount"],
            properties: {
              isDeleted: { type: "string", example: "N" },
              companyNo: { type: "number", example: 10 },
              entryNo: { type: "number", example: 19042 },
              entrySequence: { type: "number", example: 1 },
              vendorNo: { type: "number", example: 1001 },
              lineCompanyNo: { type: "number", example: 10 },
              lineGlNo: { type: "number", example: 11230024 },
              lineDesc: { type: "string", example: "Office Supplies" },
              lineAmount: { type: "number", example: 100000 },
              discountAmount: { type: "number", example: 0 },
              discountPercentage: { type: "number", example: 0 },
              inventoryItem: { type: "string", example: "SUP001" },
              quantity: { type: "number", example: 1 },
              jobNo: { type: "string", example: "JOB001" },
              jobCostCode: { type: "string", example: "COST001" },
              jobCostType: { type: "string", example: "L" },
              jobCostQuantity: { type: "number", example: 1 },
              gallons: { type: "number", example: 0 },
              receiptNo: { type: "number", example: 0 },
              openClosed: { type: "string", example: "O" },
              poLineNo: { type: "number", example: 1 },
              productAmount: { type: "number", example: 100000 },
              freightAmount: { type: "number", example: 0 },
              poNo: { type: "string", example: "PO001" },
            },
          },
        },
      },
    },
  } as ApiBodyOptions,
  response: {
    schema: {
      type: "object",
      properties: {
        items: {
          type: "object",
          properties: {
            header: {
              type: "object",
              properties: {
                isDeleted: { type: "string", example: "N" },
                companyNo: { type: "number", example: 10 },
                entryNo: { type: "number", example: 19042 },
                entrySequence: { type: "number", example: 1 },
                vendorNo: { type: "number", example: 1001 },
                canceledVoucher: { type: "number", example: 0 },
                apGlNo: { type: "number", example: 11230024 },
                invoiceDesc: { type: "string", example: "Office Supplies" },
                invoiceDate: { type: "string", example: "20240315" },
                dueDate: { type: "string", example: "20240415" },
                singleCheck: { type: "string", example: "Y" },
                holdCode: { type: "string", example: "N" },
                holdDesc: { type: "string", example: "No Hold" },
                prepaidCode: { type: "string", example: "N" },
                prepaidCheckNo: { type: "number", example: 0 },
                vendorName: { type: "string", example: "Vendor Name" },
                vendorAdd1: { type: "string", example: "Address 1" },
                vendorAdd2: { type: "string", example: "Address 2" },
                vendorAdd3: { type: "string", example: "" },
                vendorAdd4: { type: "string", example: "" },
                bankGl: { type: "number", example: 11230024 },
                invoiceAmount: { type: "number", example: 100000 },
                retentionGl: { type: "number", example: 11230024 },
                retentionPct: { type: "number", example: 10 },
                prepaidCheckdate: { type: "number", example: 20240316 },
                totalFreight: { type: "number", example: 0 },
                salesOrderNo: { type: "number", example: 12059 },
                srn: { type: "number", example: 1 },
                carrierId: { type: "string", example: "000000" },
                vendorPaymentTerms: { type: "number", example: 0 },
                processType: { type: "string", example: "NORMAL" },
                discountDueDate: { type: "string", example: "20240415" },
                extendedDiscountDueDate: {
                  type: "string",
                  example: "20240416",
                },
                invoiceNo: { type: "string", example: "1001" },
              },
            },
            details: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  isDeleted: { type: "string", example: "N" },
                  companyNo: { type: "number", example: 10 },
                  entryNo: { type: "number", example: 19042 },
                  entrySequence: { type: "number", example: 1 },
                  vendorNo: { type: "number", example: 1001 },
                  lineCompanyNo: { type: "number", example: 10 },
                  lineGlNo: { type: "number", example: 11230024 },
                  lineDesc: { type: "string", example: "Office Supplies" },
                  lineAmount: { type: "number", example: 100000 },
                  discountAmount: { type: "number", example: 0 },
                  discountPercentage: { type: "number", example: 0 },
                  inventoryItem: { type: "string", example: "SUP001" },
                  quantity: { type: "number", example: 1 },
                  jobNo: { type: "string", example: "JOB001" },
                  jobCostCode: { type: "string", example: "COST001" },
                  jobCostType: { type: "string", example: "L" },
                  jobCostQuantity: { type: "number", example: 1 },
                  gallons: { type: "number", example: 0 },
                  receiptNo: { type: "number", example: 0 },
                  openClosed: { type: "string", example: "O" },
                  poLineNo: { type: "number", example: 1 },
                  productAmount: { type: "number", example: 100000 },
                  freightAmount: { type: "number", example: 0 },
                  poNo: { type: "string", example: "PO001" },
                },
              },
            },
          },
        },
      },
    },
  } as ApiResponseOptions,
};

export const submitHeaderValidation = {
  path: "/account-payable/voucher/header-validation",
  method: "POST",
  operation: {
    summary: "Create or Update Voucher Header Validation",
    operationId: "submitHeaderValidation",
    tags: ["Voucher"],
    metaData: {
      accessRights: ["account-payable::voucher::header-validation::create", "account-payable::voucher::header-validation::update"],
    },
  } as ApiOperationOptions,
  body: {
    schema: {
      type: "object",
      properties: {
        invoiceNo: { type: "string", example: "22420" },
        invoiceDate: { type: "string", example: "111121" },
        dueDate: { type: "string", example: "" },
        discountDueDate: { type: "string", example: "" },
        invoiceAmount: { type: "number", example: 150050 },
        apGlNo: { type: "number", example: 12010001 },
        bankGl: { type: "number", example: 11000001 },
        invoiceDesc: { type: "string", example: "Office Supplies" },
        totalFreight: { type: "number", example: 20075 },
        retentionGl: { type: "number", example: 20075 },
        singleCheck: { type: "string", example: "" },
        holdCode: { type: "string", example: "H" },
        holdDesc: { type: "string", example: "Payment Hold" },
        salesOrderNo: { type: "number", example: 0 },
        srn: { type: "number", example: 0 },
        companyNo: { type: "number", example: 10 },
        entryNo: { type: "number", example: 81293 },
        vendorNo: { type: "number", example: 122339 },
        processType: { type: "string", example: "NORMAL" },
        prepaidCode: { type: "string", example: "P" },
        prepaidCheckNo: { type: "number", example: 123456 },
        prepaidCheckdate: { type: "number", example: 112525 },
      },
      required: [
        "invoiceNo",
        "invoiceDate",
        "invoiceAmount",
        "apGlNo",
        "bankGl",
        "companyNo",
        "entryNo",
        "vendorNo",
      ],
    },
  } as ApiBodyOptions,
  response: {
    status: 400,
    description: "Validation failed",
    schema: {
      type: "object",
      properties: {
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          details: {
            type: "array",
            properties: {
              field: { type: "string", example: "Entry no" },
              code: { type: "string", example: "INVALID_FORMAT" },
              message: { type: "string", example: "Field is not formatted" },
            },
          },
        },
      },
    },
  } as ApiResponseOptions,
  additionalResponses: {
    "400": { description: "Error while submitting header data" },
  },
};

export const getVoucherConfig = {
  path: "/account-payable/voucher/config",
  method: "GET",
  operation: {
    summary: "Get voucher configuration",
    operationId: "getVoucherConfig",
    tags: ["Voucher"],
    metaData: {
      accessRights: ["account-payable::voucher::config::read"],
    },
  } as ApiOperationOptions,
  queries: [
    {
      name: "companyNo",
      type: Number,
      required: true,
      description: "Company Number",
    },
    {
      name: "vendorNo",
      type: Number,
      required: true,
      description: "Vendor Number",
    },
  ],
  response: {
    status: 200,
    description: "Voucher configuration retrieved successfully",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "object",
          properties: {
            company: { type: "object" },
            vendor: { type: "object" },
            lineDiscountPercentage: { type: "string", example: "2%" },
          },
          required: ["company", "vendor"],
        },
      },
      required: ["items"],
    },
  } as ApiResponseOptions,
};

export const softDeleteVoucher = {
  path: "/account-payable/voucher/voucher",
  method: "DELETE",
  operation: {
    summary: "Soft delete a voucher",
    operationId: "softDeleteVoucher",
    tags: ["Voucher"],
    metaData: {
      accessRights: ["account-payable::voucher::voucher::delete"],
    },
  } as ApiOperationOptions,
  response: {
    status: 200,
    description: "Voucher deleted successfully",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: {
              type: "string",
              example:
                "Voucher with entry number 41742, company number 10, vendor number 2, invoice number 1001 has been deleted successfully",
            },
          },
          required: ["success", "message"],
        },
      },
    },
  },
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            entryNo: { type: "number", example: 41742 },
            companyNo: { type: "number", example: 10 },
            vendorNo: { type: "number", example: 2 },
            invoiceNo: { type: "string", example: "1001" },
          },
          required: ["entryNo", "companyNo", "vendorNo", "invoiceNo"],
        },
      },
    },
  },
};

export const getGlMaster = {
  path: "/account-payable/voucher/gl-master",
  method: "GET",
  operation: {
    summary: "Get GL master details",
    operationId: "getGlMaster",
    tags: ["Voucher"],
    metaData: {
      accessRights: ["account-payable::voucher::gl-master::read"],
    },
  } as ApiOperationOptions,
  queries: [
    {
      name: "companyNo",
      type: Number,
      required: true,
      description: "Company Number",
    },
    {
      name: "glNo",
      type: Number,
      required: true,
      description:
        "GL Account Number (8 digits: first 6 digits are account number, last 2 digits are sub-account number)",
      example: 12010001,
    },
  ],
  response: {
    status: 200,
    description: "GL master details retrieved successfully",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "object",
          properties: {
            isDeleted: { type: "string" },
            companyNo: { type: "number" },
            accountNo: { type: "number" },
            subAccountNo: { type: "number" },
            accountType: { type: "string" },
            description: { type: "string" },
            accountCategory: { type: "string" },
            statementType: { type: "string" },
            statementLine: { type: "number" },
            drBalanceForward: { type: "number" },
            crBalanceForward: { type: "number" },
            specialAccount: { type: "string" },
            keyApGal: { type: "string" },
            productCode: { type: "string" },
            glType: { type: "string" },
            poRequired: { type: "string" },
          },
        },
      },
      required: ["items"],
    },
  } as ApiResponseOptions,
};

export const uploadCsv = {
  path: "/account-payable/voucher/flexi/upload",
  method: "POST",
  operation: {
    summary: "Upload Voucher CSV",
    description:
      "Uploads a CSV file (Flexi, SOGAS, etc), splits into batches, processes via BullMQ and returns summary.",
    operationId: "uploadCsv",
    tags: ["Voucher"],
    metaData: {
      accessRights: ["account-payable::voucher::flexi::upload::create", "account-payable::voucher::flexi::upload::update"],
    },
  } as ApiOperationOptions,
  body: {
    required: true,
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
    description: "CSV file to upload.",
  } as ApiBodyOptions,
  response: {
    status: 200,
    description: "CSV accepted, split into batches, processing started.",
  },
};

export const uploadSogasCsv = {
  path: "/account-payable/voucher/sogas/upload",
  method: "POST",
  operation: {
    summary: "Upload SOGAS Voucher CSV",
    description:
      "Uploads a SOGAS CSV file (regular or tax), splits into batches, processes via BullMQ and returns summary. Use the subType query parameter to specify 'regular' or 'tax'.",
    operationId: "uploadSogasCsv",
    tags: ["Voucher"],
    parameters: [
      {
        name: "subType",
        in: "query",
        required: true,
        schema: {
          type: "string",
          enum: ["regular", "tax"],
        },
        description: "SOGAS subtype: regular or tax",
      },
    ],
    metaData: {
      accessRights: ["account-payable::voucher::sogas::upload::create", "account-payable::voucher::sogas::upload::update"],
    },
  } as ApiOperationOptions,
  body: {
    required: true,
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
    description: "SOGAS CSV file to upload.",
  } as ApiBodyOptions,
  response: {
    status: 200,
    description: "SOGAS CSV accepted, split into batches, processing started.",
  },
};

export const getSogasEntry = {
  path: "/account-payable/voucher/sogas/entries",
  method: "GET",
  operation: {
    summary: "Get SOGAS Voucher Entry Grid Data",
    operationId: "getSogasEntry",
    tags: ["Voucher"],
    metaData: {
      accessRights: ["account-payable::voucher::sogas::entries::read"],
    },
  } as ApiOperationOptions,
  queries: [
    {
      name: "companyNo",
      type: Number,
      required: false,
      description: "Company Number (defaults to 10)",
    } as ApiQueryOptions,
    {
      name: "vendorNo",
      type: Number,
      required: false,
      description: "Vendor Number",
    } as ApiQueryOptions,
    {
      name: "entryNo",
      type: Number,
      required: false,
      description: "Entry Number",
    } as ApiQueryOptions,
    {
      name: "current_page",
      type: Number,
      required: false,
      description: "Page Number",
    } as ApiQueryOptions,
    {
      name: "items_per_page",
      type: Number,
      required: false,
      description: "Limit per Page",
    } as ApiQueryOptions,
    {
      name: "sortBy",
      type: String,
      required: false,
      description: "Sort By",
    } as ApiQueryOptions,
    {
      name: "sortOrder",
      type: String,
      required: false,
      description: "Sort Order asc or desc",
    } as ApiQueryOptions,
  ],
  response: {
    status: 200,
    description: "SOGAS voucher data found successfully",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              processType: { type: "string", example: "SOGAS" },
              entryNo: { type: "number", example: 41741 },
              invoiceNo: { type: "string", example: "ABC123" },
              invoiceAmount: { type: "number", example: 2443500 },
              invoiceDate: { type: "string", example: "02/22/04" },
              dueDate: { type: "string", example: "02/22/04" },
              discountDueDate: { type: "string", example: "02/22/04" },
              holdDesc: { type: "string", example: "123" },
              companyNo: { type: "number", example: 10 },
              vendorNo: { type: "number", example: 22204 },
              vendorName: { type: "string", example: "ABSG CONSULTING" },
            },
            required: [
              "processType",
              "entryNo",
              "invoiceNo",
              "companyNo",
              "vendorNo",
              "vendorName",
              "invoiceAmount",
              "invoiceDate",
              "dueDate",
              "discountDueDate",
              "holdDesc",
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
};

export const getFlexiEntry = {
  path: "/account-payable/voucher/flexi/entries",
  method: "GET",
  operation: {
    summary: "Get Flexi Entries Grid Data",
    operationId: "getFlexiEntry",
    tags: ["Voucher"],
    metaData: {
      accessRights: ["account-payable::voucher::flexi::entries::read"],
    },
  } as ApiOperationOptions,
  queries: [
    {
      name: "companyNo",
      type: Number,
      required: false,
      description: "Company Number",
    } as ApiQueryOptions,
    {
      name: "vendorNo",
      type: Number,
      required: false,
      description: "Vendor Number",
    } as ApiQueryOptions,
    {
      name: "entryNo",
      type: Number,
      required: false,
      description: "Entry Number",
    } as ApiQueryOptions,
    {
      name: "current_page",
      type: Number,
      required: false,
      description: "Page Number",
    } as ApiQueryOptions,
    {
      name: "items_per_page",
      type: Number,
      required: false,
      description: "Limit per Page",
    } as ApiQueryOptions,
    {
      name: "sortBy",
      type: String,
      required: false,
      description: "Sort By",
    } as ApiQueryOptions,
    {
      name: "sortOrder",
      type: String,
      required: false,
      description: "Sort Order asc or desc",
    } as ApiQueryOptions,
  ],
  response: {
    status: 200,
    description: "Flexi data found successfully",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              processType: { type: "string", example: "FLEXI" },
              entryNo: { type: "number", example: 41741 },
              invoiceNo: { type: "string", example: "ABC123" },
              invoiceAmount: { type: "number", example: 2443500 },
              invoiceDate: { type: "string", example: "02/22/04" },
              dueDate: { type: "string", example: "02/22/04" },
              discountDueDate: { type: "string", example: "02/22/04" },
              holdDesc: { type: "string", example: "123" },
              companyNo: { type: "number", example: 22204 },
              vendorNo: { type: "number", example: 22204 },
              vendorName: { type: "string", example: "ABSG CONSULTING" },
            },
            required: [
              "processType",
              "entryNo",
              "invoiceNo",
              "companyNo",
              "vendorNo",
              "vendorName",
              "invoiceAmount",
              "invoiceDate",
              "dueDate",
              "discountDueDate",
              "holdDesc",
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
};

export const getCarrierInvoices = {
  path: "/account-payable/voucher/paper/batch-entries",
  method: "GET",
  operation: {
    summary: "Get a paginated list of carrier invoices",
    operationId: "getCarrierInvoices",
    tags: ["Voucher"],
    metaData: {
      accessRights: ["account-payable::voucher::paper::batch-entries::read"],
    },
  } as ApiOperationOptions,
  queries: [
    {
      name: "companyNo",
      type: Number,
      required: true,
      description: "Company Number",
    } as ApiQueryOptions,
    {
      name: "current_page",
      type: Number,
      required: false,
      description: "Page Number",
    } as ApiQueryOptions,
    {
      name: "items_per_page",
      type: Number,
      required: false,
      description: "Limit per Page",
    } as ApiQueryOptions,
    {
      name: "sortBy",
      type: String,
      required: false,
      description: "Sort By",
    } as ApiQueryOptions,
    {
      name: "sortOrder",
      type: String,
      required: false,
      description: "Sort Order asc or desc",
    } as ApiQueryOptions,
    {
      name: "processType",
      type: String,
      required: true,
      description: "Process Type",
    } as ApiQueryOptions,
  ],
  response: {
    status: 200,
    description: "A paginated list of carrier invoices",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              carrierId: { type: "string", example: "APPA" },
              carrierInvoiceNo: { type: "string", example: "24601" },
              ordShipDate: { type: "string", example: "2025-04-29" },
              invoiceType: { type: "string", example: "P" },
              ourOrderNo: { type: "number", example: "363822" },
              shippingReferenceNo: { type: "number", example: 1 },
              invoiceAmount: { type: "number", example: 1373.50 },
            },
            required: [
              "carrierId",
              "carrierInvoice",
              "ordShipDate",
              "invType",
              "orderNo",
              "shpRef",
              "invoiceAmount"
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
};

export const getPaperEntry = {
  path: "/account-payable/voucher/paper/entries",
  method: "GET",
  operation: {
    summary: "Get Paper Voucher Entry Grid Data",
    operationId: "getPaperEntry",
    tags: ["Voucher"],
    metaData: {
      accessRights: ["account-payable::voucher::paper::entries::read"],
    },
  } as ApiOperationOptions,
  queries: [
    {
      name: "companyNo",
      type: Number,
      required: false,
      description: "Company Number (defaults to 10)",
    } as ApiQueryOptions,
    {
      name: "current_page",
      type: Number,
      required: false,
      description: "Page Number",
    } as ApiQueryOptions,
    {
      name: "items_per_page",
      type: Number,
      required: false,
      description: "Limit per Page",
    } as ApiQueryOptions,
    {
      name: "sortBy",
      type: String,
      required: false,
      description: "Sort By",
    } as ApiQueryOptions,
    {
      name: "sortOrder",
      type: String,
      required: false,
      description: "Sort Order asc or desc",
    } as ApiQueryOptions,
    {
      name: "processType",
      type: String,
      required: false,
      description: "Process Type (e.g., PAPER)",
    } as ApiQueryOptions,
  ],
  response: {
    status: 200,
    description: "Paper voucher data found successfully",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              invoiceNo: { type: "string", example: "ABC123" },
              invoiceDate: { type: "string", example: "02/22/04" },
              invoiceAmount: { type: "number", example: 2443500 },
              discountDueDate: { type: "string", example: "02/22/04" },
              vendorName: { type: "string", example: "ABSG CONSULTING" },
              vendorNo: { type: "number", example: 1001 },
              salesOrderNo: { type: "number", example: 101010 },
              companyNo: { type: "number", example: 10 },
              processType: { type: "string", example: "NORMAL" },
            },
            required: [
              "invoiceNo",
              "invoiceDate",
              "invoiceAmount",
              "discountDueDate",
              "vendorName",
              "vendorNo",
              "salesOrderNo",
              "companyNo",
              "processType",
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
};

export const paperBatchCreate = {
  path: "/account-payable/voucher/paper/batch",
  method: "POST",
  operation: {
    summary: "Create a batch of Paper voucher transactions",
    operationId: "paperBatchCreate",
    tags: ["Voucher"],
    metaData: {
      accessRights: ["account-payable::voucher::paper::batch::create", "account-payable::voucher::paper::batch::update"],
    },
  } as ApiOperationOptions,

  body: {
    description: "Array of Paper voucher invoices to process as a batch. Each object should match the structure of data from getCarrierInvoice API.",
    required: true,
    schema: {
      type: "object",
      properties: {
        invoices: {
          type: "array",
          items: {
            type: "object",
            properties: {
              carrierId: { type: "string", example: "APPA" },
              carrierInvoiceNo: { type: "string", example: "24601" },
              ordShipDate: { type: "string", format: "date", example: "110125" },
              invoiceType: { type: "string", example: "P" }, 
              ourOrderNo: { type: "number", example: 363822 }, 
              shippingReferenceNo: { type: "number", example: 1 },
              invoiceAmount: { type: "number", example: 1373.50 },
              companyNo: { type: "number", example: 10 },
              invoiceDate: { type: "string", format: "date", example: "042925", description: "Invoice Date" },
            },
            required: [
              "carrierId",
              "carrierInvoiceNo",
              "ordShipDate",
              "invoiceType",
              "ourOrderNo",
              "shippingReferenceNo",
              "invoiceAmount",
              "companyNo",
              "invoiceDate",
            ],
          },
        },
      },
      required: ["invoices"],
    },
  } as ApiBodyOptions,
  response: {
    schema: {
      type: "object",
      properties: {
        items: {
          type: "object",
          properties: {
            message: { type: "string", example: "Paper batch create accepted, split into 2 batches" },
            batchId: { type: "string", example: "P-1712345678901-uuid" },
            totalGroups: { type: "number", example: 10 },
            totalBatches: { type: "number", example: 2 },
            parentJobId: { type: "string", example: "job-id-1" },
            childJobIds: {
              type: "array",
              items: { type: "string", example: "job-id-2" },
            },
            groups: {
              type: "array",
              items: { type: "object" },
            },
          },
        },
      },
    },
  } as ApiResponseOptions,
};

export const getLmsEntry = {
  path: "/account-payable/voucher/lms/entries",
  method: "GET",
  operation: {
    summary: "Get LMS Voucher Entry Grid Data",
    operationId: "getLmsEntry",
    tags: ["Voucher"],
    metaData: {
      accessRights: ["account-payable::voucher::lms::entries::read"],
    },
  } as ApiOperationOptions,
  queries: [
    {
      name: "companyNo",
      type: Number,
      required: false,
      description: "Company Number (defaults to 10)",
    } as ApiQueryOptions,
    {
      name: "current_page",
      type: Number,
      required: false,
      description: "Page Number",
    } as ApiQueryOptions,
    {
      name: "items_per_page",
      type: Number,
      required: false,
      description: "Limit per Page",
    } as ApiQueryOptions,
    {
      name: "sortBy",
      type: String,
      required: false,
      description: "Sort By",
    } as ApiQueryOptions,
    {
      name: "sortOrder",
      type: String,
      required: false,
      description: "Sort Order asc or desc",
    } as ApiQueryOptions,
    {
      name: "processType",
      type: String,
      required: false,
      description: "Process Type (e.g., LMS)",
    } as ApiQueryOptions,
  ],
  response: {
    status: 200,
    description: "LMS voucher data found successfully",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              invoiceNo: { type: "string", example: "ABC123" },
              invoiceDate: { type: "string", example: "02/22/04" },
              invoiceAmount: { type: "number", example: 2443500 },
              discountDueDate: { type: "string", example: "02/22/04" },
              vendorName: { type: "string", example: "ABSG CONSULTING" },
              vendorNo: { type: "number", example: 1001 },
              salesOrderNo: { type: "number", example: 101010 },
              companyNo: { type: "number", example: 10 },
              processType: { type: "string", example: "NORMAL" },
            },
            required: [
              "invoiceNo",
              "invoiceDate",
              "invoiceAmount",
              "discountDueDate",
              "vendorName",
              "vendorNo",
              "salesOrderNo",
              "companyNo",
              "processType",
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
};

export const getLmsCarrierInvoices = {
  path: "/account-payable/voucher/lms/batch-entries",
  method: "GET",
  operation: {
    summary: "Get a paginated list of Lmscarrier invoices",
    operationId: "getLmsCarrierInvoices",
    tags: ["Voucher"],
    metaData: {
      accessRights: ["account-payable::voucher::lms::batch-entries::read"],
    },
  } as ApiOperationOptions,
  queries: [
    {
      name: "companyNo",
      type: Number,
      required: true,
      description: "Company Number",
    } as ApiQueryOptions,
    {
      name: "current_page",
      type: Number,
      required: false,
      description: "Page Number",
    } as ApiQueryOptions,
    {
      name: "items_per_page",
      type: Number,
      required: false,
      description: "Limit per Page",
    } as ApiQueryOptions,
    {
      name: "sortBy",
      type: String,
      required: false,
      description: "Sort By",
    } as ApiQueryOptions,
    {
      name: "sortOrder",
      type: String,
      required: false,
      description: "Sort Order asc or desc",
    } as ApiQueryOptions,
    {
      name: "processType",
      type: String,
      required: true,
      description: "Process Type",
    } as ApiQueryOptions,
  ],
  response: {
    status: 200,
    description: "A paginated list of carrier invoices",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              carrierId: { type: "string", example: "APPA" },
              carrierInvoiceNo: { type: "string", example: "24601" },
              ordShipDate: { type: "string", example: "2025-04-29" },
              invoiceType: { type: "string", example: "P" },
              ourOrderNo: { type: "number", example: "363822" },
              shippingReferenceNo: { type: "number", example: 1 },
              invoiceAmount: { type: "number", example: 1373.50 },
            },
            required: [
              "carrierId",
              "carrierInvoice",
              "ordShipDate",
              "invType",
              "orderNo",
              "shpRef",
              "invoiceAmount"
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
};


export const lmsBatchCreate = {
  path: "/account-payable/voucher/lms/batch",
  method: "POST",
  operation: {
    summary: "Create a batch of lms voucher transactions",
    operationId: "lmsBatchCreate",
    tags: ["Voucher"],
    metaData: {
      accessRights: ["account-payable::voucher::lms::batch::create", "account-payable::voucher::lms::batch::update"],
    },
  } as ApiOperationOptions,

  body: {
    description: "Array of Lms voucher invoices to process as a batch. Each object should match the structure of data from getCarrierInvoice API.",
    required: true,
    schema: {
      type: "object",
      properties: {
        invoices: {
          type: "array",
          items: {
            type: "object",
            properties: {
              carrierId: { type: "string", example: "APPA" },
              carrierInvoice: { type: "string", example: "24601" },
              orderShipDate: { type: "string", format: "date", example: "110125" },
              invoiceType: { type: "string", example: "P" }, 
              ourOrderNo: { type: "number", example: 363822 }, 
              shippingReferenceNo: { type: "number", example: 1 },
              invoiceAmount: { type: "number", example: 1373.50 },
              companyNo: { type: "number", example: 10 },
              invoiceDate: { type: "string", format: "date", example: "042925", description: "Invoice Date" },
            },
            required: [
              "carrierId",
              "carrierInvoice",
              "orderShipDate",
              "invoiceType",
              "ourOrderNo",
              "shippingReferenceNo",
              "invoiceAmount",
              "companyNo",
              "invoiceDate",
            ],
          },
        },
      },
      required: ["invoices"],
    },
  } as ApiBodyOptions,
  response: {
    schema: {
      type: "object",
      properties: {
        items: {
          type: "object",
          properties:{
            message: { type: "string", example: "Lms batch create accepted, split into 2 batches" },
            uploadId: { type: "string", example: "P-1712345678901-uuid" },
            totalGroups: { type: "number", example: 10 },
            totalBatches: { type: "number", example: 2 },
            parentJobId: { type: "string", example: "job-id-1" },
            childJobIds: {
              type: "array",
              items: { type: "string", example: "job-id-2" },
            },
            groups: {
              type: "array",
              items: { type: "object" },
            },
          },
        },
      },
    },
  } as ApiResponseOptions,
};

export const softDeleteVoucherDetail = {
  path: "/account-payable/voucher/detail",
  method: "POST",
  operation: {
    summary: "Soft delete a voucher detail",
    description: "Marks a specific voucher detail as deleted by setting isDeleted to 'D' based on the provided composite key",
    operationId: "softDeleteVoucherDetail",
    tags: ["Voucher"],
    metaData: {
      accessRights: ["account-payable::voucher::detail::create", "account-payable::voucher::detail::update"],
    },
  } as ApiOperationOptions,
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
              description: "Company number"
            },
            vendorNo: {
              type: "number",
              example: 1001,
              description: "Vendor number"
            },
            entryNo: {
              type: "number",
              example: 12345,
              description: "Entry number"
            },
            entrySequenceNo: {
              type: "number",
              example: 1,
              description: "Entry sequence number"
            },
          },
          required: ["companyNo", "vendorNo", "entryNo", "entrySequenceNo"],
        },
      },
    },
  },
  response: {
    status: 200,
    description: "Voucher detail soft deleted successfully",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
              description: "Indicates if the operation was successful"
            },
            message: {
              type: "string",
              example: "Successfully soft deleted voucher detail - Company: 10, Vendor: 1001, Entry: 12345, Sequence: 1",
              description: "Detailed message about the operation result"
            },
          },
          required: ["success", "message"],
        },
      },
    },
  },
  responses: {
    "400": {
      description: "Bad Request - Invalid input data",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              statusCode: { type: "number", example: 400 },
              message: {
                type: "array",
                items: { type: "string" },
                example: ["companyNo should not be empty", "vendorNo must be a number"],
              },
              error: { type: "string", example: "Bad Request" },
            },
          },
        },
      },
    },
    "404": {
      description: "Not Found - Voucher detail not found or already deleted",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              message: {
                type: "string",
                example: "Voucher detail not found or already deleted - Company: 10, Vendor: 1001, Entry: 12345, Sequence: 1",
              },
            },
          },
        },
      },
    },
    "500": {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              statusCode: { type: "number", example: 500 },
              message: { type: "string", example: "Internal server error" },
            },
          },
        },
      },
    },
  },
};

export const cacheData = {
  path: "/account-payable/voucher/cache",
  method: "POST",
  operation: {
    summary: "Cache all data for a company",
    description:
      "Pre-cache all vendors, APDATE records, GL Master accounts, GSTable records, and FreightInvoice records for a company to improve performance for CSV upload processing. This endpoint efficiently loads all vendor, APDATE, GL Master, GSTable (General System), and FreightInvoice data into Redis cache using bulk operations to avoid performance issues during CSV processing.",
    operationId: "cacheData",
    tags: ["Voucher"],
    metaData: {
      accessRights: ["account-payable::voucher::cache::create", "account-payable::voucher::cache::update"],
    },
  } as ApiOperationOptions,
  body: {
    schema: {
      type: "object",
      required: ["companyNo"],
      properties: {
        companyNo: {
          type: "number",
          example: 10,
          description: "Company number to cache vendors for",
        },
      },
    },
  } as ApiBodyOptions,
  response: {
    status: 200,
    description: "Data cached successfully",
    schema: {
      type: "object",
      properties: {
        success: {
          type: "boolean",
          example: true,
          description: "Indicates if the operation was successful",
        },
        message: {
          type: "string",
          example: "Operation completed successfully",
          description: "Success message",
        },
        data: {
          type: "object",
          properties: {
            vendors: {
              type: "object",
              properties: {
                totalVendors: {
                  type: "number",
                  example: 1500,
                  description: "Total number of vendors found for the company",
                },
                cachedVendors: {
                  type: "number",
                  example: 1500,
                  description: "Number of vendors successfully cached",
                },
                duration: {
                  type: "number",
                  example: 2500,
                  description: "Time taken to cache vendors in milliseconds",
                },
              },
              required: ["totalVendors", "cachedVendors", "duration"],
            },
            apdate: {
              type: "object",
              properties: {
                totalApdates: {
                  type: "number",
                  example: 3500,
                  description:
                    "Total number of APDATE records found for the company",
                },
                cachedApdates: {
                  type: "number",
                  example: 3500,
                  description: "Number of APDATE records successfully cached",
                },
                duration: {
                  type: "number",
                  example: 1200,
                  description:
                    "Time taken to cache APDATE records in milliseconds",
                },
              },
              required: ["totalApdates", "cachedApdates", "duration"],
            },
            glmaster: {
              type: "object",
              properties: {
                totalGlMasters: {
                  type: "string",
                  example: "All active GL accounts",
                  description:
                    "Total number of GL Master records found for the company",
                },
                cachedGlMasters: {
                  type: "string",
                  example: "All active GL accounts",
                  description:
                    "Number of GL Master records successfully cached",
                },
                duration: {
                  type: "number",
                  example: 800,
                  description:
                    "Time taken to cache GL Master records in milliseconds",
                },
                success: {
                  type: "boolean",
                  example: true,
                  description: "Indicates if GL Master caching was successful",
                },
              },
              required: [
                "totalGlMasters",
                "cachedGlMasters",
                "duration",
                "success",
              ],
            },
            totalDuration: {
              type: "number",
              example: 3700,
              description:
                "Total time taken for the entire caching operation in milliseconds",
            },
            summary: {
              type: "object",
              properties: {
                totalVendors: { type: "number", example: 1500 },
                cachedVendors: { type: "number", example: 1500 },
                totalApdates: { type: "number", example: 3500 },
                cachedApdates: { type: "number", example: 3500 },
                totalGlMasters: {
                  type: "string",
                  example: "All active GL accounts",
                },
                cachedGlMasters: {
                  type: "string",
                  example: "All active GL accounts",
                },
                message: {
                  type: "string",
                  example:
                    "Successfully cached 1500 vendors, 3500 APDATE records, All active GL accounts GL Master records, All system configurations GSTable records, and All freight invoices FreightInvoice records for company 10",
                },
              },
            },
          },
          required: [
            "vendors",
            "apdate",
            "glmaster",
            "totalDuration",
            "summary",
          ],
        },
      },
      required: ["success", "message", "data"],
    },
  } as ApiResponseOptions,
};

export const getVoucherSummary = {
  path: "/account-payable/voucher/summary",
  method: "GET",
  operation: {
    summary: "Get voucher summary by company and process type",
    operationId: "getVoucherSummary",
    tags: ["Voucher"],
    metaData: {
      accessRights: ["account-payable::voucher::summary::read"],
    },
  } as ApiOperationOptions,
  queries: [
    {
      name: "companyNo",
      type: Number,
      required: true,
      description: "Company Number (only 10 allowed)",
    } as ApiQueryOptions,
    {
      name: "processType",
      enum: Object.values(PROCESS_TYPE_ENUM),
      enumName: "PROCESS_TYPE_ENUM",
      required: true,
      description: "Process Type (NORMAL, ARGLMS, PAPER, FLEXI, SOGAS)",
    } as ApiQueryOptions,
  ],
  response: {
    status: 200,
    description: "Voucher summary",
    schema: {
      type: "object",
      properties: {
        totalAmount: { type: "string", example: "$1,234.56" },
        countE: { type: "number", example: 2 },
        countW: { type: "number", example: 1 },
        countS: { type: "number", example: 5 },
        totalUploads: { type: "number", example: 8 },
      },
      required: ["totalAmount", "countE", "countW", "countS", "totalUploads"],
    },
  } as ApiResponseOptions,
};

export const getCalculatedDueDates = {
  path: "/account-payable/voucher/calculate-due-dates",
  method: "GET",
  operation: {
    summary: "Calculate due dates for a voucher",
    operationId: "getCalculatedDueDates",
    tags: ["Voucher"],
    metaData: {
      accessRights: ["account-payable::voucher::calculate-due-dates::read"],
    },
  } as ApiOperationOptions,
  queries: [
    {
      name: "companyNo",
      type: Number,
      required: true,
      description: "Company Number",
    },
    {
      name: "vendorNo",
      type: Number,
      required: true,
      description: "Vendor Number",
    },
    {
      name: "invoiceDate",
      type: String,
      required: true,
      description:
        "Invoice Date",
      example: "101525",
    },
  ],
  response: {
    status: 200,
    description: "Calculated due dates retrieved successfully",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "object",
          properties: {
            companyNo: { type: "number" },
            vendorNo: { type: "number" },
            invoiceDate: { type: "string" },
            dueDate: { type: "string" },
            discountDueDate: { type: "string" }, 
          },
        },
      },
      required: ["items"],
    },
  } as ApiResponseOptions,
};
 