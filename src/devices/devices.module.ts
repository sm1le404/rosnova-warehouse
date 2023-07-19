import { Module } from '@nestjs/common';
import { DeviceTankService } from './services/device.tank.service';
import { DevicesContoller } from './controllers/devices.contoller.';
import { DeviceDispenserService } from './services/device.dispenser.service';

@Module({
  controllers: [DevicesContoller],
  providers: [DeviceTankService, DeviceDispenserService],
  exports: [DeviceTankService, DeviceDispenserService],
})
export class DevicesModule {}
