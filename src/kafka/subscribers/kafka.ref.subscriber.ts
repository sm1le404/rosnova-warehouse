import { DataSource, EntitySubscriberInterface, UpdateEvent } from 'typeorm';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { KafkaService } from '../services';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { InsertEvent } from 'typeorm/subscriber/event/InsertEvent';
import { SoftRemoveEvent } from 'typeorm/subscriber/event/SoftRemoveEvent';
import { CompressionTypes, ProducerRecord } from 'kafkajs';
import {
  HubTopics,
  VehicleDataDto,
  TrailerDataDto,
  DriverDataDto,
  RefineryDataDto,
  FuelDataDto,
  FuelHolderDataDto,
  TrailerCurrentState,
} from 'rs-dto';
import { ConfigService } from '@nestjs/config';
import { Trailer } from '../../vehicle/entities/trailer.entity';
import { Driver } from '../../driver/entities/driver.entity';
import { Tank } from '../../tank/entities/tank.entity';
import { Refinery } from '../../refinery/entities/refinery.entity';
import { TankDataDto } from 'rs-dto/lib/warehouse/dto/tank.data.dto';
import { Fuel } from '../../fuel/entities/fuel.entity';
import { FuelHolder } from '../../fuel-holder/entities/fuel-holder.entity';
import { VehicleCurrentState } from 'rs-dto/lib/warehouse/dto/vehicle.data.dto';

@Injectable()
export class KafkaRefSubscriber implements EntitySubscriberInterface {
  constructor(
    private readonly configService: ConfigService,
    private readonly kafkaService: KafkaService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    this.dataSource.subscribers.push(this);
  }

  private afterInsertUpd(event: InsertEvent<any> | UpdateEvent<any>) {
    let kafkaPayload: ProducerRecord = {
      compression: CompressionTypes.GZIP,
      messages: [],
      topic: '',
    };

    if (event.entity instanceof Vehicle) {
      kafkaPayload.topic = HubTopics.VEHICLE_REF_INSERT;
      const data: VehicleDataDto = {
        ...event.entity,
        whExternalCode: this.configService.get('SHOP_KEY'),
        driverId: event.entity?.driver?.id,
        trailerId: event.entity?.trailer?.id,
        currentState: Array.isArray(event.entity.currentState)
          ? event.entity.currentState.map((item: VehicleCurrentState) => item)
          : [],
        sectionVolumes: Array.isArray(event.entity.sectionVolumes)
          ? event.entity.sectionVolumes.map((item: VehicleCurrentState) => item)
          : [],
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(data),
      });
    } else if (event.entity instanceof Trailer) {
      kafkaPayload.topic = HubTopics.TRAILER_REF_INSERT;
      const data: TrailerDataDto = {
        ...event.entity,
        whExternalCode: this.configService.get('SHOP_KEY'),
        currentState: Array.isArray(event.entity.currentState)
          ? event.entity.currentState.map((item: TrailerCurrentState) => item)
          : [],
        sectionVolumes: Array.isArray(event.entity.sectionVolumes)
          ? event.entity.sectionVolumes.map((item: TrailerCurrentState) => item)
          : [],
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(data),
      });
    } else if (event.entity instanceof Driver) {
      kafkaPayload.topic = HubTopics.DRIVER_REF_INSERT;
      const data: DriverDataDto = {
        ...event.entity,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(data),
      });
    } else if (event.entity instanceof Tank) {
      kafkaPayload.topic = HubTopics.TANK_REF_INSERT;
      const data: TankDataDto = {
        ...event.entity,
        whExternalCode: this.configService.get('SHOP_KEY'),
        fuelExtId: event.entity?.fuel?.name,
        fuelHolderExtId: event.entity?.fuelHolder?.shortName,
        refineryExtId: event.entity?.refinery?.shortName,
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(data),
      });
    } else if (event.entity instanceof Refinery) {
      kafkaPayload.topic = HubTopics.REFINERY_REF_INSERT;
      const data: RefineryDataDto = {
        ...event.entity,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(data),
      });
    } else if (event.entity instanceof Fuel) {
      kafkaPayload.topic = HubTopics.FUEL_REF_INSERT;
      const data: FuelDataDto = {
        ...event.entity,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(data),
      });
    } else if (event.entity instanceof FuelHolder) {
      kafkaPayload.topic = HubTopics.FUEL_HOLDER_REF_INSERT;
      const data: FuelHolderDataDto = {
        ...event.entity,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(data),
      });
    } else {
      return;
    }

    if (kafkaPayload.messages.length) {
      this.kafkaService.addMessage(kafkaPayload);
    }
  }

  afterInsert(event: InsertEvent<any>) {
    this.afterInsertUpd(event);
  }

  afterUpdate(event: UpdateEvent<any>) {
    this.afterInsertUpd(event);
  }

  afterSoftRemove(event: SoftRemoveEvent<any>) {
    let kafkaPayload: ProducerRecord = {
      compression: CompressionTypes.GZIP,
      messages: [],
      topic: '',
    };

    if (event.entity instanceof Vehicle) {
      kafkaPayload.topic = HubTopics.VEHICLE_REF_DELETE;
      const data: VehicleDataDto = {
        id: event.entity.id,
        regNumber: event.entity.regNumber,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(data),
      });
    } else if (event.entity instanceof Trailer) {
      kafkaPayload.topic = HubTopics.TRAILER_REF_DELETE;
      const data: TrailerDataDto = {
        id: event.entity.id,
        regNumber: event.entity.regNumber,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(data),
      });
    } else if (event.entity instanceof Driver) {
      kafkaPayload.topic = HubTopics.DRIVER_REF_DELETE;
      const data: DriverDataDto = {
        id: event.entity.id,
        lastName: event.entity.lastName,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(data),
      });
    } else if (event.entity instanceof Tank) {
      kafkaPayload.topic = HubTopics.TANK_REF_DELETE;
      const data: TankDataDto = {
        id: event.entity.id,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(data),
      });
    } else if (event.entity instanceof Refinery) {
      kafkaPayload.topic = HubTopics.REFINERY_REF_DELETE;
      const data: RefineryDataDto = {
        id: event.entity.id,
        shortName: event.entity.shortName,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(data),
      });
    } else if (event.entity instanceof Fuel) {
      kafkaPayload.topic = HubTopics.FUEL_REF_DELETE;
      const data: FuelDataDto = {
        id: event.entity.id,
        name: event.entity.name,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(data),
      });
    } else if (event.entity instanceof FuelHolder) {
      kafkaPayload.topic = HubTopics.FUEL_HOLDER_REF_DELETE;
      const data: FuelHolderDataDto = {
        id: event.entity.id,
        shortName: event.entity.shortName,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(data),
      });
    } else {
      return;
    }

    if (kafkaPayload.messages.length) {
      this.kafkaService.addMessage(kafkaPayload);
    }
  }
}
