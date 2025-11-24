import { useCallback } from "react";
import { useApi } from "./useApi";

export const useVoucherEntry = () => {
  const api = useApi();

  // Fetch voucher data by entry number (for ViewVoucherModal component)
  const fetchVoucherDataByEntryNo = useCallback(async (queryParams: {
    entryNo: number;
    companyNo: number;
    vendorNo: number;
  }) => {
    try {
      // Maintain exact same API call and payload structure
      const response = await api.accountPayable.getDataByEntryNo(queryParams as any);
      return response;
    } catch (error) {
      console.error("Error fetching voucher data by entry no:", error);
      throw error;
    }
  }, [api]);

  return {
    fetchVoucherDataByEntryNo,
  };
};

export default useVoucherEntry;