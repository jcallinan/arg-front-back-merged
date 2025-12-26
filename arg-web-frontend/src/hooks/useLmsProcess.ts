import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./useApi";
import { PROCESS_TYPE_ENUM } from "@api/api-schema/api";

// Hook for fetching LMS entries (Review Batch)
export const useLmsEntries = (companyNo: number = 10, enabled: boolean = true) => {
  const api = useApi();
  
  return useQuery({
    queryKey: ["lmsEntries", companyNo],
    queryFn: async () => {
      const response = await api.accountPayable.getLmsEntry({
        current_page: 1,
        items_per_page: 500,
        companyNo,
        processType: "LMS",
      });
      return response?.data?.items ?? [];
    },
    enabled,
    refetchOnMount: enabled,
  });
};

// Hook for fetching LMS voucher summary
export const useLmsVoucherSummary = (companyNo: number = 10, enabled: boolean = true) => {
  const api = useApi();
  
  return useQuery({
    queryKey: ["lmsVoucherSummary", companyNo],
    queryFn: async () => {
      const response = await api.accountPayable.getVoucherSummary({
        companyNo,
        processType: PROCESS_TYPE_ENUM.LMS,
      });
      
      // Handle both nested and direct response structures
      const data = response?.data;
      if (data && typeof data === 'object' && 'items' in data) {
        return data.items;
      }
      return data;
    },
    enabled,
    retry: false, // Don't retry on failure as this is optional data
  });
};

// Hook for fetching LMS Carrier Invoices (Freight Invoice Import)
export const useLmsCarrierInvoices = (companyNo: number = 10) => {
  const api = useApi();
  
  return useQuery({
    queryKey: ["lmsCarrierInvoices", companyNo],
    queryFn: async () => {
      const response = await api.accountPayable.getLmsCarrierInvoices({
        current_page: 1,
        items_per_page: 500,
        companyNo,
        processType: "LMS",
      });
      return response?.data?.items ?? [];
    },
    refetchOnMount: true,
  });
};

// Hook for creating LMS batch
export const useLmsBatchCreate = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      companyNo: number;
      processType: string;
      invoices: Array<{
        carrierId: string;
        carrierInvoiceNo: string;
        ordShipDate: string;
        invoiceType: string;
        ourOrderNo: number;
        shippingReferenceNo: number;
        invoiceAmount: number;
        invoiceDate: string;
        companyNo: number;
      }>;
    }) => {
      return await api.accountPayable.lmsBatchCreate(payload as any);
    },
    onSuccess: () => {
      // Remove cached data and force refetch for review batch views
      queryClient.removeQueries({ queryKey: ["lmsEntries"] });
      queryClient.removeQueries({ queryKey: ["lmsVoucherSummary"] });
      
      // Invalidate review batch queries now; LMS carrier invoices will be invalidated
      // AFTER review batch APIs complete to ensure correct ordering.
      queryClient.invalidateQueries({ queryKey: ["lmsEntries"] });
      queryClient.invalidateQueries({ queryKey: ["lmsVoucherSummary"] });
    },
  });
};