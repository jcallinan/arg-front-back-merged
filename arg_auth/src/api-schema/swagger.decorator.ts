// swagger.decorator.ts

import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiQuery, ApiBody, ApiParam } from "@nestjs/swagger";

// Function to extract namespace from path
function getNamespaceFromPath(path: string): string {
  // Extract the first segment after the leading slash
  const segments = path.split('/').filter(segment => segment.length > 0);
  if (segments.length > 0 && segments[0]) {
    // Convert kebab-case to camelCase for namespace
    const namespace = segments[0].replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase());
    return namespace;
  }
  return 'api'; // fallback
}

export function ApiEndpoint(config: {
  operation: any;
  response: any;
  queries?: any[];
  parameters?: any[];
  body?: any;
  path?: string; // Add path property
}) {
  // Extract namespace from path
  const namespace = getNamespaceFromPath(config.path || '');

  // Automatically add method name to summary if operationId exists
  const enhancedOperation = {
    ...config.operation,
    summary: config.operation.operationId
      ? `${config.operation.summary} (Method: ${config.operation.operationId})`
      : config.operation.summary,
    description: config.operation.description
      ? `${config.operation.description} Frontend usage: api.${namespace}.${config.operation.operationId}()`
      : `Frontend usage: api.${namespace}.${config.operation.operationId}()`
  };

  const decorators = [
    ApiOperation(enhancedOperation),
    ApiResponse(config.response),
  ];

  if (config.queries) {
    config.queries.forEach((query) => {
      decorators.push(ApiQuery(query));
    });
  }

  if (config.parameters) {
    config.parameters.forEach((param) => {
      decorators.push(ApiParam(param));
    });
  }

  if (config.body) {
    decorators.push(ApiBody(config.body));
  }

  return applyDecorators(...decorators);
}
