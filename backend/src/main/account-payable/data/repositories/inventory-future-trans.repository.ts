import { Injectable, Inject } from "@nestjs/common";
import { InventoryFutureTransInterface } from "@src/main/account-payable/domain/interface/inventory-future-trans.interface";
import { InventoryFutureTrans } from "@src/main/account-payable/domain/entities/inventory-future-trans.entity";
import { InventoryFutureTransModel } from "../models/inventory-future-trans.model";
import { InventoryFutureTransMapper } from "../mappers/inventory-future-trans.mapper";

@Injectable()
export class InventoryFutureTransRepository implements InventoryFutureTransInterface {
  constructor(
    @Inject("InventoryFutureTransModel")
    private readonly inventoryFutureTransModel: typeof InventoryFutureTransModel,
  ) {}

  async findByReceiptNo(
    companyNo: number,
    receiptNo: number,
  ): Promise<InventoryFutureTrans | null> {
    const record = await this.inventoryFutureTransModel.findOne({
      where: {
        companyNo,
        receiptNo,
      },
    });
    return record ? InventoryFutureTransMapper(record) : null;
  }
}
