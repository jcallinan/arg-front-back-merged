import { Model } from "@sequelize/core";
import { Sequelize } from "@sequelize/core";
import { checkInquirySchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";
import { CheckInquiryHistoryModel } from "./check-inquiry-history.model";
import { CheckInquiryVoucherDetailModel } from "./check-inquiry-voucher-detail.model";
import { CheckInquiryLineItemModel } from "./check-inquiry-line-item.model";

export class CheckInquiryModel extends Model {
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
  public invoiceNo!: string;

  static associate() {
    CheckInquiryModel.hasOne(CheckInquiryHistoryModel, {
      foreignKey: 'bankGLNo',
      sourceKey: 'bankGLNo',
      as: 'bankGLNumber',
    });

    CheckInquiryModel.hasOne(CheckInquiryVoucherDetailModel, {
      foreignKey: 'checkNo',
      sourceKey: 'checkNo',
      as: 'voucherDetails',
    });

    CheckInquiryModel.hasMany(CheckInquiryLineItemModel, {
      foreignKey: 'voucherNo',
      sourceKey: 'voucherNo',
      as: 'lineItem',
    });
  }
}

export function initializeCheckInquiry(sequelize: Sequelize): void {
  initializeModel(
    sequelize,
    CheckInquiryModel,
    "CheckInquiry",
    checkInquirySchema
  );

}


