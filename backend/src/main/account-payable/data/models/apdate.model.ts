import { Model } from "@sequelize/core";
import { Sequelize } from "@sequelize/core";
import { apdateSchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";

export class ApdateModel extends Model {
  public isDeleted!: string;
  public companyNo!: number;
  public calculatedDate!: number;
  public newDate!: number;
}

export function initializeApdate(sequelize: Sequelize): void {
  initializeModel(sequelize, ApdateModel, "Apdate", apdateSchema);
}
