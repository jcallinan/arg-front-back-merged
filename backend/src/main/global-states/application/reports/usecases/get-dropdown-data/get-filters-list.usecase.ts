import { Injectable, Inject } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { DropdownType } from "@src/types/types";

import {
  DropdownInterface,
  DropdownOptions,
} from "../../../../domain/interface/filters-list.interface";
import { DropdownRequestDto } from "../../dto/filters-list.dto";
import {
  paginatedResponse,
  PaginatedResponse,
} from "@src/shared/utils/response-formatter";
import { normalizeSearchQuery } from "@src/shared/utils/query.utils";

@Injectable()
export class GetDropdownDataUsecase {
  private readonly logger = new AppLogger(GetDropdownDataUsecase.name);

  constructor(
    @Inject("DropdownInterface")
    private readonly filtersListRepository: DropdownInterface
  ) {}

  async execute(
    request: DropdownRequestDto
  ): Promise<PaginatedResponse<DropdownType>> {
    // Use the provided type (required by DTO)
    const dropdownType = request.type;
    this.logger.log(`Getting dropdown data for type: ${dropdownType}`);

    try {
      const normalizedQuery = normalizeSearchQuery(request);

      // Single default case: Handle ALL dropdown types through repository
      // This covers: PROCESS_TYPES, FORM_TYPE, PAYMENT_FOR_REPORT_TYPES,
      // COUNTRIES_ISO, COUNTRIES_PHONE_CODE, VENDOR_NAMES, COMPANY_NAMES, EXPENSE_GL

      const options: DropdownOptions = {
        ...normalizedQuery,
        companyNo: request.companyNo,
      };

      const result = await this.filtersListRepository.getDropdownData(
        dropdownType,
        options
      );

      // The repository returns { rows: [...], count: number }
      // Extract the rows and use the count for pagination
      const { rows: items, count: totalCount } = result;

      return paginatedResponse(
        items,
        totalCount,
        normalizedQuery.page,
        normalizedQuery.limit
      );
    } catch (error) {
      this.logger.error(
        `Error getting dropdown data for type ${dropdownType}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      throw error;
    }
  }
}
