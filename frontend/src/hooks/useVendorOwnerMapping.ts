import { useState, useCallback } from "react";
import { useApi } from "./useApi";
import type {
  GetOwnerMappingListParams,
  GetOwnerNoListParams,
  GetOwnerDetailsParams,
} from "@api/api-schema/api";
import type {
  VendorOwnerMappingUI,
  OwnerNoOption,
  OwnerMappingItem,
} from "@/types/accounts-payable.types";

export const useVendorOwnerMapping = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [ownerOptionsLoading, setOwnerOptionsLoading] = useState(false);

  const fetchOwnerNumbers = useCallback(async (
    companyNo: string,
    vendorFilter?: string,
    statusFilter?: string
  ): Promise<OwnerNoOption[]> => {
    setOwnerOptionsLoading(true);
    try {
      const params = {
        vendorCompanyNumber: parseInt(companyNo),
        current_page: 1,
        items_per_page: 500,
      } as GetOwnerNoListParams;

      if (vendorFilter && vendorFilter.trim() !== "") {
        params.vendorNo = parseInt(vendorFilter);
      }
      if (statusFilter && statusFilter.trim() !== "") {
        params.status = statusFilter;
      }

      const response = await api.vendorManagement.getOwnerNoList(params);

      // Check if data is directly in response.data (array) or in response.data.items
      const apiData = response.data?.items || response.data;

      if (apiData && Array.isArray(apiData) && apiData.length > 0) {
        const mappedItems = apiData.map((item: any) => ({
          id: item.id,
          value: item.value || item.id?.toString(),
          label: item.label || item.value || item.id?.toString(),
        }));

        return mappedItems;
      } else {
        return [];
      }
    } catch (err: unknown) {
      console.error("Error fetching owner numbers:", err);
      throw new Error("Failed to load owner numbers");
    } finally {
      setOwnerOptionsLoading(false);
    }
  }, [api]);

  const fetchMappingData = useCallback(async (
    companyNo: string,
    vendorFilter?: string,
    statusFilter?: string,
    ownerNoFilter?: string
  ): Promise<VendorOwnerMappingUI[]> => {
    setLoading(true);
    try {
      const params = {
        vendorCompanyNumber: parseInt(companyNo),
        current_page: 1,
        items_per_page: 500,
      } as GetOwnerMappingListParams;

      // Add optional filters
      if (vendorFilter && vendorFilter.trim() !== "") {
        params.vendorNo = parseInt(vendorFilter);
      }
      if (statusFilter && statusFilter.trim() !== "") {
        params.status = statusFilter;
      }
      // Note: API doesn't support ownerNo filtering, so we'll filter client-side if needed

      const response = await api.vendorManagement.getOwnerMappingList(params);

      if (response.data?.items) {
        // Transform API response to UI format
        let transformedData = (response.data.items as OwnerMappingItem[]).map(
          (item, index) => ({
            key: index.toString(),
            vendorId: item.vendorNo?.toString() || "",
            vendorName: item.vendorName || "",
            ownerId: item.ownerNo?.toString() || "",
            ownerName: item.ownerNo?.toString() || "",
            mappingDate: "", // API doesn't provide mapping date
            status: item.isDeleted,
          })
        );

        // Apply client-side owner number filtering if needed
        if (ownerNoFilter && ownerNoFilter.trim() !== "") {
          transformedData = transformedData.filter(
            (item) => item.ownerId === ownerNoFilter
          );
        }

        return transformedData;
      } else {
        return [];
      }
    } catch (err: unknown) {
      console.error("Error fetching mapping data:", err);
      let errorMessage = "Failed to load vendor owner mappings";

      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
      ) {
        errorMessage = String(err.response.data.message);
      } else if (err && typeof err === "object" && "message" in err) {
        errorMessage = String(err.message);
      }

      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [api]);

  const fetchOwnerDetails = useCallback(async (
    ownerNo: number,
    vendorNo: number
  ) => {
    try {
      const params: GetOwnerDetailsParams = {
        ownerNo: ownerNo,
        vendorNo: vendorNo,
      };

      const response = await api.vendorManagement.getOwnerDetails(params);

      if (response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching owner details:", error);
      throw new Error("Failed to load owner details");
    }
  }, [api]);

  const createOrUpdateOwner = useCallback(async (
    ownerData: {
      ownerNo: number;
      vendorNo: number;
      isDeleted: string;
    }
  ) => {
    try {
      const response = await api.vendorManagement.createAndUpdateOwner(ownerData);
      return response;
    } catch (error: any) {
      console.error("CreateOrUpdateOwner save failed:", error);
      let errorMessage = "Failed to save owner mapping";
      let apiError = error?.error?.error || error?.error || error?.response?.data?.error || error?.data?.error || error;
      
      if (error instanceof Response) {
        try {
          const responseText = await error.text();
          if (responseText) {
            const parsedError = JSON.parse(responseText);
            apiError = parsedError.error || parsedError;
          }
        } catch (parseError) {
          console.error("Failed to parse CreateOrUpdateOwner Response body:", parseError);
        }
      }
      
      if (apiError && (apiError.code || apiError.message)) {
        if (apiError?.code === "SERVER_ERROR") {
          if (apiError?.details && Array.isArray(apiError.details)) {
            const serverError = apiError.details[0];
            if (serverError && serverError.message) {
              errorMessage = serverError.message;
            } else {
              errorMessage = apiError.message || "A server error occurred while saving owner mapping.";
            }
          } else {
            errorMessage = apiError.message || "A server error occurred while saving owner mapping.";
          }
        } else if (apiError?.code === "VALIDATION_ERROR") {
          errorMessage = apiError.message || "Invalid data provided.";
        } else if (apiError?.message) {
          errorMessage = apiError.message;
        }
      } else if (error?.response?.data?.message) {
        // Fallback for traditional error structure
        errorMessage = String(error.response.data.message);
      } else if (error?.message) {
        errorMessage = String(error.message);
      }
      
      throw new Error(errorMessage);
    }
  }, [api]);

  return {
    loading,
    ownerOptionsLoading,
    fetchOwnerNumbers,
    fetchMappingData,
    fetchOwnerDetails,
    createOrUpdateOwner,
  };
};
