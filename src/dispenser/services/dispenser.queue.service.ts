import { CommonService } from '../../common/services/common.service';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DispenserQueue } from '../entities/dispenser.queue.entity';
import { GetQueStateDto } from '../dto';
import { Dispenser } from '../entities/dispenser.entity';
import { DispenserService } from './dispenser.service';
import {
  DispenserRVCondition,
  DispenserRVStatus,
} from '../../devices/enums/dispenser.rv.enum';
import { DispenserStatus } from '../../devices/enums/dispenser.enum';
import { DispenserRvResponseDto } from '../../devices/dto/dispenser.rv.response.dto';
import { Operation } from '../../operations/entities/operation.entity';
import { OperationStatus, OperationType } from '../../operations/enums';
import CyrillicToTranslit from 'cyrillic-to-translit-js';
import { DispenserRvSimpleResponseDto } from '../../devices/dto/dispenser.rv.simple.response.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class DispenserQueueService extends CommonService<DispenserQueue> {
  constructor(
    @InjectRepository(DispenserQueue)
    private dispenserQueueRepository: Repository<DispenserQueue>,
    private readonly dispenserService: DispenserService,
    @InjectRepository(Operation)
    private operationRepository: Repository<Operation>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    protected readonly logger: LoggerService,
  ) {
    super();
  }

  getRepository(): Repository<DispenserQueue> {
    return this.dispenserQueueRepository;
  }

  async checkState(
    payload: GetQueStateDto,
  ): Promise<DispenserRvResponseDto | DispenserRvSimpleResponseDto | Object> {
    let result: Object = {
      idTrk: payload.idTrk,
      status: DispenserRVCondition.WAITING,
      idOp: 0,
      doseRef: 0,
      fuelName: '',
      fuelNameRu: '',
      tankNum: 0,
    };

    try {
      const dispenser = await this.dispenserService.getRepository().findOne({
        where: {
          id: payload.idTrk,
        },
      });

      if (dispenser.statusId === DispenserStatus.TRK_OFF_RK_OFF) {
        return {
          ...result,
          status: DispenserRVCondition.CLEAR_ERROR,
        };
      } else if (dispenser.statusId === DispenserStatus.MANUAL_MODE) {
        return {
          ...result,
          status: DispenserRVCondition.MANUAL_STOP,
        };
      }

      const operation = await this.operationRepository.findOne({
        where: {
          type: In([OperationType.OUTCOME, OperationType.INTERNAL]),
          dispenser: {
            id: payload.idTrk,
          },
          status: In([OperationStatus.STARTED, OperationStatus.PROGRESS]),
        },
        order: {
          id: 'asc',
        },
      });

      let dispenserData: Partial<Dispenser> = {};
      if (payload.state === DispenserRVStatus.ERROR) {
        dispenserData = {
          error: payload?.error ? payload.error : `Произошла ошибка`,
          statusId: DispenserStatus.TRK_OFF_RK_OFF,
        };
        if (operation?.id) {
          await this.operationRepository.update(
            {
              id: operation.id,
            },
            {
              id: operation.id,
              status: OperationStatus.INTERRUPTED,
              dispenserError: true,
              factVolume: payload.doseIssCurr,
            },
          );
        }
      } else if (payload.state === DispenserRVStatus.DONE) {
        dispenserData = {
          error: ``,
          statusId: DispenserStatus.DONE,
          currentCounter: dispenser.currentCounter + payload.doseIssCurr,
        };
        if (operation?.id) {
          await this.operationRepository.update(
            {
              id: operation.id,
            },
            {
              id: operation.id,
              status: OperationStatus.STOPPED,
              dispenserError: false,
              factVolume: payload.doseIssCurr,
            },
          );
        }
      } else if (payload.state === DispenserRVStatus.TRK_OFF_RK_ON) {
        dispenserData = {
          error: ``,
          statusId: DispenserStatus.TRK_OFF_RK_ON,
        };
      } else if (payload.state === DispenserRVStatus.PROCESS) {
        dispenserData = {
          error: ``,
          statusId: DispenserStatus.PROCESS,
        };

        if (operation?.id) {
          await this.operationRepository.update(
            {
              id: operation.id,
            },
            {
              id: operation.id,
              status: OperationStatus.PROGRESS,
              dispenserError: false,
              factVolume: payload.doseIssCurr,
            },
          );
        }
      } else if (payload.state === DispenserRVStatus.INITIALIZE) {
        dispenserData = {
          error: ``,
          statusId: DispenserStatus.INITIALIZE,
        };
      }

      if (dispenser?.id) {
        await this.dispenserService.update(
          {
            where: {
              id: dispenser.id,
            },
          },
          dispenserData,
        );
      }

      if (operation?.id) {
        result = {
          ...result,
          status: DispenserRVCondition.OPERATION_PROGRESS,
          idOp: `1`,
          doseRef: operation.docVolume,
          fuelNameRu: operation.fuel.name,
          fuelName: CyrillicToTranslit().transform(operation.fuel.name),
          tankNum: operation.tank?.addressId ?? operation.tank.id,
        };
      }
    } catch (e) {
      result = {
        status: DispenserRVCondition.WAITING,
      };
      this.logger.error(e);
      return result;
    }

    if (
      payload.state === DispenserRVStatus.PROCESS ||
      payload.state === DispenserRVStatus.DONE
    ) {
      result = {
        status: DispenserRVCondition.OPERATION_PROGRESS,
      };
    }

    return result;
  }
}
