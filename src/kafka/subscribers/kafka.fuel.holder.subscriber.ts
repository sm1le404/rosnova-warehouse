import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { DataSource, EntitySubscriberInterface, UpdateEvent } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CompressionTypes, ProducerRecord } from 'kafkajs';
import { HubTopics, FuelHolderDataDto } from 'rs-dto';
import { KafkaService } from '../services';
import { ConfigService } from '@nestjs/config';
import { SoftRemoveEvent } from 'typeorm/subscriber/event/SoftRemoveEvent';
import { InsertEvent } from 'typeorm/subscriber/event/InsertEvent';
import { FuelHolder } from '../../fuel-holder/entities/fuel-holder.entity';

@Injectable()
export class KafkaFuelHolderSubscriber
  implements EntitySubscriberInterface<FuelHolder>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly kafkaService: KafkaService,
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    protected readonly logger: LoggerService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return FuelHolder;
  }

  async afterInsert(event: InsertEvent<FuelHolder>) {
    await this.afterInsertUpd(event);
  }

  async afterUpdate(event: UpdateEvent<FuelHolder>) {
    await this.afterInsertUpd(event);
  }

  async afterInsertUpd(
    event: UpdateEvent<FuelHolder> | InsertEvent<FuelHolder>,
  ) {
    try {
      let kafkaPayload: ProducerRecord = {
        compression: CompressionTypes.GZIP,
        messages: [],
        topic: HubTopics.FUEL_HOLDER_REF_INSERT,
      };
      const fuelHolderDataDto: Partial<FuelHolderDataDto> = {
        ...event.entity,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(fuelHolderDataDto),
      });
      await this.kafkaService.addMessage(kafkaPayload);
    } catch (e) {
      this.logger.error(e);
    }
  }

  async afterSoftRemove(event: SoftRemoveEvent<FuelHolder>) {
    try {
      let kafkaPayload: ProducerRecord = {
        compression: CompressionTypes.GZIP,
        messages: [],
        topic: HubTopics.FUEL_HOLDER_REF_DELETE,
      };
      const fuelHolderDataDto: Partial<FuelHolderDataDto> = {
        id: event.entity.id,
        shortName: event.entity.shortName,
        inn: event.entity.inn,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(fuelHolderDataDto),
      });
      await this.kafkaService.addMessage(kafkaPayload);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
