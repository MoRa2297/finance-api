import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    // Enable CORS
    // app.enableCors({
    //    origin: [
    //        'http://localhost:3001',  // Next.js dev
    //        'http://localhost:8081',  // Expo dev
    //        // Aggiungi domini produzione dopo
    //    ],
    //    credentials: true,
    // });

  // Enable global validation
  app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
  );




  // Swagger configuration
  const config = new DocumentBuilder()
      .setTitle('Finance API')
      .setDescription('Personal Finance API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
