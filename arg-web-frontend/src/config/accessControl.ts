import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import type { MongoAbility } from "@casl/ability";
import type { RightsV2Map } from "@/utils/permissionUtils";

type Actions = "read" | "manage";
type Subjects = string;

export type AppAbility = MongoAbility<[Actions, Subjects]>;

/**
 * Build ability from either a legacy string[] of rights OR a rightsv2 map.
 * Minimal change: normalize input to string[] so existing logic stays the same.
 */
export function buildAbilityForRights(rights: string[] | RightsV2Map = []): AppAbility {
   let normalizedRights: string[] = [];

   if (Array.isArray(rights)) {
      normalizedRights = rights.map((r) => String(r).trim()).filter(Boolean);
   } else if (rights && typeof rights === "object") {
      normalizedRights = Object.keys(rights).map((k) => String(k).trim()).filter(Boolean);
   }

   const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

   normalizedRights.forEach((right) => {
      if (typeof right !== "string" || right.trim() === "") {
         return;
      }

      const normalized = right.trim();

      // Support both "subject::rw" and "subject:rw" style suffixes from BE
      const match = normalized.match(/^(.*?)(?:::|:)(r|rw)$/i);
      if (!match) {
         return;
      }

      const subject = match[1];
      const permission = match[2].toLowerCase() as "r" | "rw";

      can("read", subject);

      if (permission === "rw") {
         can("manage", subject);
      }
   });

   return build();
}

type ActionConfig = {
   modulePrefixes: string[];
   requireWrite?: boolean;
   /**
    * When true, only rights whose subject matches the prefix **exactly**
    * are considered a match. Children under the prefix (e.g. `prefix::Child`)
    * are ignored.
    *
    * When false (default), any child right under the prefix also counts.
    */
   exactSubjectOnly?: boolean;
};

// Normal process voucher-entry actions
const VOUCHER_ENTRY_NORMAL_ACTIONS: { id: string; config: ActionConfig }[] = [
   {
      id: "voucher-entry.normal.create",
      config: {
         // Creating a normal voucher entry requires explicit RW:
         // Ap::VM::Voucher-Entry::Normal::NewEntry:Vendor::RW
         modulePrefixes: [
            "Ap::VM::Voucher-Entry::Normal::NewEntry:Vendor::RW",
         ],
      },
   },
   {
      id: "voucher-entry.normal.post",
      config: {
         // Posting normal vouchers requires explicit RW:
         // Ap::VM::Voucher-Entry::Normal::PostPurchaseJournal::RW
         modulePrefixes: [
            "Ap::VM::Voucher-Entry::Normal::PostPurchaseJournal::RW",
         ],
      },
   },
   {
      id: "voucher-entry.normal.edit",
      config: {
         // Editing normal vouchers requires explicit RW:
         // Ap::VM::Voucher-Entry::Normal::RW
         modulePrefixes: ["Ap::VM::Voucher-Entry::Normal::RW"],
      },
   },
   {
      id: "voucher-entry.normal.delete",
      config: {
         // Deleting normal vouchers requires explicit RW:
         // Ap::VM::Voucher-Entry::Normal::RW
         modulePrefixes: ["Ap::VM::Voucher-Entry::Normal::RW"],
      },
   },
   {
      // View-only permission for Normal voucher grid
      id: "voucher-entry.normal.view",
      config: {
         // Non-CRUD view: enabled when exact R key is present
         // Ap::VM::Voucher-Entry::Normal::R
         modulePrefixes: ["Ap::VM::Voucher-Entry::Normal::R"],
         requireWrite: false,
      },
   },
];

