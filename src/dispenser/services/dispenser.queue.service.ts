import { CommonService } from '../../common/services/common.service';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { In, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DispenserQueue } from '../entities/dispenser.queue.entity';
import { GetQueStateDto } from '../dto';
import { Dispenser } from '../entities/dispenser.entity';
import { DispenserService } from './dispenser.service';
import { DispenserRVStatus } from '../../devices/enums/dispenser.rv.enum';
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
    let state = 1;
    let result = {};

    try {
      const dispenser = await this.dispenserService.getRepository().findOne({
        where: {
          id: payload.idTrk,
        },
      });

      const queueItem = await this.dispenserQueueRepository.findOne({
        where: {
          dispenser: {
            id: payload.idTrk,
          },
        },
        relations: {
          fuel: true,
          tank: true,
          user: true,
        },
      });

      const operation = await this.operationRepository.findOne({
        where: {
          type: In([OperationType.OUTCOME, OperationType.INTERNAL]),
          dispenser: {
            id: payload.idTrk,
          },
          status: Not(OperationStatus.FINISHED),
        },
        relations: {
          dispenser: true,
        },
        loadEagerRelations: false,
        order: {
          id: 'desc',
        },
      });

      let dispenserData: Partial<Dispenser> = {};
      if (payload.state === DispenserRVStatus.ERROR) {
        dispenserData = {
          error: payload?.error ? payload.error : `Произошла ошибка`,
        };
        if (operation?.id) {
          await this.operationRepository.update(
            {
              id: operation.id,
            },
            {
              status: OperationStatus.INTERRUPTED,
              dispenserError: true,
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
        //Если пролив начался то считаем что все ок и удаляем ожидание
        if (queueItem?.id) {
          await this.dispenserQueueRepository.delete({
            id: queueItem.id,
          });
        }

        if (operation?.id) {
          await this.operationRepository.update(
            {
              id: operation.id,
            },
            {
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

      result = {
        idTrk: payload.idTrk,
        status: Number(!!queueItem),
        idOp: 0,
        doseRef: 0,
        fuelName: '',
        fuelNameRu: '',
        tankNum: 0,
      };

      if (queueItem?.id) {
        result = {
          ...result,
          idOp: queueItem.user.cardId ?? queueItem.user.id.toString(),
          doseRef: queueItem.dose,
          fuelNameRu: queueItem.fuel.name,
          fuelName: CyrillicToTranslit().transform(queueItem.fuel.name),
          tankNum: queueItem.tank.addressId,
        };
      }
    } catch (e) {
      state = 0;
      this.logger.error(e);
    }

    if (
      payload.state === DispenserRVStatus.PROCESS ||
      payload.state === DispenserRVStatus.DONE
    ) {
      result = {
        status: state,
      };
    }

    return result;
  }
}
