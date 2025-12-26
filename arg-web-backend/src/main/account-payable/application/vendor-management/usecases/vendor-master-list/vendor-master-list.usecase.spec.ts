import { Test, TestingModule } from "@nestjs/testing";
import { VendorMasterListUsecase } from "./vendor-master-list.usecase";
import { VendorInterface } from "@src/main/account-payable/domain/interface/vendor.interface";
import { vendorMasterListDto } from "../../dto/vendor-management.dto";
import { VendorFactory } from "@src/shared/tests/vendor-module/vendor.factory";
import { PaginatedResponseFactory } from "@src/shared/tests/shared/pagination.factory";
import { HttpException, HttpStatus } from "@nestjs/common";

describe("VendorMasterListUsecase", () => {
  let useCase: VendorMasterListUsecase;
  let mockVendorInterface: jest.Mocked<VendorInterface>;

  const mockVendors = VendorFactory.createMultipleVendors(5, {
    vendorCompanyNumber: 10,
  });

  const mockVendorInterfaceResponse = {
    rows: mockVendors,
    count: mockVendors.length,
    page: 1,
    limit: 10,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendorMasterListUsecase,
        {
          provide: "VendorInterface",
          useValue: {
            getVendorMasterList: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<VendorMasterListUsecase>(VendorMasterListUsecase);
    mockVendorInterface = module.get("VendorInterface");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("should get vendor master list successfully with default parameters", async () => {
      const dto: vendorMasterListDto = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 10,
      };

      mockVendorInterface.getVendorMasterList.mockResolvedValue(
        mockVendorInterfaceResponse
      );

      const result = await useCase.execute(dto);

      expect(mockVendorInterface.getVendorMasterList).toHaveBeenCalledWith(dto);
      expect(result).toEqual(
        PaginatedResponseFactory.createPaginatedResponseForPage(
          mockVendors,
          1,
          10,
          mockVendors.length
        )
      );
    });

    it("should get vendor master list with vendor number filter", async () => {
      const dto: vendorMasterListDto = {
        companyNo: 10,
        vendorNo: 1001,
        current_page: 1,
        items_per_page: 10,
      };

      const filteredVendors = [mockVendors[0]!];
      const filteredResponse = {
        rows: filteredVendors,
        count: 1,
        page: 1,
        limit: 10,
      };

      mockVendorInterface.getVendorMasterList.mockResolvedValue(
        filteredResponse
      );

      const result = await useCase.execute(dto);

      expect(mockVendorInterface.getVendorMasterList).toHaveBeenCalledWith(dto);
      expect(result.items).toHaveLength(1);
      expect(result.pagination.total_items).toBe(1);
    });

    it("should get vendor master list with type filter", async () => {
      const dto: vendorMasterListDto = {
        companyNo: 10,
        type: "E",
        current_page: 1,
        items_per_page: 10,
      };

      mockVendorInterface.getVendorMasterList.mockResolvedValue(
        mockVendorInterfaceResponse
      );

      const result = await useCase.execute(dto);

      expect(mockVendorInterface.getVendorMasterList).toHaveBeenCalledWith(dto);
      expect(result.items).toHaveLength(5);
    });

    it("should get vendor master list with status filter", async () => {
      const dto: vendorMasterListDto = {
        companyNo: 10,
        status: "A",
        current_page: 1,
        items_per_page: 10,
      };

      mockVendorInterface.getVendorMasterList.mockResolvedValue(
        mockVendorInterfaceResponse
      );

      const result = await useCase.execute(dto);

      expect(mockVendorInterface.getVendorMasterList).toHaveBeenCalledWith(dto);
      expect(result.items).toHaveLength(5);
    });

    it("should get vendor master list with all filters", async () => {
      const dto: vendorMasterListDto = {
        companyNo: 10,
        vendorNo: 1001,
        type: "E",
        status: "A",
        current_page: 1,
        items_per_page: 10,
      };

      mockVendorInterface.getVendorMasterList.mockResolvedValue(
        mockVendorInterfaceResponse
      );

      const result = await useCase.execute(dto);

      expect(mockVendorInterface.getVendorMasterList).toHaveBeenCalledWith(dto);
      expect(result.items).toHaveLength(5);
    });

    it("should get vendor master list with custom pagination", async () => {
      const dto: vendorMasterListDto = {
        companyNo: 10,
        current_page: 2,
        items_per_page: 5,
      };

      const customResponse = {
        rows: mockVendors.slice(0, 5),
        count: 10,
        page: 2,
        limit: 5,
      };

      mockVendorInterface.getVendorMasterList.mockResolvedValue(customResponse);

      const result = await useCase.execute(dto);

      expect(mockVendorInterface.getVendorMasterList).toHaveBeenCalledWith(dto);
      expect(result.pagination.current_page).toBe(2);
      expect(result.pagination.items_per_page).toBe(5);
      expect(result.pagination.total_items).toBe(10);
    });

    it("should handle different company numbers", async () => {
      const dto: vendorMasterListDto = {
        companyNo: 25,
        current_page: 1,
        items_per_page: 10,
      };

      const company25Vendors = VendorFactory.createMultipleVendors(3, {
        vendorCompanyNumber: 25,
      });

      const company25Response = {
        rows: company25Vendors,
        count: 3,
        page: 1,
        limit: 10,
      };

      mockVendorInterface.getVendorMasterList.mockResolvedValue(
        company25Response
      );

      const result = await useCase.execute(dto);

      expect(mockVendorInterface.getVendorMasterList).toHaveBeenCalledWith(dto);
      expect(result.items).toHaveLength(3);
      expect(result.pagination.total_items).toBe(3);
    });

    it("should throw NOT_FOUND error when vendor list is null", async () => {
      const dto: vendorMasterListDto = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 10,
      };

      mockVendorInterface.getVendorMasterList.mockResolvedValue({
        rows: null as any,
        count: 0,
        page: 1,
        limit: 10,
      });

      await expect(useCase.execute(dto)).rejects.toThrow(HttpException);

      try {
        await useCase.execute(dto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        if (error instanceof HttpException) {
          expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
          const response = error.getResponse();
          expect(typeof response).toBe("object");
          expect(response).toHaveProperty("error");
          expect((response as any).error).toHaveProperty("code", "NOT_FOUND");
          expect((response as any).error).toHaveProperty("details");
          expect((response as any).error.details).toHaveLength(1);
          expect((response as any).error.details[0]).toHaveProperty(
            "field",
            "vendorList"
          );
          expect((response as any).error.details[0]).toHaveProperty(
            "code",
            "NOT_FOUND"
          );
          expect((response as any).error.details[0]).toHaveProperty(
            "message",
            "Vendor list not found"
          );
          expect((response as any).error).toHaveProperty(
            "message",
            "Requested Resource Not found"
          );
        }
      }

      expect(mockVendorInterface.getVendorMasterList).toHaveBeenCalledWith(dto);
    });

    it("should throw NOT_FOUND error when vendor list is undefined", async () => {
      const dto: vendorMasterListDto = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 10,
      };

      mockVendorInterface.getVendorMasterList.mockResolvedValue({
        rows: undefined as any,
        count: 0,
        page: 1,
        limit: 10,
      });

      await expect(useCase.execute(dto)).rejects.toThrow(HttpException);

      try {
        await useCase.execute(dto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        if (error instanceof HttpException) {
          expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
        }
      }

      expect(mockVendorInterface.getVendorMasterList).toHaveBeenCalledWith(dto);
    });

    it("should handle empty vendor list", async () => {
      const dto: vendorMasterListDto = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 10,
      };

      const emptyResponse = {
        rows: [],
        count: 0,
        page: 1,
        limit: 10,
      };

      mockVendorInterface.getVendorMasterList.mockResolvedValue(emptyResponse);

      const result = await useCase.execute(dto);

      expect(mockVendorInterface.getVendorMasterList).toHaveBeenCalledWith(dto);
      expect(result.items).toHaveLength(0);
      expect(result.pagination.total_items).toBe(0);
    });

    it("should handle large vendor list with pagination", async () => {
      const dto: vendorMasterListDto = {
        companyNo: 10,
        current_page: 3,
        items_per_page: 20,
      };

      const largeVendorList = VendorFactory.createMultipleVendors(100, {
        vendorCompanyNumber: 10,
      });

      const largeResponse = {
        rows: largeVendorList.slice(40, 60), // Page 3 with 20 items
        count: 100,
        page: 3,
        limit: 20,
      };

      mockVendorInterface.getVendorMasterList.mockResolvedValue(largeResponse);

      const result = await useCase.execute(dto);

      expect(mockVendorInterface.getVendorMasterList).toHaveBeenCalledWith(dto);
      expect(result.items).toHaveLength(20);
      expect(result.pagination.total_items).toBe(100);
      expect(result.pagination.total_pages).toBe(5);
    });

    it("should handle interface errors gracefully", async () => {
      const dto: vendorMasterListDto = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 10,
      };

      const error = new Error("Database connection failed");
      mockVendorInterface.getVendorMasterList.mockRejectedValue(error);

      await expect(useCase.execute(dto)).rejects.toThrow(
        "Database connection failed"
      );
      expect(mockVendorInterface.getVendorMasterList).toHaveBeenCalledWith(dto);
    });

    it("should handle vendors with specific types", async () => {
      const dto: vendorMasterListDto = {
        companyNo: 10,
        type: "S",
        current_page: 1,
        items_per_page: 10,
      };

      const serviceVendors = VendorFactory.createMultipleVendors(2, {
        vendorCompanyNumber: 10,
      });

      const serviceResponse = {
        rows: serviceVendors,
        count: 2,
        page: 1,
        limit: 10,
      };

      mockVendorInterface.getVendorMasterList.mockResolvedValue(
        serviceResponse
      );

      const result = await useCase.execute(dto);

      expect(mockVendorInterface.getVendorMasterList).toHaveBeenCalledWith(dto);
      expect(result.items).toHaveLength(2);
    });

    it("should handle vendors with specific statuses", async () => {
      const dto: vendorMasterListDto = {
        companyNo: 10,
        status: "I",
        current_page: 1,
        items_per_page: 10,
      };

      const inactiveVendors = VendorFactory.createMultipleVendors(1, {
        vendorCompanyNumber: 10,
        vendorIsDeleted: "I",
      });

      const inactiveResponse = {
        rows: inactiveVendors,
        count: 1,
        page: 1,
        limit: 10,
      };

      mockVendorInterface.getVendorMasterList.mockResolvedValue(
        inactiveResponse
      );

      const result = await useCase.execute(dto);

      expect(mockVendorInterface.getVendorMasterList).toHaveBeenCalledWith(dto);
      expect(result.items).toHaveLength(1);
    });
  });
});
