import {
  ApiOperationOptions,
  ApiResponseOptions,
  ApiQueryOptions,
} from "@nestjs/swagger";

export const companyMaintenance = {
  path: "/ap-maintenance/company",
  method: "GET",
  operation: {
    summary: "Get APCONT table data by company number",
    description:
      "Retrieves company configuration data from APCONT table. Returns all company settings including GL accounts, next numbers, and configuration flags.",
    operationId: "companyMaintenance",
    tags: ["AP Maintenance"],
    metaData: {
      accessRights: ["ap-maintenance::company::read"],
    },
  } as ApiOperationOptions,
  queries: [
    {
      name: "companyNo",
      required: true,
      type: Number,
      description: "Company number (1-99)",
      example: 10,
    },
  ] as ApiQueryOptions[],
  response: {
    status: 200,
    description: "Successfully retrieved APCONT data",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "object",
          properties: {
            companyNo: {
              type: "number",
              example: 10,
              description: "Company number from APCONT.ACCONO",
            },
            companyName: {
              type: "string",
              example: "ABC Company",
              description: "Company name from APCONT.ACNAME",
            },
            companyApGlNo: {
              type: "number",
              example: 20000001,
              description: "AP GL account number from APCONT.ACAPGL",
            },
            companyBankGlNo: {
              type: "number",
              example: 10000001,
              description: "Bank GL account number from APCONT.ACBKGL",
            },
            companyDiscountsGlNo: {
              type: "number",
              example: 50000001,
              description: "Discounts GL account number from APCONT.ACDSGL",
            },
            companyIntercoGlNo: {
              type: "number",
              example: 30000001,
              description: "Intercompany GL account number from APCONT.ACICGL",
            },
            companyNextPjJrnlNo: {
              type: "number",
              example: 1001,
              description: "Next Purchase Journal number from APCONT.ACJRNL",
            },
            companyNextCdJrnlNo: {
              type: "number",
              example: 1001,
              description:
                "Next Cash Disbursement Journal number from APCONT.ACCDJR",
            },
            companyNextCheckNo: {
              type: "number",
              example: 10001,
              description: "Next check number from APCONT.ACCKNO",
            },
            companyNextEntryNo: {
              type: "number",
              example: 10001,
              description: "Next entry number from APCONT.ACNXTE",
            },
            companyNextVoucherNo: {
              type: "number",
              example: 10001,
              description: "Next voucher number from APCONT.ACNXVO",
            },
            companyPreEdChks: {
              type: "string",
              example: "Y",
              description: "Pre-edit checks flag from APCONT.ACPREC",
            },
            companyJobCostAct: {
              type: "string",
              example: "Y",
              description: "Job cost active flag from APCONT.ACJCYN",
            },
            companyRetentionGlNo: {
              type: "number",
              example: 40000001,
              description: "Retention GL account number from APCONT.ACRTGL",
            },
            companyPoActive: {
              type: "string",
              example: "Y",
              description: "Purchase Order active flag from APCONT.ACPOYN",
            },
            companyEmployeeExpenseGlNo: {
              type: "number",
              example: 60000001,
              description:
                "Employee expense GL account number from APCONT.ACEEGL",
            },
            companyNextEeJrnlNo: {
              type: "number",
              example: 1001,
              description:
                "Next Employee Expense Journal number from APCONT.ACEENL",
            },
            companyFiller: {
              type: "string",
              example: "",
              description: "Filler field from APCONT.ACF001",
            },
          },
          required: [
            "companyNo",
            "companyName",
            "companyApGlNo",
            "companyBankGlNo",
            "companyDiscountsGlNo",
            "companyIntercoGlNo",
            "companyNextPjJrnlNo",
            "companyNextCdJrnlNo",
            "companyNextCheckNo",
            "companyNextEntryNo",
            "companyNextVoucherNo",
            "companyPreEdChks",
            "companyJobCostAct",
            "companyRetentionGlNo",
            "companyPoActive",
            "companyEmployeeExpenseGlNo",
            "companyNextEeJrnlNo",
            "companyFiller",
          ],
        },
      },
      required: ["items"],
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
                    field: { type: "string", example: "companyNo" },
                    code: { type: "string", example: "INVALID_RANGE" },
                    message: {
                      type: "string",
                      example: "Company number must be between 1 and 99",
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
      description: "Company not found",
      schema: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              code: { type: "string", example: "NOT_FOUND" },
              message: {
                type: "string",
                example: "Company not found with number 10",
              },
              details: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    field: { type: "string", example: "companyNo" },
                    code: { type: "string", example: "NOT_FOUND" },
                    message: {
                      type: "string",
                      example: "Company not found with number 10",
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

export const updateCompanyMaintenance = {
  path: "/ap-maintenance/company",
  method: "POST",
  operation: {
    summary: "Update company data",
    description:
      "Updates company configuration data in APCONT table. All fields are required.",
    operationId: "updateCompanyMaintenance",
    tags: ["AP Maintenance"],
    metaData: {
      accessRights: ["ap-maintenance::company::create", "ap-maintenance::company::update"],
    },
  } as ApiOperationOptions,
  body: {
    schema: {
      type: "object",
      required: [
        "companyNo",
        "companyName",
        "companyApGlNo",
        "companyBankGlNo",
        "companyDiscountsGlNo",
        "companyIntercoGlNo",
        "companyNextPjJrnlNo",
        "companyNextCdJrnlNo",
        "companyNextCheckNo",
        "companyNextEntryNo",
        "companyNextVoucherNo",
        "companyPreEdChks",
        "companyJobCostAct",
        "companyRetentionGlNo",
        "companyPoActive",
        "companyEmployeeExpenseGlNo",
        "companyNextEeJrnlNo",
        "companyFiller",
      ],
      properties: {
        companyNo: {
          type: "number",
          example: 10,
          minimum: 1,
          maximum: 99,
          description: "Company number (1-99)",
        },
        companyName: {
          type: "string",
          example: "ABC Company",
          minLength: 1,
          maxLength: 30,
          description: "Company name",
        },
        companyApGlNo: {
          type: "number",
          example: 20000001,
          minimum: 1,
          description: "AP GL account number",
        },
        companyBankGlNo: {
          type: "number",
          example: 10000001,
          minimum: 1,
          description: "Bank GL account number",
        },
        companyDiscountsGlNo: {
          type: "number",
          example: 50000001,
          minimum: 1,
          description: "Discounts GL account number",
        },
        companyIntercoGlNo: {
          type: "number",
          example: 30000001,
          minimum: 1,
          description: "Intercompany GL account number",
        },
        companyNextPjJrnlNo: {
          type: "number",
          example: 1001,
          minimum: 1,
          description: "Next Purchase Journal number",
        },
        companyNextCdJrnlNo: {
          type: "number",
          example: 1001,
          minimum: 1,
          description: "Next Cash Disbursement Journal number",
        },
        companyNextCheckNo: {
          type: "number",
          example: 10001,
          minimum: 1,
          description: "Next check number",
        },
        companyNextEntryNo: {
          type: "number",
          example: 10001,
          minimum: 1,
          description: "Next entry number",
        },
        companyNextVoucherNo: {
          type: "number",
          example: 10001,
          minimum: 1,
          description: "Next voucher number",
        },
        companyPreEdChks: {
          type: "string",
          example: "Y",
          minLength: 1,
          maxLength: 1,
          enum: ["Y", "N"],
          description: "Pre-edit checks flag",
        },
        companyJobCostAct: {
          type: "string",
          example: "Y",
          minLength: 1,
          maxLength: 1,
          enum: ["Y", "N"],
          description: "Job cost active flag",
        },
        companyRetentionGlNo: {
          type: "number",
          example: 40000001,
          minimum: 1,
          description: "Retention GL account number",
        },
        companyPoActive: {
          type: "string",
          example: "Y",
          minLength: 1,
          maxLength: 1,
          enum: ["Y", "N"],
          description: "Purchase Order active flag",
        },
        companyEmployeeExpenseGlNo: {
          type: "number",
          example: 60000001,
          minimum: 1,
          description: "Employee expense GL account number",
        },
        companyNextEeJrnlNo: {
          type: "number",
          example: 1001,
          minimum: 1,
          description: "Next Employee Expense Journal number",
        },
        companyFiller: {
          type: "string",
          example: "",
          maxLength: 255,
          description: "Filler field",
        },
      },
    },
  },
  response: {
    status: 200,
    description: "Successfully updated company data",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "object",
          properties: {
            companyNo: {
              type: "number",
              example: 10,
              description: "Company number from APCONT.ACCONO",
            },
            companyName: {
              type: "string",
              example: "ABC Company",
              description: "Company name from APCONT.ACNAME",
            },
            companyApGlNo: {
              type: "number",
              example: 20000001,
              description: "AP GL account number from APCONT.ACAPGL",
            },
            companyBankGlNo: {
              type: "number",
              example: 10000001,
              description: "Bank GL account number from APCONT.ACBKGL",
            },
            companyDiscountsGlNo: {
              type: "number",
              example: 50000001,
              description: "Discounts GL account number from APCONT.ACDSGL",
            },
            companyIntercoGlNo: {
              type: "number",
              example: 30000001,
              description: "Intercompany GL account number from APCONT.ACICGL",
            },
            companyNextPjJrnlNo: {
              type: "number",
              example: 1001,
              description: "Next Purchase Journal number from APCONT.ACJRNL",
            },
            companyNextCdJrnlNo: {
              type: "number",
              example: 1001,
              description:
                "Next Cash Disbursement Journal number from APCONT.ACCDJR",
            },
            companyNextCheckNo: {
              type: "number",
              example: 10001,
              description: "Next check number from APCONT.ACCKNO",
            },
            companyNextEntryNo: {
              type: "number",
              example: 10001,
              description: "Next entry number from APCONT.ACNXTE",
            },
            companyNextVoucherNo: {
              type: "number",
              example: 10001,
              description: "Next voucher number from APCONT.ACNXVO",
            },
            companyPreEdChks: {
              type: "string",
              example: "Y",
              description: "Pre-edit checks flag from APCONT.ACPREC",
            },
            companyJobCostAct: {
              type: "string",
              example: "Y",
              description: "Job cost active flag from APCONT.ACJCYN",
            },
            companyRetentionGlNo: {
              type: "number",
              example: 40000001,
              description: "Retention GL account number from APCONT.ACRTGL",
            },
            companyPoActive: {
              type: "string",
              example: "Y",
              description: "Purchase Order active flag from APCONT.ACPOYN",
            },
            companyEmployeeExpenseGlNo: {
              type: "number",
              example: 60000001,
              description:
                "Employee expense GL account number from APCONT.ACEEGL",
            },
            companyNextEeJrnlNo: {
              type: "number",
              example: 1001,
              description:
                "Next Employee Expense Journal number from APCONT.ACEENL",
            },
            companyFiller: {
              type: "string",
              example: "",
              description: "Filler field from APCONT.ACF001",
            },
          },
          required: [
            "companyNo",
            "companyName",
            "companyApGlNo",
            "companyBankGlNo",
            "companyDiscountsGlNo",
            "companyIntercoGlNo",
            "companyNextPjJrnlNo",
            "companyNextCdJrnlNo",
            "companyNextCheckNo",
            "companyNextEntryNo",
            "companyNextVoucherNo",
            "companyPreEdChks",
            "companyJobCostAct",
            "companyRetentionGlNo",
            "companyPoActive",
            "companyEmployeeExpenseGlNo",
            "companyNextEeJrnlNo",
            "companyFiller",
          ],
        },
      },
      required: ["items"],
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
                    field: { type: "string", example: "companyNo" },
                    code: { type: "string", example: "INVALID_RANGE" },
                    message: {
                      type: "string",
                      example: "Company number must be between 1 and 99",
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
      description: "Company not found",
      schema: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              code: { type: "string", example: "NOT_FOUND" },
              message: {
                type: "string",
                example: "Company not found with number 10",
              },
              details: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    field: { type: "string", example: "companyNo" },
                    code: { type: "string", example: "NOT_FOUND" },
                    message: {
                      type: "string",
                      example: "Company not found with number 10",
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
