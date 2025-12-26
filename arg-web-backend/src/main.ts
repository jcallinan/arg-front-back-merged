import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { SwaggerModule } from "@nestjs/swagger";
import {
  ValidationPipe,
  VersioningType,
  BadRequestException,
} from "@nestjs/common";
import type { ValidationError } from "class-validator";
import { GlobalHttpExceptionFilter } from "./shared/utils/http-exception.filter";
import { ERROR_CONSTANTS } from "./shared/constants/error-constants";
import { errorResponse } from "./shared/utils/response-formatter";
import { buildValidationDetails } from "./shared/utils/validation-error.helper";
import { corsConfig } from "./shared/config/cors.config";
import { createSwaggerConfig, getSwaggerDocumentInfo } from "./shared/config/swagger.config";
import { AuthGuard } from "@src/auth/application/guards/auth.guard";
import { UserContextInterceptor } from "./shared/interceptors/user-context.interceptor";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });

  app.enableCors(corsConfig);
  
  // Enable cookie parser
  app.use(cookieParser());

  // Swagger Configuration
  const config = createSwaggerConfig();
  const document = SwaggerModule.createDocument(app, config);

  // Add custom link to ARG API Routes Dashboard
  if (document.info) {
    document.info.description = getSwaggerDocumentInfo().description;
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
    console.log(`Starting HTTP server on port ${process.env.PORT ?? 5001}`);
    console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);
    app.useGlobalFilters(new GlobalHttpExceptionFilter());
    app.useGlobalGuards(app.get(AuthGuard));
    app.useGlobalInterceptors(new UserContextInterceptor());
    await app.listen(process.env.PORT ?? 5001);
  }
}

bootstrap();
