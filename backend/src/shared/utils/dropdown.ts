import { DropdownType } from "@src/types/types";
import { getCountries } from "./countries";

export enum DropdownTypeEnum {
  PROCESS_TYPES = "PROCESS_TYPES",
  FORM_TYPE = "FORM_TYPE",
  PAYMENT_FOR_REPORT_TYPES = "PAYMENT_FOR_REPORT_TYPES",
  COUNTRIES_ISO = "COUNTRIES_ISO",
  COUNTRIES_PHONE_CODE = "COUNTRIES_PHONE_CODE",
  HOLD_VOUCHER_CODE = "HOLD_VOUCHER_CODE",
  PREPAID_OPTIONS = "PREPAID_OPTIONS",
  PAY_HOLD_OPTIONS = "PAY_HOLD_OPTIONS",
  HOLD_VOUCHER_DESCRIPTIONS = "HOLD_VOUCHER_DESCRIPTIONS",
  RECORD_TYPE_OPTIONS = "RECORD_TYPE_OPTIONS",
  PAYMENT_VOUCHER_TYPE = "PAYMENT_VOUCHER_TYPE",
  MAKE_PREPAID_FLAG = "MAKE_PREPAID_FLAG",
  SINGLE_CHECK_FLAG = "SINGLE_CHECK_FLAG",
  PAY_OR_HOLD_CODES = "PAY_OR_HOLD_CODES",
}

// Database-driven dropdown types
export enum DropdownDbTypeEnum {
  VENDOR_NAMES = "VENDOR_NAMES",
  COMPANY_NAMES = "COMPANY_NAMES",
  EXPENSE_GL = "EXPENSE_GL",
  VENDOR_TERMS_CODE = "VENDOR_TERMS_CODE",
  VENDOR_GAL_RECEIPT = "VENDOR_GAL_RECEIPT",
  VENDOR_CATEGORY = "VENDOR_CATEGORY",
  AP_1099 = "AP_1099",
  VENDOR_FORM_TYPE = "VENDOR_FORM_TYPE",
  VENDOR_CARRIER = "VENDOR_CARRIER",
  VENDOR_MAINTENANCE_TYPE = "VENDOR_MAINTENANCE_TYPE",
}

// Convert countries to dropdown format

// Define all dropdown data in a centralized location
export const Dropdowns: Record<DropdownTypeEnum, { items: DropdownType[] }> = {
  // Process Types
  PROCESS_TYPES: {
    items: [
      { id: "1", value: "NORMAL", label: "Normal" },
      { id: "2", value: "ARGLMS", label: "LMS" },
      { id: "3", value: "PAPER", label: "Paper" },
      { id: "4", value: "FLEXI", label: "Flexi" },
      { id: "5", value: "SOGAS", label: "SOGAS" },
    ],
  },

  // Form Type
  FORM_TYPE: {
    items: [
      {
        id: "M",
        value: "M",
        label: "Misc",
      },
      {
        id: "N",
        value: "N",
        label: "NEC",
      },
    ],
  },

  // Payment For Report Types
  PAYMENT_FOR_REPORT_TYPES: {
    items: [
      { id: "C", value: "C", label: "Current Year" },
      { id: "P", value: "P", label: "Prior Year" },
    ],
  },

  // Countries - converted to dropdown format
  COUNTRIES_ISO: {
    items: getCountries(DropdownTypeEnum.COUNTRIES_ISO),
  },
  COUNTRIES_PHONE_CODE: {
    items: getCountries(DropdownTypeEnum.COUNTRIES_PHONE_CODE),
  },

  // Hold Voucher Code
  HOLD_VOUCHER_CODE: {
    items: [
      { id: "H", value: "H", label: "Hold" },
      { id: "A", value: "A", label: "ACH" },
      { id: "W", value: "W", label: "Wire Transfer" },
      { id: "E", value: "E", label: "Employee Expense" },
      { id: "U", value: "U", label: "Utility" },
      { id: "N", value: "N", label: "None" },
    ],
  },

  // Prepaid Options
  PREPAID_OPTIONS: {
    items: [
      { id: "P", value: "P", label: "Prepaid" },
      { id: "A", value: "A", label: "ACH Payment" },
      { id: "W", value: "W", label: "Wire Transfer Payment" },
      { id: "E", value: "E", label: "Employee Expense" },
    ],
  },

  // Pay Hold Options
  PAY_HOLD_OPTIONS: {
    items: [
      { id: "Pay", value: "Pay", label: "Pay" },
      { id: "Hold", value: "Hold", label: "Hold" },
      { id: "Partial", value: "Partial", label: "Partial" },
    ],
  },

  // Hold Voucher Descriptions
  HOLD_VOUCHER_DESCRIPTIONS: {
    items: [
      { id: "H", value: "VENDOR ON HOLD", label: "VENDOR ON HOLD" },
      { id: "A", value: "ON HOLD FOR ACH", label: "ON HOLD FOR ACH" },
      {
        id: "W",
        value: "ON HOLD FOR WIRE TRANSFER",
        label: "ON HOLD FOR WIRE TRANSFER",
      },
      { id: "E", value: "Employee Expense", label: "Employee Expense" },
      {
        id: "U",
        value: "ON HOLD FOR UTILITY AUTO",
        label: "ON HOLD FOR UTILITY AUTO",
      },
      { id: "N", value: "", label: "" },
    ],
  },

  // Record Type Options
  RECORD_TYPE_OPTIONS: {
    items: [
      { id: "all", value: "", label: "All" },
      { id: "T", value: "T", label: "Record Type T" },
      { id: "A", value: "A", label: "Record Type A" },
      { id: "B", value: "B", label: "Record Type B" },
    ],
  },

  // Payment Voucher Type
  PAYMENT_VOUCHER_TYPE: {
    items: [
      { id: "1", value: "CHECK", label: "CHECK" },
      { id: "2", value: "ACH", label: "ACH" },
      { id: "3", value: "WIRE", label: "WIRE" },
    ],
  },

  MAKE_PREPAID_FLAG: {
    items: [
      { id: "NONE", value: "", label: "None" },
      { id: "PREPAID", value: "P", label: "Prepaid" },
      { id: "ADVANCE", value: "A", label: "Advance" },
      { id: "WIRE", value: "W", label: "Wire" },
      { id: "EMPLOYEE_EXPENSE", value: "E", label: "Employee Expense" },
      { id: "UTILITY", value: "U", label: "Utility" },
    ],
  },

  SINGLE_CHECK_FLAG: {
    items: [
      { id: "SINGLE", value: "S", label: "Single" },
      { id: "NONE", value: "", label: "None" },
    ],
  },

  PAY_OR_HOLD_CODES: {
    items: [
      { id: "PAY", value: "P", label: "Pay" },
      { id: "HOLD", value: "H", label: "Hold" },
    ],
  },
};

