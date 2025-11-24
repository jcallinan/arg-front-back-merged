import { Module } from "@nestjs/common";
import { PurchaseJournalAppModule } from "../../domain/services/purchase-journal/purchase-journal.module";
import { SpooledMetadataReportModel } from "../../data/models/spooled-metadata-report.model";
import { SpooledMetaDataReportsRepository } from "../../data/repositories/spooled-meta-data-reports.repository";
import { PurchaseJournalController } from "./controllers/purchaseJournal.controller";
import { PuchaseJournalReportsUseCase } from "./usecases/purchase-journal-report/purchase-journal-report.usecase";
import { VoucherHeaderHistoryRepository } from "@src/main/account-payable/data/repositories/voucher-header-history.repository";
import { VoucherDetailHistoryRepository } from "@src/main/account-payable/data/repositories/voucher-detail-history.repository";
import { VoucherHeaderHistoryModel } from "@src/main/account-payable/data/models/voucher-header-history.model";
import { VoucherDetailHistoryModel } from "@src/main/account-payable/data/models/voucher-detail-history.model";
import { PurchaseJournalSubmitUseCase } from "./usecases/purchase-journal-submit/purchase-journal-submit.usecase";

@Module({
  imports: [
    PurchaseJournalAppModule,
  ],
  controllers: [PurchaseJournalController],
  providers: [
    {
      provide: "PurchaseJournalInterface",
      useClass: SpooledMetaDataReportsRepository,
    },
    {
      provide: "SpooledMetadataReportModel",
      useValue: SpooledMetadataReportModel,
    },
    {
      provide: "VoucherHeaderHistoryInterface",
      useClass: VoucherHeaderHistoryRepository,
    },
    {
      provide: "VoucherDetailHistoryInterface",
      useClass: VoucherDetailHistoryRepository,
    },
    {
      provide: "VoucherHeaderHistoryModel",
      useValue: VoucherHeaderHistoryModel,
    },
    {
      provide: "VoucherDetailHistoryModel",
      useValue: VoucherDetailHistoryModel,
    },
    PuchaseJournalReportsUseCase,
    PurchaseJournalSubmitUseCase
  ],
})
export class PurchaseJournalModule {}
