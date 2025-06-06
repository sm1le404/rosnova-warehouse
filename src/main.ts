import { swagger } from './common/docs/swagger';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { ExpressAdapter } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
// eslint-disable-next-line import/no-extraneous-dependencies
import { json, urlencoded } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import express from 'express';
import * as fs from 'fs';
import path from 'path';
import {
  I18nValidationException,
  I18nValidationExceptionFilter,
  I18nValidationPipe,
} from 'nestjs-i18n';
import { ArgumentsHost } from '@nestjs/common';
import { clearDir } from './clearUpdate';
import * as https from 'https';
import * as http from 'http';
import { SocketIoAdapter } from './ws/socket.io.adapter';
import { ShutdownObserver } from './common/services/shutdown.observer';
import { SocketObserver } from './ws/socket.observer';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    rawBody: true,
  });

  app.enableCors({
    origin: true,
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
  app.enableShutdownHooks();

  await app.init();

  const keyExist = fs.existsSync(path.join(__dirname, 'assets', 'key.pem'));
  const certExist = fs.existsSync(path.join(__dirname, 'assets', 'cert.pem'));

  const shutdownObserver = app.get(ShutdownObserver);
  const socketObserver = app.get(SocketObserver);

  if (certExist && keyExist && !!+process.env.HTTPS) {
    const httpsServer = https.createServer(
      {
        key: fs.readFileSync(path.join(__dirname, 'assets', 'key.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'assets', 'cert.pem')),
        passphrase: 'ROSNOVA',
      },
      server,
    );

    const httpsSocket = new SocketIoAdapter(httpsServer);
    socketObserver.addSocket(httpsSocket);
    app.useWebSocketAdapter(httpsSocket);

    httpsServer.listen(
      process.env?.HTTPS_PORT ? parseInt(process.env.HTTPS_PORT) : 443,
      '0.0.0.0',
    );

    shutdownObserver.addHttpServer(httpsServer);
  }

  const httpServer = http.createServer(server);

  httpServer.listen(
    process.env?.APP_PORT ? parseInt(process.env.APP_PORT) : 3000,
    '0.0.0.0',
  );
  const httpSocket = new SocketIoAdapter(httpServer);
  socketObserver.addSocket(httpSocket);
  app.useWebSocketAdapter(httpSocket);

  shutdownObserver.addHttpServer(httpServer);
}

bootstrap();

//Необходимо для очистки сразу после обновления
if (process.env?.CLEAR_UPDATE_DIR && process.env.CLEAR_UPDATE_DIR === 'Y') {
  clearDir(process.env.ROOT);
}
