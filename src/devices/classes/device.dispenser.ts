import { SerialPort } from 'serialport';
import {
  DispenserBytes,
  DispenserCommand,
  DispenserStatusEnum,
} from '../enums/dispenser.enum';
import { BadRequestException } from '@nestjs/common';
import { LogDirection, logDispensers } from '../../common/utility/rootpath';
import { CommandInterface } from '../interfaces/command.interface';

export class DeviceDispenser {
  private isBusyState = false;

  private commandList: Array<CommandInterface> = [];

  protected static MAX_RESPONSE_BYTES = 53;

  protected static MAX_WRITE_TIMES = 25; // 10 сек

  protected static WRITE_CHECK_INTERVAL = 400; // мс

  private static instance: DeviceDispenser[] = [];

  private serialPort: SerialPort;

  private status: DispenserStatusEnum = DispenserStatusEnum.READY;

  private lastCommand: number;

  private responseMessage: Array<any> = [];

  constructor(serialPort: SerialPort) {
    this.serialPort = serialPort;

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
    if (reponse.length > DeviceDispenser.MAX_RESPONSE_BYTES) {
      return true;
    } else if (
      reponse[0] == DispenserBytes.DEL &&
      reponse[1] == DispenserBytes.START_BYTE &&
      reponse[reponse.length - 2] == DispenserBytes.STOP_BYTE &&
      reponse[reponse.length - 3] == DispenserBytes.STOP_BYTE
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

  static getInstance(serialPort: SerialPort): DeviceDispenser {
    if (!DeviceDispenser.instance[serialPort.path]) {
      DeviceDispenser.instance[serialPort.path] = new DeviceDispenser(
        serialPort,
      );
    }

    return DeviceDispenser.instance[serialPort.path];
  }

  async executeLastCommand(): Promise<Array<any>> {
    if (this.commandList.length) {
      let counter = 0;
      this.isBusyState = true;
      const lastCommand = this.commandList.shift();
      this.lastCommand = lastCommand.command;
      const buffer = Buffer.from(lastCommand.request);

      this.serialPort.write(buffer, (errorData) => {
        if (errorData instanceof Error) {
          this.status = DispenserStatusEnum.MESSAGE_COMPLETE;
          return [];
        }
      });

      let dataCurrent: any = Buffer.from(lastCommand.request);
      await logDispensers(
        `${dataCurrent
          .inspect()
          .toString()} Вызов команды ${lastCommand.command.toString(
          16,
        )} на адресе ${lastCommand.addressId} ${this.serialPort.path}`,
      );

      return new Promise((resolve) => {
        let intervalCheckCompileStatus = setInterval(async () => {
          if (this.status == DispenserStatusEnum.MESSAGE_COMPLETE) {
            const result = this.responseMessage;
            this.resolveHelper(intervalCheckCompileStatus);
            const dataCurrent: any = Buffer.from(result);
            await logDispensers(
              `${dataCurrent.inspect().toString()}`,
              LogDirection.OUT,
            );
            resolve(result);
          } else if (lastCommand.command == DispenserCommand.START_DROP) {
            this.resolveHelper(intervalCheckCompileStatus);
            const result = [DispenserBytes.DEL, DispenserBytes.ACK];
            const dataCurrent: any = Buffer.from(result);
            await logDispensers(
              `${dataCurrent.inspect().toString()}`,
              LogDirection.OUT,
            );
            resolve(result);
          }
          counter++;

          if (counter === DeviceDispenser.MAX_WRITE_TIMES) {
            this.resolveHelper(intervalCheckCompileStatus);
            resolve([]);
          }
        }, DeviceDispenser.WRITE_CHECK_INTERVAL);
      });
    }

    return [];
  }

  private resolveHelper(intervalId) {
    clearInterval(intervalId);
    this.status = DispenserStatusEnum.READY;
    this.responseMessage = [];
    this.isBusyState = false;
  }

  async callCommand(
    addressId: number,
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

    const currentHexAddress = DispenserBytes.LINE_NUMBER + addressId;

    let checkSum = currentHexAddress ^ command;

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
      currentHexAddress,
      currentHexAddress ^ DispenserBytes.DEL,
      command,
      command ^ DispenserBytes.DEL,
      ...dataWithCompByte,
      DispenserBytes.STOP_BYTE,
      DispenserBytes.STOP_BYTE,
      checkSum,
    ];

    this.commandList.push({
      addressId,
      command,
      request,
    });

    return new Promise((resolve) => {
      let intervalCheckCompileStatus = setInterval(async () => {
        if (!this.isBusyState) {
          clearInterval(intervalCheckCompileStatus);
          const executeResult = await this.executeLastCommand();
          resolve(executeResult);
        }
      }, DeviceDispenser.WRITE_CHECK_INTERVAL);
    });
  }
}
