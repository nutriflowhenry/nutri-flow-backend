import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
  });

  await app.listen(3000);
}

bootstrap();
