import {
  Inject,
  Injectable,
  LoggerService,
  NotFoundException,
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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DeviceEvents } from '../enums/device-events.enum';
import { TankUpdateStateEvent } from '../../tank/events/tank-update-state.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Tank } from '../../tank/entities/tank.entity';
import {
  FindOptionsWhere,
  IsNull,
  LessThanOrEqual,
  Not,
  Repository,
} from 'typeorm';

@Injectable()
export class DeviceTankService implements OnModuleDestroy {
  private serialPort: SerialPort;

  private message: Array<any> = [];

  private messageLen: number;

  private currentAddressId: number;

  private hideConnectErrors: boolean = false;

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    protected readonly logger: LoggerService,
    private eventEmitter: EventEmitter2,
    @InjectRepository(Tank)
    private readonly tankRepository: Repository<Tank>,
  ) {
    this.hideConnectErrors = !!this.configService.get('HIDE_TANK_ERRORS');

    SerialPort.list()
      .then((res) => {
        const tankPath = this.configService.get('TANK_PORT') ?? 'COM1';
        const hasPath = res.find((port) => port.path === tankPath);

        if (!hasPath) {
          throw new NotFoundException(`${tankPath} порт резервуара не найден`);
        }

        this.serialPort = new SerialPort({
          path: this.configService.get('TANK_PORT') ?? 'COM1',
          baudRate: 19200,
          dataBits: 8,
          parity: 'none',
          stopBits: 2,
          autoOpen: false,
        });

        this.serialPort.on('data', (data) => {
          try {
            const result = this.readState(data);
            if (!!result && this.checkValues(result)) {
              this.eventEmitter.emit(
                DeviceEvents.UPDATE_TANK_STATE,
                new TankUpdateStateEvent(this.currentAddressId, result),
              );
            }
          } catch (e) {
            this.logError(e);
          }
        });

        this.serialPort.on('error', (data) => {
          if (data instanceof Error) {
            this.logError(data);
            this.blockTanks(data);
          }
        });
      })
      .catch((e) => this.logError(e));
  }

  onModuleDestroy(): any {
    if (this.serialPort && this.serialPort.isOpen) {
      this.serialPort.close();
      this.blockTanks();
    }
  }

  checkValues(payload: DeviceInfoType): boolean {
    Object.keys(payload).forEach((key) => {
      if (
        Number(payload[key]) === 0 ||
        payload[key] > 1000000 ||
        payload[key] < -1000000
      ) {
        return false;
      }
    });
    return true;
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
          response[DeviceNames.LAYER_FLOAT] = param.readFloatLE(0) * 1000;
          break;
        case TankDeviceParams.LAYER_LIQUID:
          response[DeviceNames.LAYER_LIQUID] = param.readFloatLE(0);
          break;
        case TankDeviceParams.VOLUME_PERCENT:
          response[DeviceNames.VOLUME_PERCENT] = param.readFloatLE(0);
          break;
        case TankDeviceParams.TOTAL_VOLUME:
          response[DeviceNames.TOTAL_VOLUME] = param.readFloatLE(0) * 1000;
          break;
        case TankDeviceParams.WEIGHT:
          response[DeviceNames.WEIGHT] = param.readFloatLE(0) * 1000;
          break;
        case TankDeviceParams.DENSITY:
          response[DeviceNames.DENSITY] = param.readFloatLE(0);
          break;
        case TankDeviceParams.VOLUME:
          response[DeviceNames.VOLUME] = param.readFloatLE(0) * 1000;
          break;
      }
    }

    if (
      response[DeviceNames.DENSITY] > 1 ||
      Number(response[DeviceNames.DENSITY].toFixed(4)) == 0
    ) {
      response[DeviceNames.DENSITY] =
        Math.floor(
          (response[DeviceNames.WEIGHT] / response[DeviceNames.VOLUME]) * 1000,
        ) / 1000;
    }
    return response;
  }

  async readTanks() {
    //Читаем только те которые обновлялись больше 30 секунд назад, выбираем по 5
    const tankList = await this.tankRepository.find({
      where: {
        addressId: Not(IsNull()),
        updatedAt: LessThanOrEqual(Math.floor(Date.now() / 1000) - 30),
      },
      take: 5,
      order: {
        updatedAt: 'ASC',
      },
    });
    for (const tank of tankList) {
      await this.readCommand(tank.addressId);
    }
  }

  async readCommand(addressId: number) {
    const packet = [
      addressId,
      TankHelperParams.DATA_LENGTH,
      TankHelperParams.COMMAND_READ,
      TankHelperParams.DATA,
    ];
    const crc = packet.reduce((a, b) => a + b);
    const buffData = Buffer.from([TANK_FIRST_BYTE, ...packet, crc]);
    this.serialPort.write(buffData, (data) => {
      //Бьем ошибку только через 2 минуты, бывают сбои в ответах
      if (data instanceof Error) {
        this.logError(data);
        this.blockTanks(data, {
          addressId,
          updatedAt: LessThanOrEqual(Math.floor(Date.now() / 1000) - 60 * 2),
        });
      } else {
        this.unblockTanks({ addressId });
      }
    });
  }

  async start() {
    return new Promise((res, rej) => {
      if (!this.serialPort.isOpen) {
        this.serialPort.open((data) => {
          if (data instanceof Error) {
            this.logError(data);
            this.blockTanks(data);
            return rej(data);
          } else {
            this.unblockTanks();
            return res(true);
          }
        });
      } else {
        return res(true);
      }
    });
  }

  private blockTanks(
    error: Error | null = null,
    filter: FindOptionsWhere<Tank> = { isBlocked: false },
  ) {
    this.tankRepository.update(filter, {
      isBlocked: true,
      error: error?.message ? error.message : `Закрыт доступ к COM порту`,
    });
  }

  private unblockTanks(filter: FindOptionsWhere<Tank> = { isBlocked: true }) {
    this.tankRepository.update(filter, { isBlocked: false, error: null });
  }

  private logError(data: any) {
    if (!this.hideConnectErrors) {
      this.logger.error(data);
    }
  }
}
