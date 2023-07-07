import { Module } from '@nestjs/common';
import { CronService } from './services/cron.service';
import { DevicesModule } from '../devices/devices.module';

@Module({
  providers: [CronService],
  imports: [DevicesModule],
  exports: [CronService],
})
export class CronModule {}
