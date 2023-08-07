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
    const currentHexAddress = DispenserBytes.LINE_NUMBER + currentAddressId;
    this.serialPort = serialPort;
    this.currentAddressId = currentHexAddress;

    this.serialPort.on('error', (data) => {
      if (data instanceof Error) {
        this.status = DispenserStatusEnum.MESSAGE_COMPLETE;
      }
    });

    this.serialPort.on('data', (data) => {
      for (let i = 0; i < data.length; i++) {
        this.responseMessage.push(data[i]);
      }
      if (this.checkState(this.responseMessage)) {
        this.status = DispenserStatusEnum.MESSAGE_COMPLETE;
      }
    });
  }

  private checkState(reponse: Array<any>): boolean {
    if (
      reponse[0] == DispenserBytes.DEL &&
      reponse[1] == DispenserBytes.START_BYTE
    ) {
      return true;
    } else if (
      reponse[0] == DispenserBytes.DEL &&
      (reponse[1] == DispenserBytes.ACK || reponse[1] == DispenserBytes.CAN)
    ) {
      return true;
    }
    return false;
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

  async callCommand(
    command: DispenserCommand,
    data: Buffer = Buffer.from([]),
  ): Promise<Array<any>> {
    if (!this.serialPort.isOpen) {
      throw new BadRequestException(
        `COM порт недоступен, повторите попытку позднее`,
      );
    }
    if (command === DispenserCommand.SET_LITRES && data.length !== 5) {
      throw new BadRequestException('Неверная команда при установке литров');
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

    this.serialPort.write(buffer, (errorData) => {
      if (errorData instanceof Error) {
        this.status = DispenserStatusEnum.MESSAGE_COMPLETE;
        throw new GoneException(errorData);
      }
    });

    return new Promise((resolve) => {
      let intervalCheckCompileStatus = setInterval(() => {
        if (this.status == DispenserStatusEnum.MESSAGE_COMPLETE) {
          clearInterval(intervalCheckCompileStatus);
          this.status = DispenserStatusEnum.READY;
          const result = this.responseMessage;
          this.responseMessage = [];
          resolve(result);
        }
      }, 100);
    });
  }
}
