/**
 * Constants for Batch Processor
 */

// FIMO (Freight Invoice Move) codes
export const FIMO_CODES = {
  DEFAULT: '0',
  FREIGHT: 'F',
  MOVE: 'M',
} as const;

// DM (Detail/Misc) codes
export const DM_CODES = {
  DEFAULT: '',
  DETAIL: 'D',
  MISC: 'M',
} as const;

// Open/Closed status
export const OPEN_CLOSED_STATUS = {
  CLOSED: 'C',
} as const;

// Default amounts
export const DEFAULT_AMOUNTS = {
  ZERO: 0,
} as const;

// Description constants
export const DESCRIPTIONS = {
  MISC_CHARGE: 'MISC CHARGE',
  SALE_TABLE_DESCRIPTION: 'FRTCHG',
} as const;

// Table codes
export const TABLE_CODES = {
  CONTAINER_PRODUCT_FREIGHT: 'CNTRPF',
} as const;

// Product code positions
export const PRODUCT_CODE_POSITIONS = {
  PRD1: 0,
  PRD2: 1,
  PRD3: 2,
  PRD4: 3,
} as const;

// Shipping reference number formatting
export const SHIPPING_REFERENCE_FORMAT = {
  MIN_LENGTH: 3,
  PAD_CHAR: '0',
} as const;

// Type definitions for better type safety
export type FimoCode = typeof FIMO_CODES[keyof typeof FIMO_CODES];
export type DmCode = typeof DM_CODES[keyof typeof DM_CODES];


export const INVOICE_TYPE = {
  P: 'PAPER',
  O: 'LMS',
} as const;