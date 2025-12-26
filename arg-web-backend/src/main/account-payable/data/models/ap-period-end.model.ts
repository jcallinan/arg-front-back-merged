import { Model } from "@sequelize/core";
import { Sequelize } from "@sequelize/core";
import { Ap1099IModelSchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";

export class ApPeriodEndModel extends Model {
  public f00001Text!: string;
  public k00001Text!: string;
  public k00002Text!: string;
  public k00003Text!: string;
}

export function initializeApPeriodEnd(sequelize: Sequelize): void {
  initializeModel(sequelize, ApPeriodEndModel, "ApPeriodEnd", Ap1099IModelSchema);
}
