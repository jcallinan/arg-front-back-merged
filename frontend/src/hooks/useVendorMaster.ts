import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useApi } from "./useApi";
import { formatCurrency } from "@/utils/formatters";
import { formatMMDDYYForDisplay } from "@/utils/dateFormat";
import { formatPhoneNumber } from "@utils/MobilenumberFormat";
import type { VendorData, VendorDetails } from "@/types/accounts-payable.types";

// Utility functions for data formatting
const formatVendorAddress = (vendor: Partial<VendorDetails>) => {
   const address = [
      vendor.vendorAdd1?.trim(),
      vendor.vendorAdd2?.trim(),
      vendor.vendorAdd3?.trim(),
      vendor.vendorAdd4?.trim(),
   ].filter(Boolean);
   return address.join(", ");
};


const formatDate = (date: number | string) => {
   if (!date) return "";
   const dateStr = date.toString().padStart(6, "0");
   const year = "20" + dateStr.slice(0, 2);
   const month = dateStr.slice(2, 4);
   const day = dateStr.slice(4, 6);
   return `${year}-${month}-${day}`;
};

const formatVendorData = (vendor: Partial<VendorDetails>): VendorDetails => {
   return {
      ...vendor,
      vendorAdd1: vendor.vendorAdd1?.trim() || "",
      vendorAdd2: vendor.vendorAdd2?.trim() || "",
      vendorAdd3: vendor.vendorAdd3?.trim() || "",
      vendorAdd4: vendor.vendorAdd4?.trim() || "",
      vendorAddress: formatVendorAddress(vendor),
      vendorPhone: formatPhoneNumber(
         vendor.vendorAreaCode || 0,
         vendor.vendorTelephoneNo || 0
      ),
      vendorName: vendor.vendorName?.trim() || "",
      vendorFirstName: vendor.vendorFirstName?.trim() || "",
      vendorMiddleName: vendor.vendorMiddleName?.trim() || "",
      vendorBusinessLastName: vendor.vendorBusinessLastName?.trim() || "",
      vendorNameSuffix: vendor.vendorNameSuffix?.trim() || "",
      vendorPayeeName1: vendor.vendorPayeeName1?.trim() || "",
      vendorPayeeName2: vendor.vendorPayeeName2?.trim() || "",
      vendorLastPaymentDate: vendor.vendorLastPaymentDate
         ? formatDate(vendor.vendorLastPaymentDate)
         : "",
      vendorAchBankAccountNumber:
         vendor.vendorAchBankAccountNumber?.trim() || "",
      vendorAchCheckingOrSavings:
         vendor.vendorAchCheckingOrSavings?.trim() || "",
      vendorAchClass: vendor.vendorAchClass?.trim() || "",
      vendorCarrierId: vendor.vendorCarrierId?.trim() || "",
      vendorCategoryCode: vendor.vendorCategoryCode?.trim() || "",
      vendorCountryCode: vendor.vendorCountryCode?.trim() || "",
      vendorHoldPaymentsVend: vendor.vendorHoldPaymentsVend?.trim() || "",
      vendorIdNumber: vendor.vendorIdNumber?.trim() || "",
      vendorIrsNameControl: vendor.vendorIrsNameControl?.trim() || "",
      vendorSingleCheck: vendor.vendorSingleCheck?.trim() || "",
      vendorIsDeleted: vendor.vendorIsDeleted || "",
      vendorCompanyNumber: vendor.vendorCompanyNumber || 0,
      vendorNo: vendor.vendorNo || 0,
      vendorAchBankRoutingCode: vendor.vendorAchBankRoutingCode || 0,
      vendorAdpPayrollId: vendor.vendorAdpPayrollId || 0,
      vendorAlphaSortAbbr: vendor.vendorAlphaSortAbbr || "",
      vendorAp1099Code: vendor.vendorAp1099Code || "",
      vendorApTermsCode: vendor.vendorApTermsCode || 0,
      vendorAreaCode: vendor.vendorAreaCode || 0,
      vendorCurrentBalance: vendor.vendorCurrentBalance || 0,
      vendorExpenseGLSub: vendor.vendorExpenseGLSub || 0,
      vendorExtraZip: vendor.vendorExtraZip || 0,
      vendorFirst1099BoxNumber: vendor.vendorFirst1099BoxNumber || 0,
      vendorGalRcptsRequired: vendor.vendorGalRcptsRequired || "",
      vendorLastPaymentAmt: vendor.vendorLastPaymentAmt || 0,
      vendorLastPaymentDateAlt: vendor.vendorLastPaymentDateAlt || 0,
      vendorLastYearPurchases: vendor.vendorLastYearPurchases || 0,
      vendorLastYrYtdPaid: vendor.vendorLastYrYtdPaid || 0,
      vendorMtdDiscounts: vendor.vendorMtdDiscounts || 0,
      vendorMtdPayments: vendor.vendorMtdPayments || 0,
      vendorMtdPurchases: vendor.vendorMtdPurchases || 0,
      vendorNameOverflow: vendor.vendorNameOverflow || "",
      vendorPreviousBalance: vendor.vendorPreviousBalance || 0,
      vendorSecond1099BoxAmount: vendor.vendorSecond1099BoxAmount || 0,
      vendorSecond1099BoxNumber: vendor.vendorSecond1099BoxNumber || 0,
      vendorTelephoneNo: vendor.vendorTelephoneNo || 0,
      vendorThisYrYtdPaid: vendor.vendorThisYrYtdPaid || 0,
      vendorYtdDiscounts: vendor.vendorYtdDiscounts || 0,
      vendorYtdPurchases: vendor.vendorYtdPurchases || 0,
      vendorZipCode: vendor.vendorZipCode || 0,
   };
};

