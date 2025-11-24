import { Test, TestingModule } from "@nestjs/testing";
import { APMaintenanceController } from "./ap-maintenance.controller";
import { GetCompanyMaintenanceUseCase } from "../usecases/get-company-maintenance/get-company-maintenance.usecase";
import { UpdateCompanyMaintenanceUseCase } from "../usecases/update-company-maintenance/update-company-maintenance.usecase";

describe("APMaintenanceController", () => {
  let controller: APMaintenanceController;

  const mockGetCompanyMaintenanceUseCase = { execute: jest.fn() };
  const mockUpdateCompanyMaintenanceUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [APMaintenanceController],
      providers: [
        {
          provide: GetCompanyMaintenanceUseCase,
          useValue: mockGetCompanyMaintenanceUseCase,
        },
        {
          provide: UpdateCompanyMaintenanceUseCase,
          useValue: mockUpdateCompanyMaintenanceUseCase,
        },
      ],
    }).compile();

    controller = module.get<APMaintenanceController>(APMaintenanceController);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getCompanyData", () => {
    it("should return simple response from use case", async () => {
      const query = { companyNo: 10 } as any;
      const payload = { companyNo: 10, companyName: "ABC" };
      mockGetCompanyMaintenanceUseCase.execute.mockResolvedValue(payload);

      const result = await controller.getCompanyData(query);
      expect(result).toEqual({ items: payload });
      expect(mockGetCompanyMaintenanceUseCase.execute).toHaveBeenCalledWith(
        query
      );
    });
  });

  describe("updateCompanyData", () => {
    it("should return simple response from update use case", async () => {
      const body = { companyNo: 10, companyName: "XYZ" } as any;
      const payload = { companyNo: 10, companyName: "XYZ" };
      mockUpdateCompanyMaintenanceUseCase.execute.mockResolvedValue(payload);

      const result = await controller.updateCompanyData(body);
      expect(result).toEqual({ items: payload });
      expect(mockUpdateCompanyMaintenanceUseCase.execute).toHaveBeenCalledWith(
        body
      );
    });
  });
});
