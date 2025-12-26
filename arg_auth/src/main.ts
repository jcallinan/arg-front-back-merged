import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import {
  ValidationPipe,
  VersioningType,
  BadRequestException,
} from "@nestjs/common";
import cookieParser from 'cookie-parser';
import type { ValidationError } from "class-validator";
import { GlobalHttpExceptionFilter } from "./shared/utils/http-exception.filter";
import { ERROR_CONSTANTS } from "./shared/constants/error-constants";
import { errorResponse } from "./shared/utils/response-formatter";
import { buildValidationDetails } from "./shared/utils/validation-error.helper";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });

  app.enableCors({
    origin: [
      "http://172.16.30.12:5176",
      "https://172.16.30.12:5176",
      "http://172.16.30.12:5443",
      "https://172.16.30.12:5443",

      "https://qa-web-damco.amref.com:5176",
      "http://qa-web-damco.amref.com:5176",
      "https://qa-app-damco.amref.com:5443",
      "http://qa-app-damco.amref.com:5443",
      "https://qa-auth-damco.amref.com:8000",
      "http://qa-auth-damco.amref.com:8000",


      "https://dev-web-damco.amref.com",
      "http://dev-web-damco.amref.com",
      "https://dev-app-damco.amref.com",
      "http://dev-app-damco.amref.com",
      "https://dev-auth-damco.amref.com",
      "http://dev-auth-damco.amref.com",
      "https://dev-app-damco.amref.com:5442",
      "http://dev-app-damco.amref.com:5442",
      "https://dev-auth-damco.amref.com:8005",
      "http://dev-auth-damco.amref.com:8005",

      "http://23.245.35.126:5443",
      "http://23.245.35.126:5443",
      "http://23.245.35.126:5176",
      "http://23.245.35.126:5176",
      "http://23.245.35.126:8000",
      "http://23.245.35.126:8000",

      "http://172.16.30.12:5173",
      "https://172.16.30.12:5173",
      "http://172.16.30.12:5175",
      "https://172.16.30.12:5175",
      "http://172.16.30.12:5174",
      "http://172.16.30.12:5001",
      "http://172.16.30.12:5003",
      "https://172.16.30.12:5001",
      "https://172.16.30.12:5003",
      "http://172.16.30.10:5173",
      "http://172.16.30.10:5174",
      "http://localhost:5173",
      "http://localhost:3001",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://192.168.0.16:3001",
      "http://172.16.30.10:3000",
      "http://172.16.30.10:3001",
      "http://172.16.30.10:5002",
      "http://172.16.30.10:5003",
      "http://172.16.30.10:5001",
      "https://dev-damco.amref.com:5173",
      "http://dev-damco.amref.com:5173",
      "https://dev-damco.amref.com:5174",
      "http://dev-damco.amref.com:5174",
      "http://dev-damco.amref.com:5001",
      "https://dev-damco.amref.com:5001",
      "http://dev-damco.amref.com:5001",
      "https://dev-damco.amref.com:5003",
      "http://dev-damco.amref.com:5003",
      "http://test-damco.amref.com:5174",
      "https://test-damco.amref.com:5174",
      "http://dev-damco.amref.com",
      "https://dev-damco.amref.com",
      "http://172.16.30.12",
      "https://172.16.30.12",
      "https://qa-damco.amref.com",
      "http://qa-damco.amref.com",
      "https://qa-damco.amref.com:5002",
      "http://qa-damco.amref.com:5002",
      "https://qa-damco.amref.com:5175",
      "http://qa-damco.amref.com:5175",
      "http://dev-backend.qa-damco.amref.com",
      "https://dev-backend.qa-damco.amref.com",
      "https://qa-app-damco.amref.com",
      "http://qa-app-damco.amref.com",
      "https://qa-web-damco.amref.com",
      "http://qa-web-damco.amref.com",
      "https://qa-auth-damco.amref.com",
      "http://qa-auth-damco.amref.com",
      "http://localhost:8000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
      "X-API-KEY",
    ],
    credentials: true, // ✅ no need to set this at all
  });

  //Cookie Parser
  app.use(cookieParser())

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle("API Documentation")
    .setDescription("This is the API documentation for our application.")
    .setVersion("1.0")
    .addBearerAuth()
    .addServer(`http://172.16.30.10:${process.env.PORT ?? 8000}`)
    .addServer(`http://172.16.30.12:${process.env.PORT ?? 8000}`)
    .addServer(`http://localhost:${process.env.PORT ?? 8000}`)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Add custom link to ARG API Routes Dashboard
  if (document.info) {
    document.info.description = `
      - [🚀 ARG API Routes Dashboard](http://172.16.30.10:8000/v1/app-dashboard)
    `;
  }

  app
    .getHttpAdapter()
    .get("/api-json", (_: any, res: { json: (arg0: any) => void }) => {
      res.json(document);
    });

  SwaggerModule.setup("api-docs", app, document);

  // Add Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new BadRequestException(
          errorResponse(
            ERROR_CONSTANTS.VALIDATION_ERROR,
            buildValidationDetails(errors)
          )
        );
      },
    })
  );

  if (process.env.APP_MODE === "upload-worker") {
    console.log(`Running in WORKER mode`);
    await app.init();
  } else {
    console.log(`Starting HTTP server on port ${process.env.PORT ?? 8000}`);
    app.useGlobalFilters(new GlobalHttpExceptionFilter());
    await app.listen(process.env.PORT ?? 8000);
  }
}

bootstrap();
