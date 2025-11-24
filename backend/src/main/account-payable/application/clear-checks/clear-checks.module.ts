import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { QUEUE_NAMES } from "@src/shared/constants/constant";
import { WebsocketModule } from "@src/shared/websocket/websocket.module";
import { ClearChecksController } from "./controllers/clear-checks.controller";
import { ClearChecksUploadUseCase } from "./usecases/upload/upload.usecase";
import { ValidateSingleCheckUseCase } from "./usecases/validate-single-check/validate-single-check.usecase";
import { ProcessMultipleChecksUseCase } from "./usecases/process-multiple-checks/process-multiple-checks.usecase";
import { QueueSelector } from "@src/shared/config/queue-selector";
import { ClearChecksProcessor } from "./shared-services/clear-checks.processor";
import { ClearChecksValidationService } from "./validation/clear-checks.validation.service";
import { CheckInquiryRepository } from "../../data/repositories/check-inquiry.repository";
import { CheckInquiryModel } from "../../data/models/check-inquiry.model";
import { CheckInquiryHistoryModel } from "../../data/models/check-inquiry-history.model";
import { CheckInquiryVoucherDetailModel } from "../../data/models/check-inquiry-voucher-detail.model";
import { CheckInquiryLineItemModel } from "../../data/models/check-inquiry-line-item.model";
import { VendorModel } from "../../data/models/vendor.model";

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE_NAMES.CLEAR_CHECKS,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: "fixed", delay: 5000 },
      },
    }),
    WebsocketModule,
  ],
  controllers: [ClearChecksController],
  providers: [
    ClearChecksUploadUseCase,
    ValidateSingleCheckUseCase,
    ProcessMultipleChecksUseCase,
    QueueSelector,
    ClearChecksProcessor,
    ClearChecksValidationService,
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
})
export class ClearChecksModule {}
