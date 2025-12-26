import { Model, ModelStatic } from "sequelize-typescript";
import { TableName } from "@src/shared/config/constants/table-registry";

export interface ModelConfig {
  model: ModelStatic<Model>;
  schema: any;
  tableName: TableName;
} 