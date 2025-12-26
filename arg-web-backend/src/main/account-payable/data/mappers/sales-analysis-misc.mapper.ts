import { SalesAnalysisMisc } from "../../domain/entities/sales-analysis-misc.entity";
import { SalesAnalysisMiscModel } from "../models/sales-analysis-misc.model";

/**
 * Maps a sales analysis misc database model to a domain entity
 * @function salesAnalysisMiscMapper
 * @param {SalesAnalysisMiscModel} record - The sales analysis misc database model to map
 * @returns {Sa5fium} The mapped sa5fium domain entity
 * @throws {Error} If the record is null or undefined
 * @example
 * const salesAnalysisMiscModel = await SalesAnalysisMiscModel.findByPk(1);
 * const salesAnalysisMisc = salesAnalysisMiscMapper(salesAnalysisMiscModel);
 */
export function salesAnalysisMiscMapper(record: SalesAnalysisMiscModel): SalesAnalysisMisc {
  if (!record) {
    throw new Error("SalesAnalysisMisc record is null or undefined");
  }

  // Use factory method to create entity
  return SalesAnalysisMisc.create({
    isDeleted: record.isDeleted,
    companyNo: record.companyNo,
    customerNo: record.customerNo,
    invoiceNo: record.invoiceNo,
    shipToNo: record.shipToNo,
    salesman: record.salesman,
    invoiceDateYmd: record.invoiceDateYmd,
    miscQuantity: record.miscQuantity,
    filler: record.filler,
    miscAmount: record.miscAmount,
    filler1: record.filler1,
    itemBlank: record.itemBlank,
    typeMCR: record.typeMCR,
    orderNo: record.orderNo,
    orderSeqNo: record.orderSeqNo,
    shipDateYmd: record.shipDateYmd,
    filler2: record.filler2,
    time: record.time,
    filler3: record.filler3,
    miscType: record.miscType,
    filler4: record.filler4,
    filler5: record.filler5,
    inventoryState: record.inventoryState,
    filler6: record.filler6,
    miscCode: record.miscCode,
    filler7: record.filler7,
    taxCode2: record.taxCode2,
    taxCode3: record.taxCode3,
    taxCode4: record.taxCode4,
    taxCode1: record.taxCode1,
    taxCode5: record.taxCode5,
    taxAmt1: record.taxAmt1,
    taxAmt2: record.taxAmt2,
    taxAmt3: record.taxAmt3,
    taxAmt4: record.taxAmt4,
    taxAmt5: record.taxAmt5,
    deliveryNY: record.deliveryNY,
    billOfLadingNo: record.billOfLadingNo,
    glNo: record.glNo,
    customerState: record.customerState,
    filler8: record.filler8,
    carrierCd: record.carrierCd,
    filler9: record.filler9,
    authorizedInitials: record.authorizedInitials,
    userId: record.userId,
    separateFreighyNY: record.separateFreighyNY,
    filler10: record.filler10,
    invoiceDateYmd8: record.invoiceDateYmd8,
    shipDateYmd8: record.shipDateYmd8,
    multiLoad: record.multiLoad,
    distributorOrderNo: record.distributorOrderNo,
    distribShipOrderNo: record.distribShipOrderNo,
    distribPurchAuthIni: record.distribPurchAuthIni,
    memoCustNo: record.memoCustNo,
    memoCustShipToNo: record.memoCustShipToNo,
    filler11: record.filler11,
    billedCustOrderNo: record.billedCustOrderNo,
    billedCustMemoOrdN: record.billedCustMemoOrdN,
    termsSplitCd: record.termsSplitCd,
    billedCustNo: record.billedCustNo,
    custOwnedProduct: record.custOwnedProduct,
    shippingReferenceNo: record.shippingReferenceNo,
    exportCode: record.exportCode,
    orderYN: record.orderYN,
    taxCode6: record.taxCode6,
    taxCode7: record.taxCode7,
    taxCode8: record.taxCode8,
    taxCode9: record.taxCode9,
    taxCode10: record.taxCode10,
    taxAmt6: record.taxAmt6,
    taxAmt7: record.taxAmt7,
    taxAmt8: record.taxAmt8,
    taxAmt9: record.taxAmt9,
    taxAmt10: record.taxAmt10,
    overrideTaxesYN: record.overrideTaxesYN,
    description: record.description,
    origOrderNumber: record.origOrderNumber,
    taxExempt1: record.taxExempt1,
    taxExempt2: record.taxExempt2,
    taxExempt3: record.taxExempt3,
    taxExempt4: record.taxExempt4,
    taxExempt5: record.taxExempt5,
    taxExempt6: record.taxExempt6,
    taxExempt7: record.taxExempt7,
    taxExempt8: record.taxExempt8,
    taxExempt9: record.taxExempt9,
    taxExempt10: record.taxExempt10,
    filler12: record.filler12
  });
}
