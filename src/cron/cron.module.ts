import { Module } from '@nestjs/common';
import { CronService } from './services/cron.service';
import { DevicesModule } from '../devices/devices.module';
import { TankModule } from '../tank/tank.module';

@Module({
  providers: [CronService],
  imports: [DevicesModule, TankModule],
  exports: [CronService],
})
export class CronModule {}
