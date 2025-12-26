export class BillingControlFile {
  isDeleted!: string;
  companyNo!: number;
  companyName!: string;
  nextOrderNumbe!: number;
  inventoryGl!: number;
  cogsGl!: number;
  freightGl!: number;
  miscGl!: number;
  nextInvoiceNum!: number;
  minOrderAmt!: number;
  salesGl!: number;
  invoicingSytl!: string;
  nextBolNumber!: number;
  nextInvOrderNumber!: number;
  outagePercent!: number;
  nextMemoInvoic!: number;
  cusAgreeMntPw!: string;
  addressLine2!: string;
  addressLine1!: string;
  daysForDupOrderCheck!: number;
  bicuagSequenceNumber!: number;
  rackPricePassword!: string;
  tollingGl!: number;
  collectFreightServiceFee!: number;
  filler!: string;

  constructor(partial: Partial<BillingControlFile>) {
    Object.assign(this, partial);
  }

  static create(partial: Partial<BillingControlFile>): BillingControlFile {
    return new BillingControlFile(partial);
  }

  update(partial: Partial<BillingControlFile>): void {
    Object.assign(this, partial);
  }

  markAsDeleted(): void {
    this.isDeleted = "Y";
  }

  isActive(): boolean {
    return this.isDeleted === "N";
  }
}
