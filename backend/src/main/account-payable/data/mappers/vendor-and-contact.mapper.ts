import { VendorModel } from "../models/vendor.model";
import { Vendor } from "../../domain/entities/vendor.entity";
import { VendorContactDetailEntity } from "../../domain/entities/vendor-contact-detail.entity";
import { vendorMapper } from "./vendor.mappers";
import { vendorContactDetailMapper } from "./vendor-contact-detail.mapper";

export function vendorWithContactDetailsMapper(record: VendorModel & { vendorContactDetails?: any[] }): {
  vendor: Vendor;
  vendorContactDetails: VendorContactDetailEntity[];
} {
  if (!record) {
    throw new Error("Vendor record is null or undefined");
  }

  const vendor = vendorMapper(record);
  const vendorContactDetails = (record.vendorContactDetails || []).map(vendorContactDetailMapper);

  return {
    vendor,
    vendorContactDetails,
  };
}
