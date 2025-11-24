import { Test, TestingModule } from "@nestjs/testing";
import { GetDropdownDataUsecase } from "./get-filters-list.usecase";
import {
  DropdownTypeEnum,
  DropdownDbTypeEnum,
} from "@src/shared/utils/dropdown";
import { DropdownInterface } from "../../../../domain/interface/filters-list.interface";

describe("GetDropdownDataUsecase", () => {
  let usecase: GetDropdownDataUsecase;
  let mockFiltersListRepository: jest.Mocked<DropdownInterface>;

  beforeEach(async () => {
    mockFiltersListRepository = {
      getDropdownData: jest.fn(),
    } as jest.Mocked<DropdownInterface>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetDropdownDataUsecase,
        {
          provide: "DropdownInterface",
          useValue: mockFiltersListRepository,
        },
      ],
    }).compile();

    usecase = module.get<GetDropdownDataUsecase>(GetDropdownDataUsecase);
  });

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

  describe("execute", () => {
    it("should get process types dropdown data", async () => {
      const mockProcessTypes = {
        rows: [
          { id: "1", value: "NORMAL", label: "Normal" },
          { id: "2", value: "ARGLMS", label: "LMS" },
          { id: "3", value: "PAPER", label: "Paper" },
          { id: "4", value: "FLEXI", label: "Flexi" },
          { id: "5", value: "SOGAS", label: "SOGAS" },
        ],
        count: 5,
      };

      mockFiltersListRepository.getDropdownData.mockResolvedValue(
        mockProcessTypes
      );

      const request = {
        type: DropdownTypeEnum.PROCESS_TYPES,
      };

      const result = await usecase.execute(request);

      expect(result.items).toHaveLength(5);
      expect(result.items[0]?.id).toBe("1");
      expect(result.items[0]?.value).toBe("NORMAL");
      expect(result.items[0]?.label).toBe("Normal");
      expect(result.pagination).toBeDefined();
      expect(result.pagination.total_items).toBe(5);
      expect(result.pagination.current_page).toBe(1);
      expect(mockFiltersListRepository.getDropdownData).toHaveBeenCalledWith(
        DropdownTypeEnum.PROCESS_TYPES,
        {
          companyNo: undefined,
          search: undefined,
          page: 1,
          limit: 500,
          offset: 0,
          sortBy: undefined,
          sortOrder: "asc",
        }
      );
    });

    it("should get form type dropdown data", async () => {
      const mockFormTypes = {
        rows: [
          { id: "M", value: "Misc", label: "Misc" },
          { id: "N", value: "NEC", label: "NEC" },
        ],
        count: 2,
      };

      mockFiltersListRepository.getDropdownData.mockResolvedValue(
        mockFormTypes
      );

      const request = {
        type: DropdownTypeEnum.FORM_TYPE,
      };

      const result = await usecase.execute(request);

      expect(result.items).toHaveLength(2);
      expect(result.items[0]?.id).toBe("M");
      expect(result.items[0]?.value).toBe("Misc");
      expect(result.items[0]?.label).toBe("Misc");
      expect(result.pagination).toBeDefined();
      expect(result.pagination.total_items).toBe(2);
      expect(mockFiltersListRepository.getDropdownData).toHaveBeenCalledWith(
        DropdownTypeEnum.FORM_TYPE,
        {
          companyNo: undefined,
          search: undefined,
          page: 1,
          limit: 500,
          offset: 0,
          sortBy: undefined,
          sortOrder: "asc",
        }
      );
    });

    it("should get payment for report types dropdown data", async () => {
      const mockPaymentTypes = {
        rows: [
          { id: "C", value: "Current Year", label: "Current Year" },
          { id: "P", value: "Prior Year", label: "Prior Year" },
        ],
        count: 2,
      };

      mockFiltersListRepository.getDropdownData.mockResolvedValue(
        mockPaymentTypes
      );

      const request = {
        type: DropdownTypeEnum.PAYMENT_FOR_REPORT_TYPES,
      };

      const result = await usecase.execute(request);

      expect(result.items).toHaveLength(2);
      expect(result.items[0]?.id).toBe("C");
      expect(result.items[0]?.value).toBe("Current Year");
      expect(result.items[0]?.label).toBe("Current Year");
      expect(result.pagination).toBeDefined();
      expect(result.pagination.total_items).toBe(2);
      expect(mockFiltersListRepository.getDropdownData).toHaveBeenCalledWith(
        DropdownTypeEnum.PAYMENT_FOR_REPORT_TYPES,
        {
          companyNo: undefined,
          search: undefined,
          page: 1,
          limit: 500,
          offset: 0,
          sortBy: undefined,
          sortOrder: "asc",
        }
      );
    });

    it("should throw error for unsupported dropdown type", async () => {
      const request = {
        type: "unsupported" as DropdownTypeEnum,
      };

      // Mock the repository to throw an error for unsupported types
      mockFiltersListRepository.getDropdownData.mockRejectedValue(
        new Error("Dropdown type 'unsupported' not found")
      );

      await expect(usecase.execute(request)).rejects.toThrow(
        "Dropdown type 'unsupported' not found"
      );
    });

    it("should get vendor names from database repository", async () => {
      const mockVendorCategories = {
        rows: [
          { id: "E", value: "Employee", label: "Employee" },
          { id: "C", value: "Contractor", label: "Contractor" },
        ],
        count: 2,
      };

      mockFiltersListRepository.getDropdownData.mockResolvedValue(
        mockVendorCategories
      );

      const request = {
        type: DropdownDbTypeEnum.VENDOR_NAMES,
        companyNo: 10,
      };

      const result = await usecase.execute(request);

      expect(result.items).toEqual(mockVendorCategories.rows);
      expect(result.pagination).toBeDefined();
      expect(result.pagination.total_items).toBe(2);
      expect(mockFiltersListRepository.getDropdownData).toHaveBeenCalledWith(
        DropdownDbTypeEnum.VENDOR_NAMES,
        {
          companyNo: 10,
          search: undefined,
          page: 1,
          limit: 500,
          offset: 0,
          sortBy: undefined,
          sortOrder: "asc",
        }
      );
    });

    it("should get company names from database repository", async () => {
      const mockCompanyNames = {
        rows: [
          { id: "NYC", value: "NYC", label: "New York City" },
          { id: "LA", value: "LA", label: "Los Angeles" },
        ],
        count: 2,
      };

      mockFiltersListRepository.getDropdownData.mockResolvedValue(
        mockCompanyNames
      );

      const request = {
        type: DropdownDbTypeEnum.COMPANY_NAMES,
        companyNo: 10,
        search: "York",
        current_page: 1,
        items_per_page: 5,
      };

      const result = await usecase.execute(request);

      expect(result.items).toEqual(mockCompanyNames.rows);
      expect(result.pagination).toBeDefined();
      expect(result.pagination.total_items).toBe(2);
      expect(mockFiltersListRepository.getDropdownData).toHaveBeenCalledWith(
        DropdownDbTypeEnum.COMPANY_NAMES,
        {
          companyNo: 10,
          search: "York",
          page: 1,
          limit: 5,
          offset: 0,
          sortBy: undefined,
          sortOrder: "asc",
        }
      );
    });

    it("should get expense GL accounts from database repository", async () => {
      const mockExpenseGL = {
        rows: [
          {
            id: "328001",
            value: "Description 1",
            label: "328001 - Description 1",
          },
          {
            id: "328043",
            value: "Description 2",
            label: "328043 - Description 2",
          },
        ],
        count: 2,
      };

      mockFiltersListRepository.getDropdownData.mockResolvedValue(
        mockExpenseGL
      );

      const request = {
        type: DropdownDbTypeEnum.EXPENSE_GL,
        companyNo: 10,
        current_page: 2,
        items_per_page: 10,
      };

      const result = await usecase.execute(request);

      expect(result.items).toEqual(mockExpenseGL.rows);
      expect(result.pagination).toBeDefined();
      expect(result.pagination.total_items).toBe(2);
      expect(result.pagination.current_page).toBe(2);
      expect(mockFiltersListRepository.getDropdownData).toHaveBeenCalledWith(
        DropdownDbTypeEnum.EXPENSE_GL,
        {
          companyNo: 10,
          search: undefined,
          page: 2,
          limit: 10,
          offset: 10,
          sortBy: undefined,
          sortOrder: "asc",
        }
      );
    });
  });
});
