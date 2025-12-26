import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./useApi";

// Hook for posting to purchase journal
export const usePostToPurchaseJournal = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      entries: Array<{
        invoiceNo: string;
        companyNo: number;
        vendorNo: number;
        entryNo: number;
        prepaidCode?: string;
        prepaidCheckNo?: string;
        bankGl?: number;
        invoiceAmount?: number;
      }>;
      companyNo: number;
      purchaseJD: string;
      keyCashDJD: string;
    }) => {
      return await api.purchaseJournal.submitPurchaseJournal(payload);
    },
    onSuccess: () => {
      // Remove cached data and force refetch to ensure empty arrays are properly handled
      queryClient.removeQueries({ queryKey: ["flexiEntries"] });
      queryClient.removeQueries({ queryKey: ["flexiVoucherSummary"] });
      queryClient.removeQueries({ queryKey: ["voucher-entry"] });
      queryClient.removeQueries({ queryKey: ["normalEntries"] });
      queryClient.removeQueries({ queryKey: ["sogasEntries"] });
      queryClient.removeQueries({ queryKey: ["lmsEntries"] });
      queryClient.removeQueries({ queryKey: ["paperEntries"] });
      
      // Also invalidate to trigger refetch for any active queries
      queryClient.invalidateQueries({ queryKey: ["flexiEntries"] });
      queryClient.invalidateQueries({ queryKey: ["flexiVoucherSummary"] });
      queryClient.invalidateQueries({ queryKey: ["voucher-entry"] });
      queryClient.invalidateQueries({ queryKey: ["normalEntries"] });
      queryClient.invalidateQueries({ queryKey: ["sogasEntries"] });
      queryClient.invalidateQueries({ queryKey: ["lmsEntries"] });
      queryClient.invalidateQueries({ queryKey: ["paperEntries"] });
    },
  });
};
