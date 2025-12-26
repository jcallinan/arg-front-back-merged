export class VoucherHistoryDetail {
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
    description? : string;
    userProfile!: string;
    userInitials!: string;
    status!: string;
    createDate!: number;
    updateDate!: number;
  
    constructor(partial: Partial<VoucherHistoryDetail>) {
      Object.assign(this, partial);
    }
  
    static create(partial: Partial<VoucherHistoryDetail>): VoucherHistoryDetail {
      return new VoucherHistoryDetail(partial);
    }
  
    update(partial: Partial<VoucherHistoryDetail>): void {
      Object.assign(this, partial);
    }
  
    markAsDeleted(): void {
      this.isDeleted = "Y";
    }
  
    isActive(): boolean {
      return this.isDeleted === "N";
    }
  }
  
  export class VoucherHistoryHeader {
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
    companyBankGlDesc?: string;
    companyApGlDesc?: string;
    userProfile!: string;
    userInitials!: string;
    status!: string;
    createDate!: number;
    updateDate!: number;
  
    constructor(partial: Partial<VoucherHistoryHeader>) {
      Object.assign(this, partial);
    }
  
    static create(partial: Partial<VoucherHistoryHeader>): VoucherHistoryHeader {
      return new VoucherHistoryHeader(partial);
    }
  
    update(partial: Partial<VoucherHistoryHeader>): void {
      Object.assign(this, partial);
    }
  
    markAsDeleted(): void {
      this.isDeleted = "Y";
    }
  
    isActive(): boolean {
      return this.isDeleted === "N";
    }
  }