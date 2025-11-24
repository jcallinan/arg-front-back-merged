import { Test, TestingModule } from "@nestjs/testing";
import { CheckInquiryVoucherDetailUseCase } from "./check-inquiry-voucher-detail.usecase";
import { CheckInquiryInterface } from "@src/main/account-payable/domain/interface/check-inquiry.interface";
import {
  checkInquiryVoucherDetailDto,
  voucherDetailsResponseDto,
} from "../../dto/check-inquiry.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";

describe("CheckInquiryVoucherDetailUseCase", () => {
  let useCase: CheckInquiryVoucherDetailUseCase;
  let mockCheckInquiryInterface: jest.Mocked<CheckInquiryInterface>;

  beforeEach(async () => {
    mockCheckInquiryInterface = {
      getVoucherDetails: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckInquiryVoucherDetailUseCase,
        {
          provide: "CheckInquiryInterface",
          useValue: mockCheckInquiryInterface,
        },
      ],
    }).compile();

    useCase = module.get<CheckInquiryVoucherDetailUseCase>(
      CheckInquiryVoucherDetailUseCase
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    const mockInput: checkInquiryVoucherDetailDto = {
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

    it("should execute successfully and return voucher details", async () => {
      mockCheckInquiryInterface.getVoucherDetails.mockResolvedValue(
        mockVoucherDetails as any
      );

      const result = await useCase.execute(mockInput);

      expect(mockCheckInquiryInterface.getVoucherDetails).toHaveBeenCalledWith(
        mockInput
      );
      expect(result).toEqual(mockVoucherDetails);
    });

    it("should execute successfully with minimal parameters", async () => {
      const minimalInput: checkInquiryVoucherDetailDto = {
        companyNo: 10,
        vendorNo: 1100,
        voucherNo: 0,
      };

      const minimalVoucherDetails: voucherDetailsResponseDto = {
        vendorDetail: {
          vendorNo: 1100,
          companyNo: 10,
          voucherNo: 0,
          bankGLNo: 0,
          checkNo: 0,
          vendorDetails: {
            vendorName: "Test Vendor",
          },
        },
        headerItems: null,
        detailItems: [],
      };

      mockCheckInquiryInterface.getVoucherDetails.mockResolvedValue(
        minimalVoucherDetails as any
      );

      const result = await useCase.execute(minimalInput);

      expect(mockCheckInquiryInterface.getVoucherDetails).toHaveBeenCalledWith(
        minimalInput
      );
      expect(result).toEqual(minimalVoucherDetails);
    });

    it("should execute successfully with partial voucher details", async () => {
      const partialVoucherDetails: voucherDetailsResponseDto = {
        vendorDetail: null,
        headerItems: {
          invoiceDescription: "Test Invoice",
          prepaidVoucher: "",
          heldPaymentVoucher: "",
          heldDescription: "",
          singleCheck: "",
          invoiceNo: "123456",
          grossAmount: 100.0,
          discount: 0,
          apGLAccountNo: 12010001,
          discountDueDate: 0,
          invoiceDate: 82098,
          dueDate: 100498,
          checkNo: 12345,
          bankGLNo: 11110001,
          paidOn8: 19981001,
          freightTotal: 0,
          salesOrderNo: 0,
          salesSRNNo: 0,
        },
        detailItems: [],
      };

      mockCheckInquiryInterface.getVoucherDetails.mockResolvedValue(
        partialVoucherDetails as any
      );

      const result = await useCase.execute(mockInput);

      expect(mockCheckInquiryInterface.getVoucherDetails).toHaveBeenCalledWith(
        mockInput
      );
      expect(result).toEqual(partialVoucherDetails);
    });

    it("should throw HttpException when voucher details not found", async () => {
      mockCheckInquiryInterface.getVoucherDetails.mockResolvedValue(null);

      await expect(useCase.execute(mockInput)).rejects.toThrow(HttpException);

      try {
        await useCase.execute(mockInput);
      } catch (error) {
        if (error instanceof HttpException) {
          expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
          expect(error.getResponse()).toEqual({
            error: {
              code: ERROR_CONSTANTS.NOT_FOUND.code,
              message: ERROR_CONSTANTS.NOT_FOUND.message,
              details: [
                {
                  field: "check-inquiry",
                  code: ERROR_CONSTANTS.NOT_FOUND.code,
                  message: "Voucher Details not found",
                },
              ],
            },
          });
        }
      }

      expect(mockCheckInquiryInterface.getVoucherDetails).toHaveBeenCalledWith(
        mockInput
      );
    });

    it("should throw HttpException when voucher details is undefined", async () => {
      mockCheckInquiryInterface.getVoucherDetails.mockResolvedValue(
        undefined as any
      );

      await expect(useCase.execute(mockInput)).rejects.toThrow(HttpException);

      try {
        await useCase.execute(mockInput);
      } catch (error) {
        if (error instanceof HttpException) {
          expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
          expect(error.getResponse()).toEqual({
            error: {
              code: ERROR_CONSTANTS.NOT_FOUND.code,
              message: ERROR_CONSTANTS.NOT_FOUND.message,
              details: [
                {
                  field: "check-inquiry",
                  code: ERROR_CONSTANTS.NOT_FOUND.code,
                  message: "Voucher Details not found",
                },
              ],
            },
          });
        }
      }

      expect(mockCheckInquiryInterface.getVoucherDetails).toHaveBeenCalledWith(
        mockInput
      );
    });

    it("should handle error from interface", async () => {
      const error = new Error("Database connection failed");
      mockCheckInquiryInterface.getVoucherDetails.mockRejectedValue(error);

      await expect(useCase.execute(mockInput)).rejects.toThrow(error);
      expect(mockCheckInquiryInterface.getVoucherDetails).toHaveBeenCalledWith(
        mockInput
      );
    });

    it("should execute successfully with empty detail items", async () => {
      const emptyDetailVoucherDetails: voucherDetailsResponseDto = {
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
          invoiceDescription: "Test Invoice",
          prepaidVoucher: "",
          heldPaymentVoucher: "",
          heldDescription: "",
          singleCheck: "",
          invoiceNo: "123456",
          grossAmount: 100.0,
          discount: 0,
          apGLAccountNo: 12010001,
          discountDueDate: 0,
          invoiceDate: 82098,
          dueDate: 100498,
          checkNo: 12345,
          bankGLNo: 11110001,
          paidOn8: 19981001,
          freightTotal: 0,
          salesOrderNo: 0,
          salesSRNNo: 0,
        },
        detailItems: [],
      };

      mockCheckInquiryInterface.getVoucherDetails.mockResolvedValue(
        emptyDetailVoucherDetails as any
      );

      const result = await useCase.execute(mockInput);

      expect(mockCheckInquiryInterface.getVoucherDetails).toHaveBeenCalledWith(
        mockInput
      );
      expect(result).toEqual(emptyDetailVoucherDetails);
    });
  });
});
