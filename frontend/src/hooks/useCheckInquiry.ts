import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useApi } from "./useApi";
import { formatCurrency } from "@utils/formatters";
import { formatMMDDYYForDisplay } from "@utils/dateFormat";
import type { 
  GetPyamentHistoryParams, 
  GetLastPaymentInfoParams,
  GetVoucherDetailsParams 
} from "@api/api-schema/api";

// Hook for fetching payment history
export const usePaymentHistory = (queryParams: GetPyamentHistoryParams, enabled: boolean = false) => {
  const api = useApi();
  
  return useQuery({
    queryKey: ["paymentHistory", queryParams],
    queryFn: async () => {
      // Maintain exact same API call and payload structure
      const response = await api.checkInquiry.getPyamentHistory(queryParams);

      type ApiPaymentHistoryRow = {
        companyNo: number;
        vendorNo: number;
        checkNo?: number | string;
        invoiceNo?: string;
        invoiceDescription?: string;
        paidAmount?: number;
        discount?: number;
        grossAmount?: string | number;
        bankGLNo?: string | number;
        bankGLNumber?: {
          vendorName?: string;
          checkDate?: string | number;
        };
        bank_status?: string;
        lastPaidDate?: string;
      };

      const rows = (
        response.data as { items?: ApiPaymentHistoryRow[] } | undefined
      )?.items;

      if (rows && Array.isArray(rows)) {
        // Transform API response to match CheckPaymentHistoryUI interface (exact same logic)
        return rows.map((item: ApiPaymentHistoryRow, index: number) => ({
          key: `${item.companyNo}_${item.vendorNo}_${item.checkNo}_${index}`,
          companyNo: item.companyNo,
          vendorNo: item.vendorNo,
          checkNo: item.checkNo !== undefined ? String(item.checkNo) : undefined,
          invoiceNo: item.invoiceNo?.trim() || "-",
          invoiceDescription: item.invoiceDescription?.trim() || "-",
          invoiceDate: "-", // Not provided by API
          dueDate: "-", // Not provided by API
          paidAmount:
            item.paidAmount !== undefined && item.paidAmount !== null
              ? formatCurrency(item.paidAmount)
              : "$0.00",
          discountAmount:
            item.discount && item.discount > 0
              ? formatCurrency(item.discount)
              : "-",
          grossAmount:
            item.grossAmount !== undefined
              ? formatCurrency(item.grossAmount)
              : undefined,
          bankGLNo: item.bankGLNo,
          vendorName: item.bankGLNumber?.vendorName?.trim() || "-",
          paidDate: item.bankGLNumber?.checkDate,
          lastPaidDate:item.lastPaidDate,
          bankStatus: item.bank_status || "-",
        }));
      } else {
        return [];
      }
    },
    enabled,
  });
};

// Hook for fetching last payment info
export const useLastPaymentInfo = (queryParams: GetLastPaymentInfoParams, enabled: boolean = false) => {
  const api = useApi();
  
  return useQuery({
    queryKey: ["lastPaymentInfo", queryParams],
    queryFn: async () => {
      // Maintain exact same API call and payload structure
      const response = await api.checkInquiry.getLastPaymentInfo(queryParams);

      type LastPaymentInfoResponse = {
        companyNo?: number;
        vendorNo?: number;
        grossAmount?: number;
        openPayables?: number;
        vendorName?: string;
        lastPaidDate?: string;
      };

      const data = response.data as LastPaymentInfoResponse | undefined;
      if (data) {
        return {
          companyNo: data.companyNo,
          vendorNo: data.vendorNo,
          grossAmount: data.grossAmount,
          openPayables: data.openPayables,
          vendorName: data.vendorName,
          lastPaidDate: data.lastPaidDate,
        };
      }
      return {};
    },
    enabled,
  });
};

// Manual fetch function for payment history (supports incremental pagination/appends)
export const usePaymentHistoryManual = () => {
  const api = useApi();

  type PaymentHistoryUI = {
    key: string;
    companyNo: number;
    vendorNo: number;
    checkNo?: string;
    invoiceNo: string;
    invoiceDescription: string;
    invoiceDate: string;
    dueDate: string;
    paidAmount: string;
    discountAmount: string;
    grossAmount?: string;
    bankGLNo?: string | number;
    vendorName: string;
    paidDate?: string | number;
    lastPaidDate?: string;
    bankStatus: string;
  };

  const fetchPaymentHistory = useCallback(
    async (queryParams: GetPyamentHistoryParams): Promise<PaymentHistoryUI[]> => {
      // Maintain exact same API call and payload structure
      const response = await api.checkInquiry.getPyamentHistory(queryParams);

      type ApiPaymentHistoryRow = {
        companyNo: number;
        vendorNo: number;
        checkNo?: number | string;
        invoiceNo?: string;
        invoiceDescription?: string;
        paidAmount?: number;
        discount?: number;
        grossAmount?: string | number;
        bankGLNo?: string | number;
        bankGLNumber?: {
          vendorName?: string;
          checkDate?: string | number;
        };
        bank_status?: string;
        lastPaidDate?: string;
      };

      const rows = (
        response.data as { items?: ApiPaymentHistoryRow[] } | undefined
      )?.items;

      if (rows && Array.isArray(rows)) {
        return rows.map((item: ApiPaymentHistoryRow, index: number) => ({
          key: `${item.companyNo}_${item.vendorNo}_${item.checkNo}_${index}`,
          companyNo: item.companyNo,
          vendorNo: item.vendorNo,
          checkNo: item.checkNo !== undefined ? String(item.checkNo) : undefined,
          invoiceNo: item.invoiceNo?.trim() || "-",
          invoiceDescription: item.invoiceDescription?.trim() || "-",
          invoiceDate: "-",
          dueDate: "-",
          paidAmount:
            item.paidAmount !== undefined && item.paidAmount !== null
              ? formatCurrency(item.paidAmount)
              : "$0.00",
          discountAmount:
            item.discount && item.discount > 0
              ? formatCurrency(item.discount)
              : "-",
          grossAmount:
            item.grossAmount !== undefined
              ? formatCurrency(item.grossAmount)
              : undefined,
          bankGLNo: item.bankGLNo,
          vendorName: item.bankGLNumber?.vendorName?.trim() || "-",
          paidDate: item.bankGLNumber?.checkDate,
          lastPaidDate: item.lastPaidDate,
          bankStatus: item.bank_status || "-",
        }));
      }

      return [];
    },
    [api]
  );

  return { fetchPaymentHistory };
};

