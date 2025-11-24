import { Test, TestingModule } from "@nestjs/testing";
import { GetAllVendorUseCase } from "./get-vendor-list.usecase";
import { VendorInterface } from "@src/main/account-payable/domain/interface/vendor.interface";
import { GetAllVendorsDto } from "../../../voucher/dto/voucher.dto";
import { VendorFactory } from "@src/shared/tests/vendor-module/vendor.factory";
import { PaginatedResponseFactory } from "@src/shared/tests/shared/pagination.factory";

describe("GetAllVendorUseCase", () => {
  let useCase: GetAllVendorUseCase;
  let mockVendorInterface: jest.Mocked<VendorInterface>;

  const mockVendors = VendorFactory.createMultipleVendors(5, {
    vendorCompanyNumber: 10,
  });

  const mockVendorInterfaceResponse = {
    rows: mockVendors,
    count: mockVendors.length,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllVendorUseCase,
        {
          provide: "VendorInterface",
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetAllVendorUseCase>(GetAllVendorUseCase);
    mockVendorInterface = module.get("VendorInterface");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("should fetch all vendors successfully with default pagination", async () => {
      const dto: GetAllVendorsDto = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 10,
        search: undefined,
      };

      mockVendorInterface.findAll.mockResolvedValue(
        mockVendorInterfaceResponse
      );

      const result = await useCase.execute(dto);

      expect(mockVendorInterface.findAll).toHaveBeenCalledWith(
        10,
        undefined,
        10,
        0,
        false,
        true
      );
      expect(result).toEqual(
        PaginatedResponseFactory.createPaginatedResponseForPage(
          mockVendors,
          1,
          10,
          mockVendors.length
        )
      );
    });

    it("should fetch vendors with search parameter", async () => {
      const dto: GetAllVendorsDto = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 10,
        search: "Test Vendor",
      };

      mockVendorInterface.findAll.mockResolvedValue(
        mockVendorInterfaceResponse
      );

      const result = await useCase.execute(dto);

      expect(mockVendorInterface.findAll).toHaveBeenCalledWith(
        10,
        "Test Vendor",
        10,
        0,
        false,
        true
      );
      expect(result.items).toHaveLength(5);
    });

    it("should fetch vendors with custom pagination", async () => {
      const dto: GetAllVendorsDto = {
        companyNo: 10,
        current_page: 2,
        items_per_page: 5,
        search: undefined,
      };

      mockVendorInterface.findAll.mockResolvedValue(
        mockVendorInterfaceResponse
      );

      const result = await useCase.execute(dto);

      expect(mockVendorInterface.findAll).toHaveBeenCalledWith(
        10,
        undefined,
        5,
        5,
        false,
        true
      );
      expect(result.pagination.current_page).toBe(2);
      expect(result.pagination.items_per_page).toBe(5);
    });

    it("should handle empty vendor list", async () => {
      const dto: GetAllVendorsDto = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 10,
        search: undefined,
      };

      const emptyResponse = { rows: [], count: 0 };
      mockVendorInterface.findAll.mockResolvedValue(emptyResponse);

      const result = await useCase.execute(dto);

      expect(mockVendorInterface.findAll).toHaveBeenCalledWith(
        10,
        undefined,
        10,
        0,
        false,
        true
      );
      expect(result.items).toHaveLength(0);
      expect(result.pagination.total_items).toBe(0);
    });

    it("should handle large vendor list with pagination", async () => {
      const dto: GetAllVendorsDto = {
        companyNo: 10,
        current_page: 3,
        items_per_page: 20,
        search: undefined,
      };

      const largeVendorList = VendorFactory.createMultipleVendors(100, {
        vendorCompanyNumber: 10,
      });

      const largeResponse = {
        rows: largeVendorList.slice(40, 60), // Page 3 with 20 items
        count: 100,
      };

      mockVendorInterface.findAll.mockResolvedValue(largeResponse);

      const result = await useCase.execute(dto);

      expect(mockVendorInterface.findAll).toHaveBeenCalledWith(
        10,
        undefined,
        20,
        40,
        false,
        true
      );
      expect(result.items).toHaveLength(20);
      expect(result.pagination.total_items).toBe(100);
      expect(result.pagination.total_pages).toBe(5);
    });

    it("should handle search with special characters", async () => {
      const dto: GetAllVendorsDto = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 10,
        search: "Vendor & Co.",
      };

      mockVendorInterface.findAll.mockResolvedValue(
        mockVendorInterfaceResponse
      );

      const result = await useCase.execute(dto);

      expect(mockVendorInterface.findAll).toHaveBeenCalledWith(
        10,
        "Vendor & Co.",
        10,
        0,
        false,
        true
      );
      expect(result.items).toHaveLength(5);
    });

    it("should handle different company numbers", async () => {
      const dto: GetAllVendorsDto = {
        companyNo: 25,
        current_page: 1,
        items_per_page: 10,
        search: undefined,
      };

      const company25Vendors = VendorFactory.createMultipleVendors(3, {
        vendorCompanyNumber: 25,
      });

      const company25Response = {
        rows: company25Vendors,
        count: 3,
      };

      mockVendorInterface.findAll.mockResolvedValue(company25Response);

      const result = await useCase.execute(dto);

      expect(mockVendorInterface.findAll).toHaveBeenCalledWith(
        25,
        undefined,
        10,
        0,
        false,
        true
      );
      expect(result.items).toHaveLength(3);
      expect(result.pagination.total_items).toBe(3);
    });

    it("should handle interface errors gracefully", async () => {
      const dto: GetAllVendorsDto = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 10,
        search: undefined,
      };

      const error = new Error("Database connection failed");
      mockVendorInterface.findAll.mockRejectedValue(error);

      await expect(useCase.execute(dto)).rejects.toThrow(
        "Database connection failed"
      );
      expect(mockVendorInterface.findAll).toHaveBeenCalledWith(
        10,
        undefined,
        10,
        0,
        false,
        true
      );
    });

    it("should handle undefined search parameter", async () => {
      const dto: GetAllVendorsDto = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 10,
        search: undefined,
      };

      mockVendorInterface.findAll.mockResolvedValue(
        mockVendorInterfaceResponse
      );

      const result = await useCase.execute(dto);

      expect(mockVendorInterface.findAll).toHaveBeenCalledWith(
        10,
        undefined,
        10,
        0,
        false,
        true
      );
      expect(result.items).toHaveLength(5);
    });

    it("should handle empty search string", async () => {
      const dto: GetAllVendorsDto = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 10,
        search: "",
      };

      mockVendorInterface.findAll.mockResolvedValue(
        mockVendorInterfaceResponse
      );

      const result = await useCase.execute(dto);

      expect(mockVendorInterface.findAll).toHaveBeenCalledWith(
        10,
        undefined,
        10,
        0,
        false,
        true
      );
      expect(result.items).toHaveLength(5);
    });
  });
});
