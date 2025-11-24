import { Model, Sequelize } from "@sequelize/core";
import { inventoryFutureTransSchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";

export class InventoryFutureTransModel extends Model {
  public isDeleted!: string;
  public sequenceNo!: number;
  public companyNo!: number;
  public location!: string;
  public productCode!: string;
  public tank!: string;
  public extraKeyField!: string;
  public transactionType!: string;
  public netQuantity!: number;
  public netQtyFraction!: number;
  public temperature!: number;
  public gravity!: number;
  public unitOfMeasure!: string;
  public transactionDate!: number;
  public source!: string;
  public vendorNo!: number;
  public vendorLocation!: number;
  public carrierCode!: number;
  public additiveCode!: string;
  public receiptNumber!: number;
  public billOfLading!: number;
  public truckNo!: number;
  public customerNumber!: number;
  public transferToLocation!: string;
  public transferToProdCode!: string;
  public transferToTank!: string;
  public transferToXtraKey!: string;
  public sumWhenPosting!: string;
  public inventoryNetQty!: number;
  public inventoryQtyFraction!: number;
  public inventoryUnitOfMeasure!: string;
  public grossQuantity!: number;
  public grossQtyFraction!: number;
  public inventoryGrossQty!: number;
  public inventoryGrossQtyFraction!: number;
  public useFormula!: string;
  public sortCode!: string;
  public invenCostUnit!: string;
  public finProdProductCode!: string;
  public transactionDateCYMD!: number;
  public openClosedStatus!: string;
  public apTotalDollars!: number;
  public orderNumber!: number;
  public srnNumber!: number;
  public apLastInvNumber!: number;
  public apLastInvDate!: number;
  public apLastExpenseGL!: number;
  public apLastPurchaseJournal!: number;
  public apTotalQuantity!: number;
  public closedDateYMD!: number;
  public closedDateCYMD!: number;
  public poNumber!: number;
  public reversingEntry!: string;
  public costingType!: string;
  public incomeGL!: number;
  public expenseGL!: number;
  public filler1!: string;
  public filler2!: string;
  public filler3!: string;
}

export function initializeInventoryFutureTrans(sequelize: Sequelize): void {
  initializeModel(sequelize, InventoryFutureTransModel, "InventoryFutureTrans", inventoryFutureTransSchema);
}
