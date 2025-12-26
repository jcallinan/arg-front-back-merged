import * as fs from 'fs';
import * as path from 'path';

interface RouteInfo {
  method: string;
  route: string;
  summary: string;
  operationId: string;
  tags: string[];
  module: string;
  submodule: string;
  location: string;
  handler: string;
  description?: string;
  parameters?: string;
  status?: string;
  azureDevOpsUrl?: string;
  handlerUrl?: string;
}

interface SwaggerPath {
  [method: string]: {
    summary: string;
    operationId: string;
    tags: string[];
    description?: string;
  };
}

interface SwaggerDocument {
  paths: {
    [path: string]: SwaggerPath;
  };
}

interface SwaggerDefinition {
  path: string;
  summary: string;
  operationId: string;
  tags: string[];
  description?: string;
  parameters?: string;
  responseType?: string;
  status?: string;
}

// Import swagger definitions dynamically
function getSwaggerDefinitions() {
  try {
    const routeDefinitions: { [key: string]: SwaggerDefinition } = {};

    // Scan for all swagger files in api-schema directory
    const apiSchemaPath = path.join(__dirname, '../src/api-schema');
    if (fs.existsSync(apiSchemaPath)) {
      const swaggerFiles = fs.readdirSync(apiSchemaPath)
        .filter(file => file.endsWith('.swagger.ts') || file.endsWith('.swagger.js'));

      swaggerFiles.forEach(swaggerFile => {
        try {
          const swaggerPath = path.join(apiSchemaPath, swaggerFile);
          const swaggerContent = fs.readFileSync(swaggerPath, 'utf8');

          // Extract route definitions using regex
          const exportPattern = /export const (\w+) = \{[^}]*path:\s*["']([^"']+)["'][^}]*operation:\s*\{[^}]*summary:\s*["']([^"']+)["'][^}]*operationId:\s*["']([^"']+)["'][^}]*tags:\s*\[([^\]]+)\][^}]*\}/gs;

          let match;
          while ((match = exportPattern.exec(swaggerContent)) !== null) {
            const [, name, routePath, summary, operationId, tagsStr] = match;
            const tags = tagsStr.split(',').map(tag => tag.trim().replace(/["']/g, ''));

            // Extract additional information
            const descriptionMatch = swaggerContent.substring(match.index).match(/description:\s*["']([^"']+)["']/);
            const description = descriptionMatch ? descriptionMatch[1] : undefined;

            // Determine parameters based on route and method
            const parameters = extractParametersFromRoute(routePath);

            // Determine response type based on operation
            const responseType = determineResponseType(operationId);

            // Determine status (active/inactive)
            const status = 'Active';

            routeDefinitions[name] = {
              path: routePath,
              summary,
              operationId,
              tags,
              description,
              parameters,
              responseType,
              status
            };
          }
        } catch (fileError) {
          const errorMessage = fileError instanceof Error ? fileError.message : 'Unknown error';
          console.warn(`Warning: Could not process swagger file ${swaggerFile}:`, errorMessage);
        }
      });
    }

    return routeDefinitions;
  } catch (error) {
    console.error('Error reading swagger definitions:', error);
    return {};
  }
}

function extractParametersFromRoute(route: string): string {
  const params: string[] = [];

  // Extract path parameters
  const pathParams = route.match(/\{([^}]+)\}/g);
  if (pathParams) {
    pathParams.forEach(param => {
      params.push(param.replace(/[{}]/g, ''));
    });
  }

  // Extract query parameters based on route patterns
  if (route.includes('companies') || route.includes('vendors') || route.includes('entries')) {
    params.push('companyNo', 'current_page', 'items_per_page', 'sortBy', 'sortOrder');
  }

  if (route.includes('vendors/:')) {
    params.push('vendorNo');
  }

  if (route.includes('entries/:')) {
    params.push('entryNo');
  }

  return params.length > 0 ? params.join(', ') : 'None';
}

function determineResponseType(operationId: string): string {
  if (operationId.includes('get') || operationId.includes('Get')) {
    return 'PaginatedResponse<T> | SimpleResponse<T>';
  }
  if (operationId.includes('submit') || operationId.includes('Submit')) {
    return 'SuccessResponse<T>';
  }
  if (operationId.includes('delete') || operationId.includes('Delete')) {
    return 'SuccessResponse<boolean>';
  }
  if (operationId.includes('validation') || operationId.includes('Validation')) {
    return 'ErrorResponse | SuccessResponse<T>';
  }
  return 'Response<T>';
}

