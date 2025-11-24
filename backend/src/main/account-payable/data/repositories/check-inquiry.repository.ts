import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import {
  CheckInquiryInterface,
  CheckInquiryHistoryValidationData,
  CheckInquiryHistoryValidationResult,
  CheckInquiryHistoryValidationDataWithBankGl,
  ProcessMultipleChecksData,
  ProcessMultipleChecksResult,
} from "@src/main/account-payable/domain/interface/check-inquiry.interface";
import { CheckInquiryModel } from "../models/check-inquiry.model";
import { CheckInquiryHistoryModel } from "../models/check-inquiry-history.model";
import { Op, where, literal, col } from "@sequelize/core";
import { CheckInquiryEntity } from "../../domain/entities/check-inquiry.entity";
import {
  getLastPaymentInfo,
  getPaymentHistory,
  lastPaymentInfo,
} from "@src/types/check-inquiry-types";
import { VendorModel } from "../models/vendor.model";
import { checkInquiryVoucherDetailDto } from "../../application/check-inquiry/dto/check-inquiry.dto";
import { CheckInquiryVoucherDetailModel } from "../models/check-inquiry-voucher-detail.model";
import { AppLogger } from "@src/shared/logger/logger.service";
import { CheckInquiryLineItemModel } from "../models/check-inquiry-line-item.model";
import { Vendor } from "../../domain/entities/vendor.entity";
import { checkInquiryLineItemMapper } from "../mappers/check-inquiry-line-item.mapper";
import { checkInquiryVoucherDetailMapper } from "../mappers/check-inquiry-voucher-detail.mapper";
import { CheckInquiryLineItemEntity } from "../../domain/entities/check-inquiry-line-item.entity";
import { CheckInquiryVoucherDetailEntity } from "../../domain/entities/check-inquiry-voucher-detail.entity";
import { AMCODE, BANK_STATUS } from "@src/shared/constants/constant";
import { convertDateFormat, convertMmddyyToFormats, DATE_FORMATS, formatToMMDDYY } from "@src/shared/utils/format-date";
import { errorResponse } from "@src/shared/utils/response-formatter";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";

@Injectable()
export class CheckInquiryRepository implements CheckInquiryInterface {
  private readonly logger = new AppLogger(CheckInquiryRepository.name);

  constructor(
    @Inject("CheckInquiryModel")
    private readonly checkInquiryModel: typeof CheckInquiryModel,

    @Inject("CheckInquiryHistoryModel")
    private readonly checkInquiryHistoryModel: typeof CheckInquiryHistoryModel,

    @Inject("CheckInquiryVoucherDetailModel")
    private readonly checkInquiryVoucherDetailModel: typeof CheckInquiryVoucherDetailModel,

    @Inject("CheckInquiryLineItemModel")
    private readonly checkInquiryLineItemModel: typeof CheckInquiryLineItemModel,

    @Inject("VendorModel")
    private readonly vendorModel: typeof VendorModel
  ) { }

