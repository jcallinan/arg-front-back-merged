export class VendorMasterAdditional {
  isDeleted!: string;
  companyNo!: number;
  vendorNo!: number;
  vendorName!: string;
  addressLine1!: string;
  addressLine2!: string;
  addressLine3!: string;
  addressLine4!: string;
  zipCode!: number;
  extraZip!: number;
  alphaSortAbbr!: string;
  areaCode!: number;
  telephoneNo!: number;
  lastPaymntAmt!: number;
  lastPaymntDate!: number;
  ytdPurchases!: number;
  lstYrPurchases!: number;
  mtdDiscounts!: number;
  ytdDiscounts!: number;
  nameOverflow!: string;
  galRcptsRequired!: string;
  filler1!: string;
  previousBalance!: number;
  mtdPurchases!: number;
  mtdPayments!: number;
  currentBalance!: number;
  hHoldPmtsVend!: string;
  sEaVoSnglChk!: string;
  thisYrYtdPaid!: number;
  lastYrYtdPaid!: number;
  expenseGlSub!: number;
  apTermsCode!: number;
  ap1099Code!: string;
  IdNo1099!: string;
  BoxNumber1st1099!: number;
  BoxNumber2nd1099!: number;
  BoxAmount2nd1099!: number;
  lastPaymntDate8!: number;
  carrierId!: string;
  payeeName1!: string;
  payeeName2!: string;
  irsNameControl!: string;
  adpPayrollId!: number;
  achClass!: string;
  achCheckingOrSavings!: string;
  achBankRoutingCode!: number;
  achBankAccountNumber!: string;
  firstName!: string;
  middleName!: string;
  businessLastName!: string;
  nameSuffix!: string;
  countryCode!: string;
  categoryCode!: string;
  filler3!: string;

  constructor(partial: Partial<VendorMasterAdditional>) {
    Object.assign(this, partial);
  }

  static create(partial: Partial<VendorMasterAdditional>): VendorMasterAdditional {
    return new VendorMasterAdditional(partial);
  }

  update(partial: Partial<VendorMasterAdditional>): void {
    Object.assign(this, partial);
  }

  markAsDeleted(): void {
    this.isDeleted = "Y";
  }

  isActive(): boolean {
    return this.isDeleted === "N";
  }
}
