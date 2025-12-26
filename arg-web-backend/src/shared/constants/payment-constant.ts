export const PAYMENT_VOUCHER_TYPES = {
  CHECK: "Check",
  ACH: "ACH",
  WIRE: "Wire",
  EMPLOYEE_EXPENSE: "Employee Expense",
  UTILITY: "Utility",
} as const;

export const KEY_HOLD_CODES = {
  [PAYMENT_VOUCHER_TYPES.CHECK]: "",
  [PAYMENT_VOUCHER_TYPES.ACH]: "A",
  [PAYMENT_VOUCHER_TYPES.WIRE]: "W",
  [PAYMENT_VOUCHER_TYPES.EMPLOYEE_EXPENSE]: "E",
  [PAYMENT_VOUCHER_TYPES.UTILITY]: "U",
} as const;

export const ALLOWED_VOUCHER_TO_PAY_VALUES = Object.values(KEY_HOLD_CODES);

export const RESTRICTED_HOLD_CODES = [
  KEY_HOLD_CODES[PAYMENT_VOUCHER_TYPES.ACH], // 'A'
  KEY_HOLD_CODES[PAYMENT_VOUCHER_TYPES.WIRE], // 'W'
  KEY_HOLD_CODES[PAYMENT_VOUCHER_TYPES.EMPLOYEE_EXPENSE], // 'E'
  KEY_HOLD_CODES[PAYMENT_VOUCHER_TYPES.UTILITY], // 'U'
];

export const PAYMENT_OPERATION_MODE = {
  SAVE: "I",
  EDIT: "U",
  DELETE: "D",
} as const;

export const PAYMENT_VOUCHER_TYPE_VALUES = Object.values(PAYMENT_VOUCHER_TYPES);
export const PAYMENT_OPERATION_MODE_VALUES = Object.values(
  PAYMENT_OPERATION_MODE
);

export const PAYMENT_VOUCHER_TYPE_DROPDOWN = [
  {
    id: 1,
    value: PAYMENT_VOUCHER_TYPES.CHECK,
    label: PAYMENT_VOUCHER_TYPES.CHECK,
  },
  { id: 2, value: PAYMENT_VOUCHER_TYPES.ACH, label: PAYMENT_VOUCHER_TYPES.ACH },
  {
    id: 3,
    value: PAYMENT_VOUCHER_TYPES.WIRE,
    label: PAYMENT_VOUCHER_TYPES.WIRE,
  },
  {
    id: 3,
    value: PAYMENT_VOUCHER_TYPES.EMPLOYEE_EXPENSE,
    label: PAYMENT_VOUCHER_TYPES.EMPLOYEE_EXPENSE,
  },
  {
    id: 4,
    value: PAYMENT_VOUCHER_TYPES.UTILITY,
    label: PAYMENT_VOUCHER_TYPES.UTILITY,
  },
];

export type PaymentOperationMode =
  (typeof PAYMENT_OPERATION_MODE)[keyof typeof PAYMENT_OPERATION_MODE];
export type PaymentVoucherType =
  (typeof PAYMENT_VOUCHER_TYPES)[keyof typeof PAYMENT_VOUCHER_TYPES];

export const PAYMENT_TYPE_VALIDATION_FIELDS = {
  COMPANY_NO: "companyNo",
  VOUCHER_TO_PAY: "voucherToPay",
  STARTING_CHECK_NO: "startingCheckNo",
  CHECK_DATE: "checkDate",
  DATE_TO_PAY_BY: "dateToPayBy",
  BANK_ACCOUNT_GL: "bankAccountGl",
  FORCED_DISCOUNT: "forcedDiscount",
  MODE: "mode",
};

export const FORCED_DISCOUNT_VALUES = {
  YES: "D",
  NO: "",
};

export type ForcedDiscount =
  (typeof FORCED_DISCOUNT_VALUES)[keyof typeof FORCED_DISCOUNT_VALUES];

export const PAYMENT_STORE_PROCEDURE = {
  AP150ACLPRC: "AP150ACLPRC",
  APPYTRHCLPRC: "APPYTRHCLPRC",
  APPYTRDCLPRC: "APPYTRDCLPRC",
};

export enum PAY_OR_HOLD_CODES {
  PAY = "P",
  HOLD = "H",
}

export enum SingleCheckFlag {
  SINGLE = "S",
  NONE = "",
}

export enum MakePrepaidFlag {
  NONE = "",
  PREPAID = "P",
  ADVANCE = "A",
  WIRE = "W",
  EMPLOYEE_EXPENSE = "E",
  UTILITY = "U",
}

export const KYHOLD_TO_MAKE_PREPAID: Record<string, string> = {
  "": MakePrepaidFlag.PREPAID, // No hold → prepaid required
  A: MakePrepaidFlag.ADVANCE, // 'A'
  W: MakePrepaidFlag.WIRE, // 'W'
  E: MakePrepaidFlag.EMPLOYEE_EXPENSE, // 'E'
  U: MakePrepaidFlag.UTILITY, // 'U'
};
