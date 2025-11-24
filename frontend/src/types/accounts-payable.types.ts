import type { StepProps, TableProps, TabsProps } from "antd";
import type { ColumnType, ColumnGroupType } from "antd/es/table";
import type { ApGlobalStates } from "@api/api-schema/api";
export interface BreadcrumbItem {
  label: string;
  path?: string;
}
export interface StepOneFormProps {
  formData: { [key: string]: string };
  onInputChange: (key: string, value: string) => void;
  onInputBlur?: (key: string, value: string) => void;
}
export interface StepTwoFormProps {
  formData: { [key: string]: string };
  onInputChange: (key: string, value: string) => void;
  existingLineItems?: any[];
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}
export interface CompanyNoProps {
  value?: string;
  onChange: (value: string) => void;
  status?: "error" | "warning" | undefined;
}
export interface ProcessTypeProps {
  value?: string;
  onChange: (value: string) => void;
}
export interface Vendor {
  id: number;
  value: string;
  label: string;
}

export interface VendorNumberNameProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  companyNo?: string;

  disabled?: boolean;
}

export interface NormalProcessProps {
  selectedCompany: string;
}

export interface CustomAutoCompleteProps {
  id: string;
  tabs: string[];
  dataMap: {
    [tab: string]: OptionType[];
  };
}
export type OptionType = {
  value: string;
  label: string;
};
export interface PaperProcessProps {
  uploadStatusData?: any;
  defaultActiveTab?: string;
}
export interface CardProps {
  icon: React.ReactNode;
  label: React.ReactNode;
  value: string | number;
  widthClass?: string;
  className?: string;
}
export interface CustomDatePickerProps {
  name: string;
  value?: string;
  onChange: (name: string, value: string) => void;
  onBlur?: (name: string, value: string) => void;
  disabled?: boolean;
  className?: string;
  selected?: string;
  status?: "error" | "warning";
}
export interface ModalAction {
  name: string;
  label: string;
  onClick: () => void;
  type?: "primary" | "default" | "dashed" | "link" | "text" | "custom";
  className?: string;
}

export interface ModalContentProps {
  title?: string | React.ReactNode;
  description: string | React.ReactNode;
  visible: boolean;
  onCancel: () => void;
  actions?: ModalAction[];
  imageUrl?: string;
  className?: string;
}
export interface CustomRadioButtonProps {
  label: string;
  value: string;
  name: string;
  checked: boolean;
  onChange: (value: string) => void;
}
export interface StepFormProps {
  current: number;
  items: CustomStep[];
  percent?: number;
  size?: "default" | "small";
  children?: React.ReactNode;
  className?: string;
  dynamicDescriptions?: Record<string, string>;
}
export interface CustomStep extends StepProps {
  descriptionKey?: string;
}
export interface CashRequirmentProps {
  voucherType?: string;
}
export interface APCheckProps {
  voucherType?: string;
}
export type Props = object;
export type PlaceholderMap = {
  [key: string]: string;
  PREPAID: string;
  HOLD_INVOICE: string;
  SINGLE_CHECK: string;
};

export interface CustomColumnType<T> extends ColumnType<T> {
  filterable?: boolean; // ✅ not `filter`, not `filtered`
}

export type CustomTableColumnsType<T> = (
  | CustomColumnType<T>
  | ColumnGroupType<T>
)[];

export interface TableWidgetProps<T extends object> {
  columns: CustomTableColumnsType<T>;
  dataSource: T[];
  loading?: boolean;
  onChange?: TableProps<T>["onChange"];
  rowKey?: string | ((record: T) => string);
  pagination?: TableProps<T>["pagination"];
  rowSelection?: TableProps<T>["rowSelection"];
}

export interface FlexiProcessProps {
  selectedCompany: string;
  uploadStatusData: any;
  useUploadSummary?: boolean;
}
export interface ArglmsProcessProps {
  defaultActiveTab?: string;
}
export interface VoucherEntryUI {
  key: string;
  invoiceNo: string;
  invoiceDate: string;
  discountDue: string;
  discountDueDate: string;

