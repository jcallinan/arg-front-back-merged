import { useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";
import { cleanFileName } from "@utils/formatters";

// Hook for fetching Purchase Journal reports
export const usePurchaseJournalReports = (queryParams: {
  companyNo: number;
  reportType: string;
  fileName: string;
  startDate: string;
  endDate: string;
}) => {
  const api = useApi();
  
  return useQuery({
    queryKey: ["purchaseJournalReports", queryParams],
    queryFn: async () => {
      // Maintain exact same API call and payload structure
      const response = await api.purchaseJournal.purchaseJournalReports(queryParams);
      const items = response?.data?.items ?? [];

      // Maintain exact same data transformation logic
      return items.map((item: any, index: number) => {
        // Determine file type and extension
        const isExcelFile =
           item.filePath?.toLowerCase().includes(".xls") ||
           item.filePath?.toLowerCase().includes(".xlsx") ||
           item.formType?.toLowerCase().includes("excel") ||
           item.formType?.toLowerCase().includes("xls");

        const fileExtension = isExcelFile ? ".xls" : ".pdf";
        const displayFileName =
           cleanFileName(item.pdfFileName) ||
           cleanFileName(item.fileName) ||
           `purchase-journal-report-${index + 1}`;

        // Ensure filename has correct extension
        const fileName = displayFileName.includes(".")
           ? displayFileName
           : `${displayFileName}${fileExtension}`;

        return {
           id: index,
           pdfFileName: fileName,
           reportDateTime: item.reportDateTime,
           reportType: item.reportType,
           formType: item.formType,
           status: "Ready",
           filePath: item.filePath,
           fileName: fileName, // for download
           fileType: isExcelFile ? "excel" : "pdf", // Add file type indicator
        };
      });
    },
    enabled: false, // Don't auto-fetch, only fetch when explicitly called
  });
};
