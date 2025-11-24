import {
  ApiOperationOptions,
  ApiResponseOptions,
  ApiQueryOptions,
} from "@nestjs/swagger";

export const getVendorsByYear = {
  path: "/ap-period-end/vendors",
  method: "GET",
  operation: {
    summary: "Get vendors by year for a company",
    description:
      "Retrieves paginated vendor data for a specific company and year using the vendor master list functionality.",
    operationId: "getVendorsByYear",
    tags: ["APPeriodEnd"],
    metaData: {
      accessRights: ["ap-period-end::vendors::read"],
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
    {
      name: "year",
      required: true,
      type: Number,
      description: "Year (2000-2100)",
      example: 2024,
    },
    {
      name: "search",
      required: false,
      type: String,
      description: "Search term for filtering results",
      example: "ABC",
    },
    {
      name: "current_page",
      required: false,
      type: Number,
      description: "Page number for pagination (default: 1)",
      example: 1,
    },
    {
      name: "items_per_page",
      required: false,
      type: Number,
      description: "Number of items per page (default: 500, max: 500)",
      example: 50,
    },
    {
      name: "sortBy",
      required: false,
      type: String,
      description: "Sort field",
      example: "vendorName",
    },
    {
      name: "sortOrder",
      required: false,
      type: String,
      description: "Sort direction (asc or desc)",
      example: "asc",
    },
  ] as ApiQueryOptions[],
  response: {
    status: 200,
    description: "Successfully retrieved vendor data",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              vendorIsDeleted: {
                type: "string",
                example: "N",
                description: "Vendor deletion status",
              },
              vendorCompanyNumber: {
                type: "number",
                example: 10,
                description: "Company number",
              },
              vendorNo: {
                type: "number",
                example: 1001,
                description: "Vendor number",
              },
              vendorName: {
                type: "string",
                example: "ABC Suppliers",
                description: "Vendor name",
              },
              vendorAdd1: {
                type: "string",
                example: "123 Main Street",
                description: "Vendor address line 1",
              },
              vendorAdd2: {
                type: "string",
                example: "Suite 100",
                description: "Vendor address line 2",
              },
              vendorAdd3: {
                type: "string",
                example: "",
                description: "Vendor address line 3",
              },
              vendorAdd4: {
                type: "string",
                example: "",
                description: "Vendor address line 4",
              },
              vendorZipCode: {
                type: "number",
                example: 12345,
                description: "Vendor zip code",
              },
              vendorExtraZip: {
                type: "number",
                example: 6789,
                description: "Vendor extra zip code",
              },
              vendorAlphaSortAbbr: {
                type: "string",
                example: "ABC",
                description: "Vendor alpha sort abbreviation",
              },
              vendorAreaCode: {
                type: "number",
                example: 555,
                description: "Vendor area code",
              },
              vendorTelephoneNo: {
                type: "number",
                example: 1234567,
                description: "Vendor telephone number",
              },
              vendorLastPaymentAmt: {
                type: "number",
                example: 5000.0,
                description: "Last payment amount",
              },
              vendorLastPaymentDate: {
                type: "number",
                example: 20241215,
                description: "Last payment date",
              },
              vendorYtdPurchases: {
                type: "number",
                example: 50000.0,
                description: "Year to date purchases",
              },
              vendorLastYearPurchases: {
                type: "number",
                example: 45000.0,
                description: "Last year purchases",
              },
              vendorMtdDiscounts: {
                type: "number",
                example: 500.0,
                description: "Month to date discounts",
              },
              vendorYtdDiscounts: {
                type: "number",
                example: 2500.0,
                description: "Year to date discounts",
              },
              vendorNameOverflow: {
                type: "string",
                example: "",
                description: "Vendor name overflow",
              },
              vendorGalRcptsRequired: {
                type: "string",
                example: "N",
                description: "GAL receipts required flag",
              },
              vendorFiller: {
                type: "string",
                example: "",
                description: "Vendor filler field",
              },
              vendorPreviousBalance: {
                type: "number",
                example: 10000.0,
                description: "Previous balance",
              },
              vendorMtdPurchases: {
                type: "number",
                example: 5000.0,
                description: "Month to date purchases",
              },
              vendorMtdPayments: {
                type: "number",
                example: 3000.0,
                description: "Month to date payments",
              },
              vendorCurrentBalance: {
                type: "number",
                example: 12000.0,
                description: "Current balance",
              },
              vendorHoldPaymentsVend: {
                type: "string",
                example: "N",
                description: "Hold payments vendor flag",
              },
              vendorSingleCheck: {
                type: "string",
                example: "N",
                description: "Single check flag",
              },
              vendorThisYrYtdPaid: {
                type: "number",
                example: 35000.0,
                description: "This year year to date paid",
              },
              vendorLastYrYtdPaid: {
                type: "number",
                example: 32000.0,
                description: "Last year year to date paid",
              },
              vendorExpenseGLSub: {
                type: "number",
                example: 5000,
                description: "Expense GL sub account",
              },
              vendorApTermsCode: {
                type: "number",
                example: 30,
                description: "AP terms code",
              },
              vendorAp1099Code: {
                type: "string",
                example: "N",
                description: "AP 1099 code",
              },
              vendorIdNumber: {
                type: "string",
                example: "12-3456789",
                description: "Vendor ID number",
              },
              vendorFirst1099BoxNumber: {
                type: "number",
                example: 0,
                description: "First 1099 box number",
              },
              vendorSecond1099BoxNumber: {
                type: "number",
                example: 0,
                description: "Second 1099 box number",
              },
              vendorSecond1099BoxAmount: {
                type: "number",
                example: 0.0,
                description: "Second 1099 box amount",
              },
              vendorLastPaymentDateAlt: {
                type: "number",
                example: 20241215,
                description: "Last payment date alternative",
              },
              vendorCarrierId: {
                type: "string",
                example: "",
                description: "Carrier ID",
              },
              vendorPayeeName1: {
                type: "string",
                example: "ABC Suppliers",
                description: "Payee name 1",
              },
              vendorPayeeName2: {
                type: "string",
                example: "",
                description: "Payee name 2",
              },
              vendorIrsNameControl: {
                type: "string",
                example: "",
                description: "IRS name control",
              },
              vendorAdpPayrollId: {
                type: "number",
                example: 0,
                description: "ADP payroll ID",
              },
              vendorAchClass: {
                type: "string",
                example: "",
                description: "ACH class",
              },
              vendorAchCheckingOrSavings: {
                type: "string",
                example: "",
                description: "ACH checking or savings",
              },
              vendorAchBankRoutingCode: {
                type: "number",
                example: 0,
                description: "ACH bank routing code",
              },
              vendorAchBankAccountNumber: {
                type: "string",
                example: "",
                description: "ACH bank account number",
              },
              vendorFirstName: {
                type: "string",
                example: "",
                description: "Vendor first name",
              },
              vendorMiddleName: {
                type: "string",
                example: "",
                description: "Vendor middle name",
              },
              vendorBusinessLastName: {
                type: "string",
                example: "",
                description: "Vendor business last name",
              },
              vendorNameSuffix: {
                type: "string",
                example: "",
                description: "Vendor name suffix",
              },
              vendorCountryCode: {
                type: "string",
                example: "US",
                description: "Vendor country code",
              },
              vendorCategoryCode: {
                type: "string",
                example: "",
                description: "Vendor category code",
              },
              vendorFiller2: {
                type: "string",
                example: "",
                description: "Vendor filler 2",
              },
            },
          },
          description: "Array of vendor objects",
        },
        count: {
          type: "number",
          example: 150,
          description: "Total number of vendors",
        },
        page: {
          type: "number",
          example: 1,
          description: "Current page number",
        },
        limit: {
          type: "number",
          example: 50,
          description: "Number of items per page",
        },
        totalPages: {
          type: "number",
          example: 3,
          description: "Total number of pages",
        },
        hasNextPage: {
          type: "boolean",
          example: true,
          description: "Whether there is a next page",
        },
        hasPrevPage: {
          type: "boolean",
          example: false,
          description: "Whether there is a previous page",
        },
      },
      required: [
        "items",
        "count",
        "page",
        "limit",
        "totalPages",
        "hasNextPage",
        "hasPrevPage",
      ],
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
      description: "Vendor data not found",
      schema: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              code: { type: "string", example: "NOT_FOUND" },
              message: {
                type: "string",
                example: "Vendor data not found",
              },
              details: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    field: { type: "string", example: "vendorList" },
                    code: { type: "string", example: "NOT_FOUND" },
                    message: {
                      type: "string",
                      example: "Vendor data not found",
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

export const vendorYearEndProcess = {
  path: "/ap-period-end/vendor-year-end-process",
  method: "POST",
  operation: {
    summary: "Process vendor year-end for a company",
    description:
      "Creates and populates vendor year-end table for a specific company and year. This process handles the vendor month/year end functionality by creating a new table with the year suffix and copying all vendor data from the source table.",
    operationId: "vendorYearEndProcess",
    tags: ["APPeriodEnd"],
    metaData: {
      accessRights: ["ap-period-end::vendor-year-end-process::create", "ap-period-end::vendor-year-end-process::update"],
    },
  } as ApiOperationOptions,
  requestBody: {
    type: "object",
    properties: {
      companyNo: {
        type: "number",
        example: 10,
        description: "Company Number",
        required: true,
      },
      year: {
        type: "string",
        example: "2024",
        description: "Year for vendor year-end process",
        required: true,
      },
      clearYTD: {
        type: "boolean",
        example: false,
        description: "Clear Year to Date Fields",
        required: false,
      },
    },
    required: ["companyNo", "year"],
  },
  response: {
    status: 200,
    description: "Successfully processed vendor year-end",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example:
                "Vendor year-end process completed successfully for company 10, year 2024",
              description:
                "Message describing the result of the year-end process",
            },
            tableName: {
              type: "string",
              example: "DATADEV.VENDOR_2024",
              description: "Name of the table created or processed",
              nullable: true,
            },
            dataCopied: {
              type: "number",
              example: 100,
              description: "Number of data rows copied",
              nullable: true,
            },
          },
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
                    field: { type: "number", example: 10 },
                    code: { type: "string", example: "IS_NOT_EMPTY" },
                    message: {
                      type: "string",
                      example: "Company number is required",
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
                example:
                  "An unexpected error occurred during year-end processing",
              },
            },
          },
        },
      },
    },
  ] as ApiResponseOptions[],
};

