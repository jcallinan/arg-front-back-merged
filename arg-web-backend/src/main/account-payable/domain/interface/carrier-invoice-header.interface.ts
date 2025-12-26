import { CarrierInvoiceHeaderEntity } from "@src/main/account-payable/domain/entities/carrier-invoice-header.entity";

export interface CarrierInvoiceHeaderInterface {
  findByCompanyNo(companyNo: number): Promise<CarrierInvoiceHeaderEntity[]>;
  findByCompanyAndCarrier(
    companyNo: number,
    carrierId?: string,
    carrierInvoiceNumber?: string,
    orderNo?: number | string,
  ): Promise<CarrierInvoiceHeaderEntity | null>;

  updateInvoiceStatus(orderNo: number, companyNo: number, carrierId: string, carrierInvoiceNumber: string): Promise<any>
}
