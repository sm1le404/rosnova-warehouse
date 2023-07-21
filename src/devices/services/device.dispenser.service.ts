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
import { Repository } from 'typeorm';
import { Operation } from '../../operations/entities/operation.entity';
import { DispenserGetFuelDto } from '../dto/dispenser.get.fuel.dto';
import { OperationStatus, OperationType } from '../../operations/enums';
import { Tank } from '../../tank/entities/tank.entity';

@Injectable()
export class DeviceDispenserService implements OnModuleDestroy {
  private readonly serialPort: SerialPort;

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    protected readonly logger: LoggerService,
    @InjectRepository(Dispenser)
    private readonly dispenserRepository: Repository<Dispenser>,
    @InjectRepository(Dispenser)
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
    this.serialPort.on('error', (data) => {
      if (data instanceof Error) {
        this.logger.error(data);
      }
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
      command: DispenserCommand.STATUS,
      addressId: addressId,
    });
    let litres = payload.litres.toString().split('');
    for (let i = litres.length; i < 5; i++) {
      litres.unshift(`0`);
    }
    await this.callCommand({
      command: DispenserCommand.SET_LITRES,
      addressId: addressId,
      data: Buffer.from(litres.join('')),
    });
    await this.callCommand({
      command: DispenserCommand.INIT,
      addressId: addressId,
    });

    const interval = setInterval(async () => {
      const status = await this.callCommand({
        command: DispenserCommand.STATUS,
        addressId: addressId,
      });
      //Запись реально залитого количества
      const responseStatus: any = await this.callCommand({
        command: DispenserCommand.GET_CURRENT_FULL_STATUS,
        addressId: addressId,
      });
      const litresPacket = responseStatus
        .slice(2, 11)
        .filter((e, index) => index % 2 == 0);
      const countLitres = parseInt(litresPacket.toString('utf8'));
      await this.operationRepository.update(
        {
          id: operation.id,
        },
        {
          status: OperationStatus.PROGRESS,
          factVolume: countLitres,
        },
      );
      //Фактически операция завершилась
      if (status[2] == 0x34 && status[4] == 0x30) {
        await this.callCommand({
          command: DispenserCommand.ASK_LITRES,
          addressId: addressId,
        });
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
        clearInterval(interval);
      } else if (status[2] == 0x31) {
        await this.operationRepository.update(
          {
            id: operation.id,
          },
          {
            status: OperationStatus.INTERRUPTED,
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
      }
    }, 1000);
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
        }
      });
    }
  }

  onModuleDestroy(): any {
    if (this.serialPort.isOpen) {
      this.serialPort.close();
    }
  }
}
