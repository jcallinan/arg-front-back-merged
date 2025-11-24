import { CarrierInvoiceHeaderModel } from "@src/main/account-payable/data/models/carrier-invoice-header.model";
import { CarrierInvoiceHeaderEntity } from "@src/main/account-payable/domain/entities/carrier-invoice-header.entity";

export class CarrierInvoiceHeaderMapper {
  static toEntity(
    record: CarrierInvoiceHeaderModel,
  ): CarrierInvoiceHeaderEntity {
    return new CarrierInvoiceHeaderEntity(
      record.isDeleted,
      record.companyNo,
      record.carrierId,
      record.carrierInvoiceNumber,
      record.invoiceType,
      record.invoiceDate,
      record.invoiceAmount,
      record.orderNumber,
      record.shippingReferenceNumber,
      record.dateTimeStamp,
      record.carrierInvoiceStatus,
      record.orderOverrideTotal,
      record.filler1,
      record.approvalStatus,
      record.approvalDateTime,
      record.apInvoiceStatus,
      record.apDateTime,
      record.carrierUserId,
      record.billingType,
      record.carrierIpAddress,
      record.vendorNo,
      record.checkNumber,
      record.checkDate,
      record.voucherAmount,
      record.filler2,
    );
  }
}
