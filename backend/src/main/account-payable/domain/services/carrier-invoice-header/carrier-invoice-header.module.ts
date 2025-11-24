import { Module } from "@nestjs/common";
import { CarrierInvoiceHeaderService } from "./carrier-invoice-header.service";
import { CarrierInvoiceHeaderRepository } from "@src/main/account-payable/data/repositories/carrier-invoice-header.repository";
import { CarrierInvoiceHeaderModel } from "@src/main/account-payable/data/models/carrier-invoice-header.model";

@Module({
  providers: [
    {
      provide: "CarrierInvoiceHeaderModel",
      useValue: CarrierInvoiceHeaderModel,
    },
    {
      provide: "CarrierInvoiceHeaderRepository",
      useClass: CarrierInvoiceHeaderRepository,
    },
    CarrierInvoiceHeaderService,
  ],
  exports: [CarrierInvoiceHeaderService],
})
export class CarrierInvoiceHeaderModule {}
