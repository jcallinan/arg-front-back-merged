import {
  ApiOperationOptions,
  ApiResponseOptions,
  ApiBodyOptions,
} from "@nestjs/swagger";
import { PAYMENT_REPORT_TYPES } from "@src/shared/constants/constant";
import {
  PAYMENT_VOUCHER_TYPES,
  PAYMENT_OPERATION_MODE,
  PAYMENT_OPERATION_MODE_VALUES,
  PAYMENT_VOUCHER_TYPE_VALUES,
  FORCED_DISCOUNT_VALUES,
  PAY_OR_HOLD_CODES,
  SingleCheckFlag,
  MakePrepaidFlag,
} from "@src/shared/constants/payment-constant";

export const getAllVoucherPaymentTypes = {
  path: "/payment/types",
  method: "GET",
  operation: {
    summary: "Get all voucher to pay types",
    operationId: "getAllVoucherPaymentTypes",
    tags: ["Payment"],
    metaData: {
      accessRights: ["payment::types::read"],
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
              label: { type: "string", example: "Check" },
              value: { type: "string", example: "Check" },
            },
            required: ["id", "label", "value"],
          },
        },
      },
      required: ["items"],
    },
  } as ApiResponseOptions,
};

export const submitPaymentSelectionType = {
  path: "/payment/selection/type",
  method: "POST",
  operation: {
    summary: "Submit Payment Selection Type",
    description:
      "Submit Payment Selection Type for Check, ACH, or Wire vouchers and mode save or edit",
    operationId: "submitPaymentSelectionType",
    tags: ["Payment"],
    metaData: {
      accessRights: ["payment::selection::type::create", "payment::selection::type::update"],
    },
  } as ApiOperationOptions,

  body: {
    schema: {
      type: "object",
      properties: {
        companyNo: { type: "number", example: 10 },
        voucherToPay: {
          type: "string",
          enum: PAYMENT_VOUCHER_TYPE_VALUES,
          example: PAYMENT_VOUCHER_TYPES.CHECK,
        },
        startingCheckNo: { type: "string", example: "100001" },
        checkDate: { type: "string", example: "080125" }, // MMDDYY
        dateToPayBy: { type: "string", example: "080225" },
        bankAccountGl: { type: "string", example: "11000001" },
        forcedDiscount: {
          type: "string",
          enum: [FORCED_DISCOUNT_VALUES.YES, FORCED_DISCOUNT_VALUES.NO],
          example: FORCED_DISCOUNT_VALUES.YES,
        },
        mode: {
          type: "string",
          enum: PAYMENT_OPERATION_MODE_VALUES,
          example: PAYMENT_OPERATION_MODE.SAVE,
        },
      },
      required: [
        "companyNo",
        "voucherToPay",
        "startingCheckNo",
        "checkDate",
        "bankAccountGl",
        "forcedDiscount",
        "mode",
      ],
    },
    examples: {
      CheckVoucherExample: {
        summary: PAYMENT_VOUCHER_TYPES.CHECK,
        value: {
          companyNo: 10,
          voucherToPay: PAYMENT_VOUCHER_TYPES.CHECK,
          startingCheckNo: 123456,
          checkDate: "080125",
          dateToPayBy: "080225",
          bankAccountGl: 12010001,
          forcedDiscount: FORCED_DISCOUNT_VALUES.YES,
          mode: PAYMENT_OPERATION_MODE.SAVE,
        },
      },
      AchVoucherExample: {
        summary: PAYMENT_VOUCHER_TYPES.ACH,
        value: {
          companyNo: 20,
          voucherToPay: PAYMENT_VOUCHER_TYPES.ACH,
          startingCheckNo: 200001,
          checkDate: "080325",
          dateToPayBy: "080525",
          bankAccountGl: 12010001,
          forcedDiscount: FORCED_DISCOUNT_VALUES.NO,
          mode: PAYMENT_OPERATION_MODE.EDIT,
        },
      },
      WireVoucherExample: {
        summary: PAYMENT_VOUCHER_TYPES.WIRE,
        value: {
          companyNo: 30,
          voucherToPay: PAYMENT_VOUCHER_TYPES.WIRE,
          startingCheckNo: 300001,
          checkDate: "080625",
          dateToPayBy: "080725",
          bankAccountGl: 12010001,
          forcedDiscount: FORCED_DISCOUNT_VALUES.YES,
          mode: PAYMENT_OPERATION_MODE.SAVE,
        },
      },
    },
  } as ApiBodyOptions,

  response: {
    status: 200,
    description: "Payment Selection Type submitted successfully",
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Payment type selection submitted successfully",
        },
      },
    },
  } as ApiResponseOptions,
};

