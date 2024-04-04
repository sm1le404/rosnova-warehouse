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
import { In, Not, Repository } from 'typeorm';
import { Operation } from '../../operations/entities/operation.entity';
import { DispenserGetFuelDto } from '../dto/dispenser.get.fuel.dto';
import { OperationStatus, OperationType } from '../../operations/enums';
import { Tank } from '../../tank/entities/tank.entity';
import { DispenserFixOperationDto } from '../dto/dispenser.fix.operation.dto';
import { DeviceTankService } from './device.tank.service';

@Injectable()
export class DeviceTestService {
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
  ) {}

  async drainFuelTest(payload: DispenserGetFuelDto) {
    const operation = await this.operationRepository.findOneOrFail({
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
            id: operation.id,
            status: OperationStatus.PROGRESS,
            factVolume: counter,
            factWeight: counter * operation.tank.density,
            counterAfter: dispenser.currentCounter + counter,
          },
        );
        if (counter === payload.litres) {
          await this.operationRepository.update(
            {
              id: operation.id,
            },
            {
              id: operation.id,
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

  async doneOperationTest(payload: DispenserFixOperationDto) {
    const operation = await this.operationRepository.findOneOrFail({
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

    if (!operation?.dispenser?.addressId) {
      throw new BadRequestException(`На колонке не установлен адрес`);
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
        volumeAfter: tankState.volume,
      },
    );

    await this.dispenserRepository.update(
      {
        id: operation.dispenser.id,
      },
      { currentCounter: operation.counterAfter },
    );
  }
}
