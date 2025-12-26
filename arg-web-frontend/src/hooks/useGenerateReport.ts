import { useState } from "react";
import { useApi } from "./useApi";
import type { ReportParameter } from "@/types/accounts-payable.types";

interface UseGenerateReportProps {
   onSuccess?: (response: any) => void;
   onError?: (error: any) => void;
}


export const useGenerateReport = ({
   onSuccess,
   onError,
}: UseGenerateReportProps = {}) => {
   const api = useApi();
   const [isLoading, setIsLoading] = useState(false);

   const generateReport = async (
      reportName: string,
      parameters: ReportParameter[] = []
   ) => {
      try {
         setIsLoading(true);

         const payload = {
            name: reportName,
            parameters: parameters,
         };

         const response = await api.globalStates.generateReport(
            { name: reportName },
            payload
         );

       

         if (onSuccess) {
            onSuccess(response);
         }

         return response;
      } catch (error) {
         console.error("Error generating report:", error);

         if (onError) {
            onError(error);
         }

         throw error;
      } finally {
         setIsLoading(false);
      }
   };

   return {
      generateReport,
      isLoading,
   };
};

export default useGenerateReport;
