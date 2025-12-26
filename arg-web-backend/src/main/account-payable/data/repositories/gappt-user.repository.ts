import { Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { GapptUser } from "@src/main/account-payable/domain/entities/gappt-user.entity";

import { gapptUserMapper } from "../mappers/gappt-user.mappers";
import { GapptUserInterface } from "@src/main/account-payable/domain/interface/gappt-user.interface";
import { DynamicModelInitializationRepository } from "@src/shared/infrastructure/data/repository/dynamic-model-initialization.repository";

@Injectable()
export class GapptUserRepository implements GapptUserInterface {
  private readonly logger = new AppLogger(GapptUserRepository.name);
  constructor(
    private readonly dynamicModelInitializationRepository: DynamicModelInitializationRepository
  ) { }

  async findByEntrySequence(
    entrySequence: string,
    userId: string
  ): Promise<GapptUser | null> {
    const suffix = userId?.toUpperCase().trim();

    const Model =
      this.dynamicModelInitializationRepository.initDynamicTable('GapptUser', { suffix }); // loads APPTCH etc.

    if (!Model) {
      throw new Error(`Failed to initialize dynamic model for GAPPT${suffix}`);
    }


    const record = await Model.findOne({
      where: { entrySequence },
      raw: true,
    });

    this.logger.log(
      `GAPPT${userId} lookup: ${entrySequence} -> ${JSON.stringify(record)}`
    );

    if (!record) {
      this.logger.log(`Entry sequence ${entrySequence} not found`);
    } else {
      this.logger.log(
        `Entry sequence ${entrySequence} found: ${JSON.stringify(record)}`
      );
    }

    // map to domain entity
    return gapptUserMapper(record);
  }
}
