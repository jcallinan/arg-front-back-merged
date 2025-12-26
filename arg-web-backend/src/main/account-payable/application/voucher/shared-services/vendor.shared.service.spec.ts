import { Test, TestingModule } from "@nestjs/testing";
import { VendorSharedService } from "./vendor.shared.service";

describe("VendorSharedService", () => {
  let service: VendorSharedService;
  let mockVendorInterface: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendorSharedService,
        {
          provide: "VendorInterface",
          useValue: {
            getVendorNoByCompanyAndCarrierId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VendorSharedService>(VendorSharedService);
    mockVendorInterface = module.get("VendorInterface");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getVendorNoByCompanyAndCarrierId", () => {
    it("should fetch vendor successfully when vendor exists", async () => {
      const mockVendor = {
        id: 1,
        vendorNo: "V001",
        vendorName: "Test Vendor",
        companyNo: 10,
        carrierId: "CAR001",
      };

      mockVendorInterface.getVendorNoByCompanyAndCarrierId.mockResolvedValue(
        mockVendor
      );

      const result = await service.getVendorNoByCompanyAndCarrierId(
        10,
        "CAR001"
      );

      expect(result).toEqual(mockVendor);
      expect(
        mockVendorInterface.getVendorNoByCompanyAndCarrierId
      ).toHaveBeenCalledWith(10, "CAR001");
    });

    it("should return null when vendor does not exist", async () => {
      mockVendorInterface.getVendorNoByCompanyAndCarrierId.mockResolvedValue(
        null
      );

      const result = await service.getVendorNoByCompanyAndCarrierId(
        10,
        "NONEXISTENT"
      );

      expect(result).toBeNull();
      expect(
        mockVendorInterface.getVendorNoByCompanyAndCarrierId
      ).toHaveBeenCalledWith(10, "NONEXISTENT");
    });

    it("should handle different company numbers", async () => {
      const mockVendor = {
        id: 1,
        vendorNo: "V002",
        companyNo: 20,
        carrierId: "CAR002",
      };
      mockVendorInterface.getVendorNoByCompanyAndCarrierId.mockResolvedValue(
        mockVendor
      );

      const result = await service.getVendorNoByCompanyAndCarrierId(
        20,
        "CAR002"
      );

      expect(result).toEqual(mockVendor);
      expect(
        mockVendorInterface.getVendorNoByCompanyAndCarrierId
      ).toHaveBeenCalledWith(20, "CAR002");
    });

    it("should handle different carrier IDs", async () => {
      const mockVendor = {
        id: 1,
        vendorNo: "V003",
        companyNo: 10,
        carrierId: "CAR003",
      };
      mockVendorInterface.getVendorNoByCompanyAndCarrierId.mockResolvedValue(
        mockVendor
      );

      const result = await service.getVendorNoByCompanyAndCarrierId(
        10,
        "CAR003"
      );

      expect(result).toEqual(mockVendor);
      expect(
        mockVendorInterface.getVendorNoByCompanyAndCarrierId
      ).toHaveBeenCalledWith(10, "CAR003");
    });

    it("should handle interface errors gracefully", async () => {
      mockVendorInterface.getVendorNoByCompanyAndCarrierId.mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        service.getVendorNoByCompanyAndCarrierId(10, "CAR001")
      ).rejects.toThrow("Database error");
    });

    it("should handle empty carrier ID", async () => {
      const mockVendor = {
        id: 1,
        vendorNo: "V004",
        companyNo: 10,
        carrierId: "",
      };
      mockVendorInterface.getVendorNoByCompanyAndCarrierId.mockResolvedValue(
        mockVendor
      );

      const result = await service.getVendorNoByCompanyAndCarrierId(10, "");

      expect(result).toEqual(mockVendor);
      expect(
        mockVendorInterface.getVendorNoByCompanyAndCarrierId
      ).toHaveBeenCalledWith(10, "");
    });

    it("should handle zero company number", async () => {
      const mockVendor = {
        id: 1,
        vendorNo: "V005",
        companyNo: 0,
        carrierId: "CAR005",
      };
      mockVendorInterface.getVendorNoByCompanyAndCarrierId.mockResolvedValue(
        mockVendor
      );

      const result = await service.getVendorNoByCompanyAndCarrierId(
        0,
        "CAR005"
      );

      expect(result).toEqual(mockVendor);
      expect(
        mockVendorInterface.getVendorNoByCompanyAndCarrierId
      ).toHaveBeenCalledWith(0, "CAR005");
    });

    it("should handle negative company number", async () => {
      const mockVendor = {
        id: 1,
        vendorNo: "V006",
        companyNo: -1,
        carrierId: "CAR006",
      };
      mockVendorInterface.getVendorNoByCompanyAndCarrierId.mockResolvedValue(
        mockVendor
      );

      const result = await service.getVendorNoByCompanyAndCarrierId(
        -1,
        "CAR006"
      );

      expect(result).toEqual(mockVendor);
      expect(
        mockVendorInterface.getVendorNoByCompanyAndCarrierId
      ).toHaveBeenCalledWith(-1, "CAR006");
    });

    it("should handle very large company numbers", async () => {
      const largeCompanyNo = 999999999;
      const mockVendor = {
        id: 1,
        vendorNo: "V007",
        companyNo: largeCompanyNo,
        carrierId: "CAR007",
      };
      mockVendorInterface.getVendorNoByCompanyAndCarrierId.mockResolvedValue(
        mockVendor
      );

      const result = await service.getVendorNoByCompanyAndCarrierId(
        largeCompanyNo,
        "CAR007"
      );

      expect(result).toEqual(mockVendor);
      expect(
        mockVendorInterface.getVendorNoByCompanyAndCarrierId
      ).toHaveBeenCalledWith(largeCompanyNo, "CAR007");
    });

    it("should handle special characters in carrier ID", async () => {
      const specialCarrierId = "CAR-001_@#$%";
      const mockVendor = {
        id: 1,
        vendorNo: "V008",
        companyNo: 10,
        carrierId: specialCarrierId,
      };
      mockVendorInterface.getVendorNoByCompanyAndCarrierId.mockResolvedValue(
        mockVendor
      );

      const result = await service.getVendorNoByCompanyAndCarrierId(
        10,
        specialCarrierId
      );

      expect(result).toEqual(mockVendor);
      expect(
        mockVendorInterface.getVendorNoByCompanyAndCarrierId
      ).toHaveBeenCalledWith(10, specialCarrierId);
    });

    it("should handle whitespace in carrier ID", async () => {
      const whitespaceCarrierId = "  CAR 001  ";
      const mockVendor = {
        id: 1,
        vendorNo: "V009",
        companyNo: 10,
        carrierId: whitespaceCarrierId,
      };
      mockVendorInterface.getVendorNoByCompanyAndCarrierId.mockResolvedValue(
        mockVendor
      );

      const result = await service.getVendorNoByCompanyAndCarrierId(
        10,
        whitespaceCarrierId
      );

      expect(result).toEqual(mockVendor);
      expect(
        mockVendorInterface.getVendorNoByCompanyAndCarrierId
      ).toHaveBeenCalledWith(10, whitespaceCarrierId);
    });

    it("should handle undefined parameters", async () => {
      const mockVendor = {
        id: 1,
        vendorNo: "V010",
        companyNo: undefined,
        carrierId: undefined,
      };
      mockVendorInterface.getVendorNoByCompanyAndCarrierId.mockResolvedValue(
        mockVendor
      );

      const result = await service.getVendorNoByCompanyAndCarrierId(
        undefined as any,
        undefined as any
      );

      expect(result).toEqual(mockVendor);
      expect(
        mockVendorInterface.getVendorNoByCompanyAndCarrierId
      ).toHaveBeenCalledWith(undefined, undefined);
    });

    it("should handle null parameters", async () => {
      const mockVendor = {
        id: 1,
        vendorNo: "V011",
        companyNo: null,
        carrierId: null,
      };
      mockVendorInterface.getVendorNoByCompanyAndCarrierId.mockResolvedValue(
        mockVendor
      );

      const result = await service.getVendorNoByCompanyAndCarrierId(
        null as any,
        null as any
      );

      expect(result).toEqual(mockVendor);
      expect(
        mockVendorInterface.getVendorNoByCompanyAndCarrierId
      ).toHaveBeenCalledWith(null, null);
    });

    it("should handle vendor with minimal data", async () => {
      const minimalVendor = { id: 1 };
      mockVendorInterface.getVendorNoByCompanyAndCarrierId.mockResolvedValue(
        minimalVendor
      );

      const result = await service.getVendorNoByCompanyAndCarrierId(
        10,
        "CAR001"
      );

      expect(result).toEqual(minimalVendor);
    });

    it("should handle vendor with all fields populated", async () => {
      const fullVendor = {
        id: 1,
        vendorNo: "V012",
        vendorName: "Full Test Vendor",
        companyNo: 10,
        carrierId: "CAR012",
        address: "123 Test St",
        city: "Test City",
        state: "TS",
        zipCode: "12345",
        phone: "555-123-4567",
        email: "test@vendor.com",
        taxId: "12-3456789",
        terms: "Net 30",
        creditLimit: 10000,
        status: "A",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockVendorInterface.getVendorNoByCompanyAndCarrierId.mockResolvedValue(
        fullVendor
      );

      const result = await service.getVendorNoByCompanyAndCarrierId(
        10,
        "CAR012"
      );

      expect(result).toEqual(fullVendor);
    });

    it("should handle multiple calls with different parameters", async () => {
      const vendor1 = {
        id: 1,
        vendorNo: "V013",
        companyNo: 10,
        carrierId: "CAR013",
      };
      const vendor2 = {
        id: 2,
        vendorNo: "V014",
        companyNo: 20,
        carrierId: "CAR014",
      };

      mockVendorInterface.getVendorNoByCompanyAndCarrierId
        .mockResolvedValueOnce(vendor1)
        .mockResolvedValueOnce(vendor2);

      const result1 = await service.getVendorNoByCompanyAndCarrierId(
        10,
        "CAR013"
      );
      const result2 = await service.getVendorNoByCompanyAndCarrierId(
        20,
        "CAR014"
      );

      expect(result1).toEqual(vendor1);
      expect(result2).toEqual(vendor2);
      expect(
        mockVendorInterface.getVendorNoByCompanyAndCarrierId
      ).toHaveBeenCalledTimes(2);
    });

    it("should handle interface returning empty vendor object", async () => {
      const emptyVendor = {};
      mockVendorInterface.getVendorNoByCompanyAndCarrierId.mockResolvedValue(
        emptyVendor
      );

      const result = await service.getVendorNoByCompanyAndCarrierId(
        10,
        "CAR001"
      );

      expect(result).toEqual(emptyVendor);
    });
  });

  describe("service initialization", () => {
    it("should be defined", () => {
      expect(service).toBeDefined();
    });

    it("should have logger property", () => {
      expect(service["logger"]).toBeDefined();
    });

    it("should have vendorInterface property", () => {
      expect(service["vendorInterface"]).toBeDefined();
    });
  });

  describe("logging", () => {
    it("should log when fetching vendor", async () => {
      const mockVendor = {
        id: 1,
        vendorNo: "V015",
        companyNo: 10,
        carrierId: "CAR015",
      };
      mockVendorInterface.getVendorNoByCompanyAndCarrierId.mockResolvedValue(
        mockVendor
      );

      const logSpy = jest.spyOn(service["logger"], "log");

      await service.getVendorNoByCompanyAndCarrierId(10, "CAR015");

      expect(logSpy).toHaveBeenCalledWith(
        "Fetching vendor numbers for companyNo: 10 and carrierId: CAR015"
      );
    });

    it("should log when vendor not found", async () => {
      mockVendorInterface.getVendorNoByCompanyAndCarrierId.mockResolvedValue(
        null
      );

      const logSpy = jest.spyOn(service["logger"], "log");

      await service.getVendorNoByCompanyAndCarrierId(10, "NONEXISTENT");

      expect(logSpy).toHaveBeenCalledWith(
        "Fetching vendor numbers for companyNo: 10 and carrierId: NONEXISTENT"
      );
    });
  });
});
