export const purchaseJournalLabel = "PurchaseJournal component";
export const voucherPayableHistory = "VoucherPayableHistory component";
export const checkInquiryLabel = "Check Inquiry";
export const voucherMaintenanceLabel = "Voucher Maintenance";

export const TABLE_HEADERS = [
   "Entry No",
   "Invoice No",
   "Process T.",
   "Invoice A.",
   "Invoice D.",
   "Invoice D..",
   "Discount..",
   "Hold Type",
   "Actions",
];

export const paginationOptions = [
   { value: "10", label: "10 / page" },
   { value: "20", label: "20 / page" },
   { value: "50", label: "50 / page" },
];
export const MAX_STRING_LENGTH = 20;
export const paginationNumbers = ["1", "4", "5", "6", "7", "8", "50"];

export const formFieldsLabelsStepOne = [
   "Invoice No",
   "Invoice Date",
   "Discount Due Date",
   "Due Date",
   "Invoice Amount",
   "Invoice Description",
   "Prepaid Voucher",
   "Hold Voucher",
   "Hold Description",
   "Single Check",
   "Prepaid Check No",
   "Account Pay G/L",
   "Account Pay G/L Description",
   "Freight",
   "Check Date",
   "Bank Acct G/L",
   "Bank Acct G/L Description",
   "Product Invoice for Allocation",
   "Sales Order",
   "SRN",
];
export const yesNoOptions = [
   { label: "Single Check", value: "S" },
   { label: "No Check", value: "" },
];
export const disabledFields = [
   "Hold Description",
   "Account Pay G/L Description",
   "Bank Acct G/L Description",
   "Account Pay G/L",
   "Bank Acct G/L",
];
export const holdVoucherCode = [
   { label: " Hold", value: "H" },
   { label: "ACH", value: "A" },
   { label: "Wire Transfer", value: "W" },
   { label: "Employee Expense", value: "E" },
   { label: "Utility", value: "U" },
   { label: "None", value: "N" },
];
export const holdVoucherDescriptions: Record<string, string> = {
   H: "VENDOR ON HOLD",
   A: "ON HOLD FOR ACH",
   W: "ON HOLD FOR WIRE TRANSFER",
   E: "Employee Expense",
   U: "ON HOLD FOR UTILITY AUTO",
   N: "",
};

export const prepaidOptions = [
   { label: "Prepaid", value: "P" },
   { label: "ACH Payment", value: "A" },
   { label: "Wire Transfer Payment", value: "W" },
   { label: "Employee Expense", value: "E" },
];

export const prepaidPlaceholder = "Select Prepaid";

export const selectPlaceholder = "Select";

export const productAllocationOptions = [
   { label: "By Sales Order", value: "By Sales Order" },
   { label: "By Vendor", value: "By Vendor" },
];

export const gridLineInfoLabels = ["Line Company", "Product Amount"];

export const lineDiscountLabels = [
   "Line Discount Amount",
   "Line Discount Percentage",
];

export const orLabel = "OR";

export const formFieldLabelsStepTwo = [
   "Line Discount Amount",
   "Line Discount Percentage",
   "Line G/L Account",
   "Line Description",
   "Gallons",
   "Receipt No.",
   "P/O No.",
   "P/O Line No",
   "Project",
   "Quantity",
   "Status",
];

export const receiptInfoTitle = "Receipt Information";

export const poInfoTitle = "P/O Information";

export const lineDescriptionPlaceholder = "Enter line description";

export const voucherEntrySteps = [
   {
      title: "Entry Header",
      description: "",
      descriptionKey: "entryHeaderTotal",
   },
   {
      title: "Add Detail Line Item",
      description: "",
      descriptionKey: "lineItemDetails",
   },
];

export const entryTittle = "Entry Header";

export const vendorDetailsTitle = "Vendor Details";

export const vendorCardLabels = [
   "Vendor Details",
   "Company No",
   "Vendor No",
   "Entry No",
   "Process Type",
];

