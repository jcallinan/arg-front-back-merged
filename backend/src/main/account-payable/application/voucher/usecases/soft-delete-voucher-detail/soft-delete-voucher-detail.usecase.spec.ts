import { Test, TestingModule } from "@nestjs/testing";
import { SoftDeleteVoucherDetailUseCase } from "./soft-delete-voucher-detail.usecase";
import { VoucherAppService } from "@src/main/account-payable/domain/services/voucher/voucher.service";
import { SoftDeleteVoucherDetailDto } from "../../dto/voucher.dto";

describe("SoftDeleteVoucherDetailUseCase", () => {
  let useCase: SoftDeleteVoucherDetailUseCase;
  let voucherAppService: jest.Mocked<VoucherAppService>;

  const mockVoucherAppService = {
    softDeleteVoucherDetail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SoftDeleteVoucherDetailUseCase,
        {
          provide: VoucherAppService,
          useValue: mockVoucherAppService,
        },
      ],
    }).compile();

    useCase = module.get<SoftDeleteVoucherDetailUseCase>(SoftDeleteVoucherDetailUseCase);
    voucherAppService = module.get(VoucherAppService);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  describe("execute", () => {
    const mockDto: SoftDeleteVoucherDetailDto = {
      companyNo: 10,
      vendorNo: 1001,
      entryNo: 12345,
      entrySequenceNo: 1,
    };

    it("should successfully soft delete voucher detail", async () => {
      const expectedResult = { success: true, message: "Voucher detail soft deleted successfully" };
      voucherAppService.softDeleteVoucherDetail.mockResolvedValue(expectedResult);

      const result = await useCase.execute(mockDto);

      expect(result).toEqual(expectedResult);
      expect(voucherAppService.softDeleteVoucherDetail).toHaveBeenCalledWith(
        mockDto.companyNo,
        mockDto.vendorNo,
        mockDto.entryNo,
        mockDto.entrySequenceNo
      );
    });

    it("should call service with correct parameters", async () => {
      const expectedResult = { success: true };
      voucherAppService.softDeleteVoucherDetail.mockResolvedValue(expectedResult);

      await useCase.execute(mockDto);

      expect(voucherAppService.softDeleteVoucherDetail).toHaveBeenCalledWith(
        10, // companyNo
        1001, // vendorNo
        12345, // entryNo
        1 // entrySequenceNo
      );
    });

    it("should handle service errors", async () => {
      const error = new Error("Database connection failed");
      voucherAppService.softDeleteVoucherDetail.mockRejectedValue(error);

      await expect(useCase.execute(mockDto)).rejects.toThrow("Database connection failed");
      expect(voucherAppService.softDeleteVoucherDetail).toHaveBeenCalledWith(
        mockDto.companyNo,
        mockDto.vendorNo,
        mockDto.entryNo,
        mockDto.entrySequenceNo
      );
    });

    it("should handle different company numbers", async () => {
      const dtoWithDifferentCompany: SoftDeleteVoucherDetailDto = {
        companyNo: 20,
        vendorNo: 2001,
        entryNo: 54321,
        entrySequenceNo: 2,
      };

      const expectedResult = { success: true };
      voucherAppService.softDeleteVoucherDetail.mockResolvedValue(expectedResult);

      await useCase.execute(dtoWithDifferentCompany);

      expect(voucherAppService.softDeleteVoucherDetail).toHaveBeenCalledWith(
        20, // companyNo
        2001, // vendorNo
        54321, // entryNo
        2 // entrySequenceNo
      );
    });

    it("should handle zero values", async () => {
      const dtoWithZeros: SoftDeleteVoucherDetailDto = {
        companyNo: 0,
        vendorNo: 0,
        entryNo: 0,
        entrySequenceNo: 0,
      };

      const expectedResult = { success: true };
      voucherAppService.softDeleteVoucherDetail.mockResolvedValue(expectedResult);

      await useCase.execute(dtoWithZeros);

      expect(voucherAppService.softDeleteVoucherDetail).toHaveBeenCalledWith(
        0, // companyNo
        0, // vendorNo
        0, // entryNo
        0 // entrySequenceNo
      );
    });

    it("should handle large numbers", async () => {
      const dtoWithLargeNumbers: SoftDeleteVoucherDetailDto = {
        companyNo: 999999,
        vendorNo: 999999,
        entryNo: 999999,
        entrySequenceNo: 999999,
      };

      const expectedResult = { success: true };
      voucherAppService.softDeleteVoucherDetail.mockResolvedValue(expectedResult);

      await useCase.execute(dtoWithLargeNumbers);

      expect(voucherAppService.softDeleteVoucherDetail).toHaveBeenCalledWith(
        999999, // companyNo
        999999, // vendorNo
        999999, // entryNo
        999999 // entrySequenceNo
      );
    });
  });
});
