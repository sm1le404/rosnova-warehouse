import {
  BadRequestException,
  Inject,
  Injectable,
  LoggerService,
  OnModuleDestroy,
} from '@nestjs/common';
import { SerialPort } from 'serialport';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { IDispenserCommand } from '../interfaces/dispenser.command.interface';
import { DeviceDispenser } from '../classes/device.dispenser';
import { DispenserCommand } from '../enums/dispenser.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Dispenser } from '../../dispenser/entities/dispenser.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Operation } from '../../operations/entities/operation.entity';
import { DispenserGetFuelDto } from '../dto/dispenser.get.fuel.dto';
import { OperationStatus, OperationType } from '../../operations/enums';
import { Tank } from '../../tank/entities/tank.entity';
import { logInRoot } from '../../common/utility/rootpath';

@Injectable()
export class DeviceDispenserService implements OnModuleDestroy {
  private readonly serialPort: SerialPort;

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    protected readonly logger: LoggerService,
    @InjectRepository(Dispenser)
    private readonly dispenserRepository: Repository<Dispenser>,
    @InjectRepository(Operation)
    private readonly operationRepository: Repository<Operation>,
    @InjectRepository(Tank)
    private readonly tankRepository: Repository<Tank>,
  ) {
    this.serialPort = new SerialPort({
      path: this.configService.get('DISPENSER_PORT') ?? 'COM2',
      baudRate: 4800,
      dataBits: 7,
      parity: 'even',
      stopBits: 2,
      autoOpen: false,
    });
  }

  async drainFuelTest(payload: DispenserGetFuelDto) {
    const operation = await this.operationRepository.findOneOrFail({
      where: {
        id: payload.operationId,
        status: OperationStatus.CREATED,
        type: OperationType.OUTCOME,
      },
      relations: {
        dispenser: true,
        tank: true,
      },
    });

    if (!operation?.dispenser?.addressId) {
      throw new BadRequestException(`На колонке не установлен адрес`);
    }

    await this.dispenserRepository.update(
      {
        id: operation.dispenser.id,
      },
      { isBlocked: true },
    );
    await this.tankRepository.update(
      {
        id: operation.tank.id,
      },
      { isBlocked: true },
    );

    let counter = 0;
    return new Promise((resolve) => {
      let intervalCheckCompileStatus = setInterval(async () => {
        counter++;

        await this.operationRepository.update(
          {
            id: operation.id,
          },
          {
            status: OperationStatus.PROGRESS,
            factVolume: counter,
            factWeight: counter * operation.tank.density,
          },
        );
        if (counter === payload.litres) {
          await this.operationRepository.update(
            {
              id: operation.id,
            },
            {
              status: OperationStatus.FINISHED,
            },
          );
          await this.dispenserRepository.update(
            {
              id: operation.dispenser.id,
            },
            { isBlocked: false },
          );
          await this.tankRepository.update(
            {
              id: operation.tank.id,
            },
            { isBlocked: false },
          );
          clearInterval(intervalCheckCompileStatus);
          resolve('');
        }
      }, 1000);
    });
  }

  async drainFuel(payload: DispenserGetFuelDto) {
    const operation = await this.operationRepository.findOneOrFail({
      where: {
        id: payload.operationId,
        status: OperationStatus.CREATED,
        type: OperationType.OUTCOME,
      },
      relations: {
        dispenser: true,
        tank: true,
      },
    });
    if (!operation?.dispenser?.addressId) {
      throw new BadRequestException(`На колонке не установлен адрес`);
    }
    const addressId = operation.dispenser.addressId;
    await this.dispenserRepository.update(
      {
        id: operation.dispenser.id,
      },
      { isBlocked: true },
    );
    await this.tankRepository.update(
      {
        id: operation.tank.id,
      },
      { isBlocked: true },
    );
    let dataCurrent: any;

    const flushStatus = await this.callCommand({
      command: DispenserCommand.FLUSH,
      addressId: addressId,
    });

    dataCurrent = Buffer.from(flushStatus);
    await logInRoot(
      `${new Date().toLocaleTimeString()} ${dataCurrent
        .inspect()
        .toString()} Сброс состояния: ${addressId}`,
    );

    const currentStatus = await this.callCommand({
      command: DispenserCommand.STATUS,
      addressId: addressId,
    });

    dataCurrent = Buffer.from(currentStatus);
    await logInRoot(
      `${new Date().toLocaleTimeString()} ${dataCurrent
        .inspect()
        .toString()} Текущий статус: ${addressId}`,
    );

    let litres = payload.litres.toString().split('');
    for (let i = litres.length; i < 5; i++) {
      litres.unshift(`0`);
    }

    const setPrice = await this.callCommand({
      command: DispenserCommand.SET_PRICE,
      addressId: addressId,
      data: Buffer.from([0, 1, 0, 0]),
    });

    dataCurrent = Buffer.from(setPrice);
    await logInRoot(
      `${new Date().toLocaleTimeString()} ${dataCurrent
        .inspect()
        .toString()} Установили цену: ${addressId}`,
    );

    const setLitres = await this.callCommand({
      command: DispenserCommand.SET_LITRES,
      addressId: addressId,
      data: Buffer.from(litres.join('')),
    });

    let dataSetLitres: any = Buffer.from(setLitres);
    await logInRoot(
      `${new Date().toLocaleTimeString()} ${dataSetLitres
        .inspect()
        .toString()} Установили литры: ${addressId}`,
    );

    const init = await this.callCommand({
      command: DispenserCommand.INIT,
      addressId: addressId,
    });

    let dataInit: any = Buffer.from(init);
    await logInRoot(
      `${new Date().toLocaleTimeString()} ${dataInit
        .inspect()
        .toString()} Инициализация колонки: ${addressId}`,
    );

    const startDrop = await this.callCommand({
      command: DispenserCommand.START_DROP,
      addressId: addressId,
    });

    let dataDrop: any = Buffer.from(startDrop);
    await logInRoot(
      `${new Date().toLocaleTimeString()} ${dataDrop
        .inspect()
        .toString()} Безусловный старт раздачи колонки: ${addressId}`,
    );

    await this.operationRepository.update(
      {
        id: operation.id,
      },
      {
        startedAt: Math.floor(Date.now() / 1000),
      },
    );

    return new Promise((resolve) => {
      let intervalCheckCompileStatus = setInterval(async () => {
        const status: Array<any> = await this.callCommand({
          command: DispenserCommand.STATUS,
          addressId: addressId,
        });
        let data1: any = Buffer.from(status);
        await logInRoot(
          `${new Date().toLocaleTimeString()} ${data1
            .inspect()
            .toString()} Статус колонки: ${addressId}`,
        );
        //Запись реально залитого количества
        let responseStatus: Array<any> = await this.callCommand({
          command: DispenserCommand.GET_CURRENT_STATUS,
          addressId: addressId,
        });
        let data2: any = Buffer.from(responseStatus);
        const litresPacket = Buffer.from(responseStatus)
          .slice(4, 13)
          .filter((e, index) => index % 2 == 0);
        const countLitres = parseInt(litresPacket.toString());
        await logInRoot(
          `${new Date().toLocaleTimeString()} ${data2
            .inspect()
            .toString()} Пролитые литры: ${countLitres}  Колонка: ${addressId}`,
        );
        if (countLitres > 0) {
          await this.operationRepository.update(
            {
              id: operation.id,
            },
            {
              status: OperationStatus.PROGRESS,
              factVolume: countLitres,
              factWeight: countLitres * operation.tank.density,
            },
          );
        }
        //ТРК выключена . Отпуск топлива закончен
        if (status[2] == 0x34 && status[4] == 0x30) {
          clearInterval(intervalCheckCompileStatus);
          const approveResult: any = await this.callCommand({
            command: DispenserCommand.APPROVE_LITRES,
            addressId: addressId,
          });
          let data3: any = Buffer.from(approveResult);
          await logInRoot(
            `${new Date().toLocaleTimeString()} ${data3
              .inspect()
              .toString()} Зафиксировали результат Колонка: ${addressId}`,
          );
          await this.operationRepository.update(
            {
              id: operation.id,
            },
            {
              status: OperationStatus.FINISHED,
              finishedAt: Math.floor(Date.now() / 1000),
            },
          );
          await this.dispenserRepository.update(
            {
              id: operation.dispenser.id,
            },
            { isBlocked: false },
          );
          await this.tankRepository.update(
            {
              id: operation.tank.id,
            },
            { isBlocked: false },
          );
          resolve('');
        }
      }, 1000);
    });
  }

  async callCommand(payload: IDispenserCommand) {
    const dispenser = DeviceDispenser.getInstance(
      this.serialPort,
      payload.addressId,
    );
    return dispenser.callCommand(payload.command, payload.data);
  }

  async start() {
    if (!this.serialPort.isOpen) {
      this.serialPort.open((data) => {
        if (data instanceof Error) {
          this.logger.error(data);
          this.blockDispenser(data);
        } else {
          this.unblockDispenser();
        }
      });
    }
  }

  onModuleDestroy(): any {
    if (this.serialPort.isOpen) {
      this.serialPort.close();
      this.blockDispenser();
    }
  }

  private blockDispenser(
    error: Error | null = null,
    filter: FindOptionsWhere<Dispenser> = { isBlocked: false },
  ) {
    this.dispenserRepository.update(filter, {
      isBlocked: true,
      error: error?.message ? error.message : `Закрыт доступ к COM порту`,
    });
  }

  private unblockDispenser(
    filter: FindOptionsWhere<Dispenser> = { isBlocked: true },
  ) {
    this.dispenserRepository.update(filter, { isBlocked: false, error: null });
  }
}
