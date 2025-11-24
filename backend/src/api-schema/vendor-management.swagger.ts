import { ApiOperationOptions, ApiResponseOptions, ApiQueryOptions } from "@nestjs/swagger";

export const vendorTypes = {
    path: "/vendor-management/types",
    method: "GET",
    operation: {
        summary: "Vendor Types List",
        operationId: "getVendorTypes",
        tags: ["Vendor Management"],
        metaData: {
            accessRights: ["vendor-management::types::read"],
        },
    } as ApiOperationOptions,

    response: {
        status: 200,
        description: "Get list of Vendor Types",
        schema: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "string", example: "A" },
                    value: { type: "string", example: "ACK" },
                    label: { type: "string", example: "ACK" },
                },
            },
            example: [
                { id: "A", value: "ACK", label: "ACK" },
                { id: "E", value: "Employee", label: "Employee" },
            ],
        },
    } as ApiResponseOptions,
};

export const getVendorList = {
    path: "/vendor-management/list",
    method: "GET",
    operation: {
        summary: "Vendor List",
        operationId: "getVendorList",
        tags: ["Vendor Management"],
        metaData: {
            accessRights: ["vendor-management::list::read"],
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
            required: false,
            description: "Vendor No",
        },
        {
            name: "type",
            type: String,
            required: false,
            description: "Vendor Type",
            example: "E",
        },
        {
            name: "status",
            type: String,
            required: false,
            description: "Vendor Status",
            example: "A",
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
        description: "Get list of Vendors with pagination info",
        schema: {
            type: "object",
            properties: {
                items: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            vendorIsDeleted: { type: "string", example: "Inactive" },
                            vendorCompanyNumber: { type: "number", example: 10 },
                            vendorNo: { type: "number", example: 1 },
                            vendorTelephoneNo: { type: "number", example: 3681278 },
                            vendorLastPaymentAmt: { type: "number", example: 0 },
                            vendorLastPaymentDate: { type: "number", example: 0 },
                            vendorHoldPaymentsVend: { type: "string", example: "" },
                        },
                    },
                },
                pagination: {
                    type: "object",
                    properties: {
                        total_items: { type: "number", example: 7059 },
                        current_page: { type: "number", example: 1 },
                        items_per_page: { type: "number", example: 100 },
                        total_pages: { type: "number", example: 71 },
                    },
                },
            },
        },
    } as ApiResponseOptions,
};

