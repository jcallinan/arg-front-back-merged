import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./useApi";

// Hook for fetching Normal voucher entries (main data)
export const useNormalVoucherEntries = (selectedCompany: string) => {
  const api = useApi();
  
  return useQuery({
    queryKey: ["voucher-entry", selectedCompany],
    queryFn: async () => {
      const response = await api.accountPayable.getVoucherEntry({
        companyNo: Number(selectedCompany) || 10,
      });
      return response?.data?.items ?? [];
    },
    refetchOnMount: true,
  });
};

// Hook for getting voucher configuration (vendor selection)
export const useVoucherConfig = () => {
  const api = useApi();
  
  return useMutation({
    mutationFn: async (params: {
      companyNo: number;
      vendorNo: number;
    }) => {
      return await api.accountPayable.getVoucherConfig(params);
    },
  });
};

// Hook for submitting voucher header (Step 1 validation)
export const useSubmitVoucherHeader = () => {
  const api = useApi();
  
  return useMutation({
    mutationFn: async (payload: any) => {
      // Maintain exact same payload structure as original
      return await api.accountPayable.submitHeaderValidation(payload);
    },
  });
};

// Hook for submitting complete voucher (Step 2 submission)
export const useSubmitVoucher = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: any) => {
      // Maintain exact same payload structure as original
      return await api.accountPayable.submitVoucher(payload);
    },
    onSuccess: () => {
      // Remove cached data and force refetch to ensure empty arrays are properly handled
      queryClient.removeQueries({ queryKey: ["voucher-entry"] });
      
      // Also invalidate to trigger refetch for any active queries
      queryClient.invalidateQueries({ queryKey: ["voucher-entry"] });
    },
  });
};

// Hook for getting GL Master data
export const useGlMaster = () => {
  const api = useApi();
  
  return useMutation({
    mutationFn: async (params: {
      companyNo: number;
      glNo: number;
    }) => {
      return await api.accountPayable.getGlMaster(params);
    },
  });
};

// Hook for soft deleting voucher detail (line item)
export const useSoftDeleteVoucherDetail = () => {
  const api = useApi();
  
  return useMutation({
    mutationFn: async (params: {
      companyNo: number;
      vendorNo: number;
      entryNo: number;
      entrySequenceNo: number;
    }) => {
      return await api.accountPayable.softDeleteVoucherDetail(params);
    },
  });
};

// Hook for calculating due dates
export const useCalculateDueDates = () => {
  const api = useApi();
  
  return useMutation({
    mutationFn: async (params: {
      companyNo: number;
      vendorNo: number;
      invoiceDate: string;
    }) => {
      return await api.accountPayable.getCalculatedDueDates(params);
    },
  });
};