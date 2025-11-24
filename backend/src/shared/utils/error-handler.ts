import { Logger, HttpException, HttpStatus } from "@nestjs/common";

export enum ErrorType {
  VALIDATION_ERROR = "Validation error",
  DATABASE_ERROR = "Database error",
  MISSING_FIELDS = "Missing required fields",
  AUTHENTICATION_ERROR = "Authentication error",
  AUTHORIZATION_ERROR = "Authorization error",
  INTERNAL_SERVER_ERROR = "Internal server error",
  UNKNOWN_ERROR = "An unexpected error occurred",
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export const handleServiceError = (
  error: any,
  customMessage?: string,
  customErrors?: ValidationError[],
): never => {
  const logger = new Logger("ErrorHandler");

  // Log the error if available
  if (error) {
    logger.error(customMessage || "An unexpected error occurred", error.stack);
  } else {
    logger.error(customMessage || "An unexpected error occurred");
  }

  // If customErrors array is provided, return it
  if (customErrors?.length) {
    throw new HttpException(
      {
        success: false,
        errors: customErrors,
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  // Handle existing HttpException and preserve its response
  if (error instanceof HttpException) {
    const response = error.getResponse();
    const status = error.getStatus();

    throw new HttpException(
      {
        success: false,
        ...(Array.isArray(response["errors"])
          ? { errors: response["errors"] }
          : { message: response["message"] || "An error occurred" }),
        statusCode: status,
      },
      status,
    );
  }

  // Known database/validation errors
  if (
    error?.name === "SequelizeDatabaseError" ||
    error?.name === "SequelizeValidationError"
  ) {
    throw new HttpException(
      {
        success: false,
        message: error.message,
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  // Handle other errors with a custom message
  if (error?.message) {
    throw new HttpException(
      {
        success: false,
        message: error.message,
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  // Default to Internal Server Error
  throw new HttpException(
    {
      success: false,
      message: customMessage || "Something went wrong",
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    },
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
};
