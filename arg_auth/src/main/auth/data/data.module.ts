import { Module, Global } from "@nestjs/common";
import { CacheModule } from "@src/shared/cache/cache.module";
import { allDataProviders } from "./data.providers";

@Global()
@Module({
  imports: [
    CacheModule
  ],
  providers: [
    ...allDataProviders, // Use all organized data providers
  ],
  exports: [
    "UserInterface", // Export vendor interface
    "LoginHistoryInterface",
    "UsersGroupsMappingsInterface"
  ],
})
export class DataModule {}
