import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { DataSource, EntitySubscriberInterface, UpdateEvent } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CompressionTypes, ProducerRecord } from 'kafkajs';
import { HubTopics, DriverDataDto } from 'rs-dto';
import { KafkaService } from '../services';
import { ConfigService } from '@nestjs/config';
import { SoftRemoveEvent } from 'typeorm/subscriber/event/SoftRemoveEvent';
import { InsertEvent } from 'typeorm/subscriber/event/InsertEvent';
import { Driver } from '../../driver/entities/driver.entity';

@Injectable()
export class KafkaDriverSubscriber
  implements EntitySubscriberInterface<Driver>
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
    return Driver;
  }

  async afterInsert(event: InsertEvent<Driver>) {
    await this.afterInsertUpd(event);
  }

  async afterUpdate(event: UpdateEvent<Driver>) {
    await this.afterInsertUpd(event);
  }

  async afterInsertUpd(event: UpdateEvent<Driver> | InsertEvent<Driver>) {
    try {
      let kafkaPayload: ProducerRecord = {
        compression: CompressionTypes.GZIP,
        messages: [],
        topic: HubTopics.DRIVER_REF_INSERT,
      };
      const driverDataDto: Partial<DriverDataDto> = {
        ...event.entity,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(driverDataDto),
      });
      await this.kafkaService.addMessage(kafkaPayload);
    } catch (e) {
      this.logger.error(e);
    }
  }

  async afterSoftRemove(event: SoftRemoveEvent<Driver>) {
    try {
      let kafkaPayload: ProducerRecord = {
        compression: CompressionTypes.GZIP,
        messages: [],
        topic: HubTopics.DRIVER_REF_DELETE,
      };
      const driverDataDto: Partial<DriverDataDto> = {
        id: event.entity.id,
        fullName: event.entity.fullName,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(driverDataDto),
      });
      await this.kafkaService.addMessage(kafkaPayload);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
