export class CheckInquiryLineItemEntity {
    isDeleted!: string;
    companyNo!: number;
    vendorNo!: number;
    voucherNo!: number;
    detailType!: number;
    sequenceNo!: number;
    detailLineAmount!: number;
    detailLineDiscount!: number;
    partialPaidToDate!: number;
    detailLineDescription!: string;
    expenseGLAccount!: number;
    filler1!: string;
    expenseCompanyGL!: number;
    lastPaidDateYYMMDD!: number;
    purchaseJournalNo!: string;
    inventoryItemNo!: string;
    quantity!: number;
    filler2!: string;
    jobNumber!: string;
    extraJobField!: string;
    costCode!: string;
    costType!: string;
    jobCostQuantity!: number;
    filler5!: string;
    gallons!: number;
    receiptNumber!: number;
    openClosedStatus!: string;
    poLineSeqNo!: number;
    productAmount!: number;
    freightAmount!: number;
    filler3!: string;
    kCompanyNo!: number;
    kVendorNo!: number;
    checkNo!: number;
    kVoucherNo!: number;
    headerType!: number;
    sequence001No!: number;
    cancelledVoucher!: string;
    paidOnYYMMDD!: number;
    lastPaidDateYYMMDD_8!: number;
    paidOnYYMMDD_8!: number;
    productLocation!: string;
    productCode!: string;
    productTank!: string;
    productContainer!: string;
    poNumber!: string;
    filler4!: string;


    constructor(partial: Partial<CheckInquiryLineItemEntity>) {
        Object.assign(this, partial);
    }

    static create(partial: Partial<CheckInquiryLineItemEntity>): CheckInquiryLineItemEntity {
        return new CheckInquiryLineItemEntity(partial);
    }

}
