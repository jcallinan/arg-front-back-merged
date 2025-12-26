import { Module } from "@nestjs/common";
import { GlMasterService } from "./gl-master.service";
import { GlMasterRepository } from "@src/main/account-payable/data/repositories/gl-master.repository";
import { GlMasterModel } from "@src/main/account-payable/data/models/gl-master.model";
import { CacheModule } from "@src/shared/cache/cache.module";

@Module({
  imports: [CacheModule],
  providers: [
    GlMasterService,
    {
      provide: "GlMasterModel",
      useValue: GlMasterModel,
    },
    {
      provide: "GlMasterInterface",
      useClass: GlMasterRepository,
    },
  ],
  exports: [GlMasterService, "GlMasterInterface"],
})
export class GlMasterModule { }
