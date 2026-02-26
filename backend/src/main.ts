import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { LogsBuffer } from './admin/logs.buffer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    // Allow SSE
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  });

  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);

  const logs = app.get(LogsBuffer);
  logs.success(`[SYSTEM] SecureBlog API started on :${port}`, { port });
  logs.info('[SYSTEM] JWT auth · BullMQ · Prisma · Rate limiting ready');

  console.log(`Application is running on: http://localhost:${port}/api`);
}

bootstrap();

