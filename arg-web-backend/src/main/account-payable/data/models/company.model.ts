import { Model } from "@sequelize/core";
import { Sequelize } from "@sequelize/core";
import { companySchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";
// All fields from the schema are already represented as class properties below.
// If you need to add more fields, ensure they match the schema definition in ../schemas/schema.

export class CompanyModel extends Model {
  public companyIsDeleted!: string;
  public companyNo!: number;
  public companyName!: string;
  public companyApGlNo!: number;
  public companyBankGlNo!: number;
  public companyDiscountsGlNo!: number;
  public companyIntercoGlNo!: number;
  public companyNextPjJrnlNo!: number;
  public companyNextCdJrnlNo!: number;
  public companyNextCheckNo!: number;
  public companyNextEntryNo!: number;
  public companyNextVoucherNo!: number;
  public companyPreEdChks!: string;
  public companyJobCostAct!: string;
  public companyRetentionGlNo!: number;
  public companyPoActive!: string;
  public companyEmployeeExpenseGlNo!: number;
  public companyNextEeJrnlNo!: number;
  public companyVendorNextEntryNo!: number;
  public company99Name!: string;
  public company99Address1!: string;
  public company99Address2!: string;
  public company99StateZip!: string;
  public company99EinNumber!: string;
  public company99EmployeeName!: string;
  public company99Phone!: string;
  public companyFiller!: string;
}

export function initializeCompany(sequelize: Sequelize): void {
  initializeModel(sequelize, CompanyModel, "Company", companySchema);
}
