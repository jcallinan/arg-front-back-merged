import { Module } from "@nestjs/common";
import { PurchaseJournalService } from "./purchase-journal.service";
import { SpooledMetaDataReportsRepository } from "@src/main/account-payable/data/repositories/spooled-meta-data-reports.repository";
import { SpooledMetadataReportModel } from "@src/main/account-payable/data/models/spooled-metadata-report.model";
import { VoucherDetailModel } from "@src/main/account-payable/data/models/voucher-detail.model";
import { VoucherHeaderHistoryModel } from "@src/main/account-payable/data/models/voucher-header-history.model";
import { VoucherDetailHistoryModel } from "@src/main/account-payable/data/models/voucher-detail-history.model";
import { VoucherDetailRepository } from '@src/main/account-payable/data/repositories/voucher-detail.repository';
import { VoucherHeaderHistoryRepository } from '@src/main/account-payable/data/repositories/voucher-header-history.repository';
import { VoucherDetailHistoryRepository } from '@src/main/account-payable/data/repositories/voucher-detail-history.repository';
import { VoucherAppModule } from "../voucher/voucher.module"; 
import { ReportModule } from "../report/report.module";
import { CheckInquiryRepository } from "@src/main/account-payable/data/repositories/check-inquiry.repository";
import { CheckInquiryModel } from "@src/main/account-payable/data/models/check-inquiry.model";
import { CheckInquiryHistoryModel } from "@src/main/account-payable/data/models/check-inquiry-history.model";
import { CheckInquiryVoucherDetailModel } from "@src/main/account-payable/data/models/check-inquiry-voucher-detail.model";
import { CheckInquiryLineItemModel } from "@src/main/account-payable/data/models/check-inquiry-line-item.model";
import { VendorModel } from "@src/main/account-payable/data/models/vendor.model";

@Module({
  imports: [VoucherAppModule, ReportModule],
  providers: [
    PurchaseJournalService,
    {
      provide: "SpooledMetadataReportModel",
      useValue: SpooledMetadataReportModel,
    },
    {
      provide: "SpooledMetaDataReportInterface",
      useClass: SpooledMetaDataReportsRepository,
    },
    {
      provide: 'VoucherDetailModel',
      useValue: VoucherDetailModel,
    },
    {
      provide: "VoucherDetailInterface",
      useClass: VoucherDetailRepository,
    },
    {
      provide: 'VoucherHeaderHistoryModel',
      useValue: VoucherHeaderHistoryModel,
    },
    {
      provide: "VoucherHeaderHistoryInterface",
      useClass: VoucherHeaderHistoryRepository,
    },
    {
      provide: 'VoucherDetailHistoryModel',
      useValue: VoucherDetailHistoryModel,
    },
    {
      provide: "VoucherDetailHistoryInterface",
      useClass: VoucherDetailHistoryRepository,
    },
    {
      provide: "CheckInquiryInterface",
      useClass: CheckInquiryRepository,
    },
    {
      provide: "CheckInquiryModel",
      useValue: CheckInquiryModel,
    },
    {
      provide: "CheckInquiryHistoryModel",
      useValue: CheckInquiryHistoryModel,
    },
    {
      provide: "CheckInquiryVoucherDetailModel",
      useValue: CheckInquiryVoucherDetailModel,
    },
    {
      provide: "CheckInquiryLineItemModel",
      useValue: CheckInquiryLineItemModel,
    },
    {
      provide: "VendorModel",
      useValue: VendorModel,
    },
  ],
  exports: [PurchaseJournalService, "SpooledMetaDataReportInterface"],
})
export class PurchaseJournalAppModule {}
