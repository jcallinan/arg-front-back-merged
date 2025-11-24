import { FreightInvoiceHeaderModel } from "@src/main/account-payable/data/models/freight-invoice-header.model";
import { FreightInvoiceHeaderEntity } from "@src/main/account-payable/domain/entities/freight-invoice-header.entity";

export class FreightInvoiceHeaderMapper {
  static toEntity(
    record: FreightInvoiceHeaderModel,
  ): FreightInvoiceHeaderEntity {
    return new FreightInvoiceHeaderEntity(
      record.isDeleted,
      record.companyNo,
      record.carrierId,
      record.carrierInvoiceNo,
      record.invoiceType,
      record.invoiceDate,
      record.invoiceAmount,
      record.ourOrderNo,
      record.shippingReferenceNo,
      record.dateTimeStamp,
      record.carrierInvoiceStatus,
      record.freightBalanceOverrideTotal,
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
