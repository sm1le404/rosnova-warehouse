import {
  Inject,
  Injectable,
  LoggerService,
  OnModuleDestroy,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { DispenserDeviceTypes } from '../enums/dispenser.enum';
import { DispenserGetFuelDto } from '../dto/dispenser.get.fuel.dto';
import { DispenserCommandDto } from '../dto/dispenser.command.dto';
import { DispenserFixOperationDto } from '../dto/dispenser.fix.operation.dto';
import { DispenserCommandDtoExt } from '../dto/dispenser.command.dto.ext';
import { SettingsService } from '../../settings/services/settings.service';
import { DeviceTopazService } from './device.topaz.service';
import { AbstractDispenser } from '../classes/abstract.dispenser';
import { DeviceTestService } from './device.test.service';
import { DeviceRvService } from './device.rv.service';

@Injectable()
export class DeviceDispenserService implements OnModuleDestroy {
  private deviceType: DispenserDeviceTypes = DispenserDeviceTypes.TOPAZ;

  private deviceDispenser: AbstractDispenser;

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    protected readonly logger: LoggerService,
    private readonly settingsService: SettingsService,
    private readonly deviceTopazService: DeviceTopazService,
    private readonly deviceR: DeviceTopazService,
    private readonly deviceTestService: DeviceTestService,
    private readonly deviceRvService: DeviceRvService,
  ) {
    settingsService.getValue('dispenserType').then((deviceType) => {
      if (!deviceType) {
        this.deviceType = deviceType;
      }
      if (deviceType === DispenserDeviceTypes.TOPAZ) {
        this.deviceDispenser = this.deviceTopazService;
      } else if (deviceType === DispenserDeviceTypes.RV) {
        this.deviceDispenser = this.deviceRvService;
      }
      this.deviceDispenser.initPorts();
    });
  }

  onModuleDestroy(): any {
    this.deviceDispenser.closePorts();
  }

  async doneOperation(payload: DispenserFixOperationDto) {
    await this.deviceDispenser.doneOperation(payload);
  }

  async drainFuel(payload: DispenserGetFuelDto) {
    await this.deviceDispenser.drainFuel(payload);
  }

  async callCommandExt(payload: DispenserCommandDtoExt) {
    return this.deviceDispenser.callCommand({
      dispenser: [
        { id: payload.dispenserId },
        { sortIndex: payload.dispenserNumber },
      ],
      command: payload.command,
      data: payload.data,
    });
  }

  async callCommand(payload: DispenserCommandDto) {
    return this.deviceDispenser.callCommand({
      dispenser: {
        comId: payload.comId,
        addressId: payload.addressId,
      },
      command: payload.command,
      data: payload.data,
    });
  }

  async start() {
    await this.deviceDispenser.start();
  }

  async updateDispenserStatuses() {
    await this.deviceDispenser.updateDispenserStatuses();
  }

  async updateDispenserSummary() {
    await this.deviceDispenser.updateDispenserSummary();
  }

  async drainFuelTest(payload: DispenserGetFuelDto) {
    await this.deviceTestService.drainFuelTest(payload);
  }

  async doneOperationTest(payload: DispenserFixOperationDto) {
    await this.deviceTestService.doneOperationTest(payload);
  }
}