export const vendorCardValues = {
   vendor: "APPALACHIAN TRANSPORT INC, PO BOX 1473, SMETHPORT, PA 16749",
   companyNo: 10,
   vendorNo: 1001,
   entryNo: 92825,
   processType: "NORMAL",
};

export const apVoucherEntryTitle = "Voucher Entries";
export const VoucherEntryTitle = "A/P Voucher Entry";

export const processTypeText = "Process Type - Normal";

export const buttonLabels = {
   previous: "Back",
   next: "Next",
   submit: "Submit",
   cancel: "Cancel",
};

export const modalTitle = "Voucher #2221 Submitted";

export const modalDescription = "Voucher has been submitted successfully";

export const modalActions = [
   {
      name: "confirmModal",
      label: "Ok",
      onClick: () => {},
   },
];

export const iconAltTexts = {
   vendorIcon: "Vendor Icon",
   companyIcon: "Company Icon",
   vendorNoIcon: "Vendor No Icon",
   entryNoIcon: "Entry No Icon",
   processTypeIcon: "Process Type Icon",
};
export const createNewEntryTitle = "Create New Entry";

export const VOUCHER_ENTRY_TEXTS = {
   title: "Voucher Entry",
   voucherProcessSelection: "A/P Voucher Process Selection",
   voucherEntry: "Voucher Entry",
   voucherSearchPlaceholder: "Search for entry number",
   fetchEntries: "Fetch Entries",
   resetAlt: "Reset entries",
   vendorDetails: "Vendor Details",
   companyNo: "Company No",
   vendorNo: "Vendor No",
   postToPurchaseJournal: "Post to Purchase Journal",
   downloadTemplate: "Download Template",
   createNewEntry: "Create New Entry",
   plusIconAlt: "Plus Icon",
   vendorAddress: "APPALACHIAN TRANSPORT INC, PO BOX 1473, SMETHPORT, PA 16749",
   processTypeText: "Process Type - Normal",
   processTypeTextSogas: "Process Type - SOGAS",
};
export const PURCHASE_JOURNAL = {
   title: "Purchase Journal",
   purchaseJournalPrompt: "Purchase Journal Prompt",
   applyFilter: "Apply Filters",
   genReports: "Generated Reports",
   postRefresh: "Refresh",
};
export const CHECK_INQUIRY = {
   title: " Check Inquiry",
   checkPaymentHistory: "Check Payment History",
};
export const EMPLOYEE_EXPENSES = {
   title: "Employee Expense Export",
   subtitle: "ADP Employee Expenses Record Selection",
   genReports: "Generated Reports",
   postRefresh: "Refresh",
};
export const OPEN_PAYABLES = {
   title: "Open Payables",
   dueDate: "Open Payables by Due Date",
   Company: "Company",
};
export const VOUCHER_CONSTANTS = {
   TABLE_HEADERS,
   apVoucherEntryTitle,
};

export const AP_MENU_KEYS = {
   VOUCHER_MANAGEMENT: "voucher-management",
   VOUCHER_ENTRY: "voucher-entry",
   PURCHASE_JOURNAL: "purchase-journal",
   VOUCHER_PAYABLE_HISTORY: "voucher-payable-history",
   OPEN_PAYABLES: "open-payables",
   EMPLOYEE_EXPENSES: "employee-expenses",
   PAYMENT_SELECTION: "payment-selection",
   PRINT_CHECKS: "print-checks",
   CHECK_REGISTER: "check-register",
   VENDOR_MASTER: "vendor-master",
   AP_PERIOD_END: "ap-period",
   AP_REPORTS: "ap-reports",
   AP_MAINTENANCE: "ap-maintenance",
   GIFT_SECTION: "gift-section",
   CREATE_NEW_ENTRY: "create-new-entry",
};

export const AP_MENU_LABELS = {
   ACCOUNTS_PAYABLE: "Accounts Payable",
   VOUCHER_ENTRY: "Voucher Entry",
   CREATE_NEW_ENTRY: "Create New Entry",
};

export const DEFAULT_REDIRECT = AP_MENU_KEYS.VOUCHER_ENTRY;

