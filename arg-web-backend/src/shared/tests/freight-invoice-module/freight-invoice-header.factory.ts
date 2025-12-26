import { FreightInvoiceHeaderEntity } from "@src/main/account-payable/domain/entities/freight-invoice-header.entity";
import { CarrierInvoiceResponseDto } from "@src/main/account-payable/application/voucher/dto/voucher.dto";

export interface FreightInvoiceHeaderFactoryOptions {
  isDeleted?: string;
  companyNo?: number;
  carrierId?: string;
  carrierInvoiceNo?: string;
  invoiceType?: string;
  invoiceDate?: number;
  invoiceAmount?: number;
  ourOrderNo?: number;
  shippingReferenceNo?: number;
  dateTimeStamp?: string;
  carrierInvoiceStatus?: string;
  freightBalanceOverrideTotal?: number;
  filler1?: string;
  approvalStatus?: string;
  approvalDateTime?: string;
  apInvoiceStatus?: string;
  apDateTime?: string;
  carrierUserId?: string;
  billingType?: string;
  carrierIpAddress?: string;
  vendorNo?: string;
  checkNumber?: number;
  checkDate?: number;
  voucherAmount?: number;
  filler2?: string;
}

export class FreightInvoiceHeaderFactory {
  /**
   * Creates a basic FreightInvoiceHeader entity with default values
   */
  static createBasicFreightInvoiceHeader(
    overrides: Partial<FreightInvoiceHeaderFactoryOptions> = {}
  ): FreightInvoiceHeaderEntity {
    const defaults: FreightInvoiceHeaderFactoryOptions = {
      isDeleted: "N",
      companyNo: 10,
      carrierId: "CAR001",
      carrierInvoiceNo: "INV001",
      invoiceType: "P",
      invoiceDate: 20241201,
      invoiceAmount: 1000.0,
      ourOrderNo: 1001,
      shippingReferenceNo: 1,
      dateTimeStamp: "20241201120000",
      carrierInvoiceStatus: "A",
      freightBalanceOverrideTotal: 50.0,
      filler1: "",
      approvalStatus: "A",
      approvalDateTime: "20241201120000",
      apInvoiceStatus: "",
      apDateTime: "",
      carrierUserId: "USER1",
      billingType: "STANDARD",
      carrierIpAddress: "192.168.1.1",
      vendorNo: "V001",
      checkNumber: 0,
      checkDate: 0,
      voucherAmount: 0,
      filler2: "",
    };

    const options = { ...defaults, ...overrides };

    return new FreightInvoiceHeaderEntity(
      options.isDeleted!,
      options.companyNo!,
      options.carrierId!,
      options.carrierInvoiceNo!,
      options.invoiceType!,
      options.invoiceDate!,
      options.invoiceAmount!,
      options.ourOrderNo!,
      options.shippingReferenceNo!,
      options.dateTimeStamp!,
      options.carrierInvoiceStatus!,
      options.freightBalanceOverrideTotal!,
      options.filler1!,
      options.approvalStatus!,
      options.approvalDateTime!,
      options.apInvoiceStatus!,
      options.apDateTime!,
      options.carrierUserId!,
      options.billingType!,
      options.carrierIpAddress!,
      options.vendorNo!,
      options.checkNumber!,
      options.checkDate!,
      options.voucherAmount!,
      options.filler2!
    );
  }

  /**
   * Creates a FreightInvoiceHeader entity for a specific company
   */
  static createFreightInvoiceForCompany(
    companyNo: number,
    overrides: Partial<FreightInvoiceHeaderFactoryOptions> = {}
  ): FreightInvoiceHeaderEntity {
    return this.createBasicFreightInvoiceHeader({
      ...overrides,
      companyNo,
    });
  }

  /**
   * Creates a FreightInvoiceHeader entity for a specific carrier
   */
  static createFreightInvoiceForCarrier(
    carrierId: string,
    overrides: Partial<FreightInvoiceHeaderFactoryOptions> = {}
  ): FreightInvoiceHeaderEntity {
    return this.createBasicFreightInvoiceHeader({
      ...overrides,
      carrierId,
    });
  }

