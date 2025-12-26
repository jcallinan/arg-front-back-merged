import { Test, TestingModule } from "@nestjs/testing";
import { CreateUpdateVendorOwnerUsecase } from "./create-and-update-owner-mapping.usecase";
import { OwnerVendorInterface } from "@src/main/account-payable/domain/interface/owner-vendor.interface";
import { vendorOwnerDto } from "../../dto/vendor-management.dto";

describe("CreateUpdateVendorOwnerUsecase", () => {
  let useCase: CreateUpdateVendorOwnerUsecase;
  let mockOwnerVendorInterface: jest.Mocked<OwnerVendorInterface>;

  const mockVendorOwnerData: vendorOwnerDto = {
    ownerNo: 100,
    vendorNo: 1001,
    isDeleted: "A",
  };

  const mockSuccessResponse = {
    message: "Vendor owner mapping created/updated successfully",
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUpdateVendorOwnerUsecase,
        {
          provide: "OwnerVendorInterface",
          useValue: {
            createOrUpdateOwner: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateUpdateVendorOwnerUsecase>(
      CreateUpdateVendorOwnerUsecase
    );
    mockOwnerVendorInterface = module.get("OwnerVendorInterface");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("should create vendor owner mapping successfully", async () => {
      mockOwnerVendorInterface.createOrUpdateOwner.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(mockVendorOwnerData);

      expect(mockOwnerVendorInterface.createOrUpdateOwner).toHaveBeenCalledWith(
        100,
        1001,
        "A"
      );
      expect(result).toEqual(mockSuccessResponse);
      expect(result.message).toBe(
        "Vendor owner mapping created/updated successfully"
      );
    });

    it("should update vendor owner mapping successfully", async () => {
      const updateResponse = {
        message: "Vendor owner mapping updated successfully",
      };
      mockOwnerVendorInterface.createOrUpdateOwner.mockResolvedValue(
        updateResponse
      );

      const result = await useCase.execute(mockVendorOwnerData);

      expect(mockOwnerVendorInterface.createOrUpdateOwner).toHaveBeenCalledWith(
        100,
        1001,
        "A"
      );
      expect(result).toEqual(updateResponse);
      expect(result.message).toBe("Vendor owner mapping updated successfully");
    });

    it("should handle vendor owner mapping with active status", async () => {
      const activeMapping: vendorOwnerDto = {
        ownerNo: 100,
        vendorNo: 1001,
        isDeleted: "A",
      };

      mockOwnerVendorInterface.createOrUpdateOwner.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(activeMapping);

      expect(mockOwnerVendorInterface.createOrUpdateOwner).toHaveBeenCalledWith(
        100,
        1001,
        "A"
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it("should handle vendor owner mapping with inactive status", async () => {
      const inactiveMapping: vendorOwnerDto = {
        ownerNo: 100,
        vendorNo: 1001,
        isDeleted: "I",
      };

      mockOwnerVendorInterface.createOrUpdateOwner.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(inactiveMapping);

      expect(mockOwnerVendorInterface.createOrUpdateOwner).toHaveBeenCalledWith(
        100,
        1001,
        "I"
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it("should handle vendor owner mapping with deleted status", async () => {
      const deletedMapping: vendorOwnerDto = {
        ownerNo: 100,
        vendorNo: 1001,
        isDeleted: "D",
      };

      mockOwnerVendorInterface.createOrUpdateOwner.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(deletedMapping);

      expect(mockOwnerVendorInterface.createOrUpdateOwner).toHaveBeenCalledWith(
        100,
        1001,
        "D"
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it("should handle vendor owner mapping with different owner number", async () => {
      const differentOwnerMapping: vendorOwnerDto = {
        ownerNo: 999,
        vendorNo: 1001,
        isDeleted: "A",
      };

      mockOwnerVendorInterface.createOrUpdateOwner.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(differentOwnerMapping);

      expect(mockOwnerVendorInterface.createOrUpdateOwner).toHaveBeenCalledWith(
        999,
        1001,
        "A"
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it("should handle vendor owner mapping with different vendor number", async () => {
      const differentVendorMapping: vendorOwnerDto = {
        ownerNo: 100,
        vendorNo: 9999,
        isDeleted: "A",
      };

      mockOwnerVendorInterface.createOrUpdateOwner.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(differentVendorMapping);

      expect(mockOwnerVendorInterface.createOrUpdateOwner).toHaveBeenCalledWith(
        100,
        9999,
        "A"
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it("should handle vendor owner mapping with large numbers", async () => {
      const largeNumberMapping: vendorOwnerDto = {
        ownerNo: 99999,
        vendorNo: 99999,
        isDeleted: "A",
      };

      mockOwnerVendorInterface.createOrUpdateOwner.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(largeNumberMapping);

      expect(mockOwnerVendorInterface.createOrUpdateOwner).toHaveBeenCalledWith(
        99999,
        99999,
        "A"
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it("should handle vendor owner mapping with zero values", async () => {
      const zeroValueMapping: vendorOwnerDto = {
        ownerNo: 0,
        vendorNo: 0,
        isDeleted: "A",
      };

      mockOwnerVendorInterface.createOrUpdateOwner.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(zeroValueMapping);

      expect(mockOwnerVendorInterface.createOrUpdateOwner).toHaveBeenCalledWith(
        0,
        0,
        "A"
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it("should handle vendor owner mapping with negative numbers", async () => {
      const negativeMapping: vendorOwnerDto = {
        ownerNo: -100,
        vendorNo: -1001,
        isDeleted: "A",
      };

      mockOwnerVendorInterface.createOrUpdateOwner.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(negativeMapping);

      expect(mockOwnerVendorInterface.createOrUpdateOwner).toHaveBeenCalledWith(
        -100,
        -1001,
        "A"
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it("should handle vendor owner mapping with custom status", async () => {
      const customStatusMapping: vendorOwnerDto = {
        ownerNo: 100,
        vendorNo: 1001,
        isDeleted: "C", // Custom status
      };

      mockOwnerVendorInterface.createOrUpdateOwner.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(customStatusMapping);

      expect(mockOwnerVendorInterface.createOrUpdateOwner).toHaveBeenCalledWith(
        100,
        1001,
        "C"
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it("should handle vendor owner mapping with empty status", async () => {
      const emptyStatusMapping: vendorOwnerDto = {
        ownerNo: 100,
        vendorNo: 1001,
        isDeleted: "",
      };

      mockOwnerVendorInterface.createOrUpdateOwner.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(emptyStatusMapping);

      expect(mockOwnerVendorInterface.createOrUpdateOwner).toHaveBeenCalledWith(
        100,
        1001,
        ""
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it("should handle interface errors gracefully", async () => {
      const error = new Error("Database connection failed");
      mockOwnerVendorInterface.createOrUpdateOwner.mockRejectedValue(error);

      await expect(useCase.execute(mockVendorOwnerData)).rejects.toThrow(
        "Database connection failed"
      );
      expect(mockOwnerVendorInterface.createOrUpdateOwner).toHaveBeenCalledWith(
        100,
        1001,
        "A"
      );
    });

    it("should handle database timeout errors", async () => {
      const error = new Error("Database timeout");
      mockOwnerVendorInterface.createOrUpdateOwner.mockRejectedValue(error);

      await expect(useCase.execute(mockVendorOwnerData)).rejects.toThrow(
        "Database timeout"
      );
      expect(mockOwnerVendorInterface.createOrUpdateOwner).toHaveBeenCalledWith(
        100,
        1001,
        "A"
      );
    });

    it("should handle validation errors", async () => {
      const error = new Error("Validation failed");
      mockOwnerVendorInterface.createOrUpdateOwner.mockRejectedValue(error);

      await expect(useCase.execute(mockVendorOwnerData)).rejects.toThrow(
        "Validation failed"
      );
      expect(mockOwnerVendorInterface.createOrUpdateOwner).toHaveBeenCalledWith(
        100,
        1001,
        "A"
      );
    });

    it("should handle constraint violation errors", async () => {
      const error = new Error("Constraint violation");
      mockOwnerVendorInterface.createOrUpdateOwner.mockRejectedValue(error);

      await expect(useCase.execute(mockVendorOwnerData)).rejects.toThrow(
        "Constraint violation"
      );
      expect(mockOwnerVendorInterface.createOrUpdateOwner).toHaveBeenCalledWith(
        100,
        1001,
        "A"
      );
    });

    it("should handle different success message formats", async () => {
      const customResponse = { message: "Custom success message" };
      mockOwnerVendorInterface.createOrUpdateOwner.mockResolvedValue(
        customResponse
      );

      const result = await useCase.execute(mockVendorOwnerData);

      expect(mockOwnerVendorInterface.createOrUpdateOwner).toHaveBeenCalledWith(
        100,
        1001,
        "A"
      );
      expect(result).toEqual(customResponse);
      expect(result.message).toBe("Custom success message");
    });

    it("should handle success message with special characters", async () => {
      const specialResponse = {
        message:
          "Vendor owner mapping created/updated with special chars: & < > \" '",
      };
      mockOwnerVendorInterface.createOrUpdateOwner.mockResolvedValue(
        specialResponse
      );

      const result = await useCase.execute(mockVendorOwnerData);

      expect(mockOwnerVendorInterface.createOrUpdateOwner).toHaveBeenCalledWith(
        100,
        1001,
        "A"
      );
      expect(result).toEqual(specialResponse);
      expect(result.message).toBe(
        "Vendor owner mapping created/updated with special chars: & < > \" '"
      );
    });

    it("should handle success message with numbers", async () => {
      const numberResponse = {
        message: "Vendor owner mapping 123 created/updated successfully",
      };
      mockOwnerVendorInterface.createOrUpdateOwner.mockResolvedValue(
        numberResponse
      );

      const result = await useCase.execute(mockVendorOwnerData);

      expect(mockOwnerVendorInterface.createOrUpdateOwner).toHaveBeenCalledWith(
        100,
        1001,
        "A"
      );
      expect(result).toEqual(numberResponse);
      expect(result.message).toBe(
        "Vendor owner mapping 123 created/updated successfully"
      );
    });

    it("should handle success message with empty string", async () => {
      const emptyResponse = { message: "" };
      mockOwnerVendorInterface.createOrUpdateOwner.mockResolvedValue(
        emptyResponse
      );

      const result = await useCase.execute(mockVendorOwnerData);

      expect(mockOwnerVendorInterface.createOrUpdateOwner).toHaveBeenCalledWith(
        100,
        1001,
        "A"
      );
      expect(result).toEqual(emptyResponse);
      expect(result.message).toBe("");
    });
  });
});
