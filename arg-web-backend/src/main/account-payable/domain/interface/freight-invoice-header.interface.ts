import { GetCarrierInvoicesDto } from "../../application/voucher/dto/voucher.dto";
import { FreightInvoiceHeaderEntity } from "../entities/freight-invoice-header.entity";
import { CarrierInvoiceResponseDto } from "../../application/voucher/dto/voucher.dto";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";

export interface FreightInvoiceHeaderInterface {
  findByCompanyNo(companyNo: number): Promise<FreightInvoiceHeaderEntity[]>;
  findCarrierInvoices(dto: GetCarrierInvoicesDto): Promise<PaginatedResponse<CarrierInvoiceResponseDto>>;
  findByCompanyAndCarrier(
    companyNo: number,
    carrierId?: string,
    carrierInvoiceNo?: string,
  ): Promise<FreightInvoiceHeaderEntity | null>;

  findMultiple(
    requests: Array<{ companyNo: number; carrierId?: string; carrierInvoiceNo?: string }>,
  ): Promise<Map<string, FreightInvoiceHeaderEntity>>;

  cacheAllFreightInvoiceHeaderForCompany(companyNo: number): Promise<void>;
  updateInvoiceStatus(orderNo: number, companyNo: number, carrierId: string, carrierInvoiceNumber: string): Promise<any>
}
