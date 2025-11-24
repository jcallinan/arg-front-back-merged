import { PROCESS_TYPE_ENUM } from "./constant";

// FLEXI header mapping (new human-readable headers to internal fields)
export const csvFlexiHeaderMapping = {
  invoiceNo: "INVOICE_NUMBER",
  vendorNo: "VENDOR_NUMBER",
  invoiceDate: "INVOICE_DATE",
  invoiceAmount: "TOTAL", // Same as invoiceDate in new format
  apGlNo: "apGlNo",
  invoiceDesc: "HEAD_LINE_DESCRIPTION",
  holdDesc: "NOTE",
  entryNo: "entryNo",
  companyNo: "companyNo",
  bankGl: "bankGl",
};

// FLEXI detail mapping (new human-readable headers to internal fields)
export const csvFlexiDetailMapping = {
  lineGlNo: "G/L_NUMBER",
  lineDesc: "DETAIL_LINE_DESCRIPTION",
  lineAmount: "LINE_TOTAL_PRICE_NET",
  discountAmount: "DISCOUNT_AMOUNT",
  discountPercentage: "DISCOUNT_PERCENT",
  quantity: "LINE_QUANTITY",
  gallons: "GALLONS",
  receiptNo: "RECEIPT_NUMBER",
  poLineNo: "LAYOUT_LINE_ITEM",
  productAmount: "LINE_PRICE",
  poNo: "ARG_PO_NUMBER",
  entrySequence: "entrySequence",
  entryNo: "entryNo",
  companyNo: "companyNo",
};

// FLEXI headers (new human-readable format)
export const FLEXI_XLSX_HEADERS = [
  "PATH",
  "INVOICE_NUMBER",
  "INVOICE_DATE",
  "TOTAL",
  "CURRENCY",
  "DISCOUNT_AMOUNT",
  "VENDOR_NAME",
  "VENDOR_NUMBER",
  "NOTE",
  "TYPE",
  "DETAIL_LINE_DESCRIPTION",
  "LINE_QUANTITY",
  "LINE_PRICE",
  "LINE_TOTAL_PRICE_NET",
  "G/L_NUMBER",
  "GALLONS",
  "RECEIPT_NUMBER",
  "LAYOUT_LINE_ITEM",
  "DISCOUNT_PERCENT",
  "BATCH_ID",
  "SOURCE",
  "USER_ID",
  "HEAD_LINE_DESCRIPTION",
  "ARG_PO_NUMBER",
];

export const totalBatchSize = 5;

export const MAX_PARALLEL_GROUP_PROCESSING = 5;

// Clear Checks Excel headers and mappings (new human-readable format)
export const CLEAR_CHECKS_XLSX_HEADERS = [
  "CHECK_NO",
  "CHECK_AMOUNT",
  "YEAR",
  "MONTH",
  "DATE",
];

export const csvClearChecksMapping = {
  checkNo: "CHECK_NO",
  checkAmount: "CHECK_AMOUNT",
  year: "YEAR",
  month: "MONTH",
  date: "DATE",
};

// SOGAS header mapping (new human-readable headers to internal fields)
// Note: Vendor fields and hold/payment fields are NOT included here—they are populated in the processor after lookup, not from the CSV.
export const csvSogasHeaderMapping = {
  ownerNo: "OWNER_NUMBER", // for lookup only, not for DB save
  invoiceNo: "CHECK#",
  invoiceDate: "CHECK_DATE",
  invoiceAmount: "AMOUNT",
  apGlNo: "apGlNo",
  entryNo: "entryNo",
  companyNo: "companyNo",
  bankGl: "bankGl",
  dueDate: "PAYMENT_DUE_DATE",
  processType: PROCESS_TYPE_ENUM.SOGAS,
};

// SOGAS detail mapping (new human-readable headers to internal fields)
export const csvSogasDetailMapping = {
  lineGlNo: "lineGlno",
  lineDesc: "CHECK#",
  lineAmount: "AMOUNT",
  productAmount: "AMOUNT",
  entrySequence: "entrySequence",
  entryNo: "entryNo",
  companyNo: "companyNo",
  vendorNo: "vendorNo",
};

// SOGAS headers (new human-readable format)
export const SOGAS_XLSX_HEADERS = [
  "OWNER_NUMBER",
  "OWNER_NAME",
  "CHECK#",
  "CHECK_DATE",
  "AMOUNT",
  "ACCOUNTING_DATE",
  "PERIOD_ENDING",
  "PAYMENT_DUE_DATE",
];
