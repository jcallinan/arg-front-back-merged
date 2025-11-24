import { Injectable, Inject } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { SpInfoInterface } from "../../../../domain/interface/spinfo.interface";

@Injectable()
export class GetReportNamesUsecase {
  private readonly logger = new AppLogger(GetReportNamesUsecase.name);

  constructor(
    @Inject("SpInfoInterface")
    private readonly spInfoInterface: SpInfoInterface
  ) { }

  /**
   * Execute the get report names use case
   * @returns {Promise<string[]>} Array of available report names
   */
  async execute(): Promise<string[]> {
    this.logger.log("Executing get report names use case");

    const reportNames = await this.spInfoInterface.getAllReportNames();

    this.logger.log(`Found ${reportNames.length} available report names`);

    return reportNames;
  }
} 