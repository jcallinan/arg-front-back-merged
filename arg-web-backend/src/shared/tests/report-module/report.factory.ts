import { PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";

export interface VoucherSummaryFactoryOptions {
  totalVouchers?: number;
  totalAmount?: number;
  averageAmount?: number;
  processType?: PROCESS_TYPE_ENUM;
  companyNo?: number;
}

export interface ReportQueryFactoryOptions {
  companyNo?: number;
  processType?: PROCESS_TYPE_ENUM;
  current_page?: number;
  items_per_page?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface ReportEntryDataFactoryOptions {
  entryNo?: string;
  companyNo?: number;
  processType?: PROCESS_TYPE_ENUM;
  vendorNo?: number;
  amount?: number;
  invoiceNo?: string;
  [key: string]: any;
}

export interface ReportPaginationFactoryOptions {
  total_items?: number;
  current_page?: number;
  items_per_page?: number;
  total_pages?: number;
}

export class ReportFactory {
  /**
   * Creates a basic voucher summary with default values
   */
  static createVoucherSummary(
    overrides: Partial<VoucherSummaryFactoryOptions> = {}
  ) {
    const defaultSummary: VoucherSummaryFactoryOptions = {
      totalVouchers: 150,
      totalAmount: 50000.0,
      averageAmount: 333.33,
      processType: PROCESS_TYPE_ENUM.NORMAL,
      companyNo: 10,
    };

    return { ...defaultSummary, ...overrides };
  }

  /**
   * Creates a voucher summary for a specific process type
   */
  static createVoucherSummaryForProcessType(
    processType: PROCESS_TYPE_ENUM,
    overrides: Partial<VoucherSummaryFactoryOptions> = {}
  ) {
    return this.createVoucherSummary({
      processType,
      ...overrides,
    });
  }

  /**
   * Creates a voucher summary for a specific company
   */
  static createVoucherSummaryForCompany(
    companyNo: number,
    overrides: Partial<VoucherSummaryFactoryOptions> = {}
  ) {
    return this.createVoucherSummary({
      companyNo,
      ...overrides,
    });
  }

  /**
   * Creates a basic report query with default values
   */
  static createReportQuery(overrides: Partial<ReportQueryFactoryOptions> = {}) {
    const defaultQuery: ReportQueryFactoryOptions = {
      companyNo: 10,
      processType: PROCESS_TYPE_ENUM.NORMAL,
      current_page: 1,
      items_per_page: 10,
      sortBy: "entryNo",
      sortOrder: "asc",
    };

    return { ...defaultQuery, ...overrides };
  }

  /**
   * Creates a report query for pagination testing
   */
  static createReportQueryForPagination(
    page: number,
    itemsPerPage: number,
    overrides: Partial<ReportQueryFactoryOptions> = {}
  ) {
    return this.createReportQuery({
      current_page: page,
      items_per_page: itemsPerPage,
      ...overrides,
    });
  }

  /**
   * Creates a basic report entry data with default values
   */
  static createReportEntryData(
    overrides: Partial<ReportEntryDataFactoryOptions> = {}
  ) {
    const defaultEntry: ReportEntryDataFactoryOptions = {
      entryNo: "ENTRY001",
      companyNo: 10,
      processType: PROCESS_TYPE_ENUM.NORMAL,
      vendorNo: 123,
      amount: 1000.0,
      invoiceNo: "INV001",
    };

    return { ...defaultEntry, ...overrides };
  }

  /**
   * Creates report entry data for a specific process type
   */
  static createReportEntryDataForProcessType(
    processType: PROCESS_TYPE_ENUM,
    overrides: Partial<ReportEntryDataFactoryOptions> = {}
  ) {
    return this.createReportEntryData({
      processType,
      ...overrides,
    });
  }

  /**
   * Creates multiple report entry data items
   */
  static createMultipleReportEntryData(
    count: number,
    baseOverrides: Partial<ReportEntryDataFactoryOptions> = {}
  ) {
    return Array.from({ length: count }, (_, index) =>
      this.createReportEntryData({
        ...baseOverrides,
        entryNo: `ENTRY${String(index + 1).padStart(3, "0")}`,
        amount: (index + 1) * 1000.0,
        vendorNo: 100 + index,
        invoiceNo: `INV${String(index + 1).padStart(3, "0")}`,
      })
    );
  }

  /**
   * Creates a basic report pagination with default values
   */
  static createReportPagination(
    overrides: Partial<ReportPaginationFactoryOptions> = {}
  ) {
    const defaultPagination: ReportPaginationFactoryOptions = {
      total_items: 100,
      current_page: 1,
      items_per_page: 10,
      total_pages: 10,
    };

    return { ...defaultPagination, ...overrides };
  }

  /**
   * Creates a flexi entry data item
   */
  static createFlexiEntryData(
    overrides: Partial<ReportEntryDataFactoryOptions> = {}
  ) {
    return this.createReportEntryDataForProcessType(PROCESS_TYPE_ENUM.FLEXI, {
      entryNo: "FLEXI001",
      ...overrides,
    });
  }

  /**
   * Creates a sogas entry data item
   */
  static createSogasEntryData(
    overrides: Partial<ReportEntryDataFactoryOptions> = {}
  ) {
    return this.createReportEntryDataForProcessType(PROCESS_TYPE_ENUM.SOGAS, {
      entryNo: "SOGAS001",
      ...overrides,
    });
  }

  /**
   * Creates a paper entry data item
   */
  static createPaperEntryData(
    overrides: Partial<ReportEntryDataFactoryOptions> = {}
  ) {
    return this.createReportEntryDataForProcessType(PROCESS_TYPE_ENUM.PAPER, {
      entryNo: "PAPER001",
      ...overrides,
    });
  }

  /**
   * Creates an LMS entry data item
   */
  static createLmsEntryData(
    overrides: Partial<ReportEntryDataFactoryOptions> = {}
  ) {
    return this.createReportEntryDataForProcessType(PROCESS_TYPE_ENUM.ARGLMS, {
      entryNo: "LMS001",
      ...overrides,
    });
  }

  /**
   * Creates a carrier invoice entry data item
   */
  static createCarrierInvoiceEntryData(
    overrides: Partial<ReportEntryDataFactoryOptions> = {}
  ) {
    return this.createReportEntryData({
      entryNo: "CAR001",
      invoiceNo: "INV001",
      amount: 1000.0,
      ...overrides,
    });
  }

  /**
   * Creates an LMS carrier invoice entry data item
   */
  static createLmsCarrierInvoiceEntryData(
    overrides: Partial<ReportEntryDataFactoryOptions> = {}
  ) {
    return this.createReportEntryData({
      entryNo: "LMS001",
      invoiceNo: "LMSINV001",
      amount: 1500.0,
      ...overrides,
    });
  }
}