export const submitVendorPayment = {
  path: "/payment/selection/payment-vendor",
  method: "POST",
  operation: {
    summary: "Submit Vendor Payment",
    description:
      "Adds, updates, or deletes a single vendor payment line in an active payment selection type for Check, ACH, or Wire vouchers.",
    operationId: "submitVendorPayment",
    tags: ["Payment"],
    metaData: {
      accessRights: ["payment::selection::payment-vendor::create", "payment::selection::payment-vendor::update"],
    },
  } as ApiOperationOptions,

  body: {
    schema: {
      type: "object",
      properties: {
        companyNo: { type: "number", example: 10 },
        voucherToPay: {
          type: "string",
          enum: PAYMENT_VOUCHER_TYPE_VALUES,
          example: PAYMENT_VOUCHER_TYPES.CHECK,
        },
        bankAccountGl: { type: "number", example: 11000001 },
        startingCheckNo: { type: "number", example: 100001 },
        checkDate: { type: "string", example: "080125" }, // MMDDYY
        dateToPayBy: { type: "string", example: "080225" }, // MMDDYY
        item: {
          type: "object",
          properties: {
            entrySequence: { type: "string", example: "00001" },
            vendorNo: { type: "number", example: 18374 },
            voucherNo: { type: "number", example: 357700 },
            partialPayAmount: { type: "number", example: 1200.0 },
            discountAmount: { type: "number", example: 50.0 },
            payOrHold: {
              type: "string",
              enum: [PAY_OR_HOLD_CODES.PAY, PAY_OR_HOLD_CODES.HOLD],
              example: PAY_OR_HOLD_CODES.PAY,
            },
            singleCheck: {
              type: "string",
              enum: [SingleCheckFlag.SINGLE, SingleCheckFlag.NONE],
              example: SingleCheckFlag.SINGLE,
            },
            makePrepaid: {
              type: "string",
              enum: [
                MakePrepaidFlag.NONE,
                MakePrepaidFlag.PREPAID,
                MakePrepaidFlag.ADVANCE,
                MakePrepaidFlag.WIRE,
              ],
              example: MakePrepaidFlag.PREPAID,
            },
            prepaidCheckNo: { type: "string", example: "000123" },
            prepaidDate: { type: "string", example: "080125" },
            forcedDiscount: {
              type: "string",
              enum: [FORCED_DISCOUNT_VALUES.YES, FORCED_DISCOUNT_VALUES.NO],
              example: FORCED_DISCOUNT_VALUES.NO,
            },
            mode: {
              type: "string",
              enum: PAYMENT_OPERATION_MODE_VALUES,
              example: "save",
            },
          },
          required: [
            "entrySequence",
            "vendorNo",
            "voucherNo",
            "partialPayAmount",
            "discountAmount",
            "payOrHold",
            "singleCheck",
            "makePrepaid",
            "prepaidDate",
            "forcedDiscount",
            "mode",
          ],
        },
      },
      required: [
        "companyNo",
        "bankAccountGl",
        "startingCheckNo",
        "checkDate",
        "dateToPayBy",
        "item",
      ],
    },
    examples: {
      // -------------------- CHECK --------------------
      insertCheck: {
        summary: "Insert - Pay one voucher (Check)",
        value: {
          companyNo: 10,
          voucherToPay: PAYMENT_VOUCHER_TYPES.CHECK,
          bankAccountGl: 11000001,
          startingCheckNo: 100001,
          checkDate: "080125",
          dateToPayBy: "080225",
          item: {
            entrySequence: "00001",
            vendorNo: 1875,
            voucherNo: 80980,
            partialPayAmount: 1200,
            discountAmount: 50,
            payOrHold: "P",
            singleCheck: "S",
            makePrepaid: MakePrepaidFlag.PREPAID,
            prepaidCheckNo: "000123",
            prepaidDate: "080125",
            forcedDiscount: FORCED_DISCOUNT_VALUES.YES,
            mode: PAYMENT_OPERATION_MODE.SAVE,
          },
        },
      },
      updateCheck: {
        summary: "Update existing voucher (Check)",
        value: {
          companyNo: 10,
          voucherToPay: PAYMENT_VOUCHER_TYPES.CHECK,
          bankAccountGl: 11000001,
          startingCheckNo: 100001,
          checkDate: "080125",
          dateToPayBy: "080225",
          item: {
            entrySequence: "00001",
            vendorNo: 1875,
            voucherNo: 80980,
            partialPayAmount: 1200,
            discountAmount: 50,
            payOrHold: "P",
            singleCheck: "S",
            makePrepaid: MakePrepaidFlag.PREPAID,
            prepaidCheckNo: "000123",
            prepaidDate: "080125",
            forcedDiscount: FORCED_DISCOUNT_VALUES.NO,
            mode: PAYMENT_OPERATION_MODE.EDIT,
          },
        },
      },
      deleteCheck: {
        summary: "Delete existing voucher (Check)",
        value: {
          companyNo: 10,
          voucherToPay: PAYMENT_VOUCHER_TYPES.CHECK,
          bankAccountGl: 11000001,
          startingCheckNo: 100001,
          checkDate: "080125",
          dateToPayBy: "080225",
          item: {
            entrySequence: "00001",
            vendorNo: 1875,
            voucherNo: 80980,
            partialPayAmount: 1200,
            discountAmount: 50,
            payOrHold: "P",
            singleCheck: "S",
            makePrepaid: MakePrepaidFlag.PREPAID,
            prepaidCheckNo: "000123",
            prepaidDate: "080125",
            forcedDiscount: FORCED_DISCOUNT_VALUES.NO,
            mode: PAYMENT_OPERATION_MODE.DELETE,
          },
        },
      },

      // -------------------- ACH --------------------
      insertACH: {
        summary: "Insert - Pay one voucher (ACH)",
        value: {
          companyNo: 10,
          voucherToPay: PAYMENT_VOUCHER_TYPES.ACH,
          bankAccountGl: 11000001,
          startingCheckNo: 200001,
          checkDate: "080125",
          dateToPayBy: "080225",
          item: {
            entrySequence: "00010",
            vendorNo: 1875,
            voucherNo: 40001,
            partialPayAmount: 500.0,
            discountAmount: 0.0,
            payOrHold: "P",
            singleCheck: "",
            makePrepaid: MakePrepaidFlag.ADVANCE,
            prepaidDate: "080125",
            forcedDiscount: FORCED_DISCOUNT_VALUES.NO,
            mode: PAYMENT_OPERATION_MODE.SAVE,
          },
        },
      },
      updateACH: {
        summary: "Update existing voucher (ACH)",
        value: {
          companyNo: 10,
          voucherToPay: PAYMENT_VOUCHER_TYPES.ACH,
          bankAccountGl: 11000001,
          startingCheckNo: 200001,
          checkDate: "080125",
          dateToPayBy: "080225",
          item: {
            entrySequence: "00011",
            vendorNo: 1875,
            voucherNo: 40002,
            partialPayAmount: 800.0,
            discountAmount: 25.0,
            payOrHold: "P",
            singleCheck: "",
            makePrepaid: MakePrepaidFlag.ADVANCE,
            prepaidDate: "080125",
            forcedDiscount: FORCED_DISCOUNT_VALUES.NO,
            mode: PAYMENT_OPERATION_MODE.EDIT,
          },
        },
      },
      deleteACH: {
        summary: "Delete voucher (ACH)",
        value: {
          companyNo: 10,
          voucherToPay: PAYMENT_VOUCHER_TYPES.ACH,
          bankAccountGl: 11000001,
          startingCheckNo: 200001,
          checkDate: "080125",
          dateToPayBy: "080225",
          item: {
            entrySequence: "00012",
            vendorNo: 1875,
            voucherNo: 40003,
            partialPayAmount: 0.0,
            discountAmount: 0.0,
            payOrHold: "H",
            singleCheck: "",
            makePrepaid: MakePrepaidFlag.ADVANCE,
            prepaidDate: "080125",
            forcedDiscount: FORCED_DISCOUNT_VALUES.NO,
            mode: PAYMENT_OPERATION_MODE.DELETE,
          },
        },
      },

      // -------------------- WIRE --------------------
      insertWire: {
        summary: "Insert - Pay one voucher (Wire)",
        value: {
          companyNo: 10,
          voucherToPay: PAYMENT_VOUCHER_TYPES.WIRE,
          bankAccountGl: 11000001,
          startingCheckNo: 300001,
          checkDate: "080125",
          dateToPayBy: "080225",
          item: {
            entrySequence: "00020",
            vendorNo: 1875,
            voucherNo: 50001,
            partialPayAmount: 2000.0,
            discountAmount: 100.0,
            payOrHold: "P",
            singleCheck: "",
            makePrepaid: MakePrepaidFlag.WIRE,
            prepaidDate: "080125",
            forcedDiscount: FORCED_DISCOUNT_VALUES.NO,
            mode: PAYMENT_OPERATION_MODE.SAVE,
          },
        },
      },
      updateWire: {
        summary: "Update existing voucher (Wire)",
        value: {
          companyNo: 10,
          voucherToPay: PAYMENT_VOUCHER_TYPES.WIRE,
          bankAccountGl: 11000001,
          startingCheckNo: 300001,
          checkDate: "080125",
          dateToPayBy: "080225",
          item: {
            entrySequence: "00021",
            vendorNo: 1875,
            voucherNo: 50002,
            partialPayAmount: 2200.0,
            discountAmount: 50.0,
            payOrHold: "P",
            singleCheck: "",
            makePrepaid: MakePrepaidFlag.WIRE,
            prepaidDate: "080125",
            forcedDiscount: FORCED_DISCOUNT_VALUES.NO,
            mode: PAYMENT_OPERATION_MODE.EDIT,
          },
        },
      },
      deleteWire: {
        summary: "Delete voucher (Wire)",
        value: {
          companyNo: 10,
          voucherToPay: PAYMENT_VOUCHER_TYPES.WIRE,
          bankAccountGl: 11000001,
          startingCheckNo: 300001,
          checkDate: "080125",
          dateToPayBy: "080225",
          item: {
            entrySequence: "00022",
            vendorNo: 1875,
            voucherNo: 50003,
            partialPayAmount: 0.0,
            discountAmount: 0.0,
            payOrHold: "H",
            singleCheck: "",
            makePrepaid: MakePrepaidFlag.WIRE,
            prepaidDate: "080125",
            forcedDiscount: FORCED_DISCOUNT_VALUES.NO,
            mode: PAYMENT_OPERATION_MODE.DELETE,
          },
        },
      },
    },
  } as ApiBodyOptions,

  response: {
    status: 200,
    description: "Vendor payment processed successfully",
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Vendor Payment processed successfully",
        },
      },
    },
  } as ApiResponseOptions,
};

