import { Module } from '@nestjs/common';
import { DevicesContoller } from './controllers/devices.contoller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispenser } from '../dispenser/entities/dispenser.entity';
import { Operation } from '../operations/entities/operation.entity';
import { Tank } from '../tank/entities/tank.entity';
import { EventService } from '../event/services/event.service';
import { Event } from '../event/entities/event.entity';
import { InteractiveScheduleCronService } from '../cron/services/interactive.schedule.cron.service';
import { DispenserQueue } from '../dispenser/entities/dispenser.queue.entity';
import {
  DeviceDispenserService,
  DeviceRvService,
  DeviceTankSensService,
  DeviceTankService,
  DeviceTestService,
  DeviceTopazService,
} from './services';
import { DeviceTankStrelaService } from './services/tanks/device.tank.strela.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Dispenser,
      DispenserQueue,
      Operation,
      Tank,
      Event,
    ]),
  ],
  controllers: [DevicesContoller],
  providers: [
    DeviceTankService,
    DeviceDispenserService,
    EventService,
    InteractiveScheduleCronService,
    DeviceTopazService,
    DeviceRvService,
    DeviceTestService,
    DeviceTankSensService,
    DeviceTankStrelaService,
  ],
  exports: [DeviceTankService, DeviceDispenserService],
})
export class DevicesModule {}
