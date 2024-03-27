import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { DataSource, EntitySubscriberInterface, UpdateEvent } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CompressionTypes, ProducerRecord } from 'kafkajs';
import { HubTopics, VehicleDataDto } from 'rs-dto';
import { KafkaService } from '../services';
import { ConfigService } from '@nestjs/config';
import { SoftRemoveEvent } from 'typeorm/subscriber/event/SoftRemoveEvent';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { InsertEvent } from 'typeorm/subscriber/event/InsertEvent';
import { VehicleCurrentState } from 'rs-dto/lib/warehouse/dto/vehicle.data.dto';

@Injectable()
export class KafkaVehicleSubscriber
  implements EntitySubscriberInterface<Vehicle>
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
    return Vehicle;
  }

  async afterInsert(event: InsertEvent<Vehicle>) {
    await this.afterInsertUpd(event);
  }

  async afterUpdate(event: UpdateEvent<Vehicle>) {
    await this.afterInsertUpd(event);
  }

  async afterInsertUpd(event: UpdateEvent<Vehicle> | InsertEvent<Vehicle>) {
    try {
      if (event?.entity?.id) {
        const data: Vehicle = await event.manager.findOne(Vehicle, {
          where: {
            id: event.entity.id,
          },
        });
        let kafkaPayload: ProducerRecord = {
          compression: CompressionTypes.GZIP,
          messages: [],
          topic: HubTopics.VEHICLE_REF_INSERT,
        };
        const vehicleDataDto: VehicleDataDto = {
          ...data,
          whExternalCode: this.configService.get('SHOP_KEY'),
          driverId: data?.driver?.id,
          trailerId: data?.trailer?.id,
          currentState: Array.isArray(data.currentState)
            ? event.entity.currentState.map((item: VehicleCurrentState) => item)
            : [],
          sectionVolumes: Array.isArray(data.sectionVolumes)
            ? data.sectionVolumes.map((item: VehicleCurrentState) => item)
            : [],
        };
        kafkaPayload.messages.push({
          value: JSON.stringify(vehicleDataDto),
        });
        await this.kafkaService.addMessage(kafkaPayload);
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  async afterSoftRemove(event: SoftRemoveEvent<Vehicle>) {
    try {
      let kafkaPayload: ProducerRecord = {
        compression: CompressionTypes.GZIP,
        messages: [],
        topic: HubTopics.VEHICLE_REF_DELETE,
      };
      const vehicleDataDto: Partial<VehicleDataDto> = {
        id: event.entity.id,
        regNumber: event.entity.regNumber,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(vehicleDataDto),
      });
      await this.kafkaService.addMessage(kafkaPayload);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
