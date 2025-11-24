import { Test, TestingModule } from "@nestjs/testing";
import { HttpException, HttpStatus } from "@nestjs/common";
import { GetVendorsByYearUseCase } from "./get-vendors-by-year.usecase";
import { VendorInterface } from "@src/main/account-payable/domain/interface/vendor.interface";
import { GetVendorsByYearDto } from "../../dto/ap-period-end.dto";
import { Vendor } from "@src/main/account-payable/domain/entities/vendor.entity";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";
import { VENDOR_STATUS } from "@src/shared/constants/constant";
import { VendorFactory } from "@src/shared/tests";

describe("GetVendorsByYearUseCase", () => {
  let useCase: GetVendorsByYearUseCase;
  let vendorInterface: jest.Mocked<VendorInterface>;
  const mockGetVendorMasterListByYear = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetVendorsByYearUseCase,
        {
          provide: "VendorInterface",
          useValue: {
            getVendorMasterListByYear: mockGetVendorMasterListByYear,
          },
        },
      ],
    }).compile();

    useCase = module.get<GetVendorsByYearUseCase>(GetVendorsByYearUseCase);
    vendorInterface = module.get("VendorInterface");
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  describe("execute", () => {
    const mockVendors: Vendor[] = [
      VendorFactory.createVendorForCompany(10, {
        vendorNo: 1001,
        vendorName: "Test Vendor 1",
        vendorTelephoneNo: 1234567,
        vendorLastPaymentAmt: 1000.0,
        vendorLastPaymentDate: 20241201,
        vendorYtdPurchases: 50000.0,
        vendorLastYearPurchases: 45000.0,
        vendorMtdDiscounts: 500.0,
        vendorYtdDiscounts: 2000.0,
        vendorMtdPurchases: 10000.0,
        vendorMtdPayments: 8000.0,
        vendorCurrentBalance: 7000.0,
        vendorPreviousBalance: 5000.0,
        vendorThisYrYtdPaid: 40000.0,
        vendorLastYrYtdPaid: 35000.0,
        vendorIdNumber: "123456789",
        vendorLastPaymentDateAlt: 20241201,
        vendorCarrierId: "CAR001",
        vendorPayeeName1: "Test Vendor 1",
        vendorAchBankRoutingCode: 123456789,
        vendorAchBankAccountNumber: "1234567890",
        vendorBusinessLastName: "Vendor",
        vendorIsDeleted: VENDOR_STATUS.A,
      }),
      VendorFactory.createVendorForCompany(10, {
        vendorNo: 1002,
        vendorName: "Test Vendor 2",
        vendorTelephoneNo: 9876543,
        vendorLastPaymentAmt: 2000.0,
        vendorLastPaymentDate: 20241202,
        vendorYtdPurchases: 75000.0,
        vendorLastYearPurchases: 70000.0,
        vendorMtdDiscounts: 750.0,
        vendorYtdDiscounts: 3000.0,
        vendorMtdPurchases: 15000.0,
        vendorMtdPayments: 12000.0,
        vendorCurrentBalance: 11000.0,
        vendorPreviousBalance: 8000.0,
        vendorThisYrYtdPaid: 60000.0,
        vendorLastYrYtdPaid: 55000.0,
        vendorIdNumber: "987654321",
        vendorLastPaymentDateAlt: 20241202,
        vendorCarrierId: "CAR002",
        vendorPayeeName1: "Test Vendor 2",
        vendorAchBankRoutingCode: 987654321,
        vendorAchBankAccountNumber: "0987654321",
        vendorBusinessLastName: "Vendor2",
        vendorIsDeleted: VENDOR_STATUS.A,
      }),
    ];

    it("should successfully return paginated vendor list when vendors are found", async () => {
      // Arrange
      const dto: GetVendorsByYearDto = {
        companyNo: 10,
        year: 2024,
        current_page: 1,
        items_per_page: 10,
        sortBy: "vendorNo",
        sortOrder: "asc",
      };

      const mockRepositoryResponse = {
        rows: mockVendors,
        count: 2,
        page: 1,
        limit: 10,
      };

      const expectedResult: PaginatedResponse<Vendor> = {
        items: mockVendors,
        pagination: {
          total_items: 2,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      mockGetVendorMasterListByYear.mockResolvedValueOnce(
        mockRepositoryResponse
      );

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(result.items).toHaveLength(2);
      expect(result.pagination.total_items).toBe(2);
      expect(result.pagination.current_page).toBe(1);
      expect(result.pagination.items_per_page).toBe(10);
      expect(result.pagination.total_pages).toBe(1);
      expect(vendorInterface.getVendorMasterListByYear).toHaveBeenCalledWith(
        dto
      );
      expect(vendorInterface.getVendorMasterListByYear).toHaveBeenCalledTimes(
        1
      );
    });

    it("should return empty paginated response when no vendors are found", async () => {
      // Arrange
      const dto: GetVendorsByYearDto = {
        companyNo: 10,
        year: 2023,
        current_page: 1,
        items_per_page: 10,
      };

      const mockRepositoryResponse = {
        rows: [],
        count: 0,
        page: 1,
        limit: 10,
      };

      const expectedResult: PaginatedResponse<Vendor> = {
        items: [],
        pagination: {
          total_items: 0,
          current_page: 1,
          items_per_page: 10,
          total_pages: 0,
        },
      };

      mockGetVendorMasterListByYear.mockResolvedValueOnce(
        mockRepositoryResponse
      );

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(result.items).toHaveLength(0);
      expect(result.pagination.total_items).toBe(0);
      expect(result.pagination.total_pages).toBe(0);
      expect(vendorInterface.getVendorMasterListByYear).toHaveBeenCalledWith(
        dto
      );
    });

    it("should handle pagination correctly with multiple pages", async () => {
      // Arrange
      const dto: GetVendorsByYearDto = {
        companyNo: 10,
        year: 2024,
        current_page: 2,
        items_per_page: 5,
        sortBy: "vendorName",
        sortOrder: "desc",
      };

      const mockRepositoryResponse = {
        rows: [mockVendors[1]], // Only second vendor for page 2
        count: 2,
        page: 2,
        limit: 5,
      };

      const expectedResult: PaginatedResponse<Vendor> = {
        items: [mockVendors[1] as Vendor],
        pagination: {
          total_items: 2,
          current_page: 2,
          items_per_page: 5,
          total_pages: 1,
        },
      };

      mockGetVendorMasterListByYear.mockResolvedValueOnce(
        mockRepositoryResponse
      );

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(result.items).toHaveLength(1);
      expect(result.pagination.current_page).toBe(2);
      expect(result.pagination.items_per_page).toBe(5);
      expect(result.pagination.total_items).toBe(2);
      expect(vendorInterface.getVendorMasterListByYear).toHaveBeenCalledWith(
        dto
      );
    });

    it("should throw HttpException with NOT_FOUND when vendor interface returns null rows", async () => {
      // Arrange
      const dto: GetVendorsByYearDto = {
        companyNo: 10,
        year: 2024,
        current_page: 1,
        items_per_page: 10,
      };

      const mockRepositoryResponse = {
        rows: null, // Only rows is null, other properties are defined
        count: 0,
        page: 1,
        limit: 10,
      };

      mockGetVendorMasterListByYear.mockResolvedValue(mockRepositoryResponse);

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow(HttpException);
      await expect(useCase.execute(dto)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
        response: {
          error: {
            code: ERROR_CONSTANTS.NOT_FOUND.code,
            message: ERROR_CONSTANTS.NOT_FOUND.message,
            details: [
              {
                field: "vendors",
                code: ERROR_CONSTANTS.NOT_FOUND.code,
                message: "Vendor data not found",
              },
            ],
          },
        },
      });
      expect(vendorInterface.getVendorMasterListByYear).toHaveBeenCalledWith(
        dto
      );
    });

    it("should propagate errors from vendor interface", async () => {
      // Arrange
      const dto: GetVendorsByYearDto = {
        companyNo: 10,
        year: 2024,
        current_page: 1,
        items_per_page: 10,
      };

      const databaseError = new Error("Database connection failed");
      mockGetVendorMasterListByYear.mockRejectedValueOnce(databaseError);

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow(
        "Database connection failed"
      );
      expect(vendorInterface.getVendorMasterListByYear).toHaveBeenCalledWith(
        dto
      );
    });

    it("should handle case with default pagination values", async () => {
      // Arrange
      const dto: GetVendorsByYearDto = {
        companyNo: 10,
        year: 2024,
      };

      const mockRepositoryResponse = {
        rows: mockVendors,
        count: 2,
        page: 1,
        limit: 500, // Default value
      };

      const expectedResult: PaginatedResponse<Vendor> = {
        items: mockVendors,
        pagination: {
          total_items: 2,
          current_page: 1,
          items_per_page: 500,
          total_pages: 1,
        },
      };

      mockGetVendorMasterListByYear.mockResolvedValueOnce(
        mockRepositoryResponse
      );

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(vendorInterface.getVendorMasterListByYear).toHaveBeenCalledWith(
        dto
      );
    });

    it("should handle case with only required fields", async () => {
      // Arrange
      const dto: GetVendorsByYearDto = {
        companyNo: 10,
        year: 2024,
      };

      const mockRepositoryResponse = {
        rows: mockVendors,
        count: 2,
        page: 1,
        limit: 500,
      };

      mockGetVendorMasterListByYear.mockResolvedValueOnce(
        mockRepositoryResponse
      );

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result.items).toHaveLength(2);
      expect(vendorInterface.getVendorMasterListByYear).toHaveBeenCalledWith(
        dto
      );
    });
  });
});
