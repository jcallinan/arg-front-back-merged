// get-company-details.usecase.spec.ts

import { GetCompanyDetailsUseCase } from "./get-company-details.usecase";
import { CompanyInterface } from "@src/main/account-payable/domain/interface/company.interface";
import { Company } from "@src/main/account-payable/domain/entities/company.entity";
import { GetCompanyDetailsDto } from "../../dto/ap-period-end.dto";

describe("GetCompanyDetailsUseCase", () => {
  let useCase: GetCompanyDetailsUseCase;
  let companyRepository: jest.Mocked<CompanyInterface>;

  beforeEach(() => {
    companyRepository = {
      findOne: jest.fn(),
    } as jest.Mocked<CompanyInterface>;

    useCase = new GetCompanyDetailsUseCase(companyRepository);
  });

  it("should fetch company details successfully", async () => {
    const dto: GetCompanyDetailsDto = { companyNo: 10 };

    const mockCompany = Company.create({
      companyNo: 10,
      companyName: "Test Company",
      companyApGlNo: 111,
      companyBankGlNo: 222,
      companyDiscountsGlNo: 333,
      companyIntercoGlNo: 444,
      companyNextPjJrnlNo: 10,
      companyNextCdJrnlNo: 20,
      companyNextCheckNo: 30,
      companyNextEntryNo: 40,
      companyNextVoucherNo: 50,
      companyPreEdChks: "Y",
      companyJobCostAct: "N",
      companyRetentionGlNo: 555,
      companyPoActive: "Y",
      companyEmployeeExpenseGlNo: 666,
      companyNextEeJrnlNo: 70,
      companyVendorNextEntryNo: 80,
      company99Name: "Dummy 99 Name",
      company99Address1: "Addr1",
      company99Address2: "Addr2",
      company99StateZip: "ST 12345",
      company99EinNumber: "99-1234567",
      company99EmployeeName: "John Doe",
      company99Phone: "123-456-7890",
      companyFiller: "",
      companyIsDeleted: "N",
    });

    companyRepository.findOne.mockResolvedValue(mockCompany);

    const result = await useCase.execute(dto);

    expect(companyRepository.findOne).toHaveBeenCalledWith(10);
    expect(result).toEqual(mockCompany);
    expect(result.isActive()).toBe(true);
  });


  it("should throw an error if repository throws", async () => {
    const dto: GetCompanyDetailsDto = { companyNo: 10 };
    companyRepository.findOne.mockRejectedValue(
      new Error("DB connection failed")
    );

    await expect(useCase.execute(dto)).rejects.toThrow("DB connection failed");
  });
});
