import { Test, TestingModule } from "@nestjs/testing";
import { GetSogasEntryUseCase } from "./get-sogas-entry.usecase";
import { VoucherAppService } from "@src/main/account-payable/domain/services/voucher/voucher.service";
import { GetHeadersDto } from "../../dto/voucher.dto";
import { VoucherHeaderFactory } from "@src/shared/tests";
import { PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";

describe("GetSogasEntryUseCase", () => {
  let useCase: GetSogasEntryUseCase;
  let voucherAppService: jest.Mocked<VoucherAppService>;

  beforeEach(async () => {
    const mockVoucherAppService = {
      getSogasVoucherHeaders: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetSogasEntryUseCase,
        {
          provide: VoucherAppService,
          useValue: mockVoucherAppService,
        },
      ],
    }).compile();

    useCase = module.get<GetSogasEntryUseCase>(GetSogasEntryUseCase);
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

    it("should return sogas entries successfully", async () => {
      // Use factory to create service response data
      const serviceResponse = {
        items: [
          VoucherHeaderFactory.createSogasVoucherHeader({
            entryNo: 1,
            companyNo: 10,
            vendorNo: 1001,
            invoiceNo: "SOGAS001",
            invoiceAmount: 150.0,
            invoiceDate: "20240101",
          }),
          VoucherHeaderFactory.createSogasVoucherHeader({
            entryNo: 2,
            companyNo: 10,
            vendorNo: 1002,
            invoiceNo: "SOGAS002",
            invoiceAmount: 250.0,
            invoiceDate: "20240102",
          }),
        ],
        pagination: {
          total_items: 2,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      // Use factory to create expected response data
      const expectedResponse = {
        items: [
          expect.objectContaining({
            entryNo: 1,
            companyNo: 10,
            vendorNo: 1001,
            invoiceNo: "SOGAS001",
            invoiceAmount: 150.0,
            invoiceDate: "01/01/24",
            processType: PROCESS_TYPE_ENUM.SOGAS,
          }),
          expect.objectContaining({
            entryNo: 2,
            companyNo: 10,
            vendorNo: 1002,
            invoiceNo: "SOGAS002",
            invoiceAmount: 250.0,
            invoiceDate: "01/02/24",
            processType: PROCESS_TYPE_ENUM.SOGAS,
          }),
        ],
        pagination: {
          total_items: 2,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      voucherAppService.getSogasVoucherHeaders.mockResolvedValue(
        serviceResponse
      );

      const result = await useCase.execute(dto);

      expect(result).toEqual(expectedResponse);
      expect(voucherAppService.getSogasVoucherHeaders).toHaveBeenCalledWith({
        ...dto,
        companyNo: 10,
      });
    });

    it("should throw Error when service fails", async () => {
      const error = new Error("Service error");
      voucherAppService.getSogasVoucherHeaders.mockRejectedValue(error);

      await expect(useCase.execute(dto)).rejects.toThrow(Error);
      expect(voucherAppService.getSogasVoucherHeaders).toHaveBeenCalledWith({
        ...dto,
        companyNo: 10,
      });
    });
  });
});
