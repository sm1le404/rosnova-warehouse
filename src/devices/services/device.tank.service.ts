import { Inject, Injectable, LoggerService } from '@nestjs/common';
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
export class DeviceTankService {
  private serialPort: SerialPort;

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
      console.log('port data', data);
      console.log('read result', this.readState(data));
    });
    this.serialPort.on('error', (data) => {
      if (data instanceof Error) {
        this.logger.error(data);
      }
    });
  }

  readState(data: any): DeviceInfoType | null {
    const message: Array<any> = [];
    if (Array.isArray(data)) {
      if (data[0] == TANK_FIRST_BYTE && data[2] > 1) {
        let startReadPosition = 4;
        let i = 0;
        while (
          Buffer.byteLength(Buffer.from(message)) < startReadPosition ||
          data[startReadPosition + i] == undefined
        ) {
          message.push(data[startReadPosition + i]);
          i++;
        }
      }
      console.log('compiled message', message);
      if (message.length > 0) {
        return DeviceTankService.prepareMessageResult(message);
      }
    }
  }

  private static prepareMessageResult(
    bufferMessage: Array<any>,
  ): DeviceInfoType | null {
    let response: DeviceInfoType;
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
        case TankDeviceParams.LAYER_FLOAT:
          response[DeviceNames.LAYER_FLOAT] = param.readFloatLE(0);
        case TankDeviceParams.LAYER_LIQUID:
          response[DeviceNames.LAYER_LIQUID] = param.readFloatLE(0);
        case TankDeviceParams.VOLUME_PERCENT:
          response[DeviceNames.VOLUME_PERCENT] = param.readFloatLE(0);
        case TankDeviceParams.TOTAL_VOLUME:
          response[DeviceNames.TOTAL_VOLUME] = param.readFloatLE(0);
        case TankDeviceParams.WEIGHT:
          response[DeviceNames.WEIGHT] = param.readFloatLE(0);
        case TankDeviceParams.DENSITY:
          response[DeviceNames.DENSITY] = param.readFloatLE(0);
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
    console.log('call read command', buffData);
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
}
