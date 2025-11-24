import { InventoryHistory } from "../entities/inventory-history.entity";

/**
 * Interface for inventory history repository operations
 * @interface InventoryHistoryInterface
 * @description Defines the contract for inventory history data access operations
 */
export interface InventoryHistoryInterface {
  findByCompanyNoAndReceiptNo(
    companyNo: number,
    receiptNo: number,
  ): Promise<InventoryHistory | null>;
}
