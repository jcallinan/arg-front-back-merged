import { Model } from "@sequelize/core";
import { Sequelize } from "@sequelize/core";
import { initializeModel } from "@src/shared/config/model-initializer";
import { checkInquiryLineItemSchema } from "../schemas/schema";
import { CheckInquiryModel } from "./check-inquiry.model";

export class CheckInquiryLineItemModel extends Model {
    public isDeleted!: string;
    public companyNo!: number;
    public vendorNo!: number;
    public voucherNo!: number;
    public detailType!: number;
    public sequenceNo!: number;
    public detailLineAmount!: number;
    public detailLineDiscount!: number;
    public partialPaidToDate!: number;
    public detailLineDescription!: string;
    public expenseGLAccount!: number;
    public filler1!: string;
    public expenseCompanyGL!: number;
    public lastPaidDateYYMMDD!: number;
    public purchaseJournalNo!: string;
    public inventoryItemNo!: string;
    public quantity!: number;
    public filler2!: string;
    public jobNumber!: string;
    public extraJobField!: string;
    public costCode!: string;
    public costType!: string;
    public jobCostQuantity!: number;
    public filler5!: string;
    public gallons!: number;
    public receiptNumber!: number;
    public openClosedStatus!: string;
    public poLineSeqNo!: number;
    public productAmount!: number;
    public freightAmount!: number;
    public filler3!: string;
    public kCompanyNo!: number;
    public kVendorNo!: number;
    public checkNo!: number;
    public kVoucherNo!: number;
    public headerType!: number;
    public sequence001No!: number;
    public cancelledVoucher!: string;
    public paidOnYYMMDD!: number;
    public lastPaidDateYYMMDD_8!: number;
    public paidOnYYMMDD_8!: number;
    public productLocation!: string;
    public productCode!: string;
    public productTank!: string;
    public productContainer!: string;
    public poNumber!: string;
    public filler4!: string;

    static associate() {

        CheckInquiryLineItemModel.belongsTo(CheckInquiryModel, {
            foreignKey: 'vendorNo',
            targetKey: 'vendorNo',
            as: 'checkInquiryLineItems',
        });

    }

}

export function initializeCheckInquiryLineItem(sequelize: Sequelize): void {
    initializeModel(sequelize, CheckInquiryLineItemModel, "CheckInquiryLineItem", checkInquiryLineItemSchema);
}
