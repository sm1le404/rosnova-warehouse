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
import { InteractiveScheduleCronService } from '../cron/services/interactive.schedule.cron.service';
import { DeviceTopazService } from './services/device.topaz.service';
import { DeviceTestService } from './services/device.test.service';
import { DeviceRvService } from './services/device.rv.service';
import { DispenserQueue } from '../dispenser/entities/dispenser.queue.entity';

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
  ],
  exports: [DeviceTankService, DeviceDispenserService],
})
export class DevicesModule {}
