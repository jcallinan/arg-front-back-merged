export class CheckInquiryVoucherDetailEntity {
    isDeleted!: string;
    companyNo!: number;
    vendorNo!: number;
    voucherNo!: number;
    header!: number;
    sequenceNo!: number;
    grossAmount!: number;
    discount!: number;
    partialPaidToDate!: number;
    invoiceDescription!: string;
    apGLAccountNo!: number;
    retentionVoucher!: string;
    discountDueDate!: number;
    invoiceDate!: number;
    dueDate!: number;
    checkNo!: number;
    prepaidVoucher!: string;
    lastPaidDate!: number;
    cashDisbursedDate!: number;
    purchaseJournalDate!: number;
    purchaseJournalNo!: string;
    heldPaymentVoucher!: string;
    heldDescription!: string;
    singleCheck!: string;
    bankGLNo!: number;
    paidAmount!: number;
    discountTaken!: number;
    discountDueDate8!: number;
    kCompanyNo!: number;
    kVendorNo!: number;
    kCheckNo!: number;
    kVoucherNo!: number;
    kHeader!: number;
    kSequenceNo!: number;
    cancelledVoucher!: string;
    paidOn!: number;
    invoiceDate8!: number;
    dueDate8!: number;
    lastPaidDate8!: number;
    cashDisbursedDate8!: number;
    purchaseJournalDate8!: number;
    paidOn8!: number;
    freightTotal!: number;
    prodInvVendorNo!: number;
    prodInvInvoiceNo!: string;
    salesOrderNo!: number;
    salesSRNNo!: number;
    apTerms!: number;
    carrierId!: string;
    invoiceNo!: string;


    constructor(partial: Partial<CheckInquiryVoucherDetailEntity>) {
        Object.assign(this, partial);
    }

    static create(partial: Partial<CheckInquiryVoucherDetailEntity>): CheckInquiryVoucherDetailEntity {
        return new CheckInquiryVoucherDetailEntity(partial);
    }

}
