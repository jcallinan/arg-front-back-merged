import { FlowProducer } from "bullmq";
import { parseXlsxWithRowHeaders } from "@src/shared/utils/xlsx.utils";
import { filterAndNormalizeRows } from "@src/shared/utils/xlsx.utils";
import { redis_connection } from "@src/shared/queue/bullmq-connection";
import { QueueSelector } from "@src/shared/config/queue-selector";

import { setUploadStartTime } from "@src/shared/utils/process-duration-tracker";
import { CompanyService } from "@src/main/account-payable/domain/services/company/companies.service";
import { VoucherSharedService } from "@src/main/account-payable/application/voucher/shared-services/voucher.shared.service";
import IORedis from "ioredis";

export class UploadOrchestrator {
  private readonly redis = new IORedis(redis_connection);
  constructor(
    private readonly config: any,
    private readonly filePath: string,
    private readonly flowProducer: FlowProducer,
    private readonly uploadType: any,
    private readonly uploadId: string,
    private readonly userId: string,
    private readonly queueSelector: QueueSelector,
    private readonly companyService: CompanyService,
    private readonly voucherSharedService: VoucherSharedService,
    private readonly subType?: string // Take subType as a private readonly param
  ) {}

  async process() {
    const { groupKeys, batchSize } = this.config;

    // 1. Read the Excel file as JSON rows
    const dataRows = parseXlsxWithRowHeaders(this.filePath, this.subType);
    const filteredRows = filterAndNormalizeRows(dataRows, this.uploadType);

    // 2. Group by invoice + vendor
    const groups = this.groupByKeys(filteredRows, groupKeys);

    // 3. Assign entryNo + entrySequence to each group before batching
    const companyNo = 10;
    await this.assignEntryNumbersToGroups(groups, companyNo);

    // 4. Split into batches and Get queue name dynamically
    const batches = this.chunkArray(groups, batchSize);
    console.log(
      `Split into ${batches.length} batches with batch sizes:`,
      batches.map((b) => b.length)
    );

    const queueName = this.queueSelector.getQueueName(this.uploadType);

    //Set the start time ONCE, right before adding jobs
    await setUploadStartTime(this.redis, this.uploadId);

    // 5. Create parent + children jobs via FlowProducer
    const flow = await this.flowProducer.add({
      name: `${this.uploadType}-parent-job`,
      queueName: this.queueSelector.getQueueName(this.uploadType),
      data: { uploadId: this.uploadId, userId: this.userId },
      children: batches.map((batch, index) => ({
        name: `${this.uploadType.toLowerCase()}-batch-${index}`,
        data: {
          uploadType: this.uploadType,
          groupedRecords: batch,
          uploadId: this.uploadId,
          userId: this.userId,
          batchIndex: index,
          totalBatches: batches.length,
          subType: this.subType, // Pass subType to job data
        },
        queueName,
      })),
    });

    const parentJobId = flow.job.id;
    const childJobIds = flow.children?.map((child) => child.job.id);
    return {
      uploadId: this.uploadId,
      totalGroups: groups.length,
      totalBatches: batches.length,
      parentJobId,
      childJobIds,
      groups,
    };
  }

  groupByKeys(rows: any[], keys: string[]): { header: any; details: any[] }[] {
    const map = new Map<string, any[]>();

    for (const row of rows) {
      const groupKey = keys.map((k) => row[k]).join("-");
      if (!map.has(groupKey)) {
        map.set(groupKey, []);
      }
      map.get(groupKey)?.push(row);
    }

    const result: { header: any; details: any[] }[] = [];
    for (const [_key, groupRows] of map.entries()) {
      result.push({
        header: groupRows[0], // use first row as header
        details: [...groupRows], // include all rows in details
      });
    }

    return result;
  }

  async assignEntryNumbersToGroups(
    groups: { header: any; details: any[] }[],
    companyNo: number
  ) {
    const requiredEntryCount = groups.length;
    const company = await this.companyService.findOne(companyNo);
    const startingEntryNo =
      await this.voucherSharedService.getAndIncrementNextEntryNo(
        company,
        requiredEntryCount
      );

    const bankGl = company.companyBankGlNo;
    const apGlno = company.companyApGlNo;

    groups.forEach((group, i) => {
      const entryNoForGroup = startingEntryNo + i;
      group.header.entryNo = entryNoForGroup;
      group.header.companyNo = companyNo;
      group.header.bankGl = bankGl;
      group.header.apGlNo = apGlno;

      group.details.forEach((detail, idx) => {
        detail.entryNo = entryNoForGroup;
        detail.companyNo = companyNo;
        detail.entrySequence = idx + 1;
      });
    });
  }

  private chunkArray(arr: any[], size: number): any[][] {
    const res: any[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      res.push(arr.slice(i, i + size));
    }
    return res;
  }
}
