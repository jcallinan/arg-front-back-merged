import { Model, Sequelize } from "@sequelize/core";
import { voucherDetailSchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";
import { getCurrentDate } from "@src/shared/utils/format-date";
import { currentUserInitials, currentUserName } from "@src/shared/utils/user-context";
// Define the VoucherDetailModel model class
export class VoucherDetailModel extends Model {
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
  public createDate!: string;
  public updateDate!: string;
}

export function initializeVoucherDetail(sequelize: Sequelize): void {
  initializeModel(
    sequelize,
    VoucherDetailModel,
    "VoucherDetail",
    voucherDetailSchema,
  );
   VoucherDetailModel.beforeCreate((instance: any) => {
    instance.createDate = getCurrentDate();
    instance.updateDate = getCurrentDate();
    instance.userProfile = currentUserName();
    instance.userInitials = currentUserInitials();
  });
   
  VoucherDetailModel.beforeUpdate((instance: any) => {
    instance.updateDate = getCurrentDate();
    instance.userProfile = currentUserName();
    instance.userInitials = currentUserInitials();
  });
}
