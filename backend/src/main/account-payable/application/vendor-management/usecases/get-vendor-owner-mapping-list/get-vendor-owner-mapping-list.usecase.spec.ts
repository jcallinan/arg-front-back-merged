import { Test, TestingModule } from "@nestjs/testing";
import { GetVendorOwnerMappingList } from "./get-vendor-owner-mapping-list.usecase";
import { OwnerVendorInterface } from "@src/main/account-payable/domain/interface/owner-vendor.interface";
import { vendorOwnerList } from "../../dto/vendor-management.dto";
import { VendorFactory } from "@src/shared/tests/vendor-module/vendor.factory";
import { PaginatedResponseFactory } from "@src/shared/tests/shared/pagination.factory";

describe("GetVendorOwnerMappingList", () => {
  let useCase: GetVendorOwnerMappingList;
  let mockOwnerVendorInterface: jest.Mocked<OwnerVendorInterface>;

  const mockOwnerVendorMappings =
    VendorFactory.createMultipleOwnerVendorMappings(5, {
      ownerNo: 100,
      vendorNo: 1001,
    });

  const mockPaginatedResponse =
    PaginatedResponseFactory.createPaginatedResponseForPage(
      mockOwnerVendorMappings,
      1,
      10,
      mockOwnerVendorMappings.length
    );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetVendorOwnerMappingList,
        {
          provide: "OwnerVendorInterface",
          useValue: {
            findAndCountAll: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetVendorOwnerMappingList>(GetVendorOwnerMappingList);
    mockOwnerVendorInterface = module.get("OwnerVendorInterface");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("should get vendor owner mapping list successfully with default parameters", async () => {
      const dto: vendorOwnerList = {
        vendorCompanyNumber: 10,
        ownerNo: 100,
        current_page: 1,
        items_per_page: 10,
      };

      mockOwnerVendorInterface.findAndCountAll.mockResolvedValue(
        mockPaginatedResponse as any
      );

      const result = await useCase.execute(dto);

      expect(mockOwnerVendorInterface.findAndCountAll).toHaveBeenCalledWith({
        vendorCompanyNumber: 10,
        vendorNo: undefined,
        ownerNo: 100,
        status: undefined,
        limit: 10,
        page: 1,
        offset: 0,
      });
      expect(result).toEqual(mockPaginatedResponse);
      expect(result.items).toHaveLength(5);
    });

    it("should get vendor owner mapping list with vendor number filter", async () => {
      const dto: vendorOwnerList = {
        vendorCompanyNumber: 10,
        vendorNo: 1001,
        ownerNo: 100,
        current_page: 1,
        items_per_page: 10,
      };

      mockOwnerVendorInterface.findAndCountAll.mockResolvedValue(
        mockPaginatedResponse as any
      );

      const result = await useCase.execute(dto);

      expect(mockOwnerVendorInterface.findAndCountAll).toHaveBeenCalledWith({
        vendorCompanyNumber: 10,
        vendorNo: 1001,
        ownerNo: 100,
        status: undefined,
        limit: 10,
        page: 1,
        offset: 0,
      });
      expect(result.items).toHaveLength(5);
    });

    it("should get vendor owner mapping list with owner number filter", async () => {
      const dto: vendorOwnerList = {
        vendorCompanyNumber: 10,
        ownerNo: 100,
        current_page: 1,
        items_per_page: 10,
      };

      mockOwnerVendorInterface.findAndCountAll.mockResolvedValue(
        mockPaginatedResponse as any
      );

      const result = await useCase.execute(dto);

      expect(mockOwnerVendorInterface.findAndCountAll).toHaveBeenCalledWith({
        vendorCompanyNumber: 10,
        vendorNo: undefined,
        ownerNo: 100,
        status: undefined,
        limit: 10,
        page: 1,
        offset: 0,
      });
      expect(result.items).toHaveLength(5);
    });

    it("should get vendor owner mapping list with status filter", async () => {
      const dto: vendorOwnerList = {
        vendorCompanyNumber: 10,
        ownerNo: 100,
        status: "A",
        current_page: 1,
        items_per_page: 10,
      };

      mockOwnerVendorInterface.findAndCountAll.mockResolvedValue(
        mockPaginatedResponse as any
      );

      const result = await useCase.execute(dto);

      expect(mockOwnerVendorInterface.findAndCountAll).toHaveBeenCalledWith({
        vendorCompanyNumber: 10,
        vendorNo: undefined,
        ownerNo: 100,
        status: "A",
        limit: 10,
        page: 1,
        offset: 0,
      });
      expect(result.items).toHaveLength(5);
    });

    it("should get vendor owner mapping list with all filters", async () => {
      const dto: vendorOwnerList = {
        vendorCompanyNumber: 10,
        vendorNo: 1001,
        ownerNo: 100,
        status: "A",
        current_page: 1,
        items_per_page: 10,
      };

      mockOwnerVendorInterface.findAndCountAll.mockResolvedValue(
        mockPaginatedResponse as any
      );

      const result = await useCase.execute(dto);

      expect(mockOwnerVendorInterface.findAndCountAll).toHaveBeenCalledWith({
        vendorCompanyNumber: 10,
        vendorNo: 1001,
        ownerNo: 100,
        status: "A",
        limit: 10,
        page: 1,
        offset: 0,
      });
      expect(result.items).toHaveLength(5);
    });

    it("should get vendor owner mapping list with custom pagination", async () => {
      const dto: vendorOwnerList = {
        vendorCompanyNumber: 10,
        ownerNo: 100,
        current_page: 2,
        items_per_page: 5,
      };

      const customResponse =
        PaginatedResponseFactory.createPaginatedResponseForPage(
          mockOwnerVendorMappings.slice(0, 5),
          2,
          5,
          10
        );

      mockOwnerVendorInterface.findAndCountAll.mockResolvedValue(
        customResponse as any
      );

      const result = await useCase.execute(dto);

      expect(mockOwnerVendorInterface.findAndCountAll).toHaveBeenCalledWith({
        vendorCompanyNumber: 10,
        vendorNo: undefined,
        ownerNo: 100,
        status: undefined,
        limit: 5,
        page: 2,
        offset: 5,
      });
      expect(result.pagination.current_page).toBe(2);
      expect(result.pagination.items_per_page).toBe(5);
      expect(result.pagination.total_items).toBe(10);
    });

    it("should handle different company numbers", async () => {
      const dto: vendorOwnerList = {
        vendorCompanyNumber: 25,
        ownerNo: 200,
        current_page: 1,
        items_per_page: 10,
      };

      const company25Mappings = VendorFactory.createMultipleOwnerVendorMappings(
        3,
        {
          ownerNo: 200,
          vendorNo: 2001,
        }
      );

      const company25Response =
        PaginatedResponseFactory.createPaginatedResponseForPage(
          company25Mappings,
          1,
          10,
          3
        );

      mockOwnerVendorInterface.findAndCountAll.mockResolvedValue(
        company25Response as any
      );

      const result = await useCase.execute(dto);

      expect(mockOwnerVendorInterface.findAndCountAll).toHaveBeenCalledWith({
        vendorCompanyNumber: 25,
        vendorNo: undefined,
        ownerNo: 200,
        status: undefined,
        limit: 10,
        page: 1,
        offset: 0,
      });
      expect(result.items).toHaveLength(3);
      expect(result.pagination.total_items).toBe(3);
    });

    it("should handle empty owner vendor mapping list", async () => {
      const dto: vendorOwnerList = {
        vendorCompanyNumber: 10,
        ownerNo: 100,
        current_page: 1,
        items_per_page: 10,
      };

      const emptyResponse =
        PaginatedResponseFactory.createEmptyPaginatedResponse();

      mockOwnerVendorInterface.findAndCountAll.mockResolvedValue(
        emptyResponse as any
      );

      const result = await useCase.execute(dto);

      expect(mockOwnerVendorInterface.findAndCountAll).toHaveBeenCalledWith({
        vendorCompanyNumber: 10,
        vendorNo: undefined,
        ownerNo: 100,
        status: undefined,
        limit: 10,
        page: 1,
        offset: 0,
      });
      expect(result.items).toHaveLength(0);
      expect(result.pagination.total_items).toBe(0);
    });

    it("should handle large owner vendor mapping list with pagination", async () => {
      const dto: vendorOwnerList = {
        vendorCompanyNumber: 10,
        ownerNo: 100,
        current_page: 3,
        items_per_page: 20,
      };

      const largeMappingList = VendorFactory.createMultipleOwnerVendorMappings(
        100,
        {
          ownerNo: 100,
          vendorNo: 1001,
        }
      );

      const largeResponse =
        PaginatedResponseFactory.createPaginatedResponseForPage(
          largeMappingList.slice(40, 60), // Page 3 with 20 items
          3,
          20,
          100
        );

      mockOwnerVendorInterface.findAndCountAll.mockResolvedValue(
        largeResponse as any
      );

      const result = await useCase.execute(dto);

      expect(mockOwnerVendorInterface.findAndCountAll).toHaveBeenCalledWith({
        vendorCompanyNumber: 10,
        vendorNo: undefined,
        ownerNo: 100,
        status: undefined,
        limit: 20,
        page: 3,
        offset: 40,
      });
      expect(result.items).toHaveLength(20);
      expect(result.pagination.total_items).toBe(100);
      expect(result.pagination.total_pages).toBe(5);
    });

    it("should handle interface errors gracefully", async () => {
      const dto: vendorOwnerList = {
        vendorCompanyNumber: 10,
        ownerNo: 100,
        current_page: 1,
        items_per_page: 10,
      };

      const error = new Error("Database connection failed");
      mockOwnerVendorInterface.findAndCountAll.mockRejectedValue(error);

      await expect(useCase.execute(dto)).rejects.toThrow(
        "Database connection failed"
      );
      expect(mockOwnerVendorInterface.findAndCountAll).toHaveBeenCalledWith({
        vendorCompanyNumber: 10,
        vendorNo: undefined,
        ownerNo: 100,
        status: undefined,
        limit: 10,
        page: 1,
        offset: 0,
      });
    });

    it("should handle owner vendor mappings with specific statuses", async () => {
      const dto: vendorOwnerList = {
        vendorCompanyNumber: 10,
        ownerNo: 100,
        status: "I",
        current_page: 1,
        items_per_page: 10,
      };

      const inactiveMappings = VendorFactory.createMultipleOwnerVendorMappings(
        2,
        {
          ownerNo: 100,
          vendorNo: 1001,
          isDeleted: "I",
        }
      );

      const inactiveResponse =
        PaginatedResponseFactory.createPaginatedResponseForPage(
          inactiveMappings,
          1,
          10,
          2
        );

      mockOwnerVendorInterface.findAndCountAll.mockResolvedValue(
        inactiveResponse as any
      );

      const result = await useCase.execute(dto);

      expect(mockOwnerVendorInterface.findAndCountAll).toHaveBeenCalledWith({
        vendorCompanyNumber: 10,
        vendorNo: undefined,
        ownerNo: 100,
        status: "I",
        limit: 10,
        page: 1,
        offset: 0,
      });
      expect(result.items).toHaveLength(2);
    });

    it("should handle owner vendor mappings with specific vendor numbers", async () => {
      const dto: vendorOwnerList = {
        vendorCompanyNumber: 10,
        vendorNo: 9999,
        ownerNo: 100,
        current_page: 1,
        items_per_page: 10,
      };

      const specificVendorMappings =
        VendorFactory.createMultipleOwnerVendorMappings(1, {
          ownerNo: 100,
          vendorNo: 9999,
        });

      const specificResponse =
        PaginatedResponseFactory.createPaginatedResponseForPage(
          specificVendorMappings,
          1,
          10,
          1
        );

      mockOwnerVendorInterface.findAndCountAll.mockResolvedValue(
        specificResponse as any
      );

      const result = await useCase.execute(dto);

      expect(mockOwnerVendorInterface.findAndCountAll).toHaveBeenCalledWith({
        vendorCompanyNumber: 10,
        vendorNo: 9999,
        ownerNo: 100,
        status: undefined,
        limit: 10,
        page: 1,
        offset: 0,
      });
      expect(result.items).toHaveLength(1);
    });

    it("should handle owner vendor mappings with specific owner numbers", async () => {
      const dto: vendorOwnerList = {
        vendorCompanyNumber: 10,
        ownerNo: 999,
        current_page: 1,
        items_per_page: 10,
      };

      const specificOwnerMappings =
        VendorFactory.createMultipleOwnerVendorMappings(3, {
          ownerNo: 999,
          vendorNo: 1001,
        });

      const specificResponse =
        PaginatedResponseFactory.createPaginatedResponseForPage(
          specificOwnerMappings,
          1,
          10,
          3
        );

      mockOwnerVendorInterface.findAndCountAll.mockResolvedValue(
        specificResponse as any
      );

      const result = await useCase.execute(dto);

      expect(mockOwnerVendorInterface.findAndCountAll).toHaveBeenCalledWith({
        vendorCompanyNumber: 10,
        vendorNo: undefined,
        ownerNo: 999,
        status: undefined,
        limit: 10,
        page: 1,
        offset: 0,
      });
      expect(result.items).toHaveLength(3);
    });

    it("should handle search query normalization correctly", async () => {
      const dto: vendorOwnerList = {
        vendorCompanyNumber: 10,
        ownerNo: 100,
        current_page: 5,
        items_per_page: 25,
      };

      const customResponse =
        PaginatedResponseFactory.createPaginatedResponseForPage(
          mockOwnerVendorMappings,
          5,
          25,
          100
        );

      mockOwnerVendorInterface.findAndCountAll.mockResolvedValue(
        customResponse as any
      );

      const result = await useCase.execute(dto);

      expect(mockOwnerVendorInterface.findAndCountAll).toHaveBeenCalledWith({
        vendorCompanyNumber: 10,
        vendorNo: undefined,
        ownerNo: 100,
        status: undefined,
        limit: 25,
        page: 5,
        offset: 100, // (5-1) * 25
      });
      expect(result.pagination.current_page).toBe(5);
      expect(result.pagination.items_per_page).toBe(25);
    });
  });
});
