import {
  Injectable,
  Logger,
  Inject,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { VoucherHeaderInterface } from "../../domain/interface/voucher.interface";
import { VoucherHeader } from "../../domain/entities/voucher.entity";
import { voucherHeaderMapper } from "../mappers/voucher-header.mapper";
import { VoucherHeaderModel } from "@src/main/account-payable/data/models/voucher-header.model";
import { VoucherDetailModel } from "@src/main/account-payable/data/models/voucher-detail.model";
import { OpenPayableHeaderModel } from "../models/open-payable-header.model";
import { OpenPayableHistoryHeaderModel } from "../models/open-payable-history-header.model";
import { Op, WhereOptions, fn, col, Transaction, literal } from "@sequelize/core";
import { VOUCHER_STATUS_CODES } from "@src/shared/constants/status-map";
import { errorResponse } from "@src/shared/utils/response-formatter";
import { formatCurrency } from "@src/shared/utils/currency.utils";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";
import { sortOrder } from "@src/types/types";
import { IsDeletedStatus, PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";
import { withContextFilters } from "@src/shared/utils/context-filters";

type FindAllData = {
  companyNo: number;
  vendorNo?: number;
  entryNo?: number;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: string;
  invoiceNo?: string;
  processType?: string;
};

@Injectable()
export class VoucherHeaderRepository implements VoucherHeaderInterface {
  private readonly logger = new Logger(VoucherHeaderRepository.name);

  constructor(
    @Inject("VoucherHeaderModel")
    private readonly voucherHeaderModel: typeof VoucherHeaderModel,
    @Inject("VoucherDetailModel")
    private readonly voucherDetailModel: typeof VoucherDetailModel,
    @Inject("OpenPayableHeaderModel")
    private readonly openPayableHeaderModel: typeof OpenPayableHeaderModel,
    @Inject("OpenPayableHistoryHeaderModel")
    private readonly openPayableHistoryHeaderModel: typeof OpenPayableHistoryHeaderModel
  ) {}

  async getTransaction(): Promise<Transaction> {
    return this.voucherHeaderModel.sequelize!.transaction(async (t) => t);
  }

  getDefaultSort(): sortOrder[] {
    return [
      {
        sortBy: "entryNo",
        sortOrder: "DESC",
      },
    ];
  }

  async findOne(
    companyNo: number,
    entryNo: number,
    vendorNo?: number,
    entrySequence?: number
  ): Promise<VoucherHeader | null> {
    this.logger.log(
      `Fetching one voucher header with companyNo: ${companyNo}, entryNo: ${entryNo}`
    );
    const record = await this.voucherHeaderModel.findOne({
      where: {
        companyNo,
        entryNo,
        ...(vendorNo && { vendorNo }),
        ...(entrySequence && { entrySequence }),
      },
      attributes: {
        include: [
          "status",
          [
            fn(
              "TRIM",
              col((VoucherHeaderModel as any).getAttributes().holdDesc.field)
            ),
            "holdDesc",
          ],
          [
            fn(
              "TRIM",
              col((VoucherHeaderModel as any).getAttributes().vendorName.field)
            ),
            "vendorName",
          ],
          [
            fn(
              "TRIM",
              col((VoucherHeaderModel as any).getAttributes().vendorAdd1.field)
            ),
            "vendorAdd1",
          ],
          [
            fn(
              "TRIM",
              col((VoucherHeaderModel as any).getAttributes().vendorAdd2.field)
            ),
            "vendorAdd2",
          ],
          [
            fn(
              "TRIM",
              col((VoucherHeaderModel as any).getAttributes().vendorAdd3.field)
            ),
            "vendorAdd3",
          ],
          [
            fn(
              "TRIM",
              col((VoucherHeaderModel as any).getAttributes().vendorAdd4.field)
            ),
            "vendorAdd4",
          ],
          [
            fn(
              "TRIM",
              col((VoucherHeaderModel as any).getAttributes().invoiceNo.field)
            ),
            "invoiceNo",
          ],
          [
            fn(
              "TRIM",
              col((VoucherHeaderModel as any).getAttributes().invoiceNo.field)
            ),
            "invoiceNo",
          ],
          [
            fn(
              "TRIM",
              col((VoucherHeaderModel as any).getAttributes().carrierId.field)
            ),
            "carrierId",
          ],
          [
            fn(
              "TRIM",
              col((VoucherHeaderModel as any).getAttributes().invoiceDesc.field)
            ),
            "invoiceDesc",
          ],
        ],
        exclude: [],
      },
    });
    if (!record) {
      this.logger.debug(
        "Voucher header not found - this is expected for new records"
      );
      return null;
    }
    this.logger.debug(`Voucher header found: ${JSON.stringify(record)}`);
    return voucherHeaderMapper(record);
  }
  async findAll(
    data: FindAllData
  ): Promise<{ rows: VoucherHeader[]; count: number }> {
    this.logger.log("Fetching all voucher entry data");

    let whereCondition: WhereOptions<VoucherHeaderModel> = {
      companyNo: data.companyNo,
      processType:PROCESS_TYPE_ENUM.NORMAL,
      isDeleted: {
        [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE],
      },
      ...(data.vendorNo && { vendorNo: data.vendorNo }),
      ...(data.entryNo && { entryNo: data.entryNo }),
      ...(data.invoiceNo && { invoiceNo: data.invoiceNo }),
      ...(data.processType && { processType: data.processType }),
    };

    //Inject generic filters (userProfile)
    whereCondition = withContextFilters<VoucherHeaderModel>(whereCondition);


    const { rows, count } = await VoucherHeaderModel.findAndCountAll({
      where: whereCondition,
      order: [
        ["createDate", "desc"],
        ["entryNo", "desc"],
      ],
      limit: data.limit,
      offset: data.offset,
      attributes: [
        "entryNo",
        "processType",
        "invoiceAmount",
        "invoiceDate",
        "dueDate",
        "discountDueDate",
        "companyNo",
        "vendorNo",
        "holdCode",
        "apGlNo",
        "bankGl",
        "prepaidCode",
        "prepaidCheckNo",
        "prepaidCheckdate",
        [
          fn(
            "TRIM",
            col((VoucherHeaderModel as any).getAttributes().invoiceNo.field)
          ),
          "invoiceNo",
        ],
        [
          fn(
            "TRIM",
            col((VoucherHeaderModel as any).getAttributes().holdDesc.field)
          ),
          "holdDesc",
        ],
        [
          fn(
            "TRIM",
            col((VoucherHeaderModel as any).getAttributes().vendorName.field)
          ),
          "vendorName",
        ],
      ],
    });

    this.logger.debug(`Found ${rows.length} voucher headers.`);

    return {
      rows: rows.map(voucherHeaderMapper),
      count,
    };
  }

  async softDelete(
    entryNo: number,
    companyNo: number,
    vendorNo: number,
    invoiceNo: string
  ): Promise<boolean> {
    this.logger.log(
      `Soft deleting voucher header with entryNo: ${entryNo}, companyNo: ${companyNo}, vendorNo: ${vendorNo}, invoiceNo: ${invoiceNo}`
    );

    const record = await VoucherHeaderModel.findOne({
      where: {
        entryNo,
        companyNo,
        vendorNo,
        invoiceNo,
        isDeleted: { [Op.notIn]: ["D", "I"] },
      },
    });
    if (!record) {
      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
          {
            field: "entryNo",
            code: ERROR_CONSTANTS.NOT_FOUND.code,
            message: `Voucher header not found for entryNo: ${entryNo}, companyNo: ${companyNo}, vendorNo: ${vendorNo}, invoiceNo: ${invoiceNo}`,
          },
        ]),
        HttpStatus.NOT_FOUND
      );
    }
    const [affectedCount] = await VoucherHeaderModel.update(
      { isDeleted: "D" },
      {
        where: {
          entryNo,
          companyNo,
          vendorNo,
          invoiceNo,
          isDeleted: { [Op.notIn]: ["D", "I"] },
        },
      }
    );

    this.logger.debug(
      `Voucher header soft deleted successfully: ${affectedCount > 0}`
    );
    return affectedCount > 0;
  }

  async isDuplicateInvoice(
    companyNo: number,
    vendorNo: number,
    invoiceNo: string,
    entryNo?: number
  ): Promise<boolean> {
    const startTime = Date.now();
    this.logger.log(
      `Checking duplicate invoice across ALL tables: companyNo=${companyNo}, vendorNo=${vendorNo}, invoiceNo=${invoiceNo}, entryNo=${entryNo}`
    );
  
    // 1. Check APTRANH (main voucher transaction table)
    const whereCondition: WhereOptions<VoucherHeaderModel> = {
      invoiceNo,
      vendorNo,
      companyNo,
      isDeleted: { [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE] },
      ...(entryNo && { entryNo: { [Op.ne]: entryNo } }),
    };
    
    const aptranhCount = await this.voucherHeaderModel.count({
      where: whereCondition,
    });
  
    if (aptranhCount > 0) {
      const duration = Date.now() - startTime;
      this.logger.debug(`Duplicate found in APTRANH table (${duration}ms)`);
      return true;
    }
    
    // 2. Check APOPNH (Open Payable Header - UNPAID vouchers)
    const apopnhDuplicate = await this.openPayableHeaderModel.count({
      where: {
        companyNo,
        vendorNo,
        invoiceNo,
        isDeleted: { [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE] },
      },
    });
    
    if (apopnhDuplicate > 0) {
      const duration = Date.now() - startTime;
      this.logger.debug(`Duplicate found in APOPNH table (${apopnhDuplicate} records, ${duration}ms)`);
      return true;
    }
    
    // 3. Check APHSTH (Open Payable History Header - PAID vouchers)
    const aphsthDuplicate = await this.openPayableHistoryHeaderModel.count({
      where: {
        companyNo,
        vendorNo,
        invoiceNo,
        isDeleted: { [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE] },
      },
    });
    
    if (aphsthDuplicate > 0) {
      const duration = Date.now() - startTime;
      this.logger.debug(`Duplicate found in APHSTH table (${aphsthDuplicate} records, ${duration}ms)`);
      return true;
    }
  
    const duration = Date.now() - startTime;
    this.logger.debug(`Cross-table duplicate check completed: No duplicates found (${duration}ms)`);
    return false;
  }

  async checkDuplicateInvoiceWithTable(
    companyNo: number,
    vendorNo: number,
    invoiceNo: string,
    entryNo?: number
  ): Promise<{isDuplicate: boolean, tableName: string | null}> {
    const startTime = Date.now();
    this.logger.log(
      `Checking duplicate invoice across ALL tables: companyNo=${companyNo}, vendorNo=${vendorNo}, invoiceNo=${invoiceNo}, entryNo=${entryNo}`
    );
  
    // 1. Check APTRANH (main voucher transaction table)
    const whereCondition: WhereOptions<VoucherHeaderModel> = {
      invoiceNo,
      vendorNo,
      companyNo,
      isDeleted: { [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE] },
      ...(entryNo && { entryNo: { [Op.ne]: entryNo } }),
    };
    
    const aptranhCount = await this.voucherHeaderModel.count({
      where: whereCondition,
    });
  
    if (aptranhCount > 0) {
      const duration = Date.now() - startTime;
      this.logger.debug(`Duplicate found in APTRANH table (${duration}ms)`);
      return { isDuplicate: true, tableName: 'APTRANH' };
    }
    
    // 2. Check APOPNH (Open Payable Header - UNPAID vouchers)
    const apopnhDuplicate = await this.openPayableHeaderModel.count({
      where: {
        companyNo,
        vendorNo,
        invoiceNo,
        isDeleted: { [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE] },
      },
    });
    
    if (apopnhDuplicate > 0) {
      const duration = Date.now() - startTime;
      this.logger.debug(`Duplicate found in APOPNH table (${apopnhDuplicate} records, ${duration}ms)`);
      return { isDuplicate: true, tableName: 'APOPNH' };
    }
    
    // 3. Check APHSTH (Open Payable History Header - PAID vouchers)
    const aphsthDuplicate = await this.openPayableHistoryHeaderModel.count({
      where: {
        companyNo,
        vendorNo,
        invoiceNo,
        isDeleted: { [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE] },
      },
    });
    
    if (aphsthDuplicate > 0) {
      const duration = Date.now() - startTime;
      this.logger.debug(`Duplicate found in APHSTH table (${aphsthDuplicate} records, ${duration}ms)`);
      return { isDuplicate: true, tableName: 'APHSTH' };
    }
    
    const duration = Date.now() - startTime;
    this.logger.debug(`No duplicate found in any table (${duration}ms)`);
    return { isDuplicate: false, tableName: null };
  }

  async create(
    data: Partial<VoucherHeader>,
    transaction?: Transaction
  ): Promise<VoucherHeader> {
    this.logger.log(
      `Creating voucher header with data: ${JSON.stringify(data)}`
    );
    const record = await this.voucherHeaderModel.create(data, { transaction });

    return voucherHeaderMapper(record);
  }

  async update(
    companyNo: number,
    entryNo: number,
    entrySequence: number,
    data: Partial<VoucherHeader>
  ): Promise<VoucherHeader> {
    this.logger.log(
      `Updating voucher header for companyNo: ${companyNo}, entryNo: ${entryNo}, entrySequence: ${entrySequence}`
    );
    const record = await this.voucherHeaderModel.findOne({
      where: { companyNo, entryNo, entrySequence },
    });
    await record!.update(data);
    return voucherHeaderMapper(record!);
  }
  async startTransaction(): Promise<Transaction> {
    return this.getTransaction();
  }

  async getVoucherSummary(companyNo: number, processType: string) {
    // Only run the summary logic, do not check company existence here
    const whereCondition: WhereOptions<VoucherHeaderModel> = {
      companyNo,
      processType,
      isDeleted: { [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE] },
    };
    const records = (await this.voucherHeaderModel.findAll({
      where: whereCondition,
      attributes: ["status", "invoiceAmount"],
    })) as unknown as { status: string | null; invoiceAmount: number }[];
    
    let totalAmount = 0;
    let countE = 0, countW = 0, countS = 0;
    
    for (const rec of records) {
      
      totalAmount += Number(rec.invoiceAmount);
      
      let status = rec.status;
      if (typeof status === "string") status = status.trim();
      const statusStr = String(status);
      
      if (statusStr === String(VOUCHER_STATUS_CODES.S)) {
        countS++;
      } else if (
        statusStr === String(VOUCHER_STATUS_CODES.E) ||
        statusStr === "E"
      ) {
        countE++;
      } else if (
        statusStr === String(VOUCHER_STATUS_CODES.W) ||
        statusStr === "W"
      ) {
        countW++;
      }
    }
    
    return {
      totalAmount: formatCurrency(totalAmount, "USD", "en-US"),
      countE,
      countW,
      countS,
      totalUploads: countE + countW + countS,
    };
  }

  async findAllWithAllFields(
    data: FindAllData,
    isRequiredDetail: boolean = false
  ): Promise<{ rows: VoucherHeader[]; count: number }> {
    this.logger.log("Fetching all voucher entry data (all columns)");
    const whereCondition: WhereOptions<VoucherHeaderModel> = {
      companyNo: data.companyNo,
      isDeleted: { [Op.notIn]: ["D", "I"] },
      ...(data.vendorNo && { vendorNo: data.vendorNo }),
      ...(data.entryNo && { entryNo: data.entryNo }),
      ...(data.invoiceNo && { invoiceNo: data.invoiceNo }),
      ...(data.processType && { processType: data.processType }),
    };
    const { rows, count } = await VoucherHeaderModel.findAndCountAll({
      where: whereCondition,
      order: [
        [
          literal(`
            CASE 
              WHEN ATSTAT = 'E' THEN 1
              WHEN ATSTAT = 'W' THEN 2
              WHEN ATSTAT = 'S' THEN 3
              ELSE 4
            END
          `),
          "ASC",
        ],
        ["createDate", "desc"],
        ["entryNo", "desc"],
      ],
      limit: data.limit,
      offset: data.offset,
      // No attributes: return all columns
    });
    /**
     * @description Fetch voucher details for discount amount calculation
     * @todo This is a performance optimization to avoid fetching voucher details for each header, we need to use  join query to fetch the discount amount
     */
    // Fetch voucher details for discount amount calculation
    if (rows.length > 0 && isRequiredDetail) {
      const headerKeys = rows.map((row) => ({
        companyNo: row.companyNo,
        entryNo: row.entryNo,
        vendorNo: row.vendorNo,
      }));

      // Fetch all voucher details for the headers
      const voucherDetails = await this.voucherDetailModel.findAll({
        where: {
          [Op.or]: headerKeys.map((key) => ({
            companyNo: key.companyNo,
            entryNo: key.entryNo,
            vendorNo: key.vendorNo,
            isDeleted: { [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE] },
          })),
        },
        attributes: [
          "companyNo",
          "entryNo",
          "vendorNo",
          "discountAmount",
          "discountPercentage",
          "productAmount",
        ],
        raw: true,
      });

      // Group voucher details by entryNo, companyNo, vendorNo and sum discount amounts
      const discountAmounts = new Map<string, number>();

      voucherDetails.forEach((detail) => {
        const key = `${detail.companyNo}-${detail.entryNo}-${detail.vendorNo}`;
        const currentAmount = discountAmounts.get(key) || 0;

        // Calculate discount amount using discountPercentage and productAmount
        let calculatedDiscountAmount = 0;
        if (detail.discountPercentage && detail.productAmount) {
          calculatedDiscountAmount =
            detail.productAmount * (detail.discountPercentage / 100);
        }

        // Add both the calculated discount amount and existing discountAmount
        const totalDiscount =
          calculatedDiscountAmount + (detail.discountAmount || 0);
        discountAmounts.set(key, currentAmount + totalDiscount);
      });

      // Map discount amounts to headers
      rows.forEach((row) => {
        const key = `${row.companyNo}-${row.entryNo}-${row.vendorNo}`;
        (row as any).discountAmount = discountAmounts.get(key) || 0;
      });
    }

    return { rows: rows.map(voucherHeaderMapper), count };
  }

  async hardDelete(
    invoiceNo: string,
    entryNo: number,
    companyNo: number,
    vendorNo: number
  ): Promise<boolean> {
    this.logger.log(
      `Deleting header with invoiceNo=${invoiceNo}, entryNo=${entryNo}, companyNo=${companyNo}, vendorNo=${vendorNo}`
    );
    const rowsDeleted = await this.voucherHeaderModel.destroy({
      where: {
        invoiceNo: invoiceNo?.trim(),
        entryNo,
        companyNo,
        vendorNo,
      },
    });
    this.logger.debug(`Header rows deleted: ${rowsDeleted}`);
    return rowsDeleted > 0;
  }

  /**
   * Get entry numbers from APTRANH where ATPTYP matches the process type
   */
  async getEntryNumbersByProcessType(
    companyNo: number,
    processType: string
  ): Promise<number[]> {
    this.logger.log(
      `Getting entry numbers for company: ${companyNo}, process type: ${processType}`
    );

    const records = await this.voucherHeaderModel.findAll({
      where: {
        companyNo,
        processType,
        isDeleted: { [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE] }, // Only active records
      },
      attributes: ["entryNo"],
      raw: true,
    });

    const entryNumbers = records.map((record) => record.entryNo);

    this.logger.log(
      `Found ${entryNumbers.length} entry numbers for process type: ${processType}`
    );

    return entryNumbers;
  }

  /**
   * Delete voucher headers by process type
   */
  async deleteByProcessType(
    companyNo: number,
    processType: string
  ): Promise<number> {
    this.logger.log(
      `Deleting voucher headers for company: ${companyNo}, process type: ${processType}`
    );

    const result = await this.voucherHeaderModel.destroy({
      where: {
        companyNo,
        processType,
        isDeleted: { [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE] }, // Only active records
      },
    });

    this.logger.log(
      `Deleted ${result} voucher header records for process type: ${processType}`
    );

    return result;
  }
}
