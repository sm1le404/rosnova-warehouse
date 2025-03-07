import {
  BadRequestException,
  Inject,
  Injectable,
  LoggerService,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Operation } from '../../../operations/entities/operation.entity';
import { DispenserGetFuelDto } from '../../dto/dispenser.get.fuel.dto';
import { Tank } from '../../../tank/entities/tank.entity';
import { DispenserFixOperationDto } from '../../dto/dispenser.fix.operation.dto';
import { DeviceTankService } from '../tanks/device.tank.service';
import { AbstractDispenser } from '../../classes/abstract.dispenser';
import { DispenserCommandInterface } from '../../dto/dispenser.command.interface';

import {
  OperationEvent,
  OperationStatus,
  OperationType,
} from '../../../operations/enums';
import { TankOperationStateEvent } from '../../../operations/events/tank-operation-state.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Dispenser } from '../../../dispenser/entities/dispenser.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { DispenserCommand, DispenserStatus } from '../../enums';

@Injectable()
export class DeviceDemoService extends AbstractDispenser {
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
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

    await this.dispenserRepository.update(
      {
        id: operation.dispenser.id,
      },
      {
        id: operation.dispenser.id,
        isBlocked: false,
        statusId: DispenserStatus.TRK_OFF_RK_ON,
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
    const operation = await this.operationRepository.findOneOrFail({
      where: {
        id: payload.operationId,
        status: Not(In([OperationStatus.STOPPED, OperationStatus.FINISHED])),
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

    await this.operationRepository.update(
      {
        id: operation.id,
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
      {
        id: operation.dispenser.id,
        isBlocked: true,
        statusId: DispenserStatus.PROCESS,
      },
    );
    await this.tankRepository.update(
      {
        id: operation.tank.id,
      },
      { isBlocked: true },
    );

    let counter = 0;
    let step = 10;
    const ratio = Math.pow(payload.litres, 1 / 20);
    return new Promise((resolve) => {
      let intervalCheckCompileStatus = setInterval(async () => {
        step++;

        counter += Math.pow(ratio, step) - Math.pow(ratio, step - 1);

        await this.operationRepository.update(
          {
            id: operation.id,
          },
          {
            id: operation.id,
            status: OperationStatus.PROGRESS,
            factVolume: counter,
            factWeight: counter * operation.tank.density,
            counterAfter: dispenser.currentCounter + counter,
          },
        );
        if (counter >= payload.litres) {
          await this.operationRepository.update(
            {
              id: operation.id,
            },
            {
              id: operation.id,
              status: OperationStatus.STOPPED,
              factVolume: payload.litres,
              factWeight: payload.litres * operation.tank.density,
            },
          );
          await this.dispenserRepository.update(
            {
              id: operation.dispenser.id,
              currentCounter: dispenser.currentCounter + counter,
            },
            {
              id: operation.dispenser.id,
              statusId: DispenserStatus.DONE,
              isBlocked: false,
            },
          );
          await this.tankRepository.update(
            {
              id: operation.tank.id,
            },
            { isBlocked: false },
          );
          clearInterval(intervalCheckCompileStatus);
          resolve();
        }
      }, 1000);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async callCommand(payload: DispenserCommandInterface) {
    const dispenser = await this.dispenserRepository.findOneOrFail({
      where: payload.dispenser,
    });

    //Ответ приводим к топазовскому, чтобы не ловить вьетнамские флэшбеки
    const responseData = [0, dispenser.id];

    if (payload.command === DispenserCommand.FLUSH) {
      await this.dispenserRepository.update(
        {
          id: dispenser.id,
        },
        {
          id: dispenser.id,
          statusId: DispenserStatus.TRK_OFF_RK_ON,
        },
      );
      responseData.push(DispenserStatus.TRK_OFF_RK_ON);

      return responseData;
    }

    /**
     * По дефолту возвращаем текущее состояние
     */
    responseData.push(dispenser.statusId);

    return responseData;
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
