import { PaginatedResponse } from "@src/shared/utils/response-formatter";

export interface PaginationFactoryOptions {
  total_items?: number;
  current_page?: number;
  items_per_page?: number;
  total_pages?: number;
}

/**
 * Factory for creating PaginatedResponse objects
 */
export class PaginatedResponseFactory {
  /**
   * Creates a paginated response for empty results
   */
  static createEmptyPaginatedResponse<T>(
    overrides: Partial<PaginatedResponse<T>> = {}
  ): PaginatedResponse<T> {
    return {
      items: [],
      pagination: {
        total_items: 0,
        current_page: 1,
        items_per_page: 10,
        total_pages: 0,
      },
      ...overrides,
    };
  }

  /**
   * Creates a paginated response for single page results
   */
  static createSinglePagePaginatedResponse<T>(
    items: T[],
    overrides: Partial<PaginatedResponse<T>> = {}
  ): PaginatedResponse<T> {
    return {
      items,
      pagination: {
        current_page: 1,
        items_per_page: 10,
        total_items: items.length,
        total_pages: 1,
      },
      ...overrides,
    };
  }

  /**
   * Creates a paginated response for specific page
   */
  static createPaginatedResponseForPage<T>(
    items: T[],
    page: number,
    itemsPerPage: number,
    totalItems: number,
    overrides: Partial<PaginatedResponse<T>> = {}
  ): PaginatedResponse<T> {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return {
      items,
      pagination: {
        current_page: page,
        items_per_page: itemsPerPage,
        total_items: totalItems,
        total_pages: totalPages,
      },
      ...overrides,
    };
  }
}
