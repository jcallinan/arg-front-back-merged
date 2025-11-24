import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./useApi";
import type {
  CompanyMaintenanceData,
  GlMasterValidationResult,
} from "@/types/accounts-payable.types";

export const useApMaintenance = () => {
   const api = useApi();
   const queryClient = useQueryClient();
   const [isLoading, setIsLoading] = useState(false);
   const [isSaving, setIsSaving] = useState(false);

   // Create company maintenance query function
   const createCompanyMaintenanceQuery = useCallback((companyNo: number) => {
      return {
         queryKey: ["company-maintenance", companyNo],
         queryFn: async (): Promise<CompanyMaintenanceData> => {
            try {
               const response = await api.apMaintenance.companyMaintenance({ companyNo });
               const data = response?.data?.items;
               return {
                  ...data,
                  companyPreEdChks: data.companyPreEdChks as "Y" | "N",
                  companyJobCostAct: data.companyJobCostAct as "Y" | "N",
                  companyPoActive: data.companyPoActive as "Y" | "N",
               };
            } catch (error) {
               console.error("Error fetching company maintenance:", error);
               throw error;
            }
         },
         enabled: false, // Disabled by default to maintain manual trigger behavior
         refetchOnMount: true, // Always refetch on mount
      };
   }, [api]);

   // Manual fetch function that maintains original behavior
   const fetchCompanyMaintenance = useCallback(async (companyNo: number): Promise<CompanyMaintenanceData> => {
      try {
         setIsLoading(true);
         const queryInfo = createCompanyMaintenanceQuery(companyNo);
         
         // Invalidate existing cache before fetching to ensure fresh data
         await queryClient.invalidateQueries({ queryKey: queryInfo.queryKey });
         
         // Use fetchQuery to manually trigger the query
         const result = await queryClient.fetchQuery(queryInfo);
         
         // Ensure the result is properly set in cache (single object, not array)
         queryClient.setQueryData(queryInfo.queryKey, result);
         
         return result;
      } catch (error) {
         console.error("Error fetching company maintenance:", error);
         throw error;
      } finally {
         setIsLoading(false);
      }
   }, [queryClient, createCompanyMaintenanceQuery]);

   // Update company maintenance mutation
   const updateCompanyMaintenanceMutation = useMutation({
      mutationFn: async (data: CompanyMaintenanceData): Promise<CompanyMaintenanceData> => {
         const response = await api.apMaintenance.updateCompanyMaintenance(data);
         const responseData = response?.data?.items;
         return {
            ...responseData,
            companyPreEdChks: responseData.companyPreEdChks as "Y" | "N",
            companyJobCostAct: responseData.companyJobCostAct as "Y" | "N",
            companyPoActive: responseData.companyPoActive as "Y" | "N",
         };
      },
      onError: (error) => {
         console.error("Error updating company maintenance:", error);
      },
   });

   // Manual update function that maintains original behavior
   const updateCompanyMaintenance = useCallback(async (data: CompanyMaintenanceData): Promise<CompanyMaintenanceData> => {
      try {
         setIsSaving(true);
         const result = await updateCompanyMaintenanceMutation.mutateAsync(data);
         return result;
      } catch (error) {
         console.error("Error updating company maintenance:", error);
         throw error;
      } finally {
         setIsSaving(false);
      }
   }, [updateCompanyMaintenanceMutation]);

   // Validate Bank GL Number
   const validateBankGlNo = useCallback(async (
      glNo: string, 
      companyNumber: string
   ): Promise<GlMasterValidationResult> => {
      try {
         if (
            !glNo ||
            !companyNumber ||
            glNo.trim() === "" ||
            isNaN(parseInt(glNo, 10))
         ) {
            return {
               success: false,
               message: "Invalid Bank GL No format",
               description: "Invalid Bank GL No format"
            };
         }

         const response = await api.accountPayable.getGlMaster({
            companyNo: parseInt(companyNumber, 10),
            glNo: parseInt(glNo, 10),
         });

         // Check if GL master exists and is valid
         if (response?.data?.items) {
            const glData = response.data.items;
            const isDeleted = glData.isDeleted === "Y" || glData.isDeleted === "true";

            if (isDeleted) {
               return {
                  success: false,
                  message: "Bank GL No is deleted and cannot be used",
                  description: "The specified Bank GL No is deleted and cannot be used.",
                  isDeleted: true
               };
            } else {
               return {
                  success: true,
                  message: `Valid GL Account: ${glData.description || " "}`,
                  description: `Bank GL No ${glNo} is valid and active.`
               };
            }
         } else {
            return {
               success: false,
               message: "Bank GL No not found",
               description: "The specified Bank GL No does not exist in the GL master."
            };
         }
      } catch (error: any) {
         console.error("Error validating Bank GL No:", error);
         return {
            success: false,
            message: "Error validating Bank GL No",
            description: "Failed to validate Bank GL No. Please try again."
         };
      }
   }, [api]);

   // Manual company maintenance fetch function (for direct API replacement)
   const fetchCompanyMaintenanceManual = useCallback(async (queryParams: { companyNo: number }) => {
      try {
         // Maintain exact same API call and payload structure
         const response = await api.apMaintenance.companyMaintenance(queryParams);
         return response;
      } catch (error) {
         console.error("Error fetching company maintenance:", error);
         throw error;
      }
   }, [api]);

   return {
      // Loading states
      isLoading,
      isSaving,
      
      // API functions
      fetchCompanyMaintenance,
      fetchCompanyMaintenanceManual,
      updateCompanyMaintenance,
      validateBankGlNo,
      
      // Query creators for components that want to use useQuery directly
      createCompanyMaintenanceQuery,
      
      // Mutation objects for components that want to use useMutation directly
      updateCompanyMaintenanceMutation,
   };
};

export default useApMaintenance;
