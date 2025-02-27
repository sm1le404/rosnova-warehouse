import { Module } from '@nestjs/common';
import { CronService } from './services/cron.service';
import { DevicesModule } from '../devices/devices.module';
import { TankModule } from '../tank/tank.module';
import { OperationModule } from '../operations/operation.module';
import { EventModule } from '../event/event.module';
import { InteractiveScheduleCronService } from './services/interactive.schedule.cron.service';
import { BackupService } from './services/backup.service';

@Module({
  providers: [CronService, InteractiveScheduleCronService, BackupService],
  imports: [DevicesModule, TankModule, OperationModule, EventModule],
  exports: [CronService, InteractiveScheduleCronService],
})
export class CronModule {}
