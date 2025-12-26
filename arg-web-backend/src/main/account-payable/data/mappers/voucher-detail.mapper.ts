import { VoucherDetail } from "../../domain/entities/voucher.entity";
import { VoucherDetailModel } from "../models/voucher-detail.model";

export function voucherDetailMapper(record: VoucherDetailModel): VoucherDetail {
  if (!record) {
    throw new Error("VoucherDetail record is null or undefined");
  }
  const productAmount = record.productAmount ?? 0;
  const freightAmount = record.freightAmount ?? 0;

  return VoucherDetail.create({
    isDeleted: record.isDeleted?.trim(),
    companyNo: record.companyNo,
    entryNo: record.entryNo,
    entrySequence: record.entrySequence,
    vendorNo: record.vendorNo,
    lineCompanyNo: record.lineCompanyNo,
    lineGlNo: record.lineGlNo,
    lineDesc: record.lineDesc?.trim(),
    lineAmount: productAmount + freightAmount,  // ✅ Apply formula
    // discountAmount: record.discountAmount,
    discountAmount: !record.discountAmount || record.discountAmount == 0 ? 0 : Number(Number(record.discountAmount).toFixed(2)),
    discountPercentage: !record.discountPercentage || record.discountPercentage == 0 ? 0 : record.discountPercentage,
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
    productAmount: productAmount,
    freightAmount: freightAmount,
    poNo: record.poNo?.trim(),
  });
}
