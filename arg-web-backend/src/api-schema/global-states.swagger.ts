import {
  ApiOperationOptions,
  ApiResponseOptions,
  ApiParamOptions,
  ApiQueryOptions,
  ApiBodyOptions,
} from "@nestjs/swagger";
import { REPORT_USECASES, REPORT_USECASES_ENUM } from "@src/shared/config/generate-report-config";
import {
  DropdownTypeEnum,
  DropdownDbTypeEnum,
} from "@src/shared/utils/dropdown";

export const GetReportDetails = {
  path: "/global-states/reports/:name",
  method: "GET",
  operation: {
    summary: "Get report details by report name",
    operationId: "GetReportDetails",
    tags: ["GlobalStates"],
    metaData: {
      accessRights: ["global-states::reports::name::read"],
    },
  } as ApiOperationOptions,
  parameters: [
    {
      name: "name",
      in: "path",
      required: true,
      schema: {
        type: "string",
        example: "Open-Payables-By-Due-Date",
      },
      description: "The kebab case name of the report",
      style: "simple",
    } as ApiParamOptions,
  ],
  response: {
    status: 200,
    description: "Successfully retrieved spinfo records",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              reportName: {
                type: "string",
                example: "Open-Payables-By-Due-Date",
              },
              fieldKey: { type: "string", example: "Environment" },
              fieldDescription: { type: "string", example: "Environment" },
              fieldComponent: { type: "string", example: "string" },
              fieldDataType: { type: "string", example: "string" },
              fieldSequence: { type: "number", example: 1 },
              variableType: { type: "string", example: "in" },
              xmlMetadata: {
                type: "string",
                example: "api call",
                nullable: true,
              },
              storedProcedureName: { type: "string", example: "AP700PRC" },
              spSequence: { type: "number", example: 1 },
              fieldLength: { type: "string", example: "4", nullable: true },
            },
          },
        },
      },
    },
  } as ApiResponseOptions,
};

export const GenerateReport = {
  path: "/global-states/reports",
  method: "POST",
  operation: {
    summary: "Execute stored procedure dynamically",
    operationId: "GenerateReport",
    tags: ["GlobalStates"],
    metaData: {
      accessRights: ["global-states::reports::create", "global-states::reports::update"],
    },
  } as ApiOperationOptions,
  parameters: [
    {
      name: "name",
      in: "path",
      required: true,
      schema: {
        type: "string",
        example: "Open-Payables-By-Due-Date",
      },
      description: "The kebab case name of the report",
      style: "simple",
    } as ApiParamOptions,
  ],
  response: {
    status: 200,
    description: "Successfully executed stored procedure",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "object",
          properties: {
            message: {
              type: "array",
              items: { type: "string" },
              example: ["Open Payables report generated                    "],
            },
          },
        },
      },
    },
  } as ApiResponseOptions,
};

export const GetAllReportNames = {
  path: "/global-states/reports",
  method: "GET",
  operation: {
    summary: "Get all available report names",
    operationId: "GetAllReportNames",
    tags: ["GlobalStates"],
    metaData: {
      accessRights: ["global-states::reports::read"],
    },
  } as ApiOperationOptions,
  response: {
    status: 200,
    description: "Successfully retrieved report names",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "array",
          items: { type: "string" },
          example: [
            "Open-Payables-By-Due-Date",
            "Vendor-Aged-Report",
            "Company-Summary",
          ],
        },
      },
    },
  } as ApiResponseOptions,
};

