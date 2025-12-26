/**
 * Represents a complete voucher entity in the domain layer
 * Maps to the combined view of APOPNH (header), APOPNV (vendor), APOPND (details), and APHSTD (history details) tables
 */
export class VoucherMaintenance {
  // ===== HEADER FIELDS =====
  // From APOPNH (Open Payable Header)
  isDeleted!: string; // OPDEL
  companyNo!: number; // OPCONO
  vendorNo!: number; // OPVEND
  voucherNo!: number; // OPVONO
  grossAmount!: number; // OPGRAM
  discountAmount!: number; // OPDISC
  partialPaidToDate!: number; // OPPPTD
  invoiceDescription!: string; // OPINDS
  invoiceNo!: string; // OPINVN
  invoiceDate6?: number; // OPINVD (6-digit date)
  invoiceDate8?: number; // OPINV8 (8-digit date)
  dueDate6?: number; // OPDUED (6-digit date)
  dueDate8?: number; // OPDUE8 (8-digit date)
  discountDueDate6?: number; // OPDSDT (6-digit date)
  discountDueDate8?: number; // OPDSD8 (8-digit date)
  holdPaymentFlag!: string; // OPHALT
  holdDescription?: string; // OPHDES (UNPAID) / OHHDES (PAID)
  prepaidVoucherFlag!: string; // OPPAID
  bankGlNo!: number; // OPBKGL
  lastPaidAmount?: number; // OPLPAM
  lastPaidDate8?: number; // OPLPD8 (8-digit date)
  apGlAccountNo!: number; 
  // From APHSTH (Open Payable History Header) - for PAID vouchers
  checkNo?: number; // OHCKNO
  paidOnYymmdd?: number|string; // OHKYMD
  cancelledVoucher?: string; // OHKCNL
  // From APOPNV (Open Payable Vendor)
  vendorName?: string; // OPVNAM
  vendorAddress1?: string; // OPVAD1
  vendorAddress2?: string; // OPVAD2
  vendorAddress3?: string; // OPVAD3
  vendorAddress4?: string; // OPVAD4

  // ===== DETAIL FIELDS =====
  // From APOPND/APHSTD (Open Payable Details)
  detailType?: number; // For APOPND
  detail?: number; // For APHSTD
  sequenceNo?: number;
  lineDescription?: string;
  expenseGlAccount?: number;
  expenseCompanyNo?: number;
  lastPaidDate6?: number;
  lastPaidDateYymmdd?: number; // For APHSTD
  purchaseJournalNo?: string;
  inventoryItemNo?: string;
  quantity?: number;
  jobNo?: string;
  jobExtraField?: string;
  costCode?: string;
  costType?: string;
  jobCostQuantity?: number;
  purchaseOrderNo?: string;
  receiptNumber?: number;
  poStatus?: string;
  poLineSequenceNo?: number;
  productAmount?: number;
  freightAmount?: number;
  poNumber?: string;
  gallons?: number;

  // Calculated fields
  openAmount!: number;
  paidAmount!: number;
  vendorAddress?: string;
  netAmount?: number;

  constructor(partial: Partial<VoucherMaintenance>) {
    Object.assign(this, partial);

    // Calculate derived fields
    this.openAmount = this.grossAmount - (this.partialPaidToDate || 0);
    this.paidAmount = this.partialPaidToDate || 0;
    this.netAmount = (this.grossAmount || 0) - (this.discountAmount || 0);
    // Format vendor address
    this.vendorAddress = [
      this.vendorAddress1,
      this.vendorAddress2,
      this.vendorAddress3,
      this.vendorAddress4,
    ]
      .filter(Boolean)
      .join(", ");
  }

  /**
   * Factory method to create a new VoucherMaintenance instance
   * @param partial Partial data to initialize the entity
   * @returns A new VoucherMaintenance instance
   */
  static create(partial: Partial<VoucherMaintenance>): VoucherMaintenance {
    return new VoucherMaintenance(partial);
  }

  /**
   * Checks if the voucher is active (not deleted)
   */
  isActive(): boolean {
    return this.isDeleted !== "D";
  }

  /**
   * Gets the appropriate invoice date (prefers 8-digit format if available)
   */
  getInvoiceDate(): number | undefined {
    return this.invoiceDate8 || this.invoiceDate6;
  }

  /**
   * Gets the appropriate due date (prefers 8-digit format if available)
   */
  getDueDate(): number | undefined {
    return this.dueDate8 || this.dueDate6;
  }
}
