import { Model } from "@sequelize/core";
import { Sequelize } from "@sequelize/core";
import { generalSystemCompanySchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";

export class GeneralSystemCompanyModel extends Model {
  public fixedAssets!: string;
  public orderEntryInvoicing!: string;
  public salesAnalysis!: string;
  public inventory!: string;
  public purchaseOrder!: string;
  public billOfMaterial!: string;
  public jobShop!: string;
  public jobCost!: string;
  public filler1!: string;
  public multiWarehouseYn!: string;
  public thirteenAccountingPeriodsYn!: string;
  public fractionalQtyActive!: string;
  public apPostOverrideCode!: number;
  public arPostOverrideCode!: number;
  public faPostOverrideCode!: number;
  public glPostOverrideCode!: number;
  public companyNo!: number;
  public filler2!: string;
}

export function initializeGeneralSystemCompany(sequelize: Sequelize): void {
  initializeModel(sequelize, GeneralSystemCompanyModel, "GeneralSystemCompany", generalSystemCompanySchema);
} 