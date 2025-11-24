import { Injectable, Logger, Inject } from "@nestjs/common";
import { VoucherDetailHistoryModel } from "../models/voucher-detail-history.model";
import { VoucherDetailHistoryInterface } from "../../domain/interface/voucher.interface";
import { VoucherHistoryDetail } from "../../domain/entities/voucher-history.entity";
import { voucherDetailHistoryMapper } from "../mappers/voucher-detail-history.mapper";
import { Transaction } from "@sequelize/core";

@Injectable()
export class VoucherDetailHistoryRepository implements VoucherDetailHistoryInterface {
  private readonly logger = new Logger(VoucherDetailHistoryRepository.name);
  constructor(
    @Inject("VoucherDetailHistoryModel")
    private readonly voucherDetailHistoryModel: typeof VoucherDetailHistoryModel,
  ) {} 
  
  async create(data: Partial<VoucherHistoryDetail[]>, transaction?: Transaction): Promise<VoucherHistoryDetail[]> {
    this.logger.log(`Creating voucher detail history with data: ${JSON.stringify(data)}`);
    this.logger.log(`[DETAIL HISTORY] Processing ${data.length} detail records`);
    
    const results: VoucherHistoryDetail[] = [];
    
    // Process records sequentially to avoid database lock conflicts
    for (let index = 0; index < data.length; index++) {
      const detail = data[index];
      
      try {
        const companyNo = detail?.companyNo;
        const entryNo = detail?.entryNo;
        const entrySequence = detail?.entrySequence;
  
        if (!companyNo || !entryNo || !entrySequence) {
          const errorMsg = `Missing required fields for detail ${index}: companyNo=${companyNo}, entryNo=${entryNo}, entrySequence=${entrySequence}`;
          throw new Error(errorMsg);
        }
  
        this.logger.log(`[DETAIL HISTORY] Creating detail ${index + 1}/${data.length}: entryNo=${entryNo}, entrySequence=${entrySequence}`);
        
        const record = await this.voucherDetailHistoryModel.create({ ...detail }, { transaction });
        
        if (record) {
          const mappedRecord = voucherDetailHistoryMapper(record);
          this.logger.log(`[DETAIL HISTORY] Successfully created detail ${index + 1}/${data.length}`);
          results.push(mappedRecord);
        } else {
          throw new Error(`Failed to create record for detail ${index + 1}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.logger.log(` [DETAIL HISTORY] Failed to create detail ${index + 1}/${data.length}: ${errorMessage}`);
        throw error;
      }
    }
    
    this.logger.log(`[DETAIL HISTORY] Successfully created all ${results.length} detail records`);
    return results;
  } 
}