export const MENU_KEYS = {
   VOUCHER_MANAGEMENT: "voucher-management",
   VOUCHER_MAINTENANCE: "voucher-maintenance",
   VOUCHER_ENTRY: "voucher-entry",
   CHECK_INQUIRY: "Check-inquiry",
   CHECK_INQUIRY_DETAIL: "Check-inquiry-detail",
   PURCHASE_JOURNAL: "purchase-journal",
   VOUCHER_PAYABLE_HISTORY: "voucher-payable-history",
   OPEN_PAYABLES: "open-payables",
   EMPLOYEE_EXPENSES_EXPORT: "employee-expenses-export",
   PAYMENT_CYCLE: "payment-cycle",
   PRINT_CHECKS: "print-checks",
   CHECK_REGISTER: "check-register",
   VENDOR_MASTER_INQUIRY: "vendor-maintenance",
   AP_PERIOD_END: "ap-period",
   AP_REPORTS: "ap-reports",
   AP_MAINTENANCE: "ap-maintenance",
   GIFT_SECTION: "gift-section",
   CREATE_NEW_ENTRY: "create-new-entry",
   UPDATE_ENTRY: "update-entry",
   CLEAR_CHECK: "clear-checks",
   VENDOR_MANAGEMENT: "vendor-management",
   VENDOR_OWNER_MAPPING: "vendor-owner-mapping",
   VENDOR_MONTH_YEAR_END_PROCESS: "vendor-month-year-end-process",
   VENDOR_FILE_MAINTENANCE_1099: "vendor-file-maintenance-1099",
   YEAR_END_1099_PROCESS_MENU: "year-end-1099-process-menu",
   UPDATE_1099_FILE: "update-1099-file",
   AUTH_GENERATE: "auth-generate",
};

export const MENU_LABELS = {
   ACCOUNTS_PAYABLE: "Accounts Payable",
   CREATE_NEW_ENTRY: "Create New Entry",
   UPDATE_ENTRY: "Update Entry",
   VOUCHER_ENTRY: "Voucher Entry",
   VOUCHER_MANAGEMENT: "voucher Management",
   CHECK_INQUIRY: "Check Inquiry",
   CHECK_INQUIRY_DETAIL: "Check Details",
   CREATE_BATCH: "Create Batch",
   VOUCHER_MAINTENANCE: "Voucher Maintenance",
   PURCHASE_JOURNAL: "Purchase Journal",
   PAYMENT_CYCLE: "Payment Cycle",
   AP_REPORTS: "A/P Reports Menu",
   AP_PERIOD_END: "A/P Period End",
   AP_MAINTENANCE: "A/P Maintenance",
   OPEN_PAYABLES: "Open Payables",
   CLEAR_CHECK: "Clear Checks",
   VENDOR_MANAGEMENT: "Vendor Management",
   VENDOR_MASTER_INQUIRY: "Vendor Maintenance",
   EMPLOYEE_EXPENSES_EXPORT: "Employee Expenses Export",
   VENDOR_OWNER_MAPPING: "Vendor Owner Mapping",
   VENDOR_MONTH_YEAR_END_PROCESS: "Vendor Month/Year End Process",
   VENDOR_FILE_MAINTENANCE_1099: "Vendor File Maintenance for 1099",
   YEAR_END_1099_PROCESS_MENU: "Year End 1099 Process Menu",
   UPDATE_1099_FILE: "Update 1099 File",
   AUTH_GENERATE: "Auth Generate",
};

