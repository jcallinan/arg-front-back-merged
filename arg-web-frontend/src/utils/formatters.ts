import {
  fieldMaxLengthMap,
  stepTwoFieldMaxLengthMap,
} from "@constants/commonConstants";
import { holdVoucherCode } from "@constants/commonConstants";

export const formatAmountValue = (fieldName: string, value: string): string => {
  const amountFields = ["Product Amount", "Line Disc Amount", "Invoice Amount", "Partial Pay Amount", "Override Discount Amount", "Freight Amount"];
  const percentageFields = ["Line Disc %"];

  const cleaned = value.trim();
  if (cleaned === "") return "";

  const maxLength =
    stepTwoFieldMaxLengthMap[fieldName] || fieldMaxLengthMap[fieldName] || 12;

  if (percentageFields.includes(fieldName)) {
    const numericValue = parseFloat(cleaned);
    if (isNaN(numericValue) || numericValue > 100) return value;

    const [intPart, decimalPart = ""] = numericValue.toFixed(2).split(".");
    if (intPart.length > 3) return value;

    const formatted = `${intPart}.${decimalPart}`;
    return formatted.length <= maxLength ? formatted : value;
  }

  // For currency/amount fields
  if (amountFields.includes(fieldName)) {
    if (cleaned.includes(".")) {
      const [intPart, decimalPart = ""] = cleaned.split(".");
      if (intPart.length > 9) return value;

      const normalizedDecimal = decimalPart.padEnd(2, "0").slice(0, 2);
      const formatted = `${intPart}.${normalizedDecimal}`;

      return formatted.length <= maxLength ? formatted : value;
    }

    const numericValue = Number(cleaned);
    if (isNaN(numericValue)) return value;
    if (cleaned.length > 9) return value;

    const formatted = `${cleaned}.00`;
    return formatted.length <= maxLength ? formatted : value;
  }

  return value;
};

export const getHoldTypeLabel = (code: string): string => {
  const found = holdVoucherCode.find((item) => item.value === code);
  return found ? found.label.trim() : code;
};

/** Parses a number-like input (string/number), stripping commas and currency symbols. Returns null if not parsable. */
export const toNumericOrNull = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === "number" && !isNaN(value)) return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[$,\s]/g, "");
    const num = Number(cleaned);
    return isNaN(num) ? null : num;
  }
  return null;
};

/** Formats a number-like input as currency using grouping and 2 decimals. Defaults to USD style with a leading $ sign. */
export const formatCurrency = (
  value: unknown,
  options?: { currencySymbol?: string }
): string => {
  const num = toNumericOrNull(value);
  const symbol = options?.currencySymbol ?? "$";
  const safe = num ?? 0;
  return `${symbol}${safe.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/** Formats an integer/float with grouping (no fixed decimal places by default). */
export const formatNumberWithSeparators = (
  value: unknown,
  options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }
): string => {
  const num = toNumericOrNull(value);
  const safe = num ?? 0;
  return safe.toLocaleString("en-US", {
    minimumFractionDigits: options?.minimumFractionDigits,
    maximumFractionDigits: options?.maximumFractionDigits,
  });
};

/** Cleans filename by removing trailing underscores, spaces, and other unwanted characters */
export const cleanFileName = (fileName: string | null | undefined): string => {
  if (!fileName) return '';
  
  return fileName
    .trim() // Remove leading/trailing whitespace
    .replace(/[_\s]+$/g, '') // Remove trailing underscores and spaces
    .replace(/[_]{2,}/g, '_') // Replace multiple consecutive underscores with single underscore
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w\-\.]/g, '') // Remove special characters except word chars, hyphens, and dots
    || ''; // Return empty string if everything was removed
};