import { Inject, Injectable } from "@nestjs/common";
import {
  CheckInquiryInterface,
  CheckInquiryHistoryValidationData,
  CheckInquiryHistoryValidationResult,
} from "@src/main/account-payable/domain/interface/check-inquiry.interface";

@Injectable()
export class ClearChecksValidationService {
  constructor(
    @Inject("CheckInquiryInterface")
    private readonly checkInquiryInterface: CheckInquiryInterface
  ) {}

  async validateAgainstDb(
    input: CheckInquiryHistoryValidationData
  ): Promise<CheckInquiryHistoryValidationResult> {
    return await this.checkInquiryInterface.validateCheckInquiryHistory(input);
  }
}
