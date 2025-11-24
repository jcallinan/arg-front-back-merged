import { VoucherDetail, VoucherHeader } from "../entities/voucher.entity";
import { Transaction } from "@sequelize/core";
import { VoucherHistoryHeader, VoucherHistoryDetail } from "../entities/voucher-history.entity";

/**
 * Interface for voucher detail repository operations
 * @interface VoucherDetailInterface
 * @description Defines the contract for voucher detail data access operations
 */
export interface VoucherDetailInterface {
  findByEntry(companyNo: number, entryNo?: number, vendorNo?: number): Promise<VoucherDetail[]>;
  // create(data: Partial<VoucherDetail>, transaction?: Transaction): Promise<VoucherDetail>;
  // update(companyNo: number, entryNo: number, data: Partial<VoucherDetail>, transaction?: Transaction): Promise<VoucherDetail>;
  // createMany(data: Partial<VoucherDetail>[], transaction?: Transaction): Promise<VoucherDetail[]>;
  // upsert(data: Partial<VoucherDetail>, transaction?: Transaction): Promise<VoucherDetail>;
  // upsertMany(data: Partial<VoucherDetail>[], transaction?: Transaction): Promise<VoucherDetail[]>;
  // upsertManyWithConflictResolution(data: Partial<VoucherDetail>[], transaction?: Transaction): Promise<VoucherDetail[]>;
  findOne(
    companyNo: string,
    entryNo: string,
    entrySequence: string,
  ): Promise<VoucherDetail | null>;
  create(data: Partial<VoucherDetail[]>): Promise<VoucherDetail[]>;
  createOrUpdate(data: Partial<VoucherDetail[]>): Promise<VoucherDetail[]>;
  hardDelete(entryNo: number, companyNo: number, vendorNo: number): Promise<boolean>;
  softDeleteByEntry(entryNo: number, companyNo: number, vendorNo: number): Promise<number>;
  softDeleteDetail(
    companyNo: number,
    vendorNo: number,
    entryNo: number,
    entrySequence: number
  ): Promise<boolean>;

  /**
   * Delete voucher details by entry numbers
   * @param companyNo Company number
   * @param entryNumbers Array of entry numbers to delete
   * @returns Promise<number> Number of deleted records
   */
  deleteByEntryNumbers(companyNo: number, entryNumbers: number[]): Promise<number>;
}

/**
 * Interface for voucher header repository operations
 * @interface VoucherHeaderInterface
 * @description Defines the contract for voucher header data access operations
 */
export interface VoucherHeaderInterface {
  findOne(companyNo: number, entryNo: number, vendorNo?: number, entrySequence?: number,): Promise<VoucherHeader | null>;
  findAll(data: {
    companyNo: number,
    vendorNo?: number,
    entryNo?: number,
    limit?: number,
    offset?: number,
    sortBy?: string,
    sortOrder?: string,
    invoiceNo?: string,
    processType?: string
  }): Promise<{ rows: VoucherHeader[]; count: number }>;
  findAllWithAllFields(data: {
    companyNo: number,
    vendorNo?: number,
    entryNo?: number,
    limit?: number,
    offset?: number,
    sortBy?: string,
    sortOrder?: string,
    invoiceNo?: string,
    processType?: string
  }, isRequiredDetail?: boolean): Promise<{ rows: VoucherHeader[]; count: number }>;
  create(data: Partial<VoucherHeader>, transaction?: Transaction): Promise<VoucherHeader>;
  startTransaction(): Promise<Transaction>;
  update(
    companyNo: number,
    entryNo: number,
    entrySequence: number,
    data: Partial<VoucherHeader>,
  ): Promise<VoucherHeader>;
  // createOrUpdate(data: Partial<VoucherHeader>, transaction?: Transaction): Promise<VoucherHeader>;
  // upsert(data: Partial<VoucherHeader>, transaction?: Transaction): Promise<VoucherHeader>;
  getTransaction(): Promise<Transaction>;
  /**
   * Soft delete a voucher header by marking it as deleted
   * @param entryNo Entry number to delete
   * @param companyNo Company number
   * @returns Promise<boolean> True if deleted successfully
   */
  softDelete(entryNo: number, companyNo: number, vendorNo: number, invoiceNo: string): Promise<boolean>;

  /**
   * Check if invoice number is duplicate for the given company/vendor combination
   * @param companyNo Company number
   * @param vendorNo Vendor number
   * @param invoiceNo Invoice number
   * @param entryNo Current entry number to exclude from check
   * @returns Promise<boolean> True if duplicate exists
   */
  isDuplicateInvoice(
    companyNo: number,
    vendorNo: number,
    invoiceNo: string,
    entryNo?: number,
  ): Promise<boolean>;

  /**
   * Check for duplicate invoice and return both existence and table information
   * @param companyNo Company number
   * @param vendorNo Vendor number
   * @param invoiceNo Invoice number
   * @param entryNo Current entry number to exclude from check
   * @returns Promise<{isDuplicate: boolean, tableName: string | null}> Object containing duplicate status and table name
   */
  checkDuplicateInvoiceWithTable(
    companyNo: number,
    vendorNo: number,
    invoiceNo: string,
    entryNo?: number,
  ): Promise<{isDuplicate: boolean, tableName: string | null}>;
  getVoucherSummary(companyNo: number, processType: string): Promise<any>;
  hardDelete(invoiceNo: string, entryNo: number, companyNo: number, vendorNo: number): Promise<boolean>;

  /**
   * Get entry numbers from APTRANH where ATPTYP matches the process type
   * @param companyNo Company number
   * @param processType Process type to filter by
   * @returns Promise<number[]> Array of entry numbers
   */
  getEntryNumbersByProcessType(companyNo: number, processType: string): Promise<number[]>;

  /**
   * Delete voucher headers by process type
   * @param companyNo Company number
   * @param processType Process type to delete
   * @returns Promise<number> Number of deleted records
   */
  deleteByProcessType(companyNo: number, processType: string): Promise<number>;
}
export interface VoucherHeaderHistoryInterface {
  create(data: Partial<VoucherHistoryHeader>, transaction?: Transaction): Promise<VoucherHistoryHeader>;
}
export interface VoucherDetailHistoryInterface {
  create(data: Partial<VoucherHistoryDetail[]>, transaction?: Transaction): Promise<VoucherHistoryDetail[]>;
}