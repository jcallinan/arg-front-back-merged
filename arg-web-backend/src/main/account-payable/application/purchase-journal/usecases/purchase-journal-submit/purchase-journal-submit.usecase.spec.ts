import { Test, TestingModule } from "@nestjs/testing";
import { PurchaseJournalSubmitUseCase } from "./purchase-journal-submit.usecase";
import { PurchaseJournalService } from "@src/main/account-payable/domain/services/purchase-journal/purchase-journal.service";
import { SubmitPurchaseJournalDto } from "../../dto/purchase-journal.dto";

describe("PurchaseJournalSubmitUseCase", () => {
  let useCase: PurchaseJournalSubmitUseCase;
  let mockPurchaseJournalService: {
    submitPurchaseJournal: jest.Mock;
  };

  beforeEach(async () => {
    mockPurchaseJournalService = {
      submitPurchaseJournal: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseJournalSubmitUseCase,
        {
          provide: PurchaseJournalService,
          useValue: mockPurchaseJournalService,
        },
      ],
    }).compile();

    useCase = module.get<PurchaseJournalSubmitUseCase>(
      PurchaseJournalSubmitUseCase
    );
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  describe("execute", () => {
    it("should submit purchase journal successfully", async () => {
      const dto: SubmitPurchaseJournalDto = {
        entries: [
          {
            invoiceNo: "123456",
            companyNo: 10,
            vendorNo: 1001,
            entryNo: 19042,
          },
        ],
        companyNo: 10,
        purchaseJD: "070725",
        keyCashDJD: "000000",
      };

      const mockResult = {
        message: "Purchase journal submitted successfully",
        spResult: { jrnVar: "PJ01", errVar: null },
        processedEntries: [],
      };

      mockPurchaseJournalService.submitPurchaseJournal.mockResolvedValue(
        mockResult
      );

      const result = await useCase.execute(dto);

      expect(result).toEqual(mockResult);
      expect(
        mockPurchaseJournalService.submitPurchaseJournal
      ).toHaveBeenCalledWith(dto);
    });

    it("should handle multiple entries submission", async () => {
      const dto: SubmitPurchaseJournalDto = {
        entries: [
          {
            invoiceNo: "123456",
            companyNo: 10,
            vendorNo: 1001,
            entryNo: 19042,
          },
          {
            invoiceNo: "789012",
            companyNo: 10,
            vendorNo: 1002,
            entryNo: 19043,
          },
          {
            invoiceNo: "345678",
            companyNo: 10,
            vendorNo: 1003,
            entryNo: 19044,
          },
        ],
        companyNo: 10,
        purchaseJD: "070725",
        keyCashDJD: "000000",
      };

      const mockResult = {
        message: "Purchase journal submitted successfully",
        spResult: { jrnVar: "PJ02", errVar: null },
        processedEntries: [],
      };

      mockPurchaseJournalService.submitPurchaseJournal.mockResolvedValue(
        mockResult
      );

      const result = await useCase.execute(dto);

      expect(result).toEqual(mockResult);
      expect(
        mockPurchaseJournalService.submitPurchaseJournal
      ).toHaveBeenCalledWith(dto);
    });

    it("should handle service errors", async () => {
      const dto: SubmitPurchaseJournalDto = {
        entries: [
          {
            invoiceNo: "123456",
            companyNo: 10,
            vendorNo: 1001,
            entryNo: 19042,
          },
        ],
        companyNo: 10,
        purchaseJD: "070725",
        keyCashDJD: "000000",
      };

      const error = new Error("Invalid vendor number");
      mockPurchaseJournalService.submitPurchaseJournal.mockRejectedValue(error);

      await expect(useCase.execute(dto)).rejects.toThrow(
        "Invalid vendor number"
      );
      expect(
        mockPurchaseJournalService.submitPurchaseJournal
      ).toHaveBeenCalledWith(dto);
    });

    it("should handle stored procedure success scenario", async () => {
      const dto: SubmitPurchaseJournalDto = {
        entries: [
          {
            invoiceNo: "123456",
            companyNo: 10,
            vendorNo: 1001,
            entryNo: 19042,
          },
        ],
        companyNo: 10,
        purchaseJD: "070725",
        keyCashDJD: "000000",
      };

      const mockResult = {
        message: "Purchase journal submitted successfully",
        spResult: { jrnVar: "PJ01", errVar: null },
        processedEntries: [],
      };

      mockPurchaseJournalService.submitPurchaseJournal.mockResolvedValue(
        mockResult
      );

      const result = await useCase.execute(dto);

      expect(result).toEqual(mockResult);
      expect(
        mockPurchaseJournalService.submitPurchaseJournal
      ).toHaveBeenCalledWith(dto);
    });

    it("should handle stored procedure error scenario", async () => {
      const dto: SubmitPurchaseJournalDto = {
        entries: [
          {
            invoiceNo: "123456",
            companyNo: 10,
            vendorNo: 1001,
            entryNo: 19042,
          },
        ],
        companyNo: 10,
        purchaseJD: "070725",
        keyCashDJD: "000000",
      };

      const mockResult = {
        message: "Purchase journal submitted successfully",
        spResult: { jrnVar: null, errVar: "Database connection failed" },
        processedEntries: [],
      };

      mockPurchaseJournalService.submitPurchaseJournal.mockResolvedValue(
        mockResult
      );

      const result = await useCase.execute(dto);

      expect(result).toEqual(mockResult);
      expect(
        mockPurchaseJournalService.submitPurchaseJournal
      ).toHaveBeenCalledWith(dto);
    });

    it("should handle stored procedure execution failure", async () => {
      const dto: SubmitPurchaseJournalDto = {
        entries: [
          {
            invoiceNo: "123456",
            companyNo: 10,
            vendorNo: 1001,
            entryNo: 19042,
          },
        ],
        companyNo: 10,
        purchaseJD: "070725",
        keyCashDJD: "000000",
      };

      const error = new Error("Stored procedure execution failed");
      mockPurchaseJournalService.submitPurchaseJournal.mockRejectedValue(error);

      await expect(useCase.execute(dto)).rejects.toThrow(
        "Stored procedure execution failed"
      );
      expect(
        mockPurchaseJournalService.submitPurchaseJournal
      ).toHaveBeenCalledWith(dto);
    });
  });
});