// Flexi process voucher-entry actions
const VOUCHER_ENTRY_FLEXI_ACTIONS: { id: string; config: ActionConfig }[] = [
   {
      id: "voucher-entry.flexi.post",
      config: {
         
         modulePrefixes: [
            "Ap::VM::Voucher-Entry::Flexi::PostPurchaseJournal::RW",
         ],
      },
   },
   {
      id: "voucher-entry.flexi.edit",
      config: {
         
         modulePrefixes: [
            "Ap::VM::Voucher-Entry::Flexi::ReviewBatch::PostPurchaseJournal::RW",
         ],
      },
   },
   {
      id: "voucher-entry.flexi.delete",
      config: {
         // Same RW key for deleting Flexi Review Batch rows
         modulePrefixes: [
            "Ap::VM::Voucher-Entry::Flexi::ReviewBatch::PostPurchaseJournal::RW",
         ],
      },
   },
   {
      // View-only permission for Flexi Review Batch grid
      id: "voucher-entry.flexi.view",
      config: {
         // Match the exact read-only key returned by API:
         // Ap::VM::Voucher-Entry::Flexi::ReviewBatch::R
         modulePrefixes: ["Ap::VM::Voucher-Entry::Flexi::ReviewBatch::R"],
         requireWrite: false,
      },
   },
   {
      id: "voucher-entry.flexi.upload",
      config: {
         // Exact RW key for Flexi CSV upload:
         // Ap::VM::Voucher-Entry::Flexi::UploadCSV::RW
         modulePrefixes: ["Ap::VM::Voucher-Entry::Flexi::UploadCSV::RW"],
      },
   },
   {
      id: "voucher-entry.flexi.download-template",
      config: {
         // Flexi download template should be enabled when the exact R key is present:
         // Ap::VM::Voucher-Entry::Flexi::UploadCSV::DownloadTemplate::R
         modulePrefixes: [
            "Ap::VM::Voucher-Entry::Flexi::UploadCSV::DownloadTemplate::R",
         ],
         requireWrite: false, // non-CRUD: R is enough
      },
   },
];

const VOUCHER_ENTRY_PAPER_ACTIONS: { id: string; config: ActionConfig }[] = [
   {
      id: "voucher-entry.paper.post",
      config: {
         // Paper post to purchase journal - controlled by Paper FreightInvoice CreateBatch RW
         // Ap::VM::Voucher-Entry::Paper::FreightInvoice::CreateBatch:RW
         modulePrefixes: [
            "Ap::VM::Voucher-Entry::Paper::FreightInvoice::CreateBatch:RW",
         ],
      },
   },
   {
      id: "voucher-entry.paper.edit",
      config: {
         // Editing Paper batch entries - same RW key as create-batch
         modulePrefixes: [
            "Ap::VM::Voucher-Entry::Paper::FreightInvoice::CreateBatch:RW",
         ],
      },
   },
   {
      id: "voucher-entry.paper.delete",
      config: {
         // Deleting Paper batch entries - same RW key as create-batch
         modulePrefixes: [
            "Ap::VM::Voucher-Entry::Paper::FreightInvoice::CreateBatch:RW",
         ],
      },
   },
   {
      id: "voucher-entry.paper.create-batch",
      config: {
         // Creating Paper freight invoice batch - requires explicit RW
         // Ap::VM::Voucher-Entry::Paper::FreightInvoice::CreateBatch:RW
         modulePrefixes: [
            "Ap::VM::Voucher-Entry::Paper::FreightInvoice::CreateBatch:RW",
         ],
      },
   },
   {
      // View-only permission for Paper Review Batch grid
      id: "voucher-entry.paper.view",
      config: {
         // Non-CRUD view: enabled when exact R key is present
         // Ap::VM::Voucher-Entry::Paper::R
         modulePrefixes: ["Ap::VM::Voucher-Entry::Paper::R"],
         requireWrite: false,
      },
   },
];

// LMS process voucher-entry actions
const VOUCHER_ENTRY_LMS_ACTIONS: { id: string; config: ActionConfig }[] = [
   {
      id: "voucher-entry.lms.post",
      config: {
         modulePrefixes: [
            "Ap::VM::Voucher-Entry::LMS::ReviewBatch::PostPurchaseJournal::RW",
         ],
      },
   },
   {
      id: "voucher-entry.lms.edit",
      config: {
         // Editing LMS review batch rows requires explicit RW:
         // Ap::VM::Voucher-Entry::LMS::ReviewBatch::PostPurchaseJournal::RW
         modulePrefixes: [
            "Ap::VM::Voucher-Entry::LMS::ReviewBatch::PostPurchaseJournal::RW",
         ],
      },
   },
   {
      id: "voucher-entry.lms.delete",
      config: {
         // Deleting LMS review batch rows requires explicit RW:
         // Ap::VM::Voucher-Entry::LMS::ReviewBatch::PostPurchaseJournal::RW
         modulePrefixes: [
            "Ap::VM::Voucher-Entry::LMS::ReviewBatch::PostPurchaseJournal::RW",
         ],
      },
   },
   {
      id: "voucher-entry.lms.create-batch",
      config: {
         // Creating LMS freight invoice batch requires explicit RW:
         // Ap::VM::Voucher-Entry::LMS::FreightInvoice::CreateBatch:RW
         modulePrefixes: [
            "Ap::VM::Voucher-Entry::LMS::FreightInvoice::CreateBatch:RW",
         ],
      },
   },
   {
      // View-only permission for LMS Review Batch grid
      id: "voucher-entry.lms.view",
      config: {

         modulePrefixes: ["Ap::VM::Voucher-Entry::LMS::R"],
         requireWrite: false,
      },
   },
];