function extractModuleFromTags(_tags: string[]): string {
  // Check if tags contain global-states related tags
  if (_tags && _tags.some(tag =>
    tag.includes('GlobalStates') ||
    tag.includes('Global States') ||
    tag.includes('Reports')
  )) {
    return 'global-states';
  }

  // Main module is account-payable for now
  return 'account-payable';
}

function extractHandlerFromOperationId(operationId: string): string {
  return operationId;
}

function findControllerFile(_module: string, submodule: string): string {
  if (submodule === 'app') {
    return 'src/app.controller.ts';
  }

  if (_module === 'global-states') {
    if (submodule === 'reports') {
      return 'src/main/global-states/application/reports/controllers/reports.controller.ts';
    }
    return 'src/main/global-states/application/reports/controllers/reports.controller.ts';
  }

  const basePath = `src/main/account-payable/application/${submodule}`;

  // Try to find the controller file by scanning the module directory
  const modulePath = path.join(__dirname, '..', basePath);

  if (fs.existsSync(modulePath)) {
    const controllersPath = path.join(modulePath, 'controllers');
    if (fs.existsSync(controllersPath)) {
      const files = fs.readdirSync(controllersPath);
      const controllerFile = files.find(file => file.endsWith('.controller.ts'));
      if (controllerFile) {
        return `${basePath}/controllers/${controllerFile}`;
      }
    }
  }

  return `${basePath}/controllers/${submodule}.controller.ts`;
}

function determineHttpMethod(route: string, operationId: string): string {
  // Determine HTTP method based on route pattern and operation ID
  if (route.includes('/submit') || route.includes('/validation')) {
    return 'POST';
  }
  if (route.includes('/{') || route.includes('/:')) {
    return 'GET';
  }
  if (operationId.toLowerCase().includes('delete')) {
    return 'DELETE';
  }
  if (operationId.toLowerCase().includes('update') || operationId.toLowerCase().includes('put')) {
    return 'PUT';
  }
  if (operationId.toLowerCase().includes('create') || operationId.toLowerCase().includes('submit')) {
    return 'POST';
  }
  return 'GET'; // Default to GET
}

function extractSubmoduleFromTags(tags: string[]): string {
  // Extract submodule from tags
  const tag = tags && tags.length > 0 ? tags[0] : undefined;

  if (tag && typeof tag === 'string') {
    // Map tags to submodule names
    const tagToSubmodule: { [key: string]: string } = {
      'AP Global States': 'ap-global-states',
      'GlobalStates': 'global-states',
      'ApGlobalStates': 'ap-global-states',
      'Vendors': 'vendors',
      'Vouchers': 'voucher',
      'Reports': 'reports',
      'App': 'app',
    };

    return tagToSubmodule[tag] || tag.toLowerCase().replace(/\s+/g, '-');
  }

  return 'unknown';
}

function extractSubmoduleFromRoute(route: string): string {
  // Extract submodule from route path for routes without tags
  if (route.includes('/ap-global-states/') || route.includes('/global-states/')) {
    return 'global-states';
  }

  if (route.includes('/vendors')) {
    return 'vendors';
  }

  if (route.includes('/vouchers')) {
    return 'voucher';
  }

  if (route.includes('/reports')) {
    return 'reports';
  }

  if (route === '/health-check' || route === '/app-dashboard') {
    return 'app'; // This should map to the main app controller
  }

  return 'unknown';
}

// Helper to map handler and submodule to use case directory path (no .ts extension)
function getUseCaseDirPath(submodule: string, handler: string): string {
  const kebabHandler = handler.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  const baseHandler = kebabHandler.replace(/-usecase$/, '');

  // Handle global-states module
  if (submodule === 'global-states' || submodule === 'reports') {
    return `src/main/global-states/application/reports/usecases/${baseHandler}/${baseHandler}.usecase.ts`;
  }

  return `src/main/account-payable/application/${submodule}/usecases/${baseHandler}/${baseHandler}.usecase.ts`;
}

// Generate Azure DevOps URL for use case directory
function generateUseCaseAzureDevOpsUrl(submodule: string, handler: string): string {
  const dirPath = getUseCaseDirPath(submodule, handler);
  return generateAzureDevOpsUrl(dirPath, handler);
}

// Function to dynamically scan for controller files and extract routes
function scanControllerFiles(): RouteInfo[] {
  const routes: RouteInfo[] = [];
  const srcPath = path.join(__dirname, '../src');

  function scanDirectory(dirPath: string) {
    if (!fs.existsSync(dirPath)) return;

    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip node_modules and other non-source directories
        if (item === 'node_modules' || item === '.git' || item.startsWith('.')) continue;

        scanDirectory(fullPath);
      } else if (item.endsWith('.controller.ts') || item.endsWith('.controller.js')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          const controllerRoutes = extractRoutesFromController(content, fullPath);
          routes.push(...controllerRoutes);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.warn(`Warning: Could not read controller file ${fullPath}:`, errorMessage);
        }
      }
    }
  }

  scanDirectory(srcPath);
  return routes;
}

