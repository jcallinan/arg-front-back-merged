import { Test, TestingModule } from "@nestjs/testing";
import { VendorDetailsUsecase } from "./get-vendor-details.usecase";
import { VendorInterface } from "@src/main/account-payable/domain/interface/vendor.interface";
import { vendorDetailDto } from "../../dto/vendor-management.dto";
import { VendorFactory } from "@src/shared/tests/vendor-module/vendor.factory";
import { HttpException, HttpStatus } from "@nestjs/common";

describe("VendorDetailsUsecase", () => {
  let useCase: VendorDetailsUsecase;
  let mockVendorInterface: jest.Mocked<VendorInterface>;

  const mockVendor = VendorFactory.createBasicVendor({
    vendorCompanyNumber: 10,
    vendorNo: 1001,
  });

  const mockVendorContactDetails = VendorFactory.createMultipleVendorContacts(
    2,
    {
      companyNo: 10,
      vendorNo: 1001,
    }
  );

  const mockVendorResponse = {
    vendor: mockVendor,
    vendorContactDetails: mockVendorContactDetails,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendorDetailsUsecase,
        {
          provide: "VendorInterface",
          useValue: {
            getVendorAndContactDetails: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<VendorDetailsUsecase>(VendorDetailsUsecase);
    mockVendorInterface = module.get("VendorInterface");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("should get vendor details and contact details successfully", async () => {
      const dto: vendorDetailDto = {
        vendorCompanyNumber: 10,
        vendorNo: 1001,
      };

      mockVendorInterface.getVendorAndContactDetails.mockResolvedValue(
        mockVendorResponse
      );

      const result = await useCase.execute(dto);

      expect(
        mockVendorInterface.getVendorAndContactDetails
      ).toHaveBeenCalledWith(10, 1001);
      expect(result).toEqual(mockVendorResponse);
      expect(result.vendor).toEqual(mockVendor);
      expect(result.vendorContactDetails).toHaveLength(2);
    });

    it("should get vendor details with single contact", async () => {
      const dto: vendorDetailDto = {
        vendorCompanyNumber: 10,
        vendorNo: 1001,
      };

      const singleContactResponse = {
        vendor: mockVendor,
        vendorContactDetails: [mockVendorContactDetails[0]!],
      };

      mockVendorInterface.getVendorAndContactDetails.mockResolvedValue(
        singleContactResponse
      );

      const result = await useCase.execute(dto);

      expect(
        mockVendorInterface.getVendorAndContactDetails
      ).toHaveBeenCalledWith(10, 1001);
      expect(result.vendorContactDetails).toHaveLength(1);
    });

    it("should get vendor details with no contacts", async () => {
      const dto: vendorDetailDto = {
        vendorCompanyNumber: 10,
        vendorNo: 1001,
      };

      const noContactResponse = {
        vendor: mockVendor,
        vendorContactDetails: [],
      };

      mockVendorInterface.getVendorAndContactDetails.mockResolvedValue(
        noContactResponse
      );

      const result = await useCase.execute(dto);

      expect(
        mockVendorInterface.getVendorAndContactDetails
      ).toHaveBeenCalledWith(10, 1001);
      expect(result.vendorContactDetails).toHaveLength(0);
    });

    it("should handle different company numbers", async () => {
      const dto: vendorDetailDto = {
        vendorCompanyNumber: 25,
        vendorNo: 2001,
      };

      const company25Vendor = VendorFactory.createBasicVendor({
        vendorCompanyNumber: 25,
        vendorNo: 2001,
      });

      const company25Response = {
        vendor: company25Vendor,
        vendorContactDetails: [],
      };

      mockVendorInterface.getVendorAndContactDetails.mockResolvedValue(
        company25Response
      );

      const result = await useCase.execute(dto);

      expect(
        mockVendorInterface.getVendorAndContactDetails
      ).toHaveBeenCalledWith(25, 2001);
      expect(result.vendor.vendorCompanyNumber).toBe(25);
      expect(result.vendor.vendorNo).toBe(2001);
    });

    it("should handle different vendor numbers", async () => {
      const dto: vendorDetailDto = {
        vendorCompanyNumber: 10,
        vendorNo: 9999,
      };

      const vendor9999 = VendorFactory.createBasicVendor({
        vendorCompanyNumber: 10,
        vendorNo: 9999,
        vendorName: "Vendor 9999",
      });

      const vendor9999Response = {
        vendor: vendor9999,
        vendorContactDetails: [],
      };

      mockVendorInterface.getVendorAndContactDetails.mockResolvedValue(
        vendor9999Response
      );

      const result = await useCase.execute(dto);

      expect(
        mockVendorInterface.getVendorAndContactDetails
      ).toHaveBeenCalledWith(10, 9999);
      expect(result.vendor.vendorNo).toBe(9999);
      expect(result.vendor.vendorName).toBe("Vendor 9999");
    });

    it("should throw NOT_FOUND error when vendor details not found", async () => {
      const dto: vendorDetailDto = {
        vendorCompanyNumber: 10,
        vendorNo: 9999,
      };

      mockVendorInterface.getVendorAndContactDetails.mockResolvedValue(null);

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
          ).toHaveProperty(
            "message",
            "Vendor Details and Contact Details not found"
          );
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

      expect(
        mockVendorInterface.getVendorAndContactDetails
      ).toHaveBeenCalledWith(10, 9999);
    });

    it("should throw NOT_FOUND error when vendor interface returns null", async () => {
      const dto: vendorDetailDto = {
        vendorCompanyNumber: 10,
        vendorNo: 1001,
      };

      mockVendorInterface.getVendorAndContactDetails.mockResolvedValue(null);

      await expect(useCase.execute(dto)).rejects.toThrow(HttpException);

      try {
        await useCase.execute(dto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        if (error instanceof HttpException) {
          expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
        }
      }
    });

    it("should handle interface errors gracefully", async () => {
      const dto: vendorDetailDto = {
        vendorCompanyNumber: 10,
        vendorNo: 1001,
      };

      const error = new Error("Database connection failed");
      mockVendorInterface.getVendorAndContactDetails.mockRejectedValue(error);

      await expect(useCase.execute(dto)).rejects.toThrow(
        "Database connection failed"
      );
      expect(
        mockVendorInterface.getVendorAndContactDetails
      ).toHaveBeenCalledWith(10, 1001);
    });

    it("should handle vendor with extensive contact details", async () => {
      const dto: vendorDetailDto = {
        vendorCompanyNumber: 10,
        vendorNo: 1001,
      };

      const extensiveContacts = VendorFactory.createMultipleVendorContacts(10, {
        companyNo: 10,
        vendorNo: 1001,
      });

      const extensiveResponse = {
        vendor: mockVendor,
        vendorContactDetails: extensiveContacts,
      };

      mockVendorInterface.getVendorAndContactDetails.mockResolvedValue(
        extensiveResponse
      );

      const result = await useCase.execute(dto);

      expect(
        mockVendorInterface.getVendorAndContactDetails
      ).toHaveBeenCalledWith(10, 1001);
      expect(result.vendorContactDetails).toHaveLength(10);
    });

    it("should handle vendor with specific contact details", async () => {
      const dto: vendorDetailDto = {
        vendorCompanyNumber: 10,
        vendorNo: 1001,
      };

      const specificContact = VendorFactory.createVendorContactDetail({
        companyNo: 10,
        vendorNo: 1001,
        contactName: "John Doe",
        emailAddress: "john.doe@example.com",
        sendAchEmail: "Y",
      });

      const specificResponse = {
        vendor: mockVendor,
        vendorContactDetails: [specificContact],
      };

      mockVendorInterface.getVendorAndContactDetails.mockResolvedValue(
        specificResponse
      );

      const result = await useCase.execute(dto);

      expect(
        mockVendorInterface.getVendorAndContactDetails
      ).toHaveBeenCalledWith(10, 1001);
      expect(result.vendorContactDetails[0]?.contactName).toBe("John Doe");
      expect(result.vendorContactDetails[0]?.emailAddress).toBe(
        "john.doe@example.com"
      );
      expect(result.vendorContactDetails[0]?.sendAchEmail).toBe("Y");
    });

    it("should handle vendor with minimal required fields", async () => {
      const dto: vendorDetailDto = {
        vendorCompanyNumber: 10,
        vendorNo: 1001,
      };

      const minimalVendor = VendorFactory.createMinimalVendor({
        vendorCompanyNumber: 10,
        vendorNo: 1001,
      });

      const minimalResponse = {
        vendor: minimalVendor,
        vendorContactDetails: [],
      };

      mockVendorInterface.getVendorAndContactDetails.mockResolvedValue(
        minimalResponse
      );

      const result = await useCase.execute(dto);

      expect(
        mockVendorInterface.getVendorAndContactDetails
      ).toHaveBeenCalledWith(10, 1001);
      expect(result.vendor.vendorCompanyNumber).toBe(10);
      expect(result.vendor.vendorNo).toBe(1001);
      expect(result.vendor.vendorName).toBe("Test Vendor");
      expect(result.vendorContactDetails).toHaveLength(0);
    });
  });
});
