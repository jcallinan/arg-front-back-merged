import { useMemo } from "react";
import { createApiWithAuth } from "@api/apiWithAuth";

export const useApi = () => {
   return useMemo(() => {
      return createApiWithAuth();
   }, []);
};
