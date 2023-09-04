import { Module } from '@nestjs/common';
import { DeviceTankService } from './services/device.tank.service';
import { DevicesContoller } from './controllers/devices.contoller';
import { DeviceDispenserService } from './services/device.dispenser.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispenser } from '../dispenser/entities/dispenser.entity';
import { Operation } from '../operations/entities/operation.entity';
import { Tank } from '../tank/entities/tank.entity';
import { EventService } from '../event/services/event.service';
import { Event } from '../event/entities/event.entity';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dispenser, Operation, Tank, Event]),
    KafkaModule,
  ],
  controllers: [DevicesContoller],
  providers: [DeviceTankService, DeviceDispenserService, EventService],
  exports: [DeviceTankService, DeviceDispenserService],
})
export class DevicesModule {}
