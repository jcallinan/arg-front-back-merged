/**
 * Types for upload processing and error handling
 */

/**
 * Base error structure for validation errors
 */
export interface ValidationError {
  code: string;
  message: string;
  field: string;
}

/**
 * Base unprocessed item structure
 */
export interface BaseUnprocessedItem {
  invoiceNo: string;
  error: ValidationError;
}

/**
 * Flexi-specific unprocessed item (uses vendorNo)
 */
export interface FlexiUnprocessedItem extends BaseUnprocessedItem {
  vendorNo: string;
}

/**
 * SOGAS-specific unprocessed item (uses ownerNo)
 */
export interface SogasUnprocessedItem extends BaseUnprocessedItem {
  ownerNo: string;
}

/**
 * Union type for all unprocessed item types
 */
export type UnprocessedItem = FlexiUnprocessedItem | SogasUnprocessedItem;

/**
 * Common error codes for upload validation
 */
export const UPLOAD_ERROR_CODES = {
  VENDOR_NOT_FOUND: "VENDOR_NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  FILE_ERROR: "FILE_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
} as const;

export type UploadErrorCode =
  (typeof UPLOAD_ERROR_CODES)[keyof typeof UPLOAD_ERROR_CODES];

/**
 * Common field names for upload validation
 */
export const UPLOAD_FIELD_NAMES = {
  VENDOR_NO: "vendorNo",
  OWNER_NO: "ATOWNR/ownerno",
  VALIDATION: "validation",
  FILE: "file",
  VOUCHER_HEADER: "voucherHeader",
  VOUCHER_DETAIL: "voucherDetail",
} as const;

export type UploadFieldName =
  (typeof UPLOAD_FIELD_NAMES)[keyof typeof UPLOAD_FIELD_NAMES];

/**
 * Helper function to create Flexi unprocessed item
 */
export function createFlexiUnprocessedItem(
  vendorNo: string | number,
  invoiceNo: string,
  errorCode: UploadErrorCode = UPLOAD_ERROR_CODES.VENDOR_NOT_FOUND,
  message?: string,
  field: UploadFieldName = UPLOAD_FIELD_NAMES.VENDOR_NO
): FlexiUnprocessedItem {
  return {
    vendorNo: String(vendorNo),
    invoiceNo,
    error: {
      code: errorCode,
      message:
        message ||
        `WE DIDN'T FIND ANY VENDOR WITH ${vendorNo} AND ${invoiceNo}`,
      field,
    },
  };
}

/**
 * Helper function to create SOGAS unprocessed item
 */
export function createSogasUnprocessedItem(
  ownerNo: string,
  invoiceNo: string,
  errorCode: UploadErrorCode = UPLOAD_ERROR_CODES.VENDOR_NOT_FOUND,
  message?: string,
  field: UploadFieldName = UPLOAD_FIELD_NAMES.OWNER_NO
): SogasUnprocessedItem {
  return {
    ownerNo,
    invoiceNo,
    error: {
      code: errorCode,
      message:
        message ||
        `WE DIDN'T FIND ANY VENDOR BASED ON OWNERNO ${ownerNo} WITH INVOICE NO ${invoiceNo}`,
      field,
    },
  };
}

/**
 * Generic unprocessed item creator
 */
export function createUnprocessedItem<T extends BaseUnprocessedItem>(
  baseItem: Omit<T, "error">,
  error: ValidationError
): T {
  return {
    ...baseItem,
    error,
  } as T;
}
