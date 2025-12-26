import { Test, TestingModule } from "@nestjs/testing";
import { CheckInquiryRepository } from "./check-inquiry.repository";
import { CheckInquiryModel } from "../models/check-inquiry.model";
import { CheckInquiryHistoryModel } from "../models/check-inquiry-history.model";
import { VendorModel } from "../models/vendor.model";
import { AMCODE } from "@src/shared/constants/constant";
import { Op } from "sequelize";
import { HttpException } from "@nestjs/common";

// Mock the mappers
jest.mock("../mappers/check-inquiry-voucher-detail.mapper", () => ({
  checkInquiryVoucherDetailMapper: {
    toResponse: jest.fn().mockImplementation((data) => ({
      invoiceDescription: data?.invoiceDescription || "Test Invoice",
      prepaidVoucher: data?.prepaidVoucher || "",
      heldPaymentVoucher: data?.heldPaymentVoucher || "",
      heldDescription: data?.heldDescription || "",
      singleCheck: data?.singleCheck || "",
      invoiceNo: data?.invoiceNo || "INV001",
      grossAmount: data?.grossAmount || 100.0,
      discount: data?.discount || 0,
      apGLAccountNo: data?.apGLAccountNo || 12010001,
      discountDueDate: data?.discountDueDate || 0,
      invoiceDate: data?.invoiceDate || 82098,
      dueDate: data?.dueDate || 100498,
      checkNo: data?.checkNo || 12345,
      bankGLNo: data?.bankGLNo || 11110001,
      paidOn8: data?.paidOn8 || 19981001,
      freightTotal: data?.freightTotal || 0,
      salesOrderNo: data?.salesOrderNo || 0,
    })),
  },
}));

jest.mock("../mappers/check-inquiry-line-item.mapper", () => ({
  checkInquiryLineItemMapper: {
    toResponse: jest.fn().mockImplementation((data) => ({
      detailLineAmount: data?.detailLineAmount || 100.0,
      detailLineDescription: data?.detailLineDescription || "Test Line",
      detailLineDiscount: data?.detailLineDiscount || 0,
      poNumber: data?.poNumber || "PO001",
      freightAmount: data?.freightAmount || 0,
      gallons: data?.gallons || 100,
      receiptNumber: data?.receiptNumber || "RC001",
      quantity: data?.quantity || 1,
      openClosedStatus: data?.openClosedStatus || "O",
      expenseGLAccount: data?.expenseGLAccount || 5000,
    })),
  },
}));

// Mock the logger
jest.mock("@src/shared/logger/logger.service", () => ({
  AppLogger: jest.fn().mockImplementation(() => ({
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  })),
}));