  vendorName: string;
  vendorNo: string;
  status: string;
  entryNo: number;
  entrySequence: number;
  companyNo: number;
  canceledVoucher: number;
  apGlNo: number;
  invoiceDesc: string;
  dueDate: string;
  singleCheck: string;
  holdCode: string;
  holdDesc: string;
  prepaidCode: string;
  prepaidCheckNo: number;
  vendorAdd1: string;
  vendorAdd2: string;
  vendorAdd3: string;
  vendorAdd4: string;
  bankGl: number;
  invoiceAmount: number;
  retentionGl: number;
  retentionPct: number;
  prepaidCheckdate: number;
  salesOrderNo: number;
  srn: number;
  carrierId: string;
  vendorPaymentTerms: number;
  processType: string;
  extendedDiscountDueDate: number;
  checkNo: string;
  paidDate?: string;
  paidAmount?: string | number;
  grossAmount?: string | number;
  discAmount?: string | number;
  netAmount?: string | number;
  discountDate?: string;
  holdPaymentFlag?: string;
  holdDescription?: string;
}

export type UploadStatusSummary = {
  totalAmount?: number | string;
  totalUploads?: number | string;
  countS?: number | string;
  countW?: number | string;
  countE?: number | string;
};

export type UploadStatusData =
  | {
      summary?: UploadStatusSummary;
    }
  | undefined;

export type PaperEntryItem = {
  key?: string;
  entryNo?: number | string;
  invoiceNo?: string;
  invoiceDate?: string;
  discountDue?: number | string;
  discountDueDate?: string;
  vendorName?: string;
  vendorNo?: number | string;
  salesOrderNo?: string | number;
  status?: string;
  invoiceAmount?: number | string;
  companyNo?: number | string;
};

export type LmsEntryItem = {
  key: string;
  entryNo?: number | string;
  invoiceNo?: string;
  invoiceDate?: string;
  invoiceAmount?: number | string;
  discountDue?: string;
  vendorName?: string;
  vendorNo?: number | string;
  orderNo?: number | string;
  salesOrderNo?: number | string;
  companyNo?: number | string;
  processType?: string;
  status?: string;
};

export interface voucherMaintenanceUI {
  key: string;
  invoiceNo: string;
  grossAmount: string;
  dueDate: string;
  invoiceDate: string;
  discount: string;
  discountDate: string;
  paidDate: string;
  checkNo: string;
  discAmount: string;
  paidAmount: string;
  netAmount: string;
  invoiceDesc: string;
  voucherType?: "PAID" | "UNPAID";
  status: "success" | "warning" | "error";
}
export interface VoucherMaintenanceModalData {
  vendorName: string;
  vendorNo: string;
  invoiceNo: string;
  invoiceDate: string;
  discountDate: string;
  dueDate: string;
  invoiceAmount: number;
  discountAmount: number;
  invoiceDesc: string;
  freight: string;
  prepaidVoucher: string;
  companyNo: number;
  voucherNo: number;
  singleCheck: string;
  acctPayGL: string;
  bankAcctGL: string;
  holdVoucher: string;
  holdDescription: string;
  lineAmount: number;
  lineDesc: string;
  lineGL: string;
  poNumber: string;
  freightLine: string;
  itemGallons: string;
  receipt: string;
  qty: string;
  project: string;
  status: string;
  salesOrder: string;
  srn: string;
}
export interface UploadCSVModalProps {
  visible: boolean;
  onCancel: () => void;
  onUploadSuccess: (fileName: string) => void;
  onUploadError: (errorMsg: string) => void;
  uploadComplete: () => void;
  source: "Flexi" | "Sogas" | "ClearChecks";
  sogasType?: string;
}

export interface CustomColumnType<T> extends ColumnType<T> {
  filterable?: boolean;
}

export interface DataType {
  key: string;
  carrierId: string;
  carrierInvoice: string;
  orderShipDate: string;
  invType: number;
  orderNo: number;
  shipRef: number;
  invoiceAmount: string;
}
export interface SogasProcessProps {
  sogasType: string;
  uploadStatusData: any;
  useUploadSummary?: boolean;
}

// Interfaces for unprocessed records handling
export interface UnprocessedRecordError {
  code: string;
  field: string;
  message: string;
}

export interface UnprocessedRecord {
  error: UnprocessedRecordError;
  invoiceNo: string;
  ownerNo: string;
}

