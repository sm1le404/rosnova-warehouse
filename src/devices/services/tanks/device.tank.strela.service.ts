import {
  Inject,
  Injectable,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { SerialPort } from 'serialport';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { DeviceInfoType } from '../../types/device.info.type';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DeviceEvents, DeviceNames } from '../../enums';
import { TankUpdateStateEvent } from '../../../tank/events';
import { InjectRepository } from '@nestjs/typeorm';
import { Tank } from '../../../tank/entities/tank.entity';
import {
  FindOptionsWhere,
  IsNull,
  LessThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { LogDirection, logTanks } from '../../../common/utility/rootpath';
import { SerialPortOpenOptions } from 'serialport/dist/serialport';
// eslint-disable-next-line import/no-extraneous-dependencies
import { WindowsBindingInterface } from '@serialport/bindings-cpp/dist/win32';
import { chunk, ComHelper } from '../../../common/utility';
import { AbstractTank } from '../../classes/abstract.tank';
import {
  STRELA_FIRST_BYTE,
  TankStrelaDeviceParams,
  TankStrelaHelperParams,
} from '../../enums/tank.strela.enums';
import { crc16, crc16top, getFloatFromArr } from '../../utils/tank.utl.';

@Injectable()
export class DeviceTankStrelaService extends AbstractTank {
  private readonly serialPortList: Record<string, SerialPort> = {};

  private message: Array<any> = [];

  private setMessage: Buffer;

  private currentAddressId?: number;

  private currentPortId?: number;

  private currentCommand?: number;

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    protected readonly logger: LoggerService,
    private eventEmitter: EventEmitter2,
    @InjectRepository(Tank)
    private readonly tankRepository: Repository<Tank>,
  ) {
    super();
  }

  private static buffMessLen(buffMess: any[]): number {
    return Buffer.byteLength(Buffer.from(buffMess)) - 5; // 3 первичных байта + 2 crc
  }

  readState(data: Buffer): DeviceInfoType | null {
    //Проверяем установлен ли адрес
    if (Buffer.compare(data, this.setMessage) !== -1) {
      //Потом произвести считывание
      const packet = [
        STRELA_FIRST_BYTE,
        TankStrelaHelperParams.COMMAND_READ,
        TankStrelaHelperParams.DATA,
        TankStrelaHelperParams.DATA_ADDR,
        TankStrelaHelperParams.DATA,
        TankStrelaHelperParams.FULL_REGISTERS,
      ];

      const buffData = Buffer.from([
        ...packet,
        crc16(Buffer.from(packet)),
        crc16top(Buffer.from(packet)),
      ]);
      const tempData: any = buffData;
      logTanks(
        `Вызов команды ${tempData.inspect().toString()}`,
        LogDirection.OUT,
      );
      this.writePort(this.currentPortId, this.currentPortId, buffData);
      return;
    }
    // Очищаем сообщение и сдвигаем позицию, если пришел первый байт
    // критический случай 100 символов
    // this.message[2] - длина сообщения
    const tempData: any = data;
    logTanks(`${tempData.inspect().toString()}`);
    if (
      data[0] == STRELA_FIRST_BYTE ||
      DeviceTankStrelaService.buffMessLen(this.message) > 100
    ) {
      this.message = [];
    }

    let i = 0;
    while (typeof data[i] !== 'undefined') {
      this.message.push(data[i]);
      if (
        this.message[2] > 0 &&
        this.message[2] == DeviceTankStrelaService.buffMessLen(this.message)
      ) {
        break;
      }
      i++;
    }

    if (
      this.message[2] == DeviceTankStrelaService.buffMessLen(this.message) ||
      DeviceTankStrelaService.checkFullMessage(this.message)
    ) {
      this.currentCommand = this.message[1];
      const payload = this.message.slice(3, -2);
      this.message = [];
      if (this.currentCommand === TankStrelaHelperParams.COMMAND_READ) {
        return DeviceTankStrelaService.prepareMessageResult(
          Buffer.from(payload),
        );
      }
    }
  }

  private static checkFullMessage(message: Array<any>): Boolean {
    const baseMessage = [...message];
    const crcMax = baseMessage.pop();
    const crcMin = baseMessage.pop();

    return (
      Buffer.compare(
        Buffer.from([...baseMessage, crcMin, crcMax]),
        Buffer.from([
          ...baseMessage,
          crc16(Buffer.from(baseMessage)),
          crc16top(Buffer.from(baseMessage)),
        ]),
      ) !== -1
    );
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
    const data = chunk(Array.from(bufferMessage), 6);

    response[DeviceNames.TEMP] = getFloatFromArr(
      data[TankStrelaDeviceParams.TEMP],
    );
    response[DeviceNames.LAYER_FLOAT] = getFloatFromArr(
      data[TankStrelaDeviceParams.LAYER_FLOAT],
    );
    response[DeviceNames.WEIGHT] = getFloatFromArr(
      data[TankStrelaDeviceParams.WEIGHT],
    );
    response[DeviceNames.VOLUME] = getFloatFromArr(
      data[TankStrelaDeviceParams.VOLUME],
    );
    response[DeviceNames.DENSITY] = getFloatFromArr(
      data[TankStrelaDeviceParams.DENSITY],
    );
    response[DeviceNames.TOTAL_VOLUME] = getFloatFromArr(
      data[TankStrelaDeviceParams.TOTAL_VOLUME],
    );

    if (
      (response[DeviceNames.DENSITY] > 1 ||
        Number(response[DeviceNames.DENSITY].toFixed(4)) == 0) &&
      response[DeviceNames.WEIGHT] > 0 &&
      response[DeviceNames.VOLUME] > 0
    ) {
      response[DeviceNames.DENSITY] =
        Math.floor(
          (response[DeviceNames.WEIGHT] / response[DeviceNames.VOLUME]) * 1000,
        ) / 1000;
    }
    return response;
  }

  async readTanks() {
    if (Object.keys(this.serialPortList).length === 0) {
      this.logger.error(`Не могу продолжить чтение, порты недоступены`);
      return;
    }
    const tankList = await this.tankRepository.find({
      where: {
        addressId: Not(IsNull()),
        isEnabled: true,
        updatedAt: LessThanOrEqual(Math.floor(Date.now() / 1000) - 10),
      },
      order: {
        updatedAt: 'ASC',
      },
      take: 5,
    });
    const comId = ComHelper.comToNumber(
      this.configService.get('TANK_PORT') ?? 'COM1',
    );
    for (const tank of tankList) {
      await this.readCommand(tank.addressId, tank?.comId ?? comId);
    }
  }

  async readCommand(addressId: number, comId: number = 0) {
    //Сначала необходимо установить адресс считывания
    const setPacket = [
      STRELA_FIRST_BYTE,
      TankStrelaHelperParams.COMMAND_SET_ADDRESS,
      TankStrelaHelperParams.DATA,
      TankStrelaHelperParams.DATA,
      TankStrelaHelperParams.DATA,
      addressId,
    ];
    const setBuffData = Buffer.from([
      ...setPacket,
      crc16(Buffer.from(setPacket)),
      crc16top(Buffer.from(setPacket)),
    ]);
    const setTempData: any = setBuffData;
    await logTanks(
      `Вызов команды ${setTempData.inspect().toString()}`,
      LogDirection.OUT,
    );
    this.setMessage = setBuffData;
    this.currentAddressId = addressId;
    this.currentPortId = comId;
    await this.writePort(comId, addressId, setBuffData);

    //Потом произвести считывание
    const packet = [
      STRELA_FIRST_BYTE,
      TankStrelaHelperParams.COMMAND_READ,
      TankStrelaHelperParams.DATA,
      TankStrelaHelperParams.DATA_ADDR,
      TankStrelaHelperParams.DATA,
      TankStrelaHelperParams.FULL_REGISTERS,
    ];

    const buffData = Buffer.from([
      ...packet,
      crc16(Buffer.from(packet)),
      crc16top(Buffer.from(packet)),
    ]);
    const tempData: any = buffData;
    await logTanks(
      `Вызов команды ${tempData.inspect().toString()}`,
      LogDirection.OUT,
    );
    await this.writePort(this.currentPortId, this.currentPortId, buffData);
  }

  private async writePort(comId: number, addressId: number, buffData: Buffer) {
    return new Promise((resolve) => {
      this.serialPortList[ComHelper.numberToCom(comId)].write(buffData, () => {
        this.serialPortList[ComHelper.numberToCom(comId)].once(
          'data',
          (data) => {
            console.log(data);
            resolve(data);
          },
        );
      });
    });
  }

  async start() {
    if (!!this.serialPortList) {
      const ports = Object.keys(this.serialPortList);
      if (ports.length > 0) {
        const promisesList: Array<Promise<any>> = [];
        ports.forEach((com) => {
          promisesList.push(
            new Promise((res, rej) => {
              const serialPort: SerialPort = this.serialPortList[com];
              if (!serialPort.isOpen) {
                serialPort.open((data) => {
                  if (data instanceof Error) {
                    this.logError(data);
                    this.blockTanks(data, {
                      comId: ComHelper.comToNumber(com),
                    });
                    return rej(data);
                  } else {
                    this.unblockTanks({
                      comId: ComHelper.comToNumber(com),
                    });
                    return res(true);
                  }
                });
              } else {
                return res(true);
              }
            }),
          );
        });
        await Promise.all(promisesList);
      }
    }
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
    this.logger.error(data);
  }

  async closePorts(): Promise<void> {
    if (!!this.serialPortList) {
      const ports = Object.keys(this.serialPortList);
      if (ports.length > 0) {
        ports.forEach((portNumber) => {
          const serialPort: SerialPort = this.serialPortList[portNumber];
          if (serialPort.isOpen) {
            serialPort.close();
          }
        });
        this.blockTanks();
      }
    }
  }

  async initPorts(): Promise<void> {
    this.tankRepository
      .createQueryBuilder(`tank`)
      .addSelect(`comId`)
      .groupBy(`comId`)
      .getMany()
      .then((result) => {
        const cfg = this.configService.get('TANK_PORT_CFG');
        let comList: Array<string> = Array.from(
          new Set(
            result
              .filter((item) => item.comId > 0)
              .map((item) => ComHelper.numberToCom(item.comId)),
          ),
        );
        if (comList.length === 0) {
          comList.push(this.configService.get('TANK_PORT') ?? 'COM1');
        }
        comList.forEach((tankPath) => {
          if (!this.serialPortList[tankPath]) {
            SerialPort.list()
              .then((res) => {
                const hasPath = res.find((port) => port.path === tankPath);

                if (!hasPath) {
                  throw new NotFoundException(
                    `${tankPath} порт резервуара не найден`,
                  );
                }

                let portParams: Partial<
                  SerialPortOpenOptions<WindowsBindingInterface>
                > = {
                  baudRate: 19200,
                  dataBits: 8,
                  parity: 'odd',
                  stopBits: 1,
                  autoOpen: false,
                };

                try {
                  const cfgParams: Partial<
                    SerialPortOpenOptions<WindowsBindingInterface>
                  > = JSON.parse(cfg);
                  portParams = { ...portParams, ...cfgParams };
                } catch (e) {}

                this.serialPortList[tankPath] = new SerialPort({
                  path: tankPath,
                  ...(portParams as SerialPortOpenOptions<WindowsBindingInterface>),
                });

                // this.serialPortList[tankPath].on('data', (data) => {
                //   try {
                //     const result = this.readState(data);
                //     if (!!result) {
                //       this.eventEmitter.emit(
                //         DeviceEvents.UPDATE_TANK_STATE,
                //         new TankUpdateStateEvent(
                //           this.currentAddressId,
                //           ComHelper.comToNumber(tankPath),
                //           result,
                //         ),
                //       );
                //     }
                //   } catch (e) {
                //     this.logError(e);
                //   }
                // });

                this.serialPortList[tankPath].on('error', (data) => {
                  this.logError(data);
                  this.blockTanks(data, {
                    comId: ComHelper.comToNumber(tankPath),
                  });
                });
              })
              .catch((e) => this.logError(e));
          }
        });
      });
  }
}
