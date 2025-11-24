export const formatDate = (dateStr: string): string => {
   if (!dateStr) return "";
   const [year, month, day] = dateStr.split("-");
   // For 4-digit years, take only the last 2 digits
   const shortYear = year.length === 4 ? year.slice(-2) : year;
   return `${month.padStart(2, "0")}${day.padStart(2, "0")}${shortYear}`;
};
export const formatNumber = (val: string) => (val?.trim() ? Number(val) : "");

export const formatDateField = (val: string) =>
   val?.trim() ? Number(formatDate(val)) : "";

export const formatNumberToMMDDYY = (dateStr: string): string | undefined => {
   if (!dateStr || !dateStr.trim()) return undefined;
   
   const trimmedStr = dateStr.trim();
   
   // Handle MM/DD/YY format from DatePicker (e.g., "01/15/25")
   if (/^\d{2}\/\d{2}\/\d{2}$/.test(trimmedStr)) {
      const [first, second, yy] = trimmedStr.split('/');
      
      // If first part > 12, it's DD/MM/YY format, so swap to MM/DD/YY
      if (parseInt(first) > 12) {
         return `${second}${first}${yy}`;
      }
      
      return `${first}${second}${yy}`;
   }
   
   // Handle 8-digit format MMDDYYYY (e.g., "01012025") - convert to 6-digit MMDDYY
   if (/^\d{8}$/.test(trimmedStr)) {
      const mm = trimmedStr.substring(0, 2);
      const dd = trimmedStr.substring(2, 4);
      const yyyy = trimmedStr.substring(4, 8);
      const yy = yyyy.slice(-2); // Take last 2 digits of year
      return `${mm}${dd}${yy}`;
   }
   
   // Handle 6-digit format MMDDYY (e.g., "011525")
   if (/^\d{6}$/.test(trimmedStr)) {
      return trimmedStr; // Already in correct format
   }
   
   // Handle other date formats by trying to parse with Date constructor
   // Convert 2-digit year to 4-digit year for proper parsing
   let dateForParsing = trimmedStr;
   if (/^\d{2}\/\d{2}\/\d{2}$/.test(trimmedStr)) {
      const [month, day, year] = trimmedStr.split('/');
      const fullYear = parseInt(year) < 50 ? `20${year}` : `19${year}`; // Assume years 00-49 are 2000-2049, 50-99 are 1950-1999
      dateForParsing = `${month}/${day}/${fullYear}`;
   }
   
   const date = new Date(dateForParsing);
   if (isNaN(date.getTime())) return undefined;

   // Pad month and day with leading zeros if they are single digit
   const mm = String(date.getMonth() + 1).padStart(2, "0"); // 1 => "01"
   const dd = String(date.getDate()).padStart(2, "0"); // 5 => "05"
   const yy = String(date.getFullYear()).slice(-2); // 2025 => "25"

   return `${mm}${dd}${yy}`; // Returns format like "062525"
};

/**
 * Converts backend MMDDYY format to MM/DD/YY display format
 * @param dateValue - Date in MMDDYY format from backend (number or string)
 * @returns Formatted date string in MM/DD/YY format for display
 *
 * Examples:
 * - formatMMDDYYForDisplay("120324") -> "12/03/24"
 * - formatMMDDYYForDisplay("72400") -> "07/24/00" (handles 5-digit dates)
 * - formatMMDDYYForDisplay(0) -> "N/A"
 */