export const getCashRequirementReports = {
  path: "/payment/cash-requirement/reports",
  method: "GET",
  operation: {
    summary: "Get Cash Requirement Reports",
    description:
      "Fetch paginated cash requirement report metadata for the given voucher and report type.",
    operationId: "getCashRequirementReports",
    tags: ["Payment"],
    metaData: {
      accessRights: ["payment::cash-requirement::reports::read"],
    },
  } as ApiOperationOptions,

  query: {
    name: "GetCashRequirementReportDto",
    schema: {
      type: "object",
      properties: {
        voucherToPay: {
          type: "string",
          enum: PAYMENT_VOUCHER_TYPE_VALUES,
          example: PAYMENT_VOUCHER_TYPES.CHECK,
        },
        reportType: {
          type: "string",
          example: PAYMENT_REPORT_TYPES.AP_Cash_Requirement,
        },
      },
      required: ["voucherToPay", "reportType"],
    },
  },

  response: {
    status: 200,
    description: "Cash requirement report metadata retrieved successfully",
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
                example: PAYMENT_REPORT_TYPES.AP_Cash_Requirement,
              },
              fileName: { type: "string", example: "my-report.pdf" },
              reportDateTime: {
                type: "string",
                example: "2025-07-25T10:35:44.835Z",
              },
              filePath: { type: "string", example: "/files/my-report.pdf" },
            },
          },
        },
        pagination: {
          type: "object",
          properties: {
            total_items: { type: "number", example: 34 },
            current_page: { type: "number", example: 1 },
            items_per_page: { type: "number", example: 10 },
            total_pages: { type: "number", example: 4 },
          },
        },
      },
    },
  } as ApiResponseOptions,
};

export const getApCheckReports = {
  path: "/payment/ap-check/reports",
  method: "GET",
  operation: {
    summary: "Get AP Check Reports",
    description:
      "Fetch paginated AP Check report metadata for the given voucher type and report type.",
    operationId: "getApCheckReports",
    tags: ["Payment"],
    metaData: {
      accessRights: ["payment::ap-check::reports::read"],
    },
  } as ApiOperationOptions,

  query: {
    name: "GetApCheckReportDto",
    schema: {
      type: "object",
      properties: {
        voucherToPay: {
          type: "string",
          example: PAYMENT_VOUCHER_TYPES.CHECK,
        },
        reportType: {
          type: "string",
          example: "AP-Check-Printing",
        },
      },
      required: ["voucherToPay", "reportType"],
    },
  },

  response: {
    status: 200,
    description: "AP Check report metadata retrieved successfully",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              reportType: { type: "string", example: "AP-Check-Printing" },
              fileName: { type: "string", example: "ap-check-report.pdf" },
              reportDateTime: {
                type: "string",
                example: "2025-07-25T11:15:44.835Z",
              },
              filePath: {
                type: "string",
                example: "/files/ap-check-report.pdf",
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
};
