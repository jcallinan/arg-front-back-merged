import { InventoryHistory } from "../../domain/entities/inventory-history.entity";
import { InventoryHistoryModel } from "../models/inventory-history.model";

/**
 * Maps an InventoryHistory database model to a domain entity
 * @function InventoryHistoryMapper
 * @param {InventoryHistoryModel} record - The InventoryHistory database model to map
 * @returns {InventoryHistory} The mapped InventoryHistory domain entity
 * @throws {Error} If the record is null or undefined
 */
export function InventoryHistoryMapper(record: InventoryHistoryModel): InventoryHistory {
  if (!record) {
    throw new Error("InventoryHistory record is null or undefined");
  }
  return InventoryHistory.create({
    isDeleted: record.isDeleted,
    companyNo: record.companyNo,
    location: record.location,
    productCode: record.productCode,
    tank: record.tank,
    extraKeyField: record.extraKeyField,
    systemDate: record.systemDate,
    systemTime: record.systemTime,
    transactionType: record.transactionType,
    netQuantity: record.netQuantity,
    netQtyFraction: record.netQtyFraction,
    unitOfMeasure: record.unitOfMeasure,
    datePosted: record.datePosted,
    timePosted: record.timePosted,
    transactionDate: record.transactionDate,
    source: record.source,
    productGroupCode: record.productGroupCode,
    vendorNo: record.vendorNo,
    vendorLocation: record.vendorLocation,
    carrierCode: record.carrierCode,
    additiveCode: record.additiveCode,
    receiptNo: record.receiptNo,
    billOfLadingNo: record.billOfLadingNo,
    truckNo: record.truckNo,
    transferLocation: record.transferLocation,
    transferProductCode: record.transferProductCode,
    transferTank: record.transferTank,
    transferExtraKeyField: record.transferExtraKeyField,
    finishedProductCode: record.finishedProductCode,
    tankPhysicalInvent: record.tankPhysicalInvent,
    orderNumber: record.orderNumber,
    prevOnHandQtyFraction: record.prevOnHandQtyFraction,
    srnNumber: record.srnNumber,
    costingType: record.costingType,
    filler2: record.filler2,
    newOnHandQtyFraction: record.newOnHandQtyFraction,
    keyedUnitOfMeasure: record.keyedUnitOfMeasure,
    nextMonthCode: record.nextMonthCode,
    filler1: record.filler1,
    apLastInvoiceDate: record.apLastInvoiceDate,
    apLastExpenseGlNo: record.apLastExpenseGlNo,
    apLastPurchaseJrnl: record.apLastPurchaseJrnl,
    apTotalQuantity: record.apTotalQuantity,
    apTotalQtyFraction: record.apTotalQtyFraction,
    apTotalDollars: record.apTotalDollars,
    temperature: record.temperature,
    gravity: record.gravity,
    grossQuantity: record.grossQuantity,
    grossQtyFraction: record.grossQtyFraction,
    openClosedStatus: record.openClosedStatus,
    closedDate: record.closedDate,
    accruedGlNo: record.accruedGlNo,
    accruedTotalDollars: record.accruedTotalDollars,
    accruedFreightGlNo: record.accruedFreightGlNo,
    accruedFreightDollars: record.accruedFreightDollars,
    sortCode: record.sortCode,
    invCostUnitCode: record.invCostUnitCode,
    finprdInvCostUnitCode: record.finprdInvCostUnitCode,
    previousOnHandQty: record.previousOnHandQty,
    newOnHandQuantity: record.newOnHandQuantity,
    systemDateCYMD: record.systemDateCYMD,
    datePostedYMD: record.datePostedYMD,
    transactionDateCYMD: record.transactionDateCYMD,
    closedDateCYMD: record.closedDateCYMD,
    transferInOut: record.transferInOut,
    filler3: record.filler3,
    apLastInvoiceNumber: record.apLastInvoiceNumber,
    poNumberFromSystem: record.poNumberFromSystem,
    incomeGL: record.incomeGL,
    expenseGL: record.expenseGL,
    filler4: record.filler4,
  });
}
