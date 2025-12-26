/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum PROCESS_TYPE_ENUM {
  NORMAL = "NORMAL",
  LMS = "LMS",
  PAPER = "PAPER",
  FLEXI = "FLEXI",
  SOGAS = "SOGAS",
}

export interface SoftDeleteVoucherDto {
  /** Entry number */
  entryNo: number;
  /** Company number */
  companyNo: number;
  /** Vendor number */
  vendorNo: number;
  /** Invoice number */
  invoiceNo: string;
}

export interface SoftDeleteVoucherDetailDto {
  /**
   * Company number
   * @example 10
   */
  companyNo: number;
  /**
   * Vendor number
   * @example 1001
   */
  vendorNo: number;
  /**
   * Entry number
   * @example 12345
   */
  entryNo: number;
  /**
   * Entry sequence number
   * @example 1
   */
  entrySequenceNo: number;
}

export type Object = object;

export interface GenerateReportDto {
  /**
   * Company Number
   * @example "10"
   */
  companyNo: number;
  /**
   * Open Payable
   * @example "10"
   */
  openPayables: string;
  /**
   * Hold Voucher
   * @example "10"
   */
  holdVoucher?: string;
  /**
   * Date One
   * @format date-time
   * @example "10"
   */
  dateOne?: string;
  /**
   * Date Two
   * @example "10"
   */
  dateTwo?: string;
  /**
   * Date Three
   * @example "10"
   */
  dateThree?: string;
  /**
   * Date 4
   * @example "10"
   */
  dateFour?: string;
  /**
   * Populate Spreedsheet
   * @example "Y"
   */
  populateSpreadsheet?: string;
}

export interface UpdateVoucherStatusDto {
  /**
   * Company number
   * @example 10
   */
  companyNo: number;
  /**
   * Vendor number
   * @example 12345
   */
  vendorNo: number;
  /**
   * Voucher number
   * @example 67890
   */
  voucherNo: number;
  /**
   * Voucher maintenance status code for the voucher
   * @example "H"
   */
  statusCode: " " | "H" | "A" | "W" | "E" | "U";
  /**
   * Status description for the voucher
   * @maxLength 25
   * @example "Voucher placed on hold for review"
   */
  statusDescription: string;
}

export interface UpdateDiscountDto {
  /**
   * Company number
   * @example 10
   */
  companyNo: number;
  /**
   * Vendor number
   * @example 12345
   */
  vendorNo: number;
  /**
   * Voucher number
   * @example 67890
   */
  voucherNo: number;
  /**
   * Discount due date (MMDDYY format)
   * @pattern ^\d{6}$
   * @example "011524"
   */
  discountDueDate: string;
  /**
   * Discount amount
   * @min 0
   * @example 50
   */
  discount: number;
}

export interface TransferVoucherDto {
  /**
   * Voucher type to transfer
   * @example "UNPAID"
   */
  voucherType: "UNPAID" | "PAID" | "ALL" | "CANCELLED";
  /**
   * Company number
   * @example 10
   */
  companyNo: number;
  /**
   * Vendor number
   * @example 12345
   */
  vendorNo: number;
  /**
   * Voucher number
   * @example 67890
   */
  voucherNo: number;
}

export interface VendorContactDetailDto {
  /**
   * Form Type Cdoe
   * @example 1100
   */
  formType?: string;
  /**
   * Contact Name
   * @example "Contact Name"
   */
  contactName?: string;
  /**
   * Delete Code
   * @example "I"
   */
  deleteCode?: string;
  /**
   * Email Address
   * @example "Email Address"
   */
  emailAddress?: string;
  /**
   * Include ACH Email
   * @example "Y"
   */
  sendAchEmail?: string;
  /**
   * comments
   * @example "test"
   */
  filler?: string;
  /**
   * Sequence Number
   * @example 4538
   */
  sequenceNumber?: number;
}

export interface VendorandVendorContactDetailsInputDto {
  /**
   * Vendor Deleted
   * @example "A"
   */
  vendorIsDeleted: string;
  /**
   * Vendor Is Active
   * @example "A"
   */
  vendorNameOverflow: string;
  /**
   * Company No
   * @example 10
   */
  vendorCompanyNumber: number;
  /**
   * Vendor No
   * @example 1100
   */
  vendorNo: number;
  /**
   * Vendor Name
   * @example "ABCOTT Consulting"
   */
  vendorName: string;
  /**
   * Vendor Address 1
   * @example "Address"
   */
  vendorAdd1?: string;
  /**
   * Vendor Address 2
   * @example "Address"
   */
  vendorAdd2?: string;
  /**
   * Vendor Address 3
   * @example "Address"
   */
  vendorAdd3?: string;
  /**
   * Vendor Address 4
   * @example "Address"
   */
  vendorAdd4?: string;
  /**
   * Country
   * @example "US"
   */
  vendorCountryCode: string;
  /**
   * 1099 Id
   * @example "test"
   */
  IdNo1099?: string;
  /**
   * ZipCode
   * @example 40110
   */
  vendorZipCode: number;
  /**
   * Phone Area Code
   * @example 123
   */
  vendorAreaCode?: number;
  /**
   * Phone Number
   * @example 996793
   */
  vendorTelephoneNo?: number;
  /**
   * Hold Vendor
   * @example "A"
   */
  vendorHoldPaymentsVend?: string;
  /**
   * Gal/Rcpts Required
   * @example "A"
   */
  vendorGalRcptsRequired?: string;
  /**
   * Single Check
   * @example "A"
   */
  vendorSingleCheck?: string;
  /**
   * Terms Code
   * @example 10
   */
  vendorApTermsCode?: number;
  /**
   * ADP Payroll ID
   * @example 123
   */
  vendorAdpPayrollId?: number;
  /**
   * Category
   * @example "INACT"
   */
  vendorCategoryCode?: string;
  /**
   * Carrier
   * @example "ACSS"
   */
  vendorCarrierId?: string;
  /**
   * Expense GL
   * @example 12345678
   */
  vendorExpenseGLSub?: number;
  /**
   * ACH Bank Account
   * @example "12345678901234567"
   */
  vendorAchBankAccountNumber?: string;
  /**
   * ACH Bank Routing
   * @example 123456789
   */
  vendorAchBankRoutingCode?: number;
  /**
   * ACH Checking or Savings
   * @example "C"
   */
  vendorAchCheckingOrSavings?: string;
  /**
   * ACH Class
   * @example "ABC"
   */
  vendorAchClass?: string;
  /**
   * First Name
   * @example "John"
   */
  vendorFirstName?: string;
  /**
   * Middle Name
   * @example "M"
   */
  vendorMiddleName?: string;
  /**
   * Last Name
   * @example "Doe"
   */
  vendorBusinessLastName?: string;
  /**
   * Suffix
   * @example "Jr"
   */
  vendorNameSuffix?: string;
  /**
   * 1099 Code
   * @example "A"
   */
  vendorAp1099Code?: string;
  /**
   * 1st 1099 Box#
   * @example 10
   */
  vendorFirst1099BoxNumber?: number;
  /**
   * 2nd Box#
   * @example 20
   */
  vendorSecond1099BoxNumber?: number;
  /**
   * 2nd Box Amt
   * @example 2000.5
   */
  vendorSecond1099BoxAmount?: number;
  /**
   * Payee #1
   * @example "John Smith"
   */
  vendorPayeeName1?: string;
  /**
   * Payee #2
   * @example "Jane Smith"
   */
  vendorPayeeName2?: string;
  /**
   * IRS Name Control
   * @example "CTRL"
   */
  vendorIrsNameControl?: string;
  /**
   * This Year YTD Paid
   * @example 2000.5
   */
  vendorThisYrYtdPaid?: number;
  /** Vendor Contact Details */
  contactDetails?: VendorContactDetailDto[];
}

export interface VendorOwnerDto {
  /**
   * Owner No
   * @example 63
   */
  ownerNo: number;
  /**
   * Vendor No
   * @example 1444
   */
  vendorNo: number;
  /**
   * Status
   * @example "I"
   */
  isDeleted: string;
}

export interface VendorYearEndProcessDto {
  /**
   * Company Number
   * @example 10
   */
  companyNo: number;
  /**
   * Year for vendor year-end process
   * @example "2024"
   */
  year: string;
  /**
   * Clear Year to Date Fields
   * @example false
   */
  clearYTD?: boolean;
}

export type RecordFormatT1009IDto = object;

export type RecordFormatA1099Dto = object;

export type RecordFormatB1009IDto = object;

export interface ApPeriodEndBodyDto {
  /**
   * Tin Number
   * @example "10"
   */
  tin: string;
  /**
   * Ctl
   * @example "10"
   */
  ctl: string;
  /** Payload data object */
  data?: RecordFormatT1009IDto | RecordFormatA1099Dto | RecordFormatB1009IDto;
}

export interface ApPeriodEndDto {
  /**
   * Tin Number
   * @example "10"
   */
  tin: string;
  /**
   * Ctl
   * @example "10"
   */
  ctl: string;
}

export interface VendorDetailsDto {
  /**
   * Vendor Deleted
   * @example "A"
   */
  vendorIsDeleted: string;
  /**
   * Vendor Is Active
   * @example "A"
   */
  vendorNameOverflow: string;
  /**
   * Company No
   * @example 10
   */
  vendorCompanyNumber: number;
  /**
   * Vendor No
   * @example 1100
   */
  vendorNo: number;
  /**
   * Vendor Name
   * @example "ABCOTT Consulting"
   */
  vendorName: string;
  /**
   * Vendor Address 1
   * @example "Address"
   */
  vendorAdd1?: string;
  /**
   * Vendor Address 2
   * @example "Address"
   */
  vendorAdd2?: string;
  /**
   * Vendor Address 3
   * @example "Address"
   */
  vendorAdd3?: string;
  /**
   * Vendor Address 4
   * @example "Address"
   */
  vendorAdd4?: string;
  /**
   * Country
   * @example "US"
   */
  vendorCountryCode: string;
  /**
   * 1099 Id
   * @example "test"
   */
  IdNo1099?: string;
  /**
   * ZipCode
   * @example 40110
   */
  vendorZipCode: number;
  /**
   * Phone Area Code
   * @example 123
   */
  vendorAreaCode?: number;
  /**
   * Phone Number
   * @example 996793
   */
  vendorTelephoneNo?: number;
  /**
   * Hold Vendor
   * @example "A"
   */
  vendorHoldPaymentsVend?: string;
  /**
   * Gal/Rcpts Required
   * @example "A"
   */
  vendorGalRcptsRequired?: string;
  /**
   * Single Check
   * @example "A"
   */
  vendorSingleCheck?: string;
  /**
   * Terms Code
   * @example 10
   */
  vendorApTermsCode?: number;
  /**
   * ADP Payroll ID
   * @example 123
   */
  vendorAdpPayrollId?: number;
  /**
   * Category
   * @example "INACT"
   */
  vendorCategoryCode?: string;
  /**
   * Carrier
   * @example "ACSS"
   */
  vendorCarrierId?: string;
  /**
   * Expense GL
   * @example 12345678
   */
  vendorExpenseGLSub?: number;
  /**
   * ACH Bank Account
   * @example "12345678901234567"
   */
  vendorAchBankAccountNumber?: string;
  /**
   * ACH Bank Routing
   * @example 123456789
   */
  vendorAchBankRoutingCode?: number;
  /**
   * ACH Checking or Savings
   * @example "C"
   */
  vendorAchCheckingOrSavings?: string;
  /**
   * ACH Class
   * @example "ABC"
   */
  vendorAchClass?: string;
  /**
   * First Name
   * @example "John"
   */
  vendorFirstName?: string;
  /**
   * Middle Name
   * @example "M"
   */
  vendorMiddleName?: string;
  /**
   * Last Name
   * @example "Doe"
   */
  vendorBusinessLastName?: string;
  /**
   * Suffix
   * @example "Jr"
   */
  vendorNameSuffix?: string;
  /**
   * 1099 Code
   * @example "A"
   */
  vendorAp1099Code?: string;
  /**
   * 1st 1099 Box#
   * @example 10
   */
  vendorFirst1099BoxNumber?: number;
  /**
   * 2nd Box#
   * @example 20
   */
  vendorSecond1099BoxNumber?: number;
  /**
   * 2nd Box Amt
   * @example 2000.5
   */
  vendorSecond1099BoxAmount?: number;
  /**
   * Payee #1
   * @example "John Smith"
   */
  vendorPayeeName1?: string;
  /**
   * Payee #2
   * @example "Jane Smith"
   */
  vendorPayeeName2?: string;
  /**
   * IRS Name Control
   * @example "CTRL"
   */
  vendorIrsNameControl?: string;
  /**
   * This Year YTD Paid
   * @example 2000.5
   */
  vendorThisYrYtdPaid?: number;
}

export interface EmployeeExpenseGenerateReportDto {
  /**
   * Company Number
   * @example "10"
   */
  companyNo: number;
  /**
   * Bank GL No
   * @example 62890262
   */
  bankGlNo: number;
  /**
   * Date To Pay
   * @example "20251125"
   */
  dateToPay: string;
}

export interface SpParameterDto {
  /**
   * Parameter name
   * @example "Company"
   */
  name: string;
  /**
   * Parameter value
   * @example "10"
   */
  value: string;
}

export interface ExecuteSpDto {
  /**
   * Report name as kebab case
   * @example "Open-Payables-By-Due-Date"
   */
  name: string;
  /**
   * Parameters to pass to the stored procedure
   * @example [{"name":"Company","value":"10"},{"name":"Hold","value":"N"}]
   */
  parameters: SpParameterDto[];
}

export interface GetCompaniesParams {
  /** Search term for filtering results */
  search?: string;
  /**
   * Page number for pagination
   * @default 1
   */
  current_page?: number;
  /**
   * Limit:Number of items per page
   * @default 500
   */
  items_per_page?: number;
  /** Sort field */
  sortBy?: string;
  /** Sort direction (asc or desc) */
  sortOrder?: "asc" | "desc";
}

export interface GetAllVendorsParams {
  /** Search term for filtering results */
  search?: string;
  /**
   * Page number for pagination
   * @default 1
   */
  current_page?: number;
  /**
   * Limit:Number of items per page
   * @default 500
   */
  items_per_page?: number;
  /** Sort field */
  sortBy?: string;
  /** Sort direction (asc or desc) */
  sortOrder?: "asc" | "desc";
  /** Company Number */
  companyNo: number;
  /** Include Deleted Vendor */
  includeIsDeleted?: string;
}

export interface GetVendorByIdParams {
  /** Vendor Number */
  vendorNo: number;
  /** Company Number */
  companyNo: number;
}

export interface CacheDataPayload {
  /**
   * Company number to cache vendors for
   * @example 10
   */
  companyNo: number;
}

export interface GetVoucherEntryParams {
  /** Search term for filtering results */
  search?: string;
  /**
   * Page Number
   * @default 1
   */
  current_page?: number;
  /**
   * Limit per Page
   * @default 500
   */
  items_per_page?: number;
  /** Sort By */
  sortBy?: string;
  /** Sort Order asc or desc */
  sortOrder?: "asc" | "desc";
  /**
   * Company Number
   * @example 10
   */
  companyNo: number;
  /**
   * Vendor Number
   * @example 1001
   */
  vendorNo?: number;
  /**
   * Entry Number
   * @example 81293
   */
  entryNo?: number;
  /**
   * Process Type
   * @example "NORMAL"
   */
  processType?: string;
}

export interface GetDataByEntryNoParams {
  /**
   * Company Number
   * @example "10"
   */
  companyNo: number;
  /**
   * Vendor Number
   * @example "02339"
   */
  vendorNo?: number;
  entryNo: string;
}

export interface SubmitVoucherPayload {
  header: {
    /** @example "N" */
    isDeleted?: string;
    /** @example 10 */
    companyNo: number;
    /** @example 19042 */
    entryNo: number;
    /** @example 1 */
    entrySequence?: number;
    /** @example 1001 */
    vendorNo: number;
    /** @example 0 */
    canceledVoucher?: number;
    /** @example 11230024 */
    apGlNo: number;
    /** @example "Office Supplies" */
    invoiceDesc?: string;
    /** @example "112325" */
    invoiceDate: string;
    /** @example "112325" */
    dueDate?: string;
    /** @example "Y" */
    singleCheck?: string;
    /** @example "N" */
    holdCode?: string;
    /** @example "No Hold" */
    holdDesc?: string;
    /** @example "N" */
    prepaidCode?: string;
    /** @example 0 */
    prepaidCheckNo?: number;
    /** @example "Vendor Name" */
    vendorName?: string;
    /** @example "Address 1" */
    vendorAdd1?: string;
    /** @example "Address 2" */
    vendorAdd2?: string;
    /** @example "" */
    vendorAdd3?: string;
    /** @example "" */
    vendorAdd4?: string;
    /** @example 11230024 */
    bankGl: number;
    /** @example 100000 */
    invoiceAmount: number;
    /** @example 11230024 */
    retentionGl?: number;
    /** @example 10 */
    retentionPct?: number;
    /** @example "112325" */
    prepaidCheckdate?: string;
    /** @example 0 */
    totalFreight?: number;
    /** @example 12059 */
    salesOrderNo?: number;
    /** @example 1 */
    srn?: number;
    /** @example "000000" */
    carrierId?: string;
    /** @example 0 */
    vendorPaymentTerms?: number;
    /** @example "NORMAL" */
    processType: string;
    /** @example "20240415" */
    discountDueDate?: string;
    /** @example "20240416" */
    extendedDiscountDueDate?: string;
    /** @example "1001" */
    invoiceNo: string;
  };
  details: {
    /** @example "N" */
    isDeleted?: string;
    /** @example 10 */
    companyNo: number;
    /** @example 19042 */
    entryNo?: number;
    /** @example 1 */
    entrySequence?: number;
    /** @example 1001 */
    vendorNo?: number;
    /** @example 10 */
    lineCompanyNo?: number;
    /** @example 11230024 */
    lineGlNo: number;
    /** @example "Office Supplies" */
    lineDesc?: string;
    /** @example 100000 */
    lineAmount?: number;
    /** @example 0 */
    discountAmount?: number;
    /** @example 0 */
    discountPercentage?: number;
    /** @example "SUP001" */
    inventoryItem?: string;
    /** @example 1 */
    quantity?: number;
    /** @example "JOB001" */
    jobNo?: string;
    /** @example "COST001" */
    jobCostCode?: string;
    /** @example "L" */
    jobCostType?: string;
    /** @example 1 */
    jobCostQuantity?: number;
    /** @example 0 */
    gallons?: number;
    /** @example 0 */
    receiptNo?: number;
    /** @example "O" */
    openClosed?: string;
    /** @example 1 */
    poLineNo?: number;
    /** @example 100000 */
    productAmount: number;
    /** @example 0 */
    freightAmount?: number;
    /** @example "PO001" */
    poNo?: string;
  }[];
}

export interface SubmitHeaderValidationPayload {
  /** @example "22420" */
  invoiceNo: string;
  /** @example "111121" */
  invoiceDate: string;
  /** @example "" */
  dueDate?: string;
  /** @example "" */
  discountDueDate?: string;
  /** @example 150050 */
  invoiceAmount: number;
  /** @example 12010001 */
  apGlNo: number;
  /** @example 11000001 */
  bankGl: number;
  /** @example "Office Supplies" */
  invoiceDesc?: string;
  /** @example 20075 */
  totalFreight?: number;
  /** @example 20075 */
  retentionGl?: number;
  /** @example "" */
  singleCheck?: string;
  /** @example "H" */
  holdCode?: string;
  /** @example "Payment Hold" */
  holdDesc?: string;
  /** @example 0 */
  salesOrderNo?: number;
  /** @example 0 */
  srn?: number;
  /** @example 10 */
  companyNo: number;
  /** @example 81293 */
  entryNo: number;
  /** @example 122339 */
  vendorNo: number;
  /** @example "NORMAL" */
  processType?: string;
  /** @example "P" */
  prepaidCode?: string;
  /** @example 123456 */
  prepaidCheckNo?: number;
  /** @example 112525 */
  prepaidCheckdate?: number;
}

export interface GetVoucherConfigParams {
  /** Company Number */
  companyNo: number;
  /** Vendor Number */
  vendorNo: number;
}

export interface GetGlMasterParams {
  /**
   * Company Number
   * @example 10
   */
  companyNo: number;
  /**
   * GL Account Number (8 digits: first 6 digits are account number, last 2 digits are sub-account number)
   * @example 12010001
   */
  glNo: number;
}

/** CSV file to upload. */
export interface UploadCsvPayload {
  /** @format binary */
  file?: File;
}

/** SOGAS CSV file to upload. */
export interface UploadSogasCsvPayload {
  /** @format binary */
  file?: File;
}

export interface UploadSogasCsvParams {
  subType: string;
}

export interface GetVoucherSummaryParams {
  /**
   * Company Number (only 10 allowed)
   * @example 10
   */
  companyNo: number;
  /** Process Type (NORMAL, ARGLMS, PAPER, FLEXI, SOGAS) */
  processType: PROCESS_TYPE_ENUM;
}

export interface GetFlexiEntryParams {
  /** Search term for filtering results */
  search?: string;
  /**
   * Page Number
   * @default 1
   */
  current_page?: number;
  /**
   * Limit per Page
   * @default 500
   */
  items_per_page?: number;
  /** Sort By */
  sortBy?: string;
  /** Sort Order asc or desc */
  sortOrder?: "asc" | "desc";
  /**
   * Company Number
   * @example 10
   */
  companyNo?: number;
  /**
   * Vendor Number
   * @example 1001
   */
  vendorNo?: number;
  /**
   * Entry Number
   * @example 81293
   */
  entryNo?: number;
  /**
   * Process Type (Only FLEXI allowed)
   * @default "FLEXI"
   * @example "FLEXI"
   */
  processType?: string;
}

export interface GetSogasEntryParams {
  /** Search term for filtering results */
  search?: string;
  /**
   * Page Number
   * @default 1
   */
  current_page?: number;
  /**
   * Limit per Page
   * @default 500
   */
  items_per_page?: number;
  /** Sort By */
  sortBy?: string;
  /** Sort Order asc or desc */
  sortOrder?: "asc" | "desc";
  /**
   * Company Number (defaults to 10)
   * @example 10
   */
  companyNo?: number;
  /**
   * Vendor Number
   * @example 1001
   */
  vendorNo?: number;
  /**
   * Entry Number
   * @example 81293
   */
  entryNo?: number;
  /**
   * Process Type (Only SOGAS allowed)
   * @default "SOGAS"
   * @example "SOGAS"
   */
  processType?: string;
}

export interface GetCarrierInvoicesParams {
  /** Search term for filtering results */
  search?: string;
  /**
   * Page Number
   * @default 1
   */
  current_page?: number;
  /**
   * Limit per Page
   * @default 500
   */
  items_per_page?: number;
  /** Sort By */
  sortBy?: string;
  /** Sort Order asc or desc */
  sortOrder?: "asc" | "desc";
  /**
   * Company Number
   * @example 10
   */
  companyNo: number;
  /**
   * Process Type
   * @example "NORMAL"
   */
  processType: string;
  /**
   * Invoice Type
   * @example "NORMAL"
   */
  invoiceType?: string;
}

export interface GetLmsCarrierInvoicesParams {
  /** Search term for filtering results */
  search?: string;
  /**
   * Page Number
   * @default 1
   */
  current_page?: number;
  /**
   * Limit per Page
   * @default 500
   */
  items_per_page?: number;
  /** Sort By */
  sortBy?: string;
  /** Sort Order asc or desc */
  sortOrder?: "asc" | "desc";
  /**
   * Company Number
   * @example 10
   */
  companyNo: number;
  /**
   * Process Type
   * @example "NORMAL"
   */
  processType: string;
  /**
   * Invoice Type
   * @example "NORMAL"
   */
  invoiceType?: string;
}

export interface GetPaperEntryParams {
  /** Search term for filtering results */
  search?: string;
  /**
   * Page Number
   * @default 1
   */
  current_page?: number;
  /**
   * Limit per Page
   * @default 500
   */
  items_per_page?: number;
  /** Sort By */
  sortBy?: string;
  /** Sort Order asc or desc */
  sortOrder?: "asc" | "desc";
  /**
   * Company Number (defaults to 10)
   * @example 10
   */
  companyNo?: number;
  /**
   * Vendor Number
   * @example 1001
   */
  vendorNo?: number;
  /**
   * Entry Number
   * @example 81293
   */
  entryNo?: number;
  /**
   * Process Type (e.g., PAPER)
   * @default "PAPER"
   * @example "PAPER"
   */
  processType?: string;
}

export interface GetLmsEntryParams {
  /** Search term for filtering results */
  search?: string;
  /**
   * Page Number
   * @default 1
   */
  current_page?: number;
  /**
   * Limit per Page
   * @default 500
   */
  items_per_page?: number;
  /** Sort By */
  sortBy?: string;
  /** Sort Order asc or desc */
  sortOrder?: "asc" | "desc";
  /**
   * Company Number (defaults to 10)
   * @example 10
   */
  companyNo?: number;
  /**
   * Vendor Number
   * @example 1001
   */
  vendorNo?: number;
  /**
   * Entry Number
   * @example 81293
   */
  entryNo?: number;
  /**
   * Process Type (e.g., LMS)
   * @default "LMS"
   * @example "LMS"
   */
  processType?: string;
}

/** Array of Paper voucher invoices to process as a batch. Each object should match the structure of data from getCarrierInvoice API. */
export interface PaperBatchCreatePayload {
  invoices: {
    /** @example "APPA" */
    carrierId: string;
    /** @example "24601" */
    carrierInvoiceNo: string;
    /**
     * @format date
     * @example "110125"
     */
    ordShipDate: string;
    /** @example "P" */
    invoiceType: string;
    /** @example 363822 */
    ourOrderNo: number;
    /** @example 1 */
    shippingReferenceNo: number;
    /** @example 1373.5 */
    invoiceAmount: number;
    /** @example 10 */
    companyNo: number;
    /**
     * Invoice Date
     * @format date
     * @example "042925"
     */
    invoiceDate: string;
  }[];
}

/** Array of Lms voucher invoices to process as a batch. Each object should match the structure of data from getCarrierInvoice API. */
export interface LmsBatchCreatePayload {
  invoices: {
    /** @example "APPA" */
    carrierId: string;
    /** @example "24601" */
    carrierInvoice: string;
    /**
     * @format date
     * @example "110125"
     */
    orderShipDate: string;
    /** @example "P" */
    invoiceType: string;
    /** @example 363822 */
    ourOrderNo: number;
    /** @example 1 */
    shippingReferenceNo: number;
    /** @example 1373.5 */
    invoiceAmount: number;
    /** @example 10 */
    companyNo: number;
    /**
     * Invoice Date
     * @format date
     * @example "042925"
     */
    invoiceDate: string;
  }[];
}

export interface GetCalculatedDueDatesParams {
  /**
   * Company Number
   * @example 10
   */
  companyNo: number;
  /**
   * Vendor Number
   * @example 1001
   */
  vendorNo: number;
  /**
   * Invoice Date
   * @example "101525"
   */
  invoiceDate: string;
}

export interface PurchaseJournalReportsParams {
  /** Search term for filtering results */
  search?: string;
  /**
   * Page number for pagination
   * @default 1
   */
  current_page?: number;
  /**
   * Limit:Number of items per page
   * @default 500
   */
  items_per_page?: number;
  /** Sort field */
  sortBy?: string;
  /** Sort direction (asc or desc) */
  sortOrder?: "asc" | "desc";
  /** Type of the report */
  reportType?: string;
  /** Name of the report file */
  fileName?: string;
  /**
   * Start date of report period (MMDDYY)
   * @example "062725"
   */
  startDate?: string;
  /**
   * End date of report period (MMDDYY)
   * @example "062725"
   */
  endDate?: string;
  /**
   * Number of items per page
   * @example 10
   */
  limit?: number;
  /**
   * Offset for pagination
   * @example 0
   */
  offset?: number;
}

export interface SubmitPurchaseJournalPayload {
  entries: {
    /** @example "22420" */
    invoiceNo: string;
    /** @example 10 */
    companyNo: number;
    /** @example 19042 */
    entryNo: number;
    /** @example 1001 */
    vendorNo: number;
    /**
     * Prepaid code
     * @example "P"
     */
    prepaidCode?: string;
    /**
     * Prepaid check number
     * @example "12345"
     */
    prepaidCheckNo?: string;
    /**
     * Bank GL number
     * @example 10000001
     */
    bankGl?: number;
    /**
     * Invoice amount
     * @example 1000.5
     */
    invoiceAmount?: number;
  }[];
  /** @example "070725" */
  purchaseJD: string;
  /** @example "000000" */
  keyCashDJD: string;
  /** @example 10 */
  companyNo: number;
}

export interface ProcessTypeParams {
  /**
   * Report type enum values from Report_Type
   * @example "Open-Payables"
   */
  type:
    | "Open-Payables"
    | "Voucher-Posting"
    | "Vendor-Reports"
    | "Vendor-Report"
    | "AP-MONTH-END"
    | "AP-Payment-Cycle"
    | "Check-Register"
    | "Employee-Expense";
}

export interface GetOpenPayablesReportParams {
  /** Search term for filtering results */
  search?: string;
  /**
   * Page number for pagination
   * @default 1
   */
  current_page?: number;
  /**
   * Limit:Number of items per page
   * @default 500
   */
  items_per_page?: number;
  /** Sort field */
  sortBy?: string;
  /** Sort direction (asc or desc) */
  sortOrder?: "asc" | "desc";
  /**
   * Type of report
   * @example "Open-Payables-By-Due-Date"
   */
  reportType?: Object;
  /**
   * Name of the report file
   * @example "report.pdf"
   */
  fileName?: string;
  /**
   * Start date of report period (MMDDYY)
   * @format date
   * @example "062725"
   */
  startDate?: string;
  /**
   * End date of report period (MMDDYY)
   * @format date
   * @example "062725"
   */
  endDate?: string;
  /**
   * Number of items per page
   * @example 10
   */
  limit?: number;
  /**
   * Offset for pagination
   * @example 0
   */
  offset?: number;
}

export interface GetReportsMenuParams {
  /** Search term for filtering results */
  search?: string;
  /**
   * Page number for pagination
   * @default 1
   */
  current_page?: number;
  /**
   * Limit:Number of items per page
   * @default 500
   */
  items_per_page?: number;
  /** Sort field */
  sortBy?: string;
  /** Sort direction (asc or desc) */
  sortOrder?: "asc" | "desc";
  /**
   * Type of report
   * @example "AP-Month-End-Vendor-Totals"
   */
  reportType?: string;
  /**
   * Name of the report file
   * @example "report.pdf"
   */
  fileName?: string;
  /**
   * Start date of report period (YYYY-MM-DD)
   * @format date
   * @example "2025-07-01"
   */
  startDate?: string;
  /**
   * End date of report period (YYYY-MM-DD)
   * @format date
   * @example "2025-07-10"
   */
  endDate?: string;
  /**
   * Number of items per page
   * @example 10
   */
  limit?: number;
  /**
   * Offset for pagination
   * @example 0
   */
  offset?: number;
}

export type SubmitReportsMenuPayload =
  | {
      /** @example "AP-Month-End-Vendor-Totals" */
      reportType: string;
      /** @example 10 */
      companyNo: number;
      /** @example "070725" */
      reportDate: string;
    }
  | {
      /** @example "Outstanding-Check-Register" */
      reportType: string;
      /** @example 10 */
      companyNo: number;
      /** @example "070725" */
      outstandingCheckDate: string;
    };

export interface SubmitPaymentSelectionTypePayload {
  /** @example 10 */
  companyNo: number;
  /** @example "Check" */
  voucherToPay: "Check" | "ACH" | "Wire" | "Employee Expense" | "Utility";
  /** @example "100001" */
  startingCheckNo: string;
  /** @example "080125" */
  checkDate: string;
  /** @example "080225" */
  dateToPayBy?: string;
  /** @example "11000001" */
  bankAccountGl: string;
  /** @example "D" */
  forcedDiscount: "D" | "";
  /** @example "I" */
  mode: "I" | "U" | "D";
}

export interface SubmitVendorPaymentPayload {
  /** @example 10 */
  companyNo: number;
  /** @example "Check" */
  voucherToPay?: "Check" | "ACH" | "Wire" | "Employee Expense" | "Utility";
  /** @example 11000001 */
  bankAccountGl: number;
  /** @example 100001 */
  startingCheckNo: number;
  /** @example "080125" */
  checkDate: string;
  /** @example "080225" */
  dateToPayBy: string;
  item: {
    /** @example "00001" */
    entrySequence: string;
    /** @example 18374 */
    vendorNo: number;
    /** @example 357700 */
    voucherNo: number;
    /** @example 1200 */
    partialPayAmount: number;
    /** @example 50 */
    discountAmount: number;
    /** @example "P" */
    payOrHold: "P" | "H";
    /** @example "S" */
    singleCheck: "S" | "";
    /** @example "P" */
    makePrepaid: "" | "P" | "A" | "W";
    /** @example "000123" */
    prepaidCheckNo?: string;
    /** @example "080125" */
    prepaidDate: string;
    /** @example "" */
    forcedDiscount: "D" | "";
    /** @example "save" */
    mode: "I" | "U" | "D";
  };
}

export interface GetCashRequirementReportsParams {
  /** Search term for filtering results */
  search?: string;
  /**
   * Page number for pagination
   * @default 1
   */
  current_page?: number;
  /**
   * Limit:Number of items per page
   * @default 500
   */
  items_per_page?: number;
  /** Sort field */
  sortBy?: string;
  /** Sort direction (asc or desc) */
  sortOrder?: "asc" | "desc";
  /**
   * Voucher type (Check, ACH, Wire, Employee Expense, Utility)
   * @example "Check"
   */
  voucherToPay: "Check" | "ACH" | "Wire" | "Employee Expense" | "Utility";
  /**
   * Report Type
   * @example "AP-Cash-Requirements"
   */
  reportType?: string;
}

export interface GetApCheckReportsParams {
  /** Search term for filtering results */
  search?: string;
  /**
   * Page number for pagination
   * @default 1
   */
  current_page?: number;
  /**
   * Limit:Number of items per page
   * @default 500
   */
  items_per_page?: number;
  /** Sort field */
  sortBy?: string;
  /** Sort direction (asc or desc) */
  sortOrder?: "asc" | "desc";
  /**
   * Voucher type (Check)
   * @example "Check"
   */
  voucherToPay: string;
  /**
   * Report Type
   * @example "AP-Check-Printing"
   */
  reportType?: string;
}

export interface VoucherMaintenanceParams {
  /**
   * Page number (default: 1)
   * @min 1
   * @example 1
   */
  page?: number;
  /**
   * Items per page (default: 500, max: 500)
   * @min 1
   * @max 500
   * @example 500
   */
  limit?: number;
  /**
   * Filter by company number
   * @example 1
   */
  companyNo?: number;
  /**
   * Filter by vendor number
   * @example 12345
   */
  vendorNo?: number;
  /** Filter by voucher type */
  voucherType?: "UNPAID" | "PAID" | "ALL";
  /**
   * Filter by invoice date (MMDDYY format)
   * @pattern ^\d{6}$
   * @example "012524"
   */
  invoiceDate?: string;
  /**
   * Filter by invoice number
   * @maxLength 20
   * @example "INV-2024-001"
   */
  invoiceNo?: string;
  /** Sort by field */
  sortBy?: "invoiceDate";
  /** Sort order */
  sortOrder?: "ASC" | "DESC";
}

export interface GetVoucherMaintenanceSummaryParams {
  /**
   * Type of vouchers to retrieve
   * @example "UNPAID"
   */
  voucherType: "UNPAID" | "PAID" | "ALL" | "CANCELLED";
  /**
   * Company number
   * @example 10
   */
  companyNo: number;
  /**
   * Vendor number
   * @example 6675
   */
  vendorNo: number;
}

export interface GetVoucherMaintenanceByIdParams {
  /** Type of voucher to retrieve */
  voucherType: "PAID" | "UNPAID";
  /**
   * Company number
   * @example 10
   */
  companyNo: number;
  /**
   * Vendor number
   * @example 12345
   */
  vendorNo: number;
  /**
   * Voucher number
   * @example 67890
   */
  voucherNo: number;
}

export interface GetVendorListParams {
  /** Search term for filtering results */
  search?: string;
  /**
   * Page number for pagination
   * @default 1
   */
  current_page?: number;
  /**
   * Limit:Number of items per page
   * @default 500
   */
  items_per_page?: number;
  /** Sort field */
  sortBy?: string;
  /** Sort direction (asc or desc) */
  sortOrder?: "asc" | "desc";
  /**
   * Company Number
   * @example 10
   */
  companyNo: number;
  /**
   * Vendor No
   * @example 1100
   */
  vendorNo?: number;
  /**
   * Vendor Type
   * @example "E"
   */
  type?: string;
  /**
   * Vendor Status
   * @example "A"
   */
  status?: string;
  /**
   * Number of items per page
   * @example 10
   */
  limit?: number;
  /**
   * Offset for pagination
   * @example 0
   */
  offset?: number;
}

export interface CreateOrUpdateVendorParams {
  /**
   * Vendor isDeleted
   * @example "A"
   */
  vendorIsDeleted: string;
  /**
   * Company Number
   * @example 10
   */
  vendorCompanyNumber: number;
  /**
   * Vendor Name Overflow
   * @example "A"
   */
  vendorNameOverflow?: string;
  /**
   * Vendor Number
   * @example 9875
   */
  vendorNo: number;
  /**
   * Vendor Name
   * @example "Abhishek Consulting"
   */
  vendorName: string;
  /** Vendor Address Line 1 */
  vendorAdd1?: string;
  /** Vendor Address Line 2 */
  vendorAdd2?: string;
  /** Vendor Address Line 3 */
  vendorAdd3?: string;
  /** Vendor Address Line 4 */
  vendorAdd4?: string;
  /**
   * Country Code
   * @example "US"
   */
  vendorCountryCode: string;
  /**
   * 1099 Id
   * @example "Test"
   */
  IdNo1099?: string;
  /**
   * Zip Code
   * @example 4015
   */
  vendorZipCode: number;
  /**
   * Area Code
   * @example 996
   */
  vendorAreaCode?: number;
  /**
   * Telephone Number
   * @example 996
   */
  vendorTelephoneNo?: number;
  /**
   * Hold Payments Indicator
   * @example "A"
   */
  vendorHoldPaymentsVend?: string;
  /**
   * GAL Receipts Required
   * @example "T"
   */
  vendorGalRcptsRequired?: string;
  /**
   * Single Check Indicator
   * @example "T"
   */
  vendorSingleCheck?: string;
  /**
   * AP Terms Code
   * @example 10
   */
  vendorApTermsCode?: number;
  /**
   * ADP Payroll ID
   * @example 123
   */
  vendorAdpPayrollId?: number;
  /**
   * Vendor Category Code
   * @example "INA"
   */
  vendorCategoryCode?: string;
  /**
   * Expense GL Subaccount
   * @example 1234
   */
  vendorExpenseGLSub?: number;
  /**
   * ACH Bank Account Number
   * @example "Test"
   */
  vendorAchBankAccountNumber?: string;
  /**
   * ACH Bank Routing Code
   * @example 123456789
   */
  vendorAchBankRoutingCode?: number;
  /**
   * Account Type (C=Checking, S=Savings)
   * @example "C"
   */
  vendorAchCheckingOrSavings?: string;
  /**
   * ACH Class
   * @example "A"
   */
  vendorAchClass?: string;
  /**
   * Vendor First Name
   * @example "Test"
   */
  vendorFirstName?: string;
  /**
   * Vendor Middle Name
   * @example "Test"
   */
  vendorMiddleName?: string;
  /**
   * Vendor Last Name (Business)
   * @example "Test"
   */
  vendorBusinessLastName?: string;
  /**
   * Vendor Name Suffix
   * @example "Sr"
   */
  vendorNameSuffix?: string;
  /**
   * AP 1099 Code
   * @example "T"
   */
  vendorAp1099Code?: string;
  /**
   * First 1099 Box Number
   * @example 1
   */
  vendorFirst1099BoxNumber?: number;
  /**
   * Second 1099 Box Number
   * @example 2
   */
  vendorSecond1099BoxNumber?: number;
  /**
   * Second 1099 Box Amount
   * @example 50
   */
  vendorSecond1099BoxAmount?: number;
  /**
   * Payee Name 1
   * @example "Test"
   */
  vendorPayeeName1?: string;
  /**
   * Payee Name 2
   * @example "Test"
   */
  vendorPayeeName2?: string;
  /**
   * IRS Name Control
   * @example "T"
   */
  vendorIrsNameControl?: string;
  /** List of Contact Details */
  contactDetails?: string[];
}

export interface GetOwnerMappingListParams {
  /** Search term for filtering results */
  search?: string;
  /**
   * Page number for pagination
   * @default 1
   */
  current_page?: number;
  /**
   * Limit:Number of items per page
   * @default 500
   */
  items_per_page?: number;
  /** Sort field */
  sortBy?: string;
  /** Sort direction (asc or desc) */
  sortOrder?: "asc" | "desc";
  /**
   * Company Number
   * @example 10
   */
  vendorCompanyNumber: number;
  /**
   * Vendor No
   * @example 1444
   */
  vendorNo?: number;
  /**
   * Status
   * @example "A"
   */
  status?: string;
  /**
   * Owner No
   * @example 2527
   */
  ownerNo: number;
  /**
   * Number of items per page
   * @example 100
   */
  limit?: number;
  /**
   * Offset for pagination
   * @example 0
   */
  offset?: number;
}

export interface GetOwnerDetailsParams {
  /**
   * Owner No
   * @example 63875
   */
  ownerNo: number;
  /**
   * Vendor No
   * @example 1444
   */
  vendorNo?: number;
}

export interface GetVendorDetailsParams {
  /**
   * Company Number
   * @example 10
   */
  vendorCompanyNumber: number;
  /**
   * Vendor No
   * @example 1444
   */
  vendorNo?: number;
}

export interface GetOwnerNoListParams {
  /** Search term for filtering results */
  search?: string;
  /**
   * Page number for pagination
   * @default 1
   */
  current_page?: number;
  /**
   * Limit:Number of items per page
   * @default 500
   */
  items_per_page?: number;
  /** Sort field */
  sortBy?: string;
  /** Sort direction (asc or desc) */
  sortOrder?: "asc" | "desc";
  /**
   * Company Number
   * @example 10
   */
  vendorCompanyNumber: number;
  /**
   * Vendor No
   * @example 1444
   */
  vendorNo?: number;
  /**
   * Status
   * @example "A"
   */
  status?: string;
  /**
   * Owner No
   * @example 2527
   */
  ownerNo: number;
  /**
   * Number of items per page
   * @example 100
   */
  limit?: number;
  /**
   * Offset for pagination
   * @example 0
   */
  offset?: number;
}

export interface GetNextVendorNoConfigParams {
  /**
   * Company Number
   * @example 10
   */
  companyNo: number;
}

export interface GetAllVendorsListParams {
  /** Search term for filtering results */
  search?: string;
  /**
   * Page number for pagination
   * @default 1
   */
  current_page?: number;
  /**
   * Limit:Number of items per page
   * @default 500
   */
  items_per_page?: number;
  /** Sort field */
  sortBy?: string;
  /** Sort direction (asc or desc) */
  sortOrder?: "asc" | "desc";
  /** Company Number */
  companyNo: number;
  /** Include Deleted Vendor */
  includeIsDeleted?: string;
}

export interface CompanyMaintenanceParams {
  /**
   * Company number (1-99)
   * @example 10
   */
  companyNo: number;
}

export interface UpdateCompanyMaintenancePayload {
  /**
   * Company number (1-99)
   * @min 1
   * @max 99
   * @example 10
   */
  companyNo: number;
  /**
   * Company name
   * @minLength 1
   * @maxLength 30
   * @example "ABC Company"
   */
  companyName: string;
  /**
   * AP GL account number
   * @min 1
   * @example 20000001
   */
  companyApGlNo: number;
  /**
   * Bank GL account number
   * @min 1
   * @example 10000001
   */
  companyBankGlNo: number;
  /**
   * Discounts GL account number
   * @min 1
   * @example 50000001
   */
  companyDiscountsGlNo: number;
  /**
   * Intercompany GL account number
   * @min 1
   * @example 30000001
   */
  companyIntercoGlNo: number;
  /**
   * Next Purchase Journal number
   * @min 1
   * @example 1001
   */
  companyNextPjJrnlNo: number;
  /**
   * Next Cash Disbursement Journal number
   * @min 1
   * @example 1001
   */
  companyNextCdJrnlNo: number;
  /**
   * Next check number
   * @min 1
   * @example 10001
   */
  companyNextCheckNo: number;
  /**
   * Next entry number
   * @min 1
   * @example 10001
   */
  companyNextEntryNo: number;
  /**
   * Next voucher number
   * @min 1
   * @example 10001
   */
  companyNextVoucherNo: number;
  /**
   * Pre-edit checks flag
   * @minLength 1
   * @maxLength 1
   * @example "Y"
   */
  companyPreEdChks: "Y" | "N";
  /**
   * Job cost active flag
   * @minLength 1
   * @maxLength 1
   * @example "Y"
   */
  companyJobCostAct: "Y" | "N";
  /**
   * Retention GL account number
   * @min 1
   * @example 40000001
   */
  companyRetentionGlNo: number;
  /**
   * Purchase Order active flag
   * @minLength 1
   * @maxLength 1
   * @example "Y"
   */
  companyPoActive: "Y" | "N";
  /**
   * Employee expense GL account number
   * @min 1
   * @example 60000001
   */
  companyEmployeeExpenseGlNo: number;
  /**
   * Next Employee Expense Journal number
   * @min 1
   * @example 1001
   */
  companyNextEeJrnlNo: number;
  /**
   * Filler field
   * @maxLength 255
   * @example ""
   */
  companyFiller: string;
}

/** Clear Checks file to upload. */
export interface UploadClearChecksPayload {
  /** @format binary */
  file?: File;
}

/** Check validation data including check number, amount, and clear date. */
export interface ValidateSingleCheckPayload {
  /**
   * Check number to validate
   * @example "210091"
   */
  checkNo: string;
  /**
   * Check amount to validate
   * @example 11.55
   */
  checkAmount: number;
  /**
   * Check clear date in MMDDYY format
   * @pattern ^(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([0-9]{2})$
   * @example "061025"
   */
  checkDate: string;
}

/** Multiple check processing data including check numbers, amounts, and clear dates. No validation is performed. */
export interface ProcessMultipleChecksPayload {
  /**
   * Array of checks to process
   * @minItems 1
   */
  checks: {
    /**
     * Check number to process
     * @example "210091"
     */
    checkNo: string;
    /**
     * Check amount (for reference only, not validated)
     * @example 11.55
     */
    checkAmount: number;
    /**
     * Check clear date in MMDDYY format
     * @pattern ^(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([0-9]{2})$
     * @example "061025"
     */
    checkDate: string;
  }[];
}

export interface GetPyamentHistoryParams {
  /** Search term for filtering results */
  search?: string;
  /**
   * Page number for pagination
   * @default 1
   */
  current_page?: number;
  /**
   * Limit:Number of items per page
   * @default 500
   */
  items_per_page?: number;
  /** Sort field */
  sortBy?: string;
  /** Sort direction (asc or desc) */
  sortOrder?: "asc" | "desc";
  /**
   * Company Id
   * @example "10"
   */
  companyNo?: number;
  /**
   * VendiorNo
   * @example "1100"
   */
  vendorNo?: number;
  /**
   * Start date
   * @format date
   * @example "20116"
   */
  startDate?: string;
  /**
   * Invoice No
   * @example "461046"
   */
  invoiceNo?: string;
  /**
   * check No
   * @example "0"
   */
  checkNo?: number;
  /**
   * Number of items per page
   * @example 10
   */
  limit?: number;
  /**
   * Offset for pagination
   * @example 0
   */
  offset?: number;
}

export interface GetLastPaymentInfoParams {
  /** Search term for filtering results */
  search?: string;
  /**
   * Page number for pagination
   * @default 1
   */
  current_page?: number;
  /**
   * Limit:Number of items per page
   * @default 500
   */
  items_per_page?: number;
  /** Sort field */
  sortBy?: string;
  /** Sort direction (asc or desc) */
  sortOrder?: "asc" | "desc";
  /**
   * Company Id
   * @example "10"
   */
  companyNo: number;
  /**
   * VendorNo
   * @example "1100"
   */
  vendorNo: number;
  /**
   * Start date
   * @format date
   * @example "20116"
   */
  startDate?: string;
  /**
   * Invoice No
   * @example "461046"
   */
  invoiceNo?: string;
  /**
   * check No
   * @example "0"
   */
  checkNo?: number;
}

export interface GetVoucherDetailsParams {
  /**
   * Company Id
   * @example 10
   */
  companyNo: number;
  /**
   * VendorNo
   * @example 1100
   */
  vendorNo: number;
  /**
   * Invoice No
   * @example 461046
   */
  voucherNo: number;
  /**
   * check No
   * @example "0"
   */
  checkNo?: number;
  /**
   * Invoice No
   * @example "0"
   */
  invoiceNo?: string;
}

export interface GetVendorsByYearParams {
  /**
   * Search term for filtering results
   * @example "ABC"
   */
  search?: string;
  /**
   * Page number for pagination (default: 1)
   * @default 1
   * @example 1
   */
  current_page?: number;
  /**
   * Number of items per page (default: 500, max: 500)
   * @default 500
   * @example 50
   */
  items_per_page?: number;
  /**
   * Sort field
   * @example "vendorName"
   */
  sortBy?: string;
  /**
   * Sort direction (asc or desc)
   * @example "asc"
   */
  sortOrder?: "asc" | "desc";
  /**
   * Company number (1-99)
   * @example 10
   */
  companyNo: number;
  /**
   * Year (2000-2100)
   * @example 2024
   */
  year: number;
}

export interface GetCompanyDetailsParams {
  /**
   * Company number (1-99)
   * @example 10
   */
  companyNo: number;
}

export interface GetApPeriodEndReportsParams {
  /** @example "" */
  tin: string;
  /** @example "2024" */
  ctl: string;
}

export interface SoftDeleteRecordParams {
  /** @example "" */
  tin: string;
  /** @example "2024" */
  ctl: string;
}

export interface GetAllApPeriodEndReportsParams {
  /** Search term for filtering results */
  search?: string;
  /**
   * Page number for pagination
   * @default 1
   */
  current_page?: number;
  /**
   * Limit:Number of items per page
   * @default 500
   */
  items_per_page?: number;
  /** Sort field */
  sortBy?: string;
  /** Sort direction (asc or desc) */
  sortOrder?: "asc" | "desc";
  /**
   * RecordType
   * @example "A"
   */
  recordType?: string;
  /**
   * Ctl No
   * @example "7389d"
   */
  ctl?: string;
  /**
   * tin No
   * @example "738hdosd"
   */
  tin?: string;
}

export interface GetYearEndProcessMenuReviewFilesParams {
  /** Search term for filtering results */
  search?: string;
  /**
   * Page number for pagination
   * @default 1
   */
  current_page?: number;
  /**
   * Limit:Number of items per page
   * @default 500
   */
  items_per_page?: number;
  /** Sort field */
  sortBy?: string;
  /** Sort direction (asc or desc) */
  sortOrder?: "asc" | "desc";
  /**
   * Company number (1-99)
   * @example 10
   */
  companyNo: number;
  /**
   * Report Type
   * @example "example report type"
   */
  reportType?: string;
}

export interface GetVendorDetailsByYearParams {
  /** Company Number */
  vendorCompanyNumber: number;
  year: string;
  vendorNo: string;
}

export interface UpdateVendorByYearParams {
  year: string;
  vendorNo: string;
}

export interface GetReportDetailsParams {
  /**
   * The kebab case name of the report
   * @example "Open-Payables-By-Due-Date"
   */
  name: string;
  /**
   * The variable type to find spinfo records for
   * @maxLength 10
   * @default "in"
   * @example "in"
   */
  variableType: string;
}

export interface GenerateReportParams {
  /**
   * The kebab case name of the report
   * @example "Open-Payables-By-Due-Date"
   */
  name: string;
}

export interface GetDropdownDataParams {
  /**
   * Optional search term to filter results
   * @example "search term"
   */
  search?: string;
  /**
   * Page number for pagination
   * @example 1
   */
  current_page?: number;
  /**
   * Number of items per page
   * @example 10
   */
  items_per_page?: number;
  /** Sort field */
  sortBy?: string;
  /** Sort direction (asc or desc) */
  sortOrder?: "asc" | "desc";
  /**
   * Type of dropdown data to retrieve (includes voucher types, process types, form types, etc.)
   * @example "PROCESS_TYPES"
   */
  type:
    | "PROCESS_TYPES"
    | "FORM_TYPE"
    | "PAYMENT_FOR_REPORT_TYPES"
    | "COUNTRIES_ISO"
    | "COUNTRIES_PHONE_CODE"
    | "HOLD_VOUCHER_CODE"
    | "PREPAID_OPTIONS"
    | "PAY_HOLD_OPTIONS"
    | "HOLD_VOUCHER_DESCRIPTIONS"
    | "RECORD_TYPE_OPTIONS"
    | "PAYMENT_VOUCHER_TYPE"
    | "MAKE_PREPAID_FLAG"
    | "SINGLE_CHECK_FLAG"
    | "PAY_OR_HOLD_CODES"
    | "VENDOR_NAMES"
    | "COMPANY_NAMES"
    | "EXPENSE_GL"
    | "VENDOR_TERMS_CODE"
    | "VENDOR_GAL_RECEIPT"
    | "VENDOR_CATEGORY"
    | "AP_1099"
    | "VENDOR_FORM_TYPE"
    | "VENDOR_CARRIER"
    | "VENDOR_MAINTENANCE_TYPE"
    | "AP_PERIOD_END_YEARS";
  /**
   * Optional company number for company-specific dropdowns
   * @example 10
   */
  companyNo?: number;
}

export interface GenerateReportFilesPayload {
  /** @example 10 */
  companyNo: number;
  /** Select the report usecase */
  usecase: "payment-selection" | "pa1099-year-end-patax" | "irs-tax";
  /** Optional parameters depending on usecase */
  parameters?: Record<string, any>;
}

export interface GetGeneralSystemCompanyParams {
  /**
   * Company Number
   * @example 1
   */
  companyNo: number;
}

export interface GenerateAuthCodeParams {
  /**
   * Company Number
   * @example 1
   */
  companyNo: number;
}

export interface GetAuthCodeCheckerParams {
  /**
   * 526267
   * @example 526456
   */
  authCode: number;
  /**
   * Company Number
   * @example 1
   */
  companyNo: number;
}

export namespace HealthCheck {
  /**
   * No description
   * @tags App
   * @name AppControllerHealthCheck
   * @request GET:/health-check
   * @response `200` `void`
   */
  export namespace AppControllerHealthCheck {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
}

export namespace AppDashboard {
  /**
   * No description
   * @tags App
   * @name AppControllerGetAppDashboard
   * @request GET:/app-dashboard
   * @response `200` `void`
   */
  export namespace AppControllerGetAppDashboard {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
}

export namespace AccountPayable {
  /**
 * @description Frontend usage: api.accountPayable.getCompanies()
 * @tags Voucher
 * @name GetCompanies
 * @summary Get all companies (Method: getCompanies)
 * @request GET:/account-payable/voucher/companies
 * @secure
 * @response `200` `{
    items: ({
  \** @example "123" *\
    id: string,
  \** @example "Company Name" *\
    label: string,
  \** @example "Company Name" *\
    value: string,

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` Success
*/
  export namespace GetCompanies {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Search term for filtering results */
      search?: string;
      /**
       * Page number for pagination
       * @default 1
       */
      current_page?: number;
      /**
       * Limit:Number of items per page
       * @default 500
       */
      items_per_page?: number;
      /** Sort field */
      sortBy?: string;
      /** Sort direction (asc or desc) */
      sortOrder?: "asc" | "desc";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: {
        /** @example "123" */
        id: string;
        /** @example "Company Name" */
        label: string;
        /** @example "Company Name" */
        value: string;
      }[];
      pagination: {
        /** @example 100 */
        total_items: number;
        /** @example 1 */
        current_page: number;
        /** @example 10 */
        items_per_page: number;
        /** @example 10 */
        total_pages: number;
      };
    };
  }

  /**
 * @description Frontend usage: api.accountPayable.getProcessTypes()
 * @tags Voucher
 * @name GetProcessTypes
 * @summary Get all process types (Method: getProcessTypes)
 * @request GET:/account-payable/voucher/process-types
 * @secure
 * @response `200` `{
    items: ({
  \** @example "1" *\
    id: string,
  \** @example "Normal" *\
    label: string,
  \** @example "Normal" *\
    value: string,

})[],

}` Success
*/
  export namespace GetProcessTypes {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: {
        /** @example "1" */
        id: string;
        /** @example "Normal" */
        label: string;
        /** @example "Normal" */
        value: string;
      }[];
    };
  }

  /**
 * @description Frontend usage: api.accountPayable.getAllVendors()
 * @tags Voucher
 * @name GetAllVendors
 * @summary Get all vendors (Method: getAllVendors)
 * @request GET:/account-payable/voucher/vendors
 * @secure
 * @response `200` `{
    items: ({
  \** @example "11" *\
    id: string,
  \** @example "Vendor Name" *\
    label: string,
  \** @example "Vendor Name" *\
    value: string,

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` Success
*/
  export namespace GetAllVendors {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Search term for filtering results */
      search?: string;
      /**
       * Page number for pagination
       * @default 1
       */
      current_page?: number;
      /**
       * Limit:Number of items per page
       * @default 500
       */
      items_per_page?: number;
      /** Sort field */
      sortBy?: string;
      /** Sort direction (asc or desc) */
      sortOrder?: "asc" | "desc";
      /** Company Number */
      companyNo: number;
      /** Include Deleted Vendor */
      includeIsDeleted?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: {
        /** @example "11" */
        id: string;
        /** @example "Vendor Name" */
        label: string;
        /** @example "Vendor Name" */
        value: string;
      }[];
      pagination: {
        /** @example 100 */
        total_items: number;
        /** @example 1 */
        current_page: number;
        /** @example 10 */
        items_per_page: number;
        /** @example 10 */
        total_pages: number;
      };
    };
  }

  /**
 * @description Frontend usage: api.accountPayable.getVendorById()
 * @tags Voucher
 * @name GetVendorById
 * @summary Get Vendor by Id (Method: getVendorById)
 * @request GET:/account-payable/voucher/get-vendor-by-id
 * @secure
 * @response `200` `{
    items: any,

}` Vendor fetched successfully
*/
  export namespace GetVendorById {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Vendor Number */
      vendorNo: number;
      /** Company Number */
      companyNo: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: any;
    };
  }

  /**
 * @description Pre-cache all vendors, APDATE records, GL Master accounts, GSTable records, and FreightInvoice records for a company to improve performance for CSV upload processing. This endpoint efficiently loads all vendor, APDATE, GL Master, GSTable (General System), and FreightInvoice data into Redis cache using bulk operations to avoid performance issues during CSV processing. Frontend usage: api.accountPayable.cacheData()
 * @tags Voucher
 * @name CacheData
 * @summary Cache all data for a company (Method: cacheData)
 * @request POST:/account-payable/voucher/cache
 * @secure
 * @response `200` `{
  \**
   * Indicates if the operation was successful
   * @example true
   *\
    success: boolean,
  \**
   * Success message
   * @example "Operation completed successfully"
   *\
    message: string,
    data: {
    vendors: {
  \**
   * Total number of vendors found for the company
   * @example 1500
   *\
    totalVendors: number,
  \**
   * Number of vendors successfully cached
   * @example 1500
   *\
    cachedVendors: number,
  \**
   * Time taken to cache vendors in milliseconds
   * @example 2500
   *\
    duration: number,

},
    apdate: {
  \**
   * Total number of APDATE records found for the company
   * @example 3500
   *\
    totalApdates: number,
  \**
   * Number of APDATE records successfully cached
   * @example 3500
   *\
    cachedApdates: number,
  \**
   * Time taken to cache APDATE records in milliseconds
   * @example 1200
   *\
    duration: number,

},
    glmaster: {
  \**
   * Total number of GL Master records found for the company
   * @example "All active GL accounts"
   *\
    totalGlMasters: string,
  \**
   * Number of GL Master records successfully cached
   * @example "All active GL accounts"
   *\
    cachedGlMasters: string,
  \**
   * Time taken to cache GL Master records in milliseconds
   * @example 800
   *\
    duration: number,
  \**
   * Indicates if GL Master caching was successful
   * @example true
   *\
    success: boolean,

},
  \**
   * Total time taken for the entire caching operation in milliseconds
   * @example 3700
   *\
    totalDuration: number,
    summary: {
  \** @example 1500 *\
    totalVendors?: number,
  \** @example 1500 *\
    cachedVendors?: number,
  \** @example 3500 *\
    totalApdates?: number,
  \** @example 3500 *\
    cachedApdates?: number,
  \** @example "All active GL accounts" *\
    totalGlMasters?: string,
  \** @example "All active GL accounts" *\
    cachedGlMasters?: string,
  \** @example "Successfully cached 1500 vendors, 3500 APDATE records, All active GL accounts GL Master records, All system configurations GSTable records, and All freight invoices FreightInvoice records for company 10" *\
    message?: string,

},

},

}` Data cached successfully
*/
  export namespace CacheData {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CacheDataPayload;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /**
       * Indicates if the operation was successful
       * @example true
       */
      success: boolean;
      /**
       * Success message
       * @example "Operation completed successfully"
       */
      message: string;
      data: {
        vendors: {
          /**
           * Total number of vendors found for the company
           * @example 1500
           */
          totalVendors: number;
          /**
           * Number of vendors successfully cached
           * @example 1500
           */
          cachedVendors: number;
          /**
           * Time taken to cache vendors in milliseconds
           * @example 2500
           */
          duration: number;
        };
        apdate: {
          /**
           * Total number of APDATE records found for the company
           * @example 3500
           */
          totalApdates: number;
          /**
           * Number of APDATE records successfully cached
           * @example 3500
           */
          cachedApdates: number;
          /**
           * Time taken to cache APDATE records in milliseconds
           * @example 1200
           */
          duration: number;
        };
        glmaster: {
          /**
           * Total number of GL Master records found for the company
           * @example "All active GL accounts"
           */
          totalGlMasters: string;
          /**
           * Number of GL Master records successfully cached
           * @example "All active GL accounts"
           */
          cachedGlMasters: string;
          /**
           * Time taken to cache GL Master records in milliseconds
           * @example 800
           */
          duration: number;
          /**
           * Indicates if GL Master caching was successful
           * @example true
           */
          success: boolean;
        };
        /**
         * Total time taken for the entire caching operation in milliseconds
         * @example 3700
         */
        totalDuration: number;
        summary: {
          /** @example 1500 */
          totalVendors?: number;
          /** @example 1500 */
          cachedVendors?: number;
          /** @example 3500 */
          totalApdates?: number;
          /** @example 3500 */
          cachedApdates?: number;
          /** @example "All active GL accounts" */
          totalGlMasters?: string;
          /** @example "All active GL accounts" */
          cachedGlMasters?: string;
          /** @example "Successfully cached 1500 vendors, 3500 APDATE records, All active GL accounts GL Master records, All system configurations GSTable records, and All freight invoices FreightInvoice records for company 10" */
          message?: string;
        };
      };
    };
  }

  /**
 * @description Frontend usage: api.accountPayable.getVoucherEntry()
 * @tags Voucher
 * @name GetVoucherEntry
 * @summary Get Voucher Entry Grid Data (Method: getVoucherEntry)
 * @request GET:/account-payable/voucher/get-voucher-entry
 * @secure
 * @response `200` `{
    items: ({
  \** @example "NORMAL" *\
    processType: string,
  \** @example 41741 *\
    entryNo: number,
  \** @example "ABC123" *\
    invoiceNo: string,
  \** @example 2443500 *\
    invoiceAmount: number,
  \** @example "02/22/04" *\
    invoiceDate: string,
  \** @example "02/22/04" *\
    dueDate: string,
  \** @example "02/22/04" *\
    discountDueDate: string,
  \** @example "123" *\
    holdDesc: string,
  \** @example 22204 *\
    companyNo: number,
  \** @example 22204 *\
    vendorNo: number,
  \** @example "ABSG CONSULTING" *\
    vendorName: string,

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` Voucher data found successfully
*/
  export namespace GetVoucherEntry {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Search term for filtering results */
      search?: string;
      /**
       * Page Number
       * @default 1
       */
      current_page?: number;
      /**
       * Limit per Page
       * @default 500
       */
      items_per_page?: number;
      /** Sort By */
      sortBy?: string;
      /** Sort Order asc or desc */
      sortOrder?: "asc" | "desc";
      /**
       * Company Number
       * @example 10
       */
      companyNo: number;
      /**
       * Vendor Number
       * @example 1001
       */
      vendorNo?: number;
      /**
       * Entry Number
       * @example 81293
       */
      entryNo?: number;
      /**
       * Process Type
       * @example "NORMAL"
       */
      processType?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: {
        /** @example "NORMAL" */
        processType: string;
        /** @example 41741 */
        entryNo: number;
        /** @example "ABC123" */
        invoiceNo: string;
        /** @example 2443500 */
        invoiceAmount: number;
        /** @example "02/22/04" */
        invoiceDate: string;
        /** @example "02/22/04" */
        dueDate: string;
        /** @example "02/22/04" */
        discountDueDate: string;
        /** @example "123" */
        holdDesc: string;
        /** @example 22204 */
        companyNo: number;
        /** @example 22204 */
        vendorNo: number;
        /** @example "ABSG CONSULTING" */
        vendorName: string;
      }[];
      pagination: {
        /** @example 100 */
        total_items: number;
        /** @example 1 */
        current_page: number;
        /** @example 10 */
        items_per_page: number;
        /** @example 10 */
        total_pages: number;
      };
    };
  }

  /**
 * @description Frontend usage: api.accountPayable.softDeleteVoucher()
 * @tags Voucher
 * @name SoftDeleteVoucher
 * @summary Soft delete a voucher (Method: softDeleteVoucher)
 * @request DELETE:/account-payable/voucher/voucher
 * @secure
 * @response `200` `{
  \** @example true *\
    success: boolean,
  \** @example "Voucher with entry number 41742, company number 10, vendor number 2, invoice number 1001 has been deleted successfully" *\
    message: string,

}` Voucher deleted successfully
*/
  export namespace SoftDeleteVoucher {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SoftDeleteVoucherDto;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success: boolean;
      /** @example "Voucher with entry number 41742, company number 10, vendor number 2, invoice number 1001 has been deleted successfully" */
      message: string;
    };
  }

  /**
 * @description Frontend usage: api.accountPayable.getDataByEntryNo()
 * @tags Voucher
 * @name GetDataByEntryNo
 * @summary Get Voucher Headers and Details (Method: getDataByEntryNo)
 * @request GET:/account-payable/voucher/entry/{entryNo}
 * @secure
 * @response `200` `{
    items?: {
    headerItem?: {
  \** @example "N" *\
    isDeleted?: string,
  \** @example 10 *\
    companyNo?: number,
  \** @example 19042 *\
    entryNo?: number,
  \** @example 1 *\
    entrySequence?: number,
  \** @example 1001 *\
    vendorNo?: number,
  \** @example 0 *\
    canceledVoucher?: number,
  \** @example 11230024 *\
    apGlNo?: number,
  \** @example "Office Supplies" *\
    invoiceDesc?: string,
  \** @example "112325" *\
    invoiceDate?: string,
  \** @example "112325" *\
    dueDate?: string,
  \** @example "Y" *\
    singleCheck?: string,
  \** @example "N" *\
    holdCode?: string,
  \** @example "No Hold" *\
    holdDesc?: string,
  \** @example "N" *\
    prepaidCode?: string,
  \** @example 0 *\
    prepaidCheckNo?: number,
  \** @example "Vendor Name" *\
    vendorName?: string,
  \** @example "Address 1" *\
    "vendorAdd1"?: string,
  \** @example "Address 2" *\
    "vendorAdd2"?: string,
  \** @example "" *\
    "vendorAdd3"?: string,
  \** @example "" *\
    "vendorAdd4"?: string,
  \** @example 11230024 *\
    bankGl?: number,
  \** @example 100000 *\
    invoiceAmount?: number,
  \** @example 11230024 *\
    retentionGl?: number,
  \** @example 10 *\
    retentionPct?: number,
  \** @example "112325" *\
    prepaidCheckdate?: string,
  \** @example 0 *\
    totalFreight?: number,
  \** @example 12059 *\
    salesOrderNo?: number,
  \** @example 1 *\
    srn?: number,
  \** @example "000000" *\
    carrierId?: string,
  \** @example 0 *\
    vendorPaymentTerms?: number,
  \** @example "NORMAL" *\
    processType?: string,
  \** @example "112325" *\
    discountDueDate?: string,
  \** @example "112325" *\
    extendedDiscountDueDate?: string,
  \** @example "1001" *\
    invoiceNo?: string,

},
    detailItems?: ({
  \** @example "N" *\
    isDeleted?: string,
  \** @example 10 *\
    companyNo?: number,
  \** @example 19042 *\
    entryNo?: number,
  \** @example 1 *\
    entrySequence?: number,
  \** @example 1001 *\
    vendorNo?: number,
  \** @example 10 *\
    lineCompanyNo?: number,
  \** @example 11230024 *\
    lineGlNo?: number,
  \** @example "Office Supplies" *\
    lineDesc?: string,
  \** @example 100000 *\
    lineAmount?: number,
  \** @example 0 *\
    discountAmount?: number,
  \** @example 0 *\
    discountPercentage?: number,
  \** @example "SUP001" *\
    inventoryItem?: string,
  \** @example 1 *\
    quantity?: number,
  \** @example "JOB001" *\
    jobNo?: string,
  \** @example "COST001" *\
    jobCostCode?: string,
  \** @example "L" *\
    jobCostType?: string,
  \** @example 1 *\
    jobCostQuantity?: number,
  \** @example 0 *\
    gallons?: number,
  \** @example 0 *\
    receiptNo?: number,
  \** @example "O" *\
    openClosed?: string,
  \** @example 1 *\
    poLineNo?: number,
  \** @example 100000 *\
    productAmount?: number,
  \** @example 0 *\
    freightAmount?: number,
  \** @example "PO001" *\
    poNo?: string,

})[],

},

}` Voucher data found successfully
*/
  export namespace GetDataByEntryNo {
    export type RequestParams = {
      entryNo: string;
    };
    export type RequestQuery = {
      /**
       * Company Number
       * @example "10"
       */
      companyNo: number;
      /**
       * Vendor Number
       * @example "02339"
       */
      vendorNo?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items?: {
        headerItem?: {
          /** @example "N" */
          isDeleted?: string;
          /** @example 10 */
          companyNo?: number;
          /** @example 19042 */
          entryNo?: number;
          /** @example 1 */
          entrySequence?: number;
          /** @example 1001 */
          vendorNo?: number;
          /** @example 0 */
          canceledVoucher?: number;
          /** @example 11230024 */
          apGlNo?: number;
          /** @example "Office Supplies" */
          invoiceDesc?: string;
          /** @example "112325" */
          invoiceDate?: string;
          /** @example "112325" */
          dueDate?: string;
          /** @example "Y" */
          singleCheck?: string;
          /** @example "N" */
          holdCode?: string;
          /** @example "No Hold" */
          holdDesc?: string;
          /** @example "N" */
          prepaidCode?: string;
          /** @example 0 */
          prepaidCheckNo?: number;
          /** @example "Vendor Name" */
          vendorName?: string;
          /** @example "Address 1" */
          vendorAdd1?: string;
          /** @example "Address 2" */
          vendorAdd2?: string;
          /** @example "" */
          vendorAdd3?: string;
          /** @example "" */
          vendorAdd4?: string;
          /** @example 11230024 */
          bankGl?: number;
          /** @example 100000 */
          invoiceAmount?: number;
          /** @example 11230024 */
          retentionGl?: number;
          /** @example 10 */
          retentionPct?: number;
          /** @example "112325" */
          prepaidCheckdate?: string;
          /** @example 0 */
          totalFreight?: number;
          /** @example 12059 */
          salesOrderNo?: number;
          /** @example 1 */
          srn?: number;
          /** @example "000000" */
          carrierId?: string;
          /** @example 0 */
          vendorPaymentTerms?: number;
          /** @example "NORMAL" */
          processType?: string;
          /** @example "112325" */
          discountDueDate?: string;
          /** @example "112325" */
          extendedDiscountDueDate?: string;
          /** @example "1001" */
          invoiceNo?: string;
        };
        detailItems?: {
          /** @example "N" */
          isDeleted?: string;
          /** @example 10 */
          companyNo?: number;
          /** @example 19042 */
          entryNo?: number;
          /** @example 1 */
          entrySequence?: number;
          /** @example 1001 */
          vendorNo?: number;
          /** @example 10 */
          lineCompanyNo?: number;
          /** @example 11230024 */
          lineGlNo?: number;
          /** @example "Office Supplies" */
          lineDesc?: string;
          /** @example 100000 */
          lineAmount?: number;
          /** @example 0 */
          discountAmount?: number;
          /** @example 0 */
          discountPercentage?: number;
          /** @example "SUP001" */
          inventoryItem?: string;
          /** @example 1 */
          quantity?: number;
          /** @example "JOB001" */
          jobNo?: string;
          /** @example "COST001" */
          jobCostCode?: string;
          /** @example "L" */
          jobCostType?: string;
          /** @example 1 */
          jobCostQuantity?: number;
          /** @example 0 */
          gallons?: number;
          /** @example 0 */
          receiptNo?: number;
          /** @example "O" */
          openClosed?: string;
          /** @example 1 */
          poLineNo?: number;
          /** @example 100000 */
          productAmount?: number;
          /** @example 0 */
          freightAmount?: number;
          /** @example "PO001" */
          poNo?: string;
        }[];
      };
    };
  }

  /**
 * @description Creates a new voucher or updates an existing one with header and associated details using upsert logic. If entryNo is provided, updates the existing voucher; otherwise creates a new one. Uses Sequelize upsert method for efficient database operations. Frontend usage: api.accountPayable.submitVoucher()
 * @tags Voucher
 * @name SubmitVoucher
 * @summary Upsert a voucher with header and details (Method: submitVoucher)
 * @request POST:/account-payable/voucher/entry/submit
 * @secure
 * @response `default` `{
    items?: {
    header?: {
  \** @example "N" *\
    isDeleted?: string,
  \** @example 10 *\
    companyNo?: number,
  \** @example 19042 *\
    entryNo?: number,
  \** @example 1 *\
    entrySequence?: number,
  \** @example 1001 *\
    vendorNo?: number,
  \** @example 0 *\
    canceledVoucher?: number,
  \** @example 11230024 *\
    apGlNo?: number,
  \** @example "Office Supplies" *\
    invoiceDesc?: string,
  \** @example "20240315" *\
    invoiceDate?: string,
  \** @example "20240415" *\
    dueDate?: string,
  \** @example "Y" *\
    singleCheck?: string,
  \** @example "N" *\
    holdCode?: string,
  \** @example "No Hold" *\
    holdDesc?: string,
  \** @example "N" *\
    prepaidCode?: string,
  \** @example 0 *\
    prepaidCheckNo?: number,
  \** @example "Vendor Name" *\
    vendorName?: string,
  \** @example "Address 1" *\
    "vendorAdd1"?: string,
  \** @example "Address 2" *\
    "vendorAdd2"?: string,
  \** @example "" *\
    "vendorAdd3"?: string,
  \** @example "" *\
    "vendorAdd4"?: string,
  \** @example 11230024 *\
    bankGl?: number,
  \** @example 100000 *\
    invoiceAmount?: number,
  \** @example 11230024 *\
    retentionGl?: number,
  \** @example 10 *\
    retentionPct?: number,
  \** @example 20240316 *\
    prepaidCheckdate?: number,
  \** @example 0 *\
    totalFreight?: number,
  \** @example 12059 *\
    salesOrderNo?: number,
  \** @example 1 *\
    srn?: number,
  \** @example "000000" *\
    carrierId?: string,
  \** @example 0 *\
    vendorPaymentTerms?: number,
  \** @example "NORMAL" *\
    processType?: string,
  \** @example "20240415" *\
    discountDueDate?: string,
  \** @example "20240416" *\
    extendedDiscountDueDate?: string,
  \** @example "1001" *\
    invoiceNo?: string,

},
    details?: ({
  \** @example "N" *\
    isDeleted?: string,
  \** @example 10 *\
    companyNo?: number,
  \** @example 19042 *\
    entryNo?: number,
  \** @example 1 *\
    entrySequence?: number,
  \** @example 1001 *\
    vendorNo?: number,
  \** @example 10 *\
    lineCompanyNo?: number,
  \** @example 11230024 *\
    lineGlNo?: number,
  \** @example "Office Supplies" *\
    lineDesc?: string,
  \** @example 100000 *\
    lineAmount?: number,
  \** @example 0 *\
    discountAmount?: number,
  \** @example 0 *\
    discountPercentage?: number,
  \** @example "SUP001" *\
    inventoryItem?: string,
  \** @example 1 *\
    quantity?: number,
  \** @example "JOB001" *\
    jobNo?: string,
  \** @example "COST001" *\
    jobCostCode?: string,
  \** @example "L" *\
    jobCostType?: string,
  \** @example 1 *\
    jobCostQuantity?: number,
  \** @example 0 *\
    gallons?: number,
  \** @example 0 *\
    receiptNo?: number,
  \** @example "O" *\
    openClosed?: string,
  \** @example 1 *\
    poLineNo?: number,
  \** @example 100000 *\
    productAmount?: number,
  \** @example 0 *\
    freightAmount?: number,
  \** @example "PO001" *\
    poNo?: string,

})[],

},

}`
*/
  export namespace SubmitVoucher {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SubmitVoucherPayload;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }

  /**
 * @description Frontend usage: api.accountPayable.submitHeaderValidation()
 * @tags Voucher
 * @name SubmitHeaderValidation
 * @summary Create or Update Voucher Header Validation (Method: submitHeaderValidation)
 * @request POST:/account-payable/voucher/header-validation
 * @secure
 * @response `400` `{
    error?: any,

}` Validation failed
*/
  export namespace SubmitHeaderValidation {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SubmitHeaderValidationPayload;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }

  /**
 * @description Frontend usage: api.accountPayable.getVoucherConfig()
 * @tags Voucher
 * @name GetVoucherConfig
 * @summary Get voucher configuration (Method: getVoucherConfig)
 * @request GET:/account-payable/voucher/config
 * @secure
 * @response `200` `{
    items: {
    company: object,
    vendor: object,
  \** @example "2%" *\
    lineDiscountPercentage?: string,

},

}` Voucher configuration retrieved successfully
*/
  export namespace GetVoucherConfig {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Company Number */
      companyNo: number;
      /** Vendor Number */
      vendorNo: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: {
        company: object;
        vendor: object;
        /** @example "2%" */
        lineDiscountPercentage?: string;
      };
    };
  }

  /**
 * @description Frontend usage: api.accountPayable.getGlMaster()
 * @tags Voucher
 * @name GetGlMaster
 * @summary Get GL master details (Method: getGlMaster)
 * @request GET:/account-payable/voucher/gl-master
 * @secure
 * @response `200` `{
    items: {
    isDeleted?: string,
    companyNo?: number,
    accountNo?: number,
    subAccountNo?: number,
    accountType?: string,
    description?: string,
    accountCategory?: string,
    statementType?: string,
    statementLine?: number,
    drBalanceForward?: number,
    crBalanceForward?: number,
    specialAccount?: string,
    keyApGal?: string,
    productCode?: string,
    glType?: string,
    poRequired?: string,

},

}` GL master details retrieved successfully
*/
  export namespace GetGlMaster {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Company Number
       * @example 10
       */
      companyNo: number;
      /**
       * GL Account Number (8 digits: first 6 digits are account number, last 2 digits are sub-account number)
       * @example 12010001
       */
      glNo: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: {
        isDeleted?: string;
        companyNo?: number;
        accountNo?: number;
        subAccountNo?: number;
        accountType?: string;
        description?: string;
        accountCategory?: string;
        statementType?: string;
        statementLine?: number;
        drBalanceForward?: number;
        crBalanceForward?: number;
        specialAccount?: string;
        keyApGal?: string;
        productCode?: string;
        glType?: string;
        poRequired?: string;
      };
    };
  }

  /**
   * @description Uploads a CSV file (Flexi, SOGAS, etc), splits into batches, processes via BullMQ and returns summary. Frontend usage: api.accountPayable.uploadCsv()
   * @tags Voucher
   * @name UploadCsv
   * @summary Upload Voucher CSV (Method: uploadCsv)
   * @request POST:/account-payable/voucher/flexi/upload
   * @secure
   * @response `200` `void` CSV accepted, split into batches, processing started.
   */
  export namespace UploadCsv {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UploadCsvPayload;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Uploads a SOGAS CSV file (regular or tax), splits into batches, processes via BullMQ and returns summary. Use the subType query parameter to specify 'regular' or 'tax'. Frontend usage: api.accountPayable.uploadSogasCsv()
   * @tags Voucher
   * @name UploadSogasCsv
   * @summary Upload SOGAS Voucher CSV (Method: uploadSogasCsv)
   * @request POST:/account-payable/voucher/sogas/upload
   * @secure
   * @response `200` `void` SOGAS CSV accepted, split into batches, processing started.
   */
  export namespace UploadSogasCsv {
    export type RequestParams = {};
    export type RequestQuery = {
      subType: string;
    };
    export type RequestBody = UploadSogasCsvPayload;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
 * @description Frontend usage: api.accountPayable.getVoucherSummary()
 * @tags Voucher
 * @name GetVoucherSummary
 * @summary Get voucher summary by company and process type (Method: getVoucherSummary)
 * @request GET:/account-payable/voucher/summary
 * @secure
 * @response `200` `{
  \** @example "$1,234.56" *\
    totalAmount: string,
  \** @example 2 *\
    countE: number,
  \** @example 1 *\
    countW: number,
  \** @example 5 *\
    countS: number,
  \** @example 8 *\
    totalUploads: number,

}` Voucher summary
*/
  export namespace GetVoucherSummary {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Company Number (only 10 allowed)
       * @example 10
       */
      companyNo: number;
      /** Process Type (NORMAL, ARGLMS, PAPER, FLEXI, SOGAS) */
      processType: PROCESS_TYPE_ENUM;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example "$1,234.56" */
      totalAmount: string;
      /** @example 2 */
      countE: number;
      /** @example 1 */
      countW: number;
      /** @example 5 */
      countS: number;
      /** @example 8 */
      totalUploads: number;
    };
  }

  /**
 * @description Frontend usage: api.accountPayable.getFlexiEntry()
 * @tags Voucher
 * @name GetFlexiEntry
 * @summary Get Flexi Entries Grid Data (Method: getFlexiEntry)
 * @request GET:/account-payable/voucher/flexi/entries
 * @secure
 * @response `200` `{
    items: ({
  \** @example "FLEXI" *\
    processType: string,
  \** @example 41741 *\
    entryNo: number,
  \** @example "ABC123" *\
    invoiceNo: string,
  \** @example 2443500 *\
    invoiceAmount: number,
  \** @example "02/22/04" *\
    invoiceDate: string,
  \** @example "02/22/04" *\
    dueDate: string,
  \** @example "02/22/04" *\
    discountDueDate: string,
  \** @example "123" *\
    holdDesc: string,
  \** @example 22204 *\
    companyNo: number,
  \** @example 22204 *\
    vendorNo: number,
  \** @example "ABSG CONSULTING" *\
    vendorName: string,

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` Flexi data found successfully
*/
  export namespace GetFlexiEntry {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Search term for filtering results */
      search?: string;
      /**
       * Page Number
       * @default 1
       */
      current_page?: number;
      /**
       * Limit per Page
       * @default 500
       */
      items_per_page?: number;
      /** Sort By */
      sortBy?: string;
      /** Sort Order asc or desc */
      sortOrder?: "asc" | "desc";
      /**
       * Company Number
       * @example 10
       */
      companyNo?: number;
      /**
       * Vendor Number
       * @example 1001
       */
      vendorNo?: number;
      /**
       * Entry Number
       * @example 81293
       */
      entryNo?: number;
      /**
       * Process Type (Only FLEXI allowed)
       * @default "FLEXI"
       * @example "FLEXI"
       */
      processType?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: {
        /** @example "FLEXI" */
        processType: string;
        /** @example 41741 */
        entryNo: number;
        /** @example "ABC123" */
        invoiceNo: string;
        /** @example 2443500 */
        invoiceAmount: number;
        /** @example "02/22/04" */
        invoiceDate: string;
        /** @example "02/22/04" */
        dueDate: string;
        /** @example "02/22/04" */
        discountDueDate: string;
        /** @example "123" */
        holdDesc: string;
        /** @example 22204 */
        companyNo: number;
        /** @example 22204 */
        vendorNo: number;
        /** @example "ABSG CONSULTING" */
        vendorName: string;
      }[];
      pagination: {
        /** @example 100 */
        total_items: number;
        /** @example 1 */
        current_page: number;
        /** @example 10 */
        items_per_page: number;
        /** @example 10 */
        total_pages: number;
      };
    };
  }

  /**
 * @description Frontend usage: api.accountPayable.getSogasEntry()
 * @tags Voucher
 * @name GetSogasEntry
 * @summary Get SOGAS Voucher Entry Grid Data (Method: getSogasEntry)
 * @request GET:/account-payable/voucher/sogas/entries
 * @secure
 * @response `200` `{
    items: ({
  \** @example "SOGAS" *\
    processType: string,
  \** @example 41741 *\
    entryNo: number,
  \** @example "ABC123" *\
    invoiceNo: string,
  \** @example 2443500 *\
    invoiceAmount: number,
  \** @example "02/22/04" *\
    invoiceDate: string,
  \** @example "02/22/04" *\
    dueDate: string,
  \** @example "02/22/04" *\
    discountDueDate: string,
  \** @example "123" *\
    holdDesc: string,
  \** @example 10 *\
    companyNo: number,
  \** @example 22204 *\
    vendorNo: number,
  \** @example "ABSG CONSULTING" *\
    vendorName: string,

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` SOGAS voucher data found successfully
*/
  export namespace GetSogasEntry {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Search term for filtering results */
      search?: string;
      /**
       * Page Number
       * @default 1
       */
      current_page?: number;
      /**
       * Limit per Page
       * @default 500
       */
      items_per_page?: number;
      /** Sort By */
      sortBy?: string;
      /** Sort Order asc or desc */
      sortOrder?: "asc" | "desc";
      /**
       * Company Number (defaults to 10)
       * @example 10
       */
      companyNo?: number;
      /**
       * Vendor Number
       * @example 1001
       */
      vendorNo?: number;
      /**
       * Entry Number
       * @example 81293
       */
      entryNo?: number;
      /**
       * Process Type (Only SOGAS allowed)
       * @default "SOGAS"
       * @example "SOGAS"
       */
      processType?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: {
        /** @example "SOGAS" */
        processType: string;
        /** @example 41741 */
        entryNo: number;
        /** @example "ABC123" */
        invoiceNo: string;
        /** @example 2443500 */
        invoiceAmount: number;
        /** @example "02/22/04" */
        invoiceDate: string;
        /** @example "02/22/04" */
        dueDate: string;
        /** @example "02/22/04" */
        discountDueDate: string;
        /** @example "123" */
        holdDesc: string;
        /** @example 10 */
        companyNo: number;
        /** @example 22204 */
        vendorNo: number;
        /** @example "ABSG CONSULTING" */
        vendorName: string;
      }[];
      pagination: {
        /** @example 100 */
        total_items: number;
        /** @example 1 */
        current_page: number;
        /** @example 10 */
        items_per_page: number;
        /** @example 10 */
        total_pages: number;
      };
    };
  }

  /**
 * @description Frontend usage: api.accountPayable.getCarrierInvoices()
 * @tags Voucher
 * @name GetCarrierInvoices
 * @summary Get a paginated list of carrier invoices (Method: getCarrierInvoices)
 * @request GET:/account-payable/voucher/paper/batch-entries
 * @secure
 * @response `200` `{
    items: ({
  \** @example "APPA" *\
    carrierId: string,
  \** @example "24601" *\
    carrierInvoiceNo?: string,
  \** @example "2025-04-29" *\
    ordShipDate: string,
  \** @example "P" *\
    invoiceType?: string,
  \** @example "363822" *\
    ourOrderNo?: number,
  \** @example 1 *\
    shippingReferenceNo?: number,
  \** @example 1373.5 *\
    invoiceAmount: number,

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` A paginated list of carrier invoices
*/
  export namespace GetCarrierInvoices {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Search term for filtering results */
      search?: string;
      /**
       * Page Number
       * @default 1
       */
      current_page?: number;
      /**
       * Limit per Page
       * @default 500
       */
      items_per_page?: number;
      /** Sort By */
      sortBy?: string;
      /** Sort Order asc or desc */
      sortOrder?: "asc" | "desc";
      /**
       * Company Number
       * @example 10
       */
      companyNo: number;
      /**
       * Process Type
       * @example "NORMAL"
       */
      processType: string;
      /**
       * Invoice Type
       * @example "NORMAL"
       */
      invoiceType?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: {
        /** @example "APPA" */
        carrierId: string;
        /** @example "24601" */
        carrierInvoiceNo?: string;
        /** @example "2025-04-29" */
        ordShipDate: string;
        /** @example "P" */
        invoiceType?: string;
        /** @example "363822" */
        ourOrderNo?: number;
        /** @example 1 */
        shippingReferenceNo?: number;
        /** @example 1373.5 */
        invoiceAmount: number;
      }[];
      pagination: {
        /** @example 100 */
        total_items: number;
        /** @example 1 */
        current_page: number;
        /** @example 10 */
        items_per_page: number;
        /** @example 10 */
        total_pages: number;
      };
    };
  }

  /**
 * @description Frontend usage: api.accountPayable.getLmsCarrierInvoices()
 * @tags Voucher
 * @name GetLmsCarrierInvoices
 * @summary Get a paginated list of Lmscarrier invoices (Method: getLmsCarrierInvoices)
 * @request GET:/account-payable/voucher/lms/batch-entries
 * @secure
 * @response `200` `{
    items: ({
  \** @example "APPA" *\
    carrierId: string,
  \** @example "24601" *\
    carrierInvoiceNo?: string,
  \** @example "2025-04-29" *\
    ordShipDate: string,
  \** @example "P" *\
    invoiceType?: string,
  \** @example "363822" *\
    ourOrderNo?: number,
  \** @example 1 *\
    shippingReferenceNo?: number,
  \** @example 1373.5 *\
    invoiceAmount: number,

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` A paginated list of carrier invoices
*/
  export namespace GetLmsCarrierInvoices {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Search term for filtering results */
      search?: string;
      /**
       * Page Number
       * @default 1
       */
      current_page?: number;
      /**
       * Limit per Page
       * @default 500
       */
      items_per_page?: number;
      /** Sort By */
      sortBy?: string;
      /** Sort Order asc or desc */
      sortOrder?: "asc" | "desc";
      /**
       * Company Number
       * @example 10
       */
      companyNo: number;
      /**
       * Process Type
       * @example "NORMAL"
       */
      processType: string;
      /**
       * Invoice Type
       * @example "NORMAL"
       */
      invoiceType?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: {
        /** @example "APPA" */
        carrierId: string;
        /** @example "24601" */
        carrierInvoiceNo?: string;
        /** @example "2025-04-29" */
        ordShipDate: string;
        /** @example "P" */
        invoiceType?: string;
        /** @example "363822" */
        ourOrderNo?: number;
        /** @example 1 */
        shippingReferenceNo?: number;
        /** @example 1373.5 */
        invoiceAmount: number;
      }[];
      pagination: {
        /** @example 100 */
        total_items: number;
        /** @example 1 */
        current_page: number;
        /** @example 10 */
        items_per_page: number;
        /** @example 10 */
        total_pages: number;
      };
    };
  }

  /**
 * @description Frontend usage: api.accountPayable.getPaperEntry()
 * @tags Voucher
 * @name GetPaperEntry
 * @summary Get Paper Voucher Entry Grid Data (Method: getPaperEntry)
 * @request GET:/account-payable/voucher/paper/entries
 * @secure
 * @response `200` `{
    items: ({
  \** @example "ABC123" *\
    invoiceNo: string,
  \** @example "02/22/04" *\
    invoiceDate: string,
  \** @example 2443500 *\
    invoiceAmount: number,
  \** @example "02/22/04" *\
    discountDueDate: string,
  \** @example "ABSG CONSULTING" *\
    vendorName: string,
  \** @example 1001 *\
    vendorNo: number,
  \** @example 101010 *\
    salesOrderNo: number,
  \** @example 10 *\
    companyNo: number,
  \** @example "NORMAL" *\
    processType: string,

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` Paper voucher data found successfully
*/
  export namespace GetPaperEntry {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Search term for filtering results */
      search?: string;
      /**
       * Page Number
       * @default 1
       */
      current_page?: number;
      /**
       * Limit per Page
       * @default 500
       */
      items_per_page?: number;
      /** Sort By */
      sortBy?: string;
      /** Sort Order asc or desc */
      sortOrder?: "asc" | "desc";
      /**
       * Company Number (defaults to 10)
       * @example 10
       */
      companyNo?: number;
      /**
       * Vendor Number
       * @example 1001
       */
      vendorNo?: number;
      /**
       * Entry Number
       * @example 81293
       */
      entryNo?: number;
      /**
       * Process Type (e.g., PAPER)
       * @default "PAPER"
       * @example "PAPER"
       */
      processType?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: {
        /** @example "ABC123" */
        invoiceNo: string;
        /** @example "02/22/04" */
        invoiceDate: string;
        /** @example 2443500 */
        invoiceAmount: number;
        /** @example "02/22/04" */
        discountDueDate: string;
        /** @example "ABSG CONSULTING" */
        vendorName: string;
        /** @example 1001 */
        vendorNo: number;
        /** @example 101010 */
        salesOrderNo: number;
        /** @example 10 */
        companyNo: number;
        /** @example "NORMAL" */
        processType: string;
      }[];
      pagination: {
        /** @example 100 */
        total_items: number;
        /** @example 1 */
        current_page: number;
        /** @example 10 */
        items_per_page: number;
        /** @example 10 */
        total_pages: number;
      };
    };
  }

  /**
 * @description Frontend usage: api.accountPayable.getLmsEntry()
 * @tags Voucher
 * @name GetLmsEntry
 * @summary Get LMS Voucher Entry Grid Data (Method: getLmsEntry)
 * @request GET:/account-payable/voucher/lms/entries
 * @secure
 * @response `200` `{
    items: ({
  \** @example "ABC123" *\
    invoiceNo: string,
  \** @example "02/22/04" *\
    invoiceDate: string,
  \** @example 2443500 *\
    invoiceAmount: number,
  \** @example "02/22/04" *\
    discountDueDate: string,
  \** @example "ABSG CONSULTING" *\
    vendorName: string,
  \** @example 1001 *\
    vendorNo: number,
  \** @example 101010 *\
    salesOrderNo: number,
  \** @example 10 *\
    companyNo: number,
  \** @example "NORMAL" *\
    processType: string,

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` LMS voucher data found successfully
*/
  export namespace GetLmsEntry {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Search term for filtering results */
      search?: string;
      /**
       * Page Number
       * @default 1
       */
      current_page?: number;
      /**
       * Limit per Page
       * @default 500
       */
      items_per_page?: number;
      /** Sort By */
      sortBy?: string;
      /** Sort Order asc or desc */
      sortOrder?: "asc" | "desc";
      /**
       * Company Number (defaults to 10)
       * @example 10
       */
      companyNo?: number;
      /**
       * Vendor Number
       * @example 1001
       */
      vendorNo?: number;
      /**
       * Entry Number
       * @example 81293
       */
      entryNo?: number;
      /**
       * Process Type (e.g., LMS)
       * @default "LMS"
       * @example "LMS"
       */
      processType?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: {
        /** @example "ABC123" */
        invoiceNo: string;
        /** @example "02/22/04" */
        invoiceDate: string;
        /** @example 2443500 */
        invoiceAmount: number;
        /** @example "02/22/04" */
        discountDueDate: string;
        /** @example "ABSG CONSULTING" */
        vendorName: string;
        /** @example 1001 */
        vendorNo: number;
        /** @example 101010 */
        salesOrderNo: number;
        /** @example 10 */
        companyNo: number;
        /** @example "NORMAL" */
        processType: string;
      }[];
      pagination: {
        /** @example 100 */
        total_items: number;
        /** @example 1 */
        current_page: number;
        /** @example 10 */
        items_per_page: number;
        /** @example 10 */
        total_pages: number;
      };
    };
  }

  /**
 * @description Frontend usage: api.accountPayable.paperBatchCreate()
 * @tags Voucher
 * @name PaperBatchCreate
 * @summary Create a batch of Paper voucher transactions (Method: paperBatchCreate)
 * @request POST:/account-payable/voucher/paper/batch
 * @secure
 * @response `default` `{
    items?: {
  \** @example "Paper batch create accepted, split into 2 batches" *\
    message?: string,
  \** @example "P-1712345678901-uuid" *\
    batchId?: string,
  \** @example 10 *\
    totalGroups?: number,
  \** @example 2 *\
    totalBatches?: number,
  \** @example "job-id-1" *\
    parentJobId?: string,
    childJobIds?: (string)[],
    groups?: (object)[],

},

}`
*/
  export namespace PaperBatchCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PaperBatchCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }

  /**
 * @description Frontend usage: api.accountPayable.lmsBatchCreate()
 * @tags Voucher
 * @name LmsBatchCreate
 * @summary Create a batch of lms voucher transactions (Method: lmsBatchCreate)
 * @request POST:/account-payable/voucher/lms/batch
 * @secure
 * @response `default` `{
    items?: {
  \** @example "Lms batch create accepted, split into 2 batches" *\
    message?: string,
  \** @example "P-1712345678901-uuid" *\
    uploadId?: string,
  \** @example 10 *\
    totalGroups?: number,
  \** @example 2 *\
    totalBatches?: number,
  \** @example "job-id-1" *\
    parentJobId?: string,
    childJobIds?: (string)[],
    groups?: (object)[],

},

}`
*/
  export namespace LmsBatchCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = LmsBatchCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }

  /**
 * @description Marks a specific voucher detail as deleted by setting isDeleted to 'D' based on the provided composite key Frontend usage: api.accountPayable.softDeleteVoucherDetail()
 * @tags Voucher
 * @name SoftDeleteVoucherDetail
 * @summary Soft delete a voucher detail (Method: softDeleteVoucherDetail)
 * @request POST:/account-payable/voucher/detail
 * @secure
 * @response `200` `{
  \**
   * Indicates if the operation was successful
   * @example true
   *\
    success: boolean,
  \**
   * Detailed message about the operation result
   * @example "Successfully soft deleted voucher detail - Company: 10, Vendor: 1001, Entry: 12345, Sequence: 1"
   *\
    message: string,

}` Voucher detail soft deleted successfully
*/
  export namespace SoftDeleteVoucherDetail {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SoftDeleteVoucherDetailDto;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /**
       * Indicates if the operation was successful
       * @example true
       */
      success: boolean;
      /**
       * Detailed message about the operation result
       * @example "Successfully soft deleted voucher detail - Company: 10, Vendor: 1001, Entry: 12345, Sequence: 1"
       */
      message: string;
    };
  }

  /**
 * @description Frontend usage: api.accountPayable.getCalculatedDueDates()
 * @tags Voucher
 * @name GetCalculatedDueDates
 * @summary Calculate due dates for a voucher (Method: getCalculatedDueDates)
 * @request GET:/account-payable/voucher/calculate-due-dates
 * @secure
 * @response `200` `{
    items: {
    companyNo?: number,
    vendorNo?: number,
    invoiceDate?: string,
    dueDate?: string,
    discountDueDate?: string,

},

}` Calculated due dates retrieved successfully
*/
  export namespace GetCalculatedDueDates {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Company Number
       * @example 10
       */
      companyNo: number;
      /**
       * Vendor Number
       * @example 1001
       */
      vendorNo: number;
      /**
       * Invoice Date
       * @example "101525"
       */
      invoiceDate: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: {
        companyNo?: number;
        vendorNo?: number;
        invoiceDate?: string;
        dueDate?: string;
        discountDueDate?: string;
      };
    };
  }
}

export namespace PurchaseJournal {
  /**
 * @description Frontend usage: api.purchaseJournal.purchaseJournalReports()
 * @tags PurchaseJournal
 * @name PurchaseJournalReports
 * @summary Get All Purchase Journal Reports (Method: purchaseJournalReports)
 * @request GET:/purchase-journal
 * @secure
 * @response `200` `{
    items: ({
  \** @example "AccountPayable_PURCHASE REGISTER" *\
    reportType: string,
  \** @example "my-report.pdf" *\
    pdfFileName?: string,
  \** @format date-time *\
    reportDateTime: string,
  \** @example "/files/my-report.pdf" *\
    filePath: string,

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` Get Report of Purchase Journal with pagination
*/
  export namespace PurchaseJournalReports {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Search term for filtering results */
      search?: string;
      /**
       * Page number for pagination
       * @default 1
       */
      current_page?: number;
      /**
       * Limit:Number of items per page
       * @default 500
       */
      items_per_page?: number;
      /** Sort field */
      sortBy?: string;
      /** Sort direction (asc or desc) */
      sortOrder?: "asc" | "desc";
      /** Type of the report */
      reportType?: string;
      /** Name of the report file */
      fileName?: string;
      /**
       * Start date of report period (MMDDYY)
       * @example "062725"
       */
      startDate?: string;
      /**
       * End date of report period (MMDDYY)
       * @example "062725"
       */
      endDate?: string;
      /**
       * Number of items per page
       * @example 10
       */
      limit?: number;
      /**
       * Offset for pagination
       * @example 0
       */
      offset?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: {
        /** @example "AccountPayable_PURCHASE REGISTER" */
        reportType: string;
        /** @example "my-report.pdf" */
        pdfFileName?: string;
        /** @format date-time */
        reportDateTime: string;
        /** @example "/files/my-report.pdf" */
        filePath: string;
      }[];
      pagination: {
        /** @example 100 */
        total_items: number;
        /** @example 1 */
        current_page: number;
        /** @example 10 */
        items_per_page: number;
        /** @example 10 */
        total_pages: number;
      };
    };
  }

  /**
   * @description Creates a new purchase journal data Frontend usage: api.purchaseJournal.submitPurchaseJournal()
   * @tags PurchaseJournal
   * @name SubmitPurchaseJournal
   * @summary Insert a Purchase Journal Data (Method: submitPurchaseJournal)
   * @request POST:/purchase-journal/submit
   * @secure
   * @response `200` `void` Purchase Journal submitted successfully
   */
  export namespace SubmitPurchaseJournal {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SubmitPurchaseJournalPayload;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
}

export namespace ApGlobalStates {
  /**
 * @description Frontend usage: api.apGlobalStates.ProcessType()
 * @tags ApGlobalStates
 * @name ProcessType
 * @summary Report List (Method: ProcessType)
 * @request GET:/ap-global-states/reportTypes/{type}
 * @secure
 * @response `200` `({
  \** @example 1 *\
    id?: number,
  \** @example "Inventory-Receipt-Posting" *\
    value?: string,
  \** @example "Inventory Receipt Posting" *\
    label?: string,

})[]` Get Report List of Purchase Journal
*/
  export namespace ProcessType {
    export type RequestParams = {
      /**
       * Report type enum values from Report_Type
       * @example "Open-Payables"
       */
      type:
        | "Open-Payables"
        | "Voucher-Posting"
        | "Vendor-Reports"
        | "Vendor-Report"
        | "AP-MONTH-END"
        | "AP-Payment-Cycle"
        | "Check-Register"
        | "Employee-Expense";
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example 1 */
      id?: number;
      /** @example "Inventory-Receipt-Posting" */
      value?: string;
      /** @example "Inventory Receipt Posting" */
      label?: string;
    }[];
  }
}

export namespace OpenPayables {
  /**
 * @description Frontend usage: api.openPayables.getOpenPayablesReport()
 * @tags OpenPayables
 * @name GetOpenPayablesReport
 * @summary Get Open Payables Report by Type (Method: getOpenPayablesReport)
 * @request GET:/open-payables
 * @secure
 * @response `200` `{
    items: ({
  \** @example "AccountPayable_PURCHASE REGISTER" *\
    reportType?: string,
  \** @example "my-report.pdf" *\
    pdfFileName?: string,
  \** @format date-time *\
    reportDateTime: string,
  \** @example "/files/my-report.pdf" *\
    filePath: string,

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` Paginated list of Open Payable Reports
*/
  export namespace GetOpenPayablesReport {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Search term for filtering results */
      search?: string;
      /**
       * Page number for pagination
       * @default 1
       */
      current_page?: number;
      /**
       * Limit:Number of items per page
       * @default 500
       */
      items_per_page?: number;
      /** Sort field */
      sortBy?: string;
      /** Sort direction (asc or desc) */
      sortOrder?: "asc" | "desc";
      /**
       * Type of report
       * @example "Open-Payables-By-Due-Date"
       */
      reportType?: Object;
      /**
       * Name of the report file
       * @example "report.pdf"
       */
      fileName?: string;
      /**
       * Start date of report period (MMDDYY)
       * @format date
       * @example "062725"
       */
      startDate?: string;
      /**
       * End date of report period (MMDDYY)
       * @format date
       * @example "062725"
       */
      endDate?: string;
      /**
       * Number of items per page
       * @example 10
       */
      limit?: number;
      /**
       * Offset for pagination
       * @example 0
       */
      offset?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: {
        /** @example "AccountPayable_PURCHASE REGISTER" */
        reportType?: string;
        /** @example "my-report.pdf" */
        pdfFileName?: string;
        /** @format date-time */
        reportDateTime: string;
        /** @example "/files/my-report.pdf" */
        filePath: string;
      }[];
      pagination: {
        /** @example 100 */
        total_items: number;
        /** @example 1 */
        current_page: number;
        /** @example 10 */
        items_per_page: number;
        /** @example 10 */
        total_pages: number;
      };
    };
  }

  /**
   * @description Frontend usage: api.openPayables.openPayableGenerateReport()
   * @tags OpenPayables
   * @name OpenPayableGenerateReport
   * @summary Generate Report for Openpayables (Method: openPayableGenerateReport)
   * @request POST:/open-payables
   * @secure
   * @response `200` `void` Open Payable report generated
   */
  export namespace OpenPayableGenerateReport {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = GenerateReportDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
}

export namespace ReportsMenu {
  /**
 * @description Frontend usage: api.reportsMenu.getReportsMenu()
 * @tags ReportsMenu
 * @name GetReportsMenu
 * @summary Get Report Menu by Type (Method: getReportsMenu)
 * @request GET:/reports-menu
 * @secure
 * @response `200` `{
    items: ({
  \** @example "AP-Month-End-Vendor-Totals" *\
    reportType?: string,
  \** @example "my-report.pdf" *\
    fileName: string,
  \** @format date-time *\
    reportDateTime: string,
  \** @example "/files/my-report.pdf" *\
    filePath: string,
  \** @example "PDF" *\
    formType: string,

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` Paginated list of Reports Menu
*/
  export namespace GetReportsMenu {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Search term for filtering results */
      search?: string;
      /**
       * Page number for pagination
       * @default 1
       */
      current_page?: number;
      /**
       * Limit:Number of items per page
       * @default 500
       */
      items_per_page?: number;
      /** Sort field */
      sortBy?: string;
      /** Sort direction (asc or desc) */
      sortOrder?: "asc" | "desc";
      /**
       * Type of report
       * @example "AP-Month-End-Vendor-Totals"
       */
      reportType?: string;
      /**
       * Name of the report file
       * @example "report.pdf"
       */
      fileName?: string;
      /**
       * Start date of report period (YYYY-MM-DD)
       * @format date
       * @example "2025-07-01"
       */
      startDate?: string;
      /**
       * End date of report period (YYYY-MM-DD)
       * @format date
       * @example "2025-07-10"
       */
      endDate?: string;
      /**
       * Number of items per page
       * @example 10
       */
      limit?: number;
      /**
       * Offset for pagination
       * @example 0
       */
      offset?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: {
        /** @example "AP-Month-End-Vendor-Totals" */
        reportType?: string;
        /** @example "my-report.pdf" */
        fileName: string;
        /** @format date-time */
        reportDateTime: string;
        /** @example "/files/my-report.pdf" */
        filePath: string;
        /** @example "PDF" */
        formType: string;
      }[];
      pagination: {
        /** @example 100 */
        total_items: number;
        /** @example 1 */
        current_page: number;
        /** @example 10 */
        items_per_page: number;
        /** @example 10 */
        total_pages: number;
      };
    };
  }

  /**
   * @description Creates a new reports menu data Frontend usage: api.reportsMenu.submitReportsMenu()
   * @tags ReportsMenu
   * @name SubmitReportsMenu
   * @summary Insert Reports Menu Data (Method: submitReportsMenu)
   * @request POST:/reports-menu/submit
   * @secure
   * @response `200` `void` Reports Menu submitted successfully
   */
  export namespace SubmitReportsMenu {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SubmitReportsMenuPayload;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
}

export namespace Payment {
  /**
 * @description Frontend usage: api.payment.getAllVoucherPaymentTypes()
 * @tags Payment
 * @name GetAllVoucherPaymentTypes
 * @summary Get all voucher to pay types (Method: getAllVoucherPaymentTypes)
 * @request GET:/payment/types
 * @secure
 * @response `200` `{
    items: ({
  \** @example "1" *\
    id: string,
  \** @example "Check" *\
    label: string,
  \** @example "Check" *\
    value: string,

})[],

}` Success
*/
  export namespace GetAllVoucherPaymentTypes {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: {
        /** @example "1" */
        id: string;
        /** @example "Check" */
        label: string;
        /** @example "Check" */
        value: string;
      }[];
    };
  }

  /**
 * @description Submit Payment Selection Type for Check, ACH, or Wire Employee Expense, or Utility vouchers and mode save or edit Frontend usage: api.payment.submitPaymentSelectionType()
 * @tags Payment
 * @name SubmitPaymentSelectionType
 * @summary Submit Payment Selection Type (Method: submitPaymentSelectionType)
 * @request POST:/payment/selection/type
 * @secure
 * @response `200` `{
  \** @example "Payment type selection submitted successfully" *\
    message?: string,

}` Payment Selection Type submitted successfully
*/
  export namespace SubmitPaymentSelectionType {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SubmitPaymentSelectionTypePayload;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example "Payment type selection submitted successfully" */
      message?: string;
    };
  }

  /**
 * @description Adds, updates, or deletes a single vendor payment line in an active payment selection type for Check, ACH, or Wire Employee Expense, or Utility vouchers. Frontend usage: api.payment.submitVendorPayment()
 * @tags Payment
 * @name SubmitVendorPayment
 * @summary Submit Vendor Payment (Method: submitVendorPayment)
 * @request POST:/payment/selection/payment-vendor
 * @secure
 * @response `200` `{
  \** @example "Vendor Payment processed successfully" *\
    message?: string,

}` Vendor payment processed successfully
*/
  export namespace SubmitVendorPayment {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SubmitVendorPaymentPayload;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example "Vendor Payment processed successfully" */
      message?: string;
    };
  }

  /**
 * @description Fetch paginated cash requirement report metadata for the given voucher and report type. Frontend usage: api.payment.getCashRequirementReports()
 * @tags Payment
 * @name GetCashRequirementReports
 * @summary Get Cash Requirement Reports (Method: getCashRequirementReports)
 * @request GET:/payment/cash-requirement/reports
 * @secure
 * @response `200` `{
    items?: ({
  \** @example "AP-Cash-Requirements" *\
    reportType?: string,
  \** @example "my-report.pdf" *\
    fileName?: string,
  \** @example "2025-07-25T10:35:44.835Z" *\
    reportDateTime?: string,
  \** @example "/files/my-report.pdf" *\
    filePath?: string,

})[],
    pagination?: {
  \** @example 34 *\
    total_items?: number,
  \** @example 1 *\
    current_page?: number,
  \** @example 10 *\
    items_per_page?: number,
  \** @example 4 *\
    total_pages?: number,

},

}` Cash requirement report metadata retrieved successfully
*/
  export namespace GetCashRequirementReports {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Search term for filtering results */
      search?: string;
      /**
       * Page number for pagination
       * @default 1
       */
      current_page?: number;
      /**
       * Limit:Number of items per page
       * @default 500
       */
      items_per_page?: number;
      /** Sort field */
      sortBy?: string;
      /** Sort direction (asc or desc) */
      sortOrder?: "asc" | "desc";
      /**
       * Voucher type (Check, ACH, Wire, Employee Expense, Utility)
       * @example "Check"
       */
      voucherToPay: "Check" | "ACH" | "Wire" | "Employee Expense" | "Utility";
      /**
       * Report Type
       * @example "AP-Cash-Requirements"
       */
      reportType?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items?: {
        /** @example "AP-Cash-Requirements" */
        reportType?: string;
        /** @example "my-report.pdf" */
        fileName?: string;
        /** @example "2025-07-25T10:35:44.835Z" */
        reportDateTime?: string;
        /** @example "/files/my-report.pdf" */
        filePath?: string;
      }[];
      pagination?: {
        /** @example 34 */
        total_items?: number;
        /** @example 1 */
        current_page?: number;
        /** @example 10 */
        items_per_page?: number;
        /** @example 4 */
        total_pages?: number;
      };
    };
  }

  /**
 * @description Fetch paginated AP Check report metadata for the given voucher type and report type. Frontend usage: api.payment.getApCheckReports()
 * @tags Payment
 * @name GetApCheckReports
 * @summary Get AP Check Reports (Method: getApCheckReports)
 * @request GET:/payment/ap-check/reports
 * @secure
 * @response `200` `{
    items?: ({
  \** @example "AP-Check-Printing" *\
    reportType?: string,
  \** @example "ap-check-report.pdf" *\
    fileName?: string,
  \** @example "2025-07-25T11:15:44.835Z" *\
    reportDateTime?: string,
  \** @example "/files/ap-check-report.pdf" *\
    filePath?: string,

})[],
    pagination?: {
  \** @example 20 *\
    total_items?: number,
  \** @example 1 *\
    current_page?: number,
  \** @example 10 *\
    items_per_page?: number,
  \** @example 2 *\
    total_pages?: number,

},

}` AP Check report metadata retrieved successfully
*/
  export namespace GetApCheckReports {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Search term for filtering results */
      search?: string;
      /**
       * Page number for pagination
       * @default 1
       */
      current_page?: number;
      /**
       * Limit:Number of items per page
       * @default 500
       */
      items_per_page?: number;
      /** Sort field */
      sortBy?: string;
      /** Sort direction (asc or desc) */
      sortOrder?: "asc" | "desc";
      /**
       * Voucher type (Check)
       * @example "Check"
       */
      voucherToPay: string;
      /**
       * Report Type
       * @example "AP-Check-Printing"
       */
      reportType?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items?: {
        /** @example "AP-Check-Printing" */
        reportType?: string;
        /** @example "ap-check-report.pdf" */
        fileName?: string;
        /** @example "2025-07-25T11:15:44.835Z" */
        reportDateTime?: string;
        /** @example "/files/ap-check-report.pdf" */
        filePath?: string;
      }[];
      pagination?: {
        /** @example 20 */
        total_items?: number;
        /** @example 1 */
        current_page?: number;
        /** @example 10 */
        items_per_page?: number;
        /** @example 2 */
        total_pages?: number;
      };
    };
  }
}

export namespace VoucherMaintenance {
  /**
 * @description Retrieve vouchers from APOPNH table with vendor information from APOPNV table. Supports filtering by voucher type (PAID, UNPAID, ALL) Frontend usage: api.voucherMaintenance.voucherMaintenance()
 * @tags Voucher Maintenance
 * @name VoucherMaintenance
 * @summary Get vouchers with pagination and filtering (Method: voucherMaintenance)
 * @request GET:/voucher-maintenance
 * @secure
 * @response `200` `{
    items: ({
  \**
   * Vendor name from APOPNV table
   * @example "ABC Supply Company"
   *\
    vendorName: string,
  \**
   * Company number
   * @example 1
   *\
    companyNo: number,
  \**
   * Vendor number
   * @example 12345
   *\
    vendorNo: number,
  \**
   * Voucher number
   * @example 67890
   *\
    voucherNo: number,
  \**
   * Open payables amount (calculated from APOPNH)
   * @example 1500.75
   *\
    openPayables: number,
  \**
   * Last paid amount from APOPNH.OPLPAM
   * @example 500
   *\
    lastPaidAmount?: number | null,
  \**
   * Last paid date from APOPNH.OPLPD8 (YYYYMMDD format)
   * @example "20240115"
   *\
    lastPaidDate?: string | null,
  \**
   * Invoice number from APOPNH.OPINVN
   * @example "INV-2024-001"
   *\
    invoiceNumber: string,
  \**
   * Invoice date from APOPNH.OPINVD (MMDDYY format for unpaid) or APHSTH.OHINVD (MMDDYY format for paid)
   * @example "012524"
   *\
    invoiceDate: string,
  \**
   * Due date from APOPNH.OPDUE8 (YYYYMMDD format)
   * @example "20240131"
   *\
    dueDate: string,
  \**
   * Gross amount from APOPNH.OPGRAM
   * @example 1500.75
   *\
    grossAmount: number,
  \**
   * Discount amount from APOPNH.OPDISC
   * @example 50
   *\
    discountAmount: number,
  \**
   * Partial paid to date from APOPNH.OPPPTD
   * @example 0
   *\
    partialPaidToDate: number,
  \**
   * Invoice description from APOPNH.OPINDS
   * @example "Office supplies purchase"
   *\
    invoiceDescription: string,
  \**
   * Hold payment flag from APOPNH.OPHALT
   * @example "N"
   *\
    holdPaymentFlag: string,
  \**
   * Hold description from APOPNH.OPHDES (UNPAID) or APHSTH.OHHDES (PAID)
   * @example "Voucher placed on hold"
   *\
    holdDescription?: string | null,
  \**
   * Prepaid voucher flag from APOPNH.OPPAID
   * @example "N"
   *\
    prepaidFlag: string,
  \**
   * Vendor address line 1 from APOPNV.OPVAD1
   * @example "123 Main Street"
   *\
    "vendorAddress1"?: string | null,
  \**
   * Vendor address line 2 from APOPNV.OPVAD2
   * @example "Suite 100"
   *\
    "vendorAddress2"?: string | null,
  \**
   * Vendor address line 3 from APOPNV.OPVAD3
   * @example "Business District"
   *\
    "vendorAddress3"?: string | null,
  \**
   * Vendor address line 4 from APOPNV.OPVAD4
   * @example "New York, NY 10001"
   *\
    "vendorAddress4"?: string | null,
  \**
   * Cancelled voucher flag from APHSTH.OHKCNL (for PAID vouchers)
   * @example "C"
   *\
    cancelledVoucher?: string | null,
  \**
   * Voucher status (derived from payment status or cancellation status)
   * @example "UNPAID"
   *\
    voucherStatus: "UNPAID" | "PAID" | "ALL" | "CANCELLED",

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` Successfully retrieved vouchers
*/
  export namespace VoucherMaintenance {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Page number (default: 1)
       * @min 1
       * @example 1
       */
      page?: number;
      /**
       * Items per page (default: 500, max: 500)
       * @min 1
       * @max 500
       * @example 500
       */
      limit?: number;
      /**
       * Filter by company number
       * @example 1
       */
      companyNo?: number;
      /**
       * Filter by vendor number
       * @example 12345
       */
      vendorNo?: number;
      /** Filter by voucher type */
      voucherType?: "UNPAID" | "PAID" | "ALL";
      /**
       * Filter by invoice date (MMDDYY format)
       * @pattern ^\d{6}$
       * @example "012524"
       */
      invoiceDate?: string;
      /**
       * Filter by invoice number
       * @maxLength 20
       * @example "INV-2024-001"
       */
      invoiceNo?: string;
      /** Sort by field */
      sortBy?: "invoiceDate";
      /** Sort order */
      sortOrder?: "ASC" | "DESC";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: {
        /**
         * Vendor name from APOPNV table
         * @example "ABC Supply Company"
         */
        vendorName: string;
        /**
         * Company number
         * @example 1
         */
        companyNo: number;
        /**
         * Vendor number
         * @example 12345
         */
        vendorNo: number;
        /**
         * Voucher number
         * @example 67890
         */
        voucherNo: number;
        /**
         * Open payables amount (calculated from APOPNH)
         * @example 1500.75
         */
        openPayables: number;
        /**
         * Last paid amount from APOPNH.OPLPAM
         * @example 500
         */
        lastPaidAmount?: number | null;
        /**
         * Last paid date from APOPNH.OPLPD8 (YYYYMMDD format)
         * @example "20240115"
         */
        lastPaidDate?: string | null;
        /**
         * Invoice number from APOPNH.OPINVN
         * @example "INV-2024-001"
         */
        invoiceNumber: string;
        /**
         * Invoice date from APOPNH.OPINVD (MMDDYY format for unpaid) or APHSTH.OHINVD (MMDDYY format for paid)
         * @example "012524"
         */
        invoiceDate: string;
        /**
         * Due date from APOPNH.OPDUE8 (YYYYMMDD format)
         * @example "20240131"
         */
        dueDate: string;
        /**
         * Gross amount from APOPNH.OPGRAM
         * @example 1500.75
         */
        grossAmount: number;
        /**
         * Discount amount from APOPNH.OPDISC
         * @example 50
         */
        discountAmount: number;
        /**
         * Partial paid to date from APOPNH.OPPPTD
         * @example 0
         */
        partialPaidToDate: number;
        /**
         * Invoice description from APOPNH.OPINDS
         * @example "Office supplies purchase"
         */
        invoiceDescription: string;
        /**
         * Hold payment flag from APOPNH.OPHALT
         * @example "N"
         */
        holdPaymentFlag: string;
        /**
         * Hold description from APOPNH.OPHDES (UNPAID) or APHSTH.OHHDES (PAID)
         * @example "Voucher placed on hold"
         */
        holdDescription?: string | null;
        /**
         * Prepaid voucher flag from APOPNH.OPPAID
         * @example "N"
         */
        prepaidFlag: string;
        /**
         * Vendor address line 1 from APOPNV.OPVAD1
         * @example "123 Main Street"
         */
        vendorAddress1?: string | null;
        /**
         * Vendor address line 2 from APOPNV.OPVAD2
         * @example "Suite 100"
         */
        vendorAddress2?: string | null;
        /**
         * Vendor address line 3 from APOPNV.OPVAD3
         * @example "Business District"
         */
        vendorAddress3?: string | null;
        /**
         * Vendor address line 4 from APOPNV.OPVAD4
         * @example "New York, NY 10001"
         */
        vendorAddress4?: string | null;
        /**
         * Cancelled voucher flag from APHSTH.OHKCNL (for PAID vouchers)
         * @example "C"
         */
        cancelledVoucher?: string | null;
        /**
         * Voucher status (derived from payment status or cancellation status)
         * @example "UNPAID"
         */
        voucherStatus: "UNPAID" | "PAID" | "ALL" | "CANCELLED";
      }[];
      pagination: {
        /** @example 100 */
        total_items: number;
        /** @example 1 */
        current_page: number;
        /** @example 10 */
        items_per_page: number;
        /** @example 10 */
        total_pages: number;
      };
    };
  }

  /**
 * @description Retrieves a summary of vouchers filtered by type, company, and vendor Frontend usage: api.voucherMaintenance.getVoucherMaintenanceSummary()
 * @tags Voucher Maintenance
 * @name GetVoucherMaintenanceSummary
 * @summary Get voucher summary (Method: getVoucherMaintenanceSummary)
 * @request GET:/voucher-maintenance/summary
 * @secure
 * @response `200` `{
    data?: ({
  \** @example "ABC Supply Company" *\
    vendorName?: string,
  \** @example 1 *\
    companyNo?: number,
  \** @example 12345 *\
    vendorNo?: number,
  \** @example 1000.5 *\
    lastPaidAmount?: number | null,
  \** @example "2023-01-01" *\
    lastPaidDate?: string | null,
  \** @example 500.25 *\
    openPayables?: number | null,
  \** @example "2023-12-31" *\
    openPayablesDate?: string | null,
  \** @example "UNPAID" *\
    type?: "PAID" | "UNPAID" | "ALL",

})[],

}` Successfully retrieved voucher summary
*/
  export namespace GetVoucherMaintenanceSummary {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Type of vouchers to retrieve
       * @example "UNPAID"
       */
      voucherType: "UNPAID" | "PAID" | "ALL" | "CANCELLED";
      /**
       * Company number
       * @example 10
       */
      companyNo: number;
      /**
       * Vendor number
       * @example 6675
       */
      vendorNo: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      data?: {
        /** @example "ABC Supply Company" */
        vendorName?: string;
        /** @example 1 */
        companyNo?: number;
        /** @example 12345 */
        vendorNo?: number;
        /** @example 1000.5 */
        lastPaidAmount?: number | null;
        /** @example "2023-01-01" */
        lastPaidDate?: string | null;
        /** @example 500.25 */
        openPayables?: number | null;
        /** @example "2023-12-31" */
        openPayablesDate?: string | null;
        /** @example "UNPAID" */
        type?: "PAID" | "UNPAID" | "ALL";
      }[];
    };
  }

  /**
 * @description Retrieves detailed voucher information based on voucher type, company number, vendor number, and voucher number. For PAID vouchers, data comes from APHSTH/APHSTD tables. For UNPAID vouchers, data comes from APOPNH/APOPND tables. Frontend usage: api.voucherMaintenance.getVoucherMaintenanceById()
 * @tags Voucher Maintenance
 * @name GetVoucherMaintenanceById
 * @summary Get voucher details by ID (Method: getVoucherMaintenanceById)
 * @request GET:/voucher-maintenance/{voucherNo}
 * @secure
 * @response `200` `{
    data: {
    headerItems: {
  \**
   * Vendor name
   * @example "ABC Supply Company"
   *\
    vendorName: string,
  \**
   * Company number
   * @example 10
   *\
    companyNo: number,
  \**
   * Vendor number
   * @example 12345
   *\
    vendorNo: number,
  \**
   * Voucher number
   * @example 67890
   *\
    voucherNo: number,
  \**
   * Invoice number
   * @example "INV-2024-001"
   *\
    invoiceNumber: string,
  \**
   * Invoice date (YYYYMMDD format)
   * @example "20240101"
   *\
    invoiceDate: string,
  \**
   * Due date (YYYYMMDD format)
   * @example "20240131"
   *\
    dueDate: string,
  \**
   * Gross amount
   * @example 1500.75
   *\
    grossAmount: number,
  \**
   * Discount amount
   * @example 50
   *\
    discountAmount: number,
  \**
   * Partial paid to date
   * @example 0
   *\
    partialPaidToDate: number,
  \**
   * Invoice description
   * @example "Office supplies purchase"
   *\
    invoiceDescription: string,
  \**
   * Voucher type
   * @example "PAID"
   *\
    voucherType: "PAID" | "UNPAID",
  \**
   * Check number (for PAID vouchers)
   * @example 123456
   *\
    checkNo?: number | null,
  \**
   * Paid date (YYYYMMDD format, for PAID vouchers)
   * @example "20240115"
   *\
    paidDate?: string | null,
  \**
   * Cancelled voucher flag from APHSTH.OHKCNL (for PAID vouchers)
   * @example "C"
   *\
    cancelledVoucher?: string | null,
  \**
   * Last paid amount
   * @example 500
   *\
    lastPaidAmount?: number | null,
  \**
   * Last paid date (YYYYMMDD format)
   * @example "20240115"
   *\
    lastPaidDate?: string | null,
  \**
   * Discount due date (YYYYMMDD format)
   * @example "20240115"
   *\
    discountDueDate?: string | null,
  \**
   * Hold payment flag
   * @example "N"
   *\
    holdPaymentFlag: string,
  \**
   * Hold description from APOPNH.OPHDES (UNPAID) or APHSTH.OHHDES (PAID)
   * @example "Voucher placed on hold"
   *\
    holdDescription?: string | null,
  \**
   * Prepaid voucher flag
   * @example "N"
   *\
    prepaidFlag: string,
  \**
   * Vendor address line 1
   * @example "123 Main Street"
   *\
    "vendorAddress1"?: string | null,
  \**
   * Vendor address line 2
   * @example "Suite 100"
   *\
    "vendorAddress2"?: string | null,
  \**
   * Vendor address line 3
   * @example "Business District"
   *\
    "vendorAddress3"?: string | null,
  \**
   * Vendor address line 4
   * @example "New York, NY 10001"
   *\
    "vendorAddress4"?: string | null,
  \**
   * Net amount (gross amount - discount amount)
   * @example 1450.75
   *\
    netAmount: number,

},
    detailItems: ({
  \** @example 1 *\
    sequenceNo?: number,
  \** @example 1 *\
    detailType?: number,
  \** @example 1 *\
    detail?: number,
  \** @example "Fuel purchase" *\
    lineDescription?: string,
  \** @example 150 *\
    grossAmount?: number,
  \** @example 0 *\
    discountAmount?: number,
  \** @example 150 *\
    netAmount?: number,
  \** @example 150 *\
    partialPaidToDate?: number,
  \** @example 5000 *\
    expenseGlAccount?: number,
  \** @example 10 *\
    expenseCompanyNo?: number,
  \** @example "20240115" *\
    lastPaidDate?: string | null,
  \** @example "PJ001" *\
    purchaseJournalNo?: string,
  \** @example "FUEL001" *\
    inventoryItemNo?: string,
  \** @example 50 *\
    quantity?: number,
  \** @example "JOB001" *\
    jobNo?: string,
  \** @example "EXTRA" *\
    jobExtraField?: string,
  \** @example "FUEL" *\
    costCode?: string,
  \** @example "DIRECT" *\
    costType?: string,
  \** @example 50 *\
    jobCostQuantity?: number,
  \** @example "PO001" *\
    purchaseOrderNo?: string,
  \** @example 12345 *\
    receiptNumber?: number,
  \** @example "OPEN" *\
    poStatus?: string,
  \** @example 1 *\
    poLineSequenceNo?: number,
  \** @example 150 *\
    productAmount?: number,
  \** @example 0 *\
    freightAmount?: number,
  \** @example "PO001" *\
    poNumber?: string,

})[],

},
  \** @example "success" *\
    status: string,
  \** @example "Successfully retrieved voucher view details" *\
    message: string,

}` Successfully retrieved voucher view details
*/
  export namespace GetVoucherMaintenanceById {
    export type RequestParams = {
      /**
       * Voucher number
       * @example 67890
       */
      voucherNo: number;
    };
    export type RequestQuery = {
      /** Type of voucher to retrieve */
      voucherType: "PAID" | "UNPAID";
      /**
       * Company number
       * @example 10
       */
      companyNo: number;
      /**
       * Vendor number
       * @example 12345
       */
      vendorNo: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      data: {
        headerItems: {
          /**
           * Vendor name
           * @example "ABC Supply Company"
           */
          vendorName: string;
          /**
           * Company number
           * @example 10
           */
          companyNo: number;
          /**
           * Vendor number
           * @example 12345
           */
          vendorNo: number;
          /**
           * Voucher number
           * @example 67890
           */
          voucherNo: number;
          /**
           * Invoice number
           * @example "INV-2024-001"
           */
          invoiceNumber: string;
          /**
           * Invoice date (YYYYMMDD format)
           * @example "20240101"
           */
          invoiceDate: string;
          /**
           * Due date (YYYYMMDD format)
           * @example "20240131"
           */
          dueDate: string;
          /**
           * Gross amount
           * @example 1500.75
           */
          grossAmount: number;
          /**
           * Discount amount
           * @example 50
           */
          discountAmount: number;
          /**
           * Partial paid to date
           * @example 0
           */
          partialPaidToDate: number;
          /**
           * Invoice description
           * @example "Office supplies purchase"
           */
          invoiceDescription: string;
          /**
           * Voucher type
           * @example "PAID"
           */
          voucherType: "PAID" | "UNPAID";
          /**
           * Check number (for PAID vouchers)
           * @example 123456
           */
          checkNo?: number | null;
          /**
           * Paid date (YYYYMMDD format, for PAID vouchers)
           * @example "20240115"
           */
          paidDate?: string | null;
          /**
           * Cancelled voucher flag from APHSTH.OHKCNL (for PAID vouchers)
           * @example "C"
           */
          cancelledVoucher?: string | null;
          /**
           * Last paid amount
           * @example 500
           */
          lastPaidAmount?: number | null;
          /**
           * Last paid date (YYYYMMDD format)
           * @example "20240115"
           */
          lastPaidDate?: string | null;
          /**
           * Discount due date (YYYYMMDD format)
           * @example "20240115"
           */
          discountDueDate?: string | null;
          /**
           * Hold payment flag
           * @example "N"
           */
          holdPaymentFlag: string;
          /**
           * Hold description from APOPNH.OPHDES (UNPAID) or APHSTH.OHHDES (PAID)
           * @example "Voucher placed on hold"
           */
          holdDescription?: string | null;
          /**
           * Prepaid voucher flag
           * @example "N"
           */
          prepaidFlag: string;
          /**
           * Vendor address line 1
           * @example "123 Main Street"
           */
          vendorAddress1?: string | null;
          /**
           * Vendor address line 2
           * @example "Suite 100"
           */
          vendorAddress2?: string | null;
          /**
           * Vendor address line 3
           * @example "Business District"
           */
          vendorAddress3?: string | null;
          /**
           * Vendor address line 4
           * @example "New York, NY 10001"
           */
          vendorAddress4?: string | null;
          /**
           * Net amount (gross amount - discount amount)
           * @example 1450.75
           */
          netAmount: number;
        };
        detailItems: {
          /** @example 1 */
          sequenceNo?: number;
          /** @example 1 */
          detailType?: number;
          /** @example 1 */
          detail?: number;
          /** @example "Fuel purchase" */
          lineDescription?: string;
          /** @example 150 */
          grossAmount?: number;
          /** @example 0 */
          discountAmount?: number;
          /** @example 150 */
          netAmount?: number;
          /** @example 150 */
          partialPaidToDate?: number;
          /** @example 5000 */
          expenseGlAccount?: number;
          /** @example 10 */
          expenseCompanyNo?: number;
          /** @example "20240115" */
          lastPaidDate?: string | null;
          /** @example "PJ001" */
          purchaseJournalNo?: string;
          /** @example "FUEL001" */
          inventoryItemNo?: string;
          /** @example 50 */
          quantity?: number;
          /** @example "JOB001" */
          jobNo?: string;
          /** @example "EXTRA" */
          jobExtraField?: string;
          /** @example "FUEL" */
          costCode?: string;
          /** @example "DIRECT" */
          costType?: string;
          /** @example 50 */
          jobCostQuantity?: number;
          /** @example "PO001" */
          purchaseOrderNo?: string;
          /** @example 12345 */
          receiptNumber?: number;
          /** @example "OPEN" */
          poStatus?: string;
          /** @example 1 */
          poLineSequenceNo?: number;
          /** @example 150 */
          productAmount?: number;
          /** @example 0 */
          freightAmount?: number;
          /** @example "PO001" */
          poNumber?: string;
        }[];
      };
      /** @example "success" */
      status: string;
      /** @example "Successfully retrieved voucher view details" */
      message: string;
    };
  }

  /**
 * @description Updates the status of a voucher in APOPNH table. Updates OPHALT column with status code and OPHDES column with status description. Frontend usage: api.voucherMaintenance.updateVoucherMaintenanceStatus()
 * @tags Voucher Maintenance
 * @name UpdateVoucherMaintenanceStatus
 * @summary Update voucher status (Method: updateVoucherMaintenanceStatus)
 * @request POST:/voucher-maintenance/status
 * @secure
 * @response `200` `{
    data?: {
  \**
   * Success message
   * @example "Voucher status updated successfully"
   *\
    message?: string,
    voucher?: {
  \**
   * Company number
   * @example 10
   *\
    companyNo?: number,
  \**
   * Vendor number
   * @example 12345
   *\
    vendorNo?: number,
  \**
   * Voucher number
   * @example 67890
   *\
    voucherNo?: number,
  \**
   * Updated status code
   * @example "H"
   *\
    statusCode?: " " | "H" | "A" | "W" | "E" | "U",
  \**
   * Updated status description
   * @example "Voucher placed on hold for review"
   *\
    statusDescription?: string,
  \**
   * Update timestamp
   * @example "2024-01-15T10:30:00.000Z"
   *\
    updatedAt?: string,

},

},

}` Successfully updated voucher status
*/
  export namespace UpdateVoucherMaintenanceStatus {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UpdateVoucherStatusDto;
    export type RequestHeaders = {};
    export type ResponseBody = {
      data?: {
        /**
         * Success message
         * @example "Voucher status updated successfully"
         */
        message?: string;
        voucher?: {
          /**
           * Company number
           * @example 10
           */
          companyNo?: number;
          /**
           * Vendor number
           * @example 12345
           */
          vendorNo?: number;
          /**
           * Voucher number
           * @example 67890
           */
          voucherNo?: number;
          /**
           * Updated status code
           * @example "H"
           */
          statusCode?: " " | "H" | "A" | "W" | "E" | "U";
          /**
           * Updated status description
           * @example "Voucher placed on hold for review"
           */
          statusDescription?: string;
          /**
           * Update timestamp
           * @example "2024-01-15T10:30:00.000Z"
           */
          updatedAt?: string;
        };
      };
    };
  }

  /**
 * @description Updates the discount due date (OPDSDT) and discount amount (OPDISC) in APOPNH table for a specific voucher. Frontend usage: api.voucherMaintenance.updateVoucherDiscount()
 * @tags Voucher Maintenance
 * @name UpdateVoucherDiscount
 * @summary Update voucher discount information (Method: updateVoucherDiscount)
 * @request POST:/voucher-maintenance/discount
 * @secure
 * @response `200` `{
    data?: {
  \**
   * Success message
   * @example "Discount information updated successfully"
   *\
    message?: string,
    voucher?: {
  \**
   * Company number
   * @example 10
   *\
    companyNo?: number,
  \**
   * Vendor number
   * @example 12345
   *\
    vendorNo?: number,
  \**
   * Voucher number
   * @example 67890
   *\
    voucherNo?: number,
  \**
   * Updated discount due date (MMDDYY format)
   * @example "011524"
   *\
    discountDueDate?: string,
  \**
   * Updated discount amount
   * @example 50
   *\
    discount?: number,
  \**
   * Update timestamp
   * @example "2024-01-15T10:30:00.000Z"
   *\
    updatedAt?: string,

},

},

}` Successfully updated voucher discount information
*/
  export namespace UpdateVoucherDiscount {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UpdateDiscountDto;
    export type RequestHeaders = {};
    export type ResponseBody = {
      data?: {
        /**
         * Success message
         * @example "Discount information updated successfully"
         */
        message?: string;
        voucher?: {
          /**
           * Company number
           * @example 10
           */
          companyNo?: number;
          /**
           * Vendor number
           * @example 12345
           */
          vendorNo?: number;
          /**
           * Voucher number
           * @example 67890
           */
          voucherNo?: number;
          /**
           * Updated discount due date (MMDDYY format)
           * @example "011524"
           */
          discountDueDate?: string;
          /**
           * Updated discount amount
           * @example 50
           */
          discount?: number;
          /**
           * Update timestamp
           * @example "2024-01-15T10:30:00.000Z"
           */
          updatedAt?: string;
        };
      };
    };
  }

  /**
 * @description Transfers a voucher from source tables (APOPNH/APOPND for UNPAID or APHSTH/APHSTD for PAID) to APTRANH/APTRAND tables. Creates new entry records in the target tables. Frontend usage: api.voucherMaintenance.transferVoucher()
 * @tags Voucher Maintenance
 * @name TransferVoucher
 * @summary Transfer voucher to APTRANH/APTRAND (Method: transferVoucher)
 * @request POST:/voucher-maintenance/transfer
 * @secure
 * @response `200` `{
    data?: {
  \**
   * Success message
   * @example "Voucher transferred successfully to APTRANH/APTRAND"
   *\
    message?: string,
    voucher?: {
  \**
   * Company number
   * @example 10
   *\
    companyNo?: number,
  \**
   * Vendor number
   * @example 12345
   *\
    vendorNo?: number,
  \**
   * Voucher number
   * @example 67890
   *\
    voucherNo?: number,
  \**
   * Type of voucher transferred
   * @example "UNPAID"
   *\
    voucherType?: "PAID" | "UNPAID",
  \**
   * Source table(s) where voucher was transferred from
   * @example "APOPNH/APOPND"
   *\
    sourceTable?: string,
  \**
   * Target table(s) where voucher was transferred to
   * @example "APTRANH/APTRAND"
   *\
    targetTable?: string,
  \**
   * Transfer timestamp
   * @example "2024-01-15T10:30:00.000Z"
   *\
    transferredAt?: string,
  \**
   * New entry number created in APTRANH
   * @example 12345
   *\
    headerRecordId?: number,
  \**
   * New entry numbers created in APTRAND
   * @example [12345,12346]
   *\
    detailRecordIds?: (number)[],

},

},

}` Successfully transferred voucher to APTRANH/APTRAND
*/
  export namespace TransferVoucher {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = TransferVoucherDto;
    export type RequestHeaders = {};
    export type ResponseBody = {
      data?: {
        /**
         * Success message
         * @example "Voucher transferred successfully to APTRANH/APTRAND"
         */
        message?: string;
        voucher?: {
          /**
           * Company number
           * @example 10
           */
          companyNo?: number;
          /**
           * Vendor number
           * @example 12345
           */
          vendorNo?: number;
          /**
           * Voucher number
           * @example 67890
           */
          voucherNo?: number;
          /**
           * Type of voucher transferred
           * @example "UNPAID"
           */
          voucherType?: "PAID" | "UNPAID";
          /**
           * Source table(s) where voucher was transferred from
           * @example "APOPNH/APOPND"
           */
          sourceTable?: string;
          /**
           * Target table(s) where voucher was transferred to
           * @example "APTRANH/APTRAND"
           */
          targetTable?: string;
          /**
           * Transfer timestamp
           * @example "2024-01-15T10:30:00.000Z"
           */
          transferredAt?: string;
          /**
           * New entry number created in APTRANH
           * @example 12345
           */
          headerRecordId?: number;
          /**
           * New entry numbers created in APTRAND
           * @example [12345,12346]
           */
          detailRecordIds?: number[];
        };
      };
    };
  }
}

export namespace VendorManagement {
  /**
 * @description Frontend usage: api.vendorManagement.getVendorTypes()
 * @tags Vendor Management
 * @name GetVendorTypes
 * @summary Vendor Types List (Method: getVendorTypes)
 * @request GET:/vendor-management/types
 * @secure
 * @response `200` `({
  \** @example "A" *\
    id?: string,
  \** @example "ACK" *\
    value?: string,
  \** @example "ACK" *\
    label?: string,

})[]` Get list of Vendor Types
*/
  export namespace GetVendorTypes {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example "A" */
      id?: string;
      /** @example "ACK" */
      value?: string;
      /** @example "ACK" */
      label?: string;
    }[];
  }

  /**
 * @description Frontend usage: api.vendorManagement.getVendorList()
 * @tags Vendor Management
 * @name GetVendorList
 * @summary Vendor List (Method: getVendorList)
 * @request GET:/vendor-management/list
 * @secure
 * @response `200` `{
    items?: ({
  \** @example "Inactive" *\
    vendorIsDeleted?: string,
  \** @example 10 *\
    vendorCompanyNumber?: number,
  \** @example 1 *\
    vendorNo?: number,
  \** @example 3681278 *\
    vendorTelephoneNo?: number,
  \** @example 0 *\
    vendorLastPaymentAmt?: number,
  \** @example 0 *\
    vendorLastPaymentDate?: number,
  \** @example "" *\
    vendorHoldPaymentsVend?: string,

})[],
    pagination?: {
  \** @example 7059 *\
    total_items?: number,
  \** @example 1 *\
    current_page?: number,
  \** @example 100 *\
    items_per_page?: number,
  \** @example 71 *\
    total_pages?: number,

},

}` Get list of Vendors with pagination info
*/
  export namespace GetVendorList {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Search term for filtering results */
      search?: string;
      /**
       * Page number for pagination
       * @default 1
       */
      current_page?: number;
      /**
       * Limit:Number of items per page
       * @default 500
       */
      items_per_page?: number;
      /** Sort field */
      sortBy?: string;
      /** Sort direction (asc or desc) */
      sortOrder?: "asc" | "desc";
      /**
       * Company Number
       * @example 10
       */
      companyNo: number;
      /**
       * Vendor No
       * @example 1100
       */
      vendorNo?: number;
      /**
       * Vendor Type
       * @example "E"
       */
      type?: string;
      /**
       * Vendor Status
       * @example "A"
       */
      status?: string;
      /**
       * Number of items per page
       * @example 10
       */
      limit?: number;
      /**
       * Offset for pagination
       * @example 0
       */
      offset?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items?: {
        /** @example "Inactive" */
        vendorIsDeleted?: string;
        /** @example 10 */
        vendorCompanyNumber?: number;
        /** @example 1 */
        vendorNo?: number;
        /** @example 3681278 */
        vendorTelephoneNo?: number;
        /** @example 0 */
        vendorLastPaymentAmt?: number;
        /** @example 0 */
        vendorLastPaymentDate?: number;
        /** @example "" */
        vendorHoldPaymentsVend?: string;
      }[];
      pagination?: {
        /** @example 7059 */
        total_items?: number;
        /** @example 1 */
        current_page?: number;
        /** @example 100 */
        items_per_page?: number;
        /** @example 71 */
        total_pages?: number;
      };
    };
  }

  /**
 * @description Frontend usage: api.vendorManagement.createOrUpdateVendor()
 * @tags Vendor Management
 * @name CreateOrUpdateVendor
 * @summary Vendor Create or Update (Method: createOrUpdateVendor)
 * @request POST:/vendor-management
 * @secure
 * @response `200` `{
  \** @example "Vendor Details Updated Successfully" *\
    message?: string,

}` Create or Update Vendor
*/
  export namespace CreateOrUpdateVendor {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Vendor isDeleted
       * @example "A"
       */
      vendorIsDeleted: string;
      /**
       * Company Number
       * @example 10
       */
      vendorCompanyNumber: number;
      /**
       * Vendor Name Overflow
       * @example "A"
       */
      vendorNameOverflow?: string;
      /**
       * Vendor Number
       * @example 9875
       */
      vendorNo: number;
      /**
       * Vendor Name
       * @example "Abhishek Consulting"
       */
      vendorName: string;
      /** Vendor Address Line 1 */
      vendorAdd1?: string;
      /** Vendor Address Line 2 */
      vendorAdd2?: string;
      /** Vendor Address Line 3 */
      vendorAdd3?: string;
      /** Vendor Address Line 4 */
      vendorAdd4?: string;
      /**
       * Country Code
       * @example "US"
       */
      vendorCountryCode: string;
      /**
       * 1099 Id
       * @example "Test"
       */
      IdNo1099?: string;
      /**
       * Zip Code
       * @example 4015
       */
      vendorZipCode: number;
      /**
       * Area Code
       * @example 996
       */
      vendorAreaCode?: number;
      /**
       * Telephone Number
       * @example 996
       */
      vendorTelephoneNo?: number;
      /**
       * Hold Payments Indicator
       * @example "A"
       */
      vendorHoldPaymentsVend?: string;
      /**
       * GAL Receipts Required
       * @example "T"
       */
      vendorGalRcptsRequired?: string;
      /**
       * Single Check Indicator
       * @example "T"
       */
      vendorSingleCheck?: string;
      /**
       * AP Terms Code
       * @example 10
       */
      vendorApTermsCode?: number;
      /**
       * ADP Payroll ID
       * @example 123
       */
      vendorAdpPayrollId?: number;
      /**
       * Vendor Category Code
       * @example "INA"
       */
      vendorCategoryCode?: string;
      /**
       * Expense GL Subaccount
       * @example 1234
       */
      vendorExpenseGLSub?: number;
      /**
       * ACH Bank Account Number
       * @example "Test"
       */
      vendorAchBankAccountNumber?: string;
      /**
       * ACH Bank Routing Code
       * @example 123456789
       */
      vendorAchBankRoutingCode?: number;
      /**
       * Account Type (C=Checking, S=Savings)
       * @example "C"
       */
      vendorAchCheckingOrSavings?: string;
      /**
       * ACH Class
       * @example "A"
       */
      vendorAchClass?: string;
      /**
       * Vendor First Name
       * @example "Test"
       */
      vendorFirstName?: string;
      /**
       * Vendor Middle Name
       * @example "Test"
       */
      vendorMiddleName?: string;
      /**
       * Vendor Last Name (Business)
       * @example "Test"
       */
      vendorBusinessLastName?: string;
      /**
       * Vendor Name Suffix
       * @example "Sr"
       */
      vendorNameSuffix?: string;
      /**
       * AP 1099 Code
       * @example "T"
       */
      vendorAp1099Code?: string;
      /**
       * First 1099 Box Number
       * @example 1
       */
      vendorFirst1099BoxNumber?: number;
      /**
       * Second 1099 Box Number
       * @example 2
       */
      vendorSecond1099BoxNumber?: number;
      /**
       * Second 1099 Box Amount
       * @example 50
       */
      vendorSecond1099BoxAmount?: number;
      /**
       * Payee Name 1
       * @example "Test"
       */
      vendorPayeeName1?: string;
      /**
       * Payee Name 2
       * @example "Test"
       */
      vendorPayeeName2?: string;
      /**
       * IRS Name Control
       * @example "T"
       */
      vendorIrsNameControl?: string;
      /** List of Contact Details */
      contactDetails?: string[];
    };
    export type RequestBody = VendorandVendorContactDetailsInputDto;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example "Vendor Details Updated Successfully" */
      message?: string;
    };
  }

  /**
 * @description Frontend usage: api.vendorManagement.getOwnerMappingList()
 * @tags Vendor Management
 * @name GetOwnerMappingList
 * @summary Vendor Owner List (Method: getOwnerMappingList)
 * @request GET:/vendor-management/owner-mapping
 * @secure
 * @response `200` `{
    items?: ({
  \** @example 12345 *\
    ownerNo?: number,
  \** @example 2 *\
    vendorNo?: number,
  \** @example "Inactive" *\
    vendorIsDeleted?: string,
  \** @example "CUSTOMER SUPPLIED COMPONENTS" *\
    vendorName?: string,

})[],
    pagination?: {
  \** @example 7059 *\
    total_items?: number,
  \** @example 1 *\
    current_page?: number,
  \** @example 100 *\
    items_per_page?: number,
  \** @example 71 *\
    total_pages?: number,

},

}` Get list of Vendors Owner with pagination info
*/
  export namespace GetOwnerMappingList {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Search term for filtering results */
      search?: string;
      /**
       * Page number for pagination
       * @default 1
       */
      current_page?: number;
      /**
       * Limit:Number of items per page
       * @default 500
       */
      items_per_page?: number;
      /** Sort field */
      sortBy?: string;
      /** Sort direction (asc or desc) */
      sortOrder?: "asc" | "desc";
      /**
       * Company Number
       * @example 10
       */
      vendorCompanyNumber: number;
      /**
       * Vendor No
       * @example 1444
       */
      vendorNo?: number;
      /**
       * Status
       * @example "A"
       */
      status?: string;
      /**
       * Owner No
       * @example 2527
       */
      ownerNo: number;
      /**
       * Number of items per page
       * @example 100
       */
      limit?: number;
      /**
       * Offset for pagination
       * @example 0
       */
      offset?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items?: {
        /** @example 12345 */
        ownerNo?: number;
        /** @example 2 */
        vendorNo?: number;
        /** @example "Inactive" */
        vendorIsDeleted?: string;
        /** @example "CUSTOMER SUPPLIED COMPONENTS" */
        vendorName?: string;
      }[];
      pagination?: {
        /** @example 7059 */
        total_items?: number;
        /** @example 1 */
        current_page?: number;
        /** @example 100 */
        items_per_page?: number;
        /** @example 71 */
        total_pages?: number;
      };
    };
  }

  /**
 * @description Frontend usage: api.vendorManagement.getOwnerDetails()
 * @tags Vendor Management
 * @name GetOwnerDetails
 * @summary Vendor Owner Details (Method: getOwnerDetails)
 * @request GET:/vendor-management/owner
 * @secure
 * @response `200` `{
  \** @example 63873 *\
    ownerNo?: number,
  \** @example 1444 *\
    vendorNo?: number,
  \** @example "I" *\
    isDeleted?: string,
  \** @example "                                                   " *\
    filler?: string,
    vendorDetails?: {
  \** @example "AIELLO BROTHERS OIL & GAS INC " *\
    vendorName?: string,

},

}` Get Vendor Owner Details
*/
  export namespace GetOwnerDetails {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Owner No
       * @example 63875
       */
      ownerNo: number;
      /**
       * Vendor No
       * @example 1444
       */
      vendorNo?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example 63873 */
      ownerNo?: number;
      /** @example 1444 */
      vendorNo?: number;
      /** @example "I" */
      isDeleted?: string;
      /** @example "                                                   " */
      filler?: string;
      vendorDetails?: {
        /** @example "AIELLO BROTHERS OIL & GAS INC " */
        vendorName?: string;
      };
    };
  }

  /**
 * @description Frontend usage: api.vendorManagement.CreateAndUpdateOwner()
 * @tags Vendor Management
 * @name CreateAndUpdateOwner
 * @summary Create Or Update Vendor Owner Details (Method: CreateAndUpdateOwner)
 * @request POST:/vendor-management/owner
 * @secure
 * @response `200` `{
  \** @example "Vendor Owner details saved successfully" *\
    message?: string,

}` Create or Update Vendor Owner Details
*/
  export namespace CreateAndUpdateOwner {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = VendorOwnerDto;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example "Vendor Owner details saved successfully" */
      message?: string;
    };
  }

  /**
 * @description Frontend usage: api.vendorManagement.getVendorDetails()
 * @tags Vendor Management
 * @name GetVendorDetails
 * @summary Vendor with contact details (Method: getVendorDetails)
 * @request GET:/vendor-management/details
 * @secure
 * @response `200` `{
    items?: object,

}` Get vendor details along with contact
*/
  export namespace GetVendorDetails {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Company Number
       * @example 10
       */
      vendorCompanyNumber: number;
      /**
       * Vendor No
       * @example 1444
       */
      vendorNo?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items?: object;
    };
  }

  /**
 * @description Frontend usage: api.vendorManagement.getOwnerNoList()
 * @tags Vendor Management
 * @name GetOwnerNoList
 * @summary Vendor Owner No Dropdown List (Method: getOwnerNoList)
 * @request GET:/vendor-management/owner-no/list
 * @secure
 * @response `200` `{
    items?: ({
  \** @example 1100 *\
    id?: number,
  \** @example 1100 *\
    value?: string,
  \** @example 1100 *\
    label?: string,

})[],

}` Get list of Vendors Owner with pagination info
*/
  export namespace GetOwnerNoList {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Search term for filtering results */
      search?: string;
      /**
       * Page number for pagination
       * @default 1
       */
      current_page?: number;
      /**
       * Limit:Number of items per page
       * @default 500
       */
      items_per_page?: number;
      /** Sort field */
      sortBy?: string;
      /** Sort direction (asc or desc) */
      sortOrder?: "asc" | "desc";
      /**
       * Company Number
       * @example 10
       */
      vendorCompanyNumber: number;
      /**
       * Vendor No
       * @example 1444
       */
      vendorNo?: number;
      /**
       * Status
       * @example "A"
       */
      status?: string;
      /**
       * Owner No
       * @example 2527
       */
      ownerNo: number;
      /**
       * Number of items per page
       * @example 100
       */
      limit?: number;
      /**
       * Offset for pagination
       * @example 0
       */
      offset?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items?: {
        /** @example 1100 */
        id?: number;
        /** @example 1100 */
        value?: string;
        /** @example 1100 */
        label?: string;
      }[];
    };
  }

  /**
 * @description Frontend usage: api.vendorManagement.getNextVendorNoConfig()
 * @tags Vendor Management
 * @name GetNextVendorNoConfig
 * @summary Get Next vendor number (Method: getNextVendorNoConfig)
 * @request GET:/vendor-management/config
 * @secure
 * @response `200` `{
    items?: (91000)[],

}` Get Next vendor number
*/
  export namespace GetNextVendorNoConfig {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Company Number
       * @example 10
       */
      companyNo: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items?: 91000[];
    };
  }

  /**
 * @description Frontend usage: api.vendorManagement.getAllVendorsList()
 * @tags Vendor Management
 * @name GetAllVendorsList
 * @summary Get all vendors (Method: getAllVendorsList)
 * @request GET:/vendor-management/all-vendors
 * @secure
 * @response `200` `{
    items: ({
  \** @example "11" *\
    id: string,
  \** @example "Vendor Name" *\
    label: string,
  \** @example "Vendor Name" *\
    value: string,

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` Success
*/
  export namespace GetAllVendorsList {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Search term for filtering results */
      search?: string;
      /**
       * Page number for pagination
       * @default 1
       */
      current_page?: number;
      /**
       * Limit:Number of items per page
       * @default 500
       */
      items_per_page?: number;
      /** Sort field */
      sortBy?: string;
      /** Sort direction (asc or desc) */
      sortOrder?: "asc" | "desc";
      /** Company Number */
      companyNo: number;
      /** Include Deleted Vendor */
      includeIsDeleted?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: {
        /** @example "11" */
        id: string;
        /** @example "Vendor Name" */
        label: string;
        /** @example "Vendor Name" */
        value: string;
      }[];
      pagination: {
        /** @example 100 */
        total_items: number;
        /** @example 1 */
        current_page: number;
        /** @example 10 */
        items_per_page: number;
        /** @example 10 */
        total_pages: number;
      };
    };
  }
}

export namespace ApMaintenance {
  /**
 * @description Retrieves company configuration data from APCONT table. Returns all company settings including GL accounts, next numbers, and configuration flags. Frontend usage: api.apMaintenance.companyMaintenance()
 * @tags AP Maintenance
 * @name CompanyMaintenance
 * @summary Get APCONT table data by company number (Method: companyMaintenance)
 * @request GET:/ap-maintenance/company
 * @secure
 * @response `200` `{
    items: {
  \**
   * Company number from APCONT.ACCONO
   * @example 10
   *\
    companyNo: number,
  \**
   * Company name from APCONT.ACNAME
   * @example "ABC Company"
   *\
    companyName: string,
  \**
   * AP GL account number from APCONT.ACAPGL
   * @example 20000001
   *\
    companyApGlNo: number,
  \**
   * Bank GL account number from APCONT.ACBKGL
   * @example 10000001
   *\
    companyBankGlNo: number,
  \**
   * Discounts GL account number from APCONT.ACDSGL
   * @example 50000001
   *\
    companyDiscountsGlNo: number,
  \**
   * Intercompany GL account number from APCONT.ACICGL
   * @example 30000001
   *\
    companyIntercoGlNo: number,
  \**
   * Next Purchase Journal number from APCONT.ACJRNL
   * @example 1001
   *\
    companyNextPjJrnlNo: number,
  \**
   * Next Cash Disbursement Journal number from APCONT.ACCDJR
   * @example 1001
   *\
    companyNextCdJrnlNo: number,
  \**
   * Next check number from APCONT.ACCKNO
   * @example 10001
   *\
    companyNextCheckNo: number,
  \**
   * Next entry number from APCONT.ACNXTE
   * @example 10001
   *\
    companyNextEntryNo: number,
  \**
   * Next voucher number from APCONT.ACNXVO
   * @example 10001
   *\
    companyNextVoucherNo: number,
  \**
   * Pre-edit checks flag from APCONT.ACPREC
   * @example "Y"
   *\
    companyPreEdChks: string,
  \**
   * Job cost active flag from APCONT.ACJCYN
   * @example "Y"
   *\
    companyJobCostAct: string,
  \**
   * Retention GL account number from APCONT.ACRTGL
   * @example 40000001
   *\
    companyRetentionGlNo: number,
  \**
   * Purchase Order active flag from APCONT.ACPOYN
   * @example "Y"
   *\
    companyPoActive: string,
  \**
   * Employee expense GL account number from APCONT.ACEEGL
   * @example 60000001
   *\
    companyEmployeeExpenseGlNo: number,
  \**
   * Next Employee Expense Journal number from APCONT.ACEENL
   * @example 1001
   *\
    companyNextEeJrnlNo: number,
  \**
   * Filler field from APCONT.ACF001
   * @example ""
   *\
    companyFiller: string,

},

}` Successfully retrieved APCONT data
*/
  export namespace CompanyMaintenance {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Company number (1-99)
       * @example 10
       */
      companyNo: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: {
        /**
         * Company number from APCONT.ACCONO
         * @example 10
         */
        companyNo: number;
        /**
         * Company name from APCONT.ACNAME
         * @example "ABC Company"
         */
        companyName: string;
        /**
         * AP GL account number from APCONT.ACAPGL
         * @example 20000001
         */
        companyApGlNo: number;
        /**
         * Bank GL account number from APCONT.ACBKGL
         * @example 10000001
         */
        companyBankGlNo: number;
        /**
         * Discounts GL account number from APCONT.ACDSGL
         * @example 50000001
         */
        companyDiscountsGlNo: number;
        /**
         * Intercompany GL account number from APCONT.ACICGL
         * @example 30000001
         */
        companyIntercoGlNo: number;
        /**
         * Next Purchase Journal number from APCONT.ACJRNL
         * @example 1001
         */
        companyNextPjJrnlNo: number;
        /**
         * Next Cash Disbursement Journal number from APCONT.ACCDJR
         * @example 1001
         */
        companyNextCdJrnlNo: number;
        /**
         * Next check number from APCONT.ACCKNO
         * @example 10001
         */
        companyNextCheckNo: number;
        /**
         * Next entry number from APCONT.ACNXTE
         * @example 10001
         */
        companyNextEntryNo: number;
        /**
         * Next voucher number from APCONT.ACNXVO
         * @example 10001
         */
        companyNextVoucherNo: number;
        /**
         * Pre-edit checks flag from APCONT.ACPREC
         * @example "Y"
         */
        companyPreEdChks: string;
        /**
         * Job cost active flag from APCONT.ACJCYN
         * @example "Y"
         */
        companyJobCostAct: string;
        /**
         * Retention GL account number from APCONT.ACRTGL
         * @example 40000001
         */
        companyRetentionGlNo: number;
        /**
         * Purchase Order active flag from APCONT.ACPOYN
         * @example "Y"
         */
        companyPoActive: string;
        /**
         * Employee expense GL account number from APCONT.ACEEGL
         * @example 60000001
         */
        companyEmployeeExpenseGlNo: number;
        /**
         * Next Employee Expense Journal number from APCONT.ACEENL
         * @example 1001
         */
        companyNextEeJrnlNo: number;
        /**
         * Filler field from APCONT.ACF001
         * @example ""
         */
        companyFiller: string;
      };
    };
  }

  /**
 * @description Updates company configuration data in APCONT table. All fields are required. Frontend usage: api.apMaintenance.updateCompanyMaintenance()
 * @tags AP Maintenance
 * @name UpdateCompanyMaintenance
 * @summary Update company data (Method: updateCompanyMaintenance)
 * @request POST:/ap-maintenance/company
 * @secure
 * @response `200` `{
    items: {
  \**
   * Company number from APCONT.ACCONO
   * @example 10
   *\
    companyNo: number,
  \**
   * Company name from APCONT.ACNAME
   * @example "ABC Company"
   *\
    companyName: string,
  \**
   * AP GL account number from APCONT.ACAPGL
   * @example 20000001
   *\
    companyApGlNo: number,
  \**
   * Bank GL account number from APCONT.ACBKGL
   * @example 10000001
   *\
    companyBankGlNo: number,
  \**
   * Discounts GL account number from APCONT.ACDSGL
   * @example 50000001
   *\
    companyDiscountsGlNo: number,
  \**
   * Intercompany GL account number from APCONT.ACICGL
   * @example 30000001
   *\
    companyIntercoGlNo: number,
  \**
   * Next Purchase Journal number from APCONT.ACJRNL
   * @example 1001
   *\
    companyNextPjJrnlNo: number,
  \**
   * Next Cash Disbursement Journal number from APCONT.ACCDJR
   * @example 1001
   *\
    companyNextCdJrnlNo: number,
  \**
   * Next check number from APCONT.ACCKNO
   * @example 10001
   *\
    companyNextCheckNo: number,
  \**
   * Next entry number from APCONT.ACNXTE
   * @example 10001
   *\
    companyNextEntryNo: number,
  \**
   * Next voucher number from APCONT.ACNXVO
   * @example 10001
   *\
    companyNextVoucherNo: number,
  \**
   * Pre-edit checks flag from APCONT.ACPREC
   * @example "Y"
   *\
    companyPreEdChks: string,
  \**
   * Job cost active flag from APCONT.ACJCYN
   * @example "Y"
   *\
    companyJobCostAct: string,
  \**
   * Retention GL account number from APCONT.ACRTGL
   * @example 40000001
   *\
    companyRetentionGlNo: number,
  \**
   * Purchase Order active flag from APCONT.ACPOYN
   * @example "Y"
   *\
    companyPoActive: string,
  \**
   * Employee expense GL account number from APCONT.ACEEGL
   * @example 60000001
   *\
    companyEmployeeExpenseGlNo: number,
  \**
   * Next Employee Expense Journal number from APCONT.ACEENL
   * @example 1001
   *\
    companyNextEeJrnlNo: number,
  \**
   * Filler field from APCONT.ACF001
   * @example ""
   *\
    companyFiller: string,

},

}` Successfully updated company data
*/
  export namespace UpdateCompanyMaintenance {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UpdateCompanyMaintenancePayload;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: {
        /**
         * Company number from APCONT.ACCONO
         * @example 10
         */
        companyNo: number;
        /**
         * Company name from APCONT.ACNAME
         * @example "ABC Company"
         */
        companyName: string;
        /**
         * AP GL account number from APCONT.ACAPGL
         * @example 20000001
         */
        companyApGlNo: number;
        /**
         * Bank GL account number from APCONT.ACBKGL
         * @example 10000001
         */
        companyBankGlNo: number;
        /**
         * Discounts GL account number from APCONT.ACDSGL
         * @example 50000001
         */
        companyDiscountsGlNo: number;
        /**
         * Intercompany GL account number from APCONT.ACICGL
         * @example 30000001
         */
        companyIntercoGlNo: number;
        /**
         * Next Purchase Journal number from APCONT.ACJRNL
         * @example 1001
         */
        companyNextPjJrnlNo: number;
        /**
         * Next Cash Disbursement Journal number from APCONT.ACCDJR
         * @example 1001
         */
        companyNextCdJrnlNo: number;
        /**
         * Next check number from APCONT.ACCKNO
         * @example 10001
         */
        companyNextCheckNo: number;
        /**
         * Next entry number from APCONT.ACNXTE
         * @example 10001
         */
        companyNextEntryNo: number;
        /**
         * Next voucher number from APCONT.ACNXVO
         * @example 10001
         */
        companyNextVoucherNo: number;
        /**
         * Pre-edit checks flag from APCONT.ACPREC
         * @example "Y"
         */
        companyPreEdChks: string;
        /**
         * Job cost active flag from APCONT.ACJCYN
         * @example "Y"
         */
        companyJobCostAct: string;
        /**
         * Retention GL account number from APCONT.ACRTGL
         * @example 40000001
         */
        companyRetentionGlNo: number;
        /**
         * Purchase Order active flag from APCONT.ACPOYN
         * @example "Y"
         */
        companyPoActive: string;
        /**
         * Employee expense GL account number from APCONT.ACEEGL
         * @example 60000001
         */
        companyEmployeeExpenseGlNo: number;
        /**
         * Next Employee Expense Journal number from APCONT.ACEENL
         * @example 1001
         */
        companyNextEeJrnlNo: number;
        /**
         * Filler field from APCONT.ACF001
         * @example ""
         */
        companyFiller: string;
      };
    };
  }
}

export namespace ClearChecks {
  /**
   * @description Uploads a Clear Checks CSV/XLSX file, splits into batches, processes via BullMQ and returns summary. Frontend usage: api.clearChecks.uploadClearChecks()
   * @tags ClearChecks
   * @name UploadClearChecks
   * @summary Upload Clear Checks CSV (Method: uploadClearChecks)
   * @request POST:/clear-checks/upload
   * @secure
   * @response `200` `void` File accepted, split into batches, processing started.
   */
  export namespace UploadClearChecks {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UploadClearChecksPayload;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
 * @description Validates a single check against the database for clearing. Checks existence, amount match, date validity, and processing status. Frontend usage: api.clearChecks.validateSingleCheck()
 * @tags ClearChecks
 * @name ValidateSingleCheck
 * @summary Validate Single Check (Method: validateSingleCheck)
 * @request POST:/clear-checks/validate
 * @secure
 * @response `200` `{
    message?: string,
    data?: {
    checkNo?: string,
    checkAmount?: number,
    checkDate?: string,
    isValid?: boolean,
    errors?: ({
    field?: string,
    message?: string,
    code?: string,

})[],
    warnings?: ({
    field?: string,
    message?: string,
    code?: string,

})[],

},

}` Check validation completed successfully.
*/
  export namespace ValidateSingleCheck {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ValidateSingleCheckPayload;
    export type RequestHeaders = {};
    export type ResponseBody = {
      message?: string;
      data?: {
        checkNo?: string;
        checkAmount?: number;
        checkDate?: string;
        isValid?: boolean;
        errors?: {
          field?: string;
          message?: string;
          code?: string;
        }[];
        warnings?: {
          field?: string;
          message?: string;
          code?: string;
        }[];
      };
    };
  }

  /**
 * @description Processes multiple checks by updating their status to RECONCILED (R), AMCLDT (MMDDYY), and AMCLD8 (YYYYMMDD) fields with the provided clear dates. No validation is performed - checks are processed directly. Frontend usage: api.clearChecks.processMultipleChecks()
 * @tags ClearChecks
 * @name ProcessMultipleChecks
 * @summary Process Multiple Checks (Method: processMultipleChecks)
 * @request POST:/clear-checks/process
 * @secure
 * @response `200` `{
    message?: string,
    data?: {
    message?: string,
    totalProcessed?: number,
    successful?: number,
    failed?: number,
    results?: ({
    checkNo?: string,
    checkAmount?: number,
    checkDate?: string,
    message?: string,
    errors?: ({
    field?: string,
    message?: string,
    code?: string,

})[],

})[],

},

}` Multiple checks processing completed successfully.
*/
  export namespace ProcessMultipleChecks {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ProcessMultipleChecksPayload;
    export type RequestHeaders = {};
    export type ResponseBody = {
      message?: string;
      data?: {
        message?: string;
        totalProcessed?: number;
        successful?: number;
        failed?: number;
        results?: {
          checkNo?: string;
          checkAmount?: number;
          checkDate?: string;
          message?: string;
          errors?: {
            field?: string;
            message?: string;
            code?: string;
          }[];
        }[];
      };
    };
  }
}

export namespace CheckInquiry {
  /**
 * @description Frontend usage: api.checkInquiry.getPyamentHistory()
 * @tags CheckInquiry
 * @name GetPyamentHistory
 * @summary Get Payment History for check Inquiry (Method: getPyamentHistory)
 * @request GET:/check-inquiry/payment-history
 * @secure
 * @response `200` `{
  \** @example 10 *\
    companyNo?: number,
  \** @example 1100 *\
    vendorNo?: number,
  \** @example 0 *\
    checkNo?: number,
  \** @example "00684027            " *\
    invoiceNo?: string,
  \** @example "(PJ12)AFE 350 GRINDER    " *\
    invoiceDescription?: string,
  \**
   * @format float
   * @example 0
   *\
    paidAmount?: number,
  \**
   * @format float
   * @example 102.69
   *\
    grossAmount?: number,
  \**
   * @format float
   * @example 0
   *\
    discount?: number,
  \** @example 11000001 *\
    bankGLNo?: number,
  \** @example 11000001 *\
    voucherNo?: number,
  \** @example 11000001 *\
    invoiceDate?: number,
  \** @example 11000001 *\
    dueDate?: number,
  \** @example 20116 *\
    lastPaidDate?: number,
    bankGLNumber?: {
  \** @example "ABBOTT GAS PRODUCTS           " *\
    vendorName?: string,
  \** @example 20116 *\
    checkDate?: number,

},

}` Paginated list of Check Inquiry Payment History
*/
  export namespace GetPyamentHistory {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Search term for filtering results */
      search?: string;
      /**
       * Page number for pagination
       * @default 1
       */
      current_page?: number;
      /**
       * Limit:Number of items per page
       * @default 500
       */
      items_per_page?: number;
      /** Sort field */
      sortBy?: string;
      /** Sort direction (asc or desc) */
      sortOrder?: "asc" | "desc";
      /**
       * Company Id
       * @example "10"
       */
      companyNo?: number;
      /**
       * VendiorNo
       * @example "1100"
       */
      vendorNo?: number;
      /**
       * Start date
       * @format date
       * @example "20116"
       */
      startDate?: string;
      /**
       * Invoice No
       * @example "461046"
       */
      invoiceNo?: string;
      /**
       * check No
       * @example "0"
       */
      checkNo?: number;
      /**
       * Number of items per page
       * @example 10
       */
      limit?: number;
      /**
       * Offset for pagination
       * @example 0
       */
      offset?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example 10 */
      companyNo?: number;
      /** @example 1100 */
      vendorNo?: number;
      /** @example 0 */
      checkNo?: number;
      /** @example "00684027            " */
      invoiceNo?: string;
      /** @example "(PJ12)AFE 350 GRINDER    " */
      invoiceDescription?: string;
      /**
       * @format float
       * @example 0
       */
      paidAmount?: number;
      /**
       * @format float
       * @example 102.69
       */
      grossAmount?: number;
      /**
       * @format float
       * @example 0
       */
      discount?: number;
      /** @example 11000001 */
      bankGLNo?: number;
      /** @example 11000001 */
      voucherNo?: number;
      /** @example 11000001 */
      invoiceDate?: number;
      /** @example 11000001 */
      dueDate?: number;
      /** @example 20116 */
      lastPaidDate?: number;
      bankGLNumber?: {
        /** @example "ABBOTT GAS PRODUCTS           " */
        vendorName?: string;
        /** @example 20116 */
        checkDate?: number;
      };
    };
  }

  /**
 * @description Frontend usage: api.checkInquiry.getLastPaymentInfo()
 * @tags CheckInquiry
 * @name GetLastPaymentInfo
 * @summary Get last Payment Information (Method: getLastPaymentInfo)
 * @request GET:/check-inquiry/last-payment-info
 * @secure
 * @response `200` `{
  \** @example 10 *\
    companyNo?: number,
  \** @example 1100 *\
    vendorNo?: number,
  \**
   * @format float
   * @example 102.69
   *\
    grossAmount?: number,
  \** @example 0 *\
    openPayables?: number,
  \** @example "ACT ASSOCIATES " *\
    vendorName?: string,

}` Paginated list of Check Inquiry Payment History
*/
  export namespace GetLastPaymentInfo {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Search term for filtering results */
      search?: string;
      /**
       * Page number for pagination
       * @default 1
       */
      current_page?: number;
      /**
       * Limit:Number of items per page
       * @default 500
       */
      items_per_page?: number;
      /** Sort field */
      sortBy?: string;
      /** Sort direction (asc or desc) */
      sortOrder?: "asc" | "desc";
      /**
       * Company Id
       * @example "10"
       */
      companyNo: number;
      /**
       * VendorNo
       * @example "1100"
       */
      vendorNo: number;
      /**
       * Start date
       * @format date
       * @example "20116"
       */
      startDate?: string;
      /**
       * Invoice No
       * @example "461046"
       */
      invoiceNo?: string;
      /**
       * check No
       * @example "0"
       */
      checkNo?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example 10 */
      companyNo?: number;
      /** @example 1100 */
      vendorNo?: number;
      /**
       * @format float
       * @example 102.69
       */
      grossAmount?: number;
      /** @example 0 */
      openPayables?: number;
      /** @example "ACT ASSOCIATES " */
      vendorName?: string;
    };
  }

  /**
 * @description Frontend usage: api.checkInquiry.getVoucherDetails()
 * @tags CheckInquiry
 * @name GetVoucherDetails
 * @summary Get Voucher Details (Method: getVoucherDetails)
 * @request GET:/check-inquiry/voucher-detail
 * @secure
 * @response `200` `{
    vendorDetail?: any,
    headerItems?: any,
    detailItems?: any,

}` Get Voucher Details
*/
  export namespace GetVoucherDetails {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Company Id
       * @example 10
       */
      companyNo: number;
      /**
       * VendorNo
       * @example 1100
       */
      vendorNo: number;
      /**
       * Invoice No
       * @example 461046
       */
      voucherNo: number;
      /**
       * check No
       * @example "0"
       */
      checkNo?: number;
      /**
       * Invoice No
       * @example "0"
       */
      invoiceNo?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      vendorDetail?: any;
      headerItems?: any;
      detailItems?: any;
    };
  }
}

export namespace ApPeriodEnd {
  /**
 * @description Retrieves paginated vendor data for a specific company and year using the vendor master list functionality. Frontend usage: api.apPeriodEnd.getVendorsByYear()
 * @tags APPeriodEnd
 * @name GetVendorsByYear
 * @summary Get vendors by year for a company (Method: getVendorsByYear)
 * @request GET:/ap-period-end/vendors
 * @secure
 * @response `200` `{
  \** Array of vendor objects *\
    items: ({
  \**
   * Vendor deletion status
   * @example "N"
   *\
    vendorIsDeleted?: string,
  \**
   * Company number
   * @example 10
   *\
    vendorCompanyNumber?: number,
  \**
   * Vendor number
   * @example 1001
   *\
    vendorNo?: number,
  \**
   * Vendor name
   * @example "ABC Suppliers"
   *\
    vendorName?: string,
  \**
   * Vendor address line 1
   * @example "123 Main Street"
   *\
    "vendorAdd1"?: string,
  \**
   * Vendor address line 2
   * @example "Suite 100"
   *\
    "vendorAdd2"?: string,
  \**
   * Vendor address line 3
   * @example ""
   *\
    "vendorAdd3"?: string,
  \**
   * Vendor address line 4
   * @example ""
   *\
    "vendorAdd4"?: string,
  \**
   * Vendor zip code
   * @example 12345
   *\
    vendorZipCode?: number,
  \**
   * Vendor extra zip code
   * @example 6789
   *\
    vendorExtraZip?: number,
  \**
   * Vendor alpha sort abbreviation
   * @example "ABC"
   *\
    vendorAlphaSortAbbr?: string,
  \**
   * Vendor area code
   * @example 555
   *\
    vendorAreaCode?: number,
  \**
   * Vendor telephone number
   * @example 1234567
   *\
    vendorTelephoneNo?: number,
  \**
   * Last payment amount
   * @example 5000
   *\
    vendorLastPaymentAmt?: number,
  \**
   * Last payment date
   * @example 20241215
   *\
    vendorLastPaymentDate?: number,
  \**
   * Year to date purchases
   * @example 50000
   *\
    vendorYtdPurchases?: number,
  \**
   * Last year purchases
   * @example 45000
   *\
    vendorLastYearPurchases?: number,
  \**
   * Month to date discounts
   * @example 500
   *\
    vendorMtdDiscounts?: number,
  \**
   * Year to date discounts
   * @example 2500
   *\
    vendorYtdDiscounts?: number,
  \**
   * Vendor name overflow
   * @example ""
   *\
    vendorNameOverflow?: string,
  \**
   * GAL receipts required flag
   * @example "N"
   *\
    vendorGalRcptsRequired?: string,
  \**
   * Vendor filler field
   * @example ""
   *\
    vendorFiller?: string,
  \**
   * Previous balance
   * @example 10000
   *\
    vendorPreviousBalance?: number,
  \**
   * Month to date purchases
   * @example 5000
   *\
    vendorMtdPurchases?: number,
  \**
   * Month to date payments
   * @example 3000
   *\
    vendorMtdPayments?: number,
  \**
   * Current balance
   * @example 12000
   *\
    vendorCurrentBalance?: number,
  \**
   * Hold payments vendor flag
   * @example "N"
   *\
    vendorHoldPaymentsVend?: string,
  \**
   * Single check flag
   * @example "N"
   *\
    vendorSingleCheck?: string,
  \**
   * This year year to date paid
   * @example 35000
   *\
    vendorThisYrYtdPaid?: number,
  \**
   * Last year year to date paid
   * @example 32000
   *\
    vendorLastYrYtdPaid?: number,
  \**
   * Expense GL sub account
   * @example 5000
   *\
    vendorExpenseGLSub?: number,
  \**
   * AP terms code
   * @example 30
   *\
    vendorApTermsCode?: number,
  \**
   * AP 1099 code
   * @example "N"
   *\
    "vendorAp1099Code"?: string,
  \**
   * Vendor ID number
   * @example "12-3456789"
   *\
    vendorIdNumber?: string,
  \**
   * First 1099 box number
   * @example 0
   *\
    "vendorFirst1099BoxNumber"?: number,
  \**
   * Second 1099 box number
   * @example 0
   *\
    "vendorSecond1099BoxNumber"?: number,
  \**
   * Second 1099 box amount
   * @example 0
   *\
    "vendorSecond1099BoxAmount"?: number,
  \**
   * Last payment date alternative
   * @example 20241215
   *\
    vendorLastPaymentDateAlt?: number,
  \**
   * Carrier ID
   * @example ""
   *\
    vendorCarrierId?: string,
  \**
   * Payee name 1
   * @example "ABC Suppliers"
   *\
    "vendorPayeeName1"?: string,
  \**
   * Payee name 2
   * @example ""
   *\
    "vendorPayeeName2"?: string,
  \**
   * IRS name control
   * @example ""
   *\
    vendorIrsNameControl?: string,
  \**
   * ADP payroll ID
   * @example 0
   *\
    vendorAdpPayrollId?: number,
  \**
   * ACH class
   * @example ""
   *\
    vendorAchClass?: string,
  \**
   * ACH checking or savings
   * @example ""
   *\
    vendorAchCheckingOrSavings?: string,
  \**
   * ACH bank routing code
   * @example 0
   *\
    vendorAchBankRoutingCode?: number,
  \**
   * ACH bank account number
   * @example ""
   *\
    vendorAchBankAccountNumber?: string,
  \**
   * Vendor first name
   * @example ""
   *\
    vendorFirstName?: string,
  \**
   * Vendor middle name
   * @example ""
   *\
    vendorMiddleName?: string,
  \**
   * Vendor business last name
   * @example ""
   *\
    vendorBusinessLastName?: string,
  \**
   * Vendor name suffix
   * @example ""
   *\
    vendorNameSuffix?: string,
  \**
   * Vendor country code
   * @example "US"
   *\
    vendorCountryCode?: string,
  \**
   * Vendor category code
   * @example ""
   *\
    vendorCategoryCode?: string,
  \**
   * Vendor filler 2
   * @example ""
   *\
    "vendorFiller2"?: string,

})[],
  \**
   * Total number of vendors
   * @example 150
   *\
    count: number,
  \**
   * Current page number
   * @example 1
   *\
    page: number,
  \**
   * Number of items per page
   * @example 50
   *\
    limit: number,
  \**
   * Total number of pages
   * @example 3
   *\
    totalPages: number,
  \**
   * Whether there is a next page
   * @example true
   *\
    hasNextPage: boolean,
  \**
   * Whether there is a previous page
   * @example false
   *\
    hasPrevPage: boolean,

}` Successfully retrieved vendor data
*/
  export namespace GetVendorsByYear {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Search term for filtering results
       * @example "ABC"
       */
      search?: string;
      /**
       * Page number for pagination (default: 1)
       * @default 1
       * @example 1
       */
      current_page?: number;
      /**
       * Number of items per page (default: 500, max: 500)
       * @default 500
       * @example 50
       */
      items_per_page?: number;
      /**
       * Sort field
       * @example "vendorName"
       */
      sortBy?: string;
      /**
       * Sort direction (asc or desc)
       * @example "asc"
       */
      sortOrder?: "asc" | "desc";
      /**
       * Company number (1-99)
       * @example 10
       */
      companyNo: number;
      /**
       * Year (2000-2100)
       * @example 2024
       */
      year: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** Array of vendor objects */
      items: {
        /**
         * Vendor deletion status
         * @example "N"
         */
        vendorIsDeleted?: string;
        /**
         * Company number
         * @example 10
         */
        vendorCompanyNumber?: number;
        /**
         * Vendor number
         * @example 1001
         */
        vendorNo?: number;
        /**
         * Vendor name
         * @example "ABC Suppliers"
         */
        vendorName?: string;
        /**
         * Vendor address line 1
         * @example "123 Main Street"
         */
        vendorAdd1?: string;
        /**
         * Vendor address line 2
         * @example "Suite 100"
         */
        vendorAdd2?: string;
        /**
         * Vendor address line 3
         * @example ""
         */
        vendorAdd3?: string;
        /**
         * Vendor address line 4
         * @example ""
         */
        vendorAdd4?: string;
        /**
         * Vendor zip code
         * @example 12345
         */
        vendorZipCode?: number;
        /**
         * Vendor extra zip code
         * @example 6789
         */
        vendorExtraZip?: number;
        /**
         * Vendor alpha sort abbreviation
         * @example "ABC"
         */
        vendorAlphaSortAbbr?: string;
        /**
         * Vendor area code
         * @example 555
         */
        vendorAreaCode?: number;
        /**
         * Vendor telephone number
         * @example 1234567
         */
        vendorTelephoneNo?: number;
        /**
         * Last payment amount
         * @example 5000
         */
        vendorLastPaymentAmt?: number;
        /**
         * Last payment date
         * @example 20241215
         */
        vendorLastPaymentDate?: number;
        /**
         * Year to date purchases
         * @example 50000
         */
        vendorYtdPurchases?: number;
        /**
         * Last year purchases
         * @example 45000
         */
        vendorLastYearPurchases?: number;
        /**
         * Month to date discounts
         * @example 500
         */
        vendorMtdDiscounts?: number;
        /**
         * Year to date discounts
         * @example 2500
         */
        vendorYtdDiscounts?: number;
        /**
         * Vendor name overflow
         * @example ""
         */
        vendorNameOverflow?: string;
        /**
         * GAL receipts required flag
         * @example "N"
         */
        vendorGalRcptsRequired?: string;
        /**
         * Vendor filler field
         * @example ""
         */
        vendorFiller?: string;
        /**
         * Previous balance
         * @example 10000
         */
        vendorPreviousBalance?: number;
        /**
         * Month to date purchases
         * @example 5000
         */
        vendorMtdPurchases?: number;
        /**
         * Month to date payments
         * @example 3000
         */
        vendorMtdPayments?: number;
        /**
         * Current balance
         * @example 12000
         */
        vendorCurrentBalance?: number;
        /**
         * Hold payments vendor flag
         * @example "N"
         */
        vendorHoldPaymentsVend?: string;
        /**
         * Single check flag
         * @example "N"
         */
        vendorSingleCheck?: string;
        /**
         * This year year to date paid
         * @example 35000
         */
        vendorThisYrYtdPaid?: number;
        /**
         * Last year year to date paid
         * @example 32000
         */
        vendorLastYrYtdPaid?: number;
        /**
         * Expense GL sub account
         * @example 5000
         */
        vendorExpenseGLSub?: number;
        /**
         * AP terms code
         * @example 30
         */
        vendorApTermsCode?: number;
        /**
         * AP 1099 code
         * @example "N"
         */
        vendorAp1099Code?: string;
        /**
         * Vendor ID number
         * @example "12-3456789"
         */
        vendorIdNumber?: string;
        /**
         * First 1099 box number
         * @example 0
         */
        vendorFirst1099BoxNumber?: number;
        /**
         * Second 1099 box number
         * @example 0
         */
        vendorSecond1099BoxNumber?: number;
        /**
         * Second 1099 box amount
         * @example 0
         */
        vendorSecond1099BoxAmount?: number;
        /**
         * Last payment date alternative
         * @example 20241215
         */
        vendorLastPaymentDateAlt?: number;
        /**
         * Carrier ID
         * @example ""
         */
        vendorCarrierId?: string;
        /**
         * Payee name 1
         * @example "ABC Suppliers"
         */
        vendorPayeeName1?: string;
        /**
         * Payee name 2
         * @example ""
         */
        vendorPayeeName2?: string;
        /**
         * IRS name control
         * @example ""
         */
        vendorIrsNameControl?: string;
        /**
         * ADP payroll ID
         * @example 0
         */
        vendorAdpPayrollId?: number;
        /**
         * ACH class
         * @example ""
         */
        vendorAchClass?: string;
        /**
         * ACH checking or savings
         * @example ""
         */
        vendorAchCheckingOrSavings?: string;
        /**
         * ACH bank routing code
         * @example 0
         */
        vendorAchBankRoutingCode?: number;
        /**
         * ACH bank account number
         * @example ""
         */
        vendorAchBankAccountNumber?: string;
        /**
         * Vendor first name
         * @example ""
         */
        vendorFirstName?: string;
        /**
         * Vendor middle name
         * @example ""
         */
        vendorMiddleName?: string;
        /**
         * Vendor business last name
         * @example ""
         */
        vendorBusinessLastName?: string;
        /**
         * Vendor name suffix
         * @example ""
         */
        vendorNameSuffix?: string;
        /**
         * Vendor country code
         * @example "US"
         */
        vendorCountryCode?: string;
        /**
         * Vendor category code
         * @example ""
         */
        vendorCategoryCode?: string;
        /**
         * Vendor filler 2
         * @example ""
         */
        vendorFiller2?: string;
      }[];
      /**
       * Total number of vendors
       * @example 150
       */
      count: number;
      /**
       * Current page number
       * @example 1
       */
      page: number;
      /**
       * Number of items per page
       * @example 50
       */
      limit: number;
      /**
       * Total number of pages
       * @example 3
       */
      totalPages: number;
      /**
       * Whether there is a next page
       * @example true
       */
      hasNextPage: boolean;
      /**
       * Whether there is a previous page
       * @example false
       */
      hasPrevPage: boolean;
    };
  }

  /**
 * @description Retrieves detailed company information from the company table by company number. Returns all company settings including GL accounts, next numbers, and configuration flags. Frontend usage: api.apPeriodEnd.getCompanyDetails()
 * @tags APPeriodEnd
 * @name GetCompanyDetails
 * @summary Get company details by company number (Method: getCompanyDetails)
 * @request GET:/ap-period-end/company
 * @secure
 * @response `200` `{
    items?: {
  \**
   * Company number
   * @example 10
   *\
    companyNo?: number,
  \**
   * Company name
   * @example "ABC Company"
   *\
    companyName?: string,
  \**
   * Company AP GL Number
   * @example 20000001
   *\
    companyApGlNo?: number,
  \**
   * Company Bank GL Number
   * @example 10000001
   *\
    companyBankGlNo?: number,
  \**
   * Company Discounts GL Number
   * @example 50000001
   *\
    companyDiscountsGlNo?: number,
  \**
   * Company Interco GL Number
   * @example 30000001
   *\
    companyIntercoGlNo?: number,
  \**
   * Company Next PJ Journal Number
   * @example 1001
   *\
    companyNextPjJrnlNo?: number,
  \**
   * Company Next CD Journal Number
   * @example 1001
   *\
    companyNextCdJrnlNo?: number,
  \**
   * Company Next Check Number
   * @example 10001
   *\
    companyNextCheckNo?: number,
  \**
   * Company Next Entry Number
   * @example 10001
   *\
    companyNextEntryNo?: number,
  \**
   * Company Next Voucher Number
   * @example 10001
   *\
    companyNextVoucherNo?: number,
  \**
   * Company Pre-edit Checks Flag
   * @example "Y"
   *\
    companyPreEdChks?: string,
  \**
   * Company Job Cost Active Flag
   * @example "Y"
   *\
    companyJobCostAct?: string,
  \**
   * Company Retention GL Number
   * @example 40000001
   *\
    companyRetentionGlNo?: number,
  \**
   * Company PO Active Flag
   * @example "Y"
   *\
    companyPoActive?: string,
  \**
   * Company Employee Expense GL Number
   * @example 60000001
   *\
    companyEmployeeExpenseGlNo?: number,
  \**
   * Company Next EE Journal Number
   * @example 1001
   *\
    companyNextEeJrnlNo?: number,
  \**
   * Company Filler Field
   * @example ""
   *\
    companyFiller?: string,
  \**
   * Company Vendor Next Entry Number
   * @example 10001
   *\
    companyVendorNextEntryNo?: number,

},

}` Successfully retrieved company details
*/
  export namespace GetCompanyDetails {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Company number (1-99)
       * @example 10
       */
      companyNo: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items?: {
        /**
         * Company number
         * @example 10
         */
        companyNo?: number;
        /**
         * Company name
         * @example "ABC Company"
         */
        companyName?: string;
        /**
         * Company AP GL Number
         * @example 20000001
         */
        companyApGlNo?: number;
        /**
         * Company Bank GL Number
         * @example 10000001
         */
        companyBankGlNo?: number;
        /**
         * Company Discounts GL Number
         * @example 50000001
         */
        companyDiscountsGlNo?: number;
        /**
         * Company Interco GL Number
         * @example 30000001
         */
        companyIntercoGlNo?: number;
        /**
         * Company Next PJ Journal Number
         * @example 1001
         */
        companyNextPjJrnlNo?: number;
        /**
         * Company Next CD Journal Number
         * @example 1001
         */
        companyNextCdJrnlNo?: number;
        /**
         * Company Next Check Number
         * @example 10001
         */
        companyNextCheckNo?: number;
        /**
         * Company Next Entry Number
         * @example 10001
         */
        companyNextEntryNo?: number;
        /**
         * Company Next Voucher Number
         * @example 10001
         */
        companyNextVoucherNo?: number;
        /**
         * Company Pre-edit Checks Flag
         * @example "Y"
         */
        companyPreEdChks?: string;
        /**
         * Company Job Cost Active Flag
         * @example "Y"
         */
        companyJobCostAct?: string;
        /**
         * Company Retention GL Number
         * @example 40000001
         */
        companyRetentionGlNo?: number;
        /**
         * Company PO Active Flag
         * @example "Y"
         */
        companyPoActive?: string;
        /**
         * Company Employee Expense GL Number
         * @example 60000001
         */
        companyEmployeeExpenseGlNo?: number;
        /**
         * Company Next EE Journal Number
         * @example 1001
         */
        companyNextEeJrnlNo?: number;
        /**
         * Company Filler Field
         * @example ""
         */
        companyFiller?: string;
        /**
         * Company Vendor Next Entry Number
         * @example 10001
         */
        companyVendorNextEntryNo?: number;
      };
    };
  }

  /**
 * @description Creates and populates vendor year-end table for a specific company and year. This process handles the vendor month/year end functionality by creating a new table with the year suffix and copying all vendor data from the source table. Frontend usage: api.apPeriodEnd.vendorYearEndProcess()
 * @tags APPeriodEnd
 * @name VendorYearEndProcess
 * @summary Process vendor year-end for a company (Method: vendorYearEndProcess)
 * @request POST:/ap-period-end/vendor-year-end-process
 * @secure
 * @response `200` `{
    items: {
  \**
   * Message describing the result of the year-end process
   * @example "Vendor year-end process completed successfully for company 10, year 2024"
   *\
    message?: string,
  \**
   * Name of the table created or processed
   * @example "DATADEV.VENDOR_2024"
   *\
    tableName?: string | null,
  \**
   * Number of data rows copied
   * @example 100
   *\
    dataCopied?: number | null,

},

}` Successfully processed vendor year-end
*/
  export namespace VendorYearEndProcess {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = VendorYearEndProcessDto;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: {
        /**
         * Message describing the result of the year-end process
         * @example "Vendor year-end process completed successfully for company 10, year 2024"
         */
        message?: string;
        /**
         * Name of the table created or processed
         * @example "DATADEV.VENDOR_2024"
         */
        tableName?: string | null;
        /**
         * Number of data rows copied
         * @example 100
         */
        dataCopied?: number | null;
      };
    };
  }

  /**
 * @description Get data for particular record format Frontend usage: api.apPeriodEnd.getApPeriodEndReports()
 * @tags APPeriodEnd
 * @name GetApPeriodEndReports
 * @summary Get AP Period End Reports (Method: getApPeriodEndReports)
 * @request GET:/ap-period-end/record
 * @secure
 * @response `200` `{
    items: {
  \**
   * Record Type
   * @example "T"
   *\
    recordType?: string,
  \**
   * Payment Year
   * @example 2027
   *\
    paymentYear?: number,
  \**
   * Prior Year Data Indicator
   * @example "A"
   *\
    priorYearDataInd?: string,
  \**
   * Transmitter ID
   * @example 996793061
   *\
    transmitterId?: number,
  \**
   * Trans Control Code
   * @example "ABHI"
   *\
    transControlCode?: string,
  \**
   * Replacement Alpha Character
   * @example "AB"
   *\
    replacementAlphaChar?: string,
  \**
   * Blank
   * @example "ABHIS"
   *\
    "blank01"?: string,
  \**
   * Test File Indicator
   * @example ""
   *\
    testFileInd?: string,
  \**
   * Foreign Entity Indicator
   * @example ""
   *\
    foreignEntityInd?: string,
  \**
   * Transmitter Name
   * @example "AMERICAN REFINING GROUP INC"
   *\
    transmitterName?: string,
  \**
   * Transmitter Name 2
   * @example ""
   *\
    "transmitterName2"?: string,
  \**
   * Company Name
   * @example "AMERICAN REFINING GROUP INC"
   *\
    companyName?: string,
  \**
   * Company Name 2
   * @example ""
   *\
    "companyName2"?: string,
  \**
   * Company Address
   * @example "55 ALPHA DRIVE WEST"
   *\
    companyAddress?: string,
  \**
   * Company City
   * @example "PITTSBURGH"
   *\
    companyCity?: string,
  \**
   * Company State
   * @example "PA"
   *\
    companyState?: string,
  \**
   * Company Zip Code
   * @example "15238"
   *\
    companyZipCode?: string,
  \**
   * Blank
   * @example ""
   *\
    "blank02"?: string,
  \**
   * Total Number of Payees
   * @example 8
   *\
    totalNumberOfPayees?: number,
  \**
   * Contact Name
   * @example "ERIC HOLMBERG"
   *\
    contactName?: string,
  \**
   * Contact Phone Number
   * @example "8143681274"
   *\
    contactPhoneNumber?: string,
  \**
   * Contact Email
   * @example ""
   *\
    contactEmail?: string,
  \**
   * Blank
   * @example ""
   *\
    "blank03"?: string,
  \**
   * Sequence Number
   * @example 1
   *\
    sequenceNumber?: number,
  \**
   * Blank
   * @example ""
   *\
    "blank04"?: string,
  \**
   * Vendor Indicator
   * @example "I"
   *\
    vendorInd?: string,
  \**
   * Blank
   * @example ""
   *\
    "blank05"?: string,
  \**
   * Blank
   * @example ""
   *\
    "blank06"?: string,

},

}` Successfully retrieved vendor data
*/
  export namespace GetApPeriodEndReports {
    export type RequestParams = {};
    export type RequestQuery = {
      /** @example "" */
      tin: string;
      /** @example "2024" */
      ctl: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: {
        /**
         * Record Type
         * @example "T"
         */
        recordType?: string;
        /**
         * Payment Year
         * @example 2027
         */
        paymentYear?: number;
        /**
         * Prior Year Data Indicator
         * @example "A"
         */
        priorYearDataInd?: string;
        /**
         * Transmitter ID
         * @example 996793061
         */
        transmitterId?: number;
        /**
         * Trans Control Code
         * @example "ABHI"
         */
        transControlCode?: string;
        /**
         * Replacement Alpha Character
         * @example "AB"
         */
        replacementAlphaChar?: string;
        /**
         * Blank
         * @example "ABHIS"
         */
        blank01?: string;
        /**
         * Test File Indicator
         * @example ""
         */
        testFileInd?: string;
        /**
         * Foreign Entity Indicator
         * @example ""
         */
        foreignEntityInd?: string;
        /**
         * Transmitter Name
         * @example "AMERICAN REFINING GROUP INC"
         */
        transmitterName?: string;
        /**
         * Transmitter Name 2
         * @example ""
         */
        transmitterName2?: string;
        /**
         * Company Name
         * @example "AMERICAN REFINING GROUP INC"
         */
        companyName?: string;
        /**
         * Company Name 2
         * @example ""
         */
        companyName2?: string;
        /**
         * Company Address
         * @example "55 ALPHA DRIVE WEST"
         */
        companyAddress?: string;
        /**
         * Company City
         * @example "PITTSBURGH"
         */
        companyCity?: string;
        /**
         * Company State
         * @example "PA"
         */
        companyState?: string;
        /**
         * Company Zip Code
         * @example "15238"
         */
        companyZipCode?: string;
        /**
         * Blank
         * @example ""
         */
        blank02?: string;
        /**
         * Total Number of Payees
         * @example 8
         */
        totalNumberOfPayees?: number;
        /**
         * Contact Name
         * @example "ERIC HOLMBERG"
         */
        contactName?: string;
        /**
         * Contact Phone Number
         * @example "8143681274"
         */
        contactPhoneNumber?: string;
        /**
         * Contact Email
         * @example ""
         */
        contactEmail?: string;
        /**
         * Blank
         * @example ""
         */
        blank03?: string;
        /**
         * Sequence Number
         * @example 1
         */
        sequenceNumber?: number;
        /**
         * Blank
         * @example ""
         */
        blank04?: string;
        /**
         * Vendor Indicator
         * @example "I"
         */
        vendorInd?: string;
        /**
         * Blank
         * @example ""
         */
        blank05?: string;
        /**
         * Blank
         * @example ""
         */
        blank06?: string;
      };
    };
  }

  /**
 * @description Delete RecordB  Frontend usage: api.apPeriodEnd.softDeleteRecord()
 * @tags APPeriodEnd
 * @name SoftDeleteRecord
 * @summary Soft Delete AP Period End Record (Method: softDeleteRecord)
 * @request DELETE:/ap-period-end/record
 * @secure
 * @response `200` `{
    items: {
  \**
   * deleted successfully
   * @example "T"
   *\
    message?: string,

},

}` Successfully Deleted RecordB
*/
  export namespace SoftDeleteRecord {
    export type RequestParams = {};
    export type RequestQuery = {
      /** @example "" */
      tin: string;
      /** @example "2024" */
      ctl: string;
    };
    export type RequestBody = ApPeriodEndDto;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: {
        /**
         * deleted successfully
         * @example "T"
         */
        message?: string;
      };
    };
  }

  /**
 * @description Get data for particular record format Frontend usage: api.apPeriodEnd.getAllApPeriodEndReports()
 * @tags APPeriodEnd
 * @name GetAllApPeriodEndReports
 * @summary Get All AP Period End Reports (Method: getAllApPeriodEndReports)
 * @request GET:/ap-period-end
 * @secure
 * @response `200` `{
    items: {
  \**
   * Record Type
   * @example "T"
   *\
    recordType?: string,
  \**
   * ctl
   * @example "MOYE"
   *\
    ctl?: string,
  \**
   * tin
   * @example "173892"
   *\
    tin?: string,
  \**
   * firstPayeeName
   * @example "John"
   *\
    firstPayeeName?: string,

},
    pagination?: {
  \** @example 20 *\
    total_items?: number,
  \** @example 1 *\
    current_page?: number,
  \** @example 10 *\
    items_per_page?: number,
  \** @example 2 *\
    total_pages?: number,

},

}` Successfully retrieved vendor data
*/
  export namespace GetAllApPeriodEndReports {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Search term for filtering results */
      search?: string;
      /**
       * Page number for pagination
       * @default 1
       */
      current_page?: number;
      /**
       * Limit:Number of items per page
       * @default 500
       */
      items_per_page?: number;
      /** Sort field */
      sortBy?: string;
      /** Sort direction (asc or desc) */
      sortOrder?: "asc" | "desc";
      /**
       * RecordType
       * @example "A"
       */
      recordType?: string;
      /**
       * Ctl No
       * @example "7389d"
       */
      ctl?: string;
      /**
       * tin No
       * @example "738hdosd"
       */
      tin?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: {
        /**
         * Record Type
         * @example "T"
         */
        recordType?: string;
        /**
         * ctl
         * @example "MOYE"
         */
        ctl?: string;
        /**
         * tin
         * @example "173892"
         */
        tin?: string;
        /**
         * firstPayeeName
         * @example "John"
         */
        firstPayeeName?: string;
      };
      pagination?: {
        /** @example 20 */
        total_items?: number;
        /** @example 1 */
        current_page?: number;
        /** @example 10 */
        items_per_page?: number;
        /** @example 2 */
        total_pages?: number;
      };
    };
  }

  /**
 * @description Updatw the Flat files based on Record TYpe Frontend usage: api.apPeriodEnd.postApPeriodEndReports()
 * @tags APPeriodEnd
 * @name PostApPeriodEndReports
 * @summary Get 1099 Reports (Method: postApPeriodEndReports)
 * @request POST:/ap-period-end
 * @secure
 * @response `200` `{
    items: {
  \**
   * Updated Successfully
   * @example "T"
   *\
    message?: string,

},

}` Successfully retrieved vendor data
*/
  export namespace PostApPeriodEndReports {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ApPeriodEndBodyDto;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: {
        /**
         * Updated Successfully
         * @example "T"
         */
        message?: string;
      };
    };
  }

  /**
 * @description Retrieves paginated review files data for a specific company and review type using the review files functionality. Frontend usage: api.apPeriodEnd.getYearEndProcessMenuReviewFiles()
 * @tags APPeriodEnd
 * @name GetYearEndProcessMenuReviewFiles
 * @summary Get review files for a company (Method: getYearEndProcessMenuReviewFiles)
 * @request GET:/ap-period-end/year-end-process-menu/review-files
 * @secure
 * @response `200` `{
    items?: ({
  \** @example "example report type" *\
    reportType?: string,
  \** @example "example file name" *\
    fileName?: string,
  \** @example "2025-07-25T11:15:44.835Z" *\
    reportDateTime?: string,
  \** @example "/files/example-file-name.pdf" *\
    filePath?: string,

})[],
    pagination?: {
  \** @example 20 *\
    total_items?: number,
  \** @example 1 *\
    current_page?: number,
  \** @example 10 *\
    items_per_page?: number,
  \** @example 2 *\
    total_pages?: number,

},

}` Successfully retrieved review files
*/
  export namespace GetYearEndProcessMenuReviewFiles {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Search term for filtering results */
      search?: string;
      /**
       * Page number for pagination
       * @default 1
       */
      current_page?: number;
      /**
       * Limit:Number of items per page
       * @default 500
       */
      items_per_page?: number;
      /** Sort field */
      sortBy?: string;
      /** Sort direction (asc or desc) */
      sortOrder?: "asc" | "desc";
      /**
       * Company number (1-99)
       * @example 10
       */
      companyNo: number;
      /**
       * Report Type
       * @example "example report type"
       */
      reportType?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items?: {
        /** @example "example report type" */
        reportType?: string;
        /** @example "example file name" */
        fileName?: string;
        /** @example "2025-07-25T11:15:44.835Z" */
        reportDateTime?: string;
        /** @example "/files/example-file-name.pdf" */
        filePath?: string;
      }[];
      pagination?: {
        /** @example 20 */
        total_items?: number;
        /** @example 1 */
        current_page?: number;
        /** @example 10 */
        items_per_page?: number;
        /** @example 2 */
        total_pages?: number;
      };
    };
  }

  /**
 * @description Frontend usage: api.apPeriodEnd.getVendorDetailsByYear()
 * @tags APPeriodEnd
 * @name GetVendorDetailsByYear
 * @summary Vendor Details for Selected Year (Method: getVendorDetailsByYear)
 * @request GET:/ap-period-end/{year}/vendors/{vendorNo}
 * @secure
 * @response `200` `{
    items?: any,

}` Get vendor details for Selected Year
*/
  export namespace GetVendorDetailsByYear {
    export type RequestParams = {
      year: string;
      vendorNo: string;
    };
    export type RequestQuery = {
      /** Company Number */
      vendorCompanyNumber: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items?: any;
    };
  }

  /**
 * @description Updates vendor information for a specific year and vendor number Frontend usage: api.apPeriodEnd.updateVendorByYear()
 * @tags APPeriodEnd
 * @name UpdateVendorByYear
 * @summary Update vendor details by year and vendor number (Method: updateVendorByYear)
 * @request POST:/ap-period-end/{year}/vendors/{vendorNo}
 * @secure
 * @response `200` `{
  \** @example "Vendor Details Updated Successfully" *\
    message?: string,

}` Vendor Details Updated Successfully
*/
  export namespace UpdateVendorByYear {
    export type RequestParams = {
      year: string;
      vendorNo: string;
    };
    export type RequestQuery = {};
    export type RequestBody = VendorDetailsDto;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example "Vendor Details Updated Successfully" */
      message?: string;
    };
  }
}

export namespace EmployeeExpense {
  /**
 * @description Frontend usage: api.employeeExpense.generateReportEmployeeExpense()
 * @tags Employee Expense
 * @name GenerateReportEmployeeExpense
 * @summary Generate Employee Expense Reports (Method: generateReportEmployeeExpense)
 * @request POST:/employee-expense/generate
 * @secure
 * @response `200` `{
    items: {
  \** @example "Detailed and Summary Report Generated Successfully" *\
    message?: string,

},

}` Generate Employee Expense Reports
*/
  export namespace GenerateReportEmployeeExpense {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = EmployeeExpenseGenerateReportDto;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: {
        /** @example "Detailed and Summary Report Generated Successfully" */
        message?: string;
      };
    };
  }

  /**
 * @description Frontend usage: api.employeeExpense.getEmployeeExpenseReports()
 * @tags Employee Expense
 * @name GetEmployeeExpenseReports
 * @summary Get Employee Expense Reports (Method: getEmployeeExpenseReports)
 * @request GET:/employee-expense/reports
 * @secure
 * @response `200` `{
    items: ({
  \** @example "Employee-Expense" *\
    reportType?: string,
  \** @example "my-report.pdf" *\
    pdfFileName?: string,
  \** @format date-time *\
    reportDateTime: string,
  \** @example "/files/my-report.pdf" *\
    filePath: string,
  \** @example "PDF" *\
    formType: string,

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` Paginated list of Employee Expense Reports
*/
  export namespace GetEmployeeExpenseReports {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items: {
        /** @example "Employee-Expense" */
        reportType?: string;
        /** @example "my-report.pdf" */
        pdfFileName?: string;
        /** @format date-time */
        reportDateTime: string;
        /** @example "/files/my-report.pdf" */
        filePath: string;
        /** @example "PDF" */
        formType: string;
      }[];
      pagination: {
        /** @example 100 */
        total_items: number;
        /** @example 1 */
        current_page: number;
        /** @example 10 */
        items_per_page: number;
        /** @example 10 */
        total_pages: number;
      };
    };
  }
}

export namespace GlobalStates {
  /**
 * @description Frontend usage: api.globalStates.GetReportDetails()
 * @tags GlobalStates
 * @name GetReportDetails
 * @summary Get report details by report name (Method: GetReportDetails)
 * @request GET:/global-states/reports/{name}
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    items?: ({
  \** @example "Open-Payables-By-Due-Date" *\
    reportName?: string,
  \** @example "Environment" *\
    fieldKey?: string,
  \** @example "Environment" *\
    fieldDescription?: string,
  \** @example "string" *\
    fieldComponent?: string,
  \** @example "string" *\
    fieldDataType?: string,
  \** @example 1 *\
    fieldSequence?: number,
  \** @example "in" *\
    variableType?: string,
  \** @example "api call" *\
    xmlMetadata?: string | null,
  \** @example "AP700PRC" *\
    storedProcedureName?: string,
  \** @example 1 *\
    spSequence?: number,
  \** @example "4" *\
    fieldLength?: string | null,

})[],

}` Successfully retrieved spinfo records
*/
  export namespace GetReportDetails {
    export type RequestParams = {
      /**
       * The kebab case name of the report
       * @example "Open-Payables-By-Due-Date"
       */
      name: string;
      /**
       * The variable type to find spinfo records for
       * @maxLength 10
       * @default "in"
       * @example "in"
       */
      variableType: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      items?: {
        /** @example "Open-Payables-By-Due-Date" */
        reportName?: string;
        /** @example "Environment" */
        fieldKey?: string;
        /** @example "Environment" */
        fieldDescription?: string;
        /** @example "string" */
        fieldComponent?: string;
        /** @example "string" */
        fieldDataType?: string;
        /** @example 1 */
        fieldSequence?: number;
        /** @example "in" */
        variableType?: string;
        /** @example "api call" */
        xmlMetadata?: string | null;
        /** @example "AP700PRC" */
        storedProcedureName?: string;
        /** @example 1 */
        spSequence?: number;
        /** @example "4" */
        fieldLength?: string | null;
      }[];
    };
  }

  /**
 * @description Frontend usage: api.globalStates.GenerateReport()
 * @tags GlobalStates
 * @name GenerateReport
 * @summary Execute stored procedure dynamically (Method: GenerateReport)
 * @request POST:/global-states/reports
 * @secure
 * @response `200` `{
    items?: {
  \** @example ["Open Payables report generated                    "] *\
    message?: (string)[],

},

}` Successfully executed stored procedure
*/
  export namespace GenerateReport {
    export type RequestParams = {
      /**
       * The kebab case name of the report
       * @example "Open-Payables-By-Due-Date"
       */
      name: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ExecuteSpDto;
    export type RequestHeaders = {};
    export type ResponseBody = {
      items?: {
        /** @example ["Open Payables report generated                    "] */
        message?: string[];
      };
    };
  }

  /**
 * @description Frontend usage: api.globalStates.GetAllReportNames()
 * @tags GlobalStates
 * @name GetAllReportNames
 * @summary Get all available report names (Method: GetAllReportNames)
 * @request GET:/global-states/reports
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
  \** @example ["Open-Payables-By-Due-Date","Vendor-Aged-Report","Company-Summary"] *\
    data?: (string)[],

}` Successfully retrieved report names
*/
  export namespace GetAllReportNames {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      /** @example ["Open-Payables-By-Due-Date","Vendor-Aged-Report","Company-Summary"] */
      data?: string[];
    };
  }

  /**
 * @description Frontend usage: api.globalStates.GetDropdownData()
 * @tags GlobalStates
 * @name GetDropdownData
 * @summary Get generic dropdown data for various entities (Method: GetDropdownData)
 * @request GET:/global-states/list-options
 * @secure
 * @response `200` `{
  \** @example [{"id":"H","value":"H","label":"Hold"},{"id":"A","value":"A","label":"ACH"},{"id":"W","value":"W","label":"Wire Transfer"}] *\
    items?: ({
  \** @example "1" *\
    id?: string,
  \** @example "Normal" *\
    value?: string,
  \** @example "Normal" *\
    label?: string,

})[],
    pagination?: {
  \** @example 5 *\
    total_items?: number,
  \** @example 1 *\
    current_page?: number,
  \** @example 10 *\
    items_per_page?: number,
  \** @example 1 *\
    total_pages?: number,

},

}` Successfully retrieved dropdown data
*/
  export namespace GetDropdownData {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Optional search term to filter results
       * @example "search term"
       */
      search?: string;
      /**
       * Page number for pagination
       * @example 1
       */
      current_page?: number;
      /**
       * Number of items per page
       * @example 10
       */
      items_per_page?: number;
      /** Sort field */
      sortBy?: string;
      /** Sort direction (asc or desc) */
      sortOrder?: "asc" | "desc";
      /**
       * Type of dropdown data to retrieve (includes voucher types, process types, form types, etc.)
       * @example "PROCESS_TYPES"
       */
      type:
        | "PROCESS_TYPES"
        | "FORM_TYPE"
        | "PAYMENT_FOR_REPORT_TYPES"
        | "COUNTRIES_ISO"
        | "COUNTRIES_PHONE_CODE"
        | "HOLD_VOUCHER_CODE"
        | "PREPAID_OPTIONS"
        | "PAY_HOLD_OPTIONS"
        | "HOLD_VOUCHER_DESCRIPTIONS"
        | "RECORD_TYPE_OPTIONS"
        | "PAYMENT_VOUCHER_TYPE"
        | "MAKE_PREPAID_FLAG"
        | "SINGLE_CHECK_FLAG"
        | "PAY_OR_HOLD_CODES"
        | "VENDOR_NAMES"
        | "COMPANY_NAMES"
        | "EXPENSE_GL"
        | "VENDOR_TERMS_CODE"
        | "VENDOR_GAL_RECEIPT"
        | "VENDOR_CATEGORY"
        | "AP_1099"
        | "VENDOR_FORM_TYPE"
        | "VENDOR_CARRIER"
        | "VENDOR_MAINTENANCE_TYPE"
        | "AP_PERIOD_END_YEARS";
      /**
       * Optional company number for company-specific dropdowns
       * @example 10
       */
      companyNo?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example [{"id":"H","value":"H","label":"Hold"},{"id":"A","value":"A","label":"ACH"},{"id":"W","value":"W","label":"Wire Transfer"}] */
      items?: {
        /** @example "1" */
        id?: string;
        /** @example "Normal" */
        value?: string;
        /** @example "Normal" */
        label?: string;
      }[];
      pagination?: {
        /** @example 5 */
        total_items?: number;
        /** @example 1 */
        current_page?: number;
        /** @example 10 */
        items_per_page?: number;
        /** @example 1 */
        total_pages?: number;
      };
    };
  }

  /**
 * @description Generate report file(s) for the given company and usecase Frontend usage: api.globalStates.generateReportFiles()
 * @tags GlobalStates
 * @name GenerateReportFiles
 * @summary Generate Report Files (Method: generateReportFiles)
 * @request POST:/global-states/reports/generate
 * @secure
 * @response `200` `{
  \** @example "Report file(s) generated successfully" *\
    message?: string,
    files?: ({
  \** @example "AP-Nacha-ACH-Creation_20250827.xlsx" *\
    fileName?: string,
  \** @example "http://server:5001/reports/AP-Nacha-ACH-Creation_20250827.xlsx" *\
    filePath?: string,

})[],

}` Report file(s) generated successfully
*/
  export namespace GenerateReportFiles {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = GenerateReportFilesPayload;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example "Report file(s) generated successfully" */
      message?: string;
      files?: {
        /** @example "AP-Nacha-ACH-Creation_20250827.xlsx" */
        fileName?: string;
        /** @example "http://server:5001/reports/AP-Nacha-ACH-Creation_20250827.xlsx" */
        filePath?: string;
      }[];
    };
  }

  /**
 * @description Frontend usage: api.globalStates.GetGeneralSystemCompany()
 * @tags GlobalStates
 * @name GetGeneralSystemCompany
 * @summary Get General System Company by companyNo (Method: GetGeneralSystemCompany)
 * @request GET:/global-states/general-system-company/{companyNo}
 * @secure
 * @response `200` `{
  \** @example true *\
    fixedAssets?: boolean,
  \** @example true *\
    orderEntryInvoicing?: boolean,
  \** @example true *\
    salesAnalysis?: boolean,
  \** @example true *\
    inventory?: boolean,
  \** @example true *\
    purchaseOrder?: boolean,
  \** @example true *\
    billOfMaterial?: boolean,
  \** @example true *\
    jobShop?: boolean,
  \** @example true *\
    jobCost?: boolean,
  \** @example "filler1" *\
    "filler1"?: string,
  \** @example true *\
    multiWarehouseYn?: boolean,
  \** @example true *\
    thirteenAccountingPeriodsYn?: boolean,
  \** @example true *\
    fractionalQtyActive?: boolean,
  \** @example "apPostOverrideCode" *\
    apPostOverrideCode?: string,
  \** @example "arPostOverrideCode" *\
    arPostOverrideCode?: string,
  \** @example "faPostOverrideCode" *\
    faPostOverrideCode?: string,
  \** @example "glPostOverrideCode" *\
    glPostOverrideCode?: string,
  \** @example 1 *\
    defaultCompanyNo?: number,
  \** @example "filler" *\
    filler?: string,

}` Get General System Company
*/
  export namespace GetGeneralSystemCompany {
    export type RequestParams = {
      /**
       * Company Number
       * @example 1
       */
      companyNo: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      fixedAssets?: boolean;
      /** @example true */
      orderEntryInvoicing?: boolean;
      /** @example true */
      salesAnalysis?: boolean;
      /** @example true */
      inventory?: boolean;
      /** @example true */
      purchaseOrder?: boolean;
      /** @example true */
      billOfMaterial?: boolean;
      /** @example true */
      jobShop?: boolean;
      /** @example true */
      jobCost?: boolean;
      /** @example "filler1" */
      filler1?: string;
      /** @example true */
      multiWarehouseYn?: boolean;
      /** @example true */
      thirteenAccountingPeriodsYn?: boolean;
      /** @example true */
      fractionalQtyActive?: boolean;
      /** @example "apPostOverrideCode" */
      apPostOverrideCode?: string;
      /** @example "arPostOverrideCode" */
      arPostOverrideCode?: string;
      /** @example "faPostOverrideCode" */
      faPostOverrideCode?: string;
      /** @example "glPostOverrideCode" */
      glPostOverrideCode?: string;
      /** @example 1 */
      defaultCompanyNo?: number;
      /** @example "filler" */
      filler?: string;
    };
  }

  /**
 * @description Frontend usage: api.globalStates.generateAuthCode()
 * @tags GlobalStates
 * @name GenerateAuthCode
 * @summary Generate Auth Code for Company No (Method: generateAuthCode)
 * @request POST:/global-states/general-system-company/{companyNo}
 * @secure
 * @response `200` `{
  \** @example true *\
    fixedAssets?: boolean,
  \** @example true *\
    orderEntryInvoicing?: boolean,
  \** @example true *\
    salesAnalysis?: boolean,
  \** @example true *\
    inventory?: boolean,
  \** @example true *\
    purchaseOrder?: boolean,
  \** @example true *\
    billOfMaterial?: boolean,
  \** @example true *\
    jobShop?: boolean,
  \** @example true *\
    jobCost?: boolean,
  \** @example "filler1" *\
    "filler1"?: string,
  \** @example true *\
    multiWarehouseYn?: boolean,
  \** @example true *\
    thirteenAccountingPeriodsYn?: boolean,
  \** @example true *\
    fractionalQtyActive?: boolean,
  \** @example "apPostOverrideCode" *\
    apPostOverrideCode?: string,
  \** @example "arPostOverrideCode" *\
    arPostOverrideCode?: string,
  \** @example "faPostOverrideCode" *\
    faPostOverrideCode?: string,
  \** @example "glPostOverrideCode" *\
    glPostOverrideCode?: string,
  \** @example 1 *\
    defaultCompanyNo?: number,
  \** @example "filler" *\
    filler?: string,

}` Generate Auth Code
*/
  export namespace GenerateAuthCode {
    export type RequestParams = {
      /**
       * Company Number
       * @example 1
       */
      companyNo: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      fixedAssets?: boolean;
      /** @example true */
      orderEntryInvoicing?: boolean;
      /** @example true */
      salesAnalysis?: boolean;
      /** @example true */
      inventory?: boolean;
      /** @example true */
      purchaseOrder?: boolean;
      /** @example true */
      billOfMaterial?: boolean;
      /** @example true */
      jobShop?: boolean;
      /** @example true */
      jobCost?: boolean;
      /** @example "filler1" */
      filler1?: string;
      /** @example true */
      multiWarehouseYn?: boolean;
      /** @example true */
      thirteenAccountingPeriodsYn?: boolean;
      /** @example true */
      fractionalQtyActive?: boolean;
      /** @example "apPostOverrideCode" */
      apPostOverrideCode?: string;
      /** @example "arPostOverrideCode" */
      arPostOverrideCode?: string;
      /** @example "faPostOverrideCode" */
      faPostOverrideCode?: string;
      /** @example "glPostOverrideCode" */
      glPostOverrideCode?: string;
      /** @example 1 */
      defaultCompanyNo?: number;
      /** @example "filler" */
      filler?: string;
    };
  }

  /**
 * @description Frontend usage: api.globalStates.getAuthCodeChecker()
 * @tags GlobalStates
 * @name GetAuthCodeChecker
 * @summary Check Auth Code for Company No (Method: getAuthCodeChecker)
 * @request GET:/global-states/general-system-company/{companyNo}/auth-code
 * @secure
 * @response `200` `{
  \** @example true *\
    fixedAssets?: boolean,
  \** @example true *\
    orderEntryInvoicing?: boolean,
  \** @example true *\
    salesAnalysis?: boolean,
  \** @example true *\
    inventory?: boolean,
  \** @example true *\
    purchaseOrder?: boolean,
  \** @example true *\
    billOfMaterial?: boolean,
  \** @example true *\
    jobShop?: boolean,
  \** @example true *\
    jobCost?: boolean,
  \** @example "filler1" *\
    "filler1"?: string,
  \** @example true *\
    multiWarehouseYn?: boolean,
  \** @example true *\
    thirteenAccountingPeriodsYn?: boolean,
  \** @example true *\
    fractionalQtyActive?: boolean,
  \** @example "apPostOverrideCode" *\
    apPostOverrideCode?: string,
  \** @example "arPostOverrideCode" *\
    arPostOverrideCode?: string,
  \** @example "faPostOverrideCode" *\
    faPostOverrideCode?: string,
  \** @example "glPostOverrideCode" *\
    glPostOverrideCode?: string,
  \** @example 1 *\
    defaultCompanyNo?: number,
  \** @example "filler" *\
    filler?: string,

}` Get General System Company
*/
  export namespace GetAuthCodeChecker {
    export type RequestParams = {
      /**
       * Company Number
       * @example 1
       */
      companyNo: number;
    };
    export type RequestQuery = {
      /**
       * 526267
       * @example 526456
       */
      authCode: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      fixedAssets?: boolean;
      /** @example true */
      orderEntryInvoicing?: boolean;
      /** @example true */
      salesAnalysis?: boolean;
      /** @example true */
      inventory?: boolean;
      /** @example true */
      purchaseOrder?: boolean;
      /** @example true */
      billOfMaterial?: boolean;
      /** @example true */
      jobShop?: boolean;
      /** @example true */
      jobCost?: boolean;
      /** @example "filler1" */
      filler1?: string;
      /** @example true */
      multiWarehouseYn?: boolean;
      /** @example true */
      thirteenAccountingPeriodsYn?: boolean;
      /** @example true */
      fractionalQtyActive?: boolean;
      /** @example "apPostOverrideCode" */
      apPostOverrideCode?: string;
      /** @example "arPostOverrideCode" */
      arPostOverrideCode?: string;
      /** @example "faPostOverrideCode" */
      faPostOverrideCode?: string;
      /** @example "glPostOverrideCode" */
      glPostOverrideCode?: string;
      /** @example 1 */
      defaultCompanyNo?: number;
      /** @example "filler" */
      filler?: string;
    };
  }
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title ARG API
 * @version 1.0
 * @contact
 *
 * The ARG API description
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  healthCheck = {
    /**
     * No description
     *
     * @tags App
     * @name AppControllerHealthCheck
     * @request GET:/health-check
     * @response `200` `void`
     */
    appControllerHealthCheck: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/health-check`,
        method: "GET",
        ...params,
      }),
  };
  appDashboard = {
    /**
     * No description
     *
     * @tags App
     * @name AppControllerGetAppDashboard
     * @request GET:/app-dashboard
     * @response `200` `void`
     */
    appControllerGetAppDashboard: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/app-dashboard`,
        method: "GET",
        ...params,
      }),
  };
  accountPayable = {
    /**
 * @description Frontend usage: api.accountPayable.getCompanies()
 *
 * @tags Voucher
 * @name GetCompanies
 * @summary Get all companies (Method: getCompanies)
 * @request GET:/account-payable/voucher/companies
 * @secure
 * @response `200` `{
    items: ({
  \** @example "123" *\
    id: string,
  \** @example "Company Name" *\
    label: string,
  \** @example "Company Name" *\
    value: string,

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` Success
 */
    getCompanies: (query: GetCompaniesParams, params: RequestParams = {}) =>
      this.request<
        {
          items: {
            /** @example "123" */
            id: string;
            /** @example "Company Name" */
            label: string;
            /** @example "Company Name" */
            value: string;
          }[];
          pagination: {
            /** @example 100 */
            total_items: number;
            /** @example 1 */
            current_page: number;
            /** @example 10 */
            items_per_page: number;
            /** @example 10 */
            total_pages: number;
          };
        },
        any
      >({
        path: `/account-payable/voucher/companies`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.accountPayable.getProcessTypes()
 *
 * @tags Voucher
 * @name GetProcessTypes
 * @summary Get all process types (Method: getProcessTypes)
 * @request GET:/account-payable/voucher/process-types
 * @secure
 * @response `200` `{
    items: ({
  \** @example "1" *\
    id: string,
  \** @example "Normal" *\
    label: string,
  \** @example "Normal" *\
    value: string,

})[],

}` Success
 */
    getProcessTypes: (params: RequestParams = {}) =>
      this.request<
        {
          items: {
            /** @example "1" */
            id: string;
            /** @example "Normal" */
            label: string;
            /** @example "Normal" */
            value: string;
          }[];
        },
        any
      >({
        path: `/account-payable/voucher/process-types`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.accountPayable.getAllVendors()
 *
 * @tags Voucher
 * @name GetAllVendors
 * @summary Get all vendors (Method: getAllVendors)
 * @request GET:/account-payable/voucher/vendors
 * @secure
 * @response `200` `{
    items: ({
  \** @example "11" *\
    id: string,
  \** @example "Vendor Name" *\
    label: string,
  \** @example "Vendor Name" *\
    value: string,

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` Success
 */
    getAllVendors: (query: GetAllVendorsParams, params: RequestParams = {}) =>
      this.request<
        {
          items: {
            /** @example "11" */
            id: string;
            /** @example "Vendor Name" */
            label: string;
            /** @example "Vendor Name" */
            value: string;
          }[];
          pagination: {
            /** @example 100 */
            total_items: number;
            /** @example 1 */
            current_page: number;
            /** @example 10 */
            items_per_page: number;
            /** @example 10 */
            total_pages: number;
          };
        },
        any
      >({
        path: `/account-payable/voucher/vendors`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.accountPayable.getVendorById()
 *
 * @tags Voucher
 * @name GetVendorById
 * @summary Get Vendor by Id (Method: getVendorById)
 * @request GET:/account-payable/voucher/get-vendor-by-id
 * @secure
 * @response `200` `{
    items: any,

}` Vendor fetched successfully
 */
    getVendorById: (query: GetVendorByIdParams, params: RequestParams = {}) =>
      this.request<
        {
          items: any;
        },
        any
      >({
        path: `/account-payable/voucher/get-vendor-by-id`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Pre-cache all vendors, APDATE records, GL Master accounts, GSTable records, and FreightInvoice records for a company to improve performance for CSV upload processing. This endpoint efficiently loads all vendor, APDATE, GL Master, GSTable (General System), and FreightInvoice data into Redis cache using bulk operations to avoid performance issues during CSV processing. Frontend usage: api.accountPayable.cacheData()
 *
 * @tags Voucher
 * @name CacheData
 * @summary Cache all data for a company (Method: cacheData)
 * @request POST:/account-payable/voucher/cache
 * @secure
 * @response `200` `{
  \**
   * Indicates if the operation was successful
   * @example true
   *\
    success: boolean,
  \**
   * Success message
   * @example "Operation completed successfully"
   *\
    message: string,
    data: {
    vendors: {
  \**
   * Total number of vendors found for the company
   * @example 1500
   *\
    totalVendors: number,
  \**
   * Number of vendors successfully cached
   * @example 1500
   *\
    cachedVendors: number,
  \**
   * Time taken to cache vendors in milliseconds
   * @example 2500
   *\
    duration: number,

},
    apdate: {
  \**
   * Total number of APDATE records found for the company
   * @example 3500
   *\
    totalApdates: number,
  \**
   * Number of APDATE records successfully cached
   * @example 3500
   *\
    cachedApdates: number,
  \**
   * Time taken to cache APDATE records in milliseconds
   * @example 1200
   *\
    duration: number,

},
    glmaster: {
  \**
   * Total number of GL Master records found for the company
   * @example "All active GL accounts"
   *\
    totalGlMasters: string,
  \**
   * Number of GL Master records successfully cached
   * @example "All active GL accounts"
   *\
    cachedGlMasters: string,
  \**
   * Time taken to cache GL Master records in milliseconds
   * @example 800
   *\
    duration: number,
  \**
   * Indicates if GL Master caching was successful
   * @example true
   *\
    success: boolean,

},
  \**
   * Total time taken for the entire caching operation in milliseconds
   * @example 3700
   *\
    totalDuration: number,
    summary: {
  \** @example 1500 *\
    totalVendors?: number,
  \** @example 1500 *\
    cachedVendors?: number,
  \** @example 3500 *\
    totalApdates?: number,
  \** @example 3500 *\
    cachedApdates?: number,
  \** @example "All active GL accounts" *\
    totalGlMasters?: string,
  \** @example "All active GL accounts" *\
    cachedGlMasters?: string,
  \** @example "Successfully cached 1500 vendors, 3500 APDATE records, All active GL accounts GL Master records, All system configurations GSTable records, and All freight invoices FreightInvoice records for company 10" *\
    message?: string,

},

},

}` Data cached successfully
 */
    cacheData: (data: CacheDataPayload, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * Indicates if the operation was successful
           * @example true
           */
          success: boolean;
          /**
           * Success message
           * @example "Operation completed successfully"
           */
          message: string;
          data: {
            vendors: {
              /**
               * Total number of vendors found for the company
               * @example 1500
               */
              totalVendors: number;
              /**
               * Number of vendors successfully cached
               * @example 1500
               */
              cachedVendors: number;
              /**
               * Time taken to cache vendors in milliseconds
               * @example 2500
               */
              duration: number;
            };
            apdate: {
              /**
               * Total number of APDATE records found for the company
               * @example 3500
               */
              totalApdates: number;
              /**
               * Number of APDATE records successfully cached
               * @example 3500
               */
              cachedApdates: number;
              /**
               * Time taken to cache APDATE records in milliseconds
               * @example 1200
               */
              duration: number;
            };
            glmaster: {
              /**
               * Total number of GL Master records found for the company
               * @example "All active GL accounts"
               */
              totalGlMasters: string;
              /**
               * Number of GL Master records successfully cached
               * @example "All active GL accounts"
               */
              cachedGlMasters: string;
              /**
               * Time taken to cache GL Master records in milliseconds
               * @example 800
               */
              duration: number;
              /**
               * Indicates if GL Master caching was successful
               * @example true
               */
              success: boolean;
            };
            /**
             * Total time taken for the entire caching operation in milliseconds
             * @example 3700
             */
            totalDuration: number;
            summary: {
              /** @example 1500 */
              totalVendors?: number;
              /** @example 1500 */
              cachedVendors?: number;
              /** @example 3500 */
              totalApdates?: number;
              /** @example 3500 */
              cachedApdates?: number;
              /** @example "All active GL accounts" */
              totalGlMasters?: string;
              /** @example "All active GL accounts" */
              cachedGlMasters?: string;
              /** @example "Successfully cached 1500 vendors, 3500 APDATE records, All active GL accounts GL Master records, All system configurations GSTable records, and All freight invoices FreightInvoice records for company 10" */
              message?: string;
            };
          };
        },
        any
      >({
        path: `/account-payable/voucher/cache`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.accountPayable.getVoucherEntry()
 *
 * @tags Voucher
 * @name GetVoucherEntry
 * @summary Get Voucher Entry Grid Data (Method: getVoucherEntry)
 * @request GET:/account-payable/voucher/get-voucher-entry
 * @secure
 * @response `200` `{
    items: ({
  \** @example "NORMAL" *\
    processType: string,
  \** @example 41741 *\
    entryNo: number,
  \** @example "ABC123" *\
    invoiceNo: string,
  \** @example 2443500 *\
    invoiceAmount: number,
  \** @example "02/22/04" *\
    invoiceDate: string,
  \** @example "02/22/04" *\
    dueDate: string,
  \** @example "02/22/04" *\
    discountDueDate: string,
  \** @example "123" *\
    holdDesc: string,
  \** @example 22204 *\
    companyNo: number,
  \** @example 22204 *\
    vendorNo: number,
  \** @example "ABSG CONSULTING" *\
    vendorName: string,

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` Voucher data found successfully
 */
    getVoucherEntry: (
      query: GetVoucherEntryParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          items: {
            /** @example "NORMAL" */
            processType: string;
            /** @example 41741 */
            entryNo: number;
            /** @example "ABC123" */
            invoiceNo: string;
            /** @example 2443500 */
            invoiceAmount: number;
            /** @example "02/22/04" */
            invoiceDate: string;
            /** @example "02/22/04" */
            dueDate: string;
            /** @example "02/22/04" */
            discountDueDate: string;
            /** @example "123" */
            holdDesc: string;
            /** @example 22204 */
            companyNo: number;
            /** @example 22204 */
            vendorNo: number;
            /** @example "ABSG CONSULTING" */
            vendorName: string;
          }[];
          pagination: {
            /** @example 100 */
            total_items: number;
            /** @example 1 */
            current_page: number;
            /** @example 10 */
            items_per_page: number;
            /** @example 10 */
            total_pages: number;
          };
        },
        any
      >({
        path: `/account-payable/voucher/get-voucher-entry`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.accountPayable.softDeleteVoucher()
 *
 * @tags Voucher
 * @name SoftDeleteVoucher
 * @summary Soft delete a voucher (Method: softDeleteVoucher)
 * @request DELETE:/account-payable/voucher/voucher
 * @secure
 * @response `200` `{
  \** @example true *\
    success: boolean,
  \** @example "Voucher with entry number 41742, company number 10, vendor number 2, invoice number 1001 has been deleted successfully" *\
    message: string,

}` Voucher deleted successfully
 */
    softDeleteVoucher: (
      data: SoftDeleteVoucherDto,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example true */
          success: boolean;
          /** @example "Voucher with entry number 41742, company number 10, vendor number 2, invoice number 1001 has been deleted successfully" */
          message: string;
        },
        any
      >({
        path: `/account-payable/voucher/voucher`,
        method: "DELETE",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.accountPayable.getDataByEntryNo()
 *
 * @tags Voucher
 * @name GetDataByEntryNo
 * @summary Get Voucher Headers and Details (Method: getDataByEntryNo)
 * @request GET:/account-payable/voucher/entry/{entryNo}
 * @secure
 * @response `200` `{
    items?: {
    headerItem?: {
  \** @example "N" *\
    isDeleted?: string,
  \** @example 10 *\
    companyNo?: number,
  \** @example 19042 *\
    entryNo?: number,
  \** @example 1 *\
    entrySequence?: number,
  \** @example 1001 *\
    vendorNo?: number,
  \** @example 0 *\
    canceledVoucher?: number,
  \** @example 11230024 *\
    apGlNo?: number,
  \** @example "Office Supplies" *\
    invoiceDesc?: string,
  \** @example "112325" *\
    invoiceDate?: string,
  \** @example "112325" *\
    dueDate?: string,
  \** @example "Y" *\
    singleCheck?: string,
  \** @example "N" *\
    holdCode?: string,
  \** @example "No Hold" *\
    holdDesc?: string,
  \** @example "N" *\
    prepaidCode?: string,
  \** @example 0 *\
    prepaidCheckNo?: number,
  \** @example "Vendor Name" *\
    vendorName?: string,
  \** @example "Address 1" *\
    "vendorAdd1"?: string,
  \** @example "Address 2" *\
    "vendorAdd2"?: string,
  \** @example "" *\
    "vendorAdd3"?: string,
  \** @example "" *\
    "vendorAdd4"?: string,
  \** @example 11230024 *\
    bankGl?: number,
  \** @example 100000 *\
    invoiceAmount?: number,
  \** @example 11230024 *\
    retentionGl?: number,
  \** @example 10 *\
    retentionPct?: number,
  \** @example "112325" *\
    prepaidCheckdate?: string,
  \** @example 0 *\
    totalFreight?: number,
  \** @example 12059 *\
    salesOrderNo?: number,
  \** @example 1 *\
    srn?: number,
  \** @example "000000" *\
    carrierId?: string,
  \** @example 0 *\
    vendorPaymentTerms?: number,
  \** @example "NORMAL" *\
    processType?: string,
  \** @example "112325" *\
    discountDueDate?: string,
  \** @example "112325" *\
    extendedDiscountDueDate?: string,
  \** @example "1001" *\
    invoiceNo?: string,

},
    detailItems?: ({
  \** @example "N" *\
    isDeleted?: string,
  \** @example 10 *\
    companyNo?: number,
  \** @example 19042 *\
    entryNo?: number,
  \** @example 1 *\
    entrySequence?: number,
  \** @example 1001 *\
    vendorNo?: number,
  \** @example 10 *\
    lineCompanyNo?: number,
  \** @example 11230024 *\
    lineGlNo?: number,
  \** @example "Office Supplies" *\
    lineDesc?: string,
  \** @example 100000 *\
    lineAmount?: number,
  \** @example 0 *\
    discountAmount?: number,
  \** @example 0 *\
    discountPercentage?: number,
  \** @example "SUP001" *\
    inventoryItem?: string,
  \** @example 1 *\
    quantity?: number,
  \** @example "JOB001" *\
    jobNo?: string,
  \** @example "COST001" *\
    jobCostCode?: string,
  \** @example "L" *\
    jobCostType?: string,
  \** @example 1 *\
    jobCostQuantity?: number,
  \** @example 0 *\
    gallons?: number,
  \** @example 0 *\
    receiptNo?: number,
  \** @example "O" *\
    openClosed?: string,
  \** @example 1 *\
    poLineNo?: number,
  \** @example 100000 *\
    productAmount?: number,
  \** @example 0 *\
    freightAmount?: number,
  \** @example "PO001" *\
    poNo?: string,

})[],

},

}` Voucher data found successfully
 */
    getDataByEntryNo: (
      { entryNo, ...query }: GetDataByEntryNoParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          items?: {
            headerItem?: {
              /** @example "N" */
              isDeleted?: string;
              /** @example 10 */
              companyNo?: number;
              /** @example 19042 */
              entryNo?: number;
              /** @example 1 */
              entrySequence?: number;
              /** @example 1001 */
              vendorNo?: number;
              /** @example 0 */
              canceledVoucher?: number;
              /** @example 11230024 */
              apGlNo?: number;
              /** @example "Office Supplies" */
              invoiceDesc?: string;
              /** @example "112325" */
              invoiceDate?: string;
              /** @example "112325" */
              dueDate?: string;
              /** @example "Y" */
              singleCheck?: string;
              /** @example "N" */
              holdCode?: string;
              /** @example "No Hold" */
              holdDesc?: string;
              /** @example "N" */
              prepaidCode?: string;
              /** @example 0 */
              prepaidCheckNo?: number;
              /** @example "Vendor Name" */
              vendorName?: string;
              /** @example "Address 1" */
              vendorAdd1?: string;
              /** @example "Address 2" */
              vendorAdd2?: string;
              /** @example "" */
              vendorAdd3?: string;
              /** @example "" */
              vendorAdd4?: string;
              /** @example 11230024 */
              bankGl?: number;
              /** @example 100000 */
              invoiceAmount?: number;
              /** @example 11230024 */
              retentionGl?: number;
              /** @example 10 */
              retentionPct?: number;
              /** @example "112325" */
              prepaidCheckdate?: string;
              /** @example 0 */
              totalFreight?: number;
              /** @example 12059 */
              salesOrderNo?: number;
              /** @example 1 */
              srn?: number;
              /** @example "000000" */
              carrierId?: string;
              /** @example 0 */
              vendorPaymentTerms?: number;
              /** @example "NORMAL" */
              processType?: string;
              /** @example "112325" */
              discountDueDate?: string;
              /** @example "112325" */
              extendedDiscountDueDate?: string;
              /** @example "1001" */
              invoiceNo?: string;
            };
            detailItems?: {
              /** @example "N" */
              isDeleted?: string;
              /** @example 10 */
              companyNo?: number;
              /** @example 19042 */
              entryNo?: number;
              /** @example 1 */
              entrySequence?: number;
              /** @example 1001 */
              vendorNo?: number;
              /** @example 10 */
              lineCompanyNo?: number;
              /** @example 11230024 */
              lineGlNo?: number;
              /** @example "Office Supplies" */
              lineDesc?: string;
              /** @example 100000 */
              lineAmount?: number;
              /** @example 0 */
              discountAmount?: number;
              /** @example 0 */
              discountPercentage?: number;
              /** @example "SUP001" */
              inventoryItem?: string;
              /** @example 1 */
              quantity?: number;
              /** @example "JOB001" */
              jobNo?: string;
              /** @example "COST001" */
              jobCostCode?: string;
              /** @example "L" */
              jobCostType?: string;
              /** @example 1 */
              jobCostQuantity?: number;
              /** @example 0 */
              gallons?: number;
              /** @example 0 */
              receiptNo?: number;
              /** @example "O" */
              openClosed?: string;
              /** @example 1 */
              poLineNo?: number;
              /** @example 100000 */
              productAmount?: number;
              /** @example 0 */
              freightAmount?: number;
              /** @example "PO001" */
              poNo?: string;
            }[];
          };
        },
        any
      >({
        path: `/account-payable/voucher/entry/${entryNo}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Creates a new voucher or updates an existing one with header and associated details using upsert logic. If entryNo is provided, updates the existing voucher; otherwise creates a new one. Uses Sequelize upsert method for efficient database operations. Frontend usage: api.accountPayable.submitVoucher()
 *
 * @tags Voucher
 * @name SubmitVoucher
 * @summary Upsert a voucher with header and details (Method: submitVoucher)
 * @request POST:/account-payable/voucher/entry/submit
 * @secure
 * @response `default` `{
    items?: {
    header?: {
  \** @example "N" *\
    isDeleted?: string,
  \** @example 10 *\
    companyNo?: number,
  \** @example 19042 *\
    entryNo?: number,
  \** @example 1 *\
    entrySequence?: number,
  \** @example 1001 *\
    vendorNo?: number,
  \** @example 0 *\
    canceledVoucher?: number,
  \** @example 11230024 *\
    apGlNo?: number,
  \** @example "Office Supplies" *\
    invoiceDesc?: string,
  \** @example "20240315" *\
    invoiceDate?: string,
  \** @example "20240415" *\
    dueDate?: string,
  \** @example "Y" *\
    singleCheck?: string,
  \** @example "N" *\
    holdCode?: string,
  \** @example "No Hold" *\
    holdDesc?: string,
  \** @example "N" *\
    prepaidCode?: string,
  \** @example 0 *\
    prepaidCheckNo?: number,
  \** @example "Vendor Name" *\
    vendorName?: string,
  \** @example "Address 1" *\
    "vendorAdd1"?: string,
  \** @example "Address 2" *\
    "vendorAdd2"?: string,
  \** @example "" *\
    "vendorAdd3"?: string,
  \** @example "" *\
    "vendorAdd4"?: string,
  \** @example 11230024 *\
    bankGl?: number,
  \** @example 100000 *\
    invoiceAmount?: number,
  \** @example 11230024 *\
    retentionGl?: number,
  \** @example 10 *\
    retentionPct?: number,
  \** @example 20240316 *\
    prepaidCheckdate?: number,
  \** @example 0 *\
    totalFreight?: number,
  \** @example 12059 *\
    salesOrderNo?: number,
  \** @example 1 *\
    srn?: number,
  \** @example "000000" *\
    carrierId?: string,
  \** @example 0 *\
    vendorPaymentTerms?: number,
  \** @example "NORMAL" *\
    processType?: string,
  \** @example "20240415" *\
    discountDueDate?: string,
  \** @example "20240416" *\
    extendedDiscountDueDate?: string,
  \** @example "1001" *\
    invoiceNo?: string,

},
    details?: ({
  \** @example "N" *\
    isDeleted?: string,
  \** @example 10 *\
    companyNo?: number,
  \** @example 19042 *\
    entryNo?: number,
  \** @example 1 *\
    entrySequence?: number,
  \** @example 1001 *\
    vendorNo?: number,
  \** @example 10 *\
    lineCompanyNo?: number,
  \** @example 11230024 *\
    lineGlNo?: number,
  \** @example "Office Supplies" *\
    lineDesc?: string,
  \** @example 100000 *\
    lineAmount?: number,
  \** @example 0 *\
    discountAmount?: number,
  \** @example 0 *\
    discountPercentage?: number,
  \** @example "SUP001" *\
    inventoryItem?: string,
  \** @example 1 *\
    quantity?: number,
  \** @example "JOB001" *\
    jobNo?: string,
  \** @example "COST001" *\
    jobCostCode?: string,
  \** @example "L" *\
    jobCostType?: string,
  \** @example 1 *\
    jobCostQuantity?: number,
  \** @example 0 *\
    gallons?: number,
  \** @example 0 *\
    receiptNo?: number,
  \** @example "O" *\
    openClosed?: string,
  \** @example 1 *\
    poLineNo?: number,
  \** @example 100000 *\
    productAmount?: number,
  \** @example 0 *\
    freightAmount?: number,
  \** @example "PO001" *\
    poNo?: string,

})[],

},

}`
 */
    submitVoucher: (data: SubmitVoucherPayload, params: RequestParams = {}) =>
      this.request<
        any,
        {
          items?: {
            header?: {
              /** @example "N" */
              isDeleted?: string;
              /** @example 10 */
              companyNo?: number;
              /** @example 19042 */
              entryNo?: number;
              /** @example 1 */
              entrySequence?: number;
              /** @example 1001 */
              vendorNo?: number;
              /** @example 0 */
              canceledVoucher?: number;
              /** @example 11230024 */
              apGlNo?: number;
              /** @example "Office Supplies" */
              invoiceDesc?: string;
              /** @example "20240315" */
              invoiceDate?: string;
              /** @example "20240415" */
              dueDate?: string;
              /** @example "Y" */
              singleCheck?: string;
              /** @example "N" */
              holdCode?: string;
              /** @example "No Hold" */
              holdDesc?: string;
              /** @example "N" */
              prepaidCode?: string;
              /** @example 0 */
              prepaidCheckNo?: number;
              /** @example "Vendor Name" */
              vendorName?: string;
              /** @example "Address 1" */
              vendorAdd1?: string;
              /** @example "Address 2" */
              vendorAdd2?: string;
              /** @example "" */
              vendorAdd3?: string;
              /** @example "" */
              vendorAdd4?: string;
              /** @example 11230024 */
              bankGl?: number;
              /** @example 100000 */
              invoiceAmount?: number;
              /** @example 11230024 */
              retentionGl?: number;
              /** @example 10 */
              retentionPct?: number;
              /** @example 20240316 */
              prepaidCheckdate?: number;
              /** @example 0 */
              totalFreight?: number;
              /** @example 12059 */
              salesOrderNo?: number;
              /** @example 1 */
              srn?: number;
              /** @example "000000" */
              carrierId?: string;
              /** @example 0 */
              vendorPaymentTerms?: number;
              /** @example "NORMAL" */
              processType?: string;
              /** @example "20240415" */
              discountDueDate?: string;
              /** @example "20240416" */
              extendedDiscountDueDate?: string;
              /** @example "1001" */
              invoiceNo?: string;
            };
            details?: {
              /** @example "N" */
              isDeleted?: string;
              /** @example 10 */
              companyNo?: number;
              /** @example 19042 */
              entryNo?: number;
              /** @example 1 */
              entrySequence?: number;
              /** @example 1001 */
              vendorNo?: number;
              /** @example 10 */
              lineCompanyNo?: number;
              /** @example 11230024 */
              lineGlNo?: number;
              /** @example "Office Supplies" */
              lineDesc?: string;
              /** @example 100000 */
              lineAmount?: number;
              /** @example 0 */
              discountAmount?: number;
              /** @example 0 */
              discountPercentage?: number;
              /** @example "SUP001" */
              inventoryItem?: string;
              /** @example 1 */
              quantity?: number;
              /** @example "JOB001" */
              jobNo?: string;
              /** @example "COST001" */
              jobCostCode?: string;
              /** @example "L" */
              jobCostType?: string;
              /** @example 1 */
              jobCostQuantity?: number;
              /** @example 0 */
              gallons?: number;
              /** @example 0 */
              receiptNo?: number;
              /** @example "O" */
              openClosed?: string;
              /** @example 1 */
              poLineNo?: number;
              /** @example 100000 */
              productAmount?: number;
              /** @example 0 */
              freightAmount?: number;
              /** @example "PO001" */
              poNo?: string;
            }[];
          };
        }
      >({
        path: `/account-payable/voucher/entry/submit`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
 * @description Frontend usage: api.accountPayable.submitHeaderValidation()
 *
 * @tags Voucher
 * @name SubmitHeaderValidation
 * @summary Create or Update Voucher Header Validation (Method: submitHeaderValidation)
 * @request POST:/account-payable/voucher/header-validation
 * @secure
 * @response `400` `{
    error?: any,

}` Validation failed
 */
    submitHeaderValidation: (
      data: SubmitHeaderValidationPayload,
      params: RequestParams = {},
    ) =>
      this.request<
        any,
        {
          error?: any;
        }
      >({
        path: `/account-payable/voucher/header-validation`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
 * @description Frontend usage: api.accountPayable.getVoucherConfig()
 *
 * @tags Voucher
 * @name GetVoucherConfig
 * @summary Get voucher configuration (Method: getVoucherConfig)
 * @request GET:/account-payable/voucher/config
 * @secure
 * @response `200` `{
    items: {
    company: object,
    vendor: object,
  \** @example "2%" *\
    lineDiscountPercentage?: string,

},

}` Voucher configuration retrieved successfully
 */
    getVoucherConfig: (
      query: GetVoucherConfigParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          items: {
            company: object;
            vendor: object;
            /** @example "2%" */
            lineDiscountPercentage?: string;
          };
        },
        any
      >({
        path: `/account-payable/voucher/config`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.accountPayable.getGlMaster()
 *
 * @tags Voucher
 * @name GetGlMaster
 * @summary Get GL master details (Method: getGlMaster)
 * @request GET:/account-payable/voucher/gl-master
 * @secure
 * @response `200` `{
    items: {
    isDeleted?: string,
    companyNo?: number,
    accountNo?: number,
    subAccountNo?: number,
    accountType?: string,
    description?: string,
    accountCategory?: string,
    statementType?: string,
    statementLine?: number,
    drBalanceForward?: number,
    crBalanceForward?: number,
    specialAccount?: string,
    keyApGal?: string,
    productCode?: string,
    glType?: string,
    poRequired?: string,

},

}` GL master details retrieved successfully
 */
    getGlMaster: (query: GetGlMasterParams, params: RequestParams = {}) =>
      this.request<
        {
          items: {
            isDeleted?: string;
            companyNo?: number;
            accountNo?: number;
            subAccountNo?: number;
            accountType?: string;
            description?: string;
            accountCategory?: string;
            statementType?: string;
            statementLine?: number;
            drBalanceForward?: number;
            crBalanceForward?: number;
            specialAccount?: string;
            keyApGal?: string;
            productCode?: string;
            glType?: string;
            poRequired?: string;
          };
        },
        any
      >({
        path: `/account-payable/voucher/gl-master`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Uploads a CSV file (Flexi, SOGAS, etc), splits into batches, processes via BullMQ and returns summary. Frontend usage: api.accountPayable.uploadCsv()
     *
     * @tags Voucher
     * @name UploadCsv
     * @summary Upload Voucher CSV (Method: uploadCsv)
     * @request POST:/account-payable/voucher/flexi/upload
     * @secure
     * @response `200` `void` CSV accepted, split into batches, processing started.
     */
    uploadCsv: (data: UploadCsvPayload, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/account-payable/voucher/flexi/upload`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * @description Uploads a SOGAS CSV file (regular or tax), splits into batches, processes via BullMQ and returns summary. Use the subType query parameter to specify 'regular' or 'tax'. Frontend usage: api.accountPayable.uploadSogasCsv()
     *
     * @tags Voucher
     * @name UploadSogasCsv
     * @summary Upload SOGAS Voucher CSV (Method: uploadSogasCsv)
     * @request POST:/account-payable/voucher/sogas/upload
     * @secure
     * @response `200` `void` SOGAS CSV accepted, split into batches, processing started.
     */
    uploadSogasCsv: (
      query: UploadSogasCsvParams,
      data: UploadSogasCsvPayload,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/account-payable/voucher/sogas/upload`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),

    /**
 * @description Frontend usage: api.accountPayable.getVoucherSummary()
 *
 * @tags Voucher
 * @name GetVoucherSummary
 * @summary Get voucher summary by company and process type (Method: getVoucherSummary)
 * @request GET:/account-payable/voucher/summary
 * @secure
 * @response `200` `{
  \** @example "$1,234.56" *\
    totalAmount: string,
  \** @example 2 *\
    countE: number,
  \** @example 1 *\
    countW: number,
  \** @example 5 *\
    countS: number,
  \** @example 8 *\
    totalUploads: number,

}` Voucher summary
 */
    getVoucherSummary: (
      query: GetVoucherSummaryParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example "$1,234.56" */
          totalAmount: string;
          /** @example 2 */
          countE: number;
          /** @example 1 */
          countW: number;
          /** @example 5 */
          countS: number;
          /** @example 8 */
          totalUploads: number;
        },
        any
      >({
        path: `/account-payable/voucher/summary`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.accountPayable.getFlexiEntry()
 *
 * @tags Voucher
 * @name GetFlexiEntry
 * @summary Get Flexi Entries Grid Data (Method: getFlexiEntry)
 * @request GET:/account-payable/voucher/flexi/entries
 * @secure
 * @response `200` `{
    items: ({
  \** @example "FLEXI" *\
    processType: string,
  \** @example 41741 *\
    entryNo: number,
  \** @example "ABC123" *\
    invoiceNo: string,
  \** @example 2443500 *\
    invoiceAmount: number,
  \** @example "02/22/04" *\
    invoiceDate: string,
  \** @example "02/22/04" *\
    dueDate: string,
  \** @example "02/22/04" *\
    discountDueDate: string,
  \** @example "123" *\
    holdDesc: string,
  \** @example 22204 *\
    companyNo: number,
  \** @example 22204 *\
    vendorNo: number,
  \** @example "ABSG CONSULTING" *\
    vendorName: string,

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` Flexi data found successfully
 */
    getFlexiEntry: (query: GetFlexiEntryParams, params: RequestParams = {}) =>
      this.request<
        {
          items: {
            /** @example "FLEXI" */
            processType: string;
            /** @example 41741 */
            entryNo: number;
            /** @example "ABC123" */
            invoiceNo: string;
            /** @example 2443500 */
            invoiceAmount: number;
            /** @example "02/22/04" */
            invoiceDate: string;
            /** @example "02/22/04" */
            dueDate: string;
            /** @example "02/22/04" */
            discountDueDate: string;
            /** @example "123" */
            holdDesc: string;
            /** @example 22204 */
            companyNo: number;
            /** @example 22204 */
            vendorNo: number;
            /** @example "ABSG CONSULTING" */
            vendorName: string;
          }[];
          pagination: {
            /** @example 100 */
            total_items: number;
            /** @example 1 */
            current_page: number;
            /** @example 10 */
            items_per_page: number;
            /** @example 10 */
            total_pages: number;
          };
        },
        any
      >({
        path: `/account-payable/voucher/flexi/entries`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.accountPayable.getSogasEntry()
 *
 * @tags Voucher
 * @name GetSogasEntry
 * @summary Get SOGAS Voucher Entry Grid Data (Method: getSogasEntry)
 * @request GET:/account-payable/voucher/sogas/entries
 * @secure
 * @response `200` `{
    items: ({
  \** @example "SOGAS" *\
    processType: string,
  \** @example 41741 *\
    entryNo: number,
  \** @example "ABC123" *\
    invoiceNo: string,
  \** @example 2443500 *\
    invoiceAmount: number,
  \** @example "02/22/04" *\
    invoiceDate: string,
  \** @example "02/22/04" *\
    dueDate: string,
  \** @example "02/22/04" *\
    discountDueDate: string,
  \** @example "123" *\
    holdDesc: string,
  \** @example 10 *\
    companyNo: number,
  \** @example 22204 *\
    vendorNo: number,
  \** @example "ABSG CONSULTING" *\
    vendorName: string,

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` SOGAS voucher data found successfully
 */
    getSogasEntry: (query: GetSogasEntryParams, params: RequestParams = {}) =>
      this.request<
        {
          items: {
            /** @example "SOGAS" */
            processType: string;
            /** @example 41741 */
            entryNo: number;
            /** @example "ABC123" */
            invoiceNo: string;
            /** @example 2443500 */
            invoiceAmount: number;
            /** @example "02/22/04" */
            invoiceDate: string;
            /** @example "02/22/04" */
            dueDate: string;
            /** @example "02/22/04" */
            discountDueDate: string;
            /** @example "123" */
            holdDesc: string;
            /** @example 10 */
            companyNo: number;
            /** @example 22204 */
            vendorNo: number;
            /** @example "ABSG CONSULTING" */
            vendorName: string;
          }[];
          pagination: {
            /** @example 100 */
            total_items: number;
            /** @example 1 */
            current_page: number;
            /** @example 10 */
            items_per_page: number;
            /** @example 10 */
            total_pages: number;
          };
        },
        any
      >({
        path: `/account-payable/voucher/sogas/entries`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.accountPayable.getCarrierInvoices()
 *
 * @tags Voucher
 * @name GetCarrierInvoices
 * @summary Get a paginated list of carrier invoices (Method: getCarrierInvoices)
 * @request GET:/account-payable/voucher/paper/batch-entries
 * @secure
 * @response `200` `{
    items: ({
  \** @example "APPA" *\
    carrierId: string,
  \** @example "24601" *\
    carrierInvoiceNo?: string,
  \** @example "2025-04-29" *\
    ordShipDate: string,
  \** @example "P" *\
    invoiceType?: string,
  \** @example "363822" *\
    ourOrderNo?: number,
  \** @example 1 *\
    shippingReferenceNo?: number,
  \** @example 1373.5 *\
    invoiceAmount: number,

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` A paginated list of carrier invoices
 */
    getCarrierInvoices: (
      query: GetCarrierInvoicesParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          items: {
            /** @example "APPA" */
            carrierId: string;
            /** @example "24601" */
            carrierInvoiceNo?: string;
            /** @example "2025-04-29" */
            ordShipDate: string;
            /** @example "P" */
            invoiceType?: string;
            /** @example "363822" */
            ourOrderNo?: number;
            /** @example 1 */
            shippingReferenceNo?: number;
            /** @example 1373.5 */
            invoiceAmount: number;
          }[];
          pagination: {
            /** @example 100 */
            total_items: number;
            /** @example 1 */
            current_page: number;
            /** @example 10 */
            items_per_page: number;
            /** @example 10 */
            total_pages: number;
          };
        },
        any
      >({
        path: `/account-payable/voucher/paper/batch-entries`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.accountPayable.getLmsCarrierInvoices()
 *
 * @tags Voucher
 * @name GetLmsCarrierInvoices
 * @summary Get a paginated list of Lmscarrier invoices (Method: getLmsCarrierInvoices)
 * @request GET:/account-payable/voucher/lms/batch-entries
 * @secure
 * @response `200` `{
    items: ({
  \** @example "APPA" *\
    carrierId: string,
  \** @example "24601" *\
    carrierInvoiceNo?: string,
  \** @example "2025-04-29" *\
    ordShipDate: string,
  \** @example "P" *\
    invoiceType?: string,
  \** @example "363822" *\
    ourOrderNo?: number,
  \** @example 1 *\
    shippingReferenceNo?: number,
  \** @example 1373.5 *\
    invoiceAmount: number,

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` A paginated list of carrier invoices
 */
    getLmsCarrierInvoices: (
      query: GetLmsCarrierInvoicesParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          items: {
            /** @example "APPA" */
            carrierId: string;
            /** @example "24601" */
            carrierInvoiceNo?: string;
            /** @example "2025-04-29" */
            ordShipDate: string;
            /** @example "P" */
            invoiceType?: string;
            /** @example "363822" */
            ourOrderNo?: number;
            /** @example 1 */
            shippingReferenceNo?: number;
            /** @example 1373.5 */
            invoiceAmount: number;
          }[];
          pagination: {
            /** @example 100 */
            total_items: number;
            /** @example 1 */
            current_page: number;
            /** @example 10 */
            items_per_page: number;
            /** @example 10 */
            total_pages: number;
          };
        },
        any
      >({
        path: `/account-payable/voucher/lms/batch-entries`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.accountPayable.getPaperEntry()
 *
 * @tags Voucher
 * @name GetPaperEntry
 * @summary Get Paper Voucher Entry Grid Data (Method: getPaperEntry)
 * @request GET:/account-payable/voucher/paper/entries
 * @secure
 * @response `200` `{
    items: ({
  \** @example "ABC123" *\
    invoiceNo: string,
  \** @example "02/22/04" *\
    invoiceDate: string,
  \** @example 2443500 *\
    invoiceAmount: number,
  \** @example "02/22/04" *\
    discountDueDate: string,
  \** @example "ABSG CONSULTING" *\
    vendorName: string,
  \** @example 1001 *\
    vendorNo: number,
  \** @example 101010 *\
    salesOrderNo: number,
  \** @example 10 *\
    companyNo: number,
  \** @example "NORMAL" *\
    processType: string,

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` Paper voucher data found successfully
 */
    getPaperEntry: (query: GetPaperEntryParams, params: RequestParams = {}) =>
      this.request<
        {
          items: {
            /** @example "ABC123" */
            invoiceNo: string;
            /** @example "02/22/04" */
            invoiceDate: string;
            /** @example 2443500 */
            invoiceAmount: number;
            /** @example "02/22/04" */
            discountDueDate: string;
            /** @example "ABSG CONSULTING" */
            vendorName: string;
            /** @example 1001 */
            vendorNo: number;
            /** @example 101010 */
            salesOrderNo: number;
            /** @example 10 */
            companyNo: number;
            /** @example "NORMAL" */
            processType: string;
          }[];
          pagination: {
            /** @example 100 */
            total_items: number;
            /** @example 1 */
            current_page: number;
            /** @example 10 */
            items_per_page: number;
            /** @example 10 */
            total_pages: number;
          };
        },
        any
      >({
        path: `/account-payable/voucher/paper/entries`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.accountPayable.getLmsEntry()
 *
 * @tags Voucher
 * @name GetLmsEntry
 * @summary Get LMS Voucher Entry Grid Data (Method: getLmsEntry)
 * @request GET:/account-payable/voucher/lms/entries
 * @secure
 * @response `200` `{
    items: ({
  \** @example "ABC123" *\
    invoiceNo: string,
  \** @example "02/22/04" *\
    invoiceDate: string,
  \** @example 2443500 *\
    invoiceAmount: number,
  \** @example "02/22/04" *\
    discountDueDate: string,
  \** @example "ABSG CONSULTING" *\
    vendorName: string,
  \** @example 1001 *\
    vendorNo: number,
  \** @example 101010 *\
    salesOrderNo: number,
  \** @example 10 *\
    companyNo: number,
  \** @example "NORMAL" *\
    processType: string,

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` LMS voucher data found successfully
 */
    getLmsEntry: (query: GetLmsEntryParams, params: RequestParams = {}) =>
      this.request<
        {
          items: {
            /** @example "ABC123" */
            invoiceNo: string;
            /** @example "02/22/04" */
            invoiceDate: string;
            /** @example 2443500 */
            invoiceAmount: number;
            /** @example "02/22/04" */
            discountDueDate: string;
            /** @example "ABSG CONSULTING" */
            vendorName: string;
            /** @example 1001 */
            vendorNo: number;
            /** @example 101010 */
            salesOrderNo: number;
            /** @example 10 */
            companyNo: number;
            /** @example "NORMAL" */
            processType: string;
          }[];
          pagination: {
            /** @example 100 */
            total_items: number;
            /** @example 1 */
            current_page: number;
            /** @example 10 */
            items_per_page: number;
            /** @example 10 */
            total_pages: number;
          };
        },
        any
      >({
        path: `/account-payable/voucher/lms/entries`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.accountPayable.paperBatchCreate()
 *
 * @tags Voucher
 * @name PaperBatchCreate
 * @summary Create a batch of Paper voucher transactions (Method: paperBatchCreate)
 * @request POST:/account-payable/voucher/paper/batch
 * @secure
 * @response `default` `{
    items?: {
  \** @example "Paper batch create accepted, split into 2 batches" *\
    message?: string,
  \** @example "P-1712345678901-uuid" *\
    batchId?: string,
  \** @example 10 *\
    totalGroups?: number,
  \** @example 2 *\
    totalBatches?: number,
  \** @example "job-id-1" *\
    parentJobId?: string,
    childJobIds?: (string)[],
    groups?: (object)[],

},

}`
 */
    paperBatchCreate: (
      data: PaperBatchCreatePayload,
      params: RequestParams = {},
    ) =>
      this.request<
        any,
        {
          items?: {
            /** @example "Paper batch create accepted, split into 2 batches" */
            message?: string;
            /** @example "P-1712345678901-uuid" */
            batchId?: string;
            /** @example 10 */
            totalGroups?: number;
            /** @example 2 */
            totalBatches?: number;
            /** @example "job-id-1" */
            parentJobId?: string;
            childJobIds?: string[];
            groups?: object[];
          };
        }
      >({
        path: `/account-payable/voucher/paper/batch`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
 * @description Frontend usage: api.accountPayable.lmsBatchCreate()
 *
 * @tags Voucher
 * @name LmsBatchCreate
 * @summary Create a batch of lms voucher transactions (Method: lmsBatchCreate)
 * @request POST:/account-payable/voucher/lms/batch
 * @secure
 * @response `default` `{
    items?: {
  \** @example "Lms batch create accepted, split into 2 batches" *\
    message?: string,
  \** @example "P-1712345678901-uuid" *\
    uploadId?: string,
  \** @example 10 *\
    totalGroups?: number,
  \** @example 2 *\
    totalBatches?: number,
  \** @example "job-id-1" *\
    parentJobId?: string,
    childJobIds?: (string)[],
    groups?: (object)[],

},

}`
 */
    lmsBatchCreate: (data: LmsBatchCreatePayload, params: RequestParams = {}) =>
      this.request<
        any,
        {
          items?: {
            /** @example "Lms batch create accepted, split into 2 batches" */
            message?: string;
            /** @example "P-1712345678901-uuid" */
            uploadId?: string;
            /** @example 10 */
            totalGroups?: number;
            /** @example 2 */
            totalBatches?: number;
            /** @example "job-id-1" */
            parentJobId?: string;
            childJobIds?: string[];
            groups?: object[];
          };
        }
      >({
        path: `/account-payable/voucher/lms/batch`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
 * @description Marks a specific voucher detail as deleted by setting isDeleted to 'D' based on the provided composite key Frontend usage: api.accountPayable.softDeleteVoucherDetail()
 *
 * @tags Voucher
 * @name SoftDeleteVoucherDetail
 * @summary Soft delete a voucher detail (Method: softDeleteVoucherDetail)
 * @request POST:/account-payable/voucher/detail
 * @secure
 * @response `200` `{
  \**
   * Indicates if the operation was successful
   * @example true
   *\
    success: boolean,
  \**
   * Detailed message about the operation result
   * @example "Successfully soft deleted voucher detail - Company: 10, Vendor: 1001, Entry: 12345, Sequence: 1"
   *\
    message: string,

}` Voucher detail soft deleted successfully
 */
    softDeleteVoucherDetail: (
      data: SoftDeleteVoucherDetailDto,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Indicates if the operation was successful
           * @example true
           */
          success: boolean;
          /**
           * Detailed message about the operation result
           * @example "Successfully soft deleted voucher detail - Company: 10, Vendor: 1001, Entry: 12345, Sequence: 1"
           */
          message: string;
        },
        any
      >({
        path: `/account-payable/voucher/detail`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.accountPayable.getCalculatedDueDates()
 *
 * @tags Voucher
 * @name GetCalculatedDueDates
 * @summary Calculate due dates for a voucher (Method: getCalculatedDueDates)
 * @request GET:/account-payable/voucher/calculate-due-dates
 * @secure
 * @response `200` `{
    items: {
    companyNo?: number,
    vendorNo?: number,
    invoiceDate?: string,
    dueDate?: string,
    discountDueDate?: string,

},

}` Calculated due dates retrieved successfully
 */
    getCalculatedDueDates: (
      query: GetCalculatedDueDatesParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          items: {
            companyNo?: number;
            vendorNo?: number;
            invoiceDate?: string;
            dueDate?: string;
            discountDueDate?: string;
          };
        },
        any
      >({
        path: `/account-payable/voucher/calculate-due-dates`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  purchaseJournal = {
    /**
 * @description Frontend usage: api.purchaseJournal.purchaseJournalReports()
 *
 * @tags PurchaseJournal
 * @name PurchaseJournalReports
 * @summary Get All Purchase Journal Reports (Method: purchaseJournalReports)
 * @request GET:/purchase-journal
 * @secure
 * @response `200` `{
    items: ({
  \** @example "AccountPayable_PURCHASE REGISTER" *\
    reportType: string,
  \** @example "my-report.pdf" *\
    pdfFileName?: string,
  \** @format date-time *\
    reportDateTime: string,
  \** @example "/files/my-report.pdf" *\
    filePath: string,

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` Get Report of Purchase Journal with pagination
 */
    purchaseJournalReports: (
      query: PurchaseJournalReportsParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          items: {
            /** @example "AccountPayable_PURCHASE REGISTER" */
            reportType: string;
            /** @example "my-report.pdf" */
            pdfFileName?: string;
            /** @format date-time */
            reportDateTime: string;
            /** @example "/files/my-report.pdf" */
            filePath: string;
          }[];
          pagination: {
            /** @example 100 */
            total_items: number;
            /** @example 1 */
            current_page: number;
            /** @example 10 */
            items_per_page: number;
            /** @example 10 */
            total_pages: number;
          };
        },
        any
      >({
        path: `/purchase-journal`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new purchase journal data Frontend usage: api.purchaseJournal.submitPurchaseJournal()
     *
     * @tags PurchaseJournal
     * @name SubmitPurchaseJournal
     * @summary Insert a Purchase Journal Data (Method: submitPurchaseJournal)
     * @request POST:/purchase-journal/submit
     * @secure
     * @response `200` `void` Purchase Journal submitted successfully
     */
    submitPurchaseJournal: (
      data: SubmitPurchaseJournalPayload,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/purchase-journal/submit`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  apGlobalStates = {
    /**
 * @description Frontend usage: api.apGlobalStates.ProcessType()
 *
 * @tags ApGlobalStates
 * @name ProcessType
 * @summary Report List (Method: ProcessType)
 * @request GET:/ap-global-states/reportTypes/{type}
 * @secure
 * @response `200` `({
  \** @example 1 *\
    id?: number,
  \** @example "Inventory-Receipt-Posting" *\
    value?: string,
  \** @example "Inventory Receipt Posting" *\
    label?: string,

})[]` Get Report List of Purchase Journal
 */
    processType: (
      { type, ...query }: ProcessTypeParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example 1 */
          id?: number;
          /** @example "Inventory-Receipt-Posting" */
          value?: string;
          /** @example "Inventory Receipt Posting" */
          label?: string;
        }[],
        any
      >({
        path: `/ap-global-states/reportTypes/${type}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  openPayables = {
    /**
 * @description Frontend usage: api.openPayables.getOpenPayablesReport()
 *
 * @tags OpenPayables
 * @name GetOpenPayablesReport
 * @summary Get Open Payables Report by Type (Method: getOpenPayablesReport)
 * @request GET:/open-payables
 * @secure
 * @response `200` `{
    items: ({
  \** @example "AccountPayable_PURCHASE REGISTER" *\
    reportType?: string,
  \** @example "my-report.pdf" *\
    pdfFileName?: string,
  \** @format date-time *\
    reportDateTime: string,
  \** @example "/files/my-report.pdf" *\
    filePath: string,

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` Paginated list of Open Payable Reports
 */
    getOpenPayablesReport: (
      query: GetOpenPayablesReportParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          items: {
            /** @example "AccountPayable_PURCHASE REGISTER" */
            reportType?: string;
            /** @example "my-report.pdf" */
            pdfFileName?: string;
            /** @format date-time */
            reportDateTime: string;
            /** @example "/files/my-report.pdf" */
            filePath: string;
          }[];
          pagination: {
            /** @example 100 */
            total_items: number;
            /** @example 1 */
            current_page: number;
            /** @example 10 */
            items_per_page: number;
            /** @example 10 */
            total_pages: number;
          };
        },
        any
      >({
        path: `/open-payables`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Frontend usage: api.openPayables.openPayableGenerateReport()
     *
     * @tags OpenPayables
     * @name OpenPayableGenerateReport
     * @summary Generate Report for Openpayables (Method: openPayableGenerateReport)
     * @request POST:/open-payables
     * @secure
     * @response `200` `void` Open Payable report generated
     */
    openPayableGenerateReport: (
      data: GenerateReportDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/open-payables`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  reportsMenu = {
    /**
 * @description Frontend usage: api.reportsMenu.getReportsMenu()
 *
 * @tags ReportsMenu
 * @name GetReportsMenu
 * @summary Get Report Menu by Type (Method: getReportsMenu)
 * @request GET:/reports-menu
 * @secure
 * @response `200` `{
    items: ({
  \** @example "AP-Month-End-Vendor-Totals" *\
    reportType?: string,
  \** @example "my-report.pdf" *\
    fileName: string,
  \** @format date-time *\
    reportDateTime: string,
  \** @example "/files/my-report.pdf" *\
    filePath: string,
  \** @example "PDF" *\
    formType: string,

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` Paginated list of Reports Menu
 */
    getReportsMenu: (query: GetReportsMenuParams, params: RequestParams = {}) =>
      this.request<
        {
          items: {
            /** @example "AP-Month-End-Vendor-Totals" */
            reportType?: string;
            /** @example "my-report.pdf" */
            fileName: string;
            /** @format date-time */
            reportDateTime: string;
            /** @example "/files/my-report.pdf" */
            filePath: string;
            /** @example "PDF" */
            formType: string;
          }[];
          pagination: {
            /** @example 100 */
            total_items: number;
            /** @example 1 */
            current_page: number;
            /** @example 10 */
            items_per_page: number;
            /** @example 10 */
            total_pages: number;
          };
        },
        any
      >({
        path: `/reports-menu`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new reports menu data Frontend usage: api.reportsMenu.submitReportsMenu()
     *
     * @tags ReportsMenu
     * @name SubmitReportsMenu
     * @summary Insert Reports Menu Data (Method: submitReportsMenu)
     * @request POST:/reports-menu/submit
     * @secure
     * @response `200` `void` Reports Menu submitted successfully
     */
    submitReportsMenu: (
      data: SubmitReportsMenuPayload,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/reports-menu/submit`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  payment = {
    /**
 * @description Frontend usage: api.payment.getAllVoucherPaymentTypes()
 *
 * @tags Payment
 * @name GetAllVoucherPaymentTypes
 * @summary Get all voucher to pay types (Method: getAllVoucherPaymentTypes)
 * @request GET:/payment/types
 * @secure
 * @response `200` `{
    items: ({
  \** @example "1" *\
    id: string,
  \** @example "Check" *\
    label: string,
  \** @example "Check" *\
    value: string,

})[],

}` Success
 */
    getAllVoucherPaymentTypes: (params: RequestParams = {}) =>
      this.request<
        {
          items: {
            /** @example "1" */
            id: string;
            /** @example "Check" */
            label: string;
            /** @example "Check" */
            value: string;
          }[];
        },
        any
      >({
        path: `/payment/types`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Submit Payment Selection Type for Check, ACH, or Wire Employee Expense, or Utility vouchers and mode save or edit Frontend usage: api.payment.submitPaymentSelectionType()
 *
 * @tags Payment
 * @name SubmitPaymentSelectionType
 * @summary Submit Payment Selection Type (Method: submitPaymentSelectionType)
 * @request POST:/payment/selection/type
 * @secure
 * @response `200` `{
  \** @example "Payment type selection submitted successfully" *\
    message?: string,

}` Payment Selection Type submitted successfully
 */
    submitPaymentSelectionType: (
      data: SubmitPaymentSelectionTypePayload,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example "Payment type selection submitted successfully" */
          message?: string;
        },
        any
      >({
        path: `/payment/selection/type`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
 * @description Adds, updates, or deletes a single vendor payment line in an active payment selection type for Check, ACH, or Wire Employee Expense, or Utility vouchers. Frontend usage: api.payment.submitVendorPayment()
 *
 * @tags Payment
 * @name SubmitVendorPayment
 * @summary Submit Vendor Payment (Method: submitVendorPayment)
 * @request POST:/payment/selection/payment-vendor
 * @secure
 * @response `200` `{
  \** @example "Vendor Payment processed successfully" *\
    message?: string,

}` Vendor payment processed successfully
 */
    submitVendorPayment: (
      data: SubmitVendorPaymentPayload,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example "Vendor Payment processed successfully" */
          message?: string;
        },
        any
      >({
        path: `/payment/selection/payment-vendor`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
 * @description Fetch paginated cash requirement report metadata for the given voucher and report type. Frontend usage: api.payment.getCashRequirementReports()
 *
 * @tags Payment
 * @name GetCashRequirementReports
 * @summary Get Cash Requirement Reports (Method: getCashRequirementReports)
 * @request GET:/payment/cash-requirement/reports
 * @secure
 * @response `200` `{
    items?: ({
  \** @example "AP-Cash-Requirements" *\
    reportType?: string,
  \** @example "my-report.pdf" *\
    fileName?: string,
  \** @example "2025-07-25T10:35:44.835Z" *\
    reportDateTime?: string,
  \** @example "/files/my-report.pdf" *\
    filePath?: string,

})[],
    pagination?: {
  \** @example 34 *\
    total_items?: number,
  \** @example 1 *\
    current_page?: number,
  \** @example 10 *\
    items_per_page?: number,
  \** @example 4 *\
    total_pages?: number,

},

}` Cash requirement report metadata retrieved successfully
 */
    getCashRequirementReports: (
      query: GetCashRequirementReportsParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          items?: {
            /** @example "AP-Cash-Requirements" */
            reportType?: string;
            /** @example "my-report.pdf" */
            fileName?: string;
            /** @example "2025-07-25T10:35:44.835Z" */
            reportDateTime?: string;
            /** @example "/files/my-report.pdf" */
            filePath?: string;
          }[];
          pagination?: {
            /** @example 34 */
            total_items?: number;
            /** @example 1 */
            current_page?: number;
            /** @example 10 */
            items_per_page?: number;
            /** @example 4 */
            total_pages?: number;
          };
        },
        any
      >({
        path: `/payment/cash-requirement/reports`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Fetch paginated AP Check report metadata for the given voucher type and report type. Frontend usage: api.payment.getApCheckReports()
 *
 * @tags Payment
 * @name GetApCheckReports
 * @summary Get AP Check Reports (Method: getApCheckReports)
 * @request GET:/payment/ap-check/reports
 * @secure
 * @response `200` `{
    items?: ({
  \** @example "AP-Check-Printing" *\
    reportType?: string,
  \** @example "ap-check-report.pdf" *\
    fileName?: string,
  \** @example "2025-07-25T11:15:44.835Z" *\
    reportDateTime?: string,
  \** @example "/files/ap-check-report.pdf" *\
    filePath?: string,

})[],
    pagination?: {
  \** @example 20 *\
    total_items?: number,
  \** @example 1 *\
    current_page?: number,
  \** @example 10 *\
    items_per_page?: number,
  \** @example 2 *\
    total_pages?: number,

},

}` AP Check report metadata retrieved successfully
 */
    getApCheckReports: (
      query: GetApCheckReportsParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          items?: {
            /** @example "AP-Check-Printing" */
            reportType?: string;
            /** @example "ap-check-report.pdf" */
            fileName?: string;
            /** @example "2025-07-25T11:15:44.835Z" */
            reportDateTime?: string;
            /** @example "/files/ap-check-report.pdf" */
            filePath?: string;
          }[];
          pagination?: {
            /** @example 20 */
            total_items?: number;
            /** @example 1 */
            current_page?: number;
            /** @example 10 */
            items_per_page?: number;
            /** @example 2 */
            total_pages?: number;
          };
        },
        any
      >({
        path: `/payment/ap-check/reports`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  voucherMaintenance = {
    /**
 * @description Retrieve vouchers from APOPNH table with vendor information from APOPNV table. Supports filtering by voucher type (PAID, UNPAID, ALL) Frontend usage: api.voucherMaintenance.voucherMaintenance()
 *
 * @tags Voucher Maintenance
 * @name VoucherMaintenance
 * @summary Get vouchers with pagination and filtering (Method: voucherMaintenance)
 * @request GET:/voucher-maintenance
 * @secure
 * @response `200` `{
    items: ({
  \**
   * Vendor name from APOPNV table
   * @example "ABC Supply Company"
   *\
    vendorName: string,
  \**
   * Company number
   * @example 1
   *\
    companyNo: number,
  \**
   * Vendor number
   * @example 12345
   *\
    vendorNo: number,
  \**
   * Voucher number
   * @example 67890
   *\
    voucherNo: number,
  \**
   * Open payables amount (calculated from APOPNH)
   * @example 1500.75
   *\
    openPayables: number,
  \**
   * Last paid amount from APOPNH.OPLPAM
   * @example 500
   *\
    lastPaidAmount?: number | null,
  \**
   * Last paid date from APOPNH.OPLPD8 (YYYYMMDD format)
   * @example "20240115"
   *\
    lastPaidDate?: string | null,
  \**
   * Invoice number from APOPNH.OPINVN
   * @example "INV-2024-001"
   *\
    invoiceNumber: string,
  \**
   * Invoice date from APOPNH.OPINVD (MMDDYY format for unpaid) or APHSTH.OHINVD (MMDDYY format for paid)
   * @example "012524"
   *\
    invoiceDate: string,
  \**
   * Due date from APOPNH.OPDUE8 (YYYYMMDD format)
   * @example "20240131"
   *\
    dueDate: string,
  \**
   * Gross amount from APOPNH.OPGRAM
   * @example 1500.75
   *\
    grossAmount: number,
  \**
   * Discount amount from APOPNH.OPDISC
   * @example 50
   *\
    discountAmount: number,
  \**
   * Partial paid to date from APOPNH.OPPPTD
   * @example 0
   *\
    partialPaidToDate: number,
  \**
   * Invoice description from APOPNH.OPINDS
   * @example "Office supplies purchase"
   *\
    invoiceDescription: string,
  \**
   * Hold payment flag from APOPNH.OPHALT
   * @example "N"
   *\
    holdPaymentFlag: string,
  \**
   * Hold description from APOPNH.OPHDES (UNPAID) or APHSTH.OHHDES (PAID)
   * @example "Voucher placed on hold"
   *\
    holdDescription?: string | null,
  \**
   * Prepaid voucher flag from APOPNH.OPPAID
   * @example "N"
   *\
    prepaidFlag: string,
  \**
   * Vendor address line 1 from APOPNV.OPVAD1
   * @example "123 Main Street"
   *\
    "vendorAddress1"?: string | null,
  \**
   * Vendor address line 2 from APOPNV.OPVAD2
   * @example "Suite 100"
   *\
    "vendorAddress2"?: string | null,
  \**
   * Vendor address line 3 from APOPNV.OPVAD3
   * @example "Business District"
   *\
    "vendorAddress3"?: string | null,
  \**
   * Vendor address line 4 from APOPNV.OPVAD4
   * @example "New York, NY 10001"
   *\
    "vendorAddress4"?: string | null,
  \**
   * Cancelled voucher flag from APHSTH.OHKCNL (for PAID vouchers)
   * @example "C"
   *\
    cancelledVoucher?: string | null,
  \**
   * Voucher status (derived from payment status or cancellation status)
   * @example "UNPAID"
   *\
    voucherStatus: "UNPAID" | "PAID" | "ALL" | "CANCELLED",

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` Successfully retrieved vouchers
 */
    voucherMaintenance: (
      query: VoucherMaintenanceParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          items: {
            /**
             * Vendor name from APOPNV table
             * @example "ABC Supply Company"
             */
            vendorName: string;
            /**
             * Company number
             * @example 1
             */
            companyNo: number;
            /**
             * Vendor number
             * @example 12345
             */
            vendorNo: number;
            /**
             * Voucher number
             * @example 67890
             */
            voucherNo: number;
            /**
             * Open payables amount (calculated from APOPNH)
             * @example 1500.75
             */
            openPayables: number;
            /**
             * Last paid amount from APOPNH.OPLPAM
             * @example 500
             */
            lastPaidAmount?: number | null;
            /**
             * Last paid date from APOPNH.OPLPD8 (YYYYMMDD format)
             * @example "20240115"
             */
            lastPaidDate?: string | null;
            /**
             * Invoice number from APOPNH.OPINVN
             * @example "INV-2024-001"
             */
            invoiceNumber: string;
            /**
             * Invoice date from APOPNH.OPINVD (MMDDYY format for unpaid) or APHSTH.OHINVD (MMDDYY format for paid)
             * @example "012524"
             */
            invoiceDate: string;
            /**
             * Due date from APOPNH.OPDUE8 (YYYYMMDD format)
             * @example "20240131"
             */
            dueDate: string;
            /**
             * Gross amount from APOPNH.OPGRAM
             * @example 1500.75
             */
            grossAmount: number;
            /**
             * Discount amount from APOPNH.OPDISC
             * @example 50
             */
            discountAmount: number;
            /**
             * Partial paid to date from APOPNH.OPPPTD
             * @example 0
             */
            partialPaidToDate: number;
            /**
             * Invoice description from APOPNH.OPINDS
             * @example "Office supplies purchase"
             */
            invoiceDescription: string;
            /**
             * Hold payment flag from APOPNH.OPHALT
             * @example "N"
             */
            holdPaymentFlag: string;
            /**
             * Hold description from APOPNH.OPHDES (UNPAID) or APHSTH.OHHDES (PAID)
             * @example "Voucher placed on hold"
             */
            holdDescription?: string | null;
            /**
             * Prepaid voucher flag from APOPNH.OPPAID
             * @example "N"
             */
            prepaidFlag: string;
            /**
             * Vendor address line 1 from APOPNV.OPVAD1
             * @example "123 Main Street"
             */
            vendorAddress1?: string | null;
            /**
             * Vendor address line 2 from APOPNV.OPVAD2
             * @example "Suite 100"
             */
            vendorAddress2?: string | null;
            /**
             * Vendor address line 3 from APOPNV.OPVAD3
             * @example "Business District"
             */
            vendorAddress3?: string | null;
            /**
             * Vendor address line 4 from APOPNV.OPVAD4
             * @example "New York, NY 10001"
             */
            vendorAddress4?: string | null;
            /**
             * Cancelled voucher flag from APHSTH.OHKCNL (for PAID vouchers)
             * @example "C"
             */
            cancelledVoucher?: string | null;
            /**
             * Voucher status (derived from payment status or cancellation status)
             * @example "UNPAID"
             */
            voucherStatus: "UNPAID" | "PAID" | "ALL" | "CANCELLED";
          }[];
          pagination: {
            /** @example 100 */
            total_items: number;
            /** @example 1 */
            current_page: number;
            /** @example 10 */
            items_per_page: number;
            /** @example 10 */
            total_pages: number;
          };
        },
        any
      >({
        path: `/voucher-maintenance`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Retrieves a summary of vouchers filtered by type, company, and vendor Frontend usage: api.voucherMaintenance.getVoucherMaintenanceSummary()
 *
 * @tags Voucher Maintenance
 * @name GetVoucherMaintenanceSummary
 * @summary Get voucher summary (Method: getVoucherMaintenanceSummary)
 * @request GET:/voucher-maintenance/summary
 * @secure
 * @response `200` `{
    data?: ({
  \** @example "ABC Supply Company" *\
    vendorName?: string,
  \** @example 1 *\
    companyNo?: number,
  \** @example 12345 *\
    vendorNo?: number,
  \** @example 1000.5 *\
    lastPaidAmount?: number | null,
  \** @example "2023-01-01" *\
    lastPaidDate?: string | null,
  \** @example 500.25 *\
    openPayables?: number | null,
  \** @example "2023-12-31" *\
    openPayablesDate?: string | null,
  \** @example "UNPAID" *\
    type?: "PAID" | "UNPAID" | "ALL",

})[],

}` Successfully retrieved voucher summary
 */
    getVoucherMaintenanceSummary: (
      query: GetVoucherMaintenanceSummaryParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data?: {
            /** @example "ABC Supply Company" */
            vendorName?: string;
            /** @example 1 */
            companyNo?: number;
            /** @example 12345 */
            vendorNo?: number;
            /** @example 1000.5 */
            lastPaidAmount?: number | null;
            /** @example "2023-01-01" */
            lastPaidDate?: string | null;
            /** @example 500.25 */
            openPayables?: number | null;
            /** @example "2023-12-31" */
            openPayablesDate?: string | null;
            /** @example "UNPAID" */
            type?: "PAID" | "UNPAID" | "ALL";
          }[];
        },
        any
      >({
        path: `/voucher-maintenance/summary`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Retrieves detailed voucher information based on voucher type, company number, vendor number, and voucher number. For PAID vouchers, data comes from APHSTH/APHSTD tables. For UNPAID vouchers, data comes from APOPNH/APOPND tables. Frontend usage: api.voucherMaintenance.getVoucherMaintenanceById()
 *
 * @tags Voucher Maintenance
 * @name GetVoucherMaintenanceById
 * @summary Get voucher details by ID (Method: getVoucherMaintenanceById)
 * @request GET:/voucher-maintenance/{voucherNo}
 * @secure
 * @response `200` `{
    data: {
    headerItems: {
  \**
   * Vendor name
   * @example "ABC Supply Company"
   *\
    vendorName: string,
  \**
   * Company number
   * @example 10
   *\
    companyNo: number,
  \**
   * Vendor number
   * @example 12345
   *\
    vendorNo: number,
  \**
   * Voucher number
   * @example 67890
   *\
    voucherNo: number,
  \**
   * Invoice number
   * @example "INV-2024-001"
   *\
    invoiceNumber: string,
  \**
   * Invoice date (YYYYMMDD format)
   * @example "20240101"
   *\
    invoiceDate: string,
  \**
   * Due date (YYYYMMDD format)
   * @example "20240131"
   *\
    dueDate: string,
  \**
   * Gross amount
   * @example 1500.75
   *\
    grossAmount: number,
  \**
   * Discount amount
   * @example 50
   *\
    discountAmount: number,
  \**
   * Partial paid to date
   * @example 0
   *\
    partialPaidToDate: number,
  \**
   * Invoice description
   * @example "Office supplies purchase"
   *\
    invoiceDescription: string,
  \**
   * Voucher type
   * @example "PAID"
   *\
    voucherType: "PAID" | "UNPAID",
  \**
   * Check number (for PAID vouchers)
   * @example 123456
   *\
    checkNo?: number | null,
  \**
   * Paid date (YYYYMMDD format, for PAID vouchers)
   * @example "20240115"
   *\
    paidDate?: string | null,
  \**
   * Cancelled voucher flag from APHSTH.OHKCNL (for PAID vouchers)
   * @example "C"
   *\
    cancelledVoucher?: string | null,
  \**
   * Last paid amount
   * @example 500
   *\
    lastPaidAmount?: number | null,
  \**
   * Last paid date (YYYYMMDD format)
   * @example "20240115"
   *\
    lastPaidDate?: string | null,
  \**
   * Discount due date (YYYYMMDD format)
   * @example "20240115"
   *\
    discountDueDate?: string | null,
  \**
   * Hold payment flag
   * @example "N"
   *\
    holdPaymentFlag: string,
  \**
   * Hold description from APOPNH.OPHDES (UNPAID) or APHSTH.OHHDES (PAID)
   * @example "Voucher placed on hold"
   *\
    holdDescription?: string | null,
  \**
   * Prepaid voucher flag
   * @example "N"
   *\
    prepaidFlag: string,
  \**
   * Vendor address line 1
   * @example "123 Main Street"
   *\
    "vendorAddress1"?: string | null,
  \**
   * Vendor address line 2
   * @example "Suite 100"
   *\
    "vendorAddress2"?: string | null,
  \**
   * Vendor address line 3
   * @example "Business District"
   *\
    "vendorAddress3"?: string | null,
  \**
   * Vendor address line 4
   * @example "New York, NY 10001"
   *\
    "vendorAddress4"?: string | null,
  \**
   * Net amount (gross amount - discount amount)
   * @example 1450.75
   *\
    netAmount: number,

},
    detailItems: ({
  \** @example 1 *\
    sequenceNo?: number,
  \** @example 1 *\
    detailType?: number,
  \** @example 1 *\
    detail?: number,
  \** @example "Fuel purchase" *\
    lineDescription?: string,
  \** @example 150 *\
    grossAmount?: number,
  \** @example 0 *\
    discountAmount?: number,
  \** @example 150 *\
    netAmount?: number,
  \** @example 150 *\
    partialPaidToDate?: number,
  \** @example 5000 *\
    expenseGlAccount?: number,
  \** @example 10 *\
    expenseCompanyNo?: number,
  \** @example "20240115" *\
    lastPaidDate?: string | null,
  \** @example "PJ001" *\
    purchaseJournalNo?: string,
  \** @example "FUEL001" *\
    inventoryItemNo?: string,
  \** @example 50 *\
    quantity?: number,
  \** @example "JOB001" *\
    jobNo?: string,
  \** @example "EXTRA" *\
    jobExtraField?: string,
  \** @example "FUEL" *\
    costCode?: string,
  \** @example "DIRECT" *\
    costType?: string,
  \** @example 50 *\
    jobCostQuantity?: number,
  \** @example "PO001" *\
    purchaseOrderNo?: string,
  \** @example 12345 *\
    receiptNumber?: number,
  \** @example "OPEN" *\
    poStatus?: string,
  \** @example 1 *\
    poLineSequenceNo?: number,
  \** @example 150 *\
    productAmount?: number,
  \** @example 0 *\
    freightAmount?: number,
  \** @example "PO001" *\
    poNumber?: string,

})[],

},
  \** @example "success" *\
    status: string,
  \** @example "Successfully retrieved voucher view details" *\
    message: string,

}` Successfully retrieved voucher view details
 */
    getVoucherMaintenanceById: (
      { voucherNo, ...query }: GetVoucherMaintenanceByIdParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: {
            headerItems: {
              /**
               * Vendor name
               * @example "ABC Supply Company"
               */
              vendorName: string;
              /**
               * Company number
               * @example 10
               */
              companyNo: number;
              /**
               * Vendor number
               * @example 12345
               */
              vendorNo: number;
              /**
               * Voucher number
               * @example 67890
               */
              voucherNo: number;
              /**
               * Invoice number
               * @example "INV-2024-001"
               */
              invoiceNumber: string;
              /**
               * Invoice date (YYYYMMDD format)
               * @example "20240101"
               */
              invoiceDate: string;
              /**
               * Due date (YYYYMMDD format)
               * @example "20240131"
               */
              dueDate: string;
              /**
               * Gross amount
               * @example 1500.75
               */
              grossAmount: number;
              /**
               * Discount amount
               * @example 50
               */
              discountAmount: number;
              /**
               * Partial paid to date
               * @example 0
               */
              partialPaidToDate: number;
              /**
               * Invoice description
               * @example "Office supplies purchase"
               */
              invoiceDescription: string;
              /**
               * Voucher type
               * @example "PAID"
               */
              voucherType: "PAID" | "UNPAID";
              /**
               * Check number (for PAID vouchers)
               * @example 123456
               */
              checkNo?: number | null;
              /**
               * Paid date (YYYYMMDD format, for PAID vouchers)
               * @example "20240115"
               */
              paidDate?: string | null;
              /**
               * Cancelled voucher flag from APHSTH.OHKCNL (for PAID vouchers)
               * @example "C"
               */
              cancelledVoucher?: string | null;
              /**
               * Last paid amount
               * @example 500
               */
              lastPaidAmount?: number | null;
              /**
               * Last paid date (YYYYMMDD format)
               * @example "20240115"
               */
              lastPaidDate?: string | null;
              /**
               * Discount due date (YYYYMMDD format)
               * @example "20240115"
               */
              discountDueDate?: string | null;
              /**
               * Hold payment flag
               * @example "N"
               */
              holdPaymentFlag: string;
              /**
               * Hold description from APOPNH.OPHDES (UNPAID) or APHSTH.OHHDES (PAID)
               * @example "Voucher placed on hold"
               */
              holdDescription?: string | null;
              /**
               * Prepaid voucher flag
               * @example "N"
               */
              prepaidFlag: string;
              /**
               * Vendor address line 1
               * @example "123 Main Street"
               */
              vendorAddress1?: string | null;
              /**
               * Vendor address line 2
               * @example "Suite 100"
               */
              vendorAddress2?: string | null;
              /**
               * Vendor address line 3
               * @example "Business District"
               */
              vendorAddress3?: string | null;
              /**
               * Vendor address line 4
               * @example "New York, NY 10001"
               */
              vendorAddress4?: string | null;
              /**
               * Net amount (gross amount - discount amount)
               * @example 1450.75
               */
              netAmount: number;
            };
            detailItems: {
              /** @example 1 */
              sequenceNo?: number;
              /** @example 1 */
              detailType?: number;
              /** @example 1 */
              detail?: number;
              /** @example "Fuel purchase" */
              lineDescription?: string;
              /** @example 150 */
              grossAmount?: number;
              /** @example 0 */
              discountAmount?: number;
              /** @example 150 */
              netAmount?: number;
              /** @example 150 */
              partialPaidToDate?: number;
              /** @example 5000 */
              expenseGlAccount?: number;
              /** @example 10 */
              expenseCompanyNo?: number;
              /** @example "20240115" */
              lastPaidDate?: string | null;
              /** @example "PJ001" */
              purchaseJournalNo?: string;
              /** @example "FUEL001" */
              inventoryItemNo?: string;
              /** @example 50 */
              quantity?: number;
              /** @example "JOB001" */
              jobNo?: string;
              /** @example "EXTRA" */
              jobExtraField?: string;
              /** @example "FUEL" */
              costCode?: string;
              /** @example "DIRECT" */
              costType?: string;
              /** @example 50 */
              jobCostQuantity?: number;
              /** @example "PO001" */
              purchaseOrderNo?: string;
              /** @example 12345 */
              receiptNumber?: number;
              /** @example "OPEN" */
              poStatus?: string;
              /** @example 1 */
              poLineSequenceNo?: number;
              /** @example 150 */
              productAmount?: number;
              /** @example 0 */
              freightAmount?: number;
              /** @example "PO001" */
              poNumber?: string;
            }[];
          };
          /** @example "success" */
          status: string;
          /** @example "Successfully retrieved voucher view details" */
          message: string;
        },
        any
      >({
        path: `/voucher-maintenance/${voucherNo}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Updates the status of a voucher in APOPNH table. Updates OPHALT column with status code and OPHDES column with status description. Frontend usage: api.voucherMaintenance.updateVoucherMaintenanceStatus()
 *
 * @tags Voucher Maintenance
 * @name UpdateVoucherMaintenanceStatus
 * @summary Update voucher status (Method: updateVoucherMaintenanceStatus)
 * @request POST:/voucher-maintenance/status
 * @secure
 * @response `200` `{
    data?: {
  \**
   * Success message
   * @example "Voucher status updated successfully"
   *\
    message?: string,
    voucher?: {
  \**
   * Company number
   * @example 10
   *\
    companyNo?: number,
  \**
   * Vendor number
   * @example 12345
   *\
    vendorNo?: number,
  \**
   * Voucher number
   * @example 67890
   *\
    voucherNo?: number,
  \**
   * Updated status code
   * @example "H"
   *\
    statusCode?: " " | "H" | "A" | "W" | "E" | "U",
  \**
   * Updated status description
   * @example "Voucher placed on hold for review"
   *\
    statusDescription?: string,
  \**
   * Update timestamp
   * @example "2024-01-15T10:30:00.000Z"
   *\
    updatedAt?: string,

},

},

}` Successfully updated voucher status
 */
    updateVoucherMaintenanceStatus: (
      data: UpdateVoucherStatusDto,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data?: {
            /**
             * Success message
             * @example "Voucher status updated successfully"
             */
            message?: string;
            voucher?: {
              /**
               * Company number
               * @example 10
               */
              companyNo?: number;
              /**
               * Vendor number
               * @example 12345
               */
              vendorNo?: number;
              /**
               * Voucher number
               * @example 67890
               */
              voucherNo?: number;
              /**
               * Updated status code
               * @example "H"
               */
              statusCode?: " " | "H" | "A" | "W" | "E" | "U";
              /**
               * Updated status description
               * @example "Voucher placed on hold for review"
               */
              statusDescription?: string;
              /**
               * Update timestamp
               * @example "2024-01-15T10:30:00.000Z"
               */
              updatedAt?: string;
            };
          };
        },
        any
      >({
        path: `/voucher-maintenance/status`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
 * @description Updates the discount due date (OPDSDT) and discount amount (OPDISC) in APOPNH table for a specific voucher. Frontend usage: api.voucherMaintenance.updateVoucherDiscount()
 *
 * @tags Voucher Maintenance
 * @name UpdateVoucherDiscount
 * @summary Update voucher discount information (Method: updateVoucherDiscount)
 * @request POST:/voucher-maintenance/discount
 * @secure
 * @response `200` `{
    data?: {
  \**
   * Success message
   * @example "Discount information updated successfully"
   *\
    message?: string,
    voucher?: {
  \**
   * Company number
   * @example 10
   *\
    companyNo?: number,
  \**
   * Vendor number
   * @example 12345
   *\
    vendorNo?: number,
  \**
   * Voucher number
   * @example 67890
   *\
    voucherNo?: number,
  \**
   * Updated discount due date (MMDDYY format)
   * @example "011524"
   *\
    discountDueDate?: string,
  \**
   * Updated discount amount
   * @example 50
   *\
    discount?: number,
  \**
   * Update timestamp
   * @example "2024-01-15T10:30:00.000Z"
   *\
    updatedAt?: string,

},

},

}` Successfully updated voucher discount information
 */
    updateVoucherDiscount: (
      data: UpdateDiscountDto,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data?: {
            /**
             * Success message
             * @example "Discount information updated successfully"
             */
            message?: string;
            voucher?: {
              /**
               * Company number
               * @example 10
               */
              companyNo?: number;
              /**
               * Vendor number
               * @example 12345
               */
              vendorNo?: number;
              /**
               * Voucher number
               * @example 67890
               */
              voucherNo?: number;
              /**
               * Updated discount due date (MMDDYY format)
               * @example "011524"
               */
              discountDueDate?: string;
              /**
               * Updated discount amount
               * @example 50
               */
              discount?: number;
              /**
               * Update timestamp
               * @example "2024-01-15T10:30:00.000Z"
               */
              updatedAt?: string;
            };
          };
        },
        any
      >({
        path: `/voucher-maintenance/discount`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
 * @description Transfers a voucher from source tables (APOPNH/APOPND for UNPAID or APHSTH/APHSTD for PAID) to APTRANH/APTRAND tables. Creates new entry records in the target tables. Frontend usage: api.voucherMaintenance.transferVoucher()
 *
 * @tags Voucher Maintenance
 * @name TransferVoucher
 * @summary Transfer voucher to APTRANH/APTRAND (Method: transferVoucher)
 * @request POST:/voucher-maintenance/transfer
 * @secure
 * @response `200` `{
    data?: {
  \**
   * Success message
   * @example "Voucher transferred successfully to APTRANH/APTRAND"
   *\
    message?: string,
    voucher?: {
  \**
   * Company number
   * @example 10
   *\
    companyNo?: number,
  \**
   * Vendor number
   * @example 12345
   *\
    vendorNo?: number,
  \**
   * Voucher number
   * @example 67890
   *\
    voucherNo?: number,
  \**
   * Type of voucher transferred
   * @example "UNPAID"
   *\
    voucherType?: "PAID" | "UNPAID",
  \**
   * Source table(s) where voucher was transferred from
   * @example "APOPNH/APOPND"
   *\
    sourceTable?: string,
  \**
   * Target table(s) where voucher was transferred to
   * @example "APTRANH/APTRAND"
   *\
    targetTable?: string,
  \**
   * Transfer timestamp
   * @example "2024-01-15T10:30:00.000Z"
   *\
    transferredAt?: string,
  \**
   * New entry number created in APTRANH
   * @example 12345
   *\
    headerRecordId?: number,
  \**
   * New entry numbers created in APTRAND
   * @example [12345,12346]
   *\
    detailRecordIds?: (number)[],

},

},

}` Successfully transferred voucher to APTRANH/APTRAND
 */
    transferVoucher: (data: TransferVoucherDto, params: RequestParams = {}) =>
      this.request<
        {
          data?: {
            /**
             * Success message
             * @example "Voucher transferred successfully to APTRANH/APTRAND"
             */
            message?: string;
            voucher?: {
              /**
               * Company number
               * @example 10
               */
              companyNo?: number;
              /**
               * Vendor number
               * @example 12345
               */
              vendorNo?: number;
              /**
               * Voucher number
               * @example 67890
               */
              voucherNo?: number;
              /**
               * Type of voucher transferred
               * @example "UNPAID"
               */
              voucherType?: "PAID" | "UNPAID";
              /**
               * Source table(s) where voucher was transferred from
               * @example "APOPNH/APOPND"
               */
              sourceTable?: string;
              /**
               * Target table(s) where voucher was transferred to
               * @example "APTRANH/APTRAND"
               */
              targetTable?: string;
              /**
               * Transfer timestamp
               * @example "2024-01-15T10:30:00.000Z"
               */
              transferredAt?: string;
              /**
               * New entry number created in APTRANH
               * @example 12345
               */
              headerRecordId?: number;
              /**
               * New entry numbers created in APTRAND
               * @example [12345,12346]
               */
              detailRecordIds?: number[];
            };
          };
        },
        any
      >({
        path: `/voucher-maintenance/transfer`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  vendorManagement = {
    /**
 * @description Frontend usage: api.vendorManagement.getVendorTypes()
 *
 * @tags Vendor Management
 * @name GetVendorTypes
 * @summary Vendor Types List (Method: getVendorTypes)
 * @request GET:/vendor-management/types
 * @secure
 * @response `200` `({
  \** @example "A" *\
    id?: string,
  \** @example "ACK" *\
    value?: string,
  \** @example "ACK" *\
    label?: string,

})[]` Get list of Vendor Types
 */
    getVendorTypes: (params: RequestParams = {}) =>
      this.request<
        {
          /** @example "A" */
          id?: string;
          /** @example "ACK" */
          value?: string;
          /** @example "ACK" */
          label?: string;
        }[],
        any
      >({
        path: `/vendor-management/types`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.vendorManagement.getVendorList()
 *
 * @tags Vendor Management
 * @name GetVendorList
 * @summary Vendor List (Method: getVendorList)
 * @request GET:/vendor-management/list
 * @secure
 * @response `200` `{
    items?: ({
  \** @example "Inactive" *\
    vendorIsDeleted?: string,
  \** @example 10 *\
    vendorCompanyNumber?: number,
  \** @example 1 *\
    vendorNo?: number,
  \** @example 3681278 *\
    vendorTelephoneNo?: number,
  \** @example 0 *\
    vendorLastPaymentAmt?: number,
  \** @example 0 *\
    vendorLastPaymentDate?: number,
  \** @example "" *\
    vendorHoldPaymentsVend?: string,

})[],
    pagination?: {
  \** @example 7059 *\
    total_items?: number,
  \** @example 1 *\
    current_page?: number,
  \** @example 100 *\
    items_per_page?: number,
  \** @example 71 *\
    total_pages?: number,

},

}` Get list of Vendors with pagination info
 */
    getVendorList: (query: GetVendorListParams, params: RequestParams = {}) =>
      this.request<
        {
          items?: {
            /** @example "Inactive" */
            vendorIsDeleted?: string;
            /** @example 10 */
            vendorCompanyNumber?: number;
            /** @example 1 */
            vendorNo?: number;
            /** @example 3681278 */
            vendorTelephoneNo?: number;
            /** @example 0 */
            vendorLastPaymentAmt?: number;
            /** @example 0 */
            vendorLastPaymentDate?: number;
            /** @example "" */
            vendorHoldPaymentsVend?: string;
          }[];
          pagination?: {
            /** @example 7059 */
            total_items?: number;
            /** @example 1 */
            current_page?: number;
            /** @example 100 */
            items_per_page?: number;
            /** @example 71 */
            total_pages?: number;
          };
        },
        any
      >({
        path: `/vendor-management/list`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.vendorManagement.createOrUpdateVendor()
 *
 * @tags Vendor Management
 * @name CreateOrUpdateVendor
 * @summary Vendor Create or Update (Method: createOrUpdateVendor)
 * @request POST:/vendor-management
 * @secure
 * @response `200` `{
  \** @example "Vendor Details Updated Successfully" *\
    message?: string,

}` Create or Update Vendor
 */
    createOrUpdateVendor: (
      query: CreateOrUpdateVendorParams,
      data: VendorandVendorContactDetailsInputDto,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example "Vendor Details Updated Successfully" */
          message?: string;
        },
        any
      >({
        path: `/vendor-management`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.vendorManagement.getOwnerMappingList()
 *
 * @tags Vendor Management
 * @name GetOwnerMappingList
 * @summary Vendor Owner List (Method: getOwnerMappingList)
 * @request GET:/vendor-management/owner-mapping
 * @secure
 * @response `200` `{
    items?: ({
  \** @example 12345 *\
    ownerNo?: number,
  \** @example 2 *\
    vendorNo?: number,
  \** @example "Inactive" *\
    vendorIsDeleted?: string,
  \** @example "CUSTOMER SUPPLIED COMPONENTS" *\
    vendorName?: string,

})[],
    pagination?: {
  \** @example 7059 *\
    total_items?: number,
  \** @example 1 *\
    current_page?: number,
  \** @example 100 *\
    items_per_page?: number,
  \** @example 71 *\
    total_pages?: number,

},

}` Get list of Vendors Owner with pagination info
 */
    getOwnerMappingList: (
      query: GetOwnerMappingListParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          items?: {
            /** @example 12345 */
            ownerNo?: number;
            /** @example 2 */
            vendorNo?: number;
            /** @example "Inactive" */
            vendorIsDeleted?: string;
            /** @example "CUSTOMER SUPPLIED COMPONENTS" */
            vendorName?: string;
          }[];
          pagination?: {
            /** @example 7059 */
            total_items?: number;
            /** @example 1 */
            current_page?: number;
            /** @example 100 */
            items_per_page?: number;
            /** @example 71 */
            total_pages?: number;
          };
        },
        any
      >({
        path: `/vendor-management/owner-mapping`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.vendorManagement.getOwnerDetails()
 *
 * @tags Vendor Management
 * @name GetOwnerDetails
 * @summary Vendor Owner Details (Method: getOwnerDetails)
 * @request GET:/vendor-management/owner
 * @secure
 * @response `200` `{
  \** @example 63873 *\
    ownerNo?: number,
  \** @example 1444 *\
    vendorNo?: number,
  \** @example "I" *\
    isDeleted?: string,
  \** @example "                                                   " *\
    filler?: string,
    vendorDetails?: {
  \** @example "AIELLO BROTHERS OIL & GAS INC " *\
    vendorName?: string,

},

}` Get Vendor Owner Details
 */
    getOwnerDetails: (
      query: GetOwnerDetailsParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example 63873 */
          ownerNo?: number;
          /** @example 1444 */
          vendorNo?: number;
          /** @example "I" */
          isDeleted?: string;
          /** @example "                                                   " */
          filler?: string;
          vendorDetails?: {
            /** @example "AIELLO BROTHERS OIL & GAS INC " */
            vendorName?: string;
          };
        },
        any
      >({
        path: `/vendor-management/owner`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.vendorManagement.CreateAndUpdateOwner()
 *
 * @tags Vendor Management
 * @name CreateAndUpdateOwner
 * @summary Create Or Update Vendor Owner Details (Method: CreateAndUpdateOwner)
 * @request POST:/vendor-management/owner
 * @secure
 * @response `200` `{
  \** @example "Vendor Owner details saved successfully" *\
    message?: string,

}` Create or Update Vendor Owner Details
 */
    createAndUpdateOwner: (data: VendorOwnerDto, params: RequestParams = {}) =>
      this.request<
        {
          /** @example "Vendor Owner details saved successfully" */
          message?: string;
        },
        any
      >({
        path: `/vendor-management/owner`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.vendorManagement.getVendorDetails()
 *
 * @tags Vendor Management
 * @name GetVendorDetails
 * @summary Vendor with contact details (Method: getVendorDetails)
 * @request GET:/vendor-management/details
 * @secure
 * @response `200` `{
    items?: object,

}` Get vendor details along with contact
 */
    getVendorDetails: (
      query: GetVendorDetailsParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          items?: object;
        },
        any
      >({
        path: `/vendor-management/details`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.vendorManagement.getOwnerNoList()
 *
 * @tags Vendor Management
 * @name GetOwnerNoList
 * @summary Vendor Owner No Dropdown List (Method: getOwnerNoList)
 * @request GET:/vendor-management/owner-no/list
 * @secure
 * @response `200` `{
    items?: ({
  \** @example 1100 *\
    id?: number,
  \** @example 1100 *\
    value?: string,
  \** @example 1100 *\
    label?: string,

})[],

}` Get list of Vendors Owner with pagination info
 */
    getOwnerNoList: (query: GetOwnerNoListParams, params: RequestParams = {}) =>
      this.request<
        {
          items?: {
            /** @example 1100 */
            id?: number;
            /** @example 1100 */
            value?: string;
            /** @example 1100 */
            label?: string;
          }[];
        },
        any
      >({
        path: `/vendor-management/owner-no/list`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.vendorManagement.getNextVendorNoConfig()
 *
 * @tags Vendor Management
 * @name GetNextVendorNoConfig
 * @summary Get Next vendor number (Method: getNextVendorNoConfig)
 * @request GET:/vendor-management/config
 * @secure
 * @response `200` `{
    items?: (91000)[],

}` Get Next vendor number
 */
    getNextVendorNoConfig: (
      query: GetNextVendorNoConfigParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          items?: 91000[];
        },
        any
      >({
        path: `/vendor-management/config`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.vendorManagement.getAllVendorsList()
 *
 * @tags Vendor Management
 * @name GetAllVendorsList
 * @summary Get all vendors (Method: getAllVendorsList)
 * @request GET:/vendor-management/all-vendors
 * @secure
 * @response `200` `{
    items: ({
  \** @example "11" *\
    id: string,
  \** @example "Vendor Name" *\
    label: string,
  \** @example "Vendor Name" *\
    value: string,

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` Success
 */
    getAllVendorsList: (
      query: GetAllVendorsListParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          items: {
            /** @example "11" */
            id: string;
            /** @example "Vendor Name" */
            label: string;
            /** @example "Vendor Name" */
            value: string;
          }[];
          pagination: {
            /** @example 100 */
            total_items: number;
            /** @example 1 */
            current_page: number;
            /** @example 10 */
            items_per_page: number;
            /** @example 10 */
            total_pages: number;
          };
        },
        any
      >({
        path: `/vendor-management/all-vendors`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  apMaintenance = {
    /**
 * @description Retrieves company configuration data from APCONT table. Returns all company settings including GL accounts, next numbers, and configuration flags. Frontend usage: api.apMaintenance.companyMaintenance()
 *
 * @tags AP Maintenance
 * @name CompanyMaintenance
 * @summary Get APCONT table data by company number (Method: companyMaintenance)
 * @request GET:/ap-maintenance/company
 * @secure
 * @response `200` `{
    items: {
  \**
   * Company number from APCONT.ACCONO
   * @example 10
   *\
    companyNo: number,
  \**
   * Company name from APCONT.ACNAME
   * @example "ABC Company"
   *\
    companyName: string,
  \**
   * AP GL account number from APCONT.ACAPGL
   * @example 20000001
   *\
    companyApGlNo: number,
  \**
   * Bank GL account number from APCONT.ACBKGL
   * @example 10000001
   *\
    companyBankGlNo: number,
  \**
   * Discounts GL account number from APCONT.ACDSGL
   * @example 50000001
   *\
    companyDiscountsGlNo: number,
  \**
   * Intercompany GL account number from APCONT.ACICGL
   * @example 30000001
   *\
    companyIntercoGlNo: number,
  \**
   * Next Purchase Journal number from APCONT.ACJRNL
   * @example 1001
   *\
    companyNextPjJrnlNo: number,
  \**
   * Next Cash Disbursement Journal number from APCONT.ACCDJR
   * @example 1001
   *\
    companyNextCdJrnlNo: number,
  \**
   * Next check number from APCONT.ACCKNO
   * @example 10001
   *\
    companyNextCheckNo: number,
  \**
   * Next entry number from APCONT.ACNXTE
   * @example 10001
   *\
    companyNextEntryNo: number,
  \**
   * Next voucher number from APCONT.ACNXVO
   * @example 10001
   *\
    companyNextVoucherNo: number,
  \**
   * Pre-edit checks flag from APCONT.ACPREC
   * @example "Y"
   *\
    companyPreEdChks: string,
  \**
   * Job cost active flag from APCONT.ACJCYN
   * @example "Y"
   *\
    companyJobCostAct: string,
  \**
   * Retention GL account number from APCONT.ACRTGL
   * @example 40000001
   *\
    companyRetentionGlNo: number,
  \**
   * Purchase Order active flag from APCONT.ACPOYN
   * @example "Y"
   *\
    companyPoActive: string,
  \**
   * Employee expense GL account number from APCONT.ACEEGL
   * @example 60000001
   *\
    companyEmployeeExpenseGlNo: number,
  \**
   * Next Employee Expense Journal number from APCONT.ACEENL
   * @example 1001
   *\
    companyNextEeJrnlNo: number,
  \**
   * Filler field from APCONT.ACF001
   * @example ""
   *\
    companyFiller: string,

},

}` Successfully retrieved APCONT data
 */
    companyMaintenance: (
      query: CompanyMaintenanceParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          items: {
            /**
             * Company number from APCONT.ACCONO
             * @example 10
             */
            companyNo: number;
            /**
             * Company name from APCONT.ACNAME
             * @example "ABC Company"
             */
            companyName: string;
            /**
             * AP GL account number from APCONT.ACAPGL
             * @example 20000001
             */
            companyApGlNo: number;
            /**
             * Bank GL account number from APCONT.ACBKGL
             * @example 10000001
             */
            companyBankGlNo: number;
            /**
             * Discounts GL account number from APCONT.ACDSGL
             * @example 50000001
             */
            companyDiscountsGlNo: number;
            /**
             * Intercompany GL account number from APCONT.ACICGL
             * @example 30000001
             */
            companyIntercoGlNo: number;
            /**
             * Next Purchase Journal number from APCONT.ACJRNL
             * @example 1001
             */
            companyNextPjJrnlNo: number;
            /**
             * Next Cash Disbursement Journal number from APCONT.ACCDJR
             * @example 1001
             */
            companyNextCdJrnlNo: number;
            /**
             * Next check number from APCONT.ACCKNO
             * @example 10001
             */
            companyNextCheckNo: number;
            /**
             * Next entry number from APCONT.ACNXTE
             * @example 10001
             */
            companyNextEntryNo: number;
            /**
             * Next voucher number from APCONT.ACNXVO
             * @example 10001
             */
            companyNextVoucherNo: number;
            /**
             * Pre-edit checks flag from APCONT.ACPREC
             * @example "Y"
             */
            companyPreEdChks: string;
            /**
             * Job cost active flag from APCONT.ACJCYN
             * @example "Y"
             */
            companyJobCostAct: string;
            /**
             * Retention GL account number from APCONT.ACRTGL
             * @example 40000001
             */
            companyRetentionGlNo: number;
            /**
             * Purchase Order active flag from APCONT.ACPOYN
             * @example "Y"
             */
            companyPoActive: string;
            /**
             * Employee expense GL account number from APCONT.ACEEGL
             * @example 60000001
             */
            companyEmployeeExpenseGlNo: number;
            /**
             * Next Employee Expense Journal number from APCONT.ACEENL
             * @example 1001
             */
            companyNextEeJrnlNo: number;
            /**
             * Filler field from APCONT.ACF001
             * @example ""
             */
            companyFiller: string;
          };
        },
        any
      >({
        path: `/ap-maintenance/company`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Updates company configuration data in APCONT table. All fields are required. Frontend usage: api.apMaintenance.updateCompanyMaintenance()
 *
 * @tags AP Maintenance
 * @name UpdateCompanyMaintenance
 * @summary Update company data (Method: updateCompanyMaintenance)
 * @request POST:/ap-maintenance/company
 * @secure
 * @response `200` `{
    items: {
  \**
   * Company number from APCONT.ACCONO
   * @example 10
   *\
    companyNo: number,
  \**
   * Company name from APCONT.ACNAME
   * @example "ABC Company"
   *\
    companyName: string,
  \**
   * AP GL account number from APCONT.ACAPGL
   * @example 20000001
   *\
    companyApGlNo: number,
  \**
   * Bank GL account number from APCONT.ACBKGL
   * @example 10000001
   *\
    companyBankGlNo: number,
  \**
   * Discounts GL account number from APCONT.ACDSGL
   * @example 50000001
   *\
    companyDiscountsGlNo: number,
  \**
   * Intercompany GL account number from APCONT.ACICGL
   * @example 30000001
   *\
    companyIntercoGlNo: number,
  \**
   * Next Purchase Journal number from APCONT.ACJRNL
   * @example 1001
   *\
    companyNextPjJrnlNo: number,
  \**
   * Next Cash Disbursement Journal number from APCONT.ACCDJR
   * @example 1001
   *\
    companyNextCdJrnlNo: number,
  \**
   * Next check number from APCONT.ACCKNO
   * @example 10001
   *\
    companyNextCheckNo: number,
  \**
   * Next entry number from APCONT.ACNXTE
   * @example 10001
   *\
    companyNextEntryNo: number,
  \**
   * Next voucher number from APCONT.ACNXVO
   * @example 10001
   *\
    companyNextVoucherNo: number,
  \**
   * Pre-edit checks flag from APCONT.ACPREC
   * @example "Y"
   *\
    companyPreEdChks: string,
  \**
   * Job cost active flag from APCONT.ACJCYN
   * @example "Y"
   *\
    companyJobCostAct: string,
  \**
   * Retention GL account number from APCONT.ACRTGL
   * @example 40000001
   *\
    companyRetentionGlNo: number,
  \**
   * Purchase Order active flag from APCONT.ACPOYN
   * @example "Y"
   *\
    companyPoActive: string,
  \**
   * Employee expense GL account number from APCONT.ACEEGL
   * @example 60000001
   *\
    companyEmployeeExpenseGlNo: number,
  \**
   * Next Employee Expense Journal number from APCONT.ACEENL
   * @example 1001
   *\
    companyNextEeJrnlNo: number,
  \**
   * Filler field from APCONT.ACF001
   * @example ""
   *\
    companyFiller: string,

},

}` Successfully updated company data
 */
    updateCompanyMaintenance: (
      data: UpdateCompanyMaintenancePayload,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          items: {
            /**
             * Company number from APCONT.ACCONO
             * @example 10
             */
            companyNo: number;
            /**
             * Company name from APCONT.ACNAME
             * @example "ABC Company"
             */
            companyName: string;
            /**
             * AP GL account number from APCONT.ACAPGL
             * @example 20000001
             */
            companyApGlNo: number;
            /**
             * Bank GL account number from APCONT.ACBKGL
             * @example 10000001
             */
            companyBankGlNo: number;
            /**
             * Discounts GL account number from APCONT.ACDSGL
             * @example 50000001
             */
            companyDiscountsGlNo: number;
            /**
             * Intercompany GL account number from APCONT.ACICGL
             * @example 30000001
             */
            companyIntercoGlNo: number;
            /**
             * Next Purchase Journal number from APCONT.ACJRNL
             * @example 1001
             */
            companyNextPjJrnlNo: number;
            /**
             * Next Cash Disbursement Journal number from APCONT.ACCDJR
             * @example 1001
             */
            companyNextCdJrnlNo: number;
            /**
             * Next check number from APCONT.ACCKNO
             * @example 10001
             */
            companyNextCheckNo: number;
            /**
             * Next entry number from APCONT.ACNXTE
             * @example 10001
             */
            companyNextEntryNo: number;
            /**
             * Next voucher number from APCONT.ACNXVO
             * @example 10001
             */
            companyNextVoucherNo: number;
            /**
             * Pre-edit checks flag from APCONT.ACPREC
             * @example "Y"
             */
            companyPreEdChks: string;
            /**
             * Job cost active flag from APCONT.ACJCYN
             * @example "Y"
             */
            companyJobCostAct: string;
            /**
             * Retention GL account number from APCONT.ACRTGL
             * @example 40000001
             */
            companyRetentionGlNo: number;
            /**
             * Purchase Order active flag from APCONT.ACPOYN
             * @example "Y"
             */
            companyPoActive: string;
            /**
             * Employee expense GL account number from APCONT.ACEEGL
             * @example 60000001
             */
            companyEmployeeExpenseGlNo: number;
            /**
             * Next Employee Expense Journal number from APCONT.ACEENL
             * @example 1001
             */
            companyNextEeJrnlNo: number;
            /**
             * Filler field from APCONT.ACF001
             * @example ""
             */
            companyFiller: string;
          };
        },
        any
      >({
        path: `/ap-maintenance/company`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  clearChecks = {
    /**
     * @description Uploads a Clear Checks CSV/XLSX file, splits into batches, processes via BullMQ and returns summary. Frontend usage: api.clearChecks.uploadClearChecks()
     *
     * @tags ClearChecks
     * @name UploadClearChecks
     * @summary Upload Clear Checks CSV (Method: uploadClearChecks)
     * @request POST:/clear-checks/upload
     * @secure
     * @response `200` `void` File accepted, split into batches, processing started.
     */
    uploadClearChecks: (
      data: UploadClearChecksPayload,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/clear-checks/upload`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),

    /**
 * @description Validates a single check against the database for clearing. Checks existence, amount match, date validity, and processing status. Frontend usage: api.clearChecks.validateSingleCheck()
 *
 * @tags ClearChecks
 * @name ValidateSingleCheck
 * @summary Validate Single Check (Method: validateSingleCheck)
 * @request POST:/clear-checks/validate
 * @secure
 * @response `200` `{
    message?: string,
    data?: {
    checkNo?: string,
    checkAmount?: number,
    checkDate?: string,
    isValid?: boolean,
    errors?: ({
    field?: string,
    message?: string,
    code?: string,

})[],
    warnings?: ({
    field?: string,
    message?: string,
    code?: string,

})[],

},

}` Check validation completed successfully.
 */
    validateSingleCheck: (
      data: ValidateSingleCheckPayload,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          message?: string;
          data?: {
            checkNo?: string;
            checkAmount?: number;
            checkDate?: string;
            isValid?: boolean;
            errors?: {
              field?: string;
              message?: string;
              code?: string;
            }[];
            warnings?: {
              field?: string;
              message?: string;
              code?: string;
            }[];
          };
        },
        any
      >({
        path: `/clear-checks/validate`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
 * @description Processes multiple checks by updating their status to RECONCILED (R), AMCLDT (MMDDYY), and AMCLD8 (YYYYMMDD) fields with the provided clear dates. No validation is performed - checks are processed directly. Frontend usage: api.clearChecks.processMultipleChecks()
 *
 * @tags ClearChecks
 * @name ProcessMultipleChecks
 * @summary Process Multiple Checks (Method: processMultipleChecks)
 * @request POST:/clear-checks/process
 * @secure
 * @response `200` `{
    message?: string,
    data?: {
    message?: string,
    totalProcessed?: number,
    successful?: number,
    failed?: number,
    results?: ({
    checkNo?: string,
    checkAmount?: number,
    checkDate?: string,
    message?: string,
    errors?: ({
    field?: string,
    message?: string,
    code?: string,

})[],

})[],

},

}` Multiple checks processing completed successfully.
 */
    processMultipleChecks: (
      data: ProcessMultipleChecksPayload,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          message?: string;
          data?: {
            message?: string;
            totalProcessed?: number;
            successful?: number;
            failed?: number;
            results?: {
              checkNo?: string;
              checkAmount?: number;
              checkDate?: string;
              message?: string;
              errors?: {
                field?: string;
                message?: string;
                code?: string;
              }[];
            }[];
          };
        },
        any
      >({
        path: `/clear-checks/process`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  checkInquiry = {
    /**
 * @description Frontend usage: api.checkInquiry.getPyamentHistory()
 *
 * @tags CheckInquiry
 * @name GetPyamentHistory
 * @summary Get Payment History for check Inquiry (Method: getPyamentHistory)
 * @request GET:/check-inquiry/payment-history
 * @secure
 * @response `200` `{
  \** @example 10 *\
    companyNo?: number,
  \** @example 1100 *\
    vendorNo?: number,
  \** @example 0 *\
    checkNo?: number,
  \** @example "00684027            " *\
    invoiceNo?: string,
  \** @example "(PJ12)AFE 350 GRINDER    " *\
    invoiceDescription?: string,
  \**
   * @format float
   * @example 0
   *\
    paidAmount?: number,
  \**
   * @format float
   * @example 102.69
   *\
    grossAmount?: number,
  \**
   * @format float
   * @example 0
   *\
    discount?: number,
  \** @example 11000001 *\
    bankGLNo?: number,
  \** @example 11000001 *\
    voucherNo?: number,
  \** @example 11000001 *\
    invoiceDate?: number,
  \** @example 11000001 *\
    dueDate?: number,
  \** @example 20116 *\
    lastPaidDate?: number,
    bankGLNumber?: {
  \** @example "ABBOTT GAS PRODUCTS           " *\
    vendorName?: string,
  \** @example 20116 *\
    checkDate?: number,

},

}` Paginated list of Check Inquiry Payment History
 */
    getPyamentHistory: (
      query: GetPyamentHistoryParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example 10 */
          companyNo?: number;
          /** @example 1100 */
          vendorNo?: number;
          /** @example 0 */
          checkNo?: number;
          /** @example "00684027            " */
          invoiceNo?: string;
          /** @example "(PJ12)AFE 350 GRINDER    " */
          invoiceDescription?: string;
          /**
           * @format float
           * @example 0
           */
          paidAmount?: number;
          /**
           * @format float
           * @example 102.69
           */
          grossAmount?: number;
          /**
           * @format float
           * @example 0
           */
          discount?: number;
          /** @example 11000001 */
          bankGLNo?: number;
          /** @example 11000001 */
          voucherNo?: number;
          /** @example 11000001 */
          invoiceDate?: number;
          /** @example 11000001 */
          dueDate?: number;
          /** @example 20116 */
          lastPaidDate?: number;
          bankGLNumber?: {
            /** @example "ABBOTT GAS PRODUCTS           " */
            vendorName?: string;
            /** @example 20116 */
            checkDate?: number;
          };
        },
        any
      >({
        path: `/check-inquiry/payment-history`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.checkInquiry.getLastPaymentInfo()
 *
 * @tags CheckInquiry
 * @name GetLastPaymentInfo
 * @summary Get last Payment Information (Method: getLastPaymentInfo)
 * @request GET:/check-inquiry/last-payment-info
 * @secure
 * @response `200` `{
  \** @example 10 *\
    companyNo?: number,
  \** @example 1100 *\
    vendorNo?: number,
  \**
   * @format float
   * @example 102.69
   *\
    grossAmount?: number,
  \** @example 0 *\
    openPayables?: number,
  \** @example "ACT ASSOCIATES " *\
    vendorName?: string,

}` Paginated list of Check Inquiry Payment History
 */
    getLastPaymentInfo: (
      query: GetLastPaymentInfoParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example 10 */
          companyNo?: number;
          /** @example 1100 */
          vendorNo?: number;
          /**
           * @format float
           * @example 102.69
           */
          grossAmount?: number;
          /** @example 0 */
          openPayables?: number;
          /** @example "ACT ASSOCIATES " */
          vendorName?: string;
        },
        any
      >({
        path: `/check-inquiry/last-payment-info`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.checkInquiry.getVoucherDetails()
 *
 * @tags CheckInquiry
 * @name GetVoucherDetails
 * @summary Get Voucher Details (Method: getVoucherDetails)
 * @request GET:/check-inquiry/voucher-detail
 * @secure
 * @response `200` `{
    vendorDetail?: any,
    headerItems?: any,
    detailItems?: any,

}` Get Voucher Details
 */
    getVoucherDetails: (
      query: GetVoucherDetailsParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          vendorDetail?: any;
          headerItems?: any;
          detailItems?: any;
        },
        any
      >({
        path: `/check-inquiry/voucher-detail`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  apPeriodEnd = {
    /**
 * @description Retrieves paginated vendor data for a specific company and year using the vendor master list functionality. Frontend usage: api.apPeriodEnd.getVendorsByYear()
 *
 * @tags APPeriodEnd
 * @name GetVendorsByYear
 * @summary Get vendors by year for a company (Method: getVendorsByYear)
 * @request GET:/ap-period-end/vendors
 * @secure
 * @response `200` `{
  \** Array of vendor objects *\
    items: ({
  \**
   * Vendor deletion status
   * @example "N"
   *\
    vendorIsDeleted?: string,
  \**
   * Company number
   * @example 10
   *\
    vendorCompanyNumber?: number,
  \**
   * Vendor number
   * @example 1001
   *\
    vendorNo?: number,
  \**
   * Vendor name
   * @example "ABC Suppliers"
   *\
    vendorName?: string,
  \**
   * Vendor address line 1
   * @example "123 Main Street"
   *\
    "vendorAdd1"?: string,
  \**
   * Vendor address line 2
   * @example "Suite 100"
   *\
    "vendorAdd2"?: string,
  \**
   * Vendor address line 3
   * @example ""
   *\
    "vendorAdd3"?: string,
  \**
   * Vendor address line 4
   * @example ""
   *\
    "vendorAdd4"?: string,
  \**
   * Vendor zip code
   * @example 12345
   *\
    vendorZipCode?: number,
  \**
   * Vendor extra zip code
   * @example 6789
   *\
    vendorExtraZip?: number,
  \**
   * Vendor alpha sort abbreviation
   * @example "ABC"
   *\
    vendorAlphaSortAbbr?: string,
  \**
   * Vendor area code
   * @example 555
   *\
    vendorAreaCode?: number,
  \**
   * Vendor telephone number
   * @example 1234567
   *\
    vendorTelephoneNo?: number,
  \**
   * Last payment amount
   * @example 5000
   *\
    vendorLastPaymentAmt?: number,
  \**
   * Last payment date
   * @example 20241215
   *\
    vendorLastPaymentDate?: number,
  \**
   * Year to date purchases
   * @example 50000
   *\
    vendorYtdPurchases?: number,
  \**
   * Last year purchases
   * @example 45000
   *\
    vendorLastYearPurchases?: number,
  \**
   * Month to date discounts
   * @example 500
   *\
    vendorMtdDiscounts?: number,
  \**
   * Year to date discounts
   * @example 2500
   *\
    vendorYtdDiscounts?: number,
  \**
   * Vendor name overflow
   * @example ""
   *\
    vendorNameOverflow?: string,
  \**
   * GAL receipts required flag
   * @example "N"
   *\
    vendorGalRcptsRequired?: string,
  \**
   * Vendor filler field
   * @example ""
   *\
    vendorFiller?: string,
  \**
   * Previous balance
   * @example 10000
   *\
    vendorPreviousBalance?: number,
  \**
   * Month to date purchases
   * @example 5000
   *\
    vendorMtdPurchases?: number,
  \**
   * Month to date payments
   * @example 3000
   *\
    vendorMtdPayments?: number,
  \**
   * Current balance
   * @example 12000
   *\
    vendorCurrentBalance?: number,
  \**
   * Hold payments vendor flag
   * @example "N"
   *\
    vendorHoldPaymentsVend?: string,
  \**
   * Single check flag
   * @example "N"
   *\
    vendorSingleCheck?: string,
  \**
   * This year year to date paid
   * @example 35000
   *\
    vendorThisYrYtdPaid?: number,
  \**
   * Last year year to date paid
   * @example 32000
   *\
    vendorLastYrYtdPaid?: number,
  \**
   * Expense GL sub account
   * @example 5000
   *\
    vendorExpenseGLSub?: number,
  \**
   * AP terms code
   * @example 30
   *\
    vendorApTermsCode?: number,
  \**
   * AP 1099 code
   * @example "N"
   *\
    "vendorAp1099Code"?: string,
  \**
   * Vendor ID number
   * @example "12-3456789"
   *\
    vendorIdNumber?: string,
  \**
   * First 1099 box number
   * @example 0
   *\
    "vendorFirst1099BoxNumber"?: number,
  \**
   * Second 1099 box number
   * @example 0
   *\
    "vendorSecond1099BoxNumber"?: number,
  \**
   * Second 1099 box amount
   * @example 0
   *\
    "vendorSecond1099BoxAmount"?: number,
  \**
   * Last payment date alternative
   * @example 20241215
   *\
    vendorLastPaymentDateAlt?: number,
  \**
   * Carrier ID
   * @example ""
   *\
    vendorCarrierId?: string,
  \**
   * Payee name 1
   * @example "ABC Suppliers"
   *\
    "vendorPayeeName1"?: string,
  \**
   * Payee name 2
   * @example ""
   *\
    "vendorPayeeName2"?: string,
  \**
   * IRS name control
   * @example ""
   *\
    vendorIrsNameControl?: string,
  \**
   * ADP payroll ID
   * @example 0
   *\
    vendorAdpPayrollId?: number,
  \**
   * ACH class
   * @example ""
   *\
    vendorAchClass?: string,
  \**
   * ACH checking or savings
   * @example ""
   *\
    vendorAchCheckingOrSavings?: string,
  \**
   * ACH bank routing code
   * @example 0
   *\
    vendorAchBankRoutingCode?: number,
  \**
   * ACH bank account number
   * @example ""
   *\
    vendorAchBankAccountNumber?: string,
  \**
   * Vendor first name
   * @example ""
   *\
    vendorFirstName?: string,
  \**
   * Vendor middle name
   * @example ""
   *\
    vendorMiddleName?: string,
  \**
   * Vendor business last name
   * @example ""
   *\
    vendorBusinessLastName?: string,
  \**
   * Vendor name suffix
   * @example ""
   *\
    vendorNameSuffix?: string,
  \**
   * Vendor country code
   * @example "US"
   *\
    vendorCountryCode?: string,
  \**
   * Vendor category code
   * @example ""
   *\
    vendorCategoryCode?: string,
  \**
   * Vendor filler 2
   * @example ""
   *\
    "vendorFiller2"?: string,

})[],
  \**
   * Total number of vendors
   * @example 150
   *\
    count: number,
  \**
   * Current page number
   * @example 1
   *\
    page: number,
  \**
   * Number of items per page
   * @example 50
   *\
    limit: number,
  \**
   * Total number of pages
   * @example 3
   *\
    totalPages: number,
  \**
   * Whether there is a next page
   * @example true
   *\
    hasNextPage: boolean,
  \**
   * Whether there is a previous page
   * @example false
   *\
    hasPrevPage: boolean,

}` Successfully retrieved vendor data
 */
    getVendorsByYear: (
      query: GetVendorsByYearParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** Array of vendor objects */
          items: {
            /**
             * Vendor deletion status
             * @example "N"
             */
            vendorIsDeleted?: string;
            /**
             * Company number
             * @example 10
             */
            vendorCompanyNumber?: number;
            /**
             * Vendor number
             * @example 1001
             */
            vendorNo?: number;
            /**
             * Vendor name
             * @example "ABC Suppliers"
             */
            vendorName?: string;
            /**
             * Vendor address line 1
             * @example "123 Main Street"
             */
            vendorAdd1?: string;
            /**
             * Vendor address line 2
             * @example "Suite 100"
             */
            vendorAdd2?: string;
            /**
             * Vendor address line 3
             * @example ""
             */
            vendorAdd3?: string;
            /**
             * Vendor address line 4
             * @example ""
             */
            vendorAdd4?: string;
            /**
             * Vendor zip code
             * @example 12345
             */
            vendorZipCode?: number;
            /**
             * Vendor extra zip code
             * @example 6789
             */
            vendorExtraZip?: number;
            /**
             * Vendor alpha sort abbreviation
             * @example "ABC"
             */
            vendorAlphaSortAbbr?: string;
            /**
             * Vendor area code
             * @example 555
             */
            vendorAreaCode?: number;
            /**
             * Vendor telephone number
             * @example 1234567
             */
            vendorTelephoneNo?: number;
            /**
             * Last payment amount
             * @example 5000
             */
            vendorLastPaymentAmt?: number;
            /**
             * Last payment date
             * @example 20241215
             */
            vendorLastPaymentDate?: number;
            /**
             * Year to date purchases
             * @example 50000
             */
            vendorYtdPurchases?: number;
            /**
             * Last year purchases
             * @example 45000
             */
            vendorLastYearPurchases?: number;
            /**
             * Month to date discounts
             * @example 500
             */
            vendorMtdDiscounts?: number;
            /**
             * Year to date discounts
             * @example 2500
             */
            vendorYtdDiscounts?: number;
            /**
             * Vendor name overflow
             * @example ""
             */
            vendorNameOverflow?: string;
            /**
             * GAL receipts required flag
             * @example "N"
             */
            vendorGalRcptsRequired?: string;
            /**
             * Vendor filler field
             * @example ""
             */
            vendorFiller?: string;
            /**
             * Previous balance
             * @example 10000
             */
            vendorPreviousBalance?: number;
            /**
             * Month to date purchases
             * @example 5000
             */
            vendorMtdPurchases?: number;
            /**
             * Month to date payments
             * @example 3000
             */
            vendorMtdPayments?: number;
            /**
             * Current balance
             * @example 12000
             */
            vendorCurrentBalance?: number;
            /**
             * Hold payments vendor flag
             * @example "N"
             */
            vendorHoldPaymentsVend?: string;
            /**
             * Single check flag
             * @example "N"
             */
            vendorSingleCheck?: string;
            /**
             * This year year to date paid
             * @example 35000
             */
            vendorThisYrYtdPaid?: number;
            /**
             * Last year year to date paid
             * @example 32000
             */
            vendorLastYrYtdPaid?: number;
            /**
             * Expense GL sub account
             * @example 5000
             */
            vendorExpenseGLSub?: number;
            /**
             * AP terms code
             * @example 30
             */
            vendorApTermsCode?: number;
            /**
             * AP 1099 code
             * @example "N"
             */
            vendorAp1099Code?: string;
            /**
             * Vendor ID number
             * @example "12-3456789"
             */
            vendorIdNumber?: string;
            /**
             * First 1099 box number
             * @example 0
             */
            vendorFirst1099BoxNumber?: number;
            /**
             * Second 1099 box number
             * @example 0
             */
            vendorSecond1099BoxNumber?: number;
            /**
             * Second 1099 box amount
             * @example 0
             */
            vendorSecond1099BoxAmount?: number;
            /**
             * Last payment date alternative
             * @example 20241215
             */
            vendorLastPaymentDateAlt?: number;
            /**
             * Carrier ID
             * @example ""
             */
            vendorCarrierId?: string;
            /**
             * Payee name 1
             * @example "ABC Suppliers"
             */
            vendorPayeeName1?: string;
            /**
             * Payee name 2
             * @example ""
             */
            vendorPayeeName2?: string;
            /**
             * IRS name control
             * @example ""
             */
            vendorIrsNameControl?: string;
            /**
             * ADP payroll ID
             * @example 0
             */
            vendorAdpPayrollId?: number;
            /**
             * ACH class
             * @example ""
             */
            vendorAchClass?: string;
            /**
             * ACH checking or savings
             * @example ""
             */
            vendorAchCheckingOrSavings?: string;
            /**
             * ACH bank routing code
             * @example 0
             */
            vendorAchBankRoutingCode?: number;
            /**
             * ACH bank account number
             * @example ""
             */
            vendorAchBankAccountNumber?: string;
            /**
             * Vendor first name
             * @example ""
             */
            vendorFirstName?: string;
            /**
             * Vendor middle name
             * @example ""
             */
            vendorMiddleName?: string;
            /**
             * Vendor business last name
             * @example ""
             */
            vendorBusinessLastName?: string;
            /**
             * Vendor name suffix
             * @example ""
             */
            vendorNameSuffix?: string;
            /**
             * Vendor country code
             * @example "US"
             */
            vendorCountryCode?: string;
            /**
             * Vendor category code
             * @example ""
             */
            vendorCategoryCode?: string;
            /**
             * Vendor filler 2
             * @example ""
             */
            vendorFiller2?: string;
          }[];
          /**
           * Total number of vendors
           * @example 150
           */
          count: number;
          /**
           * Current page number
           * @example 1
           */
          page: number;
          /**
           * Number of items per page
           * @example 50
           */
          limit: number;
          /**
           * Total number of pages
           * @example 3
           */
          totalPages: number;
          /**
           * Whether there is a next page
           * @example true
           */
          hasNextPage: boolean;
          /**
           * Whether there is a previous page
           * @example false
           */
          hasPrevPage: boolean;
        },
        any
      >({
        path: `/ap-period-end/vendors`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Retrieves detailed company information from the company table by company number. Returns all company settings including GL accounts, next numbers, and configuration flags. Frontend usage: api.apPeriodEnd.getCompanyDetails()
 *
 * @tags APPeriodEnd
 * @name GetCompanyDetails
 * @summary Get company details by company number (Method: getCompanyDetails)
 * @request GET:/ap-period-end/company
 * @secure
 * @response `200` `{
    items?: {
  \**
   * Company number
   * @example 10
   *\
    companyNo?: number,
  \**
   * Company name
   * @example "ABC Company"
   *\
    companyName?: string,
  \**
   * Company AP GL Number
   * @example 20000001
   *\
    companyApGlNo?: number,
  \**
   * Company Bank GL Number
   * @example 10000001
   *\
    companyBankGlNo?: number,
  \**
   * Company Discounts GL Number
   * @example 50000001
   *\
    companyDiscountsGlNo?: number,
  \**
   * Company Interco GL Number
   * @example 30000001
   *\
    companyIntercoGlNo?: number,
  \**
   * Company Next PJ Journal Number
   * @example 1001
   *\
    companyNextPjJrnlNo?: number,
  \**
   * Company Next CD Journal Number
   * @example 1001
   *\
    companyNextCdJrnlNo?: number,
  \**
   * Company Next Check Number
   * @example 10001
   *\
    companyNextCheckNo?: number,
  \**
   * Company Next Entry Number
   * @example 10001
   *\
    companyNextEntryNo?: number,
  \**
   * Company Next Voucher Number
   * @example 10001
   *\
    companyNextVoucherNo?: number,
  \**
   * Company Pre-edit Checks Flag
   * @example "Y"
   *\
    companyPreEdChks?: string,
  \**
   * Company Job Cost Active Flag
   * @example "Y"
   *\
    companyJobCostAct?: string,
  \**
   * Company Retention GL Number
   * @example 40000001
   *\
    companyRetentionGlNo?: number,
  \**
   * Company PO Active Flag
   * @example "Y"
   *\
    companyPoActive?: string,
  \**
   * Company Employee Expense GL Number
   * @example 60000001
   *\
    companyEmployeeExpenseGlNo?: number,
  \**
   * Company Next EE Journal Number
   * @example 1001
   *\
    companyNextEeJrnlNo?: number,
  \**
   * Company Filler Field
   * @example ""
   *\
    companyFiller?: string,
  \**
   * Company Vendor Next Entry Number
   * @example 10001
   *\
    companyVendorNextEntryNo?: number,

},

}` Successfully retrieved company details
 */
    getCompanyDetails: (
      query: GetCompanyDetailsParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          items?: {
            /**
             * Company number
             * @example 10
             */
            companyNo?: number;
            /**
             * Company name
             * @example "ABC Company"
             */
            companyName?: string;
            /**
             * Company AP GL Number
             * @example 20000001
             */
            companyApGlNo?: number;
            /**
             * Company Bank GL Number
             * @example 10000001
             */
            companyBankGlNo?: number;
            /**
             * Company Discounts GL Number
             * @example 50000001
             */
            companyDiscountsGlNo?: number;
            /**
             * Company Interco GL Number
             * @example 30000001
             */
            companyIntercoGlNo?: number;
            /**
             * Company Next PJ Journal Number
             * @example 1001
             */
            companyNextPjJrnlNo?: number;
            /**
             * Company Next CD Journal Number
             * @example 1001
             */
            companyNextCdJrnlNo?: number;
            /**
             * Company Next Check Number
             * @example 10001
             */
            companyNextCheckNo?: number;
            /**
             * Company Next Entry Number
             * @example 10001
             */
            companyNextEntryNo?: number;
            /**
             * Company Next Voucher Number
             * @example 10001
             */
            companyNextVoucherNo?: number;
            /**
             * Company Pre-edit Checks Flag
             * @example "Y"
             */
            companyPreEdChks?: string;
            /**
             * Company Job Cost Active Flag
             * @example "Y"
             */
            companyJobCostAct?: string;
            /**
             * Company Retention GL Number
             * @example 40000001
             */
            companyRetentionGlNo?: number;
            /**
             * Company PO Active Flag
             * @example "Y"
             */
            companyPoActive?: string;
            /**
             * Company Employee Expense GL Number
             * @example 60000001
             */
            companyEmployeeExpenseGlNo?: number;
            /**
             * Company Next EE Journal Number
             * @example 1001
             */
            companyNextEeJrnlNo?: number;
            /**
             * Company Filler Field
             * @example ""
             */
            companyFiller?: string;
            /**
             * Company Vendor Next Entry Number
             * @example 10001
             */
            companyVendorNextEntryNo?: number;
          };
        },
        any
      >({
        path: `/ap-period-end/company`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Creates and populates vendor year-end table for a specific company and year. This process handles the vendor month/year end functionality by creating a new table with the year suffix and copying all vendor data from the source table. Frontend usage: api.apPeriodEnd.vendorYearEndProcess()
 *
 * @tags APPeriodEnd
 * @name VendorYearEndProcess
 * @summary Process vendor year-end for a company (Method: vendorYearEndProcess)
 * @request POST:/ap-period-end/vendor-year-end-process
 * @secure
 * @response `200` `{
    items: {
  \**
   * Message describing the result of the year-end process
   * @example "Vendor year-end process completed successfully for company 10, year 2024"
   *\
    message?: string,
  \**
   * Name of the table created or processed
   * @example "DATADEV.VENDOR_2024"
   *\
    tableName?: string | null,
  \**
   * Number of data rows copied
   * @example 100
   *\
    dataCopied?: number | null,

},

}` Successfully processed vendor year-end
 */
    vendorYearEndProcess: (
      data: VendorYearEndProcessDto,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          items: {
            /**
             * Message describing the result of the year-end process
             * @example "Vendor year-end process completed successfully for company 10, year 2024"
             */
            message?: string;
            /**
             * Name of the table created or processed
             * @example "DATADEV.VENDOR_2024"
             */
            tableName?: string | null;
            /**
             * Number of data rows copied
             * @example 100
             */
            dataCopied?: number | null;
          };
        },
        any
      >({
        path: `/ap-period-end/vendor-year-end-process`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
 * @description Get data for particular record format Frontend usage: api.apPeriodEnd.getApPeriodEndReports()
 *
 * @tags APPeriodEnd
 * @name GetApPeriodEndReports
 * @summary Get AP Period End Reports (Method: getApPeriodEndReports)
 * @request GET:/ap-period-end/record
 * @secure
 * @response `200` `{
    items: {
  \**
   * Record Type
   * @example "T"
   *\
    recordType?: string,
  \**
   * Payment Year
   * @example 2027
   *\
    paymentYear?: number,
  \**
   * Prior Year Data Indicator
   * @example "A"
   *\
    priorYearDataInd?: string,
  \**
   * Transmitter ID
   * @example 996793061
   *\
    transmitterId?: number,
  \**
   * Trans Control Code
   * @example "ABHI"
   *\
    transControlCode?: string,
  \**
   * Replacement Alpha Character
   * @example "AB"
   *\
    replacementAlphaChar?: string,
  \**
   * Blank
   * @example "ABHIS"
   *\
    "blank01"?: string,
  \**
   * Test File Indicator
   * @example ""
   *\
    testFileInd?: string,
  \**
   * Foreign Entity Indicator
   * @example ""
   *\
    foreignEntityInd?: string,
  \**
   * Transmitter Name
   * @example "AMERICAN REFINING GROUP INC"
   *\
    transmitterName?: string,
  \**
   * Transmitter Name 2
   * @example ""
   *\
    "transmitterName2"?: string,
  \**
   * Company Name
   * @example "AMERICAN REFINING GROUP INC"
   *\
    companyName?: string,
  \**
   * Company Name 2
   * @example ""
   *\
    "companyName2"?: string,
  \**
   * Company Address
   * @example "55 ALPHA DRIVE WEST"
   *\
    companyAddress?: string,
  \**
   * Company City
   * @example "PITTSBURGH"
   *\
    companyCity?: string,
  \**
   * Company State
   * @example "PA"
   *\
    companyState?: string,
  \**
   * Company Zip Code
   * @example "15238"
   *\
    companyZipCode?: string,
  \**
   * Blank
   * @example ""
   *\
    "blank02"?: string,
  \**
   * Total Number of Payees
   * @example 8
   *\
    totalNumberOfPayees?: number,
  \**
   * Contact Name
   * @example "ERIC HOLMBERG"
   *\
    contactName?: string,
  \**
   * Contact Phone Number
   * @example "8143681274"
   *\
    contactPhoneNumber?: string,
  \**
   * Contact Email
   * @example ""
   *\
    contactEmail?: string,
  \**
   * Blank
   * @example ""
   *\
    "blank03"?: string,
  \**
   * Sequence Number
   * @example 1
   *\
    sequenceNumber?: number,
  \**
   * Blank
   * @example ""
   *\
    "blank04"?: string,
  \**
   * Vendor Indicator
   * @example "I"
   *\
    vendorInd?: string,
  \**
   * Blank
   * @example ""
   *\
    "blank05"?: string,
  \**
   * Blank
   * @example ""
   *\
    "blank06"?: string,

},

}` Successfully retrieved vendor data
 */
    getApPeriodEndReports: (
      query: GetApPeriodEndReportsParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          items: {
            /**
             * Record Type
             * @example "T"
             */
            recordType?: string;
            /**
             * Payment Year
             * @example 2027
             */
            paymentYear?: number;
            /**
             * Prior Year Data Indicator
             * @example "A"
             */
            priorYearDataInd?: string;
            /**
             * Transmitter ID
             * @example 996793061
             */
            transmitterId?: number;
            /**
             * Trans Control Code
             * @example "ABHI"
             */
            transControlCode?: string;
            /**
             * Replacement Alpha Character
             * @example "AB"
             */
            replacementAlphaChar?: string;
            /**
             * Blank
             * @example "ABHIS"
             */
            blank01?: string;
            /**
             * Test File Indicator
             * @example ""
             */
            testFileInd?: string;
            /**
             * Foreign Entity Indicator
             * @example ""
             */
            foreignEntityInd?: string;
            /**
             * Transmitter Name
             * @example "AMERICAN REFINING GROUP INC"
             */
            transmitterName?: string;
            /**
             * Transmitter Name 2
             * @example ""
             */
            transmitterName2?: string;
            /**
             * Company Name
             * @example "AMERICAN REFINING GROUP INC"
             */
            companyName?: string;
            /**
             * Company Name 2
             * @example ""
             */
            companyName2?: string;
            /**
             * Company Address
             * @example "55 ALPHA DRIVE WEST"
             */
            companyAddress?: string;
            /**
             * Company City
             * @example "PITTSBURGH"
             */
            companyCity?: string;
            /**
             * Company State
             * @example "PA"
             */
            companyState?: string;
            /**
             * Company Zip Code
             * @example "15238"
             */
            companyZipCode?: string;
            /**
             * Blank
             * @example ""
             */
            blank02?: string;
            /**
             * Total Number of Payees
             * @example 8
             */
            totalNumberOfPayees?: number;
            /**
             * Contact Name
             * @example "ERIC HOLMBERG"
             */
            contactName?: string;
            /**
             * Contact Phone Number
             * @example "8143681274"
             */
            contactPhoneNumber?: string;
            /**
             * Contact Email
             * @example ""
             */
            contactEmail?: string;
            /**
             * Blank
             * @example ""
             */
            blank03?: string;
            /**
             * Sequence Number
             * @example 1
             */
            sequenceNumber?: number;
            /**
             * Blank
             * @example ""
             */
            blank04?: string;
            /**
             * Vendor Indicator
             * @example "I"
             */
            vendorInd?: string;
            /**
             * Blank
             * @example ""
             */
            blank05?: string;
            /**
             * Blank
             * @example ""
             */
            blank06?: string;
          };
        },
        any
      >({
        path: `/ap-period-end/record`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Delete RecordB  Frontend usage: api.apPeriodEnd.softDeleteRecord()
 *
 * @tags APPeriodEnd
 * @name SoftDeleteRecord
 * @summary Soft Delete AP Period End Record (Method: softDeleteRecord)
 * @request DELETE:/ap-period-end/record
 * @secure
 * @response `200` `{
    items: {
  \**
   * deleted successfully
   * @example "T"
   *\
    message?: string,

},

}` Successfully Deleted RecordB
 */
    softDeleteRecord: (
      query: SoftDeleteRecordParams,
      data: ApPeriodEndDto,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          items: {
            /**
             * deleted successfully
             * @example "T"
             */
            message?: string;
          };
        },
        any
      >({
        path: `/ap-period-end/record`,
        method: "DELETE",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
 * @description Get data for particular record format Frontend usage: api.apPeriodEnd.getAllApPeriodEndReports()
 *
 * @tags APPeriodEnd
 * @name GetAllApPeriodEndReports
 * @summary Get All AP Period End Reports (Method: getAllApPeriodEndReports)
 * @request GET:/ap-period-end
 * @secure
 * @response `200` `{
    items: {
  \**
   * Record Type
   * @example "T"
   *\
    recordType?: string,
  \**
   * ctl
   * @example "MOYE"
   *\
    ctl?: string,
  \**
   * tin
   * @example "173892"
   *\
    tin?: string,
  \**
   * firstPayeeName
   * @example "John"
   *\
    firstPayeeName?: string,

},
    pagination?: {
  \** @example 20 *\
    total_items?: number,
  \** @example 1 *\
    current_page?: number,
  \** @example 10 *\
    items_per_page?: number,
  \** @example 2 *\
    total_pages?: number,

},

}` Successfully retrieved vendor data
 */
    getAllApPeriodEndReports: (
      query: GetAllApPeriodEndReportsParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          items: {
            /**
             * Record Type
             * @example "T"
             */
            recordType?: string;
            /**
             * ctl
             * @example "MOYE"
             */
            ctl?: string;
            /**
             * tin
             * @example "173892"
             */
            tin?: string;
            /**
             * firstPayeeName
             * @example "John"
             */
            firstPayeeName?: string;
          };
          pagination?: {
            /** @example 20 */
            total_items?: number;
            /** @example 1 */
            current_page?: number;
            /** @example 10 */
            items_per_page?: number;
            /** @example 2 */
            total_pages?: number;
          };
        },
        any
      >({
        path: `/ap-period-end`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Updatw the Flat files based on Record TYpe Frontend usage: api.apPeriodEnd.postApPeriodEndReports()
 *
 * @tags APPeriodEnd
 * @name PostApPeriodEndReports
 * @summary Get 1099 Reports (Method: postApPeriodEndReports)
 * @request POST:/ap-period-end
 * @secure
 * @response `200` `{
    items: {
  \**
   * Updated Successfully
   * @example "T"
   *\
    message?: string,

},

}` Successfully retrieved vendor data
 */
    postApPeriodEndReports: (
      data: ApPeriodEndBodyDto,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          items: {
            /**
             * Updated Successfully
             * @example "T"
             */
            message?: string;
          };
        },
        any
      >({
        path: `/ap-period-end`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
 * @description Retrieves paginated review files data for a specific company and review type using the review files functionality. Frontend usage: api.apPeriodEnd.getYearEndProcessMenuReviewFiles()
 *
 * @tags APPeriodEnd
 * @name GetYearEndProcessMenuReviewFiles
 * @summary Get review files for a company (Method: getYearEndProcessMenuReviewFiles)
 * @request GET:/ap-period-end/year-end-process-menu/review-files
 * @secure
 * @response `200` `{
    items?: ({
  \** @example "example report type" *\
    reportType?: string,
  \** @example "example file name" *\
    fileName?: string,
  \** @example "2025-07-25T11:15:44.835Z" *\
    reportDateTime?: string,
  \** @example "/files/example-file-name.pdf" *\
    filePath?: string,

})[],
    pagination?: {
  \** @example 20 *\
    total_items?: number,
  \** @example 1 *\
    current_page?: number,
  \** @example 10 *\
    items_per_page?: number,
  \** @example 2 *\
    total_pages?: number,

},

}` Successfully retrieved review files
 */
    getYearEndProcessMenuReviewFiles: (
      query: GetYearEndProcessMenuReviewFilesParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          items?: {
            /** @example "example report type" */
            reportType?: string;
            /** @example "example file name" */
            fileName?: string;
            /** @example "2025-07-25T11:15:44.835Z" */
            reportDateTime?: string;
            /** @example "/files/example-file-name.pdf" */
            filePath?: string;
          }[];
          pagination?: {
            /** @example 20 */
            total_items?: number;
            /** @example 1 */
            current_page?: number;
            /** @example 10 */
            items_per_page?: number;
            /** @example 2 */
            total_pages?: number;
          };
        },
        any
      >({
        path: `/ap-period-end/year-end-process-menu/review-files`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.apPeriodEnd.getVendorDetailsByYear()
 *
 * @tags APPeriodEnd
 * @name GetVendorDetailsByYear
 * @summary Vendor Details for Selected Year (Method: getVendorDetailsByYear)
 * @request GET:/ap-period-end/{year}/vendors/{vendorNo}
 * @secure
 * @response `200` `{
    items?: any,

}` Get vendor details for Selected Year
 */
    getVendorDetailsByYear: (
      { year, vendorNo, ...query }: GetVendorDetailsByYearParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          items?: any;
        },
        any
      >({
        path: `/ap-period-end/${year}/vendors/${vendorNo}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Updates vendor information for a specific year and vendor number Frontend usage: api.apPeriodEnd.updateVendorByYear()
 *
 * @tags APPeriodEnd
 * @name UpdateVendorByYear
 * @summary Update vendor details by year and vendor number (Method: updateVendorByYear)
 * @request POST:/ap-period-end/{year}/vendors/{vendorNo}
 * @secure
 * @response `200` `{
  \** @example "Vendor Details Updated Successfully" *\
    message?: string,

}` Vendor Details Updated Successfully
 */
    updateVendorByYear: (
      { year, vendorNo, ...query }: UpdateVendorByYearParams,
      data: VendorDetailsDto,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example "Vendor Details Updated Successfully" */
          message?: string;
        },
        any
      >({
        path: `/ap-period-end/${year}/vendors/${vendorNo}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  employeeExpense = {
    /**
 * @description Frontend usage: api.employeeExpense.generateReportEmployeeExpense()
 *
 * @tags Employee Expense
 * @name GenerateReportEmployeeExpense
 * @summary Generate Employee Expense Reports (Method: generateReportEmployeeExpense)
 * @request POST:/employee-expense/generate
 * @secure
 * @response `200` `{
    items: {
  \** @example "Detailed and Summary Report Generated Successfully" *\
    message?: string,

},

}` Generate Employee Expense Reports
 */
    generateReportEmployeeExpense: (
      data: EmployeeExpenseGenerateReportDto,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          items: {
            /** @example "Detailed and Summary Report Generated Successfully" */
            message?: string;
          };
        },
        any
      >({
        path: `/employee-expense/generate`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.employeeExpense.getEmployeeExpenseReports()
 *
 * @tags Employee Expense
 * @name GetEmployeeExpenseReports
 * @summary Get Employee Expense Reports (Method: getEmployeeExpenseReports)
 * @request GET:/employee-expense/reports
 * @secure
 * @response `200` `{
    items: ({
  \** @example "Employee-Expense" *\
    reportType?: string,
  \** @example "my-report.pdf" *\
    pdfFileName?: string,
  \** @format date-time *\
    reportDateTime: string,
  \** @example "/files/my-report.pdf" *\
    filePath: string,
  \** @example "PDF" *\
    formType: string,

})[],
    pagination: {
  \** @example 100 *\
    total_items: number,
  \** @example 1 *\
    current_page: number,
  \** @example 10 *\
    items_per_page: number,
  \** @example 10 *\
    total_pages: number,

},

}` Paginated list of Employee Expense Reports
 */
    getEmployeeExpenseReports: (params: RequestParams = {}) =>
      this.request<
        {
          items: {
            /** @example "Employee-Expense" */
            reportType?: string;
            /** @example "my-report.pdf" */
            pdfFileName?: string;
            /** @format date-time */
            reportDateTime: string;
            /** @example "/files/my-report.pdf" */
            filePath: string;
            /** @example "PDF" */
            formType: string;
          }[];
          pagination: {
            /** @example 100 */
            total_items: number;
            /** @example 1 */
            current_page: number;
            /** @example 10 */
            items_per_page: number;
            /** @example 10 */
            total_pages: number;
          };
        },
        any
      >({
        path: `/employee-expense/reports`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  globalStates = {
    /**
 * @description Frontend usage: api.globalStates.GetReportDetails()
 *
 * @tags GlobalStates
 * @name GetReportDetails
 * @summary Get report details by report name (Method: GetReportDetails)
 * @request GET:/global-states/reports/{name}
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    items?: ({
  \** @example "Open-Payables-By-Due-Date" *\
    reportName?: string,
  \** @example "Environment" *\
    fieldKey?: string,
  \** @example "Environment" *\
    fieldDescription?: string,
  \** @example "string" *\
    fieldComponent?: string,
  \** @example "string" *\
    fieldDataType?: string,
  \** @example 1 *\
    fieldSequence?: number,
  \** @example "in" *\
    variableType?: string,
  \** @example "api call" *\
    xmlMetadata?: string | null,
  \** @example "AP700PRC" *\
    storedProcedureName?: string,
  \** @example 1 *\
    spSequence?: number,
  \** @example "4" *\
    fieldLength?: string | null,

})[],

}` Successfully retrieved spinfo records
 */
    getReportDetails: (
      { name, variableType, ...query }: GetReportDetailsParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example true */
          success?: boolean;
          items?: {
            /** @example "Open-Payables-By-Due-Date" */
            reportName?: string;
            /** @example "Environment" */
            fieldKey?: string;
            /** @example "Environment" */
            fieldDescription?: string;
            /** @example "string" */
            fieldComponent?: string;
            /** @example "string" */
            fieldDataType?: string;
            /** @example 1 */
            fieldSequence?: number;
            /** @example "in" */
            variableType?: string;
            /** @example "api call" */
            xmlMetadata?: string | null;
            /** @example "AP700PRC" */
            storedProcedureName?: string;
            /** @example 1 */
            spSequence?: number;
            /** @example "4" */
            fieldLength?: string | null;
          }[];
        },
        any
      >({
        path: `/global-states/reports/${name}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.globalStates.GenerateReport()
 *
 * @tags GlobalStates
 * @name GenerateReport
 * @summary Execute stored procedure dynamically (Method: GenerateReport)
 * @request POST:/global-states/reports
 * @secure
 * @response `200` `{
    items?: {
  \** @example ["Open Payables report generated                    "] *\
    message?: (string)[],

},

}` Successfully executed stored procedure
 */
    generateReport: (
      { name, ...query }: GenerateReportParams,
      data: ExecuteSpDto,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          items?: {
            /** @example ["Open Payables report generated                    "] */
            message?: string[];
          };
        },
        any
      >({
        path: `/global-states/reports`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.globalStates.GetAllReportNames()
 *
 * @tags GlobalStates
 * @name GetAllReportNames
 * @summary Get all available report names (Method: GetAllReportNames)
 * @request GET:/global-states/reports
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
  \** @example ["Open-Payables-By-Due-Date","Vendor-Aged-Report","Company-Summary"] *\
    data?: (string)[],

}` Successfully retrieved report names
 */
    getAllReportNames: (params: RequestParams = {}) =>
      this.request<
        {
          /** @example true */
          success?: boolean;
          /** @example ["Open-Payables-By-Due-Date","Vendor-Aged-Report","Company-Summary"] */
          data?: string[];
        },
        any
      >({
        path: `/global-states/reports`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.globalStates.GetDropdownData()
 *
 * @tags GlobalStates
 * @name GetDropdownData
 * @summary Get generic dropdown data for various entities (Method: GetDropdownData)
 * @request GET:/global-states/list-options
 * @secure
 * @response `200` `{
  \** @example [{"id":"H","value":"H","label":"Hold"},{"id":"A","value":"A","label":"ACH"},{"id":"W","value":"W","label":"Wire Transfer"}] *\
    items?: ({
  \** @example "1" *\
    id?: string,
  \** @example "Normal" *\
    value?: string,
  \** @example "Normal" *\
    label?: string,

})[],
    pagination?: {
  \** @example 5 *\
    total_items?: number,
  \** @example 1 *\
    current_page?: number,
  \** @example 10 *\
    items_per_page?: number,
  \** @example 1 *\
    total_pages?: number,

},

}` Successfully retrieved dropdown data
 */
    getDropdownData: (
      query: GetDropdownDataParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example [{"id":"H","value":"H","label":"Hold"},{"id":"A","value":"A","label":"ACH"},{"id":"W","value":"W","label":"Wire Transfer"}] */
          items?: {
            /** @example "1" */
            id?: string;
            /** @example "Normal" */
            value?: string;
            /** @example "Normal" */
            label?: string;
          }[];
          pagination?: {
            /** @example 5 */
            total_items?: number;
            /** @example 1 */
            current_page?: number;
            /** @example 10 */
            items_per_page?: number;
            /** @example 1 */
            total_pages?: number;
          };
        },
        any
      >({
        path: `/global-states/list-options`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Generate report file(s) for the given company and usecase Frontend usage: api.globalStates.generateReportFiles()
 *
 * @tags GlobalStates
 * @name GenerateReportFiles
 * @summary Generate Report Files (Method: generateReportFiles)
 * @request POST:/global-states/reports/generate
 * @secure
 * @response `200` `{
  \** @example "Report file(s) generated successfully" *\
    message?: string,
    files?: ({
  \** @example "AP-Nacha-ACH-Creation_20250827.xlsx" *\
    fileName?: string,
  \** @example "http://server:5001/reports/AP-Nacha-ACH-Creation_20250827.xlsx" *\
    filePath?: string,

})[],

}` Report file(s) generated successfully
 */
    generateReportFiles: (
      data: GenerateReportFilesPayload,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example "Report file(s) generated successfully" */
          message?: string;
          files?: {
            /** @example "AP-Nacha-ACH-Creation_20250827.xlsx" */
            fileName?: string;
            /** @example "http://server:5001/reports/AP-Nacha-ACH-Creation_20250827.xlsx" */
            filePath?: string;
          }[];
        },
        any
      >({
        path: `/global-states/reports/generate`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.globalStates.GetGeneralSystemCompany()
 *
 * @tags GlobalStates
 * @name GetGeneralSystemCompany
 * @summary Get General System Company by companyNo (Method: GetGeneralSystemCompany)
 * @request GET:/global-states/general-system-company/{companyNo}
 * @secure
 * @response `200` `{
  \** @example true *\
    fixedAssets?: boolean,
  \** @example true *\
    orderEntryInvoicing?: boolean,
  \** @example true *\
    salesAnalysis?: boolean,
  \** @example true *\
    inventory?: boolean,
  \** @example true *\
    purchaseOrder?: boolean,
  \** @example true *\
    billOfMaterial?: boolean,
  \** @example true *\
    jobShop?: boolean,
  \** @example true *\
    jobCost?: boolean,
  \** @example "filler1" *\
    "filler1"?: string,
  \** @example true *\
    multiWarehouseYn?: boolean,
  \** @example true *\
    thirteenAccountingPeriodsYn?: boolean,
  \** @example true *\
    fractionalQtyActive?: boolean,
  \** @example "apPostOverrideCode" *\
    apPostOverrideCode?: string,
  \** @example "arPostOverrideCode" *\
    arPostOverrideCode?: string,
  \** @example "faPostOverrideCode" *\
    faPostOverrideCode?: string,
  \** @example "glPostOverrideCode" *\
    glPostOverrideCode?: string,
  \** @example 1 *\
    defaultCompanyNo?: number,
  \** @example "filler" *\
    filler?: string,

}` Get General System Company
 */
    getGeneralSystemCompany: (
      { companyNo, ...query }: GetGeneralSystemCompanyParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example true */
          fixedAssets?: boolean;
          /** @example true */
          orderEntryInvoicing?: boolean;
          /** @example true */
          salesAnalysis?: boolean;
          /** @example true */
          inventory?: boolean;
          /** @example true */
          purchaseOrder?: boolean;
          /** @example true */
          billOfMaterial?: boolean;
          /** @example true */
          jobShop?: boolean;
          /** @example true */
          jobCost?: boolean;
          /** @example "filler1" */
          filler1?: string;
          /** @example true */
          multiWarehouseYn?: boolean;
          /** @example true */
          thirteenAccountingPeriodsYn?: boolean;
          /** @example true */
          fractionalQtyActive?: boolean;
          /** @example "apPostOverrideCode" */
          apPostOverrideCode?: string;
          /** @example "arPostOverrideCode" */
          arPostOverrideCode?: string;
          /** @example "faPostOverrideCode" */
          faPostOverrideCode?: string;
          /** @example "glPostOverrideCode" */
          glPostOverrideCode?: string;
          /** @example 1 */
          defaultCompanyNo?: number;
          /** @example "filler" */
          filler?: string;
        },
        any
      >({
        path: `/global-states/general-system-company/${companyNo}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.globalStates.generateAuthCode()
 *
 * @tags GlobalStates
 * @name GenerateAuthCode
 * @summary Generate Auth Code for Company No (Method: generateAuthCode)
 * @request POST:/global-states/general-system-company/{companyNo}
 * @secure
 * @response `200` `{
  \** @example true *\
    fixedAssets?: boolean,
  \** @example true *\
    orderEntryInvoicing?: boolean,
  \** @example true *\
    salesAnalysis?: boolean,
  \** @example true *\
    inventory?: boolean,
  \** @example true *\
    purchaseOrder?: boolean,
  \** @example true *\
    billOfMaterial?: boolean,
  \** @example true *\
    jobShop?: boolean,
  \** @example true *\
    jobCost?: boolean,
  \** @example "filler1" *\
    "filler1"?: string,
  \** @example true *\
    multiWarehouseYn?: boolean,
  \** @example true *\
    thirteenAccountingPeriodsYn?: boolean,
  \** @example true *\
    fractionalQtyActive?: boolean,
  \** @example "apPostOverrideCode" *\
    apPostOverrideCode?: string,
  \** @example "arPostOverrideCode" *\
    arPostOverrideCode?: string,
  \** @example "faPostOverrideCode" *\
    faPostOverrideCode?: string,
  \** @example "glPostOverrideCode" *\
    glPostOverrideCode?: string,
  \** @example 1 *\
    defaultCompanyNo?: number,
  \** @example "filler" *\
    filler?: string,

}` Generate Auth Code
 */
    generateAuthCode: (
      { companyNo, ...query }: GenerateAuthCodeParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example true */
          fixedAssets?: boolean;
          /** @example true */
          orderEntryInvoicing?: boolean;
          /** @example true */
          salesAnalysis?: boolean;
          /** @example true */
          inventory?: boolean;
          /** @example true */
          purchaseOrder?: boolean;
          /** @example true */
          billOfMaterial?: boolean;
          /** @example true */
          jobShop?: boolean;
          /** @example true */
          jobCost?: boolean;
          /** @example "filler1" */
          filler1?: string;
          /** @example true */
          multiWarehouseYn?: boolean;
          /** @example true */
          thirteenAccountingPeriodsYn?: boolean;
          /** @example true */
          fractionalQtyActive?: boolean;
          /** @example "apPostOverrideCode" */
          apPostOverrideCode?: string;
          /** @example "arPostOverrideCode" */
          arPostOverrideCode?: string;
          /** @example "faPostOverrideCode" */
          faPostOverrideCode?: string;
          /** @example "glPostOverrideCode" */
          glPostOverrideCode?: string;
          /** @example 1 */
          defaultCompanyNo?: number;
          /** @example "filler" */
          filler?: string;
        },
        any
      >({
        path: `/global-states/general-system-company/${companyNo}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
 * @description Frontend usage: api.globalStates.getAuthCodeChecker()
 *
 * @tags GlobalStates
 * @name GetAuthCodeChecker
 * @summary Check Auth Code for Company No (Method: getAuthCodeChecker)
 * @request GET:/global-states/general-system-company/{companyNo}/auth-code
 * @secure
 * @response `200` `{
  \** @example true *\
    fixedAssets?: boolean,
  \** @example true *\
    orderEntryInvoicing?: boolean,
  \** @example true *\
    salesAnalysis?: boolean,
  \** @example true *\
    inventory?: boolean,
  \** @example true *\
    purchaseOrder?: boolean,
  \** @example true *\
    billOfMaterial?: boolean,
  \** @example true *\
    jobShop?: boolean,
  \** @example true *\
    jobCost?: boolean,
  \** @example "filler1" *\
    "filler1"?: string,
  \** @example true *\
    multiWarehouseYn?: boolean,
  \** @example true *\
    thirteenAccountingPeriodsYn?: boolean,
  \** @example true *\
    fractionalQtyActive?: boolean,
  \** @example "apPostOverrideCode" *\
    apPostOverrideCode?: string,
  \** @example "arPostOverrideCode" *\
    arPostOverrideCode?: string,
  \** @example "faPostOverrideCode" *\
    faPostOverrideCode?: string,
  \** @example "glPostOverrideCode" *\
    glPostOverrideCode?: string,
  \** @example 1 *\
    defaultCompanyNo?: number,
  \** @example "filler" *\
    filler?: string,

}` Get General System Company
 */
    getAuthCodeChecker: (
      { companyNo, ...query }: GetAuthCodeCheckerParams,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example true */
          fixedAssets?: boolean;
          /** @example true */
          orderEntryInvoicing?: boolean;
          /** @example true */
          salesAnalysis?: boolean;
          /** @example true */
          inventory?: boolean;
          /** @example true */
          purchaseOrder?: boolean;
          /** @example true */
          billOfMaterial?: boolean;
          /** @example true */
          jobShop?: boolean;
          /** @example true */
          jobCost?: boolean;
          /** @example "filler1" */
          filler1?: string;
          /** @example true */
          multiWarehouseYn?: boolean;
          /** @example true */
          thirteenAccountingPeriodsYn?: boolean;
          /** @example true */
          fractionalQtyActive?: boolean;
          /** @example "apPostOverrideCode" */
          apPostOverrideCode?: string;
          /** @example "arPostOverrideCode" */
          arPostOverrideCode?: string;
          /** @example "faPostOverrideCode" */
          faPostOverrideCode?: string;
          /** @example "glPostOverrideCode" */
          glPostOverrideCode?: string;
          /** @example 1 */
          defaultCompanyNo?: number;
          /** @example "filler" */
          filler?: string;
        },
        any
      >({
        path: `/global-states/general-system-company/${companyNo}/auth-code`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
