import { Module } from "@nestjs/common";
import { ApdateModel } from "@src/main/account-payable/data/models/apdate.model";
import { ApdateRepository } from "@src/main/account-payable/data/repositories/apdate.repository";
import { ApdateAppService } from "./apdate.service";

@Module({
  imports: [],
  providers: [
    {
      provide: "ApdateModel",
      useValue: ApdateModel,
    },
    {
      provide: "ApdateRepository",
      useClass: ApdateRepository,
    },
    ApdateAppService,
  ],
  exports: [ApdateAppService],
})
export class ApdateModule {}
