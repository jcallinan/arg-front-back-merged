import { Test, TestingModule } from "@nestjs/testing";
import { GetVendorByIdUseCase } from "./get-vendor-by-id.usecase";
import { VendorAppService } from "@src/main/account-payable/domain/services/vendor/vendor.service";
import { Vendor } from "@src/main/account-payable/domain/entities/vendor.entity";
import { GetVendorByNoDto } from "../../dto/voucher.dto";
import { VendorFactory } from "@src/shared/tests";

// Mock the logger to avoid initialization issues
jest.mock("@src/shared/logger/logger.service", () => ({
  AppLogger: jest.fn().mockImplementation(() => ({
    debug: jest.fn(),
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  })),
}));

describe("GetVendorByIdUseCase", () => {
  let useCase: GetVendorByIdUseCase;
  let vendorService: jest.Mocked<VendorAppService>;

  const mockVendor: Vendor = VendorFactory.createBasicVendor({
    vendorNo: 1001,
    vendorName: "Test Vendor",
    vendorCompanyNumber: 10,
  });

  beforeEach(async () => {
    const mockVendorService = {
      findVendorByNo: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetVendorByIdUseCase,
        {
          provide: VendorAppService,
          useValue: mockVendorService,
        },
      ],
    }).compile();

    useCase = module.get<GetVendorByIdUseCase>(GetVendorByIdUseCase);
    vendorService = module.get(VendorAppService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  describe("execute", () => {
    const dto: GetVendorByNoDto = {
      vendorNo: 1,
      companyNo: 1,
    };

    it("should return vendor by ID successfully", async () => {
      vendorService.findVendorByNo.mockResolvedValue(mockVendor);

      const result = await useCase.execute(dto);

      expect(result).toEqual(mockVendor);
      expect(vendorService.findVendorByNo).toHaveBeenCalledWith(
        dto.vendorNo,
        dto.companyNo
      );
    });

    it("should throw Error when service fails", async () => {
      const error = new Error("Service error");
      vendorService.findVendorByNo.mockRejectedValue(error);

      await expect(useCase.execute(dto)).rejects.toThrow(Error);
      expect(vendorService.findVendorByNo).toHaveBeenCalledWith(
        dto.vendorNo,
        dto.companyNo
      );
    });

    it("should handle null vendor response gracefully", async () => {
      vendorService.findVendorByNo.mockResolvedValue(null as any);

      const result = await useCase.execute(dto);

      expect(result).toBeNull();
      expect(vendorService.findVendorByNo).toHaveBeenCalledWith(
        dto.vendorNo,
        dto.companyNo
      );
    });

    it("should handle database connection errors", async () => {
      const dbError = new Error("Database connection failed");
      vendorService.findVendorByNo.mockRejectedValue(dbError);

      await expect(useCase.execute(dto)).rejects.toThrow(Error);
      expect(vendorService.findVendorByNo).toHaveBeenCalledWith(
        dto.vendorNo,
        dto.companyNo
      );
    });

    it("should handle validation errors from service", async () => {
      const validationError = new Error("Invalid vendor number");
      vendorService.findVendorByNo.mockRejectedValue(validationError);

      await expect(useCase.execute(dto)).rejects.toThrow(Error);
      expect(vendorService.findVendorByNo).toHaveBeenCalledWith(
        dto.vendorNo,
        dto.companyNo
      );
    });
  });

  describe("input validation", () => {
    it("should handle valid DTO with positive numbers", async () => {
      const validDto: GetVendorByNoDto = {
        vendorNo: 100,
        companyNo: 5,
      };

      vendorService.findVendorByNo.mockResolvedValue(mockVendor);

      const result = await useCase.execute(validDto);

      expect(result).toEqual(mockVendor);
      expect(vendorService.findVendorByNo).toHaveBeenCalledWith(
        validDto.vendorNo,
        validDto.companyNo
      );
    });

    it("should handle edge case with maximum vendor number", async () => {
      const edgeCaseDto: GetVendorByNoDto = {
        vendorNo: Number.MAX_SAFE_INTEGER,
        companyNo: 1,
      };

      vendorService.findVendorByNo.mockResolvedValue(mockVendor);

      const result = await useCase.execute(edgeCaseDto);

      expect(result).toEqual(mockVendor);
      expect(vendorService.findVendorByNo).toHaveBeenCalledWith(
        edgeCaseDto.vendorNo,
        edgeCaseDto.companyNo
      );
    });
  });

  describe("error handling", () => {
    it("should handle service timeout errors", async () => {
      const timeoutError = new Error("Service timeout");
      vendorService.findVendorByNo.mockRejectedValue(timeoutError);

      await expect(
        useCase.execute({ vendorNo: 1, companyNo: 1 })
      ).rejects.toThrow(Error);
    });

    it("should handle service returning undefined", async () => {
      vendorService.findVendorByNo.mockResolvedValue(undefined as any);

      const result = await useCase.execute({ vendorNo: 1, companyNo: 1 });

      expect(result).toBeUndefined();
    });

    it("should handle service returning empty vendor object", async () => {
      const emptyVendor = VendorFactory.createBasicVendor({
        vendorNo: 0,
        vendorName: "",
        vendorIsDeleted: "I",
        vendorCompanyNumber: 0,
      });

      vendorService.findVendorByNo.mockResolvedValue(emptyVendor);

      const result = await useCase.execute({ vendorNo: 1, companyNo: 1 });

      expect(result).toEqual(emptyVendor);
    });
  });

  describe("performance and edge cases", () => {
    it("should handle concurrent requests efficiently", async () => {
      vendorService.findVendorByNo.mockResolvedValue(mockVendor);

      const promises = Array.from({ length: 10 }, () =>
        useCase.execute({ vendorNo: 1, companyNo: 1 })
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(10);
      expect(results.every((result) => result === mockVendor)).toBe(true);
      expect(vendorService.findVendorByNo).toHaveBeenCalledTimes(10);
    });

    it("should handle large vendor numbers", async () => {
      const largeVendorNo = 999999999;
      vendorService.findVendorByNo.mockResolvedValue(mockVendor);

      const result = await useCase.execute({
        vendorNo: largeVendorNo,
        companyNo: 1,
      });

      expect(result).toEqual(mockVendor);
      expect(vendorService.findVendorByNo).toHaveBeenCalledWith(
        largeVendorNo,
        1
      );
    });
  });
});
