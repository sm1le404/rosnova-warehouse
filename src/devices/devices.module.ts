import { Module } from '@nestjs/common';
import { DeviceTankService } from './services/device.tank.service';

@Module({
  providers: [DeviceTankService],
  exports: [DeviceTankService],
})
export class DevicesModule {}
