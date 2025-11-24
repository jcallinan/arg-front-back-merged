import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useApi } from "./useApi";

import type {
   CompanyMaintenanceData,
   PaymentTypeSubmissionData,
   VendorPaymentData,
   ApiResponse,
   ReportParameter,
   GenerateReportFilesPayload,
   GenerateReportFilesResult,
} from "@/types/accounts-payable.types";

export const usePaymentCycle = () => {
   const api = useApi();
   const queryClient = useQueryClient();
   const [isLoading, setIsLoading] = useState(false);

   // Create voucher payment types query function
   const createVoucherPaymentTypesQuery = useCallback(() => {
      return {
         queryKey: ["voucher-payment-types"],
         queryFn: async (): Promise<Array<{
            id: string;
            label: string;
            value: string;
         }>> => {
            try {
               const response = await api.payment.getAllVoucherPaymentTypes();
               return response?.data?.items ?? [];
            } catch (error) {
               console.error("Failed to fetch payment types:", error);
               return [];
            }
         },
         enabled: false, // Disabled by default to maintain manual trigger behavior
         
         refetchOnMount: true, // Always refetch on mount
      };
   }, [api]);

   // Manual fetch function that maintains original behavior
   const fetchVoucherPaymentTypes = useCallback(async (): Promise<Array<{
      id: string;
      label: string;
      value: string;
   }>> => {
      try {
         const queryInfo = createVoucherPaymentTypesQuery();
         
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
         console.error("Failed to fetch payment types:", error);
         return [];
      }
   }, [queryClient, createVoucherPaymentTypesQuery]);

   // Fetch company maintenance data
   const fetchCompanyMaintenance = useCallback(async (
      companyNo: number
   ): Promise<CompanyMaintenanceData> => {
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
         console.error("Error loading company data:", error);
         throw error;
      }
   }, [api]);

   // Fetch GL Master
   const fetchGlMaster = useCallback(async ({
      companyNo,
      glNo,
   }: {
      companyNo: number;
      glNo: number;
   }): Promise<{
      success: boolean;
      description?: string;
      data?: unknown;
      message?: string;
   }> => {
      try {
         const response = await api.accountPayable.getGlMaster({
            companyNo,
            glNo,
         });

         return {
            success: true,
            description: response?.data?.items?.description || "",
            data: response?.data?.items,
         };
      } catch (error: unknown) {
         console.error("GL Master fetch error:", error);
         return {
            success: false,
            message:
               (error as { response?: { data?: { message?: string } } })?.response
                  ?.data?.message || "Failed to fetch GL account details",
         };
      }
   }, [api]);

   // Submit payment selection type
   const submitPaymentSelectionType = useCallback(async (
      data: PaymentTypeSubmissionData
   ): Promise<ApiResponse> => {
      try {
         const payload = {
            companyNo: data.companyNo,
            voucherToPay: data.voucherToPay,
            startingCheckNo: data.startingCheckNo,
            checkDate: data.checkDate,
            dateToPayBy: data.dateToPayBy,
            bankAccountGl: data.bankAccountGl,
            forcedDiscount: data.forcedDiscount,
            mode: data.mode,
         };

         const response = await api.payment.submitPaymentSelectionType(
            payload as never
         );

         return {
            success: true,
            message:
               response?.data?.message ||
               "Payment type selection submitted successfully",
            data: response?.data,
         };
      } catch (error: unknown) {
         const errorObj = error as any;
         if (errorObj?.error?.error?.details) {
            return {
               success: false,
               message: errorObj.error.error.message || "Validation failed",
               data: null,
               error: errorObj.error.error,
            };
         }
         
         return {
            success: false,
            message:
               (error as { response?: { data?: { message?: string } } })?.response
                  ?.data?.message || "Failed to submit payment type selection",
            data: null,
         };
      }
   }, [api]);

   // Submit vendor payment
   const submitVendorPayment = useCallback(async (
      data: VendorPaymentData
   ): Promise<ApiResponse> => {
      try {
         const payload = {
            companyNo: data.companyNo,
            voucherToPay: data.voucherToPay,
            bankAccountGl: data.bankAccountGl,
            startingCheckNo: data.startingCheckNo,
            checkDate: data.checkDate,
            dateToPayBy: data.dateToPayBy,
            item: {
               entrySequence: data.entrySequence,
               vendorNo: data.vendorNo,
               voucherNo: data.voucherNo,
               partialPayAmount: data.partialPayAmount,
               discountAmount: data.discountAmount,
               payOrHold: data.payOrHold,
               singleCheck: data.singleCheck,
               makePrepaid: data.makePrepaid,
               prepaidCheckNo: data.prepaidCheckNo,
               prepaidDate: data.prepaidDate,
               forcedDiscount: data.forcedDiscount,
               mode: data.mode,
            },
         };

         const response = await api.payment.submitVendorPayment(payload as never);

         return {
            success: true,
            message:
               response?.data?.message || "Vendor payment processed successfully",
            data: response?.data,
         };
      } catch (error: unknown) {
         const errorObj = error as any;
         
         if (errorObj?.error?.error?.details) {
            return {
               success: false,
               message: errorObj.error.error.message || "Validation failed",
               data: null,
               error: errorObj.error.error,
            };
         }
         
         return {
            success: false,
            message:
               (error as { response?: { data?: { message?: string } } })?.response
                  ?.data?.message || "Failed to process vendor payment",
            data: null,
         };
      }
   }, [api]);

   // Generate report
   const generateReport = useCallback(async (
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

         if (response.data?.items?.message) {
            console.log(
               "Report generated successfully:",
               response.data.items.message
            );
         }

         return response;
      } catch (error) {
         console.error("Error generating report:", error);
         throw error;
      } finally {
         setIsLoading(false);
      }
   }, [api]);

   // Generate report files
   const generateReportFiles = useCallback(async (
      payload: GenerateReportFilesPayload
   ): Promise<GenerateReportFilesResult> => {
      try {
         setIsLoading(true);
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
   }, [api]);

   // Helper function to determine file type from formType or filename
   const getFileType = (formType?: string, fileName?: string): string => {
      const cleanFormType = formType?.trim().toUpperCase();
      
      // Check formType first
      if (cleanFormType === "XLSX" || cleanFormType === "XLS" || cleanFormType === "CSV") {
         return "excel";
      }
      if (cleanFormType === "PDF") {
         return "pdf";
      }
      if (cleanFormType === "TXT" || cleanFormType === "TEXT") {
         return "txt";
      }
      
      // Fallback to filename extension
      if (fileName) {
         const extension = fileName.split('.').pop()?.toUpperCase();
         if (extension === "XLSX" || extension === "XLS" || extension === "CSV") {
            return "excel";
         }
         if (extension === "PDF") {
            return "pdf";
         }
         if (extension === "TXT") {
            return "txt";
         }
      }
      
      // Default to pdf
      return "pdf";
   };

   // Fetch cash requirement reports
   const fetchCashRequirementReports = useCallback(async ({
      voucherToPay,
      search,
      current_page = 1,
      items_per_page = 500,
      sortBy,
      sortOrder,
      reportType,
   }: {
      voucherToPay: "Check" | "ACH" | "Wire" | "Employee Expense" | "Utility";
      search?: string;
      current_page?: number;
      items_per_page?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
      reportType?: string;
   }): Promise<unknown[]> => {
      try {
         const response = await api.payment.getCashRequirementReports({
            voucherToPay,
            search,
            current_page,
            items_per_page,
            sortBy,
            sortOrder,
            reportType,
         });

         if (response?.data?.items) {
            return response.data.items.map((item: any, index) => ({
               ...item,
               key: String(item.fileName ?? index),
               id: String(item.fileName ?? index),
               status: "Ready",
               fileType: getFileType(item.formType, item.pdfFileName || item.fileName),
               fileName: item.pdfFileName || item.fileName,
            }));
         }

         return [];
      } catch (error: unknown) {
         console.error("Cash requirement reports fetch error:", error);
         return [];
      }
   }, [api]);

   // Fetch AP check reports
   const fetchApCheckReports = useCallback(async ({
      voucherToPay = "Check",
      search,
      current_page = 1,
      items_per_page = 500,
      sortBy,
      sortOrder,
      reportType,
   }: {
      voucherToPay?: string;
      search?: string;
      current_page?: number;
      items_per_page?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
      reportType?: string;
   }): Promise<unknown[]> => {
      try {
         const response = await api.payment.getApCheckReports({
            voucherToPay,
            search,
            current_page,
            items_per_page,
            sortBy,
            sortOrder,
            reportType,
         });

         if (response?.data?.items) {
            return response.data.items.map((item: any, index) => ({
               ...item,
               key: String(item.fileName ?? index),
               id: String(item.fileName ?? index),
               fileType: getFileType(item.formType, item.pdfFileName || item.fileName),
               fileName: item.pdfFileName || item.fileName,
            }));
         }

         return [];
      } catch (error: unknown) {
         console.error("AP Check reports fetch error:", error);
         return [];
      }
   }, [api]);

   // Print checks (for PrintChecks component)
   const printChecks = useCallback(async (): Promise<void> => {
      try {
         const payload = {
            name: "Payment_Cycle_Check_Cash_Print_Checks_Print",
            parameters: [],
         };

         const response = await api.globalStates.generateReport(
            { name: "Payment_Cycle_Check_Cash_Print_Checks_Print" },
            payload
         );

         if (response.data?.items?.message) {
            console.log("Print checks report generated successfully");
         }
      } catch (error) {
         console.error("Error generating check printing report:", error);
         throw error;
      }
   }, [api]);

   return {
      // Loading states
      isLoading,
      
      // API functions
      fetchVoucherPaymentTypes,
      fetchCompanyMaintenance,
      fetchGlMaster,
      submitPaymentSelectionType,
      submitVendorPayment,
      generateReport,
      generateReportFiles,
      fetchCashRequirementReports,
      fetchApCheckReports,
      printChecks,
      
      // Query creators for components that want to use useQuery directly
      createVoucherPaymentTypesQuery,
   };
};

export default usePaymentCycle;
