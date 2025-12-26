import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./useApi";
 
// Hook for uploading Flexi CSV files
export const useUploadFlexiCsv = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      // Maintain exact same API call and payload structure
      const response = await api.accountPayable.uploadCsv({ file });
      return response;
    },
    onSuccess: () => {
      // DO NOT invalidate immediately - let WebSocket trigger the refresh
      // This prevents race condition where API is called before backend processing is complete
      
      // Only remove stale cached data, but don't trigger immediate refetch
      queryClient.removeQueries({ queryKey: ["flexiEntries"] });
      queryClient.removeQueries({ queryKey: ["flexiVoucherSummary"] });
      
      // Note: Invalidation will be triggered by WebSocket upload-status event
      // in FlexiProcess component when processing is actually complete
    },
  });
};
 
// Hook for uploading Sogas CSV files
export const useUploadSogasCsv = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { file: File; subType?: string }) => {
      // Maintain exact same API call and payload structure
      const { file, subType = "regular" } = payload;
      const response = await api.accountPayable.uploadSogasCsv(
        { subType: subType },
        { file: file }
      );
      return response;
    },
    onSuccess: () => {
      // DO NOT invalidate immediately - let WebSocket trigger the refresh
      // This prevents race condition where API is called before backend processing is complete
      
      // Only remove stale cached data, but don't trigger immediate refetch
      queryClient.removeQueries({ queryKey: ["sogasEntries"] });
      queryClient.removeQueries({ queryKey: ["sogasVoucherSummary"] });
      
      // Note: Invalidation will be triggered by WebSocket upload-status event
      // in respective process component when processing is actually complete
    },
  });
};
 
// Hook for uploading Clear Checks files
export const useUploadClearChecks = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      // Maintain exact same API call and payload structure
      const response = await api.clearChecks.uploadClearChecks({ file });
      return response;
    },
    onSuccess: () => {
      // DO NOT invalidate immediately - let WebSocket trigger the refresh
      // This prevents race condition where API is called before backend processing is complete
      
      // Only remove stale cached data, but don't trigger immediate refetch
      queryClient.removeQueries({ queryKey: ["clearChecks"] });
      queryClient.removeQueries({ queryKey: ["checkInquiry"] });
      
      // Note: Invalidation will be triggered by WebSocket upload-status event
      // in respective process component when processing is actually complete
    },
  });
};
 
 