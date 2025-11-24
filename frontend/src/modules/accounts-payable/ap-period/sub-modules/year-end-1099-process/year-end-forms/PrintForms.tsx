import React, { useEffect } from "react";
import paymentLoader from "../../../../../../assets/icons/payment-check-load-icon.svg";
import { useReportNames } from "../../../../../../hooks/useReportNames";
import { useReportDetails } from "../../../../../../hooks/useReportDetails";

const PrintForms: React.FC = () => {
   const {
      reportNames,
      loading: reportNamesLoading,
      error: _reportNamesError,
   } = useReportNames();

   const { loading: loadingDetails, fetchReportDetails } = useReportDetails();

   const selectedReportName = "Year_End_1099_Process_Menu_Test_or_Print_Submit";

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
            <h6>Print 1099 </h6>

            <div className="print-instructions">
               <p className="p-xs text-muted">
                  Use the Print button below to generate and print the 1099
                  forms.
               </p>
            </div>
         </div>
      </div>
   );
};

export default PrintForms;