export const getYearEndProcessMenuReviewFiles = {
  path: "/ap-period-end/year-end-process-menu/review-files",
  method: "GET",
  operation: {
    summary: "Get review files for a company",
    description:
      "Retrieves paginated review files data for a specific company and review type using the review files functionality.",
    operationId: "getYearEndProcessMenuReviewFiles",
    tags: ["APPeriodEnd"],
    metaData: {
      accessRights: ["ap-period-end::year-end-process-menu::review-files::read"],
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
    {
      name: "reportType",
      required: false,
      type: "string",
      example: "example report type",
    }
  ] as ApiQueryOptions[],
  response: {
    status: 200,
    description: "Successfully retrieved review files",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              reportType: { type: "string", example: "example report type" },
              fileName: { type: "string", example: "example file name" },
              reportDateTime: {
                type: "string",
                example: "2025-07-25T11:15:44.835Z",
              },
              filePath: {
                type: "string",
                example: "/files/example-file-name.pdf",
              },
            },
          },
        },
        pagination: {
          type: "object",
          properties: {
            total_items: { type: "number", example: 20 },
            current_page: { type: "number", example: 1 },
            items_per_page: { type: "number", example: 10 },
            total_pages: { type: "number", example: 2 },
          },
        },
      },
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

export const getApPeriodEndReports = {
  path: "/ap-period-end/record",
  method: "GET",
  operation: {
    summary: "Get AP Period End Reports",
    description:
      "Get data for particular record format",
    operationId: "getApPeriodEndReports",
    tags: ["APPeriodEnd"],
    metaData: {
      accessRights: ["ap-period-end::record::read"],
    },
  } as ApiOperationOptions,
  queries: [
    {
      name: "tin",
      required: true,
      type: String,
      description: "",
      example: "",
    },
    {
      name: "ctl",
      required: true,
      type: String,
      description: "",
      example: "2024",
    },

  ] as ApiQueryOptions[],
  response: {
    status: 200,
    description: "Successfully retrieved vendor data",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "object",
          properties: {
            recordType: {
              type: "string",
              example: "T",
              description: "Record Type",
            },
            paymentYear: {
              type: "number",
              example: 2027,
              description: "Payment Year",
            },
            priorYearDataInd: {
              type: "string",
              example: "A",
              description: "Prior Year Data Indicator",
            },
            transmitterId: {
              type: "number",
              example: 996793061,
              description: "Transmitter ID",
            },
            transControlCode: {
              type: "string",
              example: "ABHI",
              description: "Trans Control Code",
            },
            replacementAlphaChar: {
              type: "string",
              example: "AB",
              description: "Replacement Alpha Character",
            },
            blank01: {
              type: "string",
              example: "ABHIS",
              description: "Blank",
            },
            testFileInd: {
              type: "string",
              example: "",
              description: "Test File Indicator",
            },
            foreignEntityInd: {
              type: "string",
              example: "",
              description: "Foreign Entity Indicator",
            },
            transmitterName: {
              type: "string",
              example: "AMERICAN REFINING GROUP INC",
              description: "Transmitter Name",
            },
            transmitterName2: {
              type: "string",
              example: "",
              description: "Transmitter Name 2",
            },
            companyName: {
              type: "string",
              example: "AMERICAN REFINING GROUP INC",
              description: "Company Name",
            },
            companyName2: {
              type: "string",
              example: "",
              description: "Company Name 2",
            },
            companyAddress: {
              type: "string",
              example: "55 ALPHA DRIVE WEST",
              description: "Company Address",
            },
            companyCity: {
              type: "string",
              example: "PITTSBURGH",
              description: "Company City",
            },
            companyState: {
              type: "string",
              example: "PA",
              description: "Company State",
            },
            companyZipCode: {
              type: "string",
              example: "15238",
              description: "Company Zip Code",
            },
            blank02: {
              type: "string",
              example: "",
              description: "Blank",
            },
            totalNumberOfPayees: {
              type: "number",
              example: 8,
              description: "Total Number of Payees",
            },
            contactName: {
              type: "string",
              example: "ERIC HOLMBERG",
              description: "Contact Name",
            },
            contactPhoneNumber: {
              type: "string",
              example: "8143681274",
              description: "Contact Phone Number",
            },
            contactEmail: {
              type: "string",
              example: "",
              description: "Contact Email",
            },
            blank03: {
              type: "string",
              example: "",
              description: "Blank",
            },
            sequenceNumber: {
              type: "number",
              example: 1,
              description: "Sequence Number",
            },
            blank04: {
              type: "string",
              example: "",
              description: "Blank",
            },
            vendorInd: {
              type: "string",
              example: "I",
              description: "Vendor Indicator",
            },
            blank05: {
              type: "string",
              example: "",
              description: "Blank",
            },
            blank06: {
              type: "string",
              example: "",
              description: "Blank",
            },
          },
        },
      },
      required: ["items",],
    },
  } as ApiResponseOptions,
};

