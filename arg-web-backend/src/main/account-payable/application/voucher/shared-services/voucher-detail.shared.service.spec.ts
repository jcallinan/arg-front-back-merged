import { Test, TestingModule } from "@nestjs/testing";
import { VoucherDetailValidationService } from "./voucher-detail.shared.service";
import { CompanyInterface } from "@src/main/account-payable/domain/interface/company.interface";
import { VendorInterface } from "@src/main/account-payable/domain/interface/vendor.interface";
import { VoucherDetailInterface } from "@src/main/account-payable/domain/interface/voucher.interface";
import { VoucherDetailValidation } from "../validations/voucher-detail.validation";

import { PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";

describe("VoucherDetailValidationService", () => {
  let service: VoucherDetailValidationService;
  let mockCompanyInterface: jest.Mocked<CompanyInterface>;
  let mockVendorInterface: jest.Mocked<VendorInterface>;
  let mockVoucherDetailInterface: jest.Mocked<VoucherDetailInterface>;
  let mockVoucherDetailValidation: jest.Mocked<VoucherDetailValidation>;

  const mockCompany = {
    companyNo: 10,
    companyDiscountsGlNo: 1000,
  };

  const mockVendor = {
    vendorNo: 1001,
    vendorExpenseGLSub: "EXP",
    vendorName: "Test Vendor",
  };

  const mockVoucherDetails = [
    {
      entrySequence: "1",
      lineGlNo: 2000,
      discountAmount: 50,
      discountPercentage: 5,
      gallons: 100,
      receiptNo: 12345,
      openClosed: "O",
      isDeleted: "A",
      poNo: "PO001",
      productAmount: 1000,
      quantity: 10,
      lineDesc: "Test Item",
    },
    {
      entrySequence: "2",
      lineGlNo: 3000,
      discountAmount: 0,
      discountPercentage: 0,
      gallons: 0,
      receiptNo: 0,
      openClosed: "C",
      isDeleted: "A",
      poNo: "",
      productAmount: 500,
      quantity: 5,
      lineDesc: "Test Item 2",
    },
  ];

  const mockHeaders = {
    companyNo: 10,
    entryNo: 1001,
    vendorNo: 1001,
    salesOrderNo: "SO001",
    processType: PROCESS_TYPE_ENUM.NORMAL,
    status: "S",
  };

  const mockExistingVoucherDetails = [
    { entrySequence: 1, lineGlNo: 2000 },
    { entrySequence: 2, lineGlNo: 3000 },
  ];

  beforeEach(async () => {
    mockCompanyInterface = {
      findOne: jest.fn(),
    } as any;

    mockVendorInterface = {
      findOne: jest.fn(),
    } as any;

    mockVoucherDetailInterface = {
      findByEntry: jest.fn(),
    } as any;

    mockVoucherDetailValidation = {
      getEntrySequence: jest.fn(),
      getValidLineGlNo: jest.fn(),
      validateDiscounts: jest.fn(),
      validateGlmastRecord: jest.fn(),
      validateSalesOrder: jest.fn(),
      validateVendorRequirements: jest.fn(),
      validateGallonAndVendor: jest.fn(),
      validatePoRequirement: jest.fn(),
      validateGallonAmount: jest.fn(),
      validateGallonRules: jest.fn(),
      validateReceipt: jest.fn(),
      validateReceiptCode: jest.fn(),
      validateDeleteCode: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoucherDetailValidationService,
        {
          provide: "CompanyInterface",
          useValue: mockCompanyInterface,
        },
        {
          provide: "VendorInterface",
          useValue: mockVendorInterface,
        },
        {
          provide: "VoucherDetailInterface",
          useValue: mockVoucherDetailInterface,
        },
        {
          provide: VoucherDetailValidation,
          useValue: mockVoucherDetailValidation,
        },
      ],
    }).compile();

    service = module.get<VoucherDetailValidationService>(
      VoucherDetailValidationService
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("buildVoucherDetailData", () => {
    it("should build voucher detail data with all fields", () => {
      const detail = mockVoucherDetails[0];
      const headers = mockHeaders;
      const newEntrySequence = 1;

      const result = service.buildVoucherDetailData(
        detail,
        headers,
        newEntrySequence
      );

      expect(result).toEqual({
        isDeleted: "A",
        companyNo: 10,
        entryNo: 1001,
        entrySequence: 1,
        vendorNo: 1001,
        lineCompanyNo: 10,
        lineGlNo: 2000,
        lineDesc: "Test Item",
        lineAmount: 0,
        discountAmount: 50,
        discountPercentage: 5,
        inventoryItem: " ",
        quantity: 10,
        jobNo: " ",
        jobCostCode: " ",
        jobCostType: " ",
        jobCostQuantity: 0,
        gallons: 100,
        receiptNo: 12345,
        openClosed: "O",
        poLineNo: 0,
        productAmount: 1000,
        freightAmount: 0,
        poNo: "PO001",
        status: "S",
      });
    });

    it("should handle missing optional fields with defaults", () => {
      const minimalDetail = {
        isDeleted: "A",
        lineGlNo: 2000,
      };
      const headers = mockHeaders;
      const newEntrySequence = 1;

      const result = service.buildVoucherDetailData(
        minimalDetail,
        headers,
        newEntrySequence
      );

      expect(result.lineDesc).toBe("");
      expect(result.discountAmount).toBe(0);
      expect(result.gallons).toBe(0);
      expect(result.receiptNo).toBe(0);
      expect(result.poNo).toBe("");
    });

    it("should handle null/undefined values gracefully", () => {
      const detailWithNulls = {
        isDeleted: null,
        lineGlNo: null,
        discountAmount: null,
        gallons: null,
      };
      const headers = mockHeaders;
      const newEntrySequence = 1;

      const result = service.buildVoucherDetailData(
        detailWithNulls,
        headers,
        newEntrySequence
      );

      expect(result.isDeleted).toBe("");
      expect(result.lineGlNo).toBe(0);
      expect(result.discountAmount).toBe(0);
      expect(result.gallons).toBe(0);
    });
  });

  describe("validateDetail", () => {
    beforeEach(() => {
      mockCompanyInterface.findOne.mockResolvedValue(mockCompany as any);
      mockVendorInterface.findOne.mockResolvedValue(mockVendor as any);
      mockVoucherDetailInterface.findByEntry.mockResolvedValue(
        mockExistingVoucherDetails as any
      );

      // Mock validation methods
      mockVoucherDetailValidation.getEntrySequence.mockReturnValue("1");
      mockVoucherDetailValidation.getValidLineGlNo.mockReturnValue(2000);
      mockVoucherDetailValidation.validateGlmastRecord.mockResolvedValue({
        glNo: 2000,
      } as any);
      mockVoucherDetailValidation.validateReceipt.mockResolvedValue();
    });

    it("should successfully validate details with no errors", async () => {
      const result = await service.validateDetail(
        mockVoucherDetails,
        mockHeaders
      );

      expect(result.error).toBe(false);
      expect(result.data).toHaveLength(2);
      expect(result.warnings).toHaveLength(0);
      expect(mockCompanyInterface.findOne).toHaveBeenCalledWith(10);
      expect(mockVendorInterface.findOne).toHaveBeenCalledWith(1001, 10);
    });

    it("should reuse vendor data when foundVendor is provided", async () => {
      const result = await service.validateDetail(
        mockVoucherDetails,
        mockHeaders,
        mockVendor
      );

      expect(result.error).toBe(false);
      expect(mockVendorInterface.findOne).not.toHaveBeenCalled();
    });

    it("should return validation errors when details have errors", async () => {
      // Mock validation to add errors only to the first detail
      let callCount = 0;
      mockVoucherDetailValidation.validateDiscounts.mockImplementation(
        (errors) => {
          callCount++;
          if (callCount === 1) {
            // Only add error to first detail
            errors.push({
              field: "discountAmount",
              code: "INVALID_DISCOUNT",
              message: "Invalid discount",
            });
          }
        }
      );

      const result = await service.validateDetail(
        mockVoucherDetails,
        mockHeaders
      );

      expect(result.error).toBe(true);
      expect((result as any).errors).toHaveLength(1);
      expect((result as any).errors[0].index).toBe(1);
      expect((result as any).errors[0].errors).toHaveLength(1);
    });

    it("should return validation warnings when details have warnings", async () => {
      // Mock validation to add warnings only to the first detail
      let callCount = 0;
      mockVoucherDetailValidation.validateSalesOrder.mockImplementation(
        (salesOrderNo, receiptNo, gallons, errors, warnings) => {
          callCount++;
          if (callCount === 1 && warnings) {
            // Only add warning to first detail
            warnings.push({
              field: "receiptNo",
              code: "WARNING",
              message: "Receipt number warning",
            });
          }
        }
      );

      const result = await service.validateDetail(
        mockVoucherDetails,
        mockHeaders
      );

      expect(result.error).toBe(false);
      expect((result as any).warnings).toHaveLength(1);
      expect((result as any).warnings[0].index).toBe(1);
      expect((result as any).warnings[0].warnings).toHaveLength(1);
    });

    it("should return processor errors for FLEXI process type", async () => {
      const flexiHeaders = {
        ...mockHeaders,
        processType: PROCESS_TYPE_ENUM.FLEXI,
      };

      // Mock validation to add errors
      mockVoucherDetailValidation.validateDiscounts.mockImplementation(
        (errors) => {
          errors.push({
            field: "discountAmount",
            code: "INVALID_DISCOUNT",
            message: "Invalid discount",
          });
        }
      );

      const result = await service.validateDetail(
        mockVoucherDetails,
        flexiHeaders
      );

      expect(result.error).toBe(true);
      expect((result as any).errors).toHaveLength(2);
      expect((result as any).data).toHaveLength(2); // Data should still be returned for processor errors
    });

    it("should return processor errors for SOGAS process type", async () => {
      const sogasHeaders = {
        ...mockHeaders,
        processType: PROCESS_TYPE_ENUM.SOGAS,
      };

      // Mock validation to add errors
      mockVoucherDetailValidation.validateDiscounts.mockImplementation(
        (errors) => {
          errors.push({
            field: "discountAmount",
            code: "INVALID_DISCOUNT",
            message: "Invalid discount",
          });
        }
      );

      const result = await service.validateDetail(
        mockVoucherDetails,
        sogasHeaders
      );

      expect(result.error).toBe(true);
      expect((result as any).errors).toHaveLength(2);
      expect((result as any).data).toHaveLength(2); // Data should still be returned for processor errors
    });

    it("should handle receipt validation when receipt number is provided", async () => {
      const detailWithReceipt = [
        { ...mockVoucherDetails[0], receiptNo: 12345 },
      ];

      await service.validateDetail(detailWithReceipt, mockHeaders);

      expect(mockVoucherDetailValidation.validateReceipt).toHaveBeenCalledWith(
        10,
        12345,
        100,
        expect.any(Array),
        expect.any(Array)
      );
    });

    it("should skip receipt validation when receipt number is 0", async () => {
      const detailWithoutReceipt = [{ ...mockVoucherDetails[0], receiptNo: 0 }];

      await service.validateDetail(detailWithoutReceipt, mockHeaders);

      expect(
        mockVoucherDetailValidation.validateReceipt
      ).not.toHaveBeenCalled();
    });

    it("should call all validation methods for each detail", async () => {
      await service.validateDetail(mockVoucherDetails, mockHeaders);

      expect(
        mockVoucherDetailValidation.validateDiscounts
      ).toHaveBeenCalledTimes(2);
      expect(
        mockVoucherDetailValidation.validateGlmastRecord
      ).toHaveBeenCalledTimes(2);
      expect(
        mockVoucherDetailValidation.validateSalesOrder
      ).toHaveBeenCalledTimes(2);
      expect(
        mockVoucherDetailValidation.validateVendorRequirements
      ).toHaveBeenCalledTimes(2);
      expect(
        mockVoucherDetailValidation.validateGallonAndVendor
      ).toHaveBeenCalledTimes(2);
      expect(
        mockVoucherDetailValidation.validatePoRequirement
      ).toHaveBeenCalledTimes(2);
      expect(
        mockVoucherDetailValidation.validateGallonAmount
      ).toHaveBeenCalledTimes(2);
      expect(
        mockVoucherDetailValidation.validateGallonRules
      ).toHaveBeenCalledTimes(2);
      expect(
        mockVoucherDetailValidation.validateReceiptCode
      ).toHaveBeenCalledTimes(2);
      expect(
        mockVoucherDetailValidation.validateDeleteCode
      ).toHaveBeenCalledTimes(2);
    });

    it("should handle company lookup failure", async () => {
      mockCompanyInterface.findOne.mockRejectedValue(
        new Error("Company not found")
      );

      await expect(
        service.validateDetail(mockVoucherDetails, mockHeaders)
      ).rejects.toThrow("Company not found");
    });

    it("should handle vendor lookup failure", async () => {
      mockVendorInterface.findOne.mockRejectedValue(
        new Error("Vendor not found")
      );

      await expect(
        service.validateDetail(mockVoucherDetails, mockHeaders)
      ).rejects.toThrow("Vendor not found");
    });

    it("should handle voucher detail lookup failure", async () => {
      mockVoucherDetailInterface.findByEntry.mockRejectedValue(
        new Error("Voucher details not found")
      );

      await expect(
        service.validateDetail(mockVoucherDetails, mockHeaders)
      ).rejects.toThrow("Voucher details not found");
    });

    it("should calculate entry sequence correctly", async () => {
      mockVoucherDetailValidation.getEntrySequence.mockReturnValue("3");

      await service.validateDetail(mockVoucherDetails, mockHeaders);

      expect(mockVoucherDetailValidation.getEntrySequence).toHaveBeenCalledWith(
        1
      );
      expect(mockVoucherDetailValidation.getEntrySequence).toHaveBeenCalledWith(
        2
      );
    });

    it("should get valid line GL number correctly", async () => {
      mockVoucherDetailValidation.getValidLineGlNo.mockReturnValue(2500);

      await service.validateDetail(mockVoucherDetails, mockHeaders);

      expect(mockVoucherDetailValidation.getValidLineGlNo).toHaveBeenCalledWith(
        2000,
        "EXP"
      );
      expect(mockVoucherDetailValidation.getValidLineGlNo).toHaveBeenCalledWith(
        3000,
        "EXP"
      );
    });

    it("should validate GL master record correctly", async () => {
      const mockGlData = { glNo: 2000, description: "Test GL" };
      mockVoucherDetailValidation.validateGlmastRecord.mockResolvedValue(
        mockGlData as any
      );

      await service.validateDetail(mockVoucherDetails, mockHeaders);

      expect(
        mockVoucherDetailValidation.validateGlmastRecord
      ).toHaveBeenCalledWith(2000, 10, expect.any(Array));
      expect(
        mockVoucherDetailValidation.validateGlmastRecord
      ).toHaveBeenCalledWith(2000, 10, expect.any(Array));
    });
  });
});
