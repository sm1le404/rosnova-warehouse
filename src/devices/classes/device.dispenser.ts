import { SerialPort } from 'serialport';
import {
  DispenserBytes,
  DispenserCommand,
  DispenserStatusEnum,
} from '../enums/dispenser.enum';
import { BadRequestException, GoneException } from '@nestjs/common';

export class DeviceDispenser {
  protected MAX_WAIT_TIMES = 5;

  private static instance: DeviceDispenser[] = [];

  private serialPort: SerialPort;

  private readonly currentAddressId: number;

  private status: DispenserStatusEnum = DispenserStatusEnum.READY;

  private responseMessage: Array<any> = [];

  constructor(serialPort: SerialPort, currentAddressId: number) {
    const currentHexAddress = DispenserBytes.LINE_NUMBER + currentAddressId;
    this.serialPort = serialPort;
    this.currentAddressId = currentHexAddress;

    this.serialPort.on('error', (data) => {
      if (data instanceof Error) {
        this.status = DispenserStatusEnum.MESSAGE_COMPLETE;
        throw new GoneException(data);
      }
    });

    this.serialPort.on('data', (data) => {
      for (let i = 0; i < data.length; i++) {
        this.responseMessage.push(data[i]);
      }
      console.log('dispenser response', this.responseMessage);
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
    if (Buffer.byteLength(Buffer.from(data)) == 0) {
      checkSum += 0x40;
    }

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
        this.status = DispenserStatusEnum.MESSAGE_COMPLETE;
        throw new GoneException(errorData);
      }
    });

    let callTimes = 0;
    return new Promise((resolve, error) => {
      let intervalCheckCompileStatus = setInterval(() => {
        callTimes++;

        if (callTimes === this.MAX_WAIT_TIMES) {
          clearInterval(intervalCheckCompileStatus);
          error(new Error('Исчерпан лимит ожидания ответа колонки'));
        }
        if (this.status == DispenserStatusEnum.MESSAGE_COMPLETE) {
          clearInterval(intervalCheckCompileStatus);
          resolve(this.responseMessage);
        }
      }, 400);
    });
  }
}