export const postApPeriodEndReports = {
  path: "/ap-period-end",
  method: "POST",
  operation: {
    summary: "Get 1099 Reports",
    description:
      "Updatw the Flat files based on Record TYpe",
    operationId: "postApPeriodEndReports",
    tags: ["APPeriodEnd"],
    metaData: {
      accessRights: ["ap-period-end::create", "ap-period-end::update"],
    },
  } as ApiOperationOptions,
  Body: [
    {
      name: "tin",
      required: true,
      type: String,
      description: "",
      example: "",
    },
    {
      name: "ctl",
      required: true,
      type: String,
      description: "",
      example: "2024",
    },
    {
      name: "data",
      required: true,
      example: [
        {
          name: "recordType",
          required: true,
          type: String,
          description: "Record Type",
          example: "T",
        },
        {
          name: "paymentYear",
          required: true,
          type: Number,
          description: "Payment Year",
          example: 2027,
        },
        {
          name: "priorYearDataInd",
          required: true,
          type: String,
          description: "Prior Year Data Indicator",
          example: "A",
        },
        {
          name: "transmitterId",
          required: true,
          type: Number,
          description: "Transmitter ID",
          example: 996793061,
        },
        {
          name: "transControlCode",
          required: true,
          type: String,
          description: "Trans Control Code",
          example: "ABHI",
        },
        {
          name: "replacementAlphaChar",
          required: true,
          type: String,
          description: "Replacement Alpha Character",
          example: "AB",
        },
        {
          name: "blank01",
          required: false,
          type: String,
          description: "Blank",
          example: "ABHIS",
        },
        {
          name: "testFileInd",
          required: false,
          type: String,
          description: "Test File Indicator",
          example: "",
        },
        {
          name: "foreignEntityInd",
          required: false,
          type: String,
          description: "Foreign Entity Indicator",
          example: "",
        },
        {
          name: "transmitterName",
          required: true,
          type: String,
          description: "Transmitter Name",
          example: "AMERICAN REFINING GROUP INC",
        },
        {
          name: "transmitterName2",
          required: false,
          type: String,
          description: "Transmitter Name 2",
          example: "",
        },
        {
          name: "companyName",
          required: true,
          type: String,
          description: "Company Name",
          example: "AMERICAN REFINING GROUP INC",
        },
        {
          name: "companyName2",
          required: false,
          type: String,
          description: "Company Name 2",
          example: "",
        },
        {
          name: "companyAddress",
          required: true,
          type: String,
          description: "Company Address",
          example: "55 ALPHA DRIVE WEST",
        },
        {
          name: "companyCity",
          required: true,
          type: String,
          description: "Company City",
          example: "PITTSBURGH",
        },
        {
          name: "companyState",
          required: true,
          type: String,
          description: "Company State",
          example: "PA",
        },
        {
          name: "companyZipCode",
          required: true,
          type: String,
          description: "Company Zip Code",
          example: "15238",
        },
        {
          name: "blank02",
          required: false,
          type: String,
          description: "Blank",
          example: "",
        },
        {
          name: "totalNumberOfPayees",
          required: true,
          type: Number,
          description: "Total Number of Payees",
          example: 8,
        },
        {
          name: "contactName",
          required: true,
          type: String,
          description: "Contact Name",
          example: "ERIC HOLMBERG",
        },
        {
          name: "contactPhoneNumber",
          required: true,
          type: String,
          description: "Contact Phone Number",
          example: "8143681274",
        },
        {
          name: "contactEmail",
          required: false,
          type: String,
          description: "Contact Email",
          example: "",
        },
        {
          name: "blank03",
          required: false,
          type: String,
          description: "Blank",
          example: "",
        },
        {
          name: "sequenceNumber",
          required: true,
          type: Number,
          description: "Sequence Number",
          example: 1,
        },
        {
          name: "blank04",
          required: false,
          type: String,
          description: "Blank",
          example: "",
        },
        {
          name: "vendorInd",
          required: true,
          type: String,
          description: "Vendor Indicator",
          example: "I",
        },
        {
          name: "blank05",
          required: false,
          type: String,
          description: "Blank",
          example: "",
        },
        {
          name: "blank06",
          required: false,
          type: String,
          description: "Blank",
          example: "",
        },
      ]
    }
  ] as ApiQueryOptions,
  response: {
    status: 200,
    description: "Successfully retrieved vendor data",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "string",
          properties: {
            message: {
              type: "string",
              example: "T",
              description: "Updated Successfully",
            },
          },
        },
      },
      required: ["items",],
    },
  } as ApiResponseOptions,
}

