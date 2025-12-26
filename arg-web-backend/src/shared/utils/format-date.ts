import { format as formatDate, parse, isValid } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

export const TIMESTAMP_FORMATS = {
  COMPACT: "yyyyMMddHHmmssSSS", // e.g. 20250819154523123000
  READABLE_DATETIME: "yyyy-MM-dd HH:mm:ss.SSS", // e.g. 2025-08-19 15:45:23.123
  ISO_DATE: "yyyy-MM-dd'T'HH:mm:ss.SSSX", // e.g. 2025-08-19T15:45:23.123Z
  SHORT_READABLE: "MM/dd/yy, HH:mm", // 08/25/25, 16:29
};

export const DATE_FORMATS = {
  MMDDYY: "mm/dd/yy",
  YYMMDD: "yymmdd",
  YMMDD: "ymmdd", // For 5-character dates like 90225 (year with leading zero suppressed)
  MMDDYY_MMDDYY: "mmddyy", // Changed from MMDDYY to mmddyy (lowercase dd for day of month)
  YYYYMMDD: "yyyyMMdd", // YYYYMMDD format for 8-digit dates
  YYYY_MM: "yyyy-mm",
  MM_DD_YYYY: "mm-dd-yyyy",
  MM_DD_YY: "MM/dd/yy",
};

/**
 * Converts MMDDYY format string to different date formats using date-fns
 * @param mmddyy - Date string in MMDDYY format (e.g., "061025" for June 10, 2025)
 * @returns Object containing different date formats
 */
export function convertMmddyyToFormats(mmddyy: string): {
  month: string;
  day: string;
  year: string;
  amcldt: string; // YYMMDD format (for AMCLDT field)
  amcld8: string; // YYYYMMDD format (for AMCLD8 field)
  fullDate: Date; // Full Date object
  fullDateString: string;
} {
  // Use existing validation utility
  if (!validateMMDDYY(mmddyy)) {
    throw new Error(
      `Invalid MMDDYY format: ${mmddyy}. Expected format: MMDDYY (e.g., "061025")`
    );
  }

  const month = mmddyy.substring(0, 2);
  const day = mmddyy.substring(2, 4);
  const year = mmddyy.substring(4, 6);

  // Use existing utility to get YYYYMMDD format
  const yyyymmdd = convertMMDDYYtoYYYYMMDD(mmddyy);

  // Parse using date-fns for validation
  const fullDateString = `${Math.floor(yyyymmdd / 10000)}-${month}-${day}`;
  const fullDate = parse(fullDateString, "yyyy-MM-dd", new Date());

  // Validate the parsed date using date-fns
  if (!isValid(fullDate)) {
    throw new Error(`Invalid date: ${fullDateString}. Date does not exist.`);
  }

  return {
    month,
    day,
    year,
    amcldt: `${month}${day}${year}`, // MMDDYY format (for AMCLDT field) - UPDATED
    amcld8: yyyymmdd.toString(), // YYYYMMDD format (for AMCLD8 field)
    fullDate,
    fullDateString,
  };
}

/**
 * Enhanced MMDDYY to Date conversion using date-fns
 * @param mmddyy - Date string in MMDDYY format
 * @returns Date object
 */
export function mmddyyToDate(mmddyy: string): Date {
  const formats = convertMmddyyToFormats(mmddyy);
  return formats.fullDate;
}

/**
 * Date to MMDDYY conversion using date-fns
 * @param date - Date object
 * @returns Date string in MMDDYY format
 */
export function dateToMmddyy(date: Date): string {
  return formatDate(date, "MMddyy");
}

/**
 * Date to YYYYMMDD conversion using date-fns
 * @param date - Date object
 * @returns Date string in YYYYMMDD format
 */
export function dateToYyyymmdd(date: Date): string {
  return formatDate(date, "yyyyMMdd");
}

