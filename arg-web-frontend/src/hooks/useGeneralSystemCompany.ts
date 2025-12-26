import { useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";

export interface GeneralSystemCompany {
   fixedAssets?: "Y" | "N";
   orderEntryInvoicing?: "Y" | "N";
   salesAnalysis?: "Y" | "N";
   inventory?: "Y" | "N";
   purchaseOrder?: "Y" | "N";
   billOfMaterial?: "Y" | "N";
   jobShop?: "Y" | "N";
   jobCost?: "Y" | "N";
   filler1?: string;
   multiWarehouseYn?: "Y" | "N";
   thirteenAccountingPeriodsYn?: "Y" | "N";
   fractionalQtyActive?: "Y" | "N";
   apPostOverrideCode?: number;
   arPostOverrideCode?: number;
   faPostOverrideCode?: number;
   glPostOverrideCode?: number;
   companyNo?: number;
   filler2?: string;
}

export const useGeneralSystemCompany = (companyNo?: number) => {
   const api = useApi();

   return useQuery<
      { items?: GeneralSystemCompany } | GeneralSystemCompany | undefined,
      unknown,
      GeneralSystemCompany | undefined
   >({
      queryKey: ["general-system-company", companyNo],
      enabled: typeof companyNo === "number" && !Number.isNaN(companyNo),
      queryFn: async () => {
         if (companyNo == null) return undefined;
         const response = await api.globalStates.getGeneralSystemCompany({
            companyNo
         });
         // Some endpoints wrap in { data: { items } }, others return items directly
         const items =
            (response as any)?.data?.items ??
            (response as any)?.data ??
            (response as any)?.items ??
            response;
         return items as GeneralSystemCompany | undefined;
      },
      staleTime: 0,
   });
};
