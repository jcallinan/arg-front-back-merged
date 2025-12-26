import { ApiResponseOptions } from "@nestjs/swagger";

export const basePaginatedResponse = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
      },
    },
    metaData: {
      type: "object",
      properties: {
        total: { type: "number", example: 100 },
        page: { type: "number", example: 1 },
        limit: { type: "number", example: 10 },
        totalPages: { type: "number", example: 10 },
      },
    },
  },
} as ApiResponseOptions;
