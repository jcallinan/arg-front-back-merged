// Voucher Maintenance interfaces
import { VoucherType } from "@src/shared/constants/voucher-type.enum";
import { VoucherMaintenance } from "../entities/voucher-maintenance.entity";
import { VoucherMaintenanceStatusCode } from "@src/shared/constants/voucher-type.enum";
import {
  toDetailResponseArray,
  toResponse,
} from "../../data/mappers/voucher-maintenance.mapper";

// Type for voucher view response
type VoucherViewResponse = {
  headerItems: ReturnType<typeof toResponse>;
  detailItems: ReturnType<typeof toDetailResponseArray>;
};

/**
 * Interface for voucher maintenance repository operations
 */
export interface VoucherMaintenanceInterface {
  /**
   * Find voucher maintenance records with pagination and filtering
   * @param companyNo - Company number to filter by
   * @param filters - Filter criteria for vouchers
   * @param pagination - Pagination and sorting options
   */
  findVouchers(
    companyNo: number,
    vendorNo?: number,
    voucherType?: VoucherType,
    invoiceDate?: string | Date,
    invoiceNo?: string,
    limit?: number,
    offset?: number,
    sortBy?: string,
    sortOrder?: "ASC" | "DESC"
  ): Promise<{ rows: VoucherMaintenance[]; count: number }>;

  findVoucherSummary(
    companyNo?: number,
    vendorNo?: number,
    voucherType?: VoucherType
  ): Promise<
    {
      vendorName: string;
      companyNo: number;
      vendorNo: number;
      lastPaidAmount: number;
      lastPaidDate: string | null;
      openPayables: number;
      openPayablesDate: string | null;
      type: VoucherType;
    }[]
  >;

  /**
   * Find voucher view data based on voucher type, company number, vendor number, and voucher number
   * @param voucherType - Type of voucher (PAID or UNPAID)
   * @param companyNo - Company number
   * @param vendorNo - Vendor number
   * @param voucherNo - Voucher number
   * @returns Voucher view data from appropriate tables (APHSTH/APHSTD for PAID, APOPNH/APOPND for UNPAID)
   */
  findVoucherView(
    voucherType: VoucherType,
    companyNo: number,
    vendorNo: number,
    voucherNo: number
  ): Promise<VoucherViewResponse | null>;

  /**
   * Update voucher status in APOPNH table
   * @param companyNo - Company number
   * @param vendorNo - Vendor number
   * @param voucherNo - Voucher number
   * @param statusCode - Status code to update (OPHALT column)
   * @param statusDescription - Status description to update (OPHDES column)
   * @returns Updated voucher status information
   */
  updateVoucherStatus(
    companyNo: number,
    vendorNo: number,
    voucherNo: number,
    statusCode: VoucherMaintenanceStatusCode,
    statusDescription: string
  ): Promise<{
    companyNo: number;
    vendorNo: number;
    voucherNo: number;
    statusCode: VoucherMaintenanceStatusCode;
    statusDescription: string;
    updatedAt: string;
  } | null>;

  /**
   * Update discount due date and discount amount in APOPNH table
   * @param companyNo - Company number
   * @param vendorNo - Vendor number
   * @param voucherNo - Voucher number
   * @param discountDueDate - Discount due date to update (OPDSDT column)
   * @param discount - Discount amount to update (OPDISC column)
   * @returns Updated voucher discount information
   */
  updateDiscount(
    companyNo: number,
    vendorNo: number,
    voucherNo: number,
    discountDueDate: string,
    discount: number
  ): Promise<{
    companyNo: number;
    vendorNo: number;
    voucherNo: number;
    discountDueDate: string;
    discount: number;
    updatedAt: string;
  } | null>;

  /**
   * Transfer voucher from source tables (APOPNH/APOPND for UNPAID or APHSTH/APHSTD for PAID) to APTRANH/APTRAND
   * @param voucherType - Type of voucher (PAID or UNPAID)
   * @param companyNo - Company number
   * @param vendorNo - Vendor number
   * @param voucherNo - Voucher number
   * @returns Transfer result with source and target table information
   */
  transferVoucher(
    voucherType: VoucherType,
    companyNo: number,
    vendorNo: number,
    voucherNo: number
  ): Promise<{
    companyNo: number;
    vendorNo: number;
    voucherNo: number;
    sourceTable: string;
    targetTable: string;
    transferredAt: string;
    headerRecordId?: number;
    detailRecordIds?: number[];
  } | null>;
}
