import { Module } from '@nestjs/common';
import { CronService } from './services/cron.service';
import { DevicesModule } from '../devices/devices.module';
import { TankModule } from '../tank/tank.module';
import { OperationModule } from '../operations/operation.module';

@Module({
  providers: [CronService],
  imports: [DevicesModule, TankModule, OperationModule],
  exports: [CronService],
})
export class CronModule {}
