import { Module } from "@nestjs/common";
import { VoucherModule } from "./application/voucher/voucher.module";
import { PurchaseJournalModule } from "./application/purchase-journal/purchase-journal.module";
import { APGlobalStatesModule } from "./application/ap-global-states/ap-global-states.module";
import { OpenPayablesModule } from "./application/open-payables/open-payables.module";
import { ReportsMenuModule } from "./application/reports-menu/reports-menu.module";
import { PaymentModule } from "./application/payment/payment.module";
import { VoucherMaintenanceModule } from "./application/voucher-maintenance/voucher-maintenance.module";
import { CheckInquiryModule } from "./application/check-inquiry/check-inquiry.module";
import { VendorManagementModule } from "./application/vendor-management/vendor-management.module";
import { APMaintenanceModule } from "./application/ap-maintenance/ap-maintenance.module";
import { ClearChecksModule } from "./application/clear-checks/clear-checks.module";
import { EmployeeExpenseModule } from "./application/employee-expense/employee-expense.module";
import { APPeriodEndModule } from "./application/ap-period-end/ap-period-end.module";

@Module({
  imports: [
    VoucherModule,
    PurchaseJournalModule,
    APGlobalStatesModule,
    OpenPayablesModule,
    ReportsMenuModule,
    PaymentModule,
    VoucherMaintenanceModule,
    VendorManagementModule,
    APMaintenanceModule,
    ClearChecksModule,
    CheckInquiryModule,
    VendorManagementModule,
    APPeriodEndModule,
    EmployeeExpenseModule
  ],
  exports: [
    VoucherModule,
    PurchaseJournalModule,
    APGlobalStatesModule,
    OpenPayablesModule,
    ReportsMenuModule,
    PaymentModule,
    VoucherMaintenanceModule,
    VendorManagementModule,
    APMaintenanceModule,
    ClearChecksModule,
    CheckInquiryModule,
    VendorManagementModule,
    APPeriodEndModule,
    EmployeeExpenseModule
  ],
})
export class AccountPayableModule {}
