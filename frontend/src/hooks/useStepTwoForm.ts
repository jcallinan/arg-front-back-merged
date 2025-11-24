import { useQuery } from "@tanstack/react-query";
import { http } from "@api/http";
import { API_ENDPOINTS } from "@api/api-endpoints";

export const useDummyData = () => {
   return useQuery({
      queryKey: ["dummyData"],
      queryFn: () => http.get(API_ENDPOINTS.GET_DUMMY_DATA),
   });
};
