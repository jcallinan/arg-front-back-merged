import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import {
  GenerateReportFileDto,
  GenerateReportFileResponseDto,
  GeneratedFileDto,
} from "../../dto/reports.dto";
import { GenerateReportInterface } from "@src/main/global-states/domain/interface/generate-report.interface";
import {
  FILE_TYPE,
  GenerateReportConfig,
} from "@src/shared/config/generate-report-config";
import { generateExcelFile } from "@src/shared/utils/xlsx.utils";
import { saveFileToSharedDrive } from "@src/shared/utils/upload-file-shared-drive";
import { generateTxtFile } from "@src/shared/utils/txt.utils";
import { getTimestamp, TIMESTAMP_FORMATS } from "@src/shared/utils/format-date";
import { SpooledMetaDataReportInterface } from "@src/main/account-payable/domain/interface/spooled-meta-data-report.interface";

@Injectable()
export class GenerateReportFilesUsecase {
  private readonly logger = new AppLogger(GenerateReportFilesUsecase.name);

  constructor(
    @Inject("SpooledMetaDataReportInterface")
    private readonly spooledMetaDataReportInterface: SpooledMetaDataReportInterface,
    @Inject("GenerateReportInterface")
    private readonly generateReportInterface: GenerateReportInterface
  ) {}

  private async createSpooledReportMetadata(
    savedFile: { fileName: string; fullPath: string },
    reportType: string,
    reportMetaData: any
  ) {
    const spooledReportMetaData = {
      ...reportMetaData,
      pdfFileName: savedFile.fileName,
      filePath: savedFile.fullPath,
      reportDateTime: getTimestamp(TIMESTAMP_FORMATS.READABLE_DATETIME),
      reportType,
    };

    const reportData = await this.spooledMetaDataReportInterface.createReports(
      spooledReportMetaData
    );
    return reportData;
  }

  async execute(
    dto: GenerateReportFileDto
  ): Promise<GenerateReportFileResponseDto> {
    this.logger.log(
      `Generating report for usecase=${dto.usecase}, companyNo=${dto.companyNo}`
    );

    // 1. Get config for usecase
    const config = GenerateReportConfig[dto.usecase];
    if (!config) {
      this.logger.error(`Unsupported usecase: ${dto.usecase}`);
      throw new Error(`Unsupported usecase: ${dto.usecase}`);
    }

    // 2. Validate required parameters
    this.validateReportParameters(
      dto.parameters,
      config.requiredParameters,
      dto.usecase
    );

    // 3. Fetch data via repo (generic)
    const result = await this.generateReportInterface.findAll({
      model: config.model,
      entity: config.entity,
    });

    this.logger.log(`Fetched ${result.length} records for ${dto.usecase}`);

    // 4. Generate files based on usecase config
    const files = await this.generateReportFiles(
      result,
      config,
      dto.parameters
    );

    this.logger.log(`Generated ${files.length} files for ${dto.usecase}`);

    return {
      message: `Report file(s) generated successfully for usecase: ${dto.usecase}`,
      files,
    };
  }

  private validateReportParameters(
    dtoParams: Record<string, any> | undefined,
    requiredParams: string[] | undefined,
    usecase: string
  ): void {
    // Case 1: required parameters must be present
    if (requiredParams && requiredParams.length > 0) {
      for (const param of requiredParams) {
        if (!dtoParams || !dtoParams[param]) {
          throw new BadRequestException(
            `Missing required parameter '${param}' for usecase '${usecase}'`
          );
        }
      }
    }

    // Case 2: if no required parameters, disallow extra ones
    if (
      (!requiredParams || requiredParams.length === 0) &&
      dtoParams &&
      Object.keys(dtoParams).length > 0
    ) {
      throw new BadRequestException(
        `Parameters are not allowed for usecase '${usecase}'`
      );
    }
  }

  private async generateReportFiles(
    result: any[],
    config: any,
    parameters: any
  ): Promise<GeneratedFileDto[]> {
    this.logger.log(`Generating files for reportType=${config.reportType}`);

    const baseFileName = config.filePrefix(parameters || {});
    const fileSuffix = config.fileSuffix();
    const files: any[] = [];

    for (const type of config.outputFiles) {
      const ext = type === FILE_TYPE.excel ? FILE_TYPE.excel : FILE_TYPE.txt;
      const fileName = `${baseFileName}_${fileSuffix}.${ext}`;

      let fileBuffer: Buffer;
      if (type === FILE_TYPE.excel) {
        fileBuffer = generateExcelFile(result, "Sheet1", config.columnMap);
      } else if (type === FILE_TYPE.txt) {
        fileBuffer = generateTxtFile(result, config.columnMap);
      } else {
        this.logger.warn(`Unsupported output type: ${type}`);
        continue;
      }

      const savedFile = await saveFileToSharedDrive(fileBuffer, fileName);

      this.logger.log(`Saved file to ${savedFile.fullPath}`);

      //Use per-file spooled metadata here
      const spooledMetaData = config.getReportMetaData(ext);

      const reportData = await this.createSpooledReportMetadata(
        savedFile,
        config.reportType,
        spooledMetaData
      );

      files.push({
        filePath: reportData.filePath.trim(),
        reportType: reportData.reportType.trim(),
        reportDateTime: reportData.reportDateTime,
      });
    }

    return files;
  }
}