// Type for dropdown keys
export type DropdownKey = keyof typeof Dropdowns;

// Interface for dropdown request
export interface DropdownRequest {
  type: DropdownKey;
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * Get dropdown data by type with optional search and pagination
 * @param type - The type of dropdown to retrieve
 * @param search - Optional search term to filter results
 * @param limit - Optional maximum number of results
 * @param offset - Optional number of results to skip
 * @returns Array of dropdown options
 */
export function getDropdownData(
  type: DropdownKey,
  search?: string,
  limit?: number,
  offset?: number
): DropdownType[] {
  const dropdown = Dropdowns[type];

  if (!dropdown) {
    throw new Error(`Dropdown type '${type}' not found`);
  }

  let items = [...dropdown.items];

  // Apply search filter if provided
  if (search) {
    items = items.filter(
      (item) =>
        item.value.toLowerCase().includes(search.toLowerCase()) ||
        item.label.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Apply pagination if provided
  if (limit || offset) {
    const start = offset || 0;
    const end = start + (limit || items.length);
    items = items.slice(start, end);
  }

  return items;
}

/**
 * Get all dropdown types available
 * @returns Array of dropdown type keys
 */
export function getAvailableDropdownTypes(): string[] {
  return Object.keys(Dropdowns);
}

/**
 * Get dropdown data without any filtering or pagination
 * @param type - The type of dropdown to retrieve
 * @returns Array of all dropdown options for the type
 */
export function getFullDropdownData(type: DropdownKey): DropdownType[] {
  const dropdown = Dropdowns[type];

  if (!dropdown) {
    throw new Error(`Dropdown type '${type}' not found`);
  }

  return [...dropdown.items];
}

/**
 * Search dropdown data by text across all fields
 * @param type - The type of dropdown to search
 * @param searchText - Text to search for
 * @returns Array of matching dropdown options
 */
export function searchDropdownData(
  type: DropdownKey,
  searchText: string
): DropdownType[] {
  const dropdown = Dropdowns[type];

  if (!dropdown) {
    throw new Error(`Dropdown type '${type}' not found`);
  }

  if (!searchText) {
    return [...dropdown.items];
  }

  const searchLower = searchText.toLowerCase();

  return dropdown.items.filter(
    (item) =>
      item.id.toString().toLowerCase().includes(searchLower) ||
      item.value.toLowerCase().includes(searchLower) ||
      item.label.toLowerCase().includes(searchLower)
  );
}

/**
 * Get dropdown item by ID
 * @param type - The type of dropdown to search
 * @param id - The ID to search for
 * @returns The dropdown item if found, undefined otherwise
 */
export function getDropdownItemById(
  type: DropdownKey,
  id: string | number
): DropdownType | undefined {
  const dropdown = Dropdowns[type];

  if (!dropdown) {
    throw new Error(`Dropdown type '${type}' not found`);
  }

  return dropdown.items.find((item) => item.id.toString() === id.toString());
}

/**
 * Get dropdown item by value
 * @param type - The type of dropdown to search
 * @param value - The value to search for
 * @returns The dropdown item if found, undefined otherwise
 */
export function getDropdownItemByValue(
  type: DropdownKey,
  value: string
): DropdownType | undefined {
  const dropdown = Dropdowns[type];

  if (!dropdown) {
    throw new Error(`Dropdown type '${type}' not found`);
  }

  return dropdown.items.find((item) => item.value === value);
}

/**
 * Get dropdown item by label
 * @param type - The type of dropdown to search
 * @param label - The label to search for
 * @returns The dropdown item if found, undefined otherwise
 */
export function getDropdownItemByLabel(
  type: DropdownKey,
  label: string
): DropdownType | undefined {
  const dropdown = Dropdowns[type];

  if (!dropdown) {
    throw new Error(`Dropdown type '${type}' not found`);
  }

  return dropdown.items.find((item) => item.label === label);
}