export const useVendorMaster = () => {
   const api = useApi();
   const queryClient = useQueryClient();
   const [loading, setLoading] = useState(false);

   // Create vendor list query function
   const createVendorListQuery = useCallback((
      companyNo: string,
      vendor?: string,
      selectedStatus?: string,
      selectedType?:string,
      apiPage: number = 1,
      apiSize: number = 500,
      isPaginationCall: boolean = false
   ) => {
      const queryParams = {
         companyNo: Number(companyNo),
         // Only include vendorNo filter for search, not for pagination
         ...(isPaginationCall
            ? {}
            : { vendorNo: vendor ? Number(vendor) : undefined }),
         status: selectedStatus,
         type:selectedType,
         current_page: apiPage,
         items_per_page: apiSize,
      };

      return {
         queryKey: [
            "vendor-list", 
            companyNo, 
            vendor, 
            selectedStatus, 
            apiPage, 
            apiSize, 
            isPaginationCall
         ],
         queryFn: async (): Promise<VendorData[]> => {
            try {
               const { data } = await api.vendorManagement.getVendorList(queryParams);

               const transformed: VendorData[] = (data?.items || []).map((item: any, index) => ({
                  key: `${item.vendorNo || index}_${apiPage}_${index}`,
                  vendorNo: item.vendorNo || 0,
                  vendorName: item.vendorName || `Vendor ${item.vendorNo || index}`, // Placeholder since API doesn't provide vendorName
                  telephone: item.vendorTelephoneNo ? formatPhoneNumber(item.vendorAreaCode, item.vendorTelephoneNo) : "-",
                  lastPmtAmt: formatCurrency(item.vendorLastPaymentAmt || 0),
                  lastPmtDate: formatMMDDYYForDisplay(
                     item.vendorLastPaymentDate || "-"
                  ),
                  type: item.vendorHoldPaymentsVend?.trim() || "-",
                  status: item.vendorIsDeleted,
               }));

               return transformed;
            } catch (error) {
               console.error("Error fetching vendor list:", error);
               return [];
            }
         },
         enabled: false, // Disabled by default to maintain manual trigger behavior

         refetchOnMount: true, // Always refetch on mount
      };
   }, [api]);

   // Manual fetch function that maintains original behavior
   const fetchVendorList = useCallback(async (
      companyNo: string,
      vendor?: string,
      selectedStatus?: string,
      selectedType?:string,
      apiPage: number = 1,
      apiSize: number = 500,
      isPaginationCall: boolean = false
   ): Promise<VendorData[]> => {
      setLoading(true);
      try {
         const queryInfo = createVendorListQuery(
            companyNo, vendor, selectedStatus,selectedType, apiPage, apiSize, isPaginationCall
         );
         
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
         console.error("Error fetching vendor list:", error);
         return [];
      } finally {
         setLoading(false);
      }
   }, [api, queryClient, createVendorListQuery]);

   // Create vendor details query function
   const createVendorDetailsQuery = useCallback((vendorNo: number, companyNo: string) => {
      return {
         queryKey: ["vendor-details", vendorNo, companyNo],
         queryFn: async () => {
            try {
               const { data } = await api.vendorManagement.getVendorDetails({
                  vendorCompanyNumber: Number(companyNo),
                  vendorNo: vendorNo,
               });
               const items = data?.items as
                  | { vendor: any; vendorContactDetails: any[] }
                  | undefined;
               return {
                  vendor: items?.vendor || {},
                  vendorContactDetails: items?.vendorContactDetails || [],
               };
            } catch (error: any) {
               console.error("Error fetching vendor details:", error);
               
               // Check if it's a native Response object that needs to be parsed
               let apiError = error?.error?.error || error?.error || error?.response?.data?.error || error?.data?.error || error;
               
               // Handle native Response objects
               if (error instanceof Response) {
                 try {
                   const responseText = await error.text();
                   if (responseText) {
                     const parsedError = JSON.parse(responseText);
                     apiError = parsedError.error || parsedError;
                   }
                 } catch (parseError) {
                   console.error("Failed to parse VendorMaster details Response body:", parseError);
                 }
               }  
               if (apiError && (apiError.code || apiError.message)) {
                 if (apiError?.code === "SERVER_ERROR") {
                   if (apiError?.details && Array.isArray(apiError.details)) {
                     const serverError = apiError.details[0];
                     if (serverError && serverError.message) {
                       console.error("Server error:", serverError.message);
                     } else {
                       console.error("Server error:", apiError.message || "A server error occurred while loading vendor details.");
                     }
                   } else {
                     console.error("Server error:", apiError.message || "A server error occurred while loading vendor details.");
                   }
                 } else if (apiError?.code === "NOT_FOUND") {
                   console.error("Not found:", apiError.message || "Vendor not found.");
                 } else if (apiError?.message) {
                   console.error("API error:", apiError.message);
                 }
               }
               return null;
            }
         },
         enabled: false, // Disabled by default to maintain manual trigger behavior
       
         refetchOnMount: true, // Always refetch on mount
      };
   }, [api]);

   // Manual fetch function that maintains original behavior
   const fetchVendorDetails = useCallback(async (vendorNo: number, companyNo: string) => {
      try {
         const queryInfo = createVendorDetailsQuery(vendorNo, companyNo);
         
         // Remove existing cache completely to ensure fresh data
         queryClient.removeQueries({ queryKey: queryInfo.queryKey });
         
         // Use fetchQuery with staleTime: 0 to force fresh fetch
         const result = await queryClient.fetchQuery({
            ...queryInfo,
            staleTime: 0,
            gcTime: 0,
         });
         
         // If result is null or empty, ensure cached data is cleared
         if (!result || (result.vendorContactDetails && result.vendorContactDetails.length === 0)) {
            queryClient.setQueryData(queryInfo.queryKey, result);
         }
         
         return result;
      } catch (error) {
         console.error("Error fetching vendor details:", error);
         return null;
      }
   }, [queryClient, createVendorDetailsQuery]);

   return {
      loading,
      fetchVendorList,
      fetchVendorDetails,
      formatVendorData,
      // Expose query creators for components that want to use useQuery directly
      createVendorListQuery,
      createVendorDetailsQuery,
   };
};
