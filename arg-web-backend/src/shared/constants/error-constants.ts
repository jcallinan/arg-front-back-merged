export const ERROR_CONSTANTS = {
  VALIDATION_ERROR: {
    code: "VALIDATION_ERROR",
    message: "Invalid request data",
  },
  REQUIRED_FIELD: {
    code: "REQUIRED_FIELD",
    message: "This field is required",
  },
  INVALID_FORMAT: {
    code: "INVALID_FORMAT",
    message: "Invalid format",
  },
  SERVER_ERROR: {
    code: "SERVER_ERROR",
    message: "An unexpected error occurred",
  },
  NOT_FOUND: {
    code: "NOT_FOUND",
    message: "Requested Resource Not found",
  },
  FORBIDDEN: {
    code: "FORBIDDEN",
    message: "You are not authorized to access this resource",
  },
  UNAUTHORIZED: {
    code: "UNAUTHORIZED",
    message: "You are not authorized to access this resource",
  },
  SERVICE_UNAVAILABLE: {
    code: "SERVICE_UNAVAILABLE",
    message: "Service unavailable",
  },
} as const;

export type ErrorConstantKey = keyof typeof ERROR_CONSTANTS;
export type ErrorConstantValue = (typeof ERROR_CONSTANTS)[ErrorConstantKey];
