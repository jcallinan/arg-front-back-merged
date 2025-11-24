import { Test, TestingModule } from "@nestjs/testing";
import { VoucherSharedService } from "./voucher.shared.service";
import { VoucherHeaderInterface } from "@src/main/account-payable/domain/interface/voucher.interface";
import { VoucherHeaderValidationService } from "../validations/voucher-header.validation.service";
import { VendorAppService } from "@src/main/account-payable/domain/services/vendor/vendor.service";
import { CompanyService } from "@src/main/account-payable/domain/services/company/companies.service";
import { GlMasterService } from "@src/main/account-payable/domain/services/gl-master/gl-master.service";
import { CarrierInvoiceHeaderService } from "@src/main/account-payable/domain/services/carrier-invoice-header/carrier-invoice-header.service";
import { FreightInvoiceHeaderService } from "@src/main/account-payable/domain/services/freight-invoice-header/freight-invoice-header.service";
import { VoucherDetailValidationService } from "./voucher-detail.shared.service";
import { ApdateInterface } from "@src/main/account-payable/domain/interface/apdate.interface";
import { PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";
import { VOUCHER_STATUS_CODES } from "@src/shared/constants/status-map";

describe("VoucherSharedService", () => {
  let service: VoucherSharedService;
  let mockApdateInterface: jest.Mocked<ApdateInterface>;
  let mockVoucherHeaderInterface: jest.Mocked<VoucherHeaderInterface>;
  let mockVoucherHeaderValidationService: jest.Mocked<VoucherHeaderValidationService>;
  let mockVendorAppService: jest.Mocked<VendorAppService>;
  let mockCompanyService: jest.Mocked<CompanyService>;
  let mockGlMasterService: jest.Mocked<GlMasterService>;
  let mockCarrierInvoiceHeaderService: jest.Mocked<CarrierInvoiceHeaderService>;
  let mockFreightInvoiceHeaderService: jest.Mocked<FreightInvoiceHeaderService>;
  let mockVoucherDetailValidationService: jest.Mocked<VoucherDetailValidationService>;

  const mockVendor = {
    vendorNo: 1001,
    vendorName: "Test Vendor",
    vendorApTermsCode: 30,
    vendorCarrierId: "CAR001",
    vendorSingleCheck: "N",
    vendorHoldPaymentsVend: "H",
    vendorAdd1: "123 Test St",
    vendorAdd2: "Suite 100",
    vendorAdd3: "Test City",
    vendorAdd4: "12345",
  };

  const mockCompany = {
    companyNo: 10,
    companyNextEntryNo: 1001,
    companyDiscountsGlNo: 1000,
    companyApGlNo: 2000,
    companyBankGlNo: 3000,
  };

  const mockGeneralSystemEntity = {
    companyNo: 10,
    systemCode: "AP",
    systemValue: "30",
  };

  beforeEach(async () => {
    mockApdateInterface = {
      getNewDate: jest.fn(),
    } as any;

    mockVoucherHeaderInterface = {
      findAll: jest.fn(),
    } as any;

    mockVoucherHeaderValidationService = {
      addNewError: jest.fn(),
      fetchGstablRecord: jest.fn(),
      calculateDueDate: jest.fn(),
      calculateDiscountDueDate: jest.fn(),
      extendMultipleDates: jest.fn(),
      validateDate: jest.fn(),
      validateCarrierInvoiceHeaderRecord: jest.fn(),
      shouldSkipValidation: jest.fn(),
      validateVoucherHeaders: jest.fn(),
      validateHoldCode: jest.fn(),
      validateGlNumber: jest.fn(),
    } as any;

    mockVendorAppService = {
      findVendorByNo: jest.fn(),
    } as any;

    mockCompanyService = {
      updateNextEntryNo: jest.fn(),
    } as any;

    mockGlMasterService = {
      getGlDescription: jest.fn(),
    } as any;

    mockCarrierInvoiceHeaderService = {
      getCarrierInvoiceHeaderRecord: jest.fn(),
    } as any;

    mockFreightInvoiceHeaderService = {
      getFreightInvoiceHeaderRecord: jest.fn(),
    } as any;

    mockVoucherDetailValidationService = {
      validateDetail: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoucherSharedService,
        {
          provide: "ApdateInterface",
          useValue: mockApdateInterface,
        },
        {
          provide: "VoucherHeaderInterface",
          useValue: mockVoucherHeaderInterface,
        },
        {
          provide: VoucherHeaderValidationService,
          useValue: mockVoucherHeaderValidationService,
        },
        {
          provide: VendorAppService,
          useValue: mockVendorAppService,
        },
        {
          provide: CompanyService,
          useValue: mockCompanyService,
        },
        {
          provide: GlMasterService,
          useValue: mockGlMasterService,
        },
        {
          provide: CarrierInvoiceHeaderService,
          useValue: mockCarrierInvoiceHeaderService,
        },
        {
          provide: FreightInvoiceHeaderService,
          useValue: mockFreightInvoiceHeaderService,
        },
        {
          provide: VoucherDetailValidationService,
          useValue: mockVoucherDetailValidationService,
        },
      ],
    }).compile();

    service = module.get<VoucherSharedService>(VoucherSharedService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("headerValidation", () => {
    const mockHeaderDto = {
      companyNo: 10,
      invoiceNo: "INV001",
      invoiceAmount: 1000,
      invoiceDate: "010124",
      dueDate: "020124",
      discountDueDate: "011524",
      salesOrderNo: 1001,
      vendorNo: 1001,
      processType: PROCESS_TYPE_ENUM.NORMAL,
      holdCode: "N",
      apGlNo: 2000,
      bankGl: 3000,
      entryNo: 1001,
      prepaidCode: "N",
      prepaidCheckNo: 0,
      prepaidCheckdate: "0",
    };

    beforeEach(() => {
      mockVendorAppService.findVendorByNo.mockResolvedValue(mockVendor as any);
      mockVoucherHeaderValidationService.fetchGstablRecord.mockResolvedValue(
        mockGeneralSystemEntity as any
      );
      mockVoucherHeaderValidationService.calculateDueDate.mockReturnValue(
        "020124"
      );
      mockVoucherHeaderValidationService.calculateDiscountDueDate.mockReturnValue(
        "011524"
      );
      mockApdateInterface.getNewDate.mockResolvedValue("20124");
      mockVoucherHeaderValidationService.extendMultipleDates.mockResolvedValue([
        "20124",
        "11524",
      ]);
      mockVoucherHeaderValidationService.shouldSkipValidation.mockReturnValue(
        false
      );
      mockCarrierInvoiceHeaderService.getCarrierInvoiceHeaderRecord.mockResolvedValue(
        null
      );
      mockVoucherHeaderValidationService.validateDate.mockImplementation(
        () => {}
      );
      mockVoucherHeaderValidationService.validateHoldCode.mockImplementation(
        () => {}
      );
      mockVoucherHeaderValidationService.validateGlNumber.mockResolvedValue();
    });

    it("should successfully validate header with valid data", async () => {
      const result = await service.headerValidation(mockHeaderDto as any);

      expect(result).toEqual({
        newDueDate: 20124,
        newDiscountDueDate: 11524,
        foundVendor: mockVendor,
      });

      expect(mockVendorAppService.findVendorByNo).toHaveBeenCalledWith(
        1001,
        10
      );
      expect(
        mockVoucherHeaderValidationService.fetchGstablRecord
      ).toHaveBeenCalledWith(mockVendor);
      expect(mockApdateInterface.getNewDate).toHaveBeenCalledTimes(2);
    });

    it("should return validation errors for invalid invoice date", async () => {
      const invalidDto = { ...mockHeaderDto, invoiceDate: "invalid" };

      // Mock the validation service to add an error
      mockVoucherHeaderValidationService.addNewError.mockImplementation(
        (errors) => {
          errors.push({
            field: "invoiceDate",
            code: "INVALID_DATE",
            message: "Invalid invoice date",
          });
        }
      );

      const result = await service.headerValidation(invalidDto as any);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty("field");
      expect(result[0]).toHaveProperty("code");
      expect(result[0]).toHaveProperty("message");
    });

    it("should return processor errors for FLEXI process type", async () => {
      const flexiDto = {
        ...mockHeaderDto,
        processType: PROCESS_TYPE_ENUM.FLEXI,
      };

      // Mock validation errors by making the validation fail
      mockVoucherHeaderValidationService.validateDate.mockImplementation(
        (date, field, errors) => {
          errors.push({
            field: "test",
            code: "TEST001",
            message: "Test error",
          });
        }
      );

      const result = await service.headerValidation(flexiDto as any);

      expect(result).toHaveProperty("errors");
      expect(result).toHaveProperty("data");
      expect((result as any).errors).toHaveLength(2);
      expect((result as any).data.foundVendor).toEqual(mockVendor);
    });

    it("should return processor errors for SOGAS process type", async () => {
      const sogasDto = {
        ...mockHeaderDto,
        processType: PROCESS_TYPE_ENUM.SOGAS,
      };

      // Mock validation errors by making the validation fail
      mockVoucherHeaderValidationService.validateDate.mockImplementation(
        (date, field, errors) => {
          errors.push({
            field: "test",
            code: "TEST001",
            message: "Test error",
          });
        }
      );

      const result = await service.headerValidation(sogasDto as any);

      expect(result).toHaveProperty("errors");
      expect(result).toHaveProperty("data");
      expect((result as any).errors).toHaveLength(2);
      expect((result as any).data.foundVendor).toEqual(mockVendor);
    });

    it("should handle carrier invoice header lookup for sales order", async () => {
      const mockCarrierHeader = {};
      mockCarrierInvoiceHeaderService.getCarrierInvoiceHeaderRecord.mockResolvedValue(
        mockCarrierHeader as any
      );

      await service.headerValidation(mockHeaderDto as any);

      expect(
        mockCarrierInvoiceHeaderService.getCarrierInvoiceHeaderRecord
      ).toHaveBeenCalledWith(10, "CAR001", "INV001", 1001);
    });

    it("should handle freight invoice header lookup when no sales order", async () => {
      const noSalesOrderDto = { ...mockHeaderDto };
      delete (noSalesOrderDto as any).salesOrderNo;

      await service.headerValidation(noSalesOrderDto as any);

      expect(
        mockFreightInvoiceHeaderService.getFreightInvoiceHeaderRecord
      ).toHaveBeenCalledWith(10, "CAR001", "INV001");
    });

    it("should skip voucher header validation for PAPER process type", async () => {
      const paperDto = {
        ...mockHeaderDto,
        processType: PROCESS_TYPE_ENUM.PAPER,
      };

      await service.headerValidation(paperDto as any);

      expect(
        mockVoucherHeaderValidationService.validateVoucherHeaders
      ).not.toHaveBeenCalled();
    });

    it("should skip voucher header validation for ARGLMS process type", async () => {
      const arglmsDto = {
        ...mockHeaderDto,
        processType: PROCESS_TYPE_ENUM.ARGLMS,
      };

      await service.headerValidation(arglmsDto as any);

      expect(
        mockVoucherHeaderValidationService.validateVoucherHeaders
      ).not.toHaveBeenCalled();
    });

    it("should handle discount due date of 0 correctly", async () => {
      mockVoucherHeaderValidationService.calculateDiscountDueDate.mockReturnValue(
        "0"
      );

      await service.headerValidation(mockHeaderDto as any);

      expect(mockApdateInterface.getNewDate).toHaveBeenCalledTimes(1); // Only for due date
    });
  });

  describe("getVoucherHeaders", () => {
    const mockGetHeadersDto = {
      companyNo: 10,
      vendorNo: 1001,
      entryNo: 1001,
      limit: 10,
      offset: 0,
      page: 1,
      sortBy: "entryNo",
      sortOrder: "asc" as const,
    };

    const mockVoucherHeaders = [
      {
        entryNo: 1001,
        companyNo: 10,
        vendorNo: 1001,
        invoiceNo: "INV001",
      } as any,
      {
        entryNo: 1002,
        companyNo: 10,
        vendorNo: 1002,
        invoiceNo: "INV002",
      } as any,
    ];

    beforeEach(() => {
      mockVoucherHeaderInterface.findAll.mockResolvedValue({
        rows: mockVoucherHeaders,
        count: 2,
      });
    });

    it("should return paginated voucher headers", async () => {
      const result = await service.getVoucherHeaders(mockGetHeadersDto as any);

      expect(result).toHaveProperty("items");
      expect(result).toHaveProperty("pagination");
      expect(result.items).toHaveLength(2);
      expect(result.pagination.total_items).toBe(2);
      expect(result.pagination.current_page).toBe(1);
      expect(result.pagination.items_per_page).toBe(500); // Default limit
    });

    it("should call voucher header interface with correct parameters", async () => {
      await service.getVoucherHeaders(mockGetHeadersDto as any);

      expect(mockVoucherHeaderInterface.findAll).toHaveBeenCalledWith({
        companyNo: 10,
        vendorNo: 1001,
        entryNo: 1001,
        limit: 500, // Default limit
        offset: 0,
        sortBy: "entryNo",
        sortOrder: "asc",
      });
    });
  });

  describe("buildVoucherHeaderData", () => {
    const mockBody = {
      companyNo: 10,
      entryNo: 1001,
      vendorNo: 1001,
      apGlNo: 2000,
      invoiceDesc: "Test Invoice",
      invoiceDate: 20240101,
      singleCheck: "N",
      holdCode: "N",
      holdDesc: "No Hold",
      prepaidCode: "N",
      prepaidCheckNo: 0,
      prepaidCheckdate: 0,
      bankGl: 3000,
      invoiceAmount: 1000,
      totalFreight: 0,
      salesOrderNo: 0,
      srn: 0,
      processType: PROCESS_TYPE_ENUM.NORMAL,
      invoiceNo: "INV001",
      dueDate: 20240201,
      discountDueDate: 20240115,
      foundVendor: mockVendor,
      extendedDiscountDueDate: 20240115,
      status: VOUCHER_STATUS_CODES.S,
      retentionGl: 0,
      carrierId: "CAR001",
    };

    it("should build voucher header data for normal process type", () => {
      const result = service.buildVoucherHeaderData(mockBody);

      expect(result).toEqual({
        isDeleted: "A",
        companyNo: 10,
        entryNo: 1001,
        entrySequence: 0,
        vendorNo: 1001,
        canceledVoucher: 0,
        apGlNo: 2000,
        invoiceDesc: "Test Invoice",
        invoiceDate: 20240101,
        dueDate: 20240201,
        singleCheck: "N",
        holdCode: "N",
        holdDesc: "No Hold",
        prepaidCode: "N",
        prepaidCheckNo: 0,
        vendorName: "Test Vendor",
        vendorAdd1: "123 Test St",
        vendorAdd2: "Suite 100",
        vendorAdd3: "Test City",
        vendorAdd4: "12345",
        bankGl: 3000,
        invoiceAmount: 1000,
        retentionGl: 0,
        retentionPct: 0,
        prepaidCheckdate: 0,
        totalFreight: 0,
        salesOrderNo: 0,
        srn: 0,
        carrierId: "CAR001",
        vendorPaymentTerms: 0,
        processType: PROCESS_TYPE_ENUM.NORMAL,
        discountDueDate: 20240115,
        extendedDiscountDueDate: 20240115,
        invoiceNo: "INV001",
        status: undefined,
        fillerOne: "",
        fillerTwo: "",
      });
    });

    it("should build voucher header data for PAPER process type", () => {
      const paperBody = { ...mockBody, processType: PROCESS_TYPE_ENUM.PAPER };

      const result = service.buildVoucherHeaderData(paperBody);

      expect(result.singleCheck).toBe("N");
      expect(result.holdCode).toBe("H");
      expect(result.holdDesc).toBe("VENDOR ON HOLD");
      expect(result.vendorPaymentTerms).toBe(30);
      expect(result.status).toBe(VOUCHER_STATUS_CODES.S);
    });

    it("should handle missing optional fields", () => {
      const minimalBody = {
        companyNo: 10,
        entryNo: 1001,
        vendorNo: 1001,
        invoiceDate: 20240101,
        foundVendor: mockVendor,
        processType: PROCESS_TYPE_ENUM.NORMAL,
      };

      const result = service.buildVoucherHeaderData(minimalBody);

      expect(result.invoiceDesc).toBe("");
      expect(result.apGlNo).toBe(0);
      expect(result.bankGl).toBe(0);
      expect(result.invoiceAmount).toBe(0);
    });
  });

  describe("getAndIncrementNextEntryNo", () => {
    beforeEach(() => {
      mockCompanyService.updateNextEntryNo.mockResolvedValue(
        mockCompany as any
      );
    });

    it("should increment next entry number and return current value", async () => {
      const result = await service.getAndIncrementNextEntryNo(
        mockCompany as any,
        1
      );

      expect(result).toBe(1001);
      expect(mockCompanyService.updateNextEntryNo).toHaveBeenCalledWith(
        10,
        1002
      );
    });

    it("should handle entry number rollover from 99999 to 1", async () => {
      const companyWithMaxEntry = { ...mockCompany, companyNextEntryNo: 99999 };

      const result = await service.getAndIncrementNextEntryNo(
        companyWithMaxEntry as any,
        1
      );

      expect(result).toBe(99999);
      expect(mockCompanyService.updateNextEntryNo).toHaveBeenCalledWith(10, 1);
    });

    it("should handle custom reserve count", async () => {
      const result = await service.getAndIncrementNextEntryNo(
        mockCompany as any,
        5
      );

      expect(result).toBe(1001);
      expect(mockCompanyService.updateNextEntryNo).toHaveBeenCalledWith(
        10,
        1006
      );
    });
  });

  describe("getCompanyGlDescriptions", () => {
    beforeEach(() => {
      mockGlMasterService.getGlDescription
        .mockResolvedValueOnce("Discounts GL Description")
        .mockResolvedValueOnce("AP GL Description")
        .mockResolvedValueOnce("Bank GL Description");
    });

    it("should return company GL descriptions", async () => {
      const result = await service.getCompanyGlDescriptions(mockCompany as any);

      expect(result).toEqual({
        companyDiscountsGlDesc: "Discounts GL Description",
        companyApGlDesc: "AP GL Description",
        companyBankGlDesc: "Bank GL Description",
      });

      expect(mockGlMasterService.getGlDescription).toHaveBeenCalledTimes(3);
      expect(mockGlMasterService.getGlDescription).toHaveBeenCalledWith(
        10,
        1000,
        "C",
        true
      );
      expect(mockGlMasterService.getGlDescription).toHaveBeenCalledWith(
        10,
        2000,
        "C",
        true
      );
      expect(mockGlMasterService.getGlDescription).toHaveBeenCalledWith(
        10,
        3000,
        "C",
        true
      );
    });
  });

  describe("getValidationMessages", () => {
    const mockVoucherHeader = {
      entryNo: 1001,
      companyNo: 10,
      vendorNo: 1001,
      invoiceNo: "INV001",
      invoiceAmount: 1000,
      invoiceDate: 20240101,
      dueDate: 20240201,
      discountDueDate: 20240115,
      salesOrderNo: 0,
      processType: PROCESS_TYPE_ENUM.NORMAL,
      holdCode: "N",
      apGlNo: 2000,
      bankGl: 3000,
      prepaidCode: "N",
      prepaidCheckNo: 0,
      prepaidCheckdate: 0,
    };

    const mockVoucherDetails = [
      {
        id: 1,
        entryNo: 1001,
        lineNo: 1,
        glNo: 2000,
        amount: 1000,
        description: "Test Detail",
      },
    ];

    beforeEach(() => {
      // Mock successful header validation
      jest.spyOn(service, "headerValidation").mockResolvedValue({
        newDueDate: 20124,
        newDiscountDueDate: 11524,
        foundVendor: mockVendor as any,
      });
    });

    it("should return empty validation messages when no errors", async () => {
      mockVoucherDetailValidationService.validateDetail.mockResolvedValue({
        error: false,
        data: [],
      } as any);

      const result = await service.getValidationMessages(
        mockVoucherHeader as any,
        mockVoucherDetails as any
      );

      expect(result.validationMessages).toEqual([]);
      expect(result.errors).toBeUndefined();
      expect(result.warnings).toBeUndefined();
    });

    it("should return header validation errors when header validation fails", async () => {
      const headerErrors = [
        {
          field: "invoiceDate",
          code: "INVALID_DATE",
          message: "Invalid invoice date",
        },
      ];
      jest.spyOn(service, "headerValidation").mockResolvedValue(headerErrors);

      const result = await service.getValidationMessages(
        mockVoucherHeader as any
      );

      expect(result.validationMessages).toEqual(headerErrors);
      expect(result.errors).toBeUndefined();
      expect(result.warnings).toBeUndefined();
    });

    it("should return detail validation errors when detail validation fails", async () => {
      const detailErrors = {
        error: true as const,
        errors: [
          {
            index: 0,
            errors: [
              {
                field: "amount",
                code: "INVALID_AMOUNT",
                message: "Invalid amount",
              },
            ],
          },
        ],
        warnings: [],
      };
      mockVoucherDetailValidationService.validateDetail.mockResolvedValue(
        detailErrors as any
      );

      const result = await service.getValidationMessages(
        mockVoucherHeader as any,
        mockVoucherDetails as any
      );

      expect(result.validationMessages).toEqual([]);
      expect(result.errors).toBeDefined();
      expect((result.errors as any).code).toBe("VALIDATION_ERROR");
      expect((result.errors as any).details).toHaveLength(1);
    });

    it("should return detail validation warnings when only warnings exist", async () => {
      const detailWarnings = {
        error: false as const,
        data: [],
        warnings: [
          {
            index: 0,
            warnings: [
              { field: "description", message: "Description is too long" },
            ],
          },
        ],
      };
      mockVoucherDetailValidationService.validateDetail.mockResolvedValue(
        detailWarnings as any
      );

      const result = await service.getValidationMessages(
        mockVoucherHeader as any,
        mockVoucherDetails as any
      );

      expect(result.validationMessages).toEqual([]);
      expect(result.warnings).toBeDefined();
      expect((result.warnings as any).code).toBe("VALIDATION_ERROR");
      expect((result.warnings as any).details).toHaveLength(1);
    });

    it("should handle processor errors from header validation", async () => {
      const processorErrors = {
        errors: [{ field: "test", code: "TEST001", message: "Test error" }],
        data: {
          newDueDate: 20124,
          newDiscountDueDate: 11524,
          foundVendor: mockVendor as any,
        },
      };
      jest
        .spyOn(service, "headerValidation")
        .mockResolvedValue(processorErrors as any);

      const result = await service.getValidationMessages(
        mockVoucherHeader as any
      );

      expect(result.validationMessages).toEqual(processorErrors.errors);
    });
  });

  describe("getHoldDescFromVendorHoldCode", () => {
    it("should return correct hold description for H code", () => {
      const result = service.getHoldDescFromVendorHoldCode("H");
      expect(result).toBe("VENDOR ON HOLD");
    });

    it("should return correct hold description for A code", () => {
      const result = service.getHoldDescFromVendorHoldCode("A");
      expect(result).toBe("ON HOLD FOR ACH");
    });

    it("should return correct hold description for W code", () => {
      const result = service.getHoldDescFromVendorHoldCode("W");
      expect(result).toBe("ON HOLD FOR WIRE TRANSFER");
    });

    it("should return correct hold description for U code", () => {
      const result = service.getHoldDescFromVendorHoldCode("U");
      expect(result).toBe("ON HOLD FOR UTILITY AUTO");
    });

    it("should return empty string for unknown code", () => {
      const result = service.getHoldDescFromVendorHoldCode("X");
      expect(result).toBe("");
    });

    it("should return empty string for undefined code", () => {
      const result = service.getHoldDescFromVendorHoldCode(undefined as any);
      expect(result).toBe("");
    });
  });
});