export const addDaysToMMDDYY = (dateStr: string, daysToAdd: number): string => {
  if (!validateMMDDYY(dateStr)) {
    return dateStr;
  }
  const month = parseInt(dateStr.substring(0, 2), 10) - 1; // JS months are 0-based
  const day = parseInt(dateStr.substring(2, 4), 10);
  let year = parseInt(dateStr.substring(4, 6), 10);

  // Convert two-digit year to four-digit year (<=80 as 20YY, else 19YY)
  year = year <= 80 ? 2000 + year : 1900 + year;

  const date = new Date(year, month, day);

  // Add days
  date.setDate(date.getDate() + daysToAdd);

  const newMonth = String(date.getMonth() + 1).padStart(2, "0");
  const newDay = String(date.getDate()).padStart(2, "0");
  const newYear = String(date.getFullYear()).slice(-2);

  return `${newMonth}${newDay}${newYear}`;
};

export const validateMMDDYY = (dateStr: string): boolean => {
  const dateRegex = /^(0[1-9]|1[0-2])([0-2][0-9]|3[01])\d{2}$/;
  return dateRegex.test(dateStr);
};

export const convertMMDDYYtoYYYYMMDD = (dateStr: string): number => {
  if (!validateMMDDYY(dateStr)) {
    return parseInt("19990101", 10);
  }

  const month = dateStr.substring(0, 2);
  const day = dateStr.substring(2, 4);
  const year = dateStr.substring(4, 6);

  // Determine full year (<=80 as 20YY, else 19YY)
  const fullYear = parseInt(year, 10) <= 80 ? `20${year}` : `19${year}`;

  return parseInt(`${fullYear}${month}${day}`, 10);
};

export const convertYYYYMMDDtoMMDDYY = (dateNum: number): string => {
  const dateStr = dateNum.toString();
  // if (!/^␈$/.test(dateStr)) {
  if (!/^\d{8}$/.test(dateStr)) {
    throw new Error("Invalid YYYYMMDD date format");
  }

  const year = dateStr.substring(2, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);

  return `${month}${day}${year}`;
};

export const subtractDates = (
  firstDate: number,
  secondDate: string
): boolean => {
  let firstYear: number;
  let firstMonth: number;
  let firstDay: number;

  let firstDateStr = firstDate.toString();

  if (firstDateStr.length === 8) {
    // YYYYMMDD format
    firstYear = Math.floor(firstDate / 10000);
    firstMonth = Math.floor((firstDate % 10000) / 100) - 1;
    firstDay = firstDate % 100;
  } else if (firstDateStr.length === 6) {
    // YYMMDD format
    const yy = parseInt(firstDateStr.substring(0, 2), 10);
    firstYear = yy <= 80 ? 2000 + yy : 1900 + yy;
    firstMonth = parseInt(firstDateStr.substring(2, 4), 10) - 1;
    firstDay = parseInt(firstDateStr.substring(4, 6), 10);
  } else if (firstDateStr.length === 5) {
    // YYMMDD format with leading zero on year
    firstDateStr = "0" + firstDateStr;
    const yy = parseInt(firstDateStr.substring(0, 2), 10);
    firstYear = yy <= 80 ? 2000 + yy : 1900 + yy;
    firstMonth = parseInt(firstDateStr.substring(2, 4), 10) - 1;
    firstDay = parseInt(firstDateStr.substring(4, 6), 10);
  } else {
    throw new Error("Invalid date format");
  }

  const firstDateObj = new Date(firstYear, firstMonth, firstDay);

  const secondMonth = parseInt(secondDate.slice(0, 2), 10) - 1;
  const secondDay = parseInt(secondDate.slice(2, 4), 10);
  let secondYear = parseInt(secondDate.slice(4, 6), 10);

  // Adjust year (<=80 as 20YY, else 19YY)
  secondYear += secondYear <= 80 ? 2000 : 1900;

  const secondDateObj = new Date(secondYear, secondMonth, secondDay);

  // Subtract 1 year from second date
  const secondDateMinusOneYear = new Date(secondDateObj);
  secondDateMinusOneYear.setFullYear(secondDateObj.getFullYear() - 1);

  return firstDateObj >= secondDateMinusOneYear;
};

