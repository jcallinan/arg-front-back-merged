import { Test, TestingModule } from "@nestjs/testing";
import { GetCompanyMaintenanceUseCase } from "./get-company-maintenance.usecase";
import { CompanyInterface } from "@src/main/account-payable/domain/interface/company.interface";

describe("GetCompanyMaintenanceUseCase", () => {
  let useCase: GetCompanyMaintenanceUseCase;
  const mockRepo: jest.Mocked<CompanyInterface> = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    updateNextEntryNo: jest.fn(),
    update: jest.fn(),
    cacheAllCompanies: jest.fn(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCompanyMaintenanceUseCase,
        { provide: "CompanyInterface", useValue: mockRepo },
      ],
    }).compile();

    useCase = module.get(GetCompanyMaintenanceUseCase);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should return company from repo", async () => {
    const dto: any = { companyNo: 10 };
    const company = { companyNo: 10, companyName: "ABC" } as any;
    mockRepo.findOne.mockResolvedValue(company);

    const result = await useCase.execute(dto);
    expect(result).toEqual(company);
    expect(mockRepo.findOne).toHaveBeenCalledWith(10);
  });
});
