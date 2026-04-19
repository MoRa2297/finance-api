import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter, ResponseInterceptor } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') ?? 3000;
  const nodeEnv = configService.get<string>('app.nodeEnv');
  const isProduction = nodeEnv === 'production';

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger — development only
  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle('Finance API')
      .setDescription('Personal Finance API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  // 0.0.0.0 is required on Railway/containers to accept external connections
  await app.listen(port, '0.0.0.0');

  if (isProduction) {
    logger.log(`🚀 Server running on port ${port}`);
  } else {
    logger.log(`🚀 Server running on http://localhost:${port}`);
    logger.log(`📖 Docs available at http://localhost:${port}/api/docs`);
  }
}

void bootstrap();
