import { Model, Sequelize } from "@sequelize/core";
import { nachaForAchPaymentsSchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";

// Define the NachaForAchPayments model class
export class NachaForAchPaymentsModel extends Model {
  public achOutput!: string; // maps to RECACH
}

// Initializer
export function initializeNachaForAchPayments(sequelize: Sequelize): void {
  initializeModel(
    sequelize,
    NachaForAchPaymentsModel,
    "NachaForAchPayments", // friendly name
    nachaForAchPaymentsSchema // schema definition
  );
}
