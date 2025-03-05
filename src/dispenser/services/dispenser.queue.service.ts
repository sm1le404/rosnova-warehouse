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
      const dispenser = await this.dispenserService.getRepository().findOne({
        where: {
          id: payload.idTrk,
        },
      });

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

      let dispenserData: Partial<Dispenser> = {
        id: dispenser.id,
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
          await this.cacheManager.set(
            `operation_volume_${operation.id}`,
            payload.doseIssCurr,
            1000 * 86400,
          );
          await this.cacheManager.set(
            `operation_weight_${operation.id}`,
            payload.mass,
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
              id: payload.idTrk,
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
        let lastErrorVolume: number =
          (await this.cacheManager.get(`operation_volume_${operation.id}`)) ??
          0;

        let lastErrorWeight: number =
          (await this.cacheManager.get(`operation_weight_${operation.id}`)) ??
          0;

        const doseRef =
          operation.docVolume - lastErrorVolume > 0
            ? operation.docVolume - lastErrorVolume
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
              valueRound(lastErrorVolume, 0) ==
              valueRound(payload.doseIssCurr, 0)
                ? payload.doseIssCurr
                : lastErrorVolume + payload.doseIssCurr,
            factWeight:
              valueRound(lastErrorWeight, 0) == valueRound(payload.mass, 0)
                ? payload.mass
                : lastErrorWeight + payload.mass,
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
