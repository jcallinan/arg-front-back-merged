import { Model } from "@sequelize/core";
import { Sequelize } from "@sequelize/core";
import { billingControlFileSchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";

export class BillingControlFileModel extends Model {
  public isDeleted!: string;
  public companyNo!: number;
  public companyName!: string;
  public nextOrderNumbe!: number;
  public inventoryGl!: number;
  public cogsGl!: number;
  public freightGl!: number;
  public miscGl!: number;
  public nextInvoiceNum!: number;
  public minOrderAmt!: number;
  public salesGl!: number;
  public invoicingSytl!: string;
  public nextBolNumber!: number;
  public nextInvOrderNumber!: number;
  public outagePercent!: number;
  public nextMemoInvoic!: number;
  public cusAgreeMntPw!: string;
  public addressLine1!: string;
  public addressLine2!: string;
  public daysForDupOrderCheck!: number;
  public bicuagSequenceNumber!: number;
  public rackPricePassword!: string;
  public tollingGl!: number;
  public collectFreightServiceFee!: number;
  public filler!: string;
}

export function initializeBillingControlFile(sequelize: Sequelize): void {
  initializeModel(sequelize, BillingControlFileModel, "BillingControlFile", billingControlFileSchema);
}
