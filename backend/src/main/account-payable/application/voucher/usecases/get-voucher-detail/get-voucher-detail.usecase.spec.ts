import { Test, TestingModule } from "@nestjs/testing";
import { GetVoucherDetailUseCase } from "./get-voucher-detail.usecase";
import { VoucherDetailInterface } from "@src/main/account-payable/domain/interface/voucher.interface";
import { VoucherDetail } from "@src/main/account-payable/domain/entities/voucher.entity";
import { BadRequestException } from "@nestjs/common";

describe("GetVoucherDetailUseCase", () => {
  let useCase: GetVoucherDetailUseCase;
  let voucherDetailRepo: jest.Mocked<VoucherDetailInterface>;

  const mockVoucherDetailRepo = {
    findByEntry: jest.fn(),
  };

  // Helper function to create mock VoucherDetail with all required properties
  const createMockVoucherDetail = (
    overrides: Partial<VoucherDetail> = {}
  ): VoucherDetail => {
    return {
      isDeleted: "N",
      companyNo: 10,
      entryNo: 12345,
      entrySequence: 1,
      vendorNo: 1001,
      lineCompanyNo: 10,
      lineGlNo: 2000,
      lineDesc: "Test Line Description",
      lineAmount: 1000000,
      discountAmount: 0,
      discountPercentage: 0,
      inventoryItem: "",
      quantity: 1,
      jobNo: "",
      jobCostCode: "",
      jobCostType: "",
      jobCostQuantity: 0,
      gallons: 0,
      receiptNo: 0,
      openClosed: "O",
      poLineNo: 0,
      productAmount: 1000000,
      freightAmount: 0,
      poNo: "",
      status: "A",
      description: "Test Invoice",
      userProfile: "TEST",
      createDate: 20240101,
      updateDate: 20240101,
      ...overrides,
    } as VoucherDetail;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetVoucherDetailUseCase,
        {
          provide: "VoucherDetailInterface",
          useValue: mockVoucherDetailRepo,
        },
      ],
    }).compile();

    useCase = module.get<GetVoucherDetailUseCase>(GetVoucherDetailUseCase);
    voucherDetailRepo = module.get("VoucherDetailInterface");
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  describe("execute", () => {
    const companyNo = 10;
    const entryNo = 12345;
    const vendorNo = 1001;

    it("should successfully retrieve voucher details with all parameters", async () => {
      const mockVoucherDetails: VoucherDetail[] = [
        createMockVoucherDetail({
          entryNo: 12345,
          entrySequence: 1,
          lineGlNo: 2000,
          description: "Test Invoice",
          lineAmount: 1000000,
          productAmount: 1000000,
          vendorNo: 1001,
          companyNo: 10,
        }),
        createMockVoucherDetail({
          entryNo: 12345,
          entrySequence: 2,
          lineGlNo: 2000,
          description: "Test Invoice 2",
          lineAmount: 500000,
          productAmount: 500000,
          vendorNo: 1001,
          companyNo: 10,
        }),
      ];

      voucherDetailRepo.findByEntry.mockResolvedValue(mockVoucherDetails);

      const result = await useCase.execute(companyNo, entryNo, vendorNo);

      expect(result).toEqual(mockVoucherDetails);
      expect(voucherDetailRepo.findByEntry).toHaveBeenCalledWith(
        companyNo,
        entryNo,
        vendorNo
      );
    });

    it("should successfully retrieve voucher details without vendor number", async () => {
      const mockVoucherDetails: VoucherDetail[] = [
        createMockVoucherDetail({
          entryNo: 12345,
          entrySequence: 1,
          lineGlNo: 2000,
          description: "Test Invoice",
          lineAmount: 1000000,
          productAmount: 1000000,
          vendorNo: 1001,
          companyNo: 10,
        }),
      ];

      voucherDetailRepo.findByEntry.mockResolvedValue(mockVoucherDetails);

      const result = await useCase.execute(companyNo, entryNo);

      expect(result).toEqual(mockVoucherDetails);
      expect(voucherDetailRepo.findByEntry).toHaveBeenCalledWith(
        companyNo,
        entryNo,
        undefined
      );
    });

    it("should throw BadRequestException when company number is missing", async () => {
      await expect(
        useCase.execute(undefined, entryNo, vendorNo)
      ).rejects.toThrow(new BadRequestException("Company No is required"));
      expect(voucherDetailRepo.findByEntry).not.toHaveBeenCalled();
    });

    it("should throw BadRequestException when company number is null", async () => {
      await expect(
        useCase.execute(null as any, entryNo, vendorNo)
      ).rejects.toThrow(new BadRequestException("Company No is required"));
      expect(voucherDetailRepo.findByEntry).not.toHaveBeenCalled();
    });

    it("should throw BadRequestException when company number is 0", async () => {
      await expect(useCase.execute(0, entryNo, vendorNo)).rejects.toThrow(
        new BadRequestException("Company No is required")
      );
      expect(voucherDetailRepo.findByEntry).not.toHaveBeenCalled();
    });

    it("should throw BadRequestException when entry number is missing", async () => {
      await expect(
        useCase.execute(companyNo, undefined, vendorNo)
      ).rejects.toThrow(new BadRequestException("Entry No is required"));
      expect(voucherDetailRepo.findByEntry).not.toHaveBeenCalled();
    });

    it("should throw BadRequestException when entry number is null", async () => {
      await expect(
        useCase.execute(companyNo, null as any, vendorNo)
      ).rejects.toThrow(new BadRequestException("Entry No is required"));
      expect(voucherDetailRepo.findByEntry).not.toHaveBeenCalled();
    });

    it("should allow entry number to be 0", async () => {
      const mockVoucherDetails: VoucherDetail[] = [];
      voucherDetailRepo.findByEntry.mockResolvedValue(mockVoucherDetails);

      const result = await useCase.execute(companyNo, 0, vendorNo);

      expect(result).toEqual(mockVoucherDetails);
      expect(voucherDetailRepo.findByEntry).toHaveBeenCalledWith(
        companyNo,
        0,
        vendorNo
      );
    });

    it("should handle empty result from repository", async () => {
      voucherDetailRepo.findByEntry.mockResolvedValue([]);

      const result = await useCase.execute(companyNo, entryNo, vendorNo);

      expect(result).toEqual([]);
      expect(voucherDetailRepo.findByEntry).toHaveBeenCalledWith(
        companyNo,
        entryNo,
        vendorNo
      );
    });

    it("should handle repository errors", async () => {
      const error = new Error("Database connection failed");
      voucherDetailRepo.findByEntry.mockRejectedValue(error);

      await expect(
        useCase.execute(companyNo, entryNo, vendorNo)
      ).rejects.toThrow("Database connection failed");
      expect(voucherDetailRepo.findByEntry).toHaveBeenCalledWith(
        companyNo,
        entryNo,
        vendorNo
      );
    });

    it("should log the correct message with all parameters", async () => {
      const mockVoucherDetails: VoucherDetail[] = [];
      voucherDetailRepo.findByEntry.mockResolvedValue(mockVoucherDetails);

      const logSpy = jest.spyOn(useCase["logger"], "log");

      await useCase.execute(companyNo, entryNo, vendorNo);

      expect(logSpy).toHaveBeenCalledWith(
        `Fetching voucher details for companyNo=${companyNo}, entryNo=${entryNo}, vendorNo=${vendorNo}`
      );
    });

    it("should log the correct message without vendor number", async () => {
      const mockVoucherDetails: VoucherDetail[] = [];
      voucherDetailRepo.findByEntry.mockResolvedValue(mockVoucherDetails);

      const logSpy = jest.spyOn(useCase["logger"], "log");

      await useCase.execute(companyNo, entryNo);

      expect(logSpy).toHaveBeenCalledWith(
        `Fetching voucher details for companyNo=${companyNo}, entryNo=${entryNo}, vendorNo=undefined`
      );
    });

    it("should handle different company numbers", async () => {
      const differentCompanyNo = 20;
      const mockVoucherDetails: VoucherDetail[] = [];
      voucherDetailRepo.findByEntry.mockResolvedValue(mockVoucherDetails);

      await useCase.execute(differentCompanyNo, entryNo, vendorNo);

      expect(voucherDetailRepo.findByEntry).toHaveBeenCalledWith(
        differentCompanyNo,
        entryNo,
        vendorNo
      );
    });

    it("should handle different entry numbers", async () => {
      const differentEntryNo = 54321;
      const mockVoucherDetails: VoucherDetail[] = [];
      voucherDetailRepo.findByEntry.mockResolvedValue(mockVoucherDetails);

      await useCase.execute(companyNo, differentEntryNo, vendorNo);

      expect(voucherDetailRepo.findByEntry).toHaveBeenCalledWith(
        companyNo,
        differentEntryNo,
        vendorNo
      );
    });

    it("should handle different vendor numbers", async () => {
      const differentVendorNo = 2001;
      const mockVoucherDetails: VoucherDetail[] = [];
      voucherDetailRepo.findByEntry.mockResolvedValue(mockVoucherDetails);

      await useCase.execute(companyNo, entryNo, differentVendorNo);

      expect(voucherDetailRepo.findByEntry).toHaveBeenCalledWith(
        companyNo,
        entryNo,
        differentVendorNo
      );
    });
  });
});
