import { Module } from '@nestjs/common';
import { CronService } from './services/cron.service';
import { DevicesModule } from '../devices/devices.module';
import { TankModule } from '../tank/tank.module';
import { OperationModule } from '../operations/operation.module';
import { EventModule } from '../event/event.module';

@Module({
  providers: [CronService],
  imports: [DevicesModule, TankModule, OperationModule, EventModule],
  exports: [CronService],
})
export class CronModule {}
