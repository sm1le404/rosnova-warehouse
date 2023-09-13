import { CommonService } from '../../common/services/common.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DeepPartial, FindOneOptions, LessThan, Repository } from 'typeorm';
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
    if (
      createCommonEntity.type !== OperationType.OUTCOME &&
      createCommonEntity?.tank?.id > 0
    ) {
      const tankState = await this.tankService.findOne({
        where: { id: createCommonEntity.tank.id },
      });
      createCommonEntity.volumeBefore = tankState.volume;
      createCommonEntity.levelBefore = tankState.level;
    }
    const common = this.getRepository().create(createCommonEntity);
    return this.getRepository().save(common);
  }

  async update(
    filter: FindOneOptions<Operation>,
    updateCommon: DeepPartial<Operation>,
  ): Promise<Operation> {
    const common = await this.findOne(filter);
    if (common.status === OperationStatus.FINISHED) {
      throw new BadRequestException(
        `Нельзя перевести операцию в другой статус`,
      );
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
          ? common.docVolume - updateCommon.docVolume
          : common.docVolume,
        updateCommon.docWeight != common.docWeight
          ? common.docWeight - updateCommon.docWeight
          : common.docWeight,
      );
    }
    return updateResult;
  }

  async delete(filter: FindOneOptions<Operation>): Promise<Operation> {
    const common = await this.findOne(filter);
    const removeResult = await this.getRepository().softRemove(common);
    if (removeResult?.id) {
      await this.changeTankState(
        common.tank.id,
        common.type,
        -common.docVolume,
        -common.docWeight,
      );
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

    switch (operationType) {
      case OperationType.INTERNAL:
      case OperationType.OUTCOME:
        currentVolume = currentVolume - operationVolume;
        currentWeight = currentWeight - operationWeight;
        break;
      case OperationType.RETURN:
      case OperationType.SUPPLY:
        currentVolume = currentVolume + operationVolume;
        currentWeight = currentWeight + operationWeight;
        break;
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

  async fixProgressOperations(waitMinutes: number = 30) {
    const date = Date.now() / 1000 - waitMinutes * 60;
    const operations = await this.operationRepository.find({
      where: {
        status: OperationStatus.PROGRESS,
        updatedAt: LessThan(date),
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
            status: OperationStatus.FINISHED,
          },
        );
      }
    }
  }
}
