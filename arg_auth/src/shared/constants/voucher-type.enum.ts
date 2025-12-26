export enum VoucherType {
  UNPAID = "UNPAID",
  PAID = "PAID",
  ALL = "ALL",
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