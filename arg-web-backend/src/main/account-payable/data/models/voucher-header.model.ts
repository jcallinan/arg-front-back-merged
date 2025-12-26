import { Model, Sequelize } from "@sequelize/core";
import { voucherHeaderSchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";
import { getCurrentDate } from "@src/shared/utils/format-date";
import { currentUserName,currentUserInitials } from "@src/shared/utils/user-context";

// Define the VoucherHeaderModel model class
export class VoucherHeaderModel extends Model {
  public isDeleted!: string;
  public companyNo!: number;
  public entryNo!: number;
  public entrySequence!: number;
  public vendorNo!: number;
  public canceledVoucher!: number;
  public apGlNo!: number;
  public invoiceDesc!: string;
  public invoiceDate!: number;
  public dueDate!: number;
  public extendedInvoiceDate!: number;
  public extendedDueDate!: number;
  public singleCheck!: string;
  public holdCode!: string;
  public holdDesc!: string;
  public prepaidCode!: string;
  public prepaidCheckNo!: number;
  public vendorName!: string;
  public vendorAdd1!: string;
  public vendorAdd2!: string;
  public vendorAdd3!: string;
  public vendorAdd4!: string;
  public bankGl!: number;
  public invoiceAmount!: number;
  public retentionGl!: number;
  public retentionPct!: number;
  public prepaidCheckdate!: number;
  public prepaidCheckdate8!: number;
  public totalFreight!: number;
  public salesOrderNo!: number;
  public srn!: number;
  public carrierId!: string;
  public vendorPaymentTerms!: number;
  public processType!: string;
  public discountDueDate!: number;
  public extendedDiscountDueDate!: number;
  public invoiceNo!: string;
  public status?: string;
  public userProfile!: string;
  public userInitials!: string;
  public createDate!: number;
  public updateDate!: number;
  /** ATFIL1, VARCHAR(1) */
  public fillerOne!: string;
  /** ATFIL2, VARCHAR(10) */
  public fillerTwo!: string;
}

export function initializeVoucherHeader(sequelize: Sequelize): void {
  initializeModel(
    sequelize,
    VoucherHeaderModel,
    "VoucherHeader",
    voucherHeaderSchema
  );
  VoucherHeaderModel.beforeCreate((instance: any) => {
  instance.createDate = getCurrentDate();
  instance.updateDate = getCurrentDate();
  instance.userProfile = currentUserName();
  instance.userInitials = currentUserInitials();
});
 
VoucherHeaderModel.beforeUpdate((instance: any) => {
  instance.updateDate = getCurrentDate();
  instance.userProfile = currentUserName();
  instance.userInitials = currentUserInitials();
});
}
