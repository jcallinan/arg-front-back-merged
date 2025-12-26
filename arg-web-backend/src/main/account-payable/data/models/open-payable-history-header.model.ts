import { Model } from "@sequelize/core";
import { Sequelize } from "@sequelize/core";
import { openPayableHistoryHeaderSchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";

export class OpenPayableHistoryHeaderModel extends Model {
  public isDeleted!: string;
  public companyNo!: number;
  public vendorNo!: number;
  public voucherNo!: number;
  public Header!: number;
  public SequenceNo!: number;
  public grossAmount!: number;
  public discount!: number;
  public partialPaidToDate!: number;
  public invoiceDescription!: string;
  public apGlAccountNo!: number;
  public RetentionVoucher!: string;
  public discountDueDate!: number;
  public filler!: string;
  public invoiceDate!: number;
  public dueDate!: number;
  public checkNo!: number;
  public PrepaidVoucher!: string;
  public filler1!: string;
  public lastPaidDateYymmdd!: number;
  public filler2!: string;
  public cashDisbJrnlYymmdd!: number;
  public purchJrnlYymmdd!: number;
  public purchaseJournalNo!: string;
  public HoldPymtVouchr!: string;
  public HoldDescription!: string;
  public SingleCheck!: string;
  public bankGlNo!: number;
  public lastPaymentAmt!: number;
  public discountAlreadyTaken!: number;
  public discountDueDate8!: number;
  public filler3!: string;
  public companyNo1!: number;
  public vendorNo1!: number;
  public checkNo1!: number;
  public voucherNo1!: number;
  public Header1!: number;
  public SequenceNo1!: number;
  public CancelledVoucher!: string;
  public paidOnYymmdd!: number;
  public invoiceDate1!: number;
  public dueDate1!: number;
  public lastPaidDateYymmdd1!: number;
  public cashDisbJrnlYymmdd1!: number;
  public purchJrnlYymmdd1!: number;
  public paidOnYymmdd1!: number;
  public freightTotal!: number;
  public prodInvVend!: number;
  public prodInvInv!: string;
  public salesOrder!: number;
  public salesSrn!: number;
  public filler4!: string;
  public apTerms!: number;
  public carrierId!: string;
  public invoiceNo!: string;
  public filler5!: string;
}

export function initializeOpenPayableHistoryHeader(sequelize: Sequelize): void {
  initializeModel(
    sequelize,
    OpenPayableHistoryHeaderModel,
    "OpenPayableHistoryHeader",
    openPayableHistoryHeaderSchema
  );
}
