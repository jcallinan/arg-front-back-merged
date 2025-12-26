import { Sequelize, Model } from "@sequelize/core";
import { initializeModel } from "@src/shared/config/model-initializer";
import { ownerVendorReferenceSchema } from "../schemas/schema";
import { VendorModel } from "./vendor.model";

export class OwnerVendorReferenceModel extends Model {
  public ownerNo!: number;
  public vendorNo!: number;
  public isDeleted!: string;
  public filler!: string;

  static associate() {
    OwnerVendorReferenceModel.belongsTo(VendorModel, {
      foreignKey: 'vendorNo',
      targetKey: 'vendorNo',
      as: 'vendorDetails',
    });
  }
}


export function initializeOwnerVendorReference(sequelize: Sequelize): void {
  initializeModel(
    sequelize,
    OwnerVendorReferenceModel,
    "OwnerVendorReference",
    ownerVendorReferenceSchema
  );
}
