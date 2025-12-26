import { Injectable, Logger, Inject } from "@nestjs/common";
import { InventoryFutureTransInterface } from "../../interface/inventory-future-trans.interface";
import { InventoryFutureTrans } from "../../entities/inventory-future-trans.entity";

@Injectable()
export class InventoryFutureTransService {
  private readonly logger = new Logger(InventoryFutureTransService.name);

  constructor(
    @Inject("InventoryFutureTransInterface")
    private readonly inventoryFutureTransRepository: InventoryFutureTransInterface,
  ) {}

  async getInventoryFutureTransRecord(
    companyNo: number,
    receiptNo: number,
  ): Promise<InventoryFutureTrans | null> {
    const record = await this.inventoryFutureTransRepository.findByReceiptNo(
        companyNo,
        receiptNo,
      );
      this.logger.log("InventoryFutureTrans record fetched successfully.");
      return record;
  }
}
