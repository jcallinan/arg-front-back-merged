import { Test, TestingModule } from "@nestjs/testing";
import { ProcessMultipleChecksUseCase } from "./process-multiple-checks.usecase";
import { CheckInquiryInterface } from "@src/main/account-payable/domain/interface/check-inquiry.interface";
import { ProcessMultipleChecksDto } from "../../dto/clear-checks.dto";
import { ProcessMultipleChecksResult } from "@src/main/account-payable/domain/interface/check-inquiry.interface";

describe("ProcessMultipleChecksUseCase", () => {
  let useCase: ProcessMultipleChecksUseCase;
  let mockCheckInquiryInterface: jest.Mocked<CheckInquiryInterface>;

  const mockProcessData: ProcessMultipleChecksDto = {
    checks: [
      {
        checkNo: "210091",
        checkAmount: 11.55,
        checkDate: "061025",
      },
      {
        checkNo: "210092",
        checkAmount: 24.5,
        checkDate: "061025",
      },
    ],
  };

  beforeEach(async () => {
    const mockInterface = {
      getPaymentHistory: jest.fn(),
      getLastPaymentInfo: jest.fn(),
      getVoucherDetails: jest.fn(),
      validateCheckInquiryHistory: jest.fn(),
      processMultipleChecks: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessMultipleChecksUseCase,
        {
          provide: "CheckInquiryInterface",
          useValue: mockInterface,
        },
      ],
    }).compile();

    useCase = module.get<ProcessMultipleChecksUseCase>(
      ProcessMultipleChecksUseCase
    );
    mockCheckInquiryInterface = module.get("CheckInquiryInterface");
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  describe("execute", () => {
    it("should process multiple checks successfully when all updates succeed", async () => {
      const mockDomainResults: ProcessMultipleChecksResult[] = [
        {
          checkNo: "210091",
          checkAmount: 11.55,
          checkDate: "061025",
          message: "Check processed successfully",
        },
        {
          checkNo: "210092",
          checkAmount: 24.5,
          checkDate: "061025",
          message: "Check processed successfully",
        },
      ];

      mockCheckInquiryInterface.processMultipleChecks.mockResolvedValue(
        mockDomainResults
      );

      const result = await useCase.execute(mockProcessData);

      expect(result.totalProcessed).toBe(2);
      expect(result.successful).toBe(2);
      expect(result.failed).toBe(0);
      expect(result.results).toHaveLength(2);
      expect(result.results[0]?.message).toBe("Check processed successfully");
      expect(result.results[1]?.message).toBe("Check processed successfully");
      expect(
        mockCheckInquiryInterface.processMultipleChecks
      ).toHaveBeenCalledWith([
        {
          checkNo: "210091",
          checkAmount: 11.55,
          checkDate: "061025",
        },
        {
          checkNo: "210092",
          checkAmount: 24.5,
          checkDate: "061025",
        },
      ]);
    });

    it("should handle mixed success and failure results from database updates", async () => {
      const mockDomainResults: ProcessMultipleChecksResult[] = [
        {
          checkNo: "210091",
          checkAmount: 11.55,
          checkDate: "061025",
          message: "Check processed successfully",
        },
        {
          checkNo: "210092",
          checkAmount: 24.5,
          checkDate: "061025",
          message: "No records were updated",
          errors: [
            {
              field: "checkNo",
              message: "No records found to update",
              code: "UPDATE_FAILED",
            },
          ],
        },
      ];

      mockCheckInquiryInterface.processMultipleChecks.mockResolvedValue(
        mockDomainResults
      );

      const result = await useCase.execute(mockProcessData);

      expect(result.totalProcessed).toBe(2);
      expect(result.successful).toBe(1);
      expect(result.failed).toBe(1);
      expect(result.results[0]?.message).toBe("Check processed successfully");
      expect(result.results[1]?.message).toBe("No records were updated");
      expect(result.results[1]?.errors).toHaveLength(1);
      expect(result.results[1]?.errors![0]?.code).toBe("UPDATE_FAILED");
    });

    it("should handle all checks failing due to database update issues", async () => {
      const mockDomainResults: ProcessMultipleChecksResult[] = [
        {
          checkNo: "210091",
          checkAmount: 11.55,
          checkDate: "061025",
          message: "No records were updated",
          errors: [
            {
              field: "checkNo",
              message: "No records found to update",
              code: "UPDATE_FAILED",
            },
          ],
        },
        {
          checkNo: "210092",
          checkAmount: 24.5,
          checkDate: "061025",
          message: "No records were updated",
          errors: [
            {
              field: "checkNo",
              message: "No records found to update",
              code: "UPDATE_FAILED",
            },
          ],
        },
      ];

      mockCheckInquiryInterface.processMultipleChecks.mockResolvedValue(
        mockDomainResults
      );

      const result = await useCase.execute(mockProcessData);

      expect(result.totalProcessed).toBe(2);
      expect(result.successful).toBe(0);
      expect(result.failed).toBe(2);
      expect(result.results[0]?.message).toBe("No records were updated");
      expect(result.results[1]?.message).toBe("No records were updated");
    });

    it("should handle domain service errors gracefully", async () => {
      mockCheckInquiryInterface.processMultipleChecks.mockRejectedValue(
        new Error("Database connection failed")
      );

      await expect(useCase.execute(mockProcessData)).rejects.toThrow(
        "Processing failed: Database connection failed"
      );
    });

    it("should handle empty checks array", async () => {
      const emptyData: ProcessMultipleChecksDto = { checks: [] };

      // This should be caught by validation decorators, but testing the use case logic
      const mockDomainResults: ProcessMultipleChecksResult[] = [];

      mockCheckInquiryInterface.processMultipleChecks.mockResolvedValue(
        mockDomainResults
      );

      const result = await useCase.execute(emptyData);

      expect(result.totalProcessed).toBe(0);
      expect(result.successful).toBe(0);
      expect(result.failed).toBe(0);
      expect(result.results).toHaveLength(0);
    });

    it("should handle single check processing", async () => {
      const singleCheckData: ProcessMultipleChecksDto = {
        checks: [
          {
            checkNo: "210091",
            checkAmount: 11.55,
            checkDate: "061025",
          },
        ],
      };

      const mockDomainResults: ProcessMultipleChecksResult[] = [
        {
          checkNo: "210091",
          checkAmount: 11.55,
          checkDate: "061025",
          message: "Check processed successfully",
        },
      ];

      mockCheckInquiryInterface.processMultipleChecks.mockResolvedValue(
        mockDomainResults
      );

      const result = await useCase.execute(singleCheckData);

      expect(result.totalProcessed).toBe(1);
      expect(result.successful).toBe(1);
      expect(result.failed).toBe(0);
      expect(result.results).toHaveLength(1);
      expect(result.results[0]?.message).toBe("Check processed successfully");
    });
  });
});
