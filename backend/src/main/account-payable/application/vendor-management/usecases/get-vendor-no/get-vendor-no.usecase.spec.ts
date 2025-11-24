import { Test, TestingModule } from "@nestjs/testing";
import { GetVendorNumberConfigUsecase } from "./get-vendor-no.usecase";
import { CompanyInterface } from "@src/main/account-payable/domain/interface/company.interface";
import { VendorSharedService } from "../../shared-services/vendor.shared.service";

import { CompanyFactory } from "@src/shared/tests/company-module/company.factory";

describe("GetVendorNumberConfigUsecase", () => {
  let useCase: GetVendorNumberConfigUsecase;
  let mockCompanyInterface: jest.Mocked<CompanyInterface>;
  let mockVendorSharedService: jest.Mocked<VendorSharedService>;

  const mockCompany = CompanyFactory.createBasicCompany({
    companyNo: 10,
    companyVendorNextEntryNo: 1001,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetVendorNumberConfigUsecase,
        {
          provide: "CompanyInterface",
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: VendorSharedService,
          useValue: {
            getAndIncrementNextEntryNo: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetVendorNumberConfigUsecase>(
      GetVendorNumberConfigUsecase
    );
    mockCompanyInterface = module.get("CompanyInterface");
    mockVendorSharedService = module.get(VendorSharedService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("should get vendor number config successfully", async () => {
      const companyNo = 10;
      const expectedNextEntryNo = 1001;

      mockCompanyInterface.findOne.mockResolvedValue(mockCompany);
      mockVendorSharedService.getAndIncrementNextEntryNo.mockResolvedValue(
        expectedNextEntryNo
      );

      const result = await useCase.execute(companyNo);

      expect(mockCompanyInterface.findOne).toHaveBeenCalledWith(companyNo);
      expect(
        mockVendorSharedService.getAndIncrementNextEntryNo
      ).toHaveBeenCalledWith(mockCompany);
      expect(result).toBe(expectedNextEntryNo);
    });

    it("should get vendor number config for different company", async () => {
      const companyNo = 25;
      const company25 = CompanyFactory.createBasicCompany({
        companyNo: 25,
        companyVendorNextEntryNo: 2001,
      });
      const expectedNextEntryNo = 2001;

      mockCompanyInterface.findOne.mockResolvedValue(company25);
      mockVendorSharedService.getAndIncrementNextEntryNo.mockResolvedValue(
        expectedNextEntryNo
      );

      const result = await useCase.execute(companyNo);

      expect(mockCompanyInterface.findOne).toHaveBeenCalledWith(companyNo);
      expect(
        mockVendorSharedService.getAndIncrementNextEntryNo
      ).toHaveBeenCalledWith(company25);
      expect(result).toBe(expectedNextEntryNo);
    });

    it("should get vendor number config with high entry number", async () => {
      const companyNo = 10;
      const highEntryCompany = CompanyFactory.createBasicCompany({
        companyNo: 10,
        companyVendorNextEntryNo: 99999,
      });
      const expectedNextEntryNo = 99999;

      mockCompanyInterface.findOne.mockResolvedValue(highEntryCompany);
      mockVendorSharedService.getAndIncrementNextEntryNo.mockResolvedValue(
        expectedNextEntryNo
      );

      const result = await useCase.execute(companyNo);

      expect(mockCompanyInterface.findOne).toHaveBeenCalledWith(companyNo);
      expect(
        mockVendorSharedService.getAndIncrementNextEntryNo
      ).toHaveBeenCalledWith(highEntryCompany);
      expect(result).toBe(expectedNextEntryNo);
    });

    it("should get vendor number config with low entry number", async () => {
      const companyNo = 10;
      const lowEntryCompany = CompanyFactory.createBasicCompany({
        companyNo: 10,
        companyVendorNextEntryNo: 1,
      });
      const expectedNextEntryNo = 1;

      mockCompanyInterface.findOne.mockResolvedValue(lowEntryCompany);
      mockVendorSharedService.getAndIncrementNextEntryNo.mockResolvedValue(
        expectedNextEntryNo
      );

      const result = await useCase.execute(companyNo);

      expect(mockCompanyInterface.findOne).toHaveBeenCalledWith(companyNo);
      expect(
        mockVendorSharedService.getAndIncrementNextEntryNo
      ).toHaveBeenCalledWith(lowEntryCompany);
      expect(result).toBe(expectedNextEntryNo);
    });

    it("should get vendor number config with zero entry number", async () => {
      const companyNo = 10;
      const zeroEntryCompany = CompanyFactory.createBasicCompany({
        companyNo: 10,
        companyVendorNextEntryNo: 0,
      });
      const expectedNextEntryNo = 0;

      mockCompanyInterface.findOne.mockResolvedValue(zeroEntryCompany);
      mockVendorSharedService.getAndIncrementNextEntryNo.mockResolvedValue(
        expectedNextEntryNo
      );

      const result = await useCase.execute(companyNo);

      expect(mockCompanyInterface.findOne).toHaveBeenCalledWith(companyNo);
      expect(
        mockVendorSharedService.getAndIncrementNextEntryNo
      ).toHaveBeenCalledWith(zeroEntryCompany);
      expect(result).toBe(expectedNextEntryNo);
    });

    it("should handle company interface errors gracefully", async () => {
      const companyNo = 10;
      const error = new Error("Company not found");

      mockCompanyInterface.findOne.mockRejectedValue(error);

      await expect(useCase.execute(companyNo)).rejects.toThrow(
        "Company not found"
      );
      expect(mockCompanyInterface.findOne).toHaveBeenCalledWith(companyNo);
      expect(
        mockVendorSharedService.getAndIncrementNextEntryNo
      ).not.toHaveBeenCalled();
    });

    it("should handle vendor shared service errors gracefully", async () => {
      const companyNo = 10;
      const error = new Error("Failed to get next entry number");

      mockCompanyInterface.findOne.mockResolvedValue(mockCompany);
      mockVendorSharedService.getAndIncrementNextEntryNo.mockRejectedValue(
        error
      );

      await expect(useCase.execute(companyNo)).rejects.toThrow(
        "Failed to get next entry number"
      );
      expect(mockCompanyInterface.findOne).toHaveBeenCalledWith(companyNo);
      expect(
        mockVendorSharedService.getAndIncrementNextEntryNo
      ).toHaveBeenCalledWith(mockCompany);
    });

    it("should handle database connection errors", async () => {
      const companyNo = 10;
      const error = new Error("Database connection failed");

      mockCompanyInterface.findOne.mockRejectedValue(error);

      await expect(useCase.execute(companyNo)).rejects.toThrow(
        "Database connection failed"
      );
      expect(mockCompanyInterface.findOne).toHaveBeenCalledWith(companyNo);
    });

    it("should handle timeout errors", async () => {
      const companyNo = 10;
      const error = new Error("Request timeout");

      mockCompanyInterface.findOne.mockRejectedValue(error);

      await expect(useCase.execute(companyNo)).rejects.toThrow(
        "Request timeout"
      );
      expect(mockCompanyInterface.findOne).toHaveBeenCalledWith(companyNo);
    });

    it("should handle company with undefined next entry number", async () => {
      const companyNo = 10;
      const companyWithUndefined = CompanyFactory.createBasicCompany({
        companyNo: 10,
        companyVendorNextEntryNo: undefined,
      });
      const expectedNextEntryNo = 1001;

      mockCompanyInterface.findOne.mockResolvedValue(companyWithUndefined);
      mockVendorSharedService.getAndIncrementNextEntryNo.mockResolvedValue(
        expectedNextEntryNo
      );

      const result = await useCase.execute(companyNo);

      expect(mockCompanyInterface.findOne).toHaveBeenCalledWith(companyNo);
      expect(
        mockVendorSharedService.getAndIncrementNextEntryNo
      ).toHaveBeenCalledWith(companyWithUndefined);
      expect(result).toBe(expectedNextEntryNo);
    });

    it("should handle company with null next entry number", async () => {
      const companyNo = 10;
      const companyWithNull = CompanyFactory.createBasicCompany({
        companyNo: 10,
        companyVendorNextEntryNo: null,
      });
      const expectedNextEntryNo = 1001;

      mockCompanyInterface.findOne.mockResolvedValue(companyWithNull);
      mockVendorSharedService.getAndIncrementNextEntryNo.mockResolvedValue(
        expectedNextEntryNo
      );

      const result = await useCase.execute(companyNo);

      expect(mockCompanyInterface.findOne).toHaveBeenCalledWith(companyNo);
      expect(
        mockVendorSharedService.getAndIncrementNextEntryNo
      ).toHaveBeenCalledWith(companyWithNull);
      expect(result).toBe(expectedNextEntryNo);
    });

    it("should handle large company numbers", async () => {
      const companyNo = 99999;
      const largeCompany = CompanyFactory.createBasicCompany({
        companyNo: 99999,
        companyVendorNextEntryNo: 50000,
      });
      const expectedNextEntryNo = 50000;

      mockCompanyInterface.findOne.mockResolvedValue(largeCompany);
      mockVendorSharedService.getAndIncrementNextEntryNo.mockResolvedValue(
        expectedNextEntryNo
      );

      const result = await useCase.execute(companyNo);

      expect(mockCompanyInterface.findOne).toHaveBeenCalledWith(companyNo);
      expect(
        mockVendorSharedService.getAndIncrementNextEntryNo
      ).toHaveBeenCalledWith(largeCompany);
      expect(result).toBe(expectedNextEntryNo);
    });

    it("should handle zero company number", async () => {
      const companyNo = 0;
      const zeroCompany = CompanyFactory.createBasicCompany({
        companyNo: 0,
        companyVendorNextEntryNo: 1001,
      });
      const expectedNextEntryNo = 1001;

      mockCompanyInterface.findOne.mockResolvedValue(zeroCompany);
      mockVendorSharedService.getAndIncrementNextEntryNo.mockResolvedValue(
        expectedNextEntryNo
      );

      const result = await useCase.execute(companyNo);

      expect(mockCompanyInterface.findOne).toHaveBeenCalledWith(companyNo);
      expect(
        mockVendorSharedService.getAndIncrementNextEntryNo
      ).toHaveBeenCalledWith(zeroCompany);
      expect(result).toBe(expectedNextEntryNo);
    });

    it("should handle negative company number", async () => {
      const companyNo = -10;
      const negativeCompany = CompanyFactory.createBasicCompany({
        companyNo: -10,
        companyVendorNextEntryNo: 1001,
      });
      const expectedNextEntryNo = 1001;

      mockCompanyInterface.findOne.mockResolvedValue(negativeCompany);
      mockVendorSharedService.getAndIncrementNextEntryNo.mockResolvedValue(
        expectedNextEntryNo
      );

      const result = await useCase.execute(companyNo);

      expect(mockCompanyInterface.findOne).toHaveBeenCalledWith(companyNo);
      expect(
        mockVendorSharedService.getAndIncrementNextEntryNo
      ).toHaveBeenCalledWith(negativeCompany);
      expect(result).toBe(expectedNextEntryNo);
    });

    it("should handle company with minimal required fields", async () => {
      const companyNo = 10;
      const minimalCompany = CompanyFactory.createMinimalCompany({
        companyNo: 10,
      });
      const expectedNextEntryNo = 1001;

      mockCompanyInterface.findOne.mockResolvedValue(minimalCompany);
      mockVendorSharedService.getAndIncrementNextEntryNo.mockResolvedValue(
        expectedNextEntryNo
      );

      const result = await useCase.execute(companyNo);

      expect(mockCompanyInterface.findOne).toHaveBeenCalledWith(companyNo);
      expect(
        mockVendorSharedService.getAndIncrementNextEntryNo
      ).toHaveBeenCalledWith(minimalCompany);
      expect(result).toBe(expectedNextEntryNo);
    });

    it("should handle company with extensive data", async () => {
      const companyNo = 10;
      const extensiveCompany = CompanyFactory.createBasicCompany({
        companyNo: 10,
        companyVendorNextEntryNo: 1001,
        companyName: "Extensive Test Company",
        companyAddress1: "123 Test Street",
        companyAddress2: "Suite 100",
        companyCity: "Test City",
        companyState: "TS",
        companyZipCode: 12345,
      });
      const expectedNextEntryNo = 1001;

      mockCompanyInterface.findOne.mockResolvedValue(extensiveCompany);
      mockVendorSharedService.getAndIncrementNextEntryNo.mockResolvedValue(
        expectedNextEntryNo
      );

      const result = await useCase.execute(companyNo);

      expect(mockCompanyInterface.findOne).toHaveBeenCalledWith(companyNo);
      expect(
        mockVendorSharedService.getAndIncrementNextEntryNo
      ).toHaveBeenCalledWith(extensiveCompany);
      expect(result).toBe(expectedNextEntryNo);
    });
  });
});
