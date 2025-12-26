export const RightsMap = [
  {
    "path": "/account-payable/voucher/companies",
    "operationId": "getCompanies",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::companies::r"
    ]
  },
  {
    "path": "/account-payable/voucher/process-types",
    "operationId": "getProcessTypes",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::process-types::r"
    ]
  },
  {
    "path": "/account-payable/voucher/vendors",
    "operationId": "getAllVendors",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::vendors::r"
    ]
  },
  {
    "path": "/account-payable/voucher/get-vendor-by-id",
    "operationId": "getVendorById",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::get-vendor-by-id::r"
    ]
  },
  {
    "path": "/account-payable/voucher/get-voucher-entry",
    "operationId": "getVoucherEntry",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::get-voucher-entry::r"
    ]
  },
  {
    "path": "/account-payable/voucher/entry/:entryNo",
    "operationId": "getDataByEntryNo",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::entry::entryNo::r"
    ]
  },
  {
    "path": "/account-payable/voucher/entry/submit",
    "operationId": "submitVoucher",
    "method": "POST",
    "accessRights": [
      "account-payable::voucher::entry::submit::rw"
    ]
  },
  {
    "path": "/account-payable/voucher/header-validation",
    "operationId": "submitHeaderValidation",
    "method": "POST",
    "accessRights": [
      "account-payable::voucher::header-validation::rw"
    ]
  },
  {
    "path": "/account-payable/voucher/config",
    "operationId": "getVoucherConfig",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::config::r"
    ]
  },
  {
    "path": "/account-payable/voucher/voucher",
    "operationId": "softDeleteVoucher",
    "method": "DELETE",
    "accessRights": [
      "account-payable::voucher::voucher::delete::rw"
    ]
  },
  {
    "path": "/account-payable/voucher/gl-master",
    "operationId": "getGlMaster",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::gl-master::r"
    ]
  },
  {
    "path": "/account-payable/voucher/flexi/upload",
    "operationId": "uploadCsv",
    "method": "POST",
    "accessRights": [
      "account-payable::voucher::flexi::upload::rw"
    ]
  },
  {
    "path": "/account-payable/voucher/sogas/upload",
    "operationId": "uploadSogasCsv",
    "method": "POST",
    "accessRights": [
      "account-payable::voucher::sogas::upload::rw"
    ]
  },
  {
    "path": "/account-payable/voucher/sogas/entries",
    "operationId": "getSogasEntry",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::sogas::entries::r"
    ]
  },
  {
    "path": "/account-payable/voucher/flexi/entries",
    "operationId": "getFlexiEntry",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::flexi::entries::r"
    ]
  },
  {
    "path": "/account-payable/voucher/paper/batch-entries",
    "operationId": "getCarrierInvoices",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::paper::batch-entries::r"
    ]
  },
  {
    "path": "/account-payable/voucher/paper/entries",
    "operationId": "getPaperEntry",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::paper::entries::r"
    ]
  },
  {
    "path": "/account-payable/voucher/paper/batch",
    "operationId": "paperBatchCreate",
    "method": "POST",
    "accessRights": [
      "account-payable::voucher::paper::batch::rw"
    ]
  },
  {
    "path": "/account-payable/voucher/lms/entries",
    "operationId": "getLmsEntry",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::lms::entries::r"
    ]
  },
  {
    "path": "/account-payable/voucher/lms/batch-entries",
    "operationId": "getLmsCarrierInvoices",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::lms::batch-entries::r"
    ]
  },
  {
    "path": "/account-payable/voucher/lms/batch",
    "operationId": "lmsBatchCreate",
    "method": "POST",
    "accessRights": [
      "account-payable::voucher::lms::batch::rw"
    ]
  },
  {
    "path": "/account-payable/voucher/detail",
    "operationId": "softDeleteVoucherDetail",
    "method": "POST",
    "accessRights": [
      "account-payable::voucher::detail::rw"
    ]
  },
  {
    "path": "/account-payable/voucher/cache",
    "operationId": "cacheData",
    "method": "POST",
    "accessRights": [
      "account-payable::voucher::cache::rw"
    ]
  },
  {
    "path": "/account-payable/voucher/summary",
    "operationId": "getVoucherSummary",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::summary::r"
    ]
  },
  {
    "path": "/account-payable/voucher/calculate-due-dates",
    "operationId": "getCalculatedDueDates",
    "method": "GET",
    "accessRights": [
      "account-payable::voucher::calculate-due-dates::r"
    ]
  },
  {
    "path": "/voucher-maintenance",
    "operationId": "voucherMaintenance",
    "method": "GET",
    "accessRights": [
      "voucher-maintenance::r"
    ]
  },
  {
    "path": "/voucher-maintenance/summary",
    "operationId": "getVoucherMaintenanceSummary",
    "method": "GET",
    "accessRights": [
      "voucher-maintenance::summary::r"
    ]
  },
  {
    "path": "/voucher-maintenance/status",
    "operationId": "updateVoucherMaintenanceStatus",
    "method": "POST",
    "accessRights": [
      "voucher-maintenance::status::rw"
    ]
  },
  {
    "path": "/voucher-maintenance/:voucherNo",
    "operationId": "getVoucherMaintenanceById",
    "method": "GET",
    "accessRights": [
      "voucher-maintenance::voucherNo::r"
    ]
  },
  {
    "path": "/voucher-maintenance/discount",
    "operationId": "updateVoucherDiscount",
    "method": "POST",
    "accessRights": [
      "voucher-maintenance::discount::rw"
    ]
  },
  {
    "path": "/voucher-maintenance/transfer",
    "operationId": "transferVoucher",
    "method": "POST",
    "accessRights": [
      "voucher-maintenance::transfer::rw"
    ]
  },
  {
    "path": "/vendor-management/types",
    "operationId": "getVendorTypes",
    "method": "GET",
    "accessRights": [
      "vendor-management::types::r"
    ]
  },
  {
    "path": "/vendor-management/list",
    "operationId": "getVendorList",
    "method": "GET",
    "accessRights": [
      "vendor-management::list::r"
    ]
  },
  {
    "path": "/vendor-management",
    "operationId": "createOrUpdateVendor",
    "method": "POST",
    "accessRights": [
      "vendor-management::rw"
    ]
  },
  {
    "path": "/vendor-management/owner-mapping",
    "operationId": "getOwnerMappingList",
    "method": "GET",
    "accessRights": [
      "vendor-management::owner-mapping::r"
    ]
  },
  {
    "path": "/vendor-management/owner",
    "operationId": "getOwnerDetails",
    "method": "GET",
    "accessRights": [
      "vendor-management::owner::r"
    ]
  },
  {
    "path": "/vendor-management/owner",
    "operationId": "CreateAndUpdateOwner",
    "method": "POST",
    "accessRights": [
      "vendor-management::owner::rw"
    ]
  },
  {
    "path": "/vendor-management/owner-no/list",
    "operationId": "getOwnerNoList",
    "method": "GET",
    "accessRights": [
      "vendor-management::owner-no::list::r"
    ]
  },
  {
    "path": "/vendor-management/config",
    "operationId": "getNextVendorNoConfig",
    "method": "GET",
    "accessRights": [
      "vendor-management::config::r"
    ]
  },
  {
    "path": "/vendor-management/details",
    "operationId": "getVendorDetails",
    "method": "GET",
    "accessRights": [
      "vendor-management::details::r"
    ]
  },
  {
    "path": "/vendor-management/all-vendors",
    "operationId": "getAllVendorsList",
    "method": "GET",
    "accessRights": [
      "vendor-management::all-vendors::r"
    ]
  },
  {
    "path": "/reports-menu",
    "operationId": "getReportsMenu",
    "method": "GET",
    "accessRights": [
      "reports-menu::r"
    ]
  },
  {
    "path": "/reports-menu/submit",
    "operationId": "submitReportsMenu",
    "method": "POST",
    "accessRights": [
      "reports-menu::submit::rw"
    ]
  },
  {
    "path": "/purchase-journal",
    "operationId": "purchaseJournalReports",
    "method": "GET",
    "accessRights": [
      "purchase-journal::reports::r"
    ]
  },
  {
    "path": "/purchase-journal/submit",
    "operationId": "submitPurchaseJournal",
    "method": "POST",
    "accessRights": [
      "purchase-journal::submit::rw"
    ]
  },
  {
    "path": "/payment/types",
    "operationId": "getAllVoucherPaymentTypes",
    "method": "GET",
    "accessRights": [
      "payment::types::r"
    ]
  },
  {
    "path": "/payment/selection/type",
    "operationId": "submitPaymentSelectionType",
    "method": "POST",
    "accessRights": [
      "payment::selection::type::rw"
    ]
  },
  {
    "path": "/payment/selection/payment-vendor",
    "operationId": "submitVendorPayment",
    "method": "POST",
    "accessRights": [
      "payment::selection::payment-vendor::rw"
    ]
  },
  {
    "path": "/payment/cash-requirement/reports",
    "operationId": "getCashRequirementReports",
    "method": "GET",
    "accessRights": [
      "payment::cash-requirement::reports::r"
    ]
  },
  {
    "path": "/payment/ap-check/reports",
    "operationId": "getApCheckReports",
    "method": "GET",
    "accessRights": [
      "payment::ap-check::reports::r"
    ]
  },
  {
    "path": "/open-payables",
    "operationId": "getOpenPayablesReport",
    "method": "GET",
    "accessRights": [
      "open-payables::r"
    ]
  },
  {
    "path": "/open-payables",
    "operationId": "openPayableGenerateReport",
    "method": "POST",
    "accessRights": [
      "open-payables::rw"
    ]
  },
  {
    "path": "/global-states/reports/:name",
    "operationId": "GetReportDetails",
    "method": "GET",
    "accessRights": [
      "global-states::reports::name::r"
    ]
  },
  {
    "path": "/global-states/reports",
    "operationId": "GenerateReport",
    "method": "POST",
    "accessRights": [
      "global-states::reports::rw"
    ]
  },
  {
    "path": "/global-states/reports",
    "operationId": "GetAllReportNames",
    "method": "GET",
    "accessRights": [
      "global-states::reports::r"
    ]
  },
  {
    "path": "/global-states/list-options",
    "operationId": "GetDropdownData",
    "method": "GET",
    "accessRights": [
      "global-states::list-options::r"
    ]
  },
  {
    "path": "/global-states/general-system-company/:companyNo",
    "operationId": "GetGeneralSystemCompany",
    "method": "GET",
    "accessRights": [
      "global-states::general-system-company::companyNo::r"
    ]
  },
  {
    "path": "/global-states/general-system-company/:companyNo/auth-code",
    "operationId": "getAuthCodeChecker",
    "method": "GET",
    "accessRights": [
      "global-states::general-system-company::companyNo::auth-code::r"
    ]
  },
  {
    "path": "/global-states/general-system-company/:companyNo",
    "operationId": "generateAuthCode",
    "method": "POST",
    "accessRights": [
      "global-states::general-system-company::companyNo::rw"
    ]
  },
  {
    "path": "/global-states/reports/generate",
    "operationId": "generateReportFiles",
    "method": "POST",
    "accessRights": [
      "global-states::reports::generate::rw"
    ]
  },
  {
    "path": "/employee-expense/reports",
    "operationId": "getEmployeeExpenseReports",
    "method": "GET",
    "accessRights": [
      "employee-expense::reports::r"
    ]
  },
  {
    "path": "/employee-expense/generate",
    "operationId": "generateReportEmployeeExpense",
    "method": "POST",
    "accessRights": [
      "employee-expense::generate::rw"
    ]
  },
  {
    "path": "/clear-checks/upload",
    "operationId": "uploadClearChecks",
    "method": "POST",
    "accessRights": [
      "clear-checks::upload::rw"
    ]
  },
  {
    "path": "/clear-checks/validate",
    "operationId": "validateSingleCheck",
    "method": "POST",
    "accessRights": [
      "clear-checks::validate::rw"
    ]
  },
  {
    "path": "/clear-checks/process",
    "operationId": "processMultipleChecks",
    "method": "POST",
    "accessRights": [
      "clear-checks::process::rw"
    ]
  },
  {
    "path": "/check-inquiry/payment-history",
    "operationId": "getPyamentHistory",
    "method": "GET",
    "accessRights": [
      "check-inquiry::payment-history::r"
    ]
  },
  {
    "path": "/check-inquiry/last-payment-info",
    "operationId": "getLastPaymentInfo",
    "method": "GET",
    "accessRights": [
      "check-inquiry::last-payment-info::r"
    ]
  },
  {
    "path": "/check-inquiry/voucher-detail",
    "operationId": "getVoucherDetails",
    "method": "GET",
    "accessRights": [
      "check-inquiry::voucher-detail::r"
    ]
  },
  {
    "path": "/ap-period-end/vendors",
    "operationId": "getVendorsByYear",
    "method": "GET",
    "accessRights": [
      "ap-period-end::vendors::r"
    ]
  },
  {
    "path": "/ap-period-end/vendor-year-end-process",
    "operationId": "vendorYearEndProcess",
    "method": "POST",
    "accessRights": [
      "ap-period-end::vendor-year-end-process::rw"
    ]
  },
  {
    "path": "/ap-period-end/year-end-process-menu/review-files",
    "operationId": "getYearEndProcessMenuReviewFiles",
    "method": "GET",
    "accessRights": [
      "ap-period-end::year-end-process-menu::review-files::r"
    ]
  },
  {
    "path": "/ap-period-end/record",
    "operationId": "getApPeriodEndReports",
    "method": "GET",
    "accessRights": [
      "ap-period-end::record::r"
    ]
  },
  {
    "path": "/ap-period-end",
    "operationId": "postApPeriodEndReports",
    "method": "POST",
    "accessRights": [
      "ap-period-end::rw"
    ]
  },
  {
    "path": "/ap-period-end/company",
    "operationId": "getCompanyDetails",
    "method": "GET",
    "accessRights": [
      "ap-period-end::company::r"
    ]
  },
  {
    "path": "/ap-period-end",
    "operationId": "getAllApPeriodEndReports",
    "method": "GET",
    "accessRights": [
      "ap-period-end::r"
    ]
  },
  {
    "path": "/ap-period-end/record",
    "operationId": "softDeleteRecord",
    "method": "DELETE",
    "accessRights": [
      "ap-period-end::record::delete::rw"
    ]
  },
  {
    "path": "/ap-period-end/:year/vendors/:vendorNo",
    "operationId": "getVendorDetailsByYear",
    "method": "GET",
    "accessRights": [
      "ap-period-end::year::vendors::vendorNo::r"
    ]
  },
  {
    "path": "/ap-period-end/:year/vendors/:vendorNo",
    "operationId": "updateVendorByYear",
    "method": "POST",
    "accessRights": [
      "ap-period-end::year::vendors::vendorNo::rw"
    ]
  },
  {
    "path": "/ap-maintenance/company",
    "operationId": "companyMaintenance",
    "method": "GET",
    "accessRights": [
      "ap-maintenance::company::r"
    ]
  },
  {
    "path": "/ap-maintenance/company",
    "operationId": "updateCompanyMaintenance",
    "method": "POST",
    "accessRights": [
      "ap-maintenance::company::rw"
    ]
  },
  {
    "path": "/ap-global-states/reportTypes/:type",
    "operationId": "ProcessType",
    "method": "GET",
    "accessRights": [
      "ap-global-states::reportTypes::type::r"
    ]
  }
];
