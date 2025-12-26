import { BaseQueryDto } from "../dto/base-query.dto";

export interface NormalizedQuery {
  search?: string;
  page: number;
  limit: number;
  offset: number;
  sortBy?: string;
  sortOrder: "asc" | "desc";
}

export function normalizeSearchQuery(query: BaseQueryDto): NormalizedQuery {
  const page = query.current_page || 1;
  const limit = query.items_per_page || 500;
  const offset = (page - 1) * limit;

  return {
    search: query.search?.trim(),
    page,
    limit,
    offset,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder || "asc",
  };
}
