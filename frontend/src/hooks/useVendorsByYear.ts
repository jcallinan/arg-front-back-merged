import { useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";
 
interface UseVendorsByYearParams {
   companyNo: number;
   year: number;
   search?: string;
   current_page?: number;
   items_per_page?: number;
   sortBy?: string;
   sortOrder?: "asc" | "desc";
   enabled?: boolean;
}
 
export const useVendorsByYear = ({
   companyNo,
   year,
   search,
   current_page = 1,
   items_per_page = 500,
   sortBy,
   sortOrder,
   enabled = true,
}: UseVendorsByYearParams) => {
   const api = useApi();
   
   return useQuery({
      queryKey: [
         "vendors-by-year",
         companyNo,
         year,
         search,
         current_page,
         items_per_page,
         sortBy,
         sortOrder,
      ],
      queryFn: async () => {
         const response = await api.apPeriodEnd.getVendorsByYear({
            companyNo,
            year,
            search,
            current_page,
            items_per_page,
            sortBy,
            sortOrder,
         });

         if (response?.data?.items) {
            return {
               ...response.data,
               items: response.data.items.map((item, index) => ({
                  ...item,
                  key: String(item.vendorNo ?? index),
               })),
            };
         }

         return {
            items: [],
            count: 0,
            page: 1,
            limit: items_per_page,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
         };
      },
      enabled: enabled && !!companyNo && !!year,
      staleTime: 1000 * 3,
   });
};
 
 