// Hook for fetching voucher details (used in CheckDetails)
export const useVoucherDetails = (queryParams: GetVoucherDetailsParams, enabled: boolean = false) => {
  const api = useApi();
  
  return useQuery({
    queryKey: ["voucherDetails", queryParams],
    queryFn: async () => {
      // Maintain exact same API call and payload structure
      const response = await api.checkInquiry.getVoucherDetails(queryParams);
      return response?.data;
    },
    enabled,
  });
};

// Manual fetch function for getVoucherDetails (to replace direct API calls)
export const useVoucherDetailsManual = () => {
  const api = useApi();
  
  const fetchVoucherDetails = useCallback(async (queryParams: GetVoucherDetailsParams) => {
    try {
      // Maintain exact same API call and payload structure
      const response = await api.checkInquiry.getVoucherDetails(queryParams);
      return response;
    } catch (error) {
      console.error("Error fetching voucher details:", error);
      throw error;
    }
  }, [api]);

  return {
    fetchVoucherDetails,
  };
};

// Hook for fetching check details payment history (used in CheckDetails)
export const useCheckDetailsPaymentHistory = (queryParams: {
  checkNo: number;
  companyNo?: number;
  vendorNo?: number;
  current_page: number;
  items_per_page: number;
}, enabled: boolean = true) => {
  const api = useApi();
  
  return useQuery({
    queryKey: ["checkDetailsPaymentHistory", queryParams],
    queryFn: async () => {
      // Maintain exact same API call and payload structure
      const response = await api.checkInquiry.getPyamentHistory(queryParams);

      interface PaymentHistoryResponse {
        items?: PaymentHistoryItem[];
      }

      interface PaymentHistoryItem {
        companyNo?: number;
        vendorNo?: number;
        checkNo?: number;
        voucherNo?: number;
        invoiceNo?: string;
        invoiceDescription?: string;
        invoiceDate?: string;
        dueDate?: string;
        paidAmount?: number;
        discount?: number;
        grossAmount?: number;
        bankGLNo?: number;
        bankGLNumber?: {
          vendorName?: string;
          checkDate?: string;
        };
        bank_status?: string;
      }

      if (response?.data && (response.data as PaymentHistoryResponse).items) {
        const items = (response.data as PaymentHistoryResponse).items || [];
        return items.map((item, index: number) => ({
          key: `${item.companyNo}_${item.vendorNo}_${item.checkNo}_${index}`,
          companyNo: item.companyNo,
          vendorNo: item.vendorNo,
          checkNo: item.checkNo?.toString(),
          voucherNo: item.voucherNo?.toString() || "-",
          invoiceNo: item.invoiceNo?.trim() || "-",
          invoiceDescription: item.invoiceDescription?.trim() || "-",
          invoiceDate: item.invoiceDate
            ? formatMMDDYYForDisplay(item.invoiceDate)
            : "-",
          dueDate: item.dueDate
            ? formatMMDDYYForDisplay(item.dueDate)
            : "-",
          paidAmount: item.paidAmount
            ? formatCurrency(item.paidAmount)
            : "$0.00",
          discountAmount:
            item.discount && item.discount > 0
              ? formatCurrency(item.discount)
              : "-",
          grossAmount: item.grossAmount?.toString(),
          bankGLNo: item.bankGLNo,
          vendorName: item.bankGLNumber?.vendorName?.trim() || "-",
          paidDate: item.bankGLNumber?.checkDate
            ? formatMMDDYYForDisplay(item.bankGLNumber.checkDate)
            : "-",
          checkDate: item.bankGLNumber?.checkDate
            ? formatMMDDYYForDisplay(item.bankGLNumber.checkDate)
            : "-",
          bankStatus: item.bank_status || "-",
        }));
      } else {
        return [];
      }
    },
    enabled,
  });
};
