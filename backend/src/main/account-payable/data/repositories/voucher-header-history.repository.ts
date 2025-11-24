import {
    Injectable, Logger, Inject,
  } from "@nestjs/common";
  import { VoucherHeaderHistoryInterface } from "../../domain/interface/voucher.interface";
  import { VoucherHistoryHeader } from "../../domain/entities/voucher-history.entity";
  import { voucherHeaderHistoryMapper } from "../mappers/voucher-header-history.mapper";
  import { VoucherHeaderHistoryModel } from "@src/main/account-payable/data/models/voucher-header-history.model";
  import { Transaction } from "@sequelize/core";
  
  @Injectable()
  export class VoucherHeaderHistoryRepository implements VoucherHeaderHistoryInterface {
    private readonly logger = new Logger(VoucherHeaderHistoryRepository.name);
  
    constructor(
      @Inject("VoucherHeaderHistoryModel")
      private readonly voucherHeaderHistoryModel: typeof VoucherHeaderHistoryModel,
    ) { }
  
    async getTransaction(): Promise<Transaction> {
      return this.voucherHeaderHistoryModel.sequelize!.transaction(async (t) => t);
    }
  
    async create(data: Partial<VoucherHistoryHeader>, transaction?: Transaction): Promise<VoucherHistoryHeader> {
      this.logger.log(`Creating voucher header history with data: ${JSON.stringify(data)}`);
  
      const record = await this.voucherHeaderHistoryModel.create(data, { transaction });
      this.logger.log(`[HEADER HISTORY] Successfully created header history for entry ${data.entryNo}`);
      return voucherHeaderHistoryMapper(record);
    }
  
    async startTransaction(): Promise<Transaction> {
      return this.getTransaction();
    }
  }