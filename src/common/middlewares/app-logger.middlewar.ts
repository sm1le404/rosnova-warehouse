import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppLoggerMiddlewar implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, body } = request;
    const userAgent = request.get('user-agent') || '';

    const { statusCode } = response;

    this.logger.log(
      `${method} ${request.originalUrl} ${statusCode} ${JSON.stringify(
        body,
      )} - ${userAgent} ${ip} `,
    );

    if (request.originalUrl === '/api/auth/refresh') {
      this.logger.error(
        JSON.stringify({
          refreshCheck: true,
          path: request?.originalUrl,
          headers: request?.headers,
          cookie: request?.cookies,
        }),
      );
    }
    next();
  }
}
