import { useQuery } from "@tanstack/react-query";
import { http } from "@api/http";
import { API_ENDPOINTS } from "@api/api-endpoints";

export const useFormData = () => {
   return useQuery({
      queryKey: ["formData"],
      queryFn: () => http.get(API_ENDPOINTS.GET_FORM_DATA),
   });
};
