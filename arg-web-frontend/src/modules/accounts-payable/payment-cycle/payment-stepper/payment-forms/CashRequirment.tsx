import PurchaseJournalTable from "@shared-components/reports-table/ReportsTable";
import type { CashRequirmentProps } from "@/types/accounts-payable.types";
import { useEffect } from "react";
import { useReportDetails } from "@hooks/useReportDetails";
import { usePaymentCycle } from "@hooks/usePaymentCycle";

function CashRequirment({ voucherType }: CashRequirmentProps) {
   const { fetchReportDetails } = useReportDetails();
   const { fetchCashRequirementReports } = usePaymentCycle();

   useEffect(() => {
      // Map step-one voucher selection to useCase for Cash Requirement
      const useCaseMap: Record<string, string> = {
         Check: "Payment_Cycle_Check_Cash_Requirement_Submit",
         ACH: "Payment_Cycle_Arch_And_Wire_Finalize",
         Wire: "Payment_Cycle_Arch_And_Wire_Finalize",
         "Employee Expense": "Payment_Cycle_Arch_And_Wire_Finalize",
         Utility: "Payment_Cycle_Arch_And_Wire_Finalize",
      };
      const useCase = useCaseMap[voucherType as keyof typeof useCaseMap];
      if (useCase) {
         fetchReportDetails(useCase, "in");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [voucherType]);
   const fetchCashRequirementData = async (): Promise<any[]> => {
      // Use the provided voucherType or default to "Check"
      const voucherToPay =
         (voucherType as
            | "Check"
            | "ACH"
            | "Wire"
            | "Employee Expense"
            | "Utility") || "Check";

      return fetchCashRequirementReports({
         voucherToPay,
         reportType: "AP-Cash-Requirements",
      });
   };

   return (
      <div className="table-margin">
         <div className="table-responsive-container">
            <PurchaseJournalTable
               fetchDataFn={fetchCashRequirementData}
               viewActionId="payment.cash-requirement.view"
            />
         </div>
      </div>
   );
}

export default CashRequirment;
