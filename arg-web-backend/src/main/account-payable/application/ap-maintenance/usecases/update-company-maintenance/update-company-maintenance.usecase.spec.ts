import { Test, TestingModule } from "@nestjs/testing";
import { UpdateCompanyMaintenanceUseCase } from "./update-company-maintenance.usecase";
import { CompanyInterface } from "@src/main/account-payable/domain/interface/company.interface";

describe("UpdateCompanyMaintenanceUseCase", () => {
  let useCase: UpdateCompanyMaintenanceUseCase;
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
        UpdateCompanyMaintenanceUseCase,
        { provide: "CompanyInterface", useValue: mockRepo },
      ],
    }).compile();

    useCase = module.get(UpdateCompanyMaintenanceUseCase);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should call repo.update with partial fields and return updated company", async () => {
    const dto: any = { companyNo: 10, companyName: "XYZ" };
    const updated = { companyNo: 10, companyName: "XYZ" } as any;
    mockRepo.update.mockResolvedValue(updated);

    const result = await useCase.execute(dto);
    expect(result).toEqual(updated);
    expect(mockRepo.update).toHaveBeenCalledWith(10, { companyName: "XYZ" });
  });
});
