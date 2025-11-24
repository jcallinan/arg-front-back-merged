import { Inject, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { SpInfoInterface } from "../../../../domain/interface/spinfo.interface";
import { SpInfo } from "../../../../domain/entities/spinfo.entity";
import { GetSpInfoByReportNameDto } from "../../dto/reports.dto";
import { ignoreFieldsLowerCase } from "@src/shared/constants/sp";

@Injectable()
export class GetReportDetailsUsecase {
  private readonly logger = new AppLogger(GetReportDetailsUsecase.name);

  constructor(
    @Inject("SpInfoInterface")
    private readonly spInfoInterface: SpInfoInterface
  ) { }

  /**
   * Execute the call-sp use case to find spinfo records by report name
   * @param {GetSpInfoByReportNameDto} params - The report name to find spinfo records for
   * @returns {Promise<SpInfo[]>} Array of spinfo records
   */
  async execute(params: GetSpInfoByReportNameDto): Promise<SpInfo[]> {
    this.logger.log(`Executing call-sp use case for report: ${params.name}`);

    let spinfoRecords = await this.spInfoInterface.findAllByReportName({
      name: params.name,
      variableType: params?.variableType ?? "in",
    });

    if (spinfoRecords.length) {
      spinfoRecords = spinfoRecords.filter(
        spinfo => !ignoreFieldsLowerCase.includes(spinfo?.fieldKey?.toLowerCase()));
      spinfoRecords = spinfoRecords.filter((spinfo, index, self) =>
        index === self.findIndex((t) => t.useCase === spinfo.useCase && t.fieldKey === spinfo.fieldKey)
      );
    }

    this.logger.log(`Found ${spinfoRecords.length} spinfo records for report: ${params.name}`);

    return spinfoRecords;
  }
} 