export const formatMMDDYYForDisplay = (
   dateValue: number | string | null | undefined
): string => {
   // Handle null, undefined, empty, or zero values
   if (!dateValue || dateValue === 0 || dateValue === "0" || dateValue === "") {
      return "-";
   }

   let dateStr = dateValue.toString().trim();

   // Handle 5-digit dates by padding with leading zero (e.g., "72400" -> "072400")
   if (dateStr.length === 5) {
      dateStr = "0" + dateStr;
   }

   // Handle 8-digit format: Check if it's YYYYMMDD or MMDDYYYY
   if (dateStr.length === 8 && !isNaN(Number(dateStr))) {
      // First try MMDDYYYY format (e.g., "01012025")
      const mm1 = dateStr.slice(0, 2);
      const dd1 = dateStr.slice(2, 4);
      const yyyy1 = dateStr.slice(4, 8);
      
      const monthNum1 = parseInt(mm1);
      const dayNum1 = parseInt(dd1);
      
      if (monthNum1 >= 1 && monthNum1 <= 12 && dayNum1 >= 1 && dayNum1 <= 31) {
         const shortYear1 = yyyy1.slice(-2);
         return `${mm1}/${dd1}/${shortYear1}`;
      }
      
      // If MMDDYYYY doesn't work, try YYYYMMDD format (e.g., "20250701")
      const year = dateStr.slice(0, 4);
      const month = dateStr.slice(4, 6);
      const day = dateStr.slice(6, 8);
      const shortYear = year.slice(2, 4);
      return `${month}/${day}/${shortYear}`;
   }

   // Handle 6-digit format: Could be MMDDYY, DDMMYY, or YYMMDD
   if (dateStr.length === 6 && !isNaN(Number(dateStr))) {
      // Try MMDDYY format first
      const mm = dateStr.substring(0, 2);
      const dd = dateStr.substring(2, 4);
      const yy = dateStr.substring(4, 6);

      const monthNum = parseInt(mm);
      const dayNum = parseInt(dd);

      if (monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31) {
         return `${mm}/${dd}/${yy}`;
      }

      // Try DDMMYY format if MMDDYY doesn't make sense
      const dd2 = dateStr.substring(0, 2);
      const mm2 = dateStr.substring(2, 4);
      const yy2 = dateStr.substring(4, 6);

      const monthNum2 = parseInt(mm2);
      const dayNum2 = parseInt(dd2);

      if (monthNum2 >= 1 && monthNum2 <= 12 && dayNum2 >= 1 && dayNum2 <= 31) {
         return `${mm2}/${dd2}/${yy2}`;
      }

      // Try YYMMDD format as last resort
      const yy3 = dateStr.substring(0, 2);
      const mm3 = dateStr.substring(2, 4);
      const dd3 = dateStr.substring(4, 6);

      const monthNum3 = parseInt(mm3);
      const dayNum3 = parseInt(dd3);

      if (monthNum3 >= 1 && monthNum3 <= 12 && dayNum3 >= 1 && dayNum3 <= 31) {
         // Convert YY to full year and return in MM/DD/YY format
         return `${mm3}/${dd3}/${yy3}`;
      }

      // If none work, log once and return a safe fallback
      if (process.env.NODE_ENV === 'development') {
         console.warn(
            `Invalid date format detected: ${dateStr}. Unable to parse as MMDDYY, DDMMYY, or YYMMDD.`
         );
      }
      return dateStr; // Return original string rather than potentially invalid formatted date
   }

   // Handle edge case: if it looks like a date but doesn't match expected patterns
   if (dateStr.includes("/")) {
      // Already formatted, return as-is
      return dateStr;
   }

   // For any other format, log and return as formatted as possible
   console.warn(
      `Unrecognized date format: ${dateStr}, attempting basic formatting`
   );

   // Last resort: if it's all numbers, try to format anyway
   if (!isNaN(Number(dateStr)) && dateStr.length >= 4) {
      // If it's 4 digits, assume MMYY and add day
      if (dateStr.length === 4) {
         return `${dateStr.substring(0, 2)}/01/${dateStr.substring(2, 4)}`;
      }
      // If it's exactly 6 digits, force MMDDYY format
      if (dateStr.length === 6) {
         return `${dateStr.substring(0, 2)}/${dateStr.substring(
            2,
            4
         )}/${dateStr.substring(4, 6)}`;
      }
   }

   return dateStr;
};

/**
 * Parses various date formats to a Date object for proper sorting
 * Handles MM/DD/YY, DDMMYY, and other common formats
 * @param dateStr - Date string in various formats
 * @returns Date object for comparison, or epoch date for invalid dates
 *
 * Examples:
 * - parseDateForSorting("08/19/25") -> Date(2025, 7, 19)
 * - parseDateForSorting("190825") -> Date(2025, 7, 19)
 * - parseDateForSorting("") -> Date(0)
 */
