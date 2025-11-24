import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useApi } from "./useApi";
import { formatCurrency } from "@utils/formatters";
import { formatMMDDYYForDisplay } from "@utils/dateFormat";

// Hook for fetching voucher maintenance data
export const useVoucherMaintenance = (queryParams: {
  companyNo: number;
  vendorNo?: number;
  voucherType: "PAID" | "UNPAID" | "ALL";
  invoiceDate?: string;
  invoiceNo?: string;
  sortBy: "invoiceDate";
  sortOrder: "DESC";
  current_page: number;
  items_per_page: number;
}, enabled: boolean = false) => {
  const api = useApi();
  
  return useQuery({
    queryKey: ["voucherMaintenance", queryParams],
    queryFn: async () => {
      // Maintain exact same API call and payload structure
      // Map UI params (current_page/items_per_page) to API params (page/limit)
      const apiParams: any = {
        companyNo: queryParams.companyNo,
        vendorNo: queryParams.vendorNo,
        voucherType: queryParams.voucherType,
        invoiceDate: queryParams.invoiceDate,
        invoiceNo: queryParams.invoiceNo,
        sortBy: queryParams.sortBy,
        sortOrder: queryParams.sortOrder,
        page: queryParams.current_page,
        limit: queryParams.items_per_page,
      };
      const response = await api.voucherMaintenance.voucherMaintenance(apiParams);

      // @ts-ignore - API response type is not properly defined in schema
      if (response?.data?.items) {
        // @ts-ignore - API response type is not properly defined in schema
        const items = response.data.items as any[];
        return items.map((item: any) => {
          return {
            key: `${(
              item.voucherNo ||
              item.entryNo ||
              item.voucher_no ||
              item.entry_no ||
              item.id
            )?.toString()}_${queryParams.current_page}_${items.indexOf(item)}`,
            invoiceNo:
              item.invoiceNumber ||
              item.invoiceNo ||
              item.invoice_number ||
              item.invoice_no ||
              "-",
            invoiceDate: formatMMDDYYForDisplay(item.invoiceDate),
            grossAmount: formatAmount(item.grossAmount),
            dueDate: formatMMDDYYForDisplay(item.dueDate),
            discountDate:
              (item.discountDueDate &&
                String(item.discountDueDate) !== "0") ||
              (item.discountDate && String(item.discountDate) !== "0")
                ? formatMMDDYYForDisplay(
                    item.discountDueDate || item.discountDate
                  )
                : "-",
            discAmount: formatAmount(item.discountAmount),
            netAmount: formatAmount(item.netAmount),
            invoiceDesc: item.invoiceDescription || "-",
            paidDate: formatMMDDYYForDisplay(item.paidDate),
            checkNo: item.checkNo || "-",
            paidAmount: formatAmount(item.grossAmount),
            status: item.voucherStatus === "PAID" ? "Paid" : item.voucherStatus === "CANCELLED" ? "Cancelled" : "Unpaid",
            entryNo:
              item.voucherNo ||
              item.entryNo ||
              item.voucher_no ||
              item.entry_no ||
              0,
            companyNo: item.companyNo || queryParams.companyNo,
            vendorNo: item.vendorNo?.toString() || "0",
            vendorName: item.vendorName || "-",
            tenderNo: item.tenderNo || "-",
            discount: formatAmount(item.discount),
            // Map voucher status code and description from API for Status Code Entry modal
            holdPaymentFlag: item.holdPaymentFlag || "",
            holdDescription:
              item.holdDescription || item.statusDescription || "",
          };
        });
      } else {
        return [];
      }
    },
    enabled,
  });
};

// Hook for fetching voucher maintenance summary
export const useVoucherMaintenanceSummary = (queryParams: {
  voucherType: "PAID" | "UNPAID" | "ALL";
  companyNo: number;
  vendorNo: number;
}, enabled: boolean = false) => {
  const api = useApi();
  
  return useQuery({
    queryKey: ["voucherMaintenanceSummary", queryParams],
    queryFn: async () => {
      // Maintain exact same API call and payload structure
      const response = await api.voucherMaintenance.getVoucherMaintenanceSummary(queryParams);

      // Handle different possible response structures (exact same logic)
      let summaryData = null;
      // @ts-ignore - API response has items property not reflected in types
      if (response?.data?.items && response.data.items.length > 0) {
        // @ts-ignore - API response has items property not reflected in types
        summaryData = response.data.items;
      } else if (response?.data?.data && response.data.data.length > 0) {
        summaryData = response.data.data;
      } else if (
        response?.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        summaryData = response.data;
      } else {
        return null;
      }

      if (summaryData && summaryData.length > 0) {
        const summaryItem = summaryData[0];

        // Use appropriate date field based on voucher type
        const dateValue =
          queryParams.voucherType === "UNPAID"
            ? summaryItem.openPayablesDate
            : summaryItem.lastPaidDate;

        return {
          vendorName: (summaryItem.vendorName || " ").trim(), // Trim whitespace
          companyNo: summaryItem.companyNo?.toString() || queryParams.companyNo.toString(),
          vendorNo: summaryItem.vendorNo?.toString() || queryParams.vendorNo.toString(),
          openPayables: formatAmountForView(summaryItem.openPayables),
          openPayablesDate: formatMMDDYYForDisplay(summaryItem.openPayablesDate),
          lastPaidAmount: formatAmountForView(summaryItem.lastPaidAmount),
          lastPaidDate: formatMMDDYYForDisplay(dateValue),
        };
      }
      return null;
    },
    enabled,
  });
};

// Hook for fetching voucher details by ID
export const useVoucherMaintenanceById = (queryParams: {
  voucherNo: number;
  voucherType: "PAID" | "UNPAID";
  companyNo: number;
  vendorNo: number;
}, enabled: boolean = false) => {
  const api = useApi();
  
  return useQuery({
    queryKey: ["voucherMaintenanceById", queryParams],
    queryFn: async () => {
      // Maintain exact same API call and payload structure
      const response = await api.voucherMaintenance.getVoucherMaintenanceById(queryParams);
      return response?.data;
    },
    enabled,
  });
};

// Manual fetch function for getVoucherMaintenanceById (to replace direct API calls)
export const useVoucherMaintenanceByIdManual = () => {
  const api = useApi();
  
  const fetchVoucherMaintenanceById = useCallback(async (queryParams: {
    voucherNo: number;
    voucherType: "PAID" | "UNPAID";
    companyNo: number;
    vendorNo: number;
  }) => {
    try {
      // Maintain exact same API call and payload structure
      const response = await api.voucherMaintenance.getVoucherMaintenanceById(queryParams);
      return response;
    } catch (error) {
      console.error("Error fetching voucher maintenance by ID:", error);
      throw error;
    }
  }, [api]);

  return {
    fetchVoucherMaintenanceById,
  };
};

// Hook for transferring/canceling voucher
export const useTransferVoucher = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: {
      voucherType: "PAID" | "UNPAID";
      companyNo: number;
      vendorNo: number;
      voucherNo: number;
    }) => {
      // Maintain exact same API call and payload structure
      return await api.voucherMaintenance.transferVoucher(payload as any);
    },
    onSuccess: () => {
      // Remove cached data and force refetch to ensure empty arrays are properly handled
      queryClient.removeQueries({ queryKey: ["voucherMaintenance"] });
      queryClient.removeQueries({ queryKey: ["voucherMaintenanceSummary"] });
      
      // Also invalidate to trigger refetch for any active queries
      queryClient.invalidateQueries({ queryKey: ["voucherMaintenance"] });
      queryClient.invalidateQueries({ queryKey: ["voucherMaintenanceSummary"] });
    },
  });
};

// Hook for updating voucher discount
export const useUpdateVoucherDiscount = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: {
      companyNo: number;
      vendorNo: number;
      voucherNo: number;
      discountDueDate: string;
      discount: number;
    }) => {
      // Maintain exact same API call and payload structure
      return await api.voucherMaintenance.updateVoucherDiscount(payload);
    },
    onSuccess: () => {
      // Remove cached data and force refetch to ensure empty arrays are properly handled
      queryClient.removeQueries({ queryKey: ["voucherMaintenance"] });
      queryClient.removeQueries({ queryKey: ["voucherMaintenanceSummary"] });
      
      // Also invalidate to trigger refetch for any active queries
      queryClient.invalidateQueries({ queryKey: ["voucherMaintenance"] });
      queryClient.invalidateQueries({ queryKey: ["voucherMaintenanceSummary"] });
    },
  });
};

// Hook for updating voucher status
export const useUpdateVoucherStatus = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: {
      companyNo: number;
      vendorNo: number;
      voucherNo: number;
      statusCode: " " | "H" | "A" | "W" | "E" | "U";
      statusDescription: string;
    }) => {
      // Maintain exact same API call and payload structure
      return await api.voucherMaintenance.updateVoucherMaintenanceStatus(payload);
    },
    onSuccess: () => {
      // Remove cached data and force refetch to ensure empty arrays are properly handled
      queryClient.removeQueries({ queryKey: ["voucherMaintenance"] });
      queryClient.removeQueries({ queryKey: ["voucherMaintenanceSummary"] });
      
      // Also invalidate to trigger refetch for any active queries
      queryClient.invalidateQueries({ queryKey: ["voucherMaintenance"] });
      queryClient.invalidateQueries({ queryKey: ["voucherMaintenanceSummary"] });
    },
  });
};

// Helper functions (exact same as original)
const formatAmount = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || amount === 0) return "-";
  return formatCurrency(amount);
};

const formatAmountForView = (amount: any): string => {
  if (amount === null || amount === undefined || amount === 0 || amount === "0") return "-";
  return formatCurrency(amount);
};
