import { Module } from '@nestjs/common';
import { DeviceTankService } from './services/device.tank.service';
import { DevicesContoller } from './controllers/devices.contoller';
import { DeviceDispenserService } from './services/device.dispenser.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispenser } from '../dispenser/entities/dispenser.entity';
import { Operation } from '../operations/entities/operation.entity';
import { Tank } from '../tank/entities/tank.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventService } from '../event/services/event.service';
import { Event } from '../event/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dispenser, Operation, Tank, Event])],
  controllers: [DevicesContoller],
  providers: [
    DeviceTankService,
    DeviceDispenserService,
    EventEmitter2,
    EventService,
  ],
  exports: [DeviceTankService, DeviceDispenserService],
})
export class DevicesModule {}
