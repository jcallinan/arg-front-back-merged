import { Test, TestingModule } from "@nestjs/testing";
import { GetVoucherSummaryMaintenanceUseCase } from "./get-voucher-summary.usecase";
import { VoucherMaintenanceInterface } from "@src/main/account-payable/domain/interface/voucher-maintenance.interface";
import { VoucherType } from "@src/shared/constants/voucher-type.enum";

describe("GetVoucherSummaryMaintenanceUseCase", () => {
  let useCase: GetVoucherSummaryMaintenanceUseCase;
  const mockRepo: jest.Mocked<VoucherMaintenanceInterface> = {
    findVouchers: jest.fn(),
    findVoucherSummary: jest.fn(),
    findVoucherView: jest.fn(),
    updateVoucherStatus: jest.fn(),
    updateDiscount: jest.fn(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetVoucherSummaryMaintenanceUseCase,
        { provide: "VoucherMaintenanceInterface", useValue: mockRepo },
      ],
    }).compile();

    useCase = module.get(GetVoucherSummaryMaintenanceUseCase);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should return mapped summary from repository", async () => {
    const dto: any = {
      companyNo: 10,
      vendorNo: 100,
      voucherType: VoucherType.ALL,
    };
    const repoData = [
      {
        vendorName: "V1",
        companyNo: 10,
        vendorNo: 100,
        lastPaidAmount: 0,
        lastPaidDate: null,
        openPayables: 0,
        openPayablesDate: null,
        type: VoucherType.ALL,
      },
    ];
    mockRepo.findVoucherSummary.mockResolvedValue(repoData as any);

    const result = await useCase.execute(dto);
    expect(result).toEqual([{ ...repoData[0], openPayablesDate: undefined }]);
    expect(mockRepo.findVoucherSummary).toHaveBeenCalledWith(
      10,
      100,
      VoucherType.ALL
    );
  });
});
