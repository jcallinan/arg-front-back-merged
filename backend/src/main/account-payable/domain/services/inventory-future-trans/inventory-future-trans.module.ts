import { Module } from "@nestjs/common";
import { InventoryFutureTransService } from "./inventory-future-trans.service";
import { InventoryFutureTransRepository } from "@src/main/account-payable/data/repositories/inventory-future-trans.repository";
import { InventoryFutureTransModel } from "@src/main/account-payable/data/models/inventory-future-trans.model";

@Module({
  providers: [
    InventoryFutureTransService,
    {
      provide: "InventoryFutureTransModel",
      useValue: InventoryFutureTransModel,
    },
    {
      provide: "InventoryFutureTransInterface",
      useClass: InventoryFutureTransRepository,
    },
  ],
  exports: [InventoryFutureTransService],
})
export class InventoryFutureTransModule {}
