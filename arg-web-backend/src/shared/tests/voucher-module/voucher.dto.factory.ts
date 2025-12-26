import { PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";

export interface VoucherSubmitDtoFactoryOptions {
  companyNo: number;
  entryNo: number;
  vendorNo: number;
  apGlNo: number;
  invoiceDate: string;
  bankGl: number;
  invoiceAmount: number;
  invoiceNo: string;
  processType: PROCESS_TYPE_ENUM;
}

export interface VoucherDetailDtoFactoryOptions {
  companyNo: number;
  entryNo: number;
  lineGlNo: number;
  productAmount: number;
}

export interface VoucherSubmitRequestFactoryOptions {
  header?: Partial<VoucherSubmitDtoFactoryOptions>;
  details?: VoucherDetailDtoFactoryOptions[];
}

export class VoucherDtoFactory {
  /**
   * Creates a voucher submit DTO with default values
   */
  static createVoucherSubmitDto(
    overrides: Partial<VoucherSubmitDtoFactoryOptions> = {}
  ): VoucherSubmitDtoFactoryOptions {
    const defaultVoucherSubmit: VoucherSubmitDtoFactoryOptions = {
      companyNo: 10,
      entryNo: 1001,
      vendorNo: 1001,
      apGlNo: 12010001,
      invoiceDate: "2024-01-01",
      bankGl: 10010001,
      invoiceAmount: 1000.0,
      invoiceNo: "INV001",
      processType: PROCESS_TYPE_ENUM.NORMAL,
    };

    return { ...defaultVoucherSubmit, ...overrides };
  }

  /**
   * Creates a voucher detail DTO with default values
   */
  static createVoucherDetailDto(
    overrides: Partial<VoucherDetailDtoFactoryOptions> = {}
  ): VoucherDetailDtoFactoryOptions {
    const defaultVoucherDetail: VoucherDetailDtoFactoryOptions = {
      companyNo: 10,
      entryNo: 1001,
      lineGlNo: 12010001,
      productAmount: 1000.0,
    };

    return { ...defaultVoucherDetail, ...overrides };
  }

  /**
   * Creates a voucher submit request with default values
   */
  static createVoucherSubmitRequest(
    overrides: Partial<VoucherSubmitRequestFactoryOptions> = {}
  ): VoucherSubmitRequestFactoryOptions {
    const defaultRequest: VoucherSubmitRequestFactoryOptions = {
      header: this.createVoucherSubmitDto(),
      details: [this.createVoucherDetailDto()],
    };

    return { ...defaultRequest, ...overrides };
  }
}

/**
 * Factory for creating mock responses used in voucher tests
 */
export class VoucherMockResponseFactory {
  /**
   * Creates a mock success response for voucher submission
   */
  static createVoucherSubmitSuccessResponse(
    overrides: Partial<{ success: boolean; message: string }> = {}
  ) {
    const defaultResponse = {
      success: true,
      message: "Voucher submitted successfully",
    };

    return { ...defaultResponse, ...overrides };
  }

  /**
   * Creates a mock success response for header validation
   */
  static createHeaderValidationSuccessResponse(
    overrides: Partial<{ success: boolean; message: string }> = {}
  ) {
    const defaultResponse = {
      success: true,
      message: "Header validated successfully",
    };

    return { ...defaultResponse, ...overrides };
  }

  /**
   * Creates a mock process types response
   */
  static createProcessTypesResponse(
    overrides: Partial<{ id: number; value: string; label: string }>[] = []
  ) {
    const defaultProcessTypes = [
      { id: 1, value: "NORMAL", label: "Normal" },
      { id: 2, value: "FLEXI", label: "Flexi" },
      { id: 3, value: "SOGAS", label: "Sogas" },
      { id: 4, value: "PAPER", label: "Paper" },
      { id: 5, value: "ARGLMS", label: "ARGLMS" },
    ];

    return overrides.length > 0 ? overrides : defaultProcessTypes;
  }

  /**
   * Creates a mock vendor response for dropdown
   */
  static createVendorDropdownResponse(
    vendorNo: string | number,
    vendorName: string,
    overrides: Partial<{ vendorIsDeleted: string }> = {}
  ) {
    const defaultVendor = {
      vendorNo: vendorNo.toString(),
      vendorName,
      vendorIsDeleted: "A",
      ...overrides,
    };

    return {
      items: [defaultVendor],
      pagination: {
        total_items: 1,
        current_page: 1,
        items_per_page: 10,
        total_pages: 1,
      },
    };
  }

  /**
   * Creates a mock vendor by ID response
   */
  static createVendorByIdResponse(
    vendorNo: number,
    vendorName: string,
    overrides: Partial<{ companyNo: number }> = {}
  ) {
    return {
      vendorNo,
      vendorName,
      companyNo: 1,
      ...overrides,
    };
  }

  /**
   * Creates a mock voucher entry response
   */
  static createVoucherEntryResponse(
    entryNo: string | number,
    companyNo: string | number,
    overrides: Partial<{ [key: string]: any }> = {}
  ) {
    const defaultEntry = {
      entryNo: entryNo.toString(),
      companyNo: companyNo.toString(),
      ...overrides,
    };

    return {
      items: [defaultEntry],
      pagination: {
        total_items: 1,
        current_page: 1,
        items_per_page: 10,
        total_pages: 1,
      },
    };
  }
}
