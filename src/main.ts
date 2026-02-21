import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter, ResponseInterceptor } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') ?? 3000;
  const nodeEnv = configService.get<string>('app.nodeEnv');
  const corsOrigins = configService.get<string>('app.corsOrigins');

  // CORS
  app.enableCors({
    origin:
      nodeEnv === 'production'
        ? corsOrigins?.split(',').map((o) => o.trim())
        : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

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
  if (nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Finance API')
      .setDescription('Personal Finance API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(port);
  console.log(`🚀 Server running on port ${port}`);

  if (nodeEnv !== 'production') {
    console.log(`📖 Docs available at http://localhost:${port}/api/docs`);
    console.log(`🔮 GraphQL Playground at http://localhost:${port}/graphql`);
  }
}

bootstrap();
