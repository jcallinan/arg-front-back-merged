import { Test, TestingModule } from "@nestjs/testing";
import { getVoucherMaintenanceViewUseCase } from "./get-voucher-view.usecase";
import { VoucherMaintenanceInterface } from "@src/main/account-payable/domain/interface/voucher-maintenance.interface";
import { VoucherType } from "@src/shared/constants/voucher-type.enum";
import { HttpException } from "@nestjs/common";

describe("getVoucherMaintenanceViewUseCase", () => {
  let useCase: getVoucherMaintenanceViewUseCase;
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
        getVoucherMaintenanceViewUseCase,
        { provide: "VoucherMaintenanceInterface", useValue: mockRepo },
      ],
    }).compile();

    useCase = module.get(getVoucherMaintenanceViewUseCase);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should return result when repository returns data", async () => {
    const dto: any = {
      voucherType: VoucherType.UNPAID,
      companyNo: 10,
      vendorNo: 1,
      voucherNo: 2,
    };
    const repoResult = {
      headerItems: { voucherNo: 2 },
      detailItems: [],
    } as any;
    mockRepo.findVoucherView.mockResolvedValue(repoResult);

    const result = await useCase.execute(dto);
    expect(result).toEqual(repoResult);
    expect(mockRepo.findVoucherView).toHaveBeenCalledWith(
      VoucherType.UNPAID,
      10,
      1,
      2
    );
  });

  it("should throw HttpException when repository returns null", async () => {
    const dto: any = {
      voucherType: VoucherType.PAID,
      companyNo: 10,
      vendorNo: 1,
      voucherNo: 2,
    };
    mockRepo.findVoucherView.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toBeInstanceOf(HttpException);
  });
});
