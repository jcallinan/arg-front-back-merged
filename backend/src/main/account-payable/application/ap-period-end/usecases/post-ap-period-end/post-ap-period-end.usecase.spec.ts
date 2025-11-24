// post-ap-period-end.usecase.spec.ts

import { PostApPeriodEndUsecase } from "./post-ap-period-end.usecase";
import { ApPeriodEndInterface } from "@src/main/account-payable/domain/interface/ap-period-end.interface";
import { apPeriodEndBodyDto } from "../../dto/ap-period-end.dto";

describe("PostApPeriodEndUsecase", () => {
  let useCase: PostApPeriodEndUsecase;
  let apPeriodEndInterface: jest.Mocked<ApPeriodEndInterface>;

  beforeEach(() => {
    apPeriodEndInterface = {
      postApPeriodEnd: jest.fn(),
    } as jest.Mocked<ApPeriodEndInterface>;

    useCase = new PostApPeriodEndUsecase(apPeriodEndInterface);
  });

  it("should post AP period end successfully", async () => {
    const dto: apPeriodEndBodyDto = {
      ctl: "10",
      tin: "123456789",
      data: {
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
      },
    };

    const mockResult = { message: "AP period end posted successfully" };
    apPeriodEndInterface.postApPeriodEnd.mockResolvedValue(mockResult);

    const result = await useCase.execute(dto);

    expect(apPeriodEndInterface.postApPeriodEnd).toHaveBeenCalledWith(
      "10",
      "123456789",
      dto.data
    );
    expect(result).toEqual(mockResult);
  });

  it("should handle errors from interface", async () => {
    const dto: apPeriodEndBodyDto = {
      ctl: "10",
      tin: "123456789",
      data: {
        recordType: "A",
        paymentYear: 2024,
        combineFedStateFiler: "Y",
        blank01: "",
        taxPayerId: 123456789,
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
      },
    };

    apPeriodEndInterface.postApPeriodEnd.mockRejectedValue(
      new Error("Database connection failed")
    );

    await expect(useCase.execute(dto)).rejects.toThrow(
      "Database connection failed"
    );
  });

  it("should log the correct message", async () => {
    const dto: apPeriodEndBodyDto = {
      ctl: "20",
      tin: "987654321",
      data: {
        recordType: "B",
        paymentYear: "2024",
        correctedReturnIndicator: "1",
        nameControl: "ABCD",
        typeOfTIN: "1",
        taxPayerId: "987654321",
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
      },
    };

    const mockResult = { message: "AP period end posted successfully" };
    apPeriodEndInterface.postApPeriodEnd.mockResolvedValue(mockResult);

    const logSpy = jest.spyOn(useCase["logger"], "log");

    await useCase.execute(dto);

    expect(logSpy).toHaveBeenCalledWith(
      "Fetch data from flat files ctl: 20, tin: 987654321"
    );
  });
});
