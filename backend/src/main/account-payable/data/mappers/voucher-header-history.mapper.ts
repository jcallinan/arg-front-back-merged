import { VoucherHistoryHeader } from "../../domain/entities/voucher-history.entity";
import { VoucherHeaderHistoryModel } from "../models/voucher-header-history.model";

export function voucherHeaderHistoryMapper(record: VoucherHeaderHistoryModel): VoucherHistoryHeader {
  if (!record) {
    throw new Error("VoucherHistoryHeader record is null or undefined");
  }

  return VoucherHistoryHeader.create({
    isDeleted: record.isDeleted,
    companyNo: record.companyNo,
    entryNo: record.entryNo,
    entrySequence: record.entrySequence,
    vendorNo: record.vendorNo,
    canceledVoucher: record.canceledVoucher,
    apGlNo: record.apGlNo,
    invoiceDesc: record.invoiceDesc?.trim(),
    invoiceDate: record.invoiceDate,
    dueDate: record.dueDate,
    singleCheck: record.singleCheck?.trim(),
    holdCode: record.holdCode?.trim(),
    holdDesc: record.holdDesc?.trim(),
    prepaidCode: record.prepaidCode?.trim(),
    prepaidCheckNo: record.prepaidCheckNo,
    vendorName: record.vendorName?.trim(),
    vendorAdd1: record.vendorAdd1?.trim(),
    vendorAdd2: record.vendorAdd2?.trim(),
    vendorAdd3: record.vendorAdd3?.trim(),
    vendorAdd4: record.vendorAdd4?.trim(),
    bankGl: record.bankGl,
    invoiceAmount: record.invoiceAmount,
    retentionGl: record.retentionGl,
    retentionPct: record.retentionPct,
    prepaidCheckdate: record.prepaidCheckdate,
    totalFreight: record.totalFreight,
    salesOrderNo: record.salesOrderNo,
    srn: record.srn,
    carrierId: record.carrierId?.trim(),
    vendorPaymentTerms: record.vendorPaymentTerms,
    processType: record.processType?.trim(),
    discountDueDate: record.discountDueDate,
    extendedDiscountDueDate: record.extendedDiscountDueDate,
    invoiceNo: record.invoiceNo?.trim(),
  });
}