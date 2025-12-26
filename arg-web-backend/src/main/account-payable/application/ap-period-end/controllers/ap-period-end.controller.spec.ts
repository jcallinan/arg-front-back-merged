import { Test, TestingModule } from "@nestjs/testing";
import { APPeriodEndController } from "./ap-period-end.controller";
import { GetVendorsByYearUseCase } from "../usecases/get-vendors-by-year/get-vendors-by-year.usecase";
import { VendorYearEndProcessUseCase } from "../usecases/year-end-process/year-end-process.usecase";
import { GetReviewFilesUsecase } from "../usecases/get-review-files/get-review-files.usecase";
import { GetCompanyDetailsUseCase } from "../usecases/get-company-details/get-company-details.usecase";
import { GetApPeriodEndUsecase } from "../usecases/get-ap-period-end/get-ap-period-end.usecase";
import { PostApPeriodEndUsecase } from "../usecases/post-ap-period-end/post-ap-period-end.usecase";
import { AllApPeriodEndUsecase } from "../usecases/get-all-ap-period-end/get-all-ap-period-end.usecase";
import { SoftDeleteRecordUsecase } from "../usecases/soft-delete-record/soft-delete-record.usecase";
import { GetVendorDetailsByYearUsecase } from "../usecases/get-vendor-details-by-year/get-vendor-details-by-year.usecase";
import { updateVendorByYearUsecase } from "../usecases/update-vendor-by-year/update-vendor.usecase";
import {
  GetYearEndProcessMenuReviewFilesDto,
  ReviewFileResponseDto,
} from "../dto/ap-period-end.dto";
import { Vendor } from "@src/main/account-payable/domain/entities/vendor.entity";
// PaginatedResponse is used indirectly through the factory
import { HttpException, HttpStatus } from "@nestjs/common";
import {
  VendorFactory,
  APPeriodEndFactory,
  PaginatedResponseFactory,
} from "@src/shared/tests";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";

