import { apiClient } from "./apiClient";

export const http = {
   get: async <T = any>(url: string, params?: any): Promise<T> => {
      const response = await apiClient.get<T>(url, { params });
      return response.data;
   },

   post: async <T = any>(url: string, data: any): Promise<T> => {
      const response = await apiClient.post<T>(url, data);
      return response.data;
   },

   put: async <T = any>(url: string, data: any): Promise<T> => {
      const response = await apiClient.put<T>(url, data);
      return response.data;
   },

   delete: async <T = any>(url: string): Promise<T> => {
      const response = await apiClient.delete<T>(url);
      return response.data;
   },

   patch: async <T = any>(url: string, data: any): Promise<T> => {
      const response = await apiClient.patch<T>(url, data);
      return response.data;
   },
};