export interface UnprocessedRecordsModalProps {
  visible: boolean;
  onClose: () => void;
  unprocessedItems: UnprocessedRecord[];
}
export type LineItem = {
  id: number;
  data: Record<string, string>;
};
export interface PostToPurchase {
  visible: boolean;
  onCancel: () => void;
  onChange: (
    field: "purchaseJournalDate" | "cashDisbursementDate",
    value: string
  ) => void;
  onSubmit: () => void;
  purchaseJournalDate: string;
  cashDisbursementDate: string;
  prepaidCode?: string;
}
export interface ViewVoucherModalProps {
  visible: boolean;
  title: string;
  entryNo: string;
  vendorNo: number;
  companyNo: number;
  onClose: () => void;
  onEdit?: () => void;
}
export interface VoucherTypeProps {
  value: string;
  onChange: (value: string) => void;
  type: string;
  reportType: string;
}

export interface ReportTypeProps {
  value: string;
  onChange: (val: string) => void;
  type: ApGlobalStates.ProcessType.RequestParams["type"];
  data?: { id: string; value: string; label: string }[];
}
export interface TabsContentProps {
  items: TabsProps["items"];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
}
export interface ToasterProps {
  type: "error" | "success" | "warning" | "batch";
  title: string;
  subtitle: string;
  onClose: () => void;
}


export interface PurchaseJournalEntry {
  formType: string | undefined;
  key: string;
  fileName: string;
  pdfFileName: string;
  reportDateTime: string;
  reportType: string;
  reportFileType: string;
  status: string;
  title: string;
  localPath: string;
  filePath: string;
  fileType?: "pdf" | "excel" | "txt"; // Add optional file type indicator
}
export interface OpenPayablesUI {
  key: string | number;
  pdfFileName: string;
  reportDateTime: string;
  ReportType: string;
  reportType: string;
  reportFileType: string;
  status: string;
  filePath?: string;
  fileName?: string;
  fileType?: "pdf" | "excel" | "txt"; // Add optional file type indicator
}
export interface CheckPaymentHistoryUI {
  key: string;
  vendorCard?: string;
  openPayables?: string;
  discountTaken?: string;
  invoiceDate?: string;
  dueDate?: string;
  voucherNo?: string;
  paidDate?: string | number;
  lastPaidDate?: string;
  checkNo?: string;
  invoiceNo?: string;
  invoiceDescription?: string;
  grossAmount?: string;
  discountAmount?: string;
  paidAmount?: string;
  bankStatus?: string;
}

export interface PaymentFormProps {
  onPaymentSaved?: (hasSavedPayments: boolean) => void;
  onVoucherTypeChange?: (voucherType: string) => void;
  onPaymentTypeSubmit?: (isSubmitted: boolean) => void;
  isPaymentTypeSubmitted?: boolean;
  hasSavedPayments?: boolean;
  onDateToPayByChange?: (dateToPayBy: string) => void;
}

export interface BankDetailsSectionProps {
  values: {
    achBankAccount: string;
    achBankRouting: string;
    achCheckingOrSavings: string;
    bankClass: string;
  };
  onChange: (field: string, value: string | number) => void;
}
export interface Section1099Props {
  values: {
    firstName: string;
    middleName: string;
    lastName: string;
    suffix: string;
    code1099: string;
    desc1099: string;
    id1099: string;
    box1_1099: string;
    box2_1099: string;
    boxAmt2_1099: string;
    payee1: string;
    payee2: string;
    irsNameControl?: string;
  };
  onChange: (field: string, value: string | number) => void;
}
export interface ValueItem {
  label: string;
  amount: string | number;
}

export interface MonthToDateSectionProps {
  title?: string;
  values: ValueItem[];
}
export interface YearToDateValues {
  thisYearPurchases: number;
  thisYearPayments: number;
  thisYearDiscounts: number;
  lastPaymentDate: string;
  lastYearPurchases: number;
  lastYearPayments: number;
  lastPaymentAmount: number;
}

