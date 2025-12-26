export class Vendor {
  vendorIsDeleted!: string;
  vendorCompanyNumber!: number;
  vendorNo!: number;
  vendorName!: string;
  vendorAdd1!: string;
  vendorAdd2!: string;
  vendorAdd3!: string;
  vendorAdd4!: string;
  vendorZipCode!: number;
  vendorExtraZip!: number;
  vendorAlphaSortAbbr!: string;
  vendorAreaCode!: number;
  vendorTelephoneNo!: number;
  vendorLastPaymentAmt!: number;
  vendorLastPaymentDate!: number;
  vendorYtdPurchases!: number;
  vendorLastYearPurchases!: number;
  vendorMtdDiscounts!: number;
  vendorYtdDiscounts!: number;
  vendorNameOverflow!: string;
  vendorGalRcptsRequired!: string;
  vendorFiller!: string;
  vendorPreviousBalance!: number;
  vendorMtdPurchases!: number;
  vendorMtdPayments!: number;
  vendorCurrentBalance!: number;
  vendorHoldPaymentsVend!: string;
  vendorSingleCheck!: string;
  vendorThisYrYtdPaid!: number;
  vendorLastYrYtdPaid!: number;
  vendorExpenseGLSub!: number;
  vendorApTermsCode!: number;
  vendorAp1099Code!: string;
  vendorIdNumber!: string;
  vendorFirst1099BoxNumber!: number;
  vendorSecond1099BoxNumber!: number;
  vendorSecond1099BoxAmount!: number;
  vendorLastPaymentDateAlt!: number;
  IdNo1099!: string;
  vendorCarrierId!: string;
  vendorPayeeName1!: string;
  vendorPayeeName2!: string;
  vendorIrsNameControl!: string;
  vendorAdpPayrollId!: number;
  vendorAchClass!: string;
  vendorAchCheckingOrSavings!: string;
  vendorAchBankRoutingCode!: number;
  vendorAchBankAccountNumber!: string;
  vendorFirstName!: string;
  vendorMiddleName!: string;
  vendorBusinessLastName!: string;
  vendorNameSuffix!: string;
  vendorCountryCode!: string;
  vendorCategoryCode!: string;
  vendorFiller2!: string;

  constructor(partial: Partial<Vendor>) {
    Object.assign(this, partial);
  }

  static create(partial: Partial<Vendor>): Vendor {
    return new Vendor(partial);
  }

  update(partial: Partial<Vendor>): void {
    Object.assign(this, partial);
  }

  markAsDeleted(): void {
    this.vendorIsDeleted = "Y";
  }

  isActive(): boolean {
    return this.vendorIsDeleted === "N";
  }
}
