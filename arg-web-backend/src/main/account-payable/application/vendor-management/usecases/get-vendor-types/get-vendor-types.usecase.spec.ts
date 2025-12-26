import { Test, TestingModule } from "@nestjs/testing";
import { VendorTypesUsecase } from "./get-vendor-types.usecase";
import { VendorSharedService } from "../../shared-services/vendor.shared.service";

describe("VendorTypesUsecase", () => {
  let useCase: VendorTypesUsecase;
  let mockVendorSharedService: jest.Mocked<VendorSharedService>;

  const mockVendorTypes = [
    { id: "E", name: "Employee" },
    { id: "S", name: "Service" },
    { id: "V", name: "Vendor" },
    { id: "C", name: "Carrier" },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendorTypesUsecase,
        {
          provide: VendorSharedService,
          useValue: {
            getVendorTypes: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<VendorTypesUsecase>(VendorTypesUsecase);
    mockVendorSharedService = module.get(VendorSharedService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("should get vendor types successfully", async () => {
      mockVendorSharedService.getVendorTypes.mockResolvedValue(mockVendorTypes);

      const result = await useCase.execute();

      expect(mockVendorSharedService.getVendorTypes).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockVendorTypes);
      expect(result).toHaveLength(4);
    });

    it("should handle empty vendor types list", async () => {
      mockVendorSharedService.getVendorTypes.mockResolvedValue([]);

      const result = await useCase.execute();

      expect(mockVendorSharedService.getVendorTypes).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should handle single vendor type", async () => {
      const singleType = [{ id: "E", name: "Employee" }];
      mockVendorSharedService.getVendorTypes.mockResolvedValue(singleType);

      const result = await useCase.execute();

      expect(mockVendorSharedService.getVendorTypes).toHaveBeenCalledTimes(1);
      expect(result).toEqual(singleType);
      expect(result).toHaveLength(1);
    });

    it("should handle large vendor types list", async () => {
      const largeTypesList = Array.from({ length: 20 }, (_, index) => ({
        id: `T${index + 1}`,
        name: `Type ${index + 1}`,
      }));

      mockVendorSharedService.getVendorTypes.mockResolvedValue(largeTypesList);

      const result = await useCase.execute();

      expect(mockVendorSharedService.getVendorTypes).toHaveBeenCalledTimes(1);
      expect(result).toEqual(largeTypesList);
      expect(result).toHaveLength(20);
    });

    it("should handle vendor types with special characters", async () => {
      const specialTypes = [
        { id: "E&V", name: "Employee & Vendor" },
        { id: "S-C", name: "Service-Carrier" },
        { id: "V/C", name: "Vendor/Carrier" },
      ];

      mockVendorSharedService.getVendorTypes.mockResolvedValue(specialTypes);

      const result = await useCase.execute();

      expect(mockVendorSharedService.getVendorTypes).toHaveBeenCalledTimes(1);
      expect(result).toEqual(specialTypes);
      expect(result).toHaveLength(3);
    });

    it("should handle vendor types with numeric IDs", async () => {
      const numericTypes = [
        { id: "1", name: "Type One" },
        { id: "2", name: "Type Two" },
        { id: "10", name: "Type Ten" },
      ];

      mockVendorSharedService.getVendorTypes.mockResolvedValue(numericTypes);

      const result = await useCase.execute();

      expect(mockVendorSharedService.getVendorTypes).toHaveBeenCalledTimes(1);
      expect(result).toEqual(numericTypes);
      expect(result).toHaveLength(3);
    });

    it("should handle vendor types with long names", async () => {
      const longNameTypes = [
        {
          id: "L",
          name: "This is a very long vendor type name that exceeds normal length",
        },
        { id: "M", name: "Another long name for testing purposes" },
      ];

      mockVendorSharedService.getVendorTypes.mockResolvedValue(longNameTypes);

      const result = await useCase.execute();

      expect(mockVendorSharedService.getVendorTypes).toHaveBeenCalledTimes(1);
      expect(result).toEqual(longNameTypes);
      expect(result).toHaveLength(2);
    });

    it("should handle vendor types with empty names", async () => {
      const emptyNameTypes = [
        { id: "E", name: "" },
        { id: "S", name: "Service" },
        { id: "V", name: null },
      ];

      mockVendorSharedService.getVendorTypes.mockResolvedValue(emptyNameTypes);

      const result = await useCase.execute();

      expect(mockVendorSharedService.getVendorTypes).toHaveBeenCalledTimes(1);
      expect(result).toEqual(emptyNameTypes);
      expect(result).toHaveLength(3);
    });

    it("should handle service errors gracefully", async () => {
      const error = new Error("Service unavailable");
      mockVendorSharedService.getVendorTypes.mockRejectedValue(error);

      await expect(useCase.execute()).rejects.toThrow("Service unavailable");
      expect(mockVendorSharedService.getVendorTypes).toHaveBeenCalledTimes(1);
    });

    it("should handle database connection errors", async () => {
      const error = new Error("Database connection failed");
      mockVendorSharedService.getVendorTypes.mockRejectedValue(error);

      await expect(useCase.execute()).rejects.toThrow(
        "Database connection failed"
      );
      expect(mockVendorSharedService.getVendorTypes).toHaveBeenCalledTimes(1);
    });

    it("should handle timeout errors", async () => {
      const error = new Error("Request timeout");
      mockVendorSharedService.getVendorTypes.mockRejectedValue(error);

      await expect(useCase.execute()).rejects.toThrow("Request timeout");
      expect(mockVendorSharedService.getVendorTypes).toHaveBeenCalledTimes(1);
    });

    it("should handle undefined response", async () => {
      mockVendorSharedService.getVendorTypes.mockResolvedValue(undefined);

      const result = await useCase.execute();

      expect(mockVendorSharedService.getVendorTypes).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it("should handle null response", async () => {
      mockVendorSharedService.getVendorTypes.mockResolvedValue(null);

      const result = await useCase.execute();

      expect(mockVendorSharedService.getVendorTypes).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it("should handle malformed vendor types data", async () => {
      const malformedTypes = [
        { id: "E", name: "Employee" },
        { id: "S" }, // Missing name
        { name: "Vendor" }, // Missing id
        {}, // Empty object
        null, // Null value
      ];

      mockVendorSharedService.getVendorTypes.mockResolvedValue(malformedTypes);

      const result = await useCase.execute();

      expect(mockVendorSharedService.getVendorTypes).toHaveBeenCalledTimes(1);
      expect(result).toEqual(malformedTypes);
      expect(result).toHaveLength(5);
    });

    it("should handle vendor types with duplicate IDs", async () => {
      const duplicateTypes = [
        { id: "E", name: "Employee" },
        { id: "E", name: "Employee Duplicate" },
        { id: "S", name: "Service" },
      ];

      mockVendorSharedService.getVendorTypes.mockResolvedValue(duplicateTypes);

      const result = await useCase.execute();

      expect(mockVendorSharedService.getVendorTypes).toHaveBeenCalledTimes(1);
      expect(result).toEqual(duplicateTypes);
      expect(result).toHaveLength(3);
    });

    it("should handle vendor types with whitespace", async () => {
      const whitespaceTypes = [
        { id: " E ", name: " Employee " },
        { id: "S", name: "Service" },
        { id: "V", name: "  Vendor  " },
      ];

      mockVendorSharedService.getVendorTypes.mockResolvedValue(whitespaceTypes);

      const result = await useCase.execute();

      expect(mockVendorSharedService.getVendorTypes).toHaveBeenCalledTimes(1);
      expect(result).toEqual(whitespaceTypes);
      expect(result).toHaveLength(3);
    });
  });
});
