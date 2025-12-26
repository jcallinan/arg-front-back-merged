import { VoucherMaintenanceRepository } from "./voucher-maintenance.repository";
import { NO } from "@src/shared/constants/constant";
import {
  VoucherType,
  VoucherMaintenanceStatusCode,
} from "@src/shared/constants/voucher-type.enum";
import { VendorFactory } from "@src/shared/tests";

describe("VoucherMaintenanceRepository", () => {
  let repo: VoucherMaintenanceRepository;

  const mockOpenPayableHeaderModel = {
    findAndCountAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
  };
  const mockOpenPayableHistoryHeaderModel = {
    findAndCountAll: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
  };
  const mockOpenPayableDetailsModel = {
    findAll: jest.fn(),
    destroy: jest.fn(),
  };
  const mockOpenPayableHistoryDetailModel = {
    findAll: jest.fn(),
    destroy: jest.fn(),
  };
  const mockVendorModel = { findAll: jest.fn(), findOne: jest.fn() };
  const mockVoucherHeaderModel = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };
  const mockVoucherDetailModel = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };
  const mockCompanyModel = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(() => {
    repo = new VoucherMaintenanceRepository(
      mockOpenPayableHeaderModel as any,
      mockOpenPayableHistoryHeaderModel as any,
      mockOpenPayableDetailsModel as any,
      mockOpenPayableHistoryDetailModel as any,
      mockVendorModel as any,
      mockVoucherHeaderModel as any,
      mockVoucherDetailModel as any,
      mockCompanyModel as any
    );
    jest.clearAllMocks();
  });

  describe("findVouchers", () => {
    it("should fetch UNPAID vouchers and join vendor data", async () => {
      mockOpenPayableHeaderModel.findAndCountAll.mockResolvedValue({
        count: 1,
        rows: [
          {
            companyNo: 10,
            vendorNo: 1,
            voucherNo: 2,
            discount: 0,
            partialPaidToDate: 0,
            invoiceDescription: "",
            invoiceNo: "INV",
            invoiceDate8: "20240101",
            dueDate8: "20240131",
            discountDueDate6: "20240115",
            lastPaidDate8: null,
            lastPaidAmount: 0,
            holdPaymentFlag: NO,
            prepaidVoucherFlag: NO,
          },
        ],
      });
      mockVendorModel.findAll.mockResolvedValue([
        VendorFactory.createBasicVendor({
          vendorNo: 1,
          vendorName: "V1",
          vendorAdd1: "A1",
          vendorAdd2: "A2",
          vendorAdd3: "A3",
          vendorAdd4: "A4",
          vendorCompanyNumber: 10,
        }),
      ]);

      const result = await repo.findVouchers(
        10,
        1,
        VoucherType.UNPAID,
        undefined,
        undefined,
        10,
        0,
        "invoiceDate",
        "ASC"
      );

      expect(result.rows).toHaveLength(1);
      expect(result.count).toBe(1);
      expect(mockOpenPayableHeaderModel.findAndCountAll).toHaveBeenCalled();
      expect(mockVendorModel.findAll).toHaveBeenCalled();
    });

    it("should fetch PAID vouchers from history table", async () => {
      mockOpenPayableHistoryHeaderModel.findAndCountAll.mockResolvedValue({
        count: 1,
        rows: [
          {
            companyNo: 10,
            vendorNo: 1,
            voucherNo: 2,
            discount: 0,
            partialPaidToDate: 1000,
            invoiceDescription: "Paid Invoice",
            invoiceNo: "INV001",
            invoiceDate8: "20240101",
            dueDate8: "20240131",
            discountDueDate6: "20240115",
            lastPaidDate8: "20240115",
            lastPaidAmount: 1000,
            holdPaymentFlag: NO,
            prepaidVoucherFlag: NO,
          },
        ],
      });
      mockVendorModel.findAll.mockResolvedValue([
        VendorFactory.createBasicVendor({
          vendorNo: 1,
          vendorName: "V1",
          vendorAdd1: "A1",
          vendorAdd2: "A2",
          vendorAdd3: "A3",
          vendorAdd4: "A4",
          vendorCompanyNumber: 10,
        }),
      ]);

      const result = await repo.findVouchers(
        10,
        1,
        VoucherType.PAID,
        undefined,
        undefined,
        10,
        0,
        "invoiceDate",
        "ASC"
      );

      expect(result.rows).toHaveLength(1);
      expect(result.count).toBe(1);
      expect(
        mockOpenPayableHistoryHeaderModel.findAndCountAll
      ).toHaveBeenCalled();
      expect(mockVendorModel.findAll).toHaveBeenCalled();
    });

    it("should fetch ALL vouchers from both tables", async () => {
      mockOpenPayableHeaderModel.findAndCountAll.mockResolvedValue({
        count: 1,
        rows: [
          {
            companyNo: 10,
            vendorNo: 1,
            voucherNo: 2,
            discount: 0,
            partialPaidToDate: 0,
            invoiceDescription: "Unpaid Invoice",
            invoiceNo: "INV001",
            invoiceDate8: "20240101",
            dueDate8: "20240131",
            discountDueDate6: "20240115",
            lastPaidDate8: null,
            lastPaidAmount: 0,
            holdPaymentFlag: NO,
            prepaidVoucherFlag: NO,
          },
        ],
      });
      mockOpenPayableHistoryHeaderModel.findAndCountAll.mockResolvedValue({
        count: 1,
        rows: [
          {
            companyNo: 10,
            vendorNo: 1,
            voucherNo: 3,
            discount: 0,
            partialPaidToDate: 1000,
            invoiceDescription: "Paid Invoice",
            invoiceNo: "INV002",
            invoiceDate8: "20240101",
            dueDate8: "20240131",
            discountDueDate6: "20240115",
            lastPaidDate8: "20240115",
            lastPaidAmount: 1000,
            holdPaymentFlag: NO,
            prepaidVoucherFlag: NO,
          },
        ],
      });
      mockVendorModel.findAll.mockResolvedValue([
        VendorFactory.createBasicVendor({
          vendorNo: 1,
          vendorName: "V1",
          vendorAdd1: "A1",
          vendorAdd2: "A2",
          vendorAdd3: "A3",
          vendorAdd4: "A4",
          vendorCompanyNumber: 10,
        }),
      ]);

      const result = await repo.findVouchers(
        10,
        1,
        VoucherType.ALL,
        undefined,
        undefined,
        10,
        0,
        "invoiceDate",
        "ASC"
      );

      expect(result.rows).toHaveLength(2);
      expect(result.count).toBe(2);
      expect(mockOpenPayableHeaderModel.findAndCountAll).toHaveBeenCalled();
      expect(
        mockOpenPayableHistoryHeaderModel.findAndCountAll
      ).toHaveBeenCalled();
      expect(mockVendorModel.findAll).toHaveBeenCalled();
    });

    it("should handle filtering by invoice date", async () => {
      mockOpenPayableHeaderModel.findAndCountAll.mockResolvedValue({
        count: 1,
        rows: [
          {
            companyNo: 10,
            vendorNo: 1,
            voucherNo: 2,
            discount: 0,
            partialPaidToDate: 0,
            invoiceDescription: "Filtered Invoice",
            invoiceNo: "INV001",
            invoiceDate8: "20240101",
            dueDate8: "20240131",
            discountDueDate6: "20240115",
            lastPaidDate8: null,
            lastPaidAmount: 0,
            holdPaymentFlag: NO,
            prepaidVoucherFlag: NO,
          },
        ],
      });
      mockVendorModel.findAll.mockResolvedValue([
        VendorFactory.createBasicVendor({
          vendorNo: 1,
          vendorName: "V1",
          vendorAdd1: "A1",
          vendorAdd2: "A2",
          vendorAdd3: "A3",
          vendorAdd4: "A4",
          vendorCompanyNumber: 10,
        }),
      ]);

      const result = await repo.findVouchers(
        10,
        1,
        VoucherType.UNPAID,
        "20240101",
        undefined,
        10,
        0,
        "invoiceDate",
        "ASC"
      );

      expect(result.rows).toHaveLength(1);
      expect(result.count).toBe(1);
      expect(mockOpenPayableHeaderModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            invoiceDate8: "20240101",
          }),
        })
      );
    });

    it("should handle filtering by invoice number", async () => {
      mockOpenPayableHeaderModel.findAndCountAll.mockResolvedValue({
        count: 1,
        rows: [
          {
            companyNo: 10,
            vendorNo: 1,
            voucherNo: 2,
            discount: 0,
            partialPaidToDate: 0,
            invoiceDescription: "Specific Invoice",
            invoiceNo: "INV001",
            invoiceDate8: "20240101",
            dueDate8: "20240131",
            discountDueDate6: "20240115",
            lastPaidDate8: null,
            lastPaidAmount: 0,
            holdPaymentFlag: NO,
            prepaidVoucherFlag: NO,
          },
        ],
      });
      mockVendorModel.findAll.mockResolvedValue([
        VendorFactory.createBasicVendor({
          vendorNo: 1,
          vendorName: "V1",
          vendorAdd1: "A1",
          vendorAdd2: "A2",
          vendorAdd3: "A3",
          vendorAdd4: "A4",
          vendorCompanyNumber: 10,
        }),
      ]);

      const result = await repo.findVouchers(
        10,
        1,
        VoucherType.UNPAID,
        undefined,
        "INV001",
        10,
        0,
        "invoiceDate",
        "ASC"
      );

      expect(result.rows).toHaveLength(1);
      expect(result.count).toBe(1);
      expect(mockOpenPayableHeaderModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            invoiceNo: expect.any(Object),
          }),
        })
      );
    });

    it("should handle pagination correctly", async () => {
      mockOpenPayableHeaderModel.findAndCountAll.mockResolvedValue({
        count: 50,
        rows: Array(10).fill({
          companyNo: 10,
          vendorNo: 1,
          voucherNo: 2,
          discount: 0,
          partialPaidToDate: 0,
          invoiceDescription: "Paginated Invoice",
          invoiceNo: "INV001",
          invoiceDate8: "20240101",
          dueDate8: "20240131",
          discountDueDate6: "20240115",
          lastPaidDate8: null,
          lastPaidAmount: 0,
          holdPaymentFlag: NO,
          prepaidVoucherFlag: NO,
        }),
      });
      mockVendorModel.findAll.mockResolvedValue([
        VendorFactory.createBasicVendor({
          vendorNo: 1,
          vendorName: "V1",
          vendorAdd1: "A1",
          vendorAdd2: "A2",
          vendorAdd3: "A3",
          vendorAdd4: "A4",
          vendorCompanyNumber: 10,
        }),
      ]);

      const result = await repo.findVouchers(
        10,
        1,
        VoucherType.UNPAID,
        undefined,
        undefined,
        10,
        20,
        "invoiceDate",
        "ASC"
      );

      expect(result.rows).toHaveLength(10);
      expect(result.count).toBe(50);
      expect(mockOpenPayableHeaderModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 10,
          offset: 20,
        })
      );
    });

    it("should handle sorting correctly", async () => {
      mockOpenPayableHeaderModel.findAndCountAll.mockResolvedValue({
        count: 1,
        rows: [
          {
            companyNo: 10,
            vendorNo: 1,
            voucherNo: 2,
            discount: 0,
            partialPaidToDate: 0,
            invoiceDescription: "Sorted Invoice",
            invoiceNo: "INV001",
            invoiceDate8: "20240101",
            dueDate8: "20240131",
            discountDueDate6: "20240115",
            lastPaidDate8: null,
            lastPaidAmount: 0,
            holdPaymentFlag: NO,
            prepaidVoucherFlag: NO,
          },
        ],
      });
      mockVendorModel.findAll.mockResolvedValue([
        VendorFactory.createBasicVendor({
          vendorNo: 1,
          vendorName: "V1",
          vendorAdd1: "A1",
          vendorAdd2: "A2",
          vendorAdd3: "A3",
          vendorAdd4: "A4",
          vendorCompanyNumber: 10,
        }),
      ]);

      const result = await repo.findVouchers(
        10,
        1,
        VoucherType.UNPAID,
        undefined,
        undefined,
        10,
        0,
        "dueDate",
        "DESC"
      );

      expect(result.rows).toHaveLength(1);
      expect(result.count).toBe(1);
      expect(mockOpenPayableHeaderModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          order: expect.arrayContaining([["dueDate8", "DESC"]]),
        })
      );
    });
  });

  describe("findVoucherView", () => {
    it("should fetch voucher view with header and details", async () => {
      const mockHeader = {
        companyNo: 10,
        vendorNo: 1,
        voucherNo: 2,
        invoiceDescription: "Test Invoice",
        invoiceNo: "INV001",
        grossAmount: 1000.0,
        discount: 100.0,
        dueDate: "20240131",
        invoiceDate: "20240101",
      };

      const mockDetails = [
        {
          companyNo: 10,
          vendorNo: 1,
          voucherNo: 2,
          lineNo: 1,
          amount: 500.0,
          description: "Line 1",
          glAccount: 1200,
        },
        {
          companyNo: 10,
          vendorNo: 1,
          voucherNo: 2,
          lineNo: 2,
          amount: 500.0,
          description: "Line 2",
          glAccount: 1200,
        },
      ];

      mockOpenPayableHeaderModel.findOne.mockResolvedValue(mockHeader);
      mockOpenPayableDetailsModel.findAll.mockResolvedValue(mockDetails);

      const result = await repo.findVoucherView(VoucherType.UNPAID, 10, 1, 2);

      expect(result?.headerItems).toBeDefined();
      expect(result?.detailItems).toBeDefined();
      expect(mockOpenPayableHeaderModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            companyNo: 10,
            vendorNo: 1,
            voucherNo: 2,
          }),
          raw: true,
        })
      );
      expect(mockOpenPayableDetailsModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            companyNo: 10,
            vendorNo: 1,
            voucherNo: 2,
          }),
          raw: true,
        })
      );
    });

    it("should handle voucher not found", async () => {
      mockOpenPayableHeaderModel.findOne.mockResolvedValue(null);

      const result = await repo.findVoucherView(VoucherType.UNPAID, 10, 1, 999);

      expect(result).toBeNull();
    });

    it("should handle no details found", async () => {
      const mockHeader = {
        companyNo: 10,
        vendorNo: 1,
        voucherNo: 2,
        invoiceDescription: "Test Invoice",
        invoiceNo: "INV001",
        grossAmount: 1000.0,
        discount: 100.0,
        dueDate: "20240131",
        invoiceDate: "20240101",
      };

      mockOpenPayableHeaderModel.findOne.mockResolvedValue(mockHeader);
      mockOpenPayableDetailsModel.findAll.mockResolvedValue([]);

      const result = await repo.findVoucherView(VoucherType.UNPAID, 10, 1, 2);

      expect(result?.headerItems).toBeDefined();
      expect(result?.detailItems).toEqual([]);
    });
  });

  describe("updateVoucherStatus", () => {
    it("should update voucher status successfully", async () => {
      const mockVoucher = {
        companyNo: 10,
        vendorNo: 1,
        voucherNo: 2,
        statusCode: "P",
        statusDescription: "Pending",
        updatedAt: new Date(),
      };

      mockOpenPayableHeaderModel.findOne.mockResolvedValue(mockVoucher);
      mockOpenPayableHeaderModel.update.mockResolvedValue([1]);

      const result = await repo.updateVoucherStatus(
        10,
        1,
        2,
        VoucherMaintenanceStatusCode.APPROVED,
        "Approved"
      );

      expect(result).toBeDefined();
      expect(result?.statusCode).toBe(VoucherMaintenanceStatusCode.APPROVED);
      expect(result?.statusDescription).toBe("Approved");
      expect(mockOpenPayableHeaderModel.update).toHaveBeenCalledWith(
        {
          holdPaymentFlag: VoucherMaintenanceStatusCode.APPROVED,
          holdDescription: "Approved",
        },
        {
          where: expect.objectContaining({
            companyNo: 10,
            vendorNo: 1,
            voucherNo: 2,
          }),
        }
      );
    });

    it("should return null when voucher not found", async () => {
      mockOpenPayableHeaderModel.findOne.mockResolvedValue(null);

      const result = await repo.updateVoucherStatus(
        10,
        1,
        999,
        VoucherMaintenanceStatusCode.APPROVED,
        "Approved"
      );

      expect(result).toBeNull();
    });

    it("should handle database errors gracefully", async () => {
      const mockVoucher = {
        companyNo: 10,
        vendorNo: 1,
        voucherNo: 2,
        statusCode: "P",
        statusDescription: "Pending",
        updatedAt: new Date(),
      };

      mockOpenPayableHeaderModel.findOne.mockResolvedValue(mockVoucher);
      mockOpenPayableHeaderModel.update.mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        repo.updateVoucherStatus(
          10,
          1,
          2,
          VoucherMaintenanceStatusCode.APPROVED,
          "Approved"
        )
      ).rejects.toThrow("Database error");
    });
  });

  describe("updateDiscount", () => {
    it("should update discount successfully", async () => {
      const mockVoucher = {
        companyNo: 10,
        vendorNo: 1,
        voucherNo: 2,
        discount: 0,
        updatedAt: new Date(),
      };

      mockOpenPayableHeaderModel.findOne.mockResolvedValue(mockVoucher);
      mockOpenPayableHeaderModel.update.mockResolvedValue([1]);

      const result = await repo.updateDiscount(10, 1, 2, "011524", 50);

      expect(result).toBeDefined();
      expect(result?.discount).toBe(50);
      expect(mockOpenPayableHeaderModel.update).toHaveBeenCalledWith(
        {
          discount: 50,
          discountDueDate6: 11524,
        },
        {
          where: expect.objectContaining({
            companyNo: 10,
            vendorNo: 1,
            voucherNo: 2,
          }),
        }
      );
    });

    it("should return null when voucher not found", async () => {
      mockOpenPayableHeaderModel.findOne.mockResolvedValue(null);

      const result = await repo.updateDiscount(10, 1, 999, "011524", 50);

      expect(result).toBeNull();
    });

    it("should handle database errors gracefully", async () => {
      const mockVoucher = {
        companyNo: 10,
        vendorNo: 1,
        voucherNo: 2,
        discount: 0,
        updatedAt: new Date(),
      };

      mockOpenPayableHeaderModel.findOne.mockResolvedValue(mockVoucher);
      mockOpenPayableHeaderModel.update.mockRejectedValue(
        new Error("Database error")
      );

      await expect(repo.updateDiscount(10, 1, 2, "011524", 50)).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("findVoucherSummary", () => {
    it("should fetch voucher summary successfully", async () => {
      const mockVendor = {
        vendorName: "Test Vendor",
        vendorNo: 1,
        vendorCompanyNumber: 10,
        vendorLastPaymentAmt: 1000,
        vendorLastPaymentDate: "20240101",
        vendorCurrentBalance: 5000,
        vendorLastPaymentDateAlt: "20240101",
        get: jest.fn().mockReturnValue({
          vendorName: "Test Vendor",
          vendorNo: 1,
          vendorCompanyNumber: 10,
          vendorLastPaymentAmt: 1000,
          vendorLastPaymentDate: "20240101",
          vendorCurrentBalance: 5000,
          vendorLastPaymentDateAlt: "20240101",
        }),
      };

      mockVendorModel.findOne.mockResolvedValue(mockVendor);

      const result = await repo.findVoucherSummary(10, 1, VoucherType.UNPAID);

      expect(result).toHaveLength(1);
      expect(result[0]?.vendorName).toBe("Test Vendor");
      expect(result[0]?.openPayables).toBe(0); // UNPAID type should have 0 open payables
      expect(mockVendorModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            vendorCompanyNumber: 10,
            vendorNo: 1,
          }),
          attributes: expect.arrayContaining([
            "vendorName",
            "vendorNo",
            "vendorCompanyNumber",
            "vendorLastPaymentAmt",
            "vendorLastPaymentDate",
            "vendorCurrentBalance",
            "vendorLastPaymentDateAlt",
          ]),
        })
      );
    });

    it("should handle filtering by vendor number", async () => {
      const mockVendor = {
        vendorName: "Test Vendor",
        vendorNo: 1,
        vendorCompanyNumber: 10,
        vendorLastPaymentAmt: 1000,
        vendorLastPaymentDate: "20240101",
        vendorCurrentBalance: 5000,
        vendorLastPaymentDateAlt: "20240101",
        get: jest.fn().mockReturnValue({
          vendorName: "Test Vendor",
          vendorNo: 1,
          vendorCompanyNumber: 10,
          vendorLastPaymentAmt: 1000,
          vendorLastPaymentDate: "20240101",
          vendorCurrentBalance: 5000,
          vendorLastPaymentDateAlt: "20240101",
        }),
      };

      mockVendorModel.findOne.mockResolvedValue(mockVendor);

      const result = await repo.findVoucherSummary(10, 1, VoucherType.UNPAID);

      expect(result).toHaveLength(1);
      expect(result[0]?.vendorNo).toBe(1);
      expect(mockVendorModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            vendorCompanyNumber: 10,
            vendorNo: 1,
          }),
        })
      );
    });

    it("should handle filtering by voucher type", async () => {
      const mockVendor = {
        vendorName: "Test Vendor",
        vendorNo: 1,
        vendorCompanyNumber: 10,
        vendorLastPaymentAmt: 1000,
        vendorLastPaymentDate: "20240101",
        vendorCurrentBalance: 5000,
        vendorLastPaymentDateAlt: "20240101",
        get: jest.fn().mockReturnValue({
          vendorName: "Test Vendor",
          vendorNo: 1,
          vendorCompanyNumber: 10,
          vendorLastPaymentAmt: 1000,
          vendorLastPaymentDate: "20240101",
          vendorCurrentBalance: 5000,
          vendorLastPaymentDateAlt: "20240101",
        }),
      };

      mockVendorModel.findOne.mockResolvedValue(mockVendor);

      const result = await repo.findVoucherSummary(10, 1, VoucherType.PAID);

      expect(result).toHaveLength(1);
      expect(result[0]?.openPayables).toBe(5000); // PAID type should have open payables
      expect(mockVendorModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            vendorCompanyNumber: 10,
            vendorNo: 1,
          }),
        })
      );
    });

    it("should handle empty results", async () => {
      mockVendorModel.findOne.mockResolvedValue(null);

      const result = await repo.findVoucherSummary(10, 1, VoucherType.UNPAID);

      expect(result).toEqual([]);
    });

    it("should handle database errors gracefully", async () => {
      mockVendorModel.findOne.mockRejectedValue(new Error("Database error"));

      await expect(
        repo.findVoucherSummary(10, 1, VoucherType.UNPAID)
      ).rejects.toThrow("Database error");
    });
  });

  describe("transferVoucher", () => {
    const mockCompany = {
      companyNo: 10,
      companyNextEntryNo: 1000,
      companyRetentionGlNo: 5000,
      companyIsDeleted: "A",
    };

    const mockHeaderData = {
      companyNo: 10,
      vendorNo: 1,
      voucherNo: 2,
      invoiceDescription: "Test Invoice",
      invoiceNo: "INV001",
      grossAmount: 1000.0,
      discount: 0,
      dueDate: "20240131",
      invoiceDate: "20240101",
    };

    const mockDetailData = [
      {
        companyNo: 10,
        vendorNo: 1,
        voucherNo: 2,
        lineNo: 1,
        amount: 1000.0,
        description: "Test Line",
        glAccount: 1200,
      },
    ];

    beforeEach(() => {
      // Reset all mocks to their default state and clear implementations
      jest.resetAllMocks();

      // Set up mocks for this section
      mockCompanyModel.findOne.mockResolvedValue(mockCompany);
      mockCompanyModel.update.mockResolvedValue([1]);
      mockVoucherHeaderModel.create.mockResolvedValue({
        entryNo: 1000,
        entrySequence: 1,
      });
      mockVoucherDetailModel.create.mockResolvedValue({
        entrySequence: 1,
      });

      // Reset vendor model mock to default resolved state
      mockVendorModel.findOne.mockResolvedValue({
        vendorName: "Test Vendor",
        vendorNo: 1,
        vendorCompanyNumber: 10,
        vendorLastPaymentAmt: 1000,
        vendorLastPaymentDate: "20240101",
        vendorCurrentBalance: 5000,
        vendorLastPaymentDateAlt: "20240101",
      });
    });

    it("should transfer UNPAID voucher successfully", async () => {
      // Set up vendor model mock for this specific test
      mockVendorModel.findOne.mockResolvedValue({
        vendorName: "Test Vendor",
        vendorNo: 1,
        vendorCompanyNumber: 10,
        vendorLastPaymentAmt: 1000,
        vendorLastPaymentDate: "20240101",
        vendorCurrentBalance: 5000,
        vendorLastPaymentDateAlt: "20240101",
      });

      mockOpenPayableHeaderModel.findOne.mockResolvedValue(mockHeaderData);
      mockOpenPayableDetailsModel.findAll.mockResolvedValue(mockDetailData);
      mockOpenPayableHeaderModel.destroy.mockResolvedValue(1);
      mockOpenPayableDetailsModel.destroy.mockResolvedValue(1);

      const result = await repo.transferVoucher(VoucherType.UNPAID, 10, 1, 2);

      expect(result).toEqual({
        companyNo: 10,
        vendorNo: 1,
        voucherNo: 2,
        sourceTable: "APOPNH/APOPND",
        targetTable: "APTRANH/APTRAND",
        transferredAt: expect.any(String),
        headerRecordId: 1000,
        detailRecordIds: [1],
      });

      expect(mockOpenPayableHeaderModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            companyNo: 10,
            vendorNo: 1,
            voucherNo: 2,
          }),
          raw: true,
        })
      );

      expect(mockOpenPayableDetailsModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            companyNo: 10,
            vendorNo: 1,
            voucherNo: 2,
          }),
          raw: true,
        })
      );

      expect(mockVoucherHeaderModel.create).toHaveBeenCalled();
      expect(mockVoucherDetailModel.create).toHaveBeenCalled();
      expect(mockOpenPayableHeaderModel.destroy).toHaveBeenCalled();
      expect(mockOpenPayableDetailsModel.destroy).toHaveBeenCalled();
    });

    it("should transfer PAID voucher successfully", async () => {
      mockOpenPayableHistoryHeaderModel.findOne.mockResolvedValue(
        mockHeaderData
      );
      mockOpenPayableHistoryDetailModel.findAll.mockResolvedValue(
        mockDetailData
      );
      mockOpenPayableHistoryHeaderModel.destroy.mockResolvedValue(1);
      mockOpenPayableHistoryDetailModel.destroy.mockResolvedValue(1);

      const result = await repo.transferVoucher(VoucherType.PAID, 10, 1, 2);

      expect(result).toEqual({
        companyNo: 10,
        vendorNo: 1,
        voucherNo: 2,
        sourceTable: "APHSTH/APHSTD",
        targetTable: "APTRANH/APTRAND",
        transferredAt: expect.any(String),
        headerRecordId: 1000,
        detailRecordIds: [1],
      });

      expect(mockOpenPayableHistoryHeaderModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            companyNo: 10,
            vendorNo: 1,
            voucherNo: 2,
          }),
          raw: true,
        })
      );

      expect(mockOpenPayableHistoryDetailModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            companyNo: 10,
            vendorNo: 1,
            voucherNo: 2,
          }),
          raw: true,
        })
      );
    });

    it("should handle company not found error", async () => {
      // Set up mock for voucher header lookup to return data so it reaches company check
      mockOpenPayableHeaderModel.findOne.mockResolvedValue(mockHeaderData);
      mockOpenPayableDetailsModel.findAll.mockResolvedValue(mockDetailData);

      // Mock company not found
      mockCompanyModel.findOne.mockResolvedValue(null);

      await expect(
        repo.transferVoucher(VoucherType.UNPAID, 10, 1, 2)
      ).rejects.toThrow("Company not found with number 10");
    });

    it("should handle UNPAID voucher not found", async () => {
      mockOpenPayableHeaderModel.findOne.mockResolvedValue(null);

      const result = await repo.transferVoucher(VoucherType.UNPAID, 10, 1, 2);

      expect(result).toBeNull();
    });

    it("should handle PAID voucher not found", async () => {
      mockOpenPayableHistoryHeaderModel.findOne.mockResolvedValue(null);

      const result = await repo.transferVoucher(VoucherType.PAID, 10, 1, 2);

      expect(result).toBeNull();
    });

    it("should handle unsupported voucher type", async () => {
      await expect(
        repo.transferVoucher("INVALID" as any, 10, 1, 2)
      ).rejects.toThrow("Unsupported voucher type for transfer: INVALID");
    });

    it("should handle entry number rollover from 99999 to 1", async () => {
      const mockCompanyWithMaxEntry = {
        ...mockCompany,
        companyNextEntryNo: 99999,
      };
      mockCompanyModel.findOne.mockResolvedValue(mockCompanyWithMaxEntry);
      mockOpenPayableHeaderModel.findOne.mockResolvedValue(mockHeaderData);
      mockOpenPayableDetailsModel.findAll.mockResolvedValue(mockDetailData);
      mockOpenPayableHeaderModel.destroy.mockResolvedValue(1);
      mockOpenPayableDetailsModel.destroy.mockResolvedValue(1);

      await repo.transferVoucher(VoucherType.UNPAID, 10, 1, 2);

      expect(mockCompanyModel.update).toHaveBeenCalledWith(
        { companyNextEntryNo: 1 },
        { where: { companyNo: 10 } }
      );
    });

    it("should handle multiple detail lines correctly", async () => {
      const multipleDetailData = [
        { ...mockDetailData[0], lineNo: 1 },
        { ...mockDetailData[0], lineNo: 2 },
        { ...mockDetailData[0], lineNo: 3 },
      ];

      mockOpenPayableHeaderModel.findOne.mockResolvedValue(mockHeaderData);
      mockOpenPayableDetailsModel.findAll.mockResolvedValue(multipleDetailData);
      mockOpenPayableHeaderModel.destroy.mockResolvedValue(1);
      mockOpenPayableDetailsModel.destroy.mockResolvedValue(1);

      const result = await repo.transferVoucher(VoucherType.UNPAID, 10, 1, 2);

      expect(result?.detailRecordIds).toHaveLength(3);
      expect(mockVoucherDetailModel.create).toHaveBeenCalledTimes(3);
    });

    it("should handle database errors gracefully", async () => {
      const dbError = new Error("Database connection failed");
      mockOpenPayableHeaderModel.findOne.mockRejectedValue(dbError);

      await expect(
        repo.transferVoucher(VoucherType.UNPAID, 10, 1, 2)
      ).rejects.toThrow("Database connection failed");
    });
  });
});
