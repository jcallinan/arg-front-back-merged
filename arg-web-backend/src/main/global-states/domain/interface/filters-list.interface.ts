import { DropdownType } from "@src/types/types";
import {
  DropdownTypeEnum,
  DropdownDbTypeEnum,
} from "@src/shared/utils/dropdown";
import { BaseQueryDto } from "@src/shared/dto/base-query.dto";

export interface DropdownOptions extends BaseQueryDto {
  companyNo?: number;
  additionalFilters?: Record<string, any>;
  // Properties added by ValidationPipe transformation
  page?: number;
  limit?: number;
  offset?: number;
}

/**
 * Interface for dropdown repository operations
 * @interface DropdownInterface
 * @description Defines the contract for dropdown data access operations
 */
export interface DropdownInterface {
  /**
   * Get dropdown data by type with optional filtering and pagination
   * @param {DropdownDbTypeEnum} type - The type of dropdown to retrieve
   * @param {DropdownOptions} options - Optional filtering and pagination options
   * @returns {Promise<{ rows: DropdownType[]; count: number }>} Object with rows and total count
   * @throws {Error} If there's an error fetching dropdown data
   * @example
   * const result = await dropdownRepository.getDropdownData(DropdownDbTypeEnum.VENDOR_NAMES, { companyNo: 10 });
   * const { rows, count } = result;
   */
  getDropdownData(
    type: DropdownTypeEnum | DropdownDbTypeEnum,
    options?: DropdownOptions
  ): Promise<{ rows: DropdownType[]; count: number }>;
}
