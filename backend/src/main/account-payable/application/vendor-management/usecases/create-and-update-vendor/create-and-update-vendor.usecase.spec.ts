import { Test, TestingModule } from "@nestjs/testing";
import { CreateUpdateVendorUsecase } from "./create-and-update-vendor.usecase";
import { VendorInterface } from "@src/main/account-payable/domain/interface/vendor.interface";
import { vendorDetailsDto } from "../../dto/vendor-management.dto";

describe("CreateUpdateVendorUsecase", () => {
  let useCase: CreateUpdateVendorUsecase;
  let mockVendorInterface: jest.Mocked<VendorInterface>;

  const mockVendorDetails: vendorDetailsDto = {
    vendorCompanyNumber: 10,
    vendorNo: 1001,
    vendorName: "Test Vendor",
    vendorAdd1: "123 Test St",
    vendorAdd2: "Suite 100",
    vendorAdd3: "Test City",
    vendorAdd4: "Test State",
    vendorCountryCode: "US",
    vendorZipCode: 12345,
    vendorTelephoneNo: 5551234,
    vendorHoldPaymentsVend: "A",
    vendorGalRcptsRequired: "N",
    vendorSingleCheck: "N",
    vendorApTermsCode: 30,
    vendorAdpPayrollId: 123,
    vendorCategoryCode: "SUP",
    vendorCarrierId: "CAR001",
    vendorExpenseGLSub: 1000,
    vendorAchBankAccountNumber: "1234567890",
    vendorAchBankRoutingCode: 123456789,
    vendorAchCheckingOrSavings: "C",
    vendorAchClass: "PPD",
    vendorFirstName: "Test",
    vendorMiddleName: "",
    vendorBusinessLastName: "Vendor",
    vendorNameSuffix: "",
    vendorAp1099Code: "N",
    vendorFirst1099BoxNumber: 0,
    vendorSecond1099BoxNumber: 0,
    vendorSecond1099BoxAmount: 0,
    vendorPayeeName1: "Test Vendor",
    vendorPayeeName2: "",
    vendorIrsNameControl: "TEST",
    contactDetails: [],
  };

  const mockSuccessResponse = {
    message: "Vendor created/updated successfully",
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUpdateVendorUsecase,
        {
          provide: "VendorInterface",
          useValue: {
            createOrUpdateVendor: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateUpdateVendorUsecase>(CreateUpdateVendorUsecase);
    mockVendorInterface = module.get("VendorInterface");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("should create vendor successfully", async () => {
      mockVendorInterface.createOrUpdateVendor.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(mockVendorDetails);

      expect(mockVendorInterface.createOrUpdateVendor).toHaveBeenCalledWith(
        mockVendorDetails
      );
      expect(result).toEqual(mockSuccessResponse);
      expect(result.message).toBe("Vendor created/updated successfully");
    });

    it("should update vendor successfully", async () => {
      const updateResponse = { message: "Vendor updated successfully" };
      mockVendorInterface.createOrUpdateVendor.mockResolvedValue(
        updateResponse
      );

      const result = await useCase.execute(mockVendorDetails);

      expect(mockVendorInterface.createOrUpdateVendor).toHaveBeenCalledWith(
        mockVendorDetails
      );
      expect(result).toEqual(updateResponse);
      expect(result.message).toBe("Vendor updated successfully");
    });

    it("should handle vendor with minimal required fields", async () => {
      const minimalVendor: vendorDetailsDto = {
        vendorCompanyNumber: 10,
        vendorNo: 1001,
        vendorName: "Minimal Vendor",
        vendorAdd1: "123 Test St",
        vendorAdd2: "",
        vendorAdd3: "",
        vendorAdd4: "",
        vendorCountryCode: "US",
        vendorZipCode: 12345,
        vendorTelephoneNo: 5551234,
      };

      mockVendorInterface.createOrUpdateVendor.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(minimalVendor);

      expect(mockVendorInterface.createOrUpdateVendor).toHaveBeenCalledWith(
        minimalVendor
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it("should handle vendor with extensive contact details", async () => {
      const vendorWithContacts: vendorDetailsDto = {
        ...mockVendorDetails,
        contactDetails: [
          {
            formType: "ABCY",
            contactName: "John Doe",
            emailAddress: "john.doe@example.com",
            sendAchEmail: "Y",
            sequenceNumber: 1,
          },
          {
            formType: "DEFZ",
            contactName: "Jane Smith",
            emailAddress: "jane.smith@example.com",
            sendAchEmail: "N",
            sequenceNumber: 2,
          },
        ],
      };

      mockVendorInterface.createOrUpdateVendor.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(vendorWithContacts);

      expect(mockVendorInterface.createOrUpdateVendor).toHaveBeenCalledWith(
        vendorWithContacts
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it("should handle vendor with 1099 information", async () => {
      const vendorWith1099: vendorDetailsDto = {
        ...mockVendorDetails,
        vendorAp1099Code: "Y",
        vendorFirst1099BoxNumber: 1,
        vendorSecond1099BoxNumber: 2,
        vendorSecond1099BoxAmount: 1000.0,
        vendorPayeeName1: "1099 Vendor",
        vendorPayeeName2: "Secondary Name",
        vendorIrsNameControl: "1099",
      };

      mockVendorInterface.createOrUpdateVendor.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(vendorWith1099);

      expect(mockVendorInterface.createOrUpdateVendor).toHaveBeenCalledWith(
        vendorWith1099
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it("should handle vendor with ACH banking information", async () => {
      const vendorWithACH: vendorDetailsDto = {
        ...mockVendorDetails,
        vendorAchBankAccountNumber: "9876543210",
        vendorAchBankRoutingCode: 987654321,
        vendorAchCheckingOrSavings: "S",
        vendorAchClass: "CCD",
      };

      mockVendorInterface.createOrUpdateVendor.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(vendorWithACH);

      expect(mockVendorInterface.createOrUpdateVendor).toHaveBeenCalledWith(
        vendorWithACH
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it("should handle vendor with different company number", async () => {
      const vendorCompany25: vendorDetailsDto = {
        ...mockVendorDetails,
        vendorCompanyNumber: 25,
        vendorNo: 2001,
      };

      mockVendorInterface.createOrUpdateVendor.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(vendorCompany25);

      expect(mockVendorInterface.createOrUpdateVendor).toHaveBeenCalledWith(
        vendorCompany25
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it("should handle vendor with different status values", async () => {
      const vendorWithStatus: vendorDetailsDto = {
        ...mockVendorDetails,
        vendorHoldPaymentsVend: "H",
        vendorGalRcptsRequired: "Y",
        vendorSingleCheck: "Y",
      };

      mockVendorInterface.createOrUpdateVendor.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(vendorWithStatus);

      expect(mockVendorInterface.createOrUpdateVendor).toHaveBeenCalledWith(
        vendorWithStatus
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it("should handle vendor with different terms and codes", async () => {
      const vendorWithTerms: vendorDetailsDto = {
        ...mockVendorDetails,
        vendorApTermsCode: 60,
        vendorAdpPayrollId: 456,
        vendorCategoryCode: "SERV",
        vendorCarrierId: "CAR002",
        vendorExpenseGLSub: 2000,
      };

      mockVendorInterface.createOrUpdateVendor.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(vendorWithTerms);

      expect(mockVendorInterface.createOrUpdateVendor).toHaveBeenCalledWith(
        vendorWithTerms
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it("should handle vendor with special characters in names", async () => {
      const vendorWithSpecialChars: vendorDetailsDto = {
        ...mockVendorDetails,
        vendorName: "Vendor & Co., Inc.",
        vendorAdd1: "123 Test St. #100",
        vendorAdd2: "Suite A-1",
        vendorPayeeName1: "Vendor & Co., Inc.",
        vendorPayeeName2: "Secondary Name (LLC)",
      };

      mockVendorInterface.createOrUpdateVendor.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(vendorWithSpecialChars);

      expect(mockVendorInterface.createOrUpdateVendor).toHaveBeenCalledWith(
        vendorWithSpecialChars
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it("should handle vendor with long names and addresses", async () => {
      const vendorWithLongData: vendorDetailsDto = {
        ...mockVendorDetails,
        vendorName:
          "This is a very long vendor name that exceeds normal length for testing purposes",
        vendorAdd1:
          "This is a very long address line that exceeds normal length for testing purposes",
        vendorAdd2:
          "This is another very long address line that exceeds normal length for testing purposes",
        vendorAdd3:
          "This is a third very long address line that exceeds normal length for testing purposes",
        vendorAdd4:
          "This is a fourth very long address line that exceeds normal length for testing purposes",
      };

      mockVendorInterface.createOrUpdateVendor.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(vendorWithLongData);

      expect(mockVendorInterface.createOrUpdateVendor).toHaveBeenCalledWith(
        vendorWithLongData
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it("should handle vendor with zero values", async () => {
      const vendorWithZeros: vendorDetailsDto = {
        ...mockVendorDetails,
        vendorZipCode: 0,
        vendorTelephoneNo: 0,
        vendorApTermsCode: 0,
        vendorAdpPayrollId: 0,
        vendorExpenseGLSub: 0,
        vendorFirst1099BoxNumber: 0,
        vendorSecond1099BoxNumber: 0,
        vendorSecond1099BoxAmount: 0,
      };

      mockVendorInterface.createOrUpdateVendor.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(vendorWithZeros);

      expect(mockVendorInterface.createOrUpdateVendor).toHaveBeenCalledWith(
        vendorWithZeros
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it("should handle vendor with negative values", async () => {
      const vendorWithNegatives: vendorDetailsDto = {
        ...mockVendorDetails,
        vendorZipCode: -12345,
        vendorTelephoneNo: -5551234,
        vendorApTermsCode: -30,
        vendorAdpPayrollId: -123,
        vendorExpenseGLSub: -1000,
      };

      mockVendorInterface.createOrUpdateVendor.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(vendorWithNegatives);

      expect(mockVendorInterface.createOrUpdateVendor).toHaveBeenCalledWith(
        vendorWithNegatives
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it("should handle interface errors gracefully", async () => {
      const error = new Error("Database connection failed");
      mockVendorInterface.createOrUpdateVendor.mockRejectedValue(error);

      await expect(useCase.execute(mockVendorDetails)).rejects.toThrow(
        "Database connection failed"
      );
      expect(mockVendorInterface.createOrUpdateVendor).toHaveBeenCalledWith(
        mockVendorDetails
      );
    });

    it("should handle database timeout errors", async () => {
      const error = new Error("Database timeout");
      mockVendorInterface.createOrUpdateVendor.mockRejectedValue(error);

      await expect(useCase.execute(mockVendorDetails)).rejects.toThrow(
        "Database timeout"
      );
      expect(mockVendorInterface.createOrUpdateVendor).toHaveBeenCalledWith(
        mockVendorDetails
      );
    });

    it("should handle validation errors", async () => {
      const error = new Error("Validation failed");
      mockVendorInterface.createOrUpdateVendor.mockRejectedValue(error);

      await expect(useCase.execute(mockVendorDetails)).rejects.toThrow(
        "Validation failed"
      );
      expect(mockVendorInterface.createOrUpdateVendor).toHaveBeenCalledWith(
        mockVendorDetails
      );
    });

    it("should handle different success message formats", async () => {
      const customResponse = { message: "Custom success message" };
      mockVendorInterface.createOrUpdateVendor.mockResolvedValue(
        customResponse
      );

      const result = await useCase.execute(mockVendorDetails);

      expect(mockVendorInterface.createOrUpdateVendor).toHaveBeenCalledWith(
        mockVendorDetails
      );
      expect(result).toEqual(customResponse);
      expect(result.message).toBe("Custom success message");
    });

    it("should handle empty contact details array", async () => {
      const vendorWithEmptyContacts: vendorDetailsDto = {
        ...mockVendorDetails,
        contactDetails: [],
      };

      mockVendorInterface.createOrUpdateVendor.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(vendorWithEmptyContacts);

      expect(mockVendorInterface.createOrUpdateVendor).toHaveBeenCalledWith(
        vendorWithEmptyContacts
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it("should handle undefined contact details", async () => {
      const vendorWithUndefinedContacts: vendorDetailsDto = {
        ...mockVendorDetails,
        contactDetails: undefined,
      };

      mockVendorInterface.createOrUpdateVendor.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(vendorWithUndefinedContacts);

      expect(mockVendorInterface.createOrUpdateVendor).toHaveBeenCalledWith(
        vendorWithUndefinedContacts
      );
      expect(result).toEqual(mockSuccessResponse);
    });
  });
});
