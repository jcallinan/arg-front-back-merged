export interface ApiErrorNotificationPayload {
   title: string;
   subtitle: string;
}

const GL_DETAIL_ERROR_SERVER_MESSAGE = "INVALID DETAIL LINE G/L NUMBER ENTERED";

/**
 * Build a standardized API error notification payload from various possible
 * error response shapes.
 *
 * This is intentionally generic, but includes some special handling for:
 * - vendor validation errors (field === "vendor")
 * - NOT_FOUND error codes
 */
export const buildApiErrorNotification = (
   error: any,
   context: string
): ApiErrorNotificationPayload => {
   const errorData =
      error?.error?.error ||
      error?.response?.data?.error ||
      error?.error ||
      error;

   const detailsSource =
      errorData?.details ||
      errorData?.error?.details ||
      errorData?.response?.details ||
      [];

   const details = Array.isArray(detailsSource) ? detailsSource : [];

   const vendorDetail = details.find(
      (detail: any) => detail.field === "vendor"
   );
   const firstDetailWithMessage = details.find(
      (detail: any) => detail?.message
   );

   const formatFieldTitle = (field?: string) => {
      if (!field) return "Validation Error";
      return `${field}`.replace(/_/g, " ").toUpperCase();
   };

   let title = "Error";
   let subtitle = `An error occurred while ${context}. Please try again.`;

   switch (true) {
      case Boolean(vendorDetail):
         title = "Vendor Not Found";
         subtitle = (vendorDetail as any).message;
         break;

      case Boolean(firstDetailWithMessage):
         title = formatFieldTitle(
            (firstDetailWithMessage as any).field
         );
         subtitle = (firstDetailWithMessage as any).message;
         break;

      case errorData?.code === "NOT_FOUND" && Boolean(errorData?.message):
         title = "Resource Not Found";
         subtitle = errorData.message;
         break;

      case errorData?.code === "NOT_FOUND":
         title = "Not Found";
         subtitle = `Resource not found while ${context}`;
         break;

      case Boolean(errorData?.message):
         title = "API Error";
         subtitle = `Error ${context}: ${errorData.message}`;
         break;

      default:
         // Keep default "Error" title and generic subtitle
         break;
   }

   return { title, subtitle };
};

export const normalizeGlAccountErrorMessage = (
   message?: string | null,
): string => {
   if (!message) return "";
   const upper = message.toUpperCase();
   if (upper.includes(GL_DETAIL_ERROR_SERVER_MESSAGE)) {
      return "Invalid GL Account - not found in system";
   }
   return message;
};

export const hasErrorDMessage = (
   response: any,
): { hasError: boolean; message: string } => {
   const msg = response?.data?.items?.message;

   let rawMessage = "";

   if (Array.isArray(msg)) {
      rawMessage = msg[0] ?? "";
   } else if (typeof msg === "string") {
      rawMessage = msg;
   }

   const normalized = String(rawMessage || "").trim();
   const startsWithErrorD = normalized.toLowerCase().startsWith("sp_error:");

   return {
      hasError: startsWithErrorD,
      message: normalized,
   };
};

