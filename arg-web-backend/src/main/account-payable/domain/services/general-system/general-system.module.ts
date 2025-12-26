import { Module } from "@nestjs/common";
import { GeneralSystemService } from "./general-system.service";
import { GeneralSystemRepository } from "@src/main/account-payable/data/repositories/general-system.repository";
import { GeneralSystemModel } from "@src/main/account-payable/data/models/general-system.model";

@Module({
  providers: [
    GeneralSystemService,
    {
      provide: "GeneralSystemModel",
      useValue: GeneralSystemModel,
    },
    {
      provide: "GeneralSystemRepository",
      useClass: GeneralSystemRepository,
    },
  ],
  exports: [GeneralSystemService],
})
export class GeneralSystemModule {}