// SOGAS process voucher-entry actions
const VOUCHER_ENTRY_SOGAS_ACTIONS: { id: string; config: ActionConfig }[] = [
   {
      id: "voucher-entry.sogas.post",
      config: {
         // Posting SOGAS vouchers requires explicit RW:
         // Ap::VM::Voucher-Entry::Sogas::PostPurchaseJournal::RW
         modulePrefixes: [
            "Ap::VM::Voucher-Entry::Sogas::PostPurchaseJournal::RW",
         ],
      },
   },
   {
      id: "voucher-entry.sogas.edit",
      config: {
         // Editing SOGAS review batch rows requires explicit RW:
         // Ap::VM::Voucher-Entry::Sogas::PostPurchaseJournal::RW
         modulePrefixes: [
            "Ap::VM::Voucher-Entry::Sogas::PostPurchaseJournal::RW",
         ],
      },
   },
   {
      id: "voucher-entry.sogas.delete",
      config: {
         // Deleting SOGAS review batch rows requires explicit RW:
         // Ap::VM::Voucher-Entry::Sogas::PostPurchaseJournal::RW
         modulePrefixes: [
            "Ap::VM::Voucher-Entry::Sogas::PostPurchaseJournal::RW",
         ],
      },
   },
   {
      id: "voucher-entry.sogas.upload",
      config: {
         // Uploading SOGAS CSV is treated as CRUD → require RW on PostPurchaseJournal
         // Ap::VM::Voucher-Entry::Sogas::PostPurchaseJournal::RW
         modulePrefixes: [
            "Ap::VM::Voucher-Entry::Sogas::PostPurchaseJournal::RW",
         ],
      },
   },
   {
      id: "voucher-entry.sogas.download-template",
      config: {
         // SOGAS download template is non-CRUD → enabled when exact R key is present:
         // Ap::VM::Voucher-Entry::Sogas::UploadCSV::DownloadTemplate::R
         modulePrefixes: [
            "Ap::VM::Voucher-Entry::Sogas::UploadCSV::DownloadTemplate::R",
         ],
         requireWrite: false,
      },
   },
   {
      // View-only permission for SOGAS Review Batch grid
      id: "voucher-entry.sogas.view",
      config: {
         // Non-CRUD view: enabled when exact R key is present
         // Ap::VM::Voucher-Entry::Sogas::R
         modulePrefixes: ["Ap::VM::Voucher-Entry::Sogas::R"],
         requireWrite: false,
      },
   },
];

// Process type visibility actions (control which process types appear in UI)
const VOUCHER_ENTRY_PROCESS_TYPE_ACTIONS: {
   id: string;
   config: ActionConfig;
}[] = [
   {
      id: "voucher-entry.normal.access",
      config: {
         modulePrefixes: ["Ap::VM::Voucher-Entry::Normal::R"],
         requireWrite: false,
      },
   },
   {
      id: "voucher-entry.flexi.access",
      config: {
         modulePrefixes: ["Ap::VM::Voucher-Entry::Flexi::R"],
         requireWrite: false,
      },
   },
   {
      id: "voucher-entry.paper.access",
      config: {
         modulePrefixes: ["Ap::VM::Voucher-Entry::Paper::R"],
         requireWrite: false,
      },
   },
   {
      id: "voucher-entry.lms.access",
      config: {
         modulePrefixes: ["Ap::VM::Voucher-Entry::LMS::R"],
         requireWrite: false,
      },
   },
   {
      id: "voucher-entry.sogas.access",
      config: {
         modulePrefixes: ["Ap::VM::Voucher-Entry::Sogas::R"],
         requireWrite: false,
      },
   },
];