export const getCompanyDetails = {
  path: "/ap-period-end/company",
  method: "GET",
  operation: {
    summary: "Get company details by company number",
    description:
      "Retrieves detailed company information from the company table by company number. Returns all company settings including GL accounts, next numbers, and configuration flags.",
    operationId: "getCompanyDetails",
    tags: ["APPeriodEnd"],
    metaData: {
      accessRights: ["ap-period-end::company::read"],
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
    description: "Successfully retrieved company details",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "object",
          properties: {
            companyNo: {
              type: "number",
              description: "Company number",
              example: 10,
            },
            companyName: {
              type: "string",
              description: "Company name",
              example: "ABC Company",
            },
            companyApGlNo: {
              type: "number",
              description: "Company AP GL Number",
              example: 20000001,
            },
            companyBankGlNo: {
              type: "number",
              description: "Company Bank GL Number",
              example: 10000001,
            },
            companyDiscountsGlNo: {
              type: "number",
              description: "Company Discounts GL Number",
              example: 50000001,
            },
            companyIntercoGlNo: {
              type: "number",
              description: "Company Interco GL Number",
              example: 30000001,
            },
            companyNextPjJrnlNo: {
              type: "number",
              description: "Company Next PJ Journal Number",
              example: 1001,
            },
            companyNextCdJrnlNo: {
              type: "number",
              description: "Company Next CD Journal Number",
              example: 1001,
            },
            companyNextCheckNo: {
              type: "number",
              description: "Company Next Check Number",
              example: 10001,
            },
            companyNextEntryNo: {
              type: "number",
              description: "Company Next Entry Number",
              example: 10001,
            },
            companyNextVoucherNo: {
              type: "number",
              description: "Company Next Voucher Number",
              example: 10001,
            },
            companyPreEdChks: {
              type: "string",
              description: "Company Pre-edit Checks Flag",
              example: "Y",
            },
            companyJobCostAct: {
              type: "string",
              description: "Company Job Cost Active Flag",
              example: "Y",
            },
            companyRetentionGlNo: {
              type: "number",
              description: "Company Retention GL Number",
              example: 40000001,
            },
            companyPoActive: {
              type: "string",
              description: "Company PO Active Flag",
              example: "Y",
            },
            companyEmployeeExpenseGlNo: {
              type: "number",
              description: "Company Employee Expense GL Number",
              example: 60000001,
            },
            companyNextEeJrnlNo: {
              type: "number",
              description: "Company Next EE Journal Number",
              example: 1001,
            },
            companyFiller: {
              type: "string",
              description: "Company Filler Field",
              example: "",
            },
            companyVendorNextEntryNo: {
              type: "number",
              description: "Company Vendor Next Entry Number",
              example: 10001,
            },
          },
        },
      },
    },
  } as ApiResponseOptions,
};


