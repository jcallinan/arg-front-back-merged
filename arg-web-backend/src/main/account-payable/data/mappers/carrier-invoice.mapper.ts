import { CarrierInvoiceResponseDto } from "@src/main/account-payable/application/voucher/dto/voucher.dto";
import { FreightInvoiceHeaderModel } from "../models/freight-invoice-header.model";

export function toCarrierInvoiceResponseDto(
  invoice: FreightInvoiceHeaderModel,
  ordShipDate: string | number | null
): CarrierInvoiceResponseDto {
  return {
    carrierId: invoice.carrierId.trim(),
    carrierInvoiceNo: invoice.carrierInvoiceNo.trim(),
    ordShipDate: ordShipDate ? String(ordShipDate) : '',
    invoiceType: invoice.invoiceType,
    ourOrderNo: invoice.ourOrderNo,
    shippingReferenceNo: invoice.shippingReferenceNo,
    invoiceAmount: invoice.invoiceAmount,
    invoiceDate: invoice.invoiceDate
  };
}