describe("APPeriodEndController", () => {
  let controller: APPeriodEndController;
  let getVendorsByYearUseCase: GetVendorsByYearUseCase;
  const mockExecute = jest.fn();
  let getReviewFilesUseCase: GetReviewFilesUsecase;

  const mockReviewFilesExecute = jest.fn();
  const mockVendorYearEndProcessExecute = jest.fn();
  const mockGetCompanyDetailsExecute = jest.fn();
  const mockGetApPeriodEndExecute = jest.fn();
  const mockPostApPeriodEndExecute = jest.fn();
  const mockAllApPeriodEndExecute = jest.fn();
  const mockSoftDeleteRecordExecute = jest.fn();
  const mockGetVendorDetailsByYearExecute = jest.fn();
  const mockUpdateVendorByYearExecute = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [APPeriodEndController],
      providers: [
        {
          provide: GetVendorsByYearUseCase,
          useValue: { execute: mockExecute },
        },
        {
          provide: GetCompanyDetailsUseCase,
          useValue: { execute: mockGetCompanyDetailsExecute },
        },
        {
          provide: VendorYearEndProcessUseCase,
          useValue: { execute: mockVendorYearEndProcessExecute },
        },
        {
          provide: GetReviewFilesUsecase,
          useValue: { execute: mockReviewFilesExecute },
        },
        {
          provide: GetApPeriodEndUsecase,
          useValue: { execute: mockGetApPeriodEndExecute },
        },
        {
          provide: PostApPeriodEndUsecase,
          useValue: { execute: mockPostApPeriodEndExecute },
        },
        {
          provide: AllApPeriodEndUsecase,
          useValue: { execute: mockAllApPeriodEndExecute },
        },
        {
          provide: SoftDeleteRecordUsecase,
          useValue: { execute: mockSoftDeleteRecordExecute },
        },
        {
          provide: GetVendorDetailsByYearUsecase,
          useValue: { execute: mockGetVendorDetailsByYearExecute },
        },
        {
          provide: updateVendorByYearUsecase,
          useValue: { execute: mockUpdateVendorByYearExecute },
        },
      ],
    }).compile();

    controller = module.get<APPeriodEndController>(APPeriodEndController);
    getVendorsByYearUseCase = module.get<GetVendorsByYearUseCase>(
      GetVendorsByYearUseCase
    );
    getReviewFilesUseCase = module.get<GetReviewFilesUsecase>(
      GetReviewFilesUsecase
    );
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getVendorsByYear", () => {
    it("should return paginated vendor list when usecase is called with valid dto", async () => {
      const dto = APPeriodEndFactory.createGetVendorsByYearDto();
      const mockVendors = VendorFactory.createMultipleAPPeriodEndVendors(
        [1001, 1002],
        10
      );
      const mockResult =
        PaginatedResponseFactory.createSinglePagePaginatedResponse(mockVendors);

      mockExecute.mockResolvedValueOnce(mockResult);

      const result = await controller.getVendorsByYear(dto);
      expect(result).toEqual(mockResult);
      expect(result.items).toBeDefined();
      expect(result.items.length).toBe(2);

      const firstVendor = result.items[0]!;
      expect(firstVendor.vendorNo).toBe(1001);
      expect(firstVendor.vendorName).toBe("Test Vendor 1001");
      expect(firstVendor.vendorCompanyNumber).toBe(10);
      expect(firstVendor.vendorYtdPurchases).toBe(1001 * 50000.0); // vendorNo * 50000.0
      expect(firstVendor.vendorCurrentBalance).toBe(1001 * 7000.0); // vendorNo * 7000.0

      const secondVendor = result.items[1]!;
      expect(secondVendor.vendorNo).toBe(1002);
      expect(secondVendor.vendorName).toBe("Test Vendor 1002");
      expect(secondVendor.vendorCompanyNumber).toBe(10);
      expect(secondVendor.vendorYtdPurchases).toBe(1002 * 50000.0); // vendorNo * 50000.0
      expect(secondVendor.vendorCurrentBalance).toBe(1002 * 7000.0); // vendorNo * 7000.0

      expect(getVendorsByYearUseCase.execute).toHaveBeenCalledWith(dto);
    });

    it("should return empty result when no vendors found for the year", async () => {
      const dto = APPeriodEndFactory.createGetVendorsByYearDtoForEmptyResults();
      const mockResult =
        PaginatedResponseFactory.createEmptyPaginatedResponse<Vendor>();

      mockExecute.mockResolvedValueOnce(mockResult);

      const result = await controller.getVendorsByYear(dto);
      expect(result.items).toEqual([]);
      expect(result.pagination.total_items).toBe(0);
      expect(result.pagination.total_pages).toBe(0);
      expect(mockExecute).toHaveBeenCalledWith(dto);
    });

    it("should handle pagination correctly", async () => {
      const dto = APPeriodEndFactory.createGetVendorsByYearDtoForPagination(
        2,
        5
      );
      const mockVendors = [
        VendorFactory.createAPPeriodEndVendorForPagination(2, 0, 10),
      ];
      const mockResult =
        PaginatedResponseFactory.createPaginatedResponseForPage(
          mockVendors,
          2,
          5,
          6
        );

      mockExecute.mockResolvedValueOnce(mockResult);

      const result = await controller.getVendorsByYear(dto);
      expect(result.pagination.current_page).toBe(2);
      expect(result.pagination.items_per_page).toBe(5);
      expect(result.pagination.total_items).toBe(6);
      expect(result.pagination.total_pages).toBe(2);
      expect(result.items.length).toBe(1);
      expect(mockExecute).toHaveBeenCalledWith(dto);
    });

    it("should throw if usecase.execute fails", async () => {
      const dto = APPeriodEndFactory.createGetVendorsByYearDto();

      mockExecute.mockRejectedValueOnce(new Error("Database connection error"));

      await expect(controller.getVendorsByYear(dto)).rejects.toThrow(
        "Database connection error"
      );
      expect(getVendorsByYearUseCase.execute).toHaveBeenCalledWith(dto);
    });

    it("should throw HttpException when vendor list not found", async () => {
      const dto = APPeriodEndFactory.createGetVendorsByYearDtoWithSorting(
        "vendorNo",
        "asc"
      );

      const errorResponse = {
        message: "Error",
        errors: [
          {
            field: "vendorList",
            code: "NOT_FOUND",
            message: "Vendor list not found",
          },
        ],
      };

      mockExecute.mockRejectedValueOnce(
        new HttpException(errorResponse, HttpStatus.NOT_FOUND)
      );

      await expect(controller.getVendorsByYear(dto)).rejects.toThrow(
        HttpException
      );
      expect(getVendorsByYearUseCase.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe("getReviewFiles", () => {
    it("should return paginated review files when usecase is called with valid dto", async () => {
      const dto: GetYearEndProcessMenuReviewFilesDto = {
        companyNo: 10,
        reportType: ["sample test report"],
        current_page: 1,
        items_per_page: 10,
      };

      const mockReports = [
        {
          reportType: "sample test report",
          pdfFileName: "sample-test-report_20250813084723655536.PDF",
          reportDateTime: "2025-07-25T10:35:44.835Z",
          filePath:
            "http://172.16.30.10:5001/G-Drive/sample-test-report_20250813084723655536.PDF",
          formType: "PDF",
        },
      ];

      const mockResult: PaginatedResponse<ReviewFileResponseDto> = {
        items: mockReports,
        pagination: {
          total_items: 1,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      };

      mockReviewFilesExecute.mockResolvedValueOnce(mockResult);

      const result = await controller.getReviewFiles(dto);
      expect(result).toEqual(mockResult);
      expect(result.items.length).toBe(1);

      expect(getReviewFilesUseCase.execute).toHaveBeenCalledWith(dto);
    });

    it("should return empty result when no reports found", async () => {
      const dto: GetYearEndProcessMenuReviewFilesDto = {
        companyNo: 10,
        reportType: ["sample report type"],
        current_page: 1,
        items_per_page: 10,
      };

      const mockResult: PaginatedResponse<ReviewFileResponseDto> = {
        items: [],
        pagination: {
          total_items: 0,
          current_page: 1,
          items_per_page: 10,
          total_pages: 0,
        },
      };

      mockReviewFilesExecute.mockResolvedValueOnce(mockResult);

      const result = await controller.getReviewFiles(dto);
      expect(result.items).toEqual([]);
      expect(result.pagination.total_items).toBe(0);
      expect(result.pagination.total_pages).toBe(0);
      expect(getReviewFilesUseCase.execute).toHaveBeenCalledWith(dto);
    });

    it("should throw if usecase.execute fails", async () => {
      const dto: GetYearEndProcessMenuReviewFilesDto = {
        companyNo: 10,
        reportType: ["sample report type"],
        current_page: 1,
        items_per_page: 10,
      };

      mockReviewFilesExecute.mockRejectedValueOnce(
        new Error("Database connection error")
      );

      await expect(controller.getReviewFiles(dto)).rejects.toThrow(
        "Database connection error"
      );
      expect(getReviewFilesUseCase.execute).toHaveBeenCalledWith(dto);
    });

    it("should throw HttpException when reports not found", async () => {
      const dto: GetYearEndProcessMenuReviewFilesDto = {
        companyNo: 10,
        reportType: ["sample report type"],
        current_page: 1,
        items_per_page: 10,
      };

      const errorResponse = {
        message: "Error",
        errors: [
          {
            field: "reportList",
            code: "NOT_FOUND",
            message: "Report list not found",
          },
        ],
      };

      mockReviewFilesExecute.mockRejectedValueOnce(
        new HttpException(errorResponse, HttpStatus.NOT_FOUND)
      );

      await expect(controller.getReviewFiles(dto)).rejects.toThrow(
        HttpException
      );
      expect(getReviewFilesUseCase.execute).toHaveBeenCalledWith(dto);
    });
  });
});