export const ROUTES = {
   ACCOUNTS_PAYABLE: "/accounts-payable",
   VOUCHER_MANAGEMENT: "/accounts-payable/voucher-management",
   AP_REPORTSMENU: "/accounts-payable/voucher-management/ap-reports",
   AP_PeriodEnd: "/accounts-payable/voucher-management/ap-period",
   AP_Maintenance: "/accounts-payable/voucher-management/ap-maintenance",
   VOUCHER_MAINTENANACE: "/accounts-payable/voucher-maintenance",
   VOUCHER_ENTRY: "/accounts-payable/voucher-management/voucher-entry",
   PAYMENT_CYCLE: "/accounts-payable/payment-cycle",
   CREATE_NEW_ENTRY:
      "/accounts-payable/voucher-management/voucher-entry/create-new-entry",
   PURCHASE_JOURNAL: "/accounts-payable/voucher-management/purchase-journal",
   OPEN_PAYABLES: "/accounts-payable/voucher-management/open-payables",
   CHECK_INQUIRY: "/accounts-payable/voucher-management/check-inquiry",
   CHECK_INQUIRY_DETAIL:
      "/accounts-payable/check-inquiry/check-details/:checkNo",
   VENDOR_MANAGEMENT: "/accounts-payable/voucher-management/vendor-management",
   VENDOR_MASTER_INQUIRY:
      "/accounts-payable/voucher-management/vendor-maintenance",
   EMPLOYEE_EXPENSES_EXPORT:
      "/accounts-payable/voucher-management/employee-expenses-export",
   VENDOR_OWNER_MAPPING:
      "/accounts-payable/voucher-management/vendor-owner-mapping",

   VENDOR_MONTH_YEAR_END_PROCESS:
      "/accounts-payable/ap-period/vendor-month-year-end-process",
   VENDOR_FILE_MAINTENANCE_1099:
      "/accounts-payable/ap-period/vendor-file-maintenance-1099",
   YEAR_END_1099_PROCESS_MENU:
      "/accounts-payable/ap-period/year-end-1099-process-menu",
   UPDATE_1099_FILE: "/accounts-payable/ap-period/update-1099-file",
   CLEAR_CHECKS: "/accounts-payable/voucher-management/clear-checks",
   AUTH_GENERATE: "/accounts-payable/auth-generate",
};

export const AP_CARDS = [
   {
      title: "Voucher Management",
      desc: "Create, edit, and track payment vouchers for purchases",
      route: "voucher-management/voucher-entry/normal",
   },
   {
      title: "Purchase Journal",
      desc: "Manage journal purchase entries and related data",
      route: "voucher-management/purchase-journal",
   },
   {
      title: "Open Payables",
      desc: "View and manage unpaid supplier invoices",
      route: "open-payables",
   },
   {
      title: "Employee Expenses Export",
      desc: "Create, edit, and track payment vouchers for purchases",
      route: "employee-expenses-export",
   },
   {
      title: "Payment Cycle",
      desc: "Perform Payment Selection, Print Checks and Checks Register together",
      route: "payment-cycle",
   },
   {
      title: "Clear Checks",
      desc: "Upload, cancel and post checks",
      route: "clear-checks",
   },
   {
      title: "Vendor Management",
      desc: "Look up vendor details, history, account and owner details",
      route: "vendor-management/vendor-maintenance",
   },
   {
      title: "A/P Period end",
      desc: "Central navigation for all Accounts Payable-related tasks",
      route: "ap-period/vendor-month-year-end-process",
   },
   {
      title: "A/P Reports",
      desc: "Central navigation for all Accounts Payable-related tasks",
      route: "ap-reports",
   },
   {
      title: "A/P Maintenance",
      desc: "Central navigation for control file maintenance",
      route: "ap-maintenance",
   },
];

export const AP_TITLE = "Accounts Payable";
export const vendorOptions = [
   { value: "2339", label: "2339 - APPALACHIAN TRANSPORT INC" },
   { value: "2340", label: "2340 - NORTHWEST LOGISTICS LLC" },
   { value: "2341", label: "2341 - EASTERN FREIGHT CO" },
];
export const vendorNoName = "Vendor No / Name";
export const vendorPlaceholder = "Select Vendor No / Name";
export const LIST_ITEM_FIELDS = [
   "Product Amount",
   "Freight Amount",
   "Line Disc Amount",
   "Line Disc %",
   "Line Description",
   "Line G/L Account",
   "Line G/L Description",
   "Gallons",
   "Receipt No",
   "Project",
   "PO No",
   "PO Line #",
   "Quantity",
   "Status",
];

