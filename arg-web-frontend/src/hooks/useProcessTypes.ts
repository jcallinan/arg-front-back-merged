import { useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";

export const useProcessTypes = () => {
  const api = useApi();
  
  // Placeholder data to prevent flicker - API will still be called
  const placeholderData = [
    { id: "NORMAL", label: "Normal", value: "NORMAL" },
    { id: "ARGLMS", label: "LMS", value: "ARGLMS" },
    { id: "PAPER", label: "Paper", value: "PAPER" },
    { id: "FLEXI", label: "Flexi", value: "FLEXI" },
    { id: "SOGAS", label: "SOGAS", value: "SOGAS" },
  ];

  return useQuery({
    queryKey: ["processTypes"],
    queryFn: async () => {
      // Maintain exact same API call and payload structure
      const response = await api.accountPayable.getProcessTypes({});
      return response?.data?.items ?? [];
    },
    placeholderData,
  });
};
