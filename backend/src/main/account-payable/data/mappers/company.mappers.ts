import { Company } from "../../domain/entities/company.entity";
import { CompanyModel } from "../models/company.model";

/**
 * Maps a company database model to a domain entity
 * @function companyMapper
 * @param {CompanyModel} record - The company database model to map
 * @returns {Company} The mapped company domain entity
 * @throws {Error} If the record is null or undefined
 * @example
 * const companyModel = await CompanyModel.findByPk(1);
 * const company = companyMapper(companyModel);
 */
export function companyMapper(record: CompanyModel): Company {
  if (!record) {
    throw new Error("Company record is null or undefined");
  }

  // Use factory method to create entity
  return Company.create({
    companyNo: record.companyNo,
    companyName: record.companyName,
    companyApGlNo: record.companyApGlNo,
    companyBankGlNo: record.companyBankGlNo,
    companyDiscountsGlNo: record.companyDiscountsGlNo,
    companyIntercoGlNo: record.companyIntercoGlNo,
    companyNextPjJrnlNo: record.companyNextPjJrnlNo,
    companyNextCdJrnlNo: record.companyNextCdJrnlNo,
    companyNextCheckNo: record.companyNextCheckNo,
    companyNextEntryNo: record.companyNextEntryNo,
    companyNextVoucherNo: record.companyNextVoucherNo,
    companyPreEdChks: record.companyPreEdChks,
    companyJobCostAct: record.companyJobCostAct,
    companyRetentionGlNo: record.companyRetentionGlNo,
    companyPoActive: record.companyPoActive,
    companyEmployeeExpenseGlNo: record.companyEmployeeExpenseGlNo,
    companyNextEeJrnlNo: record.companyNextEeJrnlNo,
    companyVendorNextEntryNo: record.companyVendorNextEntryNo,
    company99Name: record.company99Name,
    company99Address1: record.company99Address1,
    company99Address2: record.company99Address2,
    company99StateZip: record.company99StateZip, // Keep the original field for database compatibility
    company99EinNumber: record.company99EinNumber,
    company99EmployeeName: record.company99EmployeeName,
    company99Phone: record.company99Phone,
    companyFiller: record.companyFiller,
    companyIsDeleted: record.companyIsDeleted,
  });
}
