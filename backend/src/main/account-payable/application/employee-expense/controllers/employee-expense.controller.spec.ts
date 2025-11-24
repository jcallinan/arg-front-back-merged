import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeExpenseController } from './employee-expense.controller';
import { GenerateReportEmployeeExpenseUsecase } from '../usecases/generate-report/generate-report.usecase';
import { EmployeeExpenseReportUsecase } from '../usecases/employee-expense-reports/employee-expense-reports.usecase';
import { employeeExpenseGenerateReportDto } from '../dto/employee-expense.dto';

describe('EmployeeExpenseController', () => {
  let controller: EmployeeExpenseController;
  let generateReportUsecase: GenerateReportEmployeeExpenseUsecase;
  let employeeExpenseReportUsecase: EmployeeExpenseReportUsecase;

  const mockGenerateReportUsecase = {
    execute: jest.fn(),
  };

  const mockEmployeeExpenseReportUsecase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeExpenseController],
      providers: [
        { provide: GenerateReportEmployeeExpenseUsecase, useValue: mockGenerateReportUsecase },
        { provide: EmployeeExpenseReportUsecase, useValue: mockEmployeeExpenseReportUsecase },
      ],
    }).compile();

    controller = module.get<EmployeeExpenseController>(EmployeeExpenseController);
    generateReportUsecase = module.get<GenerateReportEmployeeExpenseUsecase>(GenerateReportEmployeeExpenseUsecase);
    employeeExpenseReportUsecase = module.get<EmployeeExpenseReportUsecase>(EmployeeExpenseReportUsecase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateReportEmployeeExpense', () => {
    it('should call generateReportUsecase with correct data and return result', async () => {
      const dto: employeeExpenseGenerateReportDto = {
        companyNo: 10,
        voucherToPay: 'E',
        batch: 99,
        bankGlNo: 62890262,
        dateToPay: 20251125,
      };

      const result = { success: true, reportId: 'ABC123' };
      mockGenerateReportUsecase.execute.mockResolvedValue(result);

      const response = await controller.generateReportEmployeeExpense(dto);

      expect(mockGenerateReportUsecase.execute).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });

  describe('getEmployeeExpenseReports', () => {
    it('should call employeeExpenseReportUsecase and return result', async () => {
      const reportData = [{ id: 1, name: 'Report 1' }, { id: 2, name: 'Report 2' }];
      mockEmployeeExpenseReportUsecase.execute.mockResolvedValue(reportData);

      const response = await controller.getEmployeeExpenseReports();

      expect(mockEmployeeExpenseReportUsecase.execute).toHaveBeenCalled();
      expect(response).toEqual(reportData);
    });
  });
});
