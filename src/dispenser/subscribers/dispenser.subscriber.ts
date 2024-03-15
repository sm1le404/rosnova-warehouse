import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { DataSource, EntitySubscriberInterface, UpdateEvent } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Dispenser } from '../entities/dispenser.entity';
import { EventType } from '../../event/enums';
import { WsStateGateway } from '../../ws/ws-state.gateway';

@Injectable()
export class DispenserSubscriber
  implements EntitySubscriberInterface<Dispenser>
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
    return Dispenser;
  }

  async afterUpdate({ entity, databaseEntity }: UpdateEvent<Dispenser>) {
    try {
      const newEntity = Object.assign(
        {},
        databaseEntity ?? {},
        entity,
      ) as Dispenser;

      this.wsStateGateway.emitUpdateStatusToRoom(
        'dispenser',
        EventType.UPDATE,
        newEntity,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }
}
