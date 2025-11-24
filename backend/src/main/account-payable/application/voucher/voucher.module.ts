import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { QUEUE_NAMES } from "@src/shared/constants/constant";
import { GetCompaniesUseCase } from "./usecases/get-companies/get-companies.usecase";
import { GetProcessTypes } from "./usecases/get-process-types/get-process-types.usecase";
import { VoucherController } from "./controllers/voucher.controller";
import { CompanyModule } from "@src/main/account-payable/domain/services/company/company.module";
import { GetVoucherHeaderUseCase } from "./usecases/get-voucher-header/get-voucher-header.usecase";
import { VoucherHeaderRepository } from "@src/main/account-payable/data/repositories/voucher-header.repository";
import { VoucherDetailRepository } from "@src/main/account-payable/data/repositories/voucher-detail.repository";
import { GetVoucherDetailUseCase } from "./usecases/get-voucher-detail/get-voucher-detail.usecase";
import { VoucherHeaderModel } from "../../data/models/voucher-header.model";
import { VoucherDetailModel } from "../../data/models/voucher-detail.model";
import { VendorModule } from "../../domain/services/vendor/vendor.module";
import { GetVendorUseCase } from "./usecases/get-vendors/get-vendor.usecase";
import { VoucherAppModule } from "../../domain/services/voucher/voucher.module";
import { GetVoucherEntryUseCase } from "./usecases/get-voucher-entry/get-voucher-entry.usecase";
import { VoucherDetailValidation } from "./validations/voucher-detail.validation";
import { GetVendorByIdUseCase } from "./usecases/get-vendor-by-id/get-vendor-by-id.usecase";
import { SoftDeleteVoucherUseCase } from "./usecases/soft-delete-voucher/soft-delete-voucher.usecase";
import { SubmitVoucherUseCase } from "./usecases/submit-voucher/submit-voucher.usecase";
import { VoucherHeaderValidationUseCase } from "./usecases/post-header-validation/post-header-validation.usecase";
import { GetVoucherConfigUseCase } from "./usecases/voucher-config/get-voucher-config.usecase";
import { VoucherCsvUploadUseCase } from "./usecases/upload-csv/upload-csv.usecase";
import { QueueSelector } from "@src/shared/config/queue-selector";
import { VoucherSharedService } from "./shared-services/voucher.shared.service";
import { VoucherHeaderValidationService } from "./validations/voucher-header.validation.service";
import { ApdateModule } from "../../domain/services/apdate/apdate.module";
import { GeneralSystemModule } from "../../domain/services/general-system/general-system.module";
import { FreightInvoiceHeaderModule } from "../../domain/services/freight-invoice-header/freight-invoice-header.module";
import { CarrierInvoiceHeaderModule } from "../../domain/services/carrier-invoice-header/carrier-invoice-header.module";
import { GlMasterModule } from "../../domain/services/gl-master/gl-master.module";
import { InventoryFutureTransModule } from "../../domain/services/inventory-future-trans/inventory-future-trans.module";
import { InventoryHistoryModule } from "../../domain/services/inventory-history/inventory-history.module";
import { VendorRepository } from "@src/main/account-payable/data/repositories/vendor.repository";
import { InventoryFutureTransRepository } from "@src/main/account-payable/data/repositories/inventory-future-trans.repository";
import { InventoryHistoryRepository } from "@src/main/account-payable/data/repositories/inventory-history.repository";
import { InventoryFutureTransModel } from "@src/main/account-payable/data/models/inventory-future-trans.model";
import { InventoryHistoryModel } from "@src/main/account-payable/data/models/inventory-history.model";
import { VendorModel } from "../../data/models/vendor.model";
import { CompanyRepository } from "@src/main/account-payable/data/repositories/company.repository";
import { CompanyModel } from "@src/main/account-payable/data/models/company.model";
import { VoucherDetailValidationService } from "./shared-services/voucher-detail.shared.service";
import { GetGlMasterUseCase } from "./usecases/gl-master/get-gl-master.usecase";
import { GlMasterRepository } from "../../data/repositories/gl-master.repository";
import { FlexiProcessor } from "./shared-services/flexi.processor";
import { SogasProcessor } from "./shared-services/sogas.processor";
import { WebsocketModule } from "src/shared/websocket/websocket.module";
import { GlMasterModel } from "../../data/models/gl-master.model";
import { GetVoucherSummaryUseCase } from "./usecases/get-voucher-summary/get-voucher-summary.usecase";
import { GetSogasEntryUseCase } from "./usecases/get-sogas-entry/get-sogas-entry.usecase";
import { GetCarrierInvoicesUseCase } from "./usecases/get-carrier-invoices/get-carrier-invoices.usecase";
import { FreightInvoiceHeaderRepository } from "../../data/repositories/freight-invoice-header.repository";
import { FreightInvoiceHeaderModel } from "../../data/models/freight-invoice-header.model";
import { FreightOutBalancingInvoiceModel } from "../../data/models/freight-out-balancing-header.model";
import { CarrierInvoiceHeaderModel } from "../../data/models/carrier-invoice-header.model";
import { FreightCarrierInvoiceModel } from "../../data/models/freight-carrier-invoice.model";
import { GetPaperEntryUseCase } from "./usecases/get-paper-entry/get-paper-entry.usecase";
import { GetFlexiEntryUseCase } from "./usecases/get-flexi-entry/get-flexi-entry.usecase";
import { OwnerVendorReferenceRepository } from "../../data/repositories/owner-vendor-reference.repository";
import { OwnerVendorReferenceModel } from "../../data/models/owner-vendor-reference.model";
import { PaperBatchCreateUseCase } from "./usecases/paper-batch-create/paper-batch-create.usecase";
import { VoucherBatchProcessor } from "./shared-services/voucher-batch-processor";
import { GetLmsEntryUseCase } from "./usecases/get-lms-entry/get-lms-entry.usecase";
import { GetLmsCarrierInvoicesUseCase } from "./usecases/get-lms-carrier-invoices/get-lms-carrier-invoices.usecase";
import { GetCalculatedDueDatesUseCase } from "./usecases/get-calculated-due-dates/get-calculated-due-dates.usecase";
import { SalesAnalysisDetailRepository } from "../../data/repositories/sales-analysis-detail.repository";
import { SalesAnalysisMiscRepository } from "../../data/repositories/sales-analysis-misc.repository";
import { ProdMoveMiscLogicalRepository } from "../../data/repositories/prod-move-misc-logical.repository";
import { ProdMoveDetailLogicalRepository } from "../../data/repositories/prod-move-detail-logic.repository";
import { BillingControlFileRepository } from "../../data/repositories/billing-control-file.repository";
import { ContainerUomConversionRepository } from "../../data/repositories/container-uom-conversion.repository";
import { BillingControlFileModel } from "../../data/models/billing-control-file.model";
import { ContainerUnitofMeasureConversionModel } from "../../data/models/container-uom-conversion.model";
import { SalesAnalysisDetailModel } from "../../data/models/sales-analysis-detail.model";
import { SalesAnalysisMiscModel } from "../../data/models/sales-analysis-misc.model";
import { ProdMoveDetailLogicalModel } from "../../data/models/prod-move-detail-logical.model";
import { ProdMoveMiscLogicalModel } from "../../data/models/prod-move-misc-logical.model";
import { CarrierInvoiceHeaderRepository } from "../../data/repositories/carrier-invoice-header.repository";
import { GeneralSystemRepository } from "../../data/repositories/general-system.repository";
import { GeneralSystemModel } from "../../data/models/general-system.model";
import { SoftDeleteVoucherDetailUseCase } from "./usecases/soft-delete-voucher-detail/soft-delete-voucher-detail.usecase";
import { VoucherCleanupService } from "./shared-services/voucher-cleanup.service";
import { VendorContactDetailModel } from "../../data/models/vendor-contact-detail.model";
import { VendorSharedService } from "./shared-services/vendor.shared.service";
import { LmsBatchCreateUseCase } from "./usecases/lms-batch-create/lms-batch-create.usecase";
import { ApdateRepository } from "../../data/repositories/apdate.repository";
import { ApdateModel } from "../../data/models/apdate.model";
import { DynamicModelInitializationRepository } from "@src/shared/infrastructure/data/repository/dynamic-model-initialization.repository";
import { DynamicTableOperations } from "@src/shared/infrastructure/dynamicTableOperations/dynamicTableOperation";
import { OpenPayableHeaderModel } from "../../data/models/open-payable-header.model";
import { OpenPayableHistoryHeaderModel } from "../../data/models/open-payable-history-header.model";

