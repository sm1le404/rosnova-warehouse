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
  DispenserRVErrors,
  DispenserRVStatus,
  DispenserRVWarnings,
  DispenserStatus,
} from '../../devices/enums';
import { DispenserRvResponseDto } from '../../devices/dto/dispenser.rv.response.dto';
import { Operation } from '../../operations/entities/operation.entity';
import { OperationStatus, OperationType } from '../../operations/enums';
import CyrillicToTranslit from 'cyrillic-to-translit-js';
import { DispenserRvSimpleResponseDto } from '../../devices/dto/dispenser.rv.simple.response.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { valueRound } from '../../report/utils';
import { RvErrorInterface } from '../interfaces';

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
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
      let dispenser = await this.dispenserService.getRepository().findOne({
        where: {
          addressId: payload.idTrk,
        },
      });
      if (!dispenser) {
        dispenser = await this.dispenserService.getRepository().findOne({
          where: {
            id: payload.idTrk,
          },
        });
      }

      let lastError: RvErrorInterface;

      const operation = await this.operationRepository.findOne({
        where: {
          type: In([OperationType.OUTCOME, OperationType.INTERNAL]),
          dispenser: {
            id: dispenser?.id,
          },
          status: In([OperationStatus.STARTED, OperationStatus.PROGRESS]),
        },
        order: {
          id: 'asc',
        },
      });

      if (operation?.id) {
        const tempErrorData: RvErrorInterface = await this.cacheManager.get(
          `operation_error_${operation.id}`,
        );

        if (tempErrorData) {
          lastError = tempErrorData;
        } else {
          lastError = {
            volume: 0,
            weight: 0,
            errorTime: 0,
          };
        }
      }

      let dispenserData: Partial<Dispenser> = {
        id: dispenser?.id,
      };

      let plMessageId = payload?.errReg ? payload.errReg : 0;

      let operationStatus: OperationStatus = OperationStatus.PROGRESS;

      if (payload.state === DispenserRVStatus.ERROR) {
        dispenserData = {
          error: payload?.error ? payload.error : `Произошла ошибка`,
          statusId: DispenserStatus.TRK_OFF_RK_OFF,
        };
        if (DispenserRVErrors[plMessageId]) {
          dispenserData.error = DispenserRVErrors[plMessageId];
        }
        operationStatus = OperationStatus.STOPPED;

        if (operation?.id) {
          // Ждем 60 секунд, думаем что это одна ошибка,
          // если прошло > 60 сек и объем не равен,
          // то записываем сумму, иначе берем последнее значение
          const realErrorVolume =
            Date.now() - lastError.errorTime > 60 * 1000 &&
            payload.doseIssCurr != lastError.volume
              ? payload.doseIssCurr + lastError.volume
              : payload.doseIssCurr;

          const realErrorWeight =
            Date.now() - lastError.errorTime > 60 * 1000 &&
            payload.mass != lastError.weight
              ? payload.mass + lastError.weight
              : payload.mass;

          lastError.volume = realErrorVolume;
          lastError.weight = realErrorWeight;
          lastError.errorTime = Date.now();

          await this.cacheManager.set(
            `operation_error_${operation.id}`,
            {
              ...lastError,
            },
            1000 * 86400,
          );
        }
      } else if (payload.state === DispenserRVStatus.DONE) {
        dispenserData = {
          error: ``,
          statusId: DispenserStatus.DONE,
          currentCounter: dispenser.currentCounter + operation.factVolume,
        };
        operationStatus = OperationStatus.STOPPED;
      } else if (payload.state === DispenserRVStatus.TRK_OFF_RK_ON) {
        dispenserData = {
          error: ``,
          statusId: DispenserStatus.TRK_OFF_RK_ON,
        };
        // Если у нас есть остановленная операция, значит до этого был сброс ошибки
        // Тогда переводим колонку в процесс, чтобы можно было продолжить операцию
        const stoppedOperation = await this.operationRepository.findOne({
          where: {
            type: In([OperationType.OUTCOME, OperationType.INTERNAL]),
            dispenser: {
              id: dispenser?.id,
            },
            status: OperationStatus.STOPPED,
          },
          order: {
            id: 'asc',
          },
        });
        if (stoppedOperation) {
          dispenserData.statusId = DispenserStatus.PROCESS;
        }
      } else if (payload.state === DispenserRVStatus.PROCESS) {
        dispenserData = {
          error: ``,
          statusId: DispenserStatus.PROCESS,
        };
      } else if (payload.state === DispenserRVStatus.INITIALIZE) {
        dispenserData = {
          error: ``,
          statusId: DispenserStatus.INITIALIZE,
        };
        operationStatus = OperationStatus.STARTED;
      }

      if (plMessageId && DispenserRVWarnings[plMessageId]) {
        dispenserData.error = DispenserRVWarnings[plMessageId];
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
        const doseRef =
          operation.docVolume - lastError.volume > 0
            ? operation.docVolume - lastError.volume
            : operation.docVolume;

        result = {
          ...result,
          idOp: `1`,
          status:
            payload.state === DispenserRVStatus.ERROR
              ? DispenserRVCondition.WAITING
              : DispenserRVCondition.OPERATION_PROGRESS,
          doseRef,
          fuelNameRu: operation.fuel.name,
          fuelName: CyrillicToTranslit().transform(operation.fuel.name),
          tankNum: operation.tank?.addressId ?? operation.tank.id,
        };

        await this.operationRepository.update(
          {
            id: operation.id,
          },
          {
            id: operation.id,
            status: operationStatus,
            dispenserError: !!dispenser?.error?.length,
            factVolume:
              valueRound(lastError.volume, 0) ==
              valueRound(payload.doseIssCurr, 0)
                ? payload.doseIssCurr
                : lastError.volume + payload.doseIssCurr,
            factWeight:
              valueRound(lastError.weight, 0) == valueRound(payload.mass, 0)
                ? payload.mass
                : lastError.weight + payload.mass,
            docDensity: payload.dens,
            docTemperature: payload.temp,
          },
        );
      }

      if (dispenser.statusId === DispenserStatus.MANUAL_MODE) {
        return {
          ...result,
          status: dispenser?.error?.length
            ? DispenserRVCondition.CLEAR_ERROR
            : DispenserRVCondition.MANUAL_STOP,
        };
      }
    } catch (e) {
      result = {
        ...result,
        status: DispenserRVCondition.WAITING,
      };
      this.logger.error(e);
    }

    return result;
  }
}