export const parseDateForSorting = (dateStr: string): Date => {
   if (
      !dateStr ||
      dateStr.trim() === "" ||
      dateStr === "0" ||
      dateStr === "00" ||
      dateStr === "000000"
   ) {
      return new Date(0); // Return epoch for empty/invalid dates
   }

   // Handle MM/DD/YY format
   if (dateStr.includes("/")) {
      const [month, day, year] = dateStr.split("/");
      const fullYear =
         parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year);
      return new Date(fullYear, parseInt(month) - 1, parseInt(day));
   }

   // Handle 8-digit format (MMDDYYYY or YYYYMMDD)
   if (dateStr.length === 8) {
      // Try MMDDYYYY format first (e.g., "01012025")
      const mm1 = parseInt(dateStr.substring(0, 2));
      const dd1 = parseInt(dateStr.substring(2, 4));
      const yyyy1 = parseInt(dateStr.substring(4, 8));
      
      if (mm1 >= 1 && mm1 <= 12 && dd1 >= 1 && dd1 <= 31) {
         return new Date(yyyy1, mm1 - 1, dd1);
      }
      
      // If MMDDYYYY doesn't work, try YYYYMMDD format (e.g., "20250101")
      const yyyy2 = parseInt(dateStr.substring(0, 4));
      const mm2 = parseInt(dateStr.substring(4, 6));
      const dd2 = parseInt(dateStr.substring(6, 8));
      
      if (mm2 >= 1 && mm2 <= 12 && dd2 >= 1 && dd2 <= 31) {
         return new Date(yyyy2, mm2 - 1, dd2);
      }
      
      return new Date(0);
   }

   // Handle 6-digit format (5-6 digits) - try multiple interpretations
   if (dateStr.length === 5 || dateStr.length === 6) {
      const padded = dateStr.padStart(6, "0");
      
      // Try MMDDYY format first
      const mm1 = parseInt(padded.substring(0, 2));
      const dd1 = parseInt(padded.substring(2, 4));
      const yy1 = parseInt(padded.substring(4, 6));
      
      if (mm1 >= 1 && mm1 <= 12 && dd1 >= 1 && dd1 <= 31) {
         const fullYear1 = yy1 < 50 ? 2000 + yy1 : 1900 + yy1;
         return new Date(fullYear1, mm1 - 1, dd1);
      }
      
      // Try DDMMYY format if MMDDYY doesn't work
      const dd2 = parseInt(padded.substring(0, 2));
      const mm2 = parseInt(padded.substring(2, 4));
      const yy2 = parseInt(padded.substring(4, 6));
      
      if (mm2 >= 1 && mm2 <= 12 && dd2 >= 1 && dd2 <= 31) {
         const fullYear2 = yy2 < 50 ? 2000 + yy2 : 1900 + yy2;
         return new Date(fullYear2, mm2 - 1, dd2);
      }
      
      // Try YYMMDD format as last resort
      const yy3 = parseInt(padded.substring(0, 2));
      const mm3 = parseInt(padded.substring(2, 4));
      const dd3 = parseInt(padded.substring(4, 6));
      
      if (mm3 >= 1 && mm3 <= 12 && dd3 >= 1 && dd3 <= 31) {
         const fullYear3 = yy3 < 50 ? 2000 + yy3 : 1900 + yy3;
         return new Date(fullYear3, mm3 - 1, dd3);
      }
      
      // If all fail, return epoch (will sort to beginning)
      return new Date(0);
   }


   return new Date(0);
};

/**
 * Creates a sorter function for date columns in tables
 * @param dateKey - The key/property name containing the date value
 * @returns Sorter function compatible with Ant Design Table columns
 *
 * Usage:
 * column.sorter = createDateSorter('invoiceDate');
 */
export const createDateSorter = (dateKey: string) => {
   return (a: any, b: any) => {
      const dateA = parseDateForSorting(a[dateKey] || "");
      const dateB = parseDateForSorting(b[dateKey] || "");
      return dateA.getTime() - dateB.getTime();
   };
};

/**
 * Generic date sorter that can be used directly with array.sort()
 * @param a - First item to compare
 * @param b - Second item to compare
 * @param dateKey - The key/property name containing the date value
 * @returns Comparison result for sorting
 *
 * Usage:
 * data.sort((a, b) => sortByDate(a, b, 'invoiceDate'));
 */
export const sortByDate = (a: any, b: any, dateKey: string): number => {
   const dateA = parseDateForSorting(a[dateKey] || "");
   const dateB = parseDateForSorting(b[dateKey] || "");
   return dateA.getTime() - dateB.getTime();
};

/**
 * Converts DD/MM/YY format to MM/DD/YY format for consistent display
 * @param dateStr - Date string in DD/MM/YY format
 * @returns Date string in MM/DD/YY format, or original string if conversion fails
 *
 * Examples:
 * - convertDDMMYYToMMDDYY("19/08/25") -> "08/19/25"
 * - convertDDMMYYToMMDDYY("08/19/25") -> "08/19/25" (already correct format)
 */
export const convertDDMMYYToMMDDYY = (dateStr: string): string => {
   if (!dateStr || !dateStr.includes("/")) return dateStr;

   const parts = dateStr.split("/");
   if (parts.length !== 3) return dateStr;

   const [first, second, year] = parts;
   const firstNum = parseInt(first);
   const secondNum = parseInt(second);

   // If first part is > 12, it's likely DD/MM/YY format
   // But only convert if the second part (month) is valid (1-12)
   if (firstNum > 12 && secondNum >= 1 && secondNum <= 12) {
      return `${second.padStart(2, "0")}/${first.padStart(2, "0")}/${year}`;
   }

   // If month would be > 12 after conversion, or other invalid cases, return as-is
   return dateStr;
};
