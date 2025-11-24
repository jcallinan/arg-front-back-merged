import { useQuery } from "@tanstack/react-query";
import { http } from "@api/http";
import { API_ENDPOINTS } from "@api/api-endpoints";

type Company = {
   id: string;
   label: string;
   value: string;
};

export const useCompanies = (page = 1, limit = 10) => {
   return useQuery<Company[]>({
      queryKey: ["companies", page, limit],
      queryFn: () =>
         http
            .get<{ data: Company[] }>(API_ENDPOINTS.GET_COMPANIES, {
               page,
               limit,
            })
            .then((res) => res.data),
   });
};
