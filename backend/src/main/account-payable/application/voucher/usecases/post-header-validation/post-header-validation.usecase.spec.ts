import { Test, TestingModule } from "@nestjs/testing";
import { VoucherHeaderValidationUseCase } from "./post-header-validation.usecase";
import { VoucherSharedService } from "../../shared-services/voucher.shared.service";
import { HeaderDto } from "../../dto/voucher.dto";
import { PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";

describe("VoucherHeaderValidationUseCase", () => {
  let useCase: VoucherHeaderValidationUseCase;
  let voucherSharedService: jest.Mocked<VoucherSharedService>;

  const mockValidationResult = {
    newDueDate: 20240131,
    newDiscountDueDate: 20240115,
    foundVendor: {
      vendorNo: 1001,
      vendorName: "Test Vendor",
    } as any,
  };

  beforeEach(async () => {
    const mockVoucherSharedService = {
      headerValidation: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoucherHeaderValidationUseCase,
        {
          provide: VoucherSharedService,
          useValue: mockVoucherSharedService,
        },
      ],
    }).compile();

    useCase = module.get<VoucherHeaderValidationUseCase>(
      VoucherHeaderValidationUseCase
    );
    voucherSharedService = module.get(VoucherSharedService);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  describe("execute", () => {
    const headerDto: HeaderDto = {
      companyNo: 1,
      entryNo: 123,
      vendorNo: 1001,
      apGlNo: 12010001,
      bankGl: 10010001,
      processType: PROCESS_TYPE_ENUM.NORMAL,
      invoiceDate: "20240101",
      invoiceNo: "INV123",
      invoiceAmount: 100.0,
      entrySequence: 1,
      vendorName: "Test Vendor",
    };

    it("should validate header successfully", async () => {
      voucherSharedService.headerValidation.mockResolvedValue(
        mockValidationResult
      );

      const result = await useCase.execute(headerDto);

      expect(result).toEqual({ items: mockValidationResult });
      expect(voucherSharedService.headerValidation).toHaveBeenCalledWith(
        headerDto
      );
    });

    it("should throw Error when service fails", async () => {
      const error = new Error("Service error");
      voucherSharedService.headerValidation.mockRejectedValue(error);

      await expect(useCase.execute(headerDto)).rejects.toThrow(Error);
      expect(voucherSharedService.headerValidation).toHaveBeenCalledWith(
        headerDto
      );
    });

    it("should handle validation errors with array of errors", async () => {
      const validationErrors = [
        {
          field: "invoiceAmount",
          code: "INVALID_AMOUNT",
          message: "Amount must be positive",
        },
        {
          field: "invoiceDate",
          code: "INVALID_DATE",
          message: "Invalid date format",
        },
      ];

      voucherSharedService.headerValidation.mockResolvedValue(validationErrors);

      await expect(useCase.execute(headerDto)).rejects.toThrow();
      expect(voucherSharedService.headerValidation).toHaveBeenCalledWith(
        headerDto
      );
    });

    it("should handle processor errors", async () => {
      const processorErrors = {
        errors: [
          {
            field: "processType",
            code: "INVALID_PROCESS_TYPE",
            message: "Invalid process type",
          },
        ],
        data: {
          newDueDate: 0,
          newDiscountDueDate: 0,
          foundVendor: null,
        },
      };

      voucherSharedService.headerValidation.mockResolvedValue(processorErrors);

      await expect(useCase.execute(headerDto)).rejects.toThrow();
      expect(voucherSharedService.headerValidation).toHaveBeenCalledWith(
        headerDto
      );
    });
  });
});
