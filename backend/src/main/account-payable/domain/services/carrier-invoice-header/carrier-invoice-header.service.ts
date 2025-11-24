import { Injectable, Inject } from "@nestjs/common";
import { CarrierInvoiceHeaderInterface } from "@src/main/account-payable/domain/interface/carrier-invoice-header.interface";
import { CarrierInvoiceHeaderEntity } from "@src/main/account-payable/domain/entities/carrier-invoice-header.entity";

@Injectable()
export class CarrierInvoiceHeaderService {
  constructor(
    @Inject("CarrierInvoiceHeaderRepository")
    private readonly carrierInvoiceHeaderRepository: CarrierInvoiceHeaderInterface,
  ) { }

  async getCarrierInvoiceHeaderRecord(
    companyNo: number,
    carrierId?: string,
    carrierInvoiceNumber?: string,
    orderNo?: number | string,
  ): Promise<CarrierInvoiceHeaderEntity | null> {
    // Use optimized database query instead of loading all records
    return await this.carrierInvoiceHeaderRepository.findByCompanyAndCarrier(
      companyNo,
      carrierId,
      carrierInvoiceNumber,
      orderNo,
    );
  }
}


