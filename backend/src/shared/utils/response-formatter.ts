import { ErrorConstantValue } from "../constants/error-constants";
export interface PaginatedResponse<T> {
  items: T[]; // data
  pagination: {
    // metaData
    total_items: number; // total
    current_page: number; // page
    items_per_page: number; // limit
    total_pages: number; // totalPages
  };
}

export interface DropdownOption {
  id: string | number;
  value: string;
  label: string;
}

export interface DropdownFormatter<T> {
  format(entities: T[]): DropdownOption[];
}

export interface SuccessResponse<T> {
  items: T;
}

export interface SimpleResponse<T> {
  items: T;
}

export function paginatedResponse<T>(
  items: T[],
  total_items: number,
  current_page: number,
  items_per_page: number
): PaginatedResponse<T> {
  return {
    items,
    pagination: {
      total_items,
      current_page,
      items_per_page,
      total_pages: Math.ceil(total_items / items_per_page),
    },
  };
}

export function simpleResponse<T>(
  payload: T
): SimpleResponse<T> & { warnings?: any } {
  const maybe: any = payload as any;
  if (
    maybe &&
    typeof maybe === "object" &&
    Object.prototype.hasOwnProperty.call(maybe, "items") &&
    Object.prototype.hasOwnProperty.call(maybe, "warnings")
  ) {
    // Pass-through when payload already has { items, warnings }
    return maybe as any;
  }
  return {
    items: payload,
  } as any;
}

export interface ErrorDetail {
  field: string;
  code: string;
  message: string;
  id?: string;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: ErrorDetail[] | string | null;
  };
}

export function errorResponse(
  constant: ErrorConstantValue,
  details?: ErrorDetail[]
): ErrorResponse {
  return {
    error: {
      code: constant.code,
      message: constant.message,
      details: details && details.length > 0 ? details : [],
    },
  };
}

export function serviceErrorResponse(
  constant: ErrorConstantValue,
  details?: string
): ErrorResponse {
  return {
    error: {
      code: constant.code,
      message: constant.message,
      details: details || null,
    },
  };
}

export function webSocketResponse<T>(data: {
  id: string;
  summary: any;
  items: any;
  unprocessedItems?: any[];
}): T {
  return {
    ...data,
    status: "Completed",
  } as T;
}
