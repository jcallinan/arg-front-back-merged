import { Test, TestingModule } from "@nestjs/testing";
import { VendorYearEndProcessUseCase } from "./year-end-process.usecase";
import { YearEndProcessInterface } from "../../../../domain/interface/year-end-process.interface";
import { YearEndProcessResponse } from "../../../../domain/entities/year-end-process.entity";
import { vendorYearEndProcessDto } from "../../dto/ap-period-end.dto";

describe("VendorYearEndProcessUseCase", () => {
  let useCase: VendorYearEndProcessUseCase;
  let mockYearEndProcessRepository: jest.Mocked<YearEndProcessInterface>;

  const mockSuccessResponse: YearEndProcessResponse =
    YearEndProcessResponse.create({
      message:
        "Vendor year-end process completed successfully for company 10, year 2024",
      tableName: "DATADEV.VENDOR_2024",
      dataCopied: 150,
    });

  beforeEach(async () => {
    mockYearEndProcessRepository = {
      processVendorYearEnd: jest.fn(),
    } as jest.Mocked<YearEndProcessInterface>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendorYearEndProcessUseCase,
        {
          provide: "YearEndProcessInterface",
          useValue: mockYearEndProcessRepository,
        },
      ],
    }).compile();

    useCase = module.get<VendorYearEndProcessUseCase>(
      VendorYearEndProcessUseCase
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    const validDto: vendorYearEndProcessDto = {
      companyNo: 10,
      year: "2024",
      clearYTD: false,
    };

    it("should successfully process vendor year-end when repository succeeds", async () => {
      mockYearEndProcessRepository.processVendorYearEnd.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(validDto);

      expect(
        mockYearEndProcessRepository.processVendorYearEnd
      ).toHaveBeenCalledWith(
        validDto.companyNo,
        validDto.year,
        validDto.clearYTD
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it("should handle clearYTD as true when provided", async () => {
      const dtoWithClearYTD: vendorYearEndProcessDto = {
        ...validDto,
        clearYTD: true,
      };
      mockYearEndProcessRepository.processVendorYearEnd.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(dtoWithClearYTD);

      expect(
        mockYearEndProcessRepository.processVendorYearEnd
      ).toHaveBeenCalledWith(
        dtoWithClearYTD.companyNo,
        dtoWithClearYTD.year,
        true
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it("should default clearYTD to false when not provided", async () => {
      const dtoWithoutClearYTD: vendorYearEndProcessDto = {
        companyNo: 10,
        year: "2024",
      };
      mockYearEndProcessRepository.processVendorYearEnd.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(dtoWithoutClearYTD);

      expect(
        mockYearEndProcessRepository.processVendorYearEnd
      ).toHaveBeenCalledWith(
        dtoWithoutClearYTD.companyNo,
        dtoWithoutClearYTD.year,
        false
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it("should handle repository errors and return error response", async () => {
      const errorMessage = "Database connection error";
      const repositoryError = new Error(errorMessage);
      mockYearEndProcessRepository.processVendorYearEnd.mockRejectedValue(
        repositoryError
      );

      const result = await useCase.execute(validDto);

      expect(result).toEqual(
        YearEndProcessResponse.create({
          message: `Year-end process failed: ${errorMessage}`,
          tableName: undefined,
          dataCopied: 0,
        })
      );
    });

    it("should handle different company numbers and years correctly", async () => {
      const differentDto: vendorYearEndProcessDto = {
        companyNo: 25,
        year: "2023",
        clearYTD: true,
      };
      mockYearEndProcessRepository.processVendorYearEnd.mockResolvedValue(
        mockSuccessResponse
      );

      const result = await useCase.execute(differentDto);

      expect(
        mockYearEndProcessRepository.processVendorYearEnd
      ).toHaveBeenCalledWith(
        differentDto.companyNo,
        differentDto.year,
        differentDto.clearYTD
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it("should preserve repository response structure when successful", async () => {
      const customResponse = YearEndProcessResponse.create({
        message: "Custom success message",
        tableName: "CUSTOM_TABLE_2024",
        dataCopied: 999,
      });
      mockYearEndProcessRepository.processVendorYearEnd.mockResolvedValue(
        customResponse
      );

      const result = await useCase.execute(validDto);

      expect(result).toEqual(customResponse);
      expect(result.message).toBe("Custom success message");
      expect(result.tableName).toBe("CUSTOM_TABLE_2024");
      expect(result.dataCopied).toBe(999);
    });
  });

  describe("constructor", () => {
    it("should create instance with injected dependencies", () => {
      const useCaseInstance = new VendorYearEndProcessUseCase(
        mockYearEndProcessRepository
      );

      expect(useCaseInstance).toBeInstanceOf(VendorYearEndProcessUseCase);
    });
  });
});
