import { Injectable, Logger, Inject } from "@nestjs/common";
import { VoucherDetailModel } from "../models/voucher-detail.model";
import { VoucherDetailInterface } from "../../domain/interface/voucher.interface";
import { VoucherDetail } from "../../domain/entities/voucher.entity";
import { voucherDetailMapper } from "../mappers/voucher-detail.mapper";
import { Op } from "@sequelize/core";
import { IsDeletedStatus } from "@src/shared/constants/constant";

@Injectable()
export class VoucherDetailRepository implements VoucherDetailInterface {
  private readonly logger = new Logger(VoucherDetailRepository.name);
  constructor(
    @Inject("VoucherDetailModel")
    private readonly voucherDetailModel: typeof VoucherDetailModel
  ) {}

  async findByEntry(
    companyNo: number,
    entryNo?: number,
    vendorNo?: number
  ): Promise<VoucherDetail[]> {
    const where: any = {
      companyNo,
      isDeleted: {
        [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE],
      },
    };
    if (entryNo) where.entryNo = entryNo;
    if (vendorNo) where.vendorNo = vendorNo;
    this.logger.log(
      `Fetching voucher detail with companyNo: ${companyNo}, entryNo: ${entryNo}, vendorNo: ${vendorNo}`
    );
    const records = await this.voucherDetailModel.findAll({
      where,
      order: [["entrySequence", "ASC"]], //sort by ATENSQ ascending
      raw: true,
    });
    return records ? records.map((record) => voucherDetailMapper(record)) : [];
  }

  async findOne(
    companyNo: string,
    entryNo: string,
    entrySequence: string
  ): Promise<VoucherDetail | null> {
    const record = await this.voucherDetailModel.findOne({
      where: { companyNo, entryNo, entrySequence },
      raw: true,
    });

    return record ? voucherDetailMapper(record) : null;
  }

  private validateVoucherDetailFields(data: Partial<VoucherDetail[]>): void {
    for (const detail of data) {
      const companyNo = detail?.companyNo;
      const entryNo = detail?.entryNo;
      const entrySequence = detail?.entrySequence;
      if (!companyNo || !entryNo || !entrySequence) {
        throw new Error(
          "Missing required fields: companyNo, entryNo, or entrySequence"
        );
      }
    }
  }

  async create(data: Partial<VoucherDetail[]>): Promise<VoucherDetail[]> {
    const startTime = Date.now();
    this.logger.log(
      `🚀 Starting parallel processing for ${data.length} voucher details`
    );

    // Validate required fields
    this.validateVoucherDetailFields(data);

    // ⚡ Process all records in parallel (much faster than sequential)
    const recordPromises = data.map(async (detail) => {
      let record = await this.voucherDetailModel.create({ ...detail } as any);
      return record ? voucherDetailMapper(record) : null;
    });

    // Wait for all operations to complete in parallel
    const results = await Promise.all(recordPromises);
    const validResults = results.filter(
      (result) => result !== null
    ) as VoucherDetail[];

    const totalDuration = Date.now() - startTime;
    this.logger.log(
      `✅ Parallel processing completed: ${validResults.length} records processed in ${totalDuration}ms`
    );

    return validResults;
  }

  async createOrUpdate(
    data: Partial<VoucherDetail[]>
  ): Promise<VoucherDetail[]> {
    const startTime = Date.now();
    this.logger.log(
      `🚀 Starting parallel processing for ${data.length} voucher details`
    );

    // Validate required fields
    this.validateVoucherDetailFields(data);

    // ⚡ Process all records in parallel (much faster than sequential)
    const recordPromises = data.map(async (detail) => {
      const companyNo = detail?.companyNo;
      const entryNo = detail?.entryNo;
      const entrySequence = detail?.entrySequence;
      const vendorNo = detail?.vendorNo;

      let record = await this.voucherDetailModel.findOne({
        where: { companyNo, entryNo, entrySequence, vendorNo },
      });

      if (record) {
        record = await record.update(detail as any);
      } else {
        this.logger.log(`${JSON.stringify(detail)}: VoucherDetails`)
        record = await this.voucherDetailModel.create({ ...detail } as any);
      }

      return record ? voucherDetailMapper(record) : null;
    });

    // Wait for all operations to complete in parallel
    const results = await Promise.all(recordPromises);
    const validResults = results.filter(
      (result) => result !== null
    ) as VoucherDetail[];

    const totalDuration = Date.now() - startTime;
    this.logger.log(
      `✅ Parallel processing completed: ${validResults.length} records processed in ${totalDuration}ms`
    );

    return validResults;
  }

  async softDeleteByEntry(
    entryNo: number,
    companyNo: number,
    vendorNo: number
  ): Promise<number> {
    this.logger.log(
      `Soft deleting voucher details with entryNo: ${entryNo}, companyNo: ${companyNo}, vendorNo: ${vendorNo}`
    );
    const where: any = {
      entryNo,
      companyNo,
      vendorNo,
      isDeleted: {
        [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE],
      },
    };
    const [affectedCount] = await this.voucherDetailModel.update(
      { isDeleted: "D" },
      { where }
    );
    this.logger.debug(`Voucher details soft deleted: ${affectedCount}`);
    return affectedCount;
  }

  async hardDelete(
    entryNo: number,
    companyNo: number,
    vendorNo: number
  ): Promise<boolean> {
    this.logger.log(
      `Deleting details for entryNo=${entryNo}, companyNo=${companyNo}, vendorNo=${vendorNo}`
    );
    const rowsDeleted = await this.voucherDetailModel.destroy({
      where: {
        entryNo,
        companyNo: companyNo,
        vendorNo: vendorNo,
      },
    });
    this.logger.debug(`Detail rows deleted: ${rowsDeleted}`);
    return rowsDeleted > 0;
  }

  async softDeleteDetail(
    companyNo: number,
    vendorNo: number,
    entryNo: number,
    entrySequence: number
  ): Promise<boolean> {
    this.logger.log(
      `Soft deleting voucher detail - Company: ${companyNo}, Vendor: ${vendorNo}, Entry: ${entryNo}, Sequence: ${entrySequence}`
    );

    const [affectedCount] = await this.voucherDetailModel.update(
      { isDeleted: "D" },
      {
        where: {
          companyNo,
          vendorNo,
          entryNo,
          entrySequence,
          isDeleted: { [Op.ne]: "D" }, // Only update if not already deleted
        },
      }
    );

    this.logger.debug(
      `Voucher detail soft delete affected ${affectedCount} records`
    );
    return affectedCount > 0;
  }

  /**
   * Delete voucher details by entry numbers
   */
  async deleteByEntryNumbers(
    companyNo: number,
    entryNumbers: number[]
  ): Promise<number> {
    this.logger.log(
      `Deleting voucher details for company: ${companyNo}, entry numbers: ${entryNumbers.length}`
    );

    if (entryNumbers.length === 0) {
      this.logger.log("No entry numbers provided, skipping deletion");
      return 0;
    }

    const result = await this.voucherDetailModel.destroy({
      where: {
        companyNo,
        entryNo: { [Op.in]: entryNumbers },
        isDeleted: { [Op.notIn]: ["D", "I"] }, // Only active records
      },
    });

    this.logger.log(
      `Deleted ${result} voucher detail records for ${entryNumbers.length} entry numbers`
    );

    return result;
  }
}