  async getVendorName(
    companyNo: number,
    vendorNo: number
  ): Promise<Vendor | null> {
    this.logger.log(
      `Fetching Vendor Details: ${companyNo} VendorNo: ${vendorNo}}`
    );

    try {
      const vendorDetails = await this.vendorModel.findOne({
        where: {
          vendorCompanyNumber: companyNo,
          vendorIsDeleted: { [Op.notIn]: ["D", "I"] },
          vendorNo,
        },
        attributes: ["vendorName", "vendorCurrentBalance"],
      });

      return vendorDetails as Vendor | null;
    } catch (error) {
      this.logger.warn(
        `Failed to Vendor Details: ${companyNo} VendorNo: ${vendorNo}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      throw error;
    }
  }

  async getLastPaymentInfo(data: getLastPaymentInfo): Promise<lastPaymentInfo> {
    const { companyNo, vendorNo, checkNo, invoiceNo, startDate } = data;

    const vendorDetails = await this.getVendorName(companyNo, vendorNo);

    // Last Payment Info
    const lastPaymentInfo = await this.checkInquiryModel.findOne({
      attributes: ["companyNo", "vendorNo", "grossAmount", "lastPaidDate"],
      where: {
        companyNo,
        vendorNo,
        ...(checkNo && { checkNo }),
        ...(invoiceNo && { invoiceNo }),
        ...(startDate && {
          [Op.and]: [
            where(
              literal(
                `"bankGLNumber"."${(this.checkInquiryHistoryModel as any).getAttributes().checkDate.field}"`
              ),
              { [Op.gte]: startDate }
            ),
          ],
        }),
      },
      include: [
        {
          model: this.checkInquiryHistoryModel,
          as: "bankGLNumber",
          required: true,
          attributes: ["checkDate"],
          where: {
            companyNo,
            vendorNo,
          },
        },
      ],
      order: [["lastPaidDate", "DESC"]],
      raw: true,
    });

    this.logger.log(`lastPaymentInfo: ${JSON.stringify(lastPaymentInfo)}`)

    return {
      companyNo: lastPaymentInfo?.companyNo ?? companyNo,
      vendorNo: lastPaymentInfo?.vendorNo ?? vendorNo,
      grossAmount: lastPaymentInfo?.grossAmount ?? 0,
      lastPaidDate: lastPaymentInfo?.lastPaidDate ? convertDateFormat(lastPaymentInfo.lastPaidDate, DATE_FORMATS.YYMMDD, DATE_FORMATS.MMDDYY) : '',
      vendorName: vendorDetails?.vendorName?.trim() || "",
      openPayables: vendorDetails?.vendorCurrentBalance || 0,
    };
  }

  async getPaymentHistory(data: getPaymentHistory): Promise<{
    rows: CheckInquiryEntity[];
    count: number;
    limit: number;
    page: number;
  }> {
    try {

      const { companyNo, vendorNo, invoiceNo, checkNo, startDate, limit, offset, page } = data;

      const vendorDetails = await this.getVendorName(companyNo, vendorNo);

      const { rows, count } = await this.checkInquiryModel.findAndCountAll({
        attributes: [
          "companyNo",
          "vendorNo",
          "checkNo",
          "invoiceNo",
          "invoiceDescription",
          "paidAmount",
          "grossAmount",
          "voucherNo",
          "invoiceDate",
          "discount",
          "dueDate",
          "bankGLNo",
          "lastPaidDate",
          [
            literal(`
              CASE 
                WHEN "bankGLNumber"."${(this.checkInquiryHistoryModel as any).getAttributes().checkDate.field}" IS NOT NULL 
                THEN "bankGLNumber"."${(this.checkInquiryHistoryModel as any).getAttributes().code.field}"
                ELSE 'R' 
              END
            `),
            "bank_status",
          ],
        ],
        where: {
          companyNo,
          vendorNo,
          ...(checkNo && { checkNo }),
          ...(invoiceNo && { invoiceNo }),
          ...(startDate && {
            [Op.and]: [
              where(
                literal(
                  `"bankGLNumber"."${(this.checkInquiryHistoryModel as any).getAttributes().checkDate.field}"`
                ),
                { [Op.gte]: startDate }
              ),
            ],
          }),
        },
        offset,
        limit,
        include: [
          {
            model: this.checkInquiryHistoryModel,
            as: "bankGLNumber",
            required: false,
            attributes: ["vendorName", "checkDate",],
            where: {
              companyNo,
              vendorNo,
            },
            on: {
              [Op.and]: [
                where(col(`CheckInquiryModel.${(this.checkInquiryModel as any).getAttributes().bankGLNo.field}`), Op.eq,
                  col(`bankGLNumber.${(this.checkInquiryHistoryModel as any).getAttributes().bankGLNo.field}`)),
                where(col(`CheckInquiryModel.${(this.checkInquiryModel as any).getAttributes().checkNo.field}`), Op.eq,
                  col(`bankGLNumber.${(this.checkInquiryHistoryModel as any).getAttributes().checkNo.field}`)),
              ]
            }
          },
        ],
        logging: (sql) => this.logger.debug(`Executing query: ${sql}`)
      });

      if (rows.length === 0) {
        throw new HttpException(
          errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
            {
              field: "check-inquiry",
              code: ERROR_CONSTANTS.NOT_FOUND.code,
              message: `Record not found`,
            },
          ]),
          HttpStatus.NOT_FOUND
        );
      }

      const formattedRows = rows.map((row: any) => {
        const plain = row.toJSON();
        plain.bank_status =  BANK_STATUS[plain.bank_status]
        plain.lastPaidDate = convertDateFormat(plain.lastPaidDate, DATE_FORMATS.YYMMDD, DATE_FORMATS.MMDDYY);
        plain.bankGLNumber = plain.bankGLNumber ? {
          vendorName: plain.bankGLNumber.vendorName?.trim(),
          checkDate: formatToMMDDYY(plain.bankGLNumber.checkDate)
        } : {
          vendorName: vendorDetails?.vendorName?.trim(),
          checkDate: 0
        }
        return plain;
      });

      return { rows: formattedRows, count, limit, page };

    } catch (error) {
      throw error
    }
  }

  async getVoucherDetails(data: checkInquiryVoucherDetailDto): Promise<{
    vendorDetail: Vendor | null;
    headerItems: CheckInquiryVoucherDetailEntity | null;
    detailItems: CheckInquiryLineItemEntity[] | [];
  } | null> {
    const { companyNo, vendorNo, voucherNo } = data;

    try {
      this.logger.log(
        `Fetching Voucher details for companyNo: ${companyNo} VendorNo: ${vendorNo}, VoucherNo: ${voucherNo}`
      );

      const vendorDetails = await this.getVendorName(companyNo, vendorNo);

      const rawResult = (await this.checkInquiryModel.findOne({
        where: {
          companyNo,
          vendorNo,
          voucherNo,
        },
        attributes: [
          "vendorNo",
          "companyNo",
          "voucherNo",
          "bankGLNo",
          "checkNo",
        ],
        include: [
          {
            model: this.checkInquiryVoucherDetailModel,
            as: "voucherDetails",
            required: true,
            where: {
              companyNo,
              vendorNo,
              voucherNo,
            },
            attributes: [
              "invoiceDate",
              "invoiceNo",
              "invoiceDescription",
              "discountDueDate",
              "dueDate",
              "prepaidVoucher",
              "checkNo",
              "singleCheck",
              "bankGLNo",
              "apGLAccountNo",
              "heldPaymentVoucher",
              "heldDescription",
              "grossAmount",
              "freightTotal",
              "discount",
              "paidOn8",
              "salesOrderNo",
              "salesSRNNo",
            ],
          },
          {
            model: this.checkInquiryLineItemModel,
            as: "lineItem",
            required: false,
            where: {
              companyNo,
              vendorNo,
              voucherNo,
            },
            attributes: [
              "detailLineAmount",
              "detailLineDescription",
              "detailLineDiscount",
              "poNumber",
              "freightAmount",
              "gallons",
              "receiptNumber",
              "quantity",
              "openClosedStatus",
              "expenseGLAccount",
              "detailLineDiscount",
            ],
          },
        ],
      })) as any;

      const result = rawResult?.get({ plain: true });

      if (!result) return null;

      const { voucherDetails, lineItem, ...restResult } = result; // destructure to remove unwanted fields

      // Map using the correct mappers
      const response = {
        vendorDetail: { ...restResult, vendorDetails },
        headerItems:
          checkInquiryVoucherDetailMapper.toResponse(result?.voucherDetails) ||
          {},
        detailItems:
          result?.lineItem?.map((item: any) =>
            checkInquiryLineItemMapper.toResponse(item)
          ) || [],
      };

      return response;
    } catch (error) {
      this.logger.warn(
        `Failed to get Voucher details companyNo: ${companyNo} VendorNo: ${vendorNo}, VoucherNo: ${voucherNo}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      throw error;
    }
  }

  async validateCheckInquiryHistory(
    data: CheckInquiryHistoryValidationData
  ): Promise<CheckInquiryHistoryValidationResult> {
    const { checkNo, checkAmount, clearDateMmddyy, rowIndex } = data;
    const errors: Array<{
      field: string;
      message: string;
      code: string;
      rowIndex?: number;
    }> = [];

    try {
      // Validate date format MMDDYY
      if (!/^[0-9]{6}$/.test(clearDateMmddyy)) {
        errors.push({
          field: "clearDateMmddyy",
          message: "CLEAR DATE IS INVALID",
          code: "INVALID_DATE_FORMAT",
          rowIndex,
        });
        return { isValid: errors.length === 0, errors };
      }

      // Lookup by check number only per requirements (ignore company/vendor/bank for now)
      const record = await this.checkInquiryHistoryModel.findOne({
        where: { checkNo: Number(checkNo) },
        order: [["checkDate8", "DESC"]],
      });

      if (!record) {
        errors.push({
          field: "checkNo",
          message: `INVALID CHECK NO ${checkNo}. CHECK NO NOT FOUND`,
          code: "CHECK_NOT_FOUND",
          rowIndex,
        });
        return { isValid: false, errors };
      }

      // Business status checks based on AMCODE
      const code = (record as any).code as string | undefined;
      if (code === AMCODE.DELETED) {
        errors.push({
          field: "checkNo",
          message: `INVALID CHECK NO ${checkNo}. CHECK WAS PREVIOUSLY DELETED`,
          code: "CHECK_DELETED",
          rowIndex,
        });
      } else if (code === AMCODE.RECONCILED) {
        errors.push({
          field: "checkNo",
          message: `INVALID CHECK NO ${checkNo}. CHECK IS ALREADY RECONCILED`,
          code: "CHECK_RECONCILED",
          rowIndex,
        });
      } else if (code === AMCODE.VOIDED) {
        errors.push({
          field: "checkNo",
          message: `INVALID CHECK NO ${checkNo}. CHECK WAS PREVIOUSLY VOIDED`,
          code: "CHECK_VOIDED",
          rowIndex,
        });
      } else if (code === AMCODE.OPEN) {
        // AMCODE.OPEN ('O') is valid - no error added, will return isValid: true
        // This allows open checks to pass validation
      }

      // Amount equality check (AMCKAM vs provided amount)
      const dbAmount = Number((record as any).checkAmount);
      const roundedDb = Math.round(dbAmount * 100) / 100;
      const roundedIn = Math.round(Number(checkAmount) * 100) / 100;
      if (roundedDb !== roundedIn) {
        errors.push({
          field: "checkAmount",
          message: "CLEAR AMOUNT DOES NOT MATCH",
          code: "AMOUNT_MISMATCH",
          rowIndex,
        });
      }

      return { isValid: errors.length === 0, errors };
    } catch (error) {
      this.logger.warn(
        `Failed to validate check inquiry history for checkNo: ${checkNo}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      throw error;
    }
  }

  async processMultipleChecks(
    data: ProcessMultipleChecksData[]
  ): Promise<ProcessMultipleChecksResult[]> {
    const results: ProcessMultipleChecksResult[] = [];

    for (const checkData of data) {
      const { checkNo, checkAmount, checkDate } = checkData;

      // Use utility function to convert date formats
      const dateFormats = convertMmddyyToFormats(checkDate);

      // Update the check record directly without validation
      const updateResult = await this.checkInquiryHistoryModel.update(
        {
          code: AMCODE.RECONCILED, // Set status to R (RECONCILED)
          clearDate: dateFormats.amcldt, // YYMMDD format (AMCLDT field)
          clearDate8: dateFormats.amcld8, // YYYYMMDD format (AMCLD8 field)
        },
        {
          where: { checkNo: Number(checkNo) },
        }
      );

      if (updateResult[0] > 0) {
        results.push({
          checkNo,
          checkAmount,
          checkDate,
          message: "Check processed successfully",
        });
      } else {
        results.push({
          checkNo,
          checkAmount,
          checkDate,
          message: "No records were updated",
          errors: [
            {
              field: "checkNo",
              message: "No records found to update",
              code: "UPDATE_FAILED",
            },
          ],
        });
      }
    }

    return results;
  }

  async validateCheckInquiryHistoryWithBankGl(
    data: CheckInquiryHistoryValidationDataWithBankGl
  ): Promise<CheckInquiryHistoryValidationResult> {
    const { checkNo, checkAmount, rowIndex, bankGl } = data;
    const entryInfo = typeof rowIndex === 'string' ? rowIndex : (rowIndex || 'Unknown');
    const errors: Array<{
      field: string;
      message: string;
      code: string;
      rowIndex?: number | string;
    }> = [];

    try {

      // Lookup by check number AND bankGl for accurate validation
      const record = await this.checkInquiryHistoryModel.findOne({
        where: { 
          checkNo: Number(checkNo),
          bankGLNo: Number(bankGl)
        },
        order: [["checkDate8", "DESC"]],
      });

      if (!record) {
        errors.push({
          field: "checkNo",
          message: `INVALID CHECK NO ${checkNo} with Bank GL ${bankGl} for Entry ${entryInfo}. CHECK NO NOT FOUND`,
          code: "CHECK_NOT_FOUND",
          rowIndex: rowIndex,
        });
        return { isValid: false, errors };
      }

      // Business status checks based on AMCODE
      const code = (record as any).code as string | undefined;
      if (code === AMCODE.DELETED) {
        errors.push({
          field: "checkNo",
          message: `INVALID CHECK NO ${checkNo} with Bank GL ${bankGl} for Entry ${entryInfo}. CHECK WAS PREVIOUSLY DELETED`,
          code: "CHECK_DELETED",
          rowIndex: rowIndex,
        });
      } else if (code === AMCODE.RECONCILED) {
        errors.push({
          field: "checkNo",
          message: `INVALID CHECK NO ${checkNo} with Bank GL ${bankGl} for Entry ${entryInfo}. CHECK IS ALREADY RECONCILED`,
          code: "CHECK_RECONCILED",
          rowIndex: rowIndex,
        });
      } else if (code === AMCODE.VOIDED) {
        errors.push({
          field: "checkNo",
          message: `INVALID CHECK NO ${checkNo} with Bank GL ${bankGl} for Entry ${entryInfo}. CHECK WAS PREVIOUSLY VOIDED`,
          code: "CHECK_VOIDED",
          rowIndex: rowIndex,
        });
      } else if (code !== AMCODE.OPEN) {
        errors.push({
          field: "checkNo",
          message: `INVALID CHECK NO ${checkNo} with Bank GL ${bankGl} for Entry ${entryInfo}. CHECK IS NOT OPEN`,
          code: "CHECK_NOT_OPEN",
          rowIndex: rowIndex,
        });
      }
      // Amount validation
      const recordAmount = Number((record as any).checkAmount);
      if (Math.abs(recordAmount - checkAmount) > 0.01) {
        errors.push({
          field: "checkAmount",
          message: `Check Total Amount does not match. for ${checkNo} Expected: ${recordAmount}, Received: ${checkAmount}`,
          code: "AMOUNT_MISMATCH",
          rowIndex: rowIndex,
        });
      }

      return { isValid: errors.length === 0, errors };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      this.logger.error(
        `Error validating check inquiry history with bankGl: ${errorMessage}`,
        errorStack
      );
      errors.push({
        field: "checkNo",
        message: `Server error occurred during validation for Entry ${entryInfo}`,
        code: "SERVER_ERROR",
        rowIndex: typeof rowIndex === 'number' ? rowIndex : undefined,
      });
      return { isValid: false, errors };
    }
  }
}