export interface YearToDateSectionProps {
  title?: string;
  values: YearToDateValues;
  onChange?: (field: keyof YearToDateValues, value: number | string) => void;
  editableFields?: (keyof YearToDateValues)[];
  errors?: Record<string, string>;
  context?: "ap-period-end" | "vendor-management";
}
export interface VendorContact {
  id: number | string;
  data: {
    type: string;
    name: string;
    email: string;
    comments?: string;
    includeAch: boolean;
  };
}

export interface VendorContactSectionProps {
  contacts: VendorContact[];
  onAddContact: () => void;
  onChangeContact: (id: number | string, field: string, value: any) => void;
  onDeleteContact: (id: number | string) => void;
}

export interface VendorDetails {
  vendorIsDeleted: string;
  vendorCompanyNumber: number;
  vendorNo: number;
  vendorAchBankAccountNumber: string;
  vendorAchBankRoutingCode: number;
  vendorAchCheckingOrSavings: string;
  vendorAchClass: string;
  vendorAdd1: string;
  vendorAdd2: string;
  vendorAdd3: string;
  vendorAdd4: string;
  vendorAddress: string;
  vendorPhone: string;
  vendorAdpPayrollId: number;
  vendorAlphaSortAbbr: string;
  vendorAp1099Code: string;
  vendorAp1099CodeDescription?: string;
  vendorApTermsCode: number;
  vendorApTermsCodeDescription?: string; // optional description
  vendorAreaCode: number;
  vendorBusinessLastName: string;
  vendorCarrierId: string;
  vendorCategoryCode: string;
  vendorCategoryCodeDescription?: string; // optional description
  vendorCountryCode: string;
  vendorCurrentBalance: number;
  vendorExpenseGLSub: number;
  vendorExtraZip: number;
  vendorFirst1099BoxNumber: number;
  vendorFirstName: string;
  vendorGalRcptsRequired: string;
  vendorHoldPaymentsVend: string;
  vendorIdNumber: string;
  vendorIrsNameControl: string;
  vendorLastPaymentAmt: number;
  vendorLastPaymentDate: string;
  vendorLastPaymentDateAlt: number;
  vendorLastYearPurchases: number;
  vendorLastYrYtdPaid: number;
  vendorMiddleName: string;
  vendorMtdDiscounts: number;
  vendorMtdPayments: number;
  vendorMtdPurchases: number;
  vendorName: string;
  vendorNameOverflow: string;
  vendorNameSuffix: string;
  vendorPayeeName1: string;
  vendorPayeeName2: string;
  vendorPreviousBalance: number;
  vendorSecond1099BoxAmount: number;
  vendorSecond1099BoxNumber: number;
  vendorSingleCheck: string;
  vendorTelephoneNo: number;
  vendorThisYrYtdPaid: number;
  vendorYtdDiscounts: number;
  vendorYtdPurchases: number;
  vendorZipCode: number;
}

export interface VendorContactDetail {
  emailAddress: string; // API response field name
  formType: string; // API response field name  
  formTypeDescription: string;
  contactName: string;
  comments: string;
  filler?: string; // New API field used for comments
  sendAchEmail: string; // API response field name
  sequenceNumber?: number; // Sequence number from API, only available in edit mode
}

export interface VendorData {
  key: string;
  vendorNo: number;
  vendorName: string;
  telephone: string;
  lastPmtAmt: string;
  lastPmtDate: string;
  type: string;
  status: string;
  vendorDetails?: {
    vendor: VendorDetails;
    vendorContactDetails: VendorContactDetail[];
  };
}

