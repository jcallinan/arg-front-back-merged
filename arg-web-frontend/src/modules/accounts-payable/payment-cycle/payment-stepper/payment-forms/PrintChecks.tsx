import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import paymentLoader from "@assets/icons/payment-check-load-icon.svg";
import { useReportNames } from "@hooks/useReportNames";
import { useReportDetails } from "@hooks/useReportDetails";
import { usePaymentCycle } from "@hooks/usePaymentCycle";
import type { PrintChecksRef } from "@/types/accounts-payable.types";

const PrintChecks = forwardRef<PrintChecksRef>((_, ref) => {
   const { reportNames, loading: reportNamesLoading } = useReportNames();
   const { loading: loadingDetails, fetchReportDetails } = useReportDetails();
   const { printChecks } = usePaymentCycle();
   const [isPrintLoading, setIsPrintLoading] = useState(false);

   const selectedReportName = "Payment_Cycle_Check_Cash_Print_Checks_Print";

   useEffect(() => {
      fetchReportDetails(selectedReportName, "in");
   }, [fetchReportDetails, selectedReportName]);

   useEffect(() => {
      if (reportNames.length > 0 && !reportNames.includes(selectedReportName)) {
         console.warn(
            `Report "${selectedReportName}" not found in available reports:`,
            reportNames
         );
      }
   }, [reportNames, selectedReportName]);

   const handlePrint = async () => {
      try {
         setIsPrintLoading(true);
         await printChecks();
         // You can add success notification here if needed
      } catch (error) {
         console.error("Error generating check printing report:", error);
         // You can add error notification here if needed
      } finally {
         setIsPrintLoading(false);
      }
   };

   // Expose the print function and loading state to parent component
   useImperativeHandle(ref, () => ({
      handlePrint,
      isPrintLoading,
   }));

   if (reportNamesLoading || loadingDetails) {
      return (
         <div className="payment-form">
            <div className="bordered-box flex-column">
               <div className="loading-spinner">Loading...</div>
            </div>
         </div>
      );
   }

   return (
      <div className="payment-form">
         <div className="bordered-box flex-column">
            <img
               src={paymentLoader}
               alt="Printer Icon"
               className="printer-icon"
            />
            <h6>Please Load Checks into the Printer</h6>

            <div className="print-instructions">
               <p className="p-xs text-muted">
                  Please ensure the check forms are properly loaded into the
                  printer before proceeding with the check printing process.
               </p>
            </div>
         </div>
      </div>
   );
});

PrintChecks.displayName = "PrintChecks";

export default PrintChecks;