export const GetDropdownData = {
  path: "/global-states/list-options",
  method: "GET",
  operation: {
    summary: "Get generic dropdown data for various entities",
    operationId: "GetDropdownData",
    tags: ["GlobalStates"],
    metaData: {
      accessRights: ["global-states::list-options::read"],
    },
  } as ApiOperationOptions,
  parameters: [
    {
      name: "type",
      in: "query",
      required: true,
      schema: {
        type: "string",
        enum: [
          ...Object.values(DropdownTypeEnum),
          ...Object.values(DropdownDbTypeEnum),
        ],
        example: DropdownTypeEnum.PROCESS_TYPES,
      },
      description:
        "Type of dropdown data to retrieve (includes voucher types, process types, form types, etc.)",
      style: "form",
    } as ApiParamOptions,
    {
      name: "search",
      in: "query",
      required: false,
      schema: {
        type: "string",
        example: "search term",
      },
      description: "Optional search term to filter results",
      style: "form",
    } as ApiParamOptions,
    {
      name: "current_page",
      in: "query",
      required: false,
      schema: {
        type: "number",
        example: 1,
      },
      description: "Page number for pagination",
      style: "form",
    } as ApiParamOptions,
    {
      name: "items_per_page",
      in: "query",
      required: false,
      schema: {
        type: "number",
        example: 10,
      },
      description: "Number of items per page",
      style: "form",
    } as ApiParamOptions,
    {
      name: "companyNo",
      in: "query",
      required: false,
      schema: {
        type: "number",
        example: 10,
      },
      description: "Optional company number for company-specific dropdowns",
      style: "form",
    } as ApiParamOptions,
  ],
  response: {
    status: 200,
    description: "Successfully retrieved dropdown data",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", example: "1" },
              value: { type: "string", example: "Normal" },
              label: { type: "string", example: "Normal" },
            },
          },
          example: [
            { id: "H", value: "H", label: "Hold" },
            { id: "A", value: "A", label: "ACH" },
            { id: "W", value: "W", label: "Wire Transfer" },
          ],
        },
        pagination: {
          type: "object",
          properties: {
            total_items: { type: "number", example: 5 },
            current_page: { type: "number", example: 1 },
            items_per_page: { type: "number", example: 10 },
            total_pages: { type: "number", example: 1 },
          },
        },
      },
    },
  } as ApiResponseOptions,
};


export const GetGeneralSystemCompany = {
  path: "/global-states/general-system-company/:companyNo",
  method: "GET",
  operation: {
    summary: "Get General System Company by companyNo",
    operationId: "GetGeneralSystemCompany",
    tags: ["GlobalStates"],
    metaData: {
      accessRights: ["global-states::general-system-company::companyNo::read"],
    },
  } as ApiOperationOptions,
  parameters: [
    {
      name: "companyNo",
      in: "path",
      required: true,
      schema: { type: "number", example: 1 },
    } as ApiParamOptions,
  ],
  response: {
    status: 200,
    description: "Get General System Company",
    schema: {
      type: "object",
      properties: {
        fixedAssets: { type: "boolean", example: true },
        orderEntryInvoicing: { type: "boolean", example: true },
        salesAnalysis: { type: "boolean", example: true },
        inventory: { type: "boolean", example: true },
        purchaseOrder: { type: "boolean", example: true },
        billOfMaterial: { type: "boolean", example: true },
        jobShop: { type: "boolean", example: true },
        jobCost: { type: "boolean", example: true },
        filler1: { type: "string", example: "filler1" },
        multiWarehouseYn: { type: "boolean", example: true },
        thirteenAccountingPeriodsYn: { type: "boolean", example: true },
        fractionalQtyActive: { type: "boolean", example: true },
        apPostOverrideCode: { type: "string", example: "apPostOverrideCode" },
        arPostOverrideCode: { type: "string", example: "arPostOverrideCode" },
        faPostOverrideCode: { type: "string", example: "faPostOverrideCode" },
        glPostOverrideCode: { type: "string", example: "glPostOverrideCode" },
        defaultCompanyNo: { type: "number", example: 1 },
        filler: { type: "string", example: "filler" },
      },
    },
  } as ApiResponseOptions,
};

export const getAuthCodeChecker = {
  path: "/global-states/general-system-company/:companyNo/auth-code",
  method: "GET",
  operation: {
    summary: "Check Auth Code for Company No",
    operationId: "getAuthCodeChecker",
    tags: ["GlobalStates"],
    metaData: {
      accessRights: ["global-states::general-system-company::companyNo::read"],
    },
  } as ApiOperationOptions,
  parameters: [
    {
      name: "companyNo",
      in: "path",
      required: true,
      schema: { type: "number", example: 1 },
    } as ApiParamOptions,
  ],
  queries: [
    {
      name: "authCode",
      required: true,
      type: Number,
      description: "526267",
    } as ApiQueryOptions,
  ],
  response: {
    status: 200,
    description: "Get General System Company",
    schema: {
      type: "object",
      properties: {
        fixedAssets: { type: "boolean", example: true },
        orderEntryInvoicing: { type: "boolean", example: true },
        salesAnalysis: { type: "boolean", example: true },
        inventory: { type: "boolean", example: true },
        purchaseOrder: { type: "boolean", example: true },
        billOfMaterial: { type: "boolean", example: true },
        jobShop: { type: "boolean", example: true },
        jobCost: { type: "boolean", example: true },
        filler1: { type: "string", example: "filler1" },
        multiWarehouseYn: { type: "boolean", example: true },
        thirteenAccountingPeriodsYn: { type: "boolean", example: true },
        fractionalQtyActive: { type: "boolean", example: true },
        apPostOverrideCode: { type: "string", example: "apPostOverrideCode" },
        arPostOverrideCode: { type: "string", example: "arPostOverrideCode" },
        faPostOverrideCode: { type: "string", example: "faPostOverrideCode" },
        glPostOverrideCode: { type: "string", example: "glPostOverrideCode" },
        defaultCompanyNo: { type: "number", example: 1 },
        filler: { type: "string", example: "filler" },
      },
    },
  } as ApiResponseOptions,
};


