import { createApiWithAuth } from "@api/apiWithAuth";

export const fetchVoucherEntry = async (
   selectedCompany: string
): Promise<unknown[]> => {
   const api = createApiWithAuth();

   const response = await api.accountPayable.getVoucherEntry({
      companyNo: parseInt(selectedCompany, 10),
      processType: "NORMAL",
   });

   if (response?.data?.items) {
      return response.data.items.map((item, index) => ({
         ...item,
         key: String(item.entryNo ?? index),
      }));
   }

   return [];
};

export const fetchCompanies = async (): Promise<unknown[]> => {
   const api = createApiWithAuth();

   const response = await api.accountPayable.getCompanies({
      current_page: 1,
      items_per_page: 10,
   });

   return response?.data?.items ?? [];
};

export const fetchProcessTypes = async (): Promise<unknown[]> => {
   const api = createApiWithAuth();

   const response = await api.accountPayable.getProcessTypes({});
   return response?.data?.items ?? [];
};
export const fetchVoucherConfig = async ({
   companyNo,
   vendorNo,
}: {
   companyNo: number;
   vendorNo: number;
}): Promise<unknown> => {
   const api = createApiWithAuth();

   const response = await api.accountPayable.getVoucherConfig({
      companyNo,
      vendorNo,
   });
   return response?.data?.items;
};

export interface CompanyMaintenanceData {
   companyNo: number;
   companyName: string;
   companyApGlNo: number;
   companyBankGlNo: number;
   companyDiscountsGlNo: number;
   companyIntercoGlNo: number;
   companyNextPjJrnlNo: number;
   companyNextCdJrnlNo: number;
   companyNextCheckNo: number;
   companyNextEntryNo: number;
   companyNextVoucherNo: number;
   companyPreEdChks: "Y" | "N";
   companyJobCostAct: "Y" | "N";
   companyRetentionGlNo: number;
   companyPoActive: "Y" | "N";
   companyEmployeeExpenseGlNo: number;
   companyNextEeJrnlNo: number;
   companyFiller: string;
}

export const fetchCompanyMaintenance = async (
   companyNo: number
): Promise<CompanyMaintenanceData> => {
   const api = createApiWithAuth();

   const response = await api.apMaintenance.companyMaintenance({ companyNo });
   const data = response?.data?.items;
   return {
      ...data,
      companyPreEdChks: data.companyPreEdChks as "Y" | "N",
      companyJobCostAct: data.companyJobCostAct as "Y" | "N",
      companyPoActive: data.companyPoActive as "Y" | "N",
   };
};

export const updateCompanyMaintenance = async (
   data: CompanyMaintenanceData
): Promise<CompanyMaintenanceData> => {
   const api = createApiWithAuth();

   const response = await api.apMaintenance.updateCompanyMaintenance(data);
   const responseData = response?.data?.items;
   return {
      ...responseData,
      companyPreEdChks: responseData.companyPreEdChks as "Y" | "N",
      companyJobCostAct: responseData.companyJobCostAct as "Y" | "N",
      companyPoActive: responseData.companyPoActive as "Y" | "N",
   };
};

export const fetchVoucherPaymentTypes = async (): Promise<
   Array<{
      id: string;
      label: string;
      value: string;
   }>
> => {
   const api = createApiWithAuth();

   const response = await api.payment.getAllVoucherPaymentTypes();
   return response?.data?.items ?? [];
};

export const fetchNextVendorNo = async (
   companyNo: number
): Promise<number | null> => {
   const api = createApiWithAuth();

   try {
      const response = await api.vendorManagement.getNextVendorNoConfig({
         companyNo,
      });

      if (response?.data?.items && typeof response.data.items === "number") {
         return response.data.items;
      }

      // Fallback for array structure if it changes in the future
      if (
         response?.data?.items &&
         Array.isArray(response.data.items) &&
         response.data.items.length > 0
      ) {
         return response.data.items[0];
      }

      return null;
   } catch (error) {
      console.error("Error fetching next vendor number:", error);
      return null;
   }
};

export const uploadClearChecksFile = async (file: File): Promise<void> => {
   const api = createApiWithAuth();

   try {
      await api.clearChecks.uploadClearChecks({ file });
   } catch (error) {
      console.error("Error uploading clear checks file:", error);
      throw error;
   }
};

