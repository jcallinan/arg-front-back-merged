import { Test, TestingModule } from "@nestjs/testing";
import { UpdateVoucherMaintenanceStatusUseCase } from "./update-voucher-status.usecase";
import { VoucherMaintenanceInterface } from "@src/main/account-payable/domain/interface/voucher-maintenance.interface";
import { VoucherMaintenanceStatusCode } from "@src/shared/constants/voucher-type.enum";
import { HttpException } from "@nestjs/common";

describe("UpdateVoucherMaintenanceStatusUseCase", () => {
  let useCase: UpdateVoucherMaintenanceStatusUseCase;
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
        UpdateVoucherMaintenanceStatusUseCase,
        { provide: "VoucherMaintenanceInterface", useValue: mockRepo },
      ],
    }).compile();

    useCase = module.get(UpdateVoucherMaintenanceStatusUseCase);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should return mapped response when repo updates", async () => {
    const dto: any = {
      companyNo: 10,
      vendorNo: 1,
      voucherNo: 2,
      statusCode: VoucherMaintenanceStatusCode.HOLD,
      statusDescription: "Hold",
    };
    const repoResult = {
      companyNo: 10,
      vendorNo: 1,
      voucherNo: 2,
      statusCode: VoucherMaintenanceStatusCode.HOLD,
      statusDescription: "Hold",
      updatedAt: new Date().toISOString(),
    };
    mockRepo.updateVoucherStatus.mockResolvedValue(repoResult);

    const result = await useCase.execute(dto);
    expect(result).toEqual({
      message: "Voucher status updated successfully",
      voucher: repoResult,
    });
    expect(mockRepo.updateVoucherStatus).toHaveBeenCalledWith(
      10,
      1,
      2,
      VoucherMaintenanceStatusCode.HOLD,
      "Hold"
    );
  });

  it("should throw HttpException when repo returns null", async () => {
    const dto: any = {
      companyNo: 10,
      vendorNo: 1,
      voucherNo: 2,
      statusCode: VoucherMaintenanceStatusCode.HOLD,
      statusDescription: "Hold",
    };
    mockRepo.updateVoucherStatus.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toBeInstanceOf(HttpException);
  });
});
