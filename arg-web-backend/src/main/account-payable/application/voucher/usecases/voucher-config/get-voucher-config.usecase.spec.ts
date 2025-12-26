import { Test, TestingModule } from "@nestjs/testing";
import { GetVoucherConfigUseCase } from "./get-voucher-config.usecase";
import { CompanyService } from "@src/main/account-payable/domain/services/company/companies.service";
import { VendorAppService } from "@src/main/account-payable/domain/services/vendor/vendor.service";
import { VoucherSharedService } from "../../shared-services/voucher.shared.service";
import { VoucherConfigResponseDto } from "../../dto/voucher.dto";
import { CompanyFactory, VendorFactory } from "@src/shared/tests";

describe("GetVoucherConfigUseCase", () => {
  let useCase: GetVoucherConfigUseCase;
  let companyService: jest.Mocked<CompanyService>;
  let vendorAppService: jest.Mocked<VendorAppService>;
  let voucherSharedService: jest.Mocked<VoucherSharedService>;

  // Use factory to create mock data
  const mockCompany = CompanyFactory.createBasicCompany({
    companyNo: 1,
    companyName: "Test Company",
    companyStatus: "ACTIVE",
  });

  const mockVendor = VendorFactory.createBasicVendor({
    vendorNo: 1001,
    vendorName: "Test Vendor",
    vendorIsDeleted: "A",
  });

  const mockVoucherConfigResponse = new VoucherConfigResponseDto();
  mockVoucherConfigResponse.company = {
    ...mockCompany,
    companyNextEntryNo: 12345,
    companyDiscountsGlDesc: "Discount GL Description",
    companyApGlDesc: "AP GL Description",
    companyBankGlDesc: "Bank GL Description",
  };
  mockVoucherConfigResponse.vendor = mockVendor;

  beforeEach(async () => {
    const mockCompanyService = {
      findOne: jest.fn(),
    };

    const mockVendorAppService = {
      findVendorByNo: jest.fn(),
    };

    const mockVoucherSharedService = {
      getAndIncrementNextEntryNo: jest.fn(),
      getCompanyGlDescriptions: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetVoucherConfigUseCase,
        {
          provide: CompanyService,
          useValue: mockCompanyService,
        },
        {
          provide: VendorAppService,
          useValue: mockVendorAppService,
        },
        {
          provide: VoucherSharedService,
          useValue: mockVoucherSharedService,
        },
      ],
    }).compile();

    useCase = module.get<GetVoucherConfigUseCase>(GetVoucherConfigUseCase);
    companyService = module.get(CompanyService);
    vendorAppService = module.get(VendorAppService);
    voucherSharedService = module.get(VoucherSharedService);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  describe("execute", () => {
    const companyNo = 1;
    const vendorNo = 1001;

    it("should return voucher configuration successfully", async () => {
      companyService.findOne.mockResolvedValue(mockCompany as any);
      vendorAppService.findVendorByNo.mockResolvedValue(mockVendor as any);
      voucherSharedService.getAndIncrementNextEntryNo.mockResolvedValue(12345);
      voucherSharedService.getCompanyGlDescriptions.mockResolvedValue({
        companyDiscountsGlDesc: "Discount GL Description",
        companyApGlDesc: "AP GL Description",
        companyBankGlDesc: "Bank GL Description",
      });

      const result = await useCase.execute(companyNo, vendorNo);

      expect(result).toEqual(mockVoucherConfigResponse);
      expect(companyService.findOne).toHaveBeenCalledWith(companyNo);
      expect(vendorAppService.findVendorByNo).toHaveBeenCalledWith(
        vendorNo,
        companyNo
      );
      expect(
        voucherSharedService.getAndIncrementNextEntryNo
      ).toHaveBeenCalledWith(mockCompany as any);
      expect(
        voucherSharedService.getCompanyGlDescriptions
      ).toHaveBeenCalledWith(mockCompany as any);
    });

    it("should throw Error when service fails", async () => {
      const error = new Error("Service error");
      companyService.findOne.mockRejectedValue(error);

      await expect(useCase.execute(companyNo, vendorNo)).rejects.toThrow(Error);
      expect(companyService.findOne).toHaveBeenCalledWith(companyNo);
    });
  });
});
