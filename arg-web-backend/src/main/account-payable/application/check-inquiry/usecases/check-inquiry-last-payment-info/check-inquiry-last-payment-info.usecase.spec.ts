import { Test, TestingModule } from "@nestjs/testing";
import { CheckInquiryLastPaymentInfoUseCase } from "./check-inquiry-last-payment-info.usecase";
import { CheckInquiryInterface } from "@src/main/account-payable/domain/interface/check-inquiry.interface";
import { checkPaymentHistoryDto } from "../../dto/check-inquiry.dto";
import { lastPaymentInfo } from "@src/types/check-inquiry-types";
import { HttpException, HttpStatus } from "@nestjs/common";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";

describe("CheckInquiryLastPaymentInfoUseCase", () => {
  let useCase: CheckInquiryLastPaymentInfoUseCase;
  let mockCheckInquiryInterface: jest.Mocked<CheckInquiryInterface>;

  beforeEach(async () => {
    mockCheckInquiryInterface = {
      getLastPaymentInfo: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckInquiryLastPaymentInfoUseCase,
        {
          provide: "CheckInquiryInterface",
          useValue: mockCheckInquiryInterface,
        },
      ],
    }).compile();

    useCase = module.get<CheckInquiryLastPaymentInfoUseCase>(
      CheckInquiryLastPaymentInfoUseCase
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    const mockInput: checkPaymentHistoryDto = {
      companyNo: 10,
      vendorNo: 1100,
      startDate: "2024-01-01",
      invoiceNo: "123456",
      checkNo: 789,
      current_page: 1,
      items_per_page: 10,
    };

    const mockLastPaymentInfo: lastPaymentInfo = {
      companyNo: 10,
      vendorNo: 1100,
      grossAmount: 500.0,
      lastPaidDate: "2024-01-15",
      vendorName: "Test Vendor",
      openPayables: 250.0,
    };

    it("should execute successfully and return last payment info", async () => {
      mockCheckInquiryInterface.getLastPaymentInfo.mockResolvedValue(
        mockLastPaymentInfo
      );

      const result = await useCase.execute(mockInput);

      expect(mockCheckInquiryInterface.getLastPaymentInfo).toHaveBeenCalledWith(
        {
          companyNo: 10,
          vendorNo: 1100,
          startDate: "2024-01-01",
          invoiceNo: "123456",
          checkNo: 789,
        }
      );
      expect(result).toEqual(mockLastPaymentInfo);
    });

    it("should execute successfully with minimal parameters", async () => {
      const minimalInput: checkPaymentHistoryDto = {
        companyNo: 10,
        vendorNo: 1100,
        current_page: 1,
        items_per_page: 10,
      };

      const minimalLastPaymentInfo: lastPaymentInfo = {
        companyNo: 10,
        vendorNo: 1100,
        grossAmount: 0,
        lastPaidDate: "",
        vendorName: null,
        openPayables: 0,
      };

      mockCheckInquiryInterface.getLastPaymentInfo.mockResolvedValue(
        minimalLastPaymentInfo
      );

      const result = await useCase.execute(minimalInput);

      expect(mockCheckInquiryInterface.getLastPaymentInfo).toHaveBeenCalledWith(
        {
          companyNo: 10,
          vendorNo: 1100,
          startDate: undefined,
          invoiceNo: undefined,
          checkNo: undefined,
        }
      );
      expect(result).toEqual(minimalLastPaymentInfo);
    });

    it("should execute successfully with partial parameters", async () => {
      const partialInput: checkPaymentHistoryDto = {
        companyNo: 10,
        vendorNo: 1100,
        startDate: "2024-01-01",
        current_page: 1,
        items_per_page: 10,
      };

      const partialLastPaymentInfo: lastPaymentInfo = {
        companyNo: 10,
        vendorNo: 1100,
        grossAmount: 300.0,
        lastPaidDate: "2024-01-10",
        vendorName: "Partial Vendor",
        openPayables: 150.0,
      };

      mockCheckInquiryInterface.getLastPaymentInfo.mockResolvedValue(
        partialLastPaymentInfo
      );

      const result = await useCase.execute(partialInput);

      expect(mockCheckInquiryInterface.getLastPaymentInfo).toHaveBeenCalledWith(
        {
          companyNo: 10,
          vendorNo: 1100,
          startDate: "2024-01-01",
          invoiceNo: undefined,
          checkNo: undefined,
        }
      );
      expect(result).toEqual(partialLastPaymentInfo);
    });

    it("should throw HttpException when last payment info not found", async () => {
      mockCheckInquiryInterface.getLastPaymentInfo.mockResolvedValue(
        null as any
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
                  message: "Payment Info not Found",
                },
              ],
            },
          });
        }
      }

      expect(mockCheckInquiryInterface.getLastPaymentInfo).toHaveBeenCalledWith(
        {
          companyNo: 10,
          vendorNo: 1100,
          startDate: "2024-01-01",
          invoiceNo: "123456",
          checkNo: 789,
        }
      );
    });

    it("should throw HttpException when last payment info is undefined", async () => {
      mockCheckInquiryInterface.getLastPaymentInfo.mockResolvedValue(
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
                  message: "Payment Info not Found",
                },
              ],
            },
          });
        }
      }

      expect(mockCheckInquiryInterface.getLastPaymentInfo).toHaveBeenCalledWith(
        {
          companyNo: 10,
          vendorNo: 1100,
          startDate: "2024-01-01",
          invoiceNo: "123456",
          checkNo: 789,
        }
      );
    });

    it("should handle error from interface", async () => {
      const error = new Error("Database connection failed");
      mockCheckInquiryInterface.getLastPaymentInfo.mockRejectedValue(error);

      await expect(useCase.execute(mockInput)).rejects.toThrow(error);
      expect(mockCheckInquiryInterface.getLastPaymentInfo).toHaveBeenCalledWith(
        {
          companyNo: 10,
          vendorNo: 1100,
          startDate: "2024-01-01",
          invoiceNo: "123456",
          checkNo: 789,
        }
      );
    });

    it("should execute successfully with zero amounts", async () => {
      const zeroAmountLastPaymentInfo: lastPaymentInfo = {
        companyNo: 10,
        vendorNo: 1100,
        grossAmount: 0,
        lastPaidDate: "",
        vendorName: null,
        openPayables: 0,
      };

      mockCheckInquiryInterface.getLastPaymentInfo.mockResolvedValue(
        zeroAmountLastPaymentInfo
      );

      const result = await useCase.execute(mockInput);

      expect(mockCheckInquiryInterface.getLastPaymentInfo).toHaveBeenCalledWith(
        {
          companyNo: 10,
          vendorNo: 1100,
          startDate: "2024-01-01",
          invoiceNo: "123456",
          checkNo: 789,
        }
      );
      expect(result).toEqual(zeroAmountLastPaymentInfo);
    });

    it("should execute successfully with large amounts", async () => {
      const largeAmountLastPaymentInfo: lastPaymentInfo = {
        companyNo: 10,
        vendorNo: 1100,
        grossAmount: 999999.99,
        lastPaidDate: "2024-12-31",
        vendorName: "Large Amount Vendor",
        openPayables: 500000.0,
      };

      mockCheckInquiryInterface.getLastPaymentInfo.mockResolvedValue(
        largeAmountLastPaymentInfo
      );

      const result = await useCase.execute(mockInput);

      expect(mockCheckInquiryInterface.getLastPaymentInfo).toHaveBeenCalledWith(
        {
          companyNo: 10,
          vendorNo: 1100,
          startDate: "2024-01-01",
          invoiceNo: "123456",
          checkNo: 789,
        }
      );
      expect(result).toEqual(largeAmountLastPaymentInfo);
    });
  });
});