export const createOrUpdateVendor = {
    path: "/vendor-management",
    method: "POST",
    operation: {
        summary: "Vendor Create or Update",
        operationId: "createOrUpdateVendor",
        tags: ["Vendor Management"],
        metaData: {
            accessRights: ["vendor-management::create", "vendor-management::update"],
        },
    } as ApiOperationOptions,
    queries: [
        {
            name: "vendorIsDeleted",
            type: String,
            required: true,
            description: "Vendor isDeleted",
            example: 'A',
        },
        {
            name: "vendorCompanyNumber",
            type: Number,
            required: true,
            description: "Company Number",
            example: 10,
        },
        {
            name: "vendorNo",
            type: Number,
            required: true,
            description: "Vendor Number",
            example: 9875,
        },
        {
            name: "vendorName",
            type: String,
            required: true,
            description: "Vendor Name",
            example: "Abhishek Consulting",
        },
        {
            name: "vendorAdd1",
            type: String,
            required: false,
            description: "Vendor Address Line 1",
        },
        {
            name: "vendorAdd2",
            type: String,
            required: false,
            description: "Vendor Address Line 2",
        },
        {
            name: "vendorAdd3",
            type: String,
            required: false,
            description: "Vendor Address Line 3",
        },
        {
            name: "vendorAdd4",
            type: String,
            required: false,
            description: "Vendor Address Line 4",
        },
        {
            name: "vendorCountryCode",
            type: String,
            required: true,
            description: "Country Code",
            example: "US",
        },
        {
            name: "IdNo1099",
            type: String,
            required: false,
            description: "1099 Id",
            example: "Test",
        },
        {
            name: "vendorZipCode",
            type: Number,
            required: true,
            description: "Zip Code",
            example: 4015,
        },
        {
            name: "vendorAreaCode",
            type: Number,
            required: false,
            description: "Area Code",
            example: 996,
        },
        {
            name: "vendorTelephoneNo",
            type: Number,
            required: false,
            description: "Telephone Number",
            example: 996,
        },
        {
            name: "vendorHoldPaymentsVend",
            type: String,
            required: false,
            description: "Hold Payments Indicator",
            example: "A",
        },
        {
            name: "vendorGalRcptsRequired",
            type: String,
            required: false,
            description: "GAL Receipts Required",
            example: "T",
        },
        {
            name: "vendorSingleCheck",
            type: String,
            required: false,
            description: "Single Check Indicator",
            example: "T",
        },
        {
            name: "vendorApTermsCode",
            type: Number,
            required: false,
            description: "AP Terms Code",
            example: 10,
        },
        {
            name: "vendorAdpPayrollId",
            type: Number,
            required: false,
            description: "ADP Payroll ID",
            example: 123,
        },
        {
            name: "vendorCategoryCode",
            type: String,
            required: false,
            description: "Vendor Category Code",
            example: "INA",
        },
        {
            name: "vendorExpenseGLSub",
            type: Number,
            required: false,
            description: "Expense GL Subaccount",
            example: 1234,
        },
        {
            name: "vendorAchBankAccountNumber",
            type: String,
            required: false,
            description: "ACH Bank Account Number",
            example: "Test",
        },
        {
            name: "vendorAchBankRoutingCode",
            type: Number,
            required: false,
            description: "ACH Bank Routing Code",
            example: 123456789,
        },
        {
            name: "vendorAchCheckingOrSavings",
            type: String,
            required: false,
            description: "Account Type (C=Checking, S=Savings)",
            example: "C",
        },
        {
            name: "vendorAchClass",
            type: String,
            required: false,
            description: "ACH Class",
            example: "A",
        },
        {
            name: "vendorFirstName",
            type: String,
            required: false,
            description: "Vendor First Name",
            example: "Test",
        },
        {
            name: "vendorMiddleName",
            type: String,
            required: false,
            description: "Vendor Middle Name",
            example: "Test",
        },
        {
            name: "vendorBusinessLastName",
            type: String,
            required: false,
            description: "Vendor Last Name (Business)",
            example: "Test",
        },
        {
            name: "vendorNameSuffix",
            type: String,
            required: false,
            description: "Vendor Name Suffix",
            example: "Sr",
        },
        {
            name: "vendorAp1099Code",
            type: String,
            required: false,
            description: "AP 1099 Code",
            example: "T",
        },
        {
            name: "vendorFirst1099BoxNumber",
            type: Number,
            required: false,
            description: "First 1099 Box Number",
            example: 1,
        },
        {
            name: "vendorSecond1099BoxNumber",
            type: Number,
            required: false,
            description: "Second 1099 Box Number",
            example: 2,
        },
        {
            name: "vendorSecond1099BoxAmount",
            type: Number,
            required: false,
            description: "Second 1099 Box Amount",
            example: 50,
        },
        {
            name: "vendorPayeeName1",
            type: String,
            required: false,
            description: "Payee Name 1",
            example: "Test",
        },
        {
            name: "vendorPayeeName2",
            type: String,
            required: false,
            description: "Payee Name 2",
            example: "Test",
        },
        {
            name: "vendorIrsNameControl",
            type: String,
            required: false,
            description: "IRS Name Control",
            example: "T",
        },
        {
            name: "contactDetails",
            type: Array,
            required: false,
            description: "List of Contact Details",
            example: [
                {
                    name: "formType",
                    type: String,
                    required: false,
                    description: "Form Type",
                    example: "ABCY",
                },
                {
                    name: "contactName",
                    type: String,
                    required: false,
                    description: "Contact Name",
                    example: "John",
                },
                {
                    name: "emailAddress",
                    type: String,
                    required: false,
                    description: "Email Address",
                    example: "ABCY",
                },
                {
                    name: "sendAchEmail",
                    type: String,
                    required: false,
                    description: "Send ACH Email",
                    example: "Y",
                },
                {
                    name: "sequenceNumber",
                    type: Number,
                    required: false,
                    description: "Sequence Number",
                    example: 639360,
                },
                {
                    name: "deleteCode",
                    type: String,
                    required: false,
                    description: "Delete Code",
                    example: "I",
                },
                {
                    name: "filler",
                    type: String,
                    required: false,
                    description: "Comments",
                    example: "test",
                },
            ],
        }
    ],
    response: {
        status: 200,
        description: "Create or Update Vendor",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Vendor Details Updated Successfully",
                },
            },
        },
    } as ApiResponseOptions
}

