import { FlowProducer } from "bullmq";
import { redis_connection } from "@src/shared/queue/bullmq-connection";
import { QueueSelector } from "@src/shared/config/queue-selector";
import { setUploadStartTime } from "@src/shared/utils/process-duration-tracker";
import { CompanyService } from "@src/main/account-payable/domain/services/company/companies.service";
import { VoucherSharedService } from "@src/main/account-payable/application/voucher/shared-services/voucher.shared.service";
import IORedis from "ioredis";
import { ProcessType } from "@src/shared/constants/strategy-type.enum";
import { PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";

type InvoiceData = {
  carrierId: string;
  carrierInvoiceNo: string;
  ordShipDate: string;
  invoiceType: string;
  ourOrderNo: number;
  shippingReferenceNo: number;
  invoiceAmount: number;
  companyNo: number;
  entryNo?: number;
  apGlNo?: number;
  bankGl?: number;
  retentionGl?: number;
  invoiceDate?: string; 
};
export class InvoiceBatchProcessSharedService {
  private readonly redis = new IORedis(redis_connection);

  constructor(
    private readonly config: any,
    private readonly invoiceData: InvoiceData[], // Array of invoice data from request payload
    private readonly flowProducer: FlowProducer,
    private readonly invoiceType: PROCESS_TYPE_ENUM,
    private readonly batchId: string,
    private readonly userId: string,
    private readonly queueSelector: QueueSelector,
    private readonly companyService: CompanyService,
    private readonly voucherSharedService: VoucherSharedService,
    private readonly processType: ProcessType
  ) {}

  async process() {
    const { batchSize } = this.config;

    // 1. Assign entryNo to each invoice before batching
    const companyNo = 10;
    await this.assignEntryGLNumberToInvoices(this.invoiceData, companyNo);

    // 2. Split into batches
    const batches = this.chunkArray(this.invoiceData, batchSize);
    console.log(
      `Split into ${batches.length} batches with batch sizes:`,
      batches.map((b) => b.length)
    );
    const queueName = this.queueSelector.getQueueName(this.processType); // same queue name will be used for paper and lms

    console.log(`Quename ${queueName}`);

    // Set the start time ONCE, right before adding jobs
    await setUploadStartTime(this.redis, this.batchId);

    // 3. Create parent + children jobs via FlowProducer
    const flow = await this.flowProducer.add({
      name: `${this.processType}-parent-job`,
      queueName: this.queueSelector.getQueueName(this.processType),
      data: { batchId: this.batchId, userId: this.userId },
      children: batches.map((batch, index) => ({
        name: `${this.processType.toLowerCase()}-batch-${index}`,
        data: {
          invoiceType: this.invoiceType,
          invoiceRecords: batch,
          batchId: this.batchId,
          userId: this.userId,
          batchIndex: index,
          totalBatches: batches.length,
        },
        queueName,
      })),
    });

    const parentJobId = flow.job.id;
    const childJobIds = flow.children?.map((child) => child.job.id);

    return {
      batchId: this.batchId,
      totalGroups: this.invoiceData.length,
      totalBatches: batches.length,
      parentJobId,
      childJobIds,
      groups: this.invoiceData,
    };
  }

  // fetch entry no and GL no's and assign to invoices
  async assignEntryGLNumberToInvoices(
    invoiceData: InvoiceData[],
    companyNo: number
  ) {
    const requiredEntryCount = invoiceData.length;
    const company = await this.companyService.findOne(companyNo);
    const startingEntryNo =
      await this.voucherSharedService.getAndIncrementNextEntryNo(
        company,
        requiredEntryCount
      );

    const bankGl = company.companyBankGlNo;
    const apGlno = company.companyApGlNo;
    const retentionGl = company.companyRetentionGlNo;

    invoiceData.forEach((invoice, i) => {
      const entryNoForGroup = startingEntryNo + i;
      invoice.entryNo = entryNoForGroup;
      invoice.companyNo = companyNo;
      invoice.bankGl = bankGl;
      invoice.apGlNo = apGlno;
      invoice.retentionGl = retentionGl;
    });
  }

  // Split array into chunks
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
}
