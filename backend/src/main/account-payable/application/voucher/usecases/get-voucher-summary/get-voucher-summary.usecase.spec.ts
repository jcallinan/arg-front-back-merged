import { Test, TestingModule } from "@nestjs/testing";
import { GetVoucherSummaryUseCase } from "./get-voucher-summary.usecase";
import { VoucherHeaderInterface } from "@src/main/account-payable/domain/interface/voucher.interface";
import { CompanyService } from "@src/main/account-payable/domain/services/company/companies.service";
import { PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";
import { HttpException } from "@nestjs/common";
import { ReportFactory } from "@src/shared/tests";

describe("GetVoucherSummaryUseCase", () => {
  let useCase: GetVoucherSummaryUseCase;
  let mockVoucherHeaderRepository: jest.Mocked<VoucherHeaderInterface>;
  let mockCompanyService: jest.Mocked<CompanyService>;

  // Use factory methods for mock data
  const mockQuery = {
    companyNo: ReportFactory.createReportQuery().companyNo!,
    processType: ReportFactory.createReportQuery().processType!,
  };
  const mockCompany = {
    companyNo: 10,
    companyName: "Test Company",
    companyApGlNo: 1000,
    companyBankGlNo: 1100,
    companyDiscountsGlNo: 1200,
    companyIntercoGlNo: 1300,
    companyRetainageGlNo: 1400,
    companyCashRequirementsGlNo: 1500,
    companyApControllingGlNo: 1600,
    companyUseTaxApGlNo: 1700,
    companyNacha1099TransmitterId: "12345",
    companyAchTransmitterId: "67890",
    companyReportingName: "Test Reporting Name",
    companyPurchasingName: "Test Purchasing Name",
    companyDisplayReportingName: false,
    companyDisplayPurchasingName: false,
    companyDisplayRemitToInformation: false,
    companyDisplayApportInformation: false,
    companyNachaImmediateDestination: "123456789",
    companyNachaImmediateOrigin: "987654321",
    companyNachaOrginatorName: "Test Originator",
    companyNachaGenerateDate: true,
  } as any;
  const mockVoucherSummary = {
    totalVouchers: ReportFactory.createVoucherSummary().totalVouchers!,
    totalAmount: ReportFactory.createVoucherSummary().totalAmount!,
    averageAmount: ReportFactory.createVoucherSummary().averageAmount!,
    processType: ReportFactory.createVoucherSummary().processType!,
    companyNo: ReportFactory.createVoucherSummary().companyNo!,
  };

  beforeEach(async () => {
    const mockVoucherHeaderRepositoryInstance = {
      getVoucherSummary: jest.fn(),
    };

    const mockCompanyServiceInstance = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetVoucherSummaryUseCase,
        {
          provide: "VoucherHeaderInterface",
          useValue: mockVoucherHeaderRepositoryInstance,
        },
        {
          provide: CompanyService,
          useValue: mockCompanyServiceInstance,
        },
      ],
    }).compile();

    useCase = module.get<GetVoucherSummaryUseCase>(GetVoucherSummaryUseCase);
    mockVoucherHeaderRepository = module.get("VoucherHeaderInterface");
    mockCompanyService = module.get(CompanyService);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("should return voucher summary successfully", async () => {
      // Arrange
      mockCompanyService.findOne.mockResolvedValue(mockCompany);
      mockVoucherHeaderRepository.getVoucherSummary.mockResolvedValue(
        mockVoucherSummary
      );

      // Act
      const result = await useCase.execute(mockQuery);

      // Assert
      expect(result).toEqual(mockVoucherSummary);
      expect(mockCompanyService.findOne).toHaveBeenCalledWith(
        mockQuery.companyNo
      );
      expect(
        mockVoucherHeaderRepository.getVoucherSummary
      ).toHaveBeenCalledWith(mockQuery.companyNo, mockQuery.processType);
    });

    it("should return voucher summary for different process types", async () => {
      // Arrange
      const flexiQuery = {
        companyNo: 10,
        processType: PROCESS_TYPE_ENUM.FLEXI,
      };
      const flexiSummary = {
        ...mockVoucherSummary,
        processType: PROCESS_TYPE_ENUM.FLEXI,
        totalVouchers: 75,
        totalAmount: 25000.0,
      };

      mockCompanyService.findOne.mockResolvedValue(mockCompany);
      mockVoucherHeaderRepository.getVoucherSummary.mockResolvedValue(
        flexiSummary
      );

      // Act
      const result = await useCase.execute(flexiQuery);

      // Assert
      expect(result).toEqual(flexiSummary);
      expect(mockCompanyService.findOne).toHaveBeenCalledWith(
        flexiQuery.companyNo
      );
      expect(
        mockVoucherHeaderRepository.getVoucherSummary
      ).toHaveBeenCalledWith(flexiQuery.companyNo, flexiQuery.processType);
    });

    it("should return voucher summary for SOGAS process type", async () => {
      // Arrange
      const sogasQuery = {
        companyNo: 10,
        processType: PROCESS_TYPE_ENUM.SOGAS,
      };
      const sogasSummary = {
        ...mockVoucherSummary,
        processType: PROCESS_TYPE_ENUM.SOGAS,
        totalVouchers: 25,
        totalAmount: 10000.0,
      };

      mockCompanyService.findOne.mockResolvedValue(mockCompany);
      mockVoucherHeaderRepository.getVoucherSummary.mockResolvedValue(
        sogasSummary
      );

      // Act
      const result = await useCase.execute(sogasQuery);

      // Assert
      expect(result).toEqual(sogasSummary);
      expect(mockCompanyService.findOne).toHaveBeenCalledWith(
        sogasQuery.companyNo
      );
      expect(
        mockVoucherHeaderRepository.getVoucherSummary
      ).toHaveBeenCalledWith(sogasQuery.companyNo, sogasQuery.processType);
    });

    it("should return voucher summary for PAPER process type", async () => {
      // Arrange
      const paperQuery = {
        companyNo: 10,
        processType: PROCESS_TYPE_ENUM.PAPER,
      };
      const paperSummary = {
        ...mockVoucherSummary,
        processType: PROCESS_TYPE_ENUM.PAPER,
        totalVouchers: 50,
        totalAmount: 15000.0,
      };

      mockCompanyService.findOne.mockResolvedValue(mockCompany);
      mockVoucherHeaderRepository.getVoucherSummary.mockResolvedValue(
        paperSummary
      );

      // Act
      const result = await useCase.execute(paperQuery);

      // Assert
      expect(result).toEqual(paperSummary);
      expect(mockCompanyService.findOne).toHaveBeenCalledWith(
        paperQuery.companyNo
      );
      expect(
        mockVoucherHeaderRepository.getVoucherSummary
      ).toHaveBeenCalledWith(paperQuery.companyNo, paperQuery.processType);
    });

    it("should return voucher summary for ARGLMS process type", async () => {
      // Arrange
      const arglmsQuery = {
        companyNo: 10,
        processType: PROCESS_TYPE_ENUM.ARGLMS,
      };
      const arglmsSummary = {
        ...mockVoucherSummary,
        processType: PROCESS_TYPE_ENUM.ARGLMS,
        totalVouchers: 30,
        totalAmount: 12000.0,
      };

      mockCompanyService.findOne.mockResolvedValue(mockCompany);
      mockVoucherHeaderRepository.getVoucherSummary.mockResolvedValue(
        arglmsSummary
      );

      // Act
      const result = await useCase.execute(arglmsQuery);

      // Assert
      expect(result).toEqual(arglmsSummary);
      expect(mockCompanyService.findOne).toHaveBeenCalledWith(
        arglmsQuery.companyNo
      );
      expect(
        mockVoucherHeaderRepository.getVoucherSummary
      ).toHaveBeenCalledWith(arglmsQuery.companyNo, arglmsQuery.processType);
    });

    it("should throw HttpException when company not found", async () => {
      // Arrange
      mockCompanyService.findOne.mockResolvedValue(null as any);

      // Act & Assert
      const result = useCase.execute(mockQuery);
      await expect(result).rejects.toThrow(HttpException);

      expect(mockCompanyService.findOne).toHaveBeenCalledWith(
        mockQuery.companyNo
      );
      expect(
        mockVoucherHeaderRepository.getVoucherSummary
      ).not.toHaveBeenCalled();
    });

    it("should handle company service errors gracefully", async () => {
      // Arrange
      const companyError = new Error("Database connection failed");
      mockCompanyService.findOne.mockRejectedValue(companyError);

      // Act & Assert
      await expect(useCase.execute(mockQuery)).rejects.toThrow(
        "Database connection failed"
      );
      expect(mockCompanyService.findOne).toHaveBeenCalledWith(
        mockQuery.companyNo
      );
      expect(
        mockVoucherHeaderRepository.getVoucherSummary
      ).not.toHaveBeenCalled();
    });

    it("should handle voucher summary repository errors gracefully", async () => {
      // Arrange
      const repositoryError = new Error("Repository query failed");
      mockCompanyService.findOne.mockResolvedValue(mockCompany);
      mockVoucherHeaderRepository.getVoucherSummary.mockRejectedValue(
        repositoryError
      );

      // Act & Assert
      await expect(useCase.execute(mockQuery)).rejects.toThrow(
        "Repository query failed"
      );
      expect(mockCompanyService.findOne).toHaveBeenCalledWith(
        mockQuery.companyNo
      );
      expect(
        mockVoucherHeaderRepository.getVoucherSummary
      ).toHaveBeenCalledWith(mockQuery.companyNo, mockQuery.processType);
    });

    it("should work with different company numbers", async () => {
      // Arrange
      const differentCompanyQuery = {
        companyNo: 20,
        processType: PROCESS_TYPE_ENUM.NORMAL,
      };
      const differentCompany = {
        ...mockCompany,
        companyNo: 20,
        companyName: "Different Company",
      };
      const differentSummary = {
        ...mockVoucherSummary,
        companyNo: 20,
        totalVouchers: 200,
        totalAmount: 75000.0,
      };

      mockCompanyService.findOne.mockResolvedValue(differentCompany);
      mockVoucherHeaderRepository.getVoucherSummary.mockResolvedValue(
        differentSummary
      );

      // Act
      const result = await useCase.execute(differentCompanyQuery);

      // Assert
      expect(result).toEqual(differentSummary);
      expect(mockCompanyService.findOne).toHaveBeenCalledWith(
        differentCompanyQuery.companyNo
      );
      expect(
        mockVoucherHeaderRepository.getVoucherSummary
      ).toHaveBeenCalledWith(
        differentCompanyQuery.companyNo,
        differentCompanyQuery.processType
      );
    });
  });
});
