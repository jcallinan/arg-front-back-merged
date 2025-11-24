import { BillingControlFile } from "../../domain/entities/billing-control-file.entity";
import { BillingControlFileModel } from "../models/billing-control-file.model";

/**
 * Maps a bicont database model to a domain entity
 * @function bicontMapper
 * @param {BillingControlFileModel} record - The bicont database model to map
 * @returns {BillingControlFile} The mapped bicont domain entity
 * @throws {Error} If the record is null or undefined
 * @example
 * const bicontModel = await BillingControlFileModel.findByPk(1);
 * const bicont = bicontMapper(bicontModel);
 */
export function bicontMapper(record: BillingControlFileModel): BillingControlFile {
  if (!record) {
    throw new Error("BillingControlFile record is null or undefined");
  }

  // Use factory method to create entity
  return BillingControlFile.create({
    isDeleted: record.isDeleted,
    companyNo: record.companyNo,
    companyName: record.companyName,
    nextOrderNumbe: record.nextOrderNumbe,
    inventoryGl: record.inventoryGl,
    cogsGl: record.cogsGl,
    freightGl: record.freightGl,
    miscGl: record.miscGl,
    nextInvoiceNum: record.nextInvoiceNum,
    minOrderAmt: record.minOrderAmt,
    salesGl: record.salesGl,
    invoicingSytl: record.invoicingSytl,
    nextBolNumber: record.nextBolNumber,
    nextInvOrderNumber: record.nextInvOrderNumber,
    outagePercent: record.outagePercent,
    nextMemoInvoic: record.nextMemoInvoic,
    cusAgreeMntPw: record.cusAgreeMntPw,
    addressLine1: record.addressLine1,
    addressLine2: record.addressLine2,
    daysForDupOrderCheck: record.daysForDupOrderCheck,
    bicuagSequenceNumber: record.bicuagSequenceNumber,
    rackPricePassword: record.rackPricePassword,
    tollingGl: record.tollingGl,
    collectFreightServiceFee: record.collectFreightServiceFee,
    filler: record.filler
  });
}
