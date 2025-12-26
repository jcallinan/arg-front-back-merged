import { Model } from "@sequelize/core";
import { Sequelize } from "@sequelize/core";
import { openPayableHistoryDetailSchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";

export class OpenPayableHistoryDetailModel extends Model {
  public isDeleted!: string;
  public companyNo!: number;
  public vendorNo!: number;
  public voucherNo!: number;
  public detail!: number;
  public sequenceNo!: number;
  public detailLineAmount!: number;
  public detailLineDiscount!: number;
  public partialPaidToDate!: number;
  public detailLineDescript!: string;
  public expenseGlAccount!: number;
  public filler!: string;
  public expCoForGl!: number;
  public lastPaidDateYymmdd!: number;
  public purchaseJournalNo!: string;
  public inventoryItemNo!: string;
  public quantity!: number;
  public filler1!: string;
  public jobNumber!: string;
  public extraJobField!: string;
  public costCode!: string;
  public costType!: string;
  public jobCostQuantity!: number;
  public filler2!: string;
  public gallons!: number;
  public receiptNumber!: number;
  public openClosedStatus!: string;
  public poLineSeqNo!: number;
  public productAmount!: number;
  public freightAmount!: number;
  public filler3!: string;
  public companyNo1!: number;
  public vendorNo1!: number;
  public checkNo1!: number;
  public voucherNo1!: number;
  public Header1!: number;
  public SequenceNo1!: number;
  public CancelledVoucher!: string;
  public paidOnYymmdd!: number;
  public lastPaidDateYymmdd1!: number;
  public paidOnYymmdd1!: number;
  public poNo!: string;
  public filler4!: string;
}

export function initializeOpenPayableHistoryDetail(sequelize: Sequelize): void {
  initializeModel(
    sequelize,
    OpenPayableHistoryDetailModel,
    "OpenPayableHistoryDetail",
    openPayableHistoryDetailSchema
  );
}
