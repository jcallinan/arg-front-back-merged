// get-ap-period-end.usecase.spec.ts

import { GetApPeriodEndUsecase } from "./get-ap-period-end.usecase";
import { ApPeriodEndInterface } from "@src/main/account-payable/domain/interface/ap-period-end.interface";
import { apPeriodEndDto } from "../../dto/ap-period-end.dto";
import {
  RecordA,
  RecordB,
  RecordT,
} from "@src/main/account-payable/domain/entities/ap-period-end.entity";

describe("GetApPeriodEndUsecase", () => {
  let useCase: GetApPeriodEndUsecase;
  let apPeriodEndInterface: jest.Mocked<ApPeriodEndInterface>;

  beforeEach(() => {
    apPeriodEndInterface = {
      getApPeriodEnd: jest.fn(),
      postApPeriodEnd: jest.fn(),
      findAll: jest.fn(),
      softDelete: jest.fn(),
    } as jest.Mocked<ApPeriodEndInterface>;

    useCase = new GetApPeriodEndUsecase(apPeriodEndInterface);
  });

  it("should fetch AP period end data successfully with T format response", async () => {
    const dto: apPeriodEndDto = {
      ctl: "10",
      tin: "123456789",
    };

    const mockResult: RecordT = {
      recordType: "T",
      paymentYear: 2024,
      priorYearDataInd: "Y",
      transmitterId: 123456789,
      transControlCode: "ABCDE",
      replacementAlphaChar: "RA",
      blank01: "",
      testFileInd: "T",
      foreignEntityInd: "N",
      transmitterName: "ABC Transmitters Inc.",
      transmitterName2: "Second Name",
      companyName: "Company Ltd.",
      companyName2: "Branch Division",
      companyAddress: "123 Main St",
      companyCity: "New York",
      companyState: "NY",
      companyZipCode: "10001",
      blank02: "",
      totalNumberOfPayees: 500,
      contactName: "John Doe",
      contactPhoneNumber: "1234567890",
      contactEmail: "john.doe@email.com",
      blank03: "",
      sequenceNumber: 1,
      blank04: "",
      vendorInd: "Y",
      blank05: "",
      blank06: "",
    };

    apPeriodEndInterface.getApPeriodEnd.mockResolvedValue(mockResult);

    const result = await useCase.execute(dto);

    expect(apPeriodEndInterface.getApPeriodEnd).toHaveBeenCalledWith(
      "10",
      "123456789"
    );
    expect(result).toEqual(mockResult);
  });

  it("should fetch AP period end data successfully with A format response", async () => {
    const dto: apPeriodEndDto = {
      ctl: "20",
      tin: "987654321",
    };

    const mockResult: RecordA = {
      recordType: "A",
      paymentYear: 2024,
      c: "Y",
      blank01: "",
      taxPayerId: 987654321,
      payerNameControl: "ABCD",
      lastFilingIndicator: "Y",
      typeOfReturn: "01",
      amountCodes: "1234567890123456",
      blank02: "",
      foreignEntityIndicator: "N",
      firstPayeeName: "First Payer Name",
      secondPayerName: "Second Payer Name",
      transferAgentIndicator: "Y",
      payerShippingAddress: "123 Main Street",
      payerCity: "New York",
      payerState: "NY",
      payerZipCode: "10001",
      payerPhoneNumber: "1234567890",
      blank03: "",
      blank04: "",
      sequenceNumber: 1,
      blank05: "",
      blank06: "",
    };

    apPeriodEndInterface.getApPeriodEnd.mockResolvedValue(mockResult);

    const result = await useCase.execute(dto);

    expect(apPeriodEndInterface.getApPeriodEnd).toHaveBeenCalledWith(
      "20",
      "987654321"
    );
    expect(result).toEqual(mockResult);
  });

  it("should fetch AP period end data successfully with B format response", async () => {
    const dto: apPeriodEndDto = {
      ctl: "30",
      tin: "555666777",
    };

    const mockResult: RecordB = {
      recordType: "B",
      paymentYear: "2024",
      correctedReturnIndicator: "1",
      nameControl: "ABCD",
      typeOfTIN: "1",
      taxPayerId: "555666777",
      payerAccountNum: "ACC1234567890",
      payerOfficeCode: "OFF1",
      deletionIndicator: "N",
      blank01: "",
      payAmt1: 1000,
      payAmt2: 2000,
      payAmt3: 3000,
      payAmt4: 4000,
      payAmt5: 5000,
      payAmt6: 6000,
      payAmt7: 7000,
      payAmt8: 8000,
      payAmt9: 9000,
      payAmtA: 10000,
      payAmtB: 11000,
      payAmtC: 12000,
      payAmtD: 13000,
      payAmtE: 14000,
      payAmtF: 15000,
      payAmtG: 16000,
      foreignCountryCode: "N",
      firstPayeeName: "John Smith",
      secondPayeeName: "Jane Smith",
      payeeAddress: "123 Elm Street",
      payeeCity: "Los Angeles",
      payeeState: "CA",
      payeeZip: "90001",
      blank05: "",
      sequenceNumber: 1,
      blank06: "",
    };

    apPeriodEndInterface.getApPeriodEnd.mockResolvedValue(mockResult);

    const result = await useCase.execute(dto);

    expect(apPeriodEndInterface.getApPeriodEnd).toHaveBeenCalledWith(
      "30",
      "555666777"
    );
    expect(result).toEqual(mockResult);
  });

  it("should handle errors from interface", async () => {
    const dto: apPeriodEndDto = {
      ctl: "40",
      tin: "111222333",
    };

    apPeriodEndInterface.getApPeriodEnd.mockRejectedValue(
      new Error("Record not found")
    );

    await expect(useCase.execute(dto)).rejects.toThrow("Record not found");
  });

  it("should log the correct message", async () => {
    const dto: apPeriodEndDto = {
      ctl: "50",
      tin: "444555666",
    };

    const mockResult: RecordT = {
      recordType: "T",
      paymentYear: 2024,
      priorYearDataInd: "Y",
      transmitterId: 444555666,
      transControlCode: "ABCDE",
      replacementAlphaChar: "RA",
      blank01: "",
      testFileInd: "T",
      foreignEntityInd: "N",
      transmitterName: "Test Company",
      transmitterName2: "Second Name",
      companyName: "Company Ltd.",
      companyName2: "Branch Division",
      companyAddress: "123 Main St",
      companyCity: "New York",
      companyState: "NY",
      companyZipCode: "10001",
      blank02: "",
      totalNumberOfPayees: 100,
      contactName: "Test Contact",
      contactPhoneNumber: "1234567890",
      contactEmail: "test@email.com",
      blank03: "",
      sequenceNumber: 1,
      blank04: "",
      vendorInd: "Y",
      blank05: "",
      blank06: "",
    };

    apPeriodEndInterface.getApPeriodEnd.mockResolvedValue(mockResult);

    const logSpy = jest.spyOn(useCase["logger"], "log");

    await useCase.execute(dto);

    expect(logSpy).toHaveBeenCalledWith(
      "Fetch data from flat files ctl: 50, tin: 444555666"
    );
  });

  it("should handle different ctl and tin values", async () => {
    const dto: apPeriodEndDto = {
      ctl: "99",
      tin: "999888777",
    };

    const mockResult: RecordA = {
      recordType: "A",
      paymentYear: 2024,
      c: "N",
      blank01: "",
      taxPayerId: 999888777,
      payerNameControl: "WXYZ",
      lastFilingIndicator: "N",
      typeOfReturn: "02",
      amountCodes: "9876543210987654",
      blank02: "",
      foreignEntityIndicator: "Y",
      firstPayeeName: "Foreign Company",
      secondPayerName: "Foreign Division",
      transferAgentIndicator: "N",
      payerShippingAddress: "456 Foreign St",
      payerCity: "Foreign City",
      payerState: "FC",
      payerZipCode: "99999",
      payerPhoneNumber: "9876543210",
      blank03: "",
      blank04: "",
      sequenceNumber: 999,
      blank05: "",
      blank06: "",
    };

    apPeriodEndInterface.getApPeriodEnd.mockResolvedValue(mockResult);

    const result = await useCase.execute(dto);

    expect(apPeriodEndInterface.getApPeriodEnd).toHaveBeenCalledWith(
      "99",
      "999888777"
    );
    expect(result).toEqual(mockResult);
  });
});
