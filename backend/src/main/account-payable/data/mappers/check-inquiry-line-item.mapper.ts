import { CheckInquiryLineItemEntity } from "../../domain/entities/check-inquiry-line-item.entity";
import { CheckInquiryLineItemModel } from "../models/check-inquiry-line-item.model";

export class checkInquiryLineItemMapper {
    static toResponse(entity: CheckInquiryLineItemModel): CheckInquiryLineItemEntity {
        if (!entity) {
            throw new Error("checkInquiryLineItemMapper record is null or undefined");
        }

        return {
            isDeleted: entity.isDeleted?.trim(),
            companyNo: entity.companyNo,
            vendorNo: entity.vendorNo,
            voucherNo: entity.voucherNo,
            detailType: entity.detailType,
            sequenceNo: entity.sequenceNo,
            detailLineAmount: entity.detailLineAmount,
            detailLineDiscount: entity.detailLineDiscount,
            partialPaidToDate: entity.partialPaidToDate,
            detailLineDescription: entity.detailLineDescription?.trim(),
            expenseGLAccount: entity.expenseGLAccount,
            filler1: entity.filler1?.trim(),
            expenseCompanyGL: entity.expenseCompanyGL,
            lastPaidDateYYMMDD: entity.lastPaidDateYYMMDD,
            purchaseJournalNo: entity.purchaseJournalNo?.trim(),
            inventoryItemNo: entity.inventoryItemNo?.trim(),
            quantity: entity.quantity,
            filler2: entity.filler2?.trim(),
            jobNumber: entity.jobNumber?.trim(),
            extraJobField: entity.extraJobField?.trim(),
            costCode: entity.costCode?.trim(),
            costType: entity.costType?.trim(),
            jobCostQuantity: entity.jobCostQuantity,
            filler5: entity.filler5?.trim(),
            gallons: entity.gallons,
            receiptNumber: entity.receiptNumber,
            openClosedStatus: entity.openClosedStatus?.trim(),
            poLineSeqNo: entity.poLineSeqNo,
            productAmount: entity.productAmount,
            freightAmount: entity.freightAmount,
            filler3: entity.filler3?.trim(),
            kCompanyNo: entity.kCompanyNo,
            kVendorNo: entity.kVendorNo,
            checkNo: entity.checkNo,
            kVoucherNo: entity.kVoucherNo,
            headerType: entity.headerType,
            sequence001No: entity.sequence001No,
            cancelledVoucher: entity.cancelledVoucher?.trim(),
            paidOnYYMMDD: entity.paidOnYYMMDD,
            lastPaidDateYYMMDD_8: entity.lastPaidDateYYMMDD_8,
            paidOnYYMMDD_8: entity.paidOnYYMMDD_8,
            productLocation: entity.productLocation?.trim(),
            productCode: entity.productCode?.trim(),
            productTank: entity.productTank?.trim(),
            productContainer: entity.productContainer?.trim(),
            poNumber: entity.poNumber?.trim(),
            filler4: entity.filler4?.trim(),
        };

    }
}
