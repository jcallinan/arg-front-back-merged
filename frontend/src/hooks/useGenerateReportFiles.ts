import { useState } from "react";
import { useApi } from "./useApi";
import type {
   GenerateReportFilesPayload,
   GenerateReportFilesResult,
} from "@/types/accounts-payable.types";

export const useGenerateReportFiles = () => {
   const api = useApi();
   const [isLoading, setIsLoading] = useState(false);

   const generateReportFiles = async (
      payload: GenerateReportFilesPayload
   ): Promise<GenerateReportFilesResult> => {
      try {
         setIsLoading(true);
         // The API expects a DTO; we forward fields directly as provided
         const response = await api.globalStates.generateReportFiles(
            payload as never
         );
         const message = response?.data?.message;
         const files = response?.data?.files;
         return {
            success: true,
            message,
            files,
         };
      } catch (error: unknown) {
         console.error("Error generating report files:", error);
         return {
            success: false,
            message:
               (error as { response?: { data?: { message?: string } } })
                  ?.response?.data?.message ||
               "Failed to generate report files",
         };
      } finally {
         setIsLoading(false);
      }
   };

   return { generateReportFiles, isLoading };
};

export default useGenerateReportFiles;