  /**
   * Creates a FreightInvoiceHeader entity with high amounts
   */
  static createHighAmountFreightInvoice(
    overrides: Partial<FreightInvoiceHeaderFactoryOptions> = {}
  ): FreightInvoiceHeaderEntity {
    return this.createBasicFreightInvoiceHeader({
      ...overrides,
      invoiceAmount: 10000.0,
      freightBalanceOverrideTotal: 1000.0,
    });
  }

  /**
   * Creates a FreightInvoiceHeader entity with zero amounts
   */
  static createZeroAmountFreightInvoice(
    overrides: Partial<FreightInvoiceHeaderFactoryOptions> = {}
  ): FreightInvoiceHeaderEntity {
    return this.createBasicFreightInvoiceHeader({
      ...overrides,
      invoiceAmount: 0.0,
      freightBalanceOverrideTotal: 0.0,
    });
  }

  /**
   * Creates multiple FreightInvoiceHeader entities with sequential invoice numbers
   */
  static createMultipleFreightInvoices(
    count: number,
    overrides: Partial<FreightInvoiceHeaderFactoryOptions> = {}
  ): FreightInvoiceHeaderEntity[] {
    return Array.from({ length: count }, (_, index) =>
      this.createBasicFreightInvoiceHeader({
        ...overrides,
        carrierInvoiceNo: `${overrides.carrierInvoiceNo || "INV"}${String(index + 1).padStart(3, "0")}`,
        ourOrderNo: (overrides.ourOrderNo || 1001) + index,
      })
    );
  }

  /**
   * Creates a FreightInvoiceHeader entity for testing pagination
   */
  static createFreightInvoiceForPagination(
    page: number,
    itemIndex: number,
    overrides: Partial<FreightInvoiceHeaderFactoryOptions> = {}
  ): FreightInvoiceHeaderEntity {
    const invoiceNumber = (page - 1) * 10 + itemIndex + 1;
    return this.createBasicFreightInvoiceHeader({
      ...overrides,
      carrierInvoiceNo: `${overrides.carrierInvoiceNo || "INV"}${String(invoiceNumber).padStart(3, "0")}`,
      ourOrderNo: (overrides.ourOrderNo || 1001) + invoiceNumber - 1,
    });
  }

  /**
   * Creates a FreightInvoiceHeader entity with pending status
   */
  static createPendingFreightInvoice(
    overrides: Partial<FreightInvoiceHeaderFactoryOptions> = {}
  ): FreightInvoiceHeaderEntity {
    return this.createBasicFreightInvoiceHeader({
      ...overrides,
      approvalStatus: "P",
    });
  }

  /**
   * Creates a FreightInvoiceHeader entity with approved status
   */
  static createApprovedFreightInvoice(
    overrides: Partial<FreightInvoiceHeaderFactoryOptions> = {}
  ): FreightInvoiceHeaderEntity {
    return this.createBasicFreightInvoiceHeader({
      ...overrides,
      approvalStatus: "A",
    });
  }

  /**
   * Creates a FreightInvoiceHeader entity with rejected status
   */
  static createRejectedFreightInvoice(
    overrides: Partial<FreightInvoiceHeaderFactoryOptions> = {}
  ): FreightInvoiceHeaderEntity {
    return this.createBasicFreightInvoiceHeader({
      ...overrides,
      approvalStatus: "R",
    });
  }

  /**
   * Creates a FreightInvoiceHeader entity for testing cache operations
   */
  static createFreightInvoiceForCache(
    overrides: Partial<FreightInvoiceHeaderFactoryOptions> = {}
  ): FreightInvoiceHeaderEntity {
    return this.createBasicFreightInvoiceHeader({
      ...overrides,
      isDeleted: "N",
      approvalStatus: "A",
      apInvoiceStatus: "",
    });
  }

