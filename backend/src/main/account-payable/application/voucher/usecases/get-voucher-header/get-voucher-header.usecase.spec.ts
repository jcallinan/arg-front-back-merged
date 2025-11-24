import { Test, TestingModule } from "@nestjs/testing";
import { GetVoucherHeaderUseCase } from "./get-voucher-header.usecase";
import { GetVoucherDataDto } from "../../dto/voucher.dto";
import { VoucherSharedService } from "../../shared-services/voucher.shared.service";
import { GlMasterService } from "@src/main/account-payable/domain/services/gl-master/gl-master.service";
import { INVOICE_TYPE } from "@src/shared/constants/constant";
import { VoucherHeaderFactory } from "@src/shared/tests";

describe("GetVoucherHeaderUseCase", () => {
  let useCase: GetVoucherHeaderUseCase;
  let voucherHeaderInterface: jest.Mocked<any>;
  let voucherDetailInterface: jest.Mocked<any>;
  let glMasterService: jest.Mocked<GlMasterService>;
  let voucherSharedService: jest.Mocked<VoucherSharedService>;

  // Use factory to create mock data
  const mockVoucherHeader = VoucherHeaderFactory.createBasicVoucherHeader({
    entryNo: 123,
    companyNo: 1,
    vendorNo: 1001,
    invoiceNo: "INV123",
    invoiceAmount: 100.0,
    invoiceDate: "20240101",
    apGlNo: 12010001,
    bankGl: 10010001,
    status: INVOICE_TYPE.S,
  });

  beforeEach(async () => {
    const mockVoucherHeaderInterface = {
      findOne: jest.fn(),
    };

    const mockVoucherDetailInterface = {
      findByEntry: jest.fn(),
    };

    const mockGlMasterService = {
      getGlDescription: jest.fn(),
    };

    const mockVoucherSharedService = {
      getValidationMessages: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetVoucherHeaderUseCase,
        {
          provide: "VoucherHeaderInterface",
          useValue: mockVoucherHeaderInterface,
        },
        {
          provide: "VoucherDetailInterface",
          useValue: mockVoucherDetailInterface,
        },
        {
          provide: GlMasterService,
          useValue: mockGlMasterService,
        },
        {
          provide: VoucherSharedService,
          useValue: mockVoucherSharedService,
        },
      ],
    }).compile();

    useCase = module.get<GetVoucherHeaderUseCase>(GetVoucherHeaderUseCase);
    voucherHeaderInterface = module.get("VoucherHeaderInterface");
    voucherDetailInterface = module.get("VoucherDetailInterface");
    glMasterService = module.get(GlMasterService);
    voucherSharedService = module.get(VoucherSharedService);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  describe("execute", () => {
    const entryNo = "123";
    const query: GetVoucherDataDto = {
      companyNo: 1,
      vendorNo: 1001,
    };

    it("should return voucher header successfully", async () => {
      voucherHeaderInterface.findOne.mockResolvedValue(mockVoucherHeader);
      voucherDetailInterface.findByEntry.mockResolvedValue([]);
      // Mock the two GL description calls for header
      glMasterService.getGlDescription
        .mockResolvedValueOnce("AP GL Description")
        .mockResolvedValueOnce("Bank GL Description");

      const result = await useCase.execute(entryNo, query);

      expect(result).toEqual({
        headerItem: mockVoucherHeader,
        detailItems: [],
      });
      expect(voucherHeaderInterface.findOne).toHaveBeenCalledWith(
        query.companyNo,
        parseInt(entryNo),
        query.vendorNo
      );
      expect(voucherDetailInterface.findByEntry).toHaveBeenCalledWith(
        query.companyNo,
        parseInt(entryNo),
        query.vendorNo
      );
    });

    it("should return voucher header with validation messages when status is not S", async () => {
      const mockHeaderWithValidation = {
        ...mockVoucherHeader,
        status: INVOICE_TYPE.O,
      };

      voucherHeaderInterface.findOne.mockResolvedValue(
        mockHeaderWithValidation
      );
      voucherDetailInterface.findByEntry.mockResolvedValue([]);

      // Mock the two GL description calls for header
      glMasterService.getGlDescription
        .mockResolvedValueOnce("AP GL Description")
        .mockResolvedValueOnce("Bank GL Description");

      // Mock validation messages
      const mockValidationResult = {
        validationMessages: [],
        detailValidationMessages: [],
      };
      voucherSharedService.getValidationMessages.mockResolvedValue(
        mockValidationResult
      );

      const result = await useCase.execute(entryNo, query);

      expect(result).toEqual({
        headerItem: mockHeaderWithValidation,
        detailItems: [],
        validationMessages: [],
      });

      expect(voucherHeaderInterface.findOne).toHaveBeenCalledWith(
        query.companyNo,
        parseInt(entryNo),
        query.vendorNo
      );
      expect(voucherDetailInterface.findByEntry).toHaveBeenCalledWith(
        query.companyNo,
        parseInt(entryNo),
        query.vendorNo
      );
      expect(voucherSharedService.getValidationMessages).toHaveBeenCalledWith(
        mockHeaderWithValidation,
        []
      );
    });

    it("should throw InternalServerErrorException when service fails", async () => {
      const error = new Error("Service error");
      voucherHeaderInterface.findOne.mockRejectedValue(error);

      await expect(useCase.execute(entryNo, query)).rejects.toThrow(Error);
      expect(voucherHeaderInterface.findOne).toHaveBeenCalledWith(
        query.companyNo,
        parseInt(entryNo),
        query.vendorNo
      );
    });
  });
});