export const getAllApPeriodEndReports = {
  path: "/ap-period-end",
  method: "GET",
  operation: {
    summary: "Get All AP Period End Reports",
    description:
      "Get data for particular record format",
    operationId: "getAllApPeriodEndReports",
    tags: ["APPeriodEnd"],
    metaData: {
      accessRights: ["ap-period-end::read"],
    },
  } as ApiOperationOptions,
  queries: [
    {
      name: "recordType",
      required: false,
      type: String,
      description: "RecordType",
      example: 'A',
    },
    {
      name: "ctl",
      required: false,
      type: String,
      description: "Ctl No",
      example: '7389d',
    },
    {
      name: "tin",
      required: false,
      type: String,
      description: "tin No",
      example: '738hdosd',
    },
  ],
  response: {
    status: 200,
    description: "Successfully retrieved vendor data",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "object",
          properties: {
            recordType: {
              type: "string",
              example: "T",
              description: "Record Type",
            },
            ctl: {
              type: "string",
              example: "MOYE",
              description: "ctl",
            },
            tin: {
              type: "string",
              example: "173892",
              description: "tin",
            },
            firstPayeeName: {
              type: "string",
              example: "John",
              description: "firstPayeeName",
            },
          },
        },
        pagination: {
          type: "object",
          properties: {
            total_items: { type: "number", example: 20 },
            current_page: { type: "number", example: 1 },
            items_per_page: { type: "number", example: 10 },
            total_pages: { type: "number", example: 2 },
          },
        },
      },
      required: ["items",],
    },
  } as ApiResponseOptions,
};

