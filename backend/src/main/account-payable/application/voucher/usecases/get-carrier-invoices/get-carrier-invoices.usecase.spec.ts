import { Test, TestingModule } from "@nestjs/testing";
import { GetCarrierInvoicesUseCase } from "./get-carrier-invoices.usecase";
import { FreightInvoiceHeaderInterface } from "@src/main/account-payable/domain/interface/freight-invoice-header.interface";
import {
  GetCarrierInvoicesDto,
  CarrierInvoiceResponseDto,
} from "../../dto/voucher.dto";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import {
  INVOICE_TYPE,
  PROCESS_TYPE_ENUM,
} from "@src/shared/constants/constant";

describe("GetCarrierInvoicesUseCase", () => {
  let useCase: GetCarrierInvoicesUseCase;
  let freightInvoiceHeaderInterface: jest.Mocked<FreightInvoiceHeaderInterface>;

  const mockFreightInvoiceHeaderInterface = {
    findCarrierInvoices: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCarrierInvoicesUseCase,
        {
          provide: "FreightInvoiceHeaderInterface",
          useValue: mockFreightInvoiceHeaderInterface,
        },
      ],
    }).compile();

    useCase = module.get<GetCarrierInvoicesUseCase>(GetCarrierInvoicesUseCase);
    freightInvoiceHeaderInterface = module.get("FreightInvoiceHeaderInterface");
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  describe("execute", () => {
    const mockDto: GetCarrierInvoicesDto = {
      companyNo: 10,
      processType: PROCESS_TYPE_ENUM.NORMAL,
      current_page: 1,
      items_per_page: 10,
    };

    const mockCarrierInvoices: CarrierInvoiceResponseDto[] = [
      {
        carrierId: "APPA",
        carrierInvoiceNo: "24601",
        ordShipDate: "2025-04-29",
        invoiceType: "P",
        ourOrderNo: 363822,
        shippingReferenceNo: 1,
        invoiceAmount: 1373.5,
        invoiceDate: 20250429,
      },
      {
        carrierId: "FEDEX",
        carrierInvoiceNo: "24602",
        ordShipDate: "2025-04-30",
        invoiceType: "P",
        ourOrderNo: 363823,
        shippingReferenceNo: 2,
        invoiceAmount: 2450.75,
        invoiceDate: 20250430,
      },
    ];

    const mockResponse: PaginatedResponse<CarrierInvoiceResponseDto> = {
      items: mockCarrierInvoices,
      pagination: {
        current_page: 1,
        items_per_page: 10,
        total_items: 2,
        total_pages: 1,
      },
    };

    it("should successfully fetch carrier invoices", async () => {
      freightInvoiceHeaderInterface.findCarrierInvoices.mockResolvedValue(
        mockResponse
      );

      const result = await useCase.execute(mockDto);

      expect(result).toEqual(mockResponse);
      expect(
        freightInvoiceHeaderInterface.findCarrierInvoices
      ).toHaveBeenCalledWith({
        ...mockDto,
        invoiceType: INVOICE_TYPE.P,
      });
    });

    it("should set invoice type to P (Paper) regardless of input", async () => {
      const dtoWithDifferentInvoiceType: GetCarrierInvoicesDto = {
        ...mockDto,
        invoiceType: "O", // Different invoice type
      };

      freightInvoiceHeaderInterface.findCarrierInvoices.mockResolvedValue(
        mockResponse
      );

      await useCase.execute(dtoWithDifferentInvoiceType);

      expect(
        freightInvoiceHeaderInterface.findCarrierInvoices
      ).toHaveBeenCalledWith({
        ...dtoWithDifferentInvoiceType,
        invoiceType: INVOICE_TYPE.P, // Should always be P for Paper
      });
    });

    it("should handle empty response", async () => {
      const emptyResponse: PaginatedResponse<CarrierInvoiceResponseDto> = {
        items: [],
        pagination: {
          current_page: 1,
          items_per_page: 10,
          total_items: 0,
          total_pages: 0,
        },
      };

      freightInvoiceHeaderInterface.findCarrierInvoices.mockResolvedValue(
        emptyResponse
      );

      const result = await useCase.execute(mockDto);

      expect(result).toEqual(emptyResponse);
      expect(result.items).toHaveLength(0);
      expect(result.pagination.total_items).toBe(0);
    });

    it("should handle single carrier invoice", async () => {
      const singleInvoiceResponse: PaginatedResponse<CarrierInvoiceResponseDto> =
        {
          items: [mockCarrierInvoices[0]!], // Use non-null assertion since we know the array has items
          pagination: {
            current_page: 1,
            items_per_page: 10,
            total_items: 1,
            total_pages: 1,
          },
        };

      freightInvoiceHeaderInterface.findCarrierInvoices.mockResolvedValue(
        singleInvoiceResponse
      );

      const result = await useCase.execute(mockDto);

      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual(mockCarrierInvoices[0]);
      expect(result.pagination.total_items).toBe(1);
    });

    it("should handle large number of carrier invoices", async () => {
      const largeResponse: PaginatedResponse<CarrierInvoiceResponseDto> = {
        items: Array(100)
          .fill(null)
          .map((_, index) => ({
            carrierId: `CARRIER${index}`,
            carrierInvoiceNo: `INV${index}`,
            ordShipDate: "2025-04-29",
            invoiceType: "P",
            ourOrderNo: 363800 + index,
            shippingReferenceNo: index + 1,
            invoiceAmount: 1000 + index * 10,
            invoiceDate: 20250429,
          })),
        pagination: {
          current_page: 1,
          items_per_page: 100,
          total_items: 100,
          total_pages: 1,
        },
      };

      freightInvoiceHeaderInterface.findCarrierInvoices.mockResolvedValue(
        largeResponse
      );

      const result = await useCase.execute(mockDto);

      expect(result.items).toHaveLength(100);
      expect(result.pagination.total_items).toBe(100);
    });

    it("should handle different company numbers", async () => {
      const dtoWithDifferentCompany: GetCarrierInvoicesDto = {
        ...mockDto,
        companyNo: 20,
      };

      freightInvoiceHeaderInterface.findCarrierInvoices.mockResolvedValue(
        mockResponse
      );

      await useCase.execute(dtoWithDifferentCompany);

      expect(
        freightInvoiceHeaderInterface.findCarrierInvoices
      ).toHaveBeenCalledWith({
        ...dtoWithDifferentCompany,
        invoiceType: INVOICE_TYPE.P,
      });
    });

    it("should handle different process types", async () => {
      const dtoWithDifferentProcessType: GetCarrierInvoicesDto = {
        ...mockDto,
        processType: PROCESS_TYPE_ENUM.PAPER,
      };

      freightInvoiceHeaderInterface.findCarrierInvoices.mockResolvedValue(
        mockResponse
      );

      await useCase.execute(dtoWithDifferentProcessType);

      expect(
        freightInvoiceHeaderInterface.findCarrierInvoices
      ).toHaveBeenCalledWith({
        ...dtoWithDifferentProcessType,
        invoiceType: INVOICE_TYPE.P,
      });
    });

    it("should handle pagination parameters", async () => {
      const dtoWithPagination: GetCarrierInvoicesDto = {
        ...mockDto,
        current_page: 2,
        items_per_page: 25,
      };

      const paginatedResponse: PaginatedResponse<CarrierInvoiceResponseDto> = {
        items: mockCarrierInvoices,
        pagination: {
          current_page: 2,
          items_per_page: 25,
          total_items: 50,
          total_pages: 2,
        },
      };

      freightInvoiceHeaderInterface.findCarrierInvoices.mockResolvedValue(
        paginatedResponse
      );

      const result = await useCase.execute(dtoWithPagination);

      expect(result.pagination.current_page).toBe(2);
      expect(result.pagination.items_per_page).toBe(25);
      expect(result.pagination.total_pages).toBe(2);
    });

    it("should handle interface errors", async () => {
      const error = new Error("Database connection failed");
      freightInvoiceHeaderInterface.findCarrierInvoices.mockRejectedValue(
        error
      );

      await expect(useCase.execute(mockDto)).rejects.toThrow(
        "Database connection failed"
      );
      expect(
        freightInvoiceHeaderInterface.findCarrierInvoices
      ).toHaveBeenCalledWith({
        ...mockDto,
        invoiceType: INVOICE_TYPE.P,
      });
    });

    it("should log the correct message", async () => {
      freightInvoiceHeaderInterface.findCarrierInvoices.mockResolvedValue(
        mockResponse
      );

      const logSpy = jest.spyOn(useCase["logger"], "log");

      await useCase.execute(mockDto);

      expect(logSpy).toHaveBeenCalledWith("Fetching all carrier invoices");
    });

    it("should preserve all other DTO properties", async () => {
      const dtoWithExtraProperties: GetCarrierInvoicesDto = {
        ...mockDto,
        companyNo: 15,
        processType: PROCESS_TYPE_ENUM.PAPER,
        current_page: 3,
        items_per_page: 15,
        // Add any other properties that might exist in BaseQueryDto
      };

      freightInvoiceHeaderInterface.findCarrierInvoices.mockResolvedValue(
        mockResponse
      );

      await useCase.execute(dtoWithExtraProperties);

      expect(
        freightInvoiceHeaderInterface.findCarrierInvoices
      ).toHaveBeenCalledWith({
        ...dtoWithExtraProperties,
        invoiceType: INVOICE_TYPE.P,
      });
    });

    it("should handle undefined invoice type in input DTO", async () => {
      const dtoWithoutInvoiceType: GetCarrierInvoicesDto = {
        ...mockDto,
        invoiceType: undefined,
      };

      freightInvoiceHeaderInterface.findCarrierInvoices.mockResolvedValue(
        mockResponse
      );

      await useCase.execute(dtoWithoutInvoiceType);

      expect(
        freightInvoiceHeaderInterface.findCarrierInvoices
      ).toHaveBeenCalledWith({
        ...dtoWithoutInvoiceType,
        invoiceType: INVOICE_TYPE.P,
      });
    });

    it("should handle different invoice types in response", async () => {
      const mixedInvoiceTypesResponse: PaginatedResponse<CarrierInvoiceResponseDto> =
        {
          items: [
            {
              ...mockCarrierInvoices[0]!,
              invoiceType: "P",
            },
            {
              ...mockCarrierInvoices[1]!,
              invoiceType: "P",
            },
          ],
          pagination: {
            current_page: 1,
            items_per_page: 10,
            total_items: 2,
            total_pages: 1,
          },
        };

      freightInvoiceHeaderInterface.findCarrierInvoices.mockResolvedValue(
        mixedInvoiceTypesResponse
      );

      const result = await useCase.execute(mockDto);

      expect(result.items).toHaveLength(2);
      expect(result.items[0]?.invoiceType).toBe("P");
      expect(result.items[1]?.invoiceType).toBe("P");
    });

    it("should handle edge case with zero company number", async () => {
      const dtoWithZeroCompany: GetCarrierInvoicesDto = {
        ...mockDto,
        companyNo: 0,
      };

      freightInvoiceHeaderInterface.findCarrierInvoices.mockResolvedValue(
        mockResponse
      );

      await useCase.execute(dtoWithZeroCompany);

      expect(
        freightInvoiceHeaderInterface.findCarrierInvoices
      ).toHaveBeenCalledWith({
        ...dtoWithZeroCompany,
        invoiceType: INVOICE_TYPE.P,
      });
    });
  });
});
