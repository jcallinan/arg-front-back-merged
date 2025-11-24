import { Model, Sequelize } from "@sequelize/core";
import { clearchecksSchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";

export class ClearchecksModel extends Model {
  public dORV!: string;
  public companyNo!: number;
  public bankGlNumber!: number;
  public checkNumber!: number;
  public vendorNo!: number;
  public checkAmount!: number;
  public checkDate!: number;
  public clearDate!: number;
  public vendorName!: string;
  public checkDate1!: number;
  public clearDate1!: number;
  public origChkAmt!: number;
  public filler!: string;
}

export function initializeClearchecks(sequelize: Sequelize): void {
  initializeModel(
    sequelize,
    ClearchecksModel,
    "Clearchecks",
    clearchecksSchema
  );
}
