import { Controller, Get } from '@nestjs/common';
import { DeviceTankService } from '../services/device.tank.service';

@Controller('devices')
export class DevicesContoller {
  constructor(private readonly deviceTankService: DeviceTankService) {}

  @Get('tank')
  async testDevices() {
    //example test data b50120af01211740020d11c103d49c42047b6f42056d49420651573f077b6f420800000034
    setTimeout(() => {
      const buffTest = Buffer.from(
        'b50120af01211740020d11c103d49c42047b6f',
        'hex',
      );
      console.log(this.deviceTankService.readState(buffTest));
    }, 500);

    setTimeout(() => {
      const buffTest2 = Buffer.from(
        '42056d49420651573f077b6f420800000034',
        'hex',
      );
      console.log(this.deviceTankService.readState(buffTest2));
    }, 2500);
  }
}
