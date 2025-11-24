import { useMutation } from '@tanstack/react-query';
import { useApi } from './useApi';

interface VendorYearEndParams {
  companyNo: number;
  year: string;
  clearYTD?: boolean;
}

interface VendorYearEndProcessResponse {
  message?: string;
  tableName?: string | null;
  dataCopied?: number | null;
}

export const useVendorYearEnd = () => {
  const api = useApi();
  
  return useMutation({
    mutationFn: async (params: VendorYearEndParams): Promise<VendorYearEndProcessResponse> => {
      try {
        const response = await api.apPeriodEnd.vendorYearEndProcess({
          companyNo: params.companyNo,
          year: params.year,
          clearYTD: params.clearYTD,
        });

        if (response?.data?.items) {
          return response.data.items;
        }

        throw new Error("No data received from the API");
      } catch (error: unknown) {
        console.error("Vendor year-end process error:", error);
        throw error;
      }
    },
  });
};
