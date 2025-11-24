import { PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";

export interface BatchCreateDtoFactoryOptions {
  companyNo: number;
  processType: PROCESS_TYPE_ENUM;
  batchSize: number;
  invoices: Array<{
    carrierId: string;
    carrierInvoiceNo: string;
    ordShipDate: string;
    invoiceType: string;
    ourOrderNo: number;
    shippingReferenceNo: number;
    invoiceAmount: number;
    companyNo: number;
  }>;
}

export interface BatchCreateResultFactoryOptions {
  batchId: string;
  totalGroups: number;
  totalBatches: number;
  parentJobId: string | null;
  childJobIds: string[];
  groups: string[];
  message?: string;
}

export interface BatchInvoiceFactoryOptions {
  carrierId: string;
  carrierInvoiceNo: string;
  ordShipDate: string;
  invoiceType: string;
  ourOrderNo: number;
  shippingReferenceNo: number;
  invoiceAmount: number;
  companyNo: number;
}

export class BatchFactory {
  /**
   * Creates a basic batch create DTO with default values
   */
  static createBatchCreateDto(
    overrides: Partial<BatchCreateDtoFactoryOptions> = {}
  ) {
    const defaultDto: BatchCreateDtoFactoryOptions = {
      companyNo: 10,
      processType: PROCESS_TYPE_ENUM.PAPER,
      batchSize: 100,
      invoices: [
        {
          carrierId: "CAR001",
          carrierInvoiceNo: "INV001",
          ordShipDate: "2024-01-01",
          invoiceType: PROCESS_TYPE_ENUM.PAPER,
          ourOrderNo: 1001,
          shippingReferenceNo: 1,
          invoiceAmount: 1000.0,
          companyNo: 10,
        },
        {
          carrierId: "CAR002",
          carrierInvoiceNo: "INV002",
          ordShipDate: "2024-01-02",
          invoiceType: PROCESS_TYPE_ENUM.PAPER,
          ourOrderNo: 1002,
          shippingReferenceNo: 2,
          invoiceAmount: 2000.0,
          companyNo: 10,
        },
      ],
    };

    return { ...defaultDto, ...overrides };
  }

  /**
   * Creates a batch create DTO for a specific process type
   */
  static createBatchCreateDtoForProcessType(
    processType: PROCESS_TYPE_ENUM,
    overrides: Partial<BatchCreateDtoFactoryOptions> = {}
  ) {
    return this.createBatchCreateDto({
      processType,
      ...overrides,
    });
  }

  /**
   * Creates a batch create DTO with specific batch size
   */
  static createBatchCreateDtoWithSize(
    batchSize: number,
    overrides: Partial<BatchCreateDtoFactoryOptions> = {}
  ) {
    return this.createBatchCreateDto({
      batchSize,
      ...overrides,
    });
  }

  /**
   * Creates a batch create DTO for a specific company
   */
  static createBatchCreateDtoForCompany(
    companyNo: number,
    overrides: Partial<BatchCreateDtoFactoryOptions> = {}
  ) {
    return this.createBatchCreateDto({
      companyNo,
      invoices: [
        {
          carrierId: "CAR001",
          carrierInvoiceNo: "INV001",
          ordShipDate: "2024-01-01",
          invoiceType: PROCESS_TYPE_ENUM.PAPER,
          ourOrderNo: 1001,
          shippingReferenceNo: 1,
          invoiceAmount: 1000.0,
          companyNo,
        },
        {
          carrierId: "CAR002",
          carrierInvoiceNo: "INV002",
          ordShipDate: "2024-01-02",
          invoiceType: PROCESS_TYPE_ENUM.PAPER,
          ourOrderNo: 1002,
          shippingReferenceNo: 2,
          invoiceAmount: 2000.0,
          companyNo,
        },
      ],
      ...overrides,
    });
  }

  /**
   * Creates a basic batch create result with default values
   */
  static createBatchCreateResult(
    overrides: Partial<BatchCreateResultFactoryOptions> = {}
  ) {
    const defaultResult: BatchCreateResultFactoryOptions = {
      batchId: "BATCH001",
      totalGroups: 5,
      totalBatches: 5,
      parentJobId: "JOB001",
      childJobIds: ["CHILD001", "CHILD002"],
      groups: ["GROUP1", "GROUP2"],
      message: "Batch created successfully",
    };

    return { ...defaultResult, ...overrides };
  }

  /**
   * Creates a batch create result for small batches
   */
  static createSmallBatchCreateResult(
    overrides: Partial<BatchCreateResultFactoryOptions> = {}
  ) {
    return this.createBatchCreateResult({
      batchId: "BATCH002",
      totalGroups: 2,
      totalBatches: 2,
      parentJobId: null,
      childJobIds: [],
      groups: [],
      message: "Small batch created",
      ...overrides,
    });
  }

  /**
   * Creates a batch create result for large batches
   */
  static createLargeBatchCreateResult(
    overrides: Partial<BatchCreateResultFactoryOptions> = {}
  ) {
    return this.createBatchCreateResult({
      batchId: "BATCH003",
      totalGroups: 10,
      totalBatches: 10,
      parentJobId: "JOB003",
      childJobIds: ["CHILD001", "CHILD002", "CHILD003", "CHILD004", "CHILD005"],
      groups: ["GROUP1", "GROUP2", "GROUP3", "GROUP4", "GROUP5"],
      message: "Large batch created successfully",
      ...overrides,
    });
  }

  /**
   * Creates a basic batch invoice with default values
   */
  static createBatchInvoice(
    overrides: Partial<BatchInvoiceFactoryOptions> = {}
  ) {
    const defaultInvoice: BatchInvoiceFactoryOptions = {
      carrierId: "CAR001",
      carrierInvoiceNo: "INV001",
      ordShipDate: "2024-01-01",
      invoiceType: PROCESS_TYPE_ENUM.PAPER,
      ourOrderNo: 1001,
      shippingReferenceNo: 1,
      invoiceAmount: 1000.0,
      companyNo: 10,
    };

    return { ...defaultInvoice, ...overrides };
  }

  /**
   * Creates multiple batch invoices
   */
  static createMultipleBatchInvoices(
    count: number,
    baseOverrides: Partial<BatchInvoiceFactoryOptions> = {}
  ) {
    return Array.from({ length: count }, (_, index) =>
      this.createBatchInvoice({
        ...baseOverrides,
        carrierId: `CAR${String(index + 1).padStart(3, "0")}`,
        carrierInvoiceNo: `INV${String(index + 1).padStart(3, "0")}`,
        ordShipDate: `2024-01-${String(index + 1).padStart(2, "0")}`,
        ourOrderNo: 1000 + index + 1,
        shippingReferenceNo: index + 1,
        invoiceAmount: (index + 1) * 1000.0,
      })
    );
  }

  /**
   * Creates a paper batch create DTO
   */
  static createPaperBatchCreateDto(
    overrides: Partial<BatchCreateDtoFactoryOptions> = {}
  ) {
    return this.createBatchCreateDtoForProcessType(
      PROCESS_TYPE_ENUM.PAPER,
      overrides
    );
  }

  /**
   * Creates an LMS batch create DTO
   */
  static createLmsBatchCreateDto(
    overrides: Partial<BatchCreateDtoFactoryOptions> = {}
  ) {
    return this.createBatchCreateDtoForProcessType(
      PROCESS_TYPE_ENUM.ARGLMS,
      overrides
    );
  }

  /**
   * Creates a flexi batch create DTO
   */
  static createFlexiBatchCreateDto(
    overrides: Partial<BatchCreateDtoFactoryOptions> = {}
  ) {
    return this.createBatchCreateDtoForProcessType(
      PROCESS_TYPE_ENUM.FLEXI,
      overrides
    );
  }

  /**
   * Creates a sogas batch create DTO
   */
  static createSogasBatchCreateDto(
    overrides: Partial<BatchCreateDtoFactoryOptions> = {}
  ) {
    return this.createBatchCreateDtoForProcessType(
      PROCESS_TYPE_ENUM.SOGAS,
      overrides
    );
  }
}
