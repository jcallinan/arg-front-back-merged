import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./useApi";
import type {
   VendorApiResponse,
   Vendor1099Data,
   VendorDetailsByYearParams,
   VendorDetailsParams,
   UpdateVendorByYearData,
   Update1099FileData,
   ApPeriodEndReportItem,
   FileData,
} from "@/types/accounts-payable.types";
import { formatPhoneNumber } from "@utils/MobilenumberFormat";



export const useApPeriodEnd = () => {
   const api = useApi();
   const queryClient = useQueryClient();
   const [isLoading, setIsLoading] = useState(false);

   // Create vendors by year query function
   const createVendorsByYearQuery = useCallback(({
      companyNo,
      year,
      current_page = 1,
      items_per_page = 500,
      search,
      sortBy,
      sortOrder,
   }: {
      companyNo: number;
      year: number;
      current_page?: number;
      items_per_page?: number;
      search?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
   }) => {
      const queryParams = {
         companyNo,
         year,
         current_page,
         items_per_page,
         search,
         sortBy,
         sortOrder,
      };

      return {
         queryKey: [
            "vendors-by-year",
            companyNo,
            year,
            current_page,
            items_per_page,
            search,
            sortBy,
            sortOrder,
         ],
         queryFn: async (): Promise<{ items: any[]; pagination?: {
            count?: number;
            page?: number;
            limit?: number;
            totalPages?: number;
            hasNextPage?: boolean;
            hasPrevPage?: boolean;
         } }> => {
            try {
               const { data } = await api.apPeriodEnd.getVendorsByYear(queryParams);

               // Use a loose type to safely access optional pagination shapes without changing api.ts types
               const anyData = data as any;

               // Normalize pagination metadata across possible response shapes
               const pagination = {
                  count: (anyData?.count ?? anyData?.pagination?.total_items ?? anyData?.pagination?.count) as number | undefined,
                  page: (anyData?.page ?? anyData?.pagination?.current_page) as number | undefined,
                  limit: (anyData?.limit ?? anyData?.pagination?.items_per_page) as number | undefined,
                  totalPages: (anyData?.totalPages ?? anyData?.pagination?.total_pages) as number | undefined,
                  hasNextPage: (anyData?.hasNextPage ?? (typeof anyData?.page === 'number' && typeof anyData?.totalPages === 'number' ? anyData.page < anyData.totalPages : undefined)) as boolean | undefined,
                  hasPrevPage: (anyData?.hasPrevPage ?? (typeof anyData?.page === 'number' ? anyData.page > 1 : undefined)) as boolean | undefined,
               };

               return {
                  items: data?.items || [],
                  pagination,
               };
            } catch (error) {
               console.error("Error fetching vendors by year:", error);
               throw error;
            }
         },
         enabled: false, // Disabled by default to maintain manual trigger behavior
         
         refetchOnMount: true, // Always refetch on mount
      };
   }, [api]);

   // Manual fetch function that maintains original behavior
   const fetchVendorsByYear = useCallback(async ({
      companyNo,
      year,
      current_page = 1,
      items_per_page = 500,
      search,
      sortBy,
      sortOrder,
   }: {
      companyNo: number;
      year: number;
      current_page?: number;
      items_per_page?: number;
      search?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
   }): Promise<{
      items: any[];
   }> => {
      try {
         const queryInfo = createVendorsByYearQuery({
            companyNo, year, current_page, items_per_page, search, sortBy, sortOrder
         });
         
         // Invalidate existing cache before fetching to ensure fresh data
         await queryClient.invalidateQueries({ queryKey: queryInfo.queryKey });
         
         // Use fetchQuery to manually trigger the query
         const result = await queryClient.fetchQuery(queryInfo);
         
         // If result has empty items, ensure any cached data is cleared
         if (result.items.length === 0) {
            queryClient.setQueryData(queryInfo.queryKey, { items: [] });
         }
         
         return result;
      } catch (error) {
         console.error("Error fetching vendors by year:", error);
         throw error;
      }
   }, [queryClient, createVendorsByYearQuery]);

   // Create vendor details by year query function
   const createVendorDetailsByYearQuery = useCallback((params: VendorDetailsByYearParams) => {
      return {
         queryKey: ["vendor-details-by-year", params],
         queryFn: async () => {
            try {
               const { data } = await api.apPeriodEnd.getVendorDetailsByYear(params);
               return data?.items || null;
            } catch (error) {
               console.error("Error fetching vendor details by year:", error);
               throw error;
            }
         },
         enabled: false, // Disabled by default to maintain manual trigger behavior
      };
   }, [api]);

   // Manual fetch function that maintains original behavior
   const fetchVendorDetailsByYear = useCallback(async (params: VendorDetailsByYearParams) => {
      try {
         const queryInfo = createVendorDetailsByYearQuery(params);
         
         // Use fetchQuery to manually trigger the query
         const result = await queryClient.fetchQuery(queryInfo);
         return result;
      } catch (error) {
         console.error("Error fetching vendor details by year:", error);
         throw error;
      }
   }, [queryClient, createVendorDetailsByYearQuery]);

   // Create vendor details query function (fallback)
   const createVendorDetailsQuery = useCallback((params: VendorDetailsParams) => {
      return {
         queryKey: ["vendor-details-fallback", params],
         queryFn: async () => {
            try {
               const { data } = await api.vendorManagement.getVendorDetails(params);
               const items = data?.items as
                  | { vendor: any; vendorContactDetails: any[] }
                  | undefined;
               return {
                  vendor: items?.vendor || {},
                  vendorContactDetails: items?.vendorContactDetails || [],
               };
            } catch (error) {
               console.error("Error fetching vendor details:", error);
               throw error;
            }
         },
         enabled: false, // Disabled by default to maintain manual trigger behavior
      };
   }, [api]);

   // Manual fetch function that maintains original behavior (fallback)
   const fetchVendorDetails = useCallback(async (params: VendorDetailsParams) => {
      try {
         const queryInfo = createVendorDetailsQuery(params);
         
         // Use fetchQuery to manually trigger the query
         const result = await queryClient.fetchQuery(queryInfo);
         return result;
      } catch (error) {
         console.error("Error fetching vendor details:", error);
         throw error;
      }
   }, [queryClient, createVendorDetailsQuery]);

   // Update vendor by year mutation
   const updateVendorByYearMutation = useMutation({
      mutationFn: async ({ year, vendorNo, updatePayload }: {
         year: string;
         vendorNo: string;
         updatePayload: UpdateVendorByYearData;
      }) => {
         await api.apPeriodEnd.updateVendorByYear({ year, vendorNo }, updatePayload);
         return { success: true };
      },
      onError: (error) => {
         console.error("Error updating vendor by year:", error);
      },
   });

   // Manual update function that maintains original behavior
   const updateVendorByYear = useCallback(async (
      year: string,
      vendorNo: string,
      updatePayload: UpdateVendorByYearData
   ) => {
      try {
         const result = await updateVendorByYearMutation.mutateAsync({
            year, vendorNo, updatePayload
         });
         return result;
      } catch (error) {
         console.error("Error updating vendor by year:", error);
         throw error;
      }
   }, [updateVendorByYearMutation]);

   // Fetch all AP Period End reports
   const fetchAllApPeriodEndReports = useCallback(async (queryParams: any) => {
      try {
         setIsLoading(true);
         const response = await api.apPeriodEnd.getAllApPeriodEndReports(queryParams);
         return response.data;
      } catch (error) {
         console.error("Error fetching all AP Period End reports:", error);
         throw error;
      } finally {
         setIsLoading(false);
      }
   }, [api]);

   // Fetch AP Period End reports (specific)
   const fetchApPeriodEndReports = useCallback(async (queryParams: any) => {
      try {
         const response = await api.apPeriodEnd.getApPeriodEndReports(queryParams);
         return response.data;
      } catch (error) {
         console.error("Error fetching AP Period End reports:", error);
         throw error;
      }
   }, [api]);

   // Soft delete record
   const softDeleteRecord = useCallback(async (
      queryParams: any,
      deleteData: any
   ) => {
      try {
         const response = await api.apPeriodEnd.softDeleteRecord(queryParams, deleteData);
         return response;
      } catch (error) {
         console.error("Error soft deleting record:", error);
         throw error;
      }
   }, [api]);

   // Post AP Period End reports
   const postApPeriodEndReports = useCallback(async (payload: {
      tin: string;
      ctl: string;
      data: any;
   }) => {
      try {
         const response = await api.apPeriodEnd.postApPeriodEndReports(payload);
         return response.data;
      } catch (error) {
         console.error("Error posting AP Period End reports:", error);
         throw error;
      }
   }, [api]);

   // Fetch company details
   const fetchCompanyDetails = useCallback(async (queryParams: { companyNo: number }): Promise<any> => {
      try {
         setIsLoading(true);
         const response = await api.apPeriodEnd.getCompanyDetails(queryParams);
         return response.data?.items || {};
      } catch (error) {
         console.error("Error fetching company details:", error);
         throw error;
      } finally {
         setIsLoading(false);
      }
   }, [api]);

   // Fetch Year End Process Menu Review Files
   const fetchYearEndProcessMenuReviewFiles = useCallback(async (queryParams: {
      companyNo: number;
      reportType: string;
      current_page?: number;
      items_per_page?: number;
   }): Promise<{
      items: any[];
      pagination?: any;
   }> => {
      try {
         const response = await api.apPeriodEnd.getYearEndProcessMenuReviewFiles(queryParams);
         return {
            items: response.data?.items || [],
            pagination: response.data?.pagination,
         };
      } catch (error) {
         console.error("Error fetching Year End Process Menu Review Files:", error);
         throw error;
      }
   }, [api]);

   // Transform vendor data utility function
   const transformVendorData = useCallback((
      vendors: any[],
      apiPage: number
   ): Vendor1099Data[] => {

     

      const getVendorStatus = (isDeleted?: string): string => {
         const status = isDeleted?.trim() || "";
         return status === "Inactive" || status === "D" || status === "Y"
            ? "Inactive"
            : "Active";
      };

      // Format currency
      const formatCurrency = (amount?: number): string => {
         if (amount === undefined || amount === null) return "";
         return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
         }).format(amount);
      };

      // Format date
      const formatMMDDYYForDisplay = (dateStr?: string): string => {
         if (!dateStr) return "";
         // Assuming the date comes in a format that needs to be displayed as MM/DD/YY
         return dateStr; // Adjust this based on your actual date format requirements
      };

      return vendors.map((vendor, index) => ({
         key: `${vendor.vendorNo || index}_${apiPage}_${index}`,
         vendorNo: vendor.vendorNo || 0,
         vendorName: vendor.vendorName?.trim() || `Vendor ${vendor.vendorNo || index}`,
         telephone: formatPhoneNumber(vendor.vendorAreaCode, vendor.vendorTelephoneNo),
         lastPmtAmt: formatCurrency(vendor.vendorLastPaymentAmt),
         lastPmtDate: formatMMDDYYForDisplay(vendor.vendorLastPaymentDate),
         type:vendor.vendorHoldPaymentsVend || '-',
         status: getVendorStatus(vendor.vendorIsDeleted),
         originalData: vendor as VendorApiResponse,
      }));
   }, []);

   // Transform 1099 file data utility function
   const transform1099FileData = useCallback((items: ApPeriodEndReportItem[]): Update1099FileData[] => {
      return items.map((item: ApPeriodEndReportItem, index: number) => ({
         key: `${index + 1}`,
         recordType: item.recordType || "",
         ctl: item.ctl || "-",
         tin: item.tin || "-",
         firstPayeeName: item.firstPayeeName || "-",
      }));
   }, []);

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

   // Transform review files data utility function
   const transformReviewFilesData = useCallback((items: any[]): FileData[] => {
      return items.map((item, index) => ({
         key: `${index + 1}`,
         reportType: item.reportType?.trim() || "",
         fileName: item.pdfFileName?.trim() || "",
         reportDateTime: item.reportDateTime,
         filePath: item.filePath || "",
         formType: item.formType?.trim(),
         reportFile: item.fileName?.trim(),
         status: "Ready" as const,
         fileType: getFileType(item.formType, item.pdfFileName || item.fileName),
      }));
   }, []);

   return {
      // Loading states
      isLoading,
      
      // API functions
      fetchVendorsByYear,
      fetchVendorDetailsByYear,
      fetchVendorDetails,
      updateVendorByYear,
      fetchAllApPeriodEndReports,
      fetchApPeriodEndReports,
      softDeleteRecord,
      postApPeriodEndReports,
      fetchCompanyDetails,
      fetchYearEndProcessMenuReviewFiles,
      
      // Utility functions
      transformVendorData,
      transform1099FileData,
      transformReviewFilesData,
      
      // Query creators for components that want to use useQuery directly
      createVendorsByYearQuery,
      createVendorDetailsByYearQuery,
      createVendorDetailsQuery,
      
      // Mutation objects for components that want to use useMutation directly
      updateVendorByYearMutation,
   };
};

export default useApPeriodEnd;
