import { Module } from "@nestjs/common";
import { PaymentController } from "./controllers/payment.controller";
import { PaymentTypesUseCase } from "./usecases/payment-types/payment-types.usecase";
import { SubmitPaymentTypeUseCase } from "./usecases/payment-selection/submit-payment-type.usecase";
import { SubmitPaymentVendorUseCase } from "./usecases/payment-vendor/submit-payment-vendor.usecase";
import { CashRequirementReportsUsecase } from "./usecases/cash-requirement/cash-requirement-reports.usecase";
import { ApCheckReportsUsecase } from "./usecases/ap-check/ap-check-reports.usecase";
import { PaymentSharedService } from "./shared-services/payment.shared.service";
import { PaymentValidationService } from "./validations/payment.validation.service";
import { GlMasterModule } from "@src/main/account-payable/domain/services/gl-master/gl-master.module";
import { GlMasterRepository } from "../../data/repositories/gl-master.repository";
import { GlMasterModel } from "../../data/models/gl-master.model";
import { VoucherHeaderValidationService } from "../voucher/validations/voucher-header.validation.service";
import { GeneralSystemModule } from "../../domain/services/general-system/general-system.module";
import { ApdateModule } from "../../domain/services/apdate/apdate.module";
import { VoucherHeaderRepository } from "../../data/repositories/voucher-header.repository";
import { VoucherHeaderModel } from "../../data/models/voucher-header.model";
import { VendorAppService } from "../../domain/services/vendor/vendor.service";
import { VendorModel } from "../../data/models/vendor.model";
import { VendorRepository } from "../../data/repositories/vendor.repository";
import { VendorContactDetailModel } from "../../data/models/vendor-contact-detail.model";
import { VoucherMaintenanceRepository } from "../../data/repositories/voucher-maintenance.repository";
import { OpenPayableHeaderModel } from "../../data/models/open-payable-header.model";
import { OpenPayableHistoryDetailModel } from "../../data/models/open-payable-history-detail.model";
import { OpenPayableDetailsModel } from "../../data/models/open-payable-details.model";
import { OpenPayableHistoryHeaderModel } from "../../data/models/open-payable-history-header.model";
import { GapptUserRepository } from "../../data/repositories/gappt-user.repository";
import { GapptUserModel } from "../../data/models/gappt-user.dynamic.model";
import { VoucherDetailModel } from "../../data/models/voucher-detail.model";
import { CompanyModel } from "../../data/models/company.model";
import { CheckInquiryHistoryModel } from "../../data/models/check-inquiry-history.model";
import { DynamicModelInitializationRepository } from "@src/shared/infrastructure/data/repository/dynamic-model-initialization.repository";
import { SpooledMetadataReportModel } from "../../data/models/spooled-metadata-report.model";
import { SpooledMetaDataReportsRepository } from "../../data/repositories/spooled-meta-data-reports.repository";
import { PurchaseJournalAppModule } from "../../domain/services/purchase-journal/purchase-journal.module";
import { DynamicTableOperations } from "@src/shared/infrastructure/dynamicTableOperations/dynamicTableOperation";

@Module({
  imports: [GlMasterModule, GeneralSystemModule, ApdateModule, PurchaseJournalAppModule],
  controllers: [PaymentController],
  providers: [
    PaymentTypesUseCase,
    SubmitPaymentTypeUseCase,
    SubmitPaymentVendorUseCase,
    PaymentSharedService,
    PaymentValidationService,
    VoucherHeaderValidationService,
    VendorAppService,
    CashRequirementReportsUsecase,
    ApCheckReportsUsecase,
    {
      provide: "VoucherHeaderInterface",
      useClass: VoucherHeaderRepository,
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
      provide: "GlMasterInterface",
      useClass: GlMasterRepository,
    },
    {
      provide: "GlMasterModel",
      useValue: GlMasterModel,
    },
    {
      provide: "VendorInterface",
      useClass: VendorRepository,
    },
    {
      provide: "VendorModel",
      useValue: VendorModel,
    },
    {
      provide: "VendorContactDetailModel",
      useValue: VendorContactDetailModel,
    },
    {
      provide: "VoucherMaintenanceInterface",
      useClass: VoucherMaintenanceRepository,
    },
    {
      provide: "OpenPayableHeaderModel",
      useValue: OpenPayableHeaderModel,
    },
    {
      provide: "OpenPayableHistoryHeaderModel",
      useValue: OpenPayableHistoryHeaderModel,
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
      provide: "CompanyModel",
      useValue: CompanyModel,
    },
    {
      provide: "CheckInquiryHistoryModel",
      useValue: CheckInquiryHistoryModel,
    },
    {
      provide: "GapptUserInterface",
      useClass: GapptUserRepository,
    },
    {
      provide: "GapptUserModel",
      useValue: GapptUserModel,
    },
    {
      provide: "SpooledMetaDataReportsInterface",
      useClass: SpooledMetaDataReportsRepository,
    },
    {
      provide: "SpooledMetadataReportModel",
      useValue: SpooledMetadataReportModel,
    },
    DynamicModelInitializationRepository,
    DynamicTableOperations,
  ],
})
export class PaymentModule {}
