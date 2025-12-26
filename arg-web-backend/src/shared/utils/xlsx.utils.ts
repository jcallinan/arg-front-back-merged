import * as XLSX from "xlsx";
import { ProcessType, SogasSubType } from "../constants/strategy-type.enum";
import { BadRequestException } from "@nestjs/common";


/**
 * Validates that an Excel file contains actual data records after the header row.
 * This function checks if there are non-empty data rows after the header row (row 1).
 *
 * @param filePath path to the Excel file
 * @param minDataRows minimum number of data rows required (default: 1)
 * @throws BadRequestException if no data records are found
 */
export function validateExcelHasDataRecords(
  filePath: string,
  minDataRows: number = 1
): void {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new BadRequestException("No sheets found in uploaded Excel file");
  }

  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    throw new BadRequestException(
      `Worksheet ${sheetName} not found in uploaded file`
    );
  }

  const rows = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });

  // Check if there are enough rows (headers + at least minDataRows)
  if (rows.length < 1 + minDataRows) {
    throw new BadRequestException(
      `Excel file must contain at least ${minDataRows} data row(s) after the header row. Found only ${Math.max(0, rows.length - 1)} data row(s).`
    );
  }

  // Check if there are any non-empty data rows after the headers
  const dataRows = rows.slice(1); // Skip header row (row 1)
  const nonEmptyDataRows = dataRows.filter(
    (row) =>
      row &&
      Array.isArray(row) &&
      row.some(
        (cell) =>
          cell !== undefined && cell !== null && String(cell).trim() !== ""
      )
  );

  if (nonEmptyDataRows.length < minDataRows) {
    throw new BadRequestException(
      `Excel file must contain at least ${minDataRows} non-empty data row(s) after the header row. Found only ${nonEmptyDataRows.length} non-empty data row(s).`
    );
  }
}

/**
 * Reads an Excel file (.xlsx) and parses into JSON objects.
 * Assumes:
 * - First row (index 0) is the headers.
 * - Data starts from second row (index 1).
 *
 * @param filePath path to the Excel file
 * @returns array of objects [{header1: value1, header2: value2, ...}, ...]
 */

export function validateXlsxHeaderOrder(
  filePath: string,
  expectedHeaders: string[]
): void {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new BadRequestException("No sheets found in uploaded Excel file");
  }

  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    throw new BadRequestException(
      `Worksheet ${sheetName} not found in uploaded file`
    );
  }

  const rows = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });
  const headerRow = rows[0]; // headers on 1st line

  if (!headerRow) {
    throw new BadRequestException(
      "Excel file does not have header row on line 1."
    );
  }

  // Filter out empty columns (whitespace-only headers)
  const nonEmptyHeaders = headerRow.filter(header => 
    header && String(header).trim() !== ""
  );

  if (nonEmptyHeaders.length !== expectedHeaders.length) {
    throw new BadRequestException(
      `Header length mismatch. Expected ${expectedHeaders.length} columns but found ${nonEmptyHeaders.length} non-empty columns.`
    );
  }

  for (let i = 0; i < expectedHeaders.length; i++) {
    const expectedHeader = expectedHeaders[i]?.trim() || "";
    const actualHeader = String(headerRow[i] || "").trim();
    
    if (actualHeader !== expectedHeader) {
      throw new BadRequestException(
        `Header mismatch at column ${i + 1}. Expected "${expectedHeader}" but found "${actualHeader}". ` 
      );
    }
  }

  // Validate that the file contains actual data records after the headers
  validateExcelHasDataRecords(filePath, 1);
}

/**
 * Converts an Excel serial date number to MM/DD/YYYY string.
 * Returns empty string if input is not a number.
 */
function excelDateToString(excelDate: number): string {
  if (typeof excelDate !== "number") return "";
  const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

/**
 * Parses a number string that may contain commas (e.g., "1,234.56") and/or 
 * accounting-style negatives (e.g., "(1,234.56)").
 * Handles both positive and negative numbers.
 * @param val - The value to parse (string, number, or any)
 * @returns The parsed number or the original value if parsing fails
 */
export function parseCommaSeparatedNumber(val: any): number | string {
  if (val === null || val === undefined) {
    return val;
  }
  
  // If it's already a number, return it
  if (typeof val === "number") {
    return val;
  }
  
  // Convert to string
  let str = String(val).trim();
  
  // Check if it's an accounting-style negative (has parentheses)
  const isAccountingNegative = /^\(.*\)$/.test(str);
  
  // Remove commas and parentheses before parsing
  const cleanedStr = str.replace(/[(),]/g, "");
  const num = parseFloat(cleanedStr);
  
  // If parsing failed, return original value
  if (isNaN(num)) {
    return val;
  }
  
  // Return negative number if it was accounting-style negative, otherwise return positive
  return isAccountingNegative ? -num : num;
}


export function parseXlsxWithRowHeaders(
  filePath: string,
  subType?: string
): any[] {
  const isCellText =
    subType === SogasSubType.TAX || subType === SogasSubType.REGULAR
      ? true
      : false;

  const workbook = XLSX.readFile(filePath, {
    cellDates: true, // Preserve date formats instead of converting to serial numbers if iscelldates is true
    cellNF: false, // Don't parse number formats
    cellText: isCellText, // Don't convert everything to text
  });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new BadRequestException("No sheets found in uploaded Excel file");
  }

  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    throw new BadRequestException(
      `Worksheet ${sheetName} not found in uploaded file`
    );
  }

  const rows = XLSX.utils.sheet_to_json<string[]>(worksheet, {
    header: 1,
    raw: false, // Convert values to their proper types
    defval: "", // Default value for empty cells
  });

  if (!rows[0]) {
    throw new BadRequestException(
      "Missing header row on first line of Excel file"
    );
  }

  const headers = rows[0] as string[];
  return rows.slice(1).map((row) => {
    const obj: any = {};
    headers.forEach((key, i) => {
      let val = row[i];
      // Trim the key to handle whitespace issues
      const trimmedKey = String(key).trim();
      
      // Handle date conversion for new format fields
      if (trimmedKey === "PAYMENT_DUE_DATE" && typeof val === "number") {
        val = excelDateToString(val);
      }
      if (trimmedKey === "CHECK_DATE" && typeof val === "number") {
        val = excelDateToString(val);
      }
      // For SOGAS TAX, parse accounting negatives and comma-separated numbers for amount fields
      if (
        subType?.toLowerCase() === "tax" &&
        ["AMOUNT"].includes(trimmedKey) // Updated to use new field name
      ) {
        const parsed = parseCommaSeparatedNumber(val);
        val = typeof parsed === "number" ? String(parsed) : parsed;
      }
      obj[trimmedKey] = val !== undefined && val !== null ? String(val).trim() : "";
    });
    return obj;
  });
}


