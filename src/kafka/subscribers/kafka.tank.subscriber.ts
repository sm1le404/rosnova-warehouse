import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { DataSource, EntitySubscriberInterface, UpdateEvent } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CompressionTypes, ProducerRecord } from 'kafkajs';
import { HubTopics } from 'rs-dto';
import { KafkaService } from '../services';
import { ConfigService } from '@nestjs/config';
import { SoftRemoveEvent } from 'typeorm/subscriber/event/SoftRemoveEvent';
import { Tank } from '../../tank/entities/tank.entity';
import { TankDataDto } from 'rs-dto/lib/warehouse/dto/tank.data.dto';
import { InsertEvent } from 'typeorm/subscriber/event/InsertEvent';

@Injectable()
export class KafkaTankSubscriber implements EntitySubscriberInterface<Tank> {
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
    return Tank;
  }

  async afterInsert(event: InsertEvent<Tank>) {
    await this.afterInsertUpd(event);
  }

  async afterUpdate(event: UpdateEvent<Tank>) {
    await this.afterInsertUpd(event);
  }

  async afterInsertUpd(event: UpdateEvent<Tank> | InsertEvent<Tank>) {
    try {
      if (event?.entity?.id) {
        const data: Tank = await event.manager.findOne(Tank, {
          where: {
            id: event.entity.id,
          },
        });
        let kafkaPayload: ProducerRecord = {
          compression: CompressionTypes.GZIP,
          messages: [],
          topic: HubTopics.TANK_REF_INSERT,
        };
        const tankDataDto: Partial<TankDataDto> = {
          ...data,
          whExternalCode: this.configService.get('SHOP_KEY'),
          fuelExtId: data?.fuel?.name,
          fuelHolderExtId: data?.fuelHolder?.inn,
          refineryExtId: data?.refinery?.shortName,
        };
        kafkaPayload.messages.push({
          value: JSON.stringify(tankDataDto),
        });
        await this.kafkaService.addMessage(kafkaPayload);
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  async afterSoftRemove(event: SoftRemoveEvent<Tank>) {
    try {
      let kafkaPayload: ProducerRecord = {
        compression: CompressionTypes.GZIP,
        messages: [],
        topic: HubTopics.TANK_REF_DELETE,
      };
      const tankDataDto: Partial<TankDataDto> = {
        id: event.entity.id,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(tankDataDto),
      });
      await this.kafkaService.addMessage(kafkaPayload);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
