import { Test, TestingModule } from "@nestjs/testing";
import { GetVendorUseCase } from "./get-vendor.usecase";
import { VendorAppService } from "@src/main/account-payable/domain/services/vendor/vendor.service";
import { Vendor } from "@src/main/account-payable/domain/entities/vendor.entity";
import { GetAllVendorsDto } from "../../dto/voucher.dto";
import { VendorFactory } from "@src/shared/tests/vendor-module/vendor.factory";
import { PaginatedResponseFactory } from "@src/shared/tests/shared/pagination.factory";

describe("GetVendorUseCase", () => {
  let useCase: GetVendorUseCase;
  let vendorAppService: VendorAppService;

  const mockVendorAppService = {
    getAllVendors: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetVendorUseCase,
        {
          provide: VendorAppService,
          useValue: mockVendorAppService,
        },
      ],
    }).compile();

    useCase = module.get<GetVendorUseCase>(GetVendorUseCase);
    vendorAppService = module.get<VendorAppService>(VendorAppService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  describe("execute", () => {
    it("should return paginated vendors successfully", async () => {
      // Arrange
      const dto: GetAllVendorsDto = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 10,
        search: "",
      };

      const mockVendors = [
        VendorFactory.createBasicVendor({
          vendorNo: 1001,
          vendorName: "Test Vendor 1",
          vendorCompanyNumber: 10,
        }),
        VendorFactory.createBasicVendor({
          vendorNo: 1002,
          vendorName: "Test Vendor 2",
          vendorCompanyNumber: 10,
        }),
      ];

      const mockResponse =
        PaginatedResponseFactory.createSinglePagePaginatedResponse(mockVendors);

      mockVendorAppService.getAllVendors.mockResolvedValue(mockResponse);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(vendorAppService.getAllVendors).toHaveBeenCalledWith(dto);
      expect(result.items).toHaveLength(2);
      expect(result.pagination.total_items).toBe(2);
      expect(result.items[0]?.vendorCompanyNumber).toBe(10);
    });

    it("should handle empty vendor list", async () => {
      // Arrange
      const dto: GetAllVendorsDto = {
        companyNo: 999,
        current_page: 1,
        items_per_page: 10,
        search: "NonExistent",
      };

      const mockResponse =
        PaginatedResponseFactory.createEmptyPaginatedResponse<Vendor>();

      mockVendorAppService.getAllVendors.mockResolvedValue(mockResponse);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(vendorAppService.getAllVendors).toHaveBeenCalledWith(dto);
      expect(result.items).toHaveLength(0);
      expect(result.pagination.total_items).toBe(0);
    });

    it("should handle pagination parameters correctly", async () => {
      // Arrange
      const dto: GetAllVendorsDto = {
        companyNo: 10,
        current_page: 2,
        items_per_page: 5,
        search: "",
      };

      const mockVendors = [
        VendorFactory.createBasicVendor({
          vendorNo: 1001,
          vendorName: "Vendor 1",
          vendorCompanyNumber: 10,
        }),
        VendorFactory.createBasicVendor({
          vendorNo: 1002,
          vendorName: "Vendor 2",
          vendorCompanyNumber: 10,
        }),
        VendorFactory.createBasicVendor({
          vendorNo: 1003,
          vendorName: "Vendor 3",
          vendorCompanyNumber: 10,
        }),
        VendorFactory.createBasicVendor({
          vendorNo: 1004,
          vendorName: "Vendor 4",
          vendorCompanyNumber: 10,
        }),
        VendorFactory.createBasicVendor({
          vendorNo: 1005,
          vendorName: "Vendor 5",
          vendorCompanyNumber: 10,
        }),
      ];

      const mockResponse =
        PaginatedResponseFactory.createPaginatedResponseForPage(
          mockVendors,
          2,
          5,
          15
        );

      mockVendorAppService.getAllVendors.mockResolvedValue(mockResponse);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(vendorAppService.getAllVendors).toHaveBeenCalledWith(dto);
      expect(result.pagination.current_page).toBe(2);
      expect(result.pagination.items_per_page).toBe(5);
      expect(result.pagination.total_pages).toBe(3);
    });

    it("should handle search functionality", async () => {
      // Arrange
      const dto: GetAllVendorsDto = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 10,
        search: "Test",
      };

      const mockVendors = [
        VendorFactory.createBasicVendor({
          vendorNo: 1001,
          vendorName: "Test Vendor",
          vendorCompanyNumber: 10,
        }),
      ];

      const mockResponse =
        PaginatedResponseFactory.createSinglePagePaginatedResponse(mockVendors);

      mockVendorAppService.getAllVendors.mockResolvedValue(mockResponse);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(vendorAppService.getAllVendors).toHaveBeenCalledWith(dto);
      expect(result.items[0]?.vendorName).toContain("Test");
    });

    it("should handle sorting parameters", async () => {
      // Arrange
      const dto: GetAllVendorsDto = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 10,
        search: "",
        sortBy: "vendorName",
        sortOrder: "desc",
      };

      const mockVendors = [
        VendorFactory.createBasicVendor({
          vendorNo: 1002,
          vendorName: "Zebra Vendor",
          vendorCompanyNumber: 10,
        }),
        VendorFactory.createBasicVendor({
          vendorNo: 1001,
          vendorName: "Alpha Vendor",
          vendorCompanyNumber: 10,
        }),
      ];

      const mockResponse =
        PaginatedResponseFactory.createSinglePagePaginatedResponse(mockVendors);

      mockVendorAppService.getAllVendors.mockResolvedValue(mockResponse);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(vendorAppService.getAllVendors).toHaveBeenCalledWith(dto);
      expect(result.items).toHaveLength(2);
      expect(dto.sortBy).toBe("vendorName");
      expect(dto.sortOrder).toBe("desc");
    });

    it("should handle different company numbers", async () => {
      // Arrange
      const dto: GetAllVendorsDto = {
        companyNo: 20,
        current_page: 1,
        items_per_page: 10,
        search: "",
      };

      const mockVendors = [
        VendorFactory.createBasicVendor({
          vendorNo: 2001,
          vendorName: "Company 20 Vendor",
          vendorCompanyNumber: 20,
        }),
      ];

      const mockResponse =
        PaginatedResponseFactory.createSinglePagePaginatedResponse(mockVendors);

      mockVendorAppService.getAllVendors.mockResolvedValue(mockResponse);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(vendorAppService.getAllVendors).toHaveBeenCalledWith(dto);
      expect(result.items[0]?.vendorCompanyNumber).toBe(20);
      expect(result.items[0]?.vendorNo).toBe(2001);
    });
  });

  describe("error handling", () => {
    it("should propagate service errors", async () => {
      // Arrange
      const dto: GetAllVendorsDto = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 10,
        search: "",
      };

      const errorMessage = "Database connection failed";
      mockVendorAppService.getAllVendors.mockRejectedValue(
        new Error(errorMessage)
      );

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow(errorMessage);
      expect(vendorAppService.getAllVendors).toHaveBeenCalledWith(dto);
    });

    it("should handle validation errors from service", async () => {
      // Arrange
      const dto: GetAllVendorsDto = {
        companyNo: 0, // Invalid company number
        current_page: 1,
        items_per_page: 10,
        search: "",
      };

      const errorMessage = "Company No. is required.";
      mockVendorAppService.getAllVendors.mockRejectedValue(
        new Error(errorMessage)
      );

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow(errorMessage);
      expect(vendorAppService.getAllVendors).toHaveBeenCalledWith(dto);
    });
  });

  describe("edge cases", () => {
    it("should handle maximum page size", async () => {
      // Arrange
      const dto: GetAllVendorsDto = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 500, // Maximum allowed
        search: "",
      };

      const mockVendors = Array.from({ length: 500 }, (_, index) =>
        VendorFactory.createBasicVendor({
          vendorNo: 1000 + index,
          vendorName: `Vendor ${index + 1}`,
          vendorCompanyNumber: 10,
        })
      );

      const mockResponse =
        PaginatedResponseFactory.createPaginatedResponseForPage(
          mockVendors,
          1,
          500,
          500
        );

      mockVendorAppService.getAllVendors.mockResolvedValue(mockResponse);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(vendorAppService.getAllVendors).toHaveBeenCalledWith(dto);
      expect(result.items).toHaveLength(500);
      expect(result.pagination.items_per_page).toBe(500);
    });

    it("should handle single vendor result", async () => {
      // Arrange
      const dto: GetAllVendorsDto = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 10,
        search: "UniqueVendor",
      };

      const mockVendors = [
        VendorFactory.createBasicVendor({
          vendorNo: 1001,
          vendorName: "UniqueVendor",
          vendorCompanyNumber: 10,
        }),
      ];

      const mockResponse =
        PaginatedResponseFactory.createSinglePagePaginatedResponse(mockVendors);

      mockVendorAppService.getAllVendors.mockResolvedValue(mockResponse);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(vendorAppService.getAllVendors).toHaveBeenCalledWith(dto);
      expect(result.items).toHaveLength(1);
      expect(result.items[0]?.vendorName).toBe("UniqueVendor");
    });
  });
});
