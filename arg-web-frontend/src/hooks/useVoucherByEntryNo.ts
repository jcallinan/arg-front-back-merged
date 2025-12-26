import { useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";

// Hook for fetching voucher by entry number (for editing - works for all process types)
export const useVoucherByEntryNo = ({
  entryNo,
  companyNo,
  vendorNo,
  enabled = false,
}: {
  entryNo: string;
  companyNo: string;
  vendorNo: string;
  enabled?: boolean;
}) => {
  const api = useApi();
  
  return useQuery({
    queryKey: ["voucherByEntryNo", entryNo, companyNo, vendorNo],
    queryFn: async () => {
      const response = await api.accountPayable.getDataByEntryNo({
        entryNo,
        companyNo: Number(companyNo),
        vendorNo: Number(vendorNo),
      });
      return response?.data?.items;
    },
    enabled: enabled && !!entryNo && !!companyNo && !!vendorNo,
  });
};