// Clear Checks actions
const CLEAR_CHECKS_ACTIONS: { id: string; config: ActionConfig }[] = [
   {
      id: "clear-checks.download-template",
      config: {
         // Clear Checks download template is controlled by the explicit RW key:
         // Ap::CC::DownloadTemplate::RW
         modulePrefixes: ["Ap::CC::DownloadTemplate::RW"],
      },
   },
   {
      id: "clear-checks.upload-file",
      config: {
         // Clear Checks upload file is controlled by the explicit RW key:
         // Ap::CC::UploadCSV::RW
         modulePrefixes: ["Ap::CC::UploadCSV::RW"],
      },
   },
   {
      id: "clear-checks.add-check",
      config: {
         // Clear Checks add check is controlled by the explicit RW key:
         // Ap::CC::AddCheck::RW
         modulePrefixes: ["Ap::CC::AddCheck::RW"],
      },
   },
];

// Vendor Management - Vendor Master List actions
const VENDOR_MASTER_ACTIONS: { id: string; config: ActionConfig }[] = [
   {
      // View-only permission for Vendor Master grid (row View icon)
      id: "vendor-master.view-vendor",
      config: {
         // Enabled when the exact read-only key is present:
         // Ap::VNMT::VendorMaintenance::R
         modulePrefixes: ["Ap::VNMT::VendorMaintenance::R"],
         requireWrite: false,
      },
   },
   {
      id: "vendor-master.add-vendor",
      config: {
         // Add Vendor should require explicit RW on VendorMaintenance
         // Ap::VNMT::VendorMaintenance::RW
         modulePrefixes: ["Ap::VNMT::VendorMaintenance::RW"],
      },
   },
   {
      id: "vendor-master.edit-vendor",
      config: {
         // Edit Vendor should also be controlled by the same RW key
         // Ap::VNMT::VendorMaintenance::RW
         modulePrefixes: ["Ap::VNMT::VendorMaintenance::RW"],
      },
   },
];

// Vendor Management - Vendor Owner Mapping actions
const VENDOR_OWNER_MAPPING_ACTIONS: { id: string; config: ActionConfig }[] = [
   {
      id: "vendor-owner-mapping.search",
      config: {
         modulePrefixes: ["Ap::VNMT::VendorOwnerMapping::R"],
         requireWrite: false,
      },
   },
   {
      id: "vendor-owner-mapping.add-owner",
      config: {
         modulePrefixes: ["Ap::VNMT::VendorOwnerMappings::RW"],
      },
   },
   {
      id: "vendor-owner-mapping.edit-owner",
      config: {
         modulePrefixes: ["Ap::VNMT::VendorOwnerMappings::RW"],
      },
   },
];


// A/P Period End actions (Vendor Month/Year End, Year End 1099, etc.)
const VENDOR_MONTH_YEAR_END_ACTIONS: { id: string; config: ActionConfig }[] = [
   {
      id: "vendor-month-year-end.submit",
      config: {
         // Vendor Month/Year End submit is controlled by the canonical RW key:
         // Ap::APPDED::RW
         modulePrefixes: ["Ap::APPDED::RW"],
      },
   },
   {
      id: "year-end-1099-process.next",
      config: {
         // Year End 1099 Process Menu "Next" actions require explicit RW:
         // Ap::APPDED::YearEnd1099Process::RW
         modulePrefixes: ["Ap::APPDED::YearEnd1099Process::RW"],
      },
   },
   {
      // View-only permission for Year End 1099 "Review Files" grid
      id: "year-end-1099-process.review-files.view",
      config: {
         // Enabled when the exact read-only key is present:
         // Ap::APPDED::YearEnd1099Process::ReviewFiles::R
         modulePrefixes: ["Ap::APPDED::YearEnd1099Process::ReviewFiles::R"],
         requireWrite: false,
      },
   },
   {
      // Download permission for Year End 1099 "Review Files" grid
      id: "year-end-1099-process.review-files.download",
      config: {
         // Controlled by the RW key:
         // Ap::APPDED::YearEnd1099Process::ReviewFiles::RW
         modulePrefixes: ["Ap::APPDED::YearEnd1099Process::ReviewFiles::RW"],
      },
   },
];

