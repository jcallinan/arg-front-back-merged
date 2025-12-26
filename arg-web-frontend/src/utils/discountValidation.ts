import { parseDateForSorting } from "@utils/dateFormat";

/**
 * Checks if a discount has been missed based on the current date and discount due date
 * @param discountDueDate - The discount due date in MM/DD/YY format
 * @param currentDate - Optional current date for testing, defaults to today
 * @returns Object with isMissed flag and warning message
 */
export const checkMissedDiscount = (
  discountDueDate: string,
  currentDate?: Date
): { isMissed: boolean; warningMessage: string } => {
  if (!discountDueDate || discountDueDate.trim() === "") {
    return { isMissed: false, warningMessage: "" };
  }

  // Handle various empty/default date formats
  const trimmedDate = discountDueDate.trim();
  if (
    trimmedDate === "0" ||
    trimmedDate === "00/00/00" ||
    trimmedDate === "01/01/00" ||
    trimmedDate === "01/01/99" ||
    trimmedDate === "1/1/00" ||
    trimmedDate === "1/1/99" ||
    trimmedDate === "010100" ||
    trimmedDate === "010199" ||
    trimmedDate === "000000" ||
    /^0+$/.test(trimmedDate)
  ) {
    return { isMissed: false, warningMessage: "" };
  }

  try {
    const today = currentDate || new Date();
    
    // Parse discount due date using existing utility
    const discountDate = parseDateForSorting(discountDueDate);
    
    // If parsing failed, return no warning
    if (discountDate.getTime() === 0) {
      return { isMissed: false, warningMessage: "" };
    }

    // Check if today is on or after the discount due date
    // Set time to start of day for accurate comparison
    const todayStartOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const discountStartOfDay = new Date(discountDate.getFullYear(), discountDate.getMonth(), discountDate.getDate());
    
    const isMissed = todayStartOfDay.getTime() >= discountStartOfDay.getTime();

    return {
      isMissed,
      warningMessage: isMissed 
        ? `Missed Discount: Voucher is being processed on or after the discount due date (${discountDueDate}). The discount period has expired.`
        : ""
    };
  } catch (error) {
    console.error("Error checking missed discount:", error);
    return { isMissed: false, warningMessage: "" };
  }
};

/**
 * Validates discount dates for a voucher and returns warnings
 * @param formData - The voucher form data
 * @returns Array of warning objects
 */
export const validateDiscountDates = (formData: { [key: string]: any }): Array<{
  field: string;
  message: string;
  type: "warning";
}> => {
  const warnings: Array<{ field: string; message: string; type: "warning" }> = [];
  
  const discountDueDate = formData["Discount Due Date"];
  if (discountDueDate) {
    const { isMissed, warningMessage } = checkMissedDiscount(discountDueDate);
    
    if (isMissed && warningMessage) {
      warnings.push({
        field: "Discount Due Date",
        message: warningMessage,
        type: "warning"
      });
    }
  }
  
  return warnings;
};
