import { Test, TestingModule } from "@nestjs/testing";
import { ValidateSingleCheckUseCase } from "./validate-single-check.usecase";
import { CheckInquiryInterface } from "@src/main/account-payable/domain/interface/check-inquiry.interface";
import { SingleCheckValidationDto } from "../../dto/clear-checks.dto";
import { CheckInquiryHistoryValidationResult } from "@src/main/account-payable/domain/interface/check-inquiry.interface";

describe("ValidateSingleCheckUseCase", () => {
  let useCase: ValidateSingleCheckUseCase;
  let mockCheckInquiryInterface: jest.Mocked<CheckInquiryInterface>;

  const mockValidationData: SingleCheckValidationDto = {
    checkNo: "210091",
    checkAmount: 11.55,
    checkDate: "061025",
  };

  beforeEach(async () => {
    const mockInterface = {
      getPaymentHistory: jest.fn(),
      getLastPaymentInfo: jest.fn(),
      getVoucherDetails: jest.fn(),
      validateCheckInquiryHistory: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateSingleCheckUseCase,
        {
          provide: "CheckInquiryInterface",
          useValue: mockInterface,
        },
      ],
    }).compile();

    useCase = module.get<ValidateSingleCheckUseCase>(
      ValidateSingleCheckUseCase
    );
    mockCheckInquiryInterface = module.get("CheckInquiryInterface");
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  describe("execute", () => {
    it("should validate a check successfully when all validations pass", async () => {
      const mockDomainResult: CheckInquiryHistoryValidationResult = {
        isValid: true,
        errors: [],
      };

      mockCheckInquiryInterface.validateCheckInquiryHistory.mockResolvedValue(
        mockDomainResult
      );

      const result = await useCase.execute(mockValidationData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(
        mockCheckInquiryInterface.validateCheckInquiryHistory
      ).toHaveBeenCalledWith({
        checkNo: "210091",
        checkAmount: 11.55,
        clearDateMmddyy: "061025",
      });
    });

    it("should return validation errors when check is not found", async () => {
      const mockDomainResult: CheckInquiryHistoryValidationResult = {
        isValid: false,
        errors: [
          {
            field: "checkNo",
            message: "Check not found in database",
            code: "CHECK_NOT_FOUND",
          },
        ],
      };

      mockCheckInquiryInterface.validateCheckInquiryHistory.mockResolvedValue(
        mockDomainResult
      );

      const result = await useCase.execute(mockValidationData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.code).toBe("CHECK_NOT_FOUND");
    });

    it("should return validation errors when amount does not match", async () => {
      const mockDomainResult: CheckInquiryHistoryValidationResult = {
        isValid: false,
        errors: [
          {
            field: "checkNo",
            message: "Check amount does not match database record",
            code: "AMOUNT_MISMATCH",
          },
        ],
      };

      mockCheckInquiryInterface.validateCheckInquiryHistory.mockResolvedValue(
        mockDomainResult
      );

      const result = await useCase.execute(mockValidationData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.code).toBe("AMOUNT_MISMATCH");
    });

    it("should return validation errors when date is invalid", async () => {
      const mockDomainResult: CheckInquiryHistoryValidationResult = {
        isValid: false,
        errors: [
          {
            field: "checkDate",
            message: "Invalid date format or logic",
            code: "INVALID_DATE",
          },
        ],
      };

      mockCheckInquiryInterface.validateCheckInquiryHistory.mockResolvedValue(
        mockDomainResult
      );

      const result = await useCase.execute(mockValidationData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.code).toBe("INVALID_DATE");
    });

    it("should detect when check is already processed", async () => {
      const mockDomainResult: CheckInquiryHistoryValidationResult = {
        isValid: false,
        errors: [
          {
            field: "checkNo",
            message: "Check has already been processed",
            code: "ALREADY_PROCESSED",
          },
        ],
      };

      mockCheckInquiryInterface.validateCheckInquiryHistory.mockResolvedValue(
        mockDomainResult
      );

      const result = await useCase.execute(mockValidationData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.code).toBe("ALREADY_PROCESSED");
    });

    it("should handle multiple validation errors correctly", async () => {
      const mockDomainResult: CheckInquiryHistoryValidationResult = {
        isValid: false,
        errors: [
          {
            field: "checkNo",
            message: "Check not found in database",
            code: "CHECK_NOT_FOUND",
          },
          {
            field: "checkAmount",
            message: "Check amount does not match database record",
            code: "AMOUNT_MISMATCH",
          },
        ],
      };

      mockCheckInquiryInterface.validateCheckInquiryHistory.mockResolvedValue(
        mockDomainResult
      );

      const result = await useCase.execute(mockValidationData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });

    it("should handle domain service errors gracefully", async () => {
      mockCheckInquiryInterface.validateCheckInquiryHistory.mockRejectedValue(
        new Error("Database connection failed")
      );

      await expect(useCase.execute(mockValidationData)).rejects.toThrow(
        "Validation failed: Database connection failed"
      );
    });
  });
});
