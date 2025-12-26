// DropdownOption is not used in this factory
import { SpooledMetaDataReportEntity } from "@src/main/account-payable/domain/entities/spooled-meta-data-report.entity";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import {
  PAYMENT_OPERATION_MODE,
  PAYMENT_STORE_PROCEDURE,
} from "@src/shared/constants/payment-constant";
import { PAYMENT_REPORT_TYPES } from "@src/shared/constants/constant";

export interface PaymentTypeResponseFactoryOptions {
  message?: string;
  results: Array<{
    mode: string;
    spName: string;
    output: { errVar: string };
  }>;
}

export interface SpooledMetaDataReportFactoryOptions {
  reportType?: string;
  spoolFileName?: string;
  pdfFileName?: string;
  reportDateTime?: Date;
  filePath?: string;
  jobName?: string;
  jobNumber?: number;
  jobUser?: string;
  jobSystemName?: string;
  outputQueueName?: string;
  outputQueueLibrary?: string;
  formType?: string;
  error?: string;
}

export interface PaginationOptions {
  total_items?: number;
  current_page?: number;
  items_per_page?: number;
  total_pages?: number;
}

export class PaymentFactory {
  /**
   * Creates a basic payment type response with default values
   */
  static createPaymentTypeResponse(
    overrides: Partial<PaymentTypeResponseFactoryOptions> = {}
  ) {
    const defaultResponse: PaymentTypeResponseFactoryOptions = {
      message: "Payment type selection submitted successfully",
      results: [
        {
          mode: PAYMENT_OPERATION_MODE.SAVE,
          spName: PAYMENT_STORE_PROCEDURE.AP150ACLPRC,
          output: {
            errVar: "File GAPPT** created successfully",
          },
        },
        {
          mode: PAYMENT_OPERATION_MODE.SAVE,
          spName: PAYMENT_STORE_PROCEDURE.APPYTRHCLPRC,
          output: {
            errVar: "Program APPYTRHCL executed successfully",
          },
        },
      ],
    };

    return { ...defaultResponse, ...overrides };
  }

  /**
   * Creates a basic spooled meta data report entity with default values
   */
  static createSpooledMetaDataReport(
    overrides: Partial<SpooledMetaDataReportFactoryOptions> = {}
  ): SpooledMetaDataReportEntity {
    const defaultReport: SpooledMetaDataReportFactoryOptions = {
      reportType: PAYMENT_REPORT_TYPES.AP_Cash_Requirement,
      spoolFileName: "my-report.pdf",
      pdfFileName: "my-report.pdf",
      reportDateTime: new Date("2025-07-25T10:35:44.835Z"),
      filePath: "/files/my-report.pdf",
      jobName: "my-report",
      jobNumber: 1,
      jobUser: "my-user",
      jobSystemName: "my-system",
      outputQueueName: "my-queue",
      outputQueueLibrary: "my-library",
      formType: "my-form",
      error: "my-error",
    };

    return { ...defaultReport, ...overrides } as SpooledMetaDataReportEntity;
  }

  /**
   * Creates a paginated response for spooled meta data reports
   */
  static createPaginatedSpooledMetaDataResponse(
    items: SpooledMetaDataReportEntity[],
    pagination: PaginationOptions
  ): PaginatedResponse<SpooledMetaDataReportEntity> {
    return {
      items,
      pagination: {
        total_items: pagination.total_items || items.length,
        current_page: pagination.current_page || 1,
        items_per_page: pagination.items_per_page || 10,
        total_pages:
          pagination.total_pages ||
          Math.ceil(
            (pagination.total_items || items.length) /
              (pagination.items_per_page || 10)
          ),
      },
    };
  }

  /**
   * Creates a cash requirement report response
   */
  static createCashRequirementResponse(
    overrides: Partial<SpooledMetaDataReportFactoryOptions> = {},
    paginationOverrides: Partial<PaginationOptions> = {}
  ): PaginatedResponse<SpooledMetaDataReportEntity> {
    const report = this.createSpooledMetaDataReport({
      reportType: PAYMENT_REPORT_TYPES.AP_Cash_Requirement,
      ...overrides,
    });

    return this.createPaginatedSpooledMetaDataResponse([report], {
      total_items: 34,
      current_page: 1,
      items_per_page: 10,
      total_pages: 4,
      ...paginationOverrides,
    });
  }

  /**
   * Creates an AP check report response
   */
  static createApCheckResponse(
    overrides: Partial<SpooledMetaDataReportFactoryOptions> = {},
    paginationOverrides: Partial<PaginationOptions> = {}
  ): PaginatedResponse<SpooledMetaDataReportEntity> {
    const report = this.createSpooledMetaDataReport({
      reportType: PAYMENT_REPORT_TYPES.AP_Check_Printing,
      ...overrides,
    });

    return this.createPaginatedSpooledMetaDataResponse([report], {
      total_items: 25,
      current_page: 1,
      items_per_page: 10,
      total_pages: 3,
      ...paginationOverrides,
    });
  }

  /**
   * Creates multiple spooled meta data reports for testing pagination
   */
  static createMultipleSpooledMetaDataReports(
    count: number,
    baseOverrides: Partial<SpooledMetaDataReportFactoryOptions> = {}
  ): SpooledMetaDataReportEntity[] {
    return Array.from({ length: count }, (_, index) =>
      this.createSpooledMetaDataReport({
        ...baseOverrides,
        jobNumber: index + 1,
        jobName: `job-${index + 1}`,
        spoolFileName: `report-${index + 1}.pdf`,
        pdfFileName: `report-${index + 1}.pdf`,
      })
    );
  }
}
