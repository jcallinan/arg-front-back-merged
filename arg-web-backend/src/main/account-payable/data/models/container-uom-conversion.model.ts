import { Model } from "@sequelize/core";
import { Sequelize } from "@sequelize/core";
import { containerUnitofMeasureConversionSchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";

export class ContainerUnitofMeasureConversionModel extends Model {
  public isDeleted!: string;
  public companyNo!: number;
  public productCode!: string;
  public containerCode!: string;
  public unitOfMeasure!: string;
  public operandMultDiv!: string;
  public conversionFactor!: number;
  public hazMatYN!: string;
  public imsIssueUnitOfMeas!: string;
  public freightExpenseGl!: number;
  public filler!: string;
}

export function initializeContainerUnitofMeasureConversion(sequelize: Sequelize): void {
  initializeModel(sequelize, ContainerUnitofMeasureConversionModel, "ContainerUnitofMeasureConversion", containerUnitofMeasureConversionSchema);
}
