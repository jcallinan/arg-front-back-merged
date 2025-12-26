import { CheckInquiryVoucherDetailEntity } from "../../domain/entities/check-inquiry-voucher-detail.entity";
import { CheckInquiryVoucherDetailModel } from "../models/check-inquiry-voucher-detail.model";

export class checkInquiryVoucherDetailMapper {

    static toResponse(entity: CheckInquiryVoucherDetailModel): CheckInquiryVoucherDetailEntity {

        if (!entity) {
            throw new Error("CheckInquiryVoucherDetail record is null or undefined");
        }

        return {
            isDeleted: entity.isDeleted?.trim(),
            invoiceDescription: entity.invoiceDescription?.trim(),
            retentionVoucher: entity.retentionVoucher?.trim(),
            prepaidVoucher: entity.prepaidVoucher?.trim(),
            purchaseJournalNo: entity.purchaseJournalNo?.trim(),
            heldPaymentVoucher: entity.heldPaymentVoucher?.trim(),
            heldDescription: entity.heldDescription?.trim(),
            singleCheck: entity.singleCheck?.trim(),
            cancelledVoucher: entity.cancelledVoucher?.trim(),
            prodInvInvoiceNo: entity.prodInvInvoiceNo?.trim(),
            carrierId: entity.carrierId?.trim(),
            invoiceNo: entity.invoiceNo?.trim(),

            companyNo: entity.companyNo,
            vendorNo: entity.vendorNo,
            voucherNo: entity.voucherNo,
            header: entity.header,
            sequenceNo: entity.sequenceNo,
            grossAmount: entity.grossAmount,
            discount: entity.discount,
            partialPaidToDate: entity.partialPaidToDate,
            apGLAccountNo: entity.apGLAccountNo,
            discountDueDate: entity.discountDueDate,
            invoiceDate: entity.invoiceDate,
            dueDate: entity.dueDate,
            checkNo: entity.checkNo,
            lastPaidDate: entity.lastPaidDate,
            cashDisbursedDate: entity.cashDisbursedDate,
            purchaseJournalDate: entity.purchaseJournalDate,
            bankGLNo: entity.bankGLNo,
            paidAmount: entity.paidAmount,
            discountTaken: entity.discountTaken,
            discountDueDate8: entity.discountDueDate8,
            kCompanyNo: entity.kCompanyNo,
            kVendorNo: entity.kVendorNo,
            kCheckNo: entity.kCheckNo,
            kVoucherNo: entity.kVoucherNo,
            kHeader: entity.kHeader,
            kSequenceNo: entity.kSequenceNo,
            paidOn: entity.paidOn,
            invoiceDate8: entity.invoiceDate8,
            dueDate8: entity.dueDate8,
            lastPaidDate8: entity.lastPaidDate8,
            cashDisbursedDate8: entity.cashDisbursedDate8,
            purchaseJournalDate8: entity.purchaseJournalDate8,
            paidOn8: entity.paidOn8,
            freightTotal: entity.freightTotal,
            prodInvVendorNo: entity.prodInvVendorNo,
            salesOrderNo: entity.salesOrderNo,
            salesSRNNo: entity.salesSRNNo,
            apTerms: entity.apTerms,
        };
    }

}