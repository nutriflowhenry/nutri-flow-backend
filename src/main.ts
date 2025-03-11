import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RawBody, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
    methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  });

  await app.listen(3001);
}

bootstrap();
