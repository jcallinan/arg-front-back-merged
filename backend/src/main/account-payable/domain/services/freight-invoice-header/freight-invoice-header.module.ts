import { Module } from "@nestjs/common";
import { FreightInvoiceHeaderService } from "./freight-invoice-header.service";
import { FreightInvoiceHeaderRepository } from "@src/main/account-payable/data/repositories/freight-invoice-header.repository";
import { FreightInvoiceHeaderModel } from "@src/main/account-payable/data/models/freight-invoice-header.model";
import { FreightOutBalancingInvoiceModel } from "@src/main/account-payable/data/models/freight-out-balancing-header.model";
import { CarrierInvoiceHeaderModel } from "@src/main/account-payable/data/models/carrier-invoice-header.model";
import { FreightCarrierInvoiceModel } from "@src/main/account-payable/data/models/freight-carrier-invoice.model";

@Module({
  imports: [],
  providers: [
    {
      provide: "FreightInvoiceHeaderModel",
      useValue: FreightInvoiceHeaderModel,
    },
    {
      provide: "FreightInvoiceHeaderRepository",
      useClass: FreightInvoiceHeaderRepository,
    },
    {
      provide: "FreightOutBalancingInvoiceModel",
      useValue: FreightOutBalancingInvoiceModel,
    },
    {
      provide: "CarrierInvoiceHeaderModel",
      useValue: CarrierInvoiceHeaderModel,
    },
    {
      provide: "FreightCarrierInvoiceModel",
      useValue: FreightCarrierInvoiceModel, 
    },
    FreightInvoiceHeaderService,
  ],
  exports: [FreightInvoiceHeaderService],
})
export class FreightInvoiceHeaderModule {}
