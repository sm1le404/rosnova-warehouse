import { Module } from '@nestjs/common';
import { DeviceTankService } from './services/device.tank.service';
import { DevicesContoller } from './controllers/devices.contoller.';

@Module({
  controllers: [DevicesContoller],
  providers: [DeviceTankService],
  exports: [DeviceTankService],
})
export class DevicesModule {}
