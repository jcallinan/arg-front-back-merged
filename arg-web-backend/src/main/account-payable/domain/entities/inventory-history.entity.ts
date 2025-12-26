export class InventoryHistory {
  isDeleted!: string;
  companyNo!: number;
  location!: string;
  productCode!: string;
  tank!: string;
  extraKeyField!: string;
  systemDate!: number;
  systemTime!: number;
  transactionType!: string;
  netQuantity!: number;
  netQtyFraction!: number;
  unitOfMeasure!: string;
  datePosted!: number;
  timePosted!: number;
  transactionDate!: number;
  source!: string;
  productGroupCode!: string;
  vendorNo!: number;
  vendorLocation!: number;
  carrierCode!: number;
  additiveCode!: string;
  receiptNo!: number;
  billOfLadingNo!: number;
  truckNo!: number;
  transferLocation!: string;
  transferProductCode!: string;
  transferTank!: string;
  transferExtraKeyField!: string;
  finishedProductCode!: string;
  tankPhysicalInvent!: string;
  orderNumber!: number;
  prevOnHandQtyFraction!: number;
  srnNumber!: number;
  costingType!: string;
  filler2!: string;
  newOnHandQtyFraction!: number;
  keyedUnitOfMeasure!: string;
  nextMonthCode!: string;
  filler1!: string;
  apLastInvoiceDate!: number;
  apLastExpenseGlNo!: number;
  apLastPurchaseJrnl!: number;
  apTotalQuantity!: number;
  apTotalQtyFraction!: number;
  apTotalDollars!: number;
  temperature!: number;
  gravity!: number;
  grossQuantity!: number;
  grossQtyFraction!: number;
  openClosedStatus!: string;
  closedDate!: number;
  accruedGlNo!: number;
  accruedTotalDollars!: number;
  accruedFreightGlNo!: number;
  accruedFreightDollars!: number;
  sortCode!: string;
  invCostUnitCode!: string;
  finprdInvCostUnitCode!: string;
  previousOnHandQty!: number;
  newOnHandQuantity!: number;
  systemDateCYMD!: number;
  datePostedYMD!: number;
  transactionDateCYMD!: number;
  closedDateCYMD!: number;
  transferInOut!: string;
  filler3!: string;
  apLastInvoiceNumber!: string;
  poNumberFromSystem!: number;
  incomeGL!: number;
  expenseGL!: number;
  filler4!: string;

  constructor(partial: Partial<InventoryHistory>) {
    Object.assign(this, partial);
  }

  static create(partial: Partial<InventoryHistory>): InventoryHistory {
    return new InventoryHistory(partial);
  }

  update(partial: Partial<InventoryHistory>): void {
    Object.assign(this, partial);
  }

  markAsDeleted(): void {
    this.isDeleted = "Y";
  }

  isActive(): boolean {
    return this.isDeleted === "N";
  }
}
