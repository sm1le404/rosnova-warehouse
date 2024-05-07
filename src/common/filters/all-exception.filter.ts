import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';
import { TypeORMError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: AbstractHttpAdapter,
    private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    this.logger.error(exception);

    const httpAdapter = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exMessage: any =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: String(exception) };

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: `Произошла внутреняя ошибка сервера, повторите попытку позднее`,
      expMessage:
        typeof exMessage === 'string' ? exMessage : exMessage?.message,
    };

    if (exception instanceof TypeORMError) {
      responseBody.expMessage =
        'Произошла ошибка базы данных, повторите попытку позднее';
    }

    if (httpStatus === 403) {
      responseBody.expMessage = 'Отказано в доступе';
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