describe("CheckInquiryRepository", () => {
  let repository: CheckInquiryRepository;
  let mockCheckInquiryModel: jest.Mocked<typeof CheckInquiryModel>;
  let mockCheckInquiryHistoryModel: jest.Mocked<
    typeof CheckInquiryHistoryModel
  >;
  let mockVendorModel: jest.Mocked<typeof VendorModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckInquiryRepository,
        {
          provide: "CheckInquiryModel",
          useValue: {
            findOne: jest.fn(),
            findAndCountAll: jest.fn(),
          },
        },
        {
          provide: "CheckInquiryHistoryModel",
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
            getAttributes: jest.fn().mockReturnValue({
              checkDate: { field: "checkDate" },
            }),
          },
        },
        {
          provide: "CheckInquiryVoucherDetailModel",
          useValue: {},
        },
        {
          provide: "CheckInquiryLineItemModel",
          useValue: {},
        },
        {
          provide: "VendorModel",
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<CheckInquiryRepository>(CheckInquiryRepository);
    mockCheckInquiryModel = module.get("CheckInquiryModel");
    mockCheckInquiryHistoryModel = module.get("CheckInquiryHistoryModel");
    mockVendorModel = module.get("VendorModel");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getVendorName", () => {
    it("should return vendor name successfully", async () => {
      const mockVendor = {
        vendorName: "Test Vendor",
        get: jest.fn().mockReturnValue({
          vendorName: "Test Vendor",
        }),
      } as any;

      mockVendorModel.findOne.mockResolvedValue(mockVendor);

      const result = await repository.getVendorName(1, 100);

      expect(mockVendorModel.findOne).toHaveBeenCalledWith({
        where: {
          vendorCompanyNumber: 1,
          vendorNo: 100,
          vendorIsDeleted: { [Op.notIn]: ["D", "I"] },
        },
        attributes: ["vendorName", "vendorCurrentBalance"],
      });
      expect(result).toEqual(mockVendor);
    });

    it("should return null when vendor not found", async () => {
      mockVendorModel.findOne.mockResolvedValue(null);

      const result = await repository.getVendorName(1, 999);

      expect(result).toBeNull();
    });

    it("should handle errors and throw them", async () => {
      const error = new Error("Database error");
      mockVendorModel.findOne.mockRejectedValue(error);

      await expect(repository.getVendorName(1, 100)).rejects.toThrow(error);
    });
  });

  describe("getLastPaymentInfo", () => {
    it("should return last payment info successfully", async () => {
      const mockVendor = { vendorName: "Test Vendor" } as any;
      const mockLastPayment = {
        companyNo: 1,
        vendorNo: 100,
        grossAmount: 1000.0,
        lastPaidDate: 20231201,
      } as any;

      mockVendorModel.findOne.mockResolvedValue(mockVendor);
      mockCheckInquiryModel.findOne.mockResolvedValue(mockLastPayment);

      const result = await repository.getLastPaymentInfo({
        companyNo: 1,
        vendorNo: 100,
        checkNo: 12345,
        invoiceNo: "INV001",
        startDate: "2023-01-01",
      });

      expect(result).toEqual({
        companyNo: 1,
        vendorNo: 100,
        grossAmount: 1000.0,
        lastPaidDate: 20231201,
        vendorName: "Test Vendor",
        openPayables: 0,
      });
    });

    it("should return last payment info without optional parameters", async () => {
      const mockVendor = { vendorName: "Test Vendor" } as any;
      const mockLastPayment = {
        companyNo: 1,
        vendorNo: 100,
        grossAmount: 1000.0,
        lastPaidDate: 20231201,
      } as any;

      mockVendorModel.findOne.mockResolvedValue(mockVendor);
      mockCheckInquiryModel.findOne.mockResolvedValue(mockLastPayment);

      const result = await repository.getLastPaymentInfo({
        companyNo: 1,
        vendorNo: 100,
      });

      expect(result).toEqual({
        companyNo: 1,
        vendorNo: 100,
        grossAmount: 1000.0,
        lastPaidDate: 20231201,
        vendorName: "Test Vendor",
        openPayables: 0,
      });
    });

    it("should handle case when no last payment found", async () => {
      mockVendorModel.findOne.mockResolvedValue({
        vendorName: "Test Vendor",
      } as any);
      mockCheckInquiryModel.findOne.mockResolvedValue(null);

      const result = await repository.getLastPaymentInfo({
        companyNo: 1,
        vendorNo: 100,
      });

      expect(result).toEqual({
        companyNo: 1,
        vendorNo: 100,
        grossAmount: 0,
        lastPaidDate: "",
        vendorName: "Test Vendor",
        openPayables: 0,
      });
    });
  });

  describe("getPaymentHistory", () => {
    it("should return payment history successfully", async () => {
      const mockResult = {
        rows: [
          {
            companyNo: 1,
            vendorNo: 100,
            checkNo: 12345,
            invoiceNo: "INV001",
            invoiceDescription: "Test Invoice",
            paidAmount: 1000.0,
            grossAmount: 1000.0,
            voucherNo: 123,
            invoiceDate: 82098,
            discount: 0,
            dueDate: 100498,
            bankGLNo: 11110001,
            bank_status: "To be Cleared",
          },
        ],
        count: 1,
      } as any;

      mockCheckInquiryModel.findAndCountAll.mockResolvedValue(mockResult);

      const result = await repository.getPaymentHistory({
        companyNo: 1,
        vendorNo: 100,
        limit: 10,
        offset: 0,
        page: 1,
      });

      expect(result).toEqual({
        rows: expect.any(Array),
        count: 1,
        limit: 10,
        page: 1,
      });
      expect(result.rows).toHaveLength(1);
    });

    it("should handle payment history with filters", async () => {
      const mockResult = {
        rows: [],
        count: 0,
      } as any;

      mockCheckInquiryModel.findAndCountAll.mockResolvedValue(mockResult);

      await expect(
        repository.getPaymentHistory({
          companyNo: 1,
          vendorNo: 100,
          checkNo: 12345,
          invoiceNo: "INV001",
          startDate: "2023-01-01",
          limit: 25,
          offset: 50,
          page: 3,
        })
      ).rejects.toThrow(HttpException);
    });
  });

  describe("getVoucherDetails", () => {
    it("should return voucher details successfully", async () => {
      const mockVendor = { vendorName: "Test Vendor" } as any;
      const mockVoucherResult = {
        vendorNo: 100,
        companyNo: 1,
        voucherNo: 123,
        bankGLNo: 11110001,
        checkNo: 12345,
        voucherDetails: {
          invoiceDate: 82098,
          invoiceNo: "INV001",
          invoiceDescription: "Test Invoice",
          discountDueDate: 0,
          dueDate: 100498,
          prepaidVoucher: "",
          checkNo: 12345,
          singleCheck: "",
          bankGLNo: 11110001,
          apGLAccountNo: 12010001,
          heldPaymentVoucher: "",
          heldDescription: "",
          grossAmount: 1000.0,
          freightTotal: 0,
          discount: 0,
          paidOn8: 19981001,
          salesOrderNo: 0,
          salesSRNNo: 0,
        },
        lineItem: [
          {
            detailLineAmount: 1000.0,
            detailLineDescription: "Test Line",
            detailLineDiscount: 0,
            poNumber: "PO001",
            freightAmount: 0,
            gallons: 100,
            receiptNumber: "RC001",
            quantity: 1,
            openClosedStatus: "O",
            expenseGLAccount: 5000,
          },
        ],
        get: jest.fn().mockReturnValue({
          vendorNo: 100,
          companyNo: 1,
          voucherNo: 123,
          bankGLNo: 11110001,
          checkNo: 12345,
          voucherDetails: {
            invoiceDate: 82098,
            invoiceNo: "INV001",
            invoiceDescription: "Test Invoice",
            discountDueDate: 0,
            dueDate: 100498,
            prepaidVoucher: "",
            checkNo: 12345,
            singleCheck: "",
            bankGLNo: 11110001,
            apGLAccountNo: 12010001,
            heldPaymentVoucher: "",
            heldDescription: "",
            grossAmount: 1000.0,
            freightTotal: 0,
            discount: 0,
            paidOn8: 19981001,
            salesOrderNo: 0,
            salesSRNNo: 0,
          },
          lineItem: [
            {
              detailLineAmount: 1000.0,
              detailLineDescription: "Test Line",
              detailLineDiscount: 0,
              poNumber: "PO001",
              freightAmount: 0,
              gallons: 100,
              receiptNumber: "RC001",
              quantity: 1,
              openClosedStatus: "O",
              expenseGLAccount: 5000,
            },
          ],
        }),
      } as any;

      mockVendorModel.findOne.mockResolvedValue(mockVendor);
      mockCheckInquiryModel.findOne.mockResolvedValue(mockVoucherResult);

      const result = await repository.getVoucherDetails({
        companyNo: 1,
        vendorNo: 100,
        voucherNo: 123,
      });

      expect(result).toBeDefined();
      expect(result?.vendorDetail).toBeDefined();
      expect(result?.headerItems).toBeDefined();
      expect(result?.detailItems).toBeDefined();
    });

    it("should return null when voucher not found", async () => {
      mockVendorModel.findOne.mockResolvedValue({
        vendorName: "Test Vendor",
      } as any);
      mockCheckInquiryModel.findOne.mockResolvedValue(null);

      const result = await repository.getVoucherDetails({
        companyNo: 1,
        vendorNo: 100,
        voucherNo: 999,
      });

      expect(result).toBeNull();
    });

    it("should handle errors and throw them", async () => {
      const error = new Error("Database error");
      mockVendorModel.findOne.mockRejectedValue(error);

      await expect(
        repository.getVoucherDetails({
          companyNo: 1,
          vendorNo: 100,
          voucherNo: 123,
        })
      ).rejects.toThrow(error);
    });
  });

  describe("validateCheckInquiryHistory", () => {
    it("should validate check inquiry history successfully", async () => {
      const mockRecord = {
        code: AMCODE.OPEN,
        checkAmount: 1000.0,
        checkDate8: 20231201,
      } as any;

      mockCheckInquiryHistoryModel.findOne.mockResolvedValue(mockRecord);

      const result = await repository.validateCheckInquiryHistory({
        checkNo: 12345,
        checkAmount: 1000.0,
        clearDateMmddyy: "123123",
        rowIndex: 0,
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return error for invalid date format", async () => {
      const result = await repository.validateCheckInquiryHistory({
        checkNo: 12345,
        checkAmount: 1000.0,
        clearDateMmddyy: "invalid",
        rowIndex: 0,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.code).toBe("INVALID_DATE_FORMAT");
    });

    it("should return error when check not found", async () => {
      mockCheckInquiryHistoryModel.findOne.mockResolvedValue(null);

      const result = await repository.validateCheckInquiryHistory({
        checkNo: 99999,
        checkAmount: 1000.0,
        clearDateMmddyy: "123123",
        rowIndex: 0,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.code).toBe("CHECK_NOT_FOUND");
    });

    it("should return error for deleted check", async () => {
      const mockRecord = {
        code: AMCODE.DELETED,
        checkAmount: 1000.0,
        checkDate8: 20231201,
      } as any;

      mockCheckInquiryHistoryModel.findOne.mockResolvedValue(mockRecord);

      const result = await repository.validateCheckInquiryHistory({
        checkNo: 12345,
        checkAmount: 1000.0,
        clearDateMmddyy: "123123",
        rowIndex: 0,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.code).toBe("CHECK_DELETED");
    });

    it("should return error for reconciled check", async () => {
      const mockRecord = {
        code: AMCODE.RECONCILED,
        checkAmount: 1000.0,
        checkDate8: 20231201,
      } as any;

      mockCheckInquiryHistoryModel.findOne.mockResolvedValue(mockRecord);

      const result = await repository.validateCheckInquiryHistory({
        checkNo: 12345,
        checkAmount: 1000.0,
        clearDateMmddyy: "123123",
        rowIndex: 0,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.code).toBe("CHECK_RECONCILED");
    });

    it("should return error for voided check", async () => {
      const mockRecord = {
        code: AMCODE.VOIDED,
        checkAmount: 1000.0,
        checkDate8: 20231201,
      } as any;

      mockCheckInquiryHistoryModel.findOne.mockResolvedValue(mockRecord);

      const result = await repository.validateCheckInquiryHistory({
        checkNo: 12345,
        checkAmount: 1000.0,
        clearDateMmddyy: "123123",
        rowIndex: 0,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.code).toBe("CHECK_VOIDED");
    });

    it("should return error for amount mismatch", async () => {
      const mockRecord = {
        code: AMCODE.OPEN,
        checkAmount: 999.99,
        checkDate8: 20231201,
      } as any;

      mockCheckInquiryHistoryModel.findOne.mockResolvedValue(mockRecord);

      const result = await repository.validateCheckInquiryHistory({
        checkNo: 12345,
        checkAmount: 1000.0,
        clearDateMmddyy: "123123",
        rowIndex: 0,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.code).toBe("AMOUNT_MISMATCH");
    });

    it("should handle errors and throw them", async () => {
      const error = new Error("Database error");
      mockCheckInquiryHistoryModel.findOne.mockRejectedValue(error);

      await expect(
        repository.validateCheckInquiryHistory({
          checkNo: 12345,
          checkAmount: 1000.0,
          clearDateMmddyy: "123123",
          rowIndex: 0,
        })
      ).rejects.toThrow(error);
    });
  });

  describe("processMultipleChecks", () => {
    const mockCheckData = [
      { checkNo: "12345", checkAmount: 1000.0, checkDate: "123123" },
      { checkNo: "12346", checkAmount: 2000.0, checkDate: "010124" },
      { checkNo: "12347", checkAmount: 3000.0, checkDate: "123123" },
    ];

    it("should process multiple checks successfully", async () => {
      const mockUpdateResult = [1, 1, 1]; // All updates successful

      mockCheckInquiryHistoryModel.update
        .mockResolvedValueOnce([mockUpdateResult[0]!])
        .mockResolvedValueOnce([mockUpdateResult[1]!])
        .mockResolvedValueOnce([mockUpdateResult[2]!]);

      const result = await repository.processMultipleChecks(mockCheckData);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        checkNo: "12345",
        checkAmount: 1000.0,
        checkDate: "123123",
        message: "Check processed successfully",
      });
      expect(result[1]).toEqual({
        checkNo: "12346",
        checkAmount: 2000.0,
        checkDate: "010124",
        message: "Check processed successfully",
      });
      expect(result[2]).toEqual({
        checkNo: "12347",
        checkAmount: 3000.0,
        checkDate: "123123",
        message: "Check processed successfully",
      });

      expect(mockCheckInquiryHistoryModel.update).toHaveBeenCalledTimes(3);
    });

    it("should handle failed updates", async () => {
      const mockUpdateResult = [0, 1, 0]; // Some updates failed

      mockCheckInquiryHistoryModel.update
        .mockResolvedValueOnce([mockUpdateResult[0]!])
        .mockResolvedValueOnce([mockUpdateResult[1]!])
        .mockResolvedValueOnce([mockUpdateResult[2]!]);

      const result = await repository.processMultipleChecks(mockCheckData);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        checkNo: "12345",
        checkAmount: 1000.0,
        checkDate: "123123",
        message: "No records were updated",
        errors: [
          {
            field: "checkNo",
            message: "No records found to update",
            code: "UPDATE_FAILED",
          },
        ],
      });
      expect(result[1]).toEqual({
        checkNo: "12346",
        checkAmount: 2000.0,
        checkDate: "010124",
        message: "Check processed successfully",
      });
      expect(result[2]).toEqual({
        checkNo: "12347",
        checkAmount: 3000.0,
        checkDate: "123123",
        message: "No records were updated",
        errors: [
          {
            field: "checkNo",
            message: "No records found to update",
            code: "UPDATE_FAILED",
          },
        ],
      });
    });

    it("should handle empty input array", async () => {
      const result = await repository.processMultipleChecks([]);

      expect(result).toHaveLength(0);
      expect(mockCheckInquiryHistoryModel.update).not.toHaveBeenCalled();
    });

    it("should handle single check processing", async () => {
      const singleCheckData = [
        { checkNo: "12345", checkAmount: 1000.0, checkDate: "123123" },
      ];
      const mockUpdateResult = [1];

      mockCheckInquiryHistoryModel.update.mockResolvedValue([
        mockUpdateResult[0]!,
      ]);

      const result = await repository.processMultipleChecks(singleCheckData);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        checkNo: "12345",
        checkAmount: 1000.0,
        checkDate: "123123",
        message: "Check processed successfully",
      });

      expect(mockCheckInquiryHistoryModel.update).toHaveBeenCalledTimes(1);
    });

    it("should handle database errors during processing", async () => {
      const dbError = new Error("Database connection failed");

      mockCheckInquiryHistoryModel.update.mockRejectedValue(dbError);

      await expect(
        repository.processMultipleChecks(mockCheckData)
      ).rejects.toThrow(dbError);

      expect(mockCheckInquiryHistoryModel.update).toHaveBeenCalledTimes(1);
    });

    it("should process checks with different date formats", async () => {
      const checksWithDifferentDates = [
        { checkNo: "12345", checkAmount: 1000.0, checkDate: "123123" },
        { checkNo: "12346", checkAmount: 2000.0, checkDate: "010124" },
        { checkNo: "12347", checkAmount: 3000.0, checkDate: "123123" },
      ];

      const mockUpdateResult = [1, 1, 1];

      mockCheckInquiryHistoryModel.update
        .mockResolvedValueOnce([mockUpdateResult[0]!])
        .mockResolvedValueOnce([mockUpdateResult[1]!])
        .mockResolvedValueOnce([mockUpdateResult[2]!]);

      const result = await repository.processMultipleChecks(
        checksWithDifferentDates
      );

      expect(result).toHaveLength(3);
      expect(
        result.every((r) => r.message === "Check processed successfully")
      ).toBe(true);
      expect(mockCheckInquiryHistoryModel.update).toHaveBeenCalledTimes(3);
    });
  });
});
