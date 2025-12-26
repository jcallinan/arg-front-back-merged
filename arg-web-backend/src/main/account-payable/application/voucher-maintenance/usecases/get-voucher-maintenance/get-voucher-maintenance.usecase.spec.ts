import { Test, TestingModule } from "@nestjs/testing";
import { GetVoucherMaintenanceUseCase } from "./get-voucher-maintenance.usecase";
import { VoucherMaintenanceInterface } from "@src/main/account-payable/domain/interface/voucher-maintenance.interface";

describe("GetVoucherMaintenanceUseCase", () => {
  let useCase: GetVoucherMaintenanceUseCase;
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
        GetVoucherMaintenanceUseCase,
        { provide: "VoucherMaintenanceInterface", useValue: mockRepo },
      ],
    }).compile();

    useCase = module.get(GetVoucherMaintenanceUseCase);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should call repository with pagination and filters", async () => {
    const dto: any = { page: 2, limit: 10, companyNo: 10, vendorNo: 1 };
    const repoResponse: any = { rows: [{ voucherNo: 1 } as any], count: 11 };
    mockRepo.findVouchers.mockResolvedValue(repoResponse);

    const result = await useCase.execute(dto);
    expect(result).toEqual(repoResponse);
    expect(mockRepo.findVouchers).toHaveBeenCalledWith(
      10,
      1,
      undefined,
      undefined,
      undefined,
      10,
      10,
      undefined,
      undefined
    );
  });
});
