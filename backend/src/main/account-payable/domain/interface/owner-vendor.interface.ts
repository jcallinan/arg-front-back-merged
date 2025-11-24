import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import { OwnerVendorEntity } from "../entities/owner-vendor.entity";
import { vendorOwnerListType } from "@src/types/vendor-management-types";

export interface OwnerVendorInterface {
  findActiveByOwnerNo(ownerNo: number): Promise<OwnerVendorEntity | null>;

  findAndCountAll(
    data: vendorOwnerListType,
  ): Promise<PaginatedResponse<{
    items: OwnerVendorEntity[];
    total_items: number;
    current_page: number;
    items_per_page: number;
    total_pages: number,
  }>>;

  findOne(
    vendorNo: number,
    ownerNo: number
  ): Promise<OwnerVendorEntity | null>

  createOrUpdateOwner(
    ownerNo: number,
    vendorNo: number,
    isDeleted: string
  ): Promise<{ message: string }>;
}
