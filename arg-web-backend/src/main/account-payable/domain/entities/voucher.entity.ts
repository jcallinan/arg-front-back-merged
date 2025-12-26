export class VoucherDetail {
  isDeleted!: string;
  companyNo!: number;
  entryNo!: number;
  entrySequence!: number;
  vendorNo!: number;
  lineCompanyNo!: number;
  lineGlNo!: number;
  lineDesc!: string;
  lineAmount!: number;
  discountAmount!: number;
  discountPercentage!: number;
  inventoryItem!: string;
  quantity!: number;
  jobNo!: string;
  jobCostCode!: string;
  jobCostType!: string;
  jobCostQuantity!: number;
  gallons!: number;
  receiptNo!: number;
  openClosed!: string;
  poLineNo!: number;
  productAmount!: number;
  freightAmount!: number;
  poNo!: string;
  status!: string;
  description?: string;
  userProfile!: string;
  userInitials!: string;
  createDate!: number;
  updateDate!: number;

  constructor(partial: Partial<VoucherDetail>) {
    Object.assign(this, partial);
  }

  static create(partial: Partial<VoucherDetail>): VoucherDetail {
    return new VoucherDetail(partial);
  }

  update(partial: Partial<VoucherDetail>): void {
    Object.assign(this, partial);
  }

  markAsDeleted(): void {
    this.isDeleted = "Y";
  }

  isActive(): boolean {
    return this.isDeleted === "N";
  }

  //  NEW: Add calculated field
  get calculatedLineAmount(): number {
    return (this.productAmount ?? 0) + (this.freightAmount ?? 0);
  }
  
  //  NEW: Add validation method
  validateFreightFormulas(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const calculatedAmount = this.calculatedLineAmount;
    const diff = Math.abs(this.lineAmount - calculatedAmount);
    
    if (diff > 0.01) {
      errors.push(
        `Line amount (${this.lineAmount}) does not equal product amount (${this.productAmount}) + freight amount (${this.freightAmount})`
      );
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export class VoucherHeader {
  isDeleted!: string;
  companyNo!: number;
  entryNo!: number;
  entrySequence!: number;
  vendorNo!: number;
  canceledVoucher!: number;
  apGlNo!: number;
  invoiceDesc!: string;
  invoiceDate!: number | string;
  dueDate!: number | string;
  extendedInvoiceDate!: number | string;
  extendedDueDate!: number | string;
  singleCheck!: string;
  holdCode!: string;
  holdDesc!: string;
  prepaidCode!: string;
  prepaidCheckNo!: number;
  vendorName!: string;
  vendorAdd1!: string;
  vendorAdd2!: string;
  vendorAdd3!: string;
  vendorAdd4!: string;
  bankGl!: number;
  invoiceAmount!: number;
  retentionGl!: number;
  retentionPct!: number;
  prepaidCheckdate!: number | string;
  prepaidCheckdate8!: number | string;
  totalFreight!: number;
  salesOrderNo!: number;
  srn!: number;
  carrierId!: string;
  vendorPaymentTerms!: number;
  processType!: string;
  discountDueDate!: number | string;
  extendedDiscountDueDate!: number;
  invoiceNo!: string;
  status!: string;
  companyBankGlDesc?: string;
  companyApGlDesc?: string;
  userProfile!: string;
  userInitials!: string;
  createDate!: number;
  updateDate!: number;
  fillerOne!: string;
  fillerTwo!: string;
  discountAmount?: number;

  constructor(partial: Partial<VoucherHeader>) {
    Object.assign(this, partial);
  }

  static create(partial: Partial<VoucherHeader>): VoucherHeader {
    return new VoucherHeader(partial);
  }

  update(partial: Partial<VoucherHeader>): void {
    Object.assign(this, partial);
  }

  markAsDeleted(): void {
    this.isDeleted = "Y";
  }

  isActive(): boolean {
    return this.isDeleted === "N";
  }
}
