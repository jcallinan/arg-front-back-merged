import { ApiOperationOptions, ApiResponseOptions } from "@nestjs/swagger";

export const paymentHistory = {
    path: "/check-inquiry/payment-history",
    method: "GET",
    operation: {
        summary: "Get Payment History for check Inquiry",
        operationId: "getPyamentHistory",
        tags: ["CheckInquiry"],
        metaData: {
            accessRights: ["check-inquiry::payment-history::read"],
        },
    } as ApiOperationOptions,
    parameters: [
        {
            name: "companyNo",
            in: "query",
            required: false,
            description: "Company Id",
            schema: {
                type: "number",
                example: "10",
            },
        },
        {
            name: "vendorNo",
            in: "query",
            required: false,
            description: "VendiorNo",
            schema: {
                type: "number",
                example: "1100",
            },
        },
        {
            name: "startDate",
            in: "query",
            required: false,
            description: "Start date",
            schema: {
                type: "string",
                format: "date",
                example: "20116",
            },
        },
        {
            name: "invoiceNo",
            in: "query",
            required: false,
            description: "Invoice No",
            schema: {
                type: "string",
                example: "461046",
            },
        },
        {
            name: "checkNo",
            in: "query",
            required: false,
            description: "check No",
            schema: {
                type: "number",
                example: "0",
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
        description: "Paginated list of Check Inquiry Payment History",
        schema: {
            type: "object",
            properties: {
                companyNo: { type: "integer", example: 10 },
                vendorNo: { type: "integer", example: 1100 },
                checkNo: { type: "integer", example: 0 },
                invoiceNo: { type: "string", example: "00684027            " },
                invoiceDescription: { type: "string", example: "(PJ12)AFE 350 GRINDER    " },
                paidAmount: { type: "number", format: "float", example: 0 },
                grossAmount: { type: "number", format: "float", example: 102.69 },
                discount: { type: "number", format: "float", example: 0 },
                bankGLNo: { type: "integer", example: 11000001 },
                voucherNo: { type: "integer", example: 11000001 },
                invoiceDate: { type: "integer", example: 11000001 },
                dueDate: { type: "integer", example: 11000001 },
                lastPaidDate: { type: "integer", example: 20116 },
                bankGLNumber: {
                    type: "object",
                    properties: {
                        vendorName: { type: "string", example: "ABBOTT GAS PRODUCTS           " },
                        checkDate: { type: "integer", example: 20116 }
                    }
                }
            },
            required: ["items", "pagination"],
        },
    } as ApiResponseOptions,
};


export const lastPaymentInfo = {
    path: "/check-inquiry/last-payment-info",
    method: "GET",
    operation: {
        summary: "Get last Payment Information",
        operationId: "getLastPaymentInfo",
        tags: ["CheckInquiry"],
        metaData: {
            accessRights: ["check-inquiry::last-payment-info::read"],
        },
    } as ApiOperationOptions,
    parameters: [
        {
            name: "companyNo",
            in: "query",
            required: true,
            description: "Company Id",
            schema: {
                type: "number",
                example: "10",
            },
        },
        {
            name: "vendorNo",
            in: "query",
            required: true,
            description: "VendorNo",
            schema: {
                type: "number",
                example: "1100",
            },
        },
        {
            name: "startDate",
            in: "query",
            required: false,
            description: "Start date",
            schema: {
                type: "string",
                format: "date",
                example: "20116",
            },
        },
        {
            name: "invoiceNo",
            in: "query",
            required: false,
            description: "Invoice No",
            schema: {
                type: "string",
                example: "461046",
            },
        },
        {
            name: "checkNo",
            in: "query",
            required: false,
            description: "check No",
            schema: {
                type: "number",
                example: "0",
            },
        },
    ],
    response: {
        status: 200,
        description: "Paginated list of Check Inquiry Payment History",
        schema: {
            type: "object",
            properties: {
                companyNo: { type: "integer", example: 10 },
                vendorNo: { type: "integer", example: 1100 },
                grossAmount: { type: "number", format: "float", example: 102.69 },
                openPayables: { type: "integer", example: 0 },
                vendorName: { type: "string", example: "ACT ASSOCIATES " },
            },
            required: [],
        },
    } as ApiResponseOptions,
};


export const getVoucherDetails = {
    path: "/check-inquiry/voucher-detail",
    method: "GET",
    operation: {
        summary: "Get Voucher Details",
        operationId: "getVoucherDetails",
        tags: ["CheckInquiry"],
        metaData: {
            accessRights: ["check-inquiry::voucher-detail::read"],
        },
    } as ApiOperationOptions,
    parameters: [
        {
            name: "companyNo",
            in: "query",
            required: true,
            description: "Company Id",
            schema: {
                type: "number",
                example: 10,
            },
        },
        {
            name: "vendorNo",
            in: "query",
            required: true,
            description: "VendorNo",
            schema: {
                type: "number",
                example: 1100,
            },
        },
        {
            name: "voucherNo",
            in: "query",
            required: true,
            description: "Invoice No",
            schema: {
                type: "number",
                example: 461046,
            },
        },
        {
            name: "checkNo",
            in: "query",
            required: false,
            description: "check No",
            schema: {
                type: "number",
                example: "0",
            },
        },
        {
            name: "invoiceNo",
            in: "query",
            required: false,
            description: "Invoice No",
            schema: {
                type: "string",
                example: "0",
            },
        },
    ],
    response: {
        status: 200,
        description: "Get Voucher Details",
        schema: {
            type: "object",
            properties: {
                vendorDetail: {
                    vendorNo: { type: "integer", example: 1100 },
                    companyNo: { type: "integer", example: 10 },
                    voucherNo: { type: "integer", example: 16994 },
                    bankGLNo: { type: "integer", example: 11110001 },
                    checkNo: { type: "integer", example: 50774 },
                    vendorDetails: {
                        vendorName: { type: "string", example: "ABCOTT Consulting" }
                    }
                },
                headerItems: {
                    invoiceDescription: { type: "string", example: "AIR, N, WHEELS, DISC" },
                    prepaidVoucher: { type: "string", example: "" },
                    heldPaymentVoucher: { type: "string", example: "" },
                    heldDescription: { type: "string", example: "" },
                    singleCheck: { type: "string", example: "" },
                    invoiceNo: { type: "string", example: "234161" },
                    grossAmount: { type: "number", format: "float", example: 220.69 },
                    discount: { type: "number", format: "float", example: 0 },
                    apGLAccountNo: { type: "integer", example: 12010001 },
                    discountDueDate: { type: "integer", example: 0 },
                    invoiceDate: { type: "integer", example: 82098 },
                    dueDate: { type: "integer", example: 100498 },
                    checkNo: { type: "integer", example: 50774 },
                    bankGLNo: { type: "integer", example: 11110001 },
                    paidOn8: { type: "integer", example: 19981001 },
                    freightTotal: { type: "number", format: "float", example: 0 },
                    salesOrderNo: { type: "integer", example: 0 },
                    salesSRNNo: { type: "integer", example: 0 }
                },
                detailItems: [
                    {
                        detailLineDescription: { type: "string", example: "AIR, N, WHEELS, DISC" },
                        openClosedStatus: { type: "string", example: "C" },
                        poNumber: { type: "string", example: "" },
                        detailLineAmount: { type: "number", format: "float", example: 220.69 },
                        detailLineDiscount: { type: "number", format: "float", example: 0 },
                        expenseGLAccount: { type: "integer", example: 26100501 },
                        quantity: { type: "integer", example: 0 },
                        receiptNumber: { type: "integer", example: 0 },
                        freightAmount: { type: "number", format: "float", example: 0 }
                    }
                ]
            },
            required: [],
        },
    } as ApiResponseOptions,
};