// A/P Reports Menu actions
const AP_REPORTS_ACTIONS: { id: string; config: ActionConfig }[] = [
   {
      id: "ap-reports.generate-report",
      config: {
         // Generate Report is controlled by the Filters RW key:
         // Ap::APRPTMU::Filters::RW
         modulePrefixes: ["Ap::APRPTMU::Filters::RW"],
      },
   },
];

// A/P Maintenance actions
const AP_MAINTENANCE_ACTIONS: { id: string; config: ActionConfig }[] = [
   {
      id: "ap-maintenance.save",
      config: {
         // A/P Maintenance save requires explicit RW:
         // Ap::APMT::RW
         modulePrefixes: ["Ap::APMT::RW"],
      },
   },
];

// Voucher Maintenance actions
const VOUCHER_MAINTENANCE_ACTIONS: { id: string; config: ActionConfig }[] = [
   {
      id: "voucher-maintenance.modify-status",
      config: {
         // Changing voucher status requires explicit RW:
         // Ap::VM::VoucherMaintenance::RW
         modulePrefixes: ["Ap::VM::VoucherMaintenance::RW"],
      },
   },
   {
      id: "voucher-maintenance.modify-discount",
      config: {
         // Modifying voucher discount also uses the same RW key:
         // Ap::VM::VoucherMaintenance::RW
         modulePrefixes: ["Ap::VM::VoucherMaintenance::RW"],
      },
   },
   {
      id: "voucher-maintenance.cancel",
      config: {
         // Cancelling a voucher uses the same RW key as other maintenance edits:
         // Ap::VM::VoucherMaintenance::RW
         modulePrefixes: ["Ap::VM::VoucherMaintenance::RW"],
      },
   },
    {
      id: "voucher-maintenance.search",
      config: {
         modulePrefixes: ["Ap::VM::VoucherMaintenance::R"],
         requireWrite: false,
      },
   },
   
];

// Update 1099 File actions
const UPDATE_1099_FILE_ACTIONS: { id: string; config: ActionConfig }[] = [
   {
      id: "update-1099-file.view",
      config: {
         // View-only permission for Update 1099 File grid (row View icon)
         // Enabled when the exact read-only key is present:
         // Ap::APPDED::Update1099File::R
         modulePrefixes: ["Ap::APPDED::Update1099File::R"],
         requireWrite: false,
      },
   },
   {
      id: "update-1099-file.edit",
      config: {
         // Editing Update 1099 File records requires explicit RW:
         // Ap::APPDED::Update1099File::RW
         modulePrefixes: ["Ap::APPDED::Update1099File::RW"],
      },
   },
   {
      id: "update-1099-file.delete",
      config: {
         // Deleting Update 1099 File records also uses the same RW key:
         // Ap::APPDED::Update1099File::RW
         modulePrefixes: ["Ap::APPDED::Update1099File::RW"],
      },
   },
];

// Vendor File Maintenance 1099 actions
const VENDOR_FILE_MAINTENANCE_1099_ACTIONS: { id: string; config: ActionConfig }[] = [
   {
      id: "vendor-file-maintenance-1099.search",
      config: {
         // Search/view permission for Vendor File Maintenance 1099 (Search button)
         // Enabled when the exact read-only key is present:
         // Ap::APPDED::VendorFileMaintenance::R (from API response)
         modulePrefixes: ["Ap::APPDED::VendorFileMaintenance::R"],
         requireWrite: false,
      },
   },
   {
      id: "vendor-file-maintenance-1099.view",
      config: {
         // View-only permission for Vendor File Maintenance 1099 grid (row View icon)
         // Enabled when the exact read-only key is present:
         // Ap::APPDED::VendorFileMaintenance::R (from API response)
         modulePrefixes: ["Ap::APPDED::VendorFileMaintenance::R"],
         requireWrite: false,
      },
   },
   {
      id: "vendor-file-maintenance-1099.edit",
      config: {
         // Editing Vendor File Maintenance 1099 records requires explicit RW:
         // Ap::APPDED::VendorFileMaintenance::RW (from API response - note triple colon)
         modulePrefixes: ["Ap::APPDED::VendorFileMaintenance::RW"],
      },
   },
];

