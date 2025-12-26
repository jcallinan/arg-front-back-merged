import { Model } from "@sequelize/core";
import { Sequelize } from "@sequelize/core";
import { checkInquiryHistorySchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";
import { CheckInquiryModel } from "./check-inquiry.model";


export class CheckInquiryHistoryModel extends Model {
  public code!: string;
  public companyNo!: number;
  public bankGLNo!: number;
  public checkNo!: number;
  public vendorNo!: number;
  public checkAmount!: number;
  public checkDate!: number;
  public clearDate!: number;
  public vendorName!: string;
  public checkDate8!: number;
  public clearDate8!: number;
  public originalCheckAmount!: string;

  static associate() {
    CheckInquiryHistoryModel.belongsTo(CheckInquiryModel, {
      foreignKey: 'bankGLNo',
      targetKey: 'bankGLNo',
      as: 'inquiryBankGLNo',
    });
  }

}

export function initializeCheckInquiryHistory(sequelize: Sequelize): void {
  initializeModel(
    sequelize,
    CheckInquiryHistoryModel,
    "CheckInquiryHistory",
    checkInquiryHistorySchema
  );
}
