import { openPayableHistoryDetail } from "@src/main/account-payable/domain/entities/open-payable-history-detail.entity";
import { OpenPayableHistoryDetailModel } from "../models/open-payable-history-detail.model";

/**
 * Maps a PayableHistoryDetailModel to a PayableHistoryDetail domain entity
 * @param record The database record to map
 * @returns Mapped PayableHistoryDetail entity
 */
export function payableHistoryDetailMapper(
  record: OpenPayableHistoryDetailModel
): openPayableHistoryDetail {
  if (!record) {
    throw new Error("PayableHistoryDetail record is required");
  }

  return openPayableHistoryDetail.create({
    // Map all properties from model to entity
    isDeleted: record.isDeleted,
    companyNo: record.companyNo,
    vendorNo: record.vendorNo,
    voucherNo: record.voucherNo,
    detail: record.detail,
    sequenceNo: record.sequenceNo,
    detailLineAmount: record.detailLineAmount,
    detailLineDiscount: record.detailLineDiscount,
    partialPaidToDate: record.partialPaidToDate,
    detailLineDescript: record.detailLineDescript,
    expenseGlAccount: record.expenseGlAccount,
    filler: record.filler,
    expCoForGl: record.expCoForGl,
    lastPaidDateYymmdd: record.lastPaidDateYymmdd,
    purchaseJournalNo: record.purchaseJournalNo,
    inventoryItemNo: record.inventoryItemNo,
    quantity: record.quantity,
    filler1: record.filler1,
    jobNumber: record.jobNumber,
    extraJobField: record.extraJobField,
    costCode: record.costCode,
    costType: record.costType,
    jobCostQuantity: record.jobCostQuantity,
    filler2: record.filler2,
    gallons: record.gallons,
    receiptNumber: record.receiptNumber,
    openClosedStatus: record.openClosedStatus,
    poLineSeqNo: record.poLineSeqNo,
    productAmount: record.productAmount,
    freightAmount: record.freightAmount,
    filler3: record.filler3,
    companyNo1: record.companyNo1,
    vendorNo1: record.vendorNo1,
    checkNo1: record.checkNo1,
    voucherNo1: record.voucherNo1,
    header1: record.Header1,
    sequenceNo1: record.SequenceNo1,
    cancelledVoucher: record.CancelledVoucher,
    paidOnYymmdd: record.paidOnYymmdd,
    lastPaidDateYymmdd1: record.lastPaidDateYymmdd1,
    paidOnYymmdd1: record.paidOnYymmdd1,
    // productLoctaion: record.productLocation,
    // productCode: record.productCode,
    // productTank: record.productTank,
    // productContainer: record.productContainer,
    poNo: record.poNo,
    filler4: record.filler4,
  });
}
