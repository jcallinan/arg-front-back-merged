import { Injectable } from "@nestjs/common";
import { GenerateReportInterface } from "../../domain/interface/generate-report.interface";

@Injectable()
export class GenerateReportRepository implements GenerateReportInterface {
  /**
   * Fetch all rows using the provided model + map them into entities
   * @param config - expects { model, entity }
   */
  async findAll(config: { model: any; entity: any }): Promise<any[]> {
    if (!config?.model || !config?.entity) {
      throw new Error("Invalid report config: model and entity are required");
    }

    // Fetch raw rows from Sequelize model
    const rows = await config.model.findAll({ raw: true });

    // Map to entity
    return rows.map((r: any) => config.entity.create(r));
  }
}
