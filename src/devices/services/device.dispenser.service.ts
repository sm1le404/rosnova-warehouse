import {
  BadRequestException,
  Inject,
  Injectable,
  LoggerService,
  NotFoundException,
  OnModuleDestroy,
} from '@nestjs/common';
import { SerialPort } from 'serialport';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { DeviceDispenser } from '../classes/device.dispenser';
import {
  DispenserBytes,
  DispenserCommand,
  DispenserStatus,
} from '../enums/dispenser.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Dispenser } from '../../dispenser/entities/dispenser.entity';
import {
  FindOptionsWhere,
  In,
  IsNull,
  MoreThan,
  Not,
  Repository,
} from 'typeorm';
import { Operation } from '../../operations/entities/operation.entity';
import { DispenserGetFuelDto } from '../dto/dispenser.get.fuel.dto';
import {
  OperationEvent,
  OperationStatus,
  OperationType,
} from '../../operations/enums';
import { Tank } from '../../tank/entities/tank.entity';
import { DispenserCommandDto } from '../dto/dispenser.command.dto';
import { LogDirection, logDispensers } from '../../common/utility/rootpath';
import { DispenserHelper } from '../classes/dispenser.helper';
import { DispenserFixOperationDto } from '../dto/dispenser.fix.operation.dto';
import { DeviceTankService } from './device.tank.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TankOperationStateEvent } from '../../operations/events/tank-operation-state.event';
import { DispenserCommandDtoExt } from '../dto/dispenser.command.dto.ext';
import { CronExpression } from '@nestjs/schedule/dist/enums/cron-expression.enum';
// eslint-disable-next-line max-len
import { InteractiveScheduleCronService } from '../../cron/services/interactive.schedule.cron.service';
import { SerialPortOpenOptions } from 'serialport/dist/serialport';
// eslint-disable-next-line import/no-extraneous-dependencies
import { WindowsBindingInterface } from '@serialport/bindings-cpp/dist/win32';
import { OperationService } from '../../operations/services/operation.service';
import { DispenserService } from '../../dispenser/services/dispenser.service';

