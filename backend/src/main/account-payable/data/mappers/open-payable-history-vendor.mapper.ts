import { openPayableHistoryVendor } from "@src/main/account-payable/domain/entities/open-payable-history-vendor.entity";
import { OpenPayableHistoryVendorModel } from "../models/open-payable-history-vendor.model";

/**
 * Maps a PayableHistoryVendorModel to a PayableHistoryVendor domain entity
 * @param record The database record to map
 * @returns Mapped PayableHistoryVendor entity
 */
export function payableHistoryVendorMapper(
  record: OpenPayableHistoryVendorModel
): openPayableHistoryVendor {
  if (!record) {
    throw new Error("PayableHistoryVendor record is required");
  }

  return openPayableHistoryVendor.create({
    // Map all properties from model to entity
    isDeleted: record.isDeleted,
    companyNo: record.companyNo,
    vendorNo: record.vendorNo,
    voucherNo: record.voucherNo,
    oneTimeVendor: record.oneTimeVendor.toString(),
    sequenceNo: record.sequenceNo,
    vendorName: record.vendorName,
    addressLine1: record.addressLine1,
    addressLine2: record.addressLine2,
    addressLine3: record.addressLine3,
    addressLine4: record.addressLine4,
    filler: record.filler,
    companyNo1: record.companyNo1,
    vendorNo1: record.vendorNo1,
    checkNo1: record.checkNo1,
    voucherNo1: record.voucherNo1,
    header1: record.Header1,
    sequenceNo1: record.SequenceNo1,
    cancelledVoucher: record.CancelledVoucher,
    paidOnYymmdd: record.paidOnYymmdd,
    paidOnYymmdd1: record.paidOnYymmdd1,
    filler1: record.filler1,
  });
}
