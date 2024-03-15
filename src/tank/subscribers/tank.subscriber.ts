import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { DataSource, EntitySubscriberInterface, UpdateEvent } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Tank } from '../entities/tank.entity';
import { EventType } from '../../event/enums';
import { WsStateGateway } from '../../ws/ws-state.gateway';

@Injectable()
export class TankSubscriber implements EntitySubscriberInterface<Tank> {
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
    return Tank;
  }

  async afterUpdate({ entity, databaseEntity }: UpdateEvent<Tank>) {
    try {
      const newEntity = Object.assign({}, databaseEntity ?? {}, entity) as Tank;

      this.wsStateGateway.emitUpdateStatusToRoom(
        'tank',
        EventType.UPDATE,
        newEntity,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }
}
