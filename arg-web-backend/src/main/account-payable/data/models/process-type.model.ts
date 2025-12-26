import { Model } from "@sequelize/core";
import { Sequelize } from "@sequelize/core";
import { ProcessTypeSchema } from "../schemas/schema"; // Adjust the import path as needed
import { initializeModel } from "@src/shared/config/model-initializer";

export class ProcessTypeModel extends Model {
  public reportName!: string;
  public sharedReport!: string;
  public definitionName!: string;
  public reportGroup!: string;
  public friendlyName!: string;
  public path!: string;
}

export function initializeProcessType(sequelize: Sequelize): void {
  initializeModel(sequelize, ProcessTypeModel, "ProcessType", ProcessTypeSchema);
}
