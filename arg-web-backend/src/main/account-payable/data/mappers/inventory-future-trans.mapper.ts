import { InventoryFutureTrans } from "../../domain/entities/inventory-future-trans.entity";
import { InventoryFutureTransModel } from "../models/inventory-future-trans.model";

/**
 * Maps an InventoryFutureTrans database model to a domain entity
 * @function InventoryFutureTransMapper
 * @param {InventoryFutureTransModel} record - The InventoryFutureTrans database model to map
 * @returns {InventoryFutureTrans} The mapped InventoryFutureTrans domain entity
 * @throws {Error} If the record is null or undefined
 */
export function InventoryFutureTransMapper(record: InventoryFutureTransModel): InventoryFutureTrans {      
  if (!record) {
    throw new Error("InventoryFutureTrans record is null or undefined");
  }

  return InventoryFutureTrans.create({
    isDeleted: record.isDeleted,
    sequenceNo: record.sequenceNo,
    companyNo: record.companyNo,
    location: record.location,
    productCode: record.productCode,
    tank: record.tank,
    extraKeyField: record.extraKeyField,
    transactionType: record.transactionType,
    netQuantity: record.netQuantity,
    netQtyFraction: record.netQtyFraction,
    temperature: record.temperature,
    gravity: record.gravity,
    unitOfMeasure: record.unitOfMeasure,
    transactionDate: record.transactionDate,
    source: record.source,
    vendorNo: record.vendorNo,
    vendorLocation: record.vendorLocation,
    carrierCode: record.carrierCode,
    additiveCode: record.additiveCode,
    billOfLading: record.billOfLading,
    truckNo: record.truckNo,
    customerNumber: record.customerNumber,
  });
}