/**
 * Formats a date (number or string) to MM/DD/YY format.
 * Accepts:
 *   - number: YYYYMMDD or YYMMDD
 *   - string: MMDDYY
 * Returns: string in MM/DD/YY format
 */
export function formatToMMDDYY(date: number | string): string {
  if (date === Number(0)) {
    return "0"
  }
  let month: string, day: string, year: string;
  let dateStr = typeof date === "number" ? date.toString() : date;

  if (dateStr.length === 8) {
    // YYYYMMDD
    month = dateStr.substring(4, 6);
    day = dateStr.substring(6, 8);
    year = dateStr.substring(2, 4);
  } else if (dateStr.length === 6) {
    // MMDDYY
    month = dateStr.substring(0, 2);
    day = dateStr.substring(2, 4);
    year = dateStr.substring(4, 6);
  } else if (dateStr.length === 5) {
    // YMMDD format (year, month, day)
    dateStr = "0" + dateStr;
    month = dateStr.substring(0, 2);
    day = dateStr.substring(2, 4);
    year = dateStr.substring(4, 6);
  } else {
    throw new Error("Invalid date format for MM/DD/YY conversion");
  }
  return `${month}/${day}/${year}`;
}
/**
 * Converts a duration in milliseconds to a human-readable string,
 * like "12.34 sec" or "2 min 15.67 sec"
 */
export function formatDurationMs(durationMs: number): string {
  const durationSec = durationMs / 1000;

  if (durationSec < 60) {
    return `${durationSec.toFixed(2)} sec`;
  } else {
    const minutes = Math.floor(durationSec / 60);
    const seconds = (durationSec % 60).toFixed(2);
    return `${minutes} min ${seconds} sec`;
  }
}

export function getCurrentDate(format: string = "YYYYMMDD"): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");

  if (format === "YYYYMMDD") {
    return `${year}${month}${day}`;
  }

  // Add more formats as needed in the future
  throw new Error(`Unsupported date format: ${format}`);
}

/**
 * Converts a date string in MM/DD/YYYY or MM-DD-YYYY format to MMDDYY format.
 * Returns an empty string for invalid or empty input.
 *
 * @param date - The date string in MM/DD/YYYY or MM-DD-YYYY format
 * @returns The date string in MMDDYY format, or empty string if invalid
 */
export function convertMMDDYYYYtoMMDDYY(date?: string | null): string {
  if (!date || typeof date !== "string") return "";

  const parts = date.includes("/") ? date.split("/") : date.split("-");
  if (parts.length !== 3) return "";

  let [mm, dd, yyyy] = parts.map((p) => p.trim());

  if (!mm || !dd || !yyyy) return "";

  // Ensure numeric values are zero-padded
  mm = String(parseInt(mm)).padStart(2, "0");
  dd = String(parseInt(dd)).padStart(2, "0");
  const yy = yyyy.slice(-2);

  return `${mm}${dd}${yy}`;
}

export function formatNumberToMMDDYY(num: number | string): string {
  return num.toString().padStart(6, "0");
}

export function getTimestamp(
  dateFormat: string = TIMESTAMP_FORMATS.COMPACT,
  date?: Date,
  timeZone: string = "America/New_York"
): string | any {
  const targetDate = date || new Date();

  const result = formatInTimeZone(targetDate, timeZone, dateFormat);

  if (dateFormat === TIMESTAMP_FORMATS.COMPACT) {
    const microseconds = String(Math.floor(Math.random() * 1000)).padStart(
      3,
      "0"
    );
    return `${result}${microseconds}`;
  }
  return result;
}

