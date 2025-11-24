export const RightsMap = [
  {
    "path": "/account-payable/voucher/companies",
    "operationId": "getCompanies",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::companies::read"
    ]
  },
  {
    "path": "/account-payable/voucher/process-types",
    "operationId": "getProcessTypes",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::process-types::read"
    ]
  },
  {
    "path": "/account-payable/voucher/vendors",
    "operationId": "getAllVendors",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::vendors::read"
    ]
  },
  {
    "path": "/account-payable/voucher/get-vendor-by-id",
    "operationId": "getVendorById",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::get-vendor-by-id::read"
    ]
  },
  {
    "path": "/account-payable/voucher/get-voucher-entry",
    "operationId": "getVoucherEntry",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::get-voucher-entry::read"
    ]
  },
  {
    "path": "/account-payable/voucher/entry/:entryNo",
    "operationId": "getDataByEntryNo",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::entry::entryNo::read"
    ]
  },
  {
    "path": "/account-payable/voucher/entry/submit",
    "operationId": "submitVoucher",
    "method": "POST",
    "accessRights": [
      "account-payable::voucher::entry::submit::create",
      "account-payable::voucher::entry::submit::update"
    ]
  },
  {
    "path": "/account-payable/voucher/header-validation",
    "operationId": "submitHeaderValidation",
    "method": "POST",
    "accessRights": [
      "account-payable::voucher::header-validation::create",
      "account-payable::voucher::header-validation::update"
    ]
  },
  {
    "path": "/account-payable/voucher/config",
    "operationId": "getVoucherConfig",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::config::read"
    ]
  },
  {
    "path": "/account-payable/voucher/voucher",
    "operationId": "softDeleteVoucher",
    "method": "DELETE",
    "accessRights": [
      "account-payable::voucher::voucher::delete"
    ]
  },
  {
    "path": "/account-payable/voucher/gl-master",
    "operationId": "getGlMaster",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::gl-master::read"
    ]
  },
  {
    "path": "/account-payable/voucher/flexi/upload",
    "operationId": "uploadCsv",
    "method": "POST",
    "accessRights": [
      "account-payable::voucher::flexi::upload::create",
      "account-payable::voucher::flexi::upload::update"
    ]
  },
  {
    "path": "/account-payable/voucher/sogas/upload",
    "operationId": "uploadSogasCsv",
    "method": "POST",
    "accessRights": [
      "account-payable::voucher::sogas::upload::create",
      "account-payable::voucher::sogas::upload::update"
    ]
  },
  {
    "path": "/account-payable/voucher/sogas/entries",
    "operationId": "getSogasEntry",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::sogas::entries::read"
    ]
  },
  {
    "path": "/account-payable/voucher/flexi/entries",
    "operationId": "getFlexiEntry",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::flexi::entries::read"
    ]
  },
  {
    "path": "/account-payable/voucher/paper/batch-entries",
    "operationId": "getCarrierInvoices",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::paper::batch-entries::read"
    ]
  },
  {
    "path": "/account-payable/voucher/paper/entries",
    "operationId": "getPaperEntry",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::paper::entries::read"
    ]
  },
  {
    "path": "/account-payable/voucher/paper/batch",
    "operationId": "paperBatchCreate",
    "method": "POST",
    "accessRights": [
      "account-payable::voucher::paper::batch::create",
      "account-payable::voucher::paper::batch::update"
    ]
  },
  {
    "path": "/account-payable/voucher/lms/entries",
    "operationId": "getLmsEntry",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::lms::entries::read"
    ]
  },
  {
    "path": "/account-payable/voucher/lms/batch-entries",
    "operationId": "getLmsCarrierInvoices",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::lms::batch-entries::read"
    ]
  },
  {
    "path": "/account-payable/voucher/lms/batch",
    "operationId": "lmsBatchCreate",
    "method": "POST",
    "accessRights": [
      "account-payable::voucher::lms::batch::create",
      "account-payable::voucher::lms::batch::update"
    ]
  },
  {
    "path": "/account-payable/voucher/detail",
    "operationId": "softDeleteVoucherDetail",
    "method": "POST",
    "accessRights": [
      "account-payable::voucher::detail::create",
      "account-payable::voucher::detail::update"
    ]
  },
  {
    "path": "/account-payable/voucher/cache",
    "operationId": "cacheData",
    "method": "POST",
    "accessRights": [
      "account-payable::voucher::cache::create",
      "account-payable::voucher::cache::update"
    ]
  },
  {
    "path": "/account-payable/voucher/summary",
    "operationId": "getVoucherSummary",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::summary::read"
    ]
  },
  {
    "path": "/voucher-maintenance",
    "operationId": "voucherMaintenance",
    "method": "GET",
    "accessRights": [
      "voucher-maintenance::read"
    ]
  },
  {
    "path": "/voucher-maintenance/summary",
    "operationId": "getVoucherMaintenanceSummary",
    "method": "GET",
    "accessRights": [
      "voucher-maintenance::summary::read"
    ]
  },
  {
    "path": "/voucher-maintenance/status",
    "operationId": "updateVoucherMaintenanceStatus",
    "method": "POST",
    "accessRights": [
      "voucher-maintenance::status::create",
      "voucher-maintenance::status::update"
    ]
  },
  {
    "path": "/voucher-maintenance/:voucherNo",
    "operationId": "getVoucherMaintenanceById",
    "method": "GET",
    "accessRights": [
      "voucher-maintenance::voucherNo::read"
    ]
  },
  {
    "path": "/voucher-maintenance/discount",
    "operationId": "updateVoucherDiscount",
    "method": "POST",
    "accessRights": [
      "voucher-maintenance::discount::create",
      "voucher-maintenance::discount::update"
    ]
  },
  {
    "path": "/voucher-maintenance/transfer",
    "operationId": "transferVoucher",
    "method": "POST",
    "accessRights": [
      "voucher-maintenance::transfer::create",
      "voucher-maintenance::transfer::update"
    ]
  },
  {
    "path": "/vendor-management/types",
    "operationId": "getVendorTypes",
    "method": "GET",
    "accessRights": [
      "vendor-management::types::read"
    ]
  },
  {
    "path": "/vendor-management/list",
    "operationId": "getVendorList",
    "method": "GET",
    "accessRights": [
      "vendor-management::list::read"
    ]
  },
  {
    "path": "/vendor-management",
    "operationId": "createOrUpdateVendor",
    "method": "POST",
    "accessRights": [
      "vendor-management::create",
      "vendor-management::update"
    ]
  },
  {
    "path": "/vendor-management/owner-mapping",
    "operationId": "getOwnerMappingList",
    "method": "GET",
    "accessRights": [
      "vendor-management::owner-mapping::read"
    ]
  },
  {
    "path": "/vendor-management/owner",
    "operationId": "getOwnerDetails",
    "method": "GET",
    "accessRights": [
      "vendor-management::owner::read"
    ]
  },
  {
    "path": "/vendor-management/owner",
    "operationId": "CreateAndUpdateOwner",
    "method": "POST",
    "accessRights": [
      "vendor-management::owner::create",
      "vendor-management::owner::update"
    ]
  },
  {
    "path": "/vendor-management/owner-no/list",
    "operationId": "getOwnerNoList",
    "method": "GET",
    "accessRights": [
      "vendor-management::owner-no::list::read"
    ]
  },
  {
    "path": "/vendor-management/config",
    "operationId": "getNextVendorNoConfig",
    "method": "GET",
    "accessRights": [
      "vendor-management::config::read"
    ]
  },
  {
    "path": "/vendor-management/details",
    "operationId": "getVendorDetails",
    "method": "GET",
    "accessRights": [
      "vendor-management::details::read"
    ]
  },
  {
    "path": "/vendor-management/all-vendors",
    "operationId": "getAllVendorsList",
    "method": "GET",
    "accessRights": [
      "vendor-management::all-vendors::read"
    ]
  },
  {
    "path": "/reports-menu",
    "operationId": "getReportsMenu",
    "method": "GET",
    "accessRights": [
      "reports-menu::read"
    ]
  },
  {
    "path": "/reports-menu/submit",
    "operationId": "submitReportsMenu",
    "method": "POST",
    "accessRights": [
      "reports-menu::submit::create",
      "reports-menu::submit::update"
    ]
  },
  {
    "path": "/purchase-journal",
    "operationId": "purchaseJournalReports",
    "method": "GET",
    "accessRights": [
      "purchase-journal::reports::read"
    ]
  },
  {
    "path": "/purchase-journal/submit",
    "operationId": "submitPurchaseJournal",
    "method": "POST",
    "accessRights": [
      "purchase-journal::submit::create",
      "purchase-journal::submit::update"
    ]
  },
  {
    "path": "/payment/types",
    "operationId": "getAllVoucherPaymentTypes",
    "method": "GET",
    "accessRights": [
      "payment::types::read"
    ]
  },
  {
    "path": "/payment/selection/type",
    "operationId": "submitPaymentSelectionType",
    "method": "POST",
    "accessRights": [
      "payment::selection::type::create",
      "payment::selection::type::update"
    ]
  },
  {
    "path": "/payment/selection/payment-vendor",
    "operationId": "submitVendorPayment",
    "method": "POST",
    "accessRights": [
      "payment::selection::payment-vendor::create",
      "payment::selection::payment-vendor::update"
    ]
  },
  {
    "path": "/payment/cash-requirement/reports",
    "operationId": "getCashRequirementReports",
    "method": "GET",
    "accessRights": [
      "payment::cash-requirement::reports::read"
    ]
  },
  {
    "path": "/payment/ap-check/reports",
    "operationId": "getApCheckReports",
    "method": "GET",
    "accessRights": [
      "payment::ap-check::reports::read"
    ]
  },
  {
    "path": "/open-payables",
    "operationId": "getOpenPayablesReport",
    "method": "GET",
    "accessRights": [
      "open-payables::read"
    ]
  },
  {
    "path": "/open-payables",
    "operationId": "openPayableGenerateReport",
    "method": "POST",
    "accessRights": [
      "open-payables::create",
      "open-payables::update"
    ]
  },
  {
    "path": "/global-states/reports/:name",
    "operationId": "GetReportDetails",
    "method": "GET",
    "accessRights": [
      "global-states::reports::name::read"
    ]
  },
  {
    "path": "/global-states/reports",
    "operationId": "GenerateReport",
    "method": "POST",
    "accessRights": [
      "global-states::reports::create",
      "global-states::reports::update"
    ]
  },
  {
    "path": "/global-states/reports",
    "operationId": "GetAllReportNames",
    "method": "GET",
    "accessRights": [
      "global-states::reports::read"
    ]
  },
  {
    "path": "/global-states/list-options",
    "operationId": "GetDropdownData",
    "method": "GET",
    "accessRights": [
      "global-states::list-options::read"
    ]
  },
  {
    "path": "/global-states/general-system-company/:companyNo",
    "operationId": "GetGeneralSystemCompany",
    "method": "GET",
    "accessRights": [
      "global-states::general-system-company::companyNo::read"
    ]
  },
  {
    "path": "/global-states/general-system-company/:companyNo",
    "operationId": "getAuthCodeChecker",
    "method": "GET",
    "accessRights": [
      "global-states::general-system-company::companyNo::read"
    ]
  },
  {
    "path": "/global-states/general-system-company/:companyNo",
    "operationId": "generateAuthCode",
    "method": "POST",
    "accessRights": [
      "global-states::general-system-company::companyNo::create",
      "global-states::general-system-company::companyNo::update"
    ]
  },
  {
    "path": "/global-states/reports/generate",
    "operationId": "generateReportFiles",
    "method": "POST",
    "accessRights": [
      "global-states::reports::generate::create",
      "global-states::reports::generate::update"
    ]
  },
  {
    "path": "/employee-expense/reports",
    "operationId": "getEmployeeExpenseReports",
    "method": "GET",
    "accessRights": [
      "employee-expense::reports::read"
    ]
  },
  {
    "path": "/employee-expense/generate",
    "operationId": "generateReportEmployeeExpense",
    "method": "POST",
    "accessRights": [
      "employee-expense::generate::create",
      "employee-expense::generate::update"
    ]
  },
  {
    "path": "/clear-checks/upload",
    "operationId": "uploadClearChecks",
    "method": "POST",
    "accessRights": [
      "clear-checks::upload::create",
      "clear-checks::upload::update"
    ]
  },
  {
    "path": "/clear-checks/validate",
    "operationId": "validateSingleCheck",
    "method": "POST",
    "accessRights": [
      "clear-checks::validate::create",
      "clear-checks::validate::update"
    ]
  },
  {
    "path": "/clear-checks/process",
    "operationId": "processMultipleChecks",
    "method": "POST",
    "accessRights": [
      "clear-checks::process::create",
      "clear-checks::process::update"
    ]
  },
  {
    "path": "/check-inquiry/payment-history",
    "operationId": "getPyamentHistory",
    "method": "GET",
    "accessRights": [
      "check-inquiry::payment-history::read"
    ]
  },
  {
    "path": "/check-inquiry/last-payment-info",
    "operationId": "getLastPaymentInfo",
    "method": "GET",
    "accessRights": [
      "check-inquiry::last-payment-info::read"
    ]
  },
  {
    "path": "/check-inquiry/voucher-detail",
    "operationId": "getVoucherDetails",
    "method": "GET",
    "accessRights": [
      "check-inquiry::voucher-detail::read"
    ]
  },
  {
    "path": "/ap-period-end/vendors",
    "operationId": "getVendorsByYear",
    "method": "GET",
    "accessRights": [
      "ap-period-end::vendors::read"
    ]
  },
  {
    "path": "/ap-period-end/vendor-year-end-process",
    "operationId": "vendorYearEndProcess",
    "method": "POST",
    "accessRights": [
      "ap-period-end::vendor-year-end-process::create",
      "ap-period-end::vendor-year-end-process::update"
    ]
  },
  {
    "path": "/ap-period-end/year-end-process-menu/review-files",
    "operationId": "getYearEndProcessMenuReviewFiles",
    "method": "GET",
    "accessRights": [
      "ap-period-end::year-end-process-menu::review-files::read"
    ]
  },
  {
    "path": "/ap-period-end/record",
    "operationId": "getApPeriodEndReports",
    "method": "GET",
    "accessRights": [
      "ap-period-end::record::read"
    ]
  },
  {
    "path": "/ap-period-end",
    "operationId": "postApPeriodEndReports",
    "method": "POST",
    "accessRights": [
      "ap-period-end::create",
      "ap-period-end::update"
    ]
  },
  {
    "path": "/ap-period-end/company",
    "operationId": "getCompanyDetails",
    "method": "GET",
    "accessRights": [
      "ap-period-end::company::read"
    ]
  },
  {
    "path": "/ap-period-end",
    "operationId": "getAllApPeriodEndReports",
    "method": "GET",
    "accessRights": [
      "ap-period-end::read"
    ]
  },
  {
    "path": "/ap-period-end/record",
    "operationId": "softDeleteRecord",
    "method": "DELETE",
    "accessRights": [
      "ap-period-end::record::delete"
    ]
  },
  {
    "path": "/ap-period-end/:year/vendors/:vendorNo",
    "operationId": "getVendorDetailsByYear",
    "method": "GET",
    "accessRights": [
      "ap-period-end::year::vendors::vendorNo::read"
    ]
  },
  {
    "path": "/ap-period-end/:year/vendors/:vendorNo",
    "operationId": "updateVendorByYear",
    "method": "POST",
    "accessRights": [
      "ap-period-end::year::vendors::vendorNo::create",
      "ap-period-end::year::vendors::vendorNo::update"
    ]
  },
  {
    "path": "/ap-maintenance/company",
    "operationId": "companyMaintenance",
    "method": "GET",
    "accessRights": [
      "ap-maintenance::company::read"
    ]
  },
  {
    "path": "/ap-maintenance/company",
    "operationId": "updateCompanyMaintenance",
    "method": "POST",
    "accessRights": [
      "ap-maintenance::company::create",
      "ap-maintenance::company::update"
    ]
  },
  {
    "path": "/ap-global-states/reportTypes/:type",
    "operationId": "ProcessType",
    "method": "GET",
    "accessRights": [
      "ap-global-states::reportTypes::type::read"
    ]
  }
];
