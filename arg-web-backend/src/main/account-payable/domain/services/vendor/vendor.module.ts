import { Module } from "@nestjs/common";
import { VendorModel } from "../../../data/models/vendor.model";
import { VendorRepository } from "../../../data/repositories/vendor.repository";
import { VendorAppService } from "./vendor.service";
import { VendorContactDetailModel } from "@src/main/account-payable/data/models/vendor-contact-detail.model";
import { DynamicModelInitializationRepository } from "@src/shared/infrastructure/data/repository/dynamic-model-initialization.repository";
import { DynamicTableOperations } from "@src/shared/infrastructure/dynamicTableOperations/dynamicTableOperation";

@Module({
  imports: [],
  providers: [
    VendorAppService,
    {
      provide: "VendorModel",
      useValue: VendorModel,
    },
    {
      provide: "VendorContactDetailModel",
      useValue: VendorContactDetailModel,
    },
    {
      provide: "VendorInterface",
      useClass: VendorRepository,
    },
    DynamicModelInitializationRepository,
    DynamicTableOperations,
  ],
  exports: [VendorAppService],
})
export class VendorModule { }
