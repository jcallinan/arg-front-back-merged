import { Model } from "@sequelize/core";
import { Sequelize } from "@sequelize/core";
import { vendorSchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";
import { OwnerVendorReferenceModel } from "./owner-vendor-reference.model";
import { VendorContactDetailModel } from "./vendor-contact-detail.model";

export class VendorModel extends Model {
  public vendorIsDeleted!: string;
  public vendorCompanyNumber!: number;
  public vendorNo!: number;
  public vendorName!: string;
  public vendorAdd1!: string;
  public vendorAdd2!: string;
  public vendorAdd3!: string;
  public vendorAdd4!: string;
  public vendorZipCode!: number;
  public vendorExtraZip!: number;
  public vendorAlphaSortAbbr!: string;
  public vendorAreaCode!: number;
  public vendorTelephoneNo!: number;
  public vendorLastPaymentAmt!: number;
  public vendorLastPaymentDate!: number;
  public vendorYtdPurchases!: number;
  public vendorLastYearPurchases!: number;
  public vendorMtdDiscounts!: number;
  public vendorYtdDiscounts!: number;
  public vendorNameOverflow!: string;
  public vendorGalRcptsRequired!: string;
  public vendorFiller!: string;
  public vendorPreviousBalance!: number;
  public vendorMtdPurchases!: number;
  public vendorMtdPayments!: number;
  public vendorCurrentBalance!: number;
  public vendorHoldPaymentsVend!: string;
  public vendorSingleCheck!: string;
  public vendorThisYrYtdPaid!: number;   // Year Payments
  public vendorLastYrYtdPaid!: number;    // Last Year Payments
  public vendorExpenseGLSub!: number;
  public vendorApTermsCode!: number;
  public vendorAp1099Code!: string;
  public vendorIdNumber!: string;
  public IdNo1099!: string;
  public vendorFirst1099BoxNumber!: number;
  public vendorSecond1099BoxNumber!: number;
  public vendorSecond1099BoxAmount!: number;
  public vendorLastPaymentDateAlt!: number;
  public vendorCarrierId!: string;
  public vendorPayeeName1!: string;
  public vendorPayeeName2!: string;
  public vendorIrsNameControl!: string;
  public vendorAdpPayrollId!: number;
  public vendorAchClass!: string;
  public vendorAchCheckingOrSavings!: string;
  public vendorAchBankRoutingCode!: number;
  public vendorAchBankAccountNumber!: string;
  public vendorFirstName!: string;
  public vendorMiddleName!: string;
  public vendorBusinessLastName!: string;
  public vendorNameSuffix!: string;
  public vendorCountryCode!: string; //
  public vendorCategoryCode!: string;
  public vendorFiller2!: string;

  static associate() {
    VendorModel.hasMany(OwnerVendorReferenceModel, {
      foreignKey: 'vendorNo',
      sourceKey: 'vendorNo',
      as: 'vendorOwnerDetails',
    });


    VendorModel.hasMany(VendorContactDetailModel, {
      foreignKey: 'vendorNo',
      sourceKey: 'vendorNo',
      as: 'vendorContactDetails',
    });
  }
}

export function initializeVendor(sequelize: Sequelize): void {
  initializeModel(sequelize, VendorModel, "Vendor", vendorSchema);
}