export const fetchVendorsByYear = async ({
   companyNo,
   year,
   search,
   current_page = 1,
   items_per_page = 500,
   sortBy,
   sortOrder,
}: {
   companyNo: number;
   year: number;
   search?: string;
   current_page?: number;
   items_per_page?: number;
   sortBy?: string;
   sortOrder?: "asc" | "desc";
}): Promise<unknown> => {
   const api = createApiWithAuth();

   const response = await api.apPeriodEnd.getVendorsByYear({
      companyNo,
      year,
      search,
      current_page,
      items_per_page,
      sortBy,
      sortOrder,
   });

   if (response?.data?.items) {
      return {
         ...response.data,
         items: response.data.items.map((item, index) => ({
            ...item,
            key: String(item.vendorNo ?? index),
         })),
      };
   }

   return {
      items: [],
      count: 0,
      page: 1,
      limit: items_per_page,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
   };
};

export const submitPaymentSelectionType = async ({
   companyNo,
   voucherToPay,
   startingCheckNo,
   checkDate,
   dateToPayBy,
   bankAccountGl,
   forcedDiscount,
   mode,
}: {
   companyNo: number;
   voucherToPay: "Check" | "ACH" | "Wire";
   startingCheckNo: number;
   checkDate: string;
   dateToPayBy: string;
   bankAccountGl: number;
   forcedDiscount: "D" | "";
   mode: "I" | "U" | "D";
}): Promise<{
   success: boolean;
   message: string;
   data?: unknown;
   error?: any;
}> => {
   const api = createApiWithAuth();

   try {
      // Construct payload manually to ensure correct data types are sent
      const payload = {
         companyNo,
         voucherToPay,
         startingCheckNo, // Send as number
         checkDate,
         dateToPayBy,
         bankAccountGl, // Send as number
         forcedDiscount,
         mode,
      };

      const response = await api.payment.submitPaymentSelectionType(
         payload as never
      );

      return {
         success: true,
         message:
            response?.data?.message ||
            "Payment type selection submitted successfully",
         data: response?.data,
      };
   } catch (error: unknown) {
      // Check if this is a validation error with details
      const errorObj = error as any;
      if (errorObj?.error?.error?.details) {
         // Return the validation error structure for the component to handle
         return {
            success: false,
            message: errorObj.error.error.message || "Validation failed",
            data: null,
            error: errorObj.error.error, // Pass through the validation error details
         };
      }

      return {
         success: false,
         message:
            (error as { response?: { data?: { message?: string } } })?.response
               ?.data?.message || "Failed to submit payment type selection",
         data: null,
      };
   }
};

export const submitVendorPayment = async ({
   companyNo,
   voucherToPay,
   bankAccountGl,
   startingCheckNo,
   checkDate,
   dateToPayBy,
   entrySequence,
   vendorNo,
   voucherNo,
   partialPayAmount,
   discountAmount,
   payOrHold,
   singleCheck,
   makePrepaid,
   prepaidCheckNo,
   prepaidDate,
   forcedDiscount,
   mode,
}: {
   companyNo: number;
   voucherToPay?: "Check" | "ACH" | "Wire" | "Employee Expense" | "Utility";
   bankAccountGl: number;
   startingCheckNo: number;
   checkDate: string;
   dateToPayBy: string;
   entrySequence: string;
   vendorNo: number;
   voucherNo: number;
   partialPayAmount: number;
   discountAmount: number;
   payOrHold: "P" | "H";
   singleCheck: "S" | "";
   makePrepaid: "" | "P" | "A" | "W";
   prepaidCheckNo?: string;
   prepaidDate: string;
   forcedDiscount: "D" | "";
   mode: "I" | "U" | "D";
}): Promise<{
   success: boolean;
   message: string;
   data?: unknown;
   error?: any; // Added for TypeScript compatibility with validation errors
}> => {
   const api = createApiWithAuth();

   try {
      // Construct payload matching the API schema
      const payload = {
         companyNo,
         voucherToPay,
         bankAccountGl,
         startingCheckNo,
         checkDate,
         dateToPayBy,
         item: {
            entrySequence,
            vendorNo,
            voucherNo,
            partialPayAmount,
            discountAmount,
            payOrHold,
            singleCheck,
            makePrepaid,
            prepaidCheckNo,
            prepaidDate,
            forcedDiscount,
            mode,
         },
      };

      const response = await api.payment.submitVendorPayment(payload as never);

      return {
         success: true,
         message:
            response?.data?.message || "Vendor payment processed successfully",
         data: response?.data,
      };
   } catch (error: unknown) {
      const errorObj = error as any;

      if (errorObj?.error?.error?.details) {
         return {
            success: false,
            message: errorObj.error.error.message || "Validation failed",
            data: null,
            error: errorObj.error.error, // Pass through the validation error details
         };
      }

      return {
         success: false,
         message:
            (error as { response?: { data?: { message?: string } } })?.response
               ?.data?.message || "Failed to process vendor payment",
         data: null,
      };
   }
};