// API Response interface for getVendorsByYear
export interface VendorApiResponse {
  vendorNo?: number;
  vendorName?: string;
  vendorTelephoneNo?: number;
  vendorAreaCode?: number;
  vendorLastPaymentAmt?: number;
  vendorLastPaymentDate?: number;
  vendorIsDeleted?: string;
  vendorAp1099Code?: string;
  vendorHoldPaymentsVend?: string;
  vendorCompanyNumber?: number;
  vendorAdd1?: string;
  vendorAdd2?: string;
  vendorAdd3?: string;
  vendorAdd4?: string;
  vendorZipCode?: number;
  vendorExtraZip?: number;
  vendorAlphaSortAbbr?: string;
  vendorYtdPurchases?: number;
  vendorLastYearPurchases?: number;
  vendorMtdDiscounts?: number;
  vendorYtdDiscounts?: number;
  vendorNameOverflow?: string;
  vendorGalRcptsRequired?: string;
  vendorFiller?: string;
  vendorPreviousBalance?: number;
  vendorMtdPurchases?: number;
  vendorMtdPayments?: number;
  vendorCurrentBalance?: number;
  vendorSingleCheck?: string;
  vendorThisYrYtdPaid?: number;
  vendorLastYrYtdPaid?: number;
  vendorExpenseGLSub?: number;
  vendorApTermsCode?: number;
  vendorIdNumber?: string;
  vendorFirst1099BoxNumber?: number;
  vendorSecond1099BoxNumber?: number;
  vendorSecond1099BoxAmount?: number;
  vendorLastPaymentDateAlt?: number;
  vendorCarrierId?: string;
  vendorPayeeName1?: string;
  vendorPayeeName2?: string;
  vendorIrsNameControl?: string;
  vendorAdpPayrollId?: number;
  vendorAchClass?: string;
  vendorAchCheckingOrSavings?: string;
  vendorAchBankRoutingCode?: number;
  vendorAchBankAccountNumber?: string;
  vendorFirstName?: string;
  vendorMiddleName?: string;
  vendorBusinessLastName?: string;
  vendorNameSuffix?: string;
  vendorCountryCode?: string;
  vendorCategoryCode?: string;
  vendorFiller2?: string;
}

// Transformed interface for 1099 vendor data (extending VendorData)
export interface Vendor1099Data extends VendorData {
  originalData?: VendorApiResponse;
}
export interface OwnerVendorNumberNameProps {
  value?: string;
  onChange: (value: string) => void;
  companyNo?: string;
  disabled?: boolean;
}

export interface OwnerVendor {
  id: string;
  value: string;
}

export interface VendorOwnerMappingUI {
  key: string;
  vendorId: string;
  vendorName: string;
  ownerId: string;
  ownerName: string;
  mappingDate: string;
  status: string;
}

export interface OwnerMappingItem {
  ownerNo: number;
  vendorNo: number;
  isDeleted: string;
  vendorName: string;
}
// Types
export interface ValidationErrors {
  company?: string;
  voucherToPay?: string;
  batchNo?: string;
  bankAccountGL?: string;
  dateToPayBy?: string;
  companyNo?: string;
  year?: string;
}

export interface ReportTableData {
  key: string;
  pdfFileName: string;
  reportDateTime: string;
  reportType?: string;
  reportFileType: string;
  status: string;
  filePath: string;
  formType:string;
  fileName: string;
  fileType: string;
}
export interface OwnerNoOption {
  id?: number;
  value?: string;
  label?: string;
}
export type StepperItem = {
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
};

export interface StepperProps {
  current: number;
  titles?: string[];
  items?: StepperItem[];
  size?: "small" | "default";
  className?: string;
  labelPlacement?: "horizontal" | "vertical";
}
export interface FrieghtInvoiceImportSectionProps {
  showToaster: (
    type: "error" | "success" | "warning" | "batch",
    title: string,
    subtitle: string
  ) => void;
  onBatchSuccess: (message: string) => void;
}

export type PaymentNotificationType = "success" | "error";

export interface PaymentNotificationState {
  visible: boolean;
  type: PaymentNotificationType;
  title: string;
  subtitle: string;
}

export interface PaymentTypeState {
  companyNo: string;
  voucherToPay: string;
  startingCheck: string;
  checkDate: string;
  dateToPayBy: string;
  forcedDiscount1: boolean;
  bankAccountGL: string;
  bankAccountGLDescription: string;
}

export interface PaymentItem {
  id: number;
  entrySequence: string;
  voucherToPay: string;
  startingCheck: string;
  checkDate: string;
  dateToPayBy: string;
  forcedDiscount1: boolean;
  bankAccountGL: string;
  bankAccountGLDescription: string;
  forcedDiscount2: boolean;
  vendorNumber: string;
  voucherNumber: string;
  partialPayAmount: string;
  overrideDiscountAmount: string;
  payHold: string;
  singleCheck: string;
  makePrepaid: string;
  prepaidCheckNo: string;
  checkDateVendor: string;
  isSaved: boolean;
  isDefault?: boolean;
}

