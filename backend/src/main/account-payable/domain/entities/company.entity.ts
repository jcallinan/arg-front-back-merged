export class Company {
  companyNo!: number;
  companyName!: string;
  companyApGlNo!: number;
  companyBankGlNo!: number;
  companyDiscountsGlNo!: number;
  companyIntercoGlNo!: number;
  companyNextPjJrnlNo!: number;
  companyNextCdJrnlNo!: number;
  companyNextCheckNo!: number;
  companyNextEntryNo!: number;
  companyNextVoucherNo!: number;
  companyPreEdChks!: string;
  companyJobCostAct!: string;
  companyRetentionGlNo!: number;
  companyPoActive!: string;
  companyEmployeeExpenseGlNo!: number;
  companyNextEeJrnlNo!: number;
  companyVendorNextEntryNo!: number;
  company99Name!: string;
  company99Address1!: string;
  company99Address2!: string;
  company99StateZip!: string;
  company99EinNumber!: string;
  company99EmployeeName!: string;
  company99Phone!: string;
  companyFiller!: string;
  companyIsDeleted!: string;

  constructor(partial: Partial<Company>) {
    Object.assign(this, partial);
  }

  static create(partial: Partial<Company>): Company {
    return new Company(partial);
  }

  update(partial: Partial<Company>): void {
    Object.assign(this, partial);
  }

  markAsDeleted(): void {
    this.companyIsDeleted = "Y";
  }

  isActive(): boolean {
    return this.companyIsDeleted === "N";
  }

}
