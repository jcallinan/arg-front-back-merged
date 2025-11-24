import { Test, TestingModule } from "@nestjs/testing";
import { CheckInquiryController } from "./check-inquiry.controller";
import { CheckInquiryUseCase } from "../usecases/check-inquiry/check-inquiry.usecase";
import { CheckInquiryLastPaymentInfoUseCase } from "../usecases/check-inquiry-last-payment-info/check-inquiry-last-payment-info.usecase";
import { CheckInquiryVoucherDetailUseCase } from "../usecases/check-inquiry-voucher-detail/check-inquiry-voucher-detail.usecase";
import {
  checkPaymentHistoryDto,
  checkInquiryVoucherDetailDto,
  CheckInquiryResponseDto,
  voucherDetailsResponseDto,
} from "../dto/check-inquiry.dto";
import { lastPaymentInfo } from "@src/types/check-inquiry-types";
import { SimpleResponse } from "@src/shared/utils/response-formatter";

describe("CheckInquiryController", () => {
  let controller: CheckInquiryController;

  const mockCheckInquiryUseCase = {
    execute: jest.fn(),
  };

  const mockCheckInquiryLastPaymentInfoUseCase = {
    execute: jest.fn(),
  };

  const mockCheckInquiryVoucherDetailUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckInquiryController],
      providers: [
        {
          provide: CheckInquiryUseCase,
          useValue: mockCheckInquiryUseCase,
        },
        {
          provide: CheckInquiryLastPaymentInfoUseCase,
          useValue: mockCheckInquiryLastPaymentInfoUseCase,
        },
        {
          provide: CheckInquiryVoucherDetailUseCase,
          useValue: mockCheckInquiryVoucherDetailUseCase,
        },
      ],
    }).compile();

    controller = module.get<CheckInquiryController>(CheckInquiryController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getPyamentHistory", () => {
    const mockQuery: checkPaymentHistoryDto = {
      companyNo: 10,
      vendorNo: 1100,
      startDate: "01116", // MMDDYY format - January 11, 2016
      invoiceNo: "123456",
      checkNo: 789,
      current_page: 1,
      items_per_page: 10,
    };

    const mockResponse = {
      rows: [
        {
          companyNo: 10,
          vendorNo: 1100,
          checkNo: 789,
          invoiceNo: "123456",
          invoiceDescription: "Test Invoice",
          paidAmount: 100.0,
          grossAmount: 100.0,
          discount: 0,
          bankGLNo: 11000001,
          bank_status: "To be Cleared",
          bankGLNumber: {
            vendorName: "Test Vendor",
            checkDate: 20116, // MMDDYY format - January 20, 2016
          },
        } as Partial<CheckInquiryResponseDto>,
      ],
      count: 1,
      limit: 10,
      page: 1,
    };

    it("should return payment history successfully", async () => {
      mockCheckInquiryUseCase.execute.mockResolvedValue(mockResponse);

      const result = await controller.getPyamentHistory(mockQuery);

      expect(mockCheckInquiryUseCase.execute).toHaveBeenCalledWith(mockQuery);
      expect(result).toEqual(mockResponse);
    });

    it("should handle empty query parameters", async () => {
      const emptyQuery: checkPaymentHistoryDto = {
        companyNo: 10,
        vendorNo: 1100,
        current_page: 1,
        items_per_page: 10,
      };

      const emptyResponse = {
        rows: [],
        count: 0,
        limit: 10,
        page: 1,
      };

      mockCheckInquiryUseCase.execute.mockResolvedValue(emptyResponse);

      const result = await controller.getPyamentHistory(emptyQuery);

      expect(mockCheckInquiryUseCase.execute).toHaveBeenCalledWith(emptyQuery);
      expect(result).toEqual(emptyResponse);
    });

    it("should handle error from use case", async () => {
      const error = new Error("Database error");
      mockCheckInquiryUseCase.execute.mockRejectedValue(error);

      await expect(controller.getPyamentHistory(mockQuery)).rejects.toThrow(
        error
      );
      expect(mockCheckInquiryUseCase.execute).toHaveBeenCalledWith(mockQuery);
    });
  });

  describe("getLastPaymentInfo", () => {
    const mockQuery: checkPaymentHistoryDto = {
      companyNo: 10,
      vendorNo: 1100,
      startDate: "01116", // MMDDYY format - January 11, 2016
      invoiceNo: "123456",
      checkNo: 789,
      current_page: 1,
      items_per_page: 10,
    };

    const mockLastPaymentInfo: lastPaymentInfo = {
      companyNo: 10,
      vendorNo: 1100,
      grossAmount: 500.0,
      lastPaidDate: "01116", // MMDDYY format - January 11, 2016
      vendorName: "Test Vendor",
      openPayables: 250.0,
    };

    it("should return last payment info successfully", async () => {
      mockCheckInquiryLastPaymentInfoUseCase.execute.mockResolvedValue(
        mockLastPaymentInfo
      );

      const result = await controller.getLastPaymentInfo(mockQuery);

      expect(
        mockCheckInquiryLastPaymentInfoUseCase.execute
      ).toHaveBeenCalledWith(mockQuery);
      expect(result).toEqual(mockLastPaymentInfo);
    });

    it("should handle empty query parameters", async () => {
      const emptyQuery: checkPaymentHistoryDto = {
        companyNo: 10,
        vendorNo: 1100,
        current_page: 1,
        items_per_page: 10,
      };

      const emptyLastPaymentInfo: lastPaymentInfo = {
        companyNo: 10,
        vendorNo: 1100,
        grossAmount: 0,
        lastPaidDate: "",
        vendorName: null,
        openPayables: 0,
      };

      mockCheckInquiryLastPaymentInfoUseCase.execute.mockResolvedValue(
        emptyLastPaymentInfo
      );

      const result = await controller.getLastPaymentInfo(emptyQuery);

      expect(
        mockCheckInquiryLastPaymentInfoUseCase.execute
      ).toHaveBeenCalledWith(emptyQuery);
      expect(result).toEqual(emptyLastPaymentInfo);
    });

    it("should handle error from use case", async () => {
      const error = new Error("Database error");
      mockCheckInquiryLastPaymentInfoUseCase.execute.mockRejectedValue(error);

      await expect(controller.getLastPaymentInfo(mockQuery)).rejects.toThrow(
        error
      );
      expect(
        mockCheckInquiryLastPaymentInfoUseCase.execute
      ).toHaveBeenCalledWith(mockQuery);
    });
  });

  describe("getVoucherDetail", () => {
    const mockQuery: checkInquiryVoucherDetailDto = {
      companyNo: 10,
      vendorNo: 1100,
      voucherNo: 16994,
      checkNo: 50774,
      invoiceNo: "234161",
    };

    const mockVoucherDetails: voucherDetailsResponseDto = {
      vendorDetail: {
        vendorNo: 1100,
        companyNo: 10,
        voucherNo: 16994,
        bankGLNo: 11110001,
        checkNo: 50774,
        vendorDetails: {
          vendorName: "ABCOTT Consulting",
        },
      },
      headerItems: {
        invoiceDescription: "AIR, N, WHEELS, DISC",
        prepaidVoucher: "",
        heldPaymentVoucher: "",
        heldDescription: "",
        singleCheck: "",
        invoiceNo: "234161",
        grossAmount: 220.69,
        discount: 0,
        apGLAccountNo: 12010001,
        discountDueDate: 0,
        invoiceDate: 82098,
        dueDate: 100498,
        checkNo: 50774,
        bankGLNo: 11110001,
        paidOn8: 19981001,
        freightTotal: 0,
        salesOrderNo: 0,
        salesSRNNo: 0,
      },
      detailItems: [
        {
          detailLineDescription: "AIR, N, WHEELS, DISC",
          openClosedStatus: "C",
          poNumber: "",
          detailLineAmount: 220.69,
          detailLineDiscount: 0,
          expenseGLAccount: 26100501,
          quantity: 0,
          receiptNumber: 0,
          freightAmount: 0,
        },
      ],
    };

    it("should return voucher details successfully", async () => {
      mockCheckInquiryVoucherDetailUseCase.execute.mockResolvedValue(
        mockVoucherDetails
      );

      const result = await controller.getVoucherDetail(mockQuery);

      expect(mockCheckInquiryVoucherDetailUseCase.execute).toHaveBeenCalledWith(
        mockQuery
      );
      expect(result).toEqual({
        items: mockVoucherDetails,
      } as SimpleResponse<voucherDetailsResponseDto>);
    });

    it("should handle empty query parameters", async () => {
      const emptyQuery: checkInquiryVoucherDetailDto = {
        companyNo: 10,
        vendorNo: 1100,
        voucherNo: 0,
      };

      const emptyVoucherDetails: voucherDetailsResponseDto = {
        vendorDetail: null,
        headerItems: null,
        detailItems: [],
      };

      mockCheckInquiryVoucherDetailUseCase.execute.mockResolvedValue(
        emptyVoucherDetails
      );

      const result = await controller.getVoucherDetail(emptyQuery);

      expect(mockCheckInquiryVoucherDetailUseCase.execute).toHaveBeenCalledWith(
        emptyQuery
      );
      expect(result).toEqual({
        items: emptyVoucherDetails,
      } as SimpleResponse<voucherDetailsResponseDto>);
    });

    it("should handle error from use case", async () => {
      const error = new Error("Database error");
      mockCheckInquiryVoucherDetailUseCase.execute.mockRejectedValue(error);

      await expect(controller.getVoucherDetail(mockQuery)).rejects.toThrow(
        error
      );
      expect(mockCheckInquiryVoucherDetailUseCase.execute).toHaveBeenCalledWith(
        mockQuery
      );
    });
  });
});