// Extract routes from controller file content
function extractRoutesFromController(content: string, filePath: string): RouteInfo[] {
  const routes: RouteInfo[] = [];

  // Extract module and submodule from path
  const pathParts = filePath.split(path.sep);
  const srcIndex = pathParts.indexOf('src');
  if (srcIndex === -1) return routes;

  const relevantParts = pathParts.slice(srcIndex + 1);
  let module = 'unknown';
  let submodule = 'unknown';

  if (relevantParts.length > 0) {
    if (relevantParts[0] === 'main') {
      module = relevantParts[1] || 'unknown';
      submodule = relevantParts[3] || 'unknown';
    } else {
      module = relevantParts[0] || 'unknown';
      submodule = relevantParts[1] || 'unknown';
    }
  }

  const methodMap = {
    '@Get': 'GET',
    '@Post': 'POST',
    '@Put': 'PUT',
    '@Delete': 'DELETE',
    '@Patch': 'PATCH'
  };

  // Extract controller route prefix
  const controllerMatch = content.match(/@Controller\(["']([^"']+)["']\)/);
  const controllerPrefix = controllerMatch ? controllerMatch[1] : '';

  // Extract method names and their decorators
  const methodMatches = content.matchAll(/(@(?:Get|Post|Put|Delete|Patch)\(["']([^"']+)["']\))[\s\S]*?(?:async\s+)?(\w+)/g);

  for (const match of methodMatches) {
    const [fullMatch, decorator, routePath, methodName] = match;

    // Skip if any required values are undefined
    if (!decorator || !routePath || !methodName) continue;

    // Determine HTTP method
    const httpMethod = Object.entries(methodMap).find(([decoratorType]) =>
      decorator.includes(decoratorType)
    )?.[1] || 'GET';

    // Build full route
    const fullRoute = controllerPrefix ? `${controllerPrefix}${routePath}` : routePath;

    // Extract summary from comments or method name
    const methodStartIndex = content.indexOf(fullMatch);

    // Look for comments above the method
    const lines = content.substring(0, methodStartIndex).split('\n');
    let summary = methodName.replace(/([A-Z])/g, ' $1').trim();

    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      if (!line) continue;

      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*')) {
        summary = trimmedLine.replace(/^\/\/\s*/, '').replace(/^\/\*\s*/, '').replace(/\s*\*\/$/, '');
        break;
      }
      if (trimmedLine.includes('@ApiOperation') || trimmedLine.includes('@ApiEndpoint')) {
        // Extract summary from swagger decorators
        const summaryMatch = trimmedLine.match(/summary:\s*["']([^"']+)["']/);
        if (summaryMatch && summaryMatch[1]) {
          summary = summaryMatch[1];
          break;
        }
      }
    }

    const relativePath = path.relative(path.join(__dirname, '..'), filePath);

    routes.push({
      method: httpMethod,
      route: fullRoute,
      summary: summary || `No summary for ${methodName}`,
      operationId: methodName,
      tags: [module, submodule],
      module,
      submodule,
      location: relativePath,
      handler: methodName,
      description: summary,
      parameters: extractParametersFromRoute(fullRoute),
      status: 'Active',
      azureDevOpsUrl: generateAzureDevOpsUrl(relativePath, methodName),
      handlerUrl: generateUseCaseAzureDevOpsUrl(submodule, methodName),
    });
  }

  return routes;
}

