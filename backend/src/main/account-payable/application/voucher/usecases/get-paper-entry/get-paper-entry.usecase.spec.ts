// get-paper-entry.usecase.spec.ts

import { GetPaperEntryUseCase } from "./get-paper-entry.usecase";
import { VoucherAppService } from "@src/main/account-payable/domain/services/voucher/voucher.service";
import { GetPaperHeadersDto } from "../../dto/voucher.dto";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import { PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";
import { VoucherHeader } from "@src/main/account-payable/domain/entities/voucher.entity";

describe("GetPaperEntryUseCase", () => {
  let useCase: GetPaperEntryUseCase;
  let voucherAppService: jest.Mocked<VoucherAppService>;

  beforeEach(() => {
    voucherAppService = {
      getPaperVoucherHeaders: jest.fn(),
      getVoucherHeaders: jest.fn(),
      getSogasVoucherHeaders: jest.fn(),
      getLmsVoucherHeaders: jest.fn(),
      getFlexiVoucherHeaders: jest.fn(),
      getVoucherDetails: jest.fn(),
      createVoucherHeader: jest.fn(),
      updateVoucherHeader: jest.fn(),
      deleteVoucherHeader: jest.fn(),
      createVoucherDetail: jest.fn(),
      updateVoucherDetail: jest.fn(),
      deleteVoucherDetail: jest.fn(),
      softDeleteVoucherDetail: jest.fn(),
    } as unknown as jest.Mocked<VoucherAppService>;

    useCase = new GetPaperEntryUseCase(voucherAppService);
  });

  it("should fetch paper voucher entry data successfully", async () => {
    const dto: GetPaperHeadersDto = {
      companyNo: 10,
      vendorNo: 1001,
      entryNo: 12345,
      processType: PROCESS_TYPE_ENUM.PAPER,
      current_page: 1,
      items_per_page: 10,
    };

    const mockVoucherHeaders: VoucherHeader[] = [
      VoucherHeader.create({
        isDeleted: "N",
        entryNo: 12345,
        entrySequence: 1,
        canceledVoucher: 0,
        apGlNo: 2000,
        invoiceDesc: "Test Invoice",
        invoiceDate: "022224", // MMDDYY format - will be converted to "02/22/24"
        dueDate: "022224",
        singleCheck: "N",
        holdCode: "",
        holdDesc: "",
        prepaidCode: "",
        prepaidCheckNo: 0,
        vendorName: "ABSG CONSULTING",
        vendorAdd1: "",
        vendorAdd2: "",
        vendorAdd3: "",
        vendorAdd4: "",
        bankGl: 1000,
        invoiceAmount: 2443500,
        retentionGl: 0,
        retentionPct: 0,
        prepaidCheckdate: "",
        totalFreight: 0,
        salesOrderNo: 101010,
        srn: 0,
        carrierId: "",
        vendorPaymentTerms: 0,
        processType: PROCESS_TYPE_ENUM.PAPER,
        discountDueDate: "022224", // MMDDYY format - will be converted to "02/22/24"
        extendedDiscountDueDate: 0,
        invoiceNo: "ABC123",
        status: "A",
        companyBankGlDesc: "",
        companyApGlDesc: "",
        userProfile: "TEST",
        createDate: 20240827,
        updateDate: 20240827,
        fillerOne: "",
        fillerTwo: "",
        discountAmount: 0,
        vendorNo: 1001,
        companyNo: 10,
      }),
      VoucherHeader.create({
        isDeleted: "N",
        entryNo: 12346,
        entrySequence: 1,
        canceledVoucher: 0,
        apGlNo: 2000,
        invoiceDesc: "Test Invoice 2",
        invoiceDate: "031525", // MMDDYY format - will be converted to "03/15/25"
        dueDate: "031525",
        singleCheck: "N",
        holdCode: "",
        holdDesc: "",
        prepaidCode: "",
        prepaidCheckNo: 0,
        vendorName: "TEST VENDOR",
        vendorAdd1: "",
        vendorAdd2: "",
        vendorAdd3: "",
        vendorAdd4: "",
        bankGl: 1000,
        invoiceAmount: 1500000,
        retentionGl: 0,
        retentionPct: 0,
        prepaidCheckdate: "",
        totalFreight: 0,
        salesOrderNo: 101011,
        srn: 0,
        carrierId: "",
        vendorPaymentTerms: 0,
        processType: PROCESS_TYPE_ENUM.PAPER,
        discountDueDate: "031525", // MMDDYY format - will be converted to "03/15/25"
        extendedDiscountDueDate: 0,
        invoiceNo: "DEF456",
        status: "A",
        companyBankGlDesc: "",
        companyApGlDesc: "",
        userProfile: "TEST",
        createDate: 20240827,
        updateDate: 20240827,
        fillerOne: "",
        fillerTwo: "",
        discountAmount: 0,
        vendorNo: 1002,
        companyNo: 10,
      }),
    ];

    const mockResponse: PaginatedResponse<VoucherHeader> = {
      items: mockVoucherHeaders,
      pagination: {
        current_page: 1,
        items_per_page: 10,
        total_items: 2,
        total_pages: 1,
      },
    };

    voucherAppService.getPaperVoucherHeaders.mockResolvedValue(mockResponse);

    const result = await useCase.execute(dto);

    expect(voucherAppService.getPaperVoucherHeaders).toHaveBeenCalledWith({
      ...dto,
      companyNo: 10,
    });
    expect(result.items).toHaveLength(2);
    expect(result.pagination).toEqual(mockResponse.pagination);

    // Check first item formatting
    const firstItem = result.items[0];
    expect(firstItem).toBeDefined();
    if (firstItem) {
      expect(firstItem.invoiceNo).toBe("ABC123");
      expect(firstItem.invoiceDate).toBe("02/22/24");
      expect(firstItem.discountDueDate).toBe("02/22/24");
      expect(firstItem.processType).toBe(PROCESS_TYPE_ENUM.PAPER);
      expect(firstItem.vendorName).toBe("ABSG CONSULTING");
    }
  });

  it("should handle empty response", async () => {
    const dto: GetPaperHeadersDto = {
      companyNo: 10,
      current_page: 1,
      items_per_page: 10,
    };

    const mockResponse: PaginatedResponse<VoucherHeader> = {
      items: [],
      pagination: {
        current_page: 1,
        items_per_page: 10,
        total_items: 0,
        total_pages: 0,
      },
    };

    voucherAppService.getPaperVoucherHeaders.mockResolvedValue(mockResponse);

    const result = await useCase.execute(dto);

    expect(result.items).toHaveLength(0);
    expect(result.pagination).toEqual(mockResponse.pagination);
  });

  it("should handle null dates gracefully", async () => {
    const dto: GetPaperHeadersDto = {
      companyNo: 10,
      current_page: 1,
      items_per_page: 10,
    };

    const mockVoucherHeaders: VoucherHeader[] = [
      VoucherHeader.create({
        isDeleted: "N",
        entryNo: 12347,
        entrySequence: 1,
        canceledVoucher: 0,
        apGlNo: 2000,
        invoiceDesc: "Test Invoice 3",
        invoiceDate: "", // Empty string for null date
        dueDate: "",
        singleCheck: "N",
        holdCode: "",
        holdDesc: "",
        prepaidCode: "",
        prepaidCheckNo: 0,
        vendorName: "NULL VENDOR",
        vendorAdd1: "",
        vendorAdd2: "",
        vendorAdd3: "",
        vendorAdd4: "",
        bankGl: 1000,
        invoiceAmount: 1000000,
        retentionGl: 0,
        retentionPct: 0,
        prepaidCheckdate: "",
        totalFreight: 0,
        salesOrderNo: 101012,
        srn: 0,
        carrierId: "",
        vendorPaymentTerms: 0,
        processType: PROCESS_TYPE_ENUM.PAPER,
        discountDueDate: "", // Empty string for null date
        extendedDiscountDueDate: 0,
        invoiceNo: "NULL123",
        status: "A",
        companyBankGlDesc: "",
        companyApGlDesc: "",
        userProfile: "TEST",
        createDate: 20240827,
        updateDate: 20240827,
        fillerOne: "",
        fillerTwo: "",
        discountAmount: 0,
        vendorNo: 1003,
        companyNo: 10,
      }),
    ];

    const mockResponse: PaginatedResponse<VoucherHeader> = {
      items: mockVoucherHeaders,
      pagination: {
        current_page: 1,
        items_per_page: 10,
        total_items: 1,
        total_pages: 1,
      },
    };

    voucherAppService.getPaperVoucherHeaders.mockResolvedValue(mockResponse);

    const result = await useCase.execute(dto);

    const firstItem = result.items[0];
    expect(firstItem).toBeDefined();
    if (firstItem) {
      expect(firstItem.invoiceDate).toBe("");
      expect(firstItem.discountDueDate).toBe("");
    }
  });

  it("should handle errors from service", async () => {
    const dto: GetPaperHeadersDto = {
      companyNo: 10,
      current_page: 1,
      items_per_page: 10,
    };

    voucherAppService.getPaperVoucherHeaders.mockRejectedValue(
      new Error("Database connection failed")
    );

    await expect(useCase.execute(dto)).rejects.toThrow(
      "Database connection failed"
    );
  });

  it("should log the correct message", async () => {
    const dto: GetPaperHeadersDto = {
      companyNo: 10,
      current_page: 1,
      items_per_page: 10,
    };

    const mockResponse: PaginatedResponse<VoucherHeader> = {
      items: [],
      pagination: {
        current_page: 1,
        items_per_page: 10,
        total_items: 0,
        total_pages: 0,
      },
    };

    voucherAppService.getPaperVoucherHeaders.mockResolvedValue(mockResponse);

    const logSpy = jest.spyOn(useCase["logger"], "log");

    await useCase.execute(dto);

    expect(logSpy).toHaveBeenCalledWith(
      "Fetching PAPER Voucher Grid Entry Data"
    );
  });

  it("should always set companyNo to 10 regardless of input", async () => {
    const dto: GetPaperHeadersDto = {
      companyNo: 99, // Different company number
      current_page: 1,
      items_per_page: 10,
    };

    const mockResponse: PaginatedResponse<VoucherHeader> = {
      items: [],
      pagination: {
        current_page: 1,
        items_per_page: 10,
        total_items: 0,
        total_pages: 0,
      },
    };

    voucherAppService.getPaperVoucherHeaders.mockResolvedValue(mockResponse);

    await useCase.execute(dto);

    expect(voucherAppService.getPaperVoucherHeaders).toHaveBeenCalledWith({
      ...dto,
      companyNo: 10, // Should always be 10
    });
  });
});
