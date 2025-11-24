import { ApiOperationOptions, ApiResponseOptions, ApiParamOptions } from "@nestjs/swagger";
import { Report_Type } from "@src/shared/constants/constant";

export const ReportList = {
  path: "/ap-global-states/reportTypes/:type",
  method: "GET",
  operation: {
    summary: "Report List",
    operationId: "ProcessType", // No spaces or symbols in operationId
    tags: ["ApGlobalStates"],
    metaData: {
      accessRights: ["ap-global-states::reportTypes::type::read"],
    },
  } as ApiOperationOptions,
  parameters: [
    {
      name: "type",
      in: "path",
      required: true,
      enum: Object.values(Report_Type),
      schema: {
        type: "string",
        enum: Object.values(Report_Type),
        example: Report_Type.OPEN_PAYABLES,
      },
      description: "Report type enum values from Report_Type",
      style: "simple",
    } as ApiParamOptions,
  ],
  response: {
    status: 200,
    description: "Get Report List of Purchase Journal",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number", example: 1 },
          value: { type: "string", example: "Inventory-Receipt-Posting" },
          label: { type: "string", example: "Inventory Receipt Posting" },
        },
      },
    },
  } as ApiResponseOptions,
};
