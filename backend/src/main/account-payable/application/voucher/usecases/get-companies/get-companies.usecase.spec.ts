import { Test, TestingModule } from "@nestjs/testing";
import { GetCompaniesUseCase } from "./get-companies.usecase";
import { CompanyService } from "@src/main/account-payable/domain/services/company/companies.service";
import { Company } from "@src/main/account-payable/domain/entities/company.entity";
import { GetAllCompaniesDto } from "../../dto/company.dto";
import { CompanyFactory } from "@src/shared/tests/company-module/company.factory";
import { PaginatedResponseFactory } from "@src/shared/tests/shared/pagination.factory";

describe("GetCompaniesUseCase", () => {
  let useCase: GetCompaniesUseCase;
  let companyService: CompanyService;

  const mockCompanyService = {
    getAllCompanies: jest.fn(),
    cacheAllCompanies: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCompaniesUseCase,
        {
          provide: CompanyService,
          useValue: mockCompanyService,
        },
      ],
    }).compile();

    useCase = module.get<GetCompaniesUseCase>(GetCompaniesUseCase);
    companyService = module.get<CompanyService>(CompanyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  describe("execute", () => {
    it("should return paginated companies successfully", async () => {
      // Arrange
      const dto: GetAllCompaniesDto = {
        current_page: 1,
        items_per_page: 10,
        search: "",
      };

      const mockCompanies = [
        CompanyFactory.createBasicCompany({
          companyNo: 10,
          companyName: "Test Company 1",
        }),
        CompanyFactory.createBasicCompany({
          companyNo: 20,
          companyName: "Test Company 2",
        }),
      ];

      const mockResponse =
        PaginatedResponseFactory.createSinglePagePaginatedResponse(
          mockCompanies
        );

      mockCompanyService.getAllCompanies.mockResolvedValue(mockResponse);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(companyService.getAllCompanies).toHaveBeenCalledWith(dto);
      expect(result.items).toHaveLength(2);
      expect(result.pagination.total_items).toBe(2);
    });

    it("should handle empty company list", async () => {
      // Arrange
      const dto: GetAllCompaniesDto = {
        current_page: 1,
        items_per_page: 10,
        search: "NonExistent",
      };

      const mockResponse =
        PaginatedResponseFactory.createEmptyPaginatedResponse<Company>();

      mockCompanyService.getAllCompanies.mockResolvedValue(mockResponse);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(companyService.getAllCompanies).toHaveBeenCalledWith(dto);
      expect(result.items).toHaveLength(0);
      expect(result.pagination.total_items).toBe(0);
    });

    it("should handle pagination parameters correctly", async () => {
      // Arrange
      const dto: GetAllCompaniesDto = {
        current_page: 2,
        items_per_page: 5,
        search: "",
      };

      const mockCompanies = [
        CompanyFactory.createBasicCompany({
          companyNo: 10,
          companyName: "Company 1",
        }),
        CompanyFactory.createBasicCompany({
          companyNo: 20,
          companyName: "Company 2",
        }),
        CompanyFactory.createBasicCompany({
          companyNo: 30,
          companyName: "Company 3",
        }),
        CompanyFactory.createBasicCompany({
          companyNo: 40,
          companyName: "Company 4",
        }),
        CompanyFactory.createBasicCompany({
          companyNo: 50,
          companyName: "Company 5",
        }),
      ];

      const mockResponse =
        PaginatedResponseFactory.createPaginatedResponseForPage(
          mockCompanies,
          2,
          5,
          15
        );

      mockCompanyService.getAllCompanies.mockResolvedValue(mockResponse);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(companyService.getAllCompanies).toHaveBeenCalledWith(dto);
      expect(result.pagination.current_page).toBe(2);
      expect(result.pagination.items_per_page).toBe(5);
      expect(result.pagination.total_pages).toBe(3);
    });

    it("should handle search functionality", async () => {
      // Arrange
      const dto: GetAllCompaniesDto = {
        current_page: 1,
        items_per_page: 10,
        search: "Test",
      };

      const mockCompanies = [
        CompanyFactory.createBasicCompany({
          companyNo: 10,
          companyName: "Test Company",
        }),
      ];

      const mockResponse =
        PaginatedResponseFactory.createSinglePagePaginatedResponse(
          mockCompanies
        );

      mockCompanyService.getAllCompanies.mockResolvedValue(mockResponse);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(companyService.getAllCompanies).toHaveBeenCalledWith(dto);
      expect(result.items[0]?.companyName).toContain("Test");
    });
  });

  describe("cacheAllCompanies", () => {
    it("should cache all companies successfully", async () => {
      // Arrange
      const mockCacheResult = {
        totalCompanies: 5,
        cachedCompanies: 5,
        duration: 150,
      };

      mockCompanyService.cacheAllCompanies.mockResolvedValue(mockCacheResult);

      // Act
      const result = await useCase.cacheAllCompanies();

      // Assert
      expect(result).toEqual(mockCacheResult);
      expect(companyService.cacheAllCompanies).toHaveBeenCalled();
      expect(result.totalCompanies).toBe(5);
      expect(result.cachedCompanies).toBe(5);
      expect(result.duration).toBeGreaterThan(0);
    });

    it("should handle partial cache success", async () => {
      // Arrange
      const mockCacheResult = {
        totalCompanies: 10,
        cachedCompanies: 7,
        duration: 200,
      };

      mockCompanyService.cacheAllCompanies.mockResolvedValue(mockCacheResult);

      // Act
      const result = await useCase.cacheAllCompanies();

      // Assert
      expect(result).toEqual(mockCacheResult);
      expect(companyService.cacheAllCompanies).toHaveBeenCalled();
      expect(result.totalCompanies).toBe(10);
      expect(result.cachedCompanies).toBe(7);
      expect(result.cachedCompanies).toBeLessThan(result.totalCompanies);
    });

    it("should handle cache failure gracefully", async () => {
      // Arrange
      const mockCacheResult = {
        totalCompanies: 0,
        cachedCompanies: 0,
        duration: 0,
      };

      mockCompanyService.cacheAllCompanies.mockResolvedValue(mockCacheResult);

      // Act
      const result = await useCase.cacheAllCompanies();

      // Assert
      expect(result).toEqual(mockCacheResult);
      expect(companyService.cacheAllCompanies).toHaveBeenCalled();
      expect(result.totalCompanies).toBe(0);
      expect(result.cachedCompanies).toBe(0);
    });
  });

  describe("error handling", () => {
    it("should propagate service errors", async () => {
      // Arrange
      const dto: GetAllCompaniesDto = {
        current_page: 1,
        items_per_page: 10,
        search: "",
      };

      const errorMessage = "Database connection failed";
      mockCompanyService.getAllCompanies.mockRejectedValue(
        new Error(errorMessage)
      );

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow(errorMessage);
      expect(companyService.getAllCompanies).toHaveBeenCalledWith(dto);
    });

    it("should handle cache errors gracefully", async () => {
      // Arrange
      const errorMessage = "Cache service unavailable";
      mockCompanyService.cacheAllCompanies.mockRejectedValue(
        new Error(errorMessage)
      );

      // Act & Assert
      await expect(useCase.cacheAllCompanies()).rejects.toThrow(errorMessage);
      expect(companyService.cacheAllCompanies).toHaveBeenCalled();
    });
  });
});
