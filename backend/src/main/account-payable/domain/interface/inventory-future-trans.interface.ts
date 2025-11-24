import { InventoryFutureTrans } from "../entities/inventory-future-trans.entity";

/**
 * Interface for InventoryFutureTrans repository operations
 * @interface InventoryFutureTransInterface
 * @description Defines the contract for InventoryFutureTrans data access operations
 */
export interface InventoryFutureTransInterface {
  findByReceiptNo(companyNo: number, receiptNo: number): Promise<InventoryFutureTrans | null>;
}
