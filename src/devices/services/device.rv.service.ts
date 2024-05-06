import {
  BadRequestException,
  Inject,
  Injectable,
  LoggerService,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { InjectRepository } from '@nestjs/typeorm';
import { Dispenser } from '../../dispenser/entities/dispenser.entity';
import { FindOptionsWhere, In, Not, Repository } from 'typeorm';
import { Operation } from '../../operations/entities/operation.entity';
import { DispenserGetFuelDto } from '../dto/dispenser.get.fuel.dto';
import { Tank } from '../../tank/entities/tank.entity';
import { DispenserFixOperationDto } from '../dto/dispenser.fix.operation.dto';
import { DeviceTankService } from './device.tank.service';
import { AbstractDispenser } from '../classes/abstract.dispenser';
import { DispenserCommandInterface } from '../dto/dispenser.command.interface';

import {
  OperationEvent,
  OperationStatus,
  OperationType,
} from '../../operations/enums';
import { TankOperationStateEvent } from '../../operations/events/tank-operation-state.event';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class DeviceRvService extends AbstractDispenser {
  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    protected readonly logger: LoggerService,
    private readonly deviceTankService: DeviceTankService,
    @InjectRepository(Dispenser)
    private readonly dispenserRepository: Repository<Dispenser>,
    @InjectRepository(Operation)
    private readonly operationRepository: Repository<Operation>,
    @InjectRepository(Tank)
    private readonly tankRepository: Repository<Tank>,
    private eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async initPorts() {
    //nothing
  }

  async closePorts() {
    //nothing
  }

  async doneOperation(payload: DispenserFixOperationDto) {
    const operation = await this.operationRepository.findOneOrFail({
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

    if (operation?.tank?.addressId) {
      await this.deviceTankService.readCommand(operation.tank.addressId);
    }

    const tankState = await this.tankRepository.findOne({
      where: { id: operation.tank.id },
    });

    await this.operationRepository.update(
      {
        id: operation.id,
      },
      {
        id: operation.id,
        status: OperationStatus.FINISHED,
        finishedAt: Math.floor(Date.now() / 1000),
        counterAfter: operation.dispenser.currentCounter,
        volumeAfter: tankState.volume,
        levelAfter: tankState.level,
        factVolume: operation.factVolume,
        factWeight: operation.factVolume * operation.tank.density,
      },
    );

    this.eventEmitter.emit(
      OperationEvent.FINISH,
      new TankOperationStateEvent(
        operation.tank.id,
        operation.type,
        operation.factVolume,
        operation.factVolume * operation.tank.density,
      ),
    );
  }

  async drainFuel(payload: DispenserGetFuelDto): Promise<void> {
    const baseFilter: FindOptionsWhere<Operation> = {
      status: Not(OperationStatus.FINISHED),
      type: In([OperationType.OUTCOME, OperationType.INTERNAL]),
    };
    const operation = await this.operationRepository.findOneOrFail({
      where: {
        ...baseFilter,
        id: payload.operationId,
      },
      relations: {
        dispenser: true,
        tank: true,
        shift: true,
        fuel: true,
      },
    });
    if (!operation?.dispenser?.addressId) {
      throw new BadRequestException(`На колонке не установлен адрес`);
    }

    const checkOperation = await this.operationRepository.findOne({
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

    const tankState = await this.tankRepository.findOne({
      where: { id: operation.tank.id },
    });

    await this.operationRepository.update(
      {
        id: operation.id,
      },
      {
        id: operation.id,
        startedAt: Math.floor(Date.now() / 1000),
        status: OperationStatus.STARTED,
        counterBefore: operation.dispenser.currentCounter,
        volumeBefore: tankState.volume,
        levelBefore: tankState.level,
      },
    );

    return new Promise((resolve) => {
      let intervalCheckCompileStatus = setInterval(async () => {
        const currentOperationState = await this.operationRepository.findOne({
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
          resolve();
        }
      }, 1000);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async callCommand(payload: DispenserCommandInterface) {
    //nothing
  }

  async start() {
    //nothing
  }

  async updateDispenserStatuses() {
    //nothing
  }

  async updateDispenserSummary() {
    //nothing
  }
}
