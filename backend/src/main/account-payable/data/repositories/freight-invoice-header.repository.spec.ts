import { Test, TestingModule } from "@nestjs/testing";
import { FreightInvoiceHeaderRepository } from "./freight-invoice-header.repository";
import { FreightInvoiceHeaderModel } from "../models/freight-invoice-header.model";
import { CacheService } from "@src/shared/cache/cache.service";
import { FreightInvoiceHeaderFactory } from "@src/shared/tests/freight-invoice-module/freight-invoice-header.factory";

describe("FreightInvoiceHeaderRepository", () => {
  let repository: FreightInvoiceHeaderRepository;
  let freightInvoiceHeaderModel: typeof FreightInvoiceHeaderModel;
  let cacheService: CacheService;

  const mockFreightInvoiceHeaderModel = {
    findAll: jest.fn(),
    findAndCountAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    getAttributes: jest.fn().mockReturnValue({
      invoiceAmount: { field: "invoiceAmount" },
      freightBalanceOverrideTotal: { field: "freightBalanceOverrideTotal" },
      companyNo: { field: "companyNo" },
    }),
  };

  const mockFreightOutBalancingInvoiceModel = {
    findAll: jest.fn(),
  };

  const mockCarrierInvoiceHeaderModel = {
    findAll: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    getAttributes: jest.fn().mockReturnValue({
      invoiceAmount: { field: "invoiceAmount" },
      orderOverrideTotal: { field: "orderOverrideTotal" },
    }),
  };

  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FreightInvoiceHeaderRepository,
        {
          provide: "FreightInvoiceHeaderModel",
          useValue: mockFreightInvoiceHeaderModel,
        },
        {
          provide: "FreightOutBalancingInvoiceModel",
          useValue: mockFreightOutBalancingInvoiceModel,
        },
        {
          provide: "CarrierInvoiceHeaderModel",
          useValue: mockCarrierInvoiceHeaderModel,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    repository = module.get<FreightInvoiceHeaderRepository>(
      FreightInvoiceHeaderRepository
    );
    freightInvoiceHeaderModel = module.get<typeof FreightInvoiceHeaderModel>(
      "FreightInvoiceHeaderModel"
    );

    cacheService = module.get<CacheService>(CacheService);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  describe("findByCompanyNo", () => {
    it("should return freight invoice headers for a company", async () => {
      const companyNo = 10;
      const mockRecords = [
        FreightInvoiceHeaderFactory.createFreightInvoiceForCompany(companyNo),
        FreightInvoiceHeaderFactory.createFreightInvoiceForCompany(companyNo, {
          carrierId: "CAR002",
          carrierInvoiceNo: "INV002",
          ourOrderNo: 1002,
        }),
      ];

      mockFreightInvoiceHeaderModel.findAll.mockResolvedValue(
        mockRecords.map((record) =>
          FreightInvoiceHeaderFactory.createMockDatabaseRecord({
            companyNo: record.companyNo,
            carrierId: record.carrierId,
            carrierInvoiceNo: record.carrierInvoiceNo,
            invoiceType: record.invoiceType,
            invoiceDate: record.invoiceDate,
            invoiceAmount: record.invoiceAmount,
            ourOrderNo: record.ourOrderNo,
            shippingReferenceNo: record.shippingReferenceNo,
            dateTimeStamp: record.dateTimeStamp,
            carrierInvoiceStatus: record.carrierInvoiceStatus,
            freightBalanceOverrideTotal: record.freightBalanceOverrideTotal,
            filler1: record.filler1,
            approvalStatus: record.approvalStatus,
            approvalDateTime: record.approvalDateTime,
            apInvoiceStatus: record.apInvoiceStatus,
            apDateTime: record.apDateTime,
            carrierUserId: record.carrierUserId,
            billingType: record.billingType,
            carrierIpAddress: record.carrierIpAddress,
            vendorNo: record.vendorNo,
            checkNumber: record.checkNumber,
            checkDate: record.checkDate,
            voucherAmount: record.voucherAmount,
            filler2: record.filler2,
            isDeleted: record.isDeleted,
          })
        )
      );

      const result = await repository.findByCompanyNo(companyNo);

      expect(result).toEqual(mockRecords);
      expect(freightInvoiceHeaderModel.findAll).toHaveBeenCalledWith({
        where: { companyNo },
      });
    });

    it("should return empty array when no records found", async () => {
      const companyNo = 10;

      mockFreightInvoiceHeaderModel.findAll.mockResolvedValue([]);

      const result = await repository.findByCompanyNo(companyNo);

      expect(result).toEqual([]);
    });
  });

  describe("findCarrierInvoices", () => {
    it("should return paginated carrier invoices", async () => {
      const query = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 10,
        sortBy: "carrierId",
        sortOrder: "asc" as const,
        invoiceType: "P",
      };

      const mockResult = {
        count: 1,
        rows: [
          {
            dataValues: {
              carrierId: "CAR001",
              carrierInvoiceNo: "INV001",
              invoiceType: "P",
              ourOrderNo: 1001,
              shippingReferenceNo: 1,
              invoiceAmount: 1000.0,
            },
            get: jest.fn(),
          },
        ],
      };

      mockFreightInvoiceHeaderModel.findAndCountAll.mockResolvedValue(
        mockResult
      );
      mockFreightOutBalancingInvoiceModel.findAll.mockResolvedValue([
        {
          ourOrderNo: 1001,
          shippingReferenceNumber: 1,
          shipDateCymd: 20241201,
        },
      ]);

      const result = await repository.findCarrierInvoices(query);

      expect(result.items).toBeDefined();
      expect(result.pagination).toBeDefined();
      expect(mockFreightInvoiceHeaderModel.findAndCountAll).toHaveBeenCalled();
      expect(mockFreightOutBalancingInvoiceModel.findAll).toHaveBeenCalled();
    });

    it("should handle empty result set", async () => {
      const query = {
        companyNo: 10,
        current_page: 1,
        items_per_page: 10,
        sortBy: "carrierId",
        sortOrder: "asc" as const,
        invoiceType: "P",
      };

      mockFreightInvoiceHeaderModel.findAndCountAll.mockResolvedValue({
        count: 0,
        rows: [],
      });
      mockFreightOutBalancingInvoiceModel.findAll.mockResolvedValue([]);

      const result = await repository.findCarrierInvoices(query);

      expect(result.items).toEqual([]);
      expect(result.pagination.total_items).toBe(0);
    });
  });

  describe("cacheAllFreightInvoiceHeaderForCompany", () => {
    it("should cache all freight invoice headers for a company", async () => {
      const companyNo = 10;
      const mockRecords =
        FreightInvoiceHeaderFactory.createMultipleFreightInvoices(2, {
          companyNo,
        });

      mockFreightInvoiceHeaderModel.findAll.mockResolvedValue(
        mockRecords.map((record) =>
          FreightInvoiceHeaderFactory.createMockDatabaseRecord({
            companyNo: record.companyNo,
            carrierId: record.carrierId,
            carrierInvoiceNo: record.carrierInvoiceNo,
          })
        )
      );

      await repository.cacheAllFreightInvoiceHeaderForCompany(companyNo);

      expect(freightInvoiceHeaderModel.findAll).toHaveBeenCalledWith({
        where: { companyNo },
        limit: 1000,
        offset: 0,
        order: [
          ["companyNo", "ASC"],
          ["carrierId", "ASC"],
          ["carrierInvoiceNo", "ASC"],
        ],
      });
      expect(cacheService.set).toHaveBeenCalled();
    });

    it("should handle empty result set", async () => {
      const companyNo = 10;

      mockFreightInvoiceHeaderModel.findAll.mockResolvedValue([]);

      await repository.cacheAllFreightInvoiceHeaderForCompany(companyNo);

      expect(freightInvoiceHeaderModel.findAll).toHaveBeenCalled();
      expect(cacheService.set).toHaveBeenCalled();
    });

    it("should handle database errors during caching", async () => {
      const companyNo = 10;

      mockFreightInvoiceHeaderModel.findAll.mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        repository.cacheAllFreightInvoiceHeaderForCompany(companyNo)
      ).rejects.toThrow("Database error");
    });
  });

  describe("findByCompanyAndCarrier", () => {
    it("should return freight invoice header by company and carrier", async () => {
      const companyNo = 10;
      const carrierId = "CAR001";
      const carrierInvoiceNo = "INV001";

      mockCacheService.get.mockResolvedValue(null);
      mockFreightInvoiceHeaderModel.findOne.mockResolvedValue(
        FreightInvoiceHeaderFactory.createMockDatabaseRecord({
          companyNo,
          carrierId,
          carrierInvoiceNo,
        })
      );

      const result = await repository.findByCompanyAndCarrier(
        companyNo,
        carrierId,
        carrierInvoiceNo
      );

      expect(result).toBeDefined();
      expect(freightInvoiceHeaderModel.findOne).toHaveBeenCalled();
    });

    it("should return null when record not found", async () => {
      const companyNo = 10;
      const carrierId = "CAR001";
      const carrierInvoiceNo = "INV001";

      mockCacheService.get.mockResolvedValue(null);
      mockFreightInvoiceHeaderModel.findOne.mockResolvedValue(null);

      const result = await repository.findByCompanyAndCarrier(
        companyNo,
        carrierId,
        carrierInvoiceNo
      );

      expect(result).toBeNull();
    });
  });

  describe("updateInvoiceStatus", () => {
    it("should update invoice status in FreightInvoiceHeaderModel", async () => {
      const orderNo = 1001;
      const companyNo = 10;
      const carrierId = "CAR001";
      const carrierInvoiceNumber = "INV001";

      mockFreightInvoiceHeaderModel.findOne.mockResolvedValue(
        FreightInvoiceHeaderFactory.createMockDatabaseRecord({
          ourOrderNo: orderNo,
          companyNo,
          carrierId,
          carrierInvoiceNo: carrierInvoiceNumber,
        })
      );
      mockFreightInvoiceHeaderModel.update.mockResolvedValue([1]);

      const result = await repository.updateInvoiceStatus(
        orderNo,
        companyNo,
        carrierId,
        carrierInvoiceNumber
      );

      expect(result).toEqual([1]);
      expect(freightInvoiceHeaderModel.findOne).toHaveBeenCalled();
      expect(freightInvoiceHeaderModel.update).toHaveBeenCalled();
    });

    it("should update invoice status in CarrierInvoiceHeaderModel when not found in FreightInvoiceHeaderModel", async () => {
      const orderNo = 1001;
      const companyNo = 10;
      const carrierId = "CAR001";
      const carrierInvoiceNumber = "INV001";

      mockFreightInvoiceHeaderModel.findOne.mockResolvedValue(null);
      mockCarrierInvoiceHeaderModel.update.mockResolvedValue([1]);

      const result = await repository.updateInvoiceStatus(
        orderNo,
        companyNo,
        carrierId,
        carrierInvoiceNumber
      );

      expect(result).toEqual([1]);
      expect(mockCarrierInvoiceHeaderModel.update).toHaveBeenCalled();
    });
  });
});
