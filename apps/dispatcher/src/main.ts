import { NestFactory } from '@nestjs/core';
import { DispatcherModule } from './dispatcher.module';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(DispatcherModule);

  app.useLogger(app.get(Logger));

  const config = new DocumentBuilder()
    .setTitle('Queuetie Service')
    .setDescription('Dispatches jobs for Queuetie simulations')
    .setVersion('1.0')
    .addTag('Dispatcher', 'Everything related to dispatching jobs')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (_, methodKey: string) => methodKey,
  };

  const custom: SwaggerCustomOptions = {
    jsonDocumentUrl: '/openapi.json',
    yamlDocumentUrl: '/openapi.yaml',
  };

  const documentFactory = () => SwaggerModule.createDocument(app, config, options);

  SwaggerModule.setup('/', app, documentFactory, custom);

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
