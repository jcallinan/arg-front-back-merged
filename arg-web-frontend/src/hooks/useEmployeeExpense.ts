import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./useApi";
import { cleanFileName } from "@utils/formatters";

// Hook for fetching company maintenance data
export const useCompanyMaintenance = (companyNo: number, enabled: boolean = true) => {
  const api = useApi();
  
  return useQuery({
    queryKey: ["companyMaintenance", companyNo],
    queryFn: async () => {
      // Maintain exact same API call and payload structure
      const response = await api.apMaintenance.companyMaintenance({
        companyNo: companyNo,
      });
      return response.data?.items;
    },
    enabled: enabled && !!companyNo,
  });
};

// Hook for validating GL Master
export const useGlMasterValidation = () => {
  const api = useApi();
  
  return useMutation({
    mutationFn: async (payload: {
      companyNo: number;
      glNo: number;
    }) => {
      // Maintain exact same API call and payload structure
      const response = await api.accountPayable.getGlMaster(payload);
      return response.data.items;
    },
  });
};

// Hook for generating employee expense report
export const useGenerateEmployeeExpenseReport = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: {
      companyNo: number;
      bankGlNo: number;
      dateToPay: string;
    }) => {
      // Maintain exact same API call and payload structure
      const response = await api.employeeExpense.generateReportEmployeeExpense(payload);
      return response;
    },
    onSuccess: () => {
      // Remove cached data and force refetch to ensure empty arrays are properly handled
      queryClient.removeQueries({ queryKey: ["employeeExpenseReports"] });
      
      // Also invalidate to trigger refetch for any active queries
      queryClient.invalidateQueries({ queryKey: ["employeeExpenseReports"] });
    },
  });
};

// Hook for fetching employee expense reports
export const useEmployeeExpenseReports = (enabled: boolean = true) => {
  const api = useApi();
  
  return useQuery({
    queryKey: ["employeeExpenseReports"],
    queryFn: async () => {
      // Maintain exact same API call and data transformation
      const response = await api.employeeExpense.getEmployeeExpenseReports();
      const data = response.data;

      return data.items.map(
        (
          item: {
            reportType?: string;
            pdfFileName?: string;
            reportDateTime: string;
            filePath: string;
            formType: string;
            fileName?: string;
          },
          index: number
        ) => {
          // Determine file type and extension (exact same logic)
          const isExcelFile =
            item.filePath?.toLowerCase().includes(".xls") ||
            item.filePath?.toLowerCase().includes(".xlsx") ||
            item.formType?.toLowerCase().includes("excel") ||
            item.formType?.toLowerCase().includes("xls");

          const fileExtension = isExcelFile ? ".xlsx" : ".pdf";
          const displayFileName =
            cleanFileName(item.pdfFileName) ||
            cleanFileName(item.fileName) ||
            `employee-expense-report-${index + 1}`;

          // Ensure filename has correct extension
          const fileName = displayFileName.includes(".")
            ? displayFileName
            : `${displayFileName}${fileExtension}`;

          return {
            key: index.toString(),
            pdfFileName: fileName,
            reportDateTime: item.reportDateTime,
            reportType: item.reportType?.trim(),
            reportFileType: item.formType?.trim() || "-",
            formType: item.formType,
            status: "Ready",
            filePath: item.filePath,
            fileName: fileName,
            fileType: isExcelFile ? "excel" : "pdf",
          };
        }
      );
    },
    enabled,
  });
};
