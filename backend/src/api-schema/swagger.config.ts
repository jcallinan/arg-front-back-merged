export interface SwaggerConfig {
  path: string;
  method: "get" | "post" | "put" | "delete" | "patch";
  operation: {
    tags?: string[];
    summary?: string;
    operationId?: string;
    parameters?: Array<{
      name: string;
      in: "query" | "path" | "header" | "cookie";
      required?: boolean;
      schema: {
        type: string;
        default?: any;
      };
    }>;
    responses: {
      [key: string]: {
        description: string;
        content?: {
          [key: string]: {
            schema: {
              type: string;
              properties?: Record<string, any>;
              required?: string[];
            };
          };
        };
      };
    };
  };
}
