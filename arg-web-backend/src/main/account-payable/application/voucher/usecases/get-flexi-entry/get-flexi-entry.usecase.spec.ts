import { Test, TestingModule } from "@nestjs/testing";
import { GetFlexiEntryUseCase } from "./get-flexi-entry.usecase";
import { VoucherAppService } from "@src/main/account-payable/domain/services/voucher/voucher.service";
import { GetHeadersDto } from "../../dto/voucher.dto";
import { VoucherHeaderFactory } from "@src/shared/tests";
import { PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";

describe("GetFlexiEntryUseCase", () => {
  let useCase: GetFlexiEntryUseCase;
  let voucherAppService: jest.Mocked<VoucherAppService>;

  beforeEach(async () => {
    const mockVoucherAppService = {
      getFlexiVoucherHeaders: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetFlexiEntryUseCase,
        {
          provide: VoucherAppService,
          useValue: mockVoucherAppService,
        },
      ],
    }).compile();

    useCase = module.get<GetFlexiEntryUseCase>(GetFlexiEntryUseCase);
    voucherAppService = module.get(VoucherAppService);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  describe("execute", () => {
    const dto: GetHeadersDto = {
      companyNo: 1,
      current_page: 1,
      items_per_page: 10,
    };

    it("should return flexi entries successfully", async () => {
      const serviceResponse = {
        items: [
          VoucherHeaderFactory.createFlexiVoucherHeader({
            entryNo: 1,
            companyNo: 10,
            vendorNo: 1001,
            invoiceNo: "FLEXI001",
            invoiceAmount: 175.0,
            invoiceDate: "20240101",
            processType: PROCESS_TYPE_ENUM.FLEXI,
          }),
          VoucherHeaderFactory.createFlexiVoucherHeader({
            entryNo: 2,
            companyNo: 10,
            vendorNo: 1002,
            invoiceNo: "FLEXI002",
            invoiceAmount: 275.0,
            invoiceDate: "20240102",
            processType: PROCESS_TYPE_ENUM.FLEXI,
          }),
        ],
        pagination: {
          total_items: 2,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      const expectedResponse = {
        items: [
          expect.objectContaining({
            entryNo: 1,
            companyNo: 10,
            vendorNo: 1001,
            invoiceNo: "FLEXI001",
            invoiceAmount: 175.0,
            invoiceDate: "01/01/24",
            processType: PROCESS_TYPE_ENUM.FLEXI,
          }),
          expect.objectContaining({
            entryNo: 2,
            companyNo: 10,
            vendorNo: 1002,
            invoiceNo: "FLEXI002",
            invoiceAmount: 275.0,
            invoiceDate: "01/02/24",
            processType: PROCESS_TYPE_ENUM.FLEXI,
          }),
        ],
        pagination: {
          total_items: 2,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      voucherAppService.getFlexiVoucherHeaders.mockResolvedValue(
        serviceResponse
      );

      const result = await useCase.execute(dto);

      expect(result).toEqual(expectedResponse);
      expect(voucherAppService.getFlexiVoucherHeaders).toHaveBeenCalledWith({
        ...dto,
        companyNo: 10,
      });
    });

    it("should throw Error when service fails", async () => {
      const error = new Error("Service error");
      voucherAppService.getFlexiVoucherHeaders.mockRejectedValue(error);

      await expect(useCase.execute(dto)).rejects.toThrow(Error);
      expect(voucherAppService.getFlexiVoucherHeaders).toHaveBeenCalledWith({
        ...dto,
        companyNo: 10,
      });
    });
  });
});
