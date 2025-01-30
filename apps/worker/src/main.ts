import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(WorkerModule);
  app.useLogger(app.get(Logger));
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
