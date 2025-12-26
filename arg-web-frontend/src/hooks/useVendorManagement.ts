import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useApi } from "./useApi";

// Hook for vendor management operations
export const useVendorManagement = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  // Create or update vendor mutation
  const createOrUpdateVendorMutation = useMutation({
    mutationFn: async (vendorPayload: any) => {
      // Maintain exact same API call and payload structure
      const response = await api.vendorManagement.createOrUpdateVendor(
        {} as any, // Empty query parameters - no query string
        vendorPayload // All data in request body only
      );
      return response;
    },
    onSuccess: () => {
      // Invalidate vendor-related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendorMaster"] });
    },
    onError: (error) => {
      console.error("Error creating/updating vendor:", error);
    },
  });

  // Manual function for creating or updating vendor (to replace direct API calls)
  const createOrUpdateVendor = useCallback(async (vendorPayload: any) => {
    try {
      // Use the mutation to maintain consistency
      const response = await createOrUpdateVendorMutation.mutateAsync(vendorPayload);
      return response;
    } catch (error) {
      console.error("Error creating/updating vendor:", error);
      throw error;
    }
  }, [createOrUpdateVendorMutation]);

  return {
    createOrUpdateVendor,
    createOrUpdateVendorMutation,
  };
};

export default useVendorManagement;
