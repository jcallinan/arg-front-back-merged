import { useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";

// Types moved from api-hooks to avoid dependency
export interface DropdownItem {
  id?: string;
  value?: string;
  label?: string;
}

export type DropdownType =
  | "PROCESS_TYPES"
  | "FORM_TYPE"
  | "PAYMENT_FOR_REPORT_TYPES"
  | "COUNTRIES_ISO"
  | "COUNTRIES_PHONE_CODE"
  | "HOLD_VOUCHER_CODE"
  | "VENDOR_NAMES"
  | "COMPANY_NAMES"
  | "EXPENSE_GL"
  | "VENDOR_TERMS_CODE"
  | "PAY_HOLD_OPTIONS"
  | "SINGLE_CHECK_FLAG"
  | "MAKE_PREPAID_FLAG"
  | "VENDOR_GAL_RECEIPT"
  | "VENDOR_CATEGORY"
  | "VENDOR_FORM_TYPE"
  | "VENDOR_CARRIER"
  | "VENDOR_MAINTENANCE_TYPE"
  | "RECORD_TYPE_OPTIONS";

export const useDropdownData = (
   type: DropdownType,
   enabled: boolean = true
) => {
   const api = useApi();
   
   return useQuery<DropdownItem[]>({
      queryKey: ["dropdown-data", type],
      queryFn: async () => {
         try {
            // Maintain exact same API call and payload structure
            const response = await api.globalStates.getDropdownData({ type });
            return response?.data?.items ?? [];
         } catch (error: unknown) {
            console.error("Dropdown data fetch error:", error);
            return [];
         }
      },
      enabled,
      refetchOnMount: true, // Force refetch on mount to ensure data is available
   });
};
