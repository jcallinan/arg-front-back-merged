import { Model, Sequelize } from "@sequelize/core";
import { initializeModel } from "@src/shared/config/model-initializer";
import { carrierInvoiceHeaderSchema } from "../schemas/schema";
import { FreightInvoiceHeaderModel } from "./freight-invoice-header.model";

export class CarrierInvoiceHeaderModel extends Model {
  public isDeleted!: string;
  public companyNo!: number;
  public carrierId!: string;
  public carrierInvoiceNumber!: string;
  public invoiceType!: string;
  public invoiceDate!: number;
  public invoiceAmount!: number;
  public orderNumber!: number;
  public shippingReferenceNumber!: number;
  public dateTimeStamp!: string;
  public carrierInvoiceStatus!: string;
  public orderOverrideTotal!: number;
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
    CarrierInvoiceHeaderModel.belongsTo(FreightInvoiceHeaderModel, {
      as: "freightInvoice",
      foreignKey: "carrierInvoiceNumber",
      targetKey: "carrierInvoiceNo",
    });
  }
  
}
export function initializeCarrierInvoiceHeader(sequelize: Sequelize): void {
  initializeModel(
    sequelize,
    CarrierInvoiceHeaderModel,
    "CarrierInvoiceHeader",
    carrierInvoiceHeaderSchema,
  );
}
