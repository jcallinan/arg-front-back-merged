import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./useApi";
import type { SubmitReportsMenuPayload } from "@api/api-schema/api";
import type { ReportsMenuQueryParams, ReportMenuItem } from "@/types/accounts-payable.types";
import { cleanFileName } from "@utils/formatters";

export const useApReportsMenu = () => {
   const api = useApi();
   const queryClient = useQueryClient();
   const [isLoading, setIsLoading] = useState(false);

   // Submit report generation mutation
   const submitReportsMenuMutation = useMutation({
      mutationFn: async (payload: SubmitReportsMenuPayload) => {
         await api.reportsMenu.submitReportsMenu(payload);
         return { success: true };
      },
      onError: (error) => {
         console.error("Failed to submit report generation", error);
      },
   });

   // Manual submit function that maintains original behavior
   const submitReportsMenu = useCallback(async (payload: SubmitReportsMenuPayload) => {
      try {
         setIsLoading(true);
         const result = await submitReportsMenuMutation.mutateAsync(payload);
         return result;
      } catch (error) {
         console.error("Failed to submit report generation", error);
         throw error;
      } finally {
         setIsLoading(false);
      }
   }, [submitReportsMenuMutation]);

   // Create reports menu query function
   const createReportsMenuQuery = useCallback((queryParams: ReportsMenuQueryParams) => {
      return {
         queryKey: ["reports-menu", queryParams],
         queryFn: async (): Promise<ReportMenuItem[]> => {
            try {
               const response = await api.reportsMenu.getReportsMenu(queryParams);
               const items = response?.data?.items ?? [];

               return items.map((item: any, index: number) => ({
                  id: index,
                  pdfFileName: cleanFileName(item.pdfFileName) || `ap-report-${index + 1}`,
                  reportDateTime: item.reportDateTime,
                  reportType: item.reportType,
                  formType: item.formType,
                  status: "Ready",
                  filePath: item.filePath,
                  fileName: cleanFileName(item.pdfFileName) || `ap-report-${index + 1}`, // for download
               }));
            } catch (error) {
               console.error("Error fetching reports menu:", error);
               throw error;
            }
         },
         enabled: false, // Disabled by default to maintain manual trigger behavior
         
         refetchOnMount: true, // Always refetch on mount
      };
   }, [api]);

   // Manual fetch function that maintains original behavior
   const fetchReportsMenu = useCallback(async (queryParams: ReportsMenuQueryParams): Promise<ReportMenuItem[]> => {
      try {
         setIsLoading(true);
         const queryInfo = createReportsMenuQuery(queryParams);
         
         // Invalidate existing cache before fetching to ensure fresh data
         await queryClient.invalidateQueries({ queryKey: queryInfo.queryKey });
         
         // Use fetchQuery to manually trigger the query
         const result = await queryClient.fetchQuery(queryInfo);
         
         // If result is empty, ensure any cached data is cleared
         if (result.length === 0) {
            queryClient.setQueryData(queryInfo.queryKey, []);
         }
         
         return result;
      } catch (error) {
         console.error("Error fetching reports menu:", error);
         throw error;
      } finally {
         setIsLoading(false);
      }
   }, [queryClient, createReportsMenuQuery]);

   return {
      // Loading states
      isLoading,
      
      // API functions
      submitReportsMenu,
      fetchReportsMenu,
      
      // Query creators for components that want to use useQuery directly
      createReportsMenuQuery,
      
      // Mutation objects for components that want to use useMutation directly
      submitReportsMenuMutation,
   };
};

export default useApReportsMenu;
