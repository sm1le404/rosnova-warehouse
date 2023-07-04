import { swagger } from './common/docs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    cors: true,
  });

  const winstonLogger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(winstonLogger);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const adapterHost = app.get(HttpAdapterHost);
  const { httpAdapter } = adapterHost;
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter, winstonLogger));

  swagger(app);

  app.enableShutdownHooks();

  await app.listen(process.env.APP_PORT ?? 3000);
}

bootstrap();
