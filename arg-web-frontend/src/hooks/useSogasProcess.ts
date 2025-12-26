import { useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";
import { PROCESS_TYPE_ENUM } from "@api/api-schema/api";

// Hook for fetching SOGAS entries
export const useSogasEntries = (companyNo: number = 10, enabled: boolean = true) => {
  const api = useApi();
  
  return useQuery({
    queryKey: ["sogasEntries", companyNo],
    queryFn: async () => {
      const response = await api.accountPayable.getSogasEntry({
        companyNo,
      });
      return response?.data?.items ?? [];
    },
    enabled, // Only fetch when explicitly enabled
    gcTime: 0, // Don't cache data
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't automatically refetch on mount
  });
};

// Hook for fetching SOGAS voucher summary
export const useSogasVoucherSummary = (companyNo: number = 10, enabled: boolean = true) => {
  const api = useApi();
  
  return useQuery({
    queryKey: ["sogasVoucherSummary", companyNo],
    queryFn: async () => {
      const response = await api.accountPayable.getVoucherSummary({
        companyNo,
        processType: PROCESS_TYPE_ENUM.SOGAS,
      });
      
      // Handle both nested and direct response structures
      const data = response?.data;
      if (data && typeof data === 'object' && 'items' in data) {
        return data.items;
      }
      return data;
    },
    enabled, // Only fetch when explicitly enabled
    gcTime: 0, // Don't cache data
    retry: false, // Don't retry on failure as this is optional data
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't automatically refetch on mount
  });
};
