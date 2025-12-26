import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeExpenseReportUsecase } from './employee-expense-reports.usecase';
import { SpooledMetaDataReportInterface } from '@src/main/account-payable/domain/interface/spooled-meta-data-report.interface';
import { Report_Type } from '@src/shared/constants/constant';
import { SpooledMetaDataReportEntity } from '@src/main/account-payable/domain/entities/spooled-meta-data-report.entity';

describe('EmployeeExpenseReportUsecase', () => {
  let usecase: EmployeeExpenseReportUsecase;
  let spooledMetaDataReportInterface: jest.Mocked<SpooledMetaDataReportInterface>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeExpenseReportUsecase,
        {
          provide: 'SpooledMetaDataReportInterface',
          useValue: {
            SpooledMetadataReports: jest.fn(),
          },
        },
      ],
    }).compile();

    usecase = module.get<EmployeeExpenseReportUsecase>(EmployeeExpenseReportUsecase);
    spooledMetaDataReportInterface = module.get('SpooledMetaDataReportInterface');
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('execute', () => {
    it('should return paginated response with employee expense reports', async () => {
      const mockReports: SpooledMetaDataReportEntity[] = [
        new SpooledMetaDataReportEntity(
          'file1.pdf',
          'spool1',
          Report_Type.EMPLOYEE_EXPENSE,
          'Job1',
          123,
          'user1',
          'system1',
          '/path/to/file1',
          'queue1',
          'library1',
          new Date(),
          'form1',
          '',
        ),
      ];

      const mockResult = {
        reports: mockReports,
        count: 1,
        limit: 10,
        page: 1,
      };

      spooledMetaDataReportInterface.SpooledMetadataReports.mockResolvedValue(mockResult);

      const result = await usecase.execute();

      expect(spooledMetaDataReportInterface.SpooledMetadataReports).toHaveBeenCalledWith({
        reportType: [Report_Type.EMPLOYEE_EXPENSE],
      });

      expect(result).toEqual({
        items: mockReports,
        pagination: {
          total_items: 1,
          current_page: 1,
          items_per_page: 10,
          total_pages: 1,
        },
      });
    });

    it('should return empty paginated response if no reports found', async () => {
      const mockResult = {
        reports: [],
        count: 0,
        limit: 10,
        page: 1,
      };

      spooledMetaDataReportInterface.SpooledMetadataReports.mockResolvedValue(mockResult);

      const result = await usecase.execute();

      expect(result).toEqual({
        items: [],
        pagination: {
          total_items: 0,
          current_page: 1,
          items_per_page: 10,
          total_pages: 0,
        },
      });
    });

    it('should throw error if interface fails', async () => {
      spooledMetaDataReportInterface.SpooledMetadataReports.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(usecase.execute()).rejects.toThrow('Database error');
    });
  });
});