export const getOwnerMappingList = {
    path: "/vendor-management/owner-mapping",
    method: "GET",
    operation: {
        summary: "Vendor Owner List",
        operationId: "getOwnerMappingList",
        tags: ["Vendor Management"],
        metaData: {
            accessRights: ["vendor-management::owner-mapping::read"],
        },
    } as ApiOperationOptions,
    queries: [
        {
            name: "vendorCompanyNumber",
            type: Number,
            required: true,
            description: "Company Number",
        },
        {
            name: "vendorNo",
            type: Number,
            required: false,
            description: "Vendor No",
        },
        {
            name: "status",
            type: String,
            required: false,
            description: "Status",
            example: "A",
        },
        {
            name: "limit",
            type: Number,
            required: false,
            description: "Number of items per page",
            example: 100,
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
        description: "Get list of Vendors Owner with pagination info",
        schema: {
            type: "object",
            properties: {
                items: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            ownerNo: { type: "number", example: 12345 },
                            vendorNo: { type: "number", example: 2 },
                            vendorIsDeleted: { type: "string", example: "Inactive" },
                            vendorName: { type: "string", example: "CUSTOMER SUPPLIED COMPONENTS" }
                        }
                    },
                },
                pagination: {
                    type: "object",
                    properties: {
                        total_items: { type: "number", example: 7059 },
                        current_page: { type: "number", example: 1 },
                        items_per_page: { type: "number", example: 100 },
                        total_pages: { type: "number", example: 71 },
                    },
                },
            },
        },
    } as ApiResponseOptions,
};

export const getOwnerDetails = {
    path: "/vendor-management/owner",
    method: "GET",
    operation: {
        summary: "Vendor Owner Details",
        operationId: "getOwnerDetails",
        tags: ["Vendor Management"],
        metaData: {
            accessRights: ["vendor-management::owner::read"],
        },
    } as ApiOperationOptions,
    queries: [
        {
            name: "ownerNo",
            type: Number,
            required: true,
            description: "Owner No",
        },
        {
            name: "vendorNo",
            type: Number,
            required: false,
            description: "Vendor No",
        },
    ],
    response: {
        status: 200,
        description: "Get Vendor Owner Details",
        schema: {
            type: "object",
            properties: {
                ownerNo: { type: "number", example: 63873 },
                vendorNo: { type: "number", example: 1444 },
                isDeleted: { type: "string", example: "I" },
                filler: {
                    type: "string",
                    example: "                                                   ",
                },
                vendorDetails: {
                    type: "object",
                    properties: {
                        vendorName: { type: "string", example: "AIELLO BROTHERS OIL & GAS INC " },
                    },
                },
            },
        },
    } as ApiResponseOptions,
};

export const CreateAndUpdateOwner = {
    path: "/vendor-management/owner",
    method: "POST",
    operation: {
        summary: "Create Or Update Vendor Owner Details",
        operationId: "CreateAndUpdateOwner",
        tags: ["Vendor Management"],
        metaData: {
            accessRights: ["vendor-management::owner::create", "vendor-management::owner::update"],
        },
    } as ApiOperationOptions,
    Body: [
        {
            name: "ownerNo",
            type: Number,
            required: true,
            description: "Owner No",
        },
        {
            name: "vendorNo",
            type: Number,
            required: false,
            description: "Vendor No",
        },
        {
            name: "isDeleted",
            type: String,
            required: true,
            description: "Status",
        },
    ],
    response: {
        status: 200,
        description: "Create or Update Vendor Owner Details",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "Vendor Owner details saved successfully" },
            },
        },
    } as ApiResponseOptions,
};


