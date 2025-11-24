import { Test, TestingModule } from "@nestjs/testing";
import { SubmitVoucherUseCase } from "./submit-voucher.usecase";
import { VoucherAppService } from "@src/main/account-payable/domain/services/voucher/voucher.service";
import { VoucherDetailValidationService } from "../../shared-services/voucher-detail.shared.service";
import { VoucherSharedService } from "../../shared-services/voucher.shared.service";

describe("SubmitVoucherUseCase", () => {
  let useCase: SubmitVoucherUseCase;
  // Services are mocked but not used in basic test setup

  beforeEach(async () => {
    const mockVoucherAppService = {
      // Add methods as needed
    };

    const mockVoucherDetailValidationService = {
      validateDetail: jest.fn(),
    };

    const mockVoucherSharedService = {
      headerValidation: jest.fn(),
      buildVoucherHeaderData: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubmitVoucherUseCase,
        {
          provide: VoucherAppService,
          useValue: mockVoucherAppService,
        },
        {
          provide: VoucherDetailValidationService,
          useValue: mockVoucherDetailValidationService,
        },
        {
          provide: VoucherSharedService,
          useValue: mockVoucherSharedService,
        },
      ],
    }).compile();

    useCase = module.get<SubmitVoucherUseCase>(SubmitVoucherUseCase);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  describe("execute", () => {
    it("should be defined", () => {
      expect(useCase).toBeDefined();
    });

    it("should have execute method", () => {
      expect(useCase.execute).toBeDefined();
    });
  });
});
