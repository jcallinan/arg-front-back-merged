import { Clearchecks } from "../../domain/entities/clearchecks.entity";
import { ClearchecksModel } from "../models/clearchecks.model";

/**
 * Maps a clearchecks database model to a domain entity
 * @function clearchecksMapper
 * @param {ClearchecksModel} record - The clearchecks database model to map
 * @returns {Clearchecks} The mapped clearchecks domain entity
 * @throws {Error} If the record is null or undefined
 * @example
 * const clearchecksModel = await ClearchecksModel.findByPk(1);
 * const clearchecks = clearchecksMapper(clearchecksModel);
 */
export function clearchecksMapper(record: ClearchecksModel): Clearchecks {
  if (!record) {
    throw new Error("Clearchecks record is null or undefined");
  }

  // Use factory method to create entity
  return Clearchecks.create({
    dORV: record.dORV,
    companyNo: record.companyNo,
    bankGlNumber: record.bankGlNumber,
    checkNumber: record.checkNumber,
    vendorNo: record.vendorNo,
    checkAmount: record.checkAmount,
    checkDate: record.checkDate,
    clearDate: record.clearDate,
    vendorName: record.vendorName,
    checkDate1: record.checkDate,
    clearDate1: record.clearDate,
    origChkAmt: record.origChkAmt,
    filler: record.filler
  });
}
