import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { DataSource, EntitySubscriberInterface, UpdateEvent } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Operation } from '../entities/operation.entity';
import { EventType } from '../../event/enums';
import { WsStateGateway } from '../../ws/ws-state.gateway';

@Injectable()
export class OperationSubscriber
  implements EntitySubscriberInterface<Operation>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly wsStateGateway: WsStateGateway,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    protected readonly logger: LoggerService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Operation;
  }

  async afterUpdate({ entity, databaseEntity }: UpdateEvent<Operation>) {
    try {
      const newEntity = Object.assign(
        {},
        databaseEntity ?? {},
        entity,
      ) as Operation;

      this.wsStateGateway.emitUpdateStatusToRoom(
        'operation',
        EventType.UPDATE,
        newEntity,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }
}
