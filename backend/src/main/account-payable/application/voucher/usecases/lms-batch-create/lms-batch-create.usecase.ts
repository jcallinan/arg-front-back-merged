import { Injectable } from "@nestjs/common";
import { FlowProducer } from "bullmq";
import { redis_connection } from "@src/shared/queue/bullmq-connection";
import { QueueSelector } from "@src/shared/config/queue-selector";
import { CompanyService } from "@src/main/account-payable/domain/services/company/companies.service";
import { VoucherSharedService } from "@src/main/account-payable/application/voucher/shared-services/voucher.shared.service";
import { InvoiceBatchProcessSharedService } from "@src/main/account-payable/application/voucher/shared-services/invoice-batch-process.shared.service";

import { AppLogger } from "@src/shared/logger/logger.service";
import { ProcessType } from "@src/shared/constants/strategy-type.enum";
import { v4 as uuidv4 } from "uuid";
import { CreateBatchRequestDto } from "../../dto/voucher.dto";
import { PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";
import { getProcessTypeConfig } from "@src/shared/config/process-config";
@Injectable()
export class LmsBatchCreateUseCase {
  private readonly logger = new AppLogger(LmsBatchCreateUseCase.name);

  constructor(
    private readonly queueSelector: QueueSelector,
    private readonly companyService: CompanyService,
    private readonly voucherSharedService: VoucherSharedService
  ) {}

  async execute(userId: any, dto: CreateBatchRequestDto) {
    const { invoices } = dto;
    this.logger.log(
      `[INFO] Processing Lms batch create for ${invoices.length} invoices`
    );
    const batchId = `L-${Date.now()}-${uuidv4()}`;
    const invoiceType = PROCESS_TYPE_ENUM.ARGLMS;
    const processType = ProcessType.PAPER;
    const config = getProcessTypeConfig(processType);
    if (!config) {
      throw new Error(`Unsupported process type: ${processType}"}`);
    }
    // Use orchestrator + FlowProducer to create multi-batch jobs
    const orchestrator = new InvoiceBatchProcessSharedService(
      config,
      invoices,
      new FlowProducer({
        connection: redis_connection,
      }),
      invoiceType,
      batchId,
      userId,
      this.queueSelector,
      this.companyService,
      this.voucherSharedService,
      processType
    );

    const result = await orchestrator.process();

    return {
      message: `Lms batch create accepted, split into ${result.totalBatches} batches`,
      ...result,
    };
  }
}