export const getOwnerNoList = {
    path: "/vendor-management/owner-no/list",
    method: "GET",
    operation: {
        summary: "Vendor Owner No Dropdown List",
        operationId: "getOwnerNoList",
        tags: ["Vendor Management"],
        metaData: {
            accessRights: ["vendor-management::owner-no::list::read"],
        },
    } as ApiOperationOptions,
    queries: [
        {
            name: "vendorCompanyNumber",
            type: Number,
            required: true,
            description: "Company Number",
        },
        {
            name: "vendorNo",
            type: Number,
            required: false,
            description: "Vendor No",
        },
        {
            name: "status",
            type: String,
            required: false,
            description: "Status",
            example: "A",
        },
        {
            name: "limit",
            type: Number,
            required: false,
            description: "Number of items per page",
            example: 100,
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
        description: "Get list of Vendors Owner with pagination info",
        schema: {
            type: "object",
            properties: {
                items: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "number", example: 1100 },
                            value: { type: "string", example: 1100 },
                            label: { type: "string", example: 1100 },
                        }
                    },
                },
            },
        },
    } as ApiResponseOptions,
};


export const getNextVendorNoConfig = {
    path: "/vendor-management/config",
    method: "GET",
    operation: {
        summary: "Get Next vendor number",
        operationId: "getNextVendorNoConfig",
        tags: ["Vendor Management"],
        metaData: {
            accessRights: ["vendor-management::config::read"],
        },
    } as ApiOperationOptions,
    queries: [
        {
            name: "companyNo",
            type: Number,
            required: true,
            description: "Company Number",
        },
    ],
    response: {
        status: 200,
        description: "Get Next vendor number",
        schema: {
            type: "object",
            properties: {
                items: {
                    items: { type: 91000 },
                },
            },
        },
    } as ApiResponseOptions,
};

export const getVendorDetails = {
    path: "/vendor-management/details",
    method: "GET",
    operation: {
        summary: "Vendor with contact details",
        operationId: "getVendorDetails",
        tags: ["Vendor Management"],
        metaData: {
            accessRights: ["vendor-management::details::read"],
        },
    } as ApiOperationOptions,
    queries: [
        {
            name: "vendorCompanyNumber",
            type: Number,
            required: true,
            description: "Company Number",
        },
        {
            name: "vendorNo",
            type: Number,
            required: false,
            description: "Vendor No",
        },

    ],
    response: {
        status: 200,
        description: "Get vendor details along with contact",
        schema: {
            type: "object",
            properties: {
                items: {
                    type: "Object",
                    vendor: {
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
                        formtypeDescription: { type: 'string', example: '' },
                        vendorCategoryCodeDescription: { type: 'string', example: '' },
                    },
                    vendorContactDetails: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                deleteCode: { type: 'string', example: '' },
                                companyNo: { type: 'number', example: 10 },
                                vendorNo: { type: 'number', example: 9875 },
                                formType: { type: 'string', example: 'ABCY' },
                                sequenceNumber: { type: 'number', example: 232577 },
                                contactName: { type: 'string', example: 'Abhishek' },
                                emailAddress: { type: 'string', example: 'abhishek@amref.com' },
                                faxNumber: { type: 'string', example: '' },
                                sendAchEmail: { type: 'string', example: 'Y' },
                                filler: { type: 'string', example: '' },
                            },
                        },
                    },
                },
            },
        },
    } as ApiResponseOptions,
};



export const getAllVendors = {
    path: "/vendor-management/all-vendors",
    method: "GET",
    operation: {
        summary: "Get all vendors",
        operationId: "getAllVendorsList",
        tags: ["Vendor Management"],
        metaData: {
            accessRights: ["vendor-management::all-vendors::read"],
        },
    } as ApiOperationOptions,
    queries: [
        {
            name: "companyNo",
            type: Number,
            required: true,
            description: "Company Number",
        } as ApiQueryOptions,
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

