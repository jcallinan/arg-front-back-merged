import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import * as fs from 'fs';
import * as path from 'path';

async function generateSwaggerJson() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn'], // Reduce noise during generation
    });

    const config = new DocumentBuilder()
      .setTitle('ARG API')
      .setDescription('The ARG API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    
    // Create api-schema/generated directory if it doesn't exist
    const outputPath = path.join(__dirname, '../src/api-schema/generated');
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    // Write the swagger.json file
    fs.writeFileSync(
      path.join(outputPath, 'swagger.json'),
      JSON.stringify(document, null, 2),
      { encoding: 'utf8' }
    );

    console.log('Swagger JSON file has been generated successfully!');
    await app.close();
  } catch (error) {
    console.error('Error generating Swagger JSON:', error);
    process.exit(1);
  }
}

generateSwaggerJson(); 