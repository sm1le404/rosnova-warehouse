import {
  Inject,
  Injectable,
  LoggerService,
  OnModuleDestroy,
} from '@nestjs/common';
import { SerialPort } from 'serialport';
import { ConfigService } from '@nestjs/config';
import {
  TANK_FIRST_BYTE,
  TankDeviceParams,
  TankHelperParams,
} from '../enums/tank.enums';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { DeviceNames } from '../enums';
import { DeviceInfoType } from '../types/device.info.type';

@Injectable()
export class DeviceTankService implements OnModuleDestroy {
  private serialPort: SerialPort;

  private message: Array<any> = [];

  private messageLen: number;

  private currentAddressId: number;

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    protected readonly logger: LoggerService,
  ) {
    this.serialPort = new SerialPort({
      path: this.configService.get('TANK_PORT') ?? 'COM1',
      baudRate: 19200,
      dataBits: 8,
      parity: 'none',
      stopBits: 2,
      autoOpen: false,
    });
    this.serialPort.on('data', (data) => {
      //@TODO передавать в event инфо отсюда на конкретный резервуар
      //console.log('read result', this.readState(data));
      //console.log('address id', this.currentAddressId);
    });
    this.serialPort.on('error', (data) => {
      if (data instanceof Error) {
        this.logger.error(data);
      }
    });
  }

  readState(data: Buffer): DeviceInfoType | null {
    let startReadPosition = 0;
    //Очищаем сообщение и сдвигаем позицию
    if (data[0] == TANK_FIRST_BYTE && data[2] > 0) {
      this.message = [];
      this.currentAddressId = data[1];
      this.messageLen = data[2];
      startReadPosition = 4;
    }

    let i = 0;
    while (
      Buffer.byteLength(Buffer.from(this.message)) < this.messageLen &&
      data[startReadPosition + i] !== undefined
    ) {
      this.message.push(data[startReadPosition + i]);
      i++;
    }
    const buffMessage = Buffer.from(this.message);
    if (this.messageLen == Buffer.byteLength(buffMessage)) {
      return DeviceTankService.prepareMessageResult(buffMessage);
    }
  }

  private static prepareMessageResult(bufferMessage: Buffer): DeviceInfoType {
    let response: DeviceInfoType = {
      DENSITY: 0,
      LAYER_FLOAT: 0,
      LAYER_LIQUID: 0,
      TEMP: 0,
      TOTAL_VOLUME: 0,
      VOLUME: 0,
      VOLUME_PERCENT: 0,
      WEIGHT: 0,
    };
    for (let i = 0; i < bufferMessage.length; i++) {
      const param = Buffer.from([
        0x00,
        bufferMessage[i + 1],
        bufferMessage[i + 2],
        bufferMessage[i + 3],
      ]);
      switch (bufferMessage[i]) {
        case TankDeviceParams.TEMP:
          response[DeviceNames.TEMP] = param.readFloatLE(0);
          break;
        case TankDeviceParams.LAYER_FLOAT:
          response[DeviceNames.LAYER_FLOAT] = param.readFloatLE(0);
          break;
        case TankDeviceParams.LAYER_LIQUID:
          response[DeviceNames.LAYER_LIQUID] = param.readFloatLE(0);
          break;
        case TankDeviceParams.VOLUME_PERCENT:
          response[DeviceNames.VOLUME_PERCENT] = param.readFloatLE(0);
          break;
        case TankDeviceParams.TOTAL_VOLUME:
          response[DeviceNames.TOTAL_VOLUME] = param.readFloatLE(0);
          break;
        case TankDeviceParams.WEIGHT:
          response[DeviceNames.WEIGHT] = param.readFloatLE(0);
          break;
        case TankDeviceParams.DENSITY:
          response[DeviceNames.DENSITY] = param.readFloatLE(0);
          break;
        case TankDeviceParams.VOLUME:
          response[DeviceNames.VOLUME] = param.readFloatLE(0);
          break;
      }
    }
    return response;
  }

  async readCommand() {
    const packet = [
      TankHelperParams.ADDRESS_LINE,
      TankHelperParams.DATA_LENGTH,
      TankHelperParams.COMMAND_READ,
      TankHelperParams.DATA,
    ];
    const crc = packet.reduce((a, b) => a + b);
    const buffData = Buffer.from([TANK_FIRST_BYTE, ...packet, crc]);
    this.serialPort.write(buffData, (data) => {
      if (data instanceof Error) {
        this.logger.error(data);
      }
    });
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
