import type { AccountPayable } from "@api/api-schema/api";

export type Company = NonNullable<
   AccountPayable.GetCompanies.ResponseBody["items"]
>[number];

export type Process = NonNullable<
   AccountPayable.GetProcessTypes.ResponseBody["items"]
>[number];

export type Vendor = NonNullable<
   AccountPayable.GetAllVendors.ResponseBody["items"]
>[number];

export type VendorById = NonNullable<
   AccountPayable.GetVendorById.ResponseBody["items"]
>[number];

export type VoucherEntryType = NonNullable<
   AccountPayable.GetVoucherEntry.ResponseBody["items"]
>[];
 
export type GetConfigType = NonNullable<
   AccountPayable.GetVoucherConfig.ResponseBody["items"]
>[];