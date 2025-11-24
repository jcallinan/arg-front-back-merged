import { Model } from "@sequelize/core";
import { Sequelize } from "@sequelize/core";
import { initializeModel } from "@src/shared/config/model-initializer";
import { carrierSchema } from "../schemas/schema";


export class CarrierModel extends Model {
  public isDeleted!: string;
  public companyNo!: number;
  public carrierId!: string;
  public carrierName!: string;
  public ein!: number;
  public fuelfacsCarrierId!: number;
  public filler01!: string;

}

export function initializeCarrier(sequelize: Sequelize): void {
  initializeModel(sequelize, CarrierModel, "Carrier", carrierSchema);
}
