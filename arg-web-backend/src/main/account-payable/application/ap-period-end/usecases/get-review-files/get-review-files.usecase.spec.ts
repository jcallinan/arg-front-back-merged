import { GetReviewFilesUsecase } from "./get-review-files.usecase";
import { PurchaseJournalService } from "@src/main/account-payable/domain/services/purchase-journal/purchase-journal.service";
import { GetYearEndProcessMenuReviewFilesDto } from "../../dto/ap-period-end.dto";
import { AP_REPORT_TYPES } from "@src/shared/constants/constant";

describe("GetReviewFilesUsecase", () => {
  let usecase: GetReviewFilesUsecase;
  let purchaseJournalService: jest.Mocked<PurchaseJournalService>;

  const mockReports = {
    items: [
      {
        reportType: "sample-report-type",
        fileName: "my-report.pdf",
        reportDateTime: "2025-07-25T10:35:44.835Z",
        filePath: "/files/my-report.pdf",
      },
    ],
    pagination: {
      total_items: 1,
      current_page: 1,
      items_per_page: 10,
      total_pages: 1,
    },
  };

  beforeEach(() => {
    purchaseJournalService = {
      SpooledMetadataReports: jest.fn().mockResolvedValue(mockReports),
    } as jest.Mocked<PurchaseJournalService>;

    usecase = new GetReviewFilesUsecase(purchaseJournalService);
  });

  it("should fetch review files for given company and reportType", async () => {
    const dto: GetYearEndProcessMenuReviewFilesDto = {
      companyNo: 10,
      reportType: [AP_REPORT_TYPES.Printing_1099_File],
    };

    const result = await usecase.execute(dto);

    expect(purchaseJournalService.SpooledMetadataReports).toHaveBeenCalledWith(
      dto
    );
    expect(result).toEqual(mockReports);
  });

  it("should propagate errors from purchaseJournalService", async () => {
    const dto: GetYearEndProcessMenuReviewFilesDto = {
      companyNo: 10,
      reportType: [AP_REPORT_TYPES.Printing_1099_File],
    };

    purchaseJournalService.SpooledMetadataReports.mockRejectedValueOnce(
      new Error("DB error")
    );

    await expect(usecase.execute(dto)).rejects.toThrow("DB error");
  });
});
