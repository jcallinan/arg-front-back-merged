export class Clearchecks {
  dORV!: string;
  companyNo!: number;
  bankGlNumber!: number;
  checkNumber!: number;
  vendorNo!: number;
  checkAmount!: number;
  checkDate!: number;
  clearDate!: number;
  vendorName!: string;
  checkDate1!: number;
  clearDate1!: number;
  origChkAmt!: number;
  filler!: string;

  constructor(partial: Partial<Clearchecks>) {
    Object.assign(this, partial);
  }

  static create(partial: Partial<Clearchecks>): Clearchecks {
    return new Clearchecks(partial);
  }

  update(partial: Partial<Clearchecks>): void {
    Object.assign(this, partial);
  }


}
