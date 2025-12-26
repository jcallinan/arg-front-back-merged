import { Module } from "@nestjs/common";
import { VoucherAppService } from "./voucher.service";
import { VoucherHeaderRepository } from "@src/main/account-payable/data/repositories/voucher-header.repository";
import { VoucherHeaderModel } from "@src/main/account-payable/data/models/voucher-header.model";
import { VoucherDetailRepository } from "@src/main/account-payable/data/repositories/voucher-detail.repository";
import { VoucherDetailModel } from "@src/main/account-payable/data/models/voucher-detail.model";
import { VoucherHeaderHistoryModel } from "@src/main/account-payable/data/models/voucher-header-history.model";
import { VoucherDetailHistoryModel } from "@src/main/account-payable/data/models/voucher-detail-history.model";
import { OpenPayableHeaderModel } from "@src/main/account-payable/data/models/open-payable-header.model";
import { OpenPayableHistoryHeaderModel } from "@src/main/account-payable/data/models/open-payable-history-header.model";

@Module({
  providers: [
    VoucherAppService,
    {
      provide: "VoucherHeaderInterface",
      useClass: VoucherHeaderRepository,
    },
    {
      provide: "VoucherHeaderModel",
      useValue: VoucherHeaderModel,
    },
    {
      provide: "VoucherDetailInterface",
      useClass: VoucherDetailRepository,
    },
    {
      provide: "VoucherDetailModel",
      useValue: VoucherDetailModel,
    },
    {
      provide: "VoucherHeaderHistoryModel",
      useValue: VoucherHeaderHistoryModel,
    },
    {
      provide: "VoucherDetailHistoryModel",
      useValue: VoucherDetailHistoryModel,
    },
    {
      provide: "OpenPayableHeaderModel",
      useValue: OpenPayableHeaderModel,
    },
    {
      provide: "OpenPayableHistoryHeaderModel",
      useValue: OpenPayableHistoryHeaderModel,
    },
  ],
  exports: [VoucherAppService],
})
export class VoucherAppModule {}