export const VoucherMaintenanceStatusCode = {
   NONE: " ",
   HOLD: "H",
   APPROVED: "A",
   WAITING: "W",
   ERROR: "E",
   UNAUTHORIZED: "U",
} as const;

export const STATUS_OPTIONS = [
   { value: "A", label: "Active" },
   { value: "I", label: "Inactive" },
];
export const STEP_TWO_STATUS_OPTIONS = [
   { value: "O", label: "Open" },
   { value: "C", label: "Close" },
];

export const VOUCHER_STATUS_OPTIONS = [
   { value: VoucherMaintenanceStatusCode.HOLD, label: "Hold" },
   { value: VoucherMaintenanceStatusCode.APPROVED, label: "ACH" },
   { value: VoucherMaintenanceStatusCode.WAITING, label: "Wire Transfer" },
   { value: VoucherMaintenanceStatusCode.ERROR, label: "Employee Expense" },
   { value: VoucherMaintenanceStatusCode.UNAUTHORIZED, label: "Utility" },
   { value: VoucherMaintenanceStatusCode.NONE, label: "None" },
];

export const INITIAL_LINE_ITEMS = [];

export const REQUIRED_FIELDS = ["Product Amount", "Line G/L Account", "Line Description"];
export const INPUT_GROUPS = [
   ["Product Amount", "Freight Amount", "Line Disc Amount", "Line Disc %"],
   ["Line Description", "Line G/L Account", "Line G/L Description", ""],
   ["Gallons", "Receipt No"],
   ["PO No", "PO Line #", "Project"],
   ["Quantity"],
   ["Status"],
];
export const PANEL_LABELS = [
   ["Product Amount", "Product Amount"],
   ["G/L Account", "G/L Account"],
   ["Line Description", "Line Description"],
   ["Discount Amount", "Discount Amount"],
   ["PO Number", "PO Number"],
];

export const SECTION_TITLES = {
   detailLineItems: "Detail Line Items",
   receiptInformation: "Receipt Information",
   poInformation: "PO Information",
};

export const BUTTON_LABELS = {
   addItem: "Add Item",
};

export const LINE_ITEM_TITLE = "Line Item";
export const DELETE_ALT_TEXT = "Delete";

export const PLACEHOLDER_PREFIX = "Enter";
export const STATUS_PLACEHOLDER = "Select Status";

export const FLEXI_PROCESS_CONSTANTS = {
   processTitle: "Voucher Entries",
   processTypeLabel: "Process Type - Flexi",
   modalTitles: {
      view: "Voucher Details",
      edit: "Edit Voucher Details",
   },
   cards: {
      totalInvoiceAmount: "Total Invoice Amount",
      uploadedRecords: "Total Uploaded Records",
      totalSuccesses: "Total Successes",
      totalWarnings: "Total Warnings",
      totalErrors: "Total Errors",
   },
   tableColumns: {
      actions: "Actions",
      invoiceNo: "Invoice No",
      invoiceDue:"Due Date",
      DiscountAmount: "Discount Amount",
      invoiceAmount: "Invoice Amount",
      invoiceDate: "Invoice Date",
      discountDue: "Discount Due",
      discountDueDate: "Discount Due Date",
      vendorName: "Vendor Name",
      vendorNo: "Vendor No",
      orderNo: "Order No",
      status: "Status",
   },
};
export const UPLOAD_CSV_MODAL_TEXTS = {
   TITLE: "Upload CSV",
   INSTRUCTION: "Click or drag file to this area to upload",
   OR_TEXT: "or",
   BROWSE_BUTTON: "Browse Files",
   SUPPORTED_FORMAT: "Supported format: Excel, CSV",
   MAX_FILE_SIZE: "File size should be maximum 25MB",
   ERROR_FILE_TYPE: "You can only upload CSV files!",
   ERROR_FILE_SIZE: "File must be smaller than 25MB!",
   SUCCESS_MESSAGE: "file uploaded successfully.",
};
export const customPlaceholders: Record<string, string> = {
   "Invoice No": "Enter Invoice No",
   "Invoice Amount": "Enter Invoice Amount",
   "Account Pay G/L": "Enter Account Pay G/L",
   "Bank Acct G/L": "Enter Bank Acct G/L",
   Retention: "Enter Retention Amount",
   Freight: "Enter Freight Charges",
   "Freight Amount": "Enter Freight Amount",
   "Sales Order": "Enter Sales Order No",
   SRN: "Enter SRN",
   "Company No": "Enter Company No",
   "Vendor No": "Enter Vendor No",
   "PO No": "Enter PO No",
   "PO Number": "Enter PO Number",
   "PO Line #": "Enter PO Line No",
   Quantity: "Enter Quantity",
   Gallons: "Enter Gallons",
   "Line Disc %": "Enter Line Discount %",
   Vendor: "Enter Vendor Name",
   "Vendor Invoice No": "Enter Vendor Invoice No",
   "Invoice Description": "Enter Invoice Description",
   "Address Line 1": "Enter Address Line 1",
   "Address Line 2": "Enter Address Line 2",
   "Address Line 3": "Enter Address Line 3",
   "Address Line 4": "Enter Address Line 4",
   "Hold Description": "Enter Hold Description",
   "Prepaid Check No": "Enter Prepaid Check No",
   "Check Date": "Select Check Date",
   "Process Type": "Enter Process Type",
};

