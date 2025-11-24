import { GetVendorsByYearDto } from "@src/main/account-payable/application/ap-period-end/dto/ap-period-end.dto";

export interface GetVendorsByYearDtoFactoryOptions {
  companyNo?: number;
  year?: number;
  current_page?: number;
  items_per_page?: number;
  sortBy?: string;
  sortOrder?: string;
}

export class APPeriodEndFactory {
  /**
   * Creates a basic GetVendorsByYearDto with default values
   */
  static createGetVendorsByYearDto(
    overrides: Partial<GetVendorsByYearDtoFactoryOptions> = {}
  ): GetVendorsByYearDto {
    const defaultDto: GetVendorsByYearDtoFactoryOptions = {
      companyNo: 10,
      year: 2024,
      current_page: 1,
      items_per_page: 10,
      sortBy: "vendorNo",
      sortOrder: "asc",
    };

    return { ...defaultDto, ...overrides } as GetVendorsByYearDto;
  }

  /**
   * Creates a GetVendorsByYearDto for pagination testing
   */
  static createGetVendorsByYearDtoForPagination(
    page: number,
    itemsPerPage: number,
    overrides: Partial<GetVendorsByYearDtoFactoryOptions> = {}
  ): GetVendorsByYearDto {
    return this.createGetVendorsByYearDto({
      ...overrides,
      current_page: page,
      items_per_page: itemsPerPage,
    });
  }

  /**
   * Creates a GetVendorsByYearDto for a specific company
   */
  static createGetVendorsByYearDtoForCompany(
    companyNo: number,
    overrides: Partial<GetVendorsByYearDtoFactoryOptions> = {}
  ): GetVendorsByYearDto {
    return this.createGetVendorsByYearDto({
      ...overrides,
      companyNo,
    });
  }

  /**
   * Creates a GetVendorsByYearDto for a specific year
   */
  static createGetVendorsByYearDtoForYear(
    year: number,
    overrides: Partial<GetVendorsByYearDtoFactoryOptions> = {}
  ): GetVendorsByYearDto {
    return this.createGetVendorsByYearDto({
      ...overrides,
      year,
    });
  }

  /**
   * Creates a GetVendorsByYearDto with custom sorting
   */
  static createGetVendorsByYearDtoWithSorting(
    sortBy: string,
    sortOrder: string,
    overrides: Partial<GetVendorsByYearDtoFactoryOptions> = {}
  ): GetVendorsByYearDto {
    return this.createGetVendorsByYearDto({
      ...overrides,
      sortBy,
      sortOrder,
    });
  }

  /**
   * Creates a GetVendorsByYearDto for testing empty results
   */
  static createGetVendorsByYearDtoForEmptyResults(
    overrides: Partial<GetVendorsByYearDtoFactoryOptions> = {}
  ): GetVendorsByYearDto {
    return this.createGetVendorsByYearDto({
      ...overrides,
      year: 2023, // Use a year that might not have data
    });
  }

  /**
   * Creates a GetVendorsByYearDto for testing error scenarios
   */
  static createGetVendorsByYearDtoForErrorTesting(
    overrides: Partial<GetVendorsByYearDtoFactoryOptions> = {}
  ): GetVendorsByYearDto {
    return this.createGetVendorsByYearDto({
      ...overrides,
      companyNo: 999, // Use an invalid company number
    });
  }
}
