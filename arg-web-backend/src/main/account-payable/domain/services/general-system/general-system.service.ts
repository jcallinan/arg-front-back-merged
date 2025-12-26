import {
  Injectable,
  Inject,
  BadRequestException,
} from "@nestjs/common";
import { GeneralSystemEntity } from "@src/main/account-payable/domain/entities/general-system.entity";
import { GeneralSystemInterface } from "@src/main/account-payable/domain/interface/general-system.interface";
import { AppLogger } from "@src/shared/logger/logger.service";

@Injectable()
export class GeneralSystemService {
  private readonly logger = new AppLogger(GeneralSystemService.name); // Initializes a logger for the GeneralSystemService.

  constructor(
    @Inject("GeneralSystemRepository")
    private readonly generalSystemRepository: GeneralSystemInterface,
  ) { }

  async getGeneralSystemRecord(
    tableType: string,
    tableCode?: string,
  ): Promise<GeneralSystemEntity | null> {
    // Attempts to retrieve a Gstabl record based on provided tableType and optional tableCode.
    if (!tableType) {
      this.logger.warn("Table type is required");
      throw new BadRequestException("Table type is required");
    }
    const foundRecord = await this.generalSystemRepository.findOne(
      tableType,
      tableCode,
    );
    if (!foundRecord) {
      this.logger.warn("No record found");
      // throw new NotFoundException('No record found');
    }
    return foundRecord;
  }

  async getBulkGeneralSystemRecords(
    requests: Array<{ tableType: string; tableCode: string }>,
  ): Promise<Map<string, GeneralSystemEntity>> {
    return await this.generalSystemRepository.findMultiple(requests);
  }

  async cacheAllGeneralSystem(): Promise<void> {
    this.logger.log(`Initiating bulk GSTable cache`);
    await this.generalSystemRepository.cacheAllGeneralSystem();
  }
  async cacheGSTableData() {
    const startTime = Date.now();

    try {
      await this.cacheAllGeneralSystem();

      const duration = Date.now() - startTime;

      return {
        success: true,
        duration,
        totalGSTables: 'N/A', // GSTable count is determined during caching
        cachedGSTables: 'All system configurations',
        message: `GSTable records cached successfully`,
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      return {
        success: false,
        duration,
        totalGSTables: 0,
        cachedGSTables: 0,
        message: `Failed to cache GSTable records: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
}
