export enum VoucherType {
  UNPAID = "UNPAID",
  PAID = "PAID",
  ALL = "ALL",
  CANCELLED = "CANCELLED",
}

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

export enum SortBy {
  INVOICE_DATE = "invoiceDate",
}

export enum VoucherMaintenanceStatusCode {
  NONE = " ",
  HOLD = "H",
  APPROVED = "A",
  WAITING = "W",
  ERROR = "E",
  UNAUTHORIZED = "U",
}

export enum StoredProcedureType {
  NORMAL = "normal",
  PREPAID = "prepaid",
}

export enum CancelledVoucherStatusCode {
  CANCELLED = "C",
  NOT_CANCELLED = "N",
}

export enum AppendInvoiceDescription {
  VOID = "- VOID",
  CANCEL = "- CANCEL",
}