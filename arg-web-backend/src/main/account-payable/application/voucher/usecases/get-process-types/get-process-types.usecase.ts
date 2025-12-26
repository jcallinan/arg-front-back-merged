import { Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { FIELD_NAMES } from "@src/shared/constants/constant";
import { DropdownOption } from "@src/shared/utils/response-formatter";

@Injectable()
export class GetProcessTypes {
  private readonly logger = new AppLogger(GetProcessTypes.name);

  // Async method to get all process types
  async execute(): Promise<DropdownOption[]> {
    this.logger.log("Fetching all process types");
      return FIELD_NAMES.PROCESS_TYPE;
  }
}
