import { Model, Sequelize } from "@sequelize/core";
import { voucherDetailHistorySchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";
import { getCurrentDate } from "@src/shared/utils/format-date";
import { currentUserInitials, currentUserName } from "@src/shared/utils/user-context";

export class VoucherDetailHistoryModel extends Model {
  public isDeleted!: string;
  public companyNo!: number;
  public entryNo!: number;
  public entrySequence!: number;
  public vendorNo!: number;
  public lineCompanyNo!: number;
  public lineGlNo!: number;
  public lineDesc!: string;
  public lineAmount!: number;
  public discountAmount!: number;
  public discountPercentage!: number;
  public inventoryItem!: string;
  public quantity!: number;
  public jobNo!: string;
  public jobCostCode!: string;
  public jobCostType!: string;
  public jobCostQuantity!: number;
  public gallons!: number;
  public receiptNo!: number;
  public openClosed!: string;
  public poLineNo!: number;
  public productAmount!: number;
  public freightAmount!: number;
  public poNo?: string;
  public status?: string;
  public userProfile!: string;
  public userInitials!: string;
  public createDate!: number;
  public updateDate!: number;
}

export function initializeVoucherDetailHistory(sequelize: Sequelize): void {
  initializeModel(
    sequelize,
    VoucherDetailHistoryModel,
    "VoucherDetailHistory",
    voucherDetailHistorySchema,
  );
  VoucherDetailHistoryModel.beforeCreate((instance: any) => {
    instance.createDate = getCurrentDate();
    instance.updateDate = getCurrentDate();
    instance.userProfile = currentUserName();
    instance.userInitials = currentUserInitials();
  });
   
  VoucherDetailHistoryModel.beforeUpdate((instance: any) => {
    instance.updateDate = getCurrentDate();
    instance.userProfile = currentUserName();
    instance.userInitials = currentUserInitials();
  });
}