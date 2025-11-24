import { OwnerVendorEntity } from "../../domain/entities/owner-vendor.entity";
import { OwnerVendorReferenceModel } from "../models/owner-vendor-reference.model";

// ModelToEntity
export function ownerVendorMapper(
  record: OwnerVendorReferenceModel,
): OwnerVendorEntity {
  if (!record) {
    throw new Error("OwnerVendor record is null or undefined");
  }
  return OwnerVendorEntity.create({
    ownerNo: record.ownerNo,
    vendorNo: record.vendorNo,
    isDeleted: record.isDeleted,
    filler: record.filler,
  });
}
