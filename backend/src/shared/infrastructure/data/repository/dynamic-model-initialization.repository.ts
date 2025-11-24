import { Injectable } from "@nestjs/common";
import { Model, ModelStatic } from "@sequelize/core";
import { AppLogger } from "@src/shared/logger/logger.service";
import { initializeDynamicModel } from "../../../config/model-initializer";
import { DYNAMIC_TABLE_REGISTRY } from "../../../config/constants/dynamic-table-registry";

@Injectable()
export class DynamicModelInitializationRepository {
  private readonly logger = new AppLogger(
    DynamicModelInitializationRepository.name
  );

  initDynamicTable(
    modelName: keyof typeof DYNAMIC_TABLE_REGISTRY,
    metadata: { suffix?: string, prefix?: string },
  ): ModelStatic<Model> | null {
    try {
      if (!metadata.suffix && !metadata.prefix) {
        throw new Error(
          `Invalid prefix or suffix: "${metadata.prefix}" or "${metadata.suffix}"`
        );
      }
      const cleanPrefix = metadata.prefix?.toUpperCase()?.trim();
      const cleanSuffix = metadata.suffix?.toUpperCase()?.trim();
      const result = initializeDynamicModel(modelName, { prefix: cleanPrefix, suffix: cleanSuffix });
      
      if (result) {
        this.logger.log(`Successfully initialized dynamic model: ${modelName} -> ${cleanPrefix}${cleanSuffix}`);
      } else {
        this.logger.error(`Failed to initialize dynamic model: ${modelName} -> ${cleanPrefix}${cleanSuffix}`);
      }
      
      return result as ModelStatic<Model> | null;
    } catch (error: any) {
      this.logger.error(`Error in initDynamicTable: ${error.message}`, error.stack);
      throw error;
    }
  }
}