@Injectable()
export class DeviceDispenserService implements OnModuleDestroy {
  private readonly serialPortList: Record<number, SerialPort> = {};

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    protected readonly logger: LoggerService,
    private readonly deviceTankService: DeviceTankService,
    @InjectRepository(Dispenser)
    private dispenserRepository: Repository<Dispenser>,
    private readonly dispenserService: DispenserService,
    private readonly operationService: OperationService,
    @InjectRepository(Tank)
    private readonly tankRepository: Repository<Tank>,
    private eventEmitter: EventEmitter2,
    private readonly interactiveScheduleCronService: InteractiveScheduleCronService,
  ) {
    this.dispenserRepository
      .createQueryBuilder(`dispenser`)
      .addSelect(`comId`)
      .groupBy(`comId`)
      .getMany()
      .then((result) => {
        result.forEach((dispenser) => {
          if (dispenser.comId > 0 && !this.serialPortList[dispenser.comId]) {
            SerialPort.list()
              .then((res) => {
                const hasPath = res.find(
                  (port) => port.path === `COM${dispenser.comId}`,
                );

                let portParams: Partial<
                  SerialPortOpenOptions<WindowsBindingInterface>
                > = {
                  baudRate: 4800,
                  dataBits: 7,
                  parity: 'even',
                  stopBits: 2,
                  autoOpen: false,
                };

                const cfg = this.configService.get('DISPENSER_PORT_CFG');
                try {
                  const cfgParams: Partial<
                    SerialPortOpenOptions<WindowsBindingInterface>
                  > = JSON.parse(cfg);
                  portParams = { ...portParams, ...cfgParams };
                } catch (e) {}

                if (!hasPath) {
                  throw new NotFoundException(
                    `COM${dispenser.comId} порт колонки ${dispenser.id} не найден`,
                  );
                }

                this.serialPortList[dispenser.comId] = new SerialPort({
                  path: `COM${dispenser.comId}`,
                  ...(portParams as SerialPortOpenOptions<WindowsBindingInterface>),
                });
              })
              .catch((e) => this.logger.error(e));
          }
        });
      });
  }

  onModuleDestroy(): any {
    if (!!this.serialPortList) {
      const ports = Object.keys(this.serialPortList);
      if (ports.length > 0) {
        ports.forEach((portNumber) => {
          const serialPort: SerialPort = this.serialPortList[portNumber];
          if (serialPort.isOpen) {
            serialPort.close();
          }
        });
        this.blockDispenser();
      }
    }
  }

  async drainFuelTest(payload: DispenserGetFuelDto) {
    const operation = await this.operationService.findOne({
      where: {
        id: payload.operationId,
        status: Not(In([OperationStatus.STOPPED, OperationStatus.FINISHED])),
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

    const dispenser = await this.dispenserRepository.findOne({
      where: { id: operation.dispenser.id },
    });

    await this.operationService.update(
      {
        where: { id: operation.id },
      },
      {
        id: operation.id,
        startedAt: Math.floor(Date.now() / 1000),
        status: OperationStatus.STARTED,
        counterBefore: dispenser.currentCounter,
      },
    );

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

        await this.operationService.update(
          {
            where: { id: operation.id },
          },
          {
            status: OperationStatus.PROGRESS,
            factVolume: counter,
            factWeight: counter * operation.tank.density,
            counterAfter: dispenser.currentCounter + counter,
          },
        );
        if (counter === payload.litres) {
          await this.operationService.update(
            {
              where: { id: operation.id },
            },
            {
              status: OperationStatus.STOPPED,
            },
          );
          await this.dispenserRepository.update(
            {
              id: operation.dispenser.id,
              currentCounter: dispenser.currentCounter + counter,
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

  async doneOperation(payload: DispenserFixOperationDto) {
    const operation = await this.operationService.findOne({
      where: {
        id: payload.operationId,
        status: In([
          OperationStatus.INTERRUPTED,
          OperationStatus.STOPPED,
          OperationStatus.STARTED,
        ]),
        type: In([OperationType.OUTCOME, OperationType.INTERNAL]),
      },
      relations: {
        dispenser: true,
        tank: true,
      },
    });

    if (operation.status === OperationStatus.STARTED) {
      this.logger.error(
        `Попытка зафиксировать сломанную операцию ${operation.id}, 
            зависла в стартовом статусе`,
      );
    }

    if (!operation?.dispenser?.addressId || !operation?.dispenser?.comId) {
      throw new BadRequestException(`На колонке не установлен адрес`);
    }

    if (operation?.tank?.addressId) {
      await this.deviceTankService.readCommand(operation.tank.addressId);
    }

    //Запись реально залитого количества
    let litresStatus: Array<any> = await this.callCommand({
      command: DispenserCommand.GET_CURRENT_STATUS,
      addressId: operation.dispenser.addressId,
      comId: operation.dispenser.comId,
    });
    const countLitres = DispenserHelper.getLitres(litresStatus);

    const approveResult = await this.callCommand({
      command: DispenserCommand.APPROVE_LITRES,
      addressId: operation.dispenser.addressId,
      comId: operation.dispenser.comId,
    });

    if (approveResult[1] != DispenserBytes.ACK) {
      this.logger.error(
        `Не удалось зафиксировать результат операции ${operation.id}, 
            не дает зафиксировать количество литров`,
      );
    }

    let summaryStatus = await this.callCommand({
      command: DispenserCommand.GET_SUMMARY_STATE,
      addressId: operation.dispenser.addressId,
      comId: operation.dispenser.comId,
    });
    const summaryLitres = DispenserHelper.getSummaryLitres(summaryStatus);

    const tankState = await this.tankRepository.findOne({
      where: { id: operation.tank.id },
    });

    await this.operationService.update(
      {
        where: { id: operation.id },
      },
      {
        status: OperationStatus.FINISHED,
        finishedAt: Math.floor(Date.now() / 1000),
        counterAfter: summaryLitres,
        volumeAfter: tankState.volume,
        levelAfter: tankState.level,
        factVolume: countLitres,
        factWeight: countLitres * operation.tank.density,
      },
    );

    this.interactiveScheduleCronService.deleteCronJob(
      `operation_${operation.id}`,
    );

    this.eventEmitter.emit(
      OperationEvent.FINISH,
      new TankOperationStateEvent(
        operation.tank.id,
        operation.type,
        countLitres,
        countLitres * operation.tank.density,
      ),
    );

    await this.callCommand({
      addressId: operation.dispenser.addressId,
      comId: operation.dispenser.comId,
      command: DispenserCommand.STATUS,
    });

    await this.dispenserService.update(
      {
        where: { id: operation.dispenser.id },
      },
      { currentCounter: summaryLitres },
    );
  }

  async doneOperationTest(payload: DispenserFixOperationDto) {
    const operation = await this.operationService.findOne({
      where: {
        id: payload.operationId,
        status: In([OperationStatus.INTERRUPTED, OperationStatus.STOPPED]),
        type: OperationType.OUTCOME,
      },
      relations: {
        dispenser: true,
        tank: true,
      },
    });

    if (!operation?.dispenser?.addressId || !operation?.dispenser?.comId) {
      throw new BadRequestException(`На колонке не установлен адрес`);
    }

    const tankState = await this.tankRepository.findOne({
      where: { id: operation.tank.id },
    });

    await this.operationService.update(
      {
        where: { id: operation.id },
      },
      {
        status: OperationStatus.FINISHED,
        volumeAfter: tankState.volume,
      },
    );

    await this.dispenserService.update(
      {
        where: { id: operation.dispenser.id },
      },
      { currentCounter: operation.counterAfter },
    );
  }

  async drainFixation(operation: Operation): Promise<void> {
    try {
      const status: Array<any> = await this.callCommand({
        command: DispenserCommand.STATUS,
        addressId: operation.dispenser.addressId,
        comId: operation.dispenser.comId,
      });

      //Запись реально залитого количества
      let litresStatus: Array<any> = await this.callCommand({
        command: DispenserCommand.GET_CURRENT_STATUS,
        addressId: operation.dispenser.addressId,
        comId: operation.dispenser.comId,
      });

      const operationState = await this.operationService.findOne({
        where: {
          id: operation.id,
        },
        select: {
          factVolume: true,
          status: true,
          updatedAt: true,
        },
        loadEagerRelations: false,
      });

      const countLitres = DispenserHelper.getLitres(litresStatus);
      if (countLitres > 0 && operationState.factVolume < countLitres) {
        await this.operationService.update(
          {
            where: { id: operation.id },
          },
          {
            status: OperationStatus.PROGRESS,
            factVolume: countLitres,
            factWeight: countLitres * operation.tank.density,
          },
        );
      }

      //Если не обновляется больше минуты, то считаем что надо остановить
      const noUpdate =
        Math.floor(Date.now() / 1000) - operationState.updatedAt > 60 &&
        operationState.status === OperationStatus.PROGRESS;

      //ТРК выключена . Отпуск топлива закончен или РК установлен.
      if (
        status[2] == DispenserStatus.DONE ||
        status[2] == DispenserStatus.TRK_OFF_RK_ON ||
        noUpdate
      ) {
        await this.operationService.update(
          {
            where: { id: operation.id },
          },
          {
            status: OperationStatus.STOPPED,
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

        this.interactiveScheduleCronService.deleteCronJob(
          `operation_${operation.id}`,
        );
      }
    } catch (error) {
      this.logger.error(error);
      this.interactiveScheduleCronService.deleteCronJob(
        `operation_${operation.id}`,
      );
    }
  }

  async drainFuel(payload: DispenserGetFuelDto) {
    const baseFilter: FindOptionsWhere<Operation> = {
      status: Not(OperationStatus.FINISHED),
      type: In([OperationType.OUTCOME, OperationType.INTERNAL]),
    };
    const operation = await this.operationService.findOne({
      where: {
        ...baseFilter,
        id: payload.operationId,
      },
      relations: {
        dispenser: true,
        tank: true,
        shift: true,
      },
    });

    if (!operation?.dispenser?.addressId || !operation?.dispenser?.comId) {
      throw new BadRequestException(`На колонке не установлен адрес`);
    }
    const addressId = operation.dispenser.addressId;

    const checkOperation = await this.operationService.findOneWithoutFail({
      where: {
        ...baseFilter,
        id: Not(operation.id),
        dispenser: {
          id: operation.dispenser.id,
        },
        shift: {
          id: operation.shift.id,
        },
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (
      checkOperation?.id &&
      checkOperation?.status !== OperationStatus.CREATED
    ) {
      throw new BadRequestException(
        `Нельзя начинать новую операцию, 
        предварительно необходимо завершить ТТН ${operation.numberTTN}`,
      );
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

    const tankState = await this.tankRepository.findOne({
      where: { id: operation.tank.id },
    });

    if (operation.status === OperationStatus.CREATED) {
      await this.callCommand({
        command: DispenserCommand.FLUSH,
        addressId: addressId,
        comId: operation.dispenser.comId,
      });

      await this.callCommand({
        command: DispenserCommand.STATUS,
        addressId: addressId,
        comId: operation.dispenser.comId,
      });

      await this.callCommand({
        command: DispenserCommand.SET_PRICE,
        addressId: addressId,
        data: Buffer.from(`0100`),
        comId: operation.dispenser.comId,
      });

      let litres = payload.litres.toString().split('');
      for (let i = litres.length; i < 5; i++) {
        litres.unshift(`0`);
      }
      await this.callCommand({
        command: DispenserCommand.SET_LITRES,
        addressId: addressId,
        data: Buffer.from(litres.join('')),
        comId: operation.dispenser.comId,
      });

      await this.callCommand({
        command: DispenserCommand.INIT,
        addressId: addressId,
        comId: operation.dispenser.comId,
      });

      let summaryStatus: Array<any> = await this.callCommand({
        command: DispenserCommand.GET_SUMMARY_STATE,
        addressId: addressId,
        comId: operation.dispenser.comId,
      });
      const summaryLitres = DispenserHelper.getSummaryLitres(summaryStatus);

      await this.operationService.update(
        {
          where: { id: operation.id },
        },
        {
          startedAt: Math.floor(Date.now() / 1000),
          status: OperationStatus.STARTED,
          counterBefore: summaryLitres,
          volumeBefore: tankState.volume,
          levelBefore: tankState.level,
        },
      );
    }

    await this.addOperationToCron(operation);

    return new Promise((resolve) => {
      let intervalCheckCompileStatus = setInterval(async () => {
        const currentOperationState = await this.operationService.findOne({
          where: {
            id: operation.id,
          },
          select: {
            id: true,
            status: true,
          },
        });
        if (
          currentOperationState.status === OperationStatus.STOPPED ||
          currentOperationState.status === OperationStatus.FINISHED
        ) {
          clearInterval(intervalCheckCompileStatus);
          resolve('');
        }
      }, 1000);
    });
  }

  async callCommandExt(payload: DispenserCommandDtoExt) {
    if (!payload?.dispenserId && !payload.dispenserNumber) {
      throw new BadRequestException(`Не выбрана колонка`);
    }
    const dispenser = await this.dispenserRepository.findOneOrFail({
      where: [
        { id: payload.dispenserId },
        { sortIndex: payload.dispenserNumber },
      ],
    });

    return this.callCommand({
      command: payload.command,
      data: payload.data,
      addressId: dispenser.addressId,
      comId: dispenser.comId,
    });
  }

  async callCommand(payload: DispenserCommandDto) {
    if (!this.serialPortList[payload.comId]) {
      throw new BadRequestException(`COM порт не обнаружен`);
    }

    const dispenser = DeviceDispenser.getInstance(
      this.serialPortList[payload.comId],
    );

    const commandResult = await dispenser.callCommand(
      payload.addressId,
      payload.command,
      payload.data,
    );

    if (payload.command === DispenserCommand.STATUS) {
      const statusNumber = parseInt(commandResult[2], 10);
      if (DispenserStatus[statusNumber]) {
        await this.dispenserService.update(
          {
            where: {
              comId: payload.comId,
              addressId: payload.addressId,
            },
          },
          {
            statusId: statusNumber,
          },
        );
      }
    }

    return commandResult;
  }

  async start() {
    if (!!this.serialPortList) {
      const ports = Object.keys(this.serialPortList);
      if (ports.length > 0) {
        ports.forEach((portNumber) => {
          const serialPort: SerialPort = this.serialPortList[portNumber];
          if (!serialPort.isOpen) {
            serialPort.open((data) => {
              logDispensers(
                `Попытка инициализации ${portNumber}`,
                LogDirection.OUT,
              );
              if (data instanceof Error) {
                this.logger.error(data);
                this.blockDispenser(data, {
                  comId: parseInt(portNumber),
                });
              } else {
                this.operationService
                  .find({
                    where: {
                      status: Not(
                        In([
                          OperationStatus.FINISHED,
                          OperationStatus.STOPPED,
                          OperationStatus.CREATED,
                        ]),
                      ),
                      type: In([OperationType.OUTCOME, OperationType.INTERNAL]),
                      dispenser: {
                        comId: parseInt(portNumber),
                      },
                      createdAt: MoreThan(Math.floor(Date.now() / 1000) - 3600),
                    },
                    relations: {
                      dispenser: true,
                      tank: true,
                      shift: true,
                    },
                  })
                  .then((operations) => {
                    for (const operation of operations) {
                      this.addOperationToCron(operation);
                    }
                  });
                this.unblockDispenser({
                  comId: parseInt(portNumber),
                });
              }
            });
          }
        });
      }
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

  async updateDispenserStatuses() {
    const dispensers = await this.dispenserRepository.find({
      where: {
        isBlocked: false,
        addressId: Not(IsNull()),
        comId: Not(IsNull()),
      },
    });
    for (const dispenser of dispensers) {
      await this.callCommand({
        addressId: dispenser.addressId,
        comId: dispenser.comId,
        command: DispenserCommand.STATUS,
      });
    }
  }

  async updateDispenserSummary() {
    const dispensers = await this.dispenserRepository.find({
      where: {
        isBlocked: false,
        addressId: Not(IsNull()),
        comId: Not(IsNull()),
      },
    });
    for (const dispenser of dispensers) {
      let summaryStatus: Array<any> = await this.callCommand({
        addressId: dispenser.addressId,
        comId: dispenser.comId,
        command: DispenserCommand.GET_SUMMARY_STATE,
      });
      const summaryLitres = DispenserHelper.getSummaryLitres(summaryStatus);
      await this.dispenserRepository.update(
        {
          id: dispenser.id,
        },
        { currentCounter: summaryLitres },
      );
    }
  }

  private async addOperationToCron(operation: Operation) {
    if (operation.status === OperationStatus.FINISHED) {
      return;
    }
    await this.interactiveScheduleCronService.upsertCronJob(
      `operation_${operation.id}`,
      CronExpression.EVERY_5_SECONDS,
      () => {
        this.drainFixation(operation);
      },
    );
  }
}
