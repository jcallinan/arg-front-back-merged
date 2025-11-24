import { useState, useCallback } from "react";
import { useApi } from "./useApi";
import { formatNumberToMMDDYY } from "@/utils/dateFormat";
import { cleanFileName } from "@/utils/formatters";
import type { ReportTypeApiResponse } from "@/types/accounts-payable.types";

export const useOpenPayables = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);

  const fetchReportsType = useCallback(async () => {
    try {
      const response = (await api.apGlobalStates.processType({
        type: "Open-Payables"
      })) as unknown as ReportTypeApiResponse;
      
      const items = response?.data?.items ?? [];
      const mappedOptions = items.map((item: any) => ({
        label: item.label,
        value: item.value,
      }));
      
      return mappedOptions;
    } catch (err) {
      console.error("Error fetching open payable types:", err);
      throw new Error("Failed to load open payable types");
    }
  }, [api]);

  const getOpenPayablesReportData = useCallback(async (queryParams: any) => {
    setLoading(true);
    try {
      const { data } = await api.openPayables.getOpenPayablesReport(queryParams);
      
      const transformedData = data.items.map((item, index) => {
        // Determine file type and extension
        const isExcelFile =
          item.filePath?.toLowerCase().includes(".xls") ||
          item.filePath?.toLowerCase().includes(".xlsx") ||
          (item as any).formType?.toLowerCase().includes("excel") ||
          (item as any).formType?.toLowerCase().includes("xls");

        const fileExtension = isExcelFile ? ".xlsx" : ".pdf";
        const displayFileName =
          cleanFileName(item.pdfFileName) ||
          cleanFileName((item as any).fileName) ||
          `open-payables-report-${index + 1}`;

        // Ensure filename has correct extension
        const fileName = displayFileName.includes(".")
          ? displayFileName
          : `${displayFileName}${fileExtension}`;

        return {
          key: index.toString(),
          pdfFileName: fileName,
          reportDateTime: item.reportDateTime,
          reportType: item.reportType,
          reportFileType: (item as any).formType || "PDF",
          status: "Ready",
          filePath: item.filePath,
          fileName: fileName,
          fileType: isExcelFile ? "excel" : "pdf", // Add file type indicator
        };
      });

      return transformedData;
    } catch (error) {
      console.error("Error fetching open payables report:", error);
      throw new Error("Failed to fetch report data");
    } finally {
      setLoading(false);
    }
  }, [api]);

  const openPayableGenerateReport = useCallback(async (postPayload: any) => {
    setLoading(true);
    try {
      await api.openPayables.openPayableGenerateReport(postPayload);
      return { success: true, message: "Report generation request submitted" };
    } catch (error) {
      console.error("Error generating report:", error);
      throw new Error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  }, [api]);

  const buildApiParams = useCallback((
    sourceType: "generate" | "filter",
    options: {
      dueDate?: any;
      reportType?: string;
      companyNo: string;
      holdVoucher?: string;
      date1?: string;
      date2?: string;
      date3?: string;
      date4?: string;
      populateSpreadsheet?: boolean;
      dateRange?: [any, any] | null;
    }
  ) => {
    const { 
      dueDate, 
      reportType, 
      companyNo, 
      holdVoucher, 
      date1, 
      date2, 
      date3, 
      date4, 
      populateSpreadsheet, 
      dateRange 
    } = options;
    
    const selectedValue = sourceType === "generate" ? dueDate : reportType;

    const params: any = {
      companyNo: parseInt(companyNo),
      openPayables: selectedValue || "",
    };

    if (selectedValue === "Open-Payables-in-Hold-Status" && holdVoucher) {
      params.holdVoucher = holdVoucher;
    }

    if (
      selectedValue === "Open-Payables-By-Vendor-Discounts" ||
      selectedValue === "Open-Payables-by-Vendor(Aged)"
    ) {
      if (date1) params.dateOne = formatNumberToMMDDYY(date1);
      if (date2) params.dateTwo = formatNumberToMMDDYY(date2);
      if (date3) params.dateThree = formatNumberToMMDDYY(date3);
      if (date4) params.dateFour = formatNumberToMMDDYY(date4);
      params.populateSpreadsheet = populateSpreadsheet ? "Y" : "N";
    }

    if (selectedValue === "In Hold Status" && holdVoucher) {
      params.holdStatus = holdVoucher;
    }

    if (dateRange && dateRange[0] && dateRange[1]) {
      params.startDate = dateRange[0].format("MMDDYY");
      params.endDate = dateRange[1].format("MMDDYY");
    }

    return params;
  }, []);

  const buildReportApiParams = useCallback((options: {
    companyNo: string;
    reportType: string;
    fileName: string;
    filterDateRange?: [any, any] | null;
  }) => {
    const { companyNo, reportType, fileName, filterDateRange } = options;
    
    const params: any = {
      companyNo: parseInt(companyNo),
      reportType: reportType,
      fileName: fileName,
    };

    // Add startDate and endDate if filterDateRange is set
    if (filterDateRange && filterDateRange[0] && filterDateRange[1]) {
      params.startDate = filterDateRange[0].format("MMDDYY");
      params.endDate = filterDateRange[1].format("MMDDYY");
    }

    return params;
  }, []);

  return {
    loading,
    fetchReportsType,
    getOpenPayablesReportData,
    openPayableGenerateReport,
    buildApiParams,
    buildReportApiParams,
  };
};
