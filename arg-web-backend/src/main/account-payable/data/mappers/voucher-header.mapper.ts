import { VoucherHeader } from "../../domain/entities/voucher.entity";
import { VoucherHeaderModel } from "../models/voucher-header.model";

export function voucherHeaderMapper(record: VoucherHeaderModel): VoucherHeader {
  if (!record) {
    throw new Error("VoucherHeader record is null or undefined");
  }

  return VoucherHeader.create({
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
    extendedInvoiceDate: record.extendedInvoiceDate ,
    extendedDueDate: record.extendedDueDate ,
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
    prepaidCheckdate8: record.prepaidCheckdate8,
    totalFreight: record.totalFreight,
    salesOrderNo: record.salesOrderNo,
    srn: record.srn,
    carrierId: record.carrierId?.trim(),
    vendorPaymentTerms: record.vendorPaymentTerms,
    processType: record.processType?.trim(),
    discountDueDate: record.discountDueDate,
    extendedDiscountDueDate: record.extendedDiscountDueDate,
    invoiceNo: record.invoiceNo?.trim(),
    fillerOne: record.fillerOne,
    fillerTwo: record.fillerTwo,
    status: record.status,
    discountAmount: (record as any).discountAmount,
  });
}
