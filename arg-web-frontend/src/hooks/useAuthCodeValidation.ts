import { useState, useCallback } from "react";
import { useApi } from "./useApi";

interface UseAuthCodeValidationReturn {
   isLoading: boolean;
   error: string | null;
   validateAuthCode: (companyNo: number, authCode: number) => Promise<boolean>;
   generateAuthCode: (companyNo: number) => Promise<any>;
   clearError: () => void;
}

export const useAuthCodeValidation = (): UseAuthCodeValidationReturn => {
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);
   const api = useApi();

   const validateAuthCode = useCallback(
      async (companyNo: number, authCode: number): Promise<boolean> => {
         try {
            setIsLoading(true);
            setError(null);

            await api.globalStates.getAuthCodeChecker({
               companyNo,
               authCode,
            });

            // If API call is successful, return true
            return true;
         } catch (err) {
            console.error("Auth code validation failed:", err);
            console.log("Full error object:", JSON.stringify(err, null, 2));

            // Handle the specific error structure
            let errorMessage = "Invalid authorization code. Please try again.";

            try {
               // Check if err is the response object directly
               if (err && typeof err === "object") {
                  console.log("Error object keys:", Object.keys(err));

                  // Case 1: Check for nested error structure (err.error.error.details[0].message)
                  if (err && typeof err === "object" && "error" in err) {
                     const errorObj = (err as any).error;
                     console.log("Found error object:", errorObj);

                     if (
                        errorObj &&
                        errorObj.error &&
                        errorObj.error.details &&
                        Array.isArray(errorObj.error.details) &&
                        errorObj.error.details.length > 0
                     ) {
                        const detailMessage = errorObj.error.details[0].message;
                        console.log(
                           "Found nested detail message:",
                           detailMessage
                        );
                        if (detailMessage) {
                           errorMessage = detailMessage;
                        }
                     }
                     // Case 2: Check for direct error structure (err.error.details[0].message)
                     else if (
                        errorObj &&
                        errorObj.details &&
                        Array.isArray(errorObj.details) &&
                        errorObj.details.length > 0
                     ) {
                        const detailMessage = errorObj.details[0].message;
                        console.log(
                           "Found direct detail message:",
                           detailMessage
                        );
                        if (detailMessage) {
                           errorMessage = detailMessage;
                        }
                     }
                     // Case 3: Fallback to main error message
                     else if (errorObj && errorObj.message) {
                        errorMessage = errorObj.message;
                     }
                  }
                  // Case 4: Check for axios error structure (err.response.data.error.details[0].message)
                  else if (
                     err && typeof err === "object" &&
                     "response" in err &&
                     err.response &&
                     typeof err.response === "object" &&
                     "data" in err.response
                  ) {
                     const responseData = (err as any).response.data;
                     console.log("Found response data:", responseData);

                     if (responseData && responseData.error) {
                        const errorObj = responseData.error;
                        console.log("Found error in response data:", errorObj);

                        if (
                           errorObj &&
                           errorObj.details &&
                           Array.isArray(errorObj.details) &&
                           errorObj.details.length > 0
                        ) {
                           const detailMessage = errorObj.details[0].message;
                           console.log(
                              "Found detail message from response:",
                              detailMessage
                           );
                           if (detailMessage) {
                              errorMessage = detailMessage;
                           }
                        } else if (errorObj && errorObj.message) {
                           errorMessage = errorObj.message;
                        }
                     }
                  }
                  // Case 5: Check if err itself has the error structure
                  else if (
                     "details" in err &&
                     Array.isArray((err as any).details) &&
                     (err as any).details.length > 0
                  ) {
                     const detailMessage = (err as any).details[0].message;
                     console.log(
                        "Found direct err detail message:",
                        detailMessage
                     );
                     if (detailMessage) {
                        errorMessage = detailMessage;
                     }
                  }
                  // Case 6: Check if err has a message property directly
                  else if ("message" in err && (err as any).message) {
                     errorMessage = (err as any).message;
                  }
               }
               // Case 7: Handle string errors
               else if (typeof err === "string") {
                  errorMessage = err;
               }
               // Case 8: Handle Error objects
               else if (err instanceof Error) {
                  errorMessage = err.message;
               }
            } catch (parseError) {
               console.error("Error parsing error object:", parseError);
            }

            console.log("Final error message:", errorMessage);
            setError(errorMessage);
            return false;
         } finally {
            setIsLoading(false);
         }
      },
      [api]
   );

   const generateAuthCode = useCallback(async (companyNo: number): Promise<any> => {
      try {
         setIsLoading(true);
         setError(null);

         // Maintain exact same API call and payload structure
         const response = await api.globalStates.generateAuthCode({ companyNo });
         return response;
      } catch (err) {
         console.error("Error generating authorization:", err);
         setError("Failed to generate authorization code");
         throw err;
      } finally {
         setIsLoading(false);
      }
   }, [api]);

   const clearError = useCallback(() => {
      setError(null);
   }, []);

   return {
      isLoading,
      error,
      validateAuthCode,
      generateAuthCode,
      clearError,
   };
};

export default useAuthCodeValidation;
