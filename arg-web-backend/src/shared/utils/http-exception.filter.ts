import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from "@nestjs/common";
import { Response } from "express";
import { errorResponse } from "./response-formatter";
import { ERROR_CONSTANTS } from "../constants/error-constant";
import type { ErrorDetail, ErrorResponse } from "./response-formatter";

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let errorBody: ErrorResponse;

    // HttpException and already in proper format
    if (exception instanceof HttpException) {
      const exceptionResponse = (exception as HttpException).getResponse();
      status = (exception as HttpException).getStatus();

      if (isFormattedErrorResponse(exceptionResponse)) {
        response.status(status).json(exceptionResponse);
        return;
      }

      // BadRequestException from class-validator custom map to ErrorDetail[]
      if (exception instanceof BadRequestException) {
        const exceptionResponse = (exception as any).getResponse();
        const message = exceptionResponse?.message;

        let details: ErrorDetail[];
        if (Array.isArray(message)) {
          details = buildValidationDetails(message);
        } else if (typeof message === "string") {
          // Handle simple string message from BadRequestException
          details = [
            {
              field:
                message.toLowerCase().includes("excel") ||
                message.toLowerCase().includes("file")
                  ? "file"
                  : "",
              message: message,
              code: ERROR_CONSTANTS.VALIDATION_ERROR.code,
            },
          ];
        } else {
          // Fallback for unexpected message format
          details = [
            {
              field: "",
              message: "Validation failed",
              code: ERROR_CONSTANTS.VALIDATION_ERROR.code,
            },
          ];
        }

        errorBody = errorResponse(ERROR_CONSTANTS.VALIDATION_ERROR, details);
        response.status(status).json(errorBody);
        return;
      }

      // Other HttpException wrap in standard SERVER_ERROR format
      const message =
        typeof exceptionResponse === "string"
          ? exceptionResponse
          : ((exceptionResponse as any)?.message ??
            ERROR_CONSTANTS.SERVER_ERROR.message);

      errorBody = errorResponse(ERROR_CONSTANTS.SERVER_ERROR, [
        {
          field: "",
          code: ERROR_CONSTANTS.SERVER_ERROR.code,
          message,
        },
      ]);

      response.status(status).json(errorBody);
      return;
    }

    // Unknown or unexpected error
    const message =
      exception instanceof Error
        ? exception.message
        : ERROR_CONSTANTS.SERVER_ERROR.message;

    errorBody = errorResponse(ERROR_CONSTANTS.SERVER_ERROR, [
      {
        field: "",
        code: ERROR_CONSTANTS.SERVER_ERROR.code,
        message,
      },
    ]);

    response.status(status).json(errorBody);
  }
}

/**
 * Checks if an object matches the custom error response format
 */
function isFormattedErrorResponse(obj: unknown): obj is ErrorResponse {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "error" in obj &&
    typeof (obj as any).error?.code === "string" &&
    Array.isArray((obj as any).error?.details)
  );
}

function buildValidationDetails(messages: any[]): ErrorDetail[] {
  const details: ErrorDetail[] = [];

  for (const msg of messages) {
    // Handle class-validator format: "field message"
    const fieldMatch = msg.match(/^([\w.\[\]0-9]+)\s(.+)$/);
    if (fieldMatch) {
      const [_, path, message] = fieldMatch;

      let field = path;
      let id: string | undefined;

      const detailsMatch = path.match(/^details\.(\d+)\.(\w+)$/);
      if (detailsMatch) {
        id = detailsMatch[1];
        field = detailsMatch[2];
      } else if (field.startsWith("header.")) {
        field = field.replace(/^header\./, "");
      }

      const alreadyAdded = details.find(
        (d) => d.field === field && d.message === message && d.id === id
      );
      if (alreadyAdded) continue;

      details.push({
        field,
        message,
        code: ERROR_CONSTANTS.VALIDATION_ERROR.code,
        ...(id ? { id } : {}),
      });
    } else {
      // Handle simple string messages (like from BadRequestException)
      // Use "file" as the default field for file validation errors
      const field =
        msg.toLowerCase().includes("excel") ||
        msg.toLowerCase().includes("file")
          ? "file"
          : "";

      details.push({
        field,
        message: msg,
        code: ERROR_CONSTANTS.VALIDATION_ERROR.code,
      });
    }
  }
  return details;
}
