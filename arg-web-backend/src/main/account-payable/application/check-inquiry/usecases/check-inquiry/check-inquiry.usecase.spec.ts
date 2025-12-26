import { Test, TestingModule } from "@nestjs/testing";
import { CheckInquiryUseCase } from "./check-inquiry.usecase";
import { CheckInquiryInterface } from "@src/main/account-payable/domain/interface/check-inquiry.interface";
import {
  checkPaymentHistoryDto,
  CheckInquiryResponseDto,
} from "../../dto/check-inquiry.dto";

describe("CheckInquiryUseCase", () => {
  let useCase: CheckInquiryUseCase;
  let mockCheckInquiryInterface: jest.Mocked<CheckInquiryInterface>;

  beforeEach(async () => {
    mockCheckInquiryInterface = {
      getPaymentHistory: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckInquiryUseCase,
        {
          provide: "CheckInquiryInterface",
          useValue: mockCheckInquiryInterface,
        },
      ],
    }).compile();

    useCase = module.get<CheckInquiryUseCase>(CheckInquiryUseCase);
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

    const mockResponse = {
      items: [
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
            checkDate: 20116,
          },
        } as Partial<CheckInquiryResponseDto>,
      ],
      pagination: {
        total_items: 1,
        current_page: 1,
        items_per_page: 10,
        total_pages: 1,
      },
    };

    it("should execute successfully with all parameters", async () => {
      mockCheckInquiryInterface.getPaymentHistory.mockResolvedValue({
        rows: mockResponse.items,
        count: mockResponse.pagination.total_items,
      } as any);

      const result = await useCase.execute(mockInput);

      expect(mockCheckInquiryInterface.getPaymentHistory).toHaveBeenCalledWith({
        companyNo: 10,
        vendorNo: 1100,
        limit: 10,
        offset: 0,
        page: 1,
        startDate: "2024-01-01",
        invoiceNo: "123456",
        checkNo: 789,
      });
      expect(result).toEqual(mockResponse);
    });

    it("should execute successfully with minimal parameters", async () => {
      const minimalInput: checkPaymentHistoryDto = {
        companyNo: 10,
        vendorNo: 1100,
        current_page: 1,
        items_per_page: 10,
      };

      const minimalResponse = {
        items: [],
        pagination: {
          total_items: 0,
          current_page: 1,
          items_per_page: 10,
          total_pages: 0,
        },
      };

      mockCheckInquiryInterface.getPaymentHistory.mockResolvedValue({
        rows: [],
        count: 0,
      } as any);

      const result = await useCase.execute(minimalInput);

      expect(mockCheckInquiryInterface.getPaymentHistory).toHaveBeenCalledWith({
        companyNo: 10,
        vendorNo: 1100,
        limit: 10,
        offset: 0,
        page: 1,
        startDate: undefined,
        invoiceNo: undefined,
        checkNo: undefined,
      });
      expect(result).toEqual(minimalResponse);
    });

    it("should execute successfully with pagination parameters", async () => {
      const paginatedInput: checkPaymentHistoryDto = {
        companyNo: 10,
        vendorNo: 1100,
        current_page: 3,
        items_per_page: 25,
      };

      const paginatedResponse = {
        items: [],
        pagination: {
          total_items: 0,
          current_page: 3,
          items_per_page: 25,
          total_pages: 0,
        },
      };

      mockCheckInquiryInterface.getPaymentHistory.mockResolvedValue({
        rows: [],
        count: 0,
      } as any);

      const result = await useCase.execute(paginatedInput);

      expect(mockCheckInquiryInterface.getPaymentHistory).toHaveBeenCalledWith({
        companyNo: 10,
        vendorNo: 1100,
        limit: 25,
        offset: 50,
        page: 3,
        startDate: undefined,
        invoiceNo: undefined,
        checkNo: undefined,
      });
      expect(result).toEqual(paginatedResponse);
    });

    it("should handle error from interface", async () => {
      const error = new Error("Database connection failed");
      mockCheckInquiryInterface.getPaymentHistory.mockRejectedValue(error);

      await expect(useCase.execute(mockInput)).rejects.toThrow(error);
      expect(mockCheckInquiryInterface.getPaymentHistory).toHaveBeenCalledWith({
        companyNo: 10,
        vendorNo: 1100,
        limit: 10,
        offset: 0,
        page: 1,
        startDate: "2024-01-01",
        invoiceNo: "123456",
        checkNo: 789,
      });
    });

    it("should handle empty result from interface", async () => {
      const emptyResponse = {
        items: [],
        pagination: {
          total_items: 0,
          current_page: 1,
          items_per_page: 10,
          total_pages: 0,
        },
      };

      mockCheckInquiryInterface.getPaymentHistory.mockResolvedValue({
        rows: [],
        count: 0,
      } as any);

      const result = await useCase.execute(mockInput);

      expect(result).toEqual(emptyResponse);
      expect(mockCheckInquiryInterface.getPaymentHistory).toHaveBeenCalledWith({
        companyNo: 10,
        vendorNo: 1100,
        limit: 10,
        offset: 0,
        page: 1,
        startDate: "2024-01-01",
        invoiceNo: "123456",
        checkNo: 789,
      });
    });
  });
});
