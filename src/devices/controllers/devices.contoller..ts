import { Body, Controller, Get, Post } from '@nestjs/common';
import { DeviceTankService } from '../services/device.tank.service';
import { ApiBody, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { DeviceDispenserService } from '../services/device.dispenser.service';
import { DispenserCommandDto } from '../dto/dispenser.command.dto';
import { DispenserGetFuelDto } from '../dto/dispenser.get.fuel.dto';

@ApiTags('Devices')
@Controller('devices')
export class DevicesContoller {
  constructor(
    private readonly deviceTankService: DeviceTankService,
    private readonly deviceDispenserService: DeviceDispenserService,
  ) {}

  @ApiExcludeEndpoint()
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

  @ApiBody({ type: () => DispenserCommandDto })
  @Post('dispenser')
  async callDispenserCommand(@Body() payload: DispenserCommandDto) {
    return this.deviceDispenserService.callCommand(payload);
  }

  @ApiBody({ type: () => DispenserGetFuelDto })
  @Post('dispenser/drain')
  async checkDispenserCommand(@Body() payload: DispenserGetFuelDto) {
    return this.deviceDispenserService.drainFuel(payload);
  }
}
