import { QueryClient } from "@tanstack/react-query";
 
export const querysClient = new QueryClient({
   defaultOptions: {
      queries: {
         // Keep cached data fresh for a short duration across all envs
         staleTime: 1000 * 3, // 3 seconds
         // Retain inactive queries in cache briefly across all envs
         gcTime: 1000 * 3, // 3 seconds
         retry: 1,
         // Disable refetch on window focus for better performance
         refetchOnWindowFocus: false,
         // Disable refetch on reconnect
         refetchOnReconnect: false,
         // Disable refetch on mount if data is fresh
         refetchOnMount: false,
      },
      mutations: {
         retry: 1,
      },
   },
});
 
 