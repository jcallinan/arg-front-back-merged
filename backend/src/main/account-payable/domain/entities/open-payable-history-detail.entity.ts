export class openPayableHistoryDetail {
  isDeleted!: string;
  companyNo!: number;
  vendorNo!: number;
  voucherNo!: number;
  detail!: number;
  sequenceNo!: number;
  detailLineAmount!: number;
  detailLineDiscount!: number;
  partialPaidToDate!: number;
  detailLineDescript!: string;
  expenseGlAccount!: number;
  filler!: string;
  expCoForGl!: number;
  lastPaidDateYymmdd!: number;
  purchaseJournalNo!: string;
  inventoryItemNo!: string;
  quantity!: number;
  filler1!: string;
  jobNumber!: string;
  extraJobField!: string;
  costCode!: string;
  costType!: string;
  jobCostQuantity!: number;
  filler2!: string;
  gallons!: number;
  receiptNumber!: number;
  openClosedStatus!: string;
  poLineSeqNo!: number;
  productAmount!: number;
  freightAmount!: number;
  filler3!: string;
  companyNo1!: number;
  vendorNo1!: number;
  checkNo1!: number;
  voucherNo1!: number;
  header1!: number;
  sequenceNo1!: number;
  cancelledVoucher!: string;
  paidOnYymmdd!: number;
  lastPaidDateYymmdd1!: number;
  paidOnYymmdd1!: number;
  productLoctaion!: string;
  productCode!: string;
  productTank!: string;
  productContainer!: string;
  poNo!: string;
  filler4!: string;

  constructor(partial: Partial<openPayableHistoryDetail>) {
    Object.assign(this, partial);
  }

  static create(partial: Partial<openPayableHistoryDetail>): openPayableHistoryDetail {
    return new openPayableHistoryDetail(partial);
  }

  update(partial: Partial<openPayableHistoryDetail>): void {
    Object.assign(this, partial);
  }

  markAsDeleted(): void {
    this.isDeleted = "Y";
  }

  isActive(): boolean {
    return this.isDeleted === "N";
  }
}
