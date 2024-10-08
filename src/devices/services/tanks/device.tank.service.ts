import {
  Inject,
  Injectable,
  LoggerService,
  OnModuleDestroy,
} from '@nestjs/common';
import { TankTypeEnum } from '../../enums';
import { AbstractTank } from '../../classes/abstract.tank';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SettingsService } from '../../../settings/services/settings.service';
import { SettingsKey } from '../../../settings/enums';
import { DeviceTankSensService } from './device.tank.sens.service';
import { DeviceTankStrelaService } from './device.tank.strela.service';

@Injectable()
export class DeviceTankService implements OnModuleDestroy {
  private tankSensorType: TankTypeEnum = TankTypeEnum.SENS;

  private deviceTank: AbstractTank;

  onModuleDestroy(): void {
    this.deviceTank.closePorts();
  }

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    protected readonly logger: LoggerService,
    private readonly settingsService: SettingsService,
    private readonly deviceTankSensService: DeviceTankSensService,
    private readonly deviceTankStrelaService: DeviceTankStrelaService,
  ) {
    (
      settingsService.getValue(SettingsKey.TANK_TYPE) as Promise<TankTypeEnum>
    ).then((value) => {
      const deviceType = value ?? TankTypeEnum.SENS;

      if (!deviceType) {
        this.tankSensorType = deviceType;
      }
      if (deviceType === TankTypeEnum.SENS) {
        this.deviceTank = this.deviceTankSensService;
      } else if (deviceType === TankTypeEnum.STRELA) {
        this.deviceTank = this.deviceTankStrelaService;
      }
      this.deviceTank.initPorts();
    });
  }

  async start(): Promise<void> {
    await this.deviceTank.start();
  }

  async readTanks(): Promise<void> {
    await this.deviceTank.readTanks();
  }

  async readCommand(addressId: number, comId: number = 0): Promise<void> {
    await this.deviceTank.readCommand(addressId, comId);
  }
}