async function generateRouteDocs() {
  try {
    // Get swagger definitions from all swagger files
    const swaggerDefinitions = getSwaggerDefinitions();

    // Scan for routes from controller files
    const controllerRoutes = scanControllerFiles();

    const routes: RouteInfo[] = [];

    // Process swagger definitions first
    Object.entries(swaggerDefinitions).forEach(([_name, definition]) => {
      const module = extractModuleFromTags(definition.tags);
      const submodule = definition.tags && definition.tags.length > 0
        ? extractSubmoduleFromTags(definition.tags)
        : extractSubmoduleFromRoute(definition.path);
      const handler = extractHandlerFromOperationId(definition.operationId);
      const location = findControllerFile(module, submodule);
      const method = determineHttpMethod(definition.path, definition.operationId);

      routes.push({
        method,
        route: definition.path,
        summary: definition.summary || 'No summary provided',
        operationId: definition.operationId,
        tags: definition.tags,
        module,
        submodule,
        location,
        handler,
        description: definition.description,
        parameters: definition.parameters || 'None',
        status: definition.status || 'Active',
        azureDevOpsUrl: generateAzureDevOpsUrl(location, handler),
        handlerUrl: generateUseCaseAzureDevOpsUrl(submodule, handler),
      });
    });

    // Add controller routes, avoiding duplicates
    controllerRoutes.forEach(controllerRoute => {
      const isDuplicate = routes.some(route =>
        route.route === controllerRoute.route &&
        route.method === controllerRoute.method
      );

      if (!isDuplicate) {
        routes.push(controllerRoute);
      }
    });

    // Also scan for any additional routes from swagger.json if it exists
    const swaggerJsonPath = path.join(__dirname, '../src/api-schema/generated/swagger.json');
    if (fs.existsSync(swaggerJsonPath)) {
      const swaggerContent = fs.readFileSync(swaggerJsonPath, 'utf8');
      const swaggerDoc: SwaggerDocument = JSON.parse(swaggerContent);

      Object.entries(swaggerDoc.paths).forEach(([path, methods]) => {
        Object.entries(methods).forEach(([method, details]) => {
          // Check if this route is already processed
          const existingRoute = routes.find(r => r.route === path && r.operationId === details.operationId);
          if (!existingRoute) {
            const module = extractModuleFromTags(details.tags);
            const submodule = details.tags && details.tags.length > 0
              ? extractSubmoduleFromTags(details.tags)
              : extractSubmoduleFromRoute(path);
            const handler = extractHandlerFromOperationId(details.operationId);
            const location = findControllerFile(module, submodule);

            routes.push({
              method: method.toUpperCase(),
              route: path,
              summary: details.summary || 'No summary provided',
              operationId: details.operationId,
              tags: details.tags,
              module,
              submodule,
              location,
              handler,
              description: details.description,
              parameters: extractParametersFromRoute(path),
              status: 'Active',
              azureDevOpsUrl: generateAzureDevOpsUrl(location, handler),
              handlerUrl: generateUseCaseAzureDevOpsUrl(submodule, handler),
            });
          }
        });
      });
    }

    // Sort routes by module, then by submodule, then by method, then by route
    routes.sort((a, b) => {
      if (a.module !== b.module) return a.module.localeCompare(b.module);
      if (a.submodule !== b.submodule) return a.submodule.localeCompare(b.submodule);
      if (a.method !== b.method) return a.method.localeCompare(b.method);
      return a.route.localeCompare(b.route);
    });

    // Create docs directory if it doesn't exist
    const docsPath = path.join(__dirname, '../src/api-schema/docs');
    if (!fs.existsSync(docsPath)) {
      fs.mkdirSync(docsPath, { recursive: true });
    }

    // Write routes.json
    const routesJsonPath = path.join(docsPath, 'routes.json');
    fs.writeFileSync(routesJsonPath, JSON.stringify(routes, null, 2), 'utf8');

    console.log(`✅ Route documentation generated: ${routesJsonPath}`);
    console.log(`📊 Total routes documented: ${routes.length}`);
    console.log(`📁 Routes from swagger files: ${Object.keys(swaggerDefinitions).length}`);
    console.log(`🔍 Routes from controller scanning: ${controllerRoutes.length}`);

    // Generate HTML dashboard
    generateHtmlDashboard(routes, docsPath);

  } catch (error) {
    console.error('Error generating route documentation:', error);
    process.exit(1);
  }
}

