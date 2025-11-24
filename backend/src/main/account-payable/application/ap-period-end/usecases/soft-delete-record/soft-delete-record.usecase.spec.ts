// soft-delete-record.usecase.spec.ts

import { SoftDeleteRecordUsecase } from "./soft-delete-record.usecase";
import { ApPeriodEndInterface } from "@src/main/account-payable/domain/interface/ap-period-end.interface";
import { apPeriodEndDto } from "../../dto/ap-period-end.dto";

describe("SoftDeleteRecordUsecase", () => {
  let useCase: SoftDeleteRecordUsecase;
  let apPeriodEndInterface: jest.Mocked<ApPeriodEndInterface>;

  beforeEach(() => {
    apPeriodEndInterface = {
      softDelete: jest.fn(),
    } as jest.Mocked<ApPeriodEndInterface>;

    useCase = new SoftDeleteRecordUsecase(apPeriodEndInterface);
  });

  it("should soft delete record successfully", async () => {
    const dto: apPeriodEndDto = {
      ctl: "10",
      tin: "123456789",
    };

    const mockResult = { message: "Record soft deleted successfully" };
    apPeriodEndInterface.softDelete.mockResolvedValue(mockResult);

    const result = await useCase.execute(dto);

    expect(apPeriodEndInterface.softDelete).toHaveBeenCalledWith(
      "10",
      "123456789"
    );
    expect(result).toEqual(mockResult);
  });

  it("should handle errors from interface", async () => {
    const dto: apPeriodEndDto = {
      ctl: "20",
      tin: "987654321",
    };

    apPeriodEndInterface.softDelete.mockRejectedValue(
      new Error("Record not found")
    );

    await expect(useCase.execute(dto)).rejects.toThrow("Record not found");
  });

  it("should log the correct message", async () => {
    const dto: apPeriodEndDto = {
      ctl: "30",
      tin: "555666777",
    };

    const mockResult = { message: "Record soft deleted successfully" };
    apPeriodEndInterface.softDelete.mockResolvedValue(mockResult);

    const logSpy = jest.spyOn(useCase["logger"], "log");

    await useCase.execute(dto);

    expect(logSpy).toHaveBeenCalledWith(
      "Fetch data from flat files ctl: 30, tin: 555666777"
    );
  });

  it("should handle different ctl and tin values", async () => {
    const dto: apPeriodEndDto = {
      ctl: "99",
      tin: "111222333",
    };

    const mockResult = { message: "Record soft deleted successfully" };
    apPeriodEndInterface.softDelete.mockResolvedValue(mockResult);

    const result = await useCase.execute(dto);

    expect(apPeriodEndInterface.softDelete).toHaveBeenCalledWith(
      "99",
      "111222333"
    );
    expect(result).toEqual(mockResult);
  });
});
