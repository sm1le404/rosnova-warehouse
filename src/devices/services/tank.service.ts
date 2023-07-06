import { Injectable } from '@nestjs/common';
import { SerialPort } from 'serialport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TankService {
  private serialPort: SerialPort;

  constructor(private readonly configService: ConfigService) {
    this.serialPort = new SerialPort({
      path: this.configService.get('TANK_PORT') ?? 'COM1',
      baudRate: 19200,
      dataBits: 8,
      parity: 'none',
      stopBits: 2,
      autoOpen: true,
    });
  }

  async readState() {
    this.serialPort.on('data', (data) => {
      console.log(data);
    });
  }
}
