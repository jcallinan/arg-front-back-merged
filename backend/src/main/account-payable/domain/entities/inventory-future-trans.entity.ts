export class InventoryFutureTrans {
  isDeleted!: string;
  sequenceNo!: number;
  companyNo!: number;
  location!: string;
  productCode!: string;
  tank!: string;
  extraKeyField!: string;
  transactionType!: string;
  netQuantity!: number;
  netQtyFraction!: number;
  temperature!: number;
  gravity!: number;
  unitOfMeasure!: string;
  transactionDate!: number;
  source!: string;
  vendorNo!: number;
  vendorLocation!: number;
  carrierCode!: number;
  additiveCode!: string;
  receiptNo!: number;
  billOfLading!: number;
  truckNo!: number;
  customerNumber!: number;
  srnNumber!: number;
  apLastInvNumber!: number;
  apLastInvDate!: number;
  apLastExpenseGL!: number;
  apLastPurchaseJournal!: number;
  apTotalQuantity!: number;
  closedDateYMD!: number;
  closedDateCYMD!: number;
  poNumber!: number;
  reversingEntry!: string;
  costingType!: string;
  incomeGL!: number;
  expenseGL!: number;
  filler1!: string;
  filler2!: string;
  filler3!: string;

  constructor(partial: Partial<InventoryFutureTrans>) {
    Object.assign(this, partial);
  }

  static create(partial: Partial<InventoryFutureTrans>): InventoryFutureTrans {
    return new InventoryFutureTrans(partial);
  }

  update(partial: Partial<InventoryFutureTrans>): void {
    Object.assign(this, partial);
  }

  markAsDeleted(): void {
    this.isDeleted = "Y";
  }

  isActive(): boolean {
    return this.isDeleted === "N";
  }
}
