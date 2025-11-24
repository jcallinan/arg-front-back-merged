export class openPayableHistoryVendor {
  isDeleted!: string;
  companyNo!: number;
  vendorNo!: number;
  voucherNo!: number;
  oneTimeVendor!: string;
  sequenceNo!: number;
  vendorName!: string;
  addressLine1!: string;
  addressLine2!: string;
  addressLine3!: string;
  addressLine4!: string;
  filler!: string;
  companyNo1!: number;
  vendorNo1!: number;
  checkNo1!: number;
  voucherNo1!: number;
  header1!: number;
  sequenceNo1!: number;
  cancelledVoucher!: string;
  paidOnYymmdd!: number;
  paidOnYymmdd1!: number;
  filler1!: string;

  constructor(partial: Partial<openPayableHistoryVendor>) {
    Object.assign(this, partial);
  }

  static create(partial: Partial<openPayableHistoryVendor>): openPayableHistoryVendor {
    return new openPayableHistoryVendor(partial);
  }

  update(partial: Partial<openPayableHistoryVendor>): void {
    Object.assign(this, partial);
  }

  markAsDeleted(): void {
    this.isDeleted = "Y";
  }

  isActive(): boolean {
    return this.isDeleted === "N";
  }
}
