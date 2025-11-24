import { useState, useCallback } from "react";
import { useApi } from "./useApi";

interface ReportParameter {
   reportName?: string;
   fieldKey?: string;
   fieldDescription?: string;
   fieldComponent?: string;
   fieldDataType?: string;
   fieldSequence?: number;
   variableType?: string;
   xmlMetadata?: string | null;
   storedProcedureName?: string;
   spSequence?: number;
   fieldLength?: string | null;
}

interface UseReportDetailsReturn {
   reportParameters: ReportParameter[];
   loading: boolean;
   error: string | null;
   fetchReportDetails: (
      reportName: string,
      variableType?: string
   ) => Promise<void>;
   clearError: () => void;
}

export const useReportDetails = (): UseReportDetailsReturn => {
   const [reportParameters, setReportParameters] = useState<ReportParameter[]>(
      []
   );
   const [loading, setLoading] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);
   const api = useApi();

   const fetchReportDetails = useCallback(
      async (reportName: string, variableType: string = "in") => {
         try {
            console.log(
               "useReportDetails - fetchReportDetails called with:",
               reportName,
               variableType
            );
            setLoading(true);
            setError(null);

            const response = await api.globalStates.getReportDetails({
               name: reportName,
               variableType
            });

            if (response.data?.items) {
               setReportParameters(response.data.items);
            } else {
               setError(`Failed to fetch report details for ${reportName}`);
               setReportParameters([]);
            }
         } catch (err) {
            setError(
               err instanceof Error
                  ? err.message
                  : "An error occurred while fetching report details"
            );
            setReportParameters([]);
         } finally {
            setLoading(false);
         }
      },
      [api]
   );

   const clearError = useCallback(() => {
      setError(null);
   }, []);

   return {
      reportParameters,
      loading,
      error,
      fetchReportDetails,
      clearError,
   };
};
