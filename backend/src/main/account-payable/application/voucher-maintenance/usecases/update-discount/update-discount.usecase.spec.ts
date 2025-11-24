import { Test, TestingModule } from "@nestjs/testing";
import { UpdateDiscountUseCase } from "./update-discount.usecase";
import { VoucherMaintenanceInterface } from "@src/main/account-payable/domain/interface/voucher-maintenance.interface";
import { HttpException } from "@nestjs/common";

describe("UpdateDiscountUseCase", () => {
  let useCase: UpdateDiscountUseCase;
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
        UpdateDiscountUseCase,
        { provide: "VoucherMaintenanceInterface", useValue: mockRepo },
      ],
    }).compile();

    useCase = module.get(UpdateDiscountUseCase);
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
      discountDueDate: "011524",
      discount: 10,
    };
    const repoResult = {
      companyNo: 10,
      vendorNo: 1,
      voucherNo: 2,
      discountDueDate: "011524",
      discount: 10,
      updatedAt: new Date().toISOString(),
    };
    mockRepo.updateDiscount.mockResolvedValue(repoResult);

    const result = await useCase.execute(dto);
    expect(result).toEqual({
      message: "Discount information updated successfully",
      voucher: repoResult,
    });
    expect(mockRepo.updateDiscount).toHaveBeenCalledWith(
      10,
      1,
      2,
      "011524",
      10
    );
  });

  it("should throw HttpException when repo returns null", async () => {
    const dto: any = {
      companyNo: 10,
      vendorNo: 1,
      voucherNo: 2,
      discountDueDate: "011524",
      discount: 10,
    };
    mockRepo.updateDiscount.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toBeInstanceOf(HttpException);
  });
});