export const softDeleteRecord = {
  path: "/ap-period-end/record",
  method: "DELETE",
  operation: {
    summary: "Soft Delete AP Period End Record",
    description: "Delete RecordB ",
    operationId: "softDeleteRecord",
    tags: ["APPeriodEnd"],
    metaData: {
      accessRights: ["ap-period-end::record::delete"],
    },
  } as ApiOperationOptions,
  queries: [
    {
      name: "tin",
      required: true,
      type: String,
      description: "",
      example: "",
    },
    {
      name: "ctl",
      required: true,
      type: String,
      description: "",
      example: "2024",
    },

  ] as ApiQueryOptions[],
  response: {
    status: 200,
    description: "Successfully Deleted RecordB",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "string",
          properties: {
            message: {
              type: "string",
              example: "T",
              description: "deleted successfully",
            },
          },
        },
      },
      required: ["items"],
    },
  } as ApiResponseOptions,
};

export const getVendorDetailsByYear = {
  path: "/ap-period-end/:year/vendors/:vendorNo",
  method: "GET",
  operation: {
    summary: "Vendor Details for Selected Year",
    operationId: "getVendorDetailsByYear",
    tags: ["APPeriodEnd"],
    metaData: {
      accessRights: ["ap-period-end::year::vendors::vendorNo::read"],
    },
  } as ApiOperationOptions,
  params: [
    {
      name: "year",
      in: "path",
      type: Number,
      required: true,
      description: "Year",
    },
    {
      name: "vendorNo",
      in: "path",
      type: Number,
      required: true,
      description: "Vendor No",
    },
  ],
  queries: [
    {
      name: "vendorCompanyNumber",
      type: Number,
      required: true,
      description: "Company Number",
    },
  ],
  response: {
    status: 200,
    description: "Get vendor details for Selected Year",
    schema: {
      type: "object",
      properties: {
        items: {
          vendorIsDeleted: { type: 'string', example: 'A' },
          vendorCompanyNumber: { type: 'number', example: 10 },
          vendorNo: { type: 'number', example: 9875 },
          vendorName: { type: 'string', example: 'Abhishek Consulting' },
          vendorAdd1: { type: 'string', example: '77 North Kendall' },
          vendorAdd2: { type: 'string', example: 'Bradford, PA 16701' },
          vendorAdd3: { type: 'string', example: 'Address' },
          vendorAdd4: { type: 'string', example: 'Address' },
          vendorZipCode: { type: 'number', example: 4015 },
          vendorExtraZip: { type: 'number', example: 0 },
          vendorAlphaSortAbbr: { type: 'string', example: '' },
          vendorAreaCode: { type: 'number', example: 0 },
          vendorTelephoneNo: { type: 'number', example: 996 },
          vendorLastPaymentAmt: { type: 'number', example: 0 },
          vendorLastPaymentDate: { type: 'number', example: 0 },
          vendorYtdPurchases: { type: 'number', example: 0 },
          vendorLastYearPurchases: { type: 'number', example: 0 },
          vendorMtdDiscounts: { type: 'number', example: 0 },
          vendorYtdDiscounts: { type: 'number', example: 0 },
          vendorNameOverflow: { type: 'string', example: '' },
          vendorGalRcptsRequired: { type: 'string', example: 'T' },
          vendorFiller: { type: 'string', example: '' },
          vendorPreviousBalance: { type: 'number', example: 0 },
          vendorMtdPurchases: { type: 'number', example: 0 },
          vendorMtdPayments: { type: 'number', example: 0 },
          vendorCurrentBalance: { type: 'number', example: 0 },
          vendorHoldPaymentsVend: { type: 'string', example: 'A' },
          vendorSingleCheck: { type: 'string', example: 'T' },
          vendorThisYrYtdPaid: { type: 'number', example: 0 },
          vendorLastYrYtdPaid: { type: 'number', example: 0 },
          vendorExpenseGLSub: { type: 'number', example: 1234 },
          vendorApTermsCode: { type: 'number', example: 10 },
          vendorAp1099Code: { type: 'string', example: 'T' },
          vendorIdNumber: { type: 'string', example: '' },
          vendorFirst1099BoxNumber: { type: 'number', example: 1 },
          vendorSecond1099BoxNumber: { type: 'number', example: 2 },
          vendorSecond1099BoxAmount: { type: 'number', example: 50 },
          vendorLastPaymentDateAlt: { type: 'number', example: 0 },
          vendorCarrierId: { type: 'string', example: '' },
          vendorPayeeName1: { type: 'string', example: 'Test' },
          vendorPayeeName2: { type: 'string', example: 'Test' },
          vendorIrsNameControl: { type: 'string', example: 'T' },
          vendorAdpPayrollId: { type: 'number', example: 123 },
          vendorAchClass: { type: 'string', example: 'A' },
          vendorAchCheckingOrSavings: { type: 'string', example: 'C' },
          vendorAchBankRoutingCode: { type: 'number', example: 123456789 },
          vendorAchBankAccountNumber: { type: 'string', example: 'Test' },
          vendorFirstName: { type: 'string', example: 'Test' },
          vendorMiddleName: { type: 'string', example: 'Test' },
          vendorBusinessLastName: { type: 'string', example: 'Test' },
          vendorNameSuffix: { type: 'string', example: 'Sr' },
          vendorCountryCode: { type: 'string', example: 'US' },
          vendorCategoryCode: { type: 'string', example: 'INA' },
          vendorFiller2: { type: 'string', example: '' },
          vendorApTermsCodeDescription: { type: 'string', example: '' },
          vendorAp1099CodeDescription: { type: 'string', example: '' },
          vendorCategoryCodeDescription: { type: 'string', example: '' },
        },
      },
    },
  } as ApiResponseOptions,
};


