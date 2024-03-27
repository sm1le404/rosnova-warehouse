import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { DataSource, EntitySubscriberInterface, UpdateEvent } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CompressionTypes, ProducerRecord } from 'kafkajs';
import { HubTopics, TrailerCurrentState, TrailerDataDto } from 'rs-dto';
import { KafkaService } from '../services';
import { ConfigService } from '@nestjs/config';
import { SoftRemoveEvent } from 'typeorm/subscriber/event/SoftRemoveEvent';
import { InsertEvent } from 'typeorm/subscriber/event/InsertEvent';
import { Trailer } from '../../vehicle/entities/trailer.entity';

@Injectable()
export class KafkaTrailerSubscriber
  implements EntitySubscriberInterface<Trailer>
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
    return Trailer;
  }

  async afterInsert(event: InsertEvent<Trailer>) {
    await this.afterInsertUpd(event);
  }

  async afterUpdate(event: UpdateEvent<Trailer>) {
    await this.afterInsertUpd(event);
  }

  async afterInsertUpd(event: UpdateEvent<Trailer> | InsertEvent<Trailer>) {
    try {
      if (event?.entity?.id) {
        const data: Trailer = await event.manager.findOne(Trailer, {
          where: {
            id: event.entity.id,
          },
        });
        let kafkaPayload: ProducerRecord = {
          compression: CompressionTypes.GZIP,
          messages: [],
          topic: HubTopics.TRAILER_REF_INSERT,
        };

        const trailerDataDto: TrailerDataDto = {
          ...data,
          whExternalCode: this.configService.get('SHOP_KEY'),
          currentState: Array.isArray(data.currentState)
            ? data.currentState.map((item: TrailerCurrentState) => item)
            : [],
          sectionVolumes: Array.isArray(data.sectionVolumes)
            ? data.sectionVolumes.map((item: TrailerCurrentState) => item)
            : [],
        };
        kafkaPayload.messages.push({
          value: JSON.stringify(trailerDataDto),
        });
        await this.kafkaService.addMessage(kafkaPayload);
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  async afterSoftRemove(event: SoftRemoveEvent<Trailer>) {
    try {
      let kafkaPayload: ProducerRecord = {
        compression: CompressionTypes.GZIP,
        messages: [],
        topic: HubTopics.TRAILER_REF_DELETE,
      };
      const trailerDataDto: Partial<TrailerDataDto> = {
        id: event.entity.id,
        regNumber: event.entity.regNumber,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(trailerDataDto),
      });
      await this.kafkaService.addMessage(kafkaPayload);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
