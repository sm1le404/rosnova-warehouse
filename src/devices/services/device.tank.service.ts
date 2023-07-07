import { Injectable } from '@nestjs/common';
import { SerialPort } from 'serialport';
import { ConfigService } from '@nestjs/config';

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
  }

  readState(data: any) {
    console.log('read data', data);
  }

  async writeCommand(command: string) {
    console.log('write cmd', command);
    this.serialPort.write(command);
  }

  async start() {
    this.serialPort.open((data) => {
      console.log('x', data);
    });
  }
}
