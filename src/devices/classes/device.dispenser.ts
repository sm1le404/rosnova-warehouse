import { SerialPort } from 'serialport';
import {
  DispenserBytes,
  DispenserCommand,
  DispenserStatusEnum,
} from '../enums/dispenser.enum';
import { BadRequestException, GoneException } from '@nestjs/common';

export class DeviceDispenser {
  private static instance: DeviceDispenser[] = [];

  private serialPort: SerialPort;

  private readonly currentAddressId: number;

  private status: DispenserStatusEnum = DispenserStatusEnum.READY;

  private responseMessage: Array<any> = [];

  constructor(serialPort: SerialPort, currentAddressId: number) {
    const currentHexAddress = parseInt(`${currentAddressId}`, 16);
    this.serialPort = serialPort;
    this.currentAddressId = currentHexAddress;

    this.serialPort.on('data', (data) => {
      for (let i = 0; i < data.length; i++) {
        this.responseMessage.push(data[i]);
      }
      if (
        this.responseMessage[0] == DispenserBytes.DEL &&
        this.responseMessage[1] == DispenserBytes.START_BYTE
      ) {
        if (
          this.responseMessage[this.responseMessage.length - 2] ==
            DispenserBytes.STOP_BYTE &&
          this.responseMessage[this.responseMessage.length - 3] ==
            DispenserBytes.STOP_BYTE
        ) {
          this.status = DispenserStatusEnum.MESSAGE_COMPLETE;
        }
      } else if (
        this.responseMessage[0] == DispenserBytes.DEL &&
        this.responseMessage[1] != DispenserBytes.START_BYTE
      ) {
        this.status = DispenserStatusEnum.MESSAGE_COMPLETE;
      }
    });
  }

  static getInstance(
    serialPort: SerialPort,
    currentAddressId: number,
  ): DeviceDispenser {
    if (!DeviceDispenser.instance[currentAddressId]) {
      DeviceDispenser.instance[currentAddressId] = new DeviceDispenser(
        serialPort,
        currentAddressId,
      );
    }

    return DeviceDispenser.instance[currentAddressId];
  }

  async callCommand(command: DispenserCommand, data: Buffer = Buffer.from([])) {
    if (!this.serialPort.isOpen) {
      throw new BadRequestException(
        `COM порт недоступен, повторите попытку позднее`,
      );
    }
    if (command === DispenserCommand.SET_LITRES && data.length !== 5) {
      throw new Error('Неверная команда при установке литров');
    }

    let checkSum = this.currentAddressId ^ command;

    let dataWithCompByte = [];
    for (let i = 0; i < data.length; i++) {
      checkSum ^= data[i];
      dataWithCompByte.push(data[i]);
      dataWithCompByte.push(data[i] ^ DispenserBytes.DEL);
    }
    checkSum ^= DispenserBytes.STOP_BYTE;

    let request = [
      DispenserBytes.DEL,
      DispenserBytes.START_BYTE,
      this.currentAddressId,
      this.currentAddressId ^ DispenserBytes.DEL,
      command,
      command ^ DispenserBytes.DEL,
      ...dataWithCompByte,
      DispenserBytes.STOP_BYTE,
      DispenserBytes.STOP_BYTE,
      checkSum,
    ];

    const buffer = Buffer.from(request);
    console.log('command message', buffer);

    this.serialPort.write(buffer, (errorData) => {
      if (errorData instanceof Error) {
        throw new GoneException(errorData);
      }
    });

    return new Promise((resolve) => {
      let intervalCheckCompileStatus = setInterval(() => {
        if (this.status == DispenserStatusEnum.MESSAGE_COMPLETE) {
          clearInterval(intervalCheckCompileStatus);
          resolve(this.responseMessage);
        }
      }, 200);
    });
  }
}
