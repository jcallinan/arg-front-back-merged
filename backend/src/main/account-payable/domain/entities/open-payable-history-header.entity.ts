export class openPayableHistoryHeader {
  isDeleted!: string;
  companyNo!: number;
  vendorNo!: number;
  voucherNo!: number;
  header!: number;
  sequenceNo!: number;
  grossAmount!: number;
  discount!: number;
  partialPaidToDate!: number;
  invoiceDescription!: string;
  apGlAccountNo!: number;
  retentionVoucher!: string;
  discountDueDate!: number;
  filler!: string;
  invoiceDate!: number;
  dueDate!: number;
  checkNo!: number;
  prepaidVoucher!: string;
  lastPaidDateYymmdd!: number;
  filler1!: string;
  cashDisbJrnlYymmdd!: number;
  purchJrnlYymmdd!: number;
  purchaseJournalNo!: string;
  holdPaymentVoucher!: string;
  holdDescription!: string;
  singleCheck!: string;
  bankGlNo!: number;
  lastPaymentAmt!: number;
  discountAlreadyTaken!: number;
  discountDueDate8!: number;
  filler2!: string;
  companyNo1!: number;
  vendorNo1!: number;
  checkNo1!: number;
  voucherNo1!: number;
  header1!: number;
  sequenceNo1!: number;
  cancelledVoucher!: string;
  paidOnYymmdd!: number;
  invoiceDate1!: number;
  dueDate1!: number;
  lastPaidDateYymmdd1!: number;
  cashDisbJrnlYymmdd1!: number;
  purchJrnlYymmdd1!: number;
  paidOnYymmdd1!: number;
  freightTotal!: number;
  prodInvVend!: number;
  prodInvInv!: string;
  salesOrder!: number;
  salesSrn!: number;
  filler3!: string;
  apTerms!: number;
  carrierId!: string;
  invoiceNo!: string;
  filler4!: string;

  constructor(partial: Partial< openPayableHistoryHeader>) {
    Object.assign(this, partial);
  }

  static create(partial: Partial< openPayableHistoryHeader>): openPayableHistoryHeader {
    return new openPayableHistoryHeader(partial);
  }

  update(partial: Partial< openPayableHistoryHeader>): void {
    Object.assign(this, partial);
  }

  markAsDeleted(): void {
    this.isDeleted = "Y";
  }

  isActive(): boolean {
    return this.isDeleted === "N";
  }
}
