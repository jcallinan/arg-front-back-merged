import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./useApi";
 
// Hook for deleting voucher entries (works for all process types)
export const useDeleteVoucher = () => {
  const api = useApi();
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: async ({
      entryNo,
      companyNo,
      vendorNo,
      invoiceNo,
    }: {
      entryNo: number;
      companyNo: number;
      vendorNo: number;
      invoiceNo: string;
    }) => {
      return await api.accountPayable.softDeleteVoucher({
        entryNo,
        companyNo,
        vendorNo,
        invoiceNo,
      });
    },
    onSuccess: () => {
      // Remove cached data and force refetch to ensure empty arrays are properly handled
      queryClient.removeQueries({ queryKey: ["flexiEntries"] });
      queryClient.removeQueries({ queryKey: ["flexiVoucherSummary"] });
      queryClient.removeQueries({ queryKey: ["sogasEntries"] });
      queryClient.removeQueries({ queryKey: ["sogasVoucherSummary"] }); // This will match all SOGAS summary queries
      queryClient.removeQueries({ queryKey: ["lmsEntries"] });
      queryClient.removeQueries({ queryKey: ["lmsVoucherSummary"] });
      queryClient.removeQueries({ queryKey: ["paperEntries"] });
      queryClient.removeQueries({ queryKey: ["paperVoucherSummary"] });
      queryClient.removeQueries({ queryKey: ["normalEntries"] });
      queryClient.removeQueries({ queryKey: ["voucher-entry"] });
      queryClient.removeQueries({ queryKey: ["voucherSummary"] });
     
      // Also invalidate to trigger refetch for any active queries
      queryClient.invalidateQueries({ queryKey: ["flexiEntries"] });
      queryClient.invalidateQueries({ queryKey: ["flexiVoucherSummary"] });
      queryClient.invalidateQueries({ queryKey: ["sogasEntries"] });
      queryClient.invalidateQueries({ queryKey: ["sogasVoucherSummary"] }); // This will match all SOGAS summary queries
      queryClient.invalidateQueries({ queryKey: ["lmsEntries"] });
      queryClient.invalidateQueries({ queryKey: ["lmsVoucherSummary"] });
      queryClient.invalidateQueries({ queryKey: ["paperEntries"] });
      queryClient.invalidateQueries({ queryKey: ["paperVoucherSummary"] });
      queryClient.invalidateQueries({ queryKey: ["normalEntries"] });
      queryClient.invalidateQueries({ queryKey: ["voucher-entry"] });
      queryClient.invalidateQueries({ queryKey: ["voucherSummary"] });
    },
  });
};
 
 