export const updateVendorByYear = {
  path: "/ap-period-end/:year/vendors/:vendorNo",
  method: "POST",
  operation: {
    summary: "Update vendor details by year and vendor number",
    description: "Updates vendor information for a specific year and vendor number",
    operationId: "updateVendorByYear",
    tags: ["APPeriodEnd"],
    metaData: {
      accessRights: ["ap-period-end::year::vendors::vendorNo::create", "ap-period-end::year::vendors::vendorNo::update"],
    },
  } as ApiOperationOptions,
  requestBody: {
    type: "object",
    properties: {
      vendorCompanyNumber: {
        type: "number",
        description: "Company Number",
        example: 10,
      },
      vendorName: {
        type: "string",
        description: "Vendor Name",
        example: "ABCOTT Consulting",
      },
      vendorAdd1: {
        type: "string",
        description: "Vendor Address Line 1",
        example: "123 Main Street",
      },
      vendorAdd2: {
        type: "string",
        description: "Vendor Address Line 2",
        example: "Suite 100",
      },
      vendorAdd3: {
        type: "string",
        description: "Vendor Address Line 3",
      },
      vendorAdd4: {
        type: "string",
        description: "Vendor Address Line 4",
      },
      vendorCountryCode: {
        type: "string",
        description: "Country Code",
        example: "US",
      },
      vendorZipCode: {
        type: "number",
        description: "Zip Code",
        example: 401105,
      },
      vendorTelephoneNo: {
        type: "number",
        description: "Telephone Number",
        example: 996793,
      },
      vendorHoldPaymentsVend: {
        type: "string",
        description: "Hold Payments Indicator",
        example: "A",
      },
      vendorGalRcptsRequired: {
        type: "string",
        description: "GAL Receipts Required",
        example: "Y",
      },
      vendorSingleCheck: {
        type: "string",
        description: "Single Check Indicator",
        example: "Y",
      },
      vendorApTermsCode: {
        type: "number",
        description: "AP Terms Code",
        example: 10,
      },
      vendorAdpPayrollId: {
        type: "number",
        description: "ADP Payroll ID",
        example: 123,
      },
      vendorCategoryCode: {
        type: "string",
        description: "Vendor Category Code",
        example: "INACT",
      },
      vendorExpenseGLSub: {
        type: "number",
        description: "Expense GL Subaccount",
        example: 1234,
      },
      vendorAchBankAccountNumber: {
        type: "string",
        description: "ACH Bank Account Number",
        example: "1234567890",
      },
      vendorAchBankRoutingCode: {
        type: "number",
        description: "ACH Bank Routing Code",
        example: 123456789,
      },
      vendorAchCheckingOrSavings: {
        type: "string",
        description: "Account Type (C=Checking, S=Savings)",
        example: "C",
      },
      vendorAchClass: {
        type: "string",
        description: "ACH Class",
        example: "A",
      },
      vendorFirstName: {
        type: "string",
        description: "Vendor First Name",
        example: "John",
      },
      vendorMiddleName: {
        type: "string",
        description: "Vendor Middle Name",
        example: "M",
      },
      vendorBusinessLastName: {
        type: "string",
        description: "Vendor Last Name (Business)",
        example: "Doe",
      },
      vendorNameSuffix: {
        type: "string",
        description: "Vendor Name Suffix",
        example: "Jr",
      },
      vendorAp1099Code: {
        type: "string",
        description: "AP 1099 Code",
        example: "Y",
      },
      vendorFirst1099BoxNumber: {
        type: "number",
        description: "First 1099 Box Number",
        example: 1,
      },
      vendorSecond1099BoxNumber: {
        type: "number",
        description: "Second 1099 Box Number",
        example: 2,
      },
      vendorSecond1099BoxAmount: {
        type: "number",
        description: "Second 1099 Box Amount",
        example: 50,
      },
      vendorPayeeName1: {
        type: "string",
        description: "Payee Name 1",
        example: "John Doe",
      },
      vendorPayeeName2: {
        type: "string",
        description: "Payee Name 2",
        example: "Jane Doe",
      },
      vendorIrsNameControl: {
        type: "string",
        description: "IRS Name Control",
        example: "D",
      },
    },
  },
  response: {
    status: 200,
    description: "Vendor Details Updated Successfully",
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Vendor Details Updated Successfully",
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
              message: { type: "string", example: "An unexpected error occurred" },
            },
          },
        },
      },
    },
  ] as ApiResponseOptions[],
};