export const fetchGlMaster = async ({
   companyNo,
   glNo,
}: {
   companyNo: number;
   glNo: number;
}): Promise<{
   success: boolean;
   description?: string;
   data?: unknown;
   message?: string;
}> => {
   const api = createApiWithAuth();

   try {
      const response = await api.accountPayable.getGlMaster({
         companyNo,
         glNo,
      });

      return {
         success: true,
         description: response?.data?.items?.description || "",
         data: response?.data?.items,
      };
   } catch (error: unknown) {
      console.error("GL Master fetch error:", error);
      return {
         success: false,
         message:
            (error as { response?: { data?: { message?: string } } })?.response
               ?.data?.message || "Failed to fetch GL account details",
      };
   }
};

export const fetchCashRequirementReports = async ({
   voucherToPay,
   search,
   current_page = 1,
   items_per_page = 500,
   sortBy,
   sortOrder,
   reportType,
}: {
   voucherToPay: "Check" | "ACH" | "Wire" | "Employee Expense" | "Utility";
   search?: string;
   current_page?: number;
   items_per_page?: number;
   sortBy?: string;
   sortOrder?: "asc" | "desc";
   reportType?: string;
}): Promise<unknown[]> => {
   const api = createApiWithAuth();

   try {
      const response = await api.payment.getCashRequirementReports({
         voucherToPay,
         search,
         current_page,
         items_per_page,
         sortBy,
         sortOrder,
         reportType,
      });

      if (response?.data?.items) {
         return response.data.items.map((item, index) => ({
            ...item,
            key: String(item.fileName ?? index),
            id: String(item.fileName ?? index),
            status: "Ready",
         }));
      }

      return [];
   } catch (error: unknown) {
      console.error("Cash requirement reports fetch error:", error);
      return [];
   }
};

export interface VendorYearEndProcessResponse {
   message?: string;
   tableName?: string | null;
   dataCopied?: number | null;
}

export const vendorYearEndProcess = async ({
   companyNo,
   year,
   clearYTD,
}: {
   companyNo: number;
   year: string;
   clearYTD?: boolean;
}): Promise<VendorYearEndProcessResponse> => {
   const api = createApiWithAuth();

   try {
      const response = await api.apPeriodEnd.vendorYearEndProcess({
         companyNo,
         year,
         clearYTD,
      });

      if (response?.data?.items) {
         return response.data.items;
      }

      throw new Error("No data received from the API");
   } catch (error: unknown) {
      console.error("Vendor year-end process error:", error);
      throw error;
   }
};

export const fetchApCheckReports = async ({
   voucherToPay = "Check",
   search,
   current_page = 1,
   items_per_page = 500,
   sortBy,
   sortOrder,
   reportType,
}: {
   voucherToPay?: string;
   search?: string;
   current_page?: number;
   items_per_page?: number;
   sortBy?: string;
   sortOrder?: "asc" | "desc";
   reportType?: string;
}): Promise<unknown[]> => {
   const api = createApiWithAuth();

   try {
      const response = await api.payment.getApCheckReports({
         voucherToPay,
         search,
         current_page,
         items_per_page,
         sortBy,
         sortOrder,
         reportType,
      });

      if (response?.data?.items) {
         return response.data.items.map((item, index) => ({
            ...item,
            key: String(item.fileName ?? index),
            id: String(item.fileName ?? index),
         }));
      }

      return [];
   } catch (error: unknown) {
      console.error("AP Check reports fetch error:", error);
      return [];
   }
};

export interface DropdownItem {
   id?: string;
   value?: string;
   label?: string;
}

export interface DropdownResponse {
   success?: boolean;
   items?: DropdownItem[];
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
   | "AP_1099"
   | "VENDOR_FORM_TYPE"
   | "VENDOR_CARRIER"
   | "VENDOR_MAINTENANCE_TYPE"
   | "RECORD_TYPE_OPTIONS";

export const fetchDropdownData = async (
   type: DropdownType
): Promise<DropdownItem[]> => {
   const api = createApiWithAuth();

   try {
      const response = await api.globalStates.getDropdownData({ type });
      return response?.data?.items ?? [];
   } catch (error: unknown) {
      console.error("Dropdown data fetch error:", error);
      return [];
   }
};
