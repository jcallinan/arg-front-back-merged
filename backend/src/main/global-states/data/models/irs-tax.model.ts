import { Model, Sequelize } from "@sequelize/core";
import { irsTaxSchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";

export class IRSTaxModel extends Model {
  public irsTax!: string; // maps to IRSTAX column
}

export function initializeIRSTax(sequelize: Sequelize): void {
  initializeModel(
    sequelize,
    IRSTaxModel,
    "IRSTax",         // friendly model name
    irsTaxSchema,     // schema definition
  );
}