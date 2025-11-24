import {
  getLastPaymentInfo,
  getPaymentHistory,
  lastPaymentInfo,
} from "@src/types/check-inquiry-types";
import { CheckInquiryEntity } from "../entities/check-inquiry.entity";
import { checkInquiryVoucherDetailDto } from "../../application/check-inquiry/dto/check-inquiry.dto";
import { Vendor } from "../entities/vendor.entity";
import { CheckInquiryLineItemEntity } from "../entities/check-inquiry-line-item.entity";
import { CheckInquiryVoucherDetailEntity } from "../entities/check-inquiry-voucher-detail.entity";

export interface CheckInquiryHistoryValidationData {
  checkNo: string | number;
  checkAmount: number;
  clearDateMmddyy: string;
  rowIndex?: number;
}

export interface CheckInquiryHistoryValidationDataWithBankGl {
  checkNo: string | number;
  checkAmount: number;
  clearDateMmddyy: string;
  rowIndex?: number | string; // Can be number (for clear-checks) or string (for entry numbers)
  bankGl: number; // Required for purchase journal validation
}

export interface CheckInquiryHistoryValidationResult {
  isValid: boolean;
  errors: Array<{
    field: string;
    message: string;
    code: string;
    rowIndex?: number|string;
  }>;
}

export interface ProcessMultipleChecksData {
  checkNo: string;
  checkAmount: number;
  checkDate: string; // MMDDYY format
}

export interface ProcessMultipleChecksResult {
  checkNo: string;
  checkAmount: number;
  checkDate: string;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
    code: string;
  }>;
}

export interface CheckInquiryInterface {
  getPaymentHistory(data: getPaymentHistory): Promise<{
    rows: CheckInquiryEntity[];
    count: number;
    limit: number;
    page: number;
  }>;
  getLastPaymentInfo(data: getLastPaymentInfo): Promise<lastPaymentInfo>;

  getVoucherDetails(data: checkInquiryVoucherDetailDto): Promise<{
    vendorDetail: Vendor | null;
    headerItems: CheckInquiryVoucherDetailEntity | null;
    detailItems: CheckInquiryLineItemEntity[];
  } | null>;

  validateCheckInquiryHistory(
    data: CheckInquiryHistoryValidationData
  ): Promise<CheckInquiryHistoryValidationResult>;

  validateCheckInquiryHistoryWithBankGl(
    data: CheckInquiryHistoryValidationDataWithBankGl
  ): Promise<CheckInquiryHistoryValidationResult>;

  processMultipleChecks(
    data: ProcessMultipleChecksData[]
  ): Promise<ProcessMultipleChecksResult[]>;
}
