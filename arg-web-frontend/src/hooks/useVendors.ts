import { useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";

// Hook for fetching vendors (used by VendorNumberName component)
export const useVendors = (
  companyNo: number,
  search: string = "",
  page: number = 1,
  enabled: boolean = true,
  forceRefresh?: number // Add timestamp to force fresh calls
) => {
  const api = useApi();
  
  return useQuery({
    queryKey: ["vendors", companyNo, search, page, forceRefresh],
    queryFn: async () => {
      // Maintain exact same API call and payload structure
      const response = await api.accountPayable.getAllVendors({
        current_page: page,
        companyNo: companyNo,
        search: search,
      });

      const {
        items = [],
        pagination: { total_pages = 1 } = { total_pages: 1 },
      } = response.data;

      return {
        items,
        totalPages: total_pages,
      };
    },
    enabled: enabled && !!companyNo,
    staleTime: 0, // Always consider data stale - ensures fresh API calls for each screen
  });
};

// Hook for fetching owner vendors (used by OwnerVendorNumberName component)
export const useOwnerVendors = (
  companyNo: number,
  search: string = "",
  page: number = 1,
  enabled: boolean = true,
  forceRefresh?: number // Add timestamp to force fresh calls
) => {
  const api = useApi();
  
  return useQuery({
    queryKey: ["ownerVendors", companyNo, search, page, forceRefresh],
    queryFn: async () => {
      // Maintain exact same API call and payload structure
      const response = await api.vendorManagement.getAllVendorsList({
        companyNo: companyNo,
        search,
        current_page: page,
        items_per_page: 50
      });

      const {
        items = [],
        pagination: { total_pages = 1 } = { total_pages: 1 },
      } = response.data;

      return {
        items: items.map((item: any) => ({
          id: item.id,
          value: item.label,
        })),
        totalPages: total_pages,
      };
    },
    enabled: enabled && !!companyNo,
    staleTime: 0, // Always consider data stale - ensures fresh API calls for each screen
  });
};
