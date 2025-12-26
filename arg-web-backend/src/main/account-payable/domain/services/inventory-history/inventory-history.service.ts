import { Injectable, Inject } from "@nestjs/common";
import { InventoryHistoryInterface } from "../../interface/inventory-history.interface";
import { InventoryHistory } from "../../entities/inventory-history.entity";

@Injectable()
export class InventoryHistoryService {

  constructor(
    @Inject("InventoryHistoryInterface")
    private readonly inventoryHistoryRepository: InventoryHistoryInterface,
  ) {}

  async getInventoryHistoryRecord(
    companyNo: number,
    receiptNo: number,
  ): Promise<InventoryHistory | null> {
    return await this.inventoryHistoryRepository.findByCompanyNoAndReceiptNo(
        companyNo,
        receiptNo,
      );
  }
}
