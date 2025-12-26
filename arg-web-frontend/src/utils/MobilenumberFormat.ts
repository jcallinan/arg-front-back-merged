/**
 * Formats phone number to XXX-XXX-XXXX format
 * @param areaCode - 3-digit area code
 * @param phoneNumber - 7-digit phone number
 * @returns Formatted phone number string or empty string if invalid
 */
export const formatPhoneNumber = (areaCode?: number, phoneNumber?: number): string => {
   if (!phoneNumber) return "";
   
   const areaStr = areaCode?.toString().padStart(3, "0") || "000";
   const phoneStr = phoneNumber?.toString().padStart(7, "0") || "0000000";
   
   // Format as XXX-XXX-XXXX
   return `${areaStr}-${phoneStr.slice(0, 3)}-${phoneStr.slice(3)}`;
};


/**
 * Formats phone number from a single string for input field display
 * @param phoneNumber - phone number string (can be partial)
 * @returns Formatted phone number string
 */
export const formatPhoneNumberInput = (phoneNumber: string): string => {
   if (!phoneNumber) return "";
   
   // Remove all non-numeric characters
   const cleaned = phoneNumber.replace(/\D/g, '');
   
   // Apply formatting based on length
   if (cleaned.length <= 3) {
      return cleaned;
   } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
   } else {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
   }
};

export default formatPhoneNumber;
