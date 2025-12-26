import { Injectable, Inject } from "@nestjs/common";
import { SpooledMetadataReportModel } from "@src/main/account-payable/data/models/spooled-metadata-report.model";
import { SpooledMetaDataReportInterface } from "@src/main/account-payable/domain/interface/spooled-meta-data-report.interface";
import { Op, WhereOptions } from "@sequelize/core";
import { SpooledMetaDataReportEntity } from "../../domain/entities/spooled-meta-data-report.entity";
import { normalizeSearchQuery } from "@src/shared/utils/query.utils";
import { purchaseJournalReportDto } from "../../application/purchase-journal/dto/purchase-journal.dto";
import { reportsFormatter } from "@src/shared/formatters/dropdown.formatter";
import { AppLogger } from "@src/shared/logger/logger.service";
import { convertMmddyyToFormats } from "@src/shared/utils/format-date";

@Injectable()
export class SpooledMetaDataReportsRepository
  implements SpooledMetaDataReportInterface {

  private readonly logger = new AppLogger(SpooledMetaDataReportsRepository.name)


  constructor(
    @Inject("SpooledMetadataReportModel")
    private readonly spooledMetadataReportModel: typeof SpooledMetadataReportModel,
  ) { }

  async SpooledMetadataReports(dto: purchaseJournalReportDto): Promise<{
    reports: SpooledMetaDataReportEntity[];
    count: number;
    limit: number;
    page: number;
  }> {
    const { limit, offset, page } = normalizeSearchQuery(dto);

    const { reportType, fileName, startDate, endDate } = dto;

    const whereConditon: WhereOptions<SpooledMetadataReportModel> = {};

    if (reportType) {
      if (typeof reportType === 'string') {
        whereConditon.reportType = reportType;
      } else {
        whereConditon.reportType = {
          [Op.in]: reportType,
        };
      }
    }

    if (fileName) {
      whereConditon.pdfFileName = {
        [Op.like]: `%${fileName.trim()}%`,
      };
    }

    if (startDate && endDate) {
      const start = convertMmddyyToFormats(startDate).fullDateString;
      const end = convertMmddyyToFormats(endDate).fullDateString;

      const startDateObj = new Date(start + 'T00:00:00'); // local midnight
      const endDateObj = new Date(end + 'T00:00:00');

      // make end exclusive by adding 1 day
      const endExclusive = new Date(endDateObj);
      endExclusive.setDate(endExclusive.getDate() + 1);

      whereConditon.reportDateTime = {
        [Op.gte]: startDateObj,
        [Op.lt]: endExclusive,
      };
    }
    else if (startDate) {
      const start = convertMmddyyToFormats(startDate).fullDateString;
      whereConditon.reportDateTime = {
        [Op.gte]: start,
      };
    } else if (endDate) {
      const end = convertMmddyyToFormats(endDate).fullDateString;
      whereConditon.reportDateTime = {
        [Op.lte]: end,
      };
    }

    const { rows, count } =
      await this.spooledMetadataReportModel.findAndCountAll({
        attributes: ["reportType", "pdfFileName", "reportDateTime", "filePath", "formType"],
        where: whereConditon,
        offset,
        limit,
        raw: true,
        order: [['reportDateTime', 'DESC']],
      });


    const reports = reportsFormatter(rows)

    return { reports, count, limit, page };
  }


  async createReports(data: Partial<SpooledMetadataReportModel>): Promise<SpooledMetaDataReportEntity> {
    try {

      this.logger.log('Saving the Reports on the SpooledMetadataReports')

      return await this.spooledMetadataReportModel.create({ ...data })

    } catch (error) {
      throw error
    }
  }
}
