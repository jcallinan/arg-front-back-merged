import { Api } from "@api/api-schema/api";
import { logoutUser } from "@/modules/auth/api/authApiClient";
import { showModal } from "@utils/modalUtils";

// Global flags to prevent multiple redirects
let isHandling401 = false;
let isHandling403 = false;

/**
 * Creates an API instance with automatic unauthorized error handling
 * This function should be used instead of creating Api instances directly
 */
export const createApiWithAuth = (baseUrl?: string) => {
   // Custom fetch function to intercept responses and handle unauthorized errors
   const customFetch = async (...fetchParams: Parameters<typeof fetch>) => {
      const response = await fetch(...fetchParams);

      // Check if response is not ok and might contain an unauthorized error
      if (!response.ok) {
         try {
            // Clone the response to read it without consuming the original
            const responseClone = response.clone();
            const errorData = await responseClone.json();

            // Check if this is an unauthorized error (401 status + UNAUTHORIZED code)
            if (
               response.status === 401 &&
               errorData?.error?.code === "UNAUTHORIZED"
            ) {
               // Prevent multiple 401 handling
               if (isHandling401) {
                  return response;
               }
               isHandling401 = true;

               // Call logout function
               try {
                  await logoutUser();
               } catch (logoutError) {
                  console.error(
                     "❌ Error during automatic logout:",
                     logoutError
                  );
               }

               // Show modal notification for session expiration
               showModal.warning(
                  "Session Expired",
                  "Your session has expired. Please log in again.",
                  () => {
                     window.location.reload();
                  }
               );
            } else if (response.status === 403) {
               // User is authenticated but not authorized for this specific API
               console.warn(
                  "⚠️ Forbidden (403) response detected - user not authorized for this resource"
               );

               // Prevent multiple 403 handling
               if (isHandling403) {
                  return response;
               }
               isHandling403 = true;

               // Navigate to No Access page without logging the user out
               window.location.assign("/no-access");
            }
         } catch (parseError) {
            // If we can't parse the response as JSON, just continue with the original response
            console.log("Could not parse error response as JSON:", parseError);
         }
      }

      return response;
   };

   return new Api({
      baseUrl: baseUrl || import.meta.env.VITE_API_BASE_URL,
      baseApiParams: {
         credentials: "include",
      },
      customFetch,
   });
};