@Module({
  imports: [
    CompanyModule,
    VendorModule,
    VoucherAppModule,
    ApdateModule,
    GeneralSystemModule,
    FreightInvoiceHeaderModule,
    CarrierInvoiceHeaderModule,
    GlMasterModule,
    InventoryFutureTransModule,
    InventoryHistoryModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.FLEXI,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "fixed",
          delay: 5000,
        },
      },
    }),
    BullModule.registerQueue({
      name: QUEUE_NAMES.SOGAS,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "fixed",
          delay: 5000,
        },
      },
    }),
    BullModule.registerQueue({
      name: QUEUE_NAMES.PAPER,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "fixed",
          delay: 5000,
        },
      },
    }),
    WebsocketModule,
  ],
  controllers: [VoucherController],
  providers: [
    // Use Cases
    GetCompaniesUseCase,
    GetVendorUseCase,
    GetVoucherEntryUseCase,
    GetSogasEntryUseCase,
    GetCarrierInvoicesUseCase,
    GetLmsCarrierInvoicesUseCase,
    GetFlexiEntryUseCase,
    GetProcessTypes,
    GetVoucherConfigUseCase,
    GetVoucherHeaderUseCase,
    GetVoucherDetailUseCase,
    SubmitVoucherUseCase,
    VoucherHeaderValidationUseCase,
    VoucherCsvUploadUseCase,
    PaperBatchCreateUseCase,
    QueueSelector,
    GetVendorByIdUseCase,
    SoftDeleteVoucherUseCase,
    GetGlMasterUseCase,
    VoucherSharedService,
    PaperBatchCreateUseCase,
    SoftDeleteVoucherDetailUseCase,
    VoucherCleanupService,
    VendorSharedService,
    // Services
    VoucherHeaderValidationService,
    VoucherDetailValidationService,
    VoucherSharedService,
    VoucherDetailValidationService,

    // Repositories
    VoucherHeaderRepository,
    VoucherDetailRepository,
    VendorRepository,

    // Interfaces
    {
      provide: "GeneralSystemInterface",
      useClass: GeneralSystemRepository,
    },
    {
      provide: "CarrierInvoiceHeaderInterface",
      useClass: CarrierInvoiceHeaderRepository,
    },
    {
      provide: "SalesAnalysisDetailInterface",
      useClass: SalesAnalysisDetailRepository,
    },
    {
      provide: "SalesAnalysisMiscInterface",
      useClass: SalesAnalysisMiscRepository,
    },
    {
      provide: "ProdMoveMiscLogicalInterface",
      useClass: ProdMoveMiscLogicalRepository,
    },
    {
      provide: "ProdMoveDetailLogicalInterface",
      useClass: ProdMoveDetailLogicalRepository,
    },
    {
      provide: "ContainerUomConversionInterface",
      useClass: ContainerUomConversionRepository,
    },
    {
      provide: "BillingControlFileInterface",
      useClass: BillingControlFileRepository,
    },
    {
      provide: "VoucherHeaderInterface",
      useClass: VoucherHeaderRepository,
    },
    {
      provide: "VoucherDetailInterface",
      useClass: VoucherDetailRepository,
    },
    {
      provide: "ApdateInterface",
      useClass: ApdateRepository,
    },
    {
      provide: "ApdateModel",
      useValue: ApdateModel,
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
      provide: "VendorModel",
      useValue: VendorModel,
    },
    {
      provide: "VendorContactDetailModel",
      useValue: VendorContactDetailModel,
    },
    {
      provide: "OpenPayableHeaderModel",
      useValue: OpenPayableHeaderModel,
    },
    {
      provide: "OpenPayableHistoryHeaderModel",
      useValue: OpenPayableHistoryHeaderModel,
    },
    VoucherDetailValidation,
    GetVendorByIdUseCase,
    GetVoucherEntryUseCase,
    GetProcessTypes,
    SoftDeleteVoucherUseCase,
    GetVoucherConfigUseCase,
    GetVoucherHeaderUseCase,
    GetVoucherDetailUseCase,
    SubmitVoucherUseCase,
    FlexiProcessor,
    SogasProcessor,
    VoucherBatchProcessor,
    {
      provide: "GlMasterInterface",
      useClass: GlMasterRepository,
    },
    {
      provide: "VendorInterface",
      useClass: VendorRepository,
    },
    {
      provide: "InventoryFutureTransInterface",
      useClass: InventoryFutureTransRepository,
    },
    {
      provide: "InventoryHistoryInterface",
      useClass: InventoryHistoryRepository,
    },
    {
      provide: "CompanyInterface",
      useClass: CompanyRepository,
    },

    OwnerVendorReferenceRepository,

    // Models
    {
      provide: "GeneralSystemModel",
      useValue: GeneralSystemModel,
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
      provide: "VendorModel",
      useValue: VendorModel,
    },
    {
      provide: "GlMasterModel",
      useValue: GlMasterModel,
    },
    {
      provide: "InventoryFutureTransModel",
      useValue: InventoryFutureTransModel,
    },
    {
      provide: "InventoryHistoryModel",
      useValue: InventoryHistoryModel,
    },
    {
      provide: "CompanyModel",
      useValue: CompanyModel,
    },
    {
      provide: "FreightInvoiceHeaderInterface",
      useClass: FreightInvoiceHeaderRepository,
    },
    {
      provide: "FreightInvoiceHeaderModel",
      useValue: FreightInvoiceHeaderModel,
    },
    {
      provide: "FreightOutBalancingInvoiceModel",
      useValue: FreightOutBalancingInvoiceModel,
    },
    {
      provide: "CarrierInvoiceHeaderModel",
      useValue: CarrierInvoiceHeaderModel,
    },
    {
      provide: "FreightCarrierInvoiceModel",
      useValue: FreightCarrierInvoiceModel,
    },
    {
      provide: "BillingControlFileModel",
      useValue: BillingControlFileModel,
    },
    {
      provide: "ContainerUnitofMeasureConversionModel",
      useValue: ContainerUnitofMeasureConversionModel,
    },
    {
      provide: "SalesAnalysisDetailModel",
      useValue: SalesAnalysisDetailModel,
    },
    {
      provide: "SalesAnalysisMiscModel",
      useValue: SalesAnalysisMiscModel,
    },
    {
      provide: "ProdMoveDetailLogicalModel",
      useValue: ProdMoveDetailLogicalModel,
    },
    {
      provide: "ProdMoveMiscLogicalModel",
      useValue: ProdMoveMiscLogicalModel,
    },

    VoucherDetailValidationService,
    GetGlMasterUseCase,
    GetPaperEntryUseCase,
    GetLmsEntryUseCase,
    {
      provide: "OwnerVendorReferenceModel",
      useValue: OwnerVendorReferenceModel,
    },
    // Validations
    VoucherDetailValidation,
    VoucherDetailValidationService,
    GetGlMasterUseCase,
    GetVoucherSummaryUseCase,
    LmsBatchCreateUseCase,
    GetCalculatedDueDatesUseCase,
    DynamicModelInitializationRepository,
    DynamicTableOperations,
  ],
})
export class VoucherModule {}
