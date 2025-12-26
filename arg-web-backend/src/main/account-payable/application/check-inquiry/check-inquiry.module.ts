import { Module } from "@nestjs/common";
import { CheckInquiryRepository } from "../../data/repositories/check-inquiry.repository";
import { CheckInquiryModel } from "../../data/models/check-inquiry.model";
import { CheckInquiryUseCase } from "./usecases/check-inquiry/check-inquiry.usecase";
import { CheckInquiryController } from "./controllers/check-inquiry.controller";
import { CheckInquiryHistoryModel } from "../../data/models/check-inquiry-history.model";
import { CheckInquiryLastPaymentInfoUseCase } from "./usecases/check-inquiry-last-payment-info/check-inquiry-last-payment-info.usecase";
import { VendorModel } from "../../data/models/vendor.model";
import { CheckInquiryVoucherDetailUseCase } from "./usecases/check-inquiry-voucher-detail/check-inquiry-voucher-detail.usecase";
import { CheckInquiryVoucherDetailModel } from "../../data/models/check-inquiry-voucher-detail.model";
import { CheckInquiryLineItemModel } from "../../data/models/check-inquiry-line-item.model";

@Module({
    imports: [],
    controllers: [CheckInquiryController],
    providers: [
        {
            provide: "CheckInquiryInterface",
            useClass: CheckInquiryRepository,
        },
        {
            provide: "CheckInquiryLineItemModel",
            useValue: CheckInquiryLineItemModel,
        },
        {
            provide: "CheckInquiryVoucherDetailModel",
            useValue: CheckInquiryVoucherDetailModel,
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
            provide: "VendorModel",
            useValue: VendorModel,
        },
        CheckInquiryUseCase,
        CheckInquiryLastPaymentInfoUseCase,
        CheckInquiryVoucherDetailUseCase
    ],
})
export class CheckInquiryModule { }
