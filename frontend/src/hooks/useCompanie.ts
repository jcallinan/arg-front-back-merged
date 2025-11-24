// hooks/useCompanies.ts
import { useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";

export const useCompanie = () => {
  const api = useApi();
  
  return useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      // Maintain exact same API call and payload structure
      const response = await api.accountPayable.getCompanies({
        current_page: 1,
        items_per_page: 10,
      });
      
      return response?.data?.items ?? [];
    },
  });
};
