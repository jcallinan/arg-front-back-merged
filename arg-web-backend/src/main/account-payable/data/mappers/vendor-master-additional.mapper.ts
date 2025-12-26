import { VendorMasterAdditional } from "../../domain/entities/vendor-master-additional.entity";
import { VendorMasterAdditionalModel } from "../models/vendor-master-additional.model";

/**
 * Maps a apveny database model to a domain entity
 * @function apvenyMapper
 * @param {VendorMasterAdditionalModel} record - The vendor master additional database model to map
 * @returns {VendorMasterAdditional} The mapped vendor master additional domain entity
 * @throws {Error} If the record is null or undefined
 * @example
 * const vendorMasterAdditionalModel = await VendorMasterAdditionalModel.findByPk(1);
 * const vendorMasterAdditional = vendorMasterAdditionalMapper(vendorMasterAdditionalModel);
 */
export function vendorMasterAdditionalMapper(record: VendorMasterAdditionalModel): VendorMasterAdditional {
  if (!record) {
    throw new Error("Vendor master additional record is null or undefined");
  }

  // Use factory method to create entity
  return VendorMasterAdditional.create({
    isDeleted: record.isDeleted,
    companyNo: record.companyNo,
    vendorNo: record.vendorNo,
    vendorName: record.vendorName,
    addressLine1: record.addressLine1,
    addressLine2: record.addressLine2,
    addressLine3: record.addressLine3,
    addressLine4: record.addressLine4,
    zipCode: record.zipCode,
    extraZip: record.extraZip,
    alphaSortAbbr: record.alphaSortAbbr,
    areaCode: record.areaCode,
    telephoneNo: record.telephoneNo,
    lastPaymntAmt: record.lastPaymntAmt,
    lastPaymntDate: record.lastPaymntDate,
    ytdPurchases: record.ytdPurchases,
    lstYrPurchases: record.lstYrPurchases,
    mtdDiscounts: record.mtdDiscounts,
    ytdDiscounts: record.ytdDiscounts,
    nameOverflow: record.nameOverflow,
    galRcptsRequired: record.galRcptsRequired,
    filler1: record.filler1,
    previousBalance: record.previousBalance,
    mtdPurchases: record.mtdPurchases,
    mtdPayments: record.mtdPayments,
    currentBalance: record.currentBalance,
    hHoldPmtsVend: record.hHoldPmtsVend,
    sEaVoSnglChk: record.sEaVoSnglChk,
    thisYrYtdPaid: record.thisYrYtdPaid,
    lastYrYtdPaid: record.lastYrYtdPaid,
    expenseGlSub: record.expenseGlSub,
    apTermsCode: record.apTermsCode,
    ap1099Code: record.ap1099Code,
    IdNo1099: record.IdNo1099,
    BoxNumber1st1099: record.BoxNumber1st1099,
    BoxNumber2nd1099: record.BoxNumber2nd1099,
    BoxAmount2nd1099: record.BoxAmount2nd1099,
    lastPaymntDate8: record.lastPaymntDate8,
    carrierId: record.carrierId,
    payeeName1: record.payeeName1,
    payeeName2: record.payeeName2,
    irsNameControl: record.irsNameControl,
    adpPayrollId: record.adpPayrollId,
    achClass: record.achClass,
    achCheckingOrSavings: record.achCheckingOrSavings,
    achBankRoutingCode: record.achBankRoutingCode,
    achBankAccountNumber: record.achBankAccountNumber,
    firstName: record.firstName,
    middleName: record.middleName,
    businessLastName: record.businessLastName,
    nameSuffix: record.nameSuffix,
    countryCode: record.countryCode,
    categoryCode: record.categoryCode,
    filler3: record.filler3
  });
}
