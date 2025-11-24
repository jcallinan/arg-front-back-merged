import { Injectable, Inject } from "@nestjs/common";
import { FreightInvoiceHeaderInterface } from "@src/main/account-payable/domain/interface/freight-invoice-header.interface";
import { FreightInvoiceHeaderEntity } from "@src/main/account-payable/domain/entities/freight-invoice-header.entity";

@Injectable()
export class FreightInvoiceHeaderService {

  constructor(
    @Inject("FreightInvoiceHeaderRepository")
    private readonly freightInvoiceHeaderRepository: FreightInvoiceHeaderInterface,
  ) { }

  async getFreightInvoiceHeaderRecord(
    companyNo: number,
    carrierId?: string,
    carrierInvoiceNo?: string,
  ): Promise<FreightInvoiceHeaderEntity | null> {
    // Use optimized database query instead of loading all records
    return await this.freightInvoiceHeaderRepository.findByCompanyAndCarrier(
      companyNo,
      carrierId,
      carrierInvoiceNo,
    );
  }

  async getBulkFreightInvoiceHeaderRecords(
    requests: Array<{ companyNo: number; carrierId?: string; carrierInvoiceNo: string }>,
  ): Promise<Map<string, FreightInvoiceHeaderEntity>> {
    return await this.freightInvoiceHeaderRepository.findMultiple(requests);
  }

  async cacheAllFreightInvoiceHeaderForCompany(companyNo: number): Promise<void> {
    await this.freightInvoiceHeaderRepository.cacheAllFreightInvoiceHeaderForCompany(companyNo);
  }
  async cacheFreightInvoiceHeaderForCompany(companyNo: number) {
    const startTime = Date.now();

    try {
      await this.cacheAllFreightInvoiceHeaderForCompany(companyNo);

      const duration = Date.now() - startTime;

      return {
        success: true,
        duration,
        totalFreightInvoices: 'N/A', // FreightInvoice count is determined during caching
        cachedFreightInvoices: 'All freight invoices',
        message: `FreightInvoice records cached successfully for company ${companyNo}`,
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      return {
        success: false,
        duration,
        totalFreightInvoices: 0,
        cachedFreightInvoices: 0,
        message: `Failed to cache FreightInvoice records for company ${companyNo}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
}
