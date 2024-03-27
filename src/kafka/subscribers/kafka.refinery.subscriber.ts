import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { DataSource, EntitySubscriberInterface, UpdateEvent } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CompressionTypes, ProducerRecord } from 'kafkajs';
import { HubTopics, RefineryDataDto } from 'rs-dto';
import { KafkaService } from '../services';
import { ConfigService } from '@nestjs/config';
import { SoftRemoveEvent } from 'typeorm/subscriber/event/SoftRemoveEvent';
import { InsertEvent } from 'typeorm/subscriber/event/InsertEvent';
import { Refinery } from '../../refinery/entities/refinery.entity';

@Injectable()
export class KafkaRefinerySubscriber
  implements EntitySubscriberInterface<Refinery>
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
    return Refinery;
  }

  async afterInsert(event: InsertEvent<Refinery>) {
    await this.afterInsertUpd(event);
  }

  async afterUpdate(event: UpdateEvent<Refinery>) {
    await this.afterInsertUpd(event);
  }

  async afterInsertUpd(event: UpdateEvent<Refinery> | InsertEvent<Refinery>) {
    try {
      let kafkaPayload: ProducerRecord = {
        compression: CompressionTypes.GZIP,
        messages: [],
        topic: HubTopics.REFINERY_REF_INSERT,
      };

      const refineryDataDto: Partial<RefineryDataDto> = {
        ...event.entity,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(refineryDataDto),
      });
      await this.kafkaService.addMessage(kafkaPayload);
    } catch (e) {
      this.logger.error(e);
    }
  }

  async afterSoftRemove(event: SoftRemoveEvent<Refinery>) {
    try {
      let kafkaPayload: ProducerRecord = {
        compression: CompressionTypes.GZIP,
        messages: [],
        topic: HubTopics.REFINERY_REF_DELETE,
      };
      const refineryDataDto: Partial<RefineryDataDto> = {
        id: event.entity.id,
        shortName: event.entity.shortName,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(refineryDataDto),
      });
      await this.kafkaService.addMessage(kafkaPayload);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
