import { generateApi } from 'swagger-typescript-api';
import * as path from 'path';

generateApi({
  fileName: 'api.ts',
  output: path.join(__dirname, '../src/api-schema/generated'),
  input: path.join(__dirname, '../src/api-schema/generated/swagger.json'),
  httpClientType: 'fetch',
  generateClient: true,
  generateRouteTypes: true,
  generateResponses: true,
  toJS: false,
  extractRequestParams: true,
  extractRequestBody: true,
})
  .then(() => {
    console.log('API types generated successfully!');
  })
  .catch((e) => console.error(e)); 