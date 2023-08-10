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
import { DeviceDispenser } from '../classes/device.dispenser';
import { DispenserCommand } from '../enums/dispenser.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Dispenser } from '../../dispenser/entities/dispenser.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Operation } from '../../operations/entities/operation.entity';
import { DispenserGetFuelDto } from '../dto/dispenser.get.fuel.dto';
import { OperationStatus, OperationType } from '../../operations/enums';
import { Tank } from '../../tank/entities/tank.entity';
import { DispenserCommandDto } from '../dto/dispenser.command.dto';

@Injectable()
export class DeviceDispenserService implements OnModuleDestroy {
  private readonly serialPortList: Record<number, SerialPort> = {};

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
    this.dispenserRepository
      .createQueryBuilder(`dispenser`)
      .addSelect(`comId`)
      .groupBy(`comId`)
      .getMany()
      .then((result) => {
        result.forEach((dispenser) => {
          if (dispenser.comId > 0 && !this.serialPortList[dispenser.comId]) {
            this.serialPortList[dispenser.comId] = new SerialPort({
              path: `COM${dispenser.comId}`,
              baudRate: 4800,
              dataBits: 7,
              parity: 'even',
              stopBits: 2,
              autoOpen: false,
            });
          }
        });
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

    let litres = payload.litres.toString().split('');
    for (let i = litres.length; i < 5; i++) {
      litres.unshift(`0`);
    }

    await this.callCommand({
      command: DispenserCommand.SET_PRICE,
      addressId: addressId,
      data: Buffer.from([0, 1, 0, 0]),
      comId: operation.dispenser.comId,
    });

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

    await this.callCommand({
      command: DispenserCommand.START_DROP,
      addressId: addressId,
      comId: operation.dispenser.comId,
    });

    await this.operationRepository.update(
      {
        id: operation.id,
      },
      {
        startedAt: Math.floor(Date.now() / 1000),
        status: OperationStatus.STARTED,
      },
    );

    return new Promise((resolve) => {
      let intervalCheckCompileStatus = setInterval(async () => {
        const status: Array<any> = await this.callCommand({
          command: DispenserCommand.STATUS,
          addressId: addressId,
          comId: operation.dispenser.comId,
        });
        //Запись реально залитого количества
        let responseStatus: Array<any> = await this.callCommand({
          command: DispenserCommand.GET_CURRENT_STATUS,
          addressId: addressId,
          comId: operation.dispenser.comId,
        });
        const litresPacket = Buffer.from(responseStatus)
          .slice(4, 13)
          .filter((e, index) => index % 2 == 0);
        const countLitres = parseInt(litresPacket.toString());
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
          await this.callCommand({
            command: DispenserCommand.APPROVE_LITRES,
            addressId: addressId,
            comId: operation.dispenser.comId,
          });
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

  async callCommand(payload: DispenserCommandDto) {
    if (!this.serialPortList[payload.comId]) {
      throw new BadRequestException(`COM порт не обнаружен`);
    }
    const dispenser = DeviceDispenser.getInstance(
      this.serialPortList[payload.comId],
    );
    return dispenser.callCommand(
      payload.addressId,
      payload.command,
      payload.data,
    );
  }

  async start() {
    if (!!this.serialPortList) {
      const ports = Object.keys(this.serialPortList);
      if (ports.length > 0) {
        ports.forEach((portNumber) => {
          const serialPort: SerialPort = this.serialPortList[portNumber];
          if (!serialPort.isOpen) {
            const portNumber = parseInt(serialPort.path.substr(3));
            serialPort.open((data) => {
              if (data instanceof Error) {
                this.logger.error(data);
                this.blockDispenser(data, {
                  comId: portNumber,
                });
              } else {
                this.unblockDispenser({
                  comId: portNumber,
                });
              }
            });
          }
        });
      }
    }
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
