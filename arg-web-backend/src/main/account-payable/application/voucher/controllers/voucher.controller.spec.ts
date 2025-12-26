import { Test, TestingModule } from "@nestjs/testing";
import { VoucherController } from "./voucher.controller";
import { GetCompaniesUseCase } from "../usecases/get-companies/get-companies.usecase";
import { GetVendorUseCase } from "../usecases/get-vendors/get-vendor.usecase";
import { GetVendorByIdUseCase } from "../usecases/get-vendor-by-id/get-vendor-by-id.usecase";
import { GetVoucherEntryUseCase } from "../usecases/get-voucher-entry/get-voucher-entry.usecase";
import { VoucherHeaderValidationUseCase } from "../usecases/post-header-validation/post-header-validation.usecase";
import { GetProcessTypes } from "../usecases/get-process-types/get-process-types.usecase";
import { SoftDeleteVoucherUseCase } from "../usecases/soft-delete-voucher/soft-delete-voucher.usecase";
import { SubmitVoucherUseCase } from "../usecases/submit-voucher/submit-voucher.usecase";
import { GetVoucherConfigUseCase } from "../usecases/voucher-config/get-voucher-config.usecase";
import { GetVoucherHeaderUseCase } from "../usecases/get-voucher-header/get-voucher-header.usecase";
import { GetGlMasterUseCase } from "../usecases/gl-master/get-gl-master.usecase";
import { GetSogasEntryUseCase } from "../usecases/get-sogas-entry/get-sogas-entry.usecase";
import { GetFlexiEntryUseCase } from "../usecases/get-flexi-entry/get-flexi-entry.usecase";
import { VoucherCsvUploadUseCase } from "../usecases/upload-csv/upload-csv.usecase";
import { GetCarrierInvoicesUseCase } from "../usecases/get-carrier-invoices/get-carrier-invoices.usecase";
import { GetPaperEntryUseCase } from "../usecases/get-paper-entry/get-paper-entry.usecase";
import { ApdateAppService } from "@src/main/account-payable/domain/services/apdate/apdate.service";
import { GlMasterService } from "@src/main/account-payable/domain/services/gl-master/gl-master.service";
import { GeneralSystemService } from "@src/main/account-payable/domain/services/general-system/general-system.service";
import { FreightInvoiceHeaderService } from "@src/main/account-payable/domain/services/freight-invoice-header/freight-invoice-header.service";
import { GetVoucherSummaryUseCase } from "../usecases/get-voucher-summary/get-voucher-summary.usecase";
import { GetLmsEntryUseCase } from "../usecases/get-lms-entry/get-lms-entry.usecase";
import { GetLmsCarrierInvoicesUseCase } from "../usecases/get-lms-carrier-invoices/get-lms-carrier-invoices.usecase";
import { PaperBatchCreateUseCase } from "../usecases/paper-batch-create/paper-batch-create.usecase";
import { LmsBatchCreateUseCase } from "../usecases/lms-batch-create/lms-batch-create.usecase";
import { SoftDeleteVoucherDetailUseCase } from "../usecases/soft-delete-voucher-detail/soft-delete-voucher-detail.usecase";
import { PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";
import {
  PaginatedResponseFactory,
  VoucherDtoFactory,
  VoucherMockResponseFactory,
} from "@src/shared/tests";

describe("VoucherController", () => {
  let controller: VoucherController;
  let getCompaniesUseCase: GetCompaniesUseCase;
  let getVendorUseCase: GetVendorUseCase;
  let getVendorByIdUseCase: GetVendorByIdUseCase;
  let getVoucherUseCase: GetVoucherEntryUseCase;
  let postVoucherHeaderValidationUseCase: VoucherHeaderValidationUseCase;
  let getProcessTypes: GetProcessTypes;
  let softDeleteVoucherUseCase: SoftDeleteVoucherUseCase;
  let submitVoucherUseCase: SubmitVoucherUseCase;
  let getVoucherConfigUseCase: GetVoucherConfigUseCase;
  let getVoucherHeaderUseCase: GetVoucherHeaderUseCase;
  let getGlMasterUseCase: GetGlMasterUseCase;

  const mockGetCompaniesUseCase = {
    execute: jest.fn(),
    cacheAllCompanies: jest.fn(),
  };

  const mockGetVendorUseCase = {
    execute: jest.fn(),
  };

  const mockGetVendorByIdUseCase = {
    execute: jest.fn(),
    cacheAllVendorsForCompany: jest.fn(),
  };

  const mockGetVoucherUseCase = {
    execute: jest.fn(),
  };

  const mockPostVoucherHeaderValidationUseCase = {
    execute: jest.fn(),
  };

  const mockGetProcessTypes = {
    execute: jest.fn(),
  };

  const mockSoftDeleteVoucherUseCase = {
    execute: jest.fn(),
  };

  const mockSubmitVoucherUseCase = {
    execute: jest.fn(),
  };

  const mockGetVoucherConfigUseCase = {
    execute: jest.fn(),
  };

  const mockGetVoucherHeaderUseCase = {
    execute: jest.fn(),
  };

  const mockGetGlMasterUseCase = {
    execute: jest.fn(),
  };

  const mockGetSogasEntryUseCase = {
    execute: jest.fn(),
  };

  const mockGetFlexiEntryUseCase = {
    execute: jest.fn(),
  };

  const mockVoucherCsvUploadUseCase = {
    execute: jest.fn(),
  };

  const mockGetCarrierInvoicesUseCase = {
    execute: jest.fn(),
  };

  const mockGetPaperEntryUseCase = {
    execute: jest.fn(),
  };

  const mockApdateAppService = {
    cacheAllApdateForCompany: jest.fn(),
  };

  const mockGlMasterService = {
    cacheGlMasterForCompany: jest.fn(),
  };

  const mockGeneralSystemService = {
    cacheGSTableData: jest.fn(),
  };

  const mockFreightInvoiceHeaderService = {
    cacheFreightInvoiceHeaderForCompany: jest.fn(),
  };

  const mockGetVoucherSummaryUseCase = {
    execute: jest.fn(),
  };

  const mockGetLmsEntryUseCase = {
    execute: jest.fn(),
  };

  const mockGetLmsCarrierInvoicesUseCase = {
    execute: jest.fn(),
  };

  const mockPaperBatchCreateUseCase = {
    execute: jest.fn(),
  };

  const mockLmsBatchCreateUseCase = {
    execute: jest.fn(),
  };

  const mockSoftDeleteVoucherDetailUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoucherController],
      providers: [
        {
          provide: GetCompaniesUseCase,
          useValue: mockGetCompaniesUseCase,
        },
        {
          provide: GetVendorUseCase,
          useValue: mockGetVendorUseCase,
        },
        {
          provide: GetVendorByIdUseCase,
          useValue: mockGetVendorByIdUseCase,
        },
        {
          provide: GetVoucherEntryUseCase,
          useValue: mockGetVoucherUseCase,
        },
        {
          provide: GetSogasEntryUseCase,
          useValue: mockGetSogasEntryUseCase,
        },
        {
          provide: GetFlexiEntryUseCase,
          useValue: mockGetFlexiEntryUseCase,
        },
        {
          provide: VoucherHeaderValidationUseCase,
          useValue: mockPostVoucherHeaderValidationUseCase,
        },
        {
          provide: GetProcessTypes,
          useValue: mockGetProcessTypes,
        },
        {
          provide: SoftDeleteVoucherUseCase,
          useValue: mockSoftDeleteVoucherUseCase,
        },
        {
          provide: SubmitVoucherUseCase,
          useValue: mockSubmitVoucherUseCase,
        },
        {
          provide: GetVoucherConfigUseCase,
          useValue: mockGetVoucherConfigUseCase,
        },
        {
          provide: GetVoucherHeaderUseCase,
          useValue: mockGetVoucherHeaderUseCase,
        },
        {
          provide: VoucherCsvUploadUseCase,
          useValue: mockVoucherCsvUploadUseCase,
        },
        {
          provide: GetGlMasterUseCase,
          useValue: mockGetGlMasterUseCase,
        },
        {
          provide: GetCarrierInvoicesUseCase,
          useValue: mockGetCarrierInvoicesUseCase,
        },
        {
          provide: GetPaperEntryUseCase,
          useValue: mockGetPaperEntryUseCase,
        },
        {
          provide: ApdateAppService,
          useValue: mockApdateAppService,
        },
        {
          provide: GlMasterService,
          useValue: mockGlMasterService,
        },
        {
          provide: GeneralSystemService,
          useValue: mockGeneralSystemService,
        },
        {
          provide: FreightInvoiceHeaderService,
          useValue: mockFreightInvoiceHeaderService,
        },
        {
          provide: GetVoucherSummaryUseCase,
          useValue: mockGetVoucherSummaryUseCase,
        },
        {
          provide: GetLmsEntryUseCase,
          useValue: mockGetLmsEntryUseCase,
        },
        {
          provide: GetLmsCarrierInvoicesUseCase,
          useValue: mockGetLmsCarrierInvoicesUseCase,
        },
        {
          provide: PaperBatchCreateUseCase,
          useValue: mockPaperBatchCreateUseCase,
        },
        {
          provide: LmsBatchCreateUseCase,
          useValue: mockLmsBatchCreateUseCase,
        },
        {
          provide: SoftDeleteVoucherDetailUseCase,
          useValue: mockSoftDeleteVoucherDetailUseCase,
        },
      ],
    }).compile();

    controller = module.get<VoucherController>(VoucherController);
    getCompaniesUseCase = module.get<GetCompaniesUseCase>(GetCompaniesUseCase);
    getVendorUseCase = module.get<GetVendorUseCase>(GetVendorUseCase);
    getVendorByIdUseCase =
      module.get<GetVendorByIdUseCase>(GetVendorByIdUseCase);
    getVoucherUseCase = module.get<GetVoucherEntryUseCase>(
      GetVoucherEntryUseCase
    );
    postVoucherHeaderValidationUseCase =
      module.get<VoucherHeaderValidationUseCase>(
        VoucherHeaderValidationUseCase
      );
    getProcessTypes = module.get<GetProcessTypes>(GetProcessTypes);
    softDeleteVoucherUseCase = module.get<SoftDeleteVoucherUseCase>(
      SoftDeleteVoucherUseCase
    );
    submitVoucherUseCase =
      module.get<SubmitVoucherUseCase>(SubmitVoucherUseCase);
    getVoucherConfigUseCase = module.get<GetVoucherConfigUseCase>(
      GetVoucherConfigUseCase
    );
    getVoucherHeaderUseCase = module.get<GetVoucherHeaderUseCase>(
      GetVoucherHeaderUseCase
    );
    getGlMasterUseCase = module.get<GetGlMasterUseCase>(GetGlMasterUseCase);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getAllCompanies", () => {
    it("should return formatted companies with pagination", async () => {
      // Arrange
      const mockResponse =
        PaginatedResponseFactory.createSinglePagePaginatedResponse([
          {
            companyNo: "123",
            companyName: "Test Company",
            companyIsDeleted: "A",
          },
        ]);

      const expectedResponse =
        PaginatedResponseFactory.createSinglePagePaginatedResponse([
          {
            id: "123",
            label: "Test Company",
            value: "Test Company",
          },
        ]);

      mockGetCompaniesUseCase.execute.mockResolvedValue(mockResponse);

      // Act
      const result = await controller.getAllCompanies({});

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(result.items[0]).toHaveProperty("id");
      expect(result.items[0]).toHaveProperty("label");
      expect(result.items[0]).toHaveProperty("value");
      expect(getCompaniesUseCase.execute).toHaveBeenCalledWith({});
    });

    it("should handle pagination parameters", async () => {
      // Arrange
      const query = { current_page: 2, items_per_page: 20 };
      const mockResponse = {
        items: [],
        pagination: {
          total_items: 0,
          current_page: 2,
          items_per_page: 20,
          total_pages: 0,
        },
      };

      const expectedResponse = {
        items: [],
        pagination: {
          total_items: 0,
          current_page: 2,
          items_per_page: 20,
          total_pages: 0,
        },
      };

      mockGetCompaniesUseCase.execute.mockResolvedValue(mockResponse);

      // Act
      const result = await controller.getAllCompanies(query);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(getCompaniesUseCase.execute).toHaveBeenCalledWith(query);
    });

    it("should handle empty company list", async () => {
      // Arrange
      const mockResponse = {
        items: [],
        pagination: {
          total_items: 0,
          current_page: 1,
          items_per_page: 10,
          total_pages: 0,
        },
      };

      const expectedResponse = {
        items: [],
        pagination: {
          total_items: 0,
          current_page: 1,
          items_per_page: 10,
          total_pages: 0,
        },
      };

      mockGetCompaniesUseCase.execute.mockResolvedValue(mockResponse);

      // Act
      const result = await controller.getAllCompanies({});

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(result.items).toHaveLength(0);
    });
  });

  describe("getAllProcessTypes", () => {
    it("should return process types", async () => {
      // Arrange
      const mockProcessTypes =
        VoucherMockResponseFactory.createProcessTypesResponse();
      const expectedResponse = {
        items: mockProcessTypes,
      };

      mockGetProcessTypes.execute.mockResolvedValue(mockProcessTypes);

      // Act
      const result = await controller.getAllProcessTypes();

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(getProcessTypes.execute).toHaveBeenCalled();
    });
  });

  describe("getAllVendors", () => {
    it("should return formatted vendors with pagination", async () => {
      // Arrange
      const query = { companyNo: 1 };
      const mockResponse =
        VoucherMockResponseFactory.createVendorDropdownResponse(
          456,
          "Test Vendor"
        );
      const expectedResponse = {
        items: [
          {
            id: "456",
            label: "Test Vendor",
            value: "Test Vendor",
          },
        ],
        pagination: {
          total_items: 1,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      mockGetVendorUseCase.execute.mockResolvedValue(mockResponse);

      // Act
      const result = await controller.getAllVendors(query);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(getVendorUseCase.execute).toHaveBeenCalledWith(query);
    });
  });

  describe("getVendorById", () => {
    it("should return vendor by ID", async () => {
      // Arrange
      const query = { vendorNo: 456, companyNo: 1 };
      const mockVendor = VoucherMockResponseFactory.createVendorByIdResponse(
        456,
        "Test Vendor"
      );

      const expectedResponse = {
        items: mockVendor,
      };

      mockGetVendorByIdUseCase.execute.mockResolvedValue(mockVendor);

      // Act
      const result = await controller.getVendorById(query);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(getVendorByIdUseCase.execute).toHaveBeenCalledWith(query);
    });
  });

  describe("getGridEntryData", () => {
    it("should return voucher entry data with pagination", async () => {
      // Arrange
      const query = { companyNo: 1, current_page: 1, items_per_page: 10 };
      const mockResponse =
        VoucherMockResponseFactory.createVoucherEntryResponse(123, 1);
      const expectedResponse = mockResponse;

      mockGetVoucherUseCase.execute.mockResolvedValue(mockResponse);

      // Act
      const result = await controller.getGridEntryData(query);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(getVoucherUseCase.execute).toHaveBeenCalledWith(query);
    });
  });

  describe("softDeleteVoucher", () => {
    it("should soft delete voucher", async () => {
      // Arrange
      const dto = {
        entryNo: 123,
        companyNo: 1,
        vendorNo: 456,
        invoiceNo: "INV123",
      };
      const mockResult = {
        success: true,
        message: "Voucher deleted successfully",
      };

      const expectedResponse = {
        items: mockResult,
      };

      mockSoftDeleteVoucherUseCase.execute.mockResolvedValue(mockResult);

      // Act
      const result = await controller.softDeleteVoucher(dto);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(softDeleteVoucherUseCase.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe("getDataByEntryNo", () => {
    it("should return voucher data by entry number", async () => {
      // Arrange
      const entryNo = "123";
      const query = { companyNo: 1 };
      const mockData = { entryNo: "123", companyNo: 1 };

      const expectedResponse = {
        items: mockData,
      };

      mockGetVoucherHeaderUseCase.execute.mockResolvedValue(mockData);

      // Act
      const result = await controller.getDataByEntryNo(entryNo, query);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(getVoucherHeaderUseCase.execute).toHaveBeenCalledWith(
        entryNo,
        query
      );
    });
  });

  describe("submitVoucher", () => {
    it("should submit voucher", async () => {
      // Arrange
      const dto = {
        header: {
          companyNo: 10,
          entryNo: 1001,
          vendorNo: 1001,
          apGlNo: 12010001,
          invoiceDate: "010124",
          bankGl: 10010001,
          invoiceAmount: 1000.0,
          invoiceNo: "INV001",
          processType: PROCESS_TYPE_ENUM.NORMAL,
        },
        details: [
          {
            companyNo: 10,
            entryNo: 1001,
            lineGlNo: 12010001,
            productAmount: 1000.0,
          },
        ],
      };
      const mockResult =
        VoucherMockResponseFactory.createVoucherSubmitSuccessResponse();

      const expectedResponse = {
        items: mockResult,
      };

      mockSubmitVoucherUseCase.execute.mockResolvedValue(mockResult);

      // Act
      const result = await controller.submitVoucher(dto);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(submitVoucherUseCase.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe("submitHeader", () => {
    it("should submit header validation", async () => {
      // Arrange
      const body = VoucherDtoFactory.createVoucherSubmitDto();
      const mockResult =
        VoucherMockResponseFactory.createHeaderValidationSuccessResponse();

      mockPostVoucherHeaderValidationUseCase.execute.mockResolvedValue(
        mockResult
      );

      // Act
      const result = await controller.submitHeader(body);

      // Assert
      expect(result).toEqual(mockResult);
      expect(postVoucherHeaderValidationUseCase.execute).toHaveBeenCalledWith(
        body
      );
    });
  });

  describe("getVoucherConfig", () => {
    it("should return voucher configuration", async () => {
      // Arrange
      const companyNo = 1;
      const vendorNo = 456;
      const mockConfig = { companyNo: 1, vendorNo: 456, config: "test" };

      const expectedResponse = {
        items: mockConfig,
      };

      mockGetVoucherConfigUseCase.execute.mockResolvedValue(mockConfig);

      // Act
      const result = await controller.getVoucherConfig(companyNo, vendorNo);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(getVoucherConfigUseCase.execute).toHaveBeenCalledWith(
        companyNo,
        vendorNo
      );
    });
  });

  describe("getGlMaster", () => {
    it("should return GL master data", async () => {
      // Arrange
      const dto = { companyNo: 1, glNo: 12010001 };
      const mockResult = [{ accountNo: "1000", accountName: "Test Account" }];

      const expectedResponse = {
        items: mockResult,
      };

      mockGetGlMasterUseCase.execute.mockResolvedValue(mockResult);

      // Act
      const result = await controller.getGlMaster(dto);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(getGlMasterUseCase.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe("cacheDataForCompany", () => {
    it("should cache data for company successfully", async () => {
      // Arrange
      const body = { companyNo: 10 };
      const mockCacheResults = {
        companies: { totalCompanies: 5, cachedCompanies: 5 },
        vendors: { totalVendors: 100, cachedVendors: 100 },
        apdate: { totalApdates: 1000, cachedApdates: 1000 },
        glmaster: { totalGlMasters: 500, cachedGlMasters: 500 },
        gstable: { totalGSTables: 50, cachedGSTables: 50 },
        freightinvoice: {
          totalFreightInvoices: 200,
          cachedFreightInvoices: 200,
        },
      };

      mockGetCompaniesUseCase.cacheAllCompanies.mockResolvedValue(
        mockCacheResults.companies
      );
      mockGetVendorByIdUseCase.cacheAllVendorsForCompany.mockResolvedValue(
        mockCacheResults.vendors
      );
      mockApdateAppService.cacheAllApdateForCompany.mockResolvedValue(
        mockCacheResults.apdate
      );
      mockGlMasterService.cacheGlMasterForCompany.mockResolvedValue(
        mockCacheResults.glmaster
      );
      mockGeneralSystemService.cacheGSTableData.mockResolvedValue(
        mockCacheResults.gstable
      );
      mockFreightInvoiceHeaderService.cacheFreightInvoiceHeaderForCompany.mockResolvedValue(
        mockCacheResults.freightinvoice
      );

      // Act
      const result = await controller.cacheDataForCompany(body);

      // Assert
      expect(result.items).toHaveProperty("companies");
      expect(result.items).toHaveProperty("vendors");
      expect(result.items).toHaveProperty("apdate");
      expect(result.items).toHaveProperty("glmaster");
      expect(result.items).toHaveProperty("gstable");
      expect(result.items).toHaveProperty("freightinvoice");
      expect(result.items).toHaveProperty("totalDuration");
      expect(result.items).toHaveProperty("summary");
      expect(getCompaniesUseCase.cacheAllCompanies).toHaveBeenCalled();
      expect(
        getVendorByIdUseCase.cacheAllVendorsForCompany
      ).toHaveBeenCalledWith(10);
      expect(
        mockApdateAppService.cacheAllApdateForCompany
      ).toHaveBeenCalledWith(10);
      expect(mockGlMasterService.cacheGlMasterForCompany).toHaveBeenCalledWith(
        10
      );
      expect(mockGeneralSystemService.cacheGSTableData).toHaveBeenCalled();
      expect(
        mockFreightInvoiceHeaderService.cacheFreightInvoiceHeaderForCompany
      ).toHaveBeenCalledWith(10);
    });
  });

  describe("uploadCsv", () => {
    it("should upload flexi CSV file successfully", async () => {
      // Arrange
      const mockFile = {
        fieldname: "file",
        originalname: "test.csv",
        encoding: "7bit",
        mimetype: "text/csv",
        size: 1024,
        destination: "uploads/csv/FLEXI",
        filename: "file-1234567890-uuid.csv",
        path: "uploads/csv/FLEXI/file-1234567890-uuid.csv",
        buffer: Buffer.from("test data"),
      } as any;

      const mockReq = { user: { id: "user123" } };
      const mockResult = {
        success: true,
        message: "File uploaded successfully",
      };

      mockVoucherCsvUploadUseCase.execute.mockResolvedValue(mockResult);

      // Act
      const result = await controller.uploadCsv(mockFile, mockReq);

      // Assert
      expect(result.items).toEqual(mockResult);
      expect(mockVoucherCsvUploadUseCase.execute).toHaveBeenCalledWith(
        "user123",
        "flexi",
        mockFile
      );
    });
  });

  describe("uploadSogasCsv", () => {
    it("should upload sogas CSV file successfully", async () => {
      // Arrange
      const mockFile = {
        fieldname: "file",
        originalname: "sogas.csv",
        encoding: "7bit",
        mimetype: "text/csv",
        size: 2048,
        destination: "uploads/csv/SOGAS",
        filename: "file-1234567890-uuid.csv",
        path: "uploads/csv/SOGAS/file-1234567890-uuid.csv",
        buffer: Buffer.from("sogas data"),
      } as any;

      const mockReq = { user: { id: "user456" } };
      const subType = "invoice";
      const mockResult = {
        success: true,
        message: "SOGAS file uploaded successfully",
      };

      mockVoucherCsvUploadUseCase.execute.mockResolvedValue(mockResult);

      // Act
      const result = await controller.uploadSogasCsv(
        mockFile,
        mockReq,
        subType
      );

      // Assert
      expect(result.items).toEqual(mockResult);
      expect(mockVoucherCsvUploadUseCase.execute).toHaveBeenCalledWith(
        "user456",
        "sogas",
        mockFile,
        subType
      );
    });
  });

  describe("getVoucherSummary", () => {
    it("should return voucher summary successfully", async () => {
      // Arrange
      const query = { companyNo: 10, processType: PROCESS_TYPE_ENUM.NORMAL };
      const mockSummary = {
        totalVouchers: 150,
        totalAmount: 50000.0,
        averageAmount: 333.33,
        processType: PROCESS_TYPE_ENUM.NORMAL,
        companyNo: 10,
      };

      mockGetVoucherSummaryUseCase.execute.mockResolvedValue(mockSummary);

      // Act
      const result = await controller.getVoucherSummary(query);

      // Assert
      expect(result.items).toEqual(mockSummary);
      expect(mockGetVoucherSummaryUseCase.execute).toHaveBeenCalledWith(query);
    });

    it("should handle different process types", async () => {
      // Arrange
      const query = { companyNo: 10, processType: PROCESS_TYPE_ENUM.FLEXI };
      const mockSummary = {
        totalVouchers: 75,
        totalAmount: 25000.0,
        averageAmount: 333.33,
        processType: PROCESS_TYPE_ENUM.FLEXI,
        companyNo: 10,
      };

      mockGetVoucherSummaryUseCase.execute.mockResolvedValue(mockSummary);

      // Act
      const result = await controller.getVoucherSummary(query);

      // Assert
      expect(result.items).toEqual(mockSummary);
      expect(mockGetVoucherSummaryUseCase.execute).toHaveBeenCalledWith(query);
    });
  });

  describe("getFlexiEntryData", () => {
    it("should return flexi entry data with pagination", async () => {
      // Arrange
      const query = { companyNo: 10, current_page: 1, items_per_page: 10 };
      const mockResponse = {
        items: [
          {
            entryNo: "FLEXI001",
            companyNo: 10,
            processType: PROCESS_TYPE_ENUM.FLEXI,
          },
        ],
        pagination: {
          total_items: 1,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      mockGetFlexiEntryUseCase.execute.mockResolvedValue(mockResponse);

      // Act
      const result = await controller.getFlexiEntryData(query);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(mockGetFlexiEntryUseCase.execute).toHaveBeenCalledWith(query);
    });
  });

  describe("getSogasEntryData", () => {
    it("should return sogas entry data with pagination", async () => {
      // Arrange
      const query = { companyNo: 10, current_page: 1, items_per_page: 10 };
      const mockResponse = {
        items: [
          {
            entryNo: "SOGAS001",
            companyNo: 10,
            processType: PROCESS_TYPE_ENUM.SOGAS,
          },
        ],
        pagination: {
          total_items: 1,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      mockGetSogasEntryUseCase.execute.mockResolvedValue(mockResponse);

      // Act
      const result = await controller.getSogasEntryData(query);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(mockGetSogasEntryUseCase.execute).toHaveBeenCalledWith(query);
    });
  });

  describe("getCarrierInvoices", () => {
    it("should return carrier invoices with pagination", async () => {
      // Arrange
      const query = { companyNo: 10, current_page: 1, items_per_page: 10 };
      const mockResponse = {
        items: [{ carrierId: "CAR001", invoiceNo: "INV001", amount: 1000.0 }],
        pagination: {
          total_items: 1,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      mockGetCarrierInvoicesUseCase.execute.mockResolvedValue(mockResponse);

      // Act
      const result = await controller.getCarrierInvoices(query);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(mockGetCarrierInvoicesUseCase.execute).toHaveBeenCalledWith(query);
    });
  });

  describe("getLmsCarrierInvoices", () => {
    it("should return LMS carrier invoices with pagination", async () => {
      // Arrange
      const query = { companyNo: 10, current_page: 1, items_per_page: 10 };
      const mockResponse = {
        items: [
          { carrierId: "LMS001", invoiceNo: "LMSINV001", amount: 1500.0 },
        ],
        pagination: {
          total_items: 1,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      mockGetLmsCarrierInvoicesUseCase.execute.mockResolvedValue(mockResponse);

      // Act
      const result = await controller.getLmsCarrierInvoices(query);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(mockGetLmsCarrierInvoicesUseCase.execute).toHaveBeenCalledWith(
        query
      );
    });
  });

  describe("getPaperEntryData", () => {
    it("should return paper entry data with pagination", async () => {
      // Arrange
      const query = { companyNo: 10, current_page: 1, items_per_page: 10 };
      const mockResponse = {
        items: [
          {
            entryNo: "PAPER001",
            companyNo: 10,
            processType: PROCESS_TYPE_ENUM.PAPER,
          },
        ],
        pagination: {
          total_items: 1,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      mockGetPaperEntryUseCase.execute.mockResolvedValue(mockResponse);

      // Act
      const result = await controller.getPaperEntryData(query);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(mockGetPaperEntryUseCase.execute).toHaveBeenCalledWith(query);
    });
  });

  describe("getLmsEntryData", () => {
    it("should return LMS entry data with pagination", async () => {
      // Arrange
      const query = { companyNo: 10, current_page: 1, items_per_page: 10 };
      const mockResponse = {
        items: [
          {
            entryNo: "LMS001",
            companyNo: 10,
            processType: PROCESS_TYPE_ENUM.ARGLMS,
          },
        ],
        pagination: {
          total_items: 1,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      mockGetLmsEntryUseCase.execute.mockResolvedValue(mockResponse);

      // Act
      const result = await controller.getLmsEntryData(query);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(mockGetLmsEntryUseCase.execute).toHaveBeenCalledWith(query);
    });
  });

  describe("createPaperBatch", () => {
    it("should create paper batch successfully", async () => {
      // Arrange
      const dto = {
        companyNo: 10,
        processType: PROCESS_TYPE_ENUM.PAPER,
        batchSize: 100,
        invoices: [{ invoiceNo: "INV001" }, { invoiceNo: "INV002" }] as any,
      };
      const mockReq = { user: { id: "user123" } };
      const mockResult = {
        batchId: "BATCH001",
        totalGroups: 5,
        totalBatches: 5,
        parentJobId: "JOB001",
        childJobIds: ["CHILD001", "CHILD002"],
        groups: ["GROUP1", "GROUP2"],
        message: "Batch created successfully",
      };

      mockPaperBatchCreateUseCase.execute.mockResolvedValue(mockResult);

      // Act
      const result = await controller.createPaperBatch(dto, mockReq);

      // Assert
      expect(result.items).toEqual(mockResult);
      expect(mockPaperBatchCreateUseCase.execute).toHaveBeenCalledWith(
        "user123",
        dto
      );
    });

    it("should handle batch creation with empty child job IDs", async () => {
      // Arrange
      const dto = {
        companyNo: 10,
        processType: PROCESS_TYPE_ENUM.PAPER,
        batchSize: 50,
        invoices: [{ invoiceNo: "INV003" }] as any,
      };
      const mockReq = { user: { id: "user456" } };
      const mockResult = {
        batchId: "BATCH002",
        totalGroups: 2,
        totalBatches: 2,
        parentJobId: null,
        childJobIds: [],
        groups: [],
        message: "Small batch created",
      };

      mockPaperBatchCreateUseCase.execute.mockResolvedValue(mockResult);

      // Act
      const result = await controller.createPaperBatch(dto, mockReq);

      // Assert
      expect(result.items.batchId).toBe("BATCH002");
      expect(result.items.childJobIds).toEqual([]);
      expect(result.items.parentJobId).toBe("");
      expect(mockPaperBatchCreateUseCase.execute).toHaveBeenCalledWith(
        "user456",
        dto
      );
    });
  });

  describe("createLmsBatch", () => {
    it("should create LMS batch successfully", async () => {
      // Arrange
      const dto = {
        companyNo: 10,
        processType: PROCESS_TYPE_ENUM.ARGLMS,
        batchSize: 75,
        invoices: [
          { invoiceNo: "LMSINV001" },
          { invoiceNo: "LMSINV002" },
        ] as any,
      };
      const mockReq = { user: { id: "user789" } };
      const mockResult = {
        batchId: "LMSBATCH001",
        totalGroups: 3,
        totalBatches: 3,
        parentJobId: "LMSJOB001",
        childJobIds: ["LMSCHILD001"],
        groups: ["LMSGROUP1"],
        message: "LMS batch created successfully",
      };

      mockLmsBatchCreateUseCase.execute.mockResolvedValue(mockResult);

      // Act
      const result = await controller.createLmsBatch(dto, mockReq);

      // Assert
      expect(result.items).toEqual(mockResult);
      expect(mockLmsBatchCreateUseCase.execute).toHaveBeenCalledWith(
        "user789",
        dto
      );
    });
  });

  describe("softDeleteVoucherDetail", () => {
    it("should soft delete voucher detail successfully", async () => {
      // Arrange
      const dto = {
        companyNo: 10,
        entryNo: 123,
        entrySequenceNo: 1,
        lineNo: 1,
        vendorNo: 456,
        invoiceNo: "INV123",
      };
      const mockResult = {
        success: true,
        message: "Voucher detail deleted successfully",
      };

      mockSoftDeleteVoucherDetailUseCase.execute.mockResolvedValue(mockResult);

      // Act
      const result = await controller.softDeleteVoucherDetail(dto);

      // Assert
      expect(result).toEqual(mockResult);
      expect(mockSoftDeleteVoucherDetailUseCase.execute).toHaveBeenCalledWith(
        dto
      );
    });

    it("should handle soft delete failure", async () => {
      // Arrange
      const dto = {
        companyNo: 10,
        entryNo: 999,
        entrySequenceNo: 1,
        lineNo: 1,
        vendorNo: 456,
        invoiceNo: "INV999",
      };
      const mockResult = {
        success: false,
        message: "Voucher detail not found",
      };

      mockSoftDeleteVoucherDetailUseCase.execute.mockResolvedValue(mockResult);

      // Act
      const result = await controller.softDeleteVoucherDetail(dto);

      // Assert
      expect(result).toEqual(mockResult);
      expect(result.success).toBe(false);
      expect(mockSoftDeleteVoucherDetailUseCase.execute).toHaveBeenCalledWith(
        dto
      );
    });
  });
});
