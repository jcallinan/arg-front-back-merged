import { useCallback } from "react";
import { useApi } from "./useApi";

// Interface for report type items
interface ReportTypeItem {
  id: string;
}

interface ReportTypeApiResponse {
  data: {
    items: ReportTypeItem[];
  };
}

export const useReportType = () => {
  const api = useApi();

  // Fetch process types (for ReportType component)
  const fetchProcessType = useCallback(async (type: string): Promise<Array<{
    label: string;
    value: string;
  }>> => {
    try {
      // Maintain exact same API call and payload structure
      const response = (await api.apGlobalStates.processType({ type: type as any })) as unknown as ReportTypeApiResponse;

      const items = response?.data?.items ?? [];

      const mappedOptions = items.map((item: any) => ({
        label: item.label ?? item.value ?? String(item.id ?? ""),
        value: item.value ?? String(item.id ?? ""),
      }));

      return mappedOptions;
    } catch (err) {
      console.error("Error fetching report types:", err);
      return [];
    }
  }, [api]);

  return {
    fetchProcessType,
  };
};

export default useReportType;
