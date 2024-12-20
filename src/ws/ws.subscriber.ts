import { Inject, Injectable, LoggerService } from '@nestjs/common';
import {
  BaseEntity,
  DataSource,
  EntitySubscriberInterface,
  InsertEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { WsStateGateway } from './ws-state.gateway';
import { EventType } from '../event/enums';

@Injectable()
export class WsSubscriber implements EntitySubscriberInterface<BaseEntity> {
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
    return BaseEntity;
  }

  afterInsert({ entity, metadata }: InsertEvent<BaseEntity>) {
    try {
      this.wsStateGateway.emitUpdateStatusToRoom(
        metadata.targetName,
        EventType.CREATE,
        Object.assign({}, entity),
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  async afterUpdate({
    entity,
    databaseEntity,
    metadata,
  }: UpdateEvent<BaseEntity>) {
    try {
      this.wsStateGateway.emitUpdateStatusToRoom(
        metadata.targetName,
        EventType.UPDATE,
        Object.assign({}, databaseEntity ?? {}, entity) as BaseEntity,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  afterSoftRemove({
    entity,
    databaseEntity,
    metadata,
  }: SoftRemoveEvent<BaseEntity>) {
    try {
      this.wsStateGateway.emitUpdateStatusToRoom(
        metadata.targetName,
        EventType.DELETE,
        Object.assign({}, databaseEntity ?? {}, entity) as BaseEntity,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }
}
