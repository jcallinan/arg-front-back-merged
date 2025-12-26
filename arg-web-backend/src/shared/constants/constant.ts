export const FIELD_NAMES = {
  PROCESS_TYPE: [
    { id: 1, value: "NORMAL", label: "Normal" },
    { id: 2, value: "ARGLMS", label: "LMS" },
    { id: 3, value: "PAPER", label: "Paper" },
    { id: 4, value: "FLEXI", label: "Flexi" },
    { id: 5, value: "SOGAS", label: "SOGAS" },
  ],
  DETAIL: {
    DISCOUNT_AMOUNT: "discountAmount",
    DISCOUNT_PERCENTAGE: "discountPercentage",
    LINE_GL_NO: "lineGlNo",
    GALLONS: "gallons",
    RECEIPT_NO: "receiptNo",
    PO_NO: "poNo",
    IS_DELETED: "isDeleted",
    OPEN_CLOSED: "openClosed",
    QUANTITY: "quantity",
  },
  HEADER: {
    INVOICE_NO: "invoiceNo",
    SALES_ORDER_NO: "salesOrderNo",
    SRN: "srn",
    HOLD_CODE: "holdCode",
    DISCOUNT_DUE_DATE: "discountDueDate",
    DUE_DATE: "dueDate",
    AP_GL: "apGlNo",
    BANK_GL: "bankGl",
  },
  YES: "Y",
  NO: "N",
  M: "M",
  C: "C",
  STATUS: {
    DELETED: "D",
    INACTIVE: "I",
  },
};

export const STATUS = {
  DELETED: "D",
  INACTIVE: "I",
};

export const BANK_STATUS = {
  R: "Cleared",
  O: "Open",
  V: "Voided",
};

export const HEADER = {
  INVOICE_NO: "invoiceNo",
  SALES_ORDER_NO: "salesOrderNo",
  SRN: "srn",
  HOLD_CODE: "holdCode",
  DISCOUNT_DUE_DATE: "discountDueDate",
  DUE_DATE: "dueDate",
  AP_GL: "apGlNo",
  BANK_GL: "bankGl",
  TOTAL_FREIGHT: "totalFreight",
  INVOICE_DATE: "invoiceDate",
  INVOICE_AMOUNT: "invoiceAmount",
};

export const INVOICE_TYPE = {
  P: "P",
  O: "O",
  S: "S",
};

export const HOLD_CODE = {
  A: "A",
  W: "W",
};

export const PREPAID = {
  P: "P",
};

export const QUEUE_NAMES = {
  FLEXI: "flexi-queue",
  SOGAS: "sogas-queue",
  PAPER: "paper-queue",
  CLEAR_CHECKS: "clear-checks-queue",
};

export const YES = "Y";
export const NO = "N";
export const M = "M";
export const C = "C";

export enum PROCESS_TYPE_ENUM {
  NORMAL = "NORMAL",
  ARGLMS = "LMS",
  PAPER = "PAPER",
  FLEXI = "FLEXI",
  SOGAS = "SOGAS",
}

export enum IsDeletedStatus {
  ACTIVE = "N",
  DELETED = "D",
  INACTIVE = "I",
}

export enum AMCODE {
  DELETED = "D",
  RECONCILED = "R",
  VOIDED = "V",
  OPEN = "O",
}

export const APPROVAL_STATUS = {
  Y: "Y",
  N: "N",
};

export enum Report_Type {
  OPEN_PAYABLES = "Open-Payables",
  VOUCHER_POSTING = "Voucher-Posting",
  VENDOR_REPORTS = "Vendor-Reports",
  VENDOR_REPORT = "Vendor-Report",
  AP_MONTH_END = "AP-MONTH-END",
  AP_PAYMENT_CYCLE = "AP-Payment-Cycle",
  CHECK_REGISTER = "Check-Register",
  EMPLOYEE_EXPENSE = "Employee-Expense"
}


export const Employee_Expense = {
  SUMMARY: "Employee-Expense-Summary",
  DETAILED: "Employee-Expense-Detailed",
}

