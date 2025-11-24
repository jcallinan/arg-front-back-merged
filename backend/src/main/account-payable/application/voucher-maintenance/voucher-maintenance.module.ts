import { Module } from "@nestjs/common";
import { VoucherMaintenanceController } from "./controllers/voucher-maintenance.controller";
import { VoucherMaintenanceRepository } from "../../data/repositories/voucher-maintenance.repository";
import { OpenPayableHeaderModel } from "../../data/models/open-payable-header.model";
import { OpenPayableHistoryHeaderModel } from "../../data/models/open-payable-history-header.model";
import { OpenPayableDetailsModel } from "../../data/models/open-payable-details.model";
import { OpenPayableHistoryDetailModel } from "../../data/models/open-payable-history-detail.model";
import { GetVoucherMaintenanceUseCase } from "./usecases/get-voucher-maintenance/get-voucher-maintenance.usecase";
import { AppLogger } from "@src/shared/logger/logger.service";
import { VendorModel } from "../../data/models/vendor.model";
import { GetVoucherSummaryMaintenanceUseCase } from "./usecases/get-voucher-summary/get-voucher-summary.usecase";
import { getVoucherMaintenanceViewUseCase } from "./usecases/get-voucher-view/get-voucher-view.usecase";
import { UpdateVoucherMaintenanceStatusUseCase } from "./usecases/update-voucher-status/update-voucher-status.usecase";
import { UpdateDiscountUseCase } from "./usecases/update-discount/update-discount.usecase";
import { TransferVoucherUseCase } from "./usecases/transfer-voucher/transfer-voucher.usecase";
import { VoucherHeaderModel } from "../../data/models/voucher-header.model";
import { VoucherDetailModel } from "../../data/models/voucher-detail.model";
import { VoucherModule } from "../voucher/voucher.module";
import { CompanyModule } from "../../domain/services/company/company.module";
import { CompanyModel } from "../../data/models/company.model";
import { CheckInquiryHistoryModel } from "../../data/models/check-inquiry-history.model";

@Module({
  imports: [VoucherModule, CompanyModule],
  controllers: [VoucherMaintenanceController],
  providers: [
    {
      provide: "OpenPayableHeaderModel",
      useValue: OpenPayableHeaderModel,
    },
    {
      provide: "PayableHistoryHeaderModel",
      useValue: OpenPayableHistoryHeaderModel,
    },
    {
      provide: "OpenPayableDetailsModel",
      useValue: OpenPayableDetailsModel,
    },
    {
      provide: "OpenPayableHistoryDetailModel",
      useValue: OpenPayableHistoryDetailModel,
    },
    {
      provide: "VendorModel",
      useValue: VendorModel,
    },
    {
      provide: "VoucherHeaderModel",
      useValue: VoucherHeaderModel,
    },
    {
      provide: "VoucherDetailModel",
      useValue: VoucherDetailModel,
    },
    {
      provide: "CompanyModel",
      useValue: CompanyModel,
    },
    {
      provide: "CheckInquiryHistoryModel",
      useValue: CheckInquiryHistoryModel,
    },
    {
      provide: "VoucherMaintenanceInterface",
      useClass: VoucherMaintenanceRepository,
    },
    VoucherMaintenanceRepository,
    GetVoucherMaintenanceUseCase,
    GetVoucherSummaryMaintenanceUseCase,
    getVoucherMaintenanceViewUseCase,
    UpdateVoucherMaintenanceStatusUseCase,
    UpdateDiscountUseCase,
    TransferVoucherUseCase,
    AppLogger,
  ],
})
export class VoucherMaintenanceModule {}
