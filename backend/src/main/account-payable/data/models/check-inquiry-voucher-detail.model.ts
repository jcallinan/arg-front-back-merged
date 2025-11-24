import { Model } from "@sequelize/core";
import { Sequelize } from "@sequelize/core";
import { checkInquiryVoucherDetailSchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";
import { CheckInquiryModel } from "./check-inquiry.model";

export class CheckInquiryVoucherDetailModel extends Model {
    public isDeleted!: string;
    public companyNo!: number;
    public vendorNo!: number;
    public voucherNo!: number;
    public header!: number;
    public sequenceNo!: number;
    public grossAmount!: number;
    public discount!: number;
    public partialPaidToDate!: number;
    public invoiceDescription!: string;
    public apGLAccountNo!: number;
    public retentionVoucher!: string;
    public discountDueDate!: number;
    public invoiceDate!: number;
    public dueDate!: number;
    public checkNo!: number;
    public prepaidVoucher!: string;
    public lastPaidDate!: number;
    public cashDisbursedDate!: number;
    public purchaseJournalDate!: number;
    public purchaseJournalNo!: string;
    public heldPaymentVoucher!: string;
    public heldDescription!: string;
    public singleCheck!: string;
    public bankGLNo!: number;
    public paidAmount!: number;
    public discountTaken!: number;
    public discountDueDate8!: number;
    public kCompanyNo!: number;
    public kVendorNo!: number;
    public kCheckNo!: number;
    public kVoucherNo!: number;
    public kHeader!: number;
    public kSequenceNo!: number;
    public cancelledVoucher!: string;
    public paidOn!: number;
    public invoiceDate8!: number;
    public dueDate8!: number;
    public lastPaidDate8!: number;
    public cashDisbursedDate8!: number;
    public purchaseJournalDate8!: number;
    public paidOn8!: number;
    public freightTotal!: number;
    public prodInvVendorNo!: number;
    public prodInvInvoiceNo!: string;
    public salesOrderNo!: number;
    public salesSRNNo!: number;
    public apTerms!: number;
    public carrierId!: string;
    public invoiceNo!: string;


    static associate() {
        CheckInquiryVoucherDetailModel.belongsTo(CheckInquiryModel, {
            foreignKey: 'voucherNo',
            targetKey: 'voucherNo',
            as: 'voucherDetail',
        });
    }

}

export function initializeCheckInquiryVoucherDetail(sequelize: Sequelize): void {
    initializeModel(sequelize, CheckInquiryVoucherDetailModel, "CheckInquiryVoucherDetail", checkInquiryVoucherDetailSchema);
}
