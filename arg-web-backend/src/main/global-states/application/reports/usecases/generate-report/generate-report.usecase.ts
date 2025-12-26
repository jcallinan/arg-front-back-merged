import { Inject, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { ExecuteSpDto } from "../../dto/reports.dto";
import { SpExecutionInterface } from "../../../../domain/interface/spinfo.interface";

@Injectable()
export class GenerateReportUsecase {
  private readonly logger = new AppLogger(GenerateReportUsecase.name);

  constructor(
    @Inject("SpExecutionInterface")
    private readonly spExecutionInterface: SpExecutionInterface
  ) { }

  /**
   * Execute the dynamic SP use case
   * @param kebabName - The kebab case name of the report
   * @param parameters - Parameters to pass to the stored procedure
   * @returns Execution result with SP info and output
   */
  async execute(
    data: ExecuteSpDto
  ): Promise<Record<string, any>> {
    this.logger.log(`Executing dynamic SP use case for kebab name: ${data.name}`);

    const result = await this.spExecutionInterface.executeSpByReportName(data);
    this.logger.log(`Successfully executed SP for ${data.name} with ${data.parameters.length} parameters`);
    return result;
  }
} 