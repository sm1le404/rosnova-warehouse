import { Injectable } from '@nestjs/common';
import { SerialPort } from 'serialport';
import { ConfigService } from '@nestjs/config';
import { TANK_FIRST_BYTE, TankHelperParams } from '../enums/tank.enums';

function devices(param) {
  return {
    0x01: {
      sensor: 'Уровень основного поплавка, м',
      sensor_name: 'layer_float',
      value: '',
    },
    0x02: {
      sensor: 'Средняя температура, °C',
      sensor_name: 'temperature',
      value: '',
    },
    0x03: { sensor: 'Заполнение, %', sensor_name: 'volume_percent', value: '' },
    0x04: {
      sensor: 'Общий объем, м3',
      sensor_name: 'general_volume',
      value: '',
    },
    0x05: { sensor: 'Масса T', sensor_name: 'weight', value: '' },
    0x06: { sensor: 'Плотность', sensor_name: 'density', value: '' },
    0x07: {
      sensor: 'Объем основного продукта, м3',
      sensor_name: 'volume',
      value: '',
    },
    0x08: {
      sensor: 'Уровень подтоварной жидкости, м',
      sensor_name: 'layer_liquid',
      value: '',
    },
  }[param];
}

@Injectable()
export class DeviceTankService {
  private serialPort: SerialPort;

  constructor(private readonly configService: ConfigService) {
    this.serialPort = new SerialPort({
      path: this.configService.get('TANK_PORT') ?? 'COM1',
      baudRate: 19200,
      dataBits: 8,
      parity: 'none',
      stopBits: 2,
      autoOpen: false,
    });
    this.serialPort.on('data', (data) => {
      this.readState(data);
    });
    this.serialPort.on('error', (err) => {
      throw new Error(err.message);
    });
  }

  readState(data: any) {
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

      if (message.length > 0) {
      }
    }
  }

  private prepareMessageResult(bufferMessage: Array<any>) {
    let response = {};
    for (let i = 0; i < bufferMessage.length; i++) {
      let device;
      if ((device = devices(bufferMessage[i])) != undefined) {
        const param = Buffer.from([
          0x00,
          bufferMessage[i + 1],
          bufferMessage[i + 2],
          bufferMessage[i + 3],
        ]);
        // console.log(device, param.readFloatLE(0));
        // device.value = param.readFloatLE(0);
        response[device.sensor_name] = {
          value: param.readFloatLE(0),
          description: device.sensor,
        };
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

    this.serialPort.write(buffData, (err) => {
      throw new Error(err.message);
    });
  }

  async start() {
    if (!this.serialPort.isOpen) {
      this.serialPort.open((data) => {
        throw new Error(data.toString());
      });
    }
  }
}
