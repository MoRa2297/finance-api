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

    // Swagger — solo in development
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
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📖 Docs available at http://localhost:${port}/api/docs`);
}

bootstrap();