export const OPEN_PAYABLES_TYPES = {
  OPEN_PAYABLES_BY_DUE_DATE: "Open-Payables-By-Due-Date",
  OPEN_PAYABLES_IN_HOLD_STATUS: "Open-Payables-in-Hold-Status",
  OPEN_PAYABLES_BY_VENDOR_DISCOUNTS: "Open-Payables-By-Vendor-Discounts",
  OPEN_PAYABLES_BY_VENDOR_AGED: "Open-Payables-by-Vendor(Aged)",
};

export const PURCHASE_JOURNAL = {
  AP_Purchase_Journal: "AP-Purchase-Journal",
  Inventory_Receipts_Posting: "Inventory-Receipts-Posting",
  AP_Purchase_Register: "AP-Purchase-Register",
}

export const Open_Payables_STORE_PROCEDURE = {
  "Open-Payables-By-Due-Date": "AP700PRC",
  "Open-Payables-in-Hold-Status": "AP700PRC",
  "Open-Payables-By-Vendor-Discounts": "AP711PRC",
  "Open-Payables-by-Vendor(Aged)": "AP710PRC",
};

export enum INVOICE_DESCRIPTION {
  PAPER = "FREIGHT INVOICE / PAPER",
  LMS = "FREIGHT INVOICE / LMS",
}

export const REPORTS_MENU_TYPES = {
  AP_Month_End_Vendor_Totals: "AP-Month-End-Vendor-Totals",
  Outstanding_Check_Register: "Outstanding-Check-Register",
  AP_Month_End_Vendor_Subtotals: "AP-Month-End-Vendor-Subtotals",
  AP_Month_End_Vendor_Details: "AP-Month-End-Vendor-Details"
};

export const PAYMENT_REPORT_TYPES = {
  AP_Cash_Requirement: "AP-Cash-Requirements",
  AP_Nacha_ACH_Creation: "AP-Nacha-ACH-Creation",
  AP_Check_Printing: "AP-Check-Printing",
  AP_Check_Copies_Creation: "AP-Check-Copies-Creation"
}

export const AP_REPORT_TYPES = {
  AP_Vendor_1099_Register: "AP-Vendor-1099-Register",
  Print_1099_File_Edit: "Print-1099-File-Edit",
  Printing_1099_File: "Printing-1099-File",
}

export const REPORT_MENU_STORE_PROCEDURE = {
  AP_Month_End_Vendor_Totals: "AP360PRC",
  Outstanding_Check_Register: "AP340PRC",
  AP_Month_End_Vendor_Subtotals: "AP360PRC",
  AP_Month_End_Vendor_Details: "AP360PRC",
};

export const POST_TO_PURCHASE_JOURNAL_STORE_PROCEDURE = {
  AP200PRC: "AP200PRC",
};
export enum VendorType {
  A = "ACH",
  W = "Wire Transfer",
  E = "Employee Expense",
  H = "Hold",
  U = "Utility",
  N = 'None'
}

export const VENDOR_STATUS = {
  A: "Active",
  I: "Inactive",
};

export enum PROCESS_TYPE_EVENT {
  PAPER = "paper-batch-status",
  LMS = "lms-batch-status",
}

export const DEFAULT_DISCOUNT_DUE_DATE = "0";

export const VendorManagementDropdownTypes = {
  VENDOR_TERMS_CODE: "APTERM",
  VENDOR_GAL_RECEIPT: "APRQCD",
  VENDOR_CATEGORY: "APCATG",
  AP_1099: "AP1099",
  VENDOR_FORM_TYPE: "FRMTYP",
}

export const VendorDescriptionList = {
  vendorApTermsCode: "APTERM",
  vendorAp1099Code: "AP1099",
  formtype: "FRMTYP",
  vendorCategoryCode: "APCATG",
}

export const VENDOR_FILE_NAMES = {
  BACKUP_FILES: [
    'GU1VEND',
    'GU2VEND',
    'GU3VEND',
    'GU4VEND',
    'GU5VEND',
    'GU6VEND',
    'GU7VEND',
    'GU8VEND',
    'GUAVEND',
    'GUBVEND',
    'GUCVEND'
  ],
} as const;

export const environments = {
  localhost: "localhost",
  dev: "dev",
  test: "test",
  uat: "uat",
  prod: "prod",
} ;
