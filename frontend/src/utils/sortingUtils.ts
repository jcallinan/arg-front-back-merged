/**
 * Utility functions for creating sorters in Ant Design table columns
 * These functions maintain the exact same sorting logic used throughout the application
 */

import { parseDateForSorting } from './dateFormat';
import { toNumericOrNull } from './formatters';
import dayjs from "dayjs";
/**
 * Creates a sorter for text/string columns with case-insensitive comparison
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createTextSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const valA = (a[dataKey] || "").toString().toLowerCase();
    const valB = (b[dataKey] || "").toString().toLowerCase();
    return valA.localeCompare(valB);
  };
};

/**
 * Creates a sorter for numeric columns
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createNumericSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const valA = Number(a[dataKey]) || 0;
    const valB = Number(b[dataKey]) || 0;
    return valA - valB;
  };
};

/**
 * Creates a sorter for invoice amount columns with currency parsing
 * Maintains the exact same logic used in invoice amount sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createInvoiceAmountSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const aValue = parseFloat(String(a[dataKey]).replace(/[^0-9.-]+/g, "")) || 0;
    const bValue = parseFloat(String(b[dataKey]).replace(/[^0-9.-]+/g, "")) || 0;
    return aValue - bValue;
  };
};

/**
 * Creates a sorter for invoice amount columns with dollar sign removal
 * Alternative invoice amount sorter used in some components
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createInvoiceAmountSorterWithDollar = (dataKey: string) => {
  return (a: any, b: any) => {
    const aValue = parseFloat(String(a[dataKey]).replace(/\$/g, "")) || 0;
    const bValue = parseFloat(String(b[dataKey]).replace(/\$/g, "")) || 0;
    return aValue - bValue;
  };
};

/**
 * Creates a sorter for date columns using the existing parseDateForSorting utility
 * Maintains the exact same date sorting logic used throughout the application
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createDateSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const dateA = new Date(a[dataKey] || "").getTime();
    const dateB = new Date(b[dataKey] || "").getTime();
    return dateA - dateB;
  };
};

/**
 * Creates a sorter for date columns using parseDateForSorting utility
 * For dates that need special parsing (MM/DD/YY, DDMMYY, YYYYMMDD formats)
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createCustomDateSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const dateA = parseDateForSorting(a[dataKey] || "");
    const dateB = parseDateForSorting(b[dataKey] || "");
    return dateA.getTime() - dateB.getTime();
  };
};

/**
 * Creates a sorter for vendor number columns
 * Maintains the exact same logic used in vendor number sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createVendorNumberSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const valA = Number(a[dataKey]) || 0;
    const valB = Number(b[dataKey]) || 0;
    return valA - valB;
  };
};

/**
 * Creates a sorter for vendor number columns as string
 * Alternative vendor number sorter used in some components
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createVendorNumberStringSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    // Convert vendor numbers to integers for proper numerical sorting
    const valA = parseInt(a[dataKey]?.toString() || "0", 10) || 0;
    const valB = parseInt(b[dataKey]?.toString() || "0", 10) || 0;
    return valA - valB;
  };
};

/**
 * Creates a sorter for check number columns
 * Maintains the exact same logic used in check number sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createCheckNumberSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const aVal = parseInt(a[dataKey]?.toString() || "0");
    const bVal = parseInt(b[dataKey]?.toString() || "0");
    return aVal - bVal;
  };
};

/**
 * Creates a sorter for amount columns with custom parsing
 * For amounts that need special parsing (like discount amounts)
 * @param dataKey - The key/property name to sort by
 * @param parseFunction - Custom parsing function for the amount
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createAmountSorter = (dataKey: string, parseFunction?: (value: any) => number) => {
  return (a: any, b: any) => {
    const parseAmount = parseFunction || ((val: any) => parseFloat(String(val).replace(/[^0-9.-]+/g, "")) || 0);
    const valA = parseAmount(a[dataKey]);
    const valB = parseAmount(b[dataKey]);
    return valA - valB;
  };
};

/**
 * Creates a sorter for status columns with case-insensitive comparison
 * Maintains the exact same logic used in status sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createStatusSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const statusA = (a[dataKey] || "").toLowerCase();
    const statusB = (b[dataKey] || "").toLowerCase();
    return statusA.localeCompare(statusB);
  };
};

/**
 * Creates a sorter for entry number columns
 * Maintains the exact same logic used in entry number sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createEntryNumberSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    return a[dataKey] - b[dataKey];
  };
};

/**
 * Creates a sorter for file name columns
 * Maintains the exact same logic used in file name sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createFileNameSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    return (a[dataKey] || "").toLowerCase().localeCompare((b[dataKey] || "").toLowerCase());
  };
};

/**
 * Creates a sorter for report date time columns
 * Maintains the exact same logic used in report date time sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createReportDateTimeSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const dateA = a[dataKey] ? new Date(a[dataKey]).getTime() : 0;
    const dateB = b[dataKey] ? new Date(b[dataKey]).getTime() : 0;
    return dateA - dateB;
  };
};

/**
 * Creates a sorter for clear date columns
 * Maintains the exact same logic used in clear date sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createClearDateSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    return new Date(a[dataKey]).getTime() - new Date(b[dataKey]).getTime();
  };
};

/**
 * Creates a sorter for clear amount columns
 * Maintains the exact same logic used in clear amount sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createClearAmountSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    return a[dataKey] - b[dataKey];
  };
};

/**
 * Creates a sorter for validation status columns
 * Maintains the exact same logic used in validation status sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createValidationStatusSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const valA = a[dataKey];
    const valB = b[dataKey];
    
    // Handle null/undefined values
    if (!valA && !valB) return 0;
    if (!valA) return -1;
    if (!valB) return 1;
    
    // Convert to string for comparison
    return String(valA).localeCompare(String(valB));
  };
};

/**
 * Creates a sorter for record type columns
 * Maintains the exact same logic used in record type sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createRecordTypeSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const valA = a[dataKey];
    const valB = b[dataKey];
    
    // Handle null/undefined values
    if (!valA && !valB) return 0;
    if (!valA) return -1;
    if (!valB) return 1;
    
    // Convert to string for comparison
    return String(valA).localeCompare(String(valB));
  };
};

/**
 * Creates a sorter for ctl columns
 * Maintains the exact same logic used in ctl sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createCtlSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const valA = a[dataKey];
    const valB = b[dataKey];
    
    // Handle null/undefined values
    if (!valA && !valB) return 0;
    if (!valA) return -1;
    if (!valB) return 1;
    
    // Convert to string for comparison
    return String(valA).localeCompare(String(valB));
  };
};

/**
 * Creates a sorter for tin columns
 * Maintains the exact same logic used in tin sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createTinSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const valA = a[dataKey];
    const valB = b[dataKey];
    
    // Handle null/undefined values
    if (!valA && !valB) return 0;
    if (!valA) return -1;
    if (!valB) return 1;
    
    // Convert to string for comparison
    return String(valA).localeCompare(String(valB));
  };
};

/**
 * Creates a sorter for telephone columns
 * Maintains the exact same logic used in telephone sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createTelephoneSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    return (a[dataKey] || "").toLowerCase().localeCompare((b[dataKey] || "").toLowerCase());
  };
};

/**
 * Creates a sorter for last payment amount columns
 * Maintains the exact same logic used in last payment amount sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createLastPaymentAmountSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const valA = parseFloat(String(a[dataKey]).replace(/[^0-9.-]+/g, "")) || 0;
    const valB = parseFloat(String(b[dataKey]).replace(/[^0-9.-]+/g, "")) || 0;
    return valA - valB;
  };
};

/**
 * Creates a sorter for carrier ID columns
 * Maintains the exact same logic used in carrier ID sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createCarrierIdSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const valA = a[dataKey];
    const valB = b[dataKey];
    
    // Handle null/undefined values
    if (!valA && !valB) return 0;
    if (!valA) return -1;
    if (!valB) return 1;
    
    // Convert to string for comparison
    return String(valA).localeCompare(String(valB));
  };
};

/**
 * Creates a sorter for carrier invoice number columns
 * Maintains the exact same logic used in carrier invoice number sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createCarrierInvoiceNoSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const valA = a[dataKey];
    const valB = b[dataKey];
    
    // Handle null/undefined values
    if (!valA && !valB) return 0;
    if (!valA) return -1;
    if (!valB) return 1;
    
    // Convert to string for comparison
    return String(valA).localeCompare(String(valB));
  };
};

/**
 * Creates a sorter for order number columns
 * Maintains the exact same logic used in order number sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createOrderNumberSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const valA = a[dataKey];
    const valB = b[dataKey];
    
    // Handle null/undefined values
    if (!valA && !valB) return 0;
    if (!valA) return -1;
    if (!valB) return 1;
    
    // Convert to string for comparison, handling different data types
    const strA = String(valA);
    const strB = String(valB);
    
    return strA.localeCompare(strB);
  };
};

/**
 * Creates a sorter for due date columns
 * Maintains the exact same logic used in due date sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createDueDateSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const valA = a[dataKey];
    const valB = b[dataKey];
    
    // Handle null/undefined values
    if (!valA && !valB) return 0;
    if (!valA) return -1;
    if (!valB) return 1;
    
    // Convert to string for comparison, handling different data types
    const strA = String(valA);
    const strB = String(valB);
    
    return strA.localeCompare(strB);
  };
};

/**
 * Creates a sorter for gross amount columns
 * Maintains the exact same logic used in gross amount sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createGrossAmountSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const valA = parseFloat(String(a[dataKey]).replace(/[^0-9.-]+/g, "")) || 0;
    const valB = parseFloat(String(b[dataKey]).replace(/[^0-9.-]+/g, "")) || 0;
    return valA - valB;
  };
};

/**
 * Creates a sorter for discount due columns
 * Maintains the exact same logic used in discount due sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createDiscountDueSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const valA = parseFloat(String(a[dataKey]).replace(/[^0-9.-]+/g, "")) || 0;
    const valB = parseFloat(String(b[dataKey]).replace(/[^0-9.-]+/g, "")) || 0;
    return valA - valB;
  };
};

/**
 * Creates a sorter for discount due date columns
 * Maintains the exact same logic used in discount due date sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createDiscountDueDateSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const dateA = parseDateForSorting(a[dataKey] || "");
    const dateB = parseDateForSorting(b[dataKey] || "");
    return dateA.getTime() - dateB.getTime();
  };
};

/**
 * Creates a sorter for discount amount columns
 * Maintains the exact same logic used in discount amount sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createDiscountAmountSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const valA = parseFloat(String(a[dataKey]).replace(/[^0-9.-]+/g, "")) || 0;
    const valB = parseFloat(String(b[dataKey]).replace(/[^0-9.-]+/g, "")) || 0;
    return valA - valB;
  };
};

/**
 * Creates a sorter for vendor name columns
 * Maintains the exact same logic used in vendor name sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createVendorNameSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    return a[dataKey].toString().localeCompare(b[dataKey].toString());
  };
};

/**
 * Creates a sorter for vendor name columns with null safety
 * Alternative vendor name sorter used in some components
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createVendorNameSafeSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    return (a[dataKey] || "").toLowerCase().localeCompare((b[dataKey] || "").toLowerCase());
  };
};

/**
 * Creates a sorter for invoice description columns
 * Maintains the exact same logic used in invoice description sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createInvoiceDescriptionSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    return (a[dataKey] || "").toLowerCase().localeCompare((b[dataKey] || "").toLowerCase());
  };
};

/**
 * Creates a sorter for PDF file name columns
 * Maintains the exact same logic used in PDF file name sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createPdfFileNameSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    return (a[dataKey] || "").toLowerCase().localeCompare((b[dataKey] || "").toLowerCase());
  };
};

/**
 * Creates a sorter for report type columns
 * Maintains the exact same logic used in report type sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createReportTypeSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    return (a[dataKey] || "").toLowerCase().localeCompare((b[dataKey] || "").toLowerCase());
  };
};

/**
 * Creates a sorter for report file type columns
 * Maintains the exact same logic used in report file type sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createReportFileTypeSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    return (a[dataKey] || "").toLowerCase().localeCompare((b[dataKey] || "").toLowerCase());
  };
};

/**
 * Creates a sorter for status columns with null safety
 * Alternative status sorter used in some components
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createStatusSafeSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    return (a[dataKey] || "").toLowerCase().localeCompare((b[dataKey] || "").toLowerCase());
  };
};

/**
 * Creates a sorter for invoice number columns with null safety
 * Alternative invoice number sorter used in some components
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createInvoiceNumberSafeSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    return String(a[dataKey] ?? "").localeCompare(String(b[dataKey] ?? ""));
  };
};

/**
 * Creates a sorter for invoice number columns
 * Maintains the exact same logic used in invoice number sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createInvoiceNumberSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const valA = a[dataKey];
    const valB = b[dataKey];
    
    // Handle null/undefined values
    if (!valA && !valB) return 0;
    if (!valA) return -1;
    if (!valB) return 1;
    
    // Convert to string for comparison, handling different data types
    const strA = String(valA);
    const strB = String(valB);
    
    return strA.localeCompare(strB);
  };
};

/**
 * Creates a sorter for invoice date columns
 * Maintains the exact same logic used in invoice date sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createInvoiceDateSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const dateA = parseDateForSorting(a[dataKey] || "");
    const dateB = parseDateForSorting(b[dataKey] || "");
    return dateA.getTime() - dateB.getTime();
  };
};

/**
 * Creates a sorter for paid date columns
 * Handles different data types (strings, numbers, dates) safely
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */


export const createPaidDateSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const valA = a[dataKey];
    const valB = b[dataKey];

    if (!valA && !valB) return 0;
    if (!valA) return -1;
    if (!valB) return 1;

    const dateA = dayjs(valA, "MM/DD/YY", true); // strict parsing
    const dateB = dayjs(valB, "MM/DD/YY", true);

    if (!dateA.isValid() && !dateB.isValid()) return 0;
    if (!dateA.isValid()) return -1;
    if (!dateB.isValid()) return 1;

    return dateA.valueOf() - dateB.valueOf(); // millisecond timestamps
  };
};


/**
 * Creates a sorter for invoice amount columns with custom parsing
 * For invoice amounts that need special parsing
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createInvoiceAmountCustomSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const valueA = toNumericOrNull(a[dataKey]) || 0;
    const valueB = toNumericOrNull(b[dataKey]) || 0;
    return valueA - valueB;
  };
};

/**
 * Creates a sorter for discount due columns with custom parsing
 * For discount due amounts that need special parsing
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createDiscountDueCustomSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const valueA = toNumericOrNull(a[dataKey]) || 0;
    const valueB = toNumericOrNull(b[dataKey]) || 0;
    return valueA - valueB;
  };
};

/**
 * Creates a sorter for hold type columns
 * Maintains the exact same logic used in hold type sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createHoldTypeSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const valA = a[dataKey]?.toString().toLowerCase() || "";
    const valB = b[dataKey]?.toString().toLowerCase() || "";
    return valA.localeCompare(valB);
  };
};

/**
 * Creates a sorter for numeric or null values
 * Maintains the exact same logic used in numeric sorting with null handling
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createNumericOrNullSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const toNumericOrNull = (value: any) => {
      if (value === null || value === undefined || value === "") return null;
      const num = Number(value);
      return isNaN(num) ? null : num;
    };
    
    const valA = toNumericOrNull(a[dataKey]) ?? 0;
    const valB = toNumericOrNull(b[dataKey]) ?? 0;
    return valA - valB;
  };
};

/**
 * Creates a sorter for date columns with null safety
 * Alternative date sorter used in some components
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createDateSafeSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const dateA = a[dataKey] ? new Date(a[dataKey]).getTime() : 0;
    const dateB = b[dataKey] ? new Date(b[dataKey]).getTime() : 0;
    return dateA - dateB;
  };
};

/**
 * Creates a sorter for string columns with null safety
 * Alternative string sorter used in some components
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createStringSafeSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const valA = (a[dataKey] || "").toString().toLowerCase();
    const valB = (b[dataKey] || "").toString().toLowerCase();
    return valA.localeCompare(valB);
  };
};

/**
 * Creates a sorter for voucher number columns
 * Maintains the exact same logic used in voucher number sorting
 * @param dataKey - The key/property name to sort by
 * @returns Sorter function compatible with Ant Design Table columns
 */
export const createVoucherNumberSorter = (dataKey: string) => {
  return (a: any, b: any) => {
    const valA = Number(a[dataKey]) || 0;
    const valB = Number(b[dataKey]) || 0;
    return valA - valB;
  };
};