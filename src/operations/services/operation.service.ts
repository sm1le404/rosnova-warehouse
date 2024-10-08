import { CommonService } from '../../common/services/common.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DeepPartial, FindOneOptions, In, LessThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Operation } from '../entities/operation.entity';
import {
  PaginationOperation,
  PaginationOperationParams,
} from '../classes/pagination-operation.params';
import { ResponseOperationDto } from '../dto';
import { paginate } from 'nestjs-paginate';
import { TankService } from '../../tank/services/tank.service';
import { OperationStatus, OperationType } from '../enums';

@Injectable()
export class OperationService extends CommonService<Operation> {
  constructor(
    @InjectRepository(Operation)
    private operationRepository: Repository<Operation>,
    private readonly tankService: TankService,
  ) {
    super();
  }

  getRepository(): Repository<Operation> {
    return this.operationRepository;
  }

  async create(createCommonEntity: DeepPartial<Operation>): Promise<Operation> {
    const common = this.getRepository().create(createCommonEntity);
    if (createCommonEntity.tank.id === createCommonEntity?.sourceTank?.id) {
      throw new BadRequestException('Выбран одинаковый резервуар');
    }
    return this.getRepository().save(common);
  }

  async findOne(payload: FindOneOptions<Operation>): Promise<Operation> {
    return this.getRepository().findOneOrFail({
      relations: PaginationOperationParams.relationList,
      ...payload,
    });
  }

  async updateRoot(
    filter: FindOneOptions<Operation>,
    updateCommon: DeepPartial<Operation>,
  ): Promise<Operation> {
    if (!updateCommon.comment) {
      throw new BadRequestException(
        'Необходим комментарий длиной не менее 20 символов',
      );
    }

    return this.update(filter, updateCommon);
  }

  async update(
    filter: FindOneOptions<Operation>,
    updateCommon: DeepPartial<Operation>,
  ): Promise<Operation> {
    const common = await this.findOne(filter);

    if (
      common.type !== OperationType.OUTCOME &&
      common?.tank?.id > 0 &&
      updateCommon.status === OperationStatus.STARTED
    ) {
      const tankState = await this.tankService.findOne({
        where: { id: common.tank.id },
      });
      updateCommon.volumeBefore = tankState.volume;
      updateCommon.levelBefore = tankState.level;
    }

    if (!updateCommon?.docWeight) {
      updateCommon.docWeight = common.docWeight;
    }

    if (!updateCommon?.docVolume) {
      updateCommon.docVolume = common.docVolume;
    }

    Object.assign(common, updateCommon);

    if (
      common.type !== OperationType.OUTCOME &&
      updateCommon?.status === OperationStatus.FINISHED
    ) {
      const tankState = await this.tankService.findOne({
        where: { id: common.tank.id },
      });
      updateCommon.volumeAfter = tankState.volume;
      updateCommon.levelAfter = tankState.level;
    }

    const updateResult = await this.getRepository().save(common);

    if (updateResult?.id && updateCommon?.status === OperationStatus.FINISHED) {
      await this.changeTankState(
        common.tank.id,
        common.type,
        updateCommon.docVolume != common.docVolume
          ? [OperationType.INTERNAL, OperationType.OUTCOME].includes(
              common.type,
            )
            ? updateCommon.docVolume - common.docVolume
            : common.docVolume - updateCommon.docVolume
          : common.docVolume,
        updateCommon.docWeight != common.docWeight
          ? [OperationType.INTERNAL, OperationType.OUTCOME].includes(
              common.type,
            )
            ? updateCommon.docWeight - common.docWeight
            : common.docWeight - updateCommon.docWeight
          : common.docWeight,
      );

      if (common.type === OperationType.MIXED) {
        await this.changeTankState(
          common.sourceTank.id,
          common.type,
          updateCommon.docVolume != common.docVolume
            ? common.docVolume - updateCommon.docVolume
            : -common.docVolume,
          updateCommon.docWeight != common.docWeight
            ? common.docWeight - updateCommon.docWeight
            : -common.docWeight,
        );
      }
    }
    return updateResult;
  }

  async deleteRoot(
    filter: FindOneOptions<Operation>,
    comment: string,
  ): Promise<Operation> {
    const common = await this.findOne(filter);

    await this.getRepository().save({ ...common, comment });

    return this.commonDelete(common);
  }

  async delete(filter: FindOneOptions<Operation>): Promise<Operation> {
    const common = await this.findOne(filter);
    return this.commonDelete(common);
  }

  private async commonDelete(common: Operation): Promise<Operation> {
    const removeResult = await this.getRepository().softRemove(common);

    if (common?.id && common?.status === OperationStatus.FINISHED) {
      await this.changeTankState(
        common.tank.id,
        common.type,
        -common.docVolume,
        -common.docWeight,
      );

      if (common?.type === OperationType.MIXED) {
        await this.changeTankState(
          common.sourceTank.id,
          common.type,
          common.docVolume,
          common.docWeight,
        );
      }
    }

    return removeResult;
  }

  async findPagination(
    paginationPayload: PaginationOperation,
  ): Promise<ResponseOperationDto> {
    return paginate(paginationPayload, this.getRepository(), {
      sortableColumns: PaginationOperationParams.sortableColumns,
      searchableColumns: PaginationOperationParams.searchableColumns,
      relations: PaginationOperationParams.relationList,
      filterableColumns: PaginationOperationParams.filterableColumns,
      defaultSortBy: PaginationOperationParams.defaultSortBy,
      maxLimit: PaginationOperationParams.maxLimit,
    });
  }

  async changeTankState(
    tankId: number,
    operationType: OperationType,
    operationVolume: number,
    operationWeight: number,
  ) {
    const tankState = await this.tankService.findOne({
      where: { id: tankId },
    });
    let currentVolume =
      tankState.docVolume > 0 ? tankState.docVolume : tankState.volume;
    let currentWeight =
      tankState.docWeight > 0 ? tankState.docWeight : tankState.weight;

    //Проверяем что надо фиксировать, если был сброс, значит смена только началась
    if (tankState.docVolume != 0) {
      switch (operationType) {
        case OperationType.INTERNAL:
        case OperationType.OUTCOME:
          currentVolume = currentVolume - operationVolume;
          currentWeight = currentWeight - operationWeight;
          break;
        case OperationType.RETURN:
        case OperationType.SUPPLY:
        case OperationType.MIXED:
          currentVolume = currentVolume + operationVolume;
          currentWeight = currentWeight + operationWeight;
          break;
      }
    }

    await this.tankService.update(
      {
        where: {
          id: tankId,
        },
      },
      {
        docVolume: currentVolume,
        docWeight: currentWeight,
      },
    );
  }

  async fixProgressOperations(waitMinutes: number = 10) {
    const date = Date.now() / 1000 - waitMinutes * 60;
    const operations = await this.operationRepository.find({
      where: {
        status: OperationStatus.PROGRESS,
        updatedAt: LessThan(date),
        type: In([
          OperationType.SUPPLY,
          OperationType.MIXED,
          OperationType.RETURN,
        ]),
      },
    });
    if (operations.length) {
      for (const operation of operations) {
        await this.update(
          {
            where: {
              id: operation.id,
            },
          },
          {
            status: OperationStatus.STOPPED,
          },
        );
      }
    }
  }
}
