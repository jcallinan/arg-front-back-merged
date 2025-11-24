import { useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";
import { PROCESS_TYPE_ENUM } from "@api/api-schema/api";

// Hook for fetching flexi entries
export const useFlexiEntries = (companyNo: number = 10, enabled: boolean = true) => {
  const api = useApi();
  
  return useQuery({
    queryKey: ["flexiEntries", companyNo],
    queryFn: async () => {
      const response = await api.accountPayable.getFlexiEntry({
        companyNo,
      });
      return response?.data?.items ?? [];
    },
    enabled, // Only fetch when explicitly enabled
    gcTime:0,
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't automatically refetch on mount
  });
};

// Hook for fetching flexi voucher summary
export const useFlexiVoucherSummary = (companyNo: number = 10, enabled: boolean = true) => {
  const api = useApi();
  
  return useQuery({
    queryKey: ["flexiVoucherSummary", companyNo],
    queryFn: async () => {
      const response = await api.accountPayable.getVoucherSummary({
        companyNo,
        processType: PROCESS_TYPE_ENUM.FLEXI,
      });
      
      // Handle both nested and direct response structures
      const data = response?.data;
      if (data && typeof data === 'object' && 'items' in data) {
        return data.items;
      }
      return data;
    },
    enabled, // Only fetch when explicitly enabled
    gcTime:0,
    retry: false, // Don't retry on failure as this is optional data
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't automatically refetch on mount
  });
};