  /**
   * Creates a FreightInvoiceHeader entity for testing invoice status updates
   */
  static createFreightInvoiceForStatusUpdate(
    overrides: Partial<FreightInvoiceHeaderFactoryOptions> = {}
  ): FreightInvoiceHeaderEntity {
    return this.createBasicFreightInvoiceHeader({
      ...overrides,
      apInvoiceStatus: "",
    });
  }

  /**
   * Creates a CarrierInvoiceResponseDto for testing
   */
  static createCarrierInvoiceResponseDto(
    overrides: Partial<FreightInvoiceHeaderFactoryOptions> = {}
  ): CarrierInvoiceResponseDto {
    const freightInvoice = this.createBasicFreightInvoiceHeader(overrides);

    return {
      carrierId: freightInvoice.carrierId,
      carrierInvoiceNo: freightInvoice.carrierInvoiceNo,
      ordShipDate: "2024-12-01", // This would come from freight out balancing
      invoiceType: freightInvoice.invoiceType,
      ourOrderNo: freightInvoice.ourOrderNo,
      shippingReferenceNo: freightInvoice.shippingReferenceNo,
      invoiceAmount: freightInvoice.invoiceAmount,
    };
  }

  /**
   * Creates multiple CarrierInvoiceResponseDto for testing
   */
  static createMultipleCarrierInvoiceResponses(
    count: number,
    overrides: Partial<FreightInvoiceHeaderFactoryOptions> = {}
  ): CarrierInvoiceResponseDto[] {
    return Array.from({ length: count }, (_, index) =>
      this.createCarrierInvoiceResponseDto({
        ...overrides,
        carrierInvoiceNo: `${overrides.carrierInvoiceNo || "INV"}${String(index + 1).padStart(3, "0")}`,
        ourOrderNo: (overrides.ourOrderNo || 1001) + index,
      })
    );
  }

  /**
   * Creates a mock database record (plain object) for testing
   */
  static createMockDatabaseRecord(
    overrides: Partial<FreightInvoiceHeaderFactoryOptions> = {}
  ): Record<string, any> {
    const entity = this.createBasicFreightInvoiceHeader(overrides);

    return {
      companyNo: entity.companyNo,
      carrierId: entity.carrierId,
      carrierInvoiceNo: entity.carrierInvoiceNo,
      invoiceType: entity.invoiceType,
      invoiceDate: entity.invoiceDate,
      invoiceAmount: entity.invoiceAmount,
      ourOrderNo: entity.ourOrderNo,
      shippingReferenceNo: entity.shippingReferenceNo,
      dateTimeStamp: entity.dateTimeStamp,
      carrierInvoiceStatus: entity.carrierInvoiceStatus,
      freightBalanceOverrideTotal: entity.freightBalanceOverrideTotal,
      filler1: entity.filler1,
      approvalStatus: entity.approvalStatus,
      approvalDateTime: entity.approvalDateTime,
      apInvoiceStatus: entity.apInvoiceStatus,
      apDateTime: entity.apDateTime,
      carrierUserId: entity.carrierUserId,
      billingType: entity.billingType,
      carrierIpAddress: entity.carrierIpAddress,
      vendorNo: entity.vendorNo,
      checkNumber: entity.checkNumber,
      checkDate: entity.checkDate,
      voucherAmount: entity.voucherAmount,
      filler2: entity.filler2,
      isDeleted: entity.isDeleted,
    };
  }

  /**
   * Creates multiple mock database records for testing
   */
  static createMultipleMockDatabaseRecords(
    count: number,
    overrides: Partial<FreightInvoiceHeaderFactoryOptions> = {}
  ): Record<string, any>[] {
    return Array.from({ length: count }, (_, index) =>
      this.createMockDatabaseRecord({
        ...overrides,
        carrierInvoiceNo: `${overrides.carrierInvoiceNo || "INV"}${String(index + 1).padStart(3, "0")}`,
        ourOrderNo: (overrides.ourOrderNo || 1001) + index,
      })
    );
  }
}
