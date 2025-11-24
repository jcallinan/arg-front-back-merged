import { Module } from "@nestjs/common";
import { InventoryHistoryService } from "./inventory-history.service";
import { InventoryHistoryRepository } from "@src/main/account-payable/data/repositories/inventory-history.repository";
import { InventoryHistoryModel } from "@src/main/account-payable/data/models/inventory-history.model";

@Module({
  imports: [],
  providers: [
    {
      provide: "InventoryHistoryModel",
      useValue: InventoryHistoryModel,
    },
    {
      provide: "InventoryHistoryInterface",
      useClass: InventoryHistoryRepository,
    },
    InventoryHistoryService,
  ],
  exports: [InventoryHistoryService],
})
export class InventoryHistoryModule {}
