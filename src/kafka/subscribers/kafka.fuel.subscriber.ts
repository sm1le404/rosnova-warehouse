import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { DataSource, EntitySubscriberInterface, UpdateEvent } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CompressionTypes, ProducerRecord } from 'kafkajs';
import { HubTopics, FuelDataDto } from 'rs-dto';
import { KafkaService } from '../services';
import { ConfigService } from '@nestjs/config';
import { SoftRemoveEvent } from 'typeorm/subscriber/event/SoftRemoveEvent';
import { InsertEvent } from 'typeorm/subscriber/event/InsertEvent';
import { Fuel } from '../../fuel/entities/fuel.entity';

@Injectable()
export class KafkaFuelSubscriber implements EntitySubscriberInterface<Fuel> {
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
    return Fuel;
  }

  async afterInsert(event: InsertEvent<Fuel>) {
    await this.afterInsertUpd(event);
  }

  async afterUpdate(event: UpdateEvent<Fuel>) {
    await this.afterInsertUpd(event);
  }

  async afterInsertUpd(event: UpdateEvent<Fuel> | InsertEvent<Fuel>) {
    try {
      let kafkaPayload: ProducerRecord = {
        compression: CompressionTypes.GZIP,
        messages: [],
        topic: HubTopics.FUEL_REF_INSERT,
      };
      const fuelDataDto: Partial<FuelDataDto> = {
        ...event.entity,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(fuelDataDto),
      });
      await this.kafkaService.addMessage(kafkaPayload);
    } catch (e) {
      this.logger.error(e);
    }
  }

  async afterSoftRemove(event: SoftRemoveEvent<Fuel>) {
    try {
      let kafkaPayload: ProducerRecord = {
        compression: CompressionTypes.GZIP,
        messages: [],
        topic: HubTopics.FUEL_REF_DELETE,
      };
      const fuelDataDto: Partial<FuelDataDto> = {
        id: event.entity.id,
        name: event.entity.name,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(fuelDataDto),
      });
      await this.kafkaService.addMessage(kafkaPayload);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