export const stepOneRequiredFields = [
   "Invoice No",
   "Invoice Amount",
   "Invoice Date",
];

export const stepTwoRequiredFields = ["Product Amount", "Line G/L Account", "Line Description"];

export const fieldMaxLengthMap: Record<string, number> = {
   "Invoice No": 20,
   "Invoice Amount": 12,
   "Account Pay G/L": 8,
   "Bank Acct G/L": 8,
   Retention: 4,
   // Freight: 12,
   "Sales Order": 6,
   SRN: 6,
   "Company No": 2,
   "Vendor No": 5,
   "PO No": 10,
   "PO Number": 10,
   "PO Line #": 3,
   Quantity: 10,
   Gallons: 10,
   "Line Disc %": 6,
   "Invoice Description": 25,
   "Vendor Name": 30,
   "Address Line 1": 30,
   "Address Line 2": 30,
   "Address Line 3": 30,
   "Address Line 4": 30,
   "Process Type": 2,
   "Prepaid Check No": 6,
};

export const stepTwoFieldMaxLengthMap: Record<string, number> = {
   "Line G/L Account": 8,
   "Line Description": 25,
   "Product Amount": 12,
   "Freight Amount": 12,
   "Line Disc Amount": 12,
   Quantity: 11,
   Gallons: 7,
   "Receipt No": 7,
   "Inventory Item": 13,
   "PO No": 30,
   "PO Line #": 3,
   "Job No": 6,
   "Extra Job Field": 2,
   "Cost Code": 6,
   "Job Cost Type": 2,
   "Job Cost Quantity": 7,
   "Unit of Measure": 2,
};

export const vendorFieldMaxLengthMap: Record<string, number> = {
   "Single Check": 1,
   "Expense G/L": 8,
};
export const labelMap: Record<string, string> = {
   lineGlNo: "Line G/L Account",
   apGLNo: "Line G/L Account",
   lineDesc: "Line Description",
   lineAmount: "Product Amount",
   freightAmount: "Freight Amount",
   discountAmount: "Line Disc Amount",
   discountPercentage: "Line Disc %",
   inventoryItem: "Inventory Item",
   quantity: "Quantity",
   jobNo: "Job No",
   jobCostCode: "Cost Code",
   jobCostType: "Job Cost Type",
   jobCostQuantity: "Job Cost Quantity",
   gallons: "Gallons",
   receiptNo: "Receipt No",
   poLineNo: "PO Line #",
   poNo: "PO No",
};

