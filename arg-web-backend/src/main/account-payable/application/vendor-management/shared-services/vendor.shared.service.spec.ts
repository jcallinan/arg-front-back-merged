import { Test, TestingModule } from "@nestjs/testing";
import { VendorSharedService } from "./vendor.shared.service";
import { VendorInterface } from "@src/main/account-payable/domain/interface/vendor.interface";
import { CompanyInterface } from "@src/main/account-payable/domain/interface/company.interface";
import { Company } from "@src/main/account-payable/domain/entities/company.entity";
import { AppLogger } from "@src/shared/logger/logger.service";
import { vendorTypesFormatter } from "@src/shared/formatters/dropdown.formatter";
import { VendorType } from "@src/shared/constants/constant";

// Mock the formatter function
jest.mock("@src/shared/formatters/dropdown.formatter", () => ({
  vendorTypesFormatter: jest.fn(),
}));

// Mock the logger
jest.mock("@src/shared/logger/logger.service");

describe("VendorSharedService", () => {
  let service: VendorSharedService;
  let mockVendorInterface: jest.Mocked<VendorInterface>;
  let mockCompanyInterface: jest.Mocked<CompanyInterface>;

  const mockVendorTypes = [
    { vendorHoldPaymentsVend: "E" },
    { vendorHoldPaymentsVend: "A" },
    { vendorHoldPaymentsVend: "W" },
  ];

  const mockFormattedVendorTypes = [
    { id: "E", value: "Employee", label: "Employee" },
    { id: "A", value: VendorType.A, label: VendorType.A },
    { id: "W", value: "Wire", label: "Wire" },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendorSharedService,
        {
          provide: "VendorInterface",
          useValue: {
            getVendorTypes: jest.fn(),
          },
        },
        {
          provide: "CompanyInterface",
          useValue: {
            updateNextEntryNo: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VendorSharedService>(VendorSharedService);
    mockVendorInterface = module.get("VendorInterface");
    mockCompanyInterface = module.get("CompanyInterface");
    // Remove the mockLogger line since we're not using it in the tests

    // Reset mocks
    jest.clearAllMocks();

    // Mock the formatter to return expected result
    (vendorTypesFormatter as jest.Mock).mockReturnValue(
      mockFormattedVendorTypes
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getVendorTypes", () => {
    it("should get vendor types successfully", async () => {
      mockVendorInterface.getVendorTypes.mockResolvedValue(mockVendorTypes);

      const result = await service.getVendorTypes();

      expect(mockVendorInterface.getVendorTypes).toHaveBeenCalledTimes(1);
      expect(vendorTypesFormatter).toHaveBeenCalledWith(mockVendorTypes);
      expect(result).toEqual(mockFormattedVendorTypes);
    });

    it("should handle empty vendor types list", async () => {
      const emptyVendorTypes: any[] = [];
      mockVendorInterface.getVendorTypes.mockResolvedValue(emptyVendorTypes);
      (vendorTypesFormatter as jest.Mock).mockReturnValue([]);

      const result = await service.getVendorTypes();

      expect(mockVendorInterface.getVendorTypes).toHaveBeenCalledTimes(1);
      expect(vendorTypesFormatter).toHaveBeenCalledWith(emptyVendorTypes);
      expect(result).toEqual([]);
    });

    it("should handle single vendor type", async () => {
      const singleVendorType = [{ vendorHoldPaymentsVend: "A" }];
      const singleFormattedType = [
        { id: "A", value: VendorType.A, label: VendorType.A },
      ];

      mockVendorInterface.getVendorTypes.mockResolvedValue(singleVendorType);
      (vendorTypesFormatter as jest.Mock).mockReturnValue(singleFormattedType);

      const result = await service.getVendorTypes();

      expect(mockVendorInterface.getVendorTypes).toHaveBeenCalledTimes(1);
      expect(vendorTypesFormatter).toHaveBeenCalledWith(singleVendorType);
      expect(result).toEqual(singleFormattedType);
    });

    it("should handle vendor interface errors gracefully", async () => {
      const error = new Error("Database connection failed");
      mockVendorInterface.getVendorTypes.mockRejectedValue(error);

      await expect(service.getVendorTypes()).rejects.toThrow(
        "Database connection failed"
      );
      expect(mockVendorInterface.getVendorTypes).toHaveBeenCalledTimes(1);
    });
  });

  describe("getAndIncrementNextEntryNo", () => {
    it("should get and increment next entry number successfully", async () => {
      const company = new Company({
        companyNo: 1,
        companyName: "Test Company",
        companyVendorNextEntryNo: 1000,
      });

      mockCompanyInterface.updateNextEntryNo.mockResolvedValue(company);

      const result = await service.getAndIncrementNextEntryNo(company, 1);

      expect(mockCompanyInterface.updateNextEntryNo).toHaveBeenCalledWith(
        1,
        undefined,
        1001
      );
      expect(result).toBe(1000);
    });

    it("should handle reserve count greater than 1", async () => {
      const company = new Company({
        companyNo: 1,
        companyName: "Test Company",
        companyVendorNextEntryNo: 1000,
      });

      mockCompanyInterface.updateNextEntryNo.mockResolvedValue(company);

      const result = await service.getAndIncrementNextEntryNo(company, 5);

      expect(mockCompanyInterface.updateNextEntryNo).toHaveBeenCalledWith(
        1,
        undefined,
        1005
      );
      expect(result).toBe(1000);
    });

    it("should reset to 1 when current entry number is 99999", async () => {
      const company = new Company({
        companyNo: 1,
        companyName: "Test Company",
        companyVendorNextEntryNo: 99999,
      });

      mockCompanyInterface.updateNextEntryNo.mockResolvedValue(company);

      const result = await service.getAndIncrementNextEntryNo(company, 1);

      expect(mockCompanyInterface.updateNextEntryNo).toHaveBeenCalledWith(
        1,
        undefined,
        1
      );
      expect(result).toBe(99999);
    });

    it("should handle reserve count when current entry number is 99999", async () => {
      const company = new Company({
        companyNo: 1,
        companyName: "Test Company",
        companyVendorNextEntryNo: 99999,
      });

      mockCompanyInterface.updateNextEntryNo.mockResolvedValue(company);

      const result = await service.getAndIncrementNextEntryNo(company, 3);

      expect(mockCompanyInterface.updateNextEntryNo).toHaveBeenCalledWith(
        1,
        undefined,
        1
      );
      expect(result).toBe(99999);
    });

    it("should handle company interface errors gracefully", async () => {
      const company = new Company({
        companyNo: 1,
        companyName: "Test Company",
        companyVendorNextEntryNo: 1000,
      });

      const error = new Error("Update failed");
      mockCompanyInterface.updateNextEntryNo.mockRejectedValue(error);

      await expect(
        service.getAndIncrementNextEntryNo(company, 1)
      ).rejects.toThrow("Update failed");
      expect(mockCompanyInterface.updateNextEntryNo).toHaveBeenCalledWith(
        1,
        undefined,
        1001
      );
    });

    it("should handle edge case with very large reserve count", async () => {
      const company = new Company({
        companyNo: 1,
        companyName: "Test Company",
        companyVendorNextEntryNo: 99998,
      });

      mockCompanyInterface.updateNextEntryNo.mockResolvedValue(company);

      const result = await service.getAndIncrementNextEntryNo(company, 100000);

      expect(mockCompanyInterface.updateNextEntryNo).toHaveBeenCalledWith(
        1,
        undefined,
        199998
      );
      expect(result).toBe(99998);
    });

    it("should handle zero reserve count", async () => {
      const company = new Company({
        companyNo: 1,
        companyName: "Test Company",
        companyVendorNextEntryNo: 1000,
      });

      mockCompanyInterface.updateNextEntryNo.mockResolvedValue(company);

      const result = await service.getAndIncrementNextEntryNo(company, 0);

      expect(mockCompanyInterface.updateNextEntryNo).toHaveBeenCalledWith(
        1,
        undefined,
        1000
      );
      expect(result).toBe(1000);
    });

    it("should handle negative reserve count", async () => {
      const company = new Company({
        companyNo: 1,
        companyName: "Test Company",
        companyVendorNextEntryNo: 1000,
      });

      mockCompanyInterface.updateNextEntryNo.mockResolvedValue(company);

      const result = await service.getAndIncrementNextEntryNo(company, -5);

      expect(mockCompanyInterface.updateNextEntryNo).toHaveBeenCalledWith(
        1,
        undefined,
        995
      );
      expect(result).toBe(1000);
    });
  });

  describe("constructor", () => {
    it("should create service with injected dependencies", () => {
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(VendorSharedService);
    });

    it("should have logger instance", () => {
      expect(service["logger"]).toBeDefined();
      expect(service["logger"]).toBeInstanceOf(AppLogger);
    });
  });
});
