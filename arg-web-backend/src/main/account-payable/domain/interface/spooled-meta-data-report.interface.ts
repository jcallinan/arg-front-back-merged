import { purchaseJournalReportDto } from "../../application/purchase-journal/dto/purchase-journal.dto";
import { SpooledMetadataReportModel } from "../../data/models/spooled-metadata-report.model";
import { SpooledMetaDataReportEntity } from "../entities/spooled-meta-data-report.entity";

export interface SpooledMetaDataReportInterface {
  SpooledMetadataReports(
    dto: purchaseJournalReportDto
  ): Promise<{
    reports: SpooledMetaDataReportEntity[];
    count: number;
    limit: number;
    page: number;
  }>;


  createReports(data: Partial<SpooledMetadataReportModel>): Promise<SpooledMetaDataReportEntity>
}