function generateHtmlDashboard(routes: RouteInfo[], docsPath: string) {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ARG API Routes Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        
        .stats {
            display: flex;
            justify-content: space-around;
            padding: 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
        }
        
        .stat {
            text-align: center;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #667eea;
        }
        
        .stat-label {
            color: #6c757d;
            font-size: 0.9rem;
        }
        
        .filters {
            padding: 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
        }
        
        .filter-group {
            display: flex;
            gap: 15px;
            align-items: center;
            flex-wrap: wrap;
        }
        
        .filter-group label {
            font-weight: 500;
            color: #495057;
        }
        
        .filter-group select, .filter-group input {
            padding: 8px 12px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-size: 14px;
        }
        
        .table-container {
            overflow-x: auto;
            border: 1px solid #e9ecef;
            border-radius: 4px;
            position: relative;
            max-width: 100%;
        }
        
        /* Top scrollbar */
        .top-scrollbar {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 12px;
            background: #f1f1f1;
            border-radius: 4px 4px 0 0;
            z-index: 5;
            overflow-x: auto;
            overflow-y: hidden;
        }
        
        /* Top scrollbar styling - same as bottom */
        .top-scrollbar::-webkit-scrollbar {
            height: 12px;
            width: 12px;
        }
        
        .top-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 6px;
        }
        
        .top-scrollbar::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 6px;
        }
        
        .top-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }
        
        /* Bottom scrollbar styling */
        .table-container::-webkit-scrollbar {
            height: 12px;
            width: 12px;
        }
        
        .table-container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 6px;
        }
        
        .table-container::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 6px;
        }
        
        .table-container::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }
        
        /* Scroll indicator */
        .scroll-indicator {
            position: absolute;
            bottom: 5px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            z-index: 10;
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .table-container:hover .scroll-indicator {
            opacity: 1;
        }
        
        /* Add padding to table to account for top scrollbar */
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
            margin-top: 12px;
            min-width: 1200px; /* Force horizontal scroll */
        }
        
        th {
            background-color: #f8f9fa;
            padding: 15px 12px;
            text-align: left;
            font-weight: 600;
            color: #495057;
            border-bottom: 2px solid #dee2e6;
            position: sticky;
            top: 0;
            z-index: 10;
        }
        
        td {
            padding: 12px;
            border-bottom: 1px solid #e9ecef;
            vertical-align: top;
        }
        
        tr:hover {
            background-color: #f8f9fa;
        }
        
        .method {
            font-weight: 600;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            text-transform: uppercase;
        }
        
        .method.get { background-color: #d4edda; color: #155724; }
        .method.post { background-color: #cce5ff; color: #004085; }
        .method.put { background-color: #fff3cd; color: #856404; }
        .method.delete { background-color: #f8d7da; color: #721c24; }
        .method.patch { background-color: #e2e3e5; color: #383d41; }
        
        .route {
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 13px;
            color: #495057;
            min-width: 150px;
        }
        
        .summary {
            max-width: 250px;
            line-height: 1.4;
            min-width: 200px;
        }
        
        .location {
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 12px;
            color: #6c757d;
            max-width: 350px;
            word-break: break-all;
            min-width: 300px;
        }
        
        .no-results {
            text-align: center;
            padding: 40px;
            color: #6c757d;
            font-style: italic;
        }
        
        .module-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 500;
            text-transform: uppercase;
        }
        
        .module-badge.account-payable { background-color: #e3f2fd; color: #1976d2; }
        
        .module-badge.global-states { background-color: #e8f5e8; color: #2e7d32; }
        .module-badge.ap-global-states { background-color: #fff3e0; color: #f57c00; }
        .module-badge.vendors { background-color: #f3e5f5; color: #7b1fa2; }
        .module-badge.voucher { background-color: #e8f5e8; color: #388e3c; }
        .module-badge.reports { background-color: #e1f5fe; color: #0277bd; }
        
        .status-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 500;
            text-transform: uppercase;
        }
        
        .status-badge.active { background-color: #e8f5e8; color: #2e7d32; }
        .status-badge.inactive { background-color: #ffebee; color: #c62828; }
        
        small {
            font-size: 11px;
            color: #6c757d;
            font-family: 'Monaco', 'Menlo', monospace;
        }
        
        /* Set minimum widths for other columns */
        th:nth-child(1), td:nth-child(1) { min-width: 80px; } /* Method */
        th:nth-child(2), td:nth-child(2) { min-width: 150px; } /* Route */
        th:nth-child(3), td:nth-child(3) { min-width: 200px; } /* Summary */
        th:nth-child(4), td:nth-child(4) { min-width: 120px; } /* Main Module */
        th:nth-child(5), td:nth-child(5) { min-width: 120px; } /* Submodule */
        th:nth-child(6), td:nth-child(6) { min-width: 120px; } /* Handler */
        th:nth-child(7), td:nth-child(7) { min-width: 150px; } /* Parameters */
        th:nth-child(8), td:nth-child(8) { min-width: 80px; } /* Status */
        th:nth-child(9), td:nth-child(9) { min-width: 300px; } /* File Location */
        @media (max-width: 768px) {
            .header h1 { font-size: 2rem; }
            .stats { flex-direction: column; gap: 15px; }
            .filter-group { flex-direction: column; align-items: stretch; }
            th, td { padding: 8px; }
        }
        
        /* Column Visibility Dropdown */
        .column-visibility-dropdown {
            position: relative;
            display: inline-block;
        }
        
        .column-visibility-btn {
            padding: 8px 12px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            background: white;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .column-visibility-btn:hover {
            background: #f8f9fa;
        }
        
        .column-visibility-menu {
            position: absolute;
            top: 100%;
            left: 0;
            background: white;
            border: 1px solid #ced4da;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            min-width: 200px;
            padding: 8px 0;
            display: none;
        }
        
        .column-visibility-menu.show {
            display: block;
        }
        
        .column-visibility-menu label {
            display: block;
            padding: 6px 12px;
            cursor: pointer;
            font-size: 14px;
            margin: 0;
        }
        
        .column-visibility-menu label:hover {
            background: #f8f9fa;
        }
        
        .column-visibility-menu input[type="checkbox"] {
            margin-right: 8px;
        }
        
        /* Hidden column styling */
        .column-hidden {
            display: none !important;
        }
        
        /* Clickable links styling */
        .clickable-link {
            color: #007bff;
            text-decoration: none;
            cursor: pointer;
            transition: color 0.2s;
        }
        
        .clickable-link:hover {
            color: #0056b3;
            text-decoration: underline;
        }
        
        .clickable-link:visited {
            color: #6f42c1;
        }
        
        .route-link {
            font-weight: 500;
            font-family: 'Monaco', 'Menlo', monospace;
        }
        
        .file-link {
            font-size: 12px;
            color: #6c757d;
        }
        
        .file-link:hover {
            color: #495057;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 ARG API Routes Dashboard</h1>
            <p>Complete overview of all API endpoints, their use cases, and implementation details</p>
            <div style="margin-top: 15px;">
                <a href="/api-docs" target="_blank" style="color: white; text-decoration: none; margin-right: 20px; padding: 8px 16px; border: 1px solid white; border-radius: 4px; background: rgba(255,255,255,0.1);">
                    📚 Swagger Docs
                </a>
            </div>
        </div>
        
        <div class="stats">
            <div class="stat">
                <div class="stat-number" id="total-routes">0</div>
                <div class="stat-label">Total Routes</div>
            </div>
            <div class="stat">
                <div class="stat-number" id="total-modules">0</div>
                <div class="stat-label">Modules</div>
            </div>
            <div class="stat">
                <div class="stat-number" id="total-methods">0</div>
                <div class="stat-label">HTTP Methods</div>
            </div>
        </div>
        
        <div class="filters">
            <div class="filter-group">
                <label for="module-filter">Main Module:</label>
                <select id="module-filter">
                    <option value="">All Main Modules</option>
                </select>
                
                <label for="submodule-filter">Submodule:</label>
                <select id="submodule-filter">
                    <option value="">All Submodules</option>
                </select>
                
                <label for="method-filter">Method:</label>
                <select id="method-filter">
                    <option value="">All Methods</option>
                </select>
                
                <label for="search-filter">Search:</label>
                <input type="text" id="search-filter" placeholder="Search routes, summaries, or handlers...">
                
                <div class="column-visibility-dropdown">
                    <button id="column-visibility-btn" class="column-visibility-btn">
                        📊 Column Visibility
                    </button>
                    <div id="column-visibility-menu" class="column-visibility-menu">
                        <label><input type="checkbox" data-column="0" checked> Method</label>
                        <label><input type="checkbox" data-column="1" checked> Route</label>
                        <label><input type="checkbox" data-column="2" checked> Summary</label>
                        <label><input type="checkbox" data-column="3" checked> Main Module</label>
                        <label><input type="checkbox" data-column="4" checked> Submodule</label>
                        <label><input type="checkbox" data-column="5" checked> Handler</label>
                        <label><input type="checkbox" data-column="6" checked> Parameters</label>
                        <label><input type="checkbox" data-column="7" checked> Status</label>
                        <label><input type="checkbox" data-column="8" checked> File Location</label>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="table-container">
            <div class="top-scrollbar" id="top-scrollbar"></div>
            <div class="scroll-indicator" id="scroll-indicator">Scroll horizontally to see more columns</div>
            <table id="routes-table">
                <thead>
                    <tr>
                        <th>Method</th>
                        <th>Route</th>
                        <th>Summary</th>
                        <th>Main Module</th>
                        <th>Submodule</th>
                        <th>Handler (Use Case)</th>
                        <th>Parameters</th>
                        <th>Status</th>
                        <th>File Location</th>
                    </tr>
                </thead>
                <tbody id="routes-tbody">
                </tbody>
            </table>
        </div>
    </div>

    <script>
        let allRoutes = ${JSON.stringify(routes)};
        let filteredRoutes = [...allRoutes];
        
        // Initialize stats
        function updateStats() {
            const modules = new Set(allRoutes.map(r => r.module));
            const methods = new Set(allRoutes.map(r => r.method));
            
            document.getElementById('total-routes').textContent = allRoutes.length;
            document.getElementById('total-modules').textContent = modules.size;
            document.getElementById('total-methods').textContent = methods.size;
        }
        
        // Populate filter options
        function populateFilters() {
            const modules = [...new Set(allRoutes.map(r => r.module))].sort();
            const submodules = [...new Set(allRoutes.map(r => r.submodule))].sort();
            const methods = [...new Set(allRoutes.map(r => r.method))].sort();
            
            const moduleFilter = document.getElementById('module-filter');
            const submoduleFilter = document.getElementById('submodule-filter');
            const methodFilter = document.getElementById('method-filter');
            
            modules.forEach(module => {
                const option = document.createElement('option');
                option.value = module;
                option.textContent = module.replace('-', ' ').replace(/\\b\\w/g, l => l.toUpperCase());
                moduleFilter.appendChild(option);
            });
            
            submodules.forEach(submodule => {
                const option = document.createElement('option');
                option.value = submodule;
                option.textContent = submodule.replace('-', ' ').replace(/\\b\\w/g, l => l.toUpperCase());
                submoduleFilter.appendChild(option);
            });
            
            methods.forEach(method => {
                const option = document.createElement('option');
                option.value = method;
                option.textContent = method;
                methodFilter.appendChild(option);
            });
        }
        
        // Render routes table
        function renderRoutes() {
            const tbody = document.getElementById('routes-tbody');
            tbody.innerHTML = '';
            
            if (filteredRoutes.length === 0) {
                tbody.innerHTML = '<tr><td colspan="9" class="no-results">No routes match the current filters</td></tr>';
                return;
            }
            
            filteredRoutes.forEach(route => {
                const row = document.createElement('tr');
                const routeUrl = route.azureDevOpsUrl || 'https://dev.azure.com/AmericanRefiningGroup/AmericanRefiningGroup/_git/arg-web-backend?path=/src/main&version=GBdev&_a=contents';
                row.innerHTML = \`
                    <td><span class="method \${route.method.toLowerCase()}">\${route.method}</span></td>
                    <td><a href="\${routeUrl}" target="_blank" class="clickable-link route-link">\${route.route}</a></td>
                    <td><div class="summary">\${route.summary}</div></td>
                    <td><span class="module-badge \${route.module}">\${route.module}</span></td>
                    <td><span class="module-badge \${route.submodule}">\${route.submodule}</span></td>
                    <td><a href="\${route.handlerUrl}" target="_blank" class="clickable-link handler-link"><code>\${route.handler}</code></a></td>
                    <td><small>\${route.parameters || 'None'}</small></td>
                    <td><span class="status-badge \${route.status?.toLowerCase()}">\${route.status || 'Active'}</span></td>
                    <td><a href="\${routeUrl}" target="_blank" class="clickable-link file-link">\${route.location}</a></td>
                \`;
                tbody.appendChild(row);
            });
        }
        
        // Apply filters
        function applyFilters() {
            const moduleFilter = document.getElementById('module-filter').value;
            const submoduleFilter = document.getElementById('submodule-filter').value;
            const methodFilter = document.getElementById('method-filter').value;
            const searchFilter = document.getElementById('search-filter').value.toLowerCase();
            
            filteredRoutes = allRoutes.filter(route => {
                const matchesModule = !moduleFilter || route.module === moduleFilter;
                const matchesSubmodule = !submoduleFilter || route.submodule === submoduleFilter;
                const matchesMethod = !methodFilter || route.method === methodFilter;
                const matchesSearch = !searchFilter || 
                    route.route.toLowerCase().includes(searchFilter) ||
                    route.summary.toLowerCase().includes(searchFilter) ||
                    route.handler.toLowerCase().includes(searchFilter) ||
                    route.operationId.toLowerCase().includes(searchFilter);
                
                return matchesModule && matchesSubmodule && matchesMethod && matchesSearch;
            });
            
            renderRoutes();
        }
        
        // Event listeners
        document.getElementById('module-filter').addEventListener('change', applyFilters);
        document.getElementById('submodule-filter').addEventListener('change', applyFilters);
        document.getElementById('method-filter').addEventListener('change', applyFilters);
        document.getElementById('search-filter').addEventListener('input', applyFilters);
        
        // Column visibility functionality
        const columnVisibilityBtn = document.getElementById('column-visibility-btn');
        const columnVisibilityMenu = document.getElementById('column-visibility-menu');
        const columnCheckboxes = document.querySelectorAll('.column-visibility-menu input[type="checkbox"]');
        
        // Toggle dropdown
        columnVisibilityBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            columnVisibilityMenu.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            columnVisibilityMenu.classList.remove('show');
        });
        
        // Prevent dropdown from closing when clicking inside
        columnVisibilityMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Handle column visibility changes
        columnCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const columnIndex = parseInt(checkbox.dataset.column);
                const isVisible = checkbox.checked;
                
                // Toggle column visibility
                const table = document.getElementById('routes-table');
                const headers = table.querySelectorAll('th');
                const cells = table.querySelectorAll('td:nth-child(' + (columnIndex + 1) + ')');
                
                if (isVisible) {
                    headers[columnIndex].classList.remove('column-hidden');
                    cells.forEach(cell => cell.classList.remove('column-hidden'));
                } else {
                    headers[columnIndex].classList.add('column-hidden');
                    cells.forEach(cell => cell.classList.add('column-hidden'));
                }
            });
        });
        
        // Scroll indicator functionality
        const tableContainer = document.querySelector('.table-container');
        const scrollIndicator = document.getElementById('scroll-indicator');
        
        if (tableContainer) {
            tableContainer.addEventListener('scroll', () => {
                const scrollLeft = tableContainer.scrollLeft;
                const maxScroll = tableContainer.scrollWidth - tableContainer.clientWidth;
                
                if (scrollLeft > 0) {
                    scrollIndicator.textContent = \`Scrolled \${Math.round((scrollLeft / maxScroll) * 100)}% horizontally\`;
                } else {
                    scrollIndicator.textContent = 'Scroll horizontally to see more columns';
                }
            });
            
            // Show scroll indicator on hover
            tableContainer.addEventListener('mouseenter', () => {
                scrollIndicator.style.opacity = '1';
            });
            
            tableContainer.addEventListener('mouseleave', () => {
                scrollIndicator.style.opacity = '0';
            });
        }
        
        // Initialize
        updateStats();
        populateFilters();
        renderRoutes();
        
        // Auto-refresh every 30 seconds
        setInterval(() => {
            fetch('routes.json')
                .then(response => response.json())
                .then(data => {
                    allRoutes = data;
                    filteredRoutes = [...allRoutes];
                    updateStats();
                    populateFilters();
                    applyFilters();
                })
                .catch(err => console.log('Auto-refresh failed:', err));
        }, 30000);
    </script>
</body>
</html>`;

  const dashboardPath = path.join(docsPath, 'dashboard.html');
  fs.writeFileSync(dashboardPath, htmlContent, 'utf8');

  console.log(`✅ HTML Dashboard generated: ${dashboardPath}`);
}

// Generate Azure DevOps URL for file location
function generateAzureDevOpsUrl(filePath: string, handler?: string): string {
  const baseUrl = 'https://dev.azure.com/AmericanRefiningGroup/AmericanRefiningGroup/_git/arg-web-backend';
  const fallbackUrl = 'https://dev.azure.com/AmericanRefiningGroup/AmericanRefiningGroup/_git/arg-web-backend?path=/src/main&version=GBdev&_a=contents';

  // Keep the src/ prefix as Azure DevOps expects the full path
  const cleanPath = filePath;

  // Check if file exists
  const fullPath = path.join(__dirname, '..', filePath);
  if (!fs.existsSync(fullPath)) {
    return fallbackUrl;
  }

  // If handler is provided, try to find line number
  if (handler) {
    const lineNumber = findHandlerLineNumber(filePath, handler);
    if (lineNumber > 1) {
      // Encode the path for URL - use the full path including src/
      const encodedPath = encodeURIComponent(cleanPath);
      return `${baseUrl}?path=/${encodedPath}&version=GBdev&_a=contents&line=${lineNumber}`;
    }
  }

  // Encode the path for URL - use the full path including src/
  const encodedPath = encodeURIComponent(cleanPath);
  return `${baseUrl}?path=/${encodedPath}&version=GBdev&_a=contents`;
}

// Find line number for handler method in controller file
function findHandlerLineNumber(filePath: string, handler: string): number {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    if (!fs.existsSync(fullPath)) {
      return 1; // Default to line 1 if file doesn't exist
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');

    // Look for the handler method
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue; // Skip undefined lines

      // Match method definition patterns
      if (line.includes(`async ${handler}(`) ||
        line.includes(`${handler}(`) ||
        line.includes(`@Get`) && line.includes(handler) ||
        line.includes(`@Post`) && line.includes(handler) ||
        line.includes(`@Delete`) && line.includes(handler) ||
        line.includes(`@Put`) && line.includes(handler)) {
        return i + 1; // Return 1-based line number
      }
    }

    return 1; // Default to line 1 if not found
  } catch (error) {
    console.error(`Error finding line number for ${handler} in ${filePath}:`, error);
    return 1;
  }
}

// Run the script
generateRouteDocs(); 