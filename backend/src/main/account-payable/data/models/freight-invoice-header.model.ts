// import { Model, Sequelize } from "@sequelize/core";
import { Model } from "@sequelize/core";
import { Sequelize } from "@sequelize/core";
import { freightInvoiceHeaderSchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";
import { CarrierInvoiceHeaderModel } from './carrier-invoice-header.model';
export class FreightInvoiceHeaderModel extends Model {
  public isDeleted!: string;
  public companyNo!: number;
  public carrierId!: string;
  public carrierInvoiceNo!: string;
  public invoiceType!: string;
  public invoiceDate!: number;
  public invoiceAmount!: number;
  public ourOrderNo!: number;
  public shippingReferenceNo!: number;
  public dateTimeStamp!: string;
  public carrierInvoiceStatus!: string;
  public freightBalanceOverrideTotal!: number;
  public filler1!: string;
  public approvalStatus!: string;
  public approvalDateTime!: string;
  public apInvoiceStatus!: string;
  public apDateTime!: string;
  public carrierUserId!: string;
  public billingType!: string;
  public carrierIpAddress!: string;
  public vendorNo!: string;
  public checkNumber!: number;
  public checkDate!: number;
  public voucherAmount!: number;
  public filler2!: string;
  
  static associate() {
    FreightInvoiceHeaderModel.hasOne(CarrierInvoiceHeaderModel, {
      as: "carrierInvoices",
      foreignKey: "carrierInvoiceNumber", // column in CarrierInvoiceHeader
      sourceKey: "carrierInvoiceNo",      // column in FreightInvoiceHeader
    });
  }
}
export function initializeFreightInvoiceHeader(sequelize: Sequelize): void {
  initializeModel(
    sequelize,
    FreightInvoiceHeaderModel,
    "FreightInvoiceHeader",
    freightInvoiceHeaderSchema,
  );
}
