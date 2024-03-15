import { Module } from '@nestjs/common';
import { DeviceTankService } from './services/device.tank.service';
import { DevicesContoller } from './controllers/devices.contoller';
import { DeviceDispenserService } from './services/device.dispenser.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tank } from '../tank/entities/tank.entity';
import { EventService } from '../event/services/event.service';
import { Event } from '../event/entities/event.entity';
import { InteractiveScheduleCronService } from '../cron/services/interactive.schedule.cron.service';
import { OperationModule } from '../operations/operation.module';
import { DispenserModule } from '../dispenser/dispenser.module';
import { Dispenser } from '../dispenser/entities/dispenser.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tank, Event, Dispenser]),
    OperationModule,
    DispenserModule,
  ],
  controllers: [DevicesContoller],
  providers: [
    DeviceTankService,
    DeviceDispenserService,
    EventService,
    InteractiveScheduleCronService,
  ],
  exports: [DeviceTankService, DeviceDispenserService],
})
export class DevicesModule {}