export function convertDateFormat(
  input: string | number,
  valueFormat: string,
  expectedFormat: string
): string | number {
  try {
    // Handle zero input
    if (input === 0 || input === "0") {
      return 0;
    }

    // Special handling for YYMMDD/YMMDD to MMDDYY conversion
    if (valueFormat === "yymmdd" && expectedFormat === "mmddyy") {
      let dateStr = typeof input === "number" ? input.toString() : input;
      
      if (dateStr === "0" || input === 0) {
        return 0;
      }

      let year: string, month: string, day: string;

      if (dateStr.length === 6) {
        // YYMMDD format (year, month, day)
        year = dateStr.substring(0, 2);
        month = dateStr.substring(2, 4);
        day = dateStr.substring(4, 6);
      } else if (dateStr.length === 5) {
        // YMMDD format (year, month, day)
        const y = dateStr.substring(0, 1);  // year (single digit)
        month = dateStr.substring(1, 3);    // month
        day = dateStr.substring(3, 5);       // day
        year = "0" + y; // pad year with leading zero
      } else {
        throw new Error(`Invalid date format: expected 5 or 6 characters for YYMMDD/YMMDD, got ${dateStr.length}`);
      }

      // Return in MMDDYY format (month, day, year)
      return `${month}${day}${year}`;
    }

    // Special handling for YYMMDD to YYYYMMDD conversion
    if (valueFormat === "yymmdd" && expectedFormat === "yyyyMMdd") {
      let dateStr = typeof input === "number" ? input.toString().padStart(6, "0") : input;
      
      if (dateStr === "0" || input === 0) {
        return 0;
      }

      if (dateStr.length !== 6) {
        throw new Error(`Invalid YYMMDD format: expected 6 characters, got ${dateStr.length}`);
      }

      const yy = dateStr.substring(0, 2);
      const mm = dateStr.substring(2, 4);
      const dd = dateStr.substring(4, 6);

      // Determine full year (<=80 as 20YY, else 19YY)
      const fullYear = parseInt(yy, 10) <= 80 ? `20${yy}` : `19${yy}`;

      // Return in YYYYMMDD format as number
      return parseInt(`${fullYear}${mm}${dd}`, 10);
    }

    // Ensure input is a string (pad with zeros in case it's numeric like 90225 -> 090225)
    const inputStr =
      typeof input === "number" ? input.toString().padStart(6, "0") : input;

    const parsed = parse(inputStr, valueFormat, new Date());

    // Validate the parsed date before formatting
    if (!isValid(parsed)) {
      // Return 0 for invalid dates instead of throwing an error
      return 0;
    }

    return formatDate(parsed, expectedFormat);
  } catch (err) {
    throw new Error(`Invalid date format: ${err}`);
  }
}

export function formatMMDDYYDate(params: {
  dateStr: string;
  pivotYear?: number;
  outputFormat?: string;
}): string {
  const { dateStr, pivotYear = 50, outputFormat = "MMDDYYYY" } = params;

  if (!/^\d{6}$/.test(dateStr)) {
    throw new Error("Invalid date format. Expected MMDDYY (6 digits).");
  }

  const mm = dateStr.slice(0, 2);
  const dd = dateStr.slice(2, 4);
  const yy = parseInt(dateStr.slice(4, 6), 10);

  const century = yy < pivotYear ? 2000 : 1900;
  const yyyy = century + yy;

  // Create date object for validation
  const date = new Date(yyyy, parseInt(mm, 10) - 1, parseInt(dd, 10));
  
  // Validate the date
  if (!isValid(date)) {
    throw new Error(`Invalid date: ${dateStr} does not represent a valid calendar date`);
  }

  // Format output based on specified pattern
  switch (outputFormat.toUpperCase()) {
    case "MMDDYYYY":
      return `${mm}${dd}${yyyy}`;
    case "MM/DD/YYYY":
      return `${mm}/${dd}/${yyyy}`;
    case "YYYYMMDD":
      return `${yyyy}${mm}${dd}`;
    case "YYYY-MM-DD":
      return `${yyyy}-${mm}-${dd}`;
    case "DDMMYYYY":
      return `${dd}${mm}${yyyy}`;
    case "DD/MM/YYYY":
      return `${dd}/${mm}/${yyyy}`;
    default:
      throw new Error(`Unsupported output format: ${outputFormat}`);
  }
}
