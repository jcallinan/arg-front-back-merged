import { ApCheckReportsUsecase } from "./ap-check-reports.usecase";
import { PurchaseJournalService } from "@src/main/account-payable/domain/services/purchase-journal/purchase-journal.service";
import { PAYMENT_VOUCHER_TYPES, PAYMENT_REPORT_TYPES   } from "@src/shared/constants/payment-constant";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import { SpooledMetaDataReportEntity } from "@src/main/account-payable/domain/entities/spooled-meta-data-report.entity";

describe("ApCheckReportsUsecase", () => {
  let usecase: ApCheckReportsUsecase;
  let purchaseJournalService: jest.Mocked<PurchaseJournalService>;

  const mockPaginatedResponse: PaginatedResponse<SpooledMetaDataReportEntity> =
    {
      items: [
        {
          reportType: PAYMENT_REPORT_TYPES.AP_Check_Printing,
          spoolFileName: "check-print.pdf",
          pdfFileName: "check-print.pdf",
          reportDateTime: new Date("2025-07-25T10:35:44.835Z"),
          filePath: "/files/check-print.pdf",
          jobName: "CHECKJOB",
          jobNumber: 12345,
          jobUser: "QSYSOPR",
          jobSystemName: "AS400",
          outputQueueName: "CHKQ",
          outputQueueLibrary: "CHKLIB",
          formType: "STD",
          error: "",
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
      SpooledMetadataReports: jest
        .fn()
        .mockResolvedValue(mockPaginatedResponse),
    } as any;

    usecase = new ApCheckReportsUsecase(purchaseJournalService);
  });

  it("should fetch AP Check reports for voucher type = CHECK", async () => {
    const dto = {
      voucherToPay: PAYMENT_VOUCHER_TYPES.CHECK,
      reportType: [
        PAYMENT_REPORT_TYPES.AP_Check_Printing,
        PAYMENT_REPORT_TYPES.AP_Check_Copies_Creation,
      ],
    };

    const result = await usecase.execute(dto);

    expect(purchaseJournalService.SpooledMetadataReports).toHaveBeenCalledWith({
      ...dto,
      reportType: [
        PAYMENT_REPORT_TYPES.AP_Check_Printing,
        PAYMENT_REPORT_TYPES.AP_Check_Copies_Creation,
      ],
    });
    expect(result).toEqual(mockPaginatedResponse);
  });

  it("should bubble up errors from PurchaseJournalService", async () => {
    (
      purchaseJournalService.SpooledMetadataReports as jest.Mock
    ).mockRejectedValueOnce(new Error("AS400 failure"));

    const dto = {
      voucherToPay: PAYMENT_VOUCHER_TYPES.WIRE,
      reportType: [PAYMENT_REPORT_TYPES.AP_Check_Printing],
    };

    await expect(usecase.execute(dto)).rejects.toThrow("AS400 failure");
  });
});
