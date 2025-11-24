import { Test, TestingModule } from "@nestjs/testing";
import { GetVendorOwnerDropdown } from "./get-vendor-owner-dropdown.usecase";
import { vendorOwnerList } from "../../dto/vendor-management.dto";
import { VendorFactory } from "@src/shared/tests/vendor-module/vendor.factory";

import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import { OwnerVendorEntity } from "@src/main/account-payable/domain/entities/owner-vendor.entity";

// Mock interface that matches what the test actually needs
interface MockOwnerVendorInterface {
  findAndCountAll: jest.MockedFunction<
    () => Promise<PaginatedResponse<OwnerVendorEntity>>
  >;
}

describe("GetVendorOwnerDropdown", () => {
  let useCase: GetVendorOwnerDropdown;
  let mockOwnerVendorInterface: MockOwnerVendorInterface;

  const mockOwnerVendorMappings =
    VendorFactory.createMultipleOwnerVendorMappings(5, {
      ownerNo: 100,
      vendorNo: 1001,
    });

  const mockPaginatedResponse = {
    items: mockOwnerVendorMappings,
    pagination: {
      total_items: mockOwnerVendorMappings.length,
      current_page: 1,
      items_per_page: 10,
      total_pages: 1,
    },
  } as PaginatedResponse<OwnerVendorEntity>;

  const expectedDropdownItems = mockOwnerVendorMappings.map((mapping) => ({
    id: mapping.ownerNo,
    value: mapping.ownerNo,
    label: mapping.ownerNo,
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetVendorOwnerDropdown,
        {
          provide: "OwnerVendorInterface",
          useValue: {
            findAndCountAll: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetVendorOwnerDropdown>(GetVendorOwnerDropdown);
    mockOwnerVendorInterface = module.get("OwnerVendorInterface");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("should get vendor owner dropdown successfully with default parameters", async () => {
      const dto: vendorOwnerList = {
        vendorCompanyNumber: 10,
        ownerNo: 100,
        current_page: 1,
        items_per_page: 10,
      };

      mockOwnerVendorInterface.findAndCountAll.mockResolvedValue(
        mockPaginatedResponse
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
      expect(result).toEqual(expectedDropdownItems);
      expect(result).toHaveLength(5);
    });

    it("should get vendor owner dropdown with vendor number filter", async () => {
      const dto: vendorOwnerList = {
        vendorCompanyNumber: 10,
        vendorNo: 1001,
        ownerNo: 100,
        current_page: 1,
        items_per_page: 10,
      };

      mockOwnerVendorInterface.findAndCountAll.mockResolvedValue(
        mockPaginatedResponse
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
      expect(result).toEqual(expectedDropdownItems);
      expect(result).toHaveLength(5);
    });

    it("should get vendor owner dropdown with owner number filter", async () => {
      const dto: vendorOwnerList = {
        vendorCompanyNumber: 10,
        ownerNo: 200,
        current_page: 1,
        items_per_page: 10,
      };

      mockOwnerVendorInterface.findAndCountAll.mockResolvedValue(
        mockPaginatedResponse
      );

      const result = await useCase.execute(dto);

      expect(mockOwnerVendorInterface.findAndCountAll).toHaveBeenCalledWith({
        vendorCompanyNumber: 10,
        vendorNo: undefined,
        ownerNo: 200,
        status: undefined,
        limit: 10,
        page: 1,
        offset: 0,
      });
      expect(result).toEqual(expectedDropdownItems);
      expect(result).toHaveLength(5);
    });

    it("should get vendor owner dropdown with status filter", async () => {
      const dto: vendorOwnerList = {
        vendorCompanyNumber: 10,
        ownerNo: 100,
        status: "A",
        current_page: 1,
        items_per_page: 10,
      };

      mockOwnerVendorInterface.findAndCountAll.mockResolvedValue(
        mockPaginatedResponse
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
      expect(result).toEqual(expectedDropdownItems);
      expect(result).toHaveLength(5);
    });

    it("should get vendor owner dropdown with all filters", async () => {
      const dto: vendorOwnerList = {
        vendorCompanyNumber: 10,
        vendorNo: 1001,
        ownerNo: 100,
        status: "A",
        current_page: 1,
        items_per_page: 10,
      };

      mockOwnerVendorInterface.findAndCountAll.mockResolvedValue(
        mockPaginatedResponse
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
      expect(result).toEqual(expectedDropdownItems);
      expect(result).toHaveLength(5);
    });

    it("should get vendor owner dropdown with custom pagination", async () => {
      const dto: vendorOwnerList = {
        vendorCompanyNumber: 10,
        ownerNo: 100,
        current_page: 2,
        items_per_page: 5,
      };

      const customResponse = {
        items: mockOwnerVendorMappings.slice(0, 5),
        pagination: {
          total_items: 10,
          current_page: 2,
          items_per_page: 5,
          total_pages: 2,
        },
      } as PaginatedResponse<OwnerVendorEntity>;

      const customDropdownItems = mockOwnerVendorMappings
        .slice(0, 5)
        .map((mapping) => ({
          id: mapping.ownerNo,
          value: mapping.ownerNo,
          label: mapping.ownerNo,
        }));

      mockOwnerVendorInterface.findAndCountAll.mockResolvedValue(
        customResponse
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
      expect(result).toEqual(customDropdownItems);
      expect(result).toHaveLength(5);
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

      const company25Response = {
        items: company25Mappings,
        pagination: {
          total_items: 3,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      } as PaginatedResponse<OwnerVendorEntity>;

      const company25DropdownItems = company25Mappings.map((mapping) => ({
        id: mapping.ownerNo,
        value: mapping.ownerNo,
        label: mapping.ownerNo,
      }));

      mockOwnerVendorInterface.findAndCountAll.mockResolvedValue(
        company25Response
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
      expect(result).toEqual(company25DropdownItems);
      expect(result).toHaveLength(3);
    });

    it("should handle empty owner vendor mapping list", async () => {
      const dto: vendorOwnerList = {
        vendorCompanyNumber: 10,
        ownerNo: 100,
        current_page: 1,
        items_per_page: 10,
      };

      const emptyResponse = {
        items: [],
        pagination: {
          total_items: 0,
          current_page: 1,
          items_per_page: 10,
          total_pages: 0,
        },
      } as PaginatedResponse<OwnerVendorEntity>;

      mockOwnerVendorInterface.findAndCountAll.mockResolvedValue(emptyResponse);

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
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should handle single owner vendor mapping", async () => {
      const dto: vendorOwnerList = {
        vendorCompanyNumber: 10,
        ownerNo: 100,
        current_page: 1,
        items_per_page: 10,
      };

      const singleMapping = VendorFactory.createOwnerVendorMapping({
        ownerNo: 999,
        vendorNo: 1001,
      });

      const singleResponse = {
        items: [singleMapping],
        pagination: {
          total_items: 1,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      } as PaginatedResponse<OwnerVendorEntity>;

      const singleDropdownItem = [
        {
          id: singleMapping.ownerNo,
          value: singleMapping.ownerNo,
          label: singleMapping.ownerNo,
        },
      ];

      mockOwnerVendorInterface.findAndCountAll.mockResolvedValue(
        singleResponse
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
      expect(result).toEqual(singleDropdownItem);
      expect(result).toHaveLength(1);
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

      const largeResponse = {
        items: largeMappingList.slice(40, 60), // Page 3 with 20 items
        pagination: {
          total_items: 100,
          current_page: 3,
          items_per_page: 20,
          total_pages: 5,
        },
      } as PaginatedResponse<OwnerVendorEntity>;

      const largeDropdownItems = largeMappingList
        .slice(40, 60)
        .map((mapping) => ({
          id: mapping.ownerNo,
          value: mapping.ownerNo,
          label: mapping.ownerNo,
        }));

      mockOwnerVendorInterface.findAndCountAll.mockResolvedValue(largeResponse);

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
      expect(result).toEqual(largeDropdownItems);
      expect(result).toHaveLength(20);
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

      const inactiveResponse = {
        items: inactiveMappings,
        pagination: {
          total_items: 2,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      } as PaginatedResponse<OwnerVendorEntity>;

      const inactiveDropdownItems = inactiveMappings.map((mapping) => ({
        id: mapping.ownerNo,
        value: mapping.ownerNo,
        label: mapping.ownerNo,
      }));

      mockOwnerVendorInterface.findAndCountAll.mockResolvedValue(
        inactiveResponse
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
      expect(result).toEqual(inactiveDropdownItems);
      expect(result).toHaveLength(2);
    });

    it("should format dropdown items correctly", async () => {
      const dto: vendorOwnerList = {
        vendorCompanyNumber: 10,
        ownerNo: 100,
        current_page: 1,
        items_per_page: 10,
      };

      const testMappings = [
        VendorFactory.createOwnerVendorMapping({
          ownerNo: 123,
          vendorNo: 1001,
        }),
        VendorFactory.createOwnerVendorMapping({
          ownerNo: 456,
          vendorNo: 1002,
        }),
        VendorFactory.createOwnerVendorMapping({
          ownerNo: 789,
          vendorNo: 1003,
        }),
      ];

      const testResponse = {
        items: testMappings,
        pagination: {
          total_items: 3,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      } as PaginatedResponse<OwnerVendorEntity>;

      const expectedFormattedItems = [
        { id: 123, value: 123, label: 123 },
        { id: 456, value: 456, label: 456 },
        { id: 789, value: 789, label: 789 },
      ];

      mockOwnerVendorInterface.findAndCountAll.mockResolvedValue(testResponse);

      const result = await useCase.execute(dto);

      expect(result).toEqual(expectedFormattedItems);
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ id: 123, value: 123, label: 123 });
      expect(result[1]).toEqual({ id: 456, value: 456, label: 456 });
      expect(result[2]).toEqual({ id: 789, value: 789, label: 789 });
    });

    it("should handle search query normalization correctly", async () => {
      const dto: vendorOwnerList = {
        vendorCompanyNumber: 10,
        ownerNo: 100,
        current_page: 5,
        items_per_page: 25,
      };

      const customResponse = {
        items: mockOwnerVendorMappings,
        pagination: {
          total_items: 100,
          current_page: 5,
          items_per_page: 25,
          total_pages: 4,
        },
      } as PaginatedResponse<OwnerVendorEntity>;

      mockOwnerVendorInterface.findAndCountAll.mockResolvedValue(
        customResponse
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
      expect(result).toEqual(expectedDropdownItems);
    });
  });
});
