import PurchaseJournalTable from "@shared-components/reports-table/ReportsTable";
import type { APCheckProps } from "@/types/accounts-payable.types";
import { usePaymentCycle } from "@hooks/usePaymentCycle";

function APCheck({ voucherType }: APCheckProps) {
  const { fetchApCheckReports } = usePaymentCycle();

  const fetchAPCheckData = async (): Promise<any[]> => {
    // Use the provided voucherType or default to "Check"
    const voucherToPay = voucherType || "Check";

    return fetchApCheckReports({
      voucherToPay,
      reportType: "Payment_Cycle_Check_Cash_Print_Checks_Print",
    });
  };

  return (
    <div className="table-margin">
      <div className="table-responsive-container">
        <PurchaseJournalTable
          fetchDataFn={fetchAPCheckData}
          viewActionId="payment.ap-check.view"
        />
      </div>
    </div>
  );
}

export default APCheck;