export interface PaymentFormState {
  payments: PaymentItem[];
}
export interface Update1099FileData {
  key: string;
  recordType: string;
  ctl: string;
  tin: string;
  firstPayeeName: string;
}
export interface PaymentFormPropsExtended extends PaymentFormProps {
  paymentFormState: PaymentFormState;
  setPaymentFormState: React.Dispatch<React.SetStateAction<PaymentFormState>>;
  paymentTypeState: PaymentTypeState;
  setPaymentTypeState: React.Dispatch<React.SetStateAction<PaymentTypeState>>;
  isPaymentFormSubmitted: boolean;
  setIsPaymentFormSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  isEditMode: boolean;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  generateEntrySequence: (index: number) => string;
}
export interface PrintChecksRef {
  handlePrint: () => Promise<void>;
  isPrintLoading: boolean;
}
export interface CompanyData {
  companyNo?: number;
  companyName?: string;
  companyApGlNo?: number;
  companyBankGlNo?: number;
  companyDiscountsGlNo?: number;
  companyIntercoGlNo?: number;
  companyNextPjJrnlNo?: number;
  companyNextCdJrnlNo?: number;
  companyNextCheckNo?: number;
  companyNextEntryNo?: number;
  companyNextVoucherNo?: number;
  companyPreEdChks?: string;
  companyJobCostAct?: string;
  companyRetentionGlNo?: number;
  companyPoActive?: string;
  companyEmployeeExpenseGlNo?: number;
  companyNextEeJrnlNo?: number;
  companyVendorNextEntryNo?: number;
  company99Name?: string;
  company99Address1?: string;
  company99Address2?: string;
  company99StateZip?: string;
  company99EinNumber?: string;
  company99EmployeeName?: string;
  company99Phone?: string;
  companyFiller?: string;
  companyIsDeleted?: string;
}
export interface ErrorWithDetails {
  error?: {
    details?: Array<{ field?: string; message?: string }>;
    errors?: Array<{ field?: string; message?: string }>;
  };
  data?: {
    details?: Array<{ field?: string; message?: string }>;
    errors?: Array<{ field?: string; message?: string }>;
  };
  response?: {
    data?: {
      details?: Array<{ field?: string; message?: string }>;
      errors?: Array<{ field?: string; message?: string }>;
    };
  };
  details?: Array<{ field?: string; message?: string }>;
  errors?: Array<{ field?: string; message?: string }>;
}
export type SogasEntryItem = {
    entryNo: number;
    invoiceNo?: string;
    invoiceDate?: string;
    discountDue?: string;
    discountDueDate?: string;
    vendorName?: string;
    vendorNo: number | string;
    status?: string;
    entrySequence?: number;
    companyNo?: number | string;
    canceledVoucher?: number;
    apGlNo?: number;
    invoiceDesc?: string;
    dueDate?: string;
    singleCheck?: string;
    holdCode?: string;
    holdDesc?: string;
    prepaidCode?: string;
    prepaidCheckNo?: number;
    vendorAdd1?: string;
    vendorAdd2?: string;
    vendorAdd3?: string;
    vendorAdd4?: string;
    bankGl?: number;
    invoiceAmount?: number;
    retentionGl?: number;
    retentionPct?: number;
    prepaidCheckdate?: number;
    salesOrderNo?: number;
    srn?: number;
    carrierId?: string;
    vendorPaymentTerms?: number;
    processType?: string;
    extendedDiscountDueDate?: number;
    checkNo?: string;
  };

  export interface ApPeriodEndReportItem {
  recordType?: string;
  ctl?: string;
  tin?: string;
  firstPayeeName?: string;
}
export interface CompanyMaintenanceData {
  companyNo: number;
  companyName: string;
  companyApGlNo: number;
  companyBankGlNo: number;
  companyDiscountsGlNo: number;
  companyIntercoGlNo: number;
  companyNextPjJrnlNo: number;
  companyNextCdJrnlNo: number;
  companyNextCheckNo: number;
  companyNextEntryNo: number;
  companyNextVoucherNo: number;
  companyPreEdChks: "Y" | "N";
  companyJobCostAct: "Y" | "N";
  companyRetentionGlNo: number;
  companyPoActive: "Y" | "N";
  companyEmployeeExpenseGlNo: number;
  companyNextEeJrnlNo: number;
  companyFiller: string;
}

