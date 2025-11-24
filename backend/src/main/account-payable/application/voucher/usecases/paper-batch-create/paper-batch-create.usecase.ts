import { Injectable } from "@nestjs/common";
import { FlowProducer } from "bullmq";
import { redis_connection } from "@src/shared/queue/bullmq-connection";
import { QueueSelector } from "@src/shared/config/queue-selector";
import { CompanyService } from "@src/main/account-payable/domain/services/company/companies.service";
import { VoucherSharedService } from "@src/main/account-payable/application/voucher/shared-services/voucher.shared.service";
import { InvoiceBatchProcessSharedService } from "@src/main/account-payable/application/voucher/shared-services/invoice-batch-process.shared.service";
import { AppLogger } from "@src/shared/logger/logger.service";
import { v4 as uuidv4 } from "uuid";
import { CreateBatchRequestDto } from "../../dto/voucher.dto";
import { getProcessTypeConfig } from "@src/shared/config/process-config";
import { PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";
import { ProcessType } from "@src/shared/constants/strategy-type.enum";
@Injectable()
export class PaperBatchCreateUseCase {
  private readonly logger = new AppLogger(PaperBatchCreateUseCase.name);

  constructor(
    private readonly queueSelector: QueueSelector,
    private readonly companyService: CompanyService,
    private readonly voucherSharedService: VoucherSharedService
  ) {}

  async execute(userId: any, dto: CreateBatchRequestDto) {
    const { invoices } = dto;
    this.logger.log(
      `[INFO] Processing Paper batch create for ${invoices.length} invoices`
    );
    const batchId = `P-${Date.now()}-${uuidv4()}`;
    const invoiceType = PROCESS_TYPE_ENUM.PAPER;
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
      message: `Paper batch create accepted, split into ${result.totalBatches} batches`,
      ...result,
    };
  }
}