/**
 * Filters out empty rows (all fields undefined, null, or empty string).
 * For SOGAS, also sets row.ownerNo = row["ATOWNR"] for each row.
 * @param rows - The array of parsed data rows
 * @param uploadType - The upload type string (e.g., 'sogas', 'flexi')
 * @returns The filtered and normalized array of rows
 */

export function filterAndNormalizeRows(rows: any[], uploadType: string): any[] {
  const filteredRows = rows.filter(row => {
    // Trim all values in the row first
    Object.keys(row).forEach(key => {
      if (row[key] !== undefined && row[key] !== null) {
        row[key] = String(row[key]).trim();
      }
    });

    // Check if any cell has content after trimming
    const hasContent = Object.values(row).some(val => val !== undefined && val !== null && String(val).trim() !== '');

    if (!hasContent) return false;

    // Custom extra checks for SOGAS upload to exclude rows missing critical data
    if (uploadType && uploadType.toLowerCase() === ProcessType.SOGAS) {
      const ownerNo = row["OWNER_NUMBER"] || row["ATOWNR"] || '';
      const amount = row["AMOUNT"] || '0';

      // Exclude rows with empty ownerNo or zero amount treated as empty group
      if (String(ownerNo).trim() === '' || Number(String(amount).replace(/[()]/g, '-')) === 0) {
        return false;
      }
    }

    return true;
  });

  // Normalize ownerNo if 'sogas'
  if (uploadType && uploadType.toLowerCase() === "sogas") {
    filteredRows.forEach(row => {
      row.ownerNo = row["OWNER_NUMBER"];
    });
  }
  return filteredRows;
}


/**
 * Converts JSON data to an Excel buffer.
 * @param data - Array of objects to convert to Excel
 * @param sheetName - Name of the Excel sheet
 * @returns Buffer - Excel file buffer
 */
export function generateExcelFile(data: any[], sheetName = "Sheet1",  columnMap?: Record<string, string>): Buffer {
  let exportData = data;
  // Only remap keys if columnMap is provided
  if (columnMap) {
    exportData = data.map((row) => {
      const mapped: Record<string, any> = {};
      for (const [entityKey, dbColumn] of Object.entries(columnMap)) {
        mapped[dbColumn] = row[entityKey];
      }
      return mapped;
    });
  }
  
  // Step 1: Create a worksheet from the JSON exportData
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

  // Step 2: Create a workbook and append the worksheet
  const workbook: XLSX.WorkBook = {
    Sheets: { [sheetName]: worksheet },
    SheetNames: [sheetName],
  };

  // Step 3: Write the workbook to a buffer
  const buffer: Buffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "buffer",
  });

  return buffer;
}

/**
 * Sanitizes a string to only contain ASCII printable characters (0x20-0x7E).
 * This includes: letters (A-Z, a-z), numbers (0-9), spaces, and common punctuation (!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~)
 * Examples of allowed: "Hello World 123", "Invoice #456", "Amount: $100.50"
 * This automatically excludes:
 * - All control characters (0x00-0x1F, 0x7F): null (\x00), tab (\x09), newline (\x0A), carriage return (\x0D), etc.
 * - All extended ASCII characters (0x80-0xFF): é, ñ, ü, ©, ®, etc.
 * - All Unicode special characters: ™, ©, ®, €, £, ¥, →, •, etc.
 * - All multi-byte characters: 中文, 日本語, العربية, emoji 😀, etc.
 * @param value - The string value to sanitize
 * @returns The sanitized string with only ASCII printable characters, trimmed
 */
export function sanitizeToAsciiPrintable(value: string): string {
  const str = String(value || "");
  return str.replace(/[^\x20-\x7E]/g, "").trim();
}

export function safeTruncate(value: string, maxLength: number): string {
  // Convert to string if not already
  const str = String(value || "");
  
  const sanitized = sanitizeToAsciiPrintable(str);
  
  if (sanitized.length <= maxLength) {
    return sanitized;
  }
  return sanitized.substring(0, maxLength);
}