import { VoucherHistoryDetail } from "../../domain/entities/voucher-history.entity";
import { VoucherDetailHistoryModel } from "../models/voucher-detail-history.model";

export function voucherDetailHistoryMapper(record: VoucherDetailHistoryModel): VoucherHistoryDetail {
  if (!record) {
    throw new Error("VoucherHistoryDetail record is null or undefined");
  }
  return VoucherHistoryDetail.create({
    isDeleted: record.isDeleted?.trim(),
    companyNo: record.companyNo,
    entryNo: record.entryNo,
    entrySequence: record.entrySequence,
    vendorNo: record.vendorNo,
    lineCompanyNo: record.lineCompanyNo,
    lineGlNo: record.lineGlNo,
    lineDesc: record.lineDesc?.trim(),
    lineAmount: record.lineAmount,
    discountAmount: record.discountAmount,
    discountPercentage: record.discountPercentage,
    inventoryItem: record.inventoryItem?.trim(),
    quantity: record.quantity,
    jobNo: record.jobNo?.trim(),
    jobCostCode: record.jobCostCode?.trim(),
    jobCostType: record.jobCostType?.trim(),
    jobCostQuantity: record.jobCostQuantity,
    gallons: record.gallons,
    receiptNo: record.receiptNo,
    openClosed: record.openClosed?.trim(),
    poLineNo: record.poLineNo,
    productAmount: record.productAmount,
    freightAmount: record.freightAmount,
    poNo: record.poNo?.trim(),
  });
}
