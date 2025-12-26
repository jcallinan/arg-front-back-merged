import { GapptUserModel } from "../../../main/account-payable/data/models/gappt-user.dynamic.model";
import { VendorModel } from "../../../main/account-payable/data/models/vendor.model";
import { Model, ModelAttributes } from "@sequelize/core";
import { gapptUserSchema, vendorSchema } from "../../../main/account-payable/data/schemas/schema";

export interface Metadata {
  referenceModel?: typeof Model;
  schema: ModelAttributes<Model, any>;
  suffix?: string;
  prefix?: string;
  sourceTable?: string;
  sourceTableSchema?: string; // Optional: different schema for source table
}
export interface DynamicTableMetadata {
  name?: string;
  description: string;
  defaultSchema: string;
  metadata: Metadata;
}

export const DYNAMIC_TABLE_REGISTRY: Record<string, DynamicTableMetadata> = {
  GapptUser: {
    description: "GAPPT is base table for all table , user is dynamic suffix",
    defaultSchema: "workDataLib",
    metadata: {
      referenceModel: GapptUserModel,
      prefix: "GAPPT",
      suffix: '',
      sourceTable: "",
      schema: gapptUserSchema
    },
  },
  VendorYear: {
    description: "Venddor is base table for all table , year is dynamic suffix",
    defaultSchema: "workDataLib",
    metadata: {
      sourceTableSchema: "dataLib", // APVEND source table is in dataLib, not workDataLib
      referenceModel: VendorModel,
      prefix: "APVN",
      sourceTable: "APVEND",
      suffix: '',
      schema: vendorSchema
    },
  },
} as const;

export type DynamicTableName = keyof typeof DYNAMIC_TABLE_REGISTRY;
