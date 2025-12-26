import { openPayableHistoryHeader } from "@src/main/account-payable/domain/entities/open-payable-history-header.entity";
import { OpenPayableHistoryHeaderModel } from "../models/open-payable-history-header.model";

/**
 * Maps a PayableHistoryHeaderModel to a PayableHistoryHeader domain entity
 * @param record The database record to map
 * @returns Mapped PayableHistoryHeader entity
 */
export function payableHistoryHeaderMapper(
  record: OpenPayableHistoryHeaderModel
): openPayableHistoryHeader {
  if (!record) {
    throw new Error("PayableHistoryHeader record is required");
  }

  return openPayableHistoryHeader.create({
    isDeleted: record.isDeleted,
    companyNo: record.companyNo,
    vendorNo: record.vendorNo,
    voucherNo: record.voucherNo,
    header: record.Header,
    sequenceNo: record.SequenceNo,
    grossAmount: record.grossAmount,
    discount: record.discount,
    partialPaidToDate: record.partialPaidToDate,
    invoiceDescription: record.invoiceDescription,
    apGlAccountNo: record.apGlAccountNo,
    retentionVoucher: record.RetentionVoucher,
    discountDueDate: record.discountDueDate,
    filler: record.filler,
    invoiceDate: record.invoiceDate,
    dueDate: record.dueDate,
    checkNo: record.checkNo,
    prepaidVoucher: record.PrepaidVoucher,
    filler1: record.filler1,
    lastPaidDateYymmdd: record.lastPaidDateYymmdd,
    filler2: record.filler2,
    cashDisbJrnlYymmdd: record.cashDisbJrnlYymmdd,
    purchJrnlYymmdd: record.purchJrnlYymmdd,
    purchaseJournalNo: record.purchaseJournalNo,
    holdPaymentVoucher: record.HoldPymtVouchr,
    holdDescription: record.HoldDescription,
    singleCheck: record.SingleCheck,
    bankGlNo: record.bankGlNo,
    lastPaymentAmt: record.lastPaymentAmt,
    discountAlreadyTaken: record.discountAlreadyTaken,
    discountDueDate8: record.discountDueDate8,
    filler3: record.filler3,
    companyNo1: record.companyNo1,
    vendorNo1: record.vendorNo1,
    checkNo1: record.checkNo1,
    voucherNo1: record.voucherNo1,
    header1: record.Header1,
    sequenceNo1: record.SequenceNo1,
    cancelledVoucher: record.CancelledVoucher,
    paidOnYymmdd: record.paidOnYymmdd,
    invoiceDate1: record.invoiceDate1,
    dueDate1: record.dueDate1,
    lastPaidDateYymmdd1: record.lastPaidDateYymmdd1,
    cashDisbJrnlYymmdd1: record.cashDisbJrnlYymmdd1,
    purchJrnlYymmdd1: record.purchJrnlYymmdd1,
    paidOnYymmdd1: record.paidOnYymmdd1,
    freightTotal: record.freightTotal,
    prodInvVend: record.prodInvVend,
    prodInvInv: record.prodInvInv,
    salesOrder: record.salesOrder,
    salesSrn: record.salesSrn,
    filler4: record.filler4,
    apTerms: record.apTerms,
    carrierId: record.carrierId,
    invoiceNo: record.invoiceNo,
  });
}
