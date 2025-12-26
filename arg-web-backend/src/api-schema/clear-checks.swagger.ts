import {
  ApiOperationOptions,
  ApiBodyOptions,
  ApiResponseOptions,
} from "@nestjs/swagger";

export const uploadClearChecksCsv = {
  path: "/clear-checks/upload",
  method: "POST",
  operation: {
    summary: "Upload Clear Checks CSV",
    description:
      "Uploads a Clear Checks CSV/XLSX file, splits into batches, processes via BullMQ and returns summary.",
    operationId: "uploadClearChecks",
    tags: ["ClearChecks"],
    metaData: {
      accessRights: ["clear-checks::upload::create", "clear-checks::upload::update"],
    },
  } as ApiOperationOptions,
  body: {
    required: true,
    schema: {
      type: "object",
      properties: {
        file: { type: "string", format: "binary" },
      },
    },
    description: "Clear Checks file to upload.",
  } as ApiBodyOptions,
  response: {
    status: 200,
    description: "File accepted, split into batches, processing started.",
  } as ApiResponseOptions,
};

export const validateSingleCheck = {
  path: "/clear-checks/validate",
  method: "POST",
  operation: {
    summary: "Validate Single Check",
    description:
      "Validates a single check against the database for clearing. Checks existence, amount match, date validity, and processing status.",
    operationId: "validateSingleCheck",
    tags: ["ClearChecks"],
    metaData: {
      accessRights: ["clear-checks::validate::create", "clear-checks::validate::update"],
    },
  } as ApiOperationOptions,
  body: {
    required: true,
    schema: {
      type: "object",
      properties: {
        checkNo: {
          type: "string",
          description: "Check number to validate",
          example: "210091",
        },
        checkAmount: {
          type: "number",
          description: "Check amount to validate",
          example: 11.55,
        },
        checkDate: {
          type: "string",
          description: "Check clear date in MMDDYY format",
          example: "061025",
          pattern: "^(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])([0-9]{2})$",
        },
      },
      required: ["checkNo", "checkAmount", "checkDate"],
    },
    description:
      "Check validation data including check number, amount, and clear date.",
  } as ApiBodyOptions,
  response: {
    status: 200,
    description: "Check validation completed successfully.",
    schema: {
      type: "object",
      properties: {
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            checkNo: { type: "string" },
            checkAmount: { type: "number" },
            checkDate: { type: "string" },
            isValid: { type: "boolean" },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  message: { type: "string" },
                  code: { type: "string" },
                },
              },
            },
            warnings: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  message: { type: "string" },
                  code: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  } as ApiResponseOptions,
};

export const processMultipleChecks = {
  path: "/clear-checks/process",
  method: "POST",
  operation: {
    summary: "Process Multiple Checks",
    description:
      "Processes multiple checks by updating their status to RECONCILED (R), AMCLDT (MMDDYY), and AMCLD8 (YYYYMMDD) fields with the provided clear dates. No validation is performed - checks are processed directly.",
    operationId: "processMultipleChecks",
    tags: ["ClearChecks"],
    metaData: {
      accessRights: ["clear-checks::process::create", "clear-checks::process::update"],
    },
  } as ApiOperationOptions,
  body: {
    required: true,
    schema: {
      type: "object",
      properties: {
        checks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              checkNo: {
                type: "string",
                description: "Check number to process",
                example: "210091",
              },
              checkAmount: {
                type: "number",
                description: "Check amount (for reference only, not validated)",
                example: 11.55,
              },
              checkDate: {
                type: "string",
                description: "Check clear date in MMDDYY format",
                example: "061025",
                pattern: "^(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])([0-9]{2})$",
              },
            },
            required: ["checkNo", "checkAmount", "checkDate"],
          },
          minItems: 1,
          description: "Array of checks to process",
        },
      },
      required: ["checks"],
    },
    description:
      "Multiple check processing data including check numbers, amounts, and clear dates. No validation is performed.",
  } as ApiBodyOptions,
  response: {
    status: 200,
    description: "Multiple checks processing completed successfully.",
    schema: {
      type: "object",
      properties: {
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            message: { type: "string" },
            totalProcessed: { type: "number" },
            successful: { type: "number" },
            failed: { type: "number" },
            results: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  checkNo: { type: "string" },
                  checkAmount: { type: "number" },
                  checkDate: { type: "string" },
                  message: { type: "string" },
                  errors: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        field: { type: "string" },
                        message: { type: "string" },
                        code: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  } as ApiResponseOptions,
};
