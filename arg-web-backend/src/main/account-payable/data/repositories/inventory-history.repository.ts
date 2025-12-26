import { Injectable, Inject } from "@nestjs/common";
import { InventoryHistoryInterface } from "@src/main/account-payable/domain/interface/inventory-history.interface";
import { InventoryHistory } from "@src/main/account-payable/domain/entities/inventory-history.entity";
import {  InventoryHistoryModel } from "../models/inventory-history.model";
import { InventoryHistoryMapper } from "../mappers/inventory-history.mapper";

@Injectable()
export class InventoryHistoryRepository implements InventoryHistoryInterface {
  constructor(
    @Inject("InventoryHistoryModel")
    private readonly inventoryHistoryModel: typeof InventoryHistoryModel,
  ) {}

  async findByCompanyNoAndReceiptNo(
    companyNo: number,
    receiptNo: number,
  ): Promise<InventoryHistory | null> {
    const record = await this.inventoryHistoryModel.findOne({
      where: {
        companyNo,
        receiptNo,
      },
    });
    return record ? InventoryHistoryMapper(record) : null;
  }
}
