import { CashRequirementReportsUsecase } from "./cash-requirement-reports.usecase";
import { PurchaseJournalService } from "@src/main/account-payable/domain/services/purchase-journal/purchase-journal.service";
import { PAYMENT_REPORT_TYPES } from "@src/shared/constants/constant";
import { PAYMENT_VOUCHER_TYPES } from "@src/shared/constants/payment-constant";
import { GetCashRequirementReportDto } from "../../dto/payment.dto";

describe("CashRequirementReportsUsecase", () => {
  let usecase: CashRequirementReportsUsecase;
  let purchaseJournalService: jest.Mocked<PurchaseJournalService>;

  const mockReports = {
    items: [
      {
        reportType: PAYMENT_REPORT_TYPES.AP_Cash_Requirement,
        fileName: "cash-req.pdf",
        reportDateTime: "2025-08-19T10:35:44.835Z",
        filePath: "/files/cash-req.pdf",
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
    } as any;

    usecase = new CashRequirementReportsUsecase(purchaseJournalService);
  });

  it("should include only Cash Requirement for CHECK", async () => {
    const dto: GetCashRequirementReportDto = {
      voucherToPay: PAYMENT_VOUCHER_TYPES.CHECK,
      reportType: [],
    };

    const result = await usecase.execute(dto);

    expect(purchaseJournalService.SpooledMetadataReports).toHaveBeenCalledWith({
      ...dto,
      reportType: [PAYMENT_REPORT_TYPES.AP_Cash_Requirement],
    });
    expect(result).toEqual(mockReports);
  });

  it("should include only Cash Requirement for WIRE", async () => {
    const dto: GetCashRequirementReportDto = {
      voucherToPay: PAYMENT_VOUCHER_TYPES.WIRE,
      reportType: [],
    };

    const result = await usecase.execute(dto);

    expect(purchaseJournalService.SpooledMetadataReports).toHaveBeenCalledWith({
      ...dto,
      reportType: [PAYMENT_REPORT_TYPES.AP_Cash_Requirement],
    });
    expect(result).toEqual(mockReports);
  });

  it("should include Cash Requirement and Nacha ACH Creation for ACH", async () => {
    const dto: GetCashRequirementReportDto = {
      voucherToPay: PAYMENT_VOUCHER_TYPES.ACH,
      reportType: [],
    };

    const result = await usecase.execute(dto);

    expect(purchaseJournalService.SpooledMetadataReports).toHaveBeenCalledWith({
      ...dto,
      reportType: [
        PAYMENT_REPORT_TYPES.AP_Cash_Requirement,
        PAYMENT_REPORT_TYPES.AP_Nacha_ACH_Creation,
      ],
    });
    expect(result).toEqual(mockReports);
  });
});
