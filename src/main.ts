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
  });

  const corsList = ['http://localhost:3000'];
  if (process.env.CLIENT_PORT) {
    let clientPath = 'http://localhost:';
    if (process.env.CLIENT_PATH) {
      clientPath = `${process.env.CLIENT_PATH}:`;
    }
    clientPath = `${clientPath}${process.env.CLIENT_PORT}`;
    corsList.push(clientPath);
  }

  app.enableCors({
    origin: corsList,
    credentials: true,
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
