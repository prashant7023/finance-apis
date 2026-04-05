import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const httpLogger = new Logger('HTTP');
  const host = config.get<string>('HOST') ?? '0.0.0.0';
  const port = config.get<number>('PORT') ?? 3000;
  const corsOrigin = config.get<string>('CORS_ORIGIN') ?? '*';

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin:
      corsOrigin === '*'
        ? true
        : corsOrigin
            .split(',')
            .map((origin) => origin.trim())
            .filter((origin) => origin.length > 0),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new ResponseTransformInterceptor(),
  );

  app.use((req: Request, res: Response, next: NextFunction) => {
    const startedAt = Date.now();

    res.on('finish', () => {
      const durationMs = Date.now() - startedAt;
      httpLogger.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`);
    });

    next();
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Finance Dashboard API')
    .setDescription('Finance Data Processing & Access Control Backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port, host);
}

bootstrap();
