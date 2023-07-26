import { CommonService } from '../../common/services/common.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TankHistory } from '../entities/tank-history.entity';
import { paginate } from 'nestjs-paginate';
import {
  PaginationTankHistory,
  PaginationTankHistoryParams,
} from '../classes/pagination-tank-history.params';
import { ResponseTankHistoryDto } from '../dto';

@Injectable()
export class TankHistoryService extends CommonService<TankHistory> {
  constructor(
    @InjectRepository(TankHistory)
    private tankHistoryRepository: Repository<TankHistory>,
  ) {
    super();
  }

  getRepository(): Repository<TankHistory> {
    return this.tankHistoryRepository;
  }

  async findPagination(
    paginationPayload: PaginationTankHistory,
  ): Promise<ResponseTankHistoryDto> {
    return paginate(paginationPayload, this.tankHistoryRepository, {
      sortableColumns: PaginationTankHistoryParams.sortableColumns,
      searchableColumns: PaginationTankHistoryParams.searchableColumns,
      relations: PaginationTankHistoryParams.relationList,
      filterableColumns: PaginationTankHistoryParams.filterableColumns,
      defaultSortBy: PaginationTankHistoryParams.defaultSortBy,
      maxLimit: PaginationTankHistoryParams.maxLimit,
    });
  }
}
