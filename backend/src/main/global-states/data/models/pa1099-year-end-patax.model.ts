// src/main/account-payable/data/models/pa1099-year-end-patax.model.ts
import { Model, Sequelize } from "@sequelize/core";
import { pa1099YearEndPataxSchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";

export class PA1099YearEndPataxModel extends Model {
  public payersAccountNumber!: string;
  public typeOfEntityId!: string;
  public paAssignedEmployerNo!: string;
  public paymentYear!: string;
  public recipientSSN!: string;
  public typeOfTin!: string;
  public recipientNo!: string;
  public businessName!: string;
  public firstName!: string;
  public middleName!: string;
  public suffixName!: string;
  public payeeAddress1!: string;
  public payeeAddress2!: string;
  public payeeAddress3!: string;
  public payeeCity!: string;
  public payeeState!: string;
  public payeeZipCode!: string;
  public countryCode!: string;
  public rentAmount1!: number;
  public royaltyAmount2!: number;
  public otherIncomeBox3!: number;
  public medicalHealthBox6!: number;
  public nonEmployeeCompBox7!: number;
  public grossAttorneyBox14!: number;
  public stateTaxWithheldBox16!: number;
  public stateIncomeBox18!: number;
  public payerName!: string;
  public payerAddress1!: string;
  public payerAddress2!: string;
  public payerAddress3!: string;
  public payerCity!: string;
  public payerState!: string;
  public payerZip!: string;
  public payerCountry!: string;
}

export function initializePA1099YearEndPatax(sequelize: Sequelize): void {
  initializeModel(
    sequelize,
    PA1099YearEndPataxModel,
    "PA1099YearEndPatax",
    pa1099YearEndPataxSchema
  );
}