export const generateAuthCode = {
  path: "/global-states/general-system-company/:companyNo",
  method: "POST",
  operation: {
    summary: "Generate Auth Code for Company No",
    operationId: "generateAuthCode",
    tags: ["GlobalStates"],
    metaData: {
      accessRights: ["global-states::general-system-company::companyNo::create", "global-states::general-system-company::companyNo::update"],
    },
  } as ApiOperationOptions,
  parameters: [
    {
      name: "companyNo",
      in: "path",
      required: true,
      schema: { type: "number", example: 1 },
    } as ApiParamOptions,
  ],
  response: {
    status: 200,
    description: "Generate Auth Code",
    schema: {
      type: "object",
      properties: {
        fixedAssets: { type: "boolean", example: true },
        orderEntryInvoicing: { type: "boolean", example: true },
        salesAnalysis: { type: "boolean", example: true },
        inventory: { type: "boolean", example: true },
        purchaseOrder: { type: "boolean", example: true },
        billOfMaterial: { type: "boolean", example: true },
        jobShop: { type: "boolean", example: true },
        jobCost: { type: "boolean", example: true },
        filler1: { type: "string", example: "filler1" },
        multiWarehouseYn: { type: "boolean", example: true },
        thirteenAccountingPeriodsYn: { type: "boolean", example: true },
        fractionalQtyActive: { type: "boolean", example: true },
        apPostOverrideCode: { type: "string", example: "apPostOverrideCode" },
        arPostOverrideCode: { type: "string", example: "arPostOverrideCode" },
        faPostOverrideCode: { type: "string", example: "faPostOverrideCode" },
        glPostOverrideCode: { type: "string", example: "glPostOverrideCode" },
        defaultCompanyNo: { type: "number", example: 1 },
        filler: { type: "string", example: "filler" },
      },
    },
  } as ApiResponseOptions,
};

export const generateReportFiles = {
  path: "/global-states/reports/generate",
  method: "POST",
  operation: {
    summary: "Generate Report Files",
    description: "Generate report file(s) for the given company and usecase",
    operationId: "generateReportFiles",
    tags: ["GlobalStates"],
    metaData: {
      accessRights: ["global-states::reports::generate::create", "global-states::reports::generate::update"],
    },
  } as ApiOperationOptions,

  body: {
    schema: {
      type: "object",
      properties: {
        companyNo: { type: "number", example: 10 },
        usecase: {
          type: "string",
          enum: REPORT_USECASES_ENUM,
          description: "Select the report usecase",
        },
        parameters: {
          type: "object",
          description: "Optional parameters depending on usecase",
          additionalProperties: true,
        },
      },
      required: ["companyNo", "usecase"],
    },
    examples: {
      PaymentSelectionExample: {
        summary: REPORT_USECASES.paymentSelection.usecase,
        value: {
          companyNo: 10,
          usecase: REPORT_USECASES.paymentSelection.usecase,
        },
      },
      Pa1099YearEndPataxExample: {
        summary: REPORT_USECASES.pa1099YearEndPatax.usecase,
        value: {
          companyNo: 10,
          usecase: REPORT_USECASES.pa1099YearEndPatax.usecase,
          parameters: {
            formType: "M",
            reportYear: "2024",
          },
        },
      },
      IrsTaxExample: {
        summary: REPORT_USECASES.irsTax.usecase,
        value: {
          companyNo: 10,
          usecase: REPORT_USECASES.irsTax.usecase,
          parameters: {
            formType: "M",
            reportYear: "2024",
          },
        },
      },
    },
  } as ApiBodyOptions,

  response: {
    status: 200,
    description: "Report file(s) generated successfully",
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Report file(s) generated successfully",
        },
        files: {
          type: "array",
          items: {
            type: "object",
            properties: {
              fileName: {
                type: "string",
                example: "AP-Nacha-ACH-Creation_20250827.xlsx",
              },
              filePath: {
                type: "string",
                example:
                  "http://server:5001/reports/AP-Nacha-ACH-Creation_20250827.xlsx",
              },
            },
          },
        },
      },
    },
  } as ApiResponseOptions,
};



