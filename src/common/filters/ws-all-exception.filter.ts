import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { ArgumentsHost, Catch, Inject, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Catch()
export class WSAllExceptionFilter extends BaseWsExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    protected readonly logger: Logger,
  ) {
    super();
  }

  catch(exception: string | object, host: ArgumentsHost) {
    this.logger.error(exception);

    host.switchToWs().getClient().emit('exception', exception);
  }
}