export interface ReportTypeItem {
  id: string;
  value: string;
  label: string;
}

export interface ReportTypeApiResponse {
  data: {
    items: ReportTypeItem[];
  };
}

export interface ReportsMenuQueryParams {
  companyNo: number;
  reportType?: string;
  fileName?: string;
  startDate?: string;
  endDate?: string;
}

export interface ReportMenuItem {
  id: number;
  pdfFileName: string;
  reportDateTime: string;
  reportType: string;
  formType: string;
  status: string;
  filePath: string;
  fileName: string;
}

export interface PaymentTypeSubmissionData {
  companyNo: number;
  voucherToPay: "Check" | "ACH" | "Wire";
  startingCheckNo: number;
  checkDate: string;
  dateToPayBy: string;
  bankAccountGl: number;
  forcedDiscount: "D" | "";
  mode: "I" | "U" | "D";
}

export interface VendorPaymentData {
  companyNo: number;
  voucherToPay?: "Check" | "ACH" | "Wire" | "Employee Expense" | "Utility";
  bankAccountGl: number;
  startingCheckNo: number;
  checkDate: string;
  dateToPayBy: string;
  entrySequence: string;
  vendorNo: number;
  voucherNo: number;
  partialPayAmount: number;
  discountAmount: number;
  payOrHold: "P" | "H";
  singleCheck: "S" | "";
  makePrepaid: "" | "P" | "A" | "W";
  prepaidCheckNo?: string;
  prepaidDate: string;
  forcedDiscount: "D" | "";
  mode: "I" | "U" | "D";
}

export interface VendorDetailsByYearParams {
  year: string;
  vendorNo: string;
  vendorCompanyNumber: number;
}

export interface VendorDetailsParams {
  vendorCompanyNumber: number;
  vendorNo: number;
}

export interface UpdateVendorByYearData {
  vendorCompanyNumber: number;
  vendorName: string;
  vendorAdd1: string;
  vendorAdd2: string;
  vendorAdd3: string;
  vendorAdd4: string;
  vendorCountryCode: string;
  vendorZipCode: number;
  vendorTelephoneNo?: number;
  vendorAreaCode?: number;
  vendorFirstName: string;
  vendorMiddleName: string;
  vendorBusinessLastName: string;
  vendorNameSuffix: string;
  vendorExtraZip: number;
  vendorAlphaSortAbbr: string;
  vendorHoldPaymentsVend: string;
  vendorAp1099Code: string;
  vendorGalRcptsRequired: string;
  vendorSingleCheck: string;
  vendorExpenseGLSub: number;
  vendorApTermsCode: number;
  vendorIdNumber: string;
  vendorFirst1099BoxNumber: number;
  vendorSecond1099BoxNumber: number;
  vendorSecond1099BoxAmount: number;
  vendorCarrierId: string;
  vendorPayeeName1: string;
  vendorPayeeName2: string;
  vendorIrsNameControl: string;
  vendorAdpPayrollId: number;
  vendorAchClass: string;
  vendorAchCheckingOrSavings: string;
  vendorAchBankRoutingCode: number;
  vendorAchBankAccountNumber: string;
  vendorCategoryCode: string;
  vendorIsDeleted: string;
  vendorNo: number;
  year: string;
}

export interface GlMasterValidationResult {
  success: boolean;
  message: string;
  description?: string;
  isDeleted?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

export interface Update1099FileData {
  key: string;
  recordType: string;
  ctl: string;
  tin: string;
  firstPayeeName: string;
}

// File Data for AP Period End
export interface FileData {
  key: string;
  reportType?: string;
  fileName?: string;
  reportDateTime?: string;
  filePath?: string;
  formType?: string;
  reportFile?: string;
  status: "Ready" | "Processing" | "Error";
  fileType?: string;
}

export interface ReportParameter {
  name: string;
  value: string;
}

export interface GenerateReportFilesPayload {
  companyNo: number;
  usecase: string;
  parameters?: Record<string, string>;
}

export interface GenerateReportFilesResult {
  success: boolean;
  message?: string;
  files?: Array<{ fileName?: string; filePath?: string }>;
}
