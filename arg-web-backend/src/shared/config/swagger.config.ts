import { DocumentBuilder } from "@nestjs/swagger";
 
export const createSwaggerConfig = () => {
  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT ?? 5001;
  // For UAT and production, don't include port in URL
  const protocol = process.env.FILE_PROTOCOL ?? 'https';
  const serverUrl =  `${protocol}://${host}:${process.env.FILE_EXTERNAL_PORT || port}`;
 
  return new DocumentBuilder()
    .setTitle("API Documentation")
    .setDescription("This is the API documentation for our application.")
    .setVersion("1.0")
    .addBearerAuth()
    .addServer(serverUrl)
    .build();
};
 
export const getSwaggerDocumentInfo = () => {
  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT ?? 5001;
  const environment = process.env.NODE_ENV ?? 'dev';
 
  // For UAT and production, don't include port in URL
  const isProductionOrUAT = environment === 'prod' || environment === 'uat';
  const protocol = isProductionOrUAT ? 'https' : 'http';
  const dashboardUrl = isProductionOrUAT
    ? `${protocol}://${host}/api-docs`
    : `${protocol}://${host}:${port}/api-docs`;
 
  return {
    description: `
      - [🚀 ARG API Routes Dashboard](${dashboardUrl})
    `,
  };
};
 
 