const ACTION_CONFIG_MAP: Record<string, ActionConfig> = {
   "open-payables.generate-report": {
      // Generate Open Payables report → require explicit RW key:
      // Ap::OP::RW
      modulePrefixes: ["Ap::OP::RW"],
   },
   "open-payables.view": {
      // View Open Payables page/results → enabled when exact R key is present:
      // Ap::OP::R
      modulePrefixes: ["Ap::OP::R"],
      requireWrite: false,
   },
   "employee-expense.generate-report": {
      // Generate Employee Expense export → require explicit RW key:
      // Ap::EE::RW
      modulePrefixes: ["Ap::EE::RW"],
   },
   "employee-expense.view": {
      // View Employee Expense page/results → enabled when exact R key is present:
      // Ap::EE::R
      modulePrefixes: ["Ap::EE::R"],
      requireWrite: false,
   },
   
   "purchase-journal.view": {
      
      modulePrefixes: ["Ap::VM::PurchaseJournal::R"],
      requireWrite: false,
   },
   "check-inquiry.view": {
      
      modulePrefixes: ["Ap::VM::CheckInquiry::R"],
      requireWrite: false,
   },
   
   "ap-reports.view": {
   
      modulePrefixes: ["Ap::APRPTMU::R"],
      requireWrite: false,
   },
"ap-reports.apply-filters": {
 
  modulePrefixes: ["Ap::APRPTMU::Filters::RW"],
  requireWrite: true,
},

   "payment.ap-check.view": {
     
      modulePrefixes: ["Ap::PC::ApCheck::R"],
      requireWrite: false,
   },
   "payment.cash-requirement.view": {
      
      modulePrefixes: ["Ap::PC::CashRequirement::R"],
      requireWrite: false,
   },

   "payment-selection.save": {
      modulePrefixes: ["Ap::PC::PaymentSelection::AddPayment::RW"],
   },
   // Auth Generate actions
   "auth-generate.generate": {
      // Generating a new authorization code requires RW:
      // Ap::AuthGenrate::RW
      modulePrefixes: ["Ap::AuthGenrate::RW"],
   },
   // Normal voucher-entry actions (create/post/edit/delete)
   ...VOUCHER_ENTRY_NORMAL_ACTIONS.reduce<Record<string, ActionConfig>>(
      (acc, { id, config }) => {
         acc[id] = config;
         return acc;
      },
      {}
   ),
   // Flexi voucher-entry actions
   ...VOUCHER_ENTRY_FLEXI_ACTIONS.reduce<Record<string, ActionConfig>>(
      (acc, { id, config }) => {
         acc[id] = config;
         return acc;
      },
      {}
   ),
   // Paper voucher-entry actions
   ...VOUCHER_ENTRY_PAPER_ACTIONS.reduce<Record<string, ActionConfig>>(
      (acc, { id, config }) => {
         acc[id] = config;
         return acc;
      },
      {}
   ),
   // LMS voucher-entry actions
   ...VOUCHER_ENTRY_LMS_ACTIONS.reduce<Record<string, ActionConfig>>(
      (acc, { id, config }) => {
         acc[id] = config;
         return acc;
      },
      {}
   ),
   // SOGAS voucher-entry actions
   ...VOUCHER_ENTRY_SOGAS_ACTIONS.reduce<Record<string, ActionConfig>>(
      (acc, { id, config }) => {
         acc[id] = config;
         return acc;
      },
      {}
   ),
   // Voucher-entry process type visibility actions
   ...VOUCHER_ENTRY_PROCESS_TYPE_ACTIONS.reduce<Record<string, ActionConfig>>(
      (acc, { id, config }) => {
         acc[id] = config;
         return acc;
      },
      {}
   ),
   // Clear Checks actions
   ...CLEAR_CHECKS_ACTIONS.reduce<Record<string, ActionConfig>>(
      (acc, { id, config }) => {
         acc[id] = config;
         return acc;
      },
      {}
   ),
   // Vendor Master List actions
   ...VENDOR_MASTER_ACTIONS.reduce<Record<string, ActionConfig>>(
      (acc, { id, config }) => {
         acc[id] = config;
         return acc;
      },
      {}
   ),
   // Vendor Owner Mapping actions
   ...VENDOR_OWNER_MAPPING_ACTIONS.reduce<Record<string, ActionConfig>>(
      (acc, { id, config }) => {
         acc[id] = config;
         return acc;
      },
      {}
   ),
   // Vendor Month/Year End + Year End 1099 actions
   ...VENDOR_MONTH_YEAR_END_ACTIONS.reduce<Record<string, ActionConfig>>(
      (acc, { id, config }) => {
         acc[id] = config;
         return acc;
      },
      {}
   ),
   // A/P Reports Menu actions
   ...AP_REPORTS_ACTIONS.reduce<Record<string, ActionConfig>>(
      (acc, { id, config }) => {
         acc[id] = config;
         return acc;
      },
      {}
   ),
   // A/P Maintenance actions
   ...AP_MAINTENANCE_ACTIONS.reduce<Record<string, ActionConfig>>(
      (acc, { id, config }) => {
         acc[id] = config;
         return acc;
      },
      {}
   ),
   // Voucher Maintenance actions
   // Voucher Maintenance actions
   ...VOUCHER_MAINTENANCE_ACTIONS.reduce<Record<string, ActionConfig>>(
      (acc, { id, config }) => {
         acc[id] = config;
         return acc;
      },
      {}
   ),
   // Update 1099 File actions
   ...UPDATE_1099_FILE_ACTIONS.reduce<Record<string, ActionConfig>>(
      (acc, { id, config }) => {
         acc[id] = config;
         return acc;
      },
      {}
   ),
   // Vendor File Maintenance 1099 actions
   ...VENDOR_FILE_MAINTENANCE_1099_ACTIONS.reduce<Record<string, ActionConfig>>(
      (acc, { id, config }) => {
         acc[id] = config;
         return acc;
      },
      {}
   ),
};

export function getRightKeyForAction(
   actionId: string,
   rights: string[] | RightsV2Map
): string | null {
   const config = ACTION_CONFIG_MAP[actionId];
   if (!config) {
      return null;
   }

   const { modulePrefixes, requireWrite = true, exactSubjectOnly = false } =
      config;

   // Normalize incoming rights (accept either array of strings or rightsv2 map)
   const normalizedRights = ((): string[] => {
      if (!rights) return [];
      if (Array.isArray(rights)) {
         return rights.filter((r) => typeof r === "string").map((r) => r.trim()).filter(Boolean);
      }
      if (typeof rights === "object") {
         return Object.keys(rights).map((k) => String(k).trim()).filter(Boolean);
      }
      return [];
   })();

   if (normalizedRights.length === 0) {
      return null;
   }

   for (const prefix of modulePrefixes) {
      // If the prefix itself includes an ::R / ::RW (or :R / :RW) suffix,
      // treat it as a full right key and match exactly against the rights
      const explicitRightMatch = prefix.match(/(?:::|:)(r|rw)$/i);
      if (explicitRightMatch) {
         const exact = normalizedRights.find(
            (r) => r.toLowerCase() === prefix.toLowerCase()
         );
         if (exact) {
            return exact;
         }
         // If this explicit key is not present, continue to next prefix
         continue;
      }

      const matching = normalizedRights.filter((r) => {
         const match = r.match(/^(.*?)(?:::|:)(r|rw)$/i);
         if (!match) return false;
         const subject = match[1];
         if (exactSubjectOnly) {
            return subject === prefix;
         }
         // Exact subject match or subject is a child under the prefix
         return subject === prefix || subject.startsWith(`${prefix}::`);
      });
      if (matching.length === 0) {
         continue;
      }

      if (requireWrite) {
         const rw = matching.find((r) => /(?:::|:)rw$/i.test(r));
         if (rw) {
            return rw;
         }
         // If we require RW but user only has R, treat as no permission
         continue;
      }

      // If write is not strictly required, prefer ::rw/::r or :rw/:r, else any match
      const rw = matching.find((r) => /(?:::|:)rw$/i.test(r));
      if (rw) return rw;

      const r = matching.find((r) => /(?:::|:)r$/i.test(r));
      if (r) return r;

      return matching[0];
   }

   return null;
}
