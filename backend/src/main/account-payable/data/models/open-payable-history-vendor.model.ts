import { Model } from "@sequelize/core";
import { Sequelize } from "@sequelize/core";
import { openPayableHistoryVendorSchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";

export class OpenPayableHistoryVendorModel extends Model {
  public isDeleted!: string;
  public companyNo!: number;
  public vendorNo!: number;
  public voucherNo!: number;
  public oneTimeVendor!: number;
  public sequenceNo!: number;
  public vendorName!: string;
  public addressLine1!: string;
  public addressLine2!: string;
  public addressLine3!: string;
  public addressLine4!: string;
  public filler!: string;
  public companyNo1!: number;
  public vendorNo1!: number;
  public checkNo1!: number;
  public voucherNo1!: number;
  public Header1!: number;
  public SequenceNo1!: number;
  public CancelledVoucher!: string;
  public paidOnYymmdd!: number;
  public paidOnYymmdd1!: number;
  public filler1!: string;
}

export function initializeOpenPayableHistoryVendor(sequelize: Sequelize): void {
  initializeModel(sequelize, OpenPayableHistoryVendorModel, "OpenPayableHistoryVendor", openPayableHistoryVendorSchema);
}
