// get-all-ap-period-end.usecase.spec.ts

import { AllApPeriodEndUsecase } from "./get-all-ap-period-end.usecase";
import { ApPeriodEndInterface } from "@src/main/account-payable/domain/interface/ap-period-end.interface";
import { BaseQueryDto } from "@src/shared/dto/base-query.dto";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import { allReponseDto } from "../../dto/ap-period-end.dto";

describe("AllApPeriodEndUsecase", () => {
  let useCase: AllApPeriodEndUsecase;
  let apPeriodEndInterface: jest.Mocked<ApPeriodEndInterface>;

  beforeEach(() => {
    apPeriodEndInterface = {
      findAll: jest.fn(),
      getApPeriodEnd: jest.fn(),
      postApPeriodEnd: jest.fn(),
      softDelete: jest.fn(),
    } as jest.Mocked<ApPeriodEndInterface>;

    useCase = new AllApPeriodEndUsecase(apPeriodEndInterface);
  });

  it("should fetch all AP period end data successfully with default pagination", async () => {
    const dto: BaseQueryDto = {};

    const mockResult: PaginatedResponse<allReponseDto> = {
      items: [
        {
          ctl: "CTL12345",
          tin: "TIN987654",
          recordType: "A",
          firstPayeeName: "John Doe",
        },
        {
          ctl: "CTL67890",
          tin: "TIN123456",
          recordType: "B",
          firstPayeeName: "Jane Smith",
        },
      ],
      pagination: {
        current_page: 1,
        items_per_page: 10,
        total_items: 2,
        total_pages: 1,
      },
    };

    apPeriodEndInterface.findAll.mockResolvedValue(mockResult);

    const result = await useCase.execute(dto);

    expect(apPeriodEndInterface.findAll).toHaveBeenCalledWith(500, 0, 1);
    expect(result).toEqual(mockResult);
  });

  it("should fetch all AP period end data with custom pagination", async () => {
    const dto: BaseQueryDto = {
      current_page: 2,
      items_per_page: 5,
    };

    const mockResult: PaginatedResponse<allReponseDto> = {
      items: [
        {
          ctl: "CTL11111",
          tin: "TIN222222",
          recordType: "T",
          firstPayeeName: "Bob Johnson",
        },
      ],
      pagination: {
        current_page: 2,
        items_per_page: 5,
        total_items: 6,
        total_pages: 2,
      },
    };

    apPeriodEndInterface.findAll.mockResolvedValue(mockResult);

    const result = await useCase.execute(dto);

    expect(apPeriodEndInterface.findAll).toHaveBeenCalledWith(5, 5, 2);
    expect(result).toEqual(mockResult);
  });

  it("should handle errors from interface", async () => {
    const dto: BaseQueryDto = {
      current_page: 1,
      items_per_page: 10,
    };

    apPeriodEndInterface.findAll.mockRejectedValue(
      new Error("Database connection failed")
    );

    await expect(useCase.execute(dto)).rejects.toThrow(
      "Database connection failed"
    );
  });

  it("should log the correct message", async () => {
    const dto: BaseQueryDto = {};

    const mockResult: PaginatedResponse<allReponseDto> = {
      items: [],
      pagination: {
        current_page: 1,
        items_per_page: 10,
        total_items: 0,
        total_pages: 0,
      },
    };

    apPeriodEndInterface.findAll.mockResolvedValue(mockResult);

    const logSpy = jest.spyOn(useCase["logger"], "log");

    await useCase.execute(dto);

    expect(logSpy).toHaveBeenCalledWith("Fetch All data from AP Period End");
  });

  it("should handle edge case with very large page numbers", async () => {
    const dto: BaseQueryDto = {
      current_page: 999,
      items_per_page: 100,
    };

    const mockResult: PaginatedResponse<allReponseDto> = {
      items: [],
      pagination: {
        current_page: 999,
        items_per_page: 100,
        total_items: 0,
        total_pages: 0,
      },
    };

    apPeriodEndInterface.findAll.mockResolvedValue(mockResult);

    const result = await useCase.execute(dto);

    expect(apPeriodEndInterface.findAll).toHaveBeenCalledWith(100, 99800, 999);
    expect(result).toEqual(mockResult);
  });
});
