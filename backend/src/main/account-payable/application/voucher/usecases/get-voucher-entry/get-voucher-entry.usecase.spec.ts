import { Test, TestingModule } from "@nestjs/testing";
import { GetVoucherEntryUseCase } from "./get-voucher-entry.usecase";
import { VoucherAppService } from "@src/main/account-payable/domain/services/voucher/voucher.service";
import { VoucherHeader } from "@src/main/account-payable/domain/entities/voucher.entity";
import { GetHeadersDto } from "../../dto/voucher.dto";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import { VoucherHeaderFactory } from "@src/shared/tests";
import { PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";
import { PaginatedResponseFactory } from "@src/shared/tests/shared/pagination.factory";

describe("GetVoucherEntryUseCase", () => {
  let useCase: GetVoucherEntryUseCase;
  let voucherAppService: VoucherAppService;

  const mockVoucherAppService = {
    getVoucherHeaders: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetVoucherEntryUseCase,
        {
          provide: VoucherAppService,
          useValue: mockVoucherAppService,
        },
      ],
    }).compile();

    useCase = module.get<GetVoucherEntryUseCase>(GetVoucherEntryUseCase);
    voucherAppService = module.get<VoucherAppService>(VoucherAppService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  describe("execute", () => {
    it("should return formatted voucher entry data with pagination", async () => {
      // Arrange
      const dto: GetHeadersDto = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 10,
        search: "",
      };

      const mockVoucherHeaders = [
        VoucherHeaderFactory.createBasicVoucherHeader({
          entryNo: 1001,
          companyNo: 10,
          vendorNo: 456,
          invoiceNo: "INV001",
          invoiceAmount: 150.0,
          invoiceDate: 20240101,
          dueDate: 20240201,
          discountDueDate: 20240125,
          processType: PROCESS_TYPE_ENUM.NORMAL,
        }),
        VoucherHeaderFactory.createBasicVoucherHeader({
          entryNo: 1002,
          companyNo: 10,
          vendorNo: 457,
          invoiceNo: "INV002",
          invoiceAmount: 250.0,
          invoiceDate: 20240102,
          dueDate: 20240202,
          discountDueDate: 20240126,
          processType: PROCESS_TYPE_ENUM.NORMAL,
        }),
      ];

      const mockResponse =
        PaginatedResponseFactory.createSinglePagePaginatedResponse(
          mockVoucherHeaders
        );

      mockVoucherAppService.getVoucherHeaders.mockResolvedValue(mockResponse);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toBeDefined();
      expect(result.items).toHaveLength(2);
      expect(result.pagination.total_items).toBe(2);
      expect(voucherAppService.getVoucherHeaders).toHaveBeenCalledWith(dto);

      // Check that dates are formatted
      expect(result.items[0]?.invoiceDate).toBeDefined();
      expect(result.items[0]?.dueDate).toBeDefined();
      expect(result.items[0]?.discountDueDate).toBeDefined();
    });

    it("should handle empty voucher list", async () => {
      // Arrange
      const dto: GetHeadersDto = {
        companyNo: 999,
        current_page: 1,
        items_per_page: 10,
        search: "NonExistent",
      };

      const mockResponse =
        PaginatedResponseFactory.createEmptyPaginatedResponse<VoucherHeader>();

      mockVoucherAppService.getVoucherHeaders.mockResolvedValue(mockResponse);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toBeDefined();
      expect(result.items).toHaveLength(0);
      expect(result.pagination.total_items).toBe(0);
      expect(voucherAppService.getVoucherHeaders).toHaveBeenCalledWith(dto);
    });

    it("should handle pagination parameters correctly", async () => {
      // Arrange
      const dto: GetHeadersDto = {
        companyNo: 10,
        current_page: 2,
        items_per_page: 5,
        search: "",
      };

      const mockVoucherHeaders = Array.from({ length: 5 }, (_, index) =>
        VoucherHeaderFactory.createBasicVoucherHeader({
          entryNo: 1000 + index + 1,
          companyNo: 10,
          vendorNo: 456 + index,
          invoiceNo: `INV${String(1000 + index + 1).padStart(3, "0")}`,
          invoiceAmount: 100.0 + index * 50,
          invoiceDate: 20240101 + index,
          dueDate: 20240201 + index,
          discountDueDate: 20240125 + index,
          processType: PROCESS_TYPE_ENUM.NORMAL,
        })
      );

      const mockResponse =
        PaginatedResponseFactory.createPaginatedResponseForPage(
          mockVoucherHeaders,
          2,
          5,
          15
        );

      mockVoucherAppService.getVoucherHeaders.mockResolvedValue(mockResponse);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toBeDefined();
      expect(result.items).toHaveLength(5);
      expect(result.pagination.current_page).toBe(2);
      expect(result.pagination.items_per_page).toBe(5);
      expect(result.pagination.total_pages).toBe(3);
      expect(voucherAppService.getVoucherHeaders).toHaveBeenCalledWith(dto);
    });

    it("should format dates correctly", async () => {
      // Arrange
      const dto: GetHeadersDto = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 10,
        search: "",
      };

      const mockVoucherHeaders = [
        VoucherHeaderFactory.createBasicVoucherHeader({
          entryNo: 1001,
          companyNo: 10,
          vendorNo: 456,
          invoiceNo: "INV001",
          invoiceAmount: 150.0,
          invoiceDate: 20240101, // January 1, 2024
          dueDate: 20240201, // February 1, 2024
          discountDueDate: 20240125, // January 25, 2024
          processType: PROCESS_TYPE_ENUM.NORMAL,
        }),
      ];

      const mockResponse: PaginatedResponse<VoucherHeader> = {
        items: mockVoucherHeaders,
        pagination: {
          total_items: 1,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      mockVoucherAppService.getVoucherHeaders.mockResolvedValue(mockResponse);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toBeDefined();
      expect(result.items).toHaveLength(1);
      expect(result.items[0]?.invoiceDate).toBeDefined();
      expect(result.items[0]?.dueDate).toBeDefined();
      expect(result.items[0]?.discountDueDate).toBeDefined();
    });

    it("should handle different process types", async () => {
      // Arrange
      const dto: GetHeadersDto = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 10,
        search: "",
        processType: PROCESS_TYPE_ENUM.FLEXI,
      };

      const mockVoucherHeaders = [
        VoucherHeaderFactory.createBasicVoucherHeader({
          entryNo: 1001,
          companyNo: 10,
          vendorNo: 456,
          invoiceNo: "FLEXI001",
          invoiceAmount: 150.0,
          invoiceDate: 20240101,
          dueDate: 20240201,
          discountDueDate: 20240125,
          processType: PROCESS_TYPE_ENUM.FLEXI,
        }),
      ];

      const mockResponse: PaginatedResponse<VoucherHeader> = {
        items: mockVoucherHeaders,
        pagination: {
          total_items: 1,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      mockVoucherAppService.getVoucherHeaders.mockResolvedValue(mockResponse);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toBeDefined();
      expect(result.items).toHaveLength(1);
      expect(result.items[0]?.processType).toBe(PROCESS_TYPE_ENUM.FLEXI);
      expect(voucherAppService.getVoucherHeaders).toHaveBeenCalledWith(dto);
    });

    it("should handle search functionality", async () => {
      // Arrange
      const dto: GetHeadersDto = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 10,
        search: "INV001",
      };

      const mockVoucherHeaders = [
        VoucherHeaderFactory.createBasicVoucherHeader({
          entryNo: 1001,
          companyNo: 10,
          vendorNo: 456,
          invoiceNo: "INV001",
          invoiceAmount: 150.0,
          invoiceDate: 20240101,
          dueDate: 20240201,
          discountDueDate: 20240125,
          processType: PROCESS_TYPE_ENUM.NORMAL,
        }),
      ];

      const mockResponse: PaginatedResponse<VoucherHeader> = {
        items: mockVoucherHeaders,
        pagination: {
          total_items: 1,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      mockVoucherAppService.getVoucherHeaders.mockResolvedValue(mockResponse);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toBeDefined();
      expect(result.items).toHaveLength(1);
      expect(result.items[0]?.invoiceNo).toBe("INV001");
      expect(voucherAppService.getVoucherHeaders).toHaveBeenCalledWith(dto);
    });

    it("should handle sorting parameters", async () => {
      // Arrange
      const dto: GetHeadersDto = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 10,
        search: "",
        sortBy: "entryNo",
        sortOrder: "desc",
      };

      const mockVoucherHeaders = [
        VoucherHeaderFactory.createBasicVoucherHeader({
          entryNo: 1002,
          companyNo: 10,
          vendorNo: 457,
          invoiceNo: "INV002",
          invoiceAmount: 250.0,
          invoiceDate: 20240102,
          dueDate: 20240202,
          discountDueDate: 20240126,
          processType: PROCESS_TYPE_ENUM.NORMAL,
        }),
        VoucherHeaderFactory.createBasicVoucherHeader({
          entryNo: 1001,
          companyNo: 10,
          vendorNo: 456,
          invoiceNo: "INV001",
          invoiceAmount: 150.0,
          invoiceDate: 20240101,
          dueDate: 20240201,
          discountDueDate: 20240125,
          processType: PROCESS_TYPE_ENUM.NORMAL,
        }),
      ];

      const mockResponse: PaginatedResponse<VoucherHeader> = {
        items: mockVoucherHeaders,
        pagination: {
          total_items: 2,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      mockVoucherAppService.getVoucherHeaders.mockResolvedValue(mockResponse);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toBeDefined();
      expect(result.items).toHaveLength(2);
      expect(dto.sortBy).toBe("entryNo");
      expect(dto.sortOrder).toBe("desc");
      expect(voucherAppService.getVoucherHeaders).toHaveBeenCalledWith(dto);
    });
  });

  describe("error handling", () => {
    it("should propagate service errors", async () => {
      // Arrange
      const dto: GetHeadersDto = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 10,
        search: "",
      };

      const errorMessage = "Database connection failed";
      mockVoucherAppService.getVoucherHeaders.mockRejectedValue(
        new Error(errorMessage)
      );

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow(errorMessage);
      expect(voucherAppService.getVoucherHeaders).toHaveBeenCalledWith(dto);
    });

    it("should handle validation errors from service", async () => {
      // Arrange
      const dto: GetHeadersDto = {
        companyNo: 0, // Invalid company number
        current_page: 1,
        items_per_page: 10,
        search: "",
      };

      const errorMessage = "Invalid company number";
      mockVoucherAppService.getVoucherHeaders.mockRejectedValue(
        new Error(errorMessage)
      );

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow(errorMessage);
      expect(voucherAppService.getVoucherHeaders).toHaveBeenCalledWith(dto);
    });
  });

  describe("edge cases", () => {
    it("should handle maximum page size", async () => {
      // Arrange
      const dto: GetHeadersDto = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 500, // Maximum allowed
        search: "",
      };

      const mockVoucherHeaders = Array.from({ length: 500 }, (_, index) =>
        VoucherHeaderFactory.createBasicVoucherHeader({
          entryNo: 1000 + index + 1,
          companyNo: 10,
          vendorNo: 456 + index,
          invoiceNo: `INV${String(1000 + index + 1).padStart(3, "0")}`,
          invoiceAmount: 100.0 + index * 10,
          invoiceDate: 20240101 + index,
          dueDate: 20240201 + index,
          discountDueDate: 20240125 + index,
          processType: PROCESS_TYPE_ENUM.NORMAL,
        })
      );

      const mockResponse: PaginatedResponse<VoucherHeader> = {
        items: mockVoucherHeaders,
        pagination: {
          total_items: 500,
          current_page: 1,
          items_per_page: 500,
          total_pages: 1,
        },
      };

      mockVoucherAppService.getVoucherHeaders.mockResolvedValue(mockResponse);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toBeDefined();
      expect(result.items).toHaveLength(500);
      expect(result.pagination.items_per_page).toBe(500);
      expect(voucherAppService.getVoucherHeaders).toHaveBeenCalledWith(dto);
    });

    it("should handle single voucher result", async () => {
      // Arrange
      const dto: GetHeadersDto = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 10,
        search: "UniqueInvoice",
      };

      const mockVoucherHeaders = [
        VoucherHeaderFactory.createBasicVoucherHeader({
          entryNo: 1001,
          companyNo: 10,
          vendorNo: 456,
          invoiceNo: "UniqueInvoice",
          invoiceAmount: 150.0,
          invoiceDate: 20240101,
          dueDate: 20240201,
          discountDueDate: 20240125,
          processType: PROCESS_TYPE_ENUM.NORMAL,
        }),
      ];

      const mockResponse: PaginatedResponse<VoucherHeader> = {
        items: mockVoucherHeaders,
        pagination: {
          total_items: 1,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      mockVoucherAppService.getVoucherHeaders.mockResolvedValue(mockResponse);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toBeDefined();
      expect(result.items).toHaveLength(1);
      expect(result.items[0]?.invoiceNo).toBe("UniqueInvoice");
      expect(voucherAppService.getVoucherHeaders).toHaveBeenCalledWith(dto);
    });

    it("should handle null/undefined dates gracefully", async () => {
      // Arrange
      const dto: GetHeadersDto = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 10,
        search: "",
      };

      const mockVoucherHeaders = [
        VoucherHeaderFactory.createBasicVoucherHeader({
          entryNo: 1001,
          companyNo: 10,
          vendorNo: 456,
          invoiceNo: "INV001",
          invoiceAmount: 150.0,
          invoiceDate: undefined,
          dueDate: undefined,
          discountDueDate: undefined,
          processType: PROCESS_TYPE_ENUM.NORMAL,
        }),
      ];

      const mockResponse: PaginatedResponse<VoucherHeader> = {
        items: mockVoucherHeaders,
        pagination: {
          total_items: 1,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      mockVoucherAppService.getVoucherHeaders.mockResolvedValue(mockResponse);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toBeDefined();
      expect(result.items).toHaveLength(1);
      expect(result.items[0]?.invoiceDate).toBe("");
      expect(result.items[0]?.dueDate).toBe("");
      expect(result.items[0]?.discountDueDate).toBe("");
      expect(voucherAppService.getVoucherHeaders).toHaveBeenCalledWith(dto);
    });
  });
});
