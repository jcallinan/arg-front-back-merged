import { Model, Sequelize } from "@sequelize/core";
import { openPayableHeaderSchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";
import { OpenPayableDetailsModel } from "./open-payable-details.model";
import { OpenPayableVendorModel } from "./open-payable-vendor.model";
import { VendorModel } from "./vendor.model";

// Define the Open Payable Header model class
export class OpenPayableHeaderModel extends Model {
  // Primary key fields
  public isDeleted!: string;
  public companyNo!: number;
  public vendorNo!: number;
  public voucherNo!: number;

  // Header information
  public recordType!: number;
  public sequenceNo!: number;
  public grossAmount!: number;
  public discount!: number;
  public partialPaidToDate!: number;
  public invoiceDescription!: string;
  public apGlAccountNo!: number;
  public retentionVoucherFlag!: string;
  public discountDueDate6!: number;
  public discountDueDate8!: number;
  public filler1!: string;
  public invoiceDate6!: number;
  public dueDate6!: number;
  public prepaidCheckNo!: number;
  public prepaidVoucherFlag!: string;
  public filler2!: string;
  public lastPaidDate6!: number;
  public filler3!: string;
  public cashDisbJrnlDate6!: number;
  public purchJrnlDate6!: number;
  public purchaseJrnlNo!: string;
  public holdPaymentFlag!: string;
  public holdDescription!: string;
  public singleCheckFlag!: string;
  public bankGlNo!: number;
  public lastPaidAmount!: number;
  public discountTaken!: number;
  public filler4!: string;
  public cancelEntryNo!: number;
  public filler5!: string;
  public invoiceDate8!: number;
  public dueDate8!: number;
  public lastPaidDate8!: number;
  public cashDisbJrnlDate8!: number;
  public purchJrnlDate8!: number;
  public freightTotal!: number;
  public prodInvVendorNo!: number;
  public prodInvNo!: string;
  public salesOrderNo!: number;
  public salesSrnNo!: number;
  public filler6!: string;
  public apTerms!: number;
  public carrierId!: string;
  public invoiceNo!: string;
  public filler7!: string;

  static associate() {
    // A header has many details
    OpenPayableHeaderModel.hasMany(OpenPayableDetailsModel, {
      foreignKey: "voucherNo",
      sourceKey: "voucherNo",
      as: "details",
    });

    OpenPayableHeaderModel.hasOne(OpenPayableDetailsModel, {
      foreignKey: "voucherNo",
      sourceKey: "voucherNo",
      as: "voucherDetails",
    });

    OpenPayableHeaderModel.hasOne(VendorModel, {
      foreignKey: 'vendorNo',
      sourceKey: 'vendorNo',
      as: 'vendorDetail',
    });

    // A header has one vendor info
    // OpenPayableHeaderModel.hasOne(OpenPayableVendorModel, {
    //   foreignKey: "voucherNo",
    //   sourceKey: "voucherNo",
    //   as: "vendor",
    // });

    // In open-payable-header.model.ts
    OpenPayableHeaderModel.hasOne(OpenPayableVendorModel, {
      foreignKey: "vendorNo",
      sourceKey: "vendorNo",
      as: "vendor",
    });
  }
}

// Initialize the Open Payable Header model
export function initializeOpenPayableHeaderModel(sequelize: Sequelize): void {
  initializeModel(
    sequelize,
    OpenPayableHeaderModel,
    "OpenPayableHeader",
    openPayableHeaderSchema
  );
}
