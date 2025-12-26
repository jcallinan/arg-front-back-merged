import { Model } from "@sequelize/core";
import { Sequelize } from "@sequelize/core";
import { VendorContactDetailSchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";
import { VendorModel } from "./vendor.model";

export class VendorContactDetailModel extends Model {
  public deleteCode!: string;
  public companyNo!: number;
  public vendorNo!: number;
  public formType!: string;
  public sequenceNumber!: number;
  public contactName!: string;
  public emailAddress!: string;
  public faxNumber!: string;
  public sendAchEmail!: string;
  public filler!: string;

  static associate() {
    VendorContactDetailModel.belongsTo(VendorModel, {
      foreignKey: 'vendorNo',
      targetKey: 'vendorNo',
      as: 'vendorContactDetails',
    });

  }
}

export function initializeVendorContactDetail(sequelize: Sequelize): void {
  initializeModel(sequelize, VendorContactDetailModel, "VendorContactDetail", VendorContactDetailSchema);
}
