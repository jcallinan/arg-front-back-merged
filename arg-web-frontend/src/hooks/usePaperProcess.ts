import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./useApi";
import { PROCESS_TYPE_ENUM } from "@api/api-schema/api";

// Hook for fetching Paper entries (Review Batch)
export const usePaperEntries = (companyNo: number = 10, enabled: boolean = true) => {
  const api = useApi();
  
  return useQuery({
    queryKey: ["paperEntries", companyNo],
    queryFn: async () => {
      const response = await api.accountPayable.getPaperEntry({
        current_page: 1,
        items_per_page: 500,
        companyNo,
        processType: "PAPER",
      });
      return response?.data?.items ?? [];
    },
    enabled,
    refetchOnMount: enabled,
  });
};

// Hook for fetching Paper voucher summary
export const usePaperVoucherSummary = (companyNo: number = 10, enabled: boolean = true) => {
  const api = useApi();
  
  return useQuery({
    queryKey: ["paperVoucherSummary", companyNo],
    queryFn: async () => {
      const response = await api.accountPayable.getVoucherSummary({
        companyNo,
        processType: PROCESS_TYPE_ENUM.PAPER,
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

// Hook for fetching Carrier Invoices (Freight Invoice Import)
export const useCarrierInvoices = (companyNo: number = 10) => {
  const api = useApi();
  
  return useQuery({
    queryKey: ["carrierInvoices", companyNo],
    queryFn: async () => {
      const response = await api.accountPayable.getCarrierInvoices({
        current_page: 1,
        items_per_page: 500,
        companyNo,
        processType: "PAPER",
      });
      return response?.data?.items ?? [];
    },
    refetchOnMount: true,
  });
};

// Hook for creating Paper batch
export const usePaperBatchCreate = () => {
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
      return await api.accountPayable.paperBatchCreate(payload);
    },
    onSuccess: () => {
      // Remove cached data and force refetch for review batch views
      queryClient.removeQueries({ queryKey: ["paperEntries"] });
      queryClient.removeQueries({ queryKey: ["paperVoucherSummary"] });
      
      // Invalidate review batch queries now; carrier invoices will be invalidated
      // AFTER review batch APIs complete to ensure correct ordering.
      queryClient.invalidateQueries({ queryKey: ["paperEntries"] });
      queryClient.invalidateQueries({ queryKey: ["paperVoucherSummary"] });
    },
  });
};
