import { Test, TestingModule } from "@nestjs/testing";
import { GetLmsEntryUseCase } from "./get-lms-entry.usecase";
import { VoucherAppService } from "@src/main/account-payable/domain/services/voucher/voucher.service";
import { GetLmsHeadersDto } from "../../dto/voucher.dto";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import { PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";
import { VoucherHeader } from "@src/main/account-payable/domain/entities/voucher.entity";
import { VoucherHeaderFactory } from "@src/shared/tests";

describe("GetLmsEntryUseCase", () => {
  let useCase: GetLmsEntryUseCase;
  let voucherAppService: jest.Mocked<VoucherAppService>;

  beforeEach(async () => {
    const mockVoucherAppService = {
      getLmsVoucherHeaders: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetLmsEntryUseCase,
        {
          provide: VoucherAppService,
          useValue: mockVoucherAppService,
        },
      ],
    }).compile();

    useCase = module.get<GetLmsEntryUseCase>(GetLmsEntryUseCase);
    voucherAppService = module.get(VoucherAppService);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  describe("execute", () => {
    const mockDto: GetLmsHeadersDto = {
      companyNo: 10,
      vendorNo: 1001,
      entryNo: 12345,
      processType: PROCESS_TYPE_ENUM.ARGLMS,
      items_per_page: 10,
      current_page: 1,
      sortBy: "entryNo",
      sortOrder: "desc",
    };

    it("should successfully retrieve LMS voucher entries", async () => {
      // Use factory to create service response data
      const serviceResponse: PaginatedResponse<VoucherHeader> = {
        items: [
          VoucherHeaderFactory.createLmsVoucherHeader({
            entryNo: 12345,
            companyNo: 10,
            vendorNo: 1001,
            invoiceNo: "INV001",
            invoiceAmount: 1000000,
            invoiceDate: 20241201,
            discountDueDate: 20241215,
            vendorName: "Test Vendor",
          }),
          VoucherHeaderFactory.createLmsVoucherHeader({
            entryNo: 12346,
            companyNo: 10,
            vendorNo: 1002,
            invoiceNo: "INV002",
            invoiceAmount: 2000000,
            invoiceDate: 20241202,
            discountDueDate: 20241216,
            vendorName: "Test Vendor 2",
          }),
        ],
        pagination: {
          total_items: 2,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      voucherAppService.getLmsVoucherHeaders.mockResolvedValue(serviceResponse);

      const result = await useCase.execute(mockDto);

      expect(result).toBeDefined();
      expect(result.items).toHaveLength(2);
      expect(result.pagination.total_items).toBe(2);
      expect(result.pagination.current_page).toBe(1);
      expect(result.pagination.items_per_page).toBe(10);
      expect(result.pagination.total_pages).toBe(1);

      // Check that items are properly formatted
      expect(result.items[0]?.processType).toBe(PROCESS_TYPE_ENUM.ARGLMS);
      expect(result.items[0]?.invoiceDate).toBe("12/01/24");
      expect(result.items[0]?.discountDueDate).toBe("12/15/24");
      expect(result.items[0]?.invoiceNo).toBe("INV001");
      expect(result.items[0]?.vendorNo).toBe(1001);

      expect(result.items[1]?.processType).toBe(PROCESS_TYPE_ENUM.ARGLMS);
      expect(result.items[1]?.invoiceDate).toBe("12/02/24");
      expect(result.items[1]?.discountDueDate).toBe("12/16/24");
      expect(result.items[1]?.invoiceNo).toBe("INV002");
      expect(result.items[1]?.vendorNo).toBe(1002);
    });

    it("should override companyNo to 10 in the DTO passed to service", async () => {
      const dtoWithDifferentCompany: GetLmsHeadersDto = {
        ...mockDto,
        companyNo: 20, // Different company number
      };

      const serviceResponse: PaginatedResponse<VoucherHeader> = {
        items: [],
        pagination: {
          total_items: 0,
          current_page: 1,
          items_per_page: 10,
          total_pages: 0,
        },
      };

      voucherAppService.getLmsVoucherHeaders.mockResolvedValue(serviceResponse);

      await useCase.execute(dtoWithDifferentCompany);

      expect(voucherAppService.getLmsVoucherHeaders).toHaveBeenCalledWith({
        ...dtoWithDifferentCompany,
        companyNo: 10, // Should be overridden to 10
      });
    });

    it("should handle empty response from service", async () => {
      const emptyResponse: PaginatedResponse<VoucherHeader> = {
        items: [],
        pagination: {
          total_items: 0,
          current_page: 1,
          items_per_page: 10,
          total_pages: 0,
        },
      };

      voucherAppService.getLmsVoucherHeaders.mockResolvedValue(emptyResponse);

      const result = await useCase.execute(mockDto);

      expect(result).toBeDefined();
      expect(result.items).toHaveLength(0);
      expect(result.pagination.total_items).toBe(0);
      expect(result.pagination.current_page).toBe(1);
      expect(result.pagination.items_per_page).toBe(10);
      expect(result.pagination.total_pages).toBe(0);
    });

    it("should handle items with null/undefined dates", async () => {
      const headersWithNullDates = [
        VoucherHeaderFactory.createLmsVoucherHeader({
          entryNo: 12345,
          companyNo: 10,
          vendorNo: 1001,
          invoiceNo: "INV001",
          invoiceDate: null as any,
          discountDueDate: undefined as any,
        }),
      ];

      const responseWithNullDates: PaginatedResponse<VoucherHeader> = {
        items: headersWithNullDates,
        pagination: {
          total_items: 1,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      voucherAppService.getLmsVoucherHeaders.mockResolvedValue(
        responseWithNullDates
      );

      const result = await useCase.execute(mockDto);

      expect(result.items[0]?.invoiceDate).toBe("");
      expect(result.items[0]?.discountDueDate).toBe("");
    });

    it("should handle items with string dates", async () => {
      const headersWithStringDates = [
        VoucherHeaderFactory.createLmsVoucherHeader({
          entryNo: 12345,
          companyNo: 10,
          vendorNo: 1001,
          invoiceNo: "INV001",
          invoiceDate: "120124",
          discountDueDate: "121524",
        }),
      ];

      const responseWithStringDates: PaginatedResponse<VoucherHeader> = {
        items: headersWithStringDates,
        pagination: {
          total_items: 1,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      voucherAppService.getLmsVoucherHeaders.mockResolvedValue(
        responseWithStringDates
      );

      const result = await useCase.execute(mockDto);

      expect(result.items[0]?.invoiceDate).toBe("12/01/24");
      expect(result.items[0]?.discountDueDate).toBe("12/15/24");
    });

    it("should handle items with numeric dates", async () => {
      const headersWithNumericDates = [
        VoucherHeaderFactory.createLmsVoucherHeader({
          entryNo: 12345,
          companyNo: 10,
          vendorNo: 1001,
          invoiceNo: "INV001",
          invoiceDate: 20241201,
          discountDueDate: 20241215,
        }),
      ];

      const responseWithNumericDates: PaginatedResponse<VoucherHeader> = {
        items: headersWithNumericDates,
        pagination: {
          total_items: 1,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      voucherAppService.getLmsVoucherHeaders.mockResolvedValue(
        responseWithNumericDates
      );

      const result = await useCase.execute(mockDto);

      expect(result.items[0]?.invoiceDate).toBe("12/01/24");
      expect(result.items[0]?.discountDueDate).toBe("12/15/24");
    });

    it("should preserve all other properties from the original items", async () => {
      const serviceResponse: PaginatedResponse<VoucherHeader> = {
        items: [
          VoucherHeaderFactory.createLmsVoucherHeader({
            entryNo: 12345,
            companyNo: 10,
            vendorNo: 1001,
            invoiceNo: "INV001",
            invoiceAmount: 1000000,
            vendorName: "Test Vendor",
            salesOrderNo: 101010,
          }),
        ],
        pagination: {
          total_items: 1,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      voucherAppService.getLmsVoucherHeaders.mockResolvedValue(serviceResponse);

      const result = await useCase.execute(mockDto);

      const firstItem = result.items[0];
      expect(firstItem?.invoiceNo).toBe("INV001");
      expect(firstItem?.vendorNo).toBe(1001);
      expect(firstItem?.companyNo).toBe(10);
      expect(firstItem?.invoiceAmount).toBe(1000000);
      expect(firstItem?.vendorName).toBe("Test Vendor");
      expect(firstItem?.salesOrderNo).toBe(101010);
    });

    it("should handle service errors gracefully", async () => {
      const error = new Error("Database connection failed");
      voucherAppService.getLmsVoucherHeaders.mockRejectedValue(error);

      await expect(useCase.execute(mockDto)).rejects.toThrow(
        "Database connection failed"
      );
      expect(voucherAppService.getLmsVoucherHeaders).toHaveBeenCalledWith({
        ...mockDto,
        companyNo: 10,
      });
    });

    it("should log the correct message", async () => {
      const serviceResponse: PaginatedResponse<VoucherHeader> = {
        items: [],
        pagination: {
          total_items: 0,
          current_page: 1,
          items_per_page: 10,
          total_pages: 0,
        },
      };

      voucherAppService.getLmsVoucherHeaders.mockResolvedValue(serviceResponse);

      const logSpy = jest.spyOn(useCase["logger"], "log");

      await useCase.execute(mockDto);

      expect(logSpy).toHaveBeenCalledWith(
        "Fetching LMS Voucher Grid Entry Data"
      );
    });

    it("should handle different DTO configurations", async () => {
      const minimalDto: GetLmsHeadersDto = {
        companyNo: 10,
      };

      const serviceResponse: PaginatedResponse<VoucherHeader> = {
        items: [],
        pagination: {
          total_items: 0,
          current_page: 1,
          items_per_page: 10,
          total_pages: 0,
        },
      };

      voucherAppService.getLmsVoucherHeaders.mockResolvedValue(serviceResponse);

      await useCase.execute(minimalDto);

      expect(voucherAppService.getLmsVoucherHeaders).toHaveBeenCalledWith({
        ...minimalDto,
        companyNo: 10,
      });
    });

    it("should handle DTO with all optional fields", async () => {
      const fullDto: GetLmsHeadersDto = {
        companyNo: 10,
        vendorNo: 1001,
        entryNo: 12345,
        processType: PROCESS_TYPE_ENUM.ARGLMS,
        items_per_page: 50,
        current_page: 2,
        sortBy: "vendorName",
        sortOrder: "asc",
      };

      const serviceResponse: PaginatedResponse<VoucherHeader> = {
        items: [],
        pagination: {
          total_items: 0,
          current_page: 1,
          items_per_page: 10,
          total_pages: 0,
        },
      };

      voucherAppService.getLmsVoucherHeaders.mockResolvedValue(serviceResponse);

      await useCase.execute(fullDto);

      expect(voucherAppService.getLmsVoucherHeaders).toHaveBeenCalledWith({
        ...fullDto,
        companyNo: 10,
      });
    });
  });
});
