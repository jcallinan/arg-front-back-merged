import { Model } from "@sequelize/core";
import { Sequelize } from "@sequelize/core";
import { spInfoSchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";

export class SpInfoModel extends Model {
  public reportName!: string;
  public fieldKey!: string;
  public fieldDescription!: string;
  public fieldComponent!: string;
  public fieldDataType!: string;
  public fieldSequence!: number;
  public variableType!: string;
  public xmlMetadata!: string;
  public storedProcedureName!: string;
  public spSequence!: number;
  public fieldLength!: string | null;
  public isApiCall!: string;
  public apiEndpoint!: string;
  public status!: string;
  public useCase!: string;
}

export function initializeSpInfo(sequelize: Sequelize): void {
  initializeModel(sequelize, SpInfoModel, "SpInfo", spInfoSchema);
} 