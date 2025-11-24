import { Injectable, Logger, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { Op, WhereOptions, literal } from "@sequelize/core";
import { VoucherMaintenanceInterface } from "@src/main/account-payable/domain/interface/voucher-maintenance.interface";
import { OpenPayableHeaderModel } from "../models/open-payable-header.model";
import { OpenPayableHistoryHeaderModel } from "../models/open-payable-history-header.model";
import { VoucherMaintenance } from "@src/main/account-payable/domain/entities/voucher-maintenance.entity";
import { VoucherType } from "@src/shared/constants/voucher-type.enum";
import {
  mapToAptranHeaderInsertDto,
  mapToAptranDetailInsertDto,
  toResponse,
  toResponseArray,
  toViewEntity,
  toHistoryDetailEntity,
  toDetailEntity,
  toDetailResponseArray,
} from "../mappers/voucher-maintenance.mapper";
import {
  VoucherHeader,
  VoucherDetail,
} from "@src/main/account-payable/domain/entities/voucher.entity";
import { VoucherMaintenanceStatusCode } from "@src/shared/constants/voucher-type.enum";

import { VendorModel } from "../models/vendor.model";
import { AMCODE, IsDeletedStatus } from "@src/shared/constants/constant";
import { OpenPayableDetailsModel } from "../models/open-payable-details.model";
import { OpenPayableHistoryDetailModel } from "../models/open-payable-history-detail.model";
import { VoucherHeaderModel } from "../models/voucher-header.model";
import { VoucherDetailModel } from "../models/voucher-detail.model";
import { CompanyModel } from "../models/company.model";
import { convertDateFormat, DATE_FORMATS, dateToMmddyy, formatMMDDYYDate } from "@src/shared/utils/format-date";
import { errorResponse } from "@src/shared/utils/response-formatter";
import { ERROR_CONSTANTS, ERROR_MESSAGES } from "@src/shared/constants/error-constant";
import { CheckInquiryHistoryModel } from "../models/check-inquiry-history.model";

// Type for voucher view response
type VoucherViewResponse = {
  headerItems: ReturnType<typeof toResponse>;
  detailItems: ReturnType<typeof toDetailResponseArray>;
};

@Injectable()
export class VoucherMaintenanceRepository
  implements VoucherMaintenanceInterface
{
  private readonly logger = new Logger(VoucherMaintenanceRepository.name);

  constructor(
    @Inject("OpenPayableHeaderModel")
    private readonly openPayableHeaderModel: typeof OpenPayableHeaderModel,
    @Inject("PayableHistoryHeaderModel")
    private readonly openPayableHistoryHeaderModel: typeof OpenPayableHistoryHeaderModel,
    @Inject("OpenPayableDetailsModel")
    private readonly openPayableDetailsModel: typeof OpenPayableDetailsModel,
    @Inject("OpenPayableHistoryDetailModel")
    private readonly openPayableHistoryDetailModel: typeof OpenPayableHistoryDetailModel,
    @Inject("VendorModel")
    private readonly vendorModel: typeof VendorModel,
    @Inject("VoucherHeaderModel")
    private readonly voucherHeaderModel: typeof VoucherHeaderModel,
    @Inject("VoucherDetailModel")
    private readonly voucherDetailModel: typeof VoucherDetailModel,
    @Inject("CompanyModel")
    private readonly companyModel: typeof CompanyModel,
    @Inject("CheckInquiryHistoryModel")
    private readonly checkInquiryHistoryModel: typeof CheckInquiryHistoryModel,
  ) {}

  async findVouchers(
    companyNo: number,
    vendorNo?: number,
    voucherType?: VoucherType,
    invoiceDate?: string | Date,
    invoiceNo?: string,
    limit?: number,
    offset?: number,
    sortBy?: string,
    sortOrder?: "ASC" | "DESC"
  ): Promise<{ rows: VoucherMaintenance[]; count: number }> {
    try {
      this.logger.log(
        `Starting findVouchers with voucherType: ${voucherType}, companyNo: ${companyNo}, vendorNo: ${vendorNo}`
      );

      let count: number;
      let headers: any[];

      // Choose the appropriate model(s) based on voucher type
      if (voucherType === VoucherType.PAID) {
        // Use history table for PAID vouchers only
        this.logger.log(
          "Fetching PAID vouchers from Open Payable History Header table"
        );

        const whereClause = this.buildWhereClause(
          companyNo,
          vendorNo,
          voucherType,
          invoiceDate,
          invoiceNo
        );
        const orderClause = this.buildOrderClause(
          sortBy,
          sortOrder,
          voucherType
        );

        const result = await this.openPayableHistoryHeaderModel.findAndCountAll(
          {
            where: whereClause as any,
            attributes: [
              "isDeleted",
              "companyNo",
              "vendorNo",
              "voucherNo",
              "grossAmount",
              "discount",
              "partialPaidToDate",
              "invoiceDescription",
              "invoiceNo",
              "invoiceDate",
              "dueDate",
              "discountDueDate",
              "lastPaidDateYymmdd",
              "lastPaymentAmt",
              "HoldPymtVouchr",
              "HoldDescription",
              "PrepaidVoucher",
              "checkNo",
              "paidOnYymmdd",
              "CancelledVoucher",
            ],
            order: orderClause,
            limit: limit,
            offset: offset,
            raw: true,
          }
        );

        count = result.count;
        headers = result.rows;
        this.logger.log(`Found ${count} PAID vouchers in history table`);
      } else if (voucherType === VoucherType.UNPAID) {
        // Use current table for UNPAID vouchers only
        this.logger.log(
          "Fetching UNPAID vouchers from Open Payable Header table"
        );

        const whereClause = this.buildWhereClause(
          companyNo,
          vendorNo,
          voucherType,
          invoiceDate,
          invoiceNo
        );
        const orderClause = this.buildOrderClause(
          sortBy,
          sortOrder,
          voucherType
        );

        const result = await this.openPayableHeaderModel.findAndCountAll({
          where: whereClause as any,
          attributes: [
            "isDeleted",
            "companyNo",
            "vendorNo",
            "voucherNo",
            "grossAmount",
            "discount",
            "partialPaidToDate",
            "invoiceDescription",
            "invoiceNo",
            "invoiceDate6",
            "dueDate6",
            "discountDueDate6",
            "lastPaidDate8",
            "lastPaidAmount",
            "holdPaymentFlag",
            "holdDescription",
            "prepaidVoucherFlag",
          ],
          order: orderClause,
          limit: limit,
          offset: offset,
          raw: true,
        });

        count = result.count;
        headers = result.rows;
        this.logger.log(`Found ${count} UNPAID vouchers in current table`);
      } else if (voucherType === VoucherType.ALL) {
        // Fetch from BOTH tables for ALL vouchers
        this.logger.log(
          "Fetching ALL vouchers from both Open Payable Header and History Header tables"
        );

        // Get unpaid vouchers from current table
        const unpaidWhereClause = this.buildWhereClause(
          companyNo,
          vendorNo,
          VoucherType.UNPAID,
          invoiceDate,
          invoiceNo
        );
        const unpaidOrderClause = this.buildOrderClause(
          sortBy,
          sortOrder,
          VoucherType.UNPAID
        );

        const unpaidResult = await this.openPayableHeaderModel.findAndCountAll({
          where: unpaidWhereClause as any,
          attributes: [
            "isDeleted",
            "companyNo",
            "vendorNo",
            "voucherNo",
            "grossAmount",
            "discount",
            "partialPaidToDate",
            "invoiceDescription",
            "invoiceNo",
            "invoiceDate6",
            "dueDate6",
            "discountDueDate6",
            "lastPaidDate8",
            "lastPaidAmount",
            "holdPaymentFlag",
            "holdDescription",
            "prepaidVoucherFlag",
          ],
          order: unpaidOrderClause,
          raw: true,
        });

        // Get paid vouchers from history table
        const paidWhereClause = this.buildWhereClause(
          companyNo,
          vendorNo,
          VoucherType.PAID,
          invoiceDate,
          invoiceNo
        );
        const paidOrderClause = this.buildOrderClause(
          sortBy,
          sortOrder,
          VoucherType.PAID
        );

        const paidResult =
          await this.openPayableHistoryHeaderModel.findAndCountAll({
            where: paidWhereClause as any,
            attributes: [
              "isDeleted",
              "companyNo",
              "vendorNo",
              "voucherNo",
              "grossAmount",
              "discount",
              "partialPaidToDate",
              "invoiceDescription",
              "invoiceNo",
              "invoiceDate",
              "dueDate",
              "discountDueDate",
              "lastPaidDateYymmdd",
              "lastPaymentAmt",
              "HoldPymtVouchr",
              "HoldDescription",
              "PrepaidVoucher",
              "checkNo",
              "paidOnYymmdd",
              "CancelledVoucher",
            ],
            order: paidOrderClause,
            raw: true,
          });

        // Combine results
        const unpaidHeaders = unpaidResult.rows.map((row) => ({
          ...row,
          source: "current",
        }));
        const paidHeaders = paidResult.rows.map((row) => ({
          ...row,
          source: "history",
        }));

        headers = [...unpaidHeaders, ...paidHeaders];
        count = unpaidResult.count + paidResult.count;

        this.logger.log(
          `Found ${unpaidResult.count} UNPAID vouchers and ${paidResult.count} PAID vouchers, total: ${count}`
        );

        // Apply pagination to combined results
        if (limit && offset !== undefined) {
          headers = headers.slice(offset, offset + limit);
        }
      } else {
        // Default to current table (backward compatibility)
        this.logger.log(
          "Fetching vouchers from Open Payable Header table (default)"
        );

        const whereClause = this.buildWhereClause(
          companyNo,
          vendorNo,
          voucherType,
          invoiceDate,
          invoiceNo
        );
        const orderClause = this.buildOrderClause(
          sortBy,
          sortOrder,
          voucherType
        );

        const result = await this.openPayableHeaderModel.findAndCountAll({
          where: whereClause as any,
          attributes: [
            "isDeleted",
            "companyNo",
            "vendorNo",
            "voucherNo",
            "grossAmount",
            "discount",
            "partialPaidToDate",
            "invoiceDescription",
            "invoiceNo",
            "invoiceDate6",
            "dueDate6",
            "lastPaidDate8",
            "lastPaidAmount",
            "holdPaymentFlag",
            "holdDescription",
            "prepaidVoucherFlag",
          ],
          order: orderClause,
          limit: limit,
          offset: offset,
          raw: true,
        });

        count = result.count;
        headers = result.rows;
        this.logger.log(`Found ${count} vouchers in current table`);
      }

      if (count === 0) {
        this.logger.log("No vouchers found, returning empty result");
        return { rows: [], count: 0 };
      }

      // Get unique vendor numbers for batch lookup
      const vendorNos = [...new Set(headers.map((h) => h.vendorNo))];
      this.logger.log(
        `Looking up vendor data for ${vendorNos.length} unique vendors`
      );

      // Get vendor data in a single query
      const vendors = await this.vendorModel.findAll({
        where: {
          vendorCompanyNumber: companyNo,
          vendorNo: { [Op.in]: vendorNos },
        },
        raw: true,
      });

      // Create a map of vendorNo to vendor data (take the first one if multiple exist)
      const vendorMap = new Map();
      vendors.forEach((v) => {
        if (!vendorMap.has(v.vendorNo)) {
          vendorMap.set(v.vendorNo, v);
        }
      });

      // Combine headers with their vendor data
      const rows = headers.map((header) => {
        const vendorData = vendorMap.get(header.vendorNo) || {};
        return {
          ...header,
          vendor: {
            vendorName: vendorData.vendorName,
            vendorAddress1: vendorData.vendorAdd1,
            vendorAddress2: vendorData.vendorAdd2,
            vendorAddress3: vendorData.vendorAdd3,
            vendorAddress4: vendorData.vendorAdd4,
          },
        };
      });

      // Map to entities
      const entities = rows.map((row) => {
        const vendorData = row.vendor || {};
        const isFromHistory =
          row.source === "history" || voucherType === VoucherType.PAID;

        return new VoucherMaintenance({
          isDeleted: row.isDeleted,
          companyNo: row.companyNo,
          vendorNo: row.vendorNo,
          voucherNo: row.voucherNo,
          grossAmount: row.grossAmount,
          discountAmount: row.discount,
          partialPaidToDate: row.partialPaidToDate,
          invoiceDescription: row.invoiceDescription,
          invoiceNo: row.invoiceNo,
          invoiceDate8: isFromHistory ? row.invoiceDate : row.invoiceDate6,
          dueDate8: isFromHistory ? row.dueDate : row.dueDate6,
          discountDueDate6: isFromHistory
            ? row.discountDueDate
            : row.discountDueDate6,
          lastPaidDate8: isFromHistory
            ? convertDateFormat(row.lastPaidDateYymmdd,DATE_FORMATS.YYMMDD, DATE_FORMATS.MMDDYY)
            : row.lastPaidDate8,
          lastPaidAmount: isFromHistory
            ? row.lastPaymentAmt
            : row.lastPaidAmount,
          holdPaymentFlag: isFromHistory
            ? row.HoldPymtVouchr
            : row.holdPaymentFlag,
          holdDescription: isFromHistory
            ? row.HoldDescription
            : row.holdDescription,
          prepaidVoucherFlag: isFromHistory
            ? row.PrepaidVoucher
            : row.prepaidVoucherFlag,
          checkNo: isFromHistory ? row.checkNo : undefined,
          paidOnYymmdd: isFromHistory ? convertDateFormat(row.paidOnYymmdd,DATE_FORMATS.YYMMDD, DATE_FORMATS.MMDDYY) : undefined,
          cancelledVoucher: isFromHistory ? row.CancelledVoucher : undefined,
          vendorName: vendorData.vendorName,
          vendorAddress1: vendorData.vendorAddress1,
          vendorAddress2: vendorData.vendorAddress2,
          vendorAddress3: vendorData.vendorAddress3,
          vendorAddress4: vendorData.vendorAddress4,
        });
      });

      // For voucherType.ALL, we need to map each entity individually with its correct isFromHistory flag
      let responseData;
      if (voucherType === VoucherType.ALL) {
        responseData = entities.map((entity, index) => {
          const row = rows[index];
          const isFromHistory = row.source === "history";
          return toResponse(entity, isFromHistory);
        });
      } else {
        // For PAID or UNPAID, use the single flag
        responseData = toResponseArray(
          entities,
          voucherType === VoucherType.PAID
        );
      }

      this.logger.log(`Successfully processed ${responseData.length} vouchers`);

      return { rows: responseData, count };
    } catch (error) {
      this.logger.error("Error in findVouchers", error);
      throw error;
    }
  }

  async findVoucherView(
    voucherType: VoucherType,
    companyNo: number,
    vendorNo: number,
    voucherNo: number
  ): Promise<VoucherViewResponse | null> {
    this.logger.log(
      `Finding voucher view for voucherType: ${voucherType}, companyNo: ${companyNo}, vendorNo: ${vendorNo}, voucherNo: ${voucherNo}`
    );

    let headerData: any = null;
    let vendorData: any = null;

    if (voucherType === VoucherType.PAID) {
      // Get data from APHSTH (Open Payable History Header) table
      this.logger.log("Fetching PAID voucher from history table");

      headerData = await this.openPayableHistoryHeaderModel.findOne({
        where: {
          isDeleted: {
            [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE],
          },
          companyNo: companyNo,
          vendorNo: vendorNo,
          voucherNo: voucherNo,
        },
        attributes: [
          "isDeleted",
          "companyNo",
          "vendorNo",
          "voucherNo",
          "grossAmount",
          "discount",
          "partialPaidToDate",
          "invoiceDescription",
          "invoiceNo",
          "invoiceDate",
          "dueDate",
          "discountDueDate",
          "lastPaidDateYymmdd",
          "lastPaymentAmt",
          "HoldPymtVouchr",
          "HoldDescription",
          "PrepaidVoucher",
          "checkNo",
          "paidOnYymmdd",
          "apGlAccountNo",
          "CancelledVoucher",
        ],
        raw: true,
      });

      if (headerData) {
        // Get vendor data from APVEND (Vendor master table)
        this.logger.log(
          `Fetching vendor data from APVEND: companyNo=${companyNo}, vendorNo=${vendorNo}`
        );
        vendorData = await this.vendorModel.findOne({
          where: {
            vendorIsDeleted: {
              [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE],
            },
            vendorCompanyNumber: companyNo,
            vendorNo: vendorNo,
          },
          attributes: [
            "vendorIsDeleted",
            "vendorCompanyNumber",
            "vendorNo",
            "vendorName",
            "vendorAdd1",
            "vendorAdd2",
            "vendorAdd3",
            "vendorAdd4",
          ],
          raw: true,
        });
        this.logger.log(`Vendor data found: ${JSON.stringify(vendorData)}`);
      }
    } else if (voucherType === VoucherType.UNPAID) {
      // Get data from APOPNH (Open Payable Header) table
      this.logger.log("Fetching UNPAID voucher from current table");

      headerData = await this.openPayableHeaderModel.findOne({
        where: {
          isDeleted: {
            [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE],
          },
          companyNo: companyNo,
          vendorNo: vendorNo,
          voucherNo: voucherNo,
        },
        attributes: [
          "isDeleted",
          "companyNo",
          "vendorNo",
          "voucherNo",
          "grossAmount",
          "discount",
          "partialPaidToDate",
          "invoiceDescription",
          "invoiceNo",
          "invoiceDate6",
          "dueDate6",
          "discountDueDate6",
          "lastPaidDate8",
          "lastPaidAmount",
          "holdPaymentFlag",
          "holdDescription",
          "prepaidVoucherFlag",
          "bankGlNo",
          "apGlAccountNo",
        ],
        raw: true,
      });

      if (headerData) {
        // Get vendor data from APVEND (Vendor master table)
        this.logger.log(
          `Fetching vendor data from APVEND: companyNo=${companyNo}, vendorNo=${vendorNo}`
        );
        vendorData = await this.vendorModel.findOne({
          where: {
            vendorIsDeleted: {
              [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE],
            },
            vendorCompanyNumber: companyNo,
            vendorNo: vendorNo,
          },
          attributes: [
            "vendorIsDeleted",
            "vendorCompanyNumber",
            "vendorNo",
            "vendorName",
            "vendorAdd1",
            "vendorAdd2",
            "vendorAdd3",
            "vendorAdd4",
          ],
          raw: true,
        });
        this.logger.log(`Vendor data found: ${JSON.stringify(vendorData)}`);
      }
    } else {
      throw new Error(`Unsupported voucher type: ${voucherType}`);
    }

    if (!headerData) {
      this.logger.log("No voucher found with the specified criteria");
      return null;
    }

    // Get detail data
    let detailData: any[] = [];
    const isPaid = voucherType === VoucherType.PAID;

    if (voucherType === VoucherType.PAID) {
      // Get detail data from APHSTD (Open Payable History Detail) table
      detailData = await this.openPayableHistoryDetailModel.findAll({
        where: {
          isDeleted: {
            [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE],
          },
          companyNo: companyNo,
          vendorNo: vendorNo,
          voucherNo: voucherNo,
        },
        attributes: [
          "isDeleted",
          "companyNo",
          "vendorNo",
          "voucherNo",
          "detail",
          "sequenceNo",
          "detailLineAmount",
          "detailLineDiscount",
          "partialPaidToDate",
          "detailLineDescript",
          "expenseGlAccount",
          "expCoForGl",
          "lastPaidDateYymmdd",
          "purchaseJournalNo",
          "inventoryItemNo",
          "quantity",
          "jobNumber",
          "extraJobField",
          "costCode",
          "costType",
          "jobCostQuantity",
          "poNo",
          "receiptNumber",
          "openClosedStatus",
          "poLineSeqNo",
          "productAmount",
          "freightAmount",
        ],
        raw: true,
      });
    } else if (voucherType === VoucherType.UNPAID) {
      // Get detail data from APOPND (Open Payable Details) table
      detailData = await this.openPayableDetailsModel.findAll({
        where: {
          isDeleted: {
            [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE],
          },
          companyNo: companyNo,
          vendorNo: vendorNo,
          voucherNo: voucherNo,
        },
        attributes: [
          "isDeleted",
          "companyNo",
          "vendorNo",
          "voucherNo",
          "detailType",
          "sequenceNo",
          "grossAmount",
          "discountAmount",
          "partialPaidToDate",
          "lineDescription",
          "expenseGlAccount",
          "expenseCompanyNo",
          "lastPaidDate6",
          "lastPaidDate8",
          "purchaseJournalNo",
          "inventoryItemNo",
          "quantity",
          "jobNo",
          "jobExtraField",
          "costCode",
          "costType",
          "jobCostQuantity",
          "purchaseOrderNo",
          "receiptNumber",
          "poStatus",
          "poLineSequenceNo",
          "productAmount",
          "freightAmount",
          "poNumber",
        ],
        raw: true,
      });
    }

    // Create header entity using mapper
    const headerEntity = toViewEntity(headerData, vendorData, isPaid);

    // Create detail entities
    const detailEntities = isPaid
      ? detailData.map((detail) => toHistoryDetailEntity(detail))
      : detailData.map((detail) => toDetailEntity(detail));

    const result = {
      headerItems: toResponse(headerEntity, isPaid),
      detailItems: toDetailResponseArray(detailEntities),
    };

    this.logger.log(
      `Successfully retrieved voucher view data with ${detailEntities.length} detail items`
    );
    return result;
  }

  async updateVoucherStatus(
    companyNo: number,
    vendorNo: number,
    voucherNo: number,
    statusCode: VoucherMaintenanceStatusCode,
    statusDescription: string
  ): Promise<{
    companyNo: number;
    vendorNo: number;
    voucherNo: number;
    statusCode: VoucherMaintenanceStatusCode;
    statusDescription: string;
    updatedAt: string;
  } | null> {
    this.logger.log(
      `Updating voucher status: companyNo=${companyNo}, vendorNo=${vendorNo}, voucherNo=${voucherNo}, statusCode=${statusCode}, statusDescription=${statusDescription}`
    );

    // Find the voucher first to ensure it exists
    const voucher = await this.openPayableHeaderModel.findOne({
      where: {
        companyNo,
        vendorNo,
        voucherNo,
        isDeleted: {
          [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE],
        },
      },
      attributes: [
        "companyNo",
        "vendorNo",
        "voucherNo",
        "holdPaymentFlag", // OPHALT column
        "invoiceDescription", // OPHDES column
      ],
      raw: true,
    });

    if (!voucher) {
      this.logger.warn(
        `Voucher not found: companyNo=${companyNo}, vendorNo=${vendorNo}, voucherNo=${voucherNo}`
      );
      return null;
    }

    // Update the voucher status
    const [updatedRows] = await this.openPayableHeaderModel.update(
      {
        holdPaymentFlag: statusCode, // Update OPHALT column
        holdDescription: statusDescription, // Update OPHDES column
      },
      {
        where: {
          companyNo,
          vendorNo,
          voucherNo,
          isDeleted: {
            [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE],
          },
        },
      }
    );

    if (updatedRows === 0) {
      this.logger.warn(
        `No rows updated for voucher: companyNo=${companyNo}, vendorNo=${vendorNo}, voucherNo=${voucherNo}`
      );
      return null;
    }

    this.logger.log(
      `Successfully updated voucher status: companyNo=${companyNo}, vendorNo=${vendorNo}, voucherNo=${voucherNo}`
    );

    // Return the updated voucher information
    return {
      companyNo,
      vendorNo,
      voucherNo,
      statusCode,
      statusDescription,
      updatedAt: new Date().toISOString(),
    };
  }

  async updateDiscount(
    companyNo: number,
    vendorNo: number,
    voucherNo: number,
    discountDueDate: string,
    discount: number
  ): Promise<{
    companyNo: number;
    vendorNo: number;
    voucherNo: number;
    discountDueDate: string;
    discount: number;
    updatedAt: string;
  } | null> {
    this.logger.log(
      `Updating discount: companyNo=${companyNo}, vendorNo=${vendorNo}, voucherNo=${voucherNo}, discountDueDate=${discountDueDate}, discount=${discount}`
    );

    // Find the voucher first to ensure it exists
    const voucher = await this.openPayableHeaderModel.findOne({
      where: {
        companyNo,
        vendorNo,
        voucherNo,
        isDeleted: {
          [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE],
        },
      },
      attributes: [
        "companyNo",
        "vendorNo",
        "voucherNo",
        "discountDueDate6", // OPDSDT column
        "discount", // OPDISC column
      ],
      raw: true,
    });

    if (!voucher) {
      this.logger.warn(
        `Voucher not found: companyNo=${companyNo}, vendorNo=${vendorNo}, voucherNo=${voucherNo}`
      );
      return null;
    }

    // Convert discount due date from MMDDYY string to number format
    const discountDueDateNumber = parseInt(discountDueDate, 10);

    // Update the voucher discount information
    const [updatedRows] = await this.openPayableHeaderModel.update(
      {
        discountDueDate6: discountDueDateNumber, // Update OPDSDT column
        discount: discount, // Update OPDISC column
      },
      {
        where: {
          companyNo,
          vendorNo,
          voucherNo,
          isDeleted: {
            [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE],
          },
        },
      }
    );

    if (updatedRows === 0) {
      this.logger.warn(
        `No rows updated for voucher: companyNo=${companyNo}, vendorNo=${vendorNo}, voucherNo=${voucherNo}`
      );
      return null;
    }

    this.logger.log(
      `Successfully updated discount: companyNo=${companyNo}, vendorNo=${vendorNo}, voucherNo=${voucherNo}`
    );

    // Return the updated voucher information
    return {
      companyNo,
      vendorNo,
      voucherNo,
      discountDueDate,
      discount,
      updatedAt: new Date().toISOString(),
    };
  }

  private buildWhereClause(
    companyNo: number,
    vendorNo?: number,
    voucherType?: VoucherType,
    invoiceDate?: string | Date,
    invoiceNo?: string
  ): WhereOptions {
    const where: WhereOptions = {
      isDeleted: {
        [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE],
      },
      companyNo: companyNo,
    };

    if (vendorNo) {
      where.vendorNo = vendorNo;
    }

    if (invoiceNo) {
      where.invoiceNo = { [Op.like]: `${invoiceNo}%` };
    }

    if (invoiceDate) {
      // Handle different date field names based on voucher type
      // Show all records from the provided invoice date up to today
      // Problem: MMDDYY can't be compared numerically (e.g., 122820 > 110325 but Dec 28, 2020 < Nov 3, 2025)
      // Solution: Convert both dates to YYYYMMDD format for proper comparison
      
      // Convert input invoiceDate (MMDDYY) to YYYYMMDD using formatMMDDYYDate
      const invoiceDateStr = invoiceDate.toString().padStart(6, "0");
      const invoiceDateYYYYMMDD = parseInt(formatMMDDYYDate({
        dateStr: invoiceDateStr,
        pivotYear: 81, // < 81 = 2000s, >= 81 = 1900s (matches <= 80 = 2000s, > 80 = 1900s)
        outputFormat: "YYYYMMDD"
      }), 10);
      
      // Convert today's date to MMDDYY, then to YYYYMMDD
      const todayMMDDYY = dateToMmddyy(new Date());
      const todayYYYYMMDD = parseInt(formatMMDDYYDate({
        dateStr: todayMMDDYY,
        pivotYear: 81,
        outputFormat: "YYYYMMDD"
      }), 10);

      // Helper function to convert MMDDYY column to YYYYMMDD in SQL
      const buildDateConversionSQL = (dateCol: string) => {
        const d = `DIGITS(${dateCol})`;
        const yy = `SUBSTR(${d}, 5, 2)`;
        const mm = `SUBSTR(${d}, 1, 2)`;
        const dd = `SUBSTR(${d}, 3, 2)`;
        return `CASE 
          WHEN ${dateCol} = 0 THEN 0
          ELSE INTEGER(CASE WHEN INTEGER(${yy}) <= 80 THEN '20' ELSE '19' END || ${yy} || ${mm} || ${dd})
        END`;
      };

      if (voucherType === VoucherType.PAID) {
        const dateCol = '"OpenPayableHistoryHeaderModel"."OHINVD"';
        where[Op.and as any] = [
          ...(where[Op.and as any] || []),
          literal(`${buildDateConversionSQL(dateCol)} BETWEEN ${invoiceDateYYYYMMDD} AND ${todayYYYYMMDD}`)
        ];
      } else {
        const dateCol = '"OpenPayableHeaderModel"."OPINVD"';
        where[Op.and as any] = [
          ...(where[Op.and as any] || []),
          literal(`${buildDateConversionSQL(dateCol)} BETWEEN ${invoiceDateYYYYMMDD} AND ${todayYYYYMMDD}`)
        ];
      }
    }

    // Handle voucher type filter - only apply to current table
    // History table only contains PAID vouchers, so no need to filter
    if (voucherType === VoucherType.PAID) {
      // For PAID vouchers, we're already using the history table
      // which only contains paid vouchers, so no additional filter needed
    } else if (voucherType === VoucherType.UNPAID) {
      where.lastPaidAmount = { [Op.eq]: 0 };
    } else if (voucherType === VoucherType.ALL) {
      // For ALL type, include both paid and unpaid from current table
      // No additional filter needed
    }

    return where;
  }

  private buildOrderClause(
    sortBy?: string,
    sortOrder: "ASC" | "DESC" = "DESC",
    voucherType?: VoucherType
  ): any[] {
    const order: any[] = [];

    // Map API sort fields to actual DB column names based on voucher type
    let columnMap: Record<string, string | string[]>;

    if (voucherType === VoucherType.PAID) {
      // History table field mappings
      columnMap = {
        invoiceDate: "invoiceDate",
        dueDate: "dueDate",
        lastPaidDate: "lastPaidDateYymmdd",
        invoiceNumber: "invoiceNo",
        vendorNo: "vendorNo",
        companyNo: "companyNo",
        grossAmount: "grossAmount",
        discountAmount: "discount",
        netAmount: ["grossAmount", "discount"],
        openPayables: ["grossAmount", "partialPaidToDate"],
        lastPaidAmount: "lastPaymentAmt",
      };
    } else {
      // Current table field mappings
      columnMap = {
        invoiceDate: "invoiceDate6",
        dueDate: "dueDate8",
        lastPaidDate: "lastPaidDate8",
        invoiceNumber: "invoiceNo",
        vendorNo: "vendorNo",
        companyNo: "companyNo",
        grossAmount: "grossAmount",
        discountAmount: "discount",
        netAmount: ["grossAmount", "discount"],
        openPayables: ["grossAmount", "partialPaidToDate"],
        lastPaidAmount: "lastPaidAmount",
      };
    }

    const dbColumn = sortBy
      ? columnMap[sortBy]
      : voucherType === VoucherType.PAID
        ? "invoiceDate"
        : "invoiceDate6";

    if (dbColumn) {
      if (Array.isArray(dbColumn)) {
        // For calculated fields, sort by their components
        order.push(...dbColumn.map((col) => [col, sortOrder]));
      } else {
        order.push([dbColumn, sortOrder]);
      }
    }

    // Add secondary sort by voucherNo to ensure consistent ordering
    if (sortBy !== "voucherNo") {
      order.push(["voucherNo", "ASC"]);
    }

    return order;
  }

  async findVoucherSummary(
    companyNo: number,
    vendorNo: number,
    voucherType: VoucherType = VoucherType.ALL
  ) {
    const whereClause: any = {
      vendorIsDeleted: {
        [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE],
      },
      vendorCompanyNumber: companyNo,
      vendorNo: vendorNo,
    };

    this.logger.debug(
      `Finding vendor summary with where clause: ${JSON.stringify(whereClause)}`
    );

    const vendor = await this.vendorModel.findOne({
      where: whereClause,
      attributes: [
        "vendorName",
        "vendorNo",
        "vendorCompanyNumber",
        "vendorLastPaymentAmt",
        "vendorLastPaymentDate",
        "vendorCurrentBalance",
        "vendorLastPaymentDateAlt",
      ],
      logging: (sql) => this.logger.debug(`Executing query: ${sql}`),
    });

    if (!vendor) {
      this.logger.debug(
        `No vendor found with companyNo: ${companyNo}, vendorNo: ${vendorNo}`
      );
      return [];
    }

    this.logger.debug(
      `Found vendor: ${JSON.stringify(vendor.get({ plain: true }))}`
    );

    const isPaidType = [VoucherType.PAID, VoucherType.ALL].includes(
      voucherType
    );
    const isUnpaidType = [VoucherType.UNPAID, VoucherType.ALL].includes(
      voucherType
    );

    return [
      {
        vendorName: vendor.vendorName || "",
        companyNo: vendor.vendorCompanyNumber,
        vendorNo: vendor.vendorNo,
        lastPaidAmount: vendor.vendorLastPaymentAmt || 0,
        lastPaidDate:
          (
            vendor.vendorLastPaymentDate || vendor.vendorLastPaymentDateAlt
          )?.toString() || null,
        openPayables: isPaidType ? vendor.vendorCurrentBalance || 0 : 0,
        openPayablesDate: isUnpaidType
          ? vendor.vendorLastPaymentDateAlt?.toString() || null
          : null,
        type: voucherType,
      },
    ];
  }

  async transferVoucher(
    voucherType: VoucherType,
    companyNo: number,
    vendorNo: number,
    voucherNo: number
  ): Promise<{
    companyNo: number;
    vendorNo: number;
    voucherNo: number;
    sourceTable: string;
    targetTable: string;
    transferredAt: string;
    headerRecordId?: number;
    detailRecordIds?: number[];
  } | null> {
    this.logger.log(
      `Starting voucher transfer: voucherType=${voucherType}, companyNo=${companyNo}, vendorNo=${vendorNo}, voucherNo=${voucherNo}`
    );

    try {
      let sourceHeaderData: any = null;
      let sourceDetailData: any[] = [];
      let sourceTable = "";
      let targetTable = "";

      if (voucherType === VoucherType.UNPAID) {
        // Transfer from APOPNH/APOPND to APTRANH/APTRAND
        this.logger.log(
          "Transferring UNPAID voucher from APOPNH/APOPND to APTRANH/APTRAND"
        );

        // Get header data from APOPNH
        sourceHeaderData = await this.openPayableHeaderModel.findOne({
          where: {
            isDeleted: {
              [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE],
            },
            companyNo: companyNo,
            vendorNo: vendorNo,
            voucherNo: voucherNo,
          },
          raw: true,
        });

        if (!sourceHeaderData) {
          this.logger.warn(
            `UNPAID voucher not found in APOPNH: companyNo=${companyNo}, vendorNo=${vendorNo}, voucherNo=${voucherNo}`
          );
          return null;
        }

        // Validate: Check if voucher is already cancelled in APTRANH
        const existingVoucher = await this.voucherHeaderModel.findOne({
          where: {
            companyNo: companyNo,
            vendorNo: vendorNo,
            invoiceNo: sourceHeaderData.invoiceNo,
            isDeleted: {
              [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE],
            },
          },
        });

        if (existingVoucher) {
          this.logger.error(
            `VOUCHER IS ALREADY CANCEL - companyNo=${companyNo}, vendorNo=${vendorNo}, invoiceNo=${sourceHeaderData.invoiceNo}`
          );
          throw new HttpException(
            errorResponse(ERROR_CONSTANTS.VALIDATION_ERROR, [
              {
                field: "voucher",
                code: ERROR_CONSTANTS.VALIDATION_ERROR.code,
                message: ERROR_MESSAGES.VOUCHER_ALREADY_CANCEL,
              },
            ]),
            HttpStatus.BAD_REQUEST
          );
        }

        // Get detail data from APOPND
        sourceDetailData = await this.openPayableDetailsModel.findAll({
          where: {
            isDeleted: {
              [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE],
            },
            companyNo: companyNo,
            vendorNo: vendorNo,
            voucherNo: voucherNo,
          },
          raw: true,
        });

        sourceTable = "APOPNH/APOPND";
        targetTable = "APTRANH/APTRAND";
      } else if (voucherType === VoucherType.PAID) {
        // Transfer from APHSTH/APHSTD to APTRANH/APTRAND
        this.logger.log(
          "Transferring PAID voucher from APHSTH/APHSTD to APTRANH/APTRAND"
        );

        // Get header data from APHSTH
        sourceHeaderData = await this.openPayableHistoryHeaderModel.findOne({
          where: {
            isDeleted: {
              [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE],
            },
            companyNo: companyNo,
            vendorNo: vendorNo,
            voucherNo: voucherNo,
          },
          raw: true,
        });

        if (!sourceHeaderData) {
          this.logger.warn(
            `PAID voucher not found in APHSTH: companyNo=${companyNo}, vendorNo=${vendorNo}, voucherNo=${voucherNo}`
          );
          return null;
        }

        const existingVoucher = await this.voucherHeaderModel.findOne({
          where: {
            companyNo: companyNo,
            vendorNo: vendorNo,
            invoiceNo: sourceHeaderData.invoiceNo,
            prepaidCheckNo: sourceHeaderData.checkNo,
            isDeleted: {
              [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE],
            },
          },
        });

        if (existingVoucher) {
          this.logger.error(
            `VOUCHER IS ALREADY VOIDED - companyNo=${companyNo}, vendorNo=${vendorNo}, invoiceNo=${sourceHeaderData.invoiceNo}`
          );
          throw new HttpException(
            errorResponse(ERROR_CONSTANTS.VALIDATION_ERROR, [
              {
                field: "voucher",
                code: ERROR_CONSTANTS.VALIDATION_ERROR.code,
                message: ERROR_MESSAGES.VOUCHER_ALREADY_VOIDED,
              },
            ]),
            HttpStatus.BAD_REQUEST
          );
        }

        const checkInquiryHistory= await this.checkInquiryHistoryModel.findOne({
          where: {
            companyNo: companyNo,
            vendorNo: vendorNo,
            checkNo: sourceHeaderData.checkNo,
          },
          raw: true,
        });

        if (checkInquiryHistory?.code !==AMCODE.OPEN){
            throw new HttpException(
              errorResponse(ERROR_CONSTANTS.VALIDATION_ERROR, [
                {
                  field: "voucher",
                  code: ERROR_CONSTANTS.VALIDATION_ERROR.code,
                  message: ERROR_MESSAGES.VOUCHER_ALREADY_VOIDED,
                },
              ]),
              HttpStatus.BAD_REQUEST
            );
        }

        // Get detail data from APHSTD
        sourceDetailData = await this.openPayableHistoryDetailModel.findAll({
          where: {
            isDeleted: {
              [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE],
            },
            companyNo: companyNo,
            vendorNo: vendorNo,
            voucherNo: voucherNo,
          },
          raw: true,
        });

        sourceTable = "APHSTH/APHSTD";
        targetTable = "APTRANH/APTRAND";
      } else {
        throw new Error(
          `Unsupported voucher type for transfer: ${voucherType}`
        );
      }

      // Generate and reserve new entry number for APTRANH/APTRAND using CompanyModel directly
      const company = await this.companyModel.findOne({
        where: { companyNo, companyIsDeleted: "A" },
        raw: true,
      });
      if (!company) {
        throw new Error(`Company not found with number ${companyNo}`);
      }

      // Fetch vendor data for transfer
      const vendorData = await this.vendorModel.findOne({
        where: {
          vendorCompanyNumber: companyNo,
          vendorNo: vendorNo,
          vendorIsDeleted: {
            [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE],
          },
        },
        raw: true,
      });

      if (!vendorData) {
        this.logger.warn(
          `Vendor not found or inactive: companyNo=${companyNo}, vendorNo=${vendorNo}`
        );
        // Continue with transfer but log warning
      }
      const reservedCount = 1;
      const currentEntryNo = company.companyNextEntryNo as number;
      const updatedNextEntryNo =
        currentEntryNo === 99999 ? 1 : currentEntryNo + reservedCount;
      await this.companyModel.update(
        { companyNextEntryNo: updatedNextEntryNo },
        { where: { companyNo } }
      );
      const newEntryNo = currentEntryNo;
      const entrySequence = 0; // Default sequence for new entry

      // Use mapper for payload generation (removes inline mapping)

      // Create header record in APTRANH via mapper
      const headerEntity: VoucherHeader = mapToAptranHeaderInsertDto({
        source: sourceHeaderData,
        vendorData: vendorData || {},
        voucherType,
        companyNo,
        vendorNo,
        voucherNo,
        entryNo: newEntryNo,
        entrySequence,
        retentionGl: (company?.companyRetentionGlNo as number) || 0,
      });

      const headerRecord = await this.voucherHeaderModel.create({
        ...headerEntity,
      });

      // Create detail records in APTRAND
      const detailRecordIds: number[] = [];
      for (let i = 0; i < sourceDetailData.length; i++) {
        const sourceDetail = sourceDetailData[i];
        const detailEntity: VoucherDetail = mapToAptranDetailInsertDto({
          source: sourceDetail,
          voucherType,
          companyNo,
          vendorNo,
          entryNo: newEntryNo,
          lineIndex: i,
        });
        const detailRecord = await this.voucherDetailModel.create({
          ...detailEntity,
        });

        detailRecordIds.push(detailRecord.entrySequence);
      }


      this.logger.log(
        `Successfully transferred  source voucher: companyNo=${companyNo}, vendorNo=${vendorNo}, voucherNo=${voucherNo}, newEntryNo=${newEntryNo}`
      );

      return {
        companyNo: companyNo,
        vendorNo: vendorNo,
        voucherNo: voucherNo,
        sourceTable: sourceTable,
        targetTable: targetTable,
        transferredAt: new Date().toISOString(),
        headerRecordId: headerRecord.entryNo,
        detailRecordIds: detailRecordIds,
      };
    } catch (error: any) {
      this.logger.error(
        `Error transferring voucher: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }
}
