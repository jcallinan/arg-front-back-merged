import { Model } from "@sequelize/core";
import { Sequelize } from "@sequelize/core";
import { VendorMasterAdditionalSchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";

export class VendorMasterAdditionalModel extends Model {
  public isDeleted!: string;
  public companyNo!: number;
  public vendorNo!: number;
  public vendorName!: string;
  public addressLine1!: string;
  public addressLine2!: string;
  public addressLine3!: string;
  public addressLine4!: string;
  public zipCode!: number;
  public extraZip!: number;
  public alphaSortAbbr!: string;
  public areaCode!: number;
  public telephoneNo!: number;
  public lastPaymntAmt!: number;
  public lastPaymntDate!: number;
  public ytdPurchases!: number;
  public lstYrPurchases!: number;
  public mtdDiscounts!: number;
  public ytdDiscounts!: number;
  public nameOverflow!: string;
  public galRcptsRequired!: string;
  public filler1!: string;
  public previousBalance!: number;
  public mtdPurchases!: number;
  public mtdPayments!: number;
  public currentBalance!: number;
  public hHoldPmtsVend!: string;
  public sEaVoSnglChk!: string;
  public thisYrYtdPaid!: number;
  public lastYrYtdPaid!: number;
  public expenseGlSub!: number;
  public apTermsCode!: number;
  public ap1099Code!: string;
  public IdNo1099!: string;
  public BoxNumber1st1099!: number;
  public BoxNumber2nd1099!: number;
  public BoxAmount2nd1099!: number;
  public lastPaymntDate8!: number;
  public carrierId!: string;
  public payeeName1!: string;
  public payeeName2!: string;
  public irsNameControl!: string;
  public adpPayrollId!: number;
  public achClass!: string;
  public achCheckingOrSavings!: string;
  public achBankRoutingCode!: number;
  public achBankAccountNumber!: string;
  public firstName!: string;
  public middleName!: string;
  public businessLastName!: string;
  public nameSuffix!: string;
  public countryCode!: string;
  public categoryCode!: string;
  public filler3!: string;
}

export function initializeVendorMasterAdditional(sequelize: Sequelize): void {
  initializeModel(sequelize, VendorMasterAdditionalModel, "VendorMasterAdditional", VendorMasterAdditionalSchema);
}
