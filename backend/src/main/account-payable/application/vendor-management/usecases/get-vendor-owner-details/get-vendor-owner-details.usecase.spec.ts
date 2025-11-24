import { Test, TestingModule } from "@nestjs/testing";
import { VendorOwnerDetailsUsecase } from "./get-vendor-owner-details.usecase";
import { OwnerVendorInterface } from "@src/main/account-payable/domain/interface/owner-vendor.interface";
import { vendorOwnerDetailsDto } from "../../dto/vendor-management.dto";
import { VendorFactory } from "@src/shared/tests/vendor-module/vendor.factory";
import { HttpException, HttpStatus } from "@nestjs/common";

describe("VendorOwnerDetailsUsecase", () => {
  let useCase: VendorOwnerDetailsUsecase;
  let mockOwnerVendorInterface: jest.Mocked<OwnerVendorInterface>;

  const mockOwnerVendorMapping = VendorFactory.createOwnerVendorMapping({
    ownerNo: 100,
    vendorNo: 1001,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendorOwnerDetailsUsecase,
        {
          provide: "OwnerVendorInterface",
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<VendorOwnerDetailsUsecase>(VendorOwnerDetailsUsecase);
    mockOwnerVendorInterface = module.get("OwnerVendorInterface");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("should get vendor owner details successfully", async () => {
      const dto: vendorOwnerDetailsDto = {
        ownerNo: 100,
        vendorNo: 1001,
      };

      mockOwnerVendorInterface.findOne.mockResolvedValue(
        mockOwnerVendorMapping
      );

      const result = await useCase.execute(dto);

      expect(mockOwnerVendorInterface.findOne).toHaveBeenCalledWith(1001, 100);
      expect(result).toEqual(mockOwnerVendorMapping);
      expect(result!.ownerNo).toBe(100);
      expect(result!.vendorNo).toBe(1001);
    });

    it("should get vendor owner details with different owner number", async () => {
      const dto: vendorOwnerDetailsDto = {
        ownerNo: 999,
        vendorNo: 1001,
      };

      const differentOwnerMapping = VendorFactory.createOwnerVendorMapping({
        ownerNo: 999,
        vendorNo: 1001,
      });

      mockOwnerVendorInterface.findOne.mockResolvedValue(differentOwnerMapping);

      const result = await useCase.execute(dto);

      expect(mockOwnerVendorInterface.findOne).toHaveBeenCalledWith(1001, 999);
      expect(result).toEqual(differentOwnerMapping);
      expect(result!.ownerNo).toBe(999);
    });

    it("should get vendor owner details with different vendor number", async () => {
      const dto: vendorOwnerDetailsDto = {
        ownerNo: 100,
        vendorNo: 9999,
      };

      const differentVendorMapping = VendorFactory.createOwnerVendorMapping({
        ownerNo: 100,
        vendorNo: 9999,
      });

      mockOwnerVendorInterface.findOne.mockResolvedValue(
        differentVendorMapping
      );

      const result = await useCase.execute(dto);

      expect(mockOwnerVendorInterface.findOne).toHaveBeenCalledWith(9999, 100);
      expect(result).toEqual(differentVendorMapping);
      expect(result!.vendorNo).toBe(9999);
    });

    it("should get vendor owner details with specific status", async () => {
      const dto: vendorOwnerDetailsDto = {
        ownerNo: 100,
        vendorNo: 1001,
      };

      const activeMapping = VendorFactory.createOwnerVendorMapping({
        ownerNo: 100,
        vendorNo: 1001,
        isDeleted: "A",
      });

      mockOwnerVendorInterface.findOne.mockResolvedValue(activeMapping);

      const result = await useCase.execute(dto);

      expect(mockOwnerVendorInterface.findOne).toHaveBeenCalledWith(1001, 100);
      expect(result).toEqual(activeMapping);
      expect(result!.isDeleted).toBe("A");
    });

    it("should get vendor owner details with inactive status", async () => {
      const dto: vendorOwnerDetailsDto = {
        ownerNo: 100,
        vendorNo: 1001,
      };

      const inactiveMapping = VendorFactory.createOwnerVendorMapping({
        ownerNo: 100,
        vendorNo: 1001,
        isDeleted: "I",
      });

      mockOwnerVendorInterface.findOne.mockResolvedValue(inactiveMapping);

      const result = await useCase.execute(dto);

      expect(mockOwnerVendorInterface.findOne).toHaveBeenCalledWith(1001, 100);
      expect(result).toEqual(inactiveMapping);
      expect(result!.isDeleted).toBe("I");
    });

    it("should throw NOT_FOUND error when vendor owner details not found", async () => {
      const dto: vendorOwnerDetailsDto = {
        ownerNo: 999,
        vendorNo: 9999,
      };

      mockOwnerVendorInterface.findOne.mockResolvedValue(null);

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
          expect(
            (
              response as {
                error: {
                  code: string;
                  details: Array<{
                    field: string;
                    code: string;
                    message: string;
                  }>;
                  message: string;
                };
              }
            ).error
          ).toHaveProperty("code", "NOT_FOUND");
          expect(
            (
              response as {
                error: {
                  code: string;
                  details: Array<{
                    field: string;
                    code: string;
                    message: string;
                  }>;
                  message: string;
                };
              }
            ).error
          ).toHaveProperty("details");
          expect(
            (
              response as {
                error: {
                  code: string;
                  details: Array<{
                    field: string;
                    code: string;
                    message: string;
                  }>;
                  message: string;
                };
              }
            ).error.details
          ).toHaveLength(1);
          expect(
            (
              response as {
                error: {
                  code: string;
                  details: Array<{
                    field: string;
                    code: string;
                    message: string;
                  }>;
                  message: string;
                };
              }
            ).error.details[0]
          ).toHaveProperty("field", "vendorOwner");
          expect(
            (
              response as {
                error: {
                  code: string;
                  details: Array<{
                    field: string;
                    code: string;
                    message: string;
                  }>;
                  message: string;
                };
              }
            ).error.details[0]
          ).toHaveProperty("code", "NOT_FOUND");
          expect(
            (
              response as {
                error: {
                  code: string;
                  details: Array<{
                    field: string;
                    code: string;
                    message: string;
                  }>;
                  message: string;
                };
              }
            ).error.details[0]
          ).toHaveProperty("message", "Vendor Owner Details not found");
          expect(
            (
              response as {
                error: {
                  code: string;
                  details: Array<{
                    field: string;
                    code: string;
                    message: string;
                  }>;
                  message: string;
                };
              }
            ).error
          ).toHaveProperty("message", "Requested Resource Not found");
        }
      }

      expect(mockOwnerVendorInterface.findOne).toHaveBeenCalledWith(9999, 999);
    });

    it("should throw NOT_FOUND error when owner vendor interface returns null", async () => {
      const dto: vendorOwnerDetailsDto = {
        ownerNo: 100,
        vendorNo: 1001,
      };

      mockOwnerVendorInterface.findOne.mockResolvedValue(null);

      await expect(useCase.execute(dto)).rejects.toThrow(HttpException);

      try {
        await useCase.execute(dto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        if (error instanceof HttpException) {
          expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
        }
      }

      expect(mockOwnerVendorInterface.findOne).toHaveBeenCalledWith(1001, 100);
    });

    it("should handle interface errors gracefully", async () => {
      const dto: vendorOwnerDetailsDto = {
        ownerNo: 100,
        vendorNo: 1001,
      };

      const error = new Error("Database connection failed");
      mockOwnerVendorInterface.findOne.mockRejectedValue(error);

      await expect(useCase.execute(dto)).rejects.toThrow(
        "Database connection failed"
      );
      expect(mockOwnerVendorInterface.findOne).toHaveBeenCalledWith(1001, 100);
    });

    it("should handle database timeout errors", async () => {
      const dto: vendorOwnerDetailsDto = {
        ownerNo: 100,
        vendorNo: 1001,
      };

      const error = new Error("Database timeout");
      mockOwnerVendorInterface.findOne.mockRejectedValue(error);

      await expect(useCase.execute(dto)).rejects.toThrow("Database timeout");
      expect(mockOwnerVendorInterface.findOne).toHaveBeenCalledWith(1001, 100);
    });

    it("should handle vendor owner mapping with filler data", async () => {
      const dto: vendorOwnerDetailsDto = {
        ownerNo: 100,
        vendorNo: 1001,
      };

      const mappingWithFiller = VendorFactory.createOwnerVendorMapping({
        ownerNo: 100,
        vendorNo: 1001,
        filler: "Test Filler Data",
      });

      mockOwnerVendorInterface.findOne.mockResolvedValue(mappingWithFiller);

      const result = await useCase.execute(dto);

      expect(mockOwnerVendorInterface.findOne).toHaveBeenCalledWith(1001, 100);
      expect(result).toEqual(mappingWithFiller);
      expect(result!.filler).toBe("Test Filler Data");
    });

    it("should handle vendor owner mapping with minimal required fields", async () => {
      const dto: vendorOwnerDetailsDto = {
        ownerNo: 100,
        vendorNo: 1001,
      };

      const minimalMapping = VendorFactory.createOwnerVendorMapping({
        ownerNo: 100,
        vendorNo: 1001,
      });

      mockOwnerVendorInterface.findOne.mockResolvedValue(minimalMapping);

      const result = await useCase.execute(dto);

      expect(mockOwnerVendorInterface.findOne).toHaveBeenCalledWith(1001, 100);
      expect(result!.ownerNo).toBe(100);
      expect(result!.vendorNo).toBe(1001);
      expect(result!.isDeleted).toBe("A");
    });

    it("should handle vendor owner mapping with large numbers", async () => {
      const dto: vendorOwnerDetailsDto = {
        ownerNo: 99999,
        vendorNo: 99999,
      };

      const largeNumberMapping = VendorFactory.createOwnerVendorMapping({
        ownerNo: 99999,
        vendorNo: 99999,
      });

      mockOwnerVendorInterface.findOne.mockResolvedValue(largeNumberMapping);

      const result = await useCase.execute(dto);

      expect(mockOwnerVendorInterface.findOne).toHaveBeenCalledWith(
        99999,
        99999
      );
      expect(result).toEqual(largeNumberMapping);
      expect(result!.ownerNo).toBe(99999);
      expect(result!.vendorNo).toBe(99999);
    });

    it("should handle vendor owner mapping with zero values", async () => {
      const dto: vendorOwnerDetailsDto = {
        ownerNo: 0,
        vendorNo: 0,
      };

      const zeroValueMapping = VendorFactory.createOwnerVendorMapping({
        ownerNo: 0,
        vendorNo: 0,
      });

      mockOwnerVendorInterface.findOne.mockResolvedValue(zeroValueMapping);

      const result = await useCase.execute(dto);

      expect(mockOwnerVendorInterface.findOne).toHaveBeenCalledWith(0, 0);
      expect(result).toEqual(zeroValueMapping);
      expect(result!.ownerNo).toBe(0);
      expect(result!.vendorNo).toBe(0);
    });

    it("should handle vendor owner mapping with negative numbers", async () => {
      const dto: vendorOwnerDetailsDto = {
        ownerNo: -100,
        vendorNo: -1001,
      };

      const negativeMapping = VendorFactory.createOwnerVendorMapping({
        ownerNo: -100,
        vendorNo: -1001,
      });

      mockOwnerVendorInterface.findOne.mockResolvedValue(negativeMapping);

      const result = await useCase.execute(dto);

      expect(mockOwnerVendorInterface.findOne).toHaveBeenCalledWith(
        -1001,
        -100
      );
      expect(result).toEqual(negativeMapping);
      expect(result!.ownerNo).toBe(-100);
      expect(result!.vendorNo).toBe(-1001);
    });
  });
});
