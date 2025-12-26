export type getPaymentHistory = {
  companyNo: number,
  vendorNo: number,
  limit: number,
  offset: number,
  page: number,
  startDate?: string,
  invoiceNo?: string,
  checkNo?: number
}

export type getLastPaymentInfo = {
  companyNo: number,
  vendorNo: number,
  startDate?: string,
  invoiceNo?: string,
  checkNo?: number
}

export type lastPaymentInfo = {
  companyNo: number;
  vendorNo: number;
  grossAmount: number;
  lastPaidDate: string | number;
  vendorName: string | null;
  openPayables: number;
}