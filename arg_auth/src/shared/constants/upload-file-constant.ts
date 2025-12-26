import { PROCESS_TYPE_ENUM } from "./constant";

export const csvFlexiHeaderMapping = {
  invoiceNo: "AUINNO",
  vendorNo: "AUVNNO",
  invoiceDate: "AUDATE",
  invoiceAmount: "AUTOTL",
  apGlNo: "AUDGL#",
  invoiceDesc: "AUHDSC",
  holdDesc: "AUNOTE",
  entryNo: "entryNo",
  companyNo: "companyNo",
  bankGl: "bankGl",
};

export const csvFlexiDetailMapping = {
  lineGlNo: "AUDGL#",
  lineDesc: "AUDDSC",
  lineAmount: "AUDTPN",
  discountAmount: "AUDISC",
  discountPercentage: "AUDSPC",
  quantity: "AUDQTY",
  gallons: "AUDGAL",
  receiptNo: "AUDRC#",
  poLineNo: "AUDLAY",
  productAmount: "AUDPRC",
  poNo: "AUPONM",
  entrySequence: "entrySequence",
  entryNo: "entryNo",
  companyNo: "companyNo",
};

export const FLEXI_XLSX_HEADERS = [
  "AUPATH",
  "AUINNO",
  "AUDATE",
  "AUTOTL",
  "AUCURR",
  "AUDISC",
  "AUVNAM",
  "AUVNNO",
  "AUNOTE",
  "AUTYPE",
  "AUDDSC",
  "AUDQTY",
  "AUDPRC",
  "AUDTPN",
  "AUDGL#",
  "AUDGAL",
  "AUDRC#",
  "AUDLAY",
  "AUDSPC",
  "AUBTCH",
  "AUSRCE",
  "AUUSER",
  "AUHDSC",
  "AUPONM",
];

export const totalBatchSize = 5;

export const MAX_PARALLEL_GROUP_PROCESSING = 5;

// Clear Checks Excel headers and mappings
export const CLEAR_CHECKS_XLSX_HEADERS = [
  "check No",
  "Check Amount",
  "year",
  "month",
  "date",
];

export const csvClearChecksMapping = {
  checkNo: "check No",
  checkAmount: "Check Amount",
  year: "year",
  month: "month",
  date: "date",
};

// SOGAS header mapping (from user-provided file structure)
// Note: Vendor fields and hold/payment fields are NOT included here—they are populated in the processor after lookup, not from the CSV.
export const csvSogasHeaderMapping = {
  ownerNo: "ATOWNR", // for lookup only, not for DB save
  invoiceNo: "ATCKNM",
  invoiceDate: "ATDUDT",
  invoiceAmount: "ATCKAM",
  apGlNo: "apGlNo",
  entryNo: "entryNo",
  companyNo: "companyNo",
  bankGl: "bankGl",
  dueDate: "ATDUDT",
  processType: PROCESS_TYPE_ENUM.SOGAS,
};

export const csvSogasDetailMapping = {
  lineGlNo: "lineGlno",
  lineDesc: "ATCKNM",
  lineAmount: "ATCKAM",
  productAmount: "ATCKAM",
  entrySequence: "entrySequence",
  entryNo: "entryNo",
  companyNo: "companyNo",
  vendorNo: "vendorNo",
};

// SOGAS expected headers (regular and tax are the same for now)
export const SOGAS_XLSX_HEADERS = [
  "ATOWNR",
  "ATNAME",
  "ATCKNM",
  "ATDATE",
  "ATCKAM",
  "ATSTDT",
  "ATENDT",
  "ATDUDT",
];
