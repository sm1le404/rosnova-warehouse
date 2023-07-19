import {
  Inject,
  Injectable,
  LoggerService,
  OnModuleDestroy,
} from '@nestjs/common';
import { SerialPort } from 'serialport';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { IDispenserCommand } from '../interfaces/dispenser.command.interface';
import { DeviceDispenser } from '../classes/device.dispenser';

@Injectable()
export class DeviceDispenserService implements OnModuleDestroy {
  private serialPort: SerialPort;

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    protected readonly logger: LoggerService,
  ) {
    this.serialPort = new SerialPort({
      path: this.configService.get('DISPENSER_PORT') ?? 'COM2',
      baudRate: 4800,
      dataBits: 7,
      parity: 'even',
      stopBits: 2,
      autoOpen: false,
    });
    this.serialPort.on('error', (data) => {
      if (data instanceof Error) {
        this.logger.error(data);
      }
    });
  }

  async callCommand(payload: IDispenserCommand) {
    const dispenser = DeviceDispenser.getInstance(
      this.serialPort,
      payload.addressId,
    );
    return dispenser.callCommand(payload.command, payload.data);
  }

  async start() {
    if (!this.serialPort.isOpen) {
      this.serialPort.open((data) => {
        if (data instanceof Error) {
          this.logger.error(data);
        }
      });
    }
  }

  onModuleDestroy(): any {
    if (this.serialPort.isOpen) {
      this.serialPort.close();
    }
  }
}
