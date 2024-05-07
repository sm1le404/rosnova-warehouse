import { swagger } from './common/docs/swagger';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
// eslint-disable-next-line import/no-extraneous-dependencies
import { json, urlencoded } from 'express';
import * as fs from 'fs';
import path from 'path';
// eslint-disable-next-line max-len
import { NestApplicationOptions } from '@nestjs/common/interfaces/nest-application-options.interface';
import {
  I18nValidationException,
  I18nValidationExceptionFilter,
  I18nValidationPipe,
} from 'nestjs-i18n';
import { ArgumentsHost } from '@nestjs/common';

async function bootstrap() {
  let appParams: NestApplicationOptions = {
    rawBody: true,
  };

  const keyExist = fs.existsSync(path.join(__dirname, 'assets', 'key.pem'));
  const certExist = fs.existsSync(path.join(__dirname, 'assets', 'cert.pem'));

  if (certExist && keyExist && !!+process.env.HTTPS) {
    appParams = {
      ...appParams,
      httpsOptions: {
        key: fs.readFileSync(path.join(__dirname, 'assets', 'key.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'assets', 'cert.pem')),
        passphrase: 'ROSNOVA',
      },
    };
  }

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    appParams,
  );

  let corsList = ['http://localhost:3000'];
  if (process.env.CLIENT_PORT) {
    let clientPath = 'http://localhost:';
    if (process.env.CLIENT_PATH) {
      clientPath = `${process.env.CLIENT_PATH}:`;
    }
    clientPath = `${clientPath}${process.env.CLIENT_PORT}`;
    corsList.push(clientPath);
  }

  if (process.env.ADD_CORS) {
    const corsAdd = process.env.ADD_CORS.toString().split(',');
    if (Array.isArray(corsAdd)) {
      corsList = [...corsList, ...corsAdd];
    }
  }

  app.enableCors({
    origin: corsList,
    credentials: true,
  });
  app.use(cookieParser());

  const winstonLogger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(winstonLogger);

  app.setGlobalPrefix('api');
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.useGlobalPipes(new I18nValidationPipe({ transform: true }));

  const adapterHost = app.get(HttpAdapterHost);
  const { httpAdapter } = adapterHost;
  app.useGlobalFilters(
    new AllExceptionsFilter(httpAdapter, winstonLogger),
    new I18nValidationExceptionFilter({
      responseBodyFormatter: (
        host: ArgumentsHost,
        exc: I18nValidationException,
        formattedErrors: object,
      ) => ({
        statusCode: exc.getStatus(),
        timestamp: new Date().toISOString(),
        path: host.switchToHttp().getRequest().originalUrl,
        message: `Произошла внутреняя ошибка сервера, повторите попытку позднее`,
        expMessage: formattedErrors,
      }),
    }),
  );

  swagger(app);

  app.enable('trust proxy');
  app.enableShutdownHooks();

  await app.listen(process.env.APP_PORT ?? 3000, '0.0.0.0');
}

bootstrap();
