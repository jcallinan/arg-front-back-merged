import { VoucherHeader } from "@src/main/account-payable/domain/entities/voucher.entity";
import {
  INVOICE_TYPE,
  IsDeletedStatus,
  PROCESS_TYPE_ENUM,
} from "@src/shared/constants/constant";

export interface VoucherHeaderFactoryOptions {
  entryNo?: number;
  companyNo?: number;
  vendorNo?: number;
  invoiceNo?: string;
  invoiceAmount?: number;
  invoiceDate?: number | string;
  processType?: string;
  dueDate?: number | string;
  extendedInvoiceDate?: number | string;
  extendedDueDate?: number | string;
  discountDueDate?: number | string;
  invoiceDesc?: string;
  apGlNo?: number;
  bankGl?: number;
  vendorName?: string;
  vendorAdd1?: string;
  vendorAdd2?: string;
  vendorAdd3?: string;
  vendorAdd4?: string;
  singleCheck?: string;
  holdCode?: string;
  holdDesc?: string;
  prepaidCode?: string;
  prepaidCheckNo?: number;
  retentionGl?: number;
  retentionPct?: number;
  prepaidCheckdate?: number | string;
  totalFreight?: number;
  salesOrderNo?: number;
  srn?: number;
  carrierId?: string;
  vendorPaymentTerms?: number;
  extendedDiscountDueDate?: number;
  status?: string;
  companyBankGlDesc?: string;
  companyApGlDesc?: string;
  userProfile?: string;
  createDate?: number;
  updateDate?: number;
  fillerOne?: string;
  fillerTwo?: string;
  discountAmount?: number;
  canceledVoucher?: number;
  entrySequence?: number;
}

export class VoucherHeaderFactory {
  /**
   * Creates a basic voucher header with default values
   */
  static createBasicVoucherHeader(
    overrides: Partial<VoucherHeaderFactoryOptions> = {}
  ): VoucherHeader {
    const defaultVoucherHeader: Partial<VoucherHeader> = {
      entryNo: 1001,
      entrySequence: 1,
      companyNo: 10,
      vendorNo: 1001,
      canceledVoucher: 0,
      apGlNo: 12010001,
      invoiceDesc: "Test Invoice",
      invoiceNo: "INV001",
      invoiceAmount: 1000.0,
      invoiceDate: 20240101,
      processType: PROCESS_TYPE_ENUM.NORMAL,
      dueDate: 20240201,
      extendedInvoiceDate: 20240101,
      extendedDueDate: 20240201,
      discountDueDate: 20240115,
      singleCheck: "N",
      holdCode: "N",
      holdDesc: "No Hold",
      prepaidCode: "N",
      prepaidCheckNo: 0,
      vendorName: "Test Vendor",
      vendorAdd1: "123 Test St",
      vendorAdd2: "Suite 100",
      vendorAdd3: "Test City",
      vendorAdd4: "12345",
      bankGl: 10010001,
      retentionGl: 0,
      retentionPct: 0,
      prepaidCheckdate: 0,
      totalFreight: 0,
      salesOrderNo: 0,
      srn: 0,
      carrierId: "",
      vendorPaymentTerms: 30,
      extendedDiscountDueDate: 0,
      status: INVOICE_TYPE.S,
      companyBankGlDesc: "Bank GL Description",
      companyApGlDesc: "AP GL Description",
      userProfile: "TEST_USER",
      createDate: 20240101,
      updateDate: 20240101,
      fillerOne: "",
      fillerTwo: "",
      discountAmount: 0,
      isDeleted: IsDeletedStatus.ACTIVE,
    };

    return VoucherHeader.create({ ...defaultVoucherHeader, ...overrides });
  }

  /**
   * Creates a flexi voucher header
   */
  static createFlexiVoucherHeader(
    overrides: Partial<VoucherHeaderFactoryOptions> = {}
  ): VoucherHeader {
    return this.createBasicVoucherHeader({
      processType: PROCESS_TYPE_ENUM.FLEXI,
      invoiceDesc: "Flexi Voucher",
      ...overrides,
    });
  }

  /**
   * Creates a sogas voucher header
   */
  static createSogasVoucherHeader(
    overrides: Partial<VoucherHeaderFactoryOptions> = {}
  ): VoucherHeader {
    return this.createBasicVoucherHeader({
      processType: PROCESS_TYPE_ENUM.SOGAS,
      invoiceDesc: "SOGAS Voucher",
      ...overrides,
    });
  }

  /**
   * Creates a paper voucher header
   */
  static createPaperVoucherHeader(
    overrides: Partial<VoucherHeaderFactoryOptions> = {}
  ): VoucherHeader {
    return this.createBasicVoucherHeader({
      processType: PROCESS_TYPE_ENUM.PAPER,
      invoiceDesc: "Paper Voucher",
      ...overrides,
    });
  }

  /**
   * Creates an LMS voucher header
   */
  static createLmsVoucherHeader(
    overrides: Partial<VoucherHeaderFactoryOptions> = {}
  ): VoucherHeader {
    return this.createBasicVoucherHeader({
      processType: PROCESS_TYPE_ENUM.ARGLMS,
      invoiceDesc: "LMS Voucher",
      ...overrides,
    });
  }

  /**
   * Creates multiple voucher headers with sequential entry numbers
   */
  static createMultipleVoucherHeaders(
    count: number,
    overrides: Partial<VoucherHeaderFactoryOptions> = {}
  ): VoucherHeader[] {
    return Array.from({ length: count }, (_, index) =>
      this.createBasicVoucherHeader({
        ...overrides,
        entryNo: (overrides.entryNo || 1001) + index,
        invoiceNo: `${overrides.invoiceNo || "INV"}${String((overrides.entryNo || 1001) + index).padStart(3, "0")}`,
      })
    );
  }
}
