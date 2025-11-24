import { Test, TestingModule } from "@nestjs/testing";
import { FiltersListRepository } from "./filters-list.repository";
import { DropdownDbTypeEnum } from "@src/shared/utils/dropdown";
import { VendorRepository } from "@src/main/account-payable/data/repositories/vendor.repository";
import { CompanyRepository } from "@src/main/account-payable/data/repositories/company.repository";
import { GlMasterRepository } from "@src/main/account-payable/data/repositories/gl-master.repository";

describe("FiltersListRepository", () => {
  let repository: FiltersListRepository;
  let mockVendorRepository: jest.Mocked<VendorRepository>;
  let mockCompanyRepository: jest.Mocked<CompanyRepository>;
  let mockGlMasterRepository: jest.Mocked<GlMasterRepository>;
  let mockGeneralSystemRepository: any;
  let mockCarrierRepository: any;

  beforeEach(async () => {
    // Create mock repositories
    mockVendorRepository = {
      getVendorCategoriesForDropdown: jest.fn(),
    } as any;

    mockCompanyRepository = {
      getCompanyNamesForDropdown: jest.fn(),
    } as any;

    mockGlMasterRepository = {
      getExpenseGLAccountsForDropdown: jest.fn(),
    } as any;

    mockGeneralSystemRepository = {
      getProcessTypesForDropdown: jest.fn(),
    } as any;

    mockCarrierRepository = {
      getCarrierNamesForDropdown: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FiltersListRepository,
        {
          provide: "VendorRepository",
          useValue: mockVendorRepository,
        },
        {
          provide: "CompanyRepository",
          useValue: mockCompanyRepository,
        },
        {
          provide: "GlMasterRepository",
          useValue: mockGlMasterRepository,
        },
        {
          provide: "GeneralSystemRepository",
          useValue: mockGeneralSystemRepository,
        },
        {
          provide: "CarrierRepository",
          useValue: mockCarrierRepository,
        },
      ],
    }).compile();

    repository = module.get<FiltersListRepository>(FiltersListRepository);
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  describe("getDropdownData", () => {
    it("should get vendor names dropdown data", async () => {
      const mockVendors = [
        { vendorNo: 1, vendorName: "Employee Vendor" },
        { vendorNo: 2, vendorName: "Contractor Vendor" },
      ];

      mockVendorRepository.getVendorCategoriesForDropdown.mockResolvedValue({
        rows: mockVendors as any,
        count: 2,
      });

      const result = await repository.getDropdownData(
        DropdownDbTypeEnum.VENDOR_NAMES,
        { companyNo: 10 }
      );

      expect(result.rows).toHaveLength(2);
      expect(result.rows[0]).toEqual({
        id: "1",
        value: "Employee Vendor",
        label: "Employee Vendor",
      });
      expect(result.rows[1]).toEqual({
        id: "2",
        value: "Contractor Vendor",
        label: "Contractor Vendor",
      });
      expect(result.count).toBe(2);
      expect(
        mockVendorRepository.getVendorCategoriesForDropdown
      ).toHaveBeenCalledWith(
        10, // companyNo
        undefined, // search
        10, // limit (default)
        0 // offset (default)
      );
    });

    it("should get company names dropdown data", async () => {
      const mockCompanies = [
        { companyNo: 1, companyName: "New York Company" },
        { companyNo: 2, companyName: "Los Angeles Company" },
      ];

      mockCompanyRepository.getCompanyNamesForDropdown.mockResolvedValue({
        rows: mockCompanies as any,
        count: 2,
      });

      const result = await repository.getDropdownData(
        DropdownDbTypeEnum.COMPANY_NAMES,
        { companyNo: 10 }
      );

      expect(result.rows).toHaveLength(2);
      expect(result.rows[0]).toEqual({
        id: "1",
        value: "New York Company",
        label: "New York Company",
      });
      expect(result.rows[1]).toEqual({
        id: "2",
        value: "Los Angeles Company",
        label: "Los Angeles Company",
      });
      expect(result.count).toBe(2);
    });

    it("should get expense GL accounts dropdown data", async () => {
      const mockAccounts = [
        { accountNo: 1000, description: "Office Supplies" },
        { accountNo: 2000, description: "Travel Expenses" },
      ];

      mockGlMasterRepository.getExpenseGLAccountsForDropdown.mockResolvedValue({
        rows: mockAccounts as any,
        count: 2,
      });

      const result = await repository.getDropdownData(
        DropdownDbTypeEnum.EXPENSE_GL,
        { companyNo: 10 }
      );

      expect(result.rows).toHaveLength(2);
      expect(result.rows[0]).toEqual({
        id: "1000",
        value: "Office Supplies",
        label: "1000 - Office Supplies",
      });
      expect(result.rows[1]).toEqual({
        id: "2000",
        value: "Travel Expenses",
        label: "2000 - Travel Expenses",
      });
      expect(result.count).toBe(2);
    });

    it("should throw error for unsupported dropdown type", async () => {
      await expect(
        repository.getDropdownData("UNSUPPORTED_TYPE" as DropdownDbTypeEnum)
      ).rejects.toThrow("Dropdown type 'UNSUPPORTED_TYPE' not found");
    });

    it("should apply search filter for vendor names", async () => {
      const mockVendors = [{ vendorNo: 1, vendorName: "Employee Vendor" }];
      mockVendorRepository.getVendorCategoriesForDropdown.mockResolvedValue({
        rows: mockVendors as any,
        count: 1,
      });

      await repository.getDropdownData(DropdownDbTypeEnum.VENDOR_NAMES, {
        search: "E",
      });

      expect(
        mockVendorRepository.getVendorCategoriesForDropdown
      ).toHaveBeenCalledWith(
        1, // companyNo (default)
        "E", // search
        10, // limit (default)
        0 // offset (default)
      );
    });
  });
});
