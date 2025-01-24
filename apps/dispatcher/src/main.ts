import { NestFactory } from '@nestjs/core';
import { DispatcherModule } from './dispatcher.module';

async function bootstrap() {
  const app = await NestFactory.create(DispatcherModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