export const numericFields = new Set([
   "Invoice No",
   "Invoice Amount",
   "Account Pay G/L",
   "Bank Acct G/L",
   "Retention",
   "Freight",
   "Sales Order",
   "SRN",
   "Company No",
   "Vendor No",
   "PO No",
   "PO Number",
   "PO Line #",
   "Quantity",
   "Gallons",
   "Line Disc %",
   "Vendor Invoice No",
]);

export const VOUCHER_ENTRY_COLUMN_LABELS = {
   entryNo: "Entry No",
   actions: "Actions",
   selectAllAria: "Select all rows",
   selectRowAria: (key: string) => `Select row ${key}`,
   viewTooltip: "View",
   editTooltip: "Edit",
   deleteTooltip: "Delete voucher entry",
   viewAlt: "View voucher entry",
   editAlt: "Edit voucher entry",
   deleteAlt: "Delete voucher entry",
   fileAlt: "file",
};

export const VOUCHER_ENTRY_FILTER_TEXTS = {
   lessThan5000: "< 5000",
   greaterThan5000: "> 5000",
   clearFilter: "Clear Filter",
};

export const VOUCHER_ENTRY_MESSAGES = {
   noDataFound: "No voucher data found.",
   fetchError: "Failed to fetch voucher data. Please try again.",
   deleteSuccess: "Voucher deleted successfully.",
   deleteError: "An error occurred while deleting the voucher.",
   deleteFailure: "Failed to delete voucher.",
   selectAtLeastOne: "Please select at least one row.",
};

export const VOUCHER_ENTRY_DATE_KEYS = [
   "invoiceDate",
   "dueDate",
   "discountDueDate",
];
export const voucherTypesOptions = [
   { label: "All", value: "ALL" },
   { label: "Unpaid", value: "UNPAID" },
   { label: "Paid", value: "PAID" },
];
export const REPORT_TYPE_OPTIONS = [
   { label: "Purchase Summary", value: "purchase_summary" },
   { label: "Payment Ledger", value: "payment_ledger" },
   { label: "Vendor Aging", value: "vendor_aging" },
];

export const REPORTS_LABEL = {
   BUTTON_LABELS: "Generate Report",
   title: "A/P Monthly Audit Report",
   genReports: "Generated Reports",
   postRefresh: "Refresh",
   outstandingTitle: "Outstanding Check Register",
};
export const MAINTENANCE_OPTIONS = [
   { label: "Vendor Maintenance", value: "vendor_maintenance" },
   { label: "Payment Maintenance", value: "payment_maintenance" },
   { label: "Check Maintenance", value: "check_maintenance" },
];
export const PERIOD_LABEL = {
   title: "Vendor Month/Year End Process",
};
export const MODIFY_STATUS_OPTION = [
   { label: "Approved", value: "APPROVED" },
   { label: "Pending", value: "PENDING" },
   { label: "Rejected", value: "REJECTED" },
];

export const CHAR_LIMIT = 100;

export const dropdownOptions = [
   { value: "Check", label: "Check" },
   { value: "ACH", label: "ACH" },
   { value: "Wire", label: "Wire" },
];
export const payHoldOptions = [
   { value: "Pay", label: "Pay" },
   { value: "Hold", label: "Hold" },
   { value: "Partial", label: "Partial" },
];

export const singleCheckOptions = [
   { value: "Yes", label: "Yes" },
   { value: "No", label: "No" },
   { value: "Combined", label: "Combined" },
];

export const makePrepaidOptions = [
   { value: "Yes", label: "Yes" },
   { value: "No", label: "No" },
   { value: "Pending", label: "Pending" },
];

export const TYPE_OPTIONS = [
   { label: "All", value: "" },
   { label: "ACH", value: "ACH" },
   { label: "Wire", value: "Wire" },
   { label: "Employee", value: "Employee" },
   { label: "Hold", value: "Hold" },
   { label: "Check", value: "Check" },
];

export const STATUS_OPTION = [
   { label: "All", value: "" },
   { label: "Active", value: "Active" },
   { label: "Inactive", value: "Inactive" },
];

export const statusOptions = [
   { label: "All", value: "" },
   { label: "Active", value: "A" },
   { label: "Inactive", value: "I" },
];
