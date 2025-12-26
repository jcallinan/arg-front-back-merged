import { Company } from "@src/main/account-payable/domain/entities/company.entity";
import { ReportEntity } from "@src/main/account-payable/domain/entities/report.entity";
import { Vendor } from "@src/main/account-payable/domain/entities/vendor.entity";
import { SpooledMetaDataReportEntity } from "@src/main/account-payable/domain/entities/spooled-meta-data-report.entity";

import { buildFilePath } from "../utils/build-file-path.utils";
import { VENDOR_STATUS, VendorType } from "../constants/constant";
import { getTimestamp, TIMESTAMP_FORMATS } from "../utils/format-date";

export interface DropdownOption {
  id: string;
  value: string;
  label: string;
}

export interface DropdownFormatter<T> {
  format(items: T[]): DropdownOption[];
}

export function formatCompanyDropdown(companies: Company[]): DropdownOption[] {
  return companies.map((company) => ({
    id: company.companyNo.toString(),
    value: company.companyName,
    label: company.companyName,
  }));
}

export function formatProcessTypeDropdown(
  processTypes: {
    id: number;
    value: string;
    label: string;
  }[],
): DropdownOption[] {
  return processTypes.map((processType) => ({
    id: processType.id.toString(),
    value: processType.value,
    label: processType.label,
  }));
}

export function formatVendorDropdown(vendors: Vendor[]): DropdownOption[] {
  return vendors.map((vendor) => ({
    id: vendor.vendorNo.toString(),
    value: vendor.vendorName,
    label: vendor.vendorName,
  }));
}

export function reportTypeFormatter(reportType: ReportEntity[]): DropdownOption[] {
  return reportType.map((report) => ({
    id: report.reportName.trim(),
    value: report.reportName.trim(),
    label: report.friendlyName.trim(),
  }));
}

export function reportsFormatter(rows: SpooledMetaDataReportEntity[]): SpooledMetaDataReportEntity[] {
  const updatedRows = rows.map((row) => ({
    ...row,
    reportDateTime: getTimestamp(TIMESTAMP_FORMATS.SHORT_READABLE, row.reportDateTime),
    filePath: buildFilePath(row.pdfFileName.trim()),
  }));
  return updatedRows

}


export function vendorTypesFormatter(vendorTypes): DropdownOption[] {
  return vendorTypes
    .filter(type => type.vendorHoldPaymentsVend?.trim() !== "")
    .map(type => ({
      id: type.vendorHoldPaymentsVend,
      value: VendorType[type.vendorHoldPaymentsVend] ?? '',
      label: VendorType[type.vendorHoldPaymentsVend] ?? '',
    }));
}


export function vendorOwnerFormatter(vendorDetails) {
  return vendorDetails
    .filter(vendor => vendor.vendorOwnerDetails.length > 0) // skip empty ownerDetails
    .flatMap(vendor =>
      vendor.vendorOwnerDetails.map(owner => ({
        ownerNo: owner.ownerNo,
        vendorNo: owner.vendorNo,
        isDeleted: VENDOR_STATUS[owner.isDeleted] ?? '',
        vendorName: vendor.vendorName.trim(),
      }))
    );
}


export function OwnerNoFormatter(vendorDetails) {

  return vendorDetails.map(vendorOwnerDetails => ({
    id: vendorOwnerDetails.ownerNo,
    value: vendorOwnerDetails.ownerNo,
    label: vendorOwnerDetails.ownerNo,
  }));
}