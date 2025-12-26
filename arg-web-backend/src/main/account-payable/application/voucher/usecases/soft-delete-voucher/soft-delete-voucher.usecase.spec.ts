import { Test, TestingModule } from "@nestjs/testing";
import { SoftDeleteVoucherUseCase } from "./soft-delete-voucher.usecase";
import { VoucherAppService } from "@src/main/account-payable/domain/services/voucher/voucher.service";
import { SoftDeleteVoucherDto } from "../../dto/voucher.dto";

describe("SoftDeleteVoucherUseCase", () => {
  let useCase: SoftDeleteVoucherUseCase;
  let voucherService: jest.Mocked<VoucherAppService>;

  const mockDeleteResult = {
    success: true,
    message: "Voucher deleted successfully",
  };

  beforeEach(async () => {
    const mockVoucherService = {
      softDeleteVoucher: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SoftDeleteVoucherUseCase,
        {
          provide: VoucherAppService,
          useValue: mockVoucherService,
        },
      ],
    }).compile();

    useCase = module.get<SoftDeleteVoucherUseCase>(SoftDeleteVoucherUseCase);
    voucherService = module.get(VoucherAppService);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  describe("execute", () => {
    const dto: SoftDeleteVoucherDto = {
      entryNo: 123,
      companyNo: 1,
      vendorNo: 1001,
      invoiceNo: "INV123",
    };

    it("should soft delete voucher successfully", async () => {
      voucherService.softDeleteVoucher.mockResolvedValue(mockDeleteResult);

      const result = await useCase.execute(dto);

      expect(result).toEqual(mockDeleteResult);
      expect(voucherService.softDeleteVoucher).toHaveBeenCalledWith(
        dto.entryNo,
        dto.companyNo,
        dto.vendorNo,
        dto.invoiceNo
      );
    });

    it("should throw InternalServerErrorException when service fails", async () => {
      const error = new Error("Service error");
      voucherService.softDeleteVoucher.mockRejectedValue(error);

      await expect(useCase.execute(dto)).rejects.toThrow(Error);
      expect(voucherService.softDeleteVoucher).toHaveBeenCalledWith(
        dto.entryNo,
        dto.companyNo,
        dto.vendorNo,
        dto.invoiceNo
      );
    });
  });
});
