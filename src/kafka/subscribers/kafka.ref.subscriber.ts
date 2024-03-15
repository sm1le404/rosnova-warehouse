import { DataSource, EntitySubscriberInterface, UpdateEvent } from 'typeorm';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { KafkaService } from '../services';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { InsertEvent } from 'typeorm/subscriber/event/InsertEvent';
import { SoftRemoveEvent } from 'typeorm/subscriber/event/SoftRemoveEvent';
import { CompressionTypes, ProducerRecord } from 'kafkajs';
import {
  DriverDataDto,
  FuelDataDto,
  FuelHolderDataDto,
  HubTopics,
  OperationDataDto,
  RefineryDataDto,
  TrailerCurrentState,
  TrailerDataDto,
  VehicleDataDto,
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
import { Operation } from '../../operations/entities/operation.entity';
import { VehicleState } from 'rs-dto/lib/warehouse/dto/operation.data.dto';
import { OperationStatus } from '../../operations/enums';

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

    if (
      event.entity instanceof Operation &&
      !!event.entity?.status &&
      event.entity.status === OperationStatus.FINISHED
    ) {
      kafkaPayload.topic = HubTopics.OPERATION_INSERT;
      const operationDataDto: OperationDataDto = {
        ...event.entity,
        whExternalCode: this.configService.get('SHOP_KEY'),
        fuelExtId: event.entity?.fuel?.name,
        fuelHolderExtId: event.entity?.fuelHolder?.inn,
        refineryExtId: event.entity?.refinery?.shortName,
        vehicleExtId: event.entity?.vehicle?.regNumber,
        trailerExtId: event.entity?.trailer?.regNumber,
        tankExtId: event.entity?.tank?.id.toString(),
        type: event?.entity?.type,
        status: event?.entity?.status,
        vehicleState: JSON.parse(
          JSON.stringify(event?.entity?.vehicleState),
        ) as VehicleState[],
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(operationDataDto),
      });
    } else if (event.entity instanceof Vehicle) {
      kafkaPayload.topic = HubTopics.VEHICLE_REF_INSERT;
      const vehicleDataDto: VehicleDataDto = {
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
        value: JSON.stringify(vehicleDataDto),
      });
    } else if (event.entity instanceof Trailer) {
      kafkaPayload.topic = HubTopics.TRAILER_REF_INSERT;
      const trailerDataDto: TrailerDataDto = {
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
        value: JSON.stringify(trailerDataDto),
      });
    } else if (event.entity instanceof Driver) {
      kafkaPayload.topic = HubTopics.DRIVER_REF_INSERT;
      const driverDataDto: DriverDataDto = {
        ...event.entity,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(driverDataDto),
      });
    } else if (event.entity instanceof Tank) {
      kafkaPayload.topic = HubTopics.TANK_REF_INSERT;
      const tankDataDto: TankDataDto = {
        ...event.entity,
        whExternalCode: this.configService.get('SHOP_KEY'),
        fuelExtId: event.entity?.fuel?.name,
        fuelHolderExtId: event.entity?.fuelHolder?.inn,
        refineryExtId: event.entity?.refinery?.shortName,
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(tankDataDto),
      });
    } else if (event.entity instanceof Refinery) {
      kafkaPayload.topic = HubTopics.REFINERY_REF_INSERT;
      const refineryDataDto: RefineryDataDto = {
        ...event.entity,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(refineryDataDto),
      });
    } else if (event.entity instanceof Fuel) {
      kafkaPayload.topic = HubTopics.FUEL_REF_INSERT;
      const fuelDataDto: FuelDataDto = {
        ...event.entity,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(fuelDataDto),
      });
    } else if (event.entity instanceof FuelHolder) {
      kafkaPayload.topic = HubTopics.FUEL_HOLDER_REF_INSERT;
      const fuelHolderDataDto: FuelHolderDataDto = {
        ...event.entity,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(fuelHolderDataDto),
      });
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

    if (event.entity instanceof Operation) {
      kafkaPayload.topic = HubTopics.OPERATION_DELETE;
      if (event.entity.status === OperationStatus.FINISHED) {
        const operationDataDto: Partial<OperationDataDto> = {
          id: event.entity.id,
          whExternalCode: this.configService.get('SHOP_KEY'),
        };
        kafkaPayload.messages.push({
          value: JSON.stringify(operationDataDto),
        });
      }
    } else if (event.entity instanceof Vehicle) {
      kafkaPayload.topic = HubTopics.VEHICLE_REF_DELETE;
      const vehicleDataDto: Partial<VehicleDataDto> = {
        id: event.entity.id,
        regNumber: event.entity.regNumber,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(vehicleDataDto),
      });
    } else if (event.entity instanceof Trailer) {
      kafkaPayload.topic = HubTopics.TRAILER_REF_DELETE;
      const trailerDataDto: Partial<TrailerDataDto> = {
        id: event.entity.id,
        regNumber: event.entity.regNumber,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(trailerDataDto),
      });
    } else if (event.entity instanceof Driver) {
      kafkaPayload.topic = HubTopics.DRIVER_REF_DELETE;
      const driverDataDto: Partial<DriverDataDto> = {
        id: event.entity.id,
        lastName: event.entity.lastName,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(driverDataDto),
      });
    } else if (event.entity instanceof Tank) {
      kafkaPayload.topic = HubTopics.TANK_REF_DELETE;
      const tankDataDto: Partial<TankDataDto> = {
        id: event.entity.id,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(tankDataDto),
      });
    } else if (event.entity instanceof Refinery) {
      kafkaPayload.topic = HubTopics.REFINERY_REF_DELETE;
      const refineryDataDto: Partial<RefineryDataDto> = {
        id: event.entity.id,
        shortName: event.entity.shortName,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(refineryDataDto),
      });
    } else if (event.entity instanceof Fuel) {
      kafkaPayload.topic = HubTopics.FUEL_REF_DELETE;
      const fuelDataDto: Partial<FuelDataDto> = {
        id: event.entity.id,
        name: event.entity.name,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(fuelDataDto),
      });
    } else if (event.entity instanceof FuelHolder) {
      kafkaPayload.topic = HubTopics.FUEL_HOLDER_REF_DELETE;
      const fuelHolderDataDto: Partial<FuelHolderDataDto> = {
        id: event.entity.id,
        shortName: event.entity.shortName,
        inn: event.entity.inn,
        whExternalCode: this.configService.get('SHOP_KEY'),
      };
      kafkaPayload.messages.push({
        value: JSON.stringify(fuelHolderDataDto),
      });
    }

    if (kafkaPayload.messages.length) {
      this.kafkaService.addMessage(kafkaPayload);
    }
